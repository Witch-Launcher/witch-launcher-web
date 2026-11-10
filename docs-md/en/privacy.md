---
title: "Privacy Policy"
group: "Legal"
desc: "What Witch Launcher collects, what it does not, and how your data is handled."
---

## Privacy at a glance {#overview}

Witch Launcher is a community, open-source launcher for Minecraft: Java Edition on iPhone and iPad. It is **GPL-3.0** licensed, carries **no ads**, **no tracking**, and **no telemetry** by design.

| Question | Answer |
| --- | --- |
| Do we collect personal data? | **No.** Witch Launcher does not collect, store, or transmit any personal data about you. |
| Do we track you? | **No.** There is no analytics, no advertising ID, no fingerprinting, and no user profiling. |
| Do we sell data? | **No.** There is nothing to sell because nothing is collected. |
| Do we ship game files? | **No.** You must supply your own Minecraft: Java Edition files and account. |
| Do we require an account? | **No.** Local (offline) play works without any account. Microsoft, demo and Ely.by accounts are optional. |

## What the launcher may access {#access}

Witch Launcher runs entirely on your device. The following are accessed **locally only** and never leave your device unless you explicitly initiate them:

| Access | Purpose | Leaves device? |
| --- | --- | --- |
| Device storage | Store your game versions, mods, worlds, shaders, plugin packages (`.plgw`), settings (`plugins.json`, `state.json`) and logs | No |
| Network (your choice) | Download Java runtimes, LWJGL, mods, modpacks, shader packs and resource packs from Modrinth, CurseForge or other mirrors you configure | Yes — only when you trigger a download |
| Network (auth) | Sign in with Microsoft, Ely.by or a local account to validate your Minecraft: Java Edition ownership | Yes — only when you sign in |
| Camera / microphone | **Never accessed** | No |
| Contacts / location / health | **Never accessed** | No |

## Accounts and authentication {#accounts}

If you choose to sign in with a Microsoft, Ely.by or demo account:

- Authentication happens through the service's own web flow (OAuth / device code). Witch Launcher does **not** see or store your password.
- Session tokens are stored in the launcher's private app directory on your device, keyed to your profile, and used only to launch Minecraft: Java Edition.
- You can remove any account at any time from **Settings → Accounts**. Removing it deletes the stored session data.

## Third-party services {#third-party}

When you use optional content features, your device may connect to third-party services. These are **not operated by Witch Launcher**, and their own privacy policies apply:

| Service | Use | Policy |
| --- | --- | --- |
| Modrinth | Browse and download mods, modpacks, resource packs | Modrinth's privacy policy |
| CurseForge | Browse and import modpacks via `manifest.json` | CurseForge's privacy policy |
| MCHeads | Minecraft avatar images (optional) | MCHeads is a free public service |
| GitHub | Download launcher builds and runtime assets | GitHub's privacy policy |

Witch Launcher has no control over these services and receives no data from them beyond what your browser or downloader sends directly.

## Logs and diagnostics {#logs}

Witch Launcher writes a launch log to its own app directory for debugging crashes and JIT issues. The log contains:

- Launcher version, device model, iOS version, renderer and Minecraft version
- JIT method, pairing status, renderer initialization events
- Plugin load results and crash counters

**The log is local only.** It is never uploaded by the launcher. If you file a bug on GitHub, you choose whether to attach the log — and you should remove any session tokens or personal identifiers before sharing it.

## Plugin system {#plugins}

Signed `.plgw` plugins run JavaScript or native code inside the launcher process. A plugin:

- Can read and write its own settings (`state.json`) via the `Witch` JS API or native `host->get_setting` / `host->set_setting`
- Can log messages through `Witch.log` / `host->log`
- Cannot access your contacts, location, microphone, camera or filesystem outside the launcher's container
- Native plugins run unsandboxed in the launcher process — install only code you trust and can rebuild from its published source

Plugin verification states (unverified / verified / revoked / invalid) are checked against the Witch registry. The registry stores only publisher-supplied hashes, public keys and key IDs — not your personal data.

## Children {#children}

Witch Launcher does not knowingly collect personal data from anyone, including children. No account is required to play locally, so no child's data is ever collected by the launcher itself.

## Your rights {#rights}

Because Witch Launcher does not collect personal data, there is nothing to access, correct, export or delete on our side — we do not have it. All your data (settings, worlds, mods, plugin state, accounts) lives on your device under your control. You can delete it by removing the app or clearing the launcher's app data.

## Changes {#changes}

This privacy policy may be updated as the launcher evolves. The current version is always available at `/docs/#/privacy`. Continued use of the launcher after changes take effect means you accept the updated policy.

## Contact {#contact}

Questions about this privacy policy: open an issue on the [Witch Launcher GitHub repository](https://github.com/Witch-Launcher/Witch_launcher) or contact the maintainer through the links on the [credits page](#/credits).

---

*Witch Launcher is not affiliated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Studios. Witch Launcher does not ship game files or Microsoft certificates.*
