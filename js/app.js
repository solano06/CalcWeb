/**
 * CalcWeb Main Application Controller (Multilingual ES/EN/FR SPA/SSG Clean Router + Pyodide Worker + Hybrid Engine + KaTeX UI)
 */

import {
  getLocalizedKeyboardKeys,
  getLocalizedCatalog,
  getLocalizedLegalPages
} from "./catalog.js";
import {
  SUPPORTED_LANGS,
  ROUTE_MAP,
  UI_STRINGS,
  detectLangFromPath,
  resolvePageIdFromPath,
  getEquivalentRoute,
  localizeStepsResult
} from "./i18n.js";
import { solveWithHybridEngine } from "./hybrid-engine.js";

// Application State
const state = {
  currentRoute: "/",
  lang: "es", // 'es' | 'en' | 'fr'
  pageId: "home",
  pyodideStatus: "loading", // 'loading' | 'ready' | 'error'
  workerReady: false,
  pyodideMessage: "Cargando motor simbólico...",
  worker: null,
  reqCounter: 0,
  latestCalcRunId: 0,
  pendingRequests: new Map(),
  lastSolution: null, // { steps: [], final_latex: "", expr: "", title: "", engineUsed: "" }
  activeDirection: "direct",
  keyboardOpen: false
};

function getUI() {
  return UI_STRINGS[state.lang] || UI_STRINGS.es;
}

/* ==========================================================================
   1. THEME MANAGEMENT (LIGHT BY DEFAULT + DARK MODE OPTION)
   ========================================================================== */
function initTheme() {
  const saved = localStorage.getItem("calcweb_theme");
  const isDark = saved === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  updateThemeIcons(isDark);

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const nowDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("calcweb_theme", nowDark ? "dark" : "light");
      updateThemeIcons(nowDark);
    });
  }
}

function updateThemeIcons(isDark) {
  const sun = document.getElementById("theme-icon-sun");
  const moon = document.getElementById("theme-icon-moon");
  if (!sun || !moon) return;
  sun.classList.toggle("hidden", !isDark);
  moon.classList.toggle("hidden", isDark);
}

/* ==========================================================================
   2. DEDICATED PYODIDE + SYMPY WEB WORKER MANAGER
   ========================================================================== */
function initPyodideWorker() {
  const ui = getUI();
  try {
    const buildVersion = document.querySelector('meta[name="build-version"]')?.content || "1";
    const worker = new Worker("/js/pyodide-worker.js?v=" + buildVersion);
    state.worker = worker;

    worker.addEventListener("message", (event) => {
      const data = event.data;
      if (data.type === "STATUS") {
        state.pyodideStatus = data.status;
        state.workerReady = data.status === "ready";
        const curUi = getUI();
        const msg =
          data.status === "ready"
            ? curUi.engineStatusReady
            : data.status === "loading"
            ? curUi.engineStatusLoading
            : curUi.engineStatusFallback;
        state.pyodideMessage = msg;
        updateEngineBadgeUI(data.status, msg);
        if (data.status === "ready") {
          localStorage.setItem("calcweb_pyodide_cached", "true");
        }
      } else if (data.type === "RESULT") {
        const resolver = state.pendingRequests.get(data.id);
        if (resolver) {
          state.pendingRequests.delete(data.id);
          resolver(data);
        }
      }
    });

    worker.addEventListener("error", (err) => {
      console.error("[CalcWeb Worker Error]", err);
      state.pyodideStatus = "error";
      state.workerReady = false;
      updateEngineBadgeUI("error", getUI().engineStatusFallback);
    });

    const wasCached = localStorage.getItem("calcweb_pyodide_cached") === "true";
    updateEngineBadgeUI(
      "loading",
      wasCached ? ui.engineStatusCached : ui.engineStatusLoading
    );

    worker.postMessage({ action: "INIT" });
  } catch (err) {
    state.pyodideStatus = "error";
    updateEngineBadgeUI("error", ui.engineStatusFallback);
  }
}

function updateEngineBadgeUI(status, text) {
  const btn = document.getElementById("engine-status-btn");
  const dot = document.getElementById("engine-status-dot");
  const label = document.getElementById("engine-status-text");
  if (!btn || !dot) return;

  btn.setAttribute("title", text);
  btn.setAttribute("aria-label", text);
  if (label) {
    label.textContent = text;
    label.className = "sr-only";
  }

  if (status === "ready") {
    btn.className =
      "flex items-center justify-center p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium border transition-all bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800/80 dark:text-emerald-300";
    dot.className = "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500";
  } else if (status === "loading") {
    btn.className =
      "flex items-center justify-center p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium border transition-all bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800/80 dark:text-amber-300";
    dot.className = "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 animate-ping";
  } else {
    btn.className =
      "flex items-center justify-center p-1.5 sm:px-2.5 sm:py-2 rounded-lg text-xs font-medium border transition-all bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-950/60 dark:border-blue-800/80 dark:text-blue-300";
    dot.className = "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500";
  }
}

function runWorkerCalculation(tool, expr, direction, timeoutMs = 15000, lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  return new Promise((resolve) => {
    if (!state.worker) {
      resolve({ result: { ok: false, error: ui.errParse } });
      return;
    }
    const id = ++state.reqCounter;
    const timer = setTimeout(() => {
      if (state.pendingRequests.has(id)) {
        state.pendingRequests.delete(id);
        resolve({
          result: {
            ok: false,
            error: ui.errTimeout
          }
        });
      }
    }, timeoutMs);

    state.pendingRequests.set(id, (data) => {
      clearTimeout(timer);
      resolve(data);
    });

    state.worker.postMessage({
      id,
      action: "SOLVE",
      payload: { tool, expr, direction, lang }
    });
  });
}

