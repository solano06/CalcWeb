/**
 * CalcWeb Parametric Exam Exercise Generator
 * Generates varied, non-degenerate exercises across all 15 CalcWeb modules,
 * guaranteed to be solvable in 0 ms by solveWithHybridEngine().
 */

import { getLocalizedCatalog } from "./catalog.js";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickDistinctPair(arr) {
  const a = pick(arr);
  let b = pick(arr);
  while (b === a) {
    b = pick(arr);
  }
  return [a, b];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fmtCoeff(c, isFirst = false) {
  if (isFirst) {
    if (c === 1) return "";
    if (c === -1) return "-";
    return `${c}`;
  }
  if (c === 1) return "+ ";
  if (c === -1) return "- ";
  return c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
}

function fmtConst(c) {
  return c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
}

function fmtExprSigned(c) {
  return c >= 0 ? `+${c}` : `${c}`;
}

function matrixToInlineLatex(M) {
  const rows = M.map((r) => r.join(" & ")).join(" \\\\ ");
  return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
}

function matrixToExpr(M) {
  return M.map((r) => r.join(", ")).join("; ");
}

function systemToLatex(M) {
  const vars = ["x", "y", "z"];
  const lines = M.map((row) => {
    const nVars = row.length - 1;
    const terms = [];
    for (let j = 0; j < nVars; j++) {
      const c = row[j];
      if (c === 0) continue;
      if (terms.length === 0) {
        terms.push(`${c === 1 ? "" : c === -1 ? "-" : c}${vars[j]}`);
      } else {
        terms.push(`${c >= 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${vars[j]}`);
      }
    }
    if (terms.length === 0) terms.push("0");
    return `${terms.join(" ")} = ${row[nVars]}`;
  });
  return `\\begin{cases} ${lines.join(" \\\\ ")} \\end{cases}`;
}

const PROMPTS = {
  es: {
    integrals_direct: "Calcula la siguiente integral indefinida paso a paso:",
    integrals_def: "Calcula la siguiente integral definida aplicando la Regla de Barrow:",
    ode_1: "Resuelve la siguiente ecuación diferencial ordinaria de 1º orden:",
    ode_2: "Resuelve la siguiente ecuación diferencial lineal de 2º orden:",
    taylor: (fn, x0, n) => `Obtén el polinomio de Taylor de orden n = ${n} en torno a x₀ = ${x0}:`,
    fourierseries_trig: "Halla la serie trigonométrica de Fourier en [-π, π]:",
    fourierseries_exp: "Halla la serie exponencial compleja de Fourier en [-π, π]:",
    numseries: "Analiza la convergencia de la serie numérica y halla su suma si converge:",
    limits: "Calcula el siguiente límite paso a paso (usando L'Hôpital si aplica):",
    laplace_direct: "Calcula la Transformada de Laplace directa F(s) = ℒ{f(t)}:",
    laplace_inverse: "Calcula la Transformada Inversa de Laplace f(t) = ℒ⁻¹{F(s)}:",
    fourier_direct: "Calcula la Transformada de Fourier directa F(ω) = ℱ{f(t)}:",
    fourier_inverse: "Calcula la Transformada Inversa de Fourier f(t) = ℱ⁻¹{F(ω)}:",
    ztransform_direct: "Calcula la Transformada Z directa X(z) y su ROC:",
    ztransform_inverse: "Calcula la Transformada Z inversa x[n] por el método X(z)/z:",
    convolution_cont: "Calcula la convolución continua y(t) = x(t) * h(t):",
    convolution_disc: "Calcula la convolución discreta y[n] = x[n] * h[n]:",
    bode: "Analiza polos, ceros, estabilidad y trazado asintótico de Bode para H(s):",
    matrix: "Calcula autovalores, autovectores y diagonaliza A = P·D·P⁻¹:",
    gauss: "Resuelve el sistema de ecuaciones lineales por Gauss-Jordan:",
    phasors_conv: "Convierte el fasor entre forma binómica y polar:",
    phasors_op: "Realiza la operación fasorial y expresa el resultado en binómica y polar:",
    phasors_par: "Calcula la impedancia equivalente en paralelo Z₁ ∥ Z₂:",
    matops: "Calcula el determinante, rango e inversa de la matriz A:"
  },
  en: {
    integrals_direct: "Compute the following indefinite integral step by step:",
    integrals_def: "Evaluate the following definite integral using Barrow's rule:",
    ode_1: "Solve the following 1st-order ordinary differential equation:",
    ode_2: "Solve the following 2nd-order linear differential equation:",
    taylor: (_fn, x0, n) => `Find the Taylor polynomial of order n = ${n} centered at x₀ = ${x0}:`,
    fourierseries_trig: "Find the trigonometric Fourier series on [-π, π]:",
    fourierseries_exp: "Find the complex exponential Fourier series on [-π, π]:",
    numseries: "Test the convergence of the numerical series and find its sum if convergent:",
    limits: "Evaluate the following limit step by step (using L'Hôpital's rule if needed):",
    laplace_direct: "Compute the forward Laplace Transform F(s) = ℒ{f(t)}:",
    laplace_inverse: "Compute the Inverse Laplace Transform f(t) = ℒ⁻¹{F(s)}:",
    fourier_direct: "Compute the forward Fourier Transform F(ω) = ℱ{f(t)}:",
    fourier_inverse: "Compute the Inverse Fourier Transform f(t) = ℱ⁻¹{F(ω)}:",
    ztransform_direct: "Compute the forward Z-Transform X(z) and its ROC:",
    ztransform_inverse: "Compute the Inverse Z-Transform x[n] via the X(z)/z method:",
    convolution_cont: "Compute the continuous convolution y(t) = x(t) * h(t):",
    convolution_disc: "Compute the discrete convolution y[n] = x[n] * h[n]:",
    bode: "Analyze poles, zeros, stability, and Bode asymptotes for H(s):",
    matrix: "Find eigenvalues, eigenvectors, and diagonalize A = P·D·P⁻¹:",
    gauss: "Solve the linear system via Gauss-Jordan elimination:",
    phasors_conv: "Convert the phasor between rectangular and polar form:",
    phasors_op: "Evaluate the phasor operation in rectangular and polar forms:",
    phasors_par: "Compute the parallel equivalent impedance Z₁ ∥ Z₂:",
    matops: "Compute the determinant, rank, and inverse of matrix A:"
  },
  fr: {
    integrals_direct: "Calculez l'intégrale indéfinie suivante étape par étape :",
    integrals_def: "Calculez l'intégrale définie suivante par la règle de Barrow :",
    ode_1: "Résolvez l'équation différentielle ordinaire du 1er ordre suivante :",
    ode_2: "Résolvez l'équation différentielle linéaire du 2e ordre suivante :",
    taylor: (_fn, x0, n) => `Déterminez le polynôme de Taylor d'ordre n = ${n} autour de x₀ = ${x0} :`,
    fourierseries_trig: "Déterminez la série trigonométrique de Fourier sur [-π, π] :",
    fourierseries_exp: "Déterminez la série exponentielle complexe de Fourier sur [-π, π] :",
    numseries: "Étudiez la convergence de la série numérique et calculez sa somme si elle converge :",
    limits: "Calculez la limite suivante étape par étape (avec la règle de L'Hôpital si besoin) :",
    laplace_direct: "Calculez la transformée de Laplace directe F(s) = ℒ{f(t)} :",
    laplace_inverse: "Calculez la transformée inverse de Laplace f(t) = ℒ⁻¹{F(s)} :",
    fourier_direct: "Calculez la transformée de Fourier directe F(ω) = ℱ{f(t)} :",
    fourier_inverse: "Calculez la transformée inverse de Fourier f(t) = ℱ⁻¹{F(ω)} :",
    ztransform_direct: "Calculez la transformée en Z directe X(z) et sa ROC :",
    ztransform_inverse: "Calculez la transformée en Z inverse x[n] par la méthode X(z)/z :",
    convolution_cont: "Calculez la convolution continue y(t) = x(t) * h(t) :",
    convolution_disc: "Calculez la convolution discrète y[n] = x[n] * h[n] :",
    bode: "Analysez pôles, zéros, stabilité et tracé asymptotique de Bode pour H(s) :",
    matrix: "Calculez valeurs propres, vecteurs propres et diagonalisez A = P·D·P⁻¹ :",
    gauss: "Résolvez le système linéaire par la méthode du pivot de Gauss-Jordan :",
    phasors_conv: "Convertissez le phaseur entre forme algébrique et polaire :",
    phasors_op: "Effectuez l'opération sur les phaseurs en formes algébrique et polaire :",
    phasors_par: "Calculez l'impédance équivalente en parallèle Z₁ ∥ Z₂ :",
    matops: "Calculez le déterminant, le rang et l'inverse de la matrice A :"
  }
};

function getPrompt(lang, key, ...args) {
  const dict = PROMPTS[lang] || PROMPTS.es;
  const val = dict[key] || PROMPTS.es[key];
  return typeof val === "function" ? val(...args) : val;
}

const TOPIC_GENERATORS = {
  integrals(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const a = pick([-4, -3, -2, -1, 2, 3, 4, 5]);
      const aLatex = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
      return {
        direction: "direct",
        expr: `x*exp(${a}*x)`,
        promptText: getPrompt(lang, "integrals_direct"),
        statementLatex: `\\int x e^{${aLatex}}\\,dx`
      };
    }
    if (variant === 1) {
      const a = randInt(1, 12);
      return {
        direction: "direct",
        expr: `2*x/(x^2 + ${a})`,
        promptText: getPrompt(lang, "integrals_direct"),
        statementLatex: `\\int \\frac{2x}{x^2 + ${a}}\\,dx`
      };
    }
    if (variant === 2) {
      const a = randInt(1, 6);
      const a2 = a * a;
      return {
        direction: "direct",
        expr: `1/(x^2 - ${a2})`,
        promptText: getPrompt(lang, "integrals_direct"),
        statementLatex: `\\int \\frac{1}{x^2 - ${a2}}\\,dx`
      };
    }
    return {
      direction: "inverse",
      expr: "x*exp(x) ; 0, 1",
      promptText: getPrompt(lang, "integrals_def"),
      statementLatex: `\\int_{0}^{1} x e^{x}\\,dx`
    };
  },

  ode(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const p = randInt(1, 5);
      const K = randInt(1, 6);
      let a = pick([-3, -2, -1, 1, 2, 3, 4]);
      if (p + a === 0) a += 1;
      const withIv = randInt(0, 1) === 1;
      const y0 = randInt(1, 5);
      const kStr = K === 1 ? "" : `${K}`;
      const aStr = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
      const expr = withIv ? `y' + ${p}*y = ${K}*exp(${a}*x) ; y(0)=${y0}` : `y' + ${p}*y = ${K}*exp(${a}*x)`;
      const statementLatex = withIv
        ? `y' + ${p}y = ${kStr}e^{${aStr}}, \\quad y(0) = ${y0}`
        : `y' + ${p}y = ${kStr}e^{${aStr}}`;
      return { direction: "direct", expr, promptText: getPrompt(lang, "ode_1"), statementLatex };
    }
    if (variant === 1) {
      const k = pick([2, 4, 6]);
      const y0 = randInt(1, 5);
      const withIv = randInt(0, 1) === 1;
      const expr = withIv ? `y' = ${k}*x*y ; y(0)=${y0}` : `y' = ${k}*x*y`;
      const statementLatex = withIv ? `y' = ${k}xy, \\quad y(0) = ${y0}` : `y' = ${k}xy`;
      return { direction: "direct", expr, promptText: getPrompt(lang, "ode_1"), statementLatex };
    }
    if (variant === 2) {
      const [r1, r2] = pickDistinctPair([1, 2, 3, 4]);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const a = pick([5, 6, -1, -2]);
      const K = randInt(2, 8);
      const expr = `y'' ${fmtExprSigned(b)}*y' ${fmtExprSigned(c)}*y = ${K}*exp(${a}*x)`;
      const statementLatex = `y'' ${fmtConst(b)}y' ${fmtConst(c)}y = ${K}e^{${a}x}`;
      return { direction: "direct", expr, promptText: getPrompt(lang, "ode_2"), statementLatex };
    }
    const w0 = randInt(2, 5);
    const w0sq = w0 * w0;
    const y0 = randInt(1, 4);
    const dy0 = w0 * randInt(1, 3);
    return {
      direction: "direct",
      expr: `y'' + ${w0sq}*y = 0 ; y(0)=${y0}, y'(0)=${dy0}`,
      promptText: getPrompt(lang, "ode_2"),
      statementLatex: `y'' + ${w0sq}y = 0, \\quad y(0) = ${y0}, \\; y'(0) = ${dy0}`
    };
  },

  taylor(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const n = randInt(3, 6);
      return {
        direction: "direct",
        expr: `exp(x) ; 0 ; ${n}`,
        promptText: getPrompt(lang, "taylor", "e^x", 0, n),
        statementLatex: `f(x) = e^{x}, \\quad x_0 = 0, \\quad n = ${n}`
      };
    }
    if (variant === 1) {
      const n = pick([4, 6, 8]);
      return {
        direction: "direct",
        expr: `cos(x) ; 0 ; ${n}`,
        promptText: getPrompt(lang, "taylor", "\\cos(x)", 0, n),
        statementLatex: `f(x) = \\cos(x), \\quad x_0 = 0, \\quad n = ${n}`
      };
    }
    if (variant === 2) {
      const n = randInt(3, 5);
      return {
        direction: "direct",
        expr: `ln(x) ; 1 ; ${n}`,
        promptText: getPrompt(lang, "taylor", "\\ln(x)", 1, n),
        statementLatex: `f(x) = \\ln(x), \\quad x_0 = 1, \\quad n = ${n}`
      };
    }
    const n = randInt(3, 6);
    return {
      direction: "direct",
      expr: `1/(1-x) ; 0 ; ${n}`,
      promptText: getPrompt(lang, "taylor", "1/(1-x)", 0, n),
      statementLatex: `f(x) = \\frac{1}{1 - x}, \\quad x_0 = 0, \\quad n = ${n}`
    };
  },

  fourierseries(lang) {
    const variant = randInt(0, 3);
    const nHarm = randInt(3, 6);
    if (variant === 0) {
      const dir = pick(["direct", "inverse"]);
      return {
        direction: dir,
        expr: `x ; pi ; ${nHarm}`,
        promptText: getPrompt(lang, dir === "direct" ? "fourierseries_trig" : "fourierseries_exp"),
        statementLatex: `f(x) = x, \\quad x \\in [-\\pi, \\pi], \\quad N = ${nHarm}`
      };
    }
    if (variant === 1) {
      const dir = pick(["direct", "inverse"]);
      const oddH = pick([3, 5, 7]);
      return {
        direction: dir,
        expr: `sign(x) ; pi ; ${oddH}`,
        promptText: getPrompt(lang, dir === "direct" ? "fourierseries_trig" : "fourierseries_exp"),
        statementLatex: `f(x) = \\operatorname{sgn}(x), \\quad x \\in [-\\pi, \\pi], \\quad N = ${oddH}`
      };
    }
    if (variant === 2) {
      const dir = pick(["direct", "inverse"]);
      return {
        direction: dir,
        expr: `x^2 ; pi ; ${nHarm}`,
        promptText: getPrompt(lang, dir === "direct" ? "fourierseries_trig" : "fourierseries_exp"),
        statementLatex: `f(x) = x^2, \\quad x \\in [-\\pi, \\pi], \\quad N = ${nHarm}`
      };
    }
    const oddH = pick([3, 5, 7]);
    return {
      direction: "direct",
      expr: `abs(x) ; pi ; ${oddH}`,
      promptText: getPrompt(lang, "fourierseries_trig"),
      statementLatex: `f(x) = |x|, \\quad x \\in [-\\pi, \\pi], \\quad N = ${oddH}`
    };
  },

  numseries(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const b = randInt(2, 7);
      const n0 = pick([0, 1, 2]);
      return {
        direction: "direct",
        expr: `1/${b}^n ; ${n0}`,
        promptText: getPrompt(lang, "numseries"),
        statementLatex: `\\sum_{n=${n0}}^{\\infty} \\frac{1}{${b}^n}`
      };
    }
    if (variant === 1) {
      const k = randInt(2, 6);
      const n0 = pick([0, 1]);
      return {
        direction: "direct",
        expr: `${k}^n / factorial(n) ; ${n0}`,
        promptText: getPrompt(lang, "numseries"),
        statementLatex: `\\sum_{n=${n0}}^{\\infty} \\frac{${k}^n}{n!}`
      };
    }
    if (variant === 2) {
      const n0 = pick([1, 2]);
      return {
        direction: "direct",
        expr: `n / (n + 1) ; ${n0}`,
        promptText: getPrompt(lang, "numseries"),
        statementLatex: `\\sum_{n=${n0}}^{\\infty} \\frac{n}{n + 1}`
      };
    }
    const isPlus1 = randInt(0, 1) === 1;
    const expr = isPlus1 ? "(-1)^(n+1)/n ; 1" : "(-1)^n/n ; 1";
    const pow = isPlus1 ? "n+1" : "n";
    return {
      direction: "direct",
      expr,
      promptText: getPrompt(lang, "numseries"),
      statementLatex: `\\sum_{n=1}^{\\infty} \\frac{(-1)^{${pow}}}{n}`
    };
  },

  limits(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const a = randInt(2, 9);
      let b = randInt(1, 7);
      if (a === b) b += 1;
      const bStr = b === 1 ? "" : `${b}`;
      return {
        direction: "direct",
        expr: `sin(${a}*x)/(${b}*x) ; 0`,
        promptText: getPrompt(lang, "limits"),
        statementLatex: `\\lim_{x \\to 0} \\frac{\\sin(${a}x)}{${bStr}x}`
      };
    }
    if (variant === 1) {
      return {
        direction: "direct",
        expr: `(exp(x) - 1 - x)/x^2 ; 0`,
        promptText: getPrompt(lang, "limits"),
        statementLatex: `\\lim_{x \\to 0} \\frac{e^x - 1 - x}{x^2}`
      };
    }
    if (variant === 2) {
      const a2 = randInt(2, 6);
      const a1 = pick([-5, -3, -2, 2, 3, 5]);
      const b2 = randInt(1, 4);
      const b0 = pick([-6, -4, -1, 1, 3, 5]);
      return {
        direction: "direct",
        expr: `(${a2}*x^2 ${fmtExprSigned(a1)}*x)/(${b2}*x^2 ${fmtExprSigned(b0)}) ; oo`,
        promptText: getPrompt(lang, "limits"),
        statementLatex: `\\lim_{x \\to \\infty} \\frac{${a2}x^2 ${fmtConst(a1)}x}{${b2 === 1 ? "" : b2}x^2 ${fmtConst(b0)}}`
      };
    }
    const a = pick([-4, -3, -2, 2, 3, 4, 5]);
    return {
      direction: "direct",
      expr: `(1 + ${a}/x)^x ; oo`,
      promptText: getPrompt(lang, "limits"),
      statementLatex: `\\lim_{x \\to \\infty} \\left(1 + \\frac{${a}}{x}\\right)^x`
    };
  },

  laplace(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const K = randInt(1, 5);
      const a = randInt(1, 5);
      const b = randInt(2, 7);
      const fn = pick(["cos", "sin"]);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "direct",
        expr: `${K}*exp(-${a}*t)*${fn}(${b}*t)`,
        promptText: getPrompt(lang, "laplace_direct"),
        statementLatex: `f(t) = ${kStr}e^{-${a}t}\\${fn}(${b}t)`
      };
    }
    if (variant === 1) {
      const K = randInt(1, 4);
      const n = randInt(2, 4);
      const a = randInt(1, 6);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "direct",
        expr: `${K}*t^${n}*exp(-${a}*t)`,
        promptText: getPrompt(lang, "laplace_direct"),
        statementLatex: `f(t) = ${kStr}t^{${n}}e^{-${a}t}`
      };
    }
    if (variant === 2) {
      const [r1, r2] = pickDistinctPair([1, 2, 3, 4, 5]);
      const b = r1 + r2;
      const c = r1 * r2;
      const p = randInt(1, 4);
      const q = randInt(1, 9);
      return {
        direction: "inverse",
        expr: `(${p}*s + ${q})/(s^2 + ${b}*s + ${c})`,
        promptText: getPrompt(lang, "laplace_inverse"),
        statementLatex: `F(s) = \\frac{${p === 1 ? "" : p}s + ${q}}{s^2 + ${b}s + ${c}}`
      };
    }
    const K = randInt(2, 9);
    const a = randInt(1, 5);
    return {
      direction: "inverse",
      expr: `${K}/(s*(s + ${a})^2)`,
      promptText: getPrompt(lang, "laplace_inverse"),
      statementLatex: `F(s) = \\frac{${K}}{s(s + ${a})^2}`
    };
  },

  fourier(lang) {
    const variant = randInt(0, 4);
    if (variant === 0) {
      const K = randInt(1, 5);
      const a = randInt(1, 7);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "direct",
        expr: `${K}*exp(-${a}*t)*u(t)`,
        promptText: getPrompt(lang, "fourier_direct"),
        statementLatex: `f(t) = ${kStr}e^{-${a}t}u(t)`
      };
    }
    if (variant === 1) {
      const K = randInt(1, 4);
      const a = randInt(1, 6);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "direct",
        expr: `${K}*t*exp(-${a}*t)*u(t)`,
        promptText: getPrompt(lang, "fourier_direct"),
        statementLatex: `f(t) = ${kStr}t e^{-${a}t}u(t)`
      };
    }
    if (variant === 2) {
      const A = randInt(1, 5);
      const T = pick([2, 4, 6, 8]);
      const aStr = A === 1 ? "" : `${A}\\,`;
      return {
        direction: "direct",
        expr: `${A}*rect(t/${T})`,
        promptText: getPrompt(lang, "fourier_direct"),
        statementLatex: `f(t) = ${aStr}\\text{rect}\\!\\left(\\frac{t}{${T}}\\right)`
      };
    }
    if (variant === 3) {
      const K = randInt(1, 8);
      const a = randInt(1, 7);
      return {
        direction: "inverse",
        expr: `${K}/(${a} + j*w)`,
        promptText: getPrompt(lang, "fourier_inverse"),
        statementLatex: `F(\\omega) = \\frac{${K}}{${a} + j\\omega}`
      };
    }
    const a = randInt(2, 6);
    const scale = randInt(1, 4);
    const num = 2 * a * scale;
    const a2 = a * a;
    return {
      direction: "inverse",
      expr: `${num}/(${a2} + w^2)`,
      promptText: getPrompt(lang, "fourier_inverse"),
      statementLatex: `F(\\omega) = \\frac{${num}}{${a2} + \\omega^2}`
    };
  },

  ztransform(lang) {
    const variant = randInt(0, 4);
    if (variant === 0) {
      const K = randInt(1, 5);
      const [a, b] = pickDistinctPair([1, 2, 3, 4, 5]);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "inverse",
        expr: `${K}*z/((z - ${a})*(z - ${b}))`,
        promptText: getPrompt(lang, "ztransform_inverse"),
        statementLatex: `X(z) = \\frac{${kStr}z}{(z - ${a})(z - ${b})}`
      };
    }
    if (variant === 1) {
      const [r1, r2] = pickDistinctPair([1, 2, 3, 4, 5]);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const p = randInt(1, 4);
      const q = pick([-6, -4, -2, 2, 4, 5]);
      return {
        direction: "inverse",
        expr: `(${p}*z^2 ${fmtExprSigned(q)}*z)/(z^2 ${fmtExprSigned(b)}*z ${fmtExprSigned(c)})`,
        promptText: getPrompt(lang, "ztransform_inverse"),
        statementLatex: `X(z) = \\frac{${p === 1 ? "" : p}z^2 ${fmtConst(q)}z}{z^2 ${fmtConst(b)}z ${fmtConst(c)}}`
      };
    }
    if (variant === 2) {
      const K = randInt(1, 6);
      const a = randInt(2, 5);
      const kStr = K === 1 ? "" : `${K}`;
      return {
        direction: "inverse",
        expr: `${K}*z/(z - ${a})^2`,
        promptText: getPrompt(lang, "ztransform_inverse"),
        statementLatex: `X(z) = \\frac{${kStr}z}{(z - ${a})^2}`
      };
    }
    if (variant === 3) {
      const a = randInt(2, 7);
      return {
        direction: "direct",
        expr: `${a}^n*u[n]`,
        promptText: getPrompt(lang, "ztransform_direct"),
        statementLatex: `x[n] = ${a}^n u[n]`
      };
    }
    const a = randInt(2, 6);
    return {
      direction: "direct",
      expr: `n*${a}^n*u[n]`,
      promptText: getPrompt(lang, "ztransform_direct"),
      statementLatex: `x[n] = n\\cdot ${a}^n u[n]`
    };
  },

  convolution(lang) {
    const variant = randInt(0, 2);
    if (variant === 0) {
      const [a, b] = pickDistinctPair([1, 2, 3, 4, 5, 6]);
      return {
        direction: "direct",
        expr: `exp(-${a}*t)*u(t) ; exp(-${b}*t)*u(t)`,
        promptText: getPrompt(lang, "convolution_cont"),
        statementLatex: `x(t) = e^{-${a}t}u(t), \\qquad h(t) = e^{-${b}t}u(t)`
      };
    }
    if (variant === 1) {
      const a = randInt(2, 7);
      return {
        direction: "direct",
        expr: `exp(-${a}*t)*u(t) ; u(t)`,
        promptText: getPrompt(lang, "convolution_cont"),
        statementLatex: `x(t) = e^{-${a}t}u(t), \\qquad h(t) = u(t)`
      };
    }
    const xArr = [randInt(1, 3), randInt(-2, 4), randInt(1, 3)];
    const hArr = [randInt(1, 3), randInt(-3, 3), randInt(1, 4)];
    return {
      direction: "inverse",
      expr: `${JSON.stringify(xArr)} ; ${JSON.stringify(hArr)}`,
      promptText: getPrompt(lang, "convolution_disc"),
      statementLatex: `x[n] = \\{${xArr.join(", ")}\\}, \\qquad h[n] = \\{${hArr.join(", ")}\\}`
    };
  },

  bode(lang) {
    const variant = randInt(0, 3);
    if (variant === 0) {
      const K = randInt(2, 20);
      const p = randInt(1, 10);
      return {
        direction: "direct",
        expr: `${K}/(s + ${p})`,
        promptText: getPrompt(lang, "bode"),
        statementLatex: `H(s) = \\frac{${K}}{s + ${p}}`
      };
    }
    if (variant === 1) {
      const K = randInt(2, 12);
      const p = randInt(2, 10);
      return {
        direction: "direct",
        expr: `${K}*s/(s + ${p})`,
        promptText: getPrompt(lang, "bode"),
        statementLatex: `H(s) = \\frac{${K}s}{s + ${p}}`
      };
    }
    if (variant === 2) {
      const K = randInt(4, 25);
      const wn = randInt(2, 5);
      const b = wn * wn;
      const a = randInt(2, 8);
      return {
        direction: "direct",
        expr: `${K}/(s^2 + ${a}*s + ${b})`,
        promptText: getPrompt(lang, "bode"),
        statementLatex: `H(s) = \\frac{${K}}{s^2 + ${a}s + ${b}}`
      };
    }
    const K = randInt(2, 10);
    const z = randInt(1, 5);
    const p = randInt(6, 12);
    return {
      direction: "direct",
      expr: `${K}*(s + ${z})/(s*(s + ${p}))`,
      promptText: getPrompt(lang, "bode"),
      statementLatex: `H(s) = \\frac{${K}(s + ${z})}{s(s + ${p})}`
    };
  },

  matrix(lang) {
    // Construct 2x2 matrix A = P * diag(l1, l2) * P^-1 with det(P) = 1 so A has clean integer entries & eigenvalues
    const [l1, l2] = pickDistinctPair([-3, -2, -1, 1, 2, 3, 4, 5]);
    const p12 = pick([-1, 0, 1, 2]);
    const p21 = p12 === 0 ? pick([-2, -1, 1, 2]) : 0;
    // P = [[1, p12], [p21, 1]], P^-1 = [[1, -p12], [-p21, 1]] (since p12*p21 == 0 => det(P) = 1)
    const a11 = l1 - p12 * p21 * l2;
    const a12 = p12 * (l2 - l1);
    const a21 = p21 * (l1 - l2);
    const a22 = l2 - p12 * p21 * l1;
    const M = [
      [a11, a12],
      [a21, a22]
    ];
    return {
      direction: "direct",
      expr: matrixToExpr(M),
      promptText: getPrompt(lang, "matrix"),
      statementLatex: `A = ${matrixToInlineLatex(M)}`
    };
  },

  gauss(lang) {
    const is3x3 = randInt(0, 1) === 1;
    if (!is3x3) {
      const x = randInt(-3, 4);
      const y = randInt(-3, 4);
      const a11 = pick([1, 2, -1]);
      const a12 = pick([1, 2, 3, -2]);
      const a21 = pick([1, 2, 3]);
      let a22 = pick([-2, -1, 1, 2, 3]);
      if (a11 * a22 - a12 * a21 === 0) a22 += 1;
      const b1 = a11 * x + a12 * y;
      const b2 = a21 * x + a22 * y;
      const M = [
        [a11, a12, b1],
        [a21, a22, b2]
      ];
      return {
        direction: "direct",
        expr: matrixToExpr(M),
        promptText: getPrompt(lang, "gauss"),
        statementLatex: systemToLatex(M)
      };
    }
    const x = randInt(-2, 3);
    const y = randInt(-2, 3);
    const z = randInt(-2, 3);
    const A = [
      [1, pick([1, -1, 2]), pick([1, -1, 0])],
      [pick([1, 2]), pick([-1, 1, 3]), pick([1, -2])],
      [pick([0, 1, -1]), pick([1, 2]), pick([2, 3, -2])]
    ];
    const det3 =
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    if (det3 === 0) {
      A[2][2] += 1;
    }
    const sol = [x, y, z];
    const M = A.map((row) => [...row, row[0] * sol[0] + row[1] * sol[1] + row[2] * sol[2]]);
    return {
      direction: "direct",
      expr: matrixToExpr(M),
      promptText: getPrompt(lang, "gauss"),
      statementLatex: systemToLatex(M)
    };
  },

  phasors(lang) {
    const variant = randInt(0, 2);
    if (variant === 0) {
      const a = pick([-4, -3, 3, 4, 6]);
      const b = pick([-4, -3, 3, 4, 8]);
      const sign = b >= 0 ? "+" : "-";
      return {
        direction: "direct",
        expr: `${a} ${sign} ${Math.abs(b)}j`,
        promptText: getPrompt(lang, "phasors_conv"),
        statementLatex: `\\mathbb{Z} = ${a} ${sign} j${Math.abs(b)}`
      };
    }
    if (variant === 1) {
      const a1 = randInt(2, 6);
      const b1 = randInt(2, 6);
      const M2 = randInt(3, 10);
      const deg2 = pick([-45, -30, 30, 45, 60]);
      const op = pick(["*", "/"]);
      const opTex = op === "*" ? "\\cdot" : "/";
      return {
        direction: "direct",
        expr: `(${a1} + ${b1}j) ${op} (${M2}<${deg2})`,
        promptText: getPrompt(lang, "phasors_op"),
        statementLatex: `\\left(${a1} + j${b1}\\right) ${opTex} \\left(${M2}\\angle ${deg2}^\\circ\\right)`
      };
    }
    const a1 = randInt(3, 8);
    const b1 = randInt(2, 6);
    const a2 = randInt(2, 6);
    const b2 = randInt(2, 5);
    return {
      direction: "direct",
      expr: `((${a1} + ${b1}j)*(${a2} - ${b2}j))/((${a1} + ${b1}j)+(${a2} - ${b2}j))`,
      promptText: getPrompt(lang, "phasors_par"),
      statementLatex: `\\mathbb{Z}_1 = ${a1} + j${b1}, \\quad \\mathbb{Z}_2 = ${a2} - j${b2}`
    };
  },

  matops(lang) {
    const is3x3 = randInt(0, 1) === 1;
    if (!is3x3) {
      const a = randInt(-3, 5);
      const b = randInt(-3, 5);
      const c = randInt(-3, 5);
      let d = randInt(-3, 5);
      if (a * d - b * c === 0) d += a === 0 ? 1 : a > 0 ? -1 : 1;
      if (a * d - b * c === 0) d += 2;
      const M = [
        [a, b],
        [c, d]
      ];
      return {
        direction: "direct",
        expr: matrixToExpr(M),
        promptText: getPrompt(lang, "matops"),
        statementLatex: `A = ${matrixToInlineLatex(M)}`
      };
    }
    const M = [
      [randInt(1, 3), randInt(-2, 3), randInt(-1, 2)],
      [randInt(-2, 2), randInt(1, 4), randInt(-2, 2)],
      [randInt(0, 2), randInt(-1, 2), randInt(1, 4)]
    ];
    const det3 =
      M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
      M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
      M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    if (det3 === 0) {
      M[2][2] += 1;
    }
    return {
      direction: "direct",
      expr: matrixToExpr(M),
      promptText: getPrompt(lang, "matops"),
      statementLatex: `A = ${matrixToInlineLatex(M)}`
    };
  }
};

