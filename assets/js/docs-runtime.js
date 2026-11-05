/* Witch Launcher — docs runtime: every page renders from /docs-md/<lang>/*.md
   One shell per language; routing via `#/<page-id>[#anchor]`; hash change swaps in place. */
(() => {
  "use strict";
  if (typeof marked === "undefined" || !document.getElementById("doc-article")) return;

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const mkT = vi => vi
    ? { home: "Tổng quan", docs: "TÀI LIỆU", toc: "Trong trang", eyebrow: "TÀI LIỆU",
        prev: "Trước", next: "Tiếp", kbd: "Phím [ ] chuyển trang",
        pageTitle: t => `${t} — Tài liệu Witch Launcher`,
        notFound: "Không tìm thấy trang — quay về tổng quan.",
        callout: { NOTE: "GHI CHÚ", TIP: "MẸO", IMPORTANT: "QUAN TRỌNG", WARNING: "CẢNH BÁO" },
        groupAlias: g => ({ Overview: "TỔNG QUAN", Plugins: "PLUGIN", Reference: "THAM KHẢO" }[g] || String(g).toUpperCase()) }
    : { home: "Overview", docs: "DOCS", toc: "On this page", eyebrow: "DOCS",
        prev: "Previous", next: "Next", kbd: "Press [ ] to switch pages",
        pageTitle: t => `${t} — Witch Launcher Docs`,
        notFound: "Page not found — back to the overview.",
        callout: { NOTE: "NOTE", TIP: "TIP", IMPORTANT: "IMPORTANT", WARNING: "WARNING" },
        groupAlias: g => ({ Overview: "OVERVIEW", Plugins: "PLUGIN", Reference: "REFERENCE" }[g] || String(g).toUpperCase()) };
  let VI = document.documentElement.lang === "vi";
  let T = mkT(VI);
  const atVIDir = location.pathname.indexOf("/vi/docs/") !== -1;

  const PAGES = ["getting-started", "jit", "runtimes", "plugins", "plugins-dev", "changelog", "faq", "credits"];
  const ALL = ["index", ...PAGES];
  const NAV = { "getting-started": "START", jit: "JIT", runtimes: "RUNTIMES", plugins: "PLUGINS", "plugins-dev": "PDEV", changelog: "LOG", faq: "FAQ", credits: "CREDITS" };
  const mdBase = () => (atVIDir ? "../../docs-md/" : "../docs-md/") + (VI ? "vi/" : "en/");

  /* ————————————— data ————————————— */
  const pages = new Map();      /* id -> { meta, body } */
  const loadAll = async () => {
    await Promise.all(ALL.map(async id => {
      try {
        const r = await fetch(mdBase() + id + ".md");
        if (!r.ok) throw new Error("HTTP " + r.status);
        pages.set(id, parseFront(await r.text()));
      } catch (e) { /* page stays absent — render falls back to index */ }
    }));
  };
  const parseFront = raw => {
    let meta = {}, body = raw;
    const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
    if (m) {
      body = raw.slice(m[0].length);
      for (const line of m[1].split("\n")) {
        const mm = /^([A-Za-z_-]+):\s*("?)([\s\S]*?)\2\s*$/.exec(line);
        if (mm) meta[mm[1]] = mm[3];
      }
    }
    return { meta, body };
  };

  /* ————————————— markdown ————————————— */
  const extractCallouts = (md) => {
    const callouts = [];
    const RX = /(?:^|\n)>[ \t]*\[!(NOTE|TIP|IMPORTANT|WARNING)\][ \t]*([^\n]*)\n((?:>.*(?:\n|$))*)/g;
    const text = md.replace(RX, (_m, kind, first, rest) => {
      const inner = [first.trim(), ...rest.trim().split("\n").map(l => l.replace(/^>[ \t]?/, ""))].filter(Boolean).join("\n");
      callouts.push({ kind, body: inner });
      return `\n<doc-callout data-i="${callouts.length - 1}"></doc-callout>\n`;
    });
    return { text, callouts };
  };
  const renderMarkdown = (md) => {
    const { text, callouts } = extractCallouts(md);
    marked.setOptions({ gfm: true, breaks: false });
    let html = marked.parse(text);
    html = html.replace(/<doc-callout data-i="(\d+)"><\/doc-callout>/g, (_m, i) => {
      const c = callouts[+i];
      const inner = marked.parse(c.body).trim();
      return `<div class="callout"><span class="ck">${T.callout[c.kind] || T.callout.NOTE}</span>${inner}</div>`;
    });
    return html;
  };
  const slugify = t =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
  const assignHeadingIds = (rootEl) => {
    const used = new Set();
    $$("h2, h3", rootEl).forEach(h => {
      const inline = /{#([A-Za-z0-9_-]+)}\s*$/.exec(h.innerHTML);
      if (inline) { h.innerHTML = h.innerHTML.replace(/\s*{#[A-Za-z0-9_-]+}\s*$/, ""); h.id = inline[1]; }
      else { let s = slugify(h.textContent), u = s, i = 2; while (used.has(u)) u = `${s}-${i++}`; h.id = u; }
      used.add(h.id);
    });
  };
  const rewriteLegacyLinks = (rootEl) => {
    /* belt & braces: any *.html link that points at a docs page becomes a route */
    const known = new Set(PAGES);
    $$("a[href]", rootEl).forEach(a => {
      const m = /^(?:\.\/|\.\.\/|\.\.\/\.\.\/)?(getting-started|jit|runtimes|plugins|plugins-dev|changelog|faq|credits|index)\.html(#[^\s]*)?$/.exec(a.getAttribute("href") || "");
      if (m) a.setAttribute("href", `#/${m[1]}${m[2] || ""}`);
    });
  };

  /* ————————————— chrome builders ————————————— */
  const buildSidebar = () => {
    const nav = $(".docnav");
    const html = [`<div class="grp"><span class="mono-sm">${T.docs}</span><a href="#/" data-nav="index">${T.home}</a></div>`];
    const byGroup = new Map();
    for (const id of PAGES) {
      const d = pages.get(id); if (!d) continue;
      const g = d.meta.group || "Reference";
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g).push({ id, d });
    }
    byGroup.forEach((items, g) => {
      html.push(`<div class="grp"><span class="mono-sm">${T.groupAlias(g)}</span>` +
        items.map(({ id, d }) => `<a href="#/${id}" data-nav="${id}"><span class="n">${String(PAGES.indexOf(id) + 1).padStart(2, "0")}</span>${d.meta.title}</a>`).join("") +
      `</div>`);
    });
    html.push(`<div class="kbd-row mono-sm" aria-hidden="true">${T.kbd}</div>`);
    nav.innerHTML = html.join("");
    nav.addEventListener("click", e => {
      const a = e.target.closest("a"); if (a) document.documentElement.classList.remove("sb-open");
    });
  };
  const buildRailNav = () => {
    const nav = $(".rail-nav");
    if (!nav) return;
    nav.innerHTML = `<span class="rail-line" aria-hidden="true"><i></i></span>` +
      PAGES.map(id => `<a href="#/${id}" data-nav="${id}">${NAV[id]}</a>`).join("");
  };

  /* ————————————— rendering ————————————— */
  const article = $("#doc-article");
  const prose = $(".prose", article);
  const titleEl = $("#doc-title"), descEl = $("#doc-desc"), numEl = $("#doc-num"), groupEl = $("#doc-group");
  const crumbEl = $(".docsbar .path b");
  const tocBox = $(".toc", article.closest(".article"));
  const pagerBox = $(".doc-pager", article);
  const sectionBar = $("#section-bar");
  let tocIO = null;

  const route = () => {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const i = raw.indexOf("#");
    return { page: (i === -1 ? raw : raw.slice(0, i)).toLowerCase() || "index", anchor: i === -1 ? "" : raw.slice(i + 1) };
  };
  const jumpTo = (id) => {
    const el = id && document.getElementById(id);
    if (!el) return;
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90);
    if (window.__setScrollTarget) window.__setScrollTarget(y);
    else window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const smoothTop = () => {
    if (window.__setScrollTarget) window.__setScrollTarget(0);
    else window.scrollTo({ top: 0 });
  };
  const cardHtml = () => {
    const cards = PAGES.filter(id => pages.has(id)).map((id, i) => {
      const d = pages.get(id);
      return `<a class="doc-card" href="#/${id}"><span class="mono-sm">${String(PAGES.indexOf(id) + 1).padStart(2, "0")} — ${T.groupAlias(d.meta.group)}</span><h3>${d.meta.title}</h3><p>${d.meta.desc || ""}</p></a>`;
    }).join("");
    return `<div class="doc-cards">${cards}</div>`;
  };

  const renderCurrent = () => {
    const { page, anchor } = route();
    let id = pages.has(page) ? page : "index";
    if (!pages.has(id)) id = PAGES.find(p => pages.has(p));
    const doc = pages.get(id);
    currentKey = id + "#" + anchor;

    /* chrome */
    const title = doc.meta.title || "Documentation";
    numEl.textContent = id === "index" ? "00" : String(PAGES.indexOf(id) + 1).padStart(2, "0");
    groupEl.textContent = T.groupAlias(doc.meta.group || "Reference");
    titleEl.textContent = title;
    descEl.textContent = doc.meta.desc || "";
    descEl.style.display = doc.meta.desc ? "" : "none";
    if (crumbEl) crumbEl.textContent = title;
    document.title = T.pageTitle(title);
    $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === id));
    if (id !== page) history.replaceState(null, "", "#/" + id);

    /* content swap with a soft rise */
    prose.classList.remove("swap"); void prose.offsetWidth; prose.classList.add("swap");
    prose.innerHTML = renderMarkdown(doc.body) + (id === "index" ? cardHtml() : "");
    assignHeadingIds(prose);
    rewriteLegacyLinks(prose);

    /* section bar + right rail TOC from the rendered h2[id] */
    const heads = $$("h2[id]", prose);
    tocIO?.disconnect(); tocIO = null;
    const spy = new IntersectionObserver(en => {
      for (const e of en) if (e.isIntersecting) {
        $$("[data-toc]", sectionBar).forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id));
        if (tocBox) $$("a", tocBox).forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id));
      }
    }, { rootMargin: "-12% 0px -68% 0px" });
    if (sectionBar) {
      if (heads.length) {
        sectionBar.innerHTML = heads.map((h, i) =>
          `<a class="sb-chip" href="#/${id}#${h.id}" data-toc="${h.id}"><span class="idx">${String(i + 1).padStart(2, "0")}</span>${h.textContent}</a>`).join("");
        sectionBar.style.display = "";
      } else { sectionBar.innerHTML = ""; sectionBar.style.display = "none"; }
    }
    if (tocBox) {
      if (heads.length) {
        tocBox.innerHTML = `<span class="mono-sm">${T.toc}</span>` + heads.map(h => `<a href="#/${id}#${h.id}" data-toc="${h.id}">${h.textContent}</a>`).join("");
        tocBox.style.display = "";
      } else { tocBox.innerHTML = ""; tocBox.style.display = "none"; }
    }
    heads.forEach(h => spy.observe(h));
    tocIO = spy;

    /* prev / next pager */
    const cur = PAGES.indexOf(id);
    const prev = PAGES[cur - 1], next = PAGES[cur + 1];
    pagerBox.innerHTML = id === "index"
      ? `<a class="pager" href="#/${PAGES[0]}"><span class="mono-sm">→ ${T.next}</span><span class="pl">${pages.get(PAGES[0])?.meta.title || PAGES[0]}</span></a><span></span>`
      : `${prev ? `<a class="pager" href="#/${prev}"><span class="mono-sm">← ${T.prev}</span><span class="pl">${pages.get(prev)?.meta.title || prev}</span></a>` : "<span></span>"}
         ${next ? `<a class="pager next" href="#/${next}"><span class="mono-sm">${T.next} →</span><span class="pl">${pages.get(next)?.meta.title || next}</span></a>` : "<span></span>"}`;

    /* scroll */
    if (anchor && document.getElementById(anchor)) requestAnimationFrame(() => jumpTo(anchor));
    else smoothTop();
  };

  /* ————————————— boot ————————————— */
  let currentKey = "";
  const onHashChange = () => {
    const { page, anchor } = route();
    const id = pages.has(page) ? page : "index";
    const key = id + "#" + anchor;
    const curPage = currentKey.split("#")[0];
    if (key === currentKey) return;
    if (id === curPage) {
      /* same page, different anchor — glide, don't re-render */
      if (anchor) jumpTo(anchor); else smoothTop();
      currentKey = key;
      if (anchor) history.replaceState(null, "", "#/" + id + "#" + anchor);
      $$(".rail-nav a, .docnav a").forEach(a => a.classList.toggle("on", a.dataset.nav === id));
      return;
    }
    renderCurrent();
    patchLangLinks();
  };

  loadAll().then(() => {
    if (!pages.size) {
      $(".prose", article).innerHTML =
        `<div class="callout"><span class="ck">${VI ? "LỖI TẢI" : "LOAD ERROR"}</span>` +
        `<p>${VI ? "Không tải được tài liệu — " : "Couldn't load the docs — "}<a href="../index.html">${VI ? "về trang chính" : "back home"}</a>.</p></div>`;
      document.body.classList.add("docs-ready");
      return;
    }
    buildSidebar();
    buildRailNav();
    renderCurrent();
    syncSiteLabels();
    patchLangLinks();
    document.body.classList.add("docs-ready");
  });
  addEventListener("hashchange", onHashChange);

  /* in-content routing clicks */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]"); if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#/")) {
      e.preventDefault();
      if (href === location.hash) {
        const anchor = href.split("#")[2];
        if (anchor) jumpTo(anchor);
      } else location.hash = href;
      return;
    }
    if (href.startsWith("#") && href.length > 1) { /* in-page anchor inside markdown */
      const el = document.getElementById(decodeURIComponent(href.slice(1)));
      if (el) { e.preventDefault(); jumpTo(el.id); history.replaceState(null, "", "#/" + route().page + "#" + el.id); }
    }
  });

  /* ————————————— language switch — in-place, no page reload ————————————— */
  const shellUrl = (vi) => { if (vi) return atVIDir ? "index.html" : "../vi/docs/index.html"; return atVIDir ? "../../docs/index.html" : "index.html"; };
  const flash = (() => {
    const el = document.createElement("div");
    el.className = "lang-flash";
    document.body.appendChild(el);
    return el;
  })();
  const syncSiteLabels = () => {
    $$(".js-site-label").forEach(a => { a.textContent = VI ? a.dataset.vi : a.dataset.en; });
    const meta = $("#js-meta-desc");
    if (meta) meta.setAttribute("content", VI ? meta.dataset.vi : meta.dataset.en);
    $$(".js-langlink").forEach(a => { a.setAttribute("aria-label", VI ? "English" : "Tiếng Việt"); a.textContent = VI ? "EN" : "VI"; });
  };
  const patchLangLinks = () => {
    const r = route().page, anchor = route().anchor;
    const base = shellUrl(!VI); /* the OTHER language's shell */
    const cue = "#/" + r + (anchor ? "#" + anchor : "");
    $$(".js-langlink").forEach(a => a.setAttribute("href", `${base}${cue}`));
  };
  const switchLang = async (toVi) => {
    if (toVi === VI) return;
    VI = toVi;
    T = mkT(VI);
    document.documentElement.lang = VI ? "vi" : "en";
    flash.classList.add("on");
    await loadAll();             /* refetch the whole set in the target language */
    buildSidebar();
    buildRailNav();
    syncSiteLabels();
    const { page, anchor } = route();
    history.replaceState(null, "", shellUrl(VI) + `#/${page}${anchor ? "#" + anchor : ""}`);
    currentKey = "";             /* force a full re-render in the new language */
    renderCurrent();
    patchLangLinks();
    setTimeout(() => flash.classList.remove("on"), 320);
  };
  document.addEventListener("click", e => {
    const a = e.target.closest(".js-langlink"); if (!a) return;
    e.preventDefault();
    switchLang(!VI);
  });
  addEventListener("hashchange", patchLangLinks);
  syncSiteLabels();

  /* [ ] keyboard page switching */
  addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    const cur = PAGES.indexOf(route().page);
    if (cur === -1) return;
    if (e.key === "[" && cur > 0) location.hash = "#/" + PAGES[cur - 1];
    else if (e.key === "]" && cur < PAGES.length - 1) location.hash = "#/" + PAGES[cur + 1];
  });
})();
