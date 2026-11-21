/**
 * Static Route & SEO Generator (SSG) for CalcWeb
 *
 * Centralizes SITE_URL and generates:
 * 1. /index.html (Home Dashboard with pre-rendered SEO links & WebApplication JSON-LD)
 * 2. All 10 Calculator static routes (/transformada-fourier/index.html, etc.) with:
 *    - Pre-rendered H1, 4 Exam Examples, Quick Theory Guide, 4 FAQs & Related Calculators (instant LCP, CLS = 0)
 *    - Synchronized JSON-LD @graph: WebApplication + BreadcrumbList + FAQPage
 *    - Open Graph (og:*) & Twitter Cards (twitter:*) + favicon.svg + site.webmanifest
 * 3. All 3 Legal & E-E-A-T static routes (/sobre-nosotros, /privacidad, /aviso-legal) for Google AdSense
 * 4. /404.html SPA fallback
 * 5. /sitemap.xml with current <lastmod> date and priorities (1.0 home, 0.9 tools, 0.3 legal)
 * 6. /robots.txt pointing to `${SITE_URL}/sitemap.xml`
 */

import fs from "node:fs";
import path from "node:path";
import { CALCULATOR_CATALOG, LEGAL_PAGES } from "./js/catalog.js";

export const SITE_URL = (process.env.SITE_URL || "https://matespasoapaso.vercel.app").replace(/\/+$/, "");
const TODAY_ISO = new Date().toISOString().split("T")[0];
const ROOT_DIR = process.cwd();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNavLinksHtml(activeRoute) {
  const navItems = [
    { route: "/", label: "Inicio" },
    { route: "/transformada-fourier", label: "Fourier" },
    { route: "/series-de-fourier", label: "S. Fourier" },
    { route: "/transformada-laplace", label: "Laplace" },
    { route: "/transformada-z", label: "Transf. Z" },
    { route: "/convolucion", label: "Convolución" },
    { route: "/ecuaciones-diferenciales", label: "EDOs" },
    { route: "/integrales-paso-a-paso", label: "Integrales" },
    { route: "/series-taylor", label: "Taylor" },
    { route: "/series-numericas", label: "Series Num." },
    { route: "/diagonalizacion-matrices", label: "Matrices" },
    { route: "/sistemas-ecuaciones-gauss", label: "Gauss-Jordan" },
    { route: "/calculadora-fasores-complejos", label: "Fasores AC" }
  ];

  const desktop = navItems
    .map(
      (item) =>
        `<a href="${item.route}" data-route="${item.route}" class="nav-link ${
          activeRoute === item.route ? "active " : ""
        }whitespace-nowrap px-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors">${item.label}</a>`
    )
    .join("\n        ");

  const mobile = navItems
    .map(
      (item) =>
        `<a href="${item.route}" data-route="${item.route}" class="nav-link ${
          activeRoute === item.route ? "active " : ""
        }whitespace-nowrap px-2.5 py-1.5 rounded-md text-xs font-medium">${item.label}</a>`
    )
    .join("\n      ");

  return { desktop, mobile };
}

function buildJsonLdForPage({ title, description, canonicalUrl, calc = null }) {
  const graph = [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      name: title,
      url: canonicalUrl,
      description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "All (100% Client-Side WebAssembly)",
      inLanguage: "es-ES",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR"
      }
    }
  ];

  if (calc) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: `${SITE_URL}/`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: calc.category,
          item: `${SITE_URL}/`
        },
        {
          "@type": "ListItem",
          position: 3,
          name: calc.shortTitle,
          item: canonicalUrl
        }
      ]
    });

    if (Array.isArray(calc.faqs) && calc.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: calc.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a
          }
        }))
      });
    }
  }

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": graph
    },
    null,
    2
  );
}

