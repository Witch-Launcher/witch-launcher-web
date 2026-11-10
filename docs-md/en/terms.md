---
title: "Terms of Service"
group: "Legal"
desc: "Terms governing your use of Witch Launcher, the plugin system, and related services."
---

## Terms of Service {#overview}

These Terms of Service ("Terms") govern your use of Witch Launcher (the "launcher"), its documentation, the plugin system, the Witch registry, and related services provided by DuyAnh662 (Za_d626) and contributors.

By downloading, installing or using the launcher, you agree to these Terms. If you do not agree, do not use the launcher.

## 1. What Witch Launcher is {#what-is}

Witch Launcher is a free, open-source (GPL-3.0) community fork of Amethyst-iOS that lets you run Minecraft: Java Edition on iPhone and iPad. It provides:

- Version, loader and runtime management (Java 8 → 25, Fabric, Quilt, Forge, NeoForge, OptiFine)
- Six renderers (gl4es, ANGLE, MobileGlues, Zink, LTW, TGLMT) over Metal
- A signed plugin system (`.plgw`) with JavaScript, theme and native extensions
- In-app content browsing for Modrinth and CurseForge

## 2. What we do not provide {#what-not}

| We do not... | Because... |
| --- | --- |
| Ship Minecraft: Java Edition game files | You must own the game and supply your own files |
| Ship Microsoft or Mojang certificates | You sign and sideload the launcher yourself |
| Provide Minecraft accounts | Use your own Microsoft, local, demo or Ely.by account |
| Guarantee uptime of third-party services | Modrinth, CurseForge, GitHub and the Witch registry are independent |
| Support App Store distribution | The launcher is sideload-only (SideStore, AltStore, TrollStore, jailbreak) |

## 3. Your responsibilities {#responsibilities}

You are responsible for:

- Owning a legitimate copy of Minecraft: Java Edition
- Signing and installing the launcher using a method you choose (SideStore, AltStore, TrollStore, jailbreak or your own certificates)
- Keeping your device, pairing files, signing certificates and provisioning profiles secure
- Reviewing plugin source code before installing native plugins (native code runs unsandboxed in the launcher process)
- Complying with the terms of any third-party service you connect to (Modrinth, CurseForge, Ely.by, etc.)

## 4. Plugin system {#plugins}

Plugins are signed `.plgw` packages. By installing a plugin you acknowledge:

- Native plugins run in the launcher process and are **not sandboxed**. A native crash can terminate the launcher.
- You install plugins at your own risk. Prefer JavaScript and theme plugins over native plugins.
- Plugin verification by the Witch registry confirms package integrity and publisher identity at submission time — it is not a warranty of safety.
- You may pin developer keys locally ("Trust this developer key"); this is your own trust decision.
- Revoked plugins are disabled by the launcher on the next verification check.

## 5. Third-party services {#third-party}

The launcher may connect to:

- **GitHub** — launcher releases, runtime manifests, plugin registry source
- **Modrinth / CurseForge** — mods, modpacks, shaders, resource packs
- **MCHeads** — avatar images
- **Witch registry** — plugin verification (`witch-worker.vvvuduyanh2012.workers.dev`)

These services are operated independently. Their own terms and privacy policies apply. Witch Launcher is not responsible for their availability, content, or practices.

## 6. License {#license}

Witch Launcher is distributed under the **GNU General Public License v3.0**. The complete text is in the [LICENSE file](https://github.com/Witch-Launcher/Witch_launcher/blob/main/LICENSE). Third-party components keep their own licenses (see [credits](#/credits)).

You may modify and redistribute the launcher under GPL-3.0, but you may not imply affiliation with Mojang Studios, Microsoft or the Amethyst project.

## 7. No affiliation {#no-affiliation}

Witch Launcher is **not affiliated with, endorsed by, or connected to** Mojang Studios, Microsoft, Sony, Apple, or the Amethyst project. Minecraft is a trademark of Mojang Studios. All trademarks belong to their respective owners.

## 8. No warranty {#no-warranty}

The launcher is provided **"as is"**, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the maintainers or contributors be liable for any claim, damages or other liability arising from the use of the launcher.

## 9. JIT and iOS limitations {#jit}

Just-in-time compilation (required to run Java on iOS) depends on iOS security features, jailbreak state, sideloading method, and Apple software updates. A JIT method that works today may stop working after an iOS update. The maintainers do not guarantee any specific JIT method will continue to work.

## 10. Termination {#termination}

Your right to use the launcher ends if you:

- Violate these Terms
- Distribute modified versions in breach of GPL-3.0
- Use the launcher to infringe Minecraft or any third-party rights

## 11. Changes to these Terms {#changes}

We may update these Terms from time to time. The current version is always at `/docs/#/terms`. Continued use after changes take effect means you accept the updated Terms.

## 12. Contact {#contact}

Questions about these Terms: open an issue on the [Witch Launcher GitHub repository](https://github.com/Witch-Launcher/Witch_launcher) or contact the maintainer through the links on the [credits page](#/credits).

---

*Governing law: These Terms are governed by the laws applicable to the maintainer's jurisdiction. Disputes are resolved in the courts of that jurisdiction.*
