---
title: "Changelog"
group: "Reference"
desc: "What the fork has changed, release by release. Sourced from the launcher's news.md."
---

## 0.0.4 {#v0-0-4}
The biggest release since the fork. The Metal-backed **TGLMT** renderer learned to run shader packs through **Iris**, Java runtime and LWJGL downloads moved fully in-app with multi-threaded fetching, and the control layer picked up a batch of new toggles. Signed builds and assets are on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Added
- **TGLMT with Iris support** — the Metal-path OpenGL 4.6 renderer runs shader packs; Shader Makeup is verified working.
- **Font picker** — custom launcher typography, alongside new UI size controls.
- **In-app runtime downloads** — Java runtimes and LWJGL update or download from the launcher, with multi-threaded downloading for the heavy game assets too.
- **Gesture toggles** — options for hold-screen-to-break/place blocks, mouse-cursor and scroll gestures, and double-tap the hotbar to move the held item to the off-hand (the touch equivalent of pressing <kbd>F</kbd>).
- **F3 device information** — the debug screen now reports the device chip, iOS version, launcher name and version, build code and release type (dev or official).
- **Custom controls** — input and output buttons, revised legacy syntax and new formatting options, compatible with Zalith Launcher 2's control format.
- **52 full language packs** — every supported language ships enabled, including right-to-left locales.
- **Vulkan 1.4** — the Vulkan stack moved to 1.4, alongside an updated MobileGL with optimizations.
- **Old MobileGlues build** — the previous MobileGlues version is kept available for older worlds.
- **Anti-aliasing for the mouse cursor** — smoother edges on the custom pointer.
- **Performance charts** — export the recorded chart, now exported straight from built-in recordings.

### Updated
- **Custom control syntax** — supports Zalith Launcher 2; the legacy syntax was revised and formatting options added.
- **MobileGL** — optimizations and a refresh.
- **Mouse cursor style** — the cursor art and its sizing were changed.
- **Vulkan 1.4** — the Vulkan stack moved forward with the MobileGL refresh.

### Fixed
- **JIT and Java Development Kit** — both now work on every supported device.
- **Java 8 and 17** — the oldest supported runtimes boot correctly.
- **UI crash** — a launcher crash on some screens is gone.
- **Mouse cursor sizing error** — the pointer no longer scales incorrectly.
- **Hidden files** — hidden files are no longer shown where they should not be.
- **Launcher, Java runtime and LWJGL updates** — the in-app update path is reliable.
- **Map downloads** — maps download again.
- **Setting border and bar** — the settings panel border and the top bar render correctly.
- **Missing background for the table account** — the account row paints its background.
- **Renderer sweep** — MoltenVK, Zink (V25.0.7), MobileGL, LTW, gl4es, Tinygl4angle and MobileGlues were all repaired.
- **Minecraft 26.3 crashes** — fixed on 1.8.9, 1.16.5 and 1.18.2.
- **iOS 27 mouse cursor** — hidden on the affected releases (unverified).
- **Logo change** and assorted small bugs.

> [!NOTE] The renderer sweep repaired a lot, but experimental renderers can still crash or render incorrectly — if one misbehaves, start again from the **Auto** renderer (see the [FAQ](#/faq#performance)).

## 0.0.3 {#v0-0-3}
0.0.3 laid the groundwork the current fork lives on: profiles, personalization, the first TGLMT milestone, and better debugging for iOS 26 and 27. Assets are on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Added
- **TGLMT renderer** — full Sodium support on the Metal-path renderer (Iris shader support followed only in 0.0.4), plus fixes of its own.
- **Profiles** — isolated game profiles with their own settings, mods, shaders, resource packs and worlds.
- **Personalization** — themes, accents, blur, borders, corner radius, custom fonts and app icons.
- **iOS 26 / 27 JIT debug** — dedicated debug logging for JIT troubleshooting on the newest iOS releases.
- **New portrait screen** — a portrait layout for phones, with fixes to the landscape and portrait switching.

### Fixed
- **Launcher UI and option settings** — settings that were not applying now do.
- **MobileGL renderer** — rendering problems in the MobileGL path.
- **General UI/UX optimization** — across the launcher.
- **Panels** — layout fixes in several panels.

## Earlier {#earlier}
Releases from before the fork carry the Amethyst versioning they inherited — the 1.x and 2.x series from the upstream line. Those tags, notes and assets stay archived on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases), together with every build above.

> [!NOTE] This page mirrors the launcher's [`news.md`](https://github.com/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS/blob/main/news.md) — the repository file is the source of truth.