function buildStaticCalculatorMainHtml(calc) {
  const faqsHtml =
    Array.isArray(calc.faqs) && calc.faqs.length > 0
      ? `
    <section aria-labelledby="faq-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mt-8">
      <h2 id="faq-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5">
        Preguntas Frecuentes sobre ${escapeHtml(calc.shortTitle)}
      </h2>
      <div class="space-y-3.5">
        ${calc.faqs
          .map(
            (faq) => `
          <details class="group rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 p-4">
            <summary class="font-semibold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer">
              ${escapeHtml(faq.q)}
            </summary>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              ${escapeHtml(faq.a)}
            </p>
          </details>`
          )
          .join("")}
      </div>
    </section>`
      : "";

  const relatedHtml =
    Array.isArray(calc.relatedRoutes) && calc.relatedRoutes.length > 0
      ? `
    <section aria-labelledby="related-heading" class="mt-8">
      <h2 id="related-heading" class="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
        Calculadoras Relacionadas de ${escapeHtml(calc.category)}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${calc.relatedRoutes
          .map((rRoute) => {
            const rel = CALCULATOR_CATALOG.find((c) => c.route === rRoute);
            if (!rel) return "";
            return `
          <a href="${rel.route}" data-route="${rel.route}" class="academic-card block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h3 class="font-serif font-bold text-base text-slate-900 dark:text-white mb-1">${escapeHtml(rel.shortTitle)}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">${escapeHtml(rel.subtitle)}</p>
          </a>`;
          })
          .join("")}
      </div>
    </section>`
      : "";

  return `
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="/" data-route="/">Inicio</a>
      <span>/</span>
      <span>${escapeHtml(calc.category)}</span>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(calc.shortTitle)}</span>
    </nav>
    <header class="mb-7">
      <h1 class="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        ${escapeHtml(calc.h1)}
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
        ${escapeHtml(calc.subtitle)}
      </p>
    </header>
    <section id="solution-container" class="mb-12"></section>
    <section aria-labelledby="guide-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <h2 id="guide-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
        ${escapeHtml(calc.guide.title)}
      </h2>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        ${escapeHtml(calc.guide.intro)}
      </p>
      <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
        ${calc.guide.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
      </ul>
    </section>
    ${faqsHtml}
    ${relatedHtml}
  `;
}

function buildStaticLegalMainHtml(legal) {
  return `
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="/" data-route="/">Inicio</a>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(legal.shortTitle)}</span>
    </nav>
    <article class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm max-w-4xl">
      <header class="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <h1 class="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          ${escapeHtml(legal.h1)}
        </h1>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          ${escapeHtml(legal.subtitle)}
        </p>
      </header>
      <div class="space-y-6">
        ${legal.sections
          .map(
            (sec) => `
          <section>
            <h2 class="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">${escapeHtml(sec.heading)}</h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(sec.body)}</p>
          </section>`
          )
          .join("")}
      </div>
    </article>
  `;
}

function buildStaticHomeMainHtml() {
  return `
    <section class="rounded-3xl bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 mb-10 shadow-sm">
      <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
        Calculadoras Matemáticas y de Ingeniería Paso a Paso
      </h1>
      <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        Resolución simbólica rigurosa con justificación teórica en cada transformación. Todo el cálculo se ejecuta 100% en tu navegador mediante WebAssembly (Pyodide + SymPy).
      </p>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      ${CALCULATOR_CATALOG.map(
        (c) => `
        <article class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h2 class="font-serif text-xl font-bold mb-2">
            <a href="${c.route}" data-route="${c.route}">${escapeHtml(c.shortTitle)}</a>
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">${escapeHtml(c.subtitle)}</p>
        </article>`
      ).join("")}
    </section>
  `;
}

