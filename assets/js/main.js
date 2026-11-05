/* Witch Launcher — main.js */
(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const desktop = matchMedia("(min-width: 1024px)").matches;
  root.classList.add("js");

  /* ————————————— theme (circular wipe) ————————————— */
  const store = {
    get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
  };
  function setTheme(t) { root.dataset.theme = t; store.set("witch-theme", t); syncThemeButtons(); }
  function syncThemeButtons() {
    const dark = root.dataset.theme === "dark";
    $$(".theme-toggle").forEach(b => b.setAttribute("aria-pressed", String(dark)));
  }
  function circleWipe(el, apply) {
    if (!document.startViewTransition || reduced) { apply(); return; }
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(() => {
      root.classList.add("wipe-snap");       /* freeze every color transition */
      apply();                               /* the flip now lands atomically */
    });
    t.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 1240, easing: "cubic-bezier(.19,1,.22,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
    const done = () => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("wipe-snap")));
    if (t.finished && t.finished.then) t.finished.then(done, done);
    else setTimeout(done, 850);
  }
  $$(".theme-toggle").forEach(btn => btn.addEventListener("click", () => {
    circleWipe(btn, () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));
  }));
  syncThemeButtons();

  /* ————————————— mobile menu ————————————— */
  const bar = $(".mobilebar");
  const overlay = $(".menu-overlay");
  function closeMenu() {
    root.classList.remove("menu-open");
    $(".menu-toggle")?.setAttribute("aria-expanded", "false");
  }
  function toggleMenu() {
    const open = root.classList.toggle("menu-open");
    $(".menu-toggle")?.setAttribute("aria-expanded", String(open));
    if (open) $(".menu-x")?.focus({ preventScroll: true });
  }
  $(".menu-toggle")?.addEventListener("click", toggleMenu);
  $$(".menu-x").forEach(b => b.addEventListener("click", closeMenu));
  overlay?.addEventListener("click", e => { if (e.target === overlay) closeMenu(); });
  $$(".menu-overlay a").forEach(a => a.addEventListener("click", closeMenu));
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ————————————— smooth scroll engine (desktop) ————————————— */
  const canSmooth = !reduced && fine && desktop;
  let setScrollTarget = null;
  if (canSmooth) {
    const limit = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    let cur = window.scrollY, tgt = cur, rafId = 0, last = 0, smoothUntil = 0;
    const step = t => {
      rafId = 0;
      const dt = Math.min(64, t - (last || t)); last = t;
      const k = 1 - Math.exp(-dt / 120);
      cur += (tgt - cur) * k;
      if (Math.abs(tgt - cur) < .4) cur = tgt;
      smoothUntil = performance.now() + 120;
      window.scrollTo(0, cur);
      if (cur !== tgt) rafId = requestAnimationFrame(step); else last = 0;
    };
    const kick = () => { if (!rafId) rafId = requestAnimationFrame(step); };
    setScrollTarget = y => { tgt = Math.min(limit(), Math.max(0, y)); kick(); };
    addEventListener("scroll", () => {
      if (performance.now() > smoothUntil) { cur = tgt = window.scrollY; }
    }, { passive: true });
    const norm = e => {
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 34; else if (e.deltaMode === 2) d *= innerHeight;
      return d;
    };
    addEventListener("wheel", e => {
      if (e.ctrlKey || e.metaKey) return; /* pinch zoom */
      e.preventDefault();
      tgt = Math.min(limit(), Math.max(0, tgt + norm(e))); kick();
    }, { passive: false });
    addEventListener("keydown", e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return;
      const page = innerHeight * .88, line = Math.max(56, innerHeight * .07);
      let d = null;
      switch (e.key) {
        case "ArrowDown": d = line; break;
        case "ArrowUp": d = -line; break;
        case "PageDown": case " ": d = page; break;
        case "PageUp": d = -page; break;
        case "Home": tgt = 0; e.preventDefault(); kick(); return;
        case "End": tgt = limit(); e.preventDefault(); kick(); return;
        default: return;
      }
      e.preventDefault();
      tgt = Math.min(limit(), Math.max(0, tgt + d)); kick();
    });
  }
  const smoothTo = t => {
    const y = Math.max(0, t.getBoundingClientRect().top + window.scrollY - 10);
    if (setScrollTarget) setScrollTarget(y);
    else t.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  /* ————————————— hide-on-scroll bars + rail progress ————————————— */
  let lastY = scrollY, ticking = false;
  function scrollLoop() {
    const y = scrollY;
    const down = y > lastY + 4, up = y < lastY - 4;
    const docsbar = $(".docsbar");
    if (down && y > 140) { bar?.classList.add("hide"); docsbar?.classList.add("hide-xs"); }
    else if (up) { bar?.classList.remove("hide"); docsbar?.classList.remove("hide-xs"); }
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0) {
      const p = Math.min(1, Math.max(0, y / max));
      $$(".rail-line i").forEach(i => { i.style.height = (p * 100) + "%"; });
    }
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(scrollLoop); ticking = true; } }, { passive: true });

  /* ————————————— anchors ————————————— */
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#/")) return; /* docs runtime owns routed hashes */
    const id = href.slice(1);
    const t = id && document.getElementById(id);
    if (!t) return;
    e.preventDefault(); closeMenu(); smoothTo(t);
    history.replaceState(null, "", "#" + id);
  }));

  /* ————————————— section reveal ————————————— */
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }
  }, { threshold: .1, rootMargin: "0px 0px -7% 0px" });
  const observeReveals = () => $$("[data-reveal], .chapter-head").forEach(el => io.observe(el));
  observeReveals();

  /* ————————————— active chapter in rail ————————————— */
  const chapIO = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const id = en.target.id;
      $$(".rail-nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
      $$(".docnav a").forEach(a => { if (a.dataset.docsec) a.classList.toggle("on", a.getAttribute("href") === "#" + id); });
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-chapter]").forEach(s => chapIO.observe(s));

  /* ————————————— parallax + ghost numerals ————————————— */
  const pl = [];
  $$("[data-speed]").forEach(el => pl.push({ el, sp: parseFloat(el.dataset.speed) || .1 }));
  if (!reduced && pl.length) {
    let pt = false;
    const plLoop = () => {
      const vh = innerHeight;
      for (const it of pl) {
        const r = it.el.getBoundingClientRect();
        if (r.bottom < -160 || r.top > vh + 160) continue;
        const off = (r.top + r.height / 2 - vh / 2) * it.sp;
        it.el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      }
      pt = false;
    };
    addEventListener("scroll", () => { if (!pt) { requestAnimationFrame(plLoop); pt = true; } }, { passive: true });
    addEventListener("resize", () => requestAnimationFrame(plLoop), { passive: true });
    requestAnimationFrame(plLoop);
  }

  /* ————————————— tour: auto-advancing showcase ————————————— */
  const show = $("[data-show]");
  if (show) {
    const slides = $$(".show-slide", show);
    const items = $$(".show-item", show);
    const countB = $(".show-count b", show);
    const barI = $(".show-bar i", show);
    const tagEl = $(".show-tag", show);
    const N = slides.length;
    const STEP = 4600;
    let i = 0, timer = 0, hover = false, focused = false, inView = true;
    const syncPause = () => { show.dataset.paused = String(hover || focused || !inView || document.hidden || reduced); };
    const setIdx = (n, user) => {
      i = ((n % N) + N) % N;
      slides.forEach((s, k) => s.classList.toggle("on", k === i));
      items.forEach((it, k) => {
        it.classList.toggle("on", k === i);
        it.setAttribute("aria-selected", String(k === i));
      });
      if (countB) countB.textContent = String(i + 1).padStart(2, "0");
      if (barI) barI.style.width = (((i + 1) / N) * 100).toFixed(2) + "%";
      if (tagEl) {
        tagEl.textContent = items[i]?.dataset.tag || "";
        tagEl.classList.remove("pop"); void tagEl.offsetWidth; tagEl.classList.add("pop");
      }
      if (user) schedule();
    };
    const schedule = () => {
      clearInterval(timer);
      if (reduced || N < 2) return;
      timer = setInterval(() => {
        syncPause();
        if (hover || focused || !inView || document.hidden) return;
        setIdx(i + 1);
      }, STEP);
    };
    items.forEach((it, k) => it.addEventListener("click", () => setIdx(k, true)));
    $$(".show-arrow", show).forEach(b =>
      b.addEventListener("click", () => setIdx(i + (b.classList.contains("next") ? 1 : -1), true)));
    show.addEventListener("mouseenter", () => { hover = true; syncPause(); });
    show.addEventListener("mouseleave", () => { hover = false; syncPause(); });
    show.addEventListener("focusin", () => { focused = true; syncPause(); });
    show.addEventListener("focusout", () => { focused = false; syncPause(); });
    show.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { e.preventDefault(); setIdx(i - 1, true); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setIdx(i + 1, true); }
    });
    new IntersectionObserver(en => { inView = en[0].isIntersecting; syncPause(); }).observe(show);
    document.addEventListener("visibilitychange", syncPause);
    setIdx(0); schedule();
  }

  /* ————————————— magnet buttons ————————————— */
  if (fine && !reduced) {
    $$(".btn, .icon-btn, .show-arrow").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = `translate(${(dx * 7).toFixed(2)}px, ${(dy * 5).toFixed(2)}px)`;
      });
      b.addEventListener("mouseleave", () => { b.style.transform = ""; });
    });
  }

  /* ————————————— Witch loader: real assets, diamond-as-progress ————————————— */
  const loader = $("[data-loader]");
  const ready = () => { body.classList.add("ready"); root.classList.remove("loading"); };
  if (loader) {
    const path = $(".wl-path", loader);
    const mark = $(".wl-mark", loader);
    const pct = $(".wl-pct", loader);
    const started = performance.now();
    const MIN_MS = 1000, MAX_MS = 5200;
    let len = 0;
    try { len = path.getTotalLength(); } catch { len = 1400; }
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const imgs = $$('img:not([loading="lazy"])');
    const jobs = imgs.map(im => new Promise(res => {
      if (im.complete && im.naturalWidth > 0) return res();
      im.addEventListener("load", res, { once: true });
      im.addEventListener("error", res, { once: true });
    }));
    if (!jobs.length) jobs.push(new Promise(res => addEventListener("load", res, { once: true })));
    let finished = 0;
    jobs.forEach(p => p.then(() => { finished++; }));
    setTimeout(() => { finished = jobs.length; }, MAX_MS - 200); // hard cap

    let shown = 0, done = false;
    const target = () => Math.min(1, (finished + (document.readyState === "complete" ? 1 : 0)) / (jobs.length + 1));
    const tick = () => {
      const now = performance.now();
      const t = target();
      const dt = 16;
      shown += (t - shown) * (1 - Math.exp(-dt / 95));
      if (t >= 1 && shown > .985 && now - started > MIN_MS) shown = 1;
      path.style.strokeDashoffset = String(len * (1 - shown));
      if (pct) pct.textContent = String(Math.round(shown * 100)).padStart(2, "0");
      if (shown >= 1 && !done) { done = true; return complete(); }
      if (now - started > MAX_MS && !done) { done = true; shown = 1; return complete(); }
      requestAnimationFrame(tick);
    };
    const complete = () => {
      path.style.strokeDashoffset = "0";
      if (pct) pct.textContent = "100";
      loader.classList.add("full");
      const to = $("[data-loader-to]");
      const reveal = () => { ready(); loader.classList.add("gone"); setTimeout(() => loader.remove(), 900); };
      if (to && mark && !reduced) {
        setTimeout(() => {
          ready(); /* hero choreography starts while the diamond lands */
          const fromR = mark.getBoundingClientRect();
          const toR = to.getBoundingClientRect();
          const scale = toR.width / fromR.width;
          const dx = (toR.left + toR.width / 2) - (fromR.left + fromR.width / 2);
          const dy = (toR.top + toR.height / 2) - (fromR.top + fromR.height / 2);
          $$(".wl-meta, .wl-note", loader).forEach(el => { el.style.transition = "opacity .4s"; el.style.opacity = "0"; });
          mark.animate(
            [{ transform: "translate(0px, 0px) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})` }],
            { duration: 780, easing: "cubic-bezier(.19,1,.22,1)", fill: "forwards" }
          );
          loader.classList.add("gone");
          setTimeout(() => loader.remove(), 950);
        }, 420);
      } else {
        setTimeout(reveal, 380);
      }
    };
    requestAnimationFrame(tick);
  } else {
    ready();
  }

  /* ————————————— docs: sidebar + toc ————————————— */
  $(".sb-toggle")?.addEventListener("click", () => root.classList.toggle("sb-open"));
  $$(".docnav a").forEach(a => a.addEventListener("click", () => root.classList.remove("sb-open")));
  const tocBox = $(".toc");
  if (tocBox) {
    const heads = $$(".prose h2[id]");
    if (heads.length) {
      tocBox.innerHTML = '<span class="mono-sm">On this page</span>' + heads.map(h =>
        `<a href="#${h.id}" data-toc="${h.id}">${h.textContent}</a>`).join("");
      const toIO = new IntersectionObserver(en => {
        for (const e of en) if (e.isIntersecting) {
          $$("a", tocBox).forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id));
        }
      }, { rootMargin: "-15% 0px -70% 0px" });
      heads.forEach(h => toIO.observe(h));
      $$("a", tocBox).forEach(a => a.addEventListener("click", e => {
        const t = document.getElementById(a.dataset.toc);
        if (!t) return;
        e.preventDefault(); smoothTo(t);
        history.replaceState(null, "", "#" + a.dataset.toc);
      }));
    } else tocBox.remove();
  }

  /* ————————————— GitHub releases + stars (live, cached fallback) ————————————— */
  const REPO = "Witch-Launcher/Witch_launcher";
  const API = `https://api.github.com/repos/${REPO}/releases?per_page=20`;
  const FALLBACK = {
    stable: { tag: "release", name: "Witch v0.0.3-bd09e27-20261017 — Release (stable)", date: "2026-10-17T08:01:53Z",
      assets: [
        { n: "Witch-0.0.3-ios.ipa", s: 274, d: 286, u: "https://github.com/Witch-Launcher/Witch_launcher/releases/download/release/Witch-0.0.3-ios.ipa" },
        { n: "Witch-0.0.3-ios-trollstore.tipa", s: 274, d: 100, u: "https://github.com/Witch-Launcher/Witch_launcher/releases/download/release/Witch-0.0.3-ios-trollstore.tipa" },
        { n: "Witch-slimmed-0.0.3-ios.ipa", s: 123, d: 48, u: "https://github.com/Witch-Launcher/Witch_launcher/releases/download/release/Witch-slimmed-0.0.3-ios.ipa" },
        { n: "Witch-slimmed-0.0.3-ios-trollstore.tipa", s: 123, d: 30, u: "https://github.com/Witch-Launcher/Witch_launcher/releases/download/release/Witch-slimmed-0.0.3-ios-trollstore.tipa" }
      ] },
    beta: { tag: "pre-release", name: "Witch v0.0.3-beta.88aa08e-20261016-b146 — Pre-release (beta)", date: "2026-10-16T15:35:00Z",
      url: "https://github.com/Witch-Launcher/Witch_launcher/releases/tag/pre-release" },
    history: [
      { tag: "release", name: "Witch v0.0.3-bd09e27-20261017 — Release (stable)", date: "2026-10-17T08:01:53Z", dls: 487 },
      { tag: "horizon-resources-26.3", name: "Horizon 26.3 prepared resources (experimental)", date: "2026-11-01T15:57:07Z", dls: 31 },
      { tag: "pre-release", name: "Witch v0.0.3-beta.88aa08e-20261016-b146 — Pre-release (beta)", date: "2026-10-16T15:35:00Z", dls: 48 },
      { tag: "0.0.2-pre", name: "Witch Launcher 0.0.2 — Pre-release", date: "2026-08-29T13:26:07Z", dls: 1059 }
    ]
  };
  const fmtDate = iso => {
    try { return new Date(iso).toLocaleDateString(document.documentElement.lang === "vi" ? "vi-VN" : "en-US", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return iso; }
  };
  const fmtMB = s => s + " MB";
  const kindOf = n => {
    const l = String(n).toLowerCase();
    if (l.includes("checksum") || l.includes("release_notes")) return null;
    if (l.endsWith(".ipa")) return l.includes("slimmed") ? "slim-ipa" : "ipa";
    if (l.endsWith(".tipa")) return l.includes("slimmed") ? "slim-tipa" : "tipa";
    return "other";
  };
  const verOf = name => { const m = /v(\d+\.\d+\.\d+)/i.exec(name || ""); return m ? "v" + m[1] : ""; };

  function assetCard(a) {
    const k = kindOf(a.n);
    if (!k || k === "other") return "";
    const label = { ipa: "Standard · Sideload", tipa: "TrollStore · .tipa", "slim-ipa": "Slim · Sideload", "slim-tipa": "Slim · TrollStore" }[k];
    const idx = ["0", "1", "2", "3"][Math.floor(Math.random() * 4)];
    return `<a class="asset" data-reveal style="--i:${idx}" href="${a.u}" rel="noopener" target="_blank">
      <span class="a-name">${a.n}</span>
      <span class="a-foot"><span class="mono-sm">${label}</span><span class="a-dl">${fmtMB(a.s)} · ${a.d} ↓</span></span>
    </a>`;
  }
  function renderReleases(data) {
    const box = $("#dl-root");
    if (!box || !data?.stable) return;
    const s = data.stable;
    const groups = { core: [], slim: [] };
    (s.assets || []).forEach(a => { const k = kindOf(a.n); if (!k) return; (k.startsWith("slim") ? groups.slim : groups.core).push(a); });
    const v = verOf(s.name) || "";
    const chip = $("#hero-ver"); if (chip) chip.textContent = v + (s.pre ? " · beta" : "");
    const chip2 = $("#ver-chip2"); if (chip2) chip2.textContent = v;
    const sums = (s.assets || []).reduce((t, a) => t + (a.d || 0), 0);
    box.innerHTML = `
      <div class="dl-hero" data-reveal>
        <div>
          <div class="eyebrow" style="margin-bottom:14px"><b>Latest release</b> · stable channel</div>
          <div class="dl-ver num-tab">${v}</div>
        </div>
        <div class="dl-meta">
          <span class="chip"><i></i>${fmtDate(s.date)}</span>
          <a class="btn btn-ghost" href="${data.releasesUrl || "https://github.com/Witch-Launcher/Witch_launcher/releases"}" target="_blank" rel="noopener">All releases · ${sums.toLocaleString()} downloads</a>
        </div>
      </div>
      <div class="asset-groups">
        <div><div class="ag-label mono-sm">Standard build</div><div class="assets">${groups.core.map(assetCard).join("")}</div></div>
        ${groups.slim.length ? `<div><div class="ag-label mono-sm">Slimmed build · no bundled runtimes</div><div class="assets">${groups.slim.map(assetCard).join("")}</div></div>` : ""}
        ${data.beta ? `<div><div class="ag-label mono-sm">Beta channel</div>
        <div class="assets"><a class="asset" data-reveal href="${data.beta.url}" target="_blank" rel="noopener">
          <span class="a-name">${data.beta.name}</span>
          <span class="a-foot"><span class="mono-sm">Pre-release</span><span class="a-dl">${fmtDate(data.beta.date)} →</span></span>
        </a></div></div>` : ""}
      </div>
      <div class="dl-list">
        ${(data.history || []).map(h => `<a class="dl-row" href="https://github.com/Witch-Launcher/Witch_launcher/releases/tag/${encodeURIComponent(h.tag)}" target="_blank" rel="noopener">
          <span class="tag num-tab">${h.tag}</span>
          <span class="nm">${h.name}</span>
          <span class="dt">${fmtDate(h.date)}</span>
          <span class="ct num-tab">${h.dls ? h.dls.toLocaleString() + " ↓" : ""}</span>
        </a>`).join("")}
      </div>`;
    observeReveals();
    requestAnimationFrame(() => $$("#dl-root [data-reveal]").forEach(el => el.classList.add("in")));
  }
  renderReleases(FALLBACK);
  if (navigator.onLine !== false) {
    fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(rels => {
        if (!Array.isArray(rels) || !rels.length) return;
        const stable = rels.find(r => !r.draft && !r.prerelease);
        const beta = rels.find(r => !r.draft && r.prerelease);
        const slim = n => ({ n: n.name, s: Math.round(n.size / 1048576), d: n.download_count, u: n.browser_download_url });
        renderReleases({
          releasesUrl: `https://github.com/${REPO}/releases`,
          stable: stable && { tag: stable.tag_name, name: stable.name, date: stable.published_at, pre: stable.prerelease, assets: stable.assets.map(slim) },
          beta: beta && { tag: beta.tag_name, name: beta.name, date: beta.published_at, url: beta.html_url, pre: true },
          history: rels.slice(0, 10).map(r => ({
            tag: r.tag_name, name: r.name || r.tag_name, date: r.published_at,
            dls: r.assets.reduce((s, a) => s + a.download_count, 0)
          }))
        });
      })
      .catch(() => { /* keep bundled fallback */ });
    fetch(`https://api.github.com/repos/${REPO}`)
      .then(r => r.ok ? r.json() : null)
      .then(repo => {
        if (!repo) return;
        const el = $("#hero-stars");
        if (el && typeof repo.stargazers_count === "number") el.textContent = String(repo.stargazers_count);
      })
      .catch(() => {});
  }

  /* ————————————— year ————————————— */
  $$(".js-year").forEach(e => { e.textContent = String(new Date().getFullYear()); });
})();
