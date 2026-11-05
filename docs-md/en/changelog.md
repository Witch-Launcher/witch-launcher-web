---
title: "Changelog"
group: "Reference"
desc: "What the fork has changed, release by release. The current version is 0.0.4."
---

## 0.0.4 {#v0-0-4}
0.0.4 is the biggest release since the fork. The Metal-backed **TGLMT** renderer learned to run shader packs through **Iris**, Java runtime and LWJGL downloads moved fully in-app with multi-threaded fetching, and the control layer picked up a batch of new toggles. Signed builds and assets are on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Highlights
- **TGLMT with Iris support** — Minecraft 26.3 and the Metal-path OpenGL 4.6 renderer can run shader packs through Iris; Shader Makeup is verified working.
- **Font picker** — custom launcher typography, alongside new UI size controls.
- **In-app runtime downloads** — Java runtimes and LWJGL update or download from the launcher, with multi-threaded downloading for the heavy game assets too.
- **Gesture toggles** — options for hold-screen-to-break/place blocks, mouse-cursor and scroll gestures, and double-tap the hotbar to move the held item to the off-hand (the touch equivalent of pressing <kbd>F</kbd>).
- **F3 device information** — the debug screen now reports the device chip, iOS version, launcher name and version, build code and release type (dev or official).
- **Custom controls** — input and output buttons, revised legacy syntax and new formatting options, compatible with Zalith Launcher 2’s control format.
- **52 full language packs** — every supported language ships enabled, including right-to-left locales.
- **Vulkan 1.4** — the Vulkan stack moved to 1.4, alongside an updated MobileGL with optimizations.
- **Performance recordable** — performance charts are exported from built-in recordings, plus anti-aliasing for the mouse cursor.
- **Fixed** — JIT and JDK support extended to every device; Java 8 and 17; crashes with Minecraft 26.3 on 1.8.9, 1.16.5 and 1.18.2; and a wide renderer sweep covering MoltenVK, Zink, MobileGL, MobileGlues, LTW, gl4ES and Tinygl4angle.

> [!NOTE] The renderer sweep repaired a lot, but experimental renderers can still crash or render incorrectly — if one misbehaves, start again from the **Auto** renderer (see the [FAQ](#/faq#performance)).

## 0.0.3 {#v0-0-3}
0.0.3 laid the groundwork the current fork lives on: profiles, personalization, the first TGLMT milestone, and better debugging for iOS 26 and 27. Assets are on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Highlights
- **TGLMT renderer** — full Sodium support on the Metal-path renderer (Iris shader support followed only in 0.0.4), plus fixes of its own.
- **Profiles** — isolated game profiles with their own settings, mods, shaders, resource packs and worlds.
- **Personalization** — themes, accents, blur, borders, corner radius, custom fonts and app icons.
- **iOS 26 / 27 JIT debug** — dedicated debug logging for JIT troubleshooting on the newest iOS releases.
- **New portrait screen** — a portrait layout for phones, with fixes to the landscape and portrait switching.
- **Fixed** — launcher UI and option settings that were not applying, MobileGL renderer, and general UI/UX optimization.

## Earlier {#earlier}
Releases from before the fork carry the Amethyst versioning they inherited — the 1.x and 2.x series from the upstream line. Those tags, notes and assets stay archived on the [GitHub releases page](https://github.com/Witch-Launcher/Witch_launcher/releases), together with every build above.
