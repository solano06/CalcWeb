/**
 * CalcWeb Interactive 2D HTML5 Canvas Plotter (100% Native, 0 External Dependencies)
 * Supports HiDPI (devicePixelRatio), ResizeObserver, Light/Dark mode auto-redraw,
 * asymptote clipping, crosshair + coordinate tooltip, Dirac impulses, shaded areas,
 * interactive frame sliders (Taylor/Fourier), and Magnitude/Phase view toggles.
 */

import { UI_STRINGS } from "./i18n.js";

function getThemePalette() {
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    return {
      bg: "#020617",
      grid: "rgba(148, 163, 184, 0.12)",
      axis: "rgba(148, 163, 184, 0.48)",
      tickText: "#94a3b8",
      labelText: "#cbd5e1",
      primary: "#60a5fa",
      secondary: "#94a3b8",
      accent: "#34d399",
      impulse: "#f59e0b",
      shade: "rgba(59, 130, 246, 0.22)",
      crosshair: "rgba(148, 163, 184, 0.45)",
      tooltipBg: "rgba(15, 23, 42, 0.94)",
      tooltipBorder: "#334155",
      tooltipText: "#f8fafc"
    };
  }
  return {
    bg: "#ffffff",
    grid: "rgba(15, 23, 42, 0.08)",
    axis: "rgba(15, 23, 42, 0.45)",
    tickText: "#64748b",
    labelText: "#334155",
    primary: "#1d4ed8",
    secondary: "#64748b",
    accent: "#059669",
    impulse: "#d97706",
    shade: "rgba(37, 99, 235, 0.16)",
    crosshair: "rgba(30, 41, 59, 0.35)",
    tooltipBg: "rgba(255, 255, 255, 0.96)",
    tooltipBorder: "#cbd5e1",
    tooltipText: "#0f172a"
  };
}

function niceStep(range, targetTicks = 6) {
  if (!Number.isFinite(range) || range <= 0) return 1;
  const rough = range / targetTicks;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
  const frac = rough / pow10;
  let niceFrac = 1;
  if (frac <= 1.5) niceFrac = 1;
  else if (frac <= 3) niceFrac = 2;
  else if (frac <= 7) niceFrac = 5;
  else niceFrac = 10;
  return niceFrac * pow10;
}

function fmtTick(val) {
  if (Math.abs(val) < 1e-9) return "0";
  if (Math.abs(val) >= 1000 || (Math.abs(val) > 0 && Math.abs(val) < 0.01)) {
    return val.toExponential(1);
  }
  return Number(val.toFixed(3)).toString();
}

function fmtLogFreq(freq) {
  if (freq >= 1000) return `${Number((freq / 1000).toFixed(2))}k`;
  if (freq >= 1) return Number(freq.toFixed(2)).toString();
  return Number(freq.toFixed(3)).toString();
}

function computeYRange(seriesList, impulses = []) {
  let yMin = Infinity;
  let yMax = -Infinity;
  const validVals = [];

  for (const s of seriesList) {
    for (const pt of s.points || []) {
      const y = pt[1];
      if (Number.isFinite(y) && Math.abs(y) < 1e6) {
        validVals.push(y);
      }
    }
  }
  for (const imp of impulses || []) {
    if (Number.isFinite(imp.amp)) {
      validVals.push(0, imp.amp);
    }
  }

  if (validVals.length === 0) return [-1, 1];

  // Robust outlier clipping at 2nd/98th percentile if huge asymptotes exist
  const sorted = [...validVals].sort((a, b) => a - b);
  const loIdx = Math.floor(sorted.length * 0.01);
  const hiIdx = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.99));
  const rawMin = sorted[0];
  const rawMax = sorted[sorted.length - 1];
  const pMin = sorted[loIdx];
  const pMax = sorted[hiIdx];

  if (rawMax - rawMin > 10 * Math.max(1e-6, pMax - pMin)) {
    yMin = pMin;
    yMax = pMax;
  } else {
    yMin = rawMin;
    yMax = rawMax;
  }

  if (Math.abs(yMax - yMin) < 1e-6) {
    yMin -= 1;
    yMax += 1;
  }
  const pad = (yMax - yMin) * 0.12;
  yMin -= pad;
  yMax += pad;
  if (yMin > 0 && yMin < (yMax - yMin) * 0.25) yMin = 0;
  if (yMax < 0 && Math.abs(yMax) < (yMax - yMin) * 0.25) yMax = 0;
  return [yMin, yMax];
}

