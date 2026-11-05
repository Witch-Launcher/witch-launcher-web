---
title: "FAQ"
group: "Reference"
desc: "Short answers to the questions that come up most. Deeper guides are linked inline."
---

## Setup & JIT {#setup-jit}
### Why does the game say “Waiting for JIT”?
Minecraft: Java Edition cannot start without just-in-time compilation, and the banner means Witch’s JIT helper has not activated yet. Run the checklist for your install method, then relaunch:

- **SideStore / AltStore** — attach the debugging VPN to Witch so the <kbd>CS_DEBUGGED</kbd> process stays alive, or launch via **StikDebug**.
- **StikDebug** — keep it attached to Witch for the whole session.
- **TrollStore** — enable the **URL Scheme** option in TrollStore if Witch keeps waiting.
- **Built-in StikJIT (iOS 17.4+)** — provide the pairing file in Settings → Game → JIT and connect LocalDevVPN. Details in the [JIT guide](#/jit).
- **Jailbroken** — turn on your jail’s JIT enabler and pick the matching method in Settings.

System updates can break a setup that worked yesterday — re-check the debugger connection, the VPN and the TrollStore URL Scheme before assuming the app is at fault.

### What is different on iOS 26 and 27?
JIT on these releases is fragile: StikDebug must stay attached while the game runs, the `UniversalJIT26.js` script is copied to the clipboard when it is needed, and a future OS update can silently change what works. 0.0.3 added dedicated JIT debug logging for exactly this case — reproduce the issue and read the log before reporting.

> [!IMPORTANT] On iOS 26 and 27, leave StikDebug attached until Minecraft has fully closed. Detaching mid-session is the most common cause of a game that dies a few minutes after launch.

## Performance & renderers {#performance}
### Which renderer should I pick?
**Start with Auto.** Settings → Renderer & Display offers several, and renderers marked experimental can crash or render part of the world incorrectly. When you want to push further:

- **TGLMT** — OpenGL 4.6 Core through Metal, the fastest path on A11 Bionic and newer. Reach for it on recent devices, especially for 1.17+ worlds.
- **MobileGlues / LTW** — OpenGL 4.0 / 3.3 paths for 1.17+, still experimental.
- **Zink** — Mesa 25 over MoltenVK, OpenGL 4.1.
- **gl4es / MetalANGLE** — the compatibility roads for older Minecraft versions.

Switch back to Auto before filing a bug about a broken world render.

### Do shaders work?
Yes — through **TGLMT** with **Iris**. Sodium support landed in 0.0.3 and Iris shader packs in 0.0.4; Shader Makeup is verified working. No other renderer currently has a shader path, so shader packs require TGLMT on a Metal-capable, A11-or-newer device. Shader packs are also sensitive to the Minecraft version — pair the pack with the version its creators built it for.

### What does Frame Generation cost?
Frame Generation interpolates or extrapolates frames (Motion-Adaptive GPU and Camera 3D Reproject modes) and requires the **MoltenVK** renderer with Metal compute support. The price is real: it draws more battery and runs the device noticeably hotter. It is a nice tool for docked or plugged-in sessions — expect it to fight you when the phone is in your pocket.

> [!TIP] If the device gets warm, combine Frame Generation with resolution scaling or FSR 1.0 in Settings → Renderer & Display instead of raising the base framerate.

## Content & accounts {#content}
### Why are my mods not loading?
Check the four things content usually demands:

- **Version** — the mod, pack or shader must exist for your selected Minecraft version.
- **Loader** — Fabric, Quilt, Forge, NeoForge or OptiFine must match what the content expects; loaders install from the version picker.
- **Renderer** — some mods call paths only some renderers provide.
- **Memory** — raise the memory allocation in JVM arguments if the game dies while loading; auto RAM management helps on small devices.

Profiles are isolated: mods and resource packs installed into the current profile do not appear in another one, so confirm you launched the profile you edited.

### My CurseForge modpack will not install. What now?
CurseForge packs are distributed with a `manifest.json` that lists every download. One-tap installation is not available for every pack — when the browser refuses one, download the archive and import it manually; the launcher will resolve the manifest and fetch the files it can. If specific files still fail, they are usually tied to an API outage on the provider’s side — online content features depend on third-party services and can be intermittently unavailable.

### How do I report a bug?
Open an [issue on GitHub](https://github.com/Witch-Launcher/Witch_launcher) with everything below — reports missing halves of this get delayed the longest:

- device model and iOS / iPadOS version
- Witch Launcher version
- renderer and Minecraft version
- mod loader and a list of installed mods
- steps to reproduce
- the relevant log or crash report

Pull requests are welcome too, but never commit signing certificates, provisioning profiles, API keys or other secrets.
