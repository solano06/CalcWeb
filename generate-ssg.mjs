/**
 * Multilingual Static Route & SEO Generator (SSG) for CalcWeb (ES / EN / FR)
 *
 * Centralizes SITE_URL and generates 48 static routes across 3 languages:
 * - 16 Spanish (es) routes at root: /, /transformada-fourier, ..., /sobre-nosotros, /privacidad, /aviso-legal
 * - 16 English (en) routes under /en/: /en, /en/fourier-transform, ..., /en/about, /en/privacy, /en/legal
 * - 16 French (fr) routes under /fr/: /fr, /fr/transformee-de-fourier, ..., /fr/a-propos, /fr/confidentialite, /fr/mentions-legales
 * - /404.html SPA fallback
 * - /sitemap.xml with all 48 URLs, current <lastmod> date, hreflang alternates, and priorities (1.0 home, 0.9 tools, 0.3 legal)
 * - /robots.txt pointing to `${SITE_URL}/sitemap.xml`
 */

import fs from "node:fs";
import path from "node:path";
import {
  getLocalizedCatalog,
  getLocalizedLegalPages
} from "./js/catalog.js";
import {
  SUPPORTED_LANGS,
  ROUTE_MAP,
  UI_STRINGS,
  getEquivalentRoute
} from "./js/i18n.js";

export const SITE_URL = (process.env.SITE_URL || "https://matespasoapaso.vercel.app").replace(/\/+$/, "");
const GA_MEASUREMENT_ID = (process.env.GA_MEASUREMENT_ID || "").trim();
const TODAY_ISO = new Date().toISOString().split("T")[0];
const BUILD_VERSION = Date.now().toString(36);
const ROOT_DIR = process.cwd();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getNavCategoryGroups(lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const r = ROUTE_MAP;
  return [
    {
      key: "calculus",
      title: ui.navGroups.calculus,
      ids: ["integrals", "ode", "taylor", "fourierseries", "numseries"],
      items: [
        { id: "integrals", route: r.integrals[lang], label: ui.nav.integrals },
        { id: "ode", route: r.ode[lang], label: ui.nav.ode },
        { id: "taylor", route: r.taylor[lang], label: ui.nav.taylor },
        { id: "fourierseries", route: r.fourierseries[lang], label: ui.nav.fourierseries },
        { id: "numseries", route: r.numseries[lang], label: ui.nav.numseries }
      ]
    },
    {
      key: "transforms",
      title: ui.navGroups.transforms,
      ids: ["laplace", "fourier", "ztransform", "convolution"],
      items: [
        { id: "laplace", route: r.laplace[lang], label: ui.nav.laplace },
        { id: "fourier", route: r.fourier[lang], label: ui.nav.fourier },
        { id: "ztransform", route: r.ztransform[lang], label: ui.nav.ztransform },
        { id: "convolution", route: r.convolution[lang], label: ui.nav.convolution }
      ]
    },
    {
      key: "algebra",
      title: ui.navGroups.algebra,
      ids: ["matrix", "gauss", "phasors"],
      items: [
        { id: "matrix", route: r.matrix[lang], label: ui.nav.matrix },
        { id: "gauss", route: r.gauss[lang], label: ui.nav.gauss },
        { id: "phasors", route: r.phasors[lang], label: ui.nav.phasors }
      ]
    }
  ];
}