export const ALL_EXAM_TOPIC_IDS = Object.keys(TOPIC_GENERATORS);

/**
 * Generates `count` unique, evenly distributed exercises across `selectedTopicIds`.
 * @param {string[]} selectedTopicIds
 * @param {number} count
 * @param {string} lang
 */
export function generateExamExercises(selectedTopicIds, count = 10, lang = "es") {
  const validIds = (selectedTopicIds || []).filter((id) => typeof TOPIC_GENERATORS[id] === "function");
  const poolIds = validIds.length > 0 ? validIds : ALL_EXAM_TOPIC_IDS;

  const catalog = getLocalizedCatalog(lang);
  const catalogById = new Map(catalog.map((c) => [c.id, c]));

  // Equitable distribution across selected topics
  const shuffledTopics = shuffle(poolIds);
  const assignedIds = [];
  for (let i = 0; i < count; i++) {
    assignedIds.push(shuffledTopics[i % shuffledTopics.length]);
  }

  const seenKeys = new Set();
  const exercises = [];

  for (const calcId of assignedIds) {
    const gen = TOPIC_GENERATORS[calcId];
    const calc = catalogById.get(calcId);
    let item = null;

    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = gen(lang);
      const key = `${calcId}::${candidate.direction}::${candidate.expr}`;
      if (!seenKeys.has(key) || attempt === 24) {
        seenKeys.add(key);
        item = candidate;
        break;
      }
    }

    exercises.push({
      number: 0,
      calcId,
      topicTitle: calc ? calc.shortTitle : calcId,
      categoryBadge: calc
        ? calc.categoryBadge
        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      direction: item.direction,
      promptText: item.promptText,
      statementLatex: item.statementLatex,
      expr: item.expr
    });
  }

  const finalOrder = shuffle(exercises);
  finalOrder.forEach((ex, idx) => {
    ex.number = idx + 1;
  });

  return finalOrder;
}
