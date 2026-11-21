/**
 * CalcWeb Dedicated Web Worker: Pyodide + SymPy Symbolic Engine (100% Client-Side)
 * Runs Python/SymPy in a background thread without blocking the main UI thread.
 * Includes IndexedDB / Cache API caching hints and outputs structured step-by-step JSON:
 * [{ titulo_paso, explicacion, latex }, ...]
 */

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";
let pyodideReadyPromise = null;
let pyodideInstance = null;

// Python Step-by-Step Pedagogical Solvers using SymPy
const PYTHON_SOLVER_SCRIPT = `
import json
import re
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor
)

t, s, w, x, z, tau = sp.symbols('t s w x z tau', real=True)
n, k = sp.symbols('n k', integer=True)
lam = sp.Symbol('lambda')

class rect(sp.Function):
    """Pulso rectangular unitario rect(t) = 1 para |t| <= 1/2, 0 en otro caso."""
    nargs = 1

class sinc_fn(sp.Function):
    nargs = 1

def preprocess_expr_str(raw_str):
    s_clean = raw_str.strip()
    # Replace common engineering notation with SymPy equivalents
    s_clean = s_clean.replace('^', '**')
    s_clean = re.sub(r'\\\\pi\\b', 'pi', s_clean)
    s_clean = re.sub(r'\\\\omega\\b', 'w', s_clean)
    s_clean = re.sub(r'\\\\infty\\b', 'oo', s_clean)
    s_clean = re.sub(r'\\bu\\s*\\[([^\\]]+)\\]', r'Heaviside(\\1)', s_clean)
    s_clean = re.sub(r'\\bdelta\\s*\\[([^\\]]+)\\]', r'DiracDelta(\\1)', s_clean)
    s_clean = re.sub(r'\\\\delta\\s*\\[([^\\]]+)\\]', r'DiracDelta(\\1)', s_clean)
    s_clean = re.sub(r'\\bu\\s*\\(', 'Heaviside(', s_clean)
    s_clean = re.sub(r'\\bdelta\\s*\\(', 'DiracDelta(', s_clean)
    s_clean = re.sub(r'\\\\delta\\s*\\(', 'DiracDelta(', s_clean)
    # e^(-a*t) -> exp(-a*t)
    s_clean = re.sub(r'\\be\\*\\*\\(([^)]+)\\)', r'exp(\\1)', s_clean)
    s_clean = re.sub(r'\\be\\*\\*([a-zA-Z0-9_\\-]+)', r'exp(\\1)', s_clean)
    return s_clean

def parse_engineering_expr(raw_str):
    s_clean = preprocess_expr_str(raw_str)
    local_dict = {
        't': t, 's': s, 'w': w, 'x': x, 'z': z, 'tau': tau, 'n': n, 'k': k,
        'Heaviside': sp.Heaviside,
        'DiracDelta': sp.DiracDelta,
        'rect': rect,
        'sinc': sp.sinc,
        'exp': sp.exp,
        'ln': sp.log,
        'log': sp.log,
        'sqrt': sp.sqrt,
        'tan': sp.tan,
        'atan': sp.atan,
        'asin': sp.asin,
        'acos': sp.acos,
        'cos': sp.cos,
        'sin': sp.sin,
        'sinh': sp.sinh,
        'cosh': sp.cosh,
        'pi': sp.pi,
        'I': sp.I,
        'j': sp.I
    }
    transformations = standard_transformations + (implicit_multiplication_application, convert_xor)
    return parse_expr(s_clean, local_dict=local_dict, transformations=transformations)

def format_engineering_latex(expr):
    tex = sp.latex(expr)
    tex = tex.replace(r'\\theta\\left(', r'u\\left(')
    tex = tex.replace(r'\\operatorname{Heaviside}\\left(', r'u\\left(')
    tex = tex.replace(r'\\operatorname{rect}\\left(', r'\\text{rect}\\left(')
    return tex

def fourier_single_term(term, steps, idx_label=""):
    """Computes Fourier Transform F(w) = int_{-oo}^{oo} f(t) e^{-j w t} dt of a term with pedagogical breakdown."""
    term = sp.simplify(term)
    
    # 1. DiracDelta(t - t0)
    if term.has(sp.DiracDelta):
        coeff = term.as_coeff_Mul()[0]
        for arg in sp.preorder_traversal(term):
            if isinstance(arg, sp.DiracDelta):
                inner = arg.args[0]
                t0_sol = sp.solve(inner, t)
                t0 = t0_sol[0] if t0_sol else sp.Integer(0)
                res = coeff * sp.exp(-sp.I * w * t0)
                if t0 == 0:
                    steps.append({
                        "titulo_paso": f"Propiedad de muestreo de la Delta de Dirac {idx_label}".strip(),
                        "explicacion": "Por la propiedad filtrante del impulso unitario en el origen, la integral de Fourier vale exactamente la constante de peso en todas las frecuencias.",
                        "latex": rf"\\mathcal{{F}}\\left\\{{{format_engineering_latex(term)}\\right\\}} = \\int_{{-\\infty}}^{{\\infty}} {format_engineering_latex(term)} e^{{-j\\omega t}}\\,dt = { sp.latex(res) }"
                    })
                else:
                    steps.append({
                        "titulo_paso": f"Impulso desplazado en el tiempo {idx_label}".strip(),
                        "explicacion": f"Un impulso unitario centrado en t = {sp.latex(t0)} introduce un desfase lineal puro en el dominio de la frecuencia.",
                        "latex": rf"\\mathcal{{F}}\\left\\{{{format_engineering_latex(term)}\\right\\}} = {sp.latex(coeff)} e^{{-j\\omega ({sp.latex(t0)})}} = {sp.latex(res)}"
                    })
                return res

    # 2. Rectangular pulse rect(t / T)
    if term.has(rect):
        coeff = sp.Integer(1)
        rect_node = None
        for factor in sp.Mul.make_args(term):
            if isinstance(factor, rect):
                rect_node = factor
            else:
                coeff *= factor
        inner = rect_node.args[0]
        # Solve inner = 1/2 and inner = -1/2
        t_pos = sp.solve(inner - sp.Rational(1, 2), t)
        t_neg = sp.solve(inner + sp.Rational(1, 2), t)
        if t_pos and t_neg:
            lim_a = min(t_neg[0], t_pos[0])
            lim_b = max(t_neg[0], t_pos[0])
            width = sp.simplify(lim_b - lim_a)
            center = sp.simplify((lim_a + lim_b) / 2)
            steps.append({
                "titulo_paso": f"Acotación de límites por pulso rectangular {idx_label}".strip(),
                "explicacion": f"El pulso rectangular vale 1 únicamente en el intervalo [{sp.latex(lim_a)}, {sp.latex(lim_b)}] (anchura T = {sp.latex(width)}), acotando los límites de la integral de Fourier.",
                "latex": rf"\\int_{{-\\infty}}^{{\\infty}} {format_engineering_latex(term)} e^{{-j\\omega t}}\\,dt = {sp.latex(coeff)} \\int_{{{sp.latex(lim_a)}}}^{{{sp.latex(lim_b)}}} e^{{-j\\omega t}}\\,dt"
            })
            steps.append({
                "titulo_paso": "Integración de la exponencial compleja y conversión a seno cardinal",
                "explicacion": "Evaluamos la primitiva en los extremos del pulso y aplicamos la identidad de Euler (e^{j\\theta} - e^{-j\\theta}) / (2j) = \\sin(\\theta).",
                "latex": rf"\\left[ \\frac{{{sp.latex(coeff)} e^{{-j\\omega t}}}}{{-j\\omega}} \\right]_{{{sp.latex(lim_a)}}}^{{{sp.latex(lim_b)}}} = {sp.latex(coeff * width)} \\cdot \\frac{{\\sin\\left(\\frac{{\\omega \\cdot {sp.latex(width)}}}{{2}}\\right)}}{{\\frac{{\\omega \\cdot {sp.latex(width)}}}{{2}}}} e^{{-j\\omega ({sp.latex(center)})}}"
            })
            res = coeff * width * sp.sin(w * width / 2) / (w * width / 2) * sp.exp(-sp.I * w * center)
            return sp.simplify(res)

    # 3. Causal decaying exponential with Heaviside: A * t^n * exp(-a*t) * cos/sin * Heaviside(t)
    if term.has(sp.Heaviside):
        integrand_causal = term.subs(sp.Heaviside(t), 1)
        steps.append({
            "titulo_paso": f"Reducción de límites por escalón de Heaviside u(t) {idx_label}".strip(),
            "explicacion": "Como el escalón unitario u(t) anula la señal para t < 0, el límite inferior de la integral de Fourier pasa de -\\infty a 0.",
            "latex": rf"\\int_{{-\\infty}}^{{\\infty}} {format_engineering_latex(term)} e^{{-j\\omega t}}\\,dt = \\int_{{0}}^{{\\infty}} \\left({format_engineering_latex(integrand_causal)}\\right) e^{{-j\\omega t}}\\,dt"
        })
        # Combine exponents if exponential
        combined = sp.simplify(integrand_causal * sp.exp(-sp.I * w * t))
        steps.append({
            "titulo_paso": "Agrupación del exponente complejo y cálculo de la primitiva",
            "explicacion": "Unificamos los factores exponenciales en un único término e^{-(a + j\\omega)t} y evaluamos el límite superior t \\to \\infty (convergente para Re(a) > 0).",
            "latex": rf"\\int_{{0}}^{{\\infty}} {sp.latex(combined)}\\,dt"
        })
        # Compute via Laplace substitution s -> j*w for causal signal
        L_s = sp.laplace_transform(integrand_causal, t, s, noconds=True)
        res = sp.simplify(L_s.subs(s, sp.I * w))
        steps.append({
            "titulo_paso": "Evaluación en los extremos de integración [0, \\infty)",
            "explicacion": "En t \\to \\infty la envolvente exponencial decae a cero, quedando únicamente la evaluación en el límite inferior t = 0.",
            "latex": rf"F(\\omega) = {sp.latex(res)}"
        })
        return res

    # 4. Pure trigonometric cos(w0*t) or sin(w0*t)
    if term.has(sp.cos) or term.has(sp.sin):
        # Expand into complex exponentials via Euler
        euler_form = term.rewrite(sp.exp).expand()
        steps.append({
            "titulo_paso": f"Descomposición mediante identidades de Euler {idx_label}".strip(),
            "explicacion": "Expresamos las funciones sinusoidales como suma de fasores complejos conjugados para aplicar la propiedad de desplazamiento en frecuencia.",
            "latex": rf"{format_engineering_latex(term)} = {sp.latex(euler_form)}"
        })
        res = sp.Integer(0)
        for sub in sp.Add.make_args(euler_form):
            # sub is coeff * exp(I * w0 * t)
            c, rest = sub.as_coeff_Mul()
            # extract exponent of t
            exponent = sp.simplify(sp.log(rest) / (sp.I * t))
            res += 2 * sp.pi * c * sp.DiracDelta(w - exponent)
        res = sp.simplify(res)
        steps.append({
            "titulo_paso": "Transformada de fasores armónicos en deltas de Dirac",
            "explicacion": "Cada exponencial compleja pura e^{j\\omega_0 t} concentra toda su energía espectral en impulsos de Dirac situados en \\omega = \\pm\\omega_0.",
            "latex": rf"\\mathcal{{F}}\\left\\{{{format_engineering_latex(term)}\\right\\}} = {sp.latex(res)}"
        })
        return res

    # 5. Double-sided exponential or Gaussian or general symbolic Fourier transform
    ft_sympy = sp.fourier_transform(term, t, w / (2 * sp.pi))
    res = sp.simplify(ft_sympy)
    steps.append({
        "titulo_paso": f"Integración simbólica directa sobre (-\\infty, \\infty) {idx_label}".strip(),
        "explicacion": "Calculamos analíticamente la integral impropia bilateral aplicando integración simbólica directa en el dominio temporal.",
        "latex": rf"F(\\omega) = \\int_{{-\\infty}}^{{\\infty}} {format_engineering_latex(term)} e^{{-j\\omega t}}\\,dt = {sp.latex(res)}"
    })
    return res

def solve_fourier(expr_str, direction="direct"):
    steps = []
    expr = parse_engineering_expr(expr_str)

    if direction == "direct":
        steps.append({
            "titulo_paso": "Planteamiento de la Integral de Transformada de Fourier",
            "explicacion": "Partimos de la definición estándar en ingeniería de la Transformada de Fourier continua en frecuencia angular \\omega (rad/s).",
            "latex": rf"F(\\omega) = \\mathcal{{F}}\\left\\{{{format_engineering_latex(expr)}\\right\\}} = \\int_{{-\\infty}}^{{\\infty}} \\left({format_engineering_latex(expr)}\\right) e^{{-j\\omega t}}\\,dt"
        })

        terms = sp.Add.make_args(expr)
        if len(terms) > 1:
            steps.append({
                "titulo_paso": "Aplicación de la propiedad de linealidad",
                "explicacion": "Descomponemos la transformada de la combinación lineal en la suma de las transformadas individuales de cada término.",
                "latex": " + ".join([rf"\\mathcal{{F}}\\left\\{{{format_engineering_latex(tm)}\\right\\}}" for tm in terms])
            })

        total_res = sp.Integer(0)
        for i, tm in enumerate(terms):
            lbl = f"(Término {i+1})" if len(terms) > 1 else ""
            total_res += fourier_single_term(tm, steps, lbl)

        final_tex = sp.latex(sp.simplify(total_res))
        steps.append({
            "titulo_paso": "Expresión espectral resultante F(\\omega)",
            "explicacion": "Agrupamos y simplificamos los términos espectrales obtenidos para expresar la Transformada de Fourier final en función de \\omega.",
            "latex": rf"F(\\omega) = {final_tex}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"F(\\omega) = {final_tex}"}

    else:
        # Inverse Fourier Transform
        steps.append({
            "titulo_paso": "Planteamiento de la Transformada Inversa de Fourier",
            "explicacion": "Utilizamos la integral de síntesis de Fourier para reconstruir la señal temporal f(t) a partir de su espectro F(\\omega).",
            "latex": rf"f(t) = \\mathcal{{F}}^{{-1}}\\left\\{{{format_engineering_latex(expr)}\\right\\}} = \\frac{{1}}{{2\\pi}} \\int_{{-\\infty}}^{{\\infty}} \\left({format_engineering_latex(expr)}\\right) e^{{j\\omega t}}\\,d\\omega"
        })

        if expr.has(sp.DiracDelta):
            # Integrating DiracDelta in w
            total_inv = sp.Integer(0)
            for tm in sp.Add.make_args(expr):
                c = sp.Integer(1)
                w0 = sp.Integer(0)
                for fac in sp.Mul.make_args(tm):
                    if isinstance(fac, sp.DiracDelta):
                        sol = sp.solve(fac.args[0], w)
                        w0 = sol[0] if sol else sp.Integer(0)
                    else:
                        c *= fac
                total_inv += (c / (2 * sp.pi)) * sp.exp(sp.I * w0 * t)
            simplified_inv = sp.simplify(total_inv.rewrite(sp.cos))
            steps.append({
                "titulo_paso": "Propiedad de muestreo espectral de la Delta de Dirac",
                "explicacion": "Cada delta en \\omega = \\omega_0 extrae el valor del fasor e^{j\\omega_0 t} dividido por 2\\pi al integrar respecto a \\omega.",
                "latex": rf"f(t) = {sp.latex(total_inv)} = {sp.latex(simplified_inv)}"
            })
            final_tex = format_engineering_latex(simplified_inv)
        else:
            # Rational spectrum in j*w -> link with Bilateral/Causal Laplace via s = j*w
            expr_s = sp.simplify(expr.subs(sp.I * w, s).subs(w, -sp.I * s))
            apart_s = sp.apart(expr_s, s)
            steps.append({
                "titulo_paso": "Cambio de variable compleja s = j\\omega y descomposición racional",
                "explicacion": "Identificamos los polos del espectro expresando F(\\omega) en términos de j\\omega y descomponiendo en fracciones simples.",
                "latex": rf"F(\\omega)\\Big|_{{j\\omega \\to s}} = {sp.latex(apart_s)}"
            })
            inv_lap = sp.inverse_laplace_transform(apart_s, s, t)
            final_tex = format_engineering_latex(sp.simplify(inv_lap))
            steps.append({
                "titulo_paso": "Antitransformación término a término mediante el Teorema de los Residuos",
                "explicacion": "Cada polo en el semiplano izquierdo Re(s) < 0 genera una exponencial causal decreciente multiplicada por el escalón u(t).",
                "latex": rf"f(t) = {final_tex}"
            })

        return {"ok": True, "steps": steps, "final_latex": rf"f(t) = {final_tex}"}


def solve_laplace(expr_str, direction="direct"):
    steps = []
    expr = parse_engineering_expr(expr_str)

    if direction == "direct":
        expr_clean = expr.subs(sp.Heaviside(t), 1)
        steps.append({
            "titulo_paso": "Definición de la Transformada de Laplace Unilateral",
            "explicacion": "Planteamos la integral impropia unilateral sobre [0, \\infty) multiplicando la señal temporal f(t) por el núcleo exponencial e^{-st}.",
            "latex": rf"F(s) = \\mathcal{{L}}\\left\\{{{format_engineering_latex(expr_clean)}\\right\\}} = \\int_{{0}}^{{\\infty}} \\left({format_engineering_latex(expr_clean)}\\right) e^{{-st}}\\,dt"
        })

        terms = sp.Add.make_args(expr_clean.expand())
        if len(terms) > 1:
            steps.append({
                "titulo_paso": "Descomposición por linealidad del operador de Laplace",
                "explicacion": "Separamos la integral en una combinación lineal de transformadas elementales individuales.",
                "latex": " + ".join([rf"\\mathcal{{L}}\\left\\{{{format_engineering_latex(tm)}\\right\\}}" for tm in terms])
            })

        total_F = sp.Integer(0)
        for i, tm in enumerate(terms):
            F_tm = sp.laplace_transform(tm, t, s, noconds=True)
            total_F += F_tm
            lbl = f"(Término {i+1})" if len(terms) > 1 else ""
            # Check if frequency shift e^(-a*t)*g(t) applies
            if tm.has(sp.exp) and (tm.has(sp.sin) or tm.has(sp.cos) or tm.has(t)):
                steps.append({
                    "titulo_paso": f"Teorema de traslación en el dominio complejo s {lbl}".strip(),
                    "explicacion": "El factor exponencial e^{-at} en el tiempo desplaza la variable compleja s \\to (s + a) en la transformada de la función base.",
                    "latex": rf"\\mathcal{{L}}\\left\\{{{format_engineering_latex(tm)}\\right\\}} = {sp.latex(F_tm)}"
                })
            else:
                steps.append({
                    "titulo_paso": f"Transformación directa mediante par elemental {lbl}".strip(),
                    "explicacion": "Aplicamos la regla de integración de Laplace para potencias, exponenciales o funciones trigonométricas causales.",
                    "latex": rf"\\mathcal{{L}}\\left\\{{{format_engineering_latex(tm)}\\right\\}} = {sp.latex(F_tm)}"
                })

        simplified_F = sp.together(sp.simplify(total_F))
        steps.append({
            "titulo_paso": "Unificación algebraica de la función de transferencia F(s)",
            "explicacion": "Reducimos a común denominador para expresar F(s) como cociente de polinomios en el plano complejo s.",
            "latex": rf"F(s) = {sp.latex(simplified_F)}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"F(s) = {sp.latex(simplified_F)}"}

    else:
        # Inverse Laplace Transform with explicit denominator factorization & partial fractions
        steps.append({
            "titulo_paso": "Análisis de la función racional F(s) a antitransformar",
            "explicacion": "Identificamos el numerador N(s) y el denominador D(s) de la función en el dominio de Laplace antes de hallar sus polos.",
            "latex": rf"F(s) = {sp.latex(expr)}"
        })

        num, den = sp.fraction(sp.together(expr))
        factored_den = sp.factor(den)
        poles = sp.roots(den, s)
        poles_desc = ", ".join([f"s = {sp.latex(p)} (mult. {m})" for p, m in poles.items()]) if poles else "raíces complejas/simbólicas"

        steps.append({
            "titulo_paso": "Factorización del denominador y cálculo de polos",
            "explicacion": f"Factorizamos completamente el polinomio del denominador D(s) para localizar las singularidades (polos: {poles_desc}).",
            "latex": rf"F(s) = \\frac{{{sp.latex(num)}}}{{{sp.latex(factored_den)}}}"
        })

        pfd = sp.apart(expr, s)
        steps.append({
            "titulo_paso": "Descomposición en fracciones simples (Heaviside / Residuos)",
            "explicacion": "Descomponemos la expresión racional en suma de fracciones parciales elementales calculando los residuos asociados a cada polo.",
            "latex": rf"F(s) = {sp.latex(pfd)}"
        })

        pfd_terms = sp.Add.make_args(pfd)
        total_ft = sp.Integer(0)
        term_results = []
        for i, p_term in enumerate(pfd_terms):
            inv_t = sp.inverse_laplace_transform(p_term, s, t)
            total_ft += inv_t
            term_results.append(rf"\\mathcal{{L}}^{{-1}}\\left\\{{{sp.latex(p_term)}\\right\\}} = {format_engineering_latex(inv_t)}")

        steps.append({
            "titulo_paso": "Antitransformación término a término a partir de cada fracción simple",
            "explicacion": "Invertimos cada fracción parcial empleando las tablas fundamentales de Laplace (exponenciales reales, amortiguadas o sinusoides).",
            "latex": r" \\\\ ".join(term_results)
        })

        final_ft = format_engineering_latex(sp.simplify(total_ft))
        steps.append({
            "titulo_paso": "Reconstrucción de la respuesta temporal causal f(t)",
            "explicacion": "Sumamos las contribuciones temporales de cada modo natural multiplicadas por el escalón unitario u(t) para t \\ge 0.",
            "latex": rf"f(t) = {final_ft}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"f(t) = {final_ft}"}


def parse_matrix_input(raw_str):
    s_clean = raw_str.strip()
    if s_clean.startswith('['):
        data = json.loads(s_clean)
        return sp.Matrix(data)
    # Semicolon format: "2, 1; 1, 2"
    rows = [r.strip() for r in s_clean.split(';') if r.strip()]
    mat_data = []
    for r in rows:
        cols = [sp.sympify(c.strip()) for c in r.split(',') if c.strip()]
        mat_data.append(cols)
    return sp.Matrix(mat_data)


def solve_diagonalization(matrix_str):
    steps = []
    A = parse_matrix_input(matrix_str)
    n = A.rows
    I_n = sp.eye(n)

    steps.append({
        "titulo_paso": f"Matriz cuadrada A de dimensión {n}\\times {n}",
        "explicacion": "Verificamos la matriz cuadrada A cuyos autovalores (valores propios) y autovectores (vectores propios) queremos determinar.",
        "latex": rf"A = {sp.latex(A)}"
    })

    char_mat = A - lam * I_n
    char_poly = sp.factor(char_mat.det())
    char_poly_expanded = sp.expand(char_mat.det())

    steps.append({
        "titulo_paso": "Planteamiento de la matriz característica (A - \\lambda I)",
        "explicacion": "Restamos \\lambda en la diagonal principal para plantear la condición de nulidad del determinante |A - \\lambda I| = 0.",
        "latex": rf"A - \\lambda I = {sp.latex(char_mat)}"
    })

    steps.append({
        "titulo_paso": "Cálculo y factorización del polinomio característico p(\\lambda)",
        "explicacion": "Desarrollamos el determinante |A - \\lambda I| y factorizamos el polinomio resultante para identificar sus raíces.",
        "latex": rf"p(\\lambda) = \\det(A - \\lambda I) = {sp.latex(char_poly_expanded)} = {sp.latex(char_poly)} = 0"
    })

    eigenvals = A.eigenvals()
    evals_latex_list = [rf"\\lambda_{{{i+1}}} = {sp.latex(val)} \\; (m_a = {mult})" for i, (val, mult) in enumerate(eigenvals.items())]
    steps.append({
        "titulo_paso": "Espectro de autovalores y multiplicidades algebraicas",
        "explicacion": "Obtenemos las raíces de la ecuación característica junto con la multiplicidad algebraica (m_a) de cada autovalor.",
        "latex": r", \\quad ".join(evals_latex_list)
    })

    eigenvects = A.eigenvects()
    all_basis_vectors = []
    for val, mult, basis in eigenvects:
        sys_mat = A - val * I_n
        basis_latex = ", \\; ".join([sp.latex(v) for v in basis])
        all_basis_vectors.extend(basis)
        steps.append({
            "titulo_paso": f"Subespacio propio E({sp.latex(val)}) y resolución de (A - ({sp.latex(val)})I)\\vec{{v}} = \\vec{{0}}",
            "explicacion": f"Sustituimos \\lambda = {sp.latex(val)} en el sistema homogéneo (m_a = {mult}, m_g = {len(basis)}) y extraemos una base de autovectores linealmente independientes.",
            "latex": rf"(A - ({sp.latex(val)})I)\\vec{{v}} = {sp.latex(sys_mat)}\\vec{{v}} = \\vec{{0}} \\implies \\mathcal{{B}}_{{E({sp.latex(val)})}} = \\left\\{{ {basis_latex} \\right\\}}"
        })

    if len(all_basis_vectors) < n:
        steps.append({
            "titulo_paso": "Criterio de diagonalizabilidad: Matriz NO diagonalizable",
            "explicacion": "La suma de las multiplicidades geométricas es menor que la dimensión de la matriz (m_g < m_a), por lo que no existe una base completa de autovectores.",
            "latex": rf"\\sum m_g = {len(all_basis_vectors)} < {n} \\implies A \\text{{ no es diagonalizable.}}"
        })
        return {"ok": True, "steps": steps, "final_latex": r"A \text{ no es diagonalizable } (\sum m_g < n)"}

    P, D = A.diagonalize()
    P_inv = P.inv()

    steps.append({
        "titulo_paso": "Construcción de la matriz de paso P y la matriz diagonal D",
        "explicacion": "Disponemos los autovectores hallados como columnas de la matriz de cambio de base P y los autovalores correspondientes en la diagonal principal de D.",
        "latex": rf"P = {sp.latex(P)}, \\qquad D = {sp.latex(D)}"
    })

    steps.append({
        "titulo_paso": "Cálculo de P^{-1} y verificación de la factorización A = P D P^{-1}",
        "explicacion": "Calculamos la matriz inversa P^{-1} (cuyo determinante es |P| = " + sp.latex(P.det()) + ") y comprobamos la relación de semejanza espectral.",
        "latex": rf"P^{{-1}} = {sp.latex(P_inv)} \\implies A = P D P^{{-1}} = {sp.latex(P)}{sp.latex(D)}{sp.latex(P_inv)}"
    })

    return {
        "ok": True,
        "steps": steps,
        "final_latex": rf"P = {sp.latex(P)}, \quad D = {sp.latex(D)}, \quad A = P D P^{-1}"
    }


def solve_ztransform(expr_str, direction="inverse"):
    steps = []
    expr = parse_engineering_expr(expr_str)

    if direction == "direct":
        expr_clean = expr.subs(sp.Heaviside(n), 1)
        steps.append({
            "titulo_paso": "Planteamiento de la definición de la Transformada Z Unilateral",
            "explicacion": "Expresamos la Transformada Z de la secuencia discreta causal x[n] mediante su serie formal de potencias en z^{-n}.",
            "latex": rf"X(z) = \\mathcal{{Z}}\\left\\{{{format_engineering_latex(expr)}\\right\\}} = \\sum_{{n=0}}^{{\\infty}} \\left({sp.latex(expr_clean)}\\right) z^{{-n}}"
        })

        terms = sp.Add.make_args(expr.expand())
        total_Z = sp.Integer(0)
        for i, tm in enumerate(terms):
            lbl = f"(Término {i+1})" if len(terms) > 1 else ""
            if tm.has(sp.DiracDelta):
                c = sp.Integer(1)
                n0 = sp.Integer(0)
                for fac in sp.Mul.make_args(tm):
                    if isinstance(fac, sp.DiracDelta):
                        sol = sp.solve(fac.args[0], n)
                        n0 = sol[0] if sol else sp.Integer(0)
                    elif not isinstance(fac, sp.Heaviside):
                        c *= fac
                z_tm = c * z**(-n0)
                total_Z += z_tm
                steps.append({
                    "titulo_paso": f"Transformada Z del impulso discreto desplazado {lbl}".strip(),
                    "explicacion": f"Un impulso unitario en n = {sp.latex(n0)} selecciona únicamente el término z^{{-{sp.latex(n0)}}} del sumatorio.",
                    "latex": rf"\\mathcal{{Z}}\\left\\{{{sp.latex(c)}\\delta[n - {sp.latex(n0)}]\\right\\}} = {sp.latex(z_tm)}"
                })
            else:
                tm_no_u = tm.subs(sp.Heaviside(n), 1)
                # Use geometric series summation via SymPy Sum
                sum_res = sp.summation(tm_no_u * (z_sym := sp.Dummy('z_pos', positive=True))**(-n), (n, 0, sp.oo))
                # Alternatively algebraic matching for c * n^p * a^n
                c_coeff = sp.Integer(1)
                a_base = sp.Integer(1)
                n_pow = 0
                for fac in sp.Mul.make_args(tm_no_u):
                    if fac == n:
                        n_pow = 1
                    elif fac.is_Pow and fac.base == n:
                        n_pow = int(fac.exp)
                    elif fac.is_Pow and fac.exp == n:
                        a_base = fac.base
                    elif not fac.has(n):
                        c_coeff *= fac
                base_Z = z / (z - a_base)
                for _ in range(n_pow):
                    base_Z = sp.simplify(-z * sp.diff(base_Z, z))
                z_tm = sp.simplify(c_coeff * base_Z)
                total_Z += z_tm
                steps.append({
                    "titulo_paso": f"Suma de la serie geométrica / propiedad de diferenciación {lbl}".strip(),
                    "explicacion": "Aplicamos el par fundamental \\mathcal{Z}\\{a^n u[n]\\} = \\frac{z}{z - a} y, si existe factor n, la derivada -z\\frac{d}{dz}X(z).",
                    "latex": rf"\\mathcal{{Z}}\\left\\{{{sp.latex(tm_no_u)}u[n]\\right\\}} = {sp.latex(z_tm)}"
                })

        final_Z = sp.together(sp.simplify(total_Z))
        steps.append({
            "titulo_paso": "Expresión racional unificada de X(z)",
            "explicacion": "Agrupamos los términos en una única función de transferencia en el plano complejo z.",
            "latex": rf"X(z) = {sp.latex(final_Z)}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"X(z) = {sp.latex(final_Z)}"}

    else:
        # Inverse Z-Transform showing X(z)/z -> sympy.apart() -> multiply by z -> tables
        steps.append({
            "titulo_paso": "División explícita por z: formación de X(z)/z",
            "explicacion": "Dividimos la función X(z) entre z antes de expandir en fracciones simples, garantizando que luego aparezca z en el numerador de cada término.",
            "latex": rf"\\frac{{X(z)}}{{z}} = \\frac{{1}}{{z}}\\left({sp.latex(expr)}\\right) = {sp.latex(sp.together(expr / z))}"
        })

        xz_over_z = sp.apart(expr / z, z)
        steps.append({
            "titulo_paso": "Descomposición en fracciones simples de X(z)/z (sympy.apart)",
            "explicacion": "Descomponemos X(z)/z en suma de fracciones parciales elementales asociadas a cada polo del denominador.",
            "latex": rf"\\frac{{X(z)}}{{z}} = {sp.latex(xz_over_z)}"
        })

        apart_terms = sp.Add.make_args(xz_over_z)
        mult_z_terms = [sp.simplify(z * tm) for tm in apart_terms]
        steps.append({
            "titulo_paso": "Multiplicación final por z para restituir X(z)",
            "explicacion": "Multiplicamos cada fracción parcial por z para obtener bloques canónicos del tipo z/(z - a) o a z/(z - a)^2.",
            "latex": rf"X(z) = " + " + ".join([sp.latex(m_tm) for m_tm in mult_z_terms])
        })

        xn_pieces = []
        for tm in apart_terms:
            # tm is a partial fraction of X(z)/z: C / (z - p)^m or C / z^k
            num_t, den_t = sp.fraction(tm)
            if den_t == z:
                xn_pieces.append(rf"{sp.latex(num_t)}\\delta[n]")
            elif den_t.is_Pow and den_t.base == z:
                k_val = den_t.exp
                xn_pieces.append(rf"{sp.latex(num_t)}\\delta[n - {sp.latex(k_val)}]")
            elif den_t.is_Pow and den_t.exp == 2:
                roots = sp.solve(den_t.base, z)
                p_val = roots[0] if roots else sp.Integer(1)
                coeff_val = sp.simplify(num_t / p_val)
                xn_pieces.append(rf"{sp.latex(coeff_val)}\\,n({sp.latex(p_val)})^n u[n]")
            else:
                roots = sp.solve(den_t, z)
                p_val = roots[0] if roots else sp.Integer(1)
                if p_val == 1:
                    xn_pieces.append(rf"{sp.latex(num_t)}\\,u[n]")
                else:
                    xn_pieces.append(rf"{sp.latex(num_t)}({sp.latex(p_val)})^n u[n]")

        final_xn = " + ".join(xn_pieces).replace("+ -", "- ")
        steps.append({
            "titulo_paso": "Antitransformación término a término mediante tablas conocidas",
            "explicacion": "Aplicamos los pares de Transformada Z Inversa (a^n u[n], n a^n u[n], \\delta[n-k]) a cada bloque.",
            "latex": rf"x[n] = {final_xn}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"x[n] = {final_xn}"}


def solve_convolution(expr_str, direction="direct"):
    steps = []
    parts = [p.strip() for p in expr_str.split(';') if p.strip()]
    if len(parts) != 2:
        return {"ok": False, "error": "Introduce las dos señales separadas por punto y coma ';', por ejemplo: exp(-2*t)*u(t) ; exp(-3*t)*u(t)"}

    if direction == "direct":
        # Continuous convolution x(t) * h(t)
        x_expr = parse_engineering_expr(parts[0])
        h_expr = parse_engineering_expr(parts[1])
        x_tau = x_expr.subs(t, tau)
        h_t_tau = h_expr.subs(t, t - tau)

        steps.append({
            "titulo_paso": "Planteamiento de la integral de convolución continua",
            "explicacion": "Definimos la integral de convolución entre la entrada x(\\tau) y la respuesta al impulso invertida y desplazada h(t - \\tau).",
            "latex": rf"y(t) = (x * h)(t) = \\int_{{-\\infty}}^{{\\infty}} x(\\tau)h(t - \\tau)\\,d\\tau = \\int_{{-\\infty}}^{{\\infty}} \\left({format_engineering_latex(x_tau)}\\right)\\left({format_engineering_latex(h_t_tau)}\\right)\\,d\\tau"
        })

        x_clean = x_tau.subs(sp.Heaviside(tau), 1)
        h_clean = h_t_tau.subs(sp.Heaviside(t - tau), 1)

        steps.append({
            "titulo_paso": "Desplazamiento temporal h(t - \\tau) y acotación de límites por u(\\tau)u(t - \\tau)",
            "explicacion": "Para señales causales multiplicadas por el escalón u(t), el producto u(\\tau)u(t - \\tau) es igual a 1 únicamente cuando 0 \\le \\tau \\le t (para t \\ge 0).",
            "latex": rf"y(t) = u(t) \\int_{{0}}^{{t}} \\left({sp.latex(x_clean)}\\right)\\left({sp.latex(h_clean)}\\right)\\,d\\tau"
        })

        integrand = sp.simplify(x_clean * h_clean)
        steps.append({
            "titulo_paso": "Simplificación del integrando respecto a la variable muda \\tau",
            "explicacion": "Agrupamos los términos que dependen de \\tau antes de calcular la primitiva definida entre 0 y t.",
            "latex": rf"y(t) = u(t) \\int_{{0}}^{{t}} {sp.latex(integrand)}\\,d\\tau"
        })

        conv_res = sp.simplify(sp.integrate(integrand, (tau, 0, t)))
        final_tex = rf"\\left({sp.latex(conv_res)}\\right)u(t)"
        steps.append({
            "titulo_paso": "Integración definida en [0, t] y resultado simplificado",
            "explicacion": "Evaluamos la primitiva en \\tau = t y \\tau = 0 y multiplicamos por el escalón de causalidad u(t).",
            "latex": rf"y(t) = {final_tex}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"y(t) = {final_tex}"}

    else:
        # Discrete convolution x[n] * h[n]
        x_expr = parse_engineering_expr(parts[0])
        h_expr = parse_engineering_expr(parts[1])
        x_k = x_expr.subs(n, k)
        h_n_k = h_expr.subs(n, n - k)

        steps.append({
            "titulo_paso": "Planteamiento del sumatorio de convolución discreta",
            "explicacion": "Expresamos la salida y[n] mediante la suma de convolución evaluando x[k] y la secuencia invertida y desplazada h[n - k].",
            "latex": rf"y[n] = (x * h)[n] = \\sum_{{k=-\\infty}}^{{\\infty}} x[k]h[n - k]"
        })

        x_clean = x_k.subs(sp.Heaviside(k), 1)
        h_clean = h_n_k.subs(sp.Heaviside(n - k), 1)

        steps.append({
            "titulo_paso": "Acotación de los límites de suma por los escalones discretos u[k]u[n - k]",
            "explicacion": "El producto de escalones causales u[k]u[n - k] acota el índice k al intervalo finito 0 \\le k \\le n para todo n \\ge 0.",
            "latex": rf"y[n] = u[n] \\sum_{{k=0}}^{{n}} \\left({sp.latex(x_clean)}\\right)\\left({sp.latex(h_clean)}\\right)"
        })

        summand = sp.simplify(x_clean * h_clean)
        sum_res = sp.simplify(sp.summation(summand, (k, 0, n)))
        final_tex = rf"\\left({sp.latex(sum_res)}\\right)u[n]"
        steps.append({
            "titulo_paso": "Evaluación cerrada de la suma finita en [0, n]",
            "explicacion": "Calculamos simbólicamente la suma desde k = 0 hasta k = n y expresamos la secuencia resultante para n \\ge 0.",
            "latex": rf"y[n] = {final_tex}"
        })
        return {"ok": True, "steps": steps, "final_latex": rf"y[n] = {final_tex}"}


def solve_ode(expr_str):
    steps = []
    parts = [p.strip() for p in expr_str.split(';') if p.strip()]
    ode_part = parts[0]
    ics_part = parts[1] if len(parts) > 1 else ""

    y_fn = sp.Function('y')(x)
    s_clean = ode_part.replace('^', '**')
    s_clean = re.sub(r"y''", "Derivative(y(x), x, 2)", s_clean)
    s_clean = re.sub(r"y'", "Derivative(y(x), x)", s_clean)
    s_clean = re.sub(r"\\by\\b(?!\\s*\\()", "y(x)", s_clean)

    local_ode_dict = {
        'x': x,
        'y': sp.Function('y'),
        'Derivative': sp.Derivative,
        'exp': sp.exp,
        'cos': sp.cos,
        'sin': sp.sin,
        'ln': sp.log,
        'log': sp.log
    }
    transformations = standard_transformations + (implicit_multiplication_application, convert_xor)

    if '=' in s_clean:
        lhs_s, rhs_s = s_clean.split('=', 1)
        lhs = parse_expr(lhs_s.strip(), local_dict=local_ode_dict, transformations=transformations)
        rhs = parse_expr(rhs_s.strip(), local_dict=local_ode_dict, transformations=transformations)
        eq = sp.Eq(lhs, rhs)
    else:
        lhs = parse_expr(s_clean.strip(), local_dict=local_ode_dict, transformations=transformations)
        rhs = sp.Integer(0)
        eq = sp.Eq(lhs, rhs)

    classifications = sp.classify_ode(eq, y_fn)
    primary_class = classifications[0] if classifications else "EDO general"

    steps.append({
        "titulo_paso": f"Clasificación y análisis estructural de la EDO ({primary_class})",
        "explicacion": "Identificamos el orden, la linealidad y la familia resoluble de la ecuación diferencial planteada.",
        "latex": sp.latex(eq)
    })

    # Check if 2nd order constant coefficient
    r_sym = sp.Symbol('r')
    diff_expr = sp.expand(lhs - rhs)
    a2 = diff_expr.coeff(sp.Derivative(y_fn, x, 2))
    a1 = diff_expr.coeff(sp.Derivative(y_fn, x))
    a0 = diff_expr.subs({sp.Derivative(y_fn, x, 2): 0, sp.Derivative(y_fn, x): 0}).coeff(y_fn)

    if a2 != 0 and not a2.has(x) and not a1.has(x) and not a0.has(x):
        char_poly = a2 * r_sym**2 + a1 * r_sym + a0
        roots_dict = sp.roots(char_poly, r_sym)
        roots_tex = ", \\quad ".join([rf"r = {sp.latex(rt)} \\; (\\text{{mult. }} {m})" for rt, m in roots_dict.items()])
        steps.append({
            "titulo_paso": "Ecuación característica y cálculo de raíces del sistema homogéneo",
            "explicacion": "Sustituimos y = e^{rx} en la ecuación homogénea asociada para hallar los modos naturales del sistema.",
            "latex": rf"{sp.latex(char_poly)} = 0 \\implies {roots_tex}"
        })
        hom_eq = sp.Eq(a2 * sp.Derivative(y_fn, x, 2) + a1 * sp.Derivative(y_fn, x) + a0 * y_fn, 0)
        hom_sol = sp.dsolve(hom_eq, y_fn)
        steps.append({
            "titulo_paso": "Solución homogénea general y_h(x)",
            "explicacion": "Construimos la combinación lineal de soluciones fundamentales independientes según la naturaleza de las raíces características.",
            "latex": rf"y_h(x) = {sp.latex(hom_sol.rhs)}"
        })

    elif a2 == 0 and a1 != 0 and '1st_linear' in classifications:
        # 1st order linear: show integrating factor mu(x) = exp(int P(x) dx)
        P_x = sp.simplify(a0 / a1)
        mu_x = sp.simplify(sp.exp(sp.integrate(P_x, x)))
        steps.append({
            "titulo_paso": "Cálculo del Factor Integrante \\mu(x) = e^{\\int P(x)\\,dx}",
            "explicacion": f"Normalizamos la EDO lineal de primer orden con P(x) = {sp.latex(P_x)} y calculamos su factor integrante.",
            "latex": rf"\\mu(x) = e^{{\\int ({sp.latex(P_x)})\\,dx}} = {sp.latex(mu_x)}"
        })

    gen_sol = sp.dsolve(eq, y_fn)
    steps.append({
        "titulo_paso": "Solución General Completa y(x) = y_h(x) + y_p(x)",
        "explicacion": "Obtenemos la familia general de curvas integrales mediante integración simbólica (sympy.dsolve).",
        "latex": sp.latex(gen_sol)
    })

    final_tex = sp.latex(gen_sol)

    if ics_part:
        ics_dict = {}
        for item in ics_part.split(','):
            item = item.strip()
            m_y = re.match(r"y\\(([^)]+)\\)\\s*=\\s*(.+)", item)
            m_dy = re.match(r"y'\\(([^)]+)\\)\\s*=\\s*(.+)", item)
            if m_y:
                x_val = sp.sympify(m_y.group(1))
                y_val = sp.sympify(m_y.group(2))
                ics_dict[y_fn.subs(x, x_val)] = y_val
            elif m_dy:
                x_val = sp.sympify(m_dy.group(1))
                dy_val = sp.sympify(m_dy.group(2))
                ics_dict[sp.Derivative(y_fn, x).subs(x, x_val)] = dy_val

        if ics_dict:
            ivp_sol = sp.dsolve(eq, y_fn, ics=ics_dict)
            steps.append({
                "titulo_paso": "Aplicación de Condiciones Iniciales (Problema de Valor Inicial)",
                "explicacion": "Evaluamos las condiciones iniciales dadas sobre la solución general para determinar las constantes de integración.",
                "latex": sp.latex(ivp_sol)
            })
            final_tex = sp.latex(ivp_sol)

    return {"ok": True, "steps": steps, "final_latex": final_tex}


def translate_manualintegrate_rule(rule, steps):
    """Recursively walks sympy.integrals.manualintegrate.integral_steps(f, x) rule tree and emits pedagogical steps."""
    rule_name = rule.__class__.__name__
    integrand = getattr(rule, 'integrand', None)
    var = getattr(rule, 'variable', x)

    if rule_name == "PartsRule":
        u_expr = rule.u
        dv_expr = rule.dv
        v_step = rule.v_step
        v_expr = v_step.eval() if hasattr(v_step, 'eval') else sp.integrate(dv_expr, var)
        du_expr = sp.diff(u_expr, var)
        steps.append({
            "titulo_paso": "Integración por Partes: elección explícita de u y dv",
            "explicacion": "Aplicamos la fórmula \\int u\\,dv = u\\cdot v - \\int v\\,du eligiendo u según la prioridad ILATE y calculando du y v.",
            "latex": rf"u = {sp.latex(u_expr)} \\implies du = {sp.latex(du_expr)}\\,d{sp.latex(var)}, \\qquad dv = {sp.latex(dv_expr)}\\,d{sp.latex(var)} \\implies v = {sp.latex(v_expr)}"
        })
        steps.append({
            "titulo_paso": "Sustitución en el esquema u\\cdot v - \\int v\\,du",
            "explicacion": "Reducimos la integral original a una nueva integral más sencilla.",
            "latex": rf"\\int {sp.latex(integrand)}\\,d{sp.latex(var)} = {sp.latex(u_expr * v_expr)} - \\int {sp.latex(v_expr * du_expr)}\\,d{sp.latex(var)}"
        })
        if hasattr(rule, 'second_step') and rule.second_step:
            translate_manualintegrate_rule(rule.second_step, steps)

    elif rule_name == "URule":
        u_var = rule.u_var
        u_func = rule.u_func
        du_dx = sp.diff(u_func, var)
        steps.append({
            "titulo_paso": "Cambio de Variable (Sustitución u = g(x))",
            "explicacion": "Identificamos una función compuesta junto a su derivada interna y definimos el cambio de variable.",
            "latex": rf"u = {sp.latex(u_func)} \\implies du = {sp.latex(du_dx)}\\,d{sp.latex(var)}"
        })
        if hasattr(rule, 'substep') and rule.substep:
            translate_manualintegrate_rule(rule.substep, steps)

    elif rule_name == "ApartRule":
        steps.append({
            "titulo_paso": "Descomposición en Fracciones Simples (Integración Racional)",
            "explicacion": "Factorizamos el denominador y descomponemos el integrando racional en suma de fracciones parciales elementales.",
            "latex": rf"{sp.latex(integrand)} = {sp.latex(sp.apart(integrand, var))}"
        })
        if hasattr(rule, 'substeps'):
            for sub in rule.substeps:
                translate_manualintegrate_rule(sub, steps)

    elif rule_name == "AddRule":
        steps.append({
            "titulo_paso": "Propiedad de Linealidad de la Integral",
            "explicacion": "Separamos la integral de una suma algebraica en la suma de las integrales de cada término.",
            "latex": " + ".join([rf"\\int {sp.latex(sub.integrand)}\\,d{sp.latex(var)}" for sub in rule.substeps])
        })
        for sub in rule.substeps:
            translate_manualintegrate_rule(sub, steps)

    elif rule_name == "ConstantTimesRule":
        c_val = rule.constant
        other = rule.other
        steps.append({
            "titulo_paso": "Extracción de factor constante fuera de la integral",
            "explicacion": f"Extraemos la constante multiplicativa {sp.latex(c_val)} fuera del operador integral.",
            "latex": rf"\\int {sp.latex(integrand)}\\,d{sp.latex(var)} = {sp.latex(c_val)} \\int {sp.latex(other)}\\,d{sp.latex(var)}"
        })
        if hasattr(rule, 'substep') and rule.substep:
            translate_manualintegrate_rule(rule.substep, steps)

    else:
        # Base / immediate rules (PowerRule, ExpRule, TrigRule, ReciprocalRule, ArctanRule, etc.)
        res_step = sp.integrate(integrand, var)
        steps.append({
            "titulo_paso": f"Regla de integración inmediata ({rule_name.replace('Rule', '')})",
            "explicacion": "Aplicamos la primitiva elemental correspondiente de la tabla de integrales inmediatas.",
            "latex": rf"\\int {sp.latex(integrand)}\\,d{sp.latex(var)} = {sp.latex(res_step)}"
        })


def solve_integrals(expr_str, direction="direct"):
    from sympy.integrals.manualintegrate import integral_steps, manualintegrate
    steps = []
    parts = [p.strip() for p in expr_str.split(';') if p.strip()]
    fn_expr = parse_engineering_expr(parts[0])

    if direction == "direct" and len(parts) == 1:
        steps.append({
            "titulo_paso": "Planteamiento de la Integral Indefinida",
            "explicacion": "Analizamos la estructura del integrando f(x) mediante el motor simbólico de integración de SymPy.",
            "latex": rf"I = \\int \\left({sp.latex(fn_expr)}\\right)\\,dx"
        })
        try:
            rule_tree = integral_steps(fn_expr, x)
            translate_manualintegrate_rule(rule_tree, steps)
        except Exception:
            pass
        prim = manualintegrate(fn_expr, x)
        if prim.has(sp.Integral):
            prim = sp.integrate(fn_expr, x)
        prim = sp.simplify(prim)
        final_tex = rf"\\int {sp.latex(fn_expr)}\\,dx = {sp.latex(prim)} + C"
        steps.append({
            "titulo_paso": "Primitiva general simplificada con constante de integración C",
            "explicacion": "Simplificamos la expresión obtenida (incluyendo funciones especiales como Fresnel o erf si no admite primitiva elemental) y añadimos la constante C \\in \\mathbb{R}.",
            "latex": final_tex
        })
        return {"ok": True, "steps": steps, "final_latex": final_tex}

    else:
        # Definite Integral: f(x) ; a, b
        if len(parts) < 2 or ',' not in parts[1]:
            return {"ok": False, "error": "Para integral definida usa el formato: f(x) ; a, b (ej. x*exp(x) ; 0, 1)"}
        lim_a_s, lim_b_s = [s_lim.strip() for s_lim in parts[1].split(',', 1)]
        lim_a = parse_engineering_expr(lim_a_s)
        lim_b = parse_engineering_expr(lim_b_s)

        steps.append({
            "titulo_paso": "Planteamiento de la Integral Definida",
            "explicacion": f"Calculamos primero la primitiva indefinida F(x) para evaluarla entre los límites x = {sp.latex(lim_a)} y x = {sp.latex(lim_b)}.",
            "latex": rf"I = \\int_{{{sp.latex(lim_a)}}}^{{{sp.latex(lim_b)}}} \\left({sp.latex(fn_expr)}\\right)\\,dx"
        })

        try:
            rule_tree = integral_steps(fn_expr, x)
            translate_manualintegrate_rule(rule_tree, steps)
        except Exception:
            pass
        prim = manualintegrate(fn_expr, x)
        if prim.has(sp.Integral):
            prim = sp.integrate(fn_expr, x)
        prim = sp.simplify(prim)

        val_b = prim.subs(x, lim_b)
        val_a = prim.subs(x, lim_a)
        def_res = sp.simplify(val_b - val_a)
        if def_res.has(sp.Integral) or def_res.has(sp.nan) or def_res.has(sp.zoo):
            def_res = sp.simplify(sp.integrate(fn_expr, (x, lim_a, lim_b)))

        steps.append({
            "titulo_paso": "Aplicación de la Regla de Barrow: F(b) - F(a)",
            "explicacion": "Evaluamos la primitiva F(x) en el extremo superior b y le restamos su valor en el extremo inferior a.",
            "latex": rf"\\Big[ {sp.latex(prim)} \\Big]_{{{sp.latex(lim_a)}}}^{{{sp.latex(lim_b)}}} = \\left({sp.latex(val_b)}\\right) - \\left({sp.latex(val_a)}\\right) = {sp.latex(def_res)}"
        })

        final_tex = rf"\\int_{{{sp.latex(lim_a)}}}^{{{sp.latex(lim_b)}}} {sp.latex(fn_expr)}\\,dx = {sp.latex(def_res)}"
        return {"ok": True, "steps": steps, "final_latex": final_tex}


def solve_taylor(expr_str):
    steps = []
    parts = [p.strip() for p in expr_str.split(';') if p.strip()]
    fn_expr = parse_engineering_expr(parts[0])
    x0_val = parse_engineering_expr(parts[1]) if len(parts) > 1 else sp.Integer(0)
    n_ord = int(parts[2]) if len(parts) > 2 else 4
    n_ord = max(1, min(n_ord, 10))

    series_name = "Maclaurin" if x0_val == 0 else "Taylor"
    steps.append({
        "titulo_paso": f"Planteamiento del Polinomio de {series_name} de orden n = {n_ord} en x_0 = {sp.latex(x0_val)}",
        "explicacion": "Definimos la fórmula general del polinomio de Taylor a partir de las derivadas sucesivas evaluadas en el centro de desarrollo.",
        "latex": rf"P_{{{n_ord}}}(x) = \\sum_{{k=0}}^{{{n_ord}}} \\frac{{f^{{(k)}}({sp.latex(x0_val)})}}{{k!}}\\left(x - {sp.latex(x0_val)}\\right)^k"
    })

    deriv_lines = []
    poly_expr = sp.Integer(0)
    curr_deriv = fn_expr

    for k_idx in range(n_ord + 1):
        if k_idx > 0:
            curr_deriv = sp.diff(curr_deriv, x)
        val_at_x0 = sp.simplify(curr_deriv.subs(x, x0_val))
        coeff_k = sp.simplify(val_at_x0 / sp.factorial(k_idx))
        poly_expr += coeff_k * (x - x0_val)**k_idx
        deriv_lines.append(
            rf"f^{{({k_idx})}}(x) = {sp.latex(curr_deriv)} \\implies f^{{({k_idx})}}({sp.latex(x0_val)}) = {sp.latex(val_at_x0)} \\implies c_{{{k_idx}}} = \\frac{{{sp.latex(val_at_x0)}}}{{{k_idx}!}} = {sp.latex(coeff_k)}"
        )

    steps.append({
        "titulo_paso": f"Tabla de derivadas sucesivas f^{{(k)}}(x) y evaluación en x_0 = {sp.latex(x0_val)}",
        "explicacion": f"Derivamos sucesivamente f(x) desde k = 0 hasta k = {n_ord} y calculamos cada coeficiente de Taylor c_k = f^{{(k)}}(x_0)/k!.",
        "latex": r" \\\\ ".join(deriv_lines)
    })

    final_tex = rf"P_{{{n_ord}}}(x) = {sp.latex(poly_expr)}"
    steps.append({
        "titulo_paso": f"Ensamblaje del Polinomio de {series_name} P_{{{n_ord}}}(x)",
        "explicacion": "Reunimos todos los términos no nulos ordenados por potencias crecientes de (x - x_0).",
        "latex": final_tex
    })

    return {"ok": True, "steps": steps, "final_latex": final_tex}


def aug_matrix_latex(M, n_vars):
    col_spec = "c" * n_vars + "|c"
    rows_str = []
    for r in range(M.rows):
        row_cells = [sp.latex(M[r, c]) for c in range(M.cols)]
        rows_str.append(" & ".join(row_cells))
    body = r" \\\\ ".join(rows_str)
    return rf"\\left(\\begin{{array}}{{{col_spec}}} {body} \\end{{array}}\\right)"


def solve_gauss(expr_str):
    steps = []
    M = parse_matrix_input(expr_str)
    m_rows = M.rows
    total_cols = M.cols
    n_vars = total_cols - 1
    var_names = ['x', 'y', 'z', 'w'][:n_vars]

    steps.append({
        "titulo_paso": f"Planteamiento de la matriz ampliada (A\\,|\\,b) de dimensión {m_rows}\\times {total_cols}",
        "explicacion": "Construimos la matriz aumentada del sistema lineal para aplicar eliminación de Gauss-Jordan.",
        "latex": rf"(A\\,|\\,b) = {aug_matrix_latex(M, n_vars)}"
    })

    A = M.as_mutable()
    pivot_row = 0
    pivot_cols = []

    for col in range(n_vars):
        if pivot_row >= m_rows:
            break
        sel = -1
        for r in range(pivot_row, m_rows):
            if A[r, col] != 0:
                sel = r
                break
        if sel == -1:
            continue

        if sel != pivot_row:
            A.row_swap(pivot_row, sel)
            steps.append({
                "titulo_paso": f"Intercambio de filas: F_{{{pivot_row+1}}} \\leftrightarrow F_{{{sel+1}}}",
                "explicacion": "Permutamos las filas para situar un pivote no nulo en la diagonal.",
                "latex": rf"\\xrightarrow{{F_{{{pivot_row+1}}} \\leftrightarrow F_{{{sel+1}}}}} {aug_matrix_latex(A, n_vars)}"
            })

        p_val = A[pivot_row, col]
        if p_val != 1:
            A.row_op(pivot_row, lambda v, j: sp.simplify(v / p_val))
            steps.append({
                "titulo_paso": f"Normalización de fila pivote: F_{{{pivot_row+1}}} \\leftarrow ({sp.latex(1/p_val)})F_{{{pivot_row+1}}}",
                "explicacion": "Dividimos la fila pivote para obtener un 1 principal.",
                "latex": rf"\\xrightarrow{{F_{{{pivot_row+1}}} \\leftarrow ({sp.latex(1/p_val)})F_{{{pivot_row+1}}}}} {aug_matrix_latex(A, n_vars)}"
            })

        ops_desc = []
        for r in range(m_rows):
            if r == pivot_row:
                continue
            fac = A[r, col]
            if fac != 0:
                A.row_op(r, lambda v, j: sp.simplify(v - fac * A[pivot_row, j]))
                ops_desc.append(rf"F_{{{r+1}}} \\leftarrow F_{{{r+1}}} - ({sp.latex(fac)})F_{{{pivot_row+1}}}")

        if ops_desc:
            steps.append({
                "titulo_paso": f"Eliminación de Gauss-Jordan en columna {col+1}",
                "explicacion": "Anulamos todos los elementos situados por encima y por debajo del pivote actual.",
                "latex": rf"\\xrightarrow{{{', \\; '.join(ops_desc)}}} {aug_matrix_latex(A, n_vars)}"
            })

        pivot_cols.append(col)
        pivot_row += 1

    coeff_mat = A[:, :n_vars]
    rk_A = coeff_mat.rank()
    rk_Ab = A.rank()

    if rk_A < rk_Ab:
        final_tex = rf"\\operatorname{{rg}}(A) = {rk_A} < \\operatorname{{rg}}(A^*) = {rk_Ab} \\implies \\text{{Sistema Incompatible (SI)}}"
        steps.append({
            "titulo_paso": "Teorema de Rouché-Frobenius: Sistema Incompatible (SI)",
            "explicacion": "El rango de la matriz de coeficientes es estrictamente menor que el de la matriz ampliada; el sistema no tiene solución.",
            "latex": final_tex
        })
    elif rk_A == n_vars:
        sols = [rf"{var_names[i]} = {sp.latex(A[i, n_vars])}" for i in range(n_vars)]
        final_tex = rf"\\text{{SCD }} (\\operatorname{{rg}}={n_vars}): \\quad " + r", \\quad ".join(sols)
        steps.append({
            "titulo_paso": "Teorema de Rouché-Frobenius: Sistema Compatible Determinado (SCD)",
            "explicacion": "Los rangos coinciden con el número de incógnitas, obteniendo solución única de la forma escalonada reducida (RREF).",
            "latex": final_tex
        })
    else:
        final_tex = rf"\\text{{SCI }} (\\operatorname{{rg}}(A) = \\operatorname{{rg}}(A^*) = {rk_A} < {n_vars})"
        steps.append({
            "titulo_paso": "Teorema de Rouché-Frobenius: Sistema Compatible Indeterminado (SCI)",
            "explicacion": f"El sistema posee infinitas soluciones dependientes de {n_vars - rk_A} parámetro(s) libre(s).",
            "latex": final_tex
        })

    return {"ok": True, "steps": steps, "final_latex": final_tex}


def replace_polar_tokens_in_str(s_in):
    s_out = s_in.replace('∠', '<').replace('@_', '<')
    # Convert M<deg to (M*(cos(deg*pi/180) + I*sin(deg*pi/180)))
    pattern = r'([+-]?\\d+(?:\\.\\d+)?)\\s*<\\s*([+-]?\\d+(?:\\.\\d+)?)'
    return re.sub(pattern, r'(\\1*(cos((\\2)*pi/180) + I*sin((\\2)*pi/180)))', s_out)


def solve_phasors(expr_str, direction="direct"):
    steps = []
    s_polar_conv = replace_polar_tokens_in_str(expr_str)

    if direction == "direct":
        z_expr = parse_engineering_expr(s_polar_conv)
        z_eval = sp.expand_complex(z_expr)
        re_val = sp.N(sp.re(z_eval), 5)
        im_val = sp.N(sp.im(z_eval), 5)
        mag_val = sp.N(sp.sqrt(re_val**2 + im_val**2), 5)
        ang_deg = sp.N(sp.atan2(im_val, re_val) * 180 / sp.pi, 4)

        steps.append({
            "titulo_paso": "Conversión de fasores a forma binómica cartesiana (a + jb)",
            "explicacion": "Reescribimos todos los términos polares M\\angle\\theta^\\circ mediante la identidad de Euler M(\\cos\\theta + j\\sin\\theta) y agrupamos parte real e imaginaria.",
            "latex": rf"\\mathbb{{Z}} = {sp.latex(re_val)} + j({sp.latex(im_val)})"
        })

        steps.append({
            "titulo_paso": "Cálculo del módulo y del argumento con ajuste de cuadrante",
            "explicacion": "Evaluamos el módulo |\\mathbb{Z}| = \\sqrt{a^2 + b^2} y la fase \\theta = \\operatorname{atan2}(b, a) en grados sexagesimales.",
            "latex": rf"|\\mathbb{{Z}}| = \\sqrt{{({sp.latex(re_val)})^2 + ({sp.latex(im_val)})^2}} = {sp.latex(mag_val)}, \\qquad \\theta = {sp.latex(ang_deg)}^\\circ"
        })

        final_tex = rf"\\mathbb{{Z}} = {sp.latex(re_val)} + j({sp.latex(im_val)}) = {sp.latex(mag_val)}\\angle {sp.latex(ang_deg)}^\\circ"
        steps.append({
            "titulo_paso": "Resultado fasorial en forma binómica y polar",
            "explicacion": "Presentamos la equivalencia fasorial completa.",
            "latex": final_tex
        })
        return {"ok": True, "steps": steps, "final_latex": final_tex}

    else:
        # Complex Linear System (2x2 or 3x3 AC circuit)
        rows = [r.strip() for r in s_polar_conv.split(';') if r.strip()]
        mat_data = []
        for r in rows:
            cols = [sp.expand_complex(parse_engineering_expr(c.strip())) for c in r.split(',') if c.strip()]
            mat_data.append(cols)
        M = sp.Matrix(mat_data)
        n_v = M.cols - 1
        Z_mat = M[:, :n_v]
        V_vec = M[:, n_v]

        steps.append({
            "titulo_paso": f"Matriz de impedancias compleja \\mathbb{{Z}} ({n_v}\\times {n_v}) y vector de excitación \\vec{{\\mathbb{{V}}}}",
            "explicacion": "Expresamos el sistema de mallas/nudos en corriente alterna en forma matricial \\mathbb{Z}\\vec{\\mathbb{I}} = \\vec{\\mathbb{V}}.",
            "latex": rf"\\mathbb{{Z}} = {sp.latex(Z_mat)}, \\qquad \\vec{{\\mathbb{{V}}}} = {sp.latex(V_vec)}"
        })

        sol_vec = Z_mat.LUsolve(V_vec)
        sol_lines = []
        for idx in range(n_v):
            val_c = sp.expand_complex(sol_vec[idx])
            re_c = sp.N(sp.re(val_c), 4)
            im_c = sp.N(sp.im(val_c), 4)
            mag_c = sp.N(sp.sqrt(re_c**2 + im_c**2), 4)
            ang_c = sp.N(sp.atan2(im_c, re_c) * 180 / sp.pi, 4)
            sol_lines.append(rf"\\mathbb{{I}}_{{{idx+1}}} = {sp.latex(re_c)} + j({sp.latex(im_c)}) = {sp.latex(mag_c)}\\angle {sp.latex(ang_c)}^\\circ")

        final_tex = r", \\quad ".join(sol_lines)
        steps.append({
            "titulo_paso": "Resolución simbólica de los fasores de corriente/tensión en forma binómica y polar",
            "explicacion": "Calculamos cada incógnita fasorial indicando su amplitud y ángulo de fase en grados.",
            "latex": r" \\\\ ".join(sol_lines)
        })
        return {"ok": True, "steps": steps, "final_latex": final_tex}


def dispatch_calculation(tool, expr_str, direction="direct"):
    try:
        if tool == "fourier":
            res = solve_fourier(expr_str, direction)
        elif tool == "laplace":
            res = solve_laplace(expr_str, direction)
        elif tool == "matrix":
            res = solve_diagonalization(expr_str)
        elif tool == "ztransform":
            res = solve_ztransform(expr_str, direction)
        elif tool == "convolution":
            res = solve_convolution(expr_str, direction)
        elif tool == "ode":
            res = solve_ode(expr_str)
        elif tool == "integrals":
            res = solve_integrals(expr_str, direction)
        elif tool == "taylor":
            res = solve_taylor(expr_str)
        elif tool == "gauss":
            res = solve_gauss(expr_str)
        elif tool == "phasors":
            res = solve_phasors(expr_str, direction)
        else:
            res = {"ok": False, "error": f"Herramienta desconocida: {tool}"}
        return json.dumps(res)
    except Exception as e:
        return json.dumps({"ok": False, "error": str(e)})
`;

