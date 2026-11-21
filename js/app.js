/**
 * CalcWeb Main Application Controller (SPA/SSG Clean Router + Pyodide Worker + Hybrid Engine + KaTeX UI)
 */

import { CALCULATOR_CATALOG, VIRTUAL_KEYBOARD_KEYS, LEGAL_PAGES } from "./catalog.js";
import {
  solveFourierHybrid,
  solveLaplaceHybrid,
  solveMatrixHybrid,
  solveZTransformHybrid,
  solveConvolutionHybrid,
  solveOdeHybrid,
  solveIntegralsHybrid,
  solveTaylorHybrid,
  solveGaussHybrid,
  solvePhasorsHybrid
} from "./hybrid-engine.js";

// Application State
const state = {
  currentRoute: "/",
  pyodideStatus: "loading", // 'loading' | 'ready' | 'error'
  workerReady: false,
  pyodideMessage: "Cargando motor simbólico...",
  worker: null,
  reqCounter: 0,
  pendingRequests: new Map(),
  lastSolution: null, // { steps: [], final_latex: "", expr: "", title: "", engineUsed: "" }
  activeDirection: "direct",
  keyboardOpen: false
};

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
  try {
    const worker = new Worker("/js/pyodide-worker.js");
    state.worker = worker;

    worker.addEventListener("message", (event) => {
      const data = event.data;
      if (data.type === "STATUS") {
        state.pyodideStatus = data.status;
        state.workerReady = data.status === "ready";
        state.pyodideMessage = data.message;
        updateEngineBadgeUI(data.status, data.message);
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
      updateEngineBadgeUI("error", "Motor Híbrido Local Activo");
    });

    // Check if previously cached in browser storage
    const wasCached = localStorage.getItem("calcweb_pyodide_cached") === "true";
    updateEngineBadgeUI(
      "loading",
      wasCached ? "Restaurando caché WASM (SymPy)..." : "Cargando motor simbólico..."
    );

    worker.postMessage({ action: "INIT" });
  } catch (err) {
    state.pyodideStatus = "error";
    updateEngineBadgeUI("error", "Motor Híbrido Local Activo");
  }
}

function updateEngineBadgeUI(status, text) {
  const btn = document.getElementById("engine-status-btn");
  const dot = document.getElementById("engine-status-dot");
  const label = document.getElementById("engine-status-text");
  if (!btn || !dot || !label) return;

  label.textContent = text;

  if (status === "ready") {
    btn.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-emerald-50/90 border-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800/80 dark:text-emerald-300";
    dot.className = "w-2 h-2 rounded-full bg-emerald-500";
  } else if (status === "loading") {
    btn.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-amber-50/90 border-amber-200 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800/80 dark:text-amber-300";
    dot.className = "w-2 h-2 rounded-full bg-amber-500 animate-ping";
  } else {
    btn.className =
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-950/60 dark:border-blue-800/80 dark:text-blue-300";
    dot.className = "w-2 h-2 rounded-full bg-blue-500";
  }
}