/* ==========================================================================
   3. KATEX SAFE RENDERING UTILITY
   ========================================================================== */
function renderLatexToHtml(latexStr, displayMode = true) {
  if (!latexStr) return "";
  if (window.katex) {
    try {
      return window.katex.renderToString(latexStr, {
        displayMode,
        throwOnError: false,
        strict: false
      });
    } catch (e) {
      return `<code class="font-mono text-sm">${escapeHtml(latexStr)}</code>`;
    }
  }
  return `<code class="font-mono text-sm">${escapeHtml(latexStr)}</code>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  const colorClasses =
    type === "success"
      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-700"
      : "bg-red-600 text-white border-red-700";
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-medium transition-all duration-200 ${colorClasses}`;
  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 220);
  }, 2800);
}

/* ==========================================================================
   4. MULTILINGUAL ROUTER & SEO META MANAGEMENT (ES / EN / FR CLEAN URLS)
   ========================================================================== */
function normalizePathname(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/index.html") return "/";
  if (clean === "/en/index.html") return "/en";
  if (clean === "/fr/index.html") return "/fr";
  return clean;
}

function getNavCategoryGroups(lang) {
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

function updateShellNavigationUI(activeRoute, lang) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  const routes = ROUTE_MAP;
  const homeRoute = routes.home[lang];
  const groups = getNavCategoryGroups(lang);

  document.documentElement.lang = lang;

  // Update Brand link & subtitle
  const brandLink = document.querySelector("header a[data-route]");
  if (brandLink) {
    brandLink.setAttribute("href", homeRoute);
    brandLink.setAttribute("data-route", homeRoute);
    const subP = brandLink.querySelector("p");
    if (subP) subP.innerHTML = ui.brandSubtitle;
  }

  // Update Left Home Link if present
  const homeNavLink = document.getElementById("nav-home-link");
  if (homeNavLink) {
    homeNavLink.setAttribute("href", homeRoute);
    homeNavLink.setAttribute("data-route", homeRoute);
    homeNavLink.textContent = ui.nav.home;
    homeNavLink.classList.toggle("active", activeRoute === homeRoute);
  }

  // Update Engine Status Badge tooltip to current language
  const statusMsg =
    state.pyodideStatus === "ready"
      ? ui.engineStatusReady
      : state.pyodideStatus === "loading"
      ? ui.engineStatusLoading
      : ui.engineStatusFallback;
  updateEngineBadgeUI(state.pyodideStatus, statusMsg);

  // Update Center Desktop 3-Category Dropdowns
  const desktopNav = document.querySelector("header nav[aria-label]");
  if (desktopNav) {
    desktopNav.className = "hidden lg:flex items-center gap-1.5 relative";
    desktopNav.innerHTML = groups
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
  }

  // Update Mobile Drawer (#mobile-nav-drawer)
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  if (mobileDrawer) {
    mobileDrawer.innerHTML = `
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
                  >${escapeHtml(item.label)}</a>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  // Update Language Switcher (ES | EN | FR) as REAL <a href="..."> links (no data-route interception)
  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.innerHTML = SUPPORTED_LANGS.map((l) => {
      const targetUrl = getEquivalentRoute(activeRoute, l);
      const isCurrent = l === lang;
      return `<a href="${targetUrl}" data-lang-switch="${l}" class="px-2 py-0.5 rounded transition-colors ${
        isCurrent
          ? "bg-blue-700 text-white shadow-2xs"
          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
      }">${l.toUpperCase()}</a>`;
    }).join("");
  }

  // Update Mobile Menu Toggle aria-label
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute("aria-label", ui.navMenuToggle);
  }

  // Update Footer Links and Tagline
  const footer = document.querySelector("footer");
  if (footer) {
    const catalog = getLocalizedCatalog(lang);
    footer.innerHTML = `
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
            .join("\n          ")}
        </div>
      </div>
    `;
  }
}

function navigateTo(route, pushState = true) {
  const normalized = normalizePathname(route);
  const lang = detectLangFromPath(normalized);
  const resolved = resolvePageIdFromPath(normalized);

  state.currentRoute = normalized;
  state.lang = lang;
  state.pageId = typeof resolved === "string" ? resolved : resolved?.pageId || "home";

  if (pushState) {
    window.history.pushState({ route: normalized }, "", normalized);
  }

  updateShellNavigationUI(normalized, lang);

  const catalog = getLocalizedCatalog(lang);
  const legalPages = getLocalizedLegalPages(lang);
  const ui = getUI();

  const calc = catalog.find((c) => c.route === normalized);
  const legal = legalPages.find((l) => l.route === normalized);

  if (calc) {
    updateDocumentSEO(calc.title, calc.metaDescription, calc.route, calc, lang);
    renderCalculatorView(calc);
  } else if (legal) {
    updateDocumentSEO(legal.title, legal.metaDescription, legal.route, null, lang);
    renderLegalView(legal);
  } else {
    const homeRoute = ROUTE_MAP.home[lang];
    updateDocumentSEO(ui.homeSeoTitle, ui.homeSeoDesc, homeRoute, null, lang);
    renderHomeDashboard();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getBaseSiteUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    try {
      const u = new URL(canonical.getAttribute("href"));
      return u.origin;
    } catch (e) {
      // fallback
    }
  }
  return "https://matespasoapaso.vercel.app";
}