function buildNavLinksHtml(activeRoute, lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const r = ROUTE_MAP;
  const homeRoute = r.home[lang];
  const groups = getNavCategoryGroups(lang);

  const desktop = groups
    .map((group) => {
      const isGroupActive = group.items.some((it) => it.route === activeRoute);
      return `
      <div class="relative nav-cat-dropdown" data-cat-wrapper="${group.key}">
        <button
          type="button"
          data-cat-toggle="${group.key}"
          aria-expanded="false"
          aria-haspopup="true"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
            isGroupActive
              ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
              : "bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          }"
        >
          <span>${escapeHtml(group.title)}</span>
          <svg data-cat-chevron="${group.key}" class="w-3.5 h-3.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        <div
          data-cat-menu="${group.key}"
          class="hidden absolute left-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50"
        >
          <ul class="space-y-0.5">
            ${group.items
              .map(
                (item) => `
              <li>
                <a
                  href="${item.route}"
                  data-route="${item.route}"
                  class="nav-link block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeRoute === item.route
                      ? "active bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }"
                >${escapeHtml(item.label)}</a>
              </li>`
              )
              .join("")}
          </ul>
        </div>
      </div>`;
    })
    .join("");

  const mobile = `
      <div class="space-y-4">
        <a
          href="${homeRoute}"
          data-route="${homeRoute}"
          class="nav-link block px-3 py-2 rounded-xl text-sm font-semibold ${
            activeRoute === homeRoute
              ? "active bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"
              : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          }"
        >${escapeHtml(ui.nav.home)}</a>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${groups
            .map(
              (group) => `
            <div>
              <div class="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1.5 px-2">
                ${escapeHtml(group.title)}
              </div>
              <div class="space-y-1">
                ${group.items
                  .map(
                    (item) => `
                  <a
                    href="${item.route}"
                    data-route="${item.route}"
                    class="nav-link block px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                      activeRoute === item.route
                        ? "active bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }"
                  >${escapeHtml(item.label)}</a>`
                  )
                  .join("")}
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>`;

  const langSwitcher = SUPPORTED_LANGS.map((l) => {
    const targetUrl = getEquivalentRoute(activeRoute, l);
    const isCurrent = l === lang;
    return `<a href="${targetUrl}" data-lang-switch="${l}" class="px-2 py-0.5 rounded transition-colors ${
      isCurrent
        ? "bg-blue-700 text-white shadow-2xs"
        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
    }">${l.toUpperCase()}</a>`;
  }).join("");

  return { desktop, mobile, langSwitcher };
}

function buildHreflangTags(route) {
  const esPath = getEquivalentRoute(route, "es");
  const enPath = getEquivalentRoute(route, "en");
  const frPath = getEquivalentRoute(route, "fr");

  const esUrl = `${SITE_URL}${esPath === "/" ? "/" : esPath}`;
  const enUrl = `${SITE_URL}${enPath}`;
  const frUrl = `${SITE_URL}${frPath}`;

  return [
    `<link rel="alternate" hreflang="es" href="${esUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="fr" href="${frUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${esUrl}">`
  ].join("\n  ");
}

