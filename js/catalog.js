/**
 * CalcWeb Catalog, SEO Metadata, Exam Presets, Quick Theory Guides & Virtual Keyboard Definitions
 */

export const CALCULATOR_CATALOG = [
  {
    id: "fourier",
    route: "/transformada-fourier",
    title: "Calculadora de Transformada de Fourier Paso a Paso",
    shortTitle: "Transformada de Fourier",
    category: "Señales y Sistemas",
    categoryBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    metaDescription: "Calculadora online de Transformada de Fourier Directa e Inversa paso a paso. Resuelve exponenciales causales e^(-at)u(t), pulsos rectangulares rect(t), cosenos y deltas de Dirac 100% en tu navegador.",
    h1: "Transformada de Fourier (Directa e Inversa)",
    subtitle: "Análisis espectral continuo en frecuencia angular ω con desglose de la integral impropia, identidades de Euler y propiedades de tablas.",
    formulaPreview: "\\mathcal{F}\\{f(t)\\} = F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-j\\omega t}\\,dt",
    keywords: ["fourier", "espectro", "frecuencia angular", "rect", "sinc", "dirac", "delta", "heaviside", "señales y sistemas", "coseno"],
    hasDirectionToggle: true,
    directLabel: "Transformada Directa F(ω) = ℱ{f(t)}",
    inverseLabel: "Transformada Inversa f(t) = ℱ⁻¹{F(ω)}",
    placeholderDirect: "Ej: exp(-3*t)*u(t), rect(t/4), cos(5*t), delta(t) + 2*delta(t-3)",
    placeholderInverse: "Ej: 1/(3 + j*w), 6/(9 + w^2)",
    defaultExpr: "exp(-3*t)*u(t)",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Exponencial causal",
        badge: "Examen Típico 1",
        latexLabel: "f(t) = e^{-3t}u(t)",
        expr: "exp(-3*t)*u(t)",
        direction: "direct"
      },
      {
        label: "Pulso rectangular",
        badge: "Examen Típico 2",
        latexLabel: "f(t) = 2\\,\\text{rect}\\!\\left(\\frac{t}{4}\\right)",
        expr: "2*rect(t/4)",
        direction: "direct"
      },
      {
        label: "Portadora armónica",
        badge: "Examen Típico 3",
        latexLabel: "f(t) = 4\\cos(10t)",
        expr: "4*cos(10*t)",
        direction: "direct"
      },
      {
        label: "Tren de impulsos Dirac",
        badge: "Examen Típico 4",
        latexLabel: "f(t) = \\delta(t) + 3\\delta(t - 2)",
        expr: "delta(t) + 3*delta(t-2)",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Transformada de Fourier en Ingeniería",
      intro: "En teoría de Señales y Sistemas y Telecomunicaciones, la Transformada de Fourier continua descompone una señal temporal aperiódica f(t) en su densidad espectral de frecuencias angulares ω (rad/s). Para que exista en sentido clásico (Condiciones de Dirichlet), la señal debe ser absolutamente integrable; la inclusión de distribuciones generalizadas como la Delta de Dirac δ(ω) permite transformar señales periódicas y constantes.",
      formulas: [
        {
          name: "Definición Directa e Inversa (Convenio en ω)",
          latex: "F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-j\\omega t}\\,dt \\quad \\Longleftrightarrow \\quad f(t) = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} F(\\omega)e^{j\\omega t}\\,d\\omega",
          note: "El factor de normalización 1/(2π) aparece exclusivamente en la integral de síntesis inversa."
        },
        {
          name: "Exponencial Causal Unilateral (Filtro Paso Bajo RC)",
          latex: "\\mathcal{F}\\left\\{e^{-at}u(t)\\right\\} = \\frac{1}{a + j\\omega}, \\qquad \\text{para } \\operatorname{Re}(a) > 0",
          note: "El escalón de Heaviside u(t) trunca la integral a [0, ∞). Su módulo es 1/√(a² + ω²) y su fase es -arctan(ω/a)."
        },
        {
          name: "Pulso Rectangular y Dualidad con Seno Cardinal",
          latex: "\\mathcal{F}\\left\\{A\\,\\text{rect}\\!\\left(\\frac{t}{T}\\right)\\right\\} = A T\\,\\text{sinc}\\!\\left(\\frac{\\omega T}{2}\\right) = \\frac{2A\\sin(\\omega T / 2)}{\\omega}",
          note: "Cuanto más estrecho es el pulso en el tiempo (menor T), más ancho es su lóbulo principal en frecuencia (Principio de Incertidumbre)."
        },
        {
          name: "Osciladores Armónicos y Deltas de Dirac",
          latex: "\\mathcal{F}\\left\\{\\cos(\\omega_0 t)\\right\\} = \\pi\\left[\\delta(\\omega - \\omega_0) + \\delta(\\omega + \\omega_0)\\right], \\qquad \\mathcal{F}\\left\\{\\delta(t - t_0)\\right\\} = e^{-j\\omega t_0}",
          note: "Obtenido aplicando la fórmula de Euler cos(ω₀t) = (e^{jω₀t} + e^{-jω₀t})/2 y la propiedad de traslación espectral."
        }
      ],
      tips: [
        "Verifica siempre si la señal está multiplicada por el escalón u(t): eso cambia el límite inferior de integración de -∞ a 0.",
        "Cuando transformes funciones trigonométricas puras sin amortiguamiento, utiliza siempre la identidad de Euler para pasar a exponenciales complejas.",
        "Un retardo temporal t → (t - t₀) no altera el módulo del espectro |F(ω)|, únicamente añade una fase lineal -ω·t₀."
      ]
    },
    relatedRoutes: ["/transformada-laplace", "/transformada-z", "/convolucion"],
    faqs: [
      {
        q: "¿Cómo calcular la Transformada de Fourier de una exponencial causal e^(-at)u(t)?",
        a: "Al estar multiplicada por el escalón de Heaviside u(t), la señal vale 0 para t < 0 y los límites de la integral de Fourier pasan de (-∞, ∞) a [0, ∞). Agrupando los exponentes queda la integral de e^{-(a + jω)t}, cuya primitiva evaluada entre 0 e ∞ converge (para Re(a) > 0) a F(ω) = 1 / (a + jω)."
      },
      {
        q: "¿Cuál es la Transformada de Fourier de un pulso rectangular rect(t/T)?",
        a: "Un pulso rectangular de amplitud A y anchura T centrado en el origen vale A entre -T/2 y T/2. Al integrar e^{-jωt} en ese intervalo finito y aplicar la identidad de Euler (e^{jθ} - e^{-jθ})/(2j) = sin(θ), se obtiene la función seno cardinal: F(ω) = A·T·sinc(ωT/2) = (2A·sin(ωT/2))/ω."
      },
      {
        q: "¿Por qué la Transformada de Fourier de cos(ω0·t) contiene Deltas de Dirac?",
        a: "Porque cos(ω0·t) es una señal periódica de duración infinita y energía infinita que no cumple la condición clásica de integrabilidad absoluta de Dirichlet. Descomponiendo cos(ω0·t) = (e^{jω0t} + e^{-jω0t})/2 mediante Euler, su espectro se concentra en dos impulsos de Dirac situados exactamente en las frecuencias ±ω0: F(ω) = π[δ(ω - ω0) + δ(ω + ω0)]."
      },
      {
        q: "¿Qué diferencia hay entre la Transformada de Fourier en frecuencia angular ω y en hercios f?",
        a: "En el convenio de ingeniería con frecuencia angular ω = 2πf (rad/s), la transformada directa no lleva factor 1/(2π), el cual aparece en la integral de síntesis inversa. Además, la transformada de una constante 1 es 2π·δ(ω), mientras que en frecuencia f (Hz) es directamente δ(f)."
      }
    ]
  },
  {
    id: "ztransform",
    route: "/transformada-z",
    title: "Calculadora de Transformada Z Directa e Inversa Paso a Paso",
    shortTitle: "Transformada Z",
    category: "Señales y Sistemas",
    categoryBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    metaDescription: "Calculadora online de Transformada Z Directa e Inversa paso a paso. Resuelve secuencias discretas x[n], división X(z)/z, descomposición en fracciones simples y antitransformación con tablas.",
    h1: "Transformada Z (Directa e Inversa)",
    subtitle: "Análisis de señales y sistemas en tiempo discreto con división explícita X(z)/z, descomposición en fracciones simples y aplicación de tablas para secuencias causales.",
    formulaPreview: "\\mathcal{Z}\\{x[n]\\} = X(z) = \\sum_{n=0}^{\\infty} x[n]z^{-n}",
    keywords: ["transformada z", "discreta", "fracciones simples", "X(z)/z", "secuencias", "filtros digitales", "ecuaciones en diferencias", "roc", "polos", "señales y sistemas"],
    hasDirectionToggle: true,
    directLabel: "Transformada Z Directa X(z) = 𝒫{x[n]}",
    inverseLabel: "Transformada Z Inversa x[n] = 𝒫⁻¹{X(z)} (Método X(z)/z)",
    placeholderDirect: "Ej: (0.5)^n*u[n], n*(2)^n*u[n], (3)^n*u[n] + 2*delta[n-1]",
    placeholderInverse: "Ej: z/((z-1)*(z-2)), (2*z^2 - 0.5*z)/(z^2 - 1.5*z + 0.5), z/(z-0.5)^2",
    defaultExpr: "z/((z - 1)*(z - 2))",
    defaultDirection: "inverse",
    examExamples: [
      {
        label: "Inversa (Polos simples X(z)/z)",
        badge: "Examen Típico 1",
        latexLabel: "X(z) = \\frac{z}{(z - 1)(z - 2)}",
        expr: "z/((z - 1)*(z - 2))",
        direction: "inverse"
      },
      {
        label: "Inversa (Dos polos reales)",
        badge: "Examen Típico 2",
        latexLabel: "X(z) = \\frac{3z^2 - 4z}{z^2 - 3z + 2}",
        expr: "(3*z^2 - 4*z)/(z^2 - 3*z + 2)",
        direction: "inverse"
      },
      {
        label: "Inversa (Polo doble en z = 2)",
        badge: "Examen Típico 3",
        latexLabel: "X(z) = \\frac{2z}{(z - 2)^2}",
        expr: "2*z/(z - 2)^2",
        direction: "inverse"
      },
      {
        label: "Directa (Secuencia geométrica + rampa)",
        badge: "Examen Típico 4",
        latexLabel: "x[n] = 3^n u[n] + n\\cdot 2^n u[n]",
        expr: "3^n*u[n] + n*2^n*u[n]",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Transformada Z en Procesamiento Digital (DSP)",
      intro: "La Transformada Z es el equivalente discreto de la Transformada de Laplace y constituye la herramienta matemática fundamental para analizar sistemas LTI discretos, filtros digitales FIR/IIR y ecuaciones en diferencias. Para calcular la Transformada Z Inversa mediante fracciones simples, es imprescindible dividir primero por z —formando X(z)/z— para que al multiplicar de nuevo por z cada fracción parcial tenga el numerador z requerido por las tablas.",
      formulas: [
        {
          name: "Método de Fracciones Simples Normalizadas por z",
          latex: "\\frac{X(z)}{z} = \\sum_{k=1}^{N} \\frac{A_k}{z - p_k} \\quad \\Longrightarrow \\quad X(z) = \\sum_{k=1}^{N} A_k \\frac{z}{z - p_k} \\quad \\xrightarrow{\\mathcal{Z}^{-1}} \\quad x[n] = \\sum_{k=1}^{N} A_k (p_k)^n u[n]",
          note: "Dividir primero por z garantiza obtener bloques z/(z - p_k) directamente invertibles como secuencias geométricas."
        },
        {
          name: "Par Básico: Secuencia Exponencial Causal a^n u[n]",
          latex: "\\mathcal{Z}\\left\\{a^n u[n]\\right\\} = \\frac{1}{1 - a z^{-1}} = \\frac{z}{z - a}, \\qquad \\text{ROC: } |z| > |a|",
          note: "Para a = 1 se obtiene la transformada del escalón discreto unitario u[n]: z / (z - 1)."
        },
        {
          name: "Propiedad de Diferenciación en z (Rampa Exponencial n·a^n u[n])",
          latex: "\\mathcal{Z}\\left\\{n\\,a^n u[n]\\right\\} = -z\\frac{d}{dz}\\left(\\frac{z}{z - a}\\right) = \\frac{a z}{(z - a)^2}, \\qquad \\text{ROC: } |z| > |a|",
          note: "Aparece siempre que la función de transferencia X(z) posee un polo doble en z = a."
        },
        {
          name: "Impulso Discreto de Kronecker y Retardo Temporal",
          latex: "\\mathcal{Z}\\left\\{\\delta[n]\\right\\} = 1, \\qquad \\mathcal{Z}\\left\\{\\delta[n - k]\\right\\} = z^{-k} = \\frac{1}{z^k}",
          note: "Cada potencia negativa aislada z^{-k} se antitransforma en un impulso desplazado k muestras."
        }
      ],
      tips: [
        "No descompongas directamente X(z) en fracciones simples: divide siempre primero entre z para descomponer X(z)/z y multiplica por z al final.",
        "Un sistema LTI discreto y causal es BIBO-estable si y solo si todos los polos de su función de transferencia H(z) están dentro del círculo unidad (|p_k| < 1).",
        "Si en la expansión de X(z)/z aparece un término A₀/z, al multiplicar por z queda la constante A₀, cuya antitransformada es el impulso en el origen A₀·δ[n]."
      ]
    },
    relatedRoutes: ["/transformada-fourier", "/convolucion", "/transformada-laplace"],
    faqs: [
      {
        q: "¿Por qué se divide entre z (formando X(z)/z) al calcular la Transformada Z Inversa?",
        a: "Porque los pares fundamentales de las tablas de Transformada Z causal, como Z{a^n u[n]} = z/(z - a) o Z{n·a^n u[n]} = a·z/(z - a)², contienen un factor z en el numerador. Si descomponemos X(z)/z en fracciones simples A_k/(z - p_k) y al final multiplicamos toda la ecuación por z, obtenemos directamente bloques A_k·z/(z - p_k) listos para antitransformar."
      },
      {
        q: "¿Cómo saber si un filtro digital o sistema discreto H(z) es estable?",
        a: "Un sistema LTI discreto y causal es BIBO-estable (entrada acotada produce salida acotada) si y solo si todos los polos de su función de transferencia H(z) tienen módulo estrictamente menor que 1 (|p_k| < 1), es decir, están situados dentro del círculo unidad del plano complejo z."
      },
      {
        q: "¿Cómo se calcula la Transformada Z de una rampa exponencial n·a^n·u[n]?",
        a: "Se aplica la propiedad de diferenciación en el dominio Z: multiplicar una secuencia por n equivale a aplicar el operador -z·d/dz sobre su transformada. Derivando z/(z - a) respecto a z y multiplicando por -z se obtiene a·z / (z - a)²."
      },
      {
        q: "¿Qué significa la Región de Convergencia (ROC) en la Transformada Z?",
        a: "La ROC es el anillo del plano complejo z donde la serie infinita ∑ x[n]z^{-n} converge absolutamente. Para toda secuencia causal derecha (multiplicada por u[n]), la ROC es el exterior de un círculo cuyo radio es el polo de mayor magnitud: |z| > max|p_k|."
      }
    ]
  },
  {
    id: "convolution",
    route: "/convolucion",
    title: "Calculadora de Convolución Continua y Discreta Paso a Paso",
    shortTitle: "Convolución Continua y Discreta",
    category: "Señales y Sistemas",
    categoryBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    metaDescription: "Calculadora paso a paso de Convolución Continua x(t)*h(t) y Convolución Discreta x[n]*h[n]. Desglosa inversión y desplazamiento h(t-τ), límites por escalones u(t) e integración simbólica.",
    h1: "Convolución Continua x(t) * h(t) y Discreta x[n] * h[n]",
    subtitle: "Cálculo analítico de la respuesta de sistemas LTI mediante la integral o suma de convolución, desglosando inversión temporal, desplazamiento y acotación de límites por escalones.",
    formulaPreview: "y(t) = (x * h)(t) = \\int_{-\\infty}^{\\infty} x(\\tau)h(t - \\tau)\\,d\\tau",
    keywords: ["convolucion", "continua", "discreta", "sistemas lti", "respuesta al impulso", "escalon", "desplazamiento", "integral de convolucion", "suma de convolucion", "señales y sistemas"],
    hasDirectionToggle: true,
    directLabel: "Convolución Continua y(t) = x(t) * h(t)",
    inverseLabel: "Convolución Discreta y[n] = x[n] * h[n]",
    placeholderDirect: "Formato x(t) ; h(t) -> Ej: exp(-2*t)*u(t) ; exp(-3*t)*u(t) o exp(-2*t)*u(t) ; u(t)",
    placeholderInverse: "Formato x[n] ; h[n] -> Ej: (0.5)^n*u[n] ; u[n] o [1, 2, 1] ; [1, -1]",
    defaultExpr: "exp(-2*t)*u(t) ; exp(-3*t)*u(t)",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Dos exponenciales causales",
        badge: "Examen Típico 1",
        latexLabel: "e^{-2t}u(t) * e^{-3t}u(t)",
        expr: "exp(-2*t)*u(t) ; exp(-3*t)*u(t)",
        direction: "direct"
      },
      {
        label: "Respuesta al escalón RC",
        badge: "Examen Típico 2",
        latexLabel: "e^{-2t}u(t) * u(t)",
        expr: "exp(-2*t)*u(t) ; u(t)",
        direction: "direct"
      },
      {
        label: "Discreta (Exponencial * Escalón)",
        badge: "Examen Típico 3",
        latexLabel: "(0.5)^n u[n] * u[n]",
        expr: "(0.5)^n*u[n] ; u[n]",
        direction: "inverse"
      },
      {
        label: "Discreta (Secuencias finitas FIR)",
        badge: "Examen Típico 4",
        latexLabel: "x[n]=\\{1,2,1\\} * h[n]=\\{1,-1,2\\}",
        expr: "[1, 2, 1] ; [1, -1, 2]",
        direction: "inverse"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Integral y Suma de Convolución en Sistemas LTI",
      intro: "La operación de convolución determina la salida completa y(t) o y[n] de cualquier Sistema Lineal e Invariante en el Tiempo (LTI) conociendo su respuesta al impulso h(t) o h[n]. El método geométrico consta siempre de 4 etapas respecto a la variable muda τ (o k): inversión h(-τ), desplazamiento h(t - τ), análisis de solapamiento de los escalones u(τ)·u(t - τ) e integración/suma en los límites activos.",
      formulas: [
        {
          name: "Acotación Causal de Límites por Escalones u(τ)·u(t - τ)",
          latex: "u(\\tau) = 1 \\iff \\tau \\ge 0, \\quad u(t - \\tau) = 1 \\iff \\tau \\le t \\quad \\Longrightarrow \\quad \\int_{-\\infty}^{\\infty} f(\\tau)u(\\tau)g(t-\\tau)u(t-\\tau)\\,d\\tau = u(t)\\int_{0}^{t} f(\\tau)g(t-\\tau)\\,d\\tau",
          note: "Para dos señales causales (nulas en t < 0), los límites de integración pasan siempre de (-∞, ∞) al intervalo finito [0, t] para t ≥ 0."
        },
        {
          name: "Convolución de Dos Exponenciales Causales Distintas (a ≠ b)",
          latex: "e^{-at}u(t) * e^{-bt}u(t) = \\frac{e^{-at} - e^{-bt}}{b - a}\\,u(t)",
          note: "Si los polos coinciden (a = b), el resultado es la rampa amortiguada: t·e^{-at}u(t)."
        },
        {
          name: "Suma de Convolución Discreta y Serie Geométrica Finita",
          latex: "y[n] = \\sum_{k=-\\infty}^{\\infty} x[k]h[n - k] \\xrightarrow{\\text{causales}} u[n]\\sum_{k=0}^{n} a^k b^{n-k} = b^n \\frac{1 - (a/b)^{n+1}}{1 - a/b}\\,u[n]",
          note: "Recuerda que la suma desde k = 0 hasta n contiene exactamente (n + 1) términos."
        },
        {
          name: "Teorema de Convolución (Dualidad con Laplace / Fourier / Z)",
          latex: "\\mathcal{L}\\{x(t) * h(t)\\} = X(s)\\cdot H(s), \\qquad \\mathcal{Z}\\{x[n] * h[n]\\} = X(z)\\cdot H(z)",
          note: "Permite verificar cualquier convolución multiplicando las transformadas y antitransformando por fracciones simples."
        }
      ],
      tips: [
        "Separa siempre las dos señales mediante punto y coma ';' en la barra de entrada: primero x(t) y después h(t).",
        "Cuando convoluciones dos señales causales multiplicadas por u(t), no olvides añadir u(t) multiplicando al resultado final para indicar que y(t) = 0 en t < 0.",
        "En convolución discreta de secuencias finitas de longitudes N y M, la secuencia resultante tiene longitud exacta L = N + M - 1."
      ]
    },
    relatedRoutes: ["/transformada-fourier", "/transformada-z", "/transformada-laplace"],
    faqs: [
      {
        q: "¿Cómo determinar los límites de integración en una convolución con escalones u(t)?",
        a: "En la integral ∫ x(τ)h(t - τ) dτ, si ambas señales son causales aparecen multiplicadas por u(τ)·u(t - τ). El primer escalón u(τ) exige τ ≥ 0 y el segundo escalón desplazado u(t - τ) exige t - τ ≥ 0, es decir, τ ≤ t. Por tanto, para t ≥ 0 los límites de integración quedan acotados al intervalo finito [0, t]."
      },
      {
        q: "¿Cuál es la longitud de la convolución discreta de dos secuencias finitas?",
        a: "Si la secuencia de entrada x[n] tiene N muestras y la respuesta al impulso del filtro FIR h[n] tiene M muestras, la secuencia de salida y[n] = x[n] * h[n] tiene exactamente L = N + M - 1 muestras no nulas."
      },
      {
        q: "¿Cómo comprobar si una integral de convolución está bien resuelta?",
        a: "Utilizando el Teorema de Convolución en el dominio de Laplace o Fourier: calcula X(s) = L{x(t)} y H(s) = L{h(t)}, multiplícalas Y(s) = X(s)·H(s) y antitransforma mediante fracciones simples. El resultado temporal y(t) debe coincidir exactamente con el de la integral de convolución."
      },
      {
        q: "¿Qué ocurre al convolucionar cualquier señal x(t) con una Delta de Dirac δ(t - t0)?",
        a: "La Delta de Dirac es el elemento neutro de la convolución. Convolucionar una señal con un impulso desplazado simplemente desplaza la señal original al instante del impulso sin distorsionar su forma: x(t) * δ(t - t0) = x(t - t0)."
      }
    ]
  },
  {
    id: "laplace",
    route: "/transformada-laplace",
    title: "Calculadora de Transformada de Laplace y Fracciones Simples Paso a Paso",
    shortTitle: "Transformada de Laplace",
    category: "Cálculo y Ecuaciones Diferenciales",
    categoryBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    metaDescription: "Calculadora paso a paso de Transformada de Laplace Directa e Inversa. Factoriza el denominador, calcula polos y descompone en fracciones simples (residuos de Heaviside) con explicación teórica.",
    h1: "Transformada de Laplace (Directa e Inversa)",
    subtitle: "Resolución simbólica en el plano complejo s con factorización explícita del denominador, cálculo de polos y descomposición en fracciones simples.",
    formulaPreview: "\\mathcal{L}\\{f(t)\\} = F(s) = \\int_{0}^{\\infty} f(t)e^{-st}\\,dt",
    keywords: ["laplace", "fracciones simples", "polos", "residuos", "heaviside", "inversa", "control automatico", "ecuaciones diferenciales", "amortiguado"],
    hasDirectionToggle: true,
    directLabel: "Transformada Directa F(s) = ℒ{f(t)}",
    inverseLabel: "Transformada Inversa f(t) = ℒ⁻¹{F(s)} (Fracciones Simples)",
    placeholderDirect: "Ej: exp(-2*t)*cos(3*t), t^2*exp(-4*t)",
    placeholderInverse: "Ej: (2*s + 5)/(s^2 + 5*s + 6), 4/(s*(s+2)^2), (s+3)/(s^2+2*s+5)",
    defaultExpr: "(2*s + 5)/(s^2 + 5*s + 6)",
    defaultDirection: "inverse",
    examExamples: [
      {
        label: "Fracciones simples (Polos reales)",
        badge: "Examen Típico 1",
        latexLabel: "F(s) = \\frac{2s + 5}{s^2 + 5s + 6}",
        expr: "(2*s + 5)/(s^2 + 5*s + 6)",
        direction: "inverse"
      },
      {
        label: "Polo múltiple en s = -2",
        badge: "Examen Típico 2",
        latexLabel: "F(s) = \\frac{4}{s(s + 2)^2}",
        expr: "4/(s*(s+2)^2)",
        direction: "inverse"
      },
      {
        label: "Polos complejos conjugados",
        badge: "Examen Típico 3",
        latexLabel: "F(s) = \\frac{s + 3}{s^2 + 2s + 5}",
        expr: "(s + 3)/(s^2 + 2*s + 5)",
        direction: "inverse"
      },
      {
        label: "Oscilación amortiguada (Directa)",
        badge: "Examen Típico 4",
        latexLabel: "f(t) = e^{-2t}\\cos(3t)",
        expr: "exp(-2*t)*cos(3*t)",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Transformada de Laplace y Fracciones Simples",
      intro: "La Transformada de Laplace Unilateral convierte ecuaciones diferenciales lineales con condiciones iniciales en ecuaciones algebraicas polinómicas en la variable compleja s = σ + jω. Para regresar al dominio temporal (Transformada Inversa ℒ⁻¹), la técnica estándar en ingeniería consiste en factorizar el denominador D(s) y expandir F(s) en fracciones simples.",
      formulas: [
        {
          name: "Descomposición en Fracciones Simples (Polos Reales Simples)",
          latex: "F(s) = \\frac{N(s)}{(s - p_1)(s - p_2)} = \\frac{A_1}{s - p_1} + \\frac{A_2}{s - p_2}, \\qquad A_k = \\lim_{s \\to p_k} (s - p_k)F(s)",
          note: "Cada término A_k / (s - p_k) se antitransforma directamente como A_k e^{p_k t} u(t)."
        },
        {
          name: "Primer Teorema de Traslación (Amortiguamiento Exponencial)",
          latex: "\\mathcal{L}\\left\\{e^{-at}f(t)\\right\\} = F(s + a) \\quad \\Longrightarrow \\quad \\mathcal{L}\\left\\{e^{-at}\\cos(\\omega_0 t)\\right\\} = \\frac{s + a}{(s + a)^2 + \\omega_0^2}",
          note: "Cuando el denominador tiene raíces complejas (Δ < 0), completa cuadrados en la forma (s + a)² + ω₀²."
        },
        {
          name: "Polos Reales Múltiples (Orden m)",
          latex: "\\mathcal{L}^{-1}\\left\\{\\frac{1}{(s + a)^{n+1}}\\right\\} = \\frac{t^n}{n!}e^{-at}u(t)",
          note: "Un polo repetido en s = -a genera modos temporales del tipo t^k e^{-at} que aparecen en sistemas críticamente amortiguados."
        },
        {
          name: "Propiedad de la Derivada Temporal (Condiciones Iniciales)",
          latex: "\\mathcal{L}\\left\\{\\frac{df(t)}{dt}\\right\\} = sF(s) - f(0^-), \\qquad \\mathcal{L}\\left\\{\\frac{d^2f(t)}{dt^2}\\right\\} = s^2F(s) - sf(0^-) - f'(0^-)",
          note: "Permite incorporar directamente la energía almacenada en condensadores, bobinas o resortes en t = 0."
        }
      ],
      tips: [
        "Antes de descomponer en fracciones simples, comprueba que la fracción sea estrictamente propia: grado(N) < grado(D).",
        "Si el discriminante del denominador de segundo orden es negativo, no separes en raíces complejas: completa el cuadrado (s + α)² + ω² para obtener seno y coseno reales directamente.",
        "La ubicación de los polos en el semiplano izquierdo (Re(s) < 0) garantiza que la respuesta temporal f(t) sea estable y tienda a cero."
      ]
    },
    relatedRoutes: ["/ecuaciones-diferenciales", "/transformada-fourier", "/convolucion"],
    faqs: [
      {
        q: "¿Cómo calcular la Transformada Inversa de Laplace por fracciones simples?",
        a: "Primero se verifica que el grado del numerador sea menor que el del denominador y se factoriza el denominador D(s) para hallar sus polos. Después se plantea una suma de fracciones parciales (A_i/(s - p_i) para polos simples o términos hasta grado m para polos múltiples), se calculan los residuos por el límite de Heaviside y se antitransforma cada término usando las tablas elementales."
      },
      {
        q: "¿Qué hacer en la Transformada Inversa de Laplace cuando el denominador tiene raíces complejas?",
        a: "Cuando el discriminante de un factor cuadrático s² + bs + c es negativo (Δ < 0), no conviene separar en fracciones con polos complejos. En su lugar, se completa el cuadrado escribiendo (s + α)² + ω² y se ajusta el numerador para obtener directamente las formas (s + α)/((s + α)² + ω²) → e^{-αt}cos(ωt) y ω/((s + α)² + ω²) → e^{-αt}sin(ωt)."
      },
      {
        q: "¿Cuándo se aplica el Primer Teorema de Traslación en Laplace?",
        a: "Siempre que una señal temporal f(t) esté multiplicada por una envolvente exponencial e^{-at}. El teorema establece que L{e^{-at}f(t)} = F(s + a), lo que permite transformar primero f(t) ignorando la exponencial y finalmente sustituir cada s por (s + a)."
      },
      {
        q: "¿Para qué sirve la Transformada de Laplace en ecuaciones diferenciales y circuitos?",
        a: "Gracias a la propiedad de derivación L{f'(t)} = sF(s) - f(0), la Transformada de Laplace convierte ecuaciones diferenciales lineales (e integro-diferenciales de circuitos RLC) en ecuaciones algebraicas polinómicas en s que ya incorporan automáticamente las condiciones iniciales."
      }
    ]
  },
  {
    id: "ode",
    route: "/ecuaciones-diferenciales",
    title: "Calculadora de Ecuaciones Diferenciales (EDOs 1º y 2º Orden) Paso a Paso",
    shortTitle: "Ecuaciones Diferenciales (EDOs)",
    category: "Cálculo y Ecuaciones Diferenciales",
    categoryBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    metaDescription: "Resolutor paso a paso de Ecuaciones Diferenciales Ordinarias (EDOs) de 1º y 2º orden: variables separables, factor integrante μ(x), ecuación característica, solución particular y PVI con condiciones iniciales.",
    h1: "Ecuaciones Diferenciales Ordinarias (1º y 2º Orden)",
    subtitle: "Resolución analítica paso a paso de EDOs de variables separables, lineales de 1º orden con factor integrante μ(x) y lineales de 2º orden homogéneas/no homogéneas con problema de valor inicial.",
    formulaPreview: "a y'' + b y' + c y = g(x) \\implies y(x) = y_h(x) + y_p(x)",
    keywords: ["ecuaciones diferenciales", "edo", "factor integrante", "variables separables", "ecuacion caracteristica", "coeficientes indeterminados", "condiciones iniciales", "pvi", "calculo"],
    hasDirectionToggle: false,
    placeholderDirect: "Ej: y' + 2*y = exp(-x) ; y(0)=3  o  y'' - 3*y' + 2*y = 4*x  o  y' = x*y",
    defaultExpr: "y' + 2*y = exp(x) ; y(0)=2",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Lineal 1º Orden + PVI (Factor Integrante)",
        badge: "Examen Típico 1",
        latexLabel: "y' + 2y = e^{x}, \\; y(0)=2",
        expr: "y' + 2*y = exp(x) ; y(0)=2",
        direction: "direct"
      },
      {
        label: "Variables Separables 1º Orden",
        badge: "Examen Típico 2",
        latexLabel: "y' = 2x y, \\; y(0)=3",
        expr: "y' = 2*x*y ; y(0)=3",
        direction: "direct"
      },
      {
        label: "2º Orden No Homogénea (Raíces Reales)",
        badge: "Examen Típico 3",
        latexLabel: "y'' - 3y' + 2y = 4e^{3x}",
        expr: "y'' - 3*y' + 2*y = 4*exp(3*x)",
        direction: "direct"
      },
      {
        label: "2º Orden Armónico + PVI (Raíces Complejas)",
        badge: "Examen Típico 4",
        latexLabel: "y'' + 4y = 0, \\; y(0)=1, y'(0)=6",
        expr: "y'' + 4*y = 0 ; y(0)=1, y'(0)=6",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Ecuaciones Diferenciales Ordinarias (EDOs)",
      intro: "Las Ecuaciones Diferenciales Ordinarias modelan sistemas dinámicos físicos, circuitos eléctricos RLC y procesos térmicos. En cursos universitarios de Cálculo e Ingeniería, la resolución analítica se clasifica según el orden y la linealidad de la ecuación.",
      formulas: [
        {
          name: "EDO Lineal de 1º Orden y Factor Integrante μ(x)",
          latex: "y' + P(x)y = Q(x) \\implies \\mu(x) = e^{\\int P(x)\\,dx}, \\qquad y(x) = \\frac{1}{\\mu(x)}\\left(\\int \\mu(x)Q(x)\\,dx + C\\right)",
          note: "Al multiplicar la EDO normalizada por μ(x), el miembro izquierdo colapsa en la derivada exacta d/dx[μ(x)·y]."
        },
        {
          name: "Ecuación Característica en EDO Lineal de 2º Orden (a r² + b r + c = 0)",
          latex: "y_h(x) = \\begin{cases} C_1 e^{r_1 x} + C_2 e^{r_2 x}, & \\Delta > 0 \\\\ (C_1 + C_2 x)e^{r x}, & \\Delta = 0 \\\\ e^{\\alpha x}(C_1\\cos(\\beta x) + C_2\\sin(\\beta x)), & r = \\alpha \\pm j\\beta \\end{cases}",
          note: "La estructura de la solución homogénea depende exclusivamente del discriminante Δ = b² - 4ac."
        },
        {
          name: "Estructura General de Sistemas Lineales No Homogéneos",
          latex: "y(x) = y_h(x) + y_p(x)",
          note: "La solución particular y_p(x) se obtiene por coeficientes indeterminados (si g(x) es polinomio, exponencial o sinusoide) o variación de constantes."
        },
        {
          name: "EDOs de Variables Separables",
          latex: "\\frac{dy}{dx} = f(x)g(y) \\implies \\int \\frac{1}{g(y)}\\,dy = \\int f(x)\\,dx + C",
          note: "Separa todas las dependencias en y junto a dy y todas las dependencias en x junto a dx antes de integrar ambos miembros."
        }
      ],
      tips: [
        "No apliques las condiciones iniciales y(0), y'(0) sobre la solución homogénea y_h(x): debes sumar primero la solución particular y(x) = y_h(x) + y_p(x) y evaluar sobre la solución completa.",
        "En el método de coeficientes indeterminados, si el término forzante e^{kx} coincide con una raíz característica r = k de multiplicidad m, debes multiplicar la propuesta particular por x^m.",
        "En una EDO lineal de primer orden a(x)y' + b(x)y = c(x), divide primero entre a(x) para dejar y' con coeficiente 1 antes de identificar P(x)."
      ]
    },
    relatedRoutes: ["/transformada-laplace", "/integrales-paso-a-paso", "/series-taylor"],
    faqs: [
      {
        q: "¿Cómo resolver una ecuación diferencial lineal de primer orden con factor integrante?",
        a: "Primero se escribe la ecuación en forma normalizada y' + P(x)y = Q(x). Luego se calcula el factor integrante μ(x) = e^{∫ P(x) dx}. Al multiplicar toda la ecuación por μ(x), el miembro izquierdo se transforma exactamente en la derivada (μ(x)·y)', por lo que basta integrar ambos lados respecto a x: y(x) = (∫ μ(x)Q(x) dx + C) / μ(x)."
      },
      {
        q: "¿Cómo se construye la solución homogénea de una EDO lineal de 2º orden?",
        a: "Se plantea la ecuación característica a·r² + b·r + c = 0. Si tiene dos raíces reales distintas r1 y r2, yh(x) = C1·e^{r1x} + C2·e^{r2x}. Si tiene una raíz doble r, yh(x) = (C1 + C2·x)e^{rx}. Si tiene raíces complejas conjugadas α ± jβ, yh(x) = e^{αx}(C1·cos(βx) + C2·sin(βx))."
      },
      {
        q: "¿Cuándo se deben sustituir las condiciones iniciales y(0) e y'(0) en una EDO no homogénea?",
        a: "Las condiciones iniciales del Problema de Valor Inicial (PVI) deben evaluarse siempre sobre la solución general completa y(x) = yh(x) + yp(x), nunca sobre la solución homogénea por separado, ya que la solución particular yp(x) aporta valor en x = 0."
      },
      {
        q: "¿Cómo identificar si una ecuación diferencial de primer orden es de variables separables?",
        a: "Una EDO de primer orden es separable si puede factorizarse como dy/dx = f(x)·g(y). En ese caso se agrupan todos los términos con y junto al diferencial dy (dy/g(y)) y los términos con x junto a dx (f(x)dx), integrando ambos miembros de forma independiente."
      }
    ]
  },
  {
    id: "integrals",
    route: "/integrales-paso-a-paso",
    title: "Calculadora de Integrales Indefinidas y Definidas Paso a Paso",
    shortTitle: "Integrales Paso a Paso",
    category: "Cálculo y Ecuaciones Diferenciales",
    categoryBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    metaDescription: "Calculadora de integrales indefinidas y definidas paso a paso con SymPy manualintegrate. Muestra integración por partes (u y dv), cambio de variable, fracciones simples y regla de Barrow.",
    h1: "Integrales Indefinidas y Definidas Paso a Paso",
    subtitle: "Desglose pedagógico del árbol de integración simbólica: integración por partes (identificando u y dv), sustitución u = g(x), fracciones parciales, identidades trigonométricas y Regla de Barrow.",
    formulaPreview: "\\int u\\,dv = u\\cdot v - \\int v\\,du, \\qquad \\int_{a}^{b} f(x)\\,dx = F(b) - F(a)",
    keywords: ["integrales", "paso a paso", "integracion por partes", "cambio de variable", "sustitucion", "regla de barrow", "primitiva", "fracciones parciales", "calculo"],
    hasDirectionToggle: true,
    directLabel: "Integral Indefinida ∫ f(x) dx",
    inverseLabel: "Integral Definida ∫_a^b f(x) dx (Barrow)",
    placeholderDirect: "Ej: x*exp(2*x), x*cos(x), 2*x/(x^2 + 1), 1/(x^2 - 1)",
    placeholderInverse: "Formato f(x) ; a, b -> Ej: x*exp(x) ; 0, 1  o  sin(x) ; 0, pi",
    defaultExpr: "x*exp(2*x)",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Integración por partes (u y dv)",
        badge: "Examen Típico 1",
        latexLabel: "\\int x e^{2x}\\,dx",
        expr: "x*exp(2*x)",
        direction: "direct"
      },
      {
        label: "Cambio de variable u = g(x)",
        badge: "Examen Típico 2",
        latexLabel: "\\int \\frac{2x}{x^2 + 1}\\,dx",
        expr: "2*x/(x^2 + 1)",
        direction: "direct"
      },
      {
        label: "Racional por fracciones simples",
        badge: "Examen Típico 3",
        latexLabel: "\\int \\frac{1}{x^2 - 4}\\,dx",
        expr: "1/(x^2 - 4)",
        direction: "direct"
      },
      {
        label: "Definida por partes (Regla de Barrow)",
        badge: "Examen Típico 4",
        latexLabel: "\\int_{0}^{1} x e^{x}\\,dx",
        expr: "x*exp(x) ; 0, 1",
        direction: "inverse"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Técnicas de Integración y Regla de Barrow",
      intro: "El cálculo de primitivas requiere identificar la estructura algebraica del integrando para elegir la técnica óptima: sustitución cuando aparece la derivada de una función compuesta, integración por partes (regla ILATE/ALPES) para productos de polinomios por exponenciales/trigonométricas/logaritmos, o descomposición en fracciones simples para cocientes de polinomios.",
      formulas: [
        {
          name: "Integración por Partes y Criterio ILATE / ALPES",
          latex: "\\int u\\,dv = u\\cdot v - \\int v\\,du",
          note: "Prioridad para elegir u: Arcoseno/Inversas > Logaritmos > Polinomios (Algebraicas) > Exponenciales > Seno/Coseno."
        },
        {
          name: "Teorema de Sustitución (Cambio de Variable u = g(x))",
          latex: "\\int f(g(x))\\cdot g'(x)\\,dx = \\int f(u)\\,du, \\qquad \\text{con } u = g(x), \\; du = g'(x)\\,dx",
          note: "Caso logarítmico fundamental: ∫ g'(x)/g(x) dx = ln|g(x)| + C."
        },
        {
          name: "Integración de Funciones Racionales P(x)/Q(x)",
          latex: "\\int \\frac{1}{x^2 - a^2}\\,dx = \\frac{1}{2a}\\ln\\left|\\frac{x - a}{x + a}\\right| + C, \\qquad \\int \\frac{1}{x^2 + a^2}\\,dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C",
          note: "Si grado(P) ≥ grado(Q), realiza primero la división euclídea de polinomios."
        },
        {
          name: "Segundo Teorema Fundamental del Cálculo (Regla de Barrow)",
          latex: "\\int_{a}^{b} f(x)\\,dx = \\Big[ F(x) \\Big]_{a}^{b} = F(b) - F(a), \\qquad \\text{donde } F'(x) = f(x)",
          note: "Si realizas un cambio de variable u = g(x) en una integral definida, puedes transformar directamente los límites a u_a = g(a) y u_b = g(b)."
        }
      ],
      tips: [
        "No olvides nunca añadir la constante de integración '+ C' al finalizar cualquier integral indefinida.",
        "En integrales del tipo ∫ P(x)e^{ax} dx o ∫ P(x)cos(ax) dx, elige siempre el polinomio como u = P(x) para reducir su grado al derivar.",
        "Para integrales definidas en CalcWeb, escribe la función seguida de punto y coma y los límites separados por coma: f(x) ; a, b."
      ]
    },
    relatedRoutes: ["/ecuaciones-diferenciales", "/series-taylor", "/transformada-laplace"],
    faqs: [
      {
        q: "¿Cómo saber qué función elegir como 'u' y cuál como 'dv' en integración por partes?",
        a: "Se utiliza la regla mnemotécnica ILATE (o ALPES): se elige como 'u' la función que aparezca primero en la lista: 1º Inversas trigonométricas (arctan, arcsin), 2º Logarítmicas (ln x), 3º Algebraicas o polinomios (x^n), 4º Trigonométricas (sin, cos) y 5º Exponenciales (e^x). El resto del integrando junto con dx se asigna a dv."
      },
      {
        q: "¿Cuándo aplicar integración por cambio de variable (sustitución) frente a integración por partes?",
        a: "El cambio de variable u = g(x) se aplica cuando dentro del integrando aparece una función compuesta f(g(x)) multiplicada por la derivada de su argumento interior g'(x) (o un múltiplo constante de ella). Si las dos funciones que se multiplican no guardan relación de derivada (como x·e^{2x} o x·cos(x)), se aplica integración por partes."
      },
      {
        q: "¿Cómo se integran funciones racionales mediante descomposición en fracciones simples?",
        a: "Si el grado del numerador es menor que el del denominador, se factoriza el denominador en factores lineales (x - r) y cuadráticos irreducibles (x² + px + q). Las fracciones con denominador lineal se integran como logaritmos neperianos ln|x - r| y las cuadráticas irreducibles completando cuadrados hacia arctan."
      },
      {
        q: "¿Cómo se aplica la Regla de Barrow en una integral definida?",
        a: "Primero se calcula una primitiva F(x) de la función integrando f(x) (tal que F'(x) = f(x)). A continuación se evalúa dicha primitiva en el límite superior b y se le resta la evaluación en el límite inferior a: ∫_a^b f(x) dx = F(b) - F(a)."
      }
    ]
  },
  {
    id: "taylor",
    route: "/series-taylor",
    title: "Calculadora de Series de Taylor y Maclaurin Paso a Paso",
    shortTitle: "Series de Taylor y Maclaurin",
    category: "Cálculo y Ecuaciones Diferenciales",
    categoryBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    metaDescription: "Calculadora paso a paso del Polinomio y Serie de Taylor y Maclaurin alrededor de x0 hasta orden n. Muestra todas las derivadas sucesivas f^(k)(x), su evaluación f^(k)(x0) y el término general.",
    h1: "Series de Taylor y Maclaurin Paso a Paso",
    subtitle: "Cálculo sistemático de todas las derivadas sucesivas f⁽ᵏ⁾(x), su evaluación en el centro de desarrollo x₀ y ensamblaje término a término del polinomio Pₙ(x).",
    formulaPreview: "P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!}(x - x_0)^k",
    keywords: ["series de taylor", "maclaurin", "polinomio de taylor", "derivadas sucesivas", "aproximacion polinomial", "resto de lagrange", "calculo"],
    hasDirectionToggle: false,
    placeholderDirect: "Formato f(x) ; x0 ; n -> Ej: exp(x) ; 0 ; 4  o  cos(x) ; 0 ; 6  o  ln(x) ; 1 ; 4",
    defaultExpr: "exp(x) ; 0 ; 4",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Maclaurin de e^x (Orden 4)",
        badge: "Examen Típico 1",
        latexLabel: "f(x) = e^x, \\; x_0 = 0, \\; n = 4",
        expr: "exp(x) ; 0 ; 4",
        direction: "direct"
      },
      {
        label: "Maclaurin de cos(x) (Orden 6)",
        badge: "Examen Típico 2",
        latexLabel: "f(x) = \\cos(x), \\; x_0 = 0, \\; n = 6",
        expr: "cos(x) ; 0 ; 6",
        direction: "direct"
      },
      {
        label: "Taylor de ln(x) en x₀ = 1 (Orden 4)",
        badge: "Examen Típico 3",
        latexLabel: "f(x) = \\ln(x), \\; x_0 = 1, \\; n = 4",
        expr: "ln(x) ; 1 ; 4",
        direction: "direct"
      },
      {
        label: "Maclaurin de 1/(1 - x) (Orden 4)",
        badge: "Examen Típico 4",
        latexLabel: "f(x) = \\frac{1}{1 - x}, \\; x_0 = 0, \\; n = 4",
        expr: "1/(1 - x) ; 0 ; 4",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Polinomios de Taylor, Maclaurin y Resto de Lagrange",
      intro: "El Teorema de Taylor permite aproximar cualquier función diferenciable n veces en un entorno de un punto x₀ mediante un polinomio Pₙ(x) cuyas derivadas de orden 0 hasta n coinciden exactamente con las de f(x) en x = x₀. Cuando el centro es el origen (x₀ = 0), el desarrollo se denomina Serie de Maclaurin.",
      formulas: [
        {
          name: "Fórmula General del Polinomio de Taylor de Orden n en x₀",
          latex: "P_n(x) = f(x_0) + f'(x_0)(x - x_0) + \\frac{f''(x_0)}{2!}(x - x_0)^2 + \\cdots + \\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n",
          note: "Cada coeficiente c_k = f^(k)(x₀) / k! se obtiene evaluando la derivada k-ésima en x₀ y dividiendo por k factorial."
        },
        {
          name: "Desarrollos Clásicos de Maclaurin (x₀ = 0)",
          latex: "e^x = \\sum_{k=0}^{\\infty} \\frac{x^k}{k!}, \\qquad \\cos(x) = \\sum_{m=0}^{\\infty} (-1)^m \\frac{x^{2m}}{(2m)!}, \\qquad \\sin(x) = \\sum_{m=0}^{\\infty} (-1)^m \\frac{x^{2m+1}}{(2m+1)!}",
          note: "Estas tres series convergen en toda la recta real x ∈ (-∞, ∞) (radio de convergencia R = ∞)."
        },
        {
          name: "Serie Geométrica y Logarítmica",
          latex: "\\frac{1}{1 - x} = 1 + x + x^2 + x^3 + \\cdots \\; (|x| < 1), \\qquad \\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots",
          note: "El desarrollo de ln(x) centrado en x₀ = 1 se obtiene sustituyendo x → (x - 1) en la serie de ln(1 + u)."
        },
        {
          name: "Término Complementario o Resto de Lagrange Rₙ(x)",
          latex: "f(x) = P_n(x) + R_n(x), \\qquad R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!}(x - x_0)^{n+1}, \\quad \\xi \\in (x_0, x)",
          note: "Permite acotar rigurosamente el error máximo cometido al truncar la serie en el orden n."
        }
      ],
      tips: [
        "Introduce en CalcWeb la función, el punto x₀ y el orden n separados por punto y coma: f(x) ; x0 ; n (por ejemplo: ln(x) ; 1 ; 4).",
        "Si la función es par (como cos(x)), todas sus derivadas impares en x₀ = 0 se anulan; si es impar (como sin(x)), se anulan las pares.",
        "Para calcular límites indeterminados 0/0, sustituye cada función por su polinomio de Taylor hasta el primer término no nulo."
      ]
    },
    relatedRoutes: ["/integrales-paso-a-paso", "/ecuaciones-diferenciales", "/transformada-laplace"],
    faqs: [
      {
        q: "¿Qué diferencia hay entre una Serie de Taylor y una Serie de Maclaurin?",
        a: "La Serie de Maclaurin es simplemente el caso particular de la Serie de Taylor cuando el punto o centro de desarrollo elegido es el origen de coordenadas (x0 = 0). En una Serie de Taylor general las potencias son de la forma (x - x0)^k, mientras que en Maclaurin son directamente x^k."
      },
      {
        q: "¿Cómo se calculan los coeficientes de un Polinomio de Taylor de orden n?",
        a: "Para cada orden k desde 0 hasta n, se calcula la derivada k-ésima de la función f^(k)(x), se evalúa en el punto x0 obteniendo el número f^(k)(x0) y se divide entre el factorial k!. Ese valor c_k = f^(k)(x0)/k! multiplica al factor (x - x0)^k."
      },
      {
        q: "¿Por qué no se puede desarrollar ln(x) en serie de Maclaurin en x0 = 0?",
        a: "Porque ln(x) y sus derivadas (-1)^k(k-1)!/x^k no están definidas en x = 0 (presentan una asíntota vertical). Por eso el logaritmo natural se desarrolla habitualmente en torno a x0 = 1, o bien se desarrolla la función desplazada ln(1 + x) alrededor de x0 = 0."
      },
      {
        q: "¿Cómo estimar el error de aproximación de un Polinomio de Taylor?",
        a: "Mediante la fórmula del Resto de Lagrange: el error cometido al truncar en grado n viene acotado por el máximo valor absoluto de la derivada siguiente |f^(n+1)(ξ)| en el intervalo entre x0 y x, dividido entre (n+1)! y multiplicado por |x - x0|^(n+1)."
      }
    ]
  },
  {
    id: "matrix",
    route: "/diagonalizacion-matrices",
    title: "Calculadora de Diagonalización de Matrices 2x2 y 3x3 Paso a Paso",
    shortTitle: "Diagonalización de Matrices",
    category: "Álgebra Lineal y Circuitos",
    categoryBadge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    metaDescription: "Calculadora de diagonalización de matrices 2x2 y 3x3 paso a paso. Calcula el polinomio característico |A - λI| = 0, autovalores, autovectores, matriz de paso P y matriz diagonal D.",
    h1: "Diagonalización de Matrices (2×2 y 3×3)",
    subtitle: "Cálculo detallado de la ecuación característica |A - λI| = 0, espectro de autovalores, sistemas homogéneos para cada subespacio propio, matriz de paso P y matriz diagonal D.",
    formulaPreview: "|A - \\lambda I| = 0 \\implies A = P D P^{-1}",
    keywords: ["diagonalizacion", "matrices", "autovalores", "autovectores", "valores propios", "vectores propios", "polinomio caracteristico", "matriz de paso", "algebra lineal"],
    hasDirectionToggle: false,
    placeholderDirect: "Formato filas separadas por ';' -> Ej: 4, 1; 2, 3 o 2, 0, 0; 1, 2, 1; -1, 0, 1",
    defaultExpr: "4, 1; 2, 3",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Matriz 2×2 (Autovalores simples)",
        badge: "Examen Típico 1",
        latexLabel: "A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}",
        expr: "4, 1; 2, 3",
        direction: "direct"
      },
      {
        label: "Matriz 2×2 Simétrica Real",
        badge: "Examen Típico 2",
        latexLabel: "A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}",
        expr: "2, 1; 1, 2",
        direction: "direct"
      },
      {
        label: "Matriz 3×3 Diagonalizable",
        badge: "Examen Típico 3",
        latexLabel: "A = \\begin{pmatrix} 2 & 0 & -2 \\\\ 1 & 3 & 2 \\\\ 0 & 0 & 3 \\end{pmatrix}",
        expr: "2, 0, -2; 1, 3, 2; 0, 0, 3",
        direction: "direct"
      },
      {
        label: "Matriz 2×2 NO Diagonalizable (Jordan)",
        badge: "Examen Típico 4",
        latexLabel: "A = \\begin{pmatrix} 3 & 1 \\\\ 0 & 3 \\end{pmatrix}",
        expr: "3, 1; 0, 3",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Diagonalización Endomórfica A = P·D·P⁻¹",
      intro: "Una matriz cuadrada A ∈ ℝ^{n×n} es diagonalizable si y solo si existe una base de ℝ^n formada íntegramente por autovectores (vectores propios) de A. En dicha base, la transformación lineal actúa simplemente escalando cada eje por su correspondiente autovalor λ_i, permitiendo calcular potencias A^k = P·D^k·P⁻¹ y exponenciales de matrices e^{At} de forma inmediata.",
      formulas: [
        {
          name: "Ecuación y Polinomio Característico",
          latex: "p(\\lambda) = \\det(A - \\lambda I_n) = |A - \\lambda I_n| = 0",
          note: "Para matrices 2×2 se cumple siempre p(λ) = λ² - tr(A)λ + det(A) = 0."
        },
        {
          name: "Subespacio Propio E(λ_i) Asociado a un Autovalor",
          latex: "E(\\lambda_i) = \\ker(A - \\lambda_i I_n) = \\left\\{ \\vec{v} \\in \\mathbb{R}^n : (A - \\lambda_i I_n)\\vec{v} = \\vec{0} \\right\\}",
          note: "La dimensión de este subespacio es la multiplicidad geométrica: m_g(λ_i) = n - rango(A - λ_i I)."
        },
        {
          name: "Teorema Característico de Diagonalizabilidad",
          latex: "A \\text{ es diagonalizable } \\Longleftrightarrow \\sum_{i} m_a(\\lambda_i) = n \\quad \\text{y} \\quad m_g(\\lambda_i) = m_a(\\lambda_i) \\; \\forall \\lambda_i",
          note: "Toda matriz simétrica real (A = A^T) es siempre diagonalizable ortogonalmente con autovalores reales."
        },
        {
          name: "Relación de Semejanza y Potencia n-ésima",
          latex: "A = P D P^{-1} \\implies D = P^{-1} A P, \\qquad A^k = P D^k P^{-1}",
          note: "El orden de las columnas de autovectores en P debe coincidir exactamente con el orden de los autovalores en la diagonal de D."
        }
      ],
      tips: [
        "Comprueba siempre que la suma de los autovalores obtenidos coincide con la traza de la matriz (suma de la diagonal principal) y su producto coincide con det(A).",
        "Si todos los autovalores son reales y distintos (m_a = 1 para todos), no hace falta dudar: la matriz es automáticamente diagonalizable.",
        "Cuando un autovalor tiene multiplicidad algebraica m_a = 2, verifica de inmediato si rango(A - λI) = n - 2; si el rango no baja lo suficiente, la matriz requiere Forma Canónica de Jordan."
      ]
    },
    relatedRoutes: ["/sistemas-ecuaciones-gauss", "/calculadora-fasores-complejos", "/ecuaciones-diferenciales"],
    faqs: [
      {
        q: "¿Cómo saber si una matriz cuadrada A es diagonalizable?",
        a: "Una matriz A de dimensión n×n es diagonalizable sobre los números reales si y solo si se cumplen dos condiciones: 1) la suma de las multiplicidades algebraicas de sus autovalores reales es igual a n, y 2) para todo autovalor λ_i, su multiplicidad geométrica m_g(λ_i) = n - rango(A - λ_i·I) coincide exactamente con su multiplicidad algebraica m_a(λ_i)."
      },
      {
        q: "¿Cómo se construyen la matriz de paso P y la matriz diagonal D?",
        a: "La matriz diagonal D contiene los autovalores λ_1, λ_2, ..., λ_n en su diagonal principal (repetidos según su multiplicidad). La matriz de paso P se forma colocando como columnas los autovectores linealmente independientes v_1, v_2, ..., v_n exactamente en el mismo orden de columnas que sus autovalores correspondientes en D."
      },
      {
        q: "¿Por qué toda matriz simétrica real es siempre diagonalizable?",
        a: "Por el Teorema Espectral de Álgebra Lineal: toda matriz simétrica con coeficientes reales (A = A^T) tiene exclusivamente autovalores reales y sus subespacios propios son mutuamente ortogonales, garantizando que siempre es diagonalizable mediante una matriz de paso ortogonal (P^{-1} = P^T)."
      },
      {
        q: "¿Para qué sirve diagonalizar una matriz en ingeniería (A = P·D·P⁻¹)?",
        a: "Permite calcular potencias elevadas A^k = P·D^k·P⁻¹ y la exponencial de una matriz e^{At} = P·e^{Dt}·P⁻¹ de manera inmediata, ya que elevar o exponenciar la matriz diagonal D consiste únicamente en elevar o exponenciar cada elemento de su diagonal principal."
      }
    ]
  },
  {
    id: "gauss",
    route: "/sistemas-ecuaciones-gauss",
    title: "Calculadora de Sistemas Lineales por Gauss-Jordan y Rouché-Frobenius Paso a Paso",
    shortTitle: "Sistemas Lineales (Gauss-Jordan)",
    category: "Álgebra Lineal y Circuitos",
    categoryBadge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    metaDescription: "Resolutor paso a paso de sistemas de ecuaciones lineales Ax = b (2x2, 3x3 y 4x4) por eliminación de Gauss-Jordan y Teorema de Rouché-Frobenius (SCD, SCI, SI) mostrando operaciones de fila.",
    h1: "Sistemas de Ecuaciones Lineales (Gauss-Jordan y Rouché-Frobenius)",
    subtitle: "Eliminación gaussiana paso a paso mostrando cada operación elemental entre filas (Fᵢ ← Fᵢ + αFⱼ) sobre la matriz ampliada (A|b), cálculo de rangos rg(A) y rg(A*) y clasificación SCD, SCI o SI.",
    formulaPreview: "(A\\,|\\,b) \\xrightarrow{F_i \\leftarrow F_i - m_{ij}F_j} \\text{RREF}(A\\,|\\,b), \\qquad \\operatorname{rg}(A) = \\operatorname{rg}(A^*)",
    keywords: ["gauss", "gauss-jordan", "rouche-frobenius", "sistemas de ecuaciones", "matriz ampliada", "rref", "rango", "scd", "sci", "algebra lineal"],
    hasDirectionToggle: false,
    placeholderDirect: "Filas de la matriz aumentada (A|b) separadas por ';' -> Ej: 1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2",
    defaultExpr: "1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Sistema 3×3 Compatible Determinado (SCD)",
        badge: "Examen Típico 1",
        latexLabel: "\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 6 \\\\ 2 & -1 & 1 & 3 \\\\ 1 & 2 & -1 & 2 \\end{array}\\right)",
        expr: "1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2",
        direction: "direct"
      },
      {
        label: "Sistema 3×3 Indeterminado (SCI)",
        badge: "Examen Típico 2",
        latexLabel: "\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\\\ 2 & 3 & 1 & 5 \\\\ 1 & 2 & 0 & 3 \\end{array}\\right)",
        expr: "1, 1, 1, 2; 2, 3, 1, 5; 1, 2, 0, 3",
        direction: "direct"
      },
      {
        label: "Sistema 3×3 Incompatible (SI)",
        badge: "Examen Típico 3",
        latexLabel: "\\left(\\begin{array}{ccc|c} 1 & 1 & 1 & 2 \\\\ 2 & 2 & 2 & 5 \\\\ 1 & -1 & 1 & 0 \\end{array}\\right)",
        expr: "1, 1, 1, 2; 2, 2, 2, 5; 1, -1, 1, 0",
        direction: "direct"
      },
      {
        label: "Sistema 4×4 Compatible Determinado",
        badge: "Examen Típico 4",
        latexLabel: "A_{4\\times 4}\\vec{x} = (10, 12, 11, 15)^T",
        expr: "1, 1, 1, 1, 10; 2, 1, 1, 1, 11; 1, 2, 1, 1, 12; 1, 1, 2, 1, 13",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Eliminación de Gauss-Jordan y Teorema de Rouché-Frobenius",
      intro: "El método de eliminación de Gauss-Jordan transforma la matriz ampliada (A|b) de un sistema lineal Ax = b en su Forma Escalonada Reducida por Filas (RREF) mediante operaciones elementales que preservan el conjunto de soluciones. El Teorema de Rouché-Frobenius caracteriza la existencia y unicidad de soluciones comparando el rango de la matriz de coeficientes rg(A) con el rango de la matriz ampliada rg(A*).",
      formulas: [
        {
          name: "Teorema de Rouché-Frobenius (Clasificación Completa)",
          latex: "\\begin{cases} \\operatorname{rg}(A) = \\operatorname{rg}(A^*) = n & \\implies \\text{SCD (Solución única)} \\\\ \\operatorname{rg}(A) = \\operatorname{rg}(A^*) < n & \\implies \\text{SCI (}\\infty\\text{ soluciones, } n - r \\text{ parámetros)} \\\\ \\operatorname{rg}(A) < \\operatorname{rg}(A^*) & \\implies \\text{SI (Incompatible, sin solución)} \\end{cases}",
          note: "Aquí n representa el número total de incógnitas del sistema y r = rg(A) el número de pivotes no nulos."
        },
        {
          name: "Operaciones Elementales entre Filas",
          latex: "F_i \\leftrightarrow F_j, \\qquad F_i \\leftarrow k\\cdot F_i \\; (k \\ne 0), \\qquad F_i \\leftarrow F_i - \\frac{a_{ij}}{a_{jj}}F_j",
          note: "Para anular el elemento situado en la fila i y columna pivote j, restamos a F_i la fila pivote F_j multiplicada por a_ij / a_jj."
        },
        {
          name: "Forma Escalonada Reducida por Filas (RREF)",
          latex: "(A\\,|\\,b) \\xrightarrow{\\text{Gauss-Jordan}} (I_n\\,|\\,\\vec{x}^*) \\quad \\text{(cuando } \\det(A) \\ne 0\\text{)}",
          note: "En la forma RREF cada pivote vale 1 y es el único elemento distinto de cero en toda su columna."
        },
        {
          name: "Grados de Libertad en Sistemas Compatibles Indeterminados (SCI)",
          latex: "d = n - \\operatorname{rg}(A)",
          note: "Las incógnitas cuyas columnas carecen de pivote se parametrizan libremente (λ, μ, ...)."
        }
      ],
      tips: [
        "Introduce cada fila de la matriz ampliada (A|b) separando los coeficientes por comas y las filas por punto y coma ';'. El último número de cada fila es el término independiente b_i.",
        "Si durante la eliminación gaussiana aparece una fila del tipo (0  0  0 | c) con c ≠ 0, puedes detenerte de inmediato: rg(A) < rg(A*) y el sistema es Incompatible (SI).",
        "Elige siempre como fila pivote aquella que tenga un 1 (o un divisor exacto) en la columna actual para retrasar la aparición de fracciones."
      ]
    },
    relatedRoutes: ["/diagonalizacion-matrices", "/calculadora-fasores-complejos", "/ecuaciones-diferenciales"],
    faqs: [
      {
        q: "¿Cómo clasificar un sistema de ecuaciones según el Teorema de Rouché-Frobenius?",
        a: "Se comparan el rango de la matriz de coeficientes rg(A), el rango de la matriz ampliada rg(A*) y el número de incógnitas n. Si rg(A) < rg(A*), el sistema es Incompatible (SI, no tiene solución). Si rg(A) = rg(A*) = n, es Compatible Determinado (SCD, solución única). Si rg(A) = rg(A*) < n, es Compatible Indeterminado (SCI, infinitas soluciones con n - rg(A) parámetros libres)."
      },
      {
        q: "¿Qué diferencia hay entre el método de Gauss y el método de Gauss-Jordan?",
        a: "El método de Gauss clásico solo hace ceros por debajo de la diagonal principal hasta obtener una matriz triangular superior y luego despeja por sustitución regresiva. El método de Gauss-Jordan normaliza cada pivote a 1 y hace ceros tanto por debajo como por encima de cada pivote (forma RREF), entregando el valor de cada incógnita directamente sin necesidad de sustitución regresiva."
      },
      {
        q: "¿Qué operaciones elementales entre filas están permitidas en Gauss-Jordan?",
        a: "Existen tres operaciones elementales que no alteran las soluciones del sistema: 1) Intercambiar dos filas de posición (Fi ↔ Fj), 2) Multiplicar o dividir toda una fila por una constante distinta de cero (Fi ← k·Fi), y 3) Sumar a una fila un múltiplo escalar de otra fila (Fi ← Fi + α·Fj)."
      },
      {
        q: "¿Cómo elegir las variables libres o parámetros en un sistema compatible indeterminado (SCI)?",
        a: "Una vez alcanzada la forma escalonada reducida (RREF), las columnas que contienen un 1 pivote corresponden a las variables principales o dependientes, mientras que las columnas sin pivote corresponden a las variables libres, a las cuales se asignan parámetros reales arbitrarios (λ, μ)."
      }
    ]
  },
  {
    id: "phasors",
    route: "/calculadora-fasores-complejos",
    title: "Calculadora de Fasores, Números Complejos y Circuitos AC Paso a Paso",
    shortTitle: "Fasores y Circuitos AC",
    category: "Álgebra Lineal y Circuitos",
    categoryBadge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    metaDescription: "Calculadora de fasores y números complejos para Teoría de Circuitos AC. Opera mezclando forma binómica (a+bj) y polar (M∠θ°), convierte paso a paso con ajuste de cuadrante y resuelve sistemas complejos 2x2 y 3x3.",
    h1: "Calculadora de Fasores, Complejos y Sistemas de Circuitos AC",
    subtitle: "Operaciones mixtas en forma binómica (a + bj) y polar (M∠θ°), conversión detallada de módulo y argumento con ajuste de cuadrante y resolución de sistemas fasoriales 2×2 y 3×3 (mallas y nudos).",
    formulaPreview: "\\mathbb{Z} = a + j b = |\\mathbb{Z}|\\angle \\theta^\\circ, \\qquad |\\mathbb{Z}| = \\sqrt{a^2 + b^2}, \\quad \\theta = \\operatorname{atan2}(b, a)",
    keywords: ["fasores", "numeros complejos", "forma polar", "forma binomica", "circuitos ac", "impedancia", "mallas", "nudos", "regimen permanente sinusoidal", "angulo"],
    hasDirectionToggle: true,
    directLabel: "Aritmética y Conversión Fasorial (a+bj ↔ M∠θ°)",
    inverseLabel: "Sistema Complejo 2×2 / 3×3 (Mallas / Nudos AC)",
    placeholderDirect: "Mezcla binómica y polar -> Ej: (3 + 4j) * (10@_30) / (2 - 2j)  o  -3 + 4j",
    placeholderInverse: "Matriz aumentada compleja (Z|V) separada por ';' -> Ej: 4+2j, -2j, 10@_0 ; -2j, 2+4j, 0",
    defaultExpr: "(3 + 4j) * (5<30)",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Operación mixta Binómica × Polar",
        badge: "Examen Típico 1",
        latexLabel: "(3 + 4j) \\cdot (5\\angle 30^\\circ)",
        expr: "(3 + 4j) * (5<30)",
        direction: "direct"
      },
      {
        label: "Impedancia equivalente serie/paralelo",
        badge: "Examen Típico 2",
        latexLabel: "\\mathbb{Z}_{eq} = \\frac{(4 + 3j)(2 - 4j)}{(4 + 3j) + (2 - 4j)}",
        expr: "((4 + 3j)*(2 - 4j)) / ((4 + 3j) + (2 - 4j))",
        direction: "direct"
      },
      {
        label: "Conversión 2º Cuadrante (-3 + 4j)",
        badge: "Examen Típico 3",
        latexLabel: "\\mathbb{Z} = -3 + 4j \\longrightarrow M\\angle\\theta^\\circ",
        expr: "-3 + 4j",
        direction: "direct"
      },
      {
        label: "Sistema 2×2 de Mallas en Corriente Alterna",
        badge: "Examen Típico 4",
        latexLabel: "\\begin{pmatrix} 4+2j & -2j \\\\ -2j & 2+4j \\end{pmatrix}\\begin{pmatrix} I_1 \\\\ I_2 \\end{pmatrix} = \\begin{pmatrix} 10\\angle 0^\\circ \\\\ 0 \\end{pmatrix}",
        expr: "4+2j, -2j, 10<0; -2j, 2+4j, 0",
        direction: "inverse"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Álgebra de Fasores y Régimen Permanente Sinusoidal",
      intro: "En Teoría de Circuitos y Electrotecnia, el método fasorial (Transformada de Steinmetz) convierte ecuaciones integro-diferenciales temporales con excitación sinusoidal v(t) = V_m cos(ωt + φ) en sistemas algebraicos lineales sobre el cuerpo de los números complejos ℂ, donde las bobinas presentan impedancia Z_L = jωL y los condensadores Z_C = 1/(jωC) = -j/(ωC).",
      formulas: [
        {
          name: "Conversión Binómica a Polar con Ajuste de Cuadrante",
          latex: "a + j b = M\\angle\\theta^\\circ \\implies M = \\sqrt{a^2 + b^2}, \\qquad \\theta = \\begin{cases} \\arctan(b/a), & a > 0 \\\\ \\arctan(b/a) + 180^\\circ, & a < 0, b \\ge 0 \\\\ \\arctan(b/a) - 180^\\circ, & a < 0, b < 0 \\end{cases}",
          note: "Recuerda sumar o restar 180° cuando la parte real 'a' es negativa (2º y 3º cuadrante)."
        },
        {
          name: "Conversión Polar a Binómica (Fórmula de Euler)",
          latex: "M\\angle\\theta^\\circ = M e^{j\\theta} = M\\cos(\\theta) + j\\,M\\sin(\\theta)",
          note: "La forma binómica es indispensable para sumar o restar fasores; la forma polar es óptima para multiplicar, dividir y elevar a potencias."
        },
        {
          name: "Producto y Cociente Directo en Forma Polar",
          latex: "(M_1\\angle\\theta_1)\\cdot(M_2\\angle\\theta_2) = (M_1 M_2)\\angle(\\theta_1 + \\theta_2), \\qquad \\frac{M_1\\angle\\theta_1}{M_2\\angle\\theta_2} = \\left(\\frac{M_1}{M_2}\\right)\\angle(\\theta_1 - \\theta_2)",
          note: "Al multiplicar fasores se multiplican los módulos y se suman las fases en grados."
        },
        {
          name: "Resolución de Mallas/Nudos AC por Regla de Cramer Compleja",
          latex: "\\mathbb{Z}\\,\\vec{\\mathbb{I}} = \\vec{\\mathbb{V}} \\implies \\mathbb{I}_k = \\frac{\\det(\\mathbb{Z}_k)}{\\det(\\mathbb{Z})}",
          note: "Permite obtener directamente cada corriente o tensión nodal en forma binómica y polar (amplitud y desfase)."
        }
      ],
      tips: [
        "Para escribir un fasor en forma polar con ángulo en grados usa el símbolo '<' o '∠': por ejemplo 10<30 o 10∠-45.",
        "Antes de sumar dos fasores escritos en forma polar (ej. 5<30 + 4<-60), conviértelos siempre a forma binómica a + bj.",
        "En un sistema de mallas AC sin fuentes dependientes, la matriz de impedancias Z es siempre simétrica respecto a la diagonal principal."
      ]
    },
    relatedRoutes: ["/sistemas-ecuaciones-gauss", "/transformada-fourier", "/transformada-laplace"],
    faqs: [
      {
        q: "¿Cómo pasar un número complejo de forma binómica (a + bj) a forma polar (M∠θ°)?",
        a: "El módulo se calcula siempre con Pitágoras: M = √(a² + b²). El ángulo θ se calcula con arctan(b/a), teniendo cuidado con el cuadrante: si la parte real 'a' es positiva (1º y 4º cuadrante), el ángulo es directamente arctan(b/a); pero si 'a' es negativa (2º y 3º cuadrante), hay que sumar 180° (si b ≥ 0) o restar 180° (si b < 0)."
      },
      {
        q: "¿Cómo pasar un fasor de forma polar (M∠θ°) a forma binómica?",
        a: "Aplicando la fórmula de Euler M·e^{jθ} = M·cos(θ) + j·M·sin(θ). La parte real es a = M·cos(θ) y la parte imaginaria es b = M·sin(θ), asegurándose de que la calculadora esté configurada en grados sexagesimales."
      },
      {
        q: "¿Qué forma es mejor para sumar, restar, multiplicar o dividir fasores?",
        a: "Para sumar y restar fasores es obligatorio utilizar la forma binómica (a + bj), sumando parte real con parte real y parte imaginaria con parte imaginaria. Para multiplicar y dividir fasores es mucho más rápido usar la forma polar (M∠θ°), donde se multiplican/dividen los módulos y se suman/restan los ángulos."
      },
      {
        q: "¿Cómo se resuelven las ecuaciones de mallas o nudos en corriente alterna (AC)?",
        a: "Se plantea el sistema matricial Z·I = V con las impedancias complejas de resistencias (R), bobinas (jωL) y condensadores (-j/(ωC)). Luego se resuelve mediante la Regla de Cramer compleja o eliminación de Gauss, expresando las corrientes resultantes en forma polar I_m∠φ° para leer su amplitud y desfase."
      }
    ]
  }
];

