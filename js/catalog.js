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
    id: "fourierseries",
    route: "/series-de-fourier",
    title: "Calculadora de Series de Fourier (Trigonométrica y Exponencial) Paso a Paso",
    shortTitle: "Series de Fourier",
    category: "Señales y Sistemas",
    categoryBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    metaDescription: "Calculadora online de Series de Fourier trigonométrica (a0, an, bn) y exponencial compleja (cn) paso a paso en [-L, L]. Analiza paridad par/impar, integrales y desarrollo hasta el armónico N.",
    h1: "Series de Fourier (Trigonométrica a₀, aₙ, bₙ y Exponencial cₙ)",
    subtitle: "Descomposición armónica de señales periódicas en [-L, L] con análisis previo de simetría par/impar, cálculo explícito de integrales de coeficientes y desarrollo truncado al armónico N.",
    formulaPreview: "f(x) \\sim \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left(a_n\\cos\\frac{n\\pi x}{L} + b_n\\sin\\frac{n\\pi x}{L}\\right) = \\sum_{n=-\\infty}^{\\infty} c_n e^{j\\frac{n\\pi x}{L}}",
    keywords: ["series de fourier", "a0 an bn", "coeficientes de fourier", "serie exponencial compleja", "funcion par e impar", "onda cuadrada", "diente de sierra", "armonicos", "señales y sistemas"],
    hasDirectionToggle: true,
    directLabel: "Serie Trigonométrica (a₀, aₙ, bₙ)",
    inverseLabel: "Serie Exponencial Compleja (cₙ)",
    placeholderDirect: "Formato f(x) ; L ; N -> Ej: x ; pi ; 4  o  x^2 ; pi ; 3  o  abs(x) ; pi ; 3",
    placeholderInverse: "Formato f(x) ; L ; N -> Ej: x ; pi ; 3  o  sign(x) ; pi ; 5",
    defaultExpr: "x ; pi ; 4",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Diente de sierra f(x) = x",
        badge: "Examen Típico 1",
        latexLabel: "f(x) = x \\text{ en } [-\\pi, \\pi], \\; N=4",
        expr: "x ; pi ; 4",
        direction: "direct"
      },
      {
        label: "Onda cuadrada f(x) = sgn(x)",
        badge: "Examen Típico 2",
        latexLabel: "f(x) = \\operatorname{sgn}(x) \\text{ en } [-\\pi, \\pi], \\; N=5",
        expr: "sign(x) ; pi ; 5",
        direction: "direct"
      },
      {
        label: "Parábola par f(x) = x²",
        badge: "Examen Típico 3",
        latexLabel: "f(x) = x^2 \\text{ en } [-\\pi, \\pi], \\; N=3",
        expr: "x^2 ; pi ; 3",
        direction: "direct"
      },
      {
        label: "Onda triangular f(x) = |x|",
        badge: "Examen Típico 4",
        latexLabel: "f(x) = |x| \\text{ en } [-\\pi, \\pi], \\; N=3",
        expr: "abs(x) ; pi ; 3",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Series de Fourier y Condiciones de Simetría",
      intro: "Toda señal periódica de período T = 2L que cumpla las condiciones de Dirichlet puede expresarse como una superposición infinita de armónicos sinusoidales cuyas frecuencias son múltiplos enteros de la frecuencia fundamental ω₀ = π/L. Aprovechar la paridad (simetría par o impar) antes de integrar ahorra la mitad del cálculo en cualquier examen.",
      formulas: [
        {
          name: "Coeficientes Trigonométricos de Euler-Fourier en [-L, L]",
          latex: "a_0 = \\frac{1}{L}\\int_{-L}^{L} f(x)\\,dx, \\qquad a_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\cos\\!\\left(\\frac{n\\pi x}{L}\\right)dx, \\qquad b_n = \\frac{1}{L}\\int_{-L}^{L} f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx",
          note: "El término constante a₀/2 representa exactamente el valor medio (componente DC) de la señal en un período."
        },
        {
          name: "Simplificación por Paridad (Funciones Pares e Impares)",
          latex: "\\begin{cases} f(-x) = f(x) \\text{ (Par)} & \\implies b_n = 0, \\quad a_n = \\frac{2}{L}\\int_{0}^{L} f(x)\\cos\\!\\left(\\frac{n\\pi x}{L}\\right)dx \\\\ f(-x) = -f(x) \\text{ (Impar)} & \\implies a_0 = 0, \\; a_n = 0, \\quad b_n = \\frac{2}{L}\\int_{0}^{L} f(x)\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)dx \\end{cases}",
          note: "El producto de una función par por una impar es impar, y su integral sobre un intervalo simétrico [-L, L] es idénticamente cero."
        },
        {
          name: "Serie de Fourier Exponencial Compleja y Relación con (aₙ, bₙ)",
          latex: "c_n = \\frac{1}{2L}\\int_{-L}^{L} f(x)e^{-j\\frac{n\\pi x}{L}}\\,dx = \\frac{a_n - j b_n}{2} \\; (n > 0), \\qquad c_{-n} = c_n^*, \\qquad c_0 = \\frac{a_0}{2}",
          note: "Los coeficientes complejos c_n determinan el espectro discreto bilateral de amplitud |c_n| y fase arg(c_n)."
        },
        {
          name: "Teorema de Parseval (Potencia Media de la Señal Periódica)",
          latex: "P = \\frac{1}{2L}\\int_{-L}^{L} |f(x)|^2\\,dx = \\left(\\frac{a_0}{2}\\right)^2 + \\frac{1}{2}\\sum_{n=1}^{\\infty} (a_n^2 + b_n^2) = \\sum_{n=-\\infty}^{\\infty} |c_n|^2",
          note: "Muy utilizado en exámenes para deducir sumas de series numéricas como ∑ 1/n² = π²/6 o ∑ 1/n⁴ = π⁴/90."
        }
      ],
      tips: [
        "Antes de plantear ninguna integral por partes, comprueba siempre si f(-x) = f(x) (Par, luego b_n = 0) o si f(-x) = -f(x) (Impar, luego a_0 = a_n = 0).",
        "Al evaluar tras integrar en [-π, π], utiliza las identidades cos(nπ) = (-1)^n y sin(nπ) = 0 para todo entero n.",
        "En los puntos de discontinuidad de salto de f(x), la serie de Fourier converge al promedio de los límites laterales: (f(x⁺) + f(x⁻))/2 (Teorema de Dirichlet)."
      ]
    },
    relatedRoutes: ["/transformada-fourier", "/series-numericas", "/integrales-paso-a-paso"],
    faqs: [
      {
        q: "¿Cómo saber si los coeficientes an o bn de una Serie de Fourier son cero sin hacer la integral?",
        a: "Analizando la paridad de la función f(x) en un intervalo simétrico [-L, L]. Si la función es PAR (f(-x) = f(x), como x² o |x|), al multiplicarla por sin(nπx/L) resulta una función impar cuya integral entre -L y L es 0, por lo que todos los bn = 0. Si la función es IMPAR (f(-x) = -f(x), como x o una onda cuadrada sgn(x)), todos los coeficientes a0 = 0 y an = 0."
      },
      {
        q: "¿Cómo pasar de los coeficientes trigonométricos (a0, an, bn) a la Serie de Fourier Exponencial Compleja (cn)?",
        a: "Mediante las fórmulas de Euler: el término continuo es c0 = a0 / 2; para frecuencias positivas (n ≥ 1) se cumple cn = (an - j·bn) / 2; y para frecuencias negativas c_{-n} = (an + j·bn) / 2 (el complejo conjugado de cn si f(x) es real)."
      },
      {
        q: "¿Por qué cos(n·π) se sustituye por (-1)^n al calcular Series de Fourier?",
        a: "Porque para n = 1, cos(π) = -1; para n = 2, cos(2π) = 1; para n = 3, cos(3π) = -1. Esta alternancia exacta de signos se expresa algebraicamente como (-1)^n, mientras que sin(nπ) = 0 para cualquier número entero n."
      },
      {
        q: "¿Cómo se usa una Serie de Fourier para calcular la suma de una serie numérica como ∑ 1/n²?",
        a: "Se evalúa la Serie de Fourier obtenida en un punto estratégico donde la función sea continua (por ejemplo x = π o x = 0 en el desarrollo de f(x) = x²), o bien se aplica la Identidad de Parseval igualando la integral de f(x)² a la suma de los cuadrados de los coeficientes."
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
    id: "numseries",
    route: "/series-numericas",
    title: "Calculadora de Series Numéricas (Convergencia y Suma Exacta) Paso a Paso",
    shortTitle: "Series Numéricas",
    category: "Cálculo y Ecuaciones Diferenciales",
    categoryBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    metaDescription: "Calculadora paso a paso de convergencia y suma de Series Numéricas infinitas. Aplica condición necesaria, D'Alembert (cociente), Cauchy (raíz), p-series, Leibniz y calcula la suma exacta.",
    h1: "Series Numéricas (Criterios de Convergencia y Suma Exacta)",
    subtitle: "Análisis riguroso de convergencia paso a paso: condición necesaria lim aₙ = 0, series geométricas, armónicas generalizadas (p-series), criterio del cociente de D'Alembert, raíz de Cauchy, Leibniz y suma exacta.",
    formulaPreview: "S = \\sum_{n=n_0}^{\\infty} a_n, \\qquad L = \\lim_{n\\to\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| < 1 \\implies \\text{Convergente}",
    keywords: ["series numericas", "convergencia de series", "criterio de dalembert", "criterio del cociente", "criterio de cauchy", "criterio de leibniz", "serie geometrica", "p-serie", "suma de series", "calculo"],
    hasDirectionToggle: false,
    placeholderDirect: "Formato a_n ; n0 -> Ej: 1/2^n ; 1  o  n/(n+1) ; 1  o  2^n/factorial(n) ; 0  o  (-1)^(n+1)/n ; 1",
    defaultExpr: "1/2^n ; 1",
    defaultDirection: "direct",
    examExamples: [
      {
        label: "Serie Geométrica ∑ 1/2ⁿ",
        badge: "Examen Típico 1",
        latexLabel: "\\sum_{n=1}^{\\infty} \\frac{1}{2^n}",
        expr: "1/2^n ; 1",
        direction: "direct"
      },
      {
        label: "Condición Necesaria (Divergente)",
        badge: "Examen Típico 2",
        latexLabel: "\\sum_{n=1}^{\\infty} \\frac{n}{n + 1}",
        expr: "n/(n+1) ; 1",
        direction: "direct"
      },
      {
        label: "D'Alembert Factorial ∑ 2ⁿ/n!",
        badge: "Examen Típico 3",
        latexLabel: "\\sum_{n=1}^{\\infty} \\frac{2^n}{n!}",
        expr: "2^n/factorial(n) ; 1",
        direction: "direct"
      },
      {
        label: "Alternada de Leibniz ∑ (-1)ⁿ⁺¹/n",
        badge: "Examen Típico 4",
        latexLabel: "\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n}",
        expr: "(-1)^(n+1)/n ; 1",
        direction: "direct"
      }
    ],
    guide: {
      title: "Guía Rápida y Fórmulas Clave: Criterios de Convergencia y Suma de Series Infinitas",
      intro: "Estudiar el carácter de una serie numérica ∑ aₙ consiste en determinar si la sucesión de sus sumas parciales S_N = ∑_{n=n₀}^N aₙ tiene límite finito cuando N → ∞ (serie convergente) o no (serie divergente/oscilante). El análisis comienza siempre comprobando la condición necesaria: si lim_{n→∞} aₙ ≠ 0, la serie diverge automáticamente.",
      formulas: [
        {
          name: "Condición Necesaria de Convergencia y Serie Geométrica",
          latex: "\\lim_{n\\to\\infty} a_n \\ne 0 \\implies \\sum a_n \\text{ Diverge}, \\qquad \\sum_{n=n_0}^{\\infty} r^n = \\frac{r^{n_0}}{1 - r} \\; (|r| < 1)",
          note: "Cuidado: que lim a_n = 0 es necesario pero NO suficiente (por ejemplo, la serie armónica ∑ 1/n cumple lim 1/n = 0 pero diverge)."
        },
        {
          name: "Criterio del Cociente (D'Alembert) y de la Raíz (Cauchy)",
          latex: "L = \\lim_{n\\to\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| = \\lim_{n\\to\\infty} \\sqrt[n]{|a_n|} \\implies \\begin{cases} L < 1 & \\text{Converge absolutamente} \\\\ L > 1 & \\text{Diverge} \\\\ L = 1 & \\text{Criterio no concluyente} \\end{cases}",
          note: "Usa D'Alembert cuando a_n contenga factoriales (n!) o productos, y Cauchy cuando todo a_n esté elevado a la potencia n."
        },
        {
          name: "Series Armónicas Generalizadas (p-Series de Riemann)",
          latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^p} \\implies \\begin{cases} p > 1 & \\text{Convergente } (\\zeta(p), \\text{ ej. } \\sum 1/n^2 = \\pi^2/6) \\\\ p \\le 1 & \\text{Divergente} \\end{cases}",
          note: "Sirven como series patrón para el criterio de comparación por paso al límite con cocientes de polinomios."
        },
        {
          name: "Criterio de Leibniz para Series Alternadas ∑ (-1)ⁿ bₙ (bₙ > 0)",
          latex: "\\text{Si } \\lim_{n\\to\\infty} b_n = 0 \\text{ y } b_{n+1} \\le b_n \\; \\forall n \\implies \\sum (-1)^n b_n \\text{ Converge}",
          note: "Si ∑ |a_n| diverge pero ∑ a_n converge por Leibniz (como ∑ (-1)^{n+1}/n = ln 2), la serie es Condicionalmente Convergente."
        }
      ],
      tips: [
        "Comprueba siempre en primer lugar lim_{n→∞} a_n: si da distinto de 0, el ejercicio termina en un solo paso (Divergente).",
        "Si el término general es un cociente de polinomios P(n)/Q(n), aplica comparación por equivalencia asintótica con la p-serie 1/n^{grado(Q) - grado(P)}.",
        "En una serie geométrica ∑ r^n, fíjate siempre en el índice inicial n₀: la suma exacta es (primer término) / (1 - razón) = r^{n₀} / (1 - r)."
      ]
    },
    relatedRoutes: ["/series-taylor", "/series-de-fourier", "/integrales-paso-a-paso"],
    faqs: [
      {
        q: "¿Si el límite del término general lim a_n es 0, la serie converge seguro?",
        a: "No. Que lim_{n→∞} a_n = 0 es una condición necesaria pero NO suficiente para que la serie converja. El contraejemplo clásico es la serie armónica ∑ 1/n (o ∑ 1/√n), cuyo término general tiende a 0 pero cuya suma crece hasta infinito (diverge). En cambio, si el límite NO es 0, sí podemos asegurar al 100% que la serie diverge."
      },
      {
        q: "¿Cuándo elegir el Criterio de D'Alembert (cociente) y cuándo el Criterio de Cauchy (raíz)?",
        a: "El Criterio del Cociente de D'Alembert (lim |a_{n+1}/a_n|) es ideal cuando el término general contiene factoriales (n!, (2n)!) combinados con potencias a^n, ya que al dividir se simplifican consecutivamente. El Criterio de la Raíz n-ésima de Cauchy (lim ⁿ√|a_n|) es más directo cuando toda la expresión está elevada a una potencia de n, como ((n+1)/(2n-1))^n."
      },
      {
        q: "¿Qué diferencia hay entre convergencia absoluta y convergencia condicional?",
        a: "Una serie ∑ a_n converge absolutamente si la serie de sus valores absolutos ∑ |a_n| también converge (por ejemplo ∑ (-1)^n / n²). En cambio, converge condicionalmente si la serie con signos alternados ∑ a_n converge (por el criterio de Leibniz), pero al tomar valores absolutos ∑ |a_n| diverge (por ejemplo la serie armónica alternada ∑ (-1)^{n+1} / n = ln 2)."
      },
      {
        q: "¿Cómo se calcula la suma exacta de una serie geométrica o telescópica?",
        a: "Para una serie geométrica convergente de razón |r| < 1 que empieza en n = n0, la suma exacta es siempre S = (primer término) / (1 - r) = r^{n0} / (1 - r). Para una serie racional telescópica (como ∑ 1/(n(n+1))), se descompone a_n en fracciones simples 1/n - 1/(n+1) para que los términos intermedios se cancelen en la suma parcial S_N."
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
    placeholderDirect: "Mezcla binómica y polar -> Ej: (3 + 4j) * (10<30) / (2 - 2j)  o  -3 + 4j",
    placeholderInverse: "Matriz aumentada compleja (Z|V) separada por ';' -> Ej: 4+2j, -2j, 10<0 ; -2j, 2+4j, 0",
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
  { label: "a_0, a_n, b_n", insert: "x ; pi ; 4", tooltip: "Serie de Fourier en [-L, L] hasta armónico N" },
  { label: "\\sum_{n=1}^{\\infty} a_n", insert: "2^n/factorial(n) ; 1", tooltip: "Serie numérica infinita a_n ; n0" },
  { label: "y' + Py = Q", insert: "y' + 2*y = exp(x) ; y(0)=2", tooltip: "EDO lineal 1º orden con PVI" },
  { label: "P_n(x)", insert: "ln(x) ; 1 ; 4", tooltip: "Serie de Taylor f(x) ; x0 ; n" },
  { label: "(A\\,|\\,b)", insert: "1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2", tooltip: "Matriz aumentada Gauss-Jordan (A|b)" },
  { label: "M\\angle\\theta^\\circ", insert: "10<30", tooltip: "Fasor en forma polar M∠θ°" },
  { label: "\\angle", insert: "<", tooltip: "Símbolo de ángulo fasorial (grados)" },
  { label: "a + bj", insert: "(3 + 4j)", tooltip: "Complejo en forma binómica" },
  { label: "n!", insert: "factorial(n)", tooltip: "Factorial n!" },
  { label: "u(t)", insert: "u(t)", tooltip: "Escalón continuo de Heaviside u(t)" },
  { label: "a^n u[n]", insert: "(0.5)^n*u[n]", tooltip: "Secuencia geométrica causal (Transformada Z)" },
  { label: "\\frac{z}{z-a}", insert: "z/((z-1)*(z-2))", tooltip: "Función racional en Z" },
  { label: "x * h", insert: "exp(-2*t)*u(t) ; exp(-3*t)*u(t)", tooltip: "Convolución (;)" },
  { label: "\\begin{pmatrix}n\\times n\\end{pmatrix}", insert: "4, 1; 2, 3", tooltip: "Plantilla Matriz cuadrada" }
];

import { ROUTE_MAP, UI_STRINGS } from "./i18n.js";

const KEYBOARD_TOOLTIPS_I18N = {
  en: [
    "Integration by parts",
    "Definite integral with limits a, b",
    "Fourier series on [-L, L] up to harmonic N",
    "Infinite numerical series a_n ; n0",
    "1st-order linear ODE with IVP",
    "Taylor series f(x) ; x0 ; n",
    "Gauss-Jordan augmented matrix (A|b)",
    "Phasor in polar form M∠θ°",
    "Phasor angle symbol (degrees)",
    "Complex number in rectangular form",
    "Factorial n!",
    "Continuous Heaviside step u(t)",
    "Causal geometric sequence (Z-Transform)",
    "Rational function in Z",
    "Convolution (;)",
    "Square matrix template"
  ],
  fr: [
    "Intégration par parties",
    "Intégrale définie sur [a, b]",
    "Série de Fourier sur [-L, L] jusqu'à l'harmonique N",
    "Série numérique infinie a_n ; n0",
    "EDO linéaire du 1er ordre avec Cauchy",
    "Série de Taylor f(x) ; x0 ; n",
    "Matrice augmentée Gauss-Jordan (A|b)",
    "Phaseur sous forme polaire M∠θ°",
    "Symbole d'angle de phaseur (degrés)",
    "Nombre complexe sous forme algébrique",
    "Factorielle n!",
    "Échelon continu de Heaviside u(t)",
    "Suite géométrique causale (Transformée en Z)",
    "Fonction rationnelle en Z",
    "Convolution (;)",
    "Modèle de matrice carrée"
  ]
};

export function getLocalizedKeyboardKeys(lang = "es") {
  const tooltips = KEYBOARD_TOOLTIPS_I18N[lang];
  if (!tooltips) return VIRTUAL_KEYBOARD_KEYS;
  return VIRTUAL_KEYBOARD_KEYS.map((k, i) => ({
    ...k,
    tooltip: tooltips[i] || k.tooltip
  }));
}

export const CATALOG_I18N = {
  en: {
    fourier: {
      title: "Step-by-Step Fourier Transform Calculator (Direct & Inverse)",
      shortTitle: "Fourier Transform",
      metaDescription: "Online step-by-step Fourier Transform and Inverse Fourier Transform calculator. Solves causal exponentials e^(-at)u(t), rectangular pulses rect(t), cosines, and Dirac deltas 100% in your browser.",
      h1: "Fourier Transform Calculator (Direct & Inverse)",
      subtitle: "Continuous spectral analysis in angular frequency ω with improper integral breakdown, Euler's identities, and table properties.",
      directLabel: "Direct Transform F(ω) = ℱ{f(t)}",
      inverseLabel: "Inverse Transform f(t) = ℱ⁻¹{F(ω)}",
      placeholderDirect: "e.g. exp(-3*t)*u(t), rect(t/4), cos(5*t), delta(t) + 2*delta(t-3)",
      placeholderInverse: "e.g. 1/(3 + j*w), 6/(9 + w^2)",
      examLabels: ["Causal Exponential", "Rectangular Pulse", "Harmonic Carrier", "Dirac Impulse Train"],
      guideTitle: "Quick Guide & Key Formulas: Fourier Transform in Engineering",
      guideIntro: "In Signals & Systems and Telecommunications, the continuous-time Fourier Transform decomposes an aperiodic signal f(t) into its angular frequency spectral density F(ω). Generalized distributions such as the Dirac Delta δ(ω) extend the transform to periodic and DC signals.",
      formulas: [
        {
          name: "Direct & Inverse Definition (Angular Frequency ω Convention)",
          note: "The normalization factor 1/(2π) appears exclusively in the inverse synthesis integral."
        },
        {
          name: "Unilateral Causal Exponential (RC Low-Pass Filter)",
          note: "The Heaviside step u(t) truncates the integral to [0, ∞). Its magnitude is 1/√(a² + ω²) and its phase is -arctan(ω/a)."
        },
        {
          name: "Rectangular Pulse & Sinc Duality",
          note: "The narrower the pulse in time (smaller T), the wider its main lobe in frequency (Uncertainty Principle)."
        },
        {
          name: "Harmonic Oscillators & Dirac Deltas",
          note: "Derived by applying Euler's formula cos(ω₀t) = (e^{jω₀t} + e^{-jω₀t})/2 and the frequency-shift property."
        }
      ],
      tips: [
        "Always check whether the signal is multiplied by the unit step u(t): this changes the lower integration limit from -∞ to 0.",
        "When transforming pure undamped trigonometric functions, use Euler's identity to rewrite them as complex exponentials.",
        "A time delay t → (t - t₀) does not alter the magnitude spectrum |F(ω)|; it only adds a linear phase shift -ω·t₀."
      ],
      faqs: [
        {
          q: "How do you compute the Fourier Transform of a causal exponential e^(-at)u(t)?",
          a: "Because the Heaviside step u(t) vanishes for t < 0, the integral limits reduce from (-∞, ∞) to [0, ∞). Combining the exponents yields the integral of e^{-(a + jω)t}, which converges for Re(a) > 0 to F(ω) = 1 / (a + jω)."
        },
        {
          q: "What is the Fourier Transform of a rectangular pulse rect(t/T)?",
          a: "A rectangular pulse of amplitude A and width T centered at the origin equals A on [-T/2, T/2]. Integrating e^{-jωt} over that interval and applying Euler's identity yields the sinc function: F(ω) = A·T·sinc(ωT/2) = (2A·sin(ωT/2))/ω."
        },
        {
          q: "Why does the Fourier Transform of cos(ω0·t) contain Dirac Deltas?",
          a: "Because cos(ω0·t) has infinite energy and is not absolutely integrable. Using Euler's formula cos(ω0·t) = (e^{jω0t} + e^{-jω0t})/2 concentrates its spectral energy into two Dirac impulses at ±ω0: F(ω) = π[δ(ω - ω0) + δ(ω + ω0)]."
        },
        {
          q: "What is the difference between Fourier Transform in angular frequency ω and frequency f (Hz)?",
          a: "In the angular frequency ω = 2πf convention, the factor 1/(2π) appears only in the inverse synthesis integral, and the transform of a constant 1 is 2π·δ(ω)."
        }
      ]
    },
    ztransform: {
      title: "Step-by-Step Z-Transform Calculator (Direct & Inverse)",
      shortTitle: "Z-Transform",
      metaDescription: "Online step-by-step Z-Transform and Inverse Z-Transform calculator. Shows explicit X(z)/z division, partial fraction expansion, and table inversion for discrete-time sequences.",
      h1: "Z-Transform Calculator (Direct & Inverse)",
      subtitle: "Discrete-time signal and system analysis featuring explicit X(z)/z division, partial fraction decomposition, and causal table lookup.",
      directLabel: "Direct Z-Transform X(z) = 𝒫{x[n]}",
      inverseLabel: "Inverse Z-Transform x[n] = 𝒫⁻¹{X(z)} (X(z)/z Method)",
      placeholderDirect: "e.g. (0.5)^n*u[n], n*(2)^n*u[n], (3)^n*u[n] + 2*delta[n-1]",
      placeholderInverse: "e.g. z/((z-1)*(z-2)), (2*z^2 - 0.5*z)/(z^2 - 1.5*z + 0.5), z/(z-0.5)^2",
      examLabels: ["Inverse (Simple Poles X(z)/z)", "Inverse (Two Real Poles)", "Inverse (Double Pole z=2)", "Direct (Geometric + Ramp)"],
      guideTitle: "Quick Guide & Key Formulas: Z-Transform in Digital Signal Processing (DSP)",
      guideIntro: "The Z-Transform is the discrete-time counterpart of the Laplace Transform for analyzing LTI digital filters (FIR/IIR) and difference equations. To compute the Inverse Z-Transform via partial fractions, always divide by z first —forming X(z)/z— so that multiplying back by z produces canonical z/(z - a) blocks.",
      formulas: [
        {
          name: "z-Normalized Partial Fraction Method",
          note: "Dividing by z first guarantees z/(z - p_k) blocks that invert directly into geometric sequences."
        },
        {
          name: "Basic Pair: Causal Exponential Sequence a^n u[n]",
          note: "For a = 1 we obtain the Z-transform of the discrete unit step u[n]: z / (z - 1)."
        },
        {
          name: "z-Domain Differentiation Property (Exponential Ramp n·a^n u[n])",
          note: "Always appears when the transfer function X(z) has a double pole at z = a."
        },
        {
          name: "Kronecker Discrete Impulse & Time Delay",
          note: "Each isolated negative power z^{-k} inverts into a unit impulse shifted by k samples."
        }
      ],
      tips: [
        "Never expand X(z) directly into partial fractions: always divide by z first to expand X(z)/z, then multiply by z at the end.",
        "A causal discrete-time LTI system is BIBO-stable if and only if all poles of H(z) lie strictly inside the unit circle (|p_k| < 1).",
        "If an A₀/z term appears in X(z)/z, multiplying by z gives the constant A₀, whose inverse Z-transform is the unit impulse A₀·δ[n]."
      ],
      faqs: [
        {
          q: "Why do we divide by z (forming X(z)/z) when computing the Inverse Z-Transform?",
          a: "Because standard Z-transform table pairs like Z{a^n u[n]} = z/(z - a) have z in the numerator. Expanding X(z)/z into A_k/(z - p_k) and multiplying back by z yields A_k·z/(z - p_k) blocks ready for immediate inversion."
        },
        {
          q: "How do you check if a digital filter H(z) is stable?",
          a: "A causal discrete LTI system is BIBO-stable if and only if all poles of its transfer function H(z) have magnitude strictly less than 1 (|p_k| < 1), i.e., inside the unit circle."
        },
        {
          q: "How do you compute the Z-Transform of an exponential ramp n·a^n·u[n]?",
          a: "By applying the z-domain differentiation property Z{n·x[n]} = -z·d/dz X(z) to z/(z - a), which results in a·z / (z - a)²."
        },
        {
          q: "What is the Region of Convergence (ROC) in the Z-Transform?",
          a: "The ROC is the annular region in the complex z-plane where ∑ x[n]z^{-n} converges absolutely. For causal sequences, the ROC is the exterior of the circle defined by the largest pole: |z| > max|p_k|."
        }
      ]
    },
    convolution: {
      title: "Step-by-Step Continuous & Discrete Convolution Calculator",
      shortTitle: "Convolution (Continuous & Discrete)",
      metaDescription: "Step-by-step Continuous Convolution x(t)*h(t) and Discrete Convolution x[n]*h[n] calculator. Shows time-reversal, shifting h(t-τ), Heaviside step bounds, and symbolic integration.",
      h1: "Continuous x(t) * h(t) & Discrete x[n] * h[n] Convolution",
      subtitle: "Analytical LTI system response via convolution integral or summation, detailing time folding, shifting, and active integration limits bounded by unit steps.",
      directLabel: "Continuous Convolution y(t) = x(t) * h(t)",
      inverseLabel: "Discrete Convolution y[n] = x[n] * h[n]",
      placeholderDirect: "Format x(t) ; h(t) -> e.g. exp(-2*t)*u(t) ; exp(-3*t)*u(t) or exp(-2*t)*u(t) ; u(t)",
      placeholderInverse: "Format x[n] ; h[n] -> e.g. (0.5)^n*u[n] ; u[n] or [1, 2, 1] ; [1, -1]",
      examLabels: ["Two Causal Exponentials", "RC Step Response", "Discrete (Exponential * Step)", "Discrete (Finite FIR Sequences)"],
      guideTitle: "Quick Guide & Key Formulas: Convolution Integral and Summation in LTI Systems",
      guideIntro: "Convolution determines the complete output y(t) or y[n] of any Linear Time-Invariant (LTI) system given its impulse response h(t) or h[n]. The analytical method consists of 4 stages with respect to dummy variable τ (or k): folding h(-τ), shifting h(t - τ), overlapping unit steps u(τ)·u(t - τ), and integrating over the active interval.",
      formulas: [
        {
          name: "Causal Limit Bounding via Unit Steps u(τ)·u(t - τ)",
          note: "For two causal signals (zero for t < 0), integration limits always reduce from (-∞, ∞) to [0, t] for t ≥ 0."
        },
        {
          name: "Convolution of Two Distinct Causal Exponentials (a ≠ b)",
          note: "If the poles coincide (a = b), the result is the damped ramp: t·e^{-at}u(t)."
        },
        {
          name: "Discrete Convolution Sum & Finite Geometric Series",
          note: "Remember that the sum from k = 0 to n contains exactly (n + 1) terms."
        },
        {
          name: "Convolution Theorem (Laplace / Fourier / Z Duality)",
          note: "Allows verifying any convolution by multiplying transforms and inverting via partial fractions."
        }
      ],
      tips: [
        "Always separate the two input signals with a semicolon ';' in the input bar: first x(t), then h(t).",
        "When convolving two causal signals multiplied by u(t), remember to multiply the final result by u(t) to indicate y(t) = 0 for t < 0.",
        "In discrete convolution of finite sequences of lengths N and M, the resulting sequence has exact length L = N + M - 1."
      ],
      faqs: [
        {
          q: "How do you determine the integration limits in a convolution with unit steps u(t)?",
          a: "In ∫ x(τ)h(t - τ) dτ, the product u(τ)·u(t - τ) requires τ ≥ 0 and t - τ ≥ 0 (so τ ≤ t). Thus, for t ≥ 0 the infinite limits (-∞, ∞) collapse to the finite interval [0, t]."
        },
        {
          q: "What is the length of the discrete convolution of two finite sequences?",
          a: "If x[n] has length N and the FIR filter h[n] has length M, the convolved sequence y[n] = x[n] * h[n] has exact length L = N + M - 1 samples."
        },
        {
          q: "How can you verify a convolution integral result?",
          a: "Using the Convolution Theorem in the Laplace domain: compute X(s) and H(s), multiply Y(s) = X(s)·H(s), and take the inverse Laplace transform via partial fractions."
        },
        {
          q: "What happens when you convolve a signal x(t) with a shifted Dirac Delta δ(t - t0)?",
          a: "The Dirac Delta is the identity element of convolution. Convolving with δ(t - t0) simply shifts the original signal in time: x(t) * δ(t - t0) = x(t - t0)."
        }
      ]
    },
    fourierseries: {
      title: "Step-by-Step Fourier Series Calculator (Trigonometric & Complex)",
      shortTitle: "Fourier Series",
      metaDescription: "Online step-by-step Fourier Series calculator in trigonometric (a0, an, bn) and complex exponential (cn) form on [-L, L]. Analyzes even/odd parity, coefficient integrals, and Nth harmonic expansion.",
      h1: "Fourier Series (Trigonometric a₀, aₙ, bₙ & Complex Exponential cₙ)",
      subtitle: "Harmonic decomposition of periodic signals on [-L, L] with automatic even/odd symmetry detection, explicit coefficient integrals, and N-harmonic partial sum.",
      directLabel: "Trigonometric Series (a₀, aₙ, bₙ)",
      inverseLabel: "Complex Exponential Series (cₙ)",
      placeholderDirect: "Format f(x) ; L ; N -> e.g. x ; pi ; 4  or  x^2 ; pi ; 3  or  abs(x) ; pi ; 3",
      placeholderInverse: "Format f(x) ; L ; N -> e.g. x ; pi ; 3  or  sign(x) ; pi ; 5",
      examLabels: ["Sawtooth Wave f(x) = x", "Square Wave f(x) = sgn(x)", "Even Parabola f(x) = x²", "Triangle Wave f(x) = |x|"],
      guideTitle: "Quick Guide & Key Formulas: Fourier Series & Symmetry Conditions",
      guideIntro: "Any periodic signal of period T = 2L satisfying Dirichlet's conditions can be expanded as an infinite superposition of harmonic sinusoids at integer multiples of the fundamental frequency ω₀ = π/L. Checking for even or odd parity before integrating saves half the work in exams.",
      formulas: [
        {
          name: "Euler-Fourier Trigonometric Coefficients on [-L, L]",
          note: "The constant term a₀/2 represents the exact mean value (DC component) of the signal over one period."
        },
        {
          name: "Parity Simplification (Even and Odd Functions)",
          note: "The product of an even function and an odd function is odd, so its integral over [-L, L] is identically zero."
        },
        {
          name: "Complex Exponential Fourier Series & Relation to (aₙ, bₙ)",
          note: "Complex coefficients c_n determine the two-sided discrete amplitude |c_n| and phase arg(c_n) spectrum."
        },
        {
          name: "Parseval's Theorem (Average Power of a Periodic Signal)",
          note: "Widely used in exams to deduce numerical series sums like ∑ 1/n² = π²/6 or ∑ 1/n⁴ = π⁴/90."
        }
      ],
      tips: [
        "Before integrating by parts, always check if f(-x) = f(x) (Even, so b_n = 0) or f(-x) = -f(x) (Odd, so a_0 = a_n = 0).",
        "When evaluating at the endpoints of [-π, π], use the identities cos(nπ) = (-1)^n and sin(nπ) = 0 for every integer n.",
        "At jump discontinuities of f(x), the Fourier series converges to the midpoint of the left and right limits: (f(x⁺) + f(x⁻))/2."
      ],
      faqs: [
        {
          q: "How can you tell if Fourier coefficients an or bn are zero without integrating?",
          a: "By checking parity on a symmetric interval [-L, L]. If f(x) is EVEN (f(-x) = f(x), like x² or |x|), then all sine coefficients bn = 0. If f(x) is ODD (f(-x) = -f(x), like x or sgn(x)), then a0 = 0 and all cosine coefficients an = 0."
        },
        {
          q: "How do you convert trigonometric coefficients (a0, an, bn) to complex exponential coefficients (cn)?",
          a: "Using Euler's formulas: c0 = a0 / 2, cn = (an - j·bn) / 2 for n ≥ 1, and c_{-n} = (an + j·bn) / 2 (the complex conjugate of cn for real signals)."
        },
        {
          q: "Why is cos(n·π) replaced by (-1)^n in Fourier Series?",
          a: "Because for integer n, cos(π) = -1, cos(2π) = 1, cos(3π) = -1, which alternates signs exactly as (-1)^n, whereas sin(nπ) = 0 for all integers."
        },
        {
          q: "How do you use a Fourier Series to evaluate numerical series like ∑ 1/n²?",
          a: "Evaluate the Fourier series at a continuity point (such as x = π or x = 0 for f(x) = x²) or apply Parseval's Theorem."
        }
      ]
    },
    laplace: {
      title: "Step-by-Step Laplace Transform & Partial Fractions Calculator",
      shortTitle: "Laplace Transform",
      metaDescription: "Step-by-step Direct and Inverse Laplace Transform calculator. Factors the denominator, finds poles, and performs partial fraction decomposition (Heaviside residues) with theoretical explanation.",
      h1: "Laplace Transform Calculator (Direct & Inverse)",
      subtitle: "Symbolic resolution in the complex s-plane featuring explicit denominator factorization, pole analysis, and partial fraction decomposition.",
      directLabel: "Direct Transform F(s) = ℒ{f(t)}",
      inverseLabel: "Inverse Transform f(t) = ℒ⁻¹{F(s)} (Partial Fractions)",
      placeholderDirect: "e.g. exp(-2*t)*cos(3*t), t^2*exp(-4*t)",
      placeholderInverse: "e.g. (2*s + 5)/(s^2 + 5*s + 6), 4/(s*(s+2)^2), (s+3)/(s^2+2*s+5)",
      examLabels: ["Partial Fractions (Real Poles)", "Repeated Pole at s = -2", "Complex Conjugate Poles", "Damped Oscillation (Direct)"],
      guideTitle: "Quick Guide & Key Formulas: Laplace Transform & Partial Fractions",
      guideIntro: "The Unilateral Laplace Transform converts linear differential equations with initial conditions into algebraic polynomial equations in the complex variable s = σ + jω. To invert F(s) back to the time domain, factor the denominator D(s) and expand into partial fractions.",
      formulas: [
        {
          name: "Partial Fraction Decomposition (Simple Real Poles)",
          note: "Each term A_k / (s - p_k) inverts directly as A_k e^{p_k t} u(t)."
        },
        {
          name: "First Shifting Theorem (Exponential Damping)",
          note: "When the denominator has complex roots (Δ < 0), complete the square in the form (s + a)² + ω₀²."
        },
        {
          name: "Repeated Real Poles (Order m)",
          note: "A repeated pole at s = -a generates t^k e^{-at} time modes typical of critically damped systems."
        },
        {
          name: "Time-Differentiation Property (Initial Conditions)",
          note: "Automatically incorporates initial energy stored in capacitors, inductors, or springs at t = 0."
        }
      ],
      tips: [
        "Before expanding into partial fractions, verify that the rational function is strictly proper: degree(N) < degree(D).",
        "If a quadratic denominator has a negative discriminant (Δ < 0), do not split into complex roots: complete the square (s + α)² + ω² to obtain damped sine and cosine directly.",
        "Poles located in the open left-half plane (Re(s) < 0) guarantee that the time response f(t) is asymptotically stable."
      ],
      faqs: [
        {
          q: "How do you compute the Inverse Laplace Transform using partial fractions?",
          a: "First factor the denominator D(s) to find all poles. Set up a partial fraction sum for simple or repeated poles, compute the Heaviside residues via limits, and invert each elementary fraction using standard Laplace table pairs."
        },
        {
          q: "What should you do when the denominator has complex conjugate roots?",
          a: "Complete the square in the denominator as (s + α)² + ω² and rearrange the numerator in terms of (s + α) to apply the First Shifting Theorem for e^{-αt}cos(ωt) and e^{-αt}sin(ωt)."
        },
        {
          q: "When is the First Shifting Theorem applied in Laplace Transforms?",
          a: "Whenever a time function f(t) is multiplied by an exponential e^{-at}. The theorem states L{e^{-at}f(t)} = F(s + a), shifting s → (s + a)."
        },
        {
          q: "Why is the Laplace Transform useful for differential equations and RLC circuits?",
          a: "Because the differentiation property L{f'(t)} = sF(s) - f(0) turns differential equations into algebraic equations in s while automatically incorporating initial conditions."
        }
      ]
    },
    ode: {
      title: "Step-by-Step Differential Equations Calculator (1st & 2nd Order ODEs)",
      shortTitle: "Differential Equations (ODEs)",
      metaDescription: "Step-by-step Ordinary Differential Equations (ODE) solver for 1st and 2nd order: separable variables, integrating factor μ(x), characteristic equation, particular solution, and IVP.",
      h1: "Ordinary Differential Equations (1st & 2nd Order ODEs)",
      subtitle: "Analytical step-by-step resolution of separable ODEs, 1st-order linear ODEs via integrating factor μ(x), and 2nd-order constant-coefficient ODEs with Initial Value Problems (IVP).",
      placeholderDirect: "e.g. y' + 2*y = exp(-x) ; y(0)=3  or  y'' - 3*y' + 2*y = 4*x  or  y' = x*y",
      examLabels: ["1st-Order Linear + IVP", "Separable 1st-Order ODE", "2nd-Order Non-Homogeneous", "2nd-Order Harmonic + IVP"],
      guideTitle: "Quick Guide & Key Formulas: Ordinary Differential Equations (ODEs)",
      guideIntro: "Ordinary Differential Equations model physical dynamical systems, RLC circuits, and thermal processes. University analytical resolution classifies ODEs according to their order and linearity.",
      formulas: [
        {
          name: "1st-Order Linear ODE & Integrating Factor μ(x)",
          note: "Multiplying the normalized ODE by μ(x) collapses the left-hand side into the exact derivative d/dx[μ(x)·y]."
        },
        {
          name: "Characteristic Equation in 2nd-Order Linear ODEs (a r² + b r + c = 0)",
          note: "The structure of the homogeneous solution depends exclusively on the discriminant Δ = b² - 4ac."
        },
        {
          name: "General Structure of Non-Homogeneous Linear Systems",
          note: "The particular solution y_p(x) is found via undetermined coefficients or variation of parameters."
        },
        {
          name: "Separable Differential Equations",
          note: "Separate all y-dependent terms with dy and all x-dependent terms with dx before integrating both sides."
        }
      ],
      tips: [
        "Never apply initial conditions y(0), y'(0) to the homogeneous solution y_h(x) alone: always form the complete general solution y(x) = y_h(x) + y_p(x) first.",
        "In undetermined coefficients, if the forcing term e^{kx} matches a characteristic root r = k of multiplicity m, multiply the trial solution by x^m.",
        "For a 1st-order linear ODE a(x)y' + b(x)y = c(x), divide by a(x) first so y' has leading coefficient 1 before identifying P(x)."
      ],
      faqs: [
        {
          q: "How do you solve a first-order linear differential equation using an integrating factor?",
          a: "Write the ODE in standard form y' + P(x)y = Q(x) and compute μ(x) = e^{∫ P(x) dx}. Multiplying the equation by μ(x) collapses the left side into d/dx[μ(x)·y], so integrating both sides gives y(x) = (∫ μ(x)Q(x) dx + C) / μ(x)."
        },
        {
          q: "How do you build the homogeneous solution of a 2nd-order linear ODE?",
          a: "Solve the characteristic equation a·r² + b·r + c = 0. Distinct real roots r1, r2 give C1·e^{r1x} + C2·e^{r2x}; a repeated root r gives (C1 + C2·x)e^{rx}; complex conjugate roots α ± jβ give e^{αx}(C1·cos(βx) + C2·sin(βx))."
        },
        {
          q: "When should initial conditions y(0) and y'(0) be substituted in a non-homogeneous ODE?",
          a: "Always substitute initial conditions into the total general solution y(x) = yh(x) + yp(x), never into yh(x) alone."
        },
        {
          q: "How do you recognize a separable first-order ODE?",
          a: "An ODE is separable if it can be written as dy/dx = f(x)·g(y). Separate variables as dy/g(y) = f(x)dx and integrate both sides independently."
        }
      ]
    },
    integrals: {
      title: "Step-by-Step Indefinite & Definite Integral Calculator",
      shortTitle: "Step-by-Step Integrals",
      metaDescription: "Step-by-step indefinite and definite integral calculator powered by SymPy manualintegrate. Shows integration by parts (u and dv), u-substitution, partial fractions, and Fundamental Theorem of Calculus.",
      h1: "Indefinite & Definite Integrals Step-by-Step",
      subtitle: "Pedagogical symbolic integration tree breakdown: integration by parts (identifying u and dv), substitution u = g(x), partial fractions, trigonometric identities, and definite evaluation.",
      directLabel: "Indefinite Integral ∫ f(x) dx",
      inverseLabel: "Definite Integral ∫_a^b f(x) dx (Barrow)",
      placeholderDirect: "e.g. x*exp(2*x), x*cos(x), 2*x/(x^2 + 1), 1/(x^2 - 1)",
      placeholderInverse: "Format f(x) ; a, b -> e.g. x*exp(x) ; 0, 1  or  sin(x) ; 0, pi",
      examLabels: ["Integration by Parts (u, dv)", "u-Substitution u = g(x)", "Rational Partial Fractions", "Definite Integral by Parts"],
      guideTitle: "Quick Guide & Key Formulas: Integration Techniques & Fundamental Theorem",
      guideIntro: "Computing antiderivatives requires identifying the algebraic structure of the integrand: u-substitution when an inner derivative is present, integration by parts (LIATE rule) for products of polynomials and exponentials/trigonometric/logarithmic functions, or partial fractions for rational functions.",
      formulas: [
        {
          name: "Integration by Parts & LIATE Rule",
          note: "Priority for choosing u: Logarithmic > Inverse trig > Algebraic (polynomials) > Trigonometric > Exponential."
        },
        {
          name: "Substitution Theorem (u = g(x))",
          note: "Fundamental logarithmic case: ∫ g'(x)/g(x) dx = ln|g(x)| + C."
        },
        {
          name: "Integration of Rational Functions P(x)/Q(x)",
          note: "If degree(P) ≥ degree(Q), perform polynomial long division first."
        },
        {
          name: "Second Fundamental Theorem of Calculus (Barrow's Rule)",
          note: "When applying u = g(x) to a definite integral, you can directly transform the limits to u_a = g(a) and u_b = g(b)."
        }
      ],
      tips: [
        "Never forget to add the arbitrary constant of integration '+ C' to every indefinite integral.",
        "For integrals of the form ∫ P(x)e^{ax} dx or ∫ P(x)cos(ax) dx, always choose the polynomial as u = P(x) to lower its degree upon differentiation.",
        "For definite integrals in CalcWeb, enter the function followed by a semicolon and the comma-separated limits: f(x) ; a, b."
      ],
      faqs: [
        {
          q: "How do you choose 'u' and 'dv' in integration by parts?",
          a: "Follow the LIATE priority rule: choose 'u' as the function appearing earliest in: 1) Logarithmic, 2) Inverse trigonometric, 3) Algebraic (polynomials), 4) Trigonometric, 5) Exponential."
        },
        {
          q: "When should you use u-substitution instead of integration by parts?",
          a: "Use u-substitution u = g(x) when the integrand contains a composite function f(g(x)) multiplied by the derivative of its inner argument g'(x). Use integration by parts for products of unrelated function families like x·e^{2x}."
        },
        {
          q: "How do you integrate rational functions using partial fractions?",
          a: "Factor the denominator into linear (x - r) and irreducible quadratic factors. Linear terms integrate to natural logarithms ln|x - r| and quadratic terms integrate to arctan after completing the square."
        },
        {
          q: "How do you evaluate a definite integral using the Fundamental Theorem of Calculus?",
          a: "First find an antiderivative F(x) such that F'(x) = f(x), then evaluate F(b) - F(a) at the upper and lower limits."
        }
      ]
    },
    taylor: {
      title: "Step-by-Step Taylor & Maclaurin Series Calculator",
      shortTitle: "Taylor & Maclaurin Series",
      metaDescription: "Step-by-step Taylor and Maclaurin Polynomial and Series calculator around x0 up to order n. Displays all successive derivatives f^(k)(x), their evaluation f^(k)(x0), and the Lagrange remainder.",
      h1: "Taylor & Maclaurin Series Step-by-Step",
      subtitle: "Systematic computation of successive derivatives f⁽ᵏ⁾(x), evaluation at the expansion center x₀, and term-by-term assembly of the Taylor polynomial Pₙ(x).",
      placeholderDirect: "Format f(x) ; x0 ; n -> e.g. exp(x) ; 0 ; 4  or  cos(x) ; 0 ; 6  or  ln(x) ; 1 ; 4",
      examLabels: ["Maclaurin of e^x (Order 4)", "Maclaurin of cos(x) (Order 6)", "Taylor of ln(x) at x₀=1", "Maclaurin of 1/(1 - x)"],
      guideTitle: "Quick Guide & Key Formulas: Taylor Polynomials, Maclaurin Series & Lagrange Remainder",
      guideIntro: "Taylor's Theorem approximates any n-times differentiable function around a center x₀ by a polynomial Pₙ(x) whose derivatives of orders 0 through n match those of f(x) at x = x₀. When centered at the origin (x₀ = 0), it is called a Maclaurin Series.",
      formulas: [
        {
          name: "General Formula for the Order-n Taylor Polynomial at x₀",
          note: "Each coefficient c_k = f^(k)(x₀) / k! is obtained by evaluating the k-th derivative at x₀ and dividing by k!."
        },
        {
          name: "Classic Maclaurin Expansions (x₀ = 0)",
          note: "These three series converge on the entire real line x ∈ (-∞, ∞) (radius of convergence R = ∞)."
        },
        {
          name: "Geometric & Logarithmic Series",
          note: "The expansion of ln(x) centered at x₀ = 1 is obtained by substituting x → (x - 1) in ln(1 + u)."
        },
        {
          name: "Lagrange Remainder Term Rₙ(x)",
          note: "Provides a rigorous upper bound on the truncation error at order n."
        }
      ],
      tips: [
        "Enter the function, expansion center x₀, and order n separated by semicolons: f(x) ; x0 ; n (for example: ln(x) ; 1 ; 4).",
        "If a function is even (like cos(x)), all odd derivatives at x₀ = 0 vanish; if it is odd (like sin(x)), all even derivatives vanish.",
        "To evaluate indeterminate 0/0 limits, replace each function by its Taylor polynomial up to the first non-zero term."
      ],
      faqs: [
        {
          q: "What is the difference between a Taylor Series and a Maclaurin Series?",
          a: "A Maclaurin Series is simply the special case of a Taylor Series centered at the origin x0 = 0, expanding in powers of x^k rather than (x - x0)^k."
        },
        {
          q: "How are the coefficients of a Taylor Polynomial of order n computed?",
          a: "For each k from 0 to n, compute the k-th derivative f^(k)(x), evaluate it at x0 to get f^(k)(x0), and divide by k factorial: c_k = f^(k)(x0) / k!."
        },
        {
          q: "Why can't ln(x) be expanded as a Maclaurin series at x0 = 0?",
          a: "Because ln(x) and its derivatives (-1)^{k-1}(k-1)!/x^k are undefined at x = 0. Instead, ln(x) is expanded around x0 = 1, or ln(1 + x) is expanded around x0 = 0."
        },
        {
          q: "How do you bound the approximation error of a Taylor Polynomial?",
          a: "Using the Lagrange Remainder R_n(x) = f^(n+1)(ξ) / (n+1)! · (x - x0)^(n+1) for some ξ between x0 and x."
        }
      ]
    },
    numseries: {
      title: "Step-by-Step Numerical Series Convergence & Exact Sum Calculator",
      shortTitle: "Numerical Series",
      metaDescription: "Step-by-step infinite Numerical Series convergence and exact sum calculator. Applies necessary condition, D'Alembert ratio test, Cauchy root test, p-series, Leibniz test, and symbolic summation.",
      h1: "Numerical Series (Convergence Tests & Exact Sum)",
      subtitle: "Rigorous step-by-step convergence analysis: necessary condition lim aₙ = 0, geometric series, p-series, D'Alembert's ratio test, Cauchy's root test, Leibniz alternating test, and exact sum.",
      placeholderDirect: "Format a_n ; n0 -> e.g. 1/2^n ; 1  or  n/(n+1) ; 1  or  2^n/factorial(n) ; 0  or  (-1)^(n+1)/n ; 1",
      examLabels: ["Geometric Series ∑ 1/2ⁿ", "Necessary Condition (Divergent)", "D'Alembert Factorial ∑ 2ⁿ/n!", "Alternating Leibniz ∑ (-1)ⁿ⁺¹/n"],
      guideTitle: "Quick Guide & Key Formulas: Convergence Tests & Infinite Series Summation",
      guideIntro: "Analyzing an infinite numerical series ∑ aₙ consists of determining whether the sequence of partial sums S_N converges to a finite limit as N → ∞. Always start by checking the necessary condition: if lim_{n→∞} aₙ ≠ 0, the series diverges immediately.",
      formulas: [
        {
          name: "Necessary Condition for Convergence & Geometric Series",
          note: "Careful: lim a_n = 0 is necessary but NOT sufficient (e.g. the harmonic series ∑ 1/n has lim 1/n = 0 yet diverges)."
        },
        {
          name: "D'Alembert Ratio Test & Cauchy Root Test",
          note: "Use D'Alembert when a_n contains factorials (n!) or products, and Cauchy when the entire term is raised to power n."
        },
        {
          name: "Generalized Harmonic Series (Riemann p-Series)",
          note: "Serves as a benchmark for limit comparison tests with rational polynomial quotients."
        },
        {
          name: "Leibniz Alternating Series Test ∑ (-1)ⁿ bₙ (bₙ > 0)",
          note: "If ∑ |a_n| diverges while ∑ a_n converges by Leibniz (like ∑ (-1)^{n+1}/n = ln 2), the series is Conditionally Convergent."
        }
      ],
      tips: [
        "Always check lim_{n→∞} a_n first: if it is non-zero, the series diverges in a single step.",
        "If the general term is a rational quotient P(n)/Q(n), compare asymptotically with the p-series 1/n^{deg(Q) - deg(P)}.",
        "For a geometric series ∑ r^n starting at n = n₀, the exact sum is always (first term) / (1 - ratio) = r^{n₀} / (1 - r)."
      ],
      faqs: [
        {
          q: "If the limit of the general term lim a_n equals 0, does the series always converge?",
          a: "No. Having lim_{n→∞} a_n = 0 is a necessary condition, NOT a sufficient one. For example, the harmonic series ∑ 1/n satisfies lim 1/n = 0 yet diverges to infinity."
        },
        {
          q: "When should you use D'Alembert's Ratio Test vs. Cauchy's Root Test?",
          a: "Use D'Alembert's Ratio Test (lim |a_{n+1}/a_n|) when a_n involves factorials (n!) or products, and Cauchy's Root Test (lim ⁿ√|a_n|) when the entire term is raised to the power n."
        },
        {
          q: "What is the difference between absolute convergence and conditional convergence?",
          a: "A series converges absolutely if ∑ |a_n| converges. It converges conditionally if ∑ a_n converges (e.g., by Leibniz's test) while ∑ |a_n| diverges (such as ∑ (-1)^{n+1}/n = ln 2)."
        },
        {
          q: "How do you find the exact sum of a geometric or telescoping series?",
          a: "For a convergent geometric series (|r| < 1) starting at n0, S = r^{n0} / (1 - r). For a telescoping series like ∑ 1/(n(n+1)), expand into partial fractions 1/n - 1/(n+1) so intermediate terms cancel."
        }
      ]
    },
    matrix: {
      title: "Step-by-Step 2x2 & 3x3 Matrix Diagonalization Calculator",
      shortTitle: "Matrix Diagonalization",
      metaDescription: "Step-by-step 2x2 and 3x3 Matrix Diagonalization calculator. Computes the characteristic polynomial |A - λI| = 0, eigenvalues, eigenvectors, invertible matrix P, and diagonal matrix D.",
      h1: "Matrix Diagonalization (2×2 & 3×3)",
      subtitle: "Detailed computation of the characteristic equation |A - λI| = 0, eigenvalue spectrum, homogeneous linear systems for each eigenspace, modal matrix P, and diagonal matrix D.",
      placeholderDirect: "Rows separated by ';' -> e.g. 4, 1; 2, 3 or 2, 0, 0; 1, 2, 1; -1, 0, 1",
      examLabels: ["2×2 Matrix (Distinct Eigenvalues)", "2×2 Real Symmetric Matrix", "3×3 Diagonalizable Matrix", "2×2 Non-Diagonalizable (Jordan)"],
      guideTitle: "Quick Guide & Key Formulas: Spectral Matrix Diagonalization A = P·D·P⁻¹",
      guideIntro: "A square matrix A ∈ ℝ^{n×n} is diagonalizable if and only if ℝ^n admits a basis consisting entirely of eigenvectors of A. In that eigenbasis, the linear transformation simply scales each coordinate axis by its eigenvalue λ_i, enabling instant computation of matrix powers A^k = P·D^k·P⁻¹.",
      formulas: [
        {
          name: "Characteristic Equation & Polynomial",
          note: "For 2×2 matrices it always holds that p(λ) = λ² - tr(A)λ + det(A) = 0."
        },
        {
          name: "Eigenspace E(λ_i) Associated with an Eigenvalue",
          note: "The dimension of this subspace is the geometric multiplicity: m_g(λ_i) = n - rank(A - λ_i I)."
        },
        {
          name: "Diagonalizability Criterion Theorem",
          note: "Every real symmetric matrix (A = A^T) is always orthogonally diagonalizable with real eigenvalues."
        },
        {
          name: "Similarity Relation & n-th Matrix Power",
          note: "The column order of eigenvectors in P must match the order of eigenvalues along the diagonal of D."
        }
      ],
      tips: [
        "Always verify that the sum of all eigenvalues equals trace(A) and their product equals det(A).",
        "If all eigenvalues are real and distinct (algebraic multiplicity m_a = 1 each), the matrix is guaranteed to be diagonalizable.",
        "When an eigenvalue has algebraic multiplicity m_a = 2, check immediately whether rank(A - λI) = n - 2; otherwise the matrix is defective and requires Jordan form."
      ],
      faqs: [
        {
          q: "How do you know if a square matrix A is diagonalizable?",
          a: "A matrix A of size n×n is diagonalizable over ℝ if and only if the sum of algebraic multiplicities of its real eigenvalues equals n, and for every eigenvalue λ_i its geometric multiplicity m_g(λ_i) = n - rank(A - λ_i·I) equals its algebraic multiplicity m_a(λ_i)."
        },
        {
          q: "How do you construct the modal matrix P and diagonal matrix D?",
          a: "Place the eigenvalues λ_1, ..., λ_n along the main diagonal of D, and place the corresponding linearly independent eigenvectors v_1, ..., v_n as columns of P in the exact same column order."
        },
        {
          q: "Why is every real symmetric matrix diagonalizable?",
          a: "By the Real Spectral Theorem: every real symmetric matrix (A = A^T) has only real eigenvalues and mutually orthogonal eigenspaces, so it is always orthogonally diagonalizable."
        },
        {
          q: "Why is diagonalizing a matrix useful in engineering (A = P·D·P⁻¹)?",
          a: "It reduces high matrix powers A^k = P·D^k·P⁻¹ and matrix exponentials e^{At} = P·e^{Dt}·P⁻¹ to raising or exponentiating scalar diagonal entries."
        }
      ]
    },
    gauss: {
      title: "Step-by-Step Gauss-Jordan & Rouché–Capelli Linear Systems Calculator",
      shortTitle: "Linear Systems (Gauss-Jordan)",
      metaDescription: "Step-by-step solver for linear systems Ax = b (2x2, 3x3, 4x4) using Gauss-Jordan elimination and the Rouché–Capelli theorem. Displays elementary row operations and RREF.",
      h1: "Systems of Linear Equations (Gauss-Jordan & Rouché–Capelli)",
      subtitle: "Step-by-step Gaussian elimination showing every elementary row operation (Fᵢ ← Fᵢ + αFⱼ) on the augmented matrix (A|b), rank calculation, and consistency classification.",
      placeholderDirect: "Augmented matrix (A|b) rows separated by ';' -> e.g. 1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2",
      examLabels: ["3×3 Unique Solution (Consistent)", "3×3 Infinite Solutions (Underdetermined)", "3×3 Inconsistent System (No Solution)", "4×4 Unique Solution System"],
      guideTitle: "Quick Guide & Key Formulas: Gauss-Jordan Elimination & Rouché–Capelli Theorem",
      guideIntro: "Gauss-Jordan elimination transforms the augmented matrix (A|b) of a linear system Ax = b into its Reduced Row Echelon Form (RREF) via elementary row operations. The Rouché–Capelli theorem classifies existence and uniqueness by comparing rank(A) and rank(A|b).",
      formulas: [
        {
          name: "Rouché–Capelli (Rouché–Frobenius) Theorem",
          note: "Here n is the number of unknowns and r = rank(A) is the number of non-zero pivots."
        },
        {
          name: "Elementary Row Operations",
          note: "To eliminate the entry in row i and pivot column j, subtract a_ij / a_jj times pivot row F_j from F_i."
        },
        {
          name: "Reduced Row Echelon Form (RREF)",
          note: "In RREF, every leading pivot equals 1 and is the only non-zero entry in its column."
        },
        {
          name: "Degrees of Freedom in Underdetermined Systems",
          note: "Unknowns whose columns lack a pivot are freely parameterized (λ, μ, ...)."
        }
      ],
      tips: [
        "Enter each row of the augmented matrix (A|b) separating coefficients with commas and rows with a semicolon ';'. The last number in each row is the constant b_i.",
        "If a row of the form (0  0  0 | c) with c ≠ 0 appears during elimination, stop immediately: rank(A) < rank(A|b) and the system is inconsistent.",
        "Always swap in a row with a leading 1 as pivot to avoid fractions as long as possible."
      ],
      faqs: [
        {
          q: "How do you classify a linear system using the Rouché–Capelli (Rouché–Frobenius) theorem?",
          a: "Compare rank(A), rank(A|b), and the number of unknowns n. If rank(A) < rank(A|b), the system is Inconsistent (no solution). If rank(A) = rank(A|b) = n, it has a Unique Solution. If rank(A) = rank(A|b) < n, it has Infinitely Many Solutions with n - rank(A) free parameters."
        },
        {
          q: "What is the difference between Gaussian elimination and Gauss-Jordan elimination?",
          a: "Gaussian elimination only zeroes entries below each pivot to reach upper triangular form, whereas Gauss-Jordan elimination normalizes pivots to 1 and zeroes entries both above and below each pivot (RREF)."
        },
        {
          q: "Which elementary row operations are allowed in Gauss-Jordan elimination?",
          a: "1) Swapping two rows (Fi ↔ Fj), 2) Multiplying a row by a non-zero scalar (Fi ← k·Fi), and 3) Adding a scalar multiple of one row to another (Fi ← Fi + α·Fj)."
        },
        {
          q: "How do you identify free variables in an underdetermined system?",
          a: "In RREF, columns containing a leading 1 pivot correspond to basic variables, whereas columns without a pivot correspond to free parameters (λ, μ)."
        }
      ]
    },
    phasors: {
      title: "Step-by-Step AC Phasor & Complex Numbers Calculator",
      shortTitle: "Phasors & AC Circuits",
      metaDescription: "Phasor and complex number calculator for AC Circuit Analysis. Mix rectangular (a+bj) and polar (M∠θ°) forms, convert step-by-step with quadrant adjustment, and solve 2x2/3x3 complex mesh systems.",
      h1: "AC Circuit Phasors & Complex Numbers Calculator",
      subtitle: "Mixed arithmetic in rectangular (a + bj) and polar (M∠θ°) form, detailed magnitude and quadrant-aware angle conversion, and 2×2 / 3×3 AC mesh/nodal linear systems.",
      directLabel: "Phasor Arithmetic & Conversion (a+bj ↔ M∠θ°)",
      inverseLabel: "Complex 2×2 / 3×3 AC System (Mesh / Nodal)",
      placeholderDirect: "Mix rectangular & polar -> e.g. (3 + 4j) * (10<30) / (2 - 2j)  or  -3 + 4j",
      placeholderInverse: "Complex augmented matrix (Z|V) separated by ';' -> e.g. 4+2j, -2j, 10<0 ; -2j, 2+4j, 0",
      examLabels: ["Mixed Rectangular × Polar", "Parallel Equivalent Impedance", "2nd Quadrant Conversion (-3+4j)", "2×2 AC Mesh Current System"],
      guideTitle: "Quick Guide & Key Formulas: Phasor Algebra & Sinusoidal Steady-State Analysis",
      guideIntro: "In AC Circuit Theory, the Steinmetz phasor transform converts linear integro-differential equations under sinusoidal excitation v(t) = V_m cos(ωt + φ) into complex linear algebraic systems where inductors have impedance Z_L = jωL and capacitors have impedance Z_C = -j/(ωC).",
      formulas: [
        {
          name: "Rectangular to Polar Conversion with Quadrant Adjustment",
          note: "Remember to add or subtract 180° when the real part 'a' is negative (2nd and 3rd quadrants)."
        },
        {
          name: "Polar to Rectangular Conversion (Euler's Formula)",
          note: "Rectangular form is required for addition/subtraction; polar form is optimal for multiplication/division."
        },
        {
          name: "Direct Product & Quotient in Polar Form",
          note: "Multiplying phasors multiplies their magnitudes and adds their phase angles in degrees."
        },
        {
          name: "AC Mesh/Nodal Solution via Complex Cramer's Rule",
          note: "Yields each mesh current or node voltage directly in rectangular and polar form (amplitude and phase)."
        }
      ],
      tips: [
        "To enter a polar phasor with angle in degrees, use '<' or '∠': for example 10<30 or 10∠-45.",
        "Before adding or subtracting two polar phasors (e.g. 5<30 + 4<-60), always convert them to rectangular form a + bj.",
        "In a passive AC mesh system without dependent sources, the impedance matrix Z is symmetric across the main diagonal."
      ],
      faqs: [
        {
          q: "How do you convert a complex number from rectangular (a + bj) to polar (M∠θ°) form?",
          a: "Compute magnitude via Pythagoras M = √(a² + b²) and angle via arctan(b/a) with quadrant adjustment: if real part 'a' is negative (2nd or 3rd quadrant), add 180° (for b ≥ 0) or subtract 180° (for b < 0)."
        },
        {
          q: "How do you convert a polar phasor (M∠θ°) to rectangular form?",
          a: "Apply Euler's formula M·e^{jθ} = M·cos(θ) + j·M·sin(θ), where a = M·cos(θ) and b = M·sin(θ) with θ in degrees."
        },
        {
          q: "Which form is best for adding, subtracting, multiplying, or dividing phasors?",
          a: "Use rectangular form (a + bj) for addition and subtraction, and polar form (M∠θ°) for multiplication and division."
        },
        {
          q: "How do you solve AC mesh or nodal equations?",
          a: "Form the complex matrix equation Z·I = V using impedances R, jωL, and -j/(ωC), then apply complex Cramer's rule or Gaussian elimination to obtain each current in polar form I_m∠φ°."
        }
      ]
    }
  },
  fr: {
    fourier: {
      title: "Calculatrice de Transformée de Fourier Étape par Étape",
      shortTitle: "Transformée de Fourier",
      metaDescription: "Calculatrice en ligne de Transformée de Fourier directe et inverse étape par étape. Résout exponentielles causales e^(-at)u(t), impulsions rect(t), cosinus et deltas de Dirac 100% dans le navigateur.",
      h1: "Transformée de Fourier (Directe et Inverse)",
      subtitle: "Analyse spectrale continue en pulsation ω avec détail de l'intégrale impropre, identités d'Euler et propriétés des tables.",
      directLabel: "Transformée Directe F(ω) = ℱ{f(t)}",
      inverseLabel: "Transformée Inverse f(t) = ℱ⁻¹{F(ω)}",
      placeholderDirect: "Ex : exp(-3*t)*u(t), rect(t/4), cos(5*t), delta(t) + 2*delta(t-3)",
      placeholderInverse: "Ex : 1/(3 + j*w), 6/(9 + w^2)",
      examLabels: ["Exponentielle causale", "Impulsion rectangulaire", "Porteuse harmonique", "Train d'impulsions de Dirac"],
      guideTitle: "Guide Rapide et Formules Clés : Transformée de Fourier en Ingénierie",
      guideIntro: "En théorie du Traitement du Signal, la Transformée de Fourier continue décompose un signal temporel apériodique f(t) en sa densité spectrale de pulsation ω (rad/s). L'introduction de l'impulsion de Dirac δ(ω) permet de transformer les signaux périodiques et continus.",
      formulas: [
        {
          name: "Définition Directe et Inverse (Convention en ω)",
          note: "Le facteur de normalisation 1/(2π) apparaît exclusivement dans l'intégrale de synthèse inverse."
        },
        {
          name: "Exponentielle Causale Unilatérale (Filtre Passe-Bas RC)",
          note: "L'échelon de Heaviside u(t) borne l'intégrale à [0, ∞). Son module vaut 1/√(a² + ω²) et sa phase -arctan(ω/a)."
        },
        {
          name: "Porte Rectangulaire et Dualité Sinus Cardinal",
          note: "Plus l'impulsion est étroite dans le temps (T petit), plus son lobe principal est large en fréquence (Principe d'Incertitude)."
        },
        {
          name: "Oscillateurs Harmoniques et Impulsions de Dirac",
          note: "Obtenu par la formule d'Euler cos(ω₀t) = (e^{jω₀t} + e^{-jω₀t})/2 et le théorème du décalage fréquentiel."
        }
      ],
      tips: [
        "Vérifiez toujours si le signal est multiplié par l'échelon u(t) : cela réduit la borne inférieure d'intégration de -∞ à 0.",
        "Pour transformer des fonctions trigonométriques pures, utilisez l'identité d'Euler afin de passer aux exponentielles complexes.",
        "Un retard temporel t → (t - t₀) ne modifie pas le module du spectre |F(ω)|, il ajoute uniquement un déphasage linéaire -ω·t₀."
      ],
      faqs: [
        {
          q: "Comment calculer la Transformée de Fourier d'une exponentielle causale e^(-at)u(t) ?",
          a: "Comme l'échelon de Heaviside u(t) s'annule pour t < 0, les bornes de l'intégrale passent de (-∞, ∞) à [0, ∞). En regroupant les exposants en e^{-(a + jω)t}, la primitive converge pour Re(a) > 0 vers F(ω) = 1 / (a + jω)."
        },
        {
          q: "Quelle est la Transformée de Fourier d'une porte rectangulaire rect(t/T) ?",
          a: "Une impulsion rectangulaire d'amplitude A et de largeur T vaut A sur [-T/2, T/2]. En intégrant e^{-jωt} sur cet intervalle et en appliquant la formule d'Euler, on obtient le sinus cardinal : F(ω) = A·T·sinc(ωT/2)."
        },
        {
          q: "Pourquoi la Transformée de Fourier de cos(ω0·t) contient-elle des impulsions de Dirac ?",
          a: "Car cos(ω0·t) est un signal périodique d'énergie infinie. En décomposant cos(ω0·t) = (e^{jω0t} + e^{-jω0t})/2 par Euler, son spectre se concentre en deux impulsions de Dirac situées en ±ω0 : F(ω) = π[δ(ω - ω0) + δ(ω + ω0)]."
        },
        {
          q: "Quelle est la différence entre la Transformée de Fourier en pulsation ω et en fréquence f (Hz) ?",
          a: "Avec la convention en pulsation ω = 2πf (rad/s), le facteur 1/(2π) n'apparaît que dans l'intégrale de synthèse inverse."
        }
      ]
    },
    ztransform: {
      title: "Calculatrice de Transformée en Z Directe et Inverse Étape par Étape",
      shortTitle: "Transformée en Z",
      metaDescription: "Calculatrice en ligne de Transformée en Z directe et inverse étape par étape. Affiche la division X(z)/z, la décomposition en éléments simples et l'inversion par tables.",
      h1: "Transformée en Z (Directe et Inverse)",
      subtitle: "Analyse des signaux et systèmes à temps discret avec division explicite X(z)/z, décomposition en éléments simples et application des tables causales.",
      directLabel: "Transformée en Z Directe X(z) = 𝒫{x[n]}",
      inverseLabel: "Transformée en Z Inverse x[n] = 𝒫⁻¹{X(z)} (Méthode X(z)/z)",
      placeholderDirect: "Ex : (0.5)^n*u[n], n*(2)^n*u[n], (3)^n*u[n] + 2*delta[n-1]",
      placeholderInverse: "Ex : z/((z-1)*(z-2)), (2*z^2 - 0.5*z)/(z^2 - 1.5*z + 0.5), z/(z-0.5)^2",
      examLabels: ["Inverse (Pôles simples X(z)/z)", "Inverse (Deux pôles réels)", "Inverse (Pôle double z = 2)", "Directe (Géométrique + rampe)"],
      guideTitle: "Guide Rapide et Formules Clés : Transformée en Z en Traitement Numérique (DSP)",
      guideIntro: "La Transformée en Z est l'équivalent discret de la Transformée de Laplace pour analyser les filtres numériques FIR/IIR et les équations aux différences. Pour calculer la Transformée en Z Inverse par éléments simples, divisez toujours d'abord par z pour former X(z)/z.",
      formulas: [
        {
          name: "Méthode des Éléments Simples Normalisés par z",
          note: "Diviser d'abord par z garantit des blocs z/(z - p_k) directement inversibles en suites géométriques."
        },
        {
          name: "Paire de Base : Suite Exponentielle Causale a^n u[n]",
          note: "Pour a = 1 on obtient la transformée de l'échelon discret unitaire u[n] : z / (z - 1)."
        },
        {
          name: "Propriété de Dérivation en z (Rampe Exponentielle n·a^n u[n])",
          note: "Apparaît dès que la fonction de transfert X(z) possède un pôle double en z = a."
        },
        {
          name: "Impulsion Discrète de Kronecker et Retard Temporel",
          note: "Chaque puissance négative isolée z^{-k} s'inverse en une impulsion décalée de k échantillons."
        }
      ],
      tips: [
        "Ne décomposez jamais directement X(z) en éléments simples : divisez toujours d'abord par z pour décomposer X(z)/z puis multipliez par z à la fin.",
        "Un système LTI discret causal est BIBO-stable si et seulement si tous les pôles de H(z) sont strictement à l'intérieur du cercle unité (|p_k| < 1).",
        "Si un terme A₀/z apparaît dans X(z)/z, la multiplication par z donne la constante A₀, dont l'antécédent est l'impulsion unité A₀·δ[n]."
      ],
      faqs: [
        {
          q: "Pourquoi divise-t-on par z (en formant X(z)/z) pour calculer la Transformée en Z Inverse ?",
          a: "Parce que les paires fondamentales des tables en Z, comme Z{a^n u[n]} = z/(z - a), possèdent un facteur z au numérateur. En décomposant X(z)/z en A_k/(z - p_k) puis en remultipliant par z, on obtient directement des blocs A_k·z/(z - p_k)."
        },
        {
          q: "Comment savoir si un filtre numérique H(z) est stable ?",
          a: "Un filtre numérique causal est BIBO-stable si et seulement si tous les pôles de sa fonction de transfert H(z) ont un module strictement inférieur à 1 (|p_k| < 1)."
        },
        {
          q: "Comment calculer la Transformée en Z d'une rampe exponentielle n·a^n·u[n] ?",
          a: "En appliquant la propriété de dérivation dans le domaine Z : Z{n·x[n]} = -z·d/dz X(z) sur z/(z - a), ce qui donne a·z / (z - a)²."
        },
        {
          q: "Que représente la Région de Convergence (ROC) de la Transformée en Z ?",
          a: "La ROC est la couronne du plan complexe z où la série ∑ x[n]z^{-n} converge absolument. Pour une suite causale, c'est l'extérieur du cercle passant par le pôle de plus grand module : |z| > max|p_k|."
        }
      ]
    },
    convolution: {
      title: "Calculatrice de Convolution Continue et Discrète Étape par Étape",
      shortTitle: "Convolution Continue et Discrète",
      metaDescription: "Calculatrice étape par étape de Convolution Continue x(t)*h(t) et Discrète x[n]*h[n]. Détaille le retournement et décalage h(t-τ), les bornes par échelons u(t) et l'intégration symbolique.",
      h1: "Convolution Continue x(t) * h(t) et Discrète x[n] * h[n]",
      subtitle: "Calcul analytique de la réponse des systèmes LTI par intégrale ou somme de convolution, détaillant retournement temporel, décalage et bornes actives par échelons.",
      directLabel: "Convolution Continue y(t) = x(t) * h(t)",
      inverseLabel: "Convolution Discrète y[n] = x[n] * h[n]",
      placeholderDirect: "Format x(t) ; h(t) -> Ex : exp(-2*t)*u(t) ; exp(-3*t)*u(t) ou exp(-2*t)*u(t) ; u(t)",
      placeholderInverse: "Format x[n] ; h[n] -> Ex : (0.5)^n*u[n] ; u[n] ou [1, 2, 1] ; [1, -1]",
      examLabels: ["Deux exponentielles causales", "Réponse indicielle RC", "Discrète (Exponentielle * Échelon)", "Discrète (Séquences finies FIR)"],
      guideTitle: "Guide Rapide et Formules Clés : Intégrale et Somme de Convolution des Systèmes LTI",
      guideIntro: "Le produit de convolution détermine la sortie y(t) ou y[n] de tout système Linéaire Invariant dans le Temps (LTI) à partir de sa réponse impulsionnelle h(t) ou h[n]. La méthode comporte 4 étapes : retournement h(-τ), décalage h(t - τ), intersection des échelons u(τ)·u(t - τ) et intégration.",
      formulas: [
        {
          name: "Bornes Causales par Échelons u(τ)·u(t - τ)",
          note: "Pour deux signaux causaux (nuls pour t < 0), les bornes passent de (-∞, ∞) à [0, t] pour t ≥ 0."
        },
        {
          name: "Convolution de Deux Exponentielles Causales Distinctes (a ≠ b)",
          note: "Si les pôles coïncident (a = b), le résultat est la rampe amortie : t·e^{-at}u(t)."
        },
        {
          name: "Somme de Convolution Discrète et Série Géométrique Finie",
          note: "Rappel : la somme de k = 0 à n contient exactement (n + 1) termes."
        },
        {
          name: "Théorème de Convolution (Dualité Laplace / Fourier / Z)",
          note: "Permet de vérifier toute convolution en multipliant les transformées puis en inversant par éléments simples."
        }
      ],
      tips: [
        "Séparez toujours les deux signaux par un point-virgule ';' dans le champ de saisie : d'abord x(t) puis h(t).",
        "Lors de la convolution de deux signaux causaux multipliés par u(t), n'oubliez pas de multiplier le résultat final par u(t).",
        "En convolution discrète de deux suites finies de longueurs N et M, la suite résultante a pour longueur exacte L = N + M - 1."
      ],
      faqs: [
        {
          q: "Comment déterminer les bornes d'intégration dans une convolution avec échelons u(t) ?",
          a: "Dans ∫ x(τ)h(t - τ) dτ, le produit u(τ)·u(t - τ) impose τ ≥ 0 et t - τ ≥ 0 (soit τ ≤ t). Pour t ≥ 0, les bornes (-∞, ∞) se réduisent donc à l'intervalle fini [0, t]."
        },
        {
          q: "Quelle est la longueur de la convolution discrète de deux séquences finies ?",
          a: "Si l'entrée x[n] comporte N échantillons et la réponse impulsionnelle FIR h[n] en comporte M, la sortie y[n] comporte exactement L = N + M - 1 échantillons."
        },
        {
          q: "Comment vérifier le résultat d'un produit de convolution ?",
          a: "Grâce au Théorème de Plancherel/Convolution dans le domaine de Laplace : calculez Y(s) = X(s)·H(s) puis prenez la transformée inverse par éléments simples."
        },
        {
          q: "Que donne la convolution d'un signal x(t) avec une impulsion de Dirac δ(t - t0) ?",
          a: "L'impulsion de Dirac est l'élément neutre de la convolution : x(t) * δ(t - t0) = x(t - t0), ce qui décale simplement le signal à l'instant t0."
        }
      ]
    },
    fourierseries: {
      title: "Calculatrice de Séries de Fourier (Trigonométrique et Exponentielle) Étape par Étape",
      shortTitle: "Séries de Fourier",
      metaDescription: "Calculatrice en ligne de Séries de Fourier trigonométrique (a0, an, bn) et exponentielle complexe (cn) étape par étape sur [-L, L]. Analyse la parité, les intégrales et le développement à l'harmonique N.",
      h1: "Séries de Fourier (Trigonométrique a₀, aₙ, bₙ et Exponentielle cₙ)",
      subtitle: "Décomposition harmonique des signaux périodiques sur [-L, L] avec analyse préalable de la parité paire/impaire, calcul explicite des intégrales et somme partielle d'ordre N.",
      directLabel: "Série Trigonométrique (a₀, aₙ, bₙ)",
      inverseLabel: "Série Exponentielle Complexe (cₙ)",
      placeholderDirect: "Format f(x) ; L ; N -> Ex : x ; pi ; 4  ou  x^2 ; pi ; 3  ou  abs(x) ; pi ; 3",
      placeholderInverse: "Format f(x) ; L ; N -> Ex : x ; pi ; 3  ou  sign(x) ; pi ; 5",
      examLabels: ["Dent de scie f(x) = x", "Signal carré f(x) = sgn(x)", "Parabole paire f(x) = x²", "Onde triangulaire f(x) = |x|"],
      guideTitle: "Guide Rapide et Formules Clés : Séries de Fourier et Propriétés de Symétrie",
      guideIntro: "Tout signal périodique de période T = 2L vérifiant les conditions de Dirichlet peut se décomposer en une somme infinie d'harmoniques sinusoïdaux de pulsations multiples de ω₀ = π/L. L'étude de la parité (fonction paire ou impaire) avant d'intégrer divise par deux les calculs en examen.",
      formulas: [
        {
          name: "Coefficients Trigonométriques d'Euler-Fourier sur [-L, L]",
          note: "Le terme constant a₀/2 représente exactement la valeur moyenne (composante continue) sur une période."
        },
        {
          name: "Simplification par Parité (Fonctions Paires et Impaires)",
          note: "Le produit d'une fonction paire par une fonction impaire est impair, donc son intégrale sur [-L, L] est nulle."
        },
        {
          name: "Série de Fourier Exponentielle Complexe et Lien avec (aₙ, bₙ)",
          note: "Les coefficients complexes c_n définissent le spectre discret bilatéral d'amplitude |c_n| et de phase arg(c_n)."
        },
        {
          name: "Égalité de Parseval (Puissance Moyenne du Signal Périodique)",
          note: "Très utilisée aux examens pour déduire des sommes de séries comme ∑ 1/n² = π²/6 ou ∑ 1/n⁴ = π⁴/90."
        }
      ],
      tips: [
        "Avant toute intégration par parties, vérifiez toujours si f(-x) = f(x) (Paire, donc b_n = 0) ou si f(-x) = -f(x) (Impaire, donc a_0 = a_n = 0).",
        "Lors de l'évaluation aux bornes de [-π, π], utilisez cos(nπ) = (-1)^n et sin(nπ) = 0 pour tout entier n.",
        "Aux points de discontinuité de première espèce, la série de Fourier converge vers la demi-somme des limites à gauche et à droite : (f(x⁺) + f(x⁻))/2 (Théorème de Dirichlet)."
      ],
      faqs: [
        {
          q: "Comment savoir si les coefficients an ou bn d'une Série de Fourier sont nuls sans intégrer ?",
          a: "En étudiant la parité de f(x) sur un intervalle symétrique [-L, L]. Si f(x) est PAIRE (f(-x) = f(x), comme x² ou |x|), tous les coefficients bn = 0. Si f(x) est IMPAIRE (f(-x) = -f(x), comme x ou sgn(x)), alors a0 = 0 et tous les coefficients an = 0."
        },
        {
          q: "Comment passer des coefficients trigonométriques (a0, an, bn) aux coefficients exponentiels complexes (cn) ?",
          a: "Par les formules d'Euler : c0 = a0 / 2, cn = (an - j·bn) / 2 pour n ≥ 1 et c_{-n} = (an + j·bn) / 2."
        },
        {
          q: "Pourquoi remplace-t-on cos(n·π) par (-1)^n dans les Séries de Fourier ?",
          a: "Parce que pour tout entier n, cos(π) = -1, cos(2π) = 1, cos(3π) = -1, ce qui correspond exactement à (-1)^n, tandis que sin(nπ) = 0."
        },
        {
          q: "Comment utiliser une Série de Fourier pour calculer la somme d'une série numérique comme ∑ 1/n² ?",
          a: "On évalue la Série de Fourier en un point de continuité (par exemple x = π ou x = 0 pour f(x) = x²) ou on applique l'égalité de Parseval."
        }
      ]
    },
    laplace: {
      title: "Calculatrice de Transformée de Laplace et Éléments Simples Étape par Étape",
      shortTitle: "Transformée de Laplace",
      metaDescription: "Calculatrice étape par étape de Transformée de Laplace directe et inverse. Factorise le dénominateur, calcule les pôles et décompose en éléments simples (résidus de Heaviside).",
      h1: "Transformée de Laplace (Directe et Inverse)",
      subtitle: "Résolution symbolique dans le plan complexe s avec factorisation explicite du dénominateur, calcul des pôles et décomposition en éléments simples.",
      directLabel: "Transformée Directe F(s) = ℒ{f(t)}",
      inverseLabel: "Transformée Inverse f(t) = ℒ⁻¹{F(s)} (Éléments Simples)",
      placeholderDirect: "Ex : exp(-2*t)*cos(3*t), t^2*exp(-4*t)",
      placeholderInverse: "Ex : (2*s + 5)/(s^2 + 5*s + 6), 4/(s*(s+2)^2), (s+3)/(s^2+2*s+5)",
      examLabels: ["Éléments simples (Pôles réels)", "Pôle multiple en s = -2", "Pôles complexes conjugués", "Oscillation amortie (Directe)"],
      guideTitle: "Guide Rapide et Formules Clés : Transformée de Laplace et Éléments Simples",
      guideIntro: "La Transformée de Laplace Unilatérale convertit les équations différentielles linéaires avec conditions initiales en équations algébriques polynomiales en la variable complexe s. Pour revenir au domaine temporel, on factorise le dénominateur D(s) et on décompose F(s) en éléments simples.",
      formulas: [
        {
          name: "Décomposition en Éléments Simples (Pôles Réels Simples)",
          note: "Chaque terme A_k / (s - p_k) s'inverse directement en A_k e^{p_k t} u(t)."
        },
        {
          name: "Premier Théorème de Décalage (Amortissement Exponentiel)",
          note: "Lorsque le dénominateur a des racines complexes (Δ < 0), mettez sous forme canonique (s + a)² + ω₀²."
        },
        {
          name: "Pôles Réels Multiples (Ordre m)",
          note: "Un pôle multiple en s = -a engendre des modes temporels en t^k e^{-at} typiques des régimes critiques."
        },
        {
          name: "Propriété de la Dérivée Temporelle (Conditions Initiales)",
          note: "Intègre directement l'énergie initiale stockée dans les condensateurs, bobines ou ressorts à t = 0."
        }
      ],
      tips: [
        "Avant de décomposer en éléments simples, vérifiez que la fraction rationnelle est strictement propre : degré(N) < degré(D).",
        "Si le discriminant d'un dénominateur du second ordre est négatif (Δ < 0), mettez-le sous forme canonique (s + α)² + ω² pour faire apparaître cosinus et sinus amortis.",
        "Des pôles situés dans le demi-plan gauche (Re(s) < 0) garantissent la stabilité asymptotique de la réponse temporelle f(t)."
      ],
      faqs: [
        {
          q: "Comment calculer la Transformée de Laplace Inverse par décomposition en éléments simples ?",
          a: "On factorise d'abord le dénominateur D(s) pour localiser ses pôles, on écrit la décomposition en éléments simples associée aux pôles simples ou multiples, on calcule les résidus par la méthode de Heaviside, puis on inverse chaque terme via les tables."
        },
        {
          q: "Que faire lorsque le dénominateur possède des racines complexes conjuguées ?",
          a: "On met le trinôme du dénominateur sous forme canonique (s + α)² + ω² et on ajuste le numérateur en fonction de (s + α) pour obtenir directement e^{-αt}cos(ωt) et e^{-αt}sin(ωt)."
        },
        {
          q: "Quand applique-t-on le Premier Théorème de Décalage en Laplace ?",
          a: "Dès qu'un signal temporel f(t) est multiplié par une exponentielle e^{-at} : L{e^{-at}f(t)} = F(s + a)."
        },
        {
          q: "Pourquoi la Transformée de Laplace est-elle indispensable pour les équations différentielles et circuits RLC ?",
          a: "Grâce à la propriété L{f'(t)} = sF(s) - f(0), elle transforme les équations différentielles en équations algébriques en intégrant dès le départ les conditions initiales."
        }
      ]
    },
    ode: {
      title: "Calculatrice d'Équations Différentielles (EDO 1er et 2nd Ordre) Étape par Étape",
      shortTitle: "Équations Différentielles (EDO)",
      metaDescription: "Solveur étape par étape d'Équations Différentielles Ordinaires (EDO) du 1er et 2nd ordre : variables séparables, facteur intégrant μ(x), équation caractéristique et problème de Cauchy.",
      h1: "Équations Différentielles Ordinaires (1er et 2nd Ordre)",
      subtitle: "Résolution analytique étape par étape des EDO à variables séparables, linéaires du 1er ordre par facteur intégrant μ(x) et linéaires du 2nd ordre avec conditions initiales.",
      placeholderDirect: "Ex : y' + 2*y = exp(-x) ; y(0)=3  ou  y'' - 3*y' + 2*y = 4*x  ou  y' = x*y",
      examLabels: ["Linéaire 1er Ordre + Cauchy", "Variables Séparables 1er Ordre", "2nd Ordre Non Homogène", "2nd Ordre Harmonique + Cauchy"],
      guideTitle: "Guide Rapide et Formules Clés : Équations Différentielles Ordinaires (EDO)",
      guideIntro: "Les Équations Différentielles Ordinaires modélisent les systèmes dynamiques physiques, les circuits électriques RLC et les transferts thermiques. Leur résolution analytique dépend de l'ordre et de la linéarité de l'équation.",
      formulas: [
        {
          name: "EDO Linéaire du 1er Ordre et Facteur Intégrant μ(x)",
          note: "En multipliant l'EDO normalisée par μ(x), le membre gauche devient la dérivée exacte d/dx[μ(x)·y]."
        },
        {
          name: "Équation Caractéristique en EDO Linéaire du 2nd Ordre (a r² + b r + c = 0)",
          note: "La forme de la solution homogène dépend uniquement du discriminant Δ = b² - 4ac."
        },
        {
          name: "Structure Générale des Systèmes Linéaires Non Homogènes",
          note: "La solution particulière y_p(x) s'obtient par coefficients indéterminés ou variation des constantes."
        },
        {
          name: "EDO à Variables Séparables",
          note: "Séparez tous les termes en y avec dy et tous les termes en x avec dx avant d'intégrer."
        }
      ],
      tips: [
        "N'appliquez jamais les conditions initiales y(0), y'(0) sur la seule solution homogène y_h(x) : formez d'abord la solution générale complète y(x) = y_h(x) + y_p(x).",
        "Avec la méthode des coefficients indéterminés, si le second membre e^{kx} correspond à une racine caractéristique r = k de multiplicité m, multipliez la solution particulière d'essai par x^m.",
        "Pour une EDO linéaire du premier ordre a(x)y' + b(x)y = c(x), divisez d'abord par a(x) pour normaliser le coefficient de y' à 1."
      ],
      faqs: [
        {
          q: "Comment résoudre une équation différentielle linéaire du premier ordre avec un facteur intégrant ?",
          a: "On met l'EDO sous forme normalisée y' + P(x)y = Q(x) puis on calcule le facteur intégrant μ(x) = e^{∫ P(x) dx}. En multipliant l'équation par μ(x), le membre de gauche devient la dérivée exacte (μ(x)·y)', ce qui donne y(x) = (∫ μ(x)Q(x) dx + C) / μ(x)."
        },
        {
          q: "Comment construire la solution homogène d'une EDO linéaire du 2nd ordre ?",
          a: "On résout l'équation caractéristique a·r² + b·r + c = 0. Deux racines réelles distinctes donnent C1·e^{r1x} + C2·e^{r2x} ; une racine double r donne (C1 + C2·x)e^{rx} ; des racines complexes conjuguées α ± jβ donnent e^{αx}(C1·cos(βx) + C2·sin(βx))."
        },
        {
          q: "Quand faut-il utiliser les conditions initiales y(0) et y'(0) dans un problème de Cauchy ?",
          a: "Toujours sur la solution générale complète y(x) = yh(x) + yp(x), après avoir additionné la solution particulière."
        },
        {
          q: "Comment reconnaître une équation différentielle à variables séparables ?",
          a: "Une EDO du 1er ordre est à variables séparables si elle s'écrit dy/dx = f(x)·g(y). On sépare alors les variables sous la forme dy/g(y) = f(x)dx avant d'intégrer chaque membre."
        }
      ]
    },
    integrals: {
      title: "Calculatrice d'Intégrales Indéfinies et Définies Étape par Étape",
      shortTitle: "Intégrales Étape par Étape",
      metaDescription: "Calculatrice d'intégrales indéfinies et définies étape par étape avec SymPy manualintegrate. Affiche l'intégration par parties (u et dv), le changement de variable et les éléments simples.",
      h1: "Intégrales Indéfinies et Définies Étape par Étape",
      subtitle: "Détail pédagogique de l'arbre d'intégration symbolique : intégration par parties (choix de u et dv), changement de variable u = g(x), éléments simples et calcul intégral défini.",
      directLabel: "Intégrale Indéfinie ∫ f(x) dx",
      inverseLabel: "Intégrale Définie ∫_a^b f(x) dx",
      placeholderDirect: "Ex : x*exp(2*x), x*cos(x), 2*x/(x^2 + 1), 1/(x^2 - 1)",
      placeholderInverse: "Format f(x) ; a, b -> Ex : x*exp(x) ; 0, 1  ou  sin(x) ; 0, pi",
      examLabels: ["Intégration par parties (u, dv)", "Changement de variable u = g(x)", "Fraction rationnelle", "Intégrale définie par parties"],
      guideTitle: "Guide Rapide et Formules Clés : Techniques d'Intégration et Primitives",
      guideIntro: "Le calcul de primitives repose sur l'identification de la structure de l'intégrande : changement de variable lorsqu'apparaît la dérivée d'une fonction composée, intégration par parties (règle ALPES) pour les produits polynôme × exponentielle/trigonométrique/logarithme, ou décomposition en éléments simples.",
      formulas: [
        {
          name: "Intégration par Parties et Critère ALPES",
          note: "Priorité pour choisir u : Arcsin/Inverses > Logarithmes > Polynômes > Exponentielles > Sinus/Cosinus."
        },
        {
          name: "Théorème de Changement de Variable (u = g(x))",
          note: "Cas logarithmique fondamental : ∫ g'(x)/g(x) dx = ln|g(x)| + C."
        },
        {
          name: "Intégration des Fonctions Rationnelles P(x)/Q(x)",
          note: "Si degré(P) ≥ degré(Q), effectuez d'abord la division euclidienne de polynômes."
        },
        {
          name: "Théorème Fondamental de l'Analyse (Calcul Défini)",
          note: "Lors d'un changement de variable u = g(x) dans une intégrale définie, transformez directement les bornes en u_a = g(a) et u_b = g(b)."
        }
      ],
      tips: [
        "N'oubliez jamais d'ajouter la constante d'intégration '+ C' à la fin de toute intégrale indéfinie.",
        "Pour les intégrales du type ∫ P(x)e^{ax} dx ou ∫ P(x)cos(ax) dx, choisissez toujours le polynôme comme u = P(x) afin d'abaisser son degré en dérivant.",
        "Pour une intégrale définie dans CalcWeb, saisissez la fonction suivie d'un point-virgule et des bornes séparées par une virgule : f(x) ; a, b."
      ],
      faqs: [
        {
          q: "Comment choisir 'u' et 'dv' lors d'une intégration par parties ?",
          a: "Utilisez la règle mnémotechnique ALPES : choisissez pour 'u' la fonction qui apparaît en premier parmi : 1) Arcsin/Arctan (Inverses), 2) Logarithmes, 3) Polynômes, 4) Exponentielles, 5) Sinus/Cosinus."
        },
        {
          q: "Quand appliquer un changement de variable plutôt qu'une intégration par parties ?",
          a: "Le changement de variable u = g(x) s'applique lorsque l'intégrande contient une fonction composée f(g(x)) multipliée par sa dérivée interne g'(x). L'intégration par parties s'utilise pour un produit de fonctions indépendantes comme x·e^{2x}."
        },
        {
          q: "Comment intégrer une fraction rationnelle par éléments simples ?",
          a: "On factorise le dénominateur en facteurs linéaires (x - r) qui s'intègrent en logarithmes ln|x - r|, et en facteurs quadratiques irréductibles qui s'intègrent en arctan."
        },
        {
          q: "Comment calculer une intégrale définie entre a et b ?",
          a: "On détermine d'abord une primitive F(x) de f(x), puis on calcule la différence F(b) - F(a) entre la borne supérieure et la borne inférieure."
        }
      ]
    },
    taylor: {
      title: "Calculatrice de Séries de Taylor et Maclaurin Étape par Étape",
      shortTitle: "Séries de Taylor et Maclaurin",
      metaDescription: "Calculatrice étape par étape du Polynôme et Développement Limité de Taylor et Maclaurin en x0 à l'ordre n. Affiche toutes les dérivées successives f^(k)(x) et leur évaluation f^(k)(x0).",
      h1: "Séries de Taylor et Maclaurin Étape par Étape",
      subtitle: "Calcul systématique des dérivées successives f⁽ᵏ⁾(x), évaluation au point de développement x₀ et assemblage terme à terme du polynôme de Taylor Pₙ(x).",
      placeholderDirect: "Format f(x) ; x0 ; n -> Ex : exp(x) ; 0 ; 4  ou  cos(x) ; 0 ; 6  ou  ln(x) ; 1 ; 4",
      examLabels: ["Maclaurin de e^x (Ordre 4)", "Maclaurin de cos(x) (Ordre 6)", "Taylor de ln(x) en x₀ = 1", "Maclaurin de 1/(1 - x)"],
      guideTitle: "Guide Rapide et Formules Clés : Polynômes de Taylor, Maclaurin et Reste de Lagrange",
      guideIntro: "La formule de Taylor permet d'approcher toute fonction n fois dérivable au voisinage d'un point x₀ par un polynôme Pₙ(x) dont les dérivées d'ordre 0 à n coïncident avec celles de f(x) en x = x₀. Lorsque x₀ = 0, on parle de développement de Maclaurin.",
      formulas: [
        {
          name: "Formule Générale du Polynôme de Taylor d'Ordre n en x₀",
          note: "Chaque coefficient c_k = f^(k)(x₀) / k! s'obtient en évaluant la dérivée k-ième en x₀ divisée par k!."
        },
        {
          name: "Développements Classiques de Maclaurin (x₀ = 0)",
          note: "Ces trois séries convergent sur toute la droite réelle x ∈ (-∞, ∞) (rayon de convergence R = ∞)."
        },
        {
          name: "Série Géométrique et Logarithmique",
          note: "Le développement de ln(x) centré en x₀ = 1 s'obtient en posant x → (x - 1) dans ln(1 + u)."
        },
        {
          name: "Reste de Lagrange Rₙ(x)",
          note: "Permet de majorer rigoureusement l'erreur d'approximation à l'ordre n."
        }
      ],
      tips: [
        "Saisissez la fonction, le centre x₀ et l'ordre n séparés par des points-virgules : f(x) ; x0 ; n (par exemple : ln(x) ; 1 ; 4).",
        "Si la fonction est paire (comme cos(x)), toutes ses dérivées d'ordre impair en x₀ = 0 sont nulles ; si elle est impaire (comme sin(x)), les dérivées paires s'annulent.",
        "Pour lever une forme indéterminée 0/0 dans une limite, remplacez chaque fonction par son développement limité de Taylor."
      ],
      faqs: [
        {
          q: "Quelle est la différence entre une Série de Taylor et une Série de Maclaurin ?",
          a: "La Série de Maclaurin est le cas particulier de la Série de Taylor lorsque le centre de développement est l'origine x0 = 0."
        },
        {
          q: "Comment calcule-t-on les coefficients d'un Polynôme de Taylor d'ordre n ?",
          a: "Pour chaque entier k de 0 à n, on calcule la dérivée k-ième f^(k)(x), on l'évalue en x0 et on divise par la factorielle k! : c_k = f^(k)(x0) / k!."
        },
        {
          q: "Pourquoi ne peut-on pas développer ln(x) en série de Maclaurin en x0 = 0 ?",
          a: "Parce que ln(x) et ses dérivées ne sont pas définies en x = 0. On développe donc ln(x) au voisinage de x0 = 1, ou bien ln(1 + x) en x0 = 0."
        },
        {
          q: "Comment majorer l'erreur d'approximation d'un Polynôme de Taylor ?",
          a: "Grâce à la formule du Reste de Lagrange R_n(x) = f^(n+1)(ξ) / (n+1)! · (x - x0)^(n+1) pour un ξ compris entre x0 et x."
        }
      ]
    },
    numseries: {
      title: "Calculatrice de Séries Numériques (Convergence et Somme) Étape par Étape",
      shortTitle: "Séries Numériques",
      metaDescription: "Calculatrice étape par étape de convergence et somme exacte de Séries Numériques infinies. Applique condition nécessaire, règle de D'Alembert, Cauchy, séries de Riemann, Leibniz et somme symbolique.",
      h1: "Séries Numériques (Critères de Convergence et Somme Exacte)",
      subtitle: "Étude rigoureuse de la convergence étape par étape : condition nécessaire lim aₙ = 0, séries géométriques, séries de Riemann (p-séries), règle de D'Alembert, Cauchy, Leibniz et somme exacte.",
      placeholderDirect: "Format a_n ; n0 -> Ex : 1/2^n ; 1  ou  n/(n+1) ; 1  ou  2^n/factorial(n) ; 0  ou  (-1)^(n+1)/n ; 1",
      examLabels: ["Série Géométrique ∑ 1/2ⁿ", "Condition Nécessaire (Divergente)", "D'Alembert Factorielle ∑ 2ⁿ/n!", "Alternée de Leibniz ∑ (-1)ⁿ⁺¹/n"],
      guideTitle: "Guide Rapide et Formules Clés : Critères de Convergence et Somme de Séries Infinies",
      guideIntro: "Étudier la nature d'une série numérique ∑ aₙ consiste à déterminer si la suite de ses sommes partielles S_N converge vers une limite finie lorsque N → ∞. L'étude commence toujours par la condition nécessaire : si lim_{n→∞} aₙ ≠ 0, la série diverge grossièrement.",
      formulas: [
        {
          name: "Condition Nécessaire de Convergence et Série Géométrique",
          note: "Attention : lim a_n = 0 est nécessaire mais NON suffisante (la série harmonique ∑ 1/n tend vers 0 mais diverge)."
        },
        {
          name: "Règle de D'Alembert (Quotient) et Critère de Cauchy (Racine)",
          note: "Utilisez D'Alembert en présence de factorielles (n!) et Cauchy lorsque tout a_n est à la puissance n."
        },
        {
          name: "Séries de Riemann (p-Séries)",
          note: "Servent de référence pour les comparaisons par équivalents avec les fractions rationnelles."
        },
        {
          name: "Critère Spécial des Séries Alternées (Leibniz) ∑ (-1)ⁿ bₙ",
          note: "Si ∑ |a_n| diverge alors que ∑ a_n converge par Leibniz (ex. ∑ (-1)^{n+1}/n = ln 2), la série est semi-convergente."
        }
      ],
      tips: [
        "Vérifiez toujours en premier lieu lim_{n→∞} a_n : si cette limite est non nulle, la série diverge immédiatement.",
        "Si le terme général est une fraction rationnelle P(n)/Q(n), utilisez un équivalent asymptotique pour comparer à la série de Riemann 1/n^{deg(Q) - deg(P)}.",
        "Pour une série géométrique ∑ r^n débutant en n = n₀, la somme exacte vaut (premier terme) / (1 - raison) = r^{n₀} / (1 - r)."
      ],
      faqs: [
        {
          q: "Si la limite du terme général lim a_n vaut 0, la série converge-t-elle forcément ?",
          a: "Non. Le fait que lim_{n→∞} a_n = 0 est une condition nécessaire mais NON suffisante. Par exemple, la série harmonique ∑ 1/n vérifie lim 1/n = 0 mais diverge vers +∞."
        },
        {
          q: "Quand choisir la règle de D'Alembert (quotient) ou le critère de Cauchy (racine) ?",
          a: "La règle de D'Alembert (lim |a_{n+1}/a_n|) est idéale lorsque a_n comporte des factorielles (n!), tandis que le critère de Cauchy (lim ⁿ√|a_n|) s'applique lorsque tout le terme est élevé à la puissance n."
        },
        {
          q: "Quelle est la différence entre convergence absolue et semi-convergence ?",
          a: "Une série converge absolument si ∑ |a_n| converge. Elle est semi-convergente (conditionnellement convergente) si ∑ a_n converge (par le critère de Leibniz) alors que ∑ |a_n| diverge (comme ∑ (-1)^{n+1}/n = ln 2)."
        },
        {
          q: "Comment calculer la somme exacte d'une série géométrique ou télescopique ?",
          a: "Pour une série géométrique convergente (|r| < 1) débutant à n0, S = r^{n0} / (1 - r). Pour une série télescopique comme ∑ 1/(n(n+1)), on décompose en éléments simples 1/n - 1/(n+1)."
        }
      ]
    },
    matrix: {
      title: "Calculatrice de Diagonalisation de Matrices 2x2 et 3x3 Étape par Étape",
      shortTitle: "Diagonalisation de Matrices",
      metaDescription: "Calculatrice de diagonalisation de matrices 2x2 et 3x3 étape par étape. Calcule le polynôme caractéristique |A - λI| = 0, valeurs propres, vecteurs propres, matrice de passage P et matrice diagonale D.",
      h1: "Diagonalisation de Matrices (2×2 et 3×3)",
      subtitle: "Calcul détaillé de l'équation caractéristique |A - λI| = 0, spectre des valeurs propres, sous-espaces propres, matrice de passage P et matrice diagonale D.",
      placeholderDirect: "Lignes séparées par ';' -> Ex : 4, 1; 2, 3 ou 2, 0, 0; 1, 2, 1; -1, 0, 1",
      examLabels: ["Matrice 2×2 (Valeurs propres simples)", "Matrice 2×2 Symétrique Réelle", "Matrice 3×3 Diagonalisable", "Matrice 2×2 Non Diagonalisable (Jordan)"],
      guideTitle: "Guide Rapide et Formules Clés : Diagonalisation Endomorphique A = P·D·P⁻¹",
      guideIntro: "Une matrice carrée A ∈ ℝ^{n×n} est diagonalisable si et seulement s'il existe une base de ℝ^n formée de vecteurs propres de A. Dans cette base, l'endomorphisme agit par simple multiplication par chaque valeur propre λ_i, permettant le calcul immédiat des puissances A^k = P·D^k·P⁻¹.",
      formulas: [
        {
          name: "Équation et Polynôme Caractéristique",
          note: "Pour les matrices 2×2 on a toujours p(λ) = λ² - tr(A)λ + det(A) = 0."
        },
        {
          name: "Sous-espace Propre E(λ_i) Associé à une Valeur Propre",
          note: "La dimension de ce sous-espace est la multiplicité géométrique : m_g(λ_i) = n - rang(A - λ_i I)."
        },
        {
          name: "Théorème Fondamental de Diagonalisabilité",
          note: "Toute matrice symétrique réelle (A = A^T) est toujours diagonalisable en base orthonormée."
        },
        {
          name: "Relation de Semblabilité et Puissance n-ième",
          note: "L'ordre des vecteurs propres en colonnes dans P doit correspondre à celui des valeurs propres dans D."
        }
      ],
      tips: [
        "Vérifiez toujours que la somme des valeurs propres est égale à la trace tr(A) et que leur produit est égal au déterminant det(A).",
        "Si toutes les valeurs propres sont réelles et distinctes (multiplicité algébrique m_a = 1), la matrice est automatiquement diagonalisable.",
        "Lorsqu'une valeur propre a une multiplicité algébrique m_a = 2, vérifiez si rang(A - λI) = n - 2 ; sinon la matrice n'est pas diagonalisable."
      ],
      faqs: [
        {
          q: "Comment savoir si une matrice carrée A est diagonalisable ?",
          a: "Une matrice A de taille n×n est diagonalisable sur ℝ si et seulement si son polynôme caractéristique est scindé sur ℝ et pour chaque valeur propre λ_i, la dimension du sous-espace propre m_g(λ_i) = n - rang(A - λ_i·I) est égale à sa multiplicité algébrique m_a(λ_i)."
        },
        {
          q: "Comment construire la matrice de passage P et la matrice diagonale D ?",
          a: "On place les valeurs propres λ_1, ..., λ_n sur la diagonale de D et on dispose les vecteurs propres linéairement indépendants correspondants en colonnes dans P dans le même ordre."
        },
        {
          q: "Pourquoi toute matrice symétrique réelle est-elle diagonalisable ?",
          a: "D'après le Théorème Spectral : toute matrice symétrique réelle (A = A^T) possède uniquement des valeurs propres réelles et ses sous-espaces propres sont orthogonaux deux à deux."
        },
        {
          q: "À quoi sert la diagonalisation A = P·D·P⁻¹ en ingénierie ?",
          a: "Elle permet de calculer les puissances A^k = P·D^k·P⁻¹ et l'exponentielle de matrice e^{At} = P·e^{Dt}·P⁻¹ pour résoudre les systèmes différentiels linéaires."
        }
      ]
    },
    gauss: {
      title: "Calculatrice Pivot de Gauss-Jordan et Rouché-Fontené Étape par Étape",
      shortTitle: "Systèmes Linéaires (Gauss-Jordan)",
      metaDescription: "Solveur étape par étape de systèmes d'équations linéaires Ax = b (2x2, 3x3 et 4x4) par élimination de Gauss-Jordan et Théorème de Rouché-Fontené avec opérations élémentaires sur les lignes.",
      h1: "Systèmes d'Équations Linéaires (Pivot de Gauss-Jordan)",
      subtitle: "Élimination de Gauss étape par étape affichant chaque opération élémentaire sur les lignes (Fᵢ ← Fᵢ + αFⱼ) de la matrice augmentée (A|b), calcul du rang et théorème de Rouché-Fontené.",
      placeholderDirect: "Lignes de la matrice augmentée (A|b) séparées par ';' -> Ex : 1, 1, 1, 6; 2, -1, 1, 3; 1, 2, -1, 2",
      examLabels: ["Système 3×3 Solution Unique", "Système 3×3 Indéterminé (Infinité)", "Système 3×3 Incompatible", "Système 4×4 Solution Unique"],
      guideTitle: "Guide Rapide et Formules Clés : Pivot de Gauss-Jordan et Théorème de Rouché-Fontené",
      guideIntro: "La méthode du pivot de Gauss-Jordan transforme la matrice augmentée (A|b) d'un système linéaire Ax = b en sa forme échelonnée réduite (RREF) par des opérations élémentaires sur les lignes. Le théorème de Rouché-Fontené caractérise l'existence et l'unicité des solutions via les rangs rg(A) et rg(A|b).",
      formulas: [
        {
          name: "Théorème de Rouché-Fontené (Classification Complète)",
          note: "Ici n désigne le nombre d'inconnues et r = rg(A) le nombre de pivots non nuls."
        },
        {
          name: "Opérations Élémentaires sur les Lignes",
          note: "Pour annuler le coefficient en ligne i et colonne pivot j, on retranche a_ij / a_jj fois la ligne pivot F_j à F_i."
        },
        {
          name: "Forme Échelonnée Réduite (RREF)",
          note: "En RREF, chaque pivot vaut 1 et est le seul élément non nul de sa colonne."
        },
        {
          name: "Degrés de Liberté dans les Systèmes Indéterminés",
          note: "Les inconnues sans pivot deviennent des paramètres libres (λ, μ, ...)."
        }
      ],
      tips: [
        "Saisissez chaque ligne de la matrice augmentée (A|b) en séparant les coefficients par des virgules et les lignes par un point-virgule ';'.",
        "Si une ligne du type (0  0  0 | c) avec c ≠ 0 apparaît, arrêtez immédiatement : rg(A) < rg(A|b) et le système est incompatible.",
        "Choisissez toujours comme ligne pivot une ligne commençant par 1 afin de retarder l'apparition de fractions."
      ],
      faqs: [
        {
          q: "Comment analyser un système linéaire avec le théorème de Rouché-Fontené ?",
          a: "On compare rg(A), rg(A|b) et le nombre d'inconnues n. Si rg(A) < rg(A|b), le système est Incompatible (aucune solution). Si rg(A) = rg(A|b) = n, il admet une Solution Unique. Si rg(A) = rg(A|b) < n, il admet une infinité de solutions dépendant de n - rg(A) paramètres libres."
        },
        {
          q: "Quelle est la différence entre le pivot de Gauss et Gauss-Jordan ?",
          a: "Le pivot de Gauss triangule la matrice pour résoudre par remontée, tandis que Gauss-Jordan normalise chaque pivot à 1 et annule les coefficients au-dessus et en dessous des pivots (forme échelonnée réduite RREF)."
        },
        {
          q: "Quelles sont les opérations élémentaires sur les lignes autorisées ?",
          a: "1) Échanger deux lignes (Fi ↔ Fj), 2) Multiplier une ligne par un scalaire non nul (Fi ← k·Fi), et 3) Ajouter à une ligne un multiple d'une autre ligne (Fi ← Fi + α·Fj)."
        },
        {
          q: "Comment identifier les inconnues secondaires (paramètres libres) dans un système indéterminé ?",
          a: "Dans la forme échelonnée réduite RREF, les colonnes comportant un pivot 1 correspondent aux inconnues principales et les colonnes sans pivot aux paramètres libres (λ, μ)."
        }
      ]
    },
    phasors: {
      title: "Calculatrice de Phaseurs, Nombres Complexes et Circuits AC Étape par Étape",
      shortTitle: "Phaseurs et Circuits AC",
      metaDescription: "Calculatrice de phaseurs et nombres complexes pour les circuits en régime sinusoïdal AC. Opère en forme algébrique (a+bj) et polaire (M∠θ°), convertit avec quadrant et résout les systèmes complexes 2x2 et 3x3.",
      h1: "Calculatrice de Phaseurs, Complexes et Circuits AC",
      subtitle: "Opérations mixtes sous forme algébrique (a + bj) et polaire (M∠θ°), conversion détaillée module/argument avec ajustement du quadrant et systèmes de mailles/nœuds AC 2×2 et 3×3.",
      directLabel: "Arithmétique et Conversion de Phaseurs (a+bj ↔ M∠θ°)",
      inverseLabel: "Système Complexe 2×2 / 3×3 (Mailles / Nœuds AC)",
      placeholderDirect: "Mélange algébrique & polaire -> Ex : (3 + 4j) * (10<30) / (2 - 2j)  ou  -3 + 4j",
      placeholderInverse: "Matrice augmentée complexe (Z|V) séparée par ';' -> Ex : 4+2j, -2j, 10<0 ; -2j, 2+4j, 0",
      examLabels: ["Opération mixte Algébrique × Polaire", "Impédance équivalente parallèle", "Conversion 2e Quadrant (-3 + 4j)", "Système 2×2 de Mailles en Régime AC"],
      guideTitle: "Guide Rapide et Formules Clés : Algèbre des Phaseurs et Régime Sinusoïdal Permanent",
      guideIntro: "En électrotechnique et théorie des circuits, la représentation complexe (phaseurs de Steinmetz) transforme les équations intégro-différentielles en régime sinusoïdal permanent en systèmes linéaires complexes où les bobines ont une impédance Z_L = jωL et les condensateurs Z_C = -j/(ωC).",
      formulas: [
        {
          name: "Conversion Algébrique vers Polaire avec Ajustement du Quadrant",
          note: "Pensez à ajouter ou retrancher 180° lorsque la partie réelle 'a' est négative (2e et 3e quadrants)."
        },
        {
          name: "Conversion Polaire vers Algébrique (Formule d'Euler)",
          note: "La forme algébrique est indispensable pour additionner/soustraire ; la forme polaire pour multiplier/diviser."
        },
        {
          name: "Produit et Quotient Direct en Forme Polaire",
          note: "En multipliant deux phaseurs, on multiplie leurs modules et on additionne leurs phases en degrés."
        },
        {
          name: "Résolution des Mailles/Nœuds AC par Règle de Cramer Complexe",
          note: "Fournit directement chaque courant ou tension nodale en formes algébrique et polaire."
        }
      ],
      tips: [
        "Pour saisir un phaseur sous forme polaire avec un angle en degrés, utilisez '<' ou '∠' : par exemple 10<30 ou 10∠-45.",
        "Avant d'additionner deux phaseurs écrits sous forme polaire, convertissez-les toujours sous forme algébrique a + bj.",
        "Dans un système de mailles AC sans sources liées, la matrice des impédances Z est symétrique par rapport à la diagonale principale."
      ],
      faqs: [
        {
          q: "Comment convertir un nombre complexe de la forme algébrique (a + bj) à la forme polaire (M∠θ°) ?",
          a: "Le module vaut M = √(a² + b²) et l'argument se calcule par arctan(b/a) en tenant compte du quadrant : si la partie réelle 'a' est négative (2e ou 3e quadrant), il faut ajouter 180° (si b ≥ 0) ou retrancher 180° (si b < 0)."
        },
        {
          q: "Comment convertir un phaseur de la forme polaire (M∠θ°) à la forme algébrique ?",
          a: "En appliquant la formule d'Euler M·e^{jθ} = M·cos(θ) + j·M·sin(θ) avec θ en degrés : a = M·cos(θ) et b = M·sin(θ)."
        },
        {
          q: "Quelle forme privilégier pour additionner, soustraire, multiplier ou diviser des phaseurs ?",
          a: "La forme algébrique (a + bj) est indispensable pour l'addition et la soustraction ; la forme polaire (M∠θ°) est directe pour la multiplication et la division."
        },
        {
          q: "Comment résoudre un système de mailles ou de nœuds en courant alternatif (AC) ?",
          a: "On pose le système matriciel complexe Z·I = V puis on applique les formules de Cramer complexes pour obtenir chaque courant sous forme polaire I_m∠φ°."
        }
      ]
    }
  }
};

export const LEGAL_I18N = {
  en: {
    about: {
      title: "About Us & Client-Side Symbolic Architecture | CalcWeb",
      shortTitle: "About Us",
      metaDescription: "Learn about the CalcWeb educational engineering project: step-by-step math and engineering calculators powered by WebAssembly (Pyodide + SymPy) running 100% in your browser.",
      h1: "About CalcWeb: Open & 100% Client-Side Symbolic Engineering",
      subtitle: "An academic platform designed for Engineering, Physics, and Mathematics students and educators with step-by-step derivations, pedagogical rigor, and complete privacy.",
      sections: [
        {
          heading: "1. Our Educational Mission (E-E-A-T)",
          body: "CalcWeb was created to democratize access to university-grade Computer Algebra System (CAS) tools. Unlike traditional calculators that only output a final number or require paid server subscriptions, CalcWeb breaks down every problem step by step, explaining the theorem, trigonometric identity, integrating factor, or elementary row operation applied."
        },
        {
          heading: "2. How Our Browser-Based Symbolic Engine Works ($0 Server Architecture)",
          body: "All mathematical intelligence in CalcWeb runs directly on your device's CPU via WebAssembly (Pyodide + SymPy inside a dedicated Web Worker) paired with an instant JavaScript hybrid algebraic solver. This architecture delivers zero latency on standard operations, absolute privacy (none of your equations or matrices are sent to external servers), and offline resilience once loaded."
        },
        {
          heading: "3. Covered Engineering Disciplines",
          body: "Our 12 modules cover core undergraduate courses in Electrical, Mechanical, Aerospace, Computer Engineering, and Mathematics: Signals & Systems (Fourier Transform, Laplace Transform, Z-Transform, Convolution, Fourier Series), Calculus & Differential Equations (Step-by-Step Integrals, 1st & 2nd Order ODEs, Taylor Series, Numerical Series), and Linear Algebra & AC Circuits (Matrix Diagonalization, Gauss-Jordan Elimination, and AC Phasors)."
        },
        {
          heading: "4. Academic Contact & Feedback",
          body: "We continuously review our symbolic algorithms and formula guides for maximum academic accuracy. If you are a university professor or student and wish to suggest a new module or report an issue, contact us at contacto@calcweb.edu."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy, GDPR & Cookie Policy | CalcWeb",
      shortTitle: "Privacy & Cookies",
      metaDescription: "CalcWeb Privacy and Cookie Policy compliant with EU GDPR. 100% local client-side mathematical processing in your browser and third-party Google AdSense information.",
      h1: "Privacy & Cookie Policy (GDPR)",
      subtitle: "Transparency regarding data protection, local browser storage, and third-party advertising/analytics cookies.",
      sections: [
        {
          heading: "1. 100% Local Mathematical Processing (Client-Side)",
          body: "In CalcWeb, all mathematical expressions, differential equations, integrals, matrices, and phasors you enter are processed exclusively within your web browser's local memory using WebAssembly (Pyodide/SymPy) and JavaScript. CalcWeb never transmits, stores, or logs your mathematical inputs on remote servers."
        },
        {
          heading: "2. Technical Local Storage (LocalStorage & Cache API)",
          body: "We use your browser's local storage (localStorage and IndexedDB/Cache API) strictly for technical purposes: remembering your Light/Dark theme preference and caching the Pyodide/SymPy WebAssembly binaries so they load instantly on future visits."
        },
        {
          heading: "3. Third-Party Advertising Cookies (Google AdSense)",
          body: "To keep the platform free, CalcWeb may display advertisements served by Google AdSense. Google and its advertising partners use cookies (such as the DART cookie) to serve ads based on a user's prior visits to this or other websites. Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com)."
        },
        {
          heading: "4. User Rights under EU GDPR",
          body: "Under the General Data Protection Regulation (GDPR - EU Regulation 2016/679), users may exercise their rights of access, rectification, erasure, and objection regarding any email correspondence by writing to privacidad@calcweb.edu, and may clear local storage or cookies at any time from their browser settings."
        }
      ]
    },
    legal: {
      title: "Legal Notice & Terms of Educational Use | CalcWeb",
      shortTitle: "Legal Notice",
      metaDescription: "Legal Notice, intellectual property, academic disclaimer, and general terms of use for CalcWeb engineering calculators.",
      h1: "Legal Notice & Terms of Use",
      subtitle: "General legal information, academic terms of use, and limitation of liability.",
      sections: [
        {
          heading: "1. Purpose and Educational Scope",
          body: "CalcWeb is an educational portal designed to assist students and engineers in learning and verifying step-by-step solutions in advanced mathematics, signal processing, calculus, linear algebra, and electrical engineering."
        },
        {
          heading: "2. Engineering Disclaimer",
          body: "While CalcWeb relies on battle-tested computer algebra libraries (SymPy) and verified algorithms, all results and step-by-step derivations are provided 'AS IS' for educational purposes. Users are solely responsible for independently verifying any calculation before applying it to critical engineering designs or graded submissions."
        },
        {
          heading: "3. Intellectual Property & Open-Source Licenses",
          body: "The user interface, pedagogical explanations, theory guides, and original source code of CalcWeb are protected by copyright law. The client-side runtime integrates open-source libraries under their respective permissive licenses (Pyodide under MPL-2.0, SymPy under BSD, and KaTeX under MIT)."
        },
        {
          heading: "4. Governing Law",
          body: "These terms of use are governed by applicable European Union and Spanish regulations. For any legal inquiries, please contact legal@calcweb.edu."
        }
      ]
    }
  },
  fr: {
    about: {
      title: "À Propos et Architecture Symbolique Client-Side | CalcWeb",
      shortTitle: "À Propos",
      metaDescription: "Découvrez le projet éducatif CalcWeb : calculatrices mathématiques et d'ingénierie étape par étape propulsées par WebAssembly (Pyodide + SymPy) 100% dans votre navigateur.",
      h1: "À Propos de CalcWeb : Ingénierie Symbolique Ouverte et 100% Locale",
      subtitle: "Une plateforme académique conçue pour les étudiants et enseignants en Ingénierie, Physique et Mathématiques avec résolution étape par étape et confidentialité totale.",
      sections: [
        {
          heading: "1. Notre Mission Éducative (E-E-A-T)",
          body: "CalcWeb a pour mission de démocratiser l'accès aux outils de Calcul Formel (CAS) de niveau universitaire. Contrairement aux calculatrices classiques qui n'affichent qu'un résultat brut ou exigent un abonnement serveur coûteux, CalcWeb détaille chaque exercice étape par étape en justifiant le théorème, l'identité trigonométrique, le facteur intégrant ou l'opération élémentaire appliquée."
        },
        {
          heading: "2. Fonctionnement de Notre Moteur Symbolique Local (Architecture 0€ Serveur)",
          body: "Toute l'intelligence mathématique de CalcWeb s'exécute directement sur le processeur de votre appareil grâce à WebAssembly (Pyodide + SymPy dans un Web Worker dédié) combiné à un moteur algébrique hybride instantané en JavaScript. Cela garantit une latence nulle, une confidentialité absolue (aucune équation ou matrice n'est envoyée sur un serveur) et une disponibilité hors-ligne après chargement."
        },
        {
          heading: "3. Domaines d'Ingénierie Couverts",
          body: "Nos 12 modules couvrent les matières fondamentales des écoles d'ingénieurs et licences scientifiques : Signaux et Systèmes (Transformées de Fourier, Laplace, en Z, Convolution, Séries de Fourier), Calcul Infinitésimal et Équations Différentielles (Intégrales étape par étape, EDO du 1er et 2nd ordre, Séries de Taylor, Séries Numériques) et Algèbre Linéaire & Circuits AC (Diagonalisation, Pivot de Gauss-Jordan et Phaseurs)."
        },
        {
          heading: "4. Contact Académique",
          body: "Nous révisons continuellement nos algorithmes symboliques et nos formulaires théoriques. Si vous êtes enseignant ou étudiant et souhaitez proposer une amélioration, écrivez-nous à contacto@calcweb.edu."
        }
      ]
    },
    privacy: {
      title: "Politique de Confidentialité, RGPD et Cookies | CalcWeb",
      shortTitle: "Confidentialité et Cookies",
      metaDescription: "Politique de Confidentialité et de Cookies de CalcWeb conforme au RGPD européen. Calculs mathématiques 100% locaux dans le navigateur et informations Google AdSense.",
      h1: "Politique de Confidentialité et Cookies (RGPD)",
      subtitle: "Transparence sur la protection des données, le stockage local du navigateur et l'utilisation de cookies publicitaires tiers.",
      sections: [
        {
          heading: "1. Traitement Mathématique 100% Local (Client-Side)",
          body: "Sur CalcWeb, toutes les expressions mathématiques, équations différentielles, intégrales, matrices et phaseurs que vous saisissez sont traités exclusivement dans la mémoire locale de votre navigateur via WebAssembly (Pyodide/SymPy) et JavaScript. CalcWeb ne transmet ni n'enregistre vos calculs sur des serveurs distants."
        },
        {
          heading: "2. Stockage Local Technique (LocalStorage et Cache API)",
          body: "Nous utilisons le stockage local de votre navigateur uniquement à des fins techniques : mémoriser votre préférence de thème (Clair / Sombre) et mettre en cache les paquets binaires Pyodide/SymPy afin d'éviter leur re-téléchargement lors de vos prochaines visites."
        },
        {
          heading: "3. Cookies Publicitaires Tiers (Google AdSense)",
          body: "Pour financer la gratuité de la plateforme, CalcWeb peut afficher des annonces gérées par Google AdSense. Google et ses partenaires utilisent des cookies (tels que le cookie DART) pour diffuser des annonces adaptées aux visites antérieures de l'utilisateur. Vous pouvez désactiver la publicité personnalisée dans les Paramètres des annonces Google (https://adssettings.google.com)."
        },
        {
          heading: "4. Droits des Utilisateurs sous le RGPD",
          body: "Conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679), vous pouvez exercer vos droits d'accès, de rectification et de suppression en écrivant à privacidad@calcweb.edu, et supprimer à tout moment les cookies depuis les paramètres de votre navigateur."
        }
      ]
    },
    legal: {
      title: "Mentions Légales et Conditions d'Utilisation Éducative | CalcWeb",
      shortTitle: "Mentions Légales",
      metaDescription: "Mentions Légales, propriété intellectuelle, clause de non-responsabilité académique et conditions générales d'utilisation des calculatrices d'ingénierie CalcWeb.",
      h1: "Mentions Légales et Conditions d'Utilisation",
      subtitle: "Informations légales générales, conditions d'usage académique et limitation de responsabilité.",
      sections: [
        {
          heading: "1. Objet et Vocation Éducative",
          body: "CalcWeb est un portail éducatif destiné à accompagner les étudiants et ingénieurs dans l'apprentissage et la vérification étape par étape de problèmes de mathématiques supérieures, traitement du signal, analyse, algèbre linéaire et électrotechnique."
        },
        {
          heading: "2. Limitation de Responsabilité en Ingénierie",
          body: "Bien que CalcWeb s'appuie sur des bibliothèques de calcul formel éprouvées (SymPy) et des algorithmes vérifiés, les résultats et développements étape par étape sont fournis 'en l'état' à titre strictement pédagogique. L'utilisateur demeure seul responsable de la vérification de tout calcul avant son utilisation dans un projet industriel ou académique."
        },
        {
          heading: "3. Propriété Intellectuelle et Licences Open-Source",
          body: "L'interface, les textes pédagogiques, les guides théoriques et le code source original de CalcWeb sont protégés par le droit d'auteur. L'application intègre côté client des bibliothèques open-source sous leurs licences respectives (Pyodide sous MPL-2.0, SymPy sous BSD et KaTeX sous MIT)."
        },
        {
          heading: "4. Droit Applicable",
          body: "Les présentes conditions sont régies par le droit européen et espagnol en vigueur. Pour toute question juridique, vous pouvez contacter legal@calcweb.edu."
        }
      ]
    }
  }
};

export function getLocalizedCalculator(calc, lang = "es") {
  const localizedRoute = ROUTE_MAP[calc.id]?.[lang] || calc.route;
  const localizedCategory = UI_STRINGS[lang]?.categories?.[calc.category] || calc.category;
  const localizedRelated = (calc.relatedRoutes || []).map((esR) => {
    const targetCalc = CALCULATOR_CATALOG.find((c) => c.route === esR);
    return targetCalc ? (ROUTE_MAP[targetCalc.id]?.[lang] || esR) : esR;
  });

  if (lang === "es" || !CATALOG_I18N[lang]?.[calc.id]) {
    return {
      ...calc,
      categoryKey: calc.category,
      category: localizedCategory,
      route: localizedRoute,
      relatedRoutes: localizedRelated
    };
  }

  const tr = CATALOG_I18N[lang][calc.id];
  const badgePrefix = lang === "en" ? "Exam Preset" : "Exemple d'Examen";

  return {
    ...calc,
    categoryKey: calc.category,
    category: localizedCategory,
    route: localizedRoute,
    title: tr.title,
    shortTitle: tr.shortTitle,
    metaDescription: tr.metaDescription,
    h1: tr.h1,
    subtitle: tr.subtitle,
    directLabel: tr.directLabel || calc.directLabel,
    inverseLabel: tr.inverseLabel || calc.inverseLabel,
    placeholderDirect: tr.placeholderDirect || calc.placeholderDirect,
    placeholderInverse: tr.placeholderInverse || calc.placeholderInverse,
    examExamples: calc.examExamples.map((ex, i) => ({
      ...ex,
      badge: `${badgePrefix} ${i + 1}`,
      label: tr.examLabels?.[i] || ex.label
    })),
    guide: {
      ...calc.guide,
      title: tr.guideTitle || calc.guide.title,
      intro: tr.guideIntro || calc.guide.intro,
      formulas: calc.guide.formulas.map((f, i) => ({
        ...f,
        name: tr.formulas?.[i]?.name || f.name,
        note: tr.formulas?.[i]?.note || f.note
      })),
      tips: tr.tips || calc.guide.tips
    },
    faqs: tr.faqs || calc.faqs,
    relatedRoutes: localizedRelated
  };
}

export function getLocalizedCatalog(lang = "es") {
  return CALCULATOR_CATALOG.map((c) => getLocalizedCalculator(c, lang));
}

export function getLocalizedLegalPages(lang = "es") {
  return LEGAL_PAGES.map((l) => {
    const localizedRoute = ROUTE_MAP[l.id]?.[lang] || l.route;
    if (lang === "es" || !LEGAL_I18N[lang]?.[l.id]) {
      return { ...l, route: localizedRoute };
    }
    const tr = LEGAL_I18N[lang][l.id];
    return {
      ...l,
      route: localizedRoute,
      title: tr.title,
      shortTitle: tr.shortTitle,
      metaDescription: tr.metaDescription,
      h1: tr.h1,
      subtitle: tr.subtitle,
      sections: tr.sections
    };
  });
}

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
        heading: "3. Propiedad Intelectual y Licencias de Software Abierto",
        body: "El diseño de la interfaz, los textos pedagógicos, las guías teóricas, los desgloses paso a paso y el código fuente original de CalcWeb están protegidos por la normativa de propiedad intelectual. La aplicación integra en el cliente librerías de código abierto bajo sus respectivas licencias libres (Pyodide bajo MPL-2.0, SymPy bajo licencia BSD y KaTeX bajo licencia MIT)."
      },
      {
        heading: "4. Legislación Aplicable",
        body: "Las presentes condiciones de uso se rigen por la legislación española y europea vigente. Para cualquier controversia o consulta relativa al sitio web, puedes contactar con la administración técnica en legal@calcweb.edu."
      }
    ]
  }
];