function runWorkerCalculation(tool, expr, direction, timeoutMs = 4000) {
  return new Promise((resolve) => {
    if (!state.worker || !state.workerReady) {
      resolve({ result: { ok: false, error: "Motor Pyodide aún cargando o no disponible" } });
      return;
    }
    const id = ++state.reqCounter;
    const timer = setTimeout(() => {
      if (state.pendingRequests.has(id)) {
        state.pendingRequests.delete(id);
        resolve({ result: { ok: false, error: "Tiempo de espera agotado (4s) en Web Worker" } });
      }
    }, timeoutMs);

    state.pendingRequests.set(id, (data) => {
      clearTimeout(timer);
      resolve(data);
    });

    state.worker.postMessage({
      id,
      action: "SOLVE",
      payload: { tool, expr, direction }
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
   4. ROUTER & SEO META MANAGEMENT (CLEAN URLS)
   ========================================================================== */
function normalizePathname(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (clean === "/index.html") return "/";
  return clean;
}

function navigateTo(route, pushState = true) {
  const normalized = normalizePathname(route);
  state.currentRoute = normalized;
  if (pushState) {
    window.history.pushState({ route: normalized }, "", normalized);
  }

  // Update active nav links
  document.querySelectorAll(".nav-link").forEach((el) => {
    const linkRoute = el.getAttribute("data-route");
    el.classList.toggle("active", linkRoute === normalized);
  });

  const calc = CALCULATOR_CATALOG.find((c) => c.route === normalized);
  const legal = LEGAL_PAGES.find((l) => l.route === normalized);

  if (calc) {
    updateDocumentSEO(calc.title, calc.metaDescription, calc.route, calc);
    renderCalculatorView(calc);
  } else if (legal) {
    updateDocumentSEO(legal.title, legal.metaDescription, legal.route, null);
    renderLegalView(legal);
  } else {
    updateDocumentSEO(
      "CalcWeb | Calculadoras Matemáticas y de Ingeniería Paso a Paso (100% Client-Side)",
      "Resuelve ejercicios de Transformada de Fourier, Transformada de Laplace, Transformada Z, Convolución, EDOs, Integrales, Series de Taylor, Diagonalización, Gauss-Jordan y Fasores AC paso a paso.",
      "/",
      null
    );
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

function updateDocumentSEO(title, description, routePath, calcObj = null) {
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

  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", title);
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute("content", description);

  // Dynamically update JSON-LD Structured Data (@graph with WebApplication + BreadcrumbList + FAQPage)
  let ldScript = document.getElementById("json-ld-seo");
  if (!ldScript) {
    ldScript = document.createElement("script");
    ldScript.id = "json-ld-seo";
    ldScript.type = "application/ld+json";
    document.head.appendChild(ldScript);
  }

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

  if (calcObj) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: `${baseOrigin}/`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: calcObj.category,
          item: `${baseOrigin}/`
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

  const categories = ["Todas", "Señales y Sistemas", "Cálculo y Ecuaciones Diferenciales", "Álgebra Lineal y Circuitos"];

  main.innerHTML = `
    <!-- Hero Academic Header -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 mb-10 shadow-sm">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <span>Arquitectura 0€ Servidor &bull; WebAssembly Pyodide + SymPy + KaTeX</span>
        </div>
        <h1 class="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
          Calculadoras Matemáticas y de Ingeniería <span class="text-blue-700 dark:text-blue-400">Paso a Paso</span>
        </h1>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Resolución simbólica rigurosa con justificación teórica en cada transformación. Todo el cálculo se ejecuta <strong>100% en tu navegador</strong> mediante un Web Worker dedicado sin latencia de red ni servidores externos.
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
            placeholder="Buscar calculadora o técnica (ej. Fourier, fracciones simples, autovalores, Dirac, Laplace...)"
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
            data-category="${cat}"
            class="cat-pill px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
              idx === 0
                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800"
            }"
          >
            ${cat}
          </button>
        `
          )
          .join("")}
      </div>
      <span id="catalog-count" class="text-xs font-mono text-slate-500 dark:text-slate-400">
        ${CALCULATOR_CATALOG.length} módulos simbólicos disponibles
      </span>
    </section>

    <!-- Calculators Grid -->
    <section id="calculators-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
      ${CALCULATOR_CATALOG.map((calc) => renderCalculatorCardHTML(calc)).join("")}
    </section>

    <!-- Architecture & Pedagogical Guarantees Section -->
    <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
      <h2 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Arquitectura Simbólica Client-Side y Estándar Pedagógico
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold mb-1">1. Motor Dual Híbrido + WASM</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">Pyodide + SymPy en Web Worker</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Resolución instantánea en 0 ms mediante el motor algebraico híbrido mientras el Web Worker inicializa SymPy en segundo plano con caché persistente.
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold mb-1">2. Rigor Universitario</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">Desglose Paso a Paso Justificado</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Cada paso incluye la regla aplicada (<code>titulo_paso</code>), la justificación teórica (<code>explicacion</code>) y la expresión en tipografía KaTeX (<code>latex</code>).
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800">
          <div class="text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-semibold mb-1">3. Flujo Académico</div>
          <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">Exportación LaTeX y Ejemplos de Examen</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Incluye 4 ejercicios reales de examen por asignatura con ejecución en un clic y exportación directa a código LaTeX para informes o TFG.
          </p>
        </div>
      </div>
    </section>
  `;

  // Wire up instant search & category filter
  let activeCategory = "Todas";
  const searchInput = document.getElementById("dashboard-search");
  const grid = document.getElementById("calculators-grid");
  const countEl = document.getElementById("catalog-count");

  function filterCards() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const filtered = CALCULATOR_CATALOG.filter((calc) => {
      const matchCat = activeCategory === "Todas" || calc.category === activeCategory;
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
        <div class="col-span-full text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <p class="text-sm text-slate-500 dark:text-slate-400">No se encontraron calculadoras para "<strong>${escapeHtml(q)}</strong>".</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map((c) => renderCalculatorCardHTML(c)).join("");
    }
    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? "módulo disponible" : "módulos disponibles"}`;
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

function renderCalculatorCardHTML(calc) {
  return `
    <article class="academic-card flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-blue-500/60 dark:hover:border-blue-500/60">
      <div>
        <div class="flex items-center justify-between gap-2 mb-4">
          <span class="px-2.5 py-1 rounded-md text-xs font-semibold border ${calc.categoryBadge}">
            ${calc.category}
          </span>
          <span class="font-mono text-[11px] text-slate-400">${calc.route}</span>
        </div>

        <h2 class="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
          <a href="${calc.route}" data-route="${calc.route}" class="hover:text-blue-700 dark:hover:text-blue-400 focus:outline-none">
            ${calc.shortTitle}
          </a>
        </h2>

        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          ${calc.subtitle}
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
              ${ex.label}
            </span>
          `
            )
            .join("")}
          <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]">+2 ejemplos</span>
        </div>

        <a
          href="${calc.route}"
          data-route="${calc.route}"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm"
        >
          <span>Abrir Calculadora Paso a Paso</span>
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

  state.activeDirection = calc.defaultDirection || "direct";

  main.innerHTML = `
    <!-- Breadcrumb Navigation -->
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="/" data-route="/" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span>Inicio</span>
      </a>
      <span>/</span>
      <span class="px-2 py-0.5 rounded text-[11px] font-medium border ${calc.categoryBadge}">${calc.category}</span>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${calc.shortTitle}</span>
    </nav>

    <!-- Calculator SEO Header (H1 + Subtitle) -->
    <header class="mb-7">
      <h1 class="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
        ${calc.h1}
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
        ${calc.subtitle}
      </p>
    </header>

    <!-- Main Workbench Card -->
    <section class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm mb-8">
      
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
            ${calc.directLabel}
          </button>
          <button
            type="button"
            id="dir-btn-inverse"
            data-dir="inverse"
            class="dir-toggle-btn px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          >
            ${calc.inverseLabel}
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
            Ejemplos de Examen (Clic para resolver al instante)
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          ${calc.examExamples
            .map(
              (ex, idx) => `
            <button
              type="button"
              data-exam-idx="${idx}"
              class="exam-preset-btn group text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 hover:bg-blue-50/60 dark:bg-slate-950/60 dark:hover:bg-blue-950/30 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
            >
              <div class="flex items-center justify-between w-full mb-1.5">
                <span class="text-[11px] font-semibold text-blue-700 dark:text-blue-400">${ex.badge}</span>
                <span class="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">${ex.label} &rarr;</span>
              </div>
              <div class="text-xs overflow-x-auto py-0.5 text-slate-800 dark:text-slate-200">
                ${renderLatexToHtml(ex.latexLabel, false)}
              </div>
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- Expression Input Form & Collapsible Virtual Math Keyboard Toggle -->
      <form id="calc-form" class="space-y-3">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div class="relative flex-1">
            <input
              id="calc-input"
              type="text"
              value="${escapeHtml(calc.defaultExpr)}"
              placeholder="${escapeHtml(
                state.activeDirection === "inverse" && calc.placeholderInverse
                  ? calc.placeholderInverse
                  : calc.placeholderDirect
              )}"
              class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          <div class="flex items-center gap-2">
            <!-- Toggle Collapsible Virtual Math Keyboard -->
            <button
              type="button"
              id="toggle-keyboard-btn"
              aria-expanded="${state.keyboardOpen}"
              title="Desplegar teclado matemático virtual"
              class="px-3.5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shrink-0"
            >
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <span>Teclado Matemático</span>
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
              <span>Resolver Paso a Paso</span>
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
              Haz clic en cualquier símbolo para insertarlo en la posición del cursor:
            </span>
            <button type="button" id="clear-input-btn" class="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-medium">
              Limpiar entrada
            </button>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
            ${VIRTUAL_KEYBOARD_KEYS.map(
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
        <span>Formulario Universitario y Resumen Teórico</span>
      </div>
      <h2 id="guide-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">
        ${calc.guide.title}
      </h2>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        ${calc.guide.intro}
      </p>

      <!-- Formulas Table / Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        ${calc.guide.formulas
          .map(
            (f) => `
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 class="font-semibold text-sm text-slate-900 dark:text-white mb-2">${f.name}</h3>
              <div class="overflow-x-auto py-1">
                ${renderLatexToHtml(f.latex, true)}
              </div>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
              ${f.note}
            </p>
          </div>
        `
          )
          .join("")}
      </div>

      <!-- Exam Tips Box -->
      <div class="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 p-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2">
          Consejos Clave para Exámenes de Ingeniería
        </h3>
        <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
          ${calc.guide.tips.map((tip) => `<li>${tip}</li>`).join("")}
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
        <span>Dudas Frecuentes de Examen (FAQ)</span>
      </div>
      <h2 id="faq-heading" class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5">
        Preguntas Frecuentes sobre ${calc.shortTitle}
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
        Calculadoras Relacionadas de ${calc.category}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${calc.relatedRoutes
          .map((rRoute) => {
            const relCalc = CALCULATOR_CATALOG.find((c) => c.route === rRoute);
            if (!relCalc) return "";
            return `
            <a
              href="${relCalc.route}"
              data-route="${relCalc.route}"
              class="academic-card group block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-blue-500 transition-all"
            >
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${relCalc.categoryBadge}">
                  ${relCalc.category}
                </span>
                <span class="text-xs text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </div>
              <h3 class="font-serif font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 mb-1">
                ${relCalc.shortTitle}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                ${relCalc.subtitle}
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
      const keyDef = VIRTUAL_KEYBOARD_KEYS[idx];
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
function runHybridEngine(calcId, expr, direction) {
  try {
    if (calcId === "fourier") return solveFourierHybrid(expr, direction);
    if (calcId === "laplace") return solveLaplaceHybrid(expr, direction);
    if (calcId === "matrix") return solveMatrixHybrid(expr);
    if (calcId === "ztransform") return solveZTransformHybrid(expr, direction);
    if (calcId === "convolution") return solveConvolutionHybrid(expr, direction);
    if (calcId === "ode") return solveOdeHybrid(expr);
    if (calcId === "integrals") return solveIntegralsHybrid(expr, direction);
    if (calcId === "taylor") return solveTaylorHybrid(expr);
    if (calcId === "gauss") return solveGaussHybrid(expr);
    if (calcId === "phasors") return solvePhasorsHybrid(expr, direction);
  } catch (err) {
    return { ok: false, error: err.message };
  }
  return null;
}

function renderCalculationError(container, calc, errMsg) {
  container.innerHTML = `
    <div class="rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-6 text-rose-900 dark:text-rose-200">
      <div class="flex items-center gap-2 font-semibold text-sm mb-1">
        <svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>No se pudo resolver la expresión introducida</span>
      </div>
      <p class="text-xs font-mono mb-3">${escapeHtml(errMsg)}</p>
      <p class="text-xs text-rose-700 dark:text-rose-300">
        Formato esperado en <strong>${escapeHtml(calc.shortTitle)}</strong>: <code>${escapeHtml(
    calc.placeholderDirect
  )}</code>. Pulsa cualquiera de los <strong>4 Ejemplos de Examen</strong> superiores para ver una entrada válida.
      </p>
    </div>
  `;
}

async function executeCalculation(calc, expr, direction) {
  const container = document.getElementById("solution-container");
  if (!container) return;

  if (!expr || !expr.trim()) {
    renderCalculationError(container, calc, "El campo de entrada está vacío. Introduce una expresión matemática.");
    return;
  }

  // 1. Instant 0ms evaluation via Hybrid Symbolic Engine
  const hybridRes = runHybridEngine(calc.id, expr, direction);
  if (hybridRes && hybridRes.ok) {
    const engineTag = state.workerReady
      ? "SymPy CAS + Motor Híbrido Verificado (0 ms)"
      : "Motor Simbólico Híbrido Instantáneo (0 ms Client-Side)";
    renderSolutionSteps(calc, expr, hybridRes, engineTag);
    return;
  }

  // 2. If Worker is still loading or errored, do not block UI: report clear feedback or hybrid error
  if (!state.workerReady) {
    const reason =
      hybridRes?.error ||
      (state.pyodideStatus === "loading"
        ? "El motor simbólico avanzado (Pyodide + SymPy) aún se está inicializando en segundo plano. Mientras termina la carga inicial, utiliza cualquiera de los 4 Ejemplos de Examen o expresiones estándar soportadas al instante (0 ms)."
        : "Expresión fuera del formato estándar del motor rápido.");
    renderCalculationError(container, calc, reason);
    return;
  }

  // 3. Worker is ready (workerReady === true): run with a strict 4-second timeout and automatic fallback
  container.innerHTML = `
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-3 animate-pulse">
        <span class="font-serif font-bold text-xl">&Sigma;</span>
      </div>
      <h3 class="font-semibold text-base text-slate-900 dark:text-white mb-1">
        Ejecutando resolución simbólica en Web Worker (Pyodide + SymPy)...
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Calculando derivación algebraica y generando pasos en formato LaTeX (timeout máx. 4s).
      </p>
    </div>
  `;

  const workerResp = await runWorkerCalculation(calc.id, expr, direction, 4000);
  if (workerResp?.result?.ok) {
    renderSolutionSteps(calc, expr, workerResp.result, workerResp.engine || "Pyodide + SymPy (WASM)");
    return;
  }

  // 4. Fallback to hybrid engine if worker timed out or failed
  if (hybridRes && hybridRes.ok) {
    renderSolutionSteps(calc, expr, hybridRes, "Motor Simbólico Híbrido (Fallback Instantáneo)");
    return;
  }

  const errMsg =
    workerResp?.result?.error ||
    hybridRes?.error ||
    "No se pudo interpretar la expresión simbólica. Verifica los paréntesis y operadores.";
  renderCalculationError(container, calc, errMsg);
}

function renderSolutionSteps(calc, expr, solution, engineTag) {
  const container = document.getElementById("solution-container");
  if (!container) return;

  state.lastSolution = {
    title: calc.h1,
    expr,
    steps: solution.steps,
    final_latex: solution.final_latex,
    engineUsed: engineTag
  };

  container.innerHTML = `
    <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      <!-- Top Result Summary Banner & Action Toolbar -->
      <div class="p-5 sm:p-6 bg-slate-50/90 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Resolución Completada (${solution.steps.length} pasos)
            </span>
            <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              &bull; ${escapeHtml(engineTag)}
            </span>
          </div>
          <div class="text-sm sm:text-base font-medium text-slate-900 dark:text-white overflow-x-auto">
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
            <span>Copiar resultado en LaTeX</span>
          </button>

          <button
            type="button"
            id="export-steps-btn"
            class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Exportar pasos (.tex / .md)</span>
          </button>

          <button
            type="button"
            id="toggle-json-view-btn"
            class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-mono transition-colors"
            title="Inspeccionar estructura JSON de los pasos"
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
          <article class="step-item py-5 first:pt-0 last:pb-0 animate-step" style="animation-delay: ${index * 45}ms">
            <div class="flex items-start gap-3.5">
              <!-- Step Number Badge -->
              <div class="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                ${index + 1}
              </div>

              <div class="flex-1 min-w-0">
                <!-- 1. titulo_paso -->
                <div class="flex items-center justify-between gap-2 mb-1">
                  <h3 class="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    ${escapeHtml(step.titulo_paso)}
                  </h3>
                  <button
                    type="button"
                    data-copy-step="${index}"
                    title="Copiar LaTeX de este paso"
                    class="copy-step-btn text-[11px] font-mono text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-0.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                  >
                    Copiar LaTeX
                  </button>
                </div>

                <!-- 2. explicacion -->
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  ${escapeHtml(step.explicacion)}
                </p>

                <!-- 3. latex rendered with KaTeX -->
                <div class="rounded-xl bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/90 px-4 py-3 overflow-x-auto">
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
          <span class="text-xs font-mono text-blue-400">Estructura JSON devuelta por el motor simbólico:</span>
          <button type="button" id="copy-json-btn" class="text-xs font-mono text-emerald-400 hover:underline">Copiar JSON</button>
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
      await navigator.clipboard.writeText(solution.final_latex);
      showToast("Resultado final copiado en formato LaTeX");
    });
  }

  // Wire up Individual Step LaTeX copy
  document.querySelectorAll(".copy-step-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = parseInt(btn.getAttribute("data-copy-step"), 10);
      const st = solution.steps[idx];
      if (!st) return;
      await navigator.clipboard.writeText(st.latex);
      showToast(`LaTeX del Paso ${idx + 1} copiado al portapapeles`);
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
      await navigator.clipboard.writeText(JSON.stringify(solution.steps, null, 2));
      showToast("Array JSON de pasos copiado al portapapeles");
    });
  }
}

function exportStepsDocument(calc, expr, solution) {
  const lines = [
    `% ============================================================================`,
    `% CalcWeb - Exportación Académica Paso a Paso (LaTeX / Markdown)`,
    `% Herramienta: ${calc.h1}`,
    `% Entrada: ${expr}`,
    `% ============================================================================`,
    ``,
    `# ${calc.h1}`,
    `**Entrada:** \`${expr}\``,
    ``,
    `## Resultado Final`,
    `$$${solution.final_latex}$$`,
    ``,
    `## Resolución Paso a Paso`,
    ``
  ];

  solution.steps.forEach((s, idx) => {
    lines.push(`### Paso ${idx + 1}: ${s.titulo_paso}`);
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
  a.download = `solucion-${calc.id}-paso-a-paso.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Documento con todos los pasos en LaTeX exportado (.md)");
}

/* ==========================================================================
   7B. VIEW 3: LEGAL & E-E-A-T PAGES (/sobre-nosotros, /privacidad, /aviso-legal)
   ========================================================================== */
function renderLegalView(legal) {
  const main = document.getElementById("app-main");
  if (!main) return;

  main.innerHTML = `
    <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <a href="/" data-route="/" class="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
        <span>Inicio</span>
      </a>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 font-medium">${escapeHtml(legal.shortTitle)}</span>
    </nav>

    <article class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm max-w-4xl">
      <header class="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <div class="text-xs font-mono uppercase tracking-wider text-blue-700 dark:text-blue-400 font-semibold mb-2">
          Documentación Institucional y Transparencia (E-E-A-T)
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
          <a href="/sobre-nosotros" data-route="/sobre-nosotros" class="hover:text-blue-600 underline">Sobre Nosotros</a>
          <a href="/privacidad" data-route="/privacidad" class="hover:text-blue-600 underline">Política de Privacidad y Cookies</a>
          <a href="/aviso-legal" data-route="/aviso-legal" class="hover:text-blue-600 underline">Aviso Legal</a>
        </div>
        <a href="/" data-route="/" class="px-4 py-2 rounded-xl bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors">
          Volver al Panel de Calculadoras
        </a>
      </div>
    </article>
  `;
}

/* ==========================================================================
   8. GLOBAL LINK INTERCEPTION & BOOTSTRAP
   ========================================================================== */
function initRouterEvents() {
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-route]");
    if (!link) return;
    e.preventDefault();
    const targetRoute = link.getAttribute("data-route");
    navigateTo(targetRoute, true);
  });

  window.addEventListener("popstate", () => {
    navigateTo(window.location.pathname, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRouterEvents();
  initPyodideWorker();

  // Wait briefly if KaTeX defer script hasn't finished yet
  const startApp = () => {
    navigateTo(window.location.pathname, false);
  };

  if (window.katex) {
    startApp();
  } else {
    window.addEventListener("load", startApp, { once: true });
  }
});