function updateDocumentSEO(title, description, routePath, calcObj = null, lang = "es") {
  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  document.title = title;
  const baseOrigin = getBaseSiteUrl();
  const canonicalUrl = `${baseOrigin}${routePath === "/" ? "/" : routePath}`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", description);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", canonicalUrl);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", description);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", ui.ogLocale);

  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", title);
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute("content", description);

  // Update hreflang alternate link tags dynamically
  const hreflangs = [
    { code: "es", path: getEquivalentRoute(routePath, "es") },
    { code: "en", path: getEquivalentRoute(routePath, "en") },
    { code: "fr", path: getEquivalentRoute(routePath, "fr") },
    { code: "x-default", path: getEquivalentRoute(routePath, "es") }
  ];

  hreflangs.forEach(({ code, path }) => {
    let link = document.querySelector(`link[rel="alternate"][hreflang="${code}"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", code);
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${baseOrigin}${path === "/" ? "/" : path}`);
  });

  // Dynamically update JSON-LD Structured Data (@graph with WebApplication + BreadcrumbList + FAQPage)
  let ldScript = document.getElementById("json-ld-seo");
  if (!ldScript) {
    ldScript = document.createElement("script");
    ldScript.id = "json-ld-seo";
    ldScript.type = "application/ld+json";
    document.head.appendChild(ldScript);
  }

  const homeUrl = `${baseOrigin}${ROUTE_MAP.home[lang] === "/" ? "/" : ROUTE_MAP.home[lang]}`;

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

  if (calcObj) {
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
          name: calcObj.category,
          item: homeUrl
        },
        {
          "@type": "ListItem",
          position: 3,
          name: calcObj.shortTitle,
          item: canonicalUrl
        }
      ]
    });

    if (Array.isArray(calcObj.faqs) && calcObj.faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: calcObj.faqs.map((faq) => ({
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

  ldScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  });
}

/* ==========================================================================
   5. VIEW 1: HOME / DASHBOARD (INSTANT SEARCH & CATEGORY CARDS)
   ========================================================================== */
function renderHomeDashboard() {
  const main = document.getElementById("app-main");
  if (!main) return;

  const ui = getUI();
  const catalog = getLocalizedCatalog(state.lang);
  const categories = [
    ui.categories.all,
    ui.categories["Señales y Sistemas"],
    ui.categories["Cálculo y Ecuaciones Diferenciales"],
    ui.categories["Álgebra Lineal y Circuitos"]
  ];

  main.innerHTML = `
    <!-- Hero Academic Header -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <span>${ui.heroBadge}</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
          ${escapeHtml(ui.heroTitlePrefix)} <span class="text-blue-700 dark:text-blue-400">${escapeHtml(ui.heroTitleHighlight)}</span>
        </h1>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          ${ui.heroDescription}
        </p>

        <!-- Instant Calculator & Topic Search Bar -->
        <div class="relative max-w-2xl">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            id="dashboard-search"
            type="search"
            autocomplete="off"
            placeholder="${escapeHtml(ui.searchPlaceholder)}"
            class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </section>

    <!-- Category Filter Pills -->
    <section class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2" id="category-filters" role="tablist">
        ${categories
          .map(
            (cat, idx) => `
          <button
            type="button"
            data-category="${escapeHtml(cat)}"
            class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
              idx === 0
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
            }"
          >
            ${escapeHtml(cat)}
          </button>
        `
          )
          .join("")}
      </div>
      <span id="catalog-count" class="text-xs font-mono text-slate-500 dark:text-slate-400">
        ${catalog.length} ${escapeHtml(ui.modulesCountPlural)}
      </span>
    </section>

    <!-- Calculators Grouped by 3 Categories -->
    <section id="calculators-grid" class="space-y-10 mb-14">
      ${renderGroupedCatalogSections(catalog, state.lang)}
    </section>

    <!-- Architecture & Pedagogical Guarantees Section -->
    <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
        ${escapeHtml(ui.archHeading)}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold mb-1">${escapeHtml(ui.arch1Badge)}</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">${escapeHtml(ui.arch1Title)}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ${escapeHtml(ui.arch1Body)}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold mb-1">${escapeHtml(ui.arch2Badge)}</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">${escapeHtml(ui.arch2Title)}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ${ui.arch2Body}
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-semibold mb-1">${escapeHtml(ui.arch3Badge)}</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">${escapeHtml(ui.arch3Title)}</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ${escapeHtml(ui.arch3Body)}
          </p>
        </div>
      </div>
    </section>
  `;

  // Wire up instant search & category filter
  let activeCategory = ui.categories.all;
  const searchInput = document.getElementById("dashboard-search");
  const grid = document.getElementById("calculators-grid");
  const countEl = document.getElementById("catalog-count");

  function filterCards() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const filtered = catalog.filter((calc) => {
      const matchCat = activeCategory === ui.categories.all || calc.category === activeCategory;
      const matchQuery =
        !q ||
        calc.shortTitle.toLowerCase().includes(q) ||
        calc.h1.toLowerCase().includes(q) ||
        calc.subtitle.toLowerCase().includes(q) ||
        calc.category.toLowerCase().includes(q) ||
        calc.keywords.some((k) => k.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">${escapeHtml(ui.noResultsFor)} "<strong>${escapeHtml(q)}</strong>".</p>
        </div>
      `;
    } else {
      grid.innerHTML = renderGroupedCatalogSections(filtered, state.lang);
    }
    if (countEl) {
      countEl.textContent = `${filtered.length} ${
        filtered.length === 1 ? ui.modulesCountSingular : ui.modulesCountPlural
      }`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  document.querySelectorAll(".cat-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.getAttribute("data-category");
      document.querySelectorAll(".cat-pill").forEach((b) => {
        const isSelected = b.getAttribute("data-category") === activeCategory;
        b.className = `cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
          isSelected
            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
        }`;
      });
      filterCards();
    });
  });
}

function renderGroupedCatalogSections(items, lang) {
  const groups = getNavCategoryGroups(lang);
  return groups
    .map((group) => {
      const groupCalcs = group.ids
        .map((id) => items.find((c) => c.id === id))
        .filter(Boolean);
      if (groupCalcs.length === 0) return "";
      return `
        <div>
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-5">
            <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              ${escapeHtml(group.title)}
            </h2>
            <span class="text-xs font-mono text-slate-400">${groupCalcs.length}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${groupCalcs.map((calc) => renderCalculatorCardHTML(calc)).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderCalculatorCardHTML(calc) {
  const ui = getUI();
  return `
    <article class="academic-card flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-blue-500/60 dark:hover:border-blue-500/60">
      <div>
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="px-2.5 py-1 rounded-md text-xs font-semibold border ${calc.categoryBadge}">
            ${escapeHtml(calc.category)}
          </span>
          <span class="font-mono text-[11px] text-slate-400">${calc.route}</span>
        </div>

        <h2 class="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
          <a href="${calc.route}" data-route="${calc.route}" class="hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none">
            ${escapeHtml(calc.shortTitle)}
          </a>
        </h2>

        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          ${escapeHtml(calc.subtitle)}
        </p>

        <!-- Formula Preview Box -->
        <div class="rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800/80 px-3 py-2.5 mb-5 overflow-x-auto text-center">
          ${renderLatexToHtml(calc.formulaPreview, true)}
        </div>
      </div>

      <div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex flex-wrap gap-1.5">
          ${calc.examExamples
            .slice(0, 2)
            .map(
              (ex) => `
            <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
              ${escapeHtml(ex.label)}
            </span>
          `
            )
            .join("")}
          <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">${escapeHtml(ui.moreExamples)}</span>
        </div>

        <a
          href="${calc.route}"
          data-route="${calc.route}"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm"
        >
          <span>${escapeHtml(ui.openCalculatorBtn)}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </a>
      </div>
    </article>
  `;
}

/* ==========================================================================
   6. VIEW 2: DEDICATED CALCULATOR PAGE (SEO H1, 4 EXAM PRESETS, KEYBOARD, STEPS, GUIDE)
   ========================================================================== */
function renderCalculatorView(calc) {
  const main = document.getElementById("app-main");
  if (!main) return;

  const ui = getUI();
  const catalog = getLocalizedCatalog(state.lang);
  const keyboardKeys = getLocalizedKeyboardKeys(state.lang);
  const homeRoute = ROUTE_MAP.home[state.lang];

  state.activeDirection = calc.defaultDirection || "direct";

  main.innerHTML = `
    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="${homeRoute}" data-route="${homeRoute}" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span>${escapeHtml(ui.breadcrumbHome)}</span>
      </a>
      <span>/</span>
      <span class="px-2 py-0.5 rounded text-[11px] font-medium border ${calc.categoryBadge}">${escapeHtml(calc.category)}</span>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(calc.shortTitle)}</span>
    </nav>

    <!-- Calculator SEO Header (H1 + Subtitle) -->
    <header class="mb-7">
      <h1 class="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        ${escapeHtml(calc.h1)}
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
        ${escapeHtml(calc.subtitle)}
      </p>
    </header>

    <!-- Main Workbench Card -->
    <section class="min-w-0 max-w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-sm mb-8">
      
      ${
        calc.hasDirectionToggle
          ? `
        <!-- Direct / Inverse Mode Selector -->
        <div class="mb-6 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 w-fit">
          <button
            type="button"
            id="dir-btn-direct"
            data-dir="direct"
            class="dir-toggle-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          >
            ${escapeHtml(calc.directLabel)}
          </button>
          <button
            type="button"
            id="dir-btn-inverse"
            data-dir="inverse"
            class="dir-toggle-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          >
            ${escapeHtml(calc.inverseLabel)}
          </button>
        </div>
      `
          : ""
      }

      <!-- 4 Exam Examples Buttons (One-Click Fill & Execute) -->
      <div class="mb-5">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            ${escapeHtml(ui.examExamplesHeading)}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          ${calc.examExamples
            .map(
              (ex, idx) => `
            <button
              type="button"
              data-exam-idx="${idx}"
              class="exam-preset-btn min-w-0 max-w-full group text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-blue-50/60 dark:bg-slate-950/60 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center justify-between w-full gap-1 mb-1.5 min-w-0">
                <span class="text-[11px] font-semibold text-blue-700 dark:text-blue-400 truncate">${escapeHtml(ex.badge)}</span>
                <span class="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0">${escapeHtml(ex.label)} &rarr;</span>
              </div>
              <div class="text-xs max-w-full overflow-x-auto py-0.5 text-slate-800 dark:text-slate-200">
                ${renderLatexToHtml(ex.latexLabel, false)}
              </div>
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Expression Input Form & Collapsible Virtual Math Keyboard Toggle -->
      <form id="calc-form" class="space-y-3 min-w-0 max-w-full">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 min-w-0 max-w-full">
          <div class="relative flex-1 min-w-0">
            <input
              id="calc-input"
              type="text"
              value="${escapeHtml(calc.defaultExpr)}"
              placeholder="${escapeHtml(
                state.activeDirection === "inverse" && calc.placeholderInverse
                  ? calc.placeholderInverse
                  : calc.placeholderDirect
              )}"
              class="w-full min-w-0 px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 min-w-0">
            <!-- Toggle Collapsible Virtual Math Keyboard -->
            <button
              type="button"
              id="toggle-keyboard-btn"
              aria-expanded="${state.keyboardOpen}"
              title="${escapeHtml(ui.mathKeyboardTooltip)}"
              class="px-3.5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shrink-0"
            >
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <span>${escapeHtml(ui.mathKeyboardBtn)}</span>
              <svg id="keyboard-chevron" class="w-4 h-4 transition-transform ${state.keyboardOpen ? "rotate-180" : ""}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Solve Button -->
            <button
              type="submit"
              id="solve-submit-btn"
              class="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center gap-2 shrink-0"
            >
              <span>${escapeHtml(ui.solveBtn)}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Collapsible Virtual Mathematical Keyboard Drawer -->
        <div
          id="virtual-keyboard-drawer"
          class="${state.keyboardOpen ? "block" : "hidden"} pt-3 pb-1 border-t border-slate-200 dark:border-slate-800 transition-all"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              ${escapeHtml(ui.keyboardHint)}
            </span>
            <button type="button" id="clear-input-btn" class="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-medium">
              ${escapeHtml(ui.clearInput)}
            </button>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
            ${keyboardKeys
              .map(
                (k, i) => `
              <button
                type="button"
                data-key-idx="${i}"
                title="${escapeHtml(k.tooltip)} -> ${escapeHtml(k.insert)}"
                class="math-key p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-blue-950/50 hover:border-blue-400 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center min-h-[46px]"
              >
                <span class="text-xs">${renderLatexToHtml(k.label, false)}</span>
                <span class="text-[9px] font-mono text-slate-400 mt-0.5 truncate max-w-full">${escapeHtml(k.insert)}</span>
              </button>
            `
            ).join("")}
          </div>
        </div>
      </form>
    </section>

    <!-- Dynamic Step-by-Step Solution Output Section -->
    <section id="solution-container" class="mb-12">
      <!-- Populated immediately on load with the default exam problem -->
    </section>

    <!-- Bottom SEO Organic Ranking Section: Quick Guide & Key Formulas -->
    <section aria-labelledby="guide-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <span>${escapeHtml(ui.guideSectionBadge)}</span>
      </div>
      <h2 id="guide-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
        ${escapeHtml(calc.guide.title)}
      </h2>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        ${escapeHtml(calc.guide.intro)}
      </p>

      <!-- Formulas Table / Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        ${calc.guide.formulas
          .map(
            (f) => `
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-2">${escapeHtml(f.name)}</h3>
              <div class="overflow-x-auto py-1">
                ${renderLatexToHtml(f.latex, true)}
              </div>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
              ${escapeHtml(f.note)}
            </p>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- Exam Tips Box -->
      <div class="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2">
          ${escapeHtml(ui.examTipsHeading)}
        </h3>
        <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
          ${calc.guide.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
        </ul>
      </div>
    </section>

    ${
      Array.isArray(calc.faqs) && calc.faqs.length > 0
        ? `
    <!-- SEO On-Page: 4 Preguntas Frecuentes (FAQ) Synchronized with FAQPage JSON-LD -->
    <section aria-labelledby="faq-heading" class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mt-8">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${escapeHtml(ui.faqBadge)}</span>
      </div>
      <h2 id="faq-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5">
        ${escapeHtml(ui.faqHeadingPrefix)} ${escapeHtml(calc.shortTitle)}
      </h2>
      <div class="space-y-3.5">
        ${calc.faqs
          .map(
            (faq) => `
          <details class="group rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 p-4 open:bg-white dark:open:bg-slate-900 transition-colors">
            <summary class="font-semibold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer list-none flex items-center justify-between gap-3">
              <span>${escapeHtml(faq.q)}</span>
              <span class="text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform shrink-0">&#9662;</span>
            </summary>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
              ${escapeHtml(faq.a)}
            </p>
          </details>
        `
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }

    ${
      Array.isArray(calc.relatedRoutes) && calc.relatedRoutes.length > 0
        ? `
    <!-- Contextual Internal Linking: Calculadoras Relacionadas -->
    <section aria-labelledby="related-heading" class="mt-8">
      <h2 id="related-heading" class="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
        ${escapeHtml(ui.relatedHeadingPrefix)} ${escapeHtml(calc.category)}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${calc.relatedRoutes
          .map((rRoute) => {
            const relCalc = catalog.find((c) => c.route === rRoute);
            if (!relCalc) return "";
            return `
            <a
              href="${relCalc.route}"
              data-route="${relCalc.route}"
              class="academic-card group block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-blue-500 transition-all"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${relCalc.categoryBadge}">
                  ${escapeHtml(relCalc.category)}
                </span>
                <span class="text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <h3 class="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 mb-1">
                ${escapeHtml(relCalc.shortTitle)}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                ${escapeHtml(relCalc.subtitle)}
              </p>
            </a>
          `;
          })
          .join("")}
      </div>
    </section>
    `
        : ""
    }
  `;

  // Wire up Direction Toggle
  const updateDirectionButtonsUI = () => {
    document.querySelectorAll(".dir-toggle-btn").forEach((btn) => {
      const dir = btn.getAttribute("data-dir");
      const active = dir === state.activeDirection;
      btn.className = `dir-toggle-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
        active
          ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm font-semibold"
          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      }`;
    });
    const inputEl = document.getElementById("calc-input");
    if (inputEl && calc.hasDirectionToggle) {
      inputEl.placeholder =
        state.activeDirection === "inverse" && calc.placeholderInverse
          ? calc.placeholderInverse
          : calc.placeholderDirect;
    }
  };

  updateDirectionButtonsUI();

  document.querySelectorAll(".dir-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeDirection = btn.getAttribute("data-dir");
      updateDirectionButtonsUI();
    });
  });

  // Wire up 4 Exam Preset Buttons
  document.querySelectorAll(".exam-preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-exam-idx"), 10);
      const preset = calc.examExamples[idx];
      if (!preset) return;
      if (preset.direction) {
        state.activeDirection = preset.direction;
        updateDirectionButtonsUI();
      }
      const inputEl = document.getElementById("calc-input");
      if (inputEl) {
        inputEl.value = preset.expr;
      }
      executeCalculation(calc, preset.expr, state.activeDirection);
    });
  });

  // Wire up Virtual Math Keyboard Toggle & Insertion
  const kbToggle = document.getElementById("toggle-keyboard-btn");
  const kbDrawer = document.getElementById("virtual-keyboard-drawer");
  const kbChevron = document.getElementById("keyboard-chevron");
  if (kbToggle && kbDrawer) {
    kbToggle.addEventListener("click", () => {
      state.keyboardOpen = !state.keyboardOpen;
      kbDrawer.classList.toggle("hidden", !state.keyboardOpen);
      if (kbChevron) kbChevron.classList.toggle("rotate-180", state.keyboardOpen);
    });
  }

  const clearBtn = document.getElementById("clear-input-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const inputEl = document.getElementById("calc-input");
      if (inputEl) {
        inputEl.value = "";
        inputEl.focus();
      }
    });
  }

  document.querySelectorAll(".math-key").forEach((keyBtn) => {
    keyBtn.addEventListener("click", () => {
      const idx = parseInt(keyBtn.getAttribute("data-key-idx"), 10);
      const keyDef = keyboardKeys[idx];
      const inputEl = document.getElementById("calc-input");
      if (!keyDef || !inputEl) return;

      const start = inputEl.selectionStart ?? inputEl.value.length;
      const end = inputEl.selectionEnd ?? inputEl.value.length;
      const val = inputEl.value;
      inputEl.value = val.slice(0, start) + keyDef.insert + val.slice(end);
      inputEl.focus();
      const nextCursor = start + keyDef.insert.length;
      inputEl.setSelectionRange(nextCursor, nextCursor);
    });
  });

  // Wire up Form Submit
  const form = document.getElementById("calc-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputEl = document.getElementById("calc-input");
      executeCalculation(calc, inputEl ? inputEl.value.trim() : "", state.activeDirection);
    });
  }

  // Run initial calculation so the page immediately displays a rich step-by-step derivation
  executeCalculation(calc, calc.defaultExpr, state.activeDirection);
}

/* ==========================================================================
   7. STEP-BY-STEP CALCULATION EXECUTOR & RENDERER
   ========================================================================== */
function runHybridEngine(calcId, expr, direction, lang = "es") {
  try {
    return solveWithHybridEngine(calcId, expr, direction, lang);
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function renderCalculationError(container, calc, errMsg, direction = "direct") {
  const ui = getUI();
  const expectedFormat =
    direction === "inverse" && calc.placeholderInverse
      ? calc.placeholderInverse
      : calc.placeholderDirect;
  container.innerHTML = `
    <div class="rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-6 text-rose-900 dark:text-rose-200">
      <div class="flex items-center gap-2 font-semibold text-sm mb-1">
        <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${escapeHtml(ui.errHeading)}</span>
      </div>
      <p class="text-xs font-mono mb-3">${escapeHtml(errMsg)}</p>
      <p class="text-xs text-rose-700 dark:text-rose-300">
        ${escapeHtml(ui.errFormatPrefix)} <strong>${escapeHtml(calc.shortTitle)}</strong>: <code>${escapeHtml(
    expectedFormat
  )}</code>. ${escapeHtml(ui.errFormatSuffix)}
      </p>
    </div>
  `;
}

async function executeCalculation(calc, expr, direction) {
  const container = document.getElementById("solution-container");
  if (!container) return;

  const ui = getUI();
  const runId = ++state.latestCalcRunId;

  if (!expr || !expr.trim()) {
    renderCalculationError(container, calc, ui.errEmpty, direction);
    return;
  }

  // 1. Instant 0ms evaluation via Hybrid Symbolic Engine (localized to state.lang)
  const hybridRes = runHybridEngine(calc.id, expr, direction, state.lang);
  if (hybridRes && hybridRes.ok) {
    const engineTag = state.workerReady ? ui.engineVerifiedTag : ui.engineInstantTag;
    renderSolutionSteps(calc, expr, hybridRes, engineTag, direction);
    return;
  }

  // 2. Not matched by Hybrid Engine -> Always delegate to Pyodide + SymPy Web Worker
  const loadingHeading = state.workerReady ? ui.loadingReadyHeading : ui.loadingInitHeading;
  const loadingSub = state.workerReady ? ui.loadingReadySub : ui.loadingInitSub;

  container.innerHTML = `
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3 animate-pulse">
        <span class="font-serif font-bold text-xl">&Sigma;</span>
      </div>
      <h3 class="font-semibold text-base text-slate-900 dark:text-white mb-1">
        ${escapeHtml(loadingHeading)}
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
        ${escapeHtml(loadingSub)}
      </p>
    </div>
  `;

  const timeoutMs = state.workerReady ? 15000 : 35000;
  const workerResp = await runWorkerCalculation(calc.id, expr, direction, timeoutMs, state.lang);
  if (runId !== state.latestCalcRunId) return;

  if (workerResp?.result?.ok) {
    const localizedWorkerRes = localizeStepsResult(workerResp.result, state.lang);
    renderSolutionSteps(
      calc,
      expr,
      localizedWorkerRes,
      workerResp.engine || "Pyodide + SymPy (WASM)",
      direction
    );
    return;
  }

  // 3. Only display red error message if SymPy also failed to parse or compute the expression
  const errMsg = workerResp?.result?.error || hybridRes?.error || ui.errParse;
  renderCalculationError(container, calc, errMsg, direction);
}

function renderSolutionSteps(calc, expr, solution, engineTag, direction = "direct") {
  const container = document.getElementById("solution-container");
  if (!container) return;

  const ui = getUI();

  window.gtag?.("event", "calculate_math", {
    tool: calc.id,
    lang: state.lang,
    direction,
    engine: engineTag
  });

  state.lastSolution = {
    title: calc.h1,
    expr,
    steps: solution.steps,
    final_latex: solution.final_latex,
    engineUsed: engineTag
  };

  container.innerHTML = `
    <div class="min-w-0 max-w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      <!-- Top Result Summary Banner & Action Toolbar -->
      <div class="p-4 sm:p-6 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 min-w-0">
        <div class="min-w-0 max-w-full">
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ${escapeHtml(ui.solutionCompleted)} (${solution.steps.length} ${escapeHtml(ui.stepsWord)})
            </span>
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              &bull; ${escapeHtml(engineTag)}
            </span>
          </div>
          <div class="text-sm sm:text-base font-medium text-slate-900 dark:text-white max-w-full overflow-x-auto">
            ${renderLatexToHtml(solution.final_latex, true)}
          </div>
        </div>

        <!-- Export & Copy LaTeX Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            id="copy-final-latex-btn"
            class="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>${escapeHtml(ui.copyFinalLatex)}</span>
          </button>

          <button
            type="button"
            id="export-steps-btn"
            class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>${escapeHtml(ui.exportStepsBtn)}</span>
          </button>

          <button
            type="button"
            id="toggle-json-view-btn"
            class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-mono transition-colors"
            title="JSON"
          >
            { JSON }
          </button>
        </div>
      </div>

      <!-- Structured Step-by-Step Pedagogical Breakdown -->
      <div class="p-5 sm:p-7 divide-y divide-slate-200/70 dark:divide-slate-800/80">
        ${solution.steps
          .map(
            (step, index) => `
          <article class="step-item py-5 first:pt-0 last:pb-0 animate-step min-w-0 max-w-full" style="animation-delay: ${index * 45}ms">
            <div class="flex items-start gap-3 sm:gap-3.5 min-w-0 max-w-full">
              <!-- Step Number Badge -->
              <div class="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                ${index + 1}
              </div>

              <div class="flex-1 min-w-0 max-w-full">
                <!-- 1. titulo_paso -->
                <div class="flex items-center justify-between gap-2 mb-1 min-w-0">
                  <h3 class="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white min-w-0">
                    ${escapeHtml(step.titulo_paso)}
                  </h3>
                  <button
                    type="button"
                    data-copy-step="${index}"
                    title="${escapeHtml(ui.copyStepLatex)}"
                    class="copy-step-btn shrink-0 text-[11px] font-mono text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-0.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                  >
                    ${escapeHtml(ui.copyStepLatex)}
                  </button>
                </div>

                <!-- 2. explicacion -->
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  ${escapeHtml(step.explicacion)}
                </p>

                <!-- 3. latex rendered with KaTeX -->
                <div class="max-w-full rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/90 px-3 sm:px-4 py-3 overflow-x-auto">
                  ${renderLatexToHtml(step.latex, true)}
                </div>
              </div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>

      <!-- Collapsible Raw JSON Structure Inspector (proves compliance with [{titulo_paso, explicacion, latex}]) -->
      <div id="json-inspector-panel" class="hidden border-t border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 p-5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-mono text-blue-400">${escapeHtml(ui.jsonStructureLabel)}</span>
          <button type="button" id="copy-json-btn" class="text-xs font-mono text-emerald-400 hover:underline">${escapeHtml(ui.copyJsonBtn)}</button>
        </div>
        <pre class="text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">${escapeHtml(
          JSON.stringify(solution.steps, null, 2)
        )}</pre>
      </div>
    </div>
  `;

  // Wire up Copy Final LaTeX
  const copyFinalBtn = document.getElementById("copy-final-latex-btn");
  if (copyFinalBtn) {
    copyFinalBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(solution.final_latex);
        showToast(ui.toastFinalCopied);
      } catch (err) {
        showToast(ui.toastCopyError, "error");
      }
    });
  }

  // Wire up Individual Step LaTeX copy
  document.querySelectorAll(".copy-step-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = parseInt(btn.getAttribute("data-copy-step"), 10);
      const st = solution.steps[idx];
      if (!st) return;
      try {
        await navigator.clipboard.writeText(st.latex);
        showToast(ui.toastStepCopied(idx + 1));
      } catch (err) {
        showToast(ui.toastCopyError, "error");
      }
    });
  });

  // Wire up Export Steps (.md / .tex file download & clipboard)
  const exportBtn = document.getElementById("export-steps-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportStepsDocument(calc, expr, solution);
    });
  }

  // Wire up JSON structure toggle
  const jsonToggleBtn = document.getElementById("toggle-json-view-btn");
  const jsonPanel = document.getElementById("json-inspector-panel");
  if (jsonToggleBtn && jsonPanel) {
    jsonToggleBtn.addEventListener("click", () => {
      jsonPanel.classList.toggle("hidden");
    });
  }

  const copyJsonBtn = document.getElementById("copy-json-btn");
  if (copyJsonBtn) {
    copyJsonBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(solution.steps, null, 2));
        showToast(ui.toastJsonCopied);
      } catch (err) {
        showToast(ui.toastCopyError, "error");
      }
    });
  }
}