function buildFullHtmlDocument({
  title,
  description,
  keywords,
  route,
  calc = null,
  mainInnerHtml = ""
}) {
  const canonicalUrl = `${SITE_URL}${route === "/" ? "/" : route}`;
  const fullTitle = title.includes("CalcWeb") ? title : `${title} | CalcWeb`;
  const nav = buildNavLinksHtml(route);
  const jsonLd = buildJsonLdForPage({
    title: fullTitle,
    description,
    canonicalUrl,
    calc
  });

  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="2jAlBSAJVHJ24YMj4Xmazba7KTn0T3KmbLh-hcY8hYA" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Favicon & Mobile PWA Manifest -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#1d4ed8">

  <!-- Open Graph & Twitter Cards -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="CalcWeb">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${SITE_URL}/favicon.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

  <!-- Resource Hints for Core Web Vitals (LCP & INP) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="modulepreload" href="/js/app.js">
  <link rel="modulepreload" href="/js/catalog.js">
  <link rel="modulepreload" href="/js/hybrid-engine.js">

  <!-- Structured Data JSON-LD (WebApplication + BreadcrumbList + FAQPage) -->
  <script id="json-ld-seo" type="application/ld+json">
${jsonLd}
  </script>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap" rel="stylesheet">

  <!-- KaTeX Math Typesetting -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Newsreader', 'Georgia', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200 selection:bg-blue-600 selection:text-white">

  <header class="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href="/" data-route="/" class="flex items-center gap-2.5 group focus:outline-none">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">&Sigma;</div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white">CalcWeb</span>
              <span class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">CAS v2.4</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Motor Simbólico Universitario &bull; 100% Client-Side</p>
          </div>
        </a>
      </div>

      <nav aria-label="Navegación principal" class="hidden xl:flex items-center gap-0.5">
        ${nav.desktop}
      </nav>

      <div class="flex items-center gap-2.5">
        <button id="engine-status-btn" type="button" title="Estado del Web Worker Pyodide + SymPy (WebAssembly)" class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800/80 dark:text-amber-300">
          <span id="engine-status-dot" class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span id="engine-status-text" class="font-mono text-[11px]">Cargando motor simbólico...</span>
        </button>

        <button id="theme-toggle" type="button" aria-label="Cambiar tema claro/oscuro" class="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg id="theme-icon-sun" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg id="theme-icon-moon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
      </div>
    </div>

    <div class="xl:hidden border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-50/70 dark:bg-slate-900/70">
      ${nav.mobile}
    </div>
  </header>

  <main id="app-main" class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    ${mainInnerHtml}
  </main>

  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">CalcWeb &Sigma;</span>
          <span>&bull;</span>
          <span>Arquitectura 0€ Servidor (Pyodide WebAssembly + SymPy + Motor Híbrido Instantáneo)</span>
        </div>
        <div class="flex flex-wrap items-center gap-4 font-medium">
          <a href="/sobre-nosotros" data-route="/sobre-nosotros" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Sobre Nosotros</a>
          <a href="/privacidad" data-route="/privacidad" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Privacidad y Cookies (RGPD)</a>
          <a href="/aviso-legal" data-route="/aviso-legal" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Aviso Legal</a>
        </div>
      </div>

      <div class="border-t border-slate-200/70 dark:border-slate-800/70 pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
        <a href="/transformada-fourier" data-route="/transformada-fourier" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Fourier</a>
        <a href="/series-de-fourier" data-route="/series-de-fourier" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Series de Fourier</a>
        <a href="/transformada-laplace" data-route="/transformada-laplace" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Laplace</a>
        <a href="/transformada-z" data-route="/transformada-z" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Transformada Z</a>
        <a href="/convolucion" data-route="/convolucion" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Convolución</a>
        <a href="/ecuaciones-diferenciales" data-route="/ecuaciones-diferenciales" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">EDOs</a>
        <a href="/integrales-paso-a-paso" data-route="/integrales-paso-a-paso" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Integrales</a>
        <a href="/series-taylor" data-route="/series-taylor" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Taylor</a>
        <a href="/series-numericas" data-route="/series-numericas" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Series Numéricas</a>
        <a href="/diagonalizacion-matrices" data-route="/diagonalizacion-matrices" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Diagonalización</a>
        <a href="/sistemas-ecuaciones-gauss" data-route="/sistemas-ecuaciones-gauss" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Gauss-Jordan</a>
        <a href="/calculadora-fasores-complejos" data-route="/calculadora-fasores-complejos" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">Fasores AC</a>
      </div>
    </div>
  </footer>

  <script type="module" src="/js/app.js"></script>
</body>
</html>
`;
}

// 0. Remove any legacy google*.html verification files in root
for (const entry of fs.readdirSync(ROOT_DIR)) {
  if (/^google[a-z0-9]+\.html$/i.test(entry)) {
    fs.unlinkSync(path.join(ROOT_DIR, entry));
    console.log(`[SSG] Eliminado archivo de verificación antiguo: ${entry}`);
  }
}

// 1. Generate Home /index.html and /404.html
const homeTitle = "CalcWeb | Calculadoras Matemáticas y de Ingeniería Paso a Paso (100% Client-Side)";
const homeDesc =
  "Resuelve ejercicios de Transformada de Fourier, Transformada de Laplace, Transformada Z, Convolución, EDOs, Integrales, Series de Taylor, Diagonalización, Gauss-Jordan y Fasores AC paso a paso 100% en tu navegador.";
const homeKeywords =
  "calculadora fourier paso a paso, transformada de laplace fracciones simples, transformada z, convolucion, ecuaciones diferenciales, integrales paso a paso, series de taylor, gauss jordan, fasores, sympy webassembly";

const homeHtml = buildFullHtmlDocument({
  title: homeTitle,
  description: homeDesc,
  keywords: homeKeywords,
  route: "/",
  calc: null,
  mainInnerHtml: buildStaticHomeMainHtml()
});

fs.writeFileSync(path.join(ROOT_DIR, "index.html"), homeHtml, "utf8");
fs.writeFileSync(path.join(ROOT_DIR, "404.html"), homeHtml, "utf8");
console.log(`[SSG] Generados /index.html y /404.html con SITE_URL = ${SITE_URL}`);

// 2. Generate All 10 Calculator Static Pages
for (const calc of CALCULATOR_CATALOG) {
  const routeFolder = calc.route.replace(/^\/+/, "");
  const targetDir = path.join(ROOT_DIR, routeFolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pageHtml = buildFullHtmlDocument({
    title: calc.title,
    description: calc.metaDescription,
    keywords: calc.keywords.join(", "),
    route: calc.route,
    calc,
    mainInnerHtml: buildStaticCalculatorMainHtml(calc)
  });

  fs.writeFileSync(path.join(targetDir, "index.html"), pageHtml, "utf8");
  console.log(`[SSG] Generada calculadora SEO + FAQPage JSON-LD: ${calc.route}/index.html`);
}

// 3. Generate All 3 Legal & E-E-A-T Static Pages
for (const legal of LEGAL_PAGES) {
  const routeFolder = legal.route.replace(/^\/+/, "");
  const targetDir = path.join(ROOT_DIR, routeFolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const legalHtml = buildFullHtmlDocument({
    title: legal.title,
    description: legal.metaDescription,
    keywords: "calcweb, ingenieria, matematicas, rgpd, privacidad, aviso legal",
    route: legal.route,
    calc: null,
    mainInnerHtml: buildStaticLegalMainHtml(legal)
  });

  fs.writeFileSync(path.join(targetDir, "index.html"), legalHtml, "utf8");
  console.log(`[SSG] Generada página legal E-E-A-T: ${legal.route}/index.html`);
}

// 4. Generate sitemap.xml with current <lastmod> and priorities (1.0 home, 0.9 tools, 0.3 legal)
const sitemapEntries = [
  { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
  ...CALCULATOR_CATALOG.map((c) => ({
    loc: `${SITE_URL}${c.route}`,
    changefreq: "monthly",
    priority: "0.9"
  })),
  ...LEGAL_PAGES.map((l) => ({
    loc: `${SITE_URL}${l.route}`,
    changefreq: "yearly",
    priority: "0.3"
  }))
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${TODAY_ISO}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT_DIR, "sitemap.xml"), sitemapXml, "utf8");
console.log(`[SSG] Generado /sitemap.xml (${sitemapEntries.length} URLs, lastmod: ${TODAY_ISO})`);

// 5. Generate robots.txt pointing to `${SITE_URL}/sitemap.xml`
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(ROOT_DIR, "robots.txt"), robotsTxt, "utf8");
console.log(`[SSG] Generado /robots.txt apuntando a ${SITE_URL}/sitemap.xml`);
