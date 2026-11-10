---
title: "Documentation"
group: "Reference"
desc: "Everything about running Minecraft: Java Edition on iPhone and iPad — from the first sideload to plugins, renderers and release history."
---

## Where to next {#next}
New to the launcher? Start with [Getting started](#/projects/launcher/getting-started), then keep the [FAQ](#/faq) open in a tab for launch week. Project news, screenshots and downloads live on the [main site](../index.html).

## The projects behind the launcher {#projects}
The launcher is only the shell. The rendering stack, the compatibility layers and the plugin runtime all live in their own repositories, and each one publishes its own documentation.

Every project below is read straight from its repository — the page order comes from the `docs/DOCS_MANIFEST.json` that the repository ships, so a push updates these pages without touching this site.

| Project | What it is | Licence |
| --- | --- | --- |
| **Witch Launcher** | The iOS launcher itself — versions, loaders, runtimes, accounts, plugins | GPL-3.0 |
| **TGLMT** | OpenGL 4.6 Core running on Metal — the fastest renderer path | MIT |
| **TGLES** | OpenGL ES 3.2 on Metal — the compatibility layer behind MobileGL | MIT |
| **MetalCompat** | A compatibility runtime that maximizes modern Metal on legacy Apple GPUs | MIT |
| **MetalBridge** | A Swift bridge that adapts macOS-only Metal APIs to public iOS Metal | — |

> [!TIP] Press <kbd>[</kbd> and <kbd>]</kbd> to move between pages. Inside a project the pager walks that project's own pages in manifest order.
