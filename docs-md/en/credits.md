---
title: "Credits"
group: "Reference"
desc: "The person, the projects and the stack Witch Launcher stands on."
---

## Author {#author}

Witch Launcher is an independent, community-maintained fork of Amethyst, maintained by **DuyAnh662 (Za_d626)**.

> [!NOTE] [Discord](https://discord.gg/9JYymD7EY) · [TikTok](https://tiktok.com/@za_d626) · [YouTube](https://youtube.com/@za_d626) · [X](https://x.com/duyanh662)

## Lineage {#lineage}

Nothing here starts from empty tables — the launcher descends from fifteen years of people putting Minecraft: Java Edition on the wrong hardware:

```
Boardwalk
    │
    └── PojavLauncher (PojavLauncherTeam)
          │
          └── AngelAuraMC / Amethyst-iOS
                │
                └── Amethyst-iOS-25 (fork by Catsruledogs)
                      │
                      └── Witch Launcher
                            └── iOS / iPadOS
```

See the roots for yourself: [Boardwalk](https://github.com/zhuowei/Boardwalk), [PojavLauncher](https://github.com/PojavLauncherTeam), [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) and [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25). Upstream contributors deserve the deepest thanks, in particular **@crystall1nedev** and **@khanhduytran0** for the iOS port, **@artdeell**, **@Mathius-Boulay**, **@zhuowei**, **@jkcoxson**, **@Diatrus**, **@Catsruledogs** and **@T1k-T1k**.

## Third-party components {#third-party}

Roughly twenty-five projects ship inside Witch Launcher. The list below is the one the repository carries — every component with its own license and copyright.

| Component | License | Role |
| --- | --- | --- |
| [Witch](https://github.com/Ynnyny/Witch_launcher) | GPL-3.0 | The launcher project |
| [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) | GPL-3.0 | Direct fork base — the touch-first launcher and iOS port |
| [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25) | GPL-3.0 | The maintained 2025 branch Witch continues |
| [Caciocavallo](https://github.com/PojavLauncherTeam/caciocavallo) | GPL-2.0 | AWT interface toolkit on top of Java 8 |
| [jsr305](https://code.google.com/p/jsr-305) | BSD-3-Clause | Annotations used across the Java sources |
| [Boardwalk](https://github.com/zhuowei/Boardwalk) | Apache-2.0 | The first Minecraft: Java Edition port to iOS |
| [gl4es](https://github.com/ptitSeb/gl4es) | MIT | OpenGL 2.1 translation layer for older versions |
| [Mesa 3D](https://gitlab.freedesktop.org/mesa/mesa) | MIT | OpenGL behind the Zink renderer |
| [MetalANGLE](https://github.com/khanhduytran0/metalangle) | BSD-2-Clause | ANGLE running on Metal, OpenGL ES renderer |
| [MoltenVK](https://github.com/KhronosGroup/MoltenVK) | Apache-2.0 | Vulkan over Metal; basis of Zink and Frame Generation |
| [openal-soft](https://github.com/kcat/openal-soft) | LGPL-2.0 | Game audio output |
| [Azul Zulu JDK](https://www.azul.com/downloads/?package=jdk) | GPLv2 + Classpath Exception | Bundled Java runtimes 8 / 17 / 21 / 25 |
| [LWJGL3](https://github.com/PojavLauncherTeam/lwjgl3) | BSD-3-Clause | Window, input and OpenGL bindings for the game |
| [LWJGLX](https://github.com/PojavLauncherTeam/lwjglx) | unknown | LWJGL2 API compatibility layer for LWJGL3 |
| [DBNumberedSlider](https://github.com/khanhduytran0/DBNumberedSlider) | Apache-2.0 | Stepper control used in the settings screens |
| [fishhook](https://github.com/khanhduytran0/fishhook) | BSD-3-Clause | Runtime function hooking |
| [shaderc](https://github.com/khanhduytran0/shaderc) | Apache-2.0 | Shader compilation used by Vulkan renderers |
| [NRFileManager](https://github.com/mozilla-mobile/firefox-ios) | MPL-2.0 | File provider used by the document picker |
| [AltKit](https://github.com/rileytestut/AltKit) | — | App installation helper |
| [UnzipKit](https://github.com/abbeycode/UnzipKit) | BSD-2-Clause | Archive extraction for mods and packs |
| [DyldDeNeuralyzer](https://github.com/xpn/DyldDeNeuralyzer) | — | Bypasses library validation for the external runtime |
| [LTW](https://github.com/MojoLauncher/LTW) | LGPL-3.0 | Experimental OpenGL 3.3 renderer for 1.17+ |
| [MCHeads](https://mc-heads.net) | Service | Minecraft avatar images, freely provided |

### Smaller parts filling the seams

**StikJIT** (MPL-2.0) — the embedded built-in JIT helper · **StikDebug** (AGPL-3.0) — JIT scripts and the pairing guide · **LocalDevVPN** (StosVPN) — the loopback VPN hand-off used for JIT activation · **Husk** (GPL-2.0-or-later) — the reference implementation of the app-extension JIT helper · **MMMarkdown** (MIT) — Markdown rendering for the main menu.

The authoritative list with links and license texts lives in the upstream [`credits.md`](https://github.com/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS/blob/main/credits.md).

## License {#license}

Witch Launcher is distributed under the **GNU General Public License v3.0**; the complete text is in the [`LICENSE` file](https://github.com/Witch-Launcher/Witch_launcher/blob/main/LICENSE) in the repository. Every third-party component listed above keeps its own license and copyright, and their terms travel with their builds.

Tiny disclaimer, kept in text form: Minecraft is a trademark of Mojang Studios. Witch Launcher is not affiliated with Mojang Studios, Microsoft, or the Amethyst project, and it does not ship game files or certificates.