function buildJsonLdForPage({ title, description, canonicalUrl, calc = null, lang = "es" }) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const homePath = ROUTE_MAP.home[lang];
  const homeUrl = `${SITE_URL}${homePath === "/" ? "/" : homePath}`;

  const graph = [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      name: title,
      url: canonicalUrl,
      description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "All (100% Client-Side WebAssembly)",
      inLanguage: ui.locale,
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
          name: ui.breadcrumbHome,
          item: homeUrl
        },
        {
          "@type": "ListItem",
          position: 2,
          name: calc.category,
          item: homeUrl
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

function buildStaticCalculatorMainHtml(calc, lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const catalog = getLocalizedCatalog(lang);
  const homeRoute = ROUTE_MAP.home[lang];

  const faqsHtml =
    Array.isArray(calc.faqs) && calc.faqs.length > 0
      ? `
    <section aria-labelledby="faq-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mt-8">
      <h2 id="faq-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5">
        ${escapeHtml(ui.faqHeadingPrefix)} ${escapeHtml(calc.shortTitle)}
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
        ${escapeHtml(ui.relatedHeadingPrefix)} ${escapeHtml(calc.category)}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${calc.relatedRoutes
          .map((rRoute) => {
            const rel = catalog.find((c) => c.route === rRoute);
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
      <a href="${homeRoute}" data-route="${homeRoute}">${escapeHtml(ui.breadcrumbHome)}</a>
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
    <section class="min-w-0 max-w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-sm mb-8">
      <div class="mb-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          ${calc.examExamples
            .map(
              (ex) => `
            <div class="min-w-0 max-w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col justify-between">
              <div class="flex items-center justify-between w-full gap-1 mb-1.5 min-w-0">
                <span class="text-[11px] font-semibold text-blue-700 dark:text-blue-400 truncate">${escapeHtml(ex.badge)}</span>
                <span class="text-[10px] font-mono text-slate-400 shrink-0">${escapeHtml(ex.label)} &rarr;</span>
              </div>
              <div class="text-xs font-mono truncate text-slate-700 dark:text-slate-300 py-0.5">${escapeHtml(ex.expr)}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <input type="text" readonly value="${escapeHtml(calc.defaultExpr)}" class="w-full flex-1 min-w-0 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm sm:text-base text-slate-900 dark:text-white" />
        <button type="button" class="px-6 py-3.5 rounded-xl bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-sm shrink-0">${escapeHtml(ui.solveBtn)}</button>
      </div>
    </section>
    <section id="solution-container" class="mb-12"></section>
    <section aria-labelledby="guide-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <h2 id="guide-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
        ${escapeHtml(calc.guide.title)}
      </h2>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        ${escapeHtml(calc.guide.intro)}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        ${calc.guide.formulas
          .map(
            (f) => `
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-2">${escapeHtml(f.name)}</h3>
              <div class="overflow-x-auto py-1 font-mono text-xs text-slate-700 dark:text-slate-300">${escapeHtml(f.latex)}</div>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
              ${escapeHtml(f.note)}
            </p>
          </div>`
          )
          .join("")}
      </div>
      <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
        ${calc.guide.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
      </ul>
    </section>
    ${faqsHtml}
    ${relatedHtml}
  `;
}

function buildStaticLegalMainHtml(legal, lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const homeRoute = ROUTE_MAP.home[lang];

  return `
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="${homeRoute}" data-route="${homeRoute}">${escapeHtml(ui.breadcrumbHome)}</a>
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

function buildStaticHomeMainHtml(lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const catalog = getLocalizedCatalog(lang);
  const groups = getNavCategoryGroups(lang);

  return `
    <section class="rounded-3xl bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 mb-10 shadow-sm">
      <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
        ${escapeHtml(ui.heroTitlePrefix)} ${escapeHtml(ui.heroTitleHighlight)}
      </h1>
      <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
        ${ui.heroDescription}
      </p>
    </section>
    <section class="space-y-10 mb-14">
      ${groups
        .map((group) => {
          const groupCalcs = group.ids
            .map((id) => catalog.find((c) => c.id === id))
            .filter(Boolean);
          return `
        <div>
          <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-5">
            ${escapeHtml(group.title)}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${groupCalcs
              .map(
                (c) => `
              <article class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
                <h3 class="font-serif text-xl font-bold mb-2">
                  <a href="${c.route}" data-route="${c.route}">${escapeHtml(c.shortTitle)}</a>
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400">${escapeHtml(c.subtitle)}</p>
              </article>`
              )
              .join("")}
          </div>
        </div>`;
        })
        .join("")}
    </section>
  `;
}

function buildFullHtmlDocument({
  title,
  description,
  keywords,
  route,
  lang = "es",
  calc = null,
  mainInnerHtml = ""
}) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const routes = ROUTE_MAP;
  const homeRoute = routes.home[lang];
  const catalog = getLocalizedCatalog(lang);

  const canonicalUrl = `${SITE_URL}${route === "/" ? "/" : route}`;
  const fullTitle = title.includes("CalcWeb") ? title : `${title} | CalcWeb`;
  const nav = buildNavLinksHtml(route, lang);
  const hreflangTags = buildHreflangTags(route);
  const jsonLd = buildJsonLdForPage({
    title: fullTitle,
    description,
    canonicalUrl,
    calc,
    lang
  });

  return `<!DOCTYPE html>
<html lang="${lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="build-version" content="${BUILD_VERSION}">
  <meta name="google-site-verification" content="2jAlBSAJVHJ24YMj4Xmazba7KTn0T3KmbLh-hcY8hYA" />
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  <link rel="canonical" href="${canonicalUrl}">
  ${hreflangTags}

  <!-- Prevent Dark Mode FOUC before CSS paints -->
  <script>try{if(localStorage.getItem('calcweb_theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}</script>

  <!-- Favicon & Mobile PWA Manifest -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#1d4ed8">

  <!-- Open Graph & Twitter Cards -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${ui.ogLocale}">
  <meta property="og:site_name" content="CalcWeb">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${SITE_URL}/og-cover.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="CalcWeb — Step-by-Step Symbolic Math & Engineering Calculators">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/og-cover.png">

  <!-- Resource Hints for Core Web Vitals (LCP & INP) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="modulepreload" href="/js/app.js?v=${BUILD_VERSION}">
  <link rel="modulepreload" href="/js/i18n.js?v=${BUILD_VERSION}">
  <link rel="modulepreload" href="/js/catalog.js?v=${BUILD_VERSION}">
  <link rel="modulepreload" href="/js/hybrid-engine.js?v=${BUILD_VERSION}">
  <link rel="modulepreload" href="/js/plotter.js?v=${BUILD_VERSION}">

  <!-- Structured Data JSON-LD (WebApplication + BreadcrumbList + FAQPage) -->
  <script id="json-ld-seo" type="application/ld+json">
${jsonLd}
  </script>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap" rel="stylesheet">

  <!-- KaTeX Math Typesetting -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
  <script id="katex-js" defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>

  <!-- Compiled Static Tailwind CSS & Custom Styles -->
  <link rel="stylesheet" href="/css/tailwind.min.css?v=${BUILD_VERSION}">
  <link rel="stylesheet" href="/css/styles.css?v=${BUILD_VERSION}">

  <!-- Vercel Web Analytics -->
  <script defer src="/_vercel/insights/script.js"></script>${
    GA_MEASUREMENT_ID
      ? `

  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(GA_MEASUREMENT_ID)}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${escapeHtml(GA_MEASUREMENT_ID)}');
  </script>`
      : ""
  }
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200 selection:bg-blue-600 selection:text-white">

  <header class="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
      <!-- Left: Logo + Home Link -->
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <a href="${homeRoute}" data-route="${homeRoute}" class="flex items-center gap-2 sm:gap-2.5 group focus:outline-none min-w-0">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-serif font-bold text-lg sm:text-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all shrink-0">&Sigma;</div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <span class="font-serif font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white truncate">CalcWeb</span>
              <span class="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">CAS v2.4</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block lg:block truncate">${ui.brandSubtitle}</p>
          </div>
        </a>
        <a id="nav-home-link" href="${homeRoute}" data-route="${homeRoute}" class="nav-link ${
          route === homeRoute ? "active " : ""
        }hidden md:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">${escapeHtml(
          ui.nav.home
        )}</a>
      </div>

      <!-- Center: 3-Category Dropdowns -->
      <nav aria-label="Main Navigation" class="hidden lg:flex items-center gap-1.5 relative">
        ${nav.desktop}
      </nav>

      <!-- Right: Language Switcher + Compact Engine Status + Dark Mode + Mobile Hamburger -->
      <div class="flex items-center gap-1 sm:gap-2 shrink-0">
        <div id="lang-switcher" class="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-[10px] sm:text-[11px] font-mono font-semibold">
          ${nav.langSwitcher}
        </div>

        <button id="engine-status-btn" type="button" title="${escapeHtml(ui.engineStatusLoading)}" aria-label="${escapeHtml(ui.engineStatusLoading)}" class="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium border transition-all bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800/80 dark:text-amber-300">
          <span id="engine-status-dot" class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          <span id="engine-status-text" class="sr-only">${escapeHtml(ui.engineStatusLoading)}</span>
        </button>

        <button id="theme-toggle" type="button" aria-label="${escapeHtml(ui.themeToggleLabel)}" class="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg id="theme-icon-sun" class="w-4 h-4 sm:w-5 sm:h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <svg id="theme-icon-moon" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>

        <button id="mobile-menu-btn" type="button" aria-expanded="false" aria-label="${escapeHtml(ui.navMenuToggle)}" class="lg:hidden p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Hamburger Drawer -->
    <div id="mobile-nav-drawer" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-4 bg-white dark:bg-slate-900 shadow-lg">
      ${nav.mobile}
    </div>
  </header>

  <main id="app-main" class="flex-1 max-w-7xl w-full min-w-0 max-w-full overflow-x-clip mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
    ${mainInnerHtml}
  </main>

  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="font-serif font-bold text-sm text-slate-800 dark:text-slate-200">CalcWeb &Sigma;</span>
          <span>&bull;</span>
          <span>${escapeHtml(ui.footerTagline)}</span>
        </div>
        <div class="flex flex-wrap items-center gap-4 font-medium">
          <a href="${routes.about[lang]}" data-route="${routes.about[lang]}" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">${escapeHtml(ui.footerAbout)}</a>
          <a href="${routes.privacy[lang]}" data-route="${routes.privacy[lang]}" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">${escapeHtml(ui.footerPrivacy)}</a>
          <a href="${routes.legal[lang]}" data-route="${routes.legal[lang]}" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">${escapeHtml(ui.footerLegal)}</a>
        </div>
      </div>

      <div class="border-t border-slate-200/70 dark:border-slate-800/70 pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
        ${catalog
          .map(
            (c) =>
              `<a href="${c.route}" data-route="${c.route}" class="hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline">${escapeHtml(
                c.shortTitle
              )}</a>`
          )
          .join("\n        ")}
      </div>
    </div>
  </footer>

  <script type="module" src="/js/app.js?v=${BUILD_VERSION}"></script>
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

const sitemapEntries = [];

// Loop over all 3 supported languages: ES, EN, FR
for (const lang of SUPPORTED_LANGS) {
  const ui = UI_STRINGS[lang];
  const homeRoute = ROUTE_MAP.home[lang];
  const catalog = getLocalizedCatalog(lang);
  const legalPages = getLocalizedLegalPages(lang);

  // 1. Generate Home Page (/index.html, /en/index.html, /fr/index.html)
  const homeHtml = buildFullHtmlDocument({
    title: ui.homeSeoTitle,
    description: ui.homeSeoDesc,
    keywords: ui.homeSeoKeywords,
    route: homeRoute,
    lang,
    calc: null,
    mainInnerHtml: buildStaticHomeMainHtml(lang)
  });

  if (homeRoute === "/") {
    fs.writeFileSync(path.join(ROOT_DIR, "index.html"), homeHtml, "utf8");
    fs.writeFileSync(path.join(ROOT_DIR, "404.html"), homeHtml, "utf8");
    console.log(`[SSG][${lang.toUpperCase()}] Generados /index.html y /404.html`);
  } else {
    const langFolder = homeRoute.replace(/^\/+/, "");
    const targetDir = path.join(ROOT_DIR, langFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, "index.html"), homeHtml, "utf8");
    console.log(`[SSG][${lang.toUpperCase()}] Generado Home ${homeRoute}/index.html`);
  }

  sitemapEntries.push({
    loc: `${SITE_URL}${homeRoute === "/" ? "/" : homeRoute}`,
    route: homeRoute,
    changefreq: "weekly",
    priority: "1.0"
  });

  // 2. Generate All 12 Calculator Static Pages for this language
  for (const calc of catalog) {
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
      lang,
      calc,
      mainInnerHtml: buildStaticCalculatorMainHtml(calc, lang)
    });

    fs.writeFileSync(path.join(targetDir, "index.html"), pageHtml, "utf8");
    console.log(`[SSG][${lang.toUpperCase()}] Generada calculadora: ${calc.route}/index.html`);

    sitemapEntries.push({
      loc: `${SITE_URL}${calc.route}`,
      route: calc.route,
      changefreq: "monthly",
      priority: "0.9"
    });
  }

  // 3. Generate All 3 Legal & E-E-A-T Static Pages for this language
  for (const legal of legalPages) {
    const routeFolder = legal.route.replace(/^\/+/, "");
    const targetDir = path.join(ROOT_DIR, routeFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const legalHtml = buildFullHtmlDocument({
      title: legal.title,
      description: legal.metaDescription,
      keywords: "calcweb, engineering, mathematics, gdpr, privacy, legal notice",
      route: legal.route,
      lang,
      calc: null,
      mainInnerHtml: buildStaticLegalMainHtml(legal, lang)
    });

    fs.writeFileSync(path.join(targetDir, "index.html"), legalHtml, "utf8");
    console.log(`[SSG][${lang.toUpperCase()}] Generada página legal: ${legal.route}/index.html`);

    sitemapEntries.push({
      loc: `${SITE_URL}${legal.route}`,
      route: legal.route,
      changefreq: "yearly",
      priority: "0.3"
    });
  }
}

// 4. Generate sitemap.xml with all 48 URLs and xhtml:link hreflang alternates
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries
  .map((entry) => {
    const esPath = getEquivalentRoute(entry.route, "es");
    const enPath = getEquivalentRoute(entry.route, "en");
    const frPath = getEquivalentRoute(entry.route, "fr");
    const esUrl = `${SITE_URL}${esPath === "/" ? "/" : esPath}`;
    const enUrl = `${SITE_URL}${enPath}`;
    const frUrl = `${SITE_URL}${frPath}`;

    return `  <url>
    <loc>${entry.loc}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}" />
    <lastmod>${TODAY_ISO}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT_DIR, "sitemap.xml"), sitemapXml, "utf8");
console.log(`[SSG] Generado /sitemap.xml (${sitemapEntries.length} URLs en ES/EN/FR, lastmod: ${TODAY_ISO})`);

// 5. Generate robots.txt pointing to `${SITE_URL}/sitemap.xml`
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(ROOT_DIR, "robots.txt"), robotsTxt, "utf8");
console.log(`[SSG] Generado /robots.txt apuntando a ${SITE_URL}/sitemap.xml`);