/**
 * Virtual Mathematical Keyboard Keys
 * Designed to insert clean symbolic expressions without requiring Python/LaTeX syntax memorization.
 */
export const VIRTUAL_KEYBOARD_KEYS = [
  { label: "\\int f(x)dx", insert: "x*exp(2*x)", tooltip: "Integral por partes" },
  { label: "\\int_{a}^{b}", insert: "x*exp(x) ; 0, 1", tooltip: "Integral definida con límites a, b" },
  { label: "y' + Py = Q", insert: "y' + 2*y = exp(x) ; y(0)=2", tooltip: "EDO lineal 1º orden con PVI" },
  { label: "y'' + ay' + by", insert: "y'' - 3*y' + 2*y = 4*exp(3*x)", tooltip: "EDO lineal 2º orden" },
  { label: "P_n(x)", insert: "ln(x) ; 1 ; 4", tooltip: "Serie de Taylor f(x) ; x0 ; n" },
  { label: "(A\\,|\\,b)", insert: "1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2", tooltip: "Matriz aumentada Gauss-Jordan (A|b)" },
  { label: "M\\angle\\theta^\\circ", insert: "10<30", tooltip: "Fasor en forma polar M∠θ°" },
  { label: "\\angle", insert: "<", tooltip: "Símbolo de ángulo fasorial (grados)" },
  { label: "a + bj", insert: "(3 + 4j)", tooltip: "Complejo en forma binómica" },
  { label: "j", insert: "j", tooltip: "Unidad imaginaria j (√-1)" },
  { label: "u(t)", insert: "u(t)", tooltip: "Escalón continuo de Heaviside u(t)" },
  { label: "\\delta(t)", insert: "delta(t)", tooltip: "Delta de Dirac δ(t)" },
  { label: "a^n u[n]", insert: "(0.5)^n*u[n]", tooltip: "Secuencia geométrica causal (Transformada Z)" },
  { label: "\\frac{z}{z-a}", insert: "z/((z-1)*(z-2))", tooltip: "Función racional en Z" },
  { label: "x * h", insert: "exp(-2*t)*u(t) ; exp(-3*t)*u(t)", tooltip: "Convolución (;)" },
  { label: "\\begin{pmatrix}n\\times n\\end{pmatrix}", insert: "4, 1; 2, 3", tooltip: "Plantilla Matriz cuadrada" }
];