function escapeText(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderMathPlot(container, plotData, lang = "es") {
  if (!container || !plotData) return;
  const hasSeries = Array.isArray(plotData.series) && plotData.series.some((s) => (s.points || []).length > 0);
  const hasImpulses = Array.isArray(plotData.impulses) && plotData.impulses.length > 0;
  if (!hasSeries && !hasImpulses) return;

  const ui = UI_STRINGS[lang] || UI_STRINGS.es;
  let activeAlt = false;
  let activeSliderVal = plotData.slider ? plotData.slider.initial : null;
  let pointer = null; // { px, py } in CSS pixels

  const slider = plotData.slider || null;
  const altView = plotData.altView || null;

  container.innerHTML = `
    <div class="rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            ${escapeText(ui.plotSectionTitle || "2D Plot")}
          </span>
          <h3 class="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
            ${escapeText(plotData.title || "")}
          </h3>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          ${
            altView
              ? `
            <div class="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 text-[11px] font-medium">
              <button type="button" data-plot-alt="a" class="plot-alt-btn px-2.5 py-1 rounded-md bg-blue-700 text-white transition-colors">${escapeText(
                altView.toggleLabelA
              )}</button>
              <button type="button" data-plot-alt="b" class="plot-alt-btn px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">${escapeText(
                altView.toggleLabelB
              )}</button>
            </div>
          `
              : ""
          }
          <button
            type="button"
            class="plot-download-btn px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>${escapeText(ui.plotDownloadPng || "PNG")}</span>
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="plot-legend flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-2.5"></div>

      ${
        slider
          ? `
        <div class="flex flex-wrap items-center gap-3 mb-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <label class="text-xs font-medium text-slate-700 dark:text-slate-200 shrink-0">
            ${escapeText(slider.label)}: <span class="plot-slider-val font-mono font-bold text-blue-700 dark:text-blue-400">${slider.initial}</span>
          </label>
          <input
            type="range"
            min="${slider.min}"
            max="${slider.max}"
            value="${slider.initial}"
            step="1"
            class="plot-slider-input flex-1 min-w-[140px] accent-blue-600 cursor-pointer"
          />
        </div>
      `
          : ""
      }

      <div class="relative w-full h-[270px] sm:h-[320px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <canvas class="plot-canvas block w-full h-full touch-none cursor-crosshair"></canvas>
      </div>
    </div>
  `;

  const canvas = container.querySelector(".plot-canvas");
  const legendEl = container.querySelector(".plot-legend");
  const downloadBtn = container.querySelector(".plot-download-btn");
  const sliderInput = container.querySelector(".plot-slider-input");
  const sliderValEl = container.querySelector(".plot-slider-val");
  const altBtns = container.querySelectorAll(".plot-alt-btn");

  function getActiveSeriesAndLabels() {
    if (activeAlt && altView) {
      return {
        series: altView.seriesB || [],
        impulses: [],
        yLabel: altView.yLabelB || plotData.yLabel
      };
    }
    const baseSeries = (plotData.series || []).map((s) => ({ ...s }));
    if (slider && activeSliderVal !== null && slider.frames && slider.frames[activeSliderVal]) {
      const frame = slider.frames[activeSliderVal];
      const primaryIdx = baseSeries.findIndex((s) => s.style === "primary");
      if (primaryIdx >= 0) {
        baseSeries[primaryIdx] = {
          ...baseSeries[primaryIdx],
          label: frame.label || baseSeries[primaryIdx].label,
          points: frame.points || []
        };
      } else {
        baseSeries.push({
          label: frame.label || "",
          points: frame.points || [],
          style: "primary"
        });
      }
    }
    return {
      series: baseSeries,
      impulses: plotData.impulses || [],
      yLabel: plotData.yLabel
    };
  }

  function renderLegend(series, impulses, palette) {
    if (!legendEl) return;
    const items = [];
    for (const s of series) {
      const color =
        s.style === "secondary" ? palette.secondary : s.style === "accent" ? palette.accent : palette.primary;
      items.push(`
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block w-4 h-0.5 ${s.dashed ? "border-t-2 border-dashed" : ""}" style="${
            s.dashed ? `border-color:${color}` : `background-color:${color}`
          }"></span>
          <span>${escapeText(s.label)}</span>
        </span>
      `);
    }
    if (impulses && impulses.length > 0) {
      items.push(`
        <span class="inline-flex items-center gap-1.5">
          <span class="inline-block w-3 h-3 rounded-full" style="background-color:${palette.impulse}"></span>
          <span>${escapeText(ui.plotImpulseLabel || "δ(ω)")}</span>
        </span>
      `);
    }
    legendEl.innerHTML = items.join("");
  }

  function draw() {
    if (!canvas || !canvas.isConnected) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette = getThemePalette();
    const { series, impulses, yLabel } = getActiveSeriesAndLabels();
    renderLegend(series, impulses, palette);

    // Clear background
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, w, h);

    const padL = 52;
    const padR = 18;
    const padT = 16;
    const padB = 34;
    const plotW = Math.max(20, w - padL - padR);
    const plotH = Math.max(20, h - padT - padB);

    const [xMin, xMax] = plotData.xRange || [-5, 5];
    const [yMin, yMax] = computeYRange(series, impulses);
    const xSpan = Math.max(1e-9, xMax - xMin);
    const ySpan = Math.max(1e-9, yMax - yMin);

    const toPxX = (x) => padL + ((x - xMin) / xSpan) * plotW;
    const toPxY = (y) => padT + (1 - (y - yMin) / ySpan) * plotH;
    const toMathX = (px) => xMin + ((px - padL) / plotW) * xSpan;

    // Grid & Ticks
    const isLogX = plotData.xScale === "log10";
    const xStep = isLogX ? 1 : niceStep(xSpan, 7);
    const yStep = niceStep(ySpan, 5);
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.lineWidth = 1;

    // Vertical grid lines
    const xStart = Math.ceil(xMin / xStep) * xStep;
    for (let x = xStart; x <= xMax + xStep * 1e-6; x += xStep) {
      const px = toPxX(x);
      ctx.strokeStyle = palette.grid;
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = palette.tickText;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(isLogX ? fmtLogFreq(Math.pow(10, x)) : fmtTick(x), px, padT + plotH + 6);
    }

    // Horizontal grid lines
    const yStart = Math.ceil(yMin / yStep) * yStep;
    for (let y = yStart; y <= yMax + yStep * 1e-6; y += yStep) {
      const py = toPxY(y);
      ctx.strokeStyle = palette.grid;
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(padL + plotW, py);
      ctx.stroke();

      ctx.fillStyle = palette.tickText;
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(fmtTick(y), padL - 7, py);
    }

    // Main Axes (x=0, y=0)
    ctx.strokeStyle = palette.axis;
    ctx.lineWidth = 1.25;
    if (yMin <= 0 && yMax >= 0) {
      const py0 = toPxY(0);
      ctx.beginPath();
      ctx.moveTo(padL, py0);
      ctx.lineTo(padL + plotW, py0);
      ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      const px0 = toPxX(0);
      ctx.beginPath();
      ctx.moveTo(px0, padT);
      ctx.lineTo(px0, padT + plotH);
      ctx.stroke();
    }

    // Axis Labels
    ctx.fillStyle = palette.labelText;
    ctx.font = "600 11px 'Inter', sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(plotData.xLabel || "x", padL + plotW, h - 3);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(yLabel || "y", padL + 6, 4);

    // Clip to plot area
    ctx.save();
    ctx.beginPath();
    ctx.rect(padL, padT, plotW, plotH);
    ctx.clip();

    // Shaded Area (e.g. Definite Integral)
    if (!activeAlt && plotData.shadedArea) {
      const { xMin: sMin, xMax: sMax, seriesIndex = 0 } = plotData.shadedArea;
      const targetSeries = series[seriesIndex];
      if (targetSeries && Array.isArray(targetSeries.points)) {
        const sub = targetSeries.points.filter(
          (pt) => Number.isFinite(pt[1]) && pt[0] >= sMin - 1e-6 && pt[0] <= sMax + 1e-6
        );
        if (sub.length >= 2) {
          const baseY = toPxY(0);
          ctx.fillStyle = palette.shade;
          ctx.beginPath();
          ctx.moveTo(toPxX(sub[0][0]), baseY);
          for (const [vx, vy] of sub) {
            ctx.lineTo(toPxX(vx), toPxY(vy));
          }
          ctx.lineTo(toPxX(sub[sub.length - 1][0]), baseY);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Draw Continuous Series (secondary first, primary on top)
    const ordered = [...series].sort((a, b) => (a.style === "primary" ? 1 : -1) - (b.style === "primary" ? 1 : -1));
    for (const s of ordered) {
      const pts = s.points || [];
      if (pts.length < 2) continue;
      const color =
        s.style === "secondary" ? palette.secondary : s.style === "accent" ? palette.accent : palette.primary;
      ctx.strokeStyle = color;
      ctx.lineWidth = s.style === "primary" ? 2.4 : 1.75;
      ctx.setLineDash(s.dashed ? [6, 4] : []);

      ctx.beginPath();
      let penDown = false;
      let prevY = null;
      for (const [vx, vy] of pts) {
        if (!Number.isFinite(vx) || !Number.isFinite(vy) || Math.abs(vy) > 1e6) {
          penDown = false;
          prevY = null;
          continue;
        }
        // Break line on vertical asymptote jumps
        if (prevY !== null && Math.abs(vy - prevY) > ySpan * 0.85) {
          penDown = false;
        }
        const px = toPxX(vx);
        const py = toPxY(vy);
        if (!penDown) {
          ctx.moveTo(px, py);
          penDown = true;
        } else {
          ctx.lineTo(px, py);
        }
        prevY = vy;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Dirac Impulses
    for (const imp of impulses || []) {
      if (!Number.isFinite(imp.x) || !Number.isFinite(imp.amp)) continue;
      const px = toPxX(imp.x);
      const py0 = toPxY(0);
      const py1 = toPxY(imp.amp);
      const dir = py1 < py0 ? 1 : -1;

      ctx.strokeStyle = palette.impulse;
      ctx.fillStyle = palette.impulse;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(px, py0);
      ctx.lineTo(px, py1);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(px, py1);
      ctx.lineTo(px - 5, py1 + dir * 9);
      ctx.lineTo(px + 5, py1 + dir * 9);
      ctx.closePath();
      ctx.fill();

      if (imp.label) {
        ctx.font = "600 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = dir > 0 ? "bottom" : "top";
        ctx.fillText(imp.label, px, py1 - dir * 4);
      }
    }

    ctx.restore();

    // Crosshair & Floating Coordinate Tooltip
    if (pointer && pointer.px >= padL && pointer.px <= padL + plotW && pointer.py >= padT && pointer.py <= padT + plotH) {
      const mx = toMathX(pointer.px);
      // Snap to nearest point on primary series if available
      const primary = series.find((s) => s.style === "primary") || series[0];
      let snapX = mx;
      let snapY = null;
      if (primary && Array.isArray(primary.points) && primary.points.length > 0) {
        let bestDist = Infinity;
        for (const [vx, vy] of primary.points) {
          if (!Number.isFinite(vy)) continue;
          const d = Math.abs(vx - mx);
          if (d < bestDist) {
            bestDist = d;
            snapX = vx;
            snapY = vy;
          }
        }
      }

      const crossX = snapY !== null ? toPxX(snapX) : pointer.px;
      ctx.strokeStyle = palette.crosshair;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(crossX, padT);
      ctx.lineTo(crossX, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      if (snapY !== null && snapY >= yMin && snapY <= yMax) {
        const dotY = toPxY(snapY);
        ctx.fillStyle = palette.primary;
        ctx.beginPath();
        ctx.arc(crossX, dotY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      const xDisplay = isLogX ? fmtLogFreq(Math.pow(10, snapX)) : fmtTick(snapX);
      const coordText =
        snapY !== null
          ? `(${xDisplay}, ${fmtTick(snapY)})`
          : `x = ${isLogX ? fmtLogFreq(Math.pow(10, mx)) : fmtTick(mx)}`;
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      const textW = ctx.measureText(coordText).width;
      const boxW = textW + 14;
      const boxH = 22;
      const tx = Math.min(w - boxW - 6, Math.max(padL + 4, crossX + 10));
      const ty = Math.max(padT + 4, pointer.py - 28);

      ctx.fillStyle = palette.tooltipBg;
      ctx.strokeStyle = palette.tooltipBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, ty, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = palette.tooltipText;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(coordText, tx + 7, ty + boxH / 2);
    }
  }

  // Event listeners
  const handleMove = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { px: clientX - rect.left, py: clientY - rect.top };
    requestAnimationFrame(draw);
  };

  canvas.addEventListener("mousemove", (e) => handleMove(e.clientX, e.clientY));
  canvas.addEventListener("mouseleave", () => {
    pointer = null;
    requestAnimationFrame(draw);
  });
  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  canvas.addEventListener("touchend", () => {
    pointer = null;
    requestAnimationFrame(draw);
  });

  if (sliderInput) {
    sliderInput.addEventListener("input", () => {
      activeSliderVal = parseInt(sliderInput.value, 10);
      if (sliderValEl) sliderValEl.textContent = String(activeSliderVal);
      requestAnimationFrame(draw);
    });
  }

  altBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeAlt = btn.getAttribute("data-plot-alt") === "b";
      altBtns.forEach((b) => {
        const isSel = (b.getAttribute("data-plot-alt") === "b") === activeAlt;
        b.className = isSel
          ? "plot-alt-btn px-2.5 py-1 rounded-md bg-blue-700 text-white transition-colors"
          : "plot-alt-btn px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors";
      });
      requestAnimationFrame(draw);
    });
  });

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `calcweb-plot-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // Responsive ResizeObserver
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      if (!canvas.isConnected) {
        ro.disconnect();
        return;
      }
      requestAnimationFrame(draw);
    });
    ro.observe(canvas);
  }

  // Dark/Light Mode MutationObserver on <html>
  const mo = new MutationObserver(() => {
    if (!canvas.isConnected) {
      mo.disconnect();
      return;
    }
    requestAnimationFrame(draw);
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  requestAnimationFrame(draw);
}
