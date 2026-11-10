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
        projects: "DỰ ÁN", project: "DỰ ÁN", source: "Nguồn", viewAll: "Xem tất cả",
        langFallback: "Tài liệu gốc bằng tiếng Anh",
        groupAlias: g => ({ Overview: "TỔNG QUAN", Plugins: "PLUGIN", Reference: "THAM KHẢO", Legal: "PHÁP LÝ" }[g] || String(g).toUpperCase()) }
    : { home: "Overview", docs: "DOCS", toc: "On this page", eyebrow: "DOCS",
        prev: "Previous", next: "Next", kbd: "Press [ ] to switch pages",
        pageTitle: t => `${t} — Witch Launcher Docs`,
        notFound: "Page not found — back to the overview.",
        callout: { NOTE: "NOTE", TIP: "TIP", IMPORTANT: "IMPORTANT", WARNING: "WARNING" },
        projects: "PROJECTS", project: "PROJECT", source: "Source", viewAll: "View all",
        langFallback: "Original documentation is in English",
        groupAlias: g => ({ Overview: "OVERVIEW", Plugins: "PLUGIN", Reference: "REFERENCE", Legal: "LEGAL" }[g] || String(g).toUpperCase()) };
  let VI = document.documentElement.lang === "vi";
  let T = mkT(VI);
  /* site root path ("/" in production, handles subpath deploys too) — derived from
     this script's own URL so in-place language switches can build correct absolute
     URLs instead of accumulating "../vi/" prefixes on repeated replaceState calls */
  const scriptEl = document.currentScript || Array.from(document.scripts).find(s => /docs-runtime\.js($|\?)/.test(s.src || ""));
  const siteRoot = scriptEl ? new URL("../../", scriptEl.src).pathname : "/";

  /* the launcher's own guides live in its repository and are served through the
     project section — here the site keeps only the reference and legal pages */
  const PAGES = ["changelog", "faq", "credits", "privacy", "terms"];
  const ALL = ["index", ...PAGES];
  const NAV = { changelog: "LOG", faq: "FAQ", credits: "CREDITS", privacy: "PRIVACY", terms: "TERMS" };
  const mdBase = (vi) => siteRoot + "docs-md/" + (vi ? "vi/" : "en/");

  /* ——— project docs: pulled live from the sibling repositories ———
     Each repo publishes docs/DOCS_MANIFEST.json declaring its branch, the
     language bases and the ordered markdown files. The site reads that
     manifest and the pages straight from GitHub, so pushing a repository
     updates its documentation here with no change to this site at all. */
  const PROJECTS = [
    { id: "launcher",    label: "Witch Launcher", repo: "Witch-Launcher/Witch_launcher",    branch: "beta", section: "Launcher" },
    { id: "tglmt",       label: "TGLMT",          repo: "Witch-Launcher/TGLMT",              branch: "main", section: "Projects" },
    { id: "tgles",       label: "TGLES",          repo: "Witch-Launcher/TGLES",              branch: "main", section: "Projects" },
    { id: "metalcompat", label: "MetalCompat",    repo: "Witch-Launcher/MetalCompat",        branch: "main", section: "Projects" },
    { id: "metalbridge", label: "MetalBridge",    repo: "Witch-Launcher/MetalMacOSPortiOS", branch: "main", section: "Projects" },
  ];
  const MANIFEST_FILE = "DOCS_MANIFEST.json";
  /* two public mirrors of the same GitHub content, tried in order */
  const repoUrls = (p, file) => [
    `https://raw.githubusercontent.com/${p.repo}/${p.branch}/docs/${file}`,
    `https://cdn.jsdelivr.net/gh/${p.repo}@${p.branch}/docs/${file}`,
  ];
  /* slug rule matches the file names a repository publishes */
  const slugifyPath = rel => (rel.replace(/\.md$/i, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) || "doc";

  /* ————————————— data ————————————— */
  const pages = new Map();      /* id -> { meta, body } */
  const loadAll = async () => {
    await Promise.all(ALL.map(async id => {
      try {
        const r = await fetch(mdBase(VI) + id + ".md");
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

  /* ————————————— project docs ————————————— */
  const projects = new Map();   /* id -> { meta, docs: Map(slug -> {meta, body}) } */
  const firstHeading = text => {
    const m = /^---\s*\n[\s\S]*?\n---\s*\n?([\s\S]*)$/.exec(text);
    const body = m ? m[1] : text;
    const h = /^#\s+(.+)$/m.exec(body);
    return h ? h[1].replace(/\s*\{#.+\}\s*$/, "").trim() : "";
  };
  const firstPara = text => {
    const body = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
    for (const block of body.split(/\n\s*\n/)) {
      const s = block.trim();
      if (!s || /^[#>|`\-*]/.test(s)) continue;
      return s.replace(/[*_`>#]/g, "").replace(/\s+/g, " ").slice(0, 200);
    }
    return "";
  };
  /* fetch one file from a repository, trying every mirror and every candidate
     path (the requested language first, then the others).
     Returns { text, path } so the caller knows which language it got. */
  const fetchRepoFile = async (p, paths) => {
    const list = Array.isArray(paths) ? paths : [paths];
    for (const path of list) {
      for (const url of repoUrls(p, path)) {
        try {
          const r = await fetch(url);
          if (r.ok) return { text: await r.text(), path };
        } catch (e) { /* try the next mirror */ }
      }
    }
    return null;
  };
  const loadProject = async p => {
    const raw = await fetchRepoFile(p, MANIFEST_FILE);
    if (!raw) return null;
    let meta;
    try { meta = JSON.parse(raw.text); } catch (e) { return null; }

    const bases = meta.bases || {};
    const langs = meta.languages || ["en"];
    const lang = VI ? "vi" : "en";
    const entries = (meta.order || []).map(it => {
      const cands = [];
      /* a base may legitimately be "" (the repository root) — test for presence,
         not truthiness */
      if (bases[lang] !== undefined) cands.push(bases[lang] + it.file);
      for (const l of ["en", ...langs]) if (bases[l] !== undefined) cands.push(bases[l] + it.file);
      cands.push(it.file);
      return {
        slug: slugifyPath(it.file), group: it.group || "Docs", file: it.file,
        cands: [...new Set(cands)],
      };
    });

    const docs = new Map();
    await Promise.all(entries.map(async e => {
      const got = await fetchRepoFile(p, e.cands);
      if (!got) return;
      const parsed = parseFront(got.text);
      /* the shell already renders the page title — drop the leading H1 so it
         does not appear twice */
      const body = parsed.body.replace(/^(\s*)#\s+[^\n]*\n+/, "$1");
      /* which language the file actually came from — the longest matching base
         wins, so a root base ("") does not swallow the "vi/" one */
      const foundLang = Object.keys(bases)
        .filter(l => got.path.startsWith(bases[l] || ""))
        .sort((a, b) => (bases[b] || "").length - (bases[a] || "").length)[0] || lang;
      docs.set(e.slug, {
        meta: {
          slug: e.slug, group: e.group, file: e.file,
          title: parsed.meta.title || firstHeading(parsed.body) || e.slug,
          desc: parsed.meta.desc || firstPara(parsed.body),
          sourceLang: foundLang,
        },
        body,
      });
    }));

    if (!docs.size) return null;
    const groups = [];
    for (const d of docs.values()) if (!groups.includes(d.meta.group)) groups.push(d.meta.group);
    return { meta: { ...meta, id: p.id, label: p.label, repo: p.repo, branch: p.branch, groups }, docs };
  };
  const loadProjects = async () => {
    projects.clear();
    await Promise.all(PROJECTS.map(async p => {
      const data = await loadProject(p);
      if (data) projects.set(p.id, data);
    }));
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
    /* older pages linked to the launcher's guides as site routes; they now live
       in the launcher repository, under the project section */
    const LEGACY = {
      "getting-started": "projects/launcher/getting-started",
      "jit": "projects/launcher/jit",
      "runtimes": "projects/launcher/runtimes",
      "plugins": "projects/launcher/plugins-system",
      "plugins-dev": "projects/launcher/plugins-development",
    };
    $$("a[href]", rootEl).forEach(a => {
      const href = a.getAttribute("href") || "";
      const m = /^(?:\.\/|\.\.\/|\.\.\/\.\.\/)?(getting-started|jit|runtimes|plugins|plugins-dev|changelog|faq|credits|privacy|terms|index)\.html(#[^\s]*)?$/.exec(href);
      if (m && LEGACY[m[1]]) a.setAttribute("href", `#/${LEGACY[m[1]]}${m[2] || ""}`);
    });
  };
  /* links between docs of the same project keep working inside the site —
     `host-abi.md` becomes `#/projects/tgles/host-abi` */
  const rewriteProjectLinks = (rootEl, projectId) => {
    const pr = projects.get(projectId);
    if (!pr) return;
    const byFile = new Map();
    for (const d of pr.docs.values()) {
      const base = d.meta.file.split("/").pop();
      byFile.set(base.toLowerCase(), d.meta.slug);
      byFile.set(d.meta.file.toLowerCase(), d.meta.slug);
    }
    $$("a[href]", rootEl).forEach(a => {
      const href = a.getAttribute("href") || "";
      if (/^(https?:|mailto:|#|\.\.\/|\.\/)/i.test(href)) return;
      const clean = href.split("#")[0];
      if (!clean) return;
      const key = clean.replace(/^\.\//, "").toLowerCase();
      const slug = byFile.get(key) || byFile.get(clean.split("/").pop().toLowerCase());
      if (slug) a.setAttribute("href", `#/projects/${projectId}/${slug}`);
    });
  };

  /* ————————————— chrome builders ————————————— */
  const activeProjectId = () => {
    const page = route().page;
    return page.startsWith("projects/") ? page.split("/")[1] : null;
  };
  const buildSidebar = () => {
    const nav = $(".docnav");
    const html = [`<div class="grp"><span class="mono-sm">${T.docs}</span><a href="#/" data-nav="index">${T.home}</a></div>`];

    /* project docs come first — the repositories publish their own manifest, so
       the order and the groups below come straight from each repo */
    const active = activeProjectId();
    html.push(`<div class="grp"><span class="mono-sm">${T.projects}</span>`);
    for (const p of PROJECTS) {
      const pr = projects.get(p.id);
      if (!pr) {
        html.push(`<a href="#" class="off" data-nav="projects/${p.id}"><span class="n">○</span>${p.label}</a>`);
        continue;
      }
      const isOpen = active === p.id;
      html.push(`<a href="#/projects/${p.id}" data-nav="projects/${p.id}" class="${isOpen ? "on" : ""}"><span class="n">◆</span>${pr.meta.label || p.label}</a>`);
      if (!isOpen) continue;
      for (const g of pr.meta.groups) {
        const items = [...pr.docs.values()].filter(d => d.meta.group === g);
        if (!items.length) continue;
        html.push(`<div class="sub-grp"><span class="mono-sm">${g}</span>` +
          items.map(d => `<a href="#/projects/${p.id}/${d.meta.slug}" data-nav="projects/${p.id}/${d.meta.slug}">${d.meta.title}</a>`).join("") +
          `</div>`);
      }
    }
    html.push(`</div>`);

    /* the site's own pages — reference and legal, last */
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
    const projLinks = PROJECTS.map(p => `<a href="#/projects/${p.id}" data-nav="projects/${p.id}"${projects.has(p.id) ? "" : " class=\"off\""}>${p.label.toUpperCase().slice(0, 6)}</a>`).join("");
    nav.innerHTML = `<span class="rail-line" aria-hidden="true"><i></i></span>` +
      PAGES.map(id => `<a href="#/${id}" data-nav="${id}">${NAV[id]}</a>`).join("") +
      `<span class="rail-sep" aria-hidden="true"></span>` + projLinks;
  };

  /* ————————————— rendering ————————————— */
  const article = $("#doc-article");
  const prose = $(".prose", article);
  const titleEl = $("#doc-title"), descEl = $("#doc-desc"), numEl = $("#doc-num"), groupEl = $("#doc-group");
  const crumbEl = $(".docsbar .path b");
  const tocBox = $(".toc", article.closest(".article"));
  const pagerBox = $(".doc-pager", article);
  let tocIO = null;

  const route = () => {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    const i = raw.indexOf("#");
    return { page: (i === -1 ? raw : raw.slice(0, i)).toLowerCase() || "index", anchor: i === -1 ? "" : raw.slice(i + 1) };
  };
  /* a route is either a site page ("changelog") or a project page
     ("projects/tglmt/api") */
  const resolve = (page) => {
    if (pages.has(page)) return { kind: "page", id: page };
    if (page.startsWith("projects/")) {
      const [, id, slug] = page.split("/");
      const proj = projects.get(id);
      if (!proj) return { kind: "unavailable", id };
      if (!slug) return { kind: "project", id, slug: null };
      if (proj.docs.has(slug)) return { kind: "project-doc", id, slug };
      return { kind: "project", id, slug: null };
    }
    return { kind: "page", id: pages.has("index") ? "index" : (PAGES.find(p => pages.has(p)) || "index") };
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
    const pcards = PROJECTS.map((p) => {
      const pr = projects.get(p.id);
      if (!pr) {
        return `<div class="doc-card doc-card-proj off"><span class="mono-sm">${T.projects}</span><h3>${p.label}</h3><p>${VI ? "Không tải được tài liệu từ GitHub." : "Documentation could not be read from GitHub."}</p></div>`;
      }
      const n = pr.docs.size;
      return `<a class="doc-card doc-card-proj" href="#/projects/${p.id}"><span class="mono-sm">${T.projects} — ${pr.meta.groups.length} ${VI ? "nhóm" : "groups"}</span><h3>${pr.meta.label || p.label}</h3><p>${n} ${VI ? "trang tài liệu" : "documentation pages"} · ${pr.meta.repo.replace("https://github.com/", "")}</p></a>`;
    }).join("");
    const cards = PAGES.filter(id => pages.has(id)).map((id) => {
      const d = pages.get(id);
      return `<a class="doc-card" href="#/${id}"><span class="mono-sm">${String(PAGES.indexOf(id) + 1).padStart(2, "0")} — ${T.groupAlias(d.meta.group)}</span><h3>${d.meta.title}</h3><p>${d.meta.desc || ""}</p></a>`;
    }).join("");
    return `<h2 class="prose-h2">${T.projects}</h2><div class="doc-cards">${pcards}</div>` +
      `<h2 class="prose-h2">${VI ? "Tham khảo" : "Reference"}</h2><div class="doc-cards">${cards}</div>`;
  };
  /* index of one project: its docs grouped the way the repo manifest orders them */
  const projectIndexHtml = (id) => {
    const pr = projects.get(id);
    if (!pr) return "";
    const p = PROJECTS.find(x => x.id === id);
    let html = `<div class="proj-head">
      <a class="proj-repo" href="https://github.com/${pr.meta.repo}" target="_blank" rel="noopener">${pr.meta.repo.replace("https://github.com/", "")}</a>
      <p class="u-dim">${VI ? "Tài liệu được đọc trực tiếp từ kho lưu trữ này. Thứ tự trang do" : "Documentation is read straight from this repository. The page order comes from"} <code>docs/${MANIFEST_FILE}</code>.</p>
    </div>`;
    for (const g of pr.meta.groups) {
      const items = [...pr.docs.values()].filter(d => d.meta.group === g);
      if (!items.length) continue;
      html += `<h2 class="prose-h2">${g}</h2><div class="doc-cards">` +
        items.map(d => `<a class="doc-card" href="#/projects/${id}/${d.meta.slug}"><span class="mono-sm">${g}</span><h3>${d.meta.title}</h3><p>${d.meta.desc || ""}</p></a>`).join("") +
        `</div>`;
    }
    return html;
  };

  const renderCurrent = () => {
    const { page, anchor } = route();
    const r = resolve(page);
    const kind = r.kind, id = r.id, slug = r.slug;
    const proj = kind === "project" || kind === "project-doc" ? projects.get(id) : null;

    /* ——— page body ——— */
    let title, desc, group, num, body, extra = "", navKey;
    if (kind === "page") {
      const doc = pages.get(id);
      currentKey = id + "#" + anchor;
      title = doc.meta.title || "Documentation";
      desc = doc.meta.desc || "";
      group = T.groupAlias(doc.meta.group || "Reference");
      num = id === "index" ? "00" : String(PAGES.indexOf(id) + 1).padStart(2, "0");
      body = doc.body;
      extra = id === "index" ? cardHtml() : "";
      navKey = id;
    } else if (kind === "unavailable") {
      const p = PROJECTS.find(x => x.id === id);
      currentKey = "projects/" + id + "#" + anchor;
      title = p ? p.label : id;
      desc = "";
      group = T.project;
      num = "◆";
      body = "";
      extra = `<div class="callout"><span class="ck">${VI ? "KHÔNG TẢI ĐƯỢC" : "UNAVAILABLE"}</span>` +
        `<p>${VI ? "Không đọc được tài liệu của dự án này từ GitHub. Kiểm tra kết nối rồi tải lại trang." : "This project's documentation could not be read from GitHub. Check your connection and reload."}` +
        ` ${p ? `<a href="https://github.com/${p.repo}" target="_blank" rel="noopener">${p.repo}</a>` : ""}</p></div>`;
      navKey = "projects/" + id;
    } else if (kind === "project") {
      currentKey = "projects/" + id + "#" + anchor;
      title = proj.meta.label || id;
      desc = `${proj.docs.size} ${VI ? "trang tài liệu" : "documentation pages"} · ${proj.meta.repo.replace("https://github.com/", "")}`;
      group = T.project;
      num = "◆";
      body = "";
      extra = projectIndexHtml(id);
      navKey = "projects/" + id;
    } else {
      const d = proj.docs.get(slug);
      currentKey = "projects/" + id + "/" + slug + "#" + anchor;
      title = d.meta.title;
      desc = d.meta.desc || "";
      group = `${proj.meta.label} — ${d.meta.group}`;
      num = "◆";
      body = d.body;
      navKey = "projects/" + id + "/" + slug;
      if (d.meta.sourceLang !== (VI ? "vi" : "en"))
        extra = `<div class="callout"><span class="ck">${VI ? "GHI CHÚ" : "NOTE"}</span><p>${T.langFallback}.</p></div>`;
    }

    /* chrome */
    numEl.textContent = num;
    groupEl.textContent = group;
    titleEl.textContent = title;
    descEl.textContent = desc;
    descEl.style.display = desc ? "" : "none";
    if (crumbEl) crumbEl.textContent = title;
    document.title = T.pageTitle(title);
    $$("[data-nav]").forEach(a => a.classList.toggle("on", a.dataset.nav === navKey));
    if (navKey !== page) history.replaceState(null, "", "#/" + navKey);

    /* content swap with a soft rise */
    prose.classList.remove("swap"); void prose.offsetWidth; prose.classList.add("swap");
    prose.innerHTML = (body ? renderMarkdown(body) : "") + extra;
    assignHeadingIds(prose);
    rewriteLegacyLinks(prose);
    if (kind === "project-doc") rewriteProjectLinks(prose, id);

    /* right rail TOC — "On this page" (scroll-spy) */
    const heads = $$("h2[id]", prose);
    tocIO?.disconnect(); tocIO = null;
    if (tocBox) {
      if (heads.length) {
        tocBox.innerHTML = `<span class="mono-sm">${T.toc}</span>` + heads.map(h => `<a href="#/${navKey}#${h.id}" data-toc="${h.id}">${h.textContent}</a>`).join("");
        tocBox.style.display = "";
        tocIO = new IntersectionObserver(en => {
          for (const e of en) if (e.isIntersecting) $$("a", tocBox).forEach(a => a.classList.toggle("on", a.dataset.toc === e.target.id));
        }, { rootMargin: "-12% 0px -68% 0px" });
        heads.forEach(h => tocIO.observe(h));
      } else { tocBox.innerHTML = ""; tocBox.style.display = "none"; }
    }

    /* prev / next pager */
    if (kind === "page") {
      const cur = PAGES.indexOf(id);
      const prev = PAGES[cur - 1], next = PAGES[cur + 1];
      pagerBox.innerHTML = id === "index"
        ? `<a class="pager" href="#/${PAGES[0]}"><span class="mono-sm">→ ${T.next}</span><span class="pl">${pages.get(PAGES[0])?.meta.title || PAGES[0]}</span></a><span></span>`
        : `${prev ? `<a class="pager" href="#/${prev}"><span class="mono-sm">← ${T.prev}</span><span class="pl">${pages.get(prev)?.meta.title || prev}</span></a>` : "<span></span>"}
           ${next ? `<a class="pager next" href="#/${next}"><span class="mono-sm">${T.next} →</span><span class="pl">${pages.get(next)?.meta.title || next}</span></a>` : "<span></span>"}`;
    } else if (kind === "project-doc") {
      const slugs = [...proj.docs.keys()];
      const cur = slugs.indexOf(slug);
      const prev = slugs[cur - 1], next = slugs[cur + 1];
      const prevDoc = prev ? proj.docs.get(prev) : null;
      const nextDoc = next ? proj.docs.get(next) : null;
      pagerBox.innerHTML =
        `${prevDoc ? `<a class="pager" href="#/projects/${id}/${prev}"><span class="mono-sm">← ${T.prev}</span><span class="pl">${prevDoc.meta.title}</span></a>` : `<a class="pager" href="#/projects/${id}"><span class="mono-sm">← ${T.prev}</span><span class="pl">${proj.meta.label}</span></a>`}
         ${nextDoc ? `<a class="pager next" href="#/projects/${id}/${next}"><span class="mono-sm">${T.next} →</span><span class="pl">${nextDoc.meta.title}</span></a>` : `<a class="pager next" href="#/projects/${id}"><span class="mono-sm">${T.next} →</span><span class="pl">${proj.meta.label}</span></a>`}`;
    } else if (kind === "unavailable") {
      pagerBox.innerHTML = `<a class="pager" href="#/"><span class="mono-sm">← ${T.prev}</span><span class="pl">${T.home}</span></a><span></span>`;
    } else {
      pagerBox.innerHTML = `<a class="pager" href="#/projects/launcher/getting-started"><span class="mono-sm">← ${T.prev}</span><span class="pl">${VI ? "Bắt đầu" : "Getting started"}</span></a><span></span>`;
    }

    /* scroll */
    if (anchor && document.getElementById(anchor)) requestAnimationFrame(() => jumpTo(anchor));
    else smoothTop();
  };

  /* sidebar toggle — drawer on <1024, collapse/expand rail on ≥1024 (desktop + landscape tablets) */
  const mqWide = matchMedia("(min-width: 1024px)");
  $(".sb-toggle")?.addEventListener("click", () => {
    const d = document.documentElement;
    if (mqWide.matches) d.classList.toggle("sb-collapsed");
    else d.classList.toggle("sb-open");
  });

  /* ————————————— boot ————————————— */
  let currentKey = "";
  const onHashChange = () => {
    const { page, anchor } = route();
    const r = resolve(page);
    const id = r.kind === "page" ? r.id : (r.kind === "project" ? "projects/" + r.id : "projects/" + r.id + "/" + r.slug);
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
    /* a project opened from the sidebar expands its doc list — rebuild the chrome */
    buildSidebar();
    buildRailNav();
    renderCurrent();
    patchLangLinks();
  };

  Promise.all([loadAll(), loadProjects()]).then(() => {
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
  const shellPath = (vi) => siteRoot + (vi ? "vi/docs/index.html" : "docs/index.html");
  const syncSiteLabels = () => {
    $$(".js-site-label").forEach(a => { a.textContent = VI ? a.dataset.vi : a.dataset.en; });
    const meta = $("#js-meta-desc");
    if (meta) meta.setAttribute("content", VI ? meta.dataset.vi : meta.dataset.en);
    $$(".js-langlink").forEach(a => { a.setAttribute("aria-label", VI ? "English" : "Tiếng Việt"); a.textContent = VI ? "EN" : "VI"; });
  };
  const patchLangLinks = () => {
    const r = route().page, anchor = route().anchor;
    const base = shellPath(!VI); /* the OTHER language's shell */
    const cue = "#/" + r + (anchor ? "#" + anchor : "");
    $$(".js-langlink").forEach(a => a.setAttribute("href", `${base}${cue}`));
  };
  const switchLang = async (toVi) => {
    if (toVi === VI) return;
    VI = toVi;
    T = mkT(VI);
    document.documentElement.lang = VI ? "vi" : "en";
    await Promise.all([loadAll(), loadProjects()]);   /* refetch docs + project docs */
    buildSidebar();
    buildRailNav();
    syncSiteLabels();
    const { page, anchor } = route();
    history.replaceState(null, "", shellPath(VI) + `#/${page}${anchor ? "#" + anchor : ""}`);
    currentKey = "";             /* force a full re-render in the new language */
    renderCurrent();
    patchLangLinks();
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
    const r = resolve(route().page);
    if (r.kind === "project-doc") {
      /* inside a project the pager walks that project's own pages */
      const pr = projects.get(r.id);
      if (!pr) return;
      const slugs = [...pr.docs.keys()];
      const cur = slugs.indexOf(r.slug);
      if (e.key === "[" && cur > 0) location.hash = `#/projects/${r.id}/${slugs[cur - 1]}`;
      else if (e.key === "]" && cur < slugs.length - 1) location.hash = `#/projects/${r.id}/${slugs[cur + 1]}`;
      return;
    }
    if (r.kind !== "page") return;
    const cur = PAGES.indexOf(r.id);
    if (cur === -1) return;
    if (e.key === "[" && cur > 0) location.hash = "#/" + PAGES[cur - 1];
    else if (e.key === "]" && cur < PAGES.length - 1) location.hash = "#/" + PAGES[cur + 1];
  });
})();