async function initPyodideEngine() {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = (async () => {
    self.postMessage({ type: "STATUS", status: "loading", message: "Cargando motor simbólico (Pyodide + SymPy)..." });
    importScripts(PYODIDE_INDEX_URL + "pyodide.js");
    pyodideInstance = await self.loadPyodide({
      indexURL: PYODIDE_INDEX_URL
    });
    self.postMessage({ type: "STATUS", status: "loading", message: "Inicializando paquetes CAS (SymPy)..." });
    await pyodideInstance.loadPackage(["sympy"]);
    await pyodideInstance.runPythonAsync(PYTHON_SOLVER_SCRIPT);
    self.postMessage({ type: "STATUS", status: "ready", message: "Motor SymPy (WASM) activo" });
    return pyodideInstance;
  })();

  return pyodideReadyPromise;
}

self.addEventListener("message", async (event) => {
  const { id, action, payload } = event.data;

  if (action === "INIT") {
    try {
      await initPyodideEngine();
    } catch (err) {
      self.postMessage({
        type: "STATUS",
        status: "error",
        message: "Modo híbrido local activo",
        error: err.message
      });
    }
    return;
  }

  if (action === "SOLVE") {
    try {
      const pyodide = await initPyodideEngine();
      const { tool, expr, direction } = payload;
      pyodide.globals.set("_req_tool", tool);
      pyodide.globals.set("_req_expr", expr);
      pyodide.globals.set("_req_dir", direction || "direct");

      const rawJson = await pyodide.runPythonAsync(
        `dispatch_calculation(_req_tool, _req_expr, _req_dir)`
      );
      const parsed = JSON.parse(rawJson);
      self.postMessage({ type: "RESULT", id, result: parsed, engine: "Pyodide + SymPy (WASM)" });
    } catch (err) {
      self.postMessage({
        type: "RESULT",
        id,
        result: { ok: false, error: err.message },
        engine: "Pyodide Error"
      });
    }
  }
});
