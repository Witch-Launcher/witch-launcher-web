# Witch Launcher — Website

Official static site for **Witch Launcher** (iOS Minecraft: Java Edition launcher).
Pure HTML/CSS/vanilla JS — no build step, no external requests (system fonts only).

## Run

```bash
python3 -m http.server 8000
open http://localhost:8000
```

## Structure

```
index.html            Landing (EN) — hero, features, tech, tour, install, download
vi/index.html         Landing (VI)
docs/index.html       Docs shell EN — renders /docs-md/en/*.md at runtime
vi/docs/index.html    Docs shell VI — renders /docs-md/vi/*.md at runtime
docs/<page>.html      Redirect stubs (/docs/#/<page>) for legacy bookmarks
docs-md/en/*.md       English documentation sources (front-matter + markdown)
docs-md/vi/*.md       Vietnamese documentation sources
assets/
  css/style.css       Design tokens (dark default / light), rail layout, sections, docs
  js/marked.min.js    Vendored Markdown parser (marked v12, MIT)
  js/docs-runtime.js  Markdown → DOM runtime: routing (#/<page>[#anchor]),
                      sidebar/rail/TOC/pager built from the md files themselves,
                      callout support (> [!NOTE|TIP|IMPORTANT|WARNING])
  js/main.js          Theme wipe (View Transitions), loader, reveals, parallax,
                      GitHub releases fetch + fallback
  brand/              Official SVG marks (diamond mark, wordmark, favicon)
  img/                Optimized renders (hero iPad, device rows, tour, perf plates)
sitemap.xml           Update the placeholder domain before publishing
robots.txt
.nojekyll             Keep GitHub Pages from processing the .md files
```

## Docs runtime

Docs are **plain Markdown files with tiny front-matter**:

```md
---
title: "JIT & Built-in JIT"
group: "Overview"
desc: "Why JIT exists, every enable method and the built-in helper."
---

## Overview {#overview}
…
```

Everything else is derived at runtime — no index files:

- **Sidebar / rail nav** — built from `docs-md/<lang>/*.md` front-matter, in the
  order pages are listed in `docs-runtime.js` (`PAGES`).
- **In-page TOC, breadcrumb, prev/next pager, docs title/cards** — derived
  from the rendered headings and each md's `title`/`desc`.
- **Routing** — `#/jit`, `#/jit#built-in-jit`. `hashchange` swaps the article in
  place (chrome persists, no reload, no loader replay). `[` / `]` switch pages.
- **In-page section bar** — a sticky horizontal bar of numbered chips
  (`01 Requirements…`) sits under the docs bar; every chip glides to its
  section and the active section is highlighted by the scroll-spy.
- **Legacy rule** — heading `{#custom-id}` pins a heading's id so deep links
  survive renames; without it a slug is derived from the heading text.
- **Callouts** — `> [!NOTE] …` in Markdown renders as a `.callout` block.
- **Editing docs** — edit `docs-md/{en,vi}/<page>.md`. Both languages mirror.

## Notes

- **Theme toggle** — the dark/light switch runs a slow circular wipe (~1.25s)
  from the button via the View Transitions API with every color transition
  frozen for the duration (`html.wipe-snap`) — the flip is atomic.
- **Language switching** — pages cross-fade with a branded page-to-page curtain
  (cross-document View Transitions). The docs switch swaps **all Markdown in
  place** via the runtime (no reload at all) and pulses a fade overlay;
  the active shell's URL is updated with `replaceState`.
- **Witch loader** — every page opens with the official diamond mark drawing
  itself as a stroke, progress driven by the page's actual eager assets
  (preloaded hero image + eager `<img>` elements). When full, the mark fills,
  flies to the rail's logo position and fades the loader away while the hero
  choreography starts. Respects `prefers-reduced-motion` (skipped entirely).
- **Tour** — interactive showcase of all 11 launcher screens: vertical menu on
  the left, cinematic stage on the right, auto-advancing with a visible
  progress bar per item. Hover / focus pauses it; keyboard arrows switch.
- **Everything is colored** — images render with their original color, never
  grayscale; B/W is reserved for layout and line work.
- **Smooth scroll** — desktop/pointer:fine gets an inertial lerped scroll
  engine with full keyboard support (Space/Arrows/PageUp/Down/Home/End).
  Touch devices keep native momentum scrolling.
- **Download section** renders instantly from a bundled fallback of the GitHub
  releases, then re-renders with live data from the GitHub API
  (`Witch-Launcher/Witch_launcher`), which also fills the hero star count.
- **Reduced motion** is respected everywhere (`prefers-reduced-motion`).
- Images were resampled with `sips` from the 4K masters in the EffectCraft
  asset vault; brand logos are the original SVG set.

## Deploy

Push as-is to any static host (GitHub Pages / Netlify / Cloudflare Pages).
Before publishing, replace the placeholder domain in `sitemap.xml` and
`robots.txt`. `.nojekyll` is kept so the `docs-md/*.md` files are served raw.