/**
 * Legal & E-E-A-T Pages Catalog (For Google AdSense Compliance & Trust)
 */
export const LEGAL_PAGES = [
  {
    id: "about",
    route: "/sobre-nosotros",
    title: "Sobre Nosotros y Arquitectura Simbólica Client-Side | CalcWeb",
    shortTitle: "Sobre Nosotros",
    metaDescription: "Conoce el proyecto educativo CalcWeb: calculadoras matemáticas y de ingeniería paso a paso con motor simbólico WebAssembly (Pyodide + SymPy) ejecutado 100% en tu navegador.",
    h1: "Sobre CalcWeb: Ingeniería Simbólica Abierta y 100% Local",
    subtitle: "Una plataforma académica diseñada para estudiantes y docentes de Ingeniería, Física y Matemáticas con resolución paso a paso, rigor pedagógico y privacidad total.",
    sections: [
      {
        heading: "1. Nuestra Misión Educativa (E-E-A-T)",
        body: "CalcWeb nace con el objetivo de democratizar el acceso a herramientas de Cálculo Simbólico (CAS) de nivel universitario en español. A diferencia de las calculadoras tradicionales que solo devuelven un resultado numérico final o requieren costosas suscripciones de servidor, CalcWeb desglosa cada ejercicio paso a paso justificando el teorema, la identidad trigonométrica, el factor integrante o la operación elemental de fila aplicada."
      },
      {
        heading: "2. Cómo Funciona Nuestro Motor Simbólico en tu Navegador (0€ Servidor)",
        body: "Toda la inteligencia matemática de CalcWeb se ejecuta directamente en el procesador de tu dispositivo mediante WebAssembly (Pyodide + SymPy en un Web Worker dedicado) combinado con un motor algebraico híbrido instantáneo en JavaScript. Esta arquitectura ofrece tres ventajas fundamentales: 1) Latencia cero en operaciones frecuentes, 2) Privacidad absoluta (ninguna fórmula o matriz que escribas se envía a servidores externos), y 3) Disponibilidad continua incluso tras cortes de conexión una vez cargado el entorno."
      },
      {
        heading: "3. Áreas de Ingeniería Cubiertas",
        body: "Nuestros módulos abarcan las asignaturas troncales de los grados en Ingeniería Industrial, Telecomunicación, Informática, Aeroespacial y Matemáticas: Señales y Sistemas (Transformadas de Fourier, Laplace, Z y Convolución LTI), Cálculo Infinitesimal y Ecuaciones Diferenciales (Integrales manuales paso a paso, EDOs de 1º y 2º orden, Series de Taylor) y Álgebra Lineal y Teoría de Circuitos (Diagonalización espectral, Sistemas por Gauss-Jordan/Rouché-Frobenius y Fasores en Corriente Alterna)."
      },
      {
        heading: "4. Contacto Académico y Reporte de Mejoras",
        body: "Revisamos continuamente nuestros algoritmos simbólicos y guías teóricas para mantener la máxima precisión docente. Si eres profesor universitario o estudiante y deseas proponer un nuevo módulo, reportar una errata o sugerir ejemplos de examen, puedes escribirnos a contacto@calcweb.edu."
      }
    ]
  },
  {
    id: "privacy",
    route: "/privacidad",
    title: "Política de Privacidad, RGPD y Política de Cookies | CalcWeb",
    shortTitle: "Privacidad y Cookies",
    metaDescription: "Política de Privacidad y Cookies de CalcWeb adaptada al RGPD español y europeo. Procesamiento matemático 100% local en el navegador e información sobre Google AdSense.",
    h1: "Política de Privacidad y Cookies (RGPD)",
    subtitle: "Transparencia sobre el tratamiento de datos, almacenamiento local en el navegador y uso de cookies publicitarias y analíticas de terceros.",
    sections: [
      {
        heading: "1. Procesamiento Matemático 100% Local (Client-Side)",
        body: "En CalcWeb, todas las expresiones matemáticas, ecuaciones diferenciales, integrales, matrices y fasores que introduces en las calculadoras se procesan exclusivamente dentro de la memoria local de tu navegador web mediante tecnología WebAssembly (Pyodide/SymPy) y JavaScript. CalcWeb no transmite, almacena ni registra tus operaciones matemáticas en bases de datos ni servidores remotos."
      },
      {
        heading: "2. Almacenamiento Local Técnico (LocalStorage y Cache API)",
        body: "Utilizamos el almacenamiento local de tu navegador (localStorage e IndexedDB/Cache API) únicamente con fines técnicos exentos de consentimiento según el artículo 22.2 de la LSSI-CE: recordar tu preferencia de visualización (Modo Claro / Modo Oscuro) y almacenar en caché los paquetes binarios del motor simbólico Pyodide/SymPy para que no tengas que descargarlos en visitas posteriores."
      },
      {
        heading: "3. Cookies Publicitarias de Terceros (Google AdSense)",
        body: "Para financiar el mantenimiento gratuito de la plataforma, CalcWeb puede mostrar anuncios gestionados a través de Google AdSense. Google y sus socios publicitarios utilizan cookies (como la cookie DART) para mostrar anuncios relevantes basados en las visitas previas del usuario a este u otros sitios web en Internet. Los usuarios pueden inhabilitar el uso de la cookie para publicidad personalizada visitando la Configuración de Anuncios de Google (https://adssettings.google.com) o a través de https://www.aboutads.info."
      },
      {
        heading: "4. Derechos del Usuario bajo el RGPD (Acceso, Rectificación, Supresión y Oposición)",
        body: "De conformidad con el Reglamento General de Protección de Datos (RGPD - Reglamento UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD) de España, cualquier usuario puede ejercer sus derechos de acceso, rectificación, limitación, portabilidad y supresión respecto a cualquier consulta enviada por correo electrónico escribiendo a privacidad@calcweb.edu, así como borrar en cualquier momento las cookies y datos locales desde la configuración de su navegador."
      }
    ]
  },
  {
    id: "legal",
    route: "/aviso-legal",
    title: "Aviso Legal y Condiciones de Uso Educativo | CalcWeb",
    shortTitle: "Aviso Legal",
    metaDescription: "Aviso Legal, propiedad intelectual, exención de responsabilidad académica y condiciones generales de uso de las calculadoras de ingeniería de CalcWeb.",
    h1: "Aviso Legal y Condiciones de Uso",
    subtitle: "Información general en cumplimiento de la Ley 34/2002 (LSSI-CE), términos de uso académico y limitación de responsabilidad.",
    sections: [
      {
        heading: "1. Objeto y Finalidad Educativa de la Plataforma",
        body: "CalcWeb es un portal web de carácter educativo y divulgativo cuyo propósito es asistir a estudiantes y profesionales en el aprendizaje y verificación paso a paso de problemas de matemáticas superiores, análisis de señales, cálculo infinitesimal, álgebra lineal y electrotecnia."
      },
      {
        heading: "2. Exención de Responsabilidad en Diseños de Ingeniería",
        body: "Aunque CalcWeb emplea motores de álgebra computacional contrastados (SymPy) y algoritmos verificados con casos de prueba académicos, los resultados y desarrollos paso a paso se proporcionan 'tal cual' (AS IS) con fines estrictamente formativos. El usuario es el único responsable de contrastar y validar cualquier cálculo antes de aplicarlo en proyectos reales de ingeniería, diseño industrial, instalaciones eléctricas o entregas evaluables."
      },
      {
        heading: "3. Propiedad Intelectual yLicencias de Software Abierto",
        body: "El diseño de la interfaz, los textos pedagógicos, las guías teóricas, los desgloses paso a paso y el código fuente original de CalcWeb están protegidos por la normativa de propiedad intelectual. La aplicación integra en el cliente librerías de código abierto bajo sus respectivas licencias libres (Pyodide bajo MPL-2.0, SymPy bajo licencia BSD y KaTeX bajo licencia MIT)."
      },
      {
        heading: "4. Legislación Aplicable",
        body: "Las presentes condiciones de uso se rigen por la legislación española y europea vigente. Para cualquier controversia o consulta relativa al sitio web, puedes contactar con la administración técnica en legal@calcweb.edu."
      }
    ]
  }
];