function exportStepsDocument(calc, expr, solution) {
  const ui = getUI();
  const lines = [
    `% ============================================================================`,
    `% CalcWeb - Step-by-Step Academic Export (LaTeX / Markdown)`,
    `% Tool: ${calc.h1}`,
    `% Input: ${expr}`,
    `% ============================================================================`,
    ``,
    `# ${calc.h1}`,
    `**Input:** \`${expr}\``,
    ``,
    `## Final Result`,
    `$$${solution.final_latex}$$`,
    ``,
    `## Step-by-Step Solution`,
    ``
  ];

  solution.steps.forEach((s, idx) => {
    lines.push(`### Step ${idx + 1}: ${s.titulo_paso}`);
    lines.push(`${s.explicacion}`);
    lines.push(``);
    lines.push(`$$${s.latex}$$`);
    lines.push(``);
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `solution-${calc.id}-${state.lang}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(ui.toastExported);
}

/* ==========================================================================
   7B. VIEW 3: LEGAL & E-E-A-T PAGES (/sobre-nosotros, /en/about, /fr/a-propos, etc.)
   ========================================================================== */
function renderLegalView(legal) {
  const main = document.getElementById("app-main");
  if (!main) return;

  const ui = getUI();
  const routes = ROUTE_MAP;
  const homeRoute = routes.home[state.lang];

  main.innerHTML = `
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="${homeRoute}" data-route="${homeRoute}" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <span>${escapeHtml(ui.breadcrumbHome)}</span>
      </a>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(legal.shortTitle)}</span>
    </nav>

    <article class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm max-w-4xl">
      <header class="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <div class="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold mb-2">
          ${escapeHtml(ui.legalDocBadge)}
        </div>
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
            <h2 class="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              ${escapeHtml(sec.heading)}
            </h2>
            <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              ${escapeHtml(sec.body)}
            </p>
          </section>
        `
          )
          .join("")}
      </div>

      <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div class="flex flex-wrap gap-4">
          <a href="${routes.about[state.lang]}" data-route="${routes.about[state.lang]}" class="hover:text-blue-600 underline">${escapeHtml(ui.footerAbout)}</a>
          <a href="${routes.privacy[state.lang]}" data-route="${routes.privacy[state.lang]}" class="hover:text-blue-600 underline">${escapeHtml(ui.footerPrivacy)}</a>
          <a href="${routes.legal[state.lang]}" data-route="${routes.legal[state.lang]}" class="hover:text-blue-600 underline">${escapeHtml(ui.footerLegal)}</a>
        </div>
        <a href="${homeRoute}" data-route="${homeRoute}" class="px-4 py-2 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors">
          ${escapeHtml(ui.backToDashboard)}
        </a>
      </div>
    </article>
  `;
}

/* ==========================================================================
   8. GLOBAL LINK INTERCEPTION & BOOTSTRAP
   ========================================================================== */
function closeAllCategoryDropdowns(exceptKey = null) {
  document.querySelectorAll("[data-cat-menu]").forEach((menu) => {
    const key = menu.getAttribute("data-cat-menu");
    if (exceptKey && key === exceptKey) return;
    menu.classList.add("hidden");
  });
  document.querySelectorAll("[data-cat-toggle]").forEach((btn) => {
    const key = btn.getAttribute("data-cat-toggle");
    if (exceptKey && key === exceptKey) return;
    btn.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll("[data-cat-chevron]").forEach((chev) => {
    const key = chev.getAttribute("data-cat-chevron");
    if (exceptKey && key === exceptKey) return;
    chev.classList.remove("rotate-180");
  });
}

function closeNavMenus() {
  closeAllCategoryDropdowns(null);
  const mobileDrawer = document.getElementById("mobile-nav-drawer");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  if (mobileDrawer) mobileDrawer.classList.add("hidden");
  if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
}

function initRouterEvents() {
  document.addEventListener("click", (e) => {
    // 1. Desktop 3-Category Dropdown Toggle (opens one, closes others)
    const toggleBtn = e.target.closest("[data-cat-toggle]");
    if (toggleBtn) {
      const key = toggleBtn.getAttribute("data-cat-toggle");
      const menu = document.querySelector(`[data-cat-menu="${key}"]`);
      const chevron = document.querySelector(`[data-cat-chevron="${key}"]`);
      if (menu) {
        const isCurrentlyOpen = !menu.classList.contains("hidden");
        closeAllCategoryDropdowns(null);
        if (!isCurrentlyOpen) {
          menu.classList.remove("hidden");
          toggleBtn.setAttribute("aria-expanded", "true");
          if (chevron) chevron.classList.add("rotate-180");
        }
      }
      return;
    }

    // 2. Mobile hamburger menu toggle
    const mobileBtn = e.target.closest("#mobile-menu-btn");
    if (mobileBtn) {
      const mobileDrawer = document.getElementById("mobile-nav-drawer");
      if (mobileDrawer) {
        const isOpen = !mobileDrawer.classList.contains("hidden");
        mobileDrawer.classList.toggle("hidden", isOpen);
        mobileBtn.setAttribute("aria-expanded", String(!isOpen));
      }
      return;
    }

    // 3. Close desktop dropdowns when clicking outside any dropdown wrapper
    if (!e.target.closest("[data-cat-wrapper]")) {
      closeAllCategoryDropdowns(null);
    }

    // 4. Language switcher links (<a data-lang-switch>) use native full navigation
    if (e.target.closest("a[data-lang-switch]")) {
      return;
    }

    // 5. SPA internal route links
    const link = e.target.closest("a[data-route]");
    if (!link) return;
    e.preventDefault();
    closeNavMenus();
    const targetRoute = link.getAttribute("data-route");
    navigateTo(targetRoute, true);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNavMenus();
    }
  });

  window.addEventListener("popstate", () => {
    closeNavMenus();
    navigateTo(window.location.pathname, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  state.lang = detectLangFromPath(window.location.pathname);
  initTheme();
  initRouterEvents();
  initPyodideWorker();

  const startApp = () => {
    navigateTo(window.location.pathname, false);
  };

  if (window.katex) {
    startApp();
  } else {
    window.addEventListener("load", startApp, { once: true });
  }
});
