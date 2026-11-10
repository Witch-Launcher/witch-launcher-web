---
title: "Thành tựu"
group: "Reference"
desc: "Người, dự án và cả nền tảng mà Witch Launcher đứng trên."
---

## Tác giả {#author}

Witch Launcher là một fork cộng đồng, độc lập, được bảo trì bởi **DuyAnh662 (Za_d626)**.

> [!NOTE] [Discord](https://discord.gg/9JYymD7EY) · [TikTok](https://tiktok.com/@za_d626) · [YouTube](https://youtube.com/@za_d626) · [X](https://x.com/duyanh662)

## Dòng dõi {#lineage}

Không gì ở đây bắt đầu từ những bảng trống — launcher kế thừa mười lăm năm của những người đưa Minecraft: Java Edition lên phần cứng không sinh ra nó:

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

Hãy tự xem gốc rễ: [Boardwalk](https://github.com/zhuowei/Boardwalk), [PojavLauncher](https://github.com/PojavLauncherTeam), [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) và [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25). Những người đóng góp thượng nguồn xứng đáng lời cảm ơn sâu nhất, đặc biệt **@crystall1nedev** và **@khanhduytran0** cho bản port iOS, **@artdeell**, **@Mathius-Boulay**, **@zhuowei**, **@jkcoxson**, **@Diatrus**, **@Catsruledogs** và **@T1k-T1k**.

## Thành phần bên thứ ba {#third-party}

Khoảng hai mươi lăm dự án nằm trong Witch Launcher. Danh sách dưới đây là danh sách mà repo mang theo — mỗi thành phần với giấy phép và bản quyền riêng.

| Thành phần | Giấy phép | Vai trò |
| --- | --- | --- |
| [Witch](https://github.com/Ynnyny/Witch_launcher) | GPL-3.0 | Chính dự án launcher |
| [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) | GPL-3.0 | Nền tảng fork trực tiếp — launcher cảm ứng và bản port iOS |
| [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25) | GPL-3.0 | Nhánh 2025 được duy trì mà Witch tiếp nối |
| [Caciocavallo](https://github.com/PojavLauncherTeam/caciocavallo) | GPL-2.0 | Bộ công cụ giao diện AWT trên nền Java 8 |
| [jsr305](https://code.google.com/p/jsr-305) | BSD-3-Clause | Annotation dùng trong mã Java |
| [Boardwalk](https://github.com/zhuowei/Boardwalk) | Apache-2.0 | Bản port Minecraft: Java Edition đầu tiên lên iOS |
| [gl4es](https://github.com/ptitSeb/gl4es) | MIT | Lớp dịch OpenGL 2.1 cho các phiên bản cũ |
| [Mesa 3D](https://gitlab.freedesktop.org/mesa/mesa) | MIT | OpenGL đứng sau renderer Zink |
| [MetalANGLE](https://github.com/khanhduytran0/metalangle) | BSD-2-Clause | ANGLE chạy trên Metal, renderer OpenGL ES |
| [MoltenVK](https://github.com/KhronosGroup/MoltenVK) | Apache-2.0 | Vulkan trên Metal; nền của Zink và Frame Generation |
| [openal-soft](https://github.com/kcat/openal-soft) | LGPL-2.0 | Đầu ra âm thanh của game |
| [Azul Zulu JDK](https://www.azul.com/downloads/?package=jdk) | GPLv2 + Classpath Exception | Runtime Java 8 / 17 / 21 / 25 đi kèm |
| [LWJGL3](https://github.com/PojavLauncherTeam/lwjgl3) | BSD-3-Clause | Binding cửa sổ, input và OpenGL cho game |
| [LWJGLX](https://github.com/PojavLauncherTeam/lwjglx) | không rõ | Lớp tương thích API LWJGL2 cho LWJGL3 |
| [DBNumberedSlider](https://github.com/khanhduytran0/DBNumberedSlider) | Apache-2.0 | Control bước nhảy dùng trong màn cài đặt |
| [fishhook](https://github.com/khanhduytran0/fishhook) | BSD-3-Clause | Hook hàm lúc chạy |
| [shaderc](https://github.com/khanhduytran0/shaderc) | Apache-2.0 | Biên dịch shader cho renderer Vulkan |
| [NRFileManager](https://github.com/mozilla-mobile/firefox-ios) | MPL-2.0 | Trình cung cấp tệp cho bộ chọn tài liệu |
| [AltKit](https://github.com/rileytestut/AltKit) | — | Trợ giúp cài đặt ứng dụng |
| [UnzipKit](https://github.com/abbeycode/UnzipKit) | BSD-2-Clause | Giải nén cho mod và gói |
| [DyldDeNeuralyzer](https://github.com/xpn/DyldDeNeuralyzer) | — | Bypass library validation cho runtime ngoài |
| [LTW](https://github.com/MojoLauncher/LTW) | LGPL-3.0 | Renderer OpenGL 3.3 thử nghiệm cho 1.17+ |
| [MCHeads](https://mc-heads.net) | Dịch vụ | Hình đại diện Minecraft, cung cấp miễn phí |

### Những phần nhỏ lấp các kẽ hở

**StikJIT** (MPL-2.0) — helper JIT tích hợp sẵn · **StikDebug** (AGPL-3.0) — script JIT và hướng dẫn tệp pairing · **LocalDevVPN** (StosVPN) — VPN loopback dùng để kích hoạt JIT · **Husk** (GPL-2.0-or-later) — bản tham chiếu của helper JIT dạng app extension · **MMMarkdown** (MIT) — render Markdown cho menu chính.

Danh sách chuẩn kèm link và văn bản giấy phép nằm ở [`credits.md`](https://github.com/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS/blob/main/credits.md) của repo thượng nguồn.

## Giấy phép {#license}

Witch Launcher được phân phối theo **GNU General Public License v3.0**; văn bản đầy đủ nằm trong [tệp `LICENSE`](https://github.com/Witch-Launcher/Witch_launcher/blob/main/LICENSE) của repo. Mọi thành phần bên thứ ba nêu trên giữ giấy phép và bản quyền riêng, và điều khoản của chúng đi cùng bản build.

Câu miễn trừ nhỏ, giữ nguyên dạng chữ: Minecraft là nhãn hiệu của Mojang Studios. Witch Launcher không liên kết với Mojang Studios, Microsoft, hay dự án Amethyst, và không gửi kèm tệp trò chơi hoặc chứng chỉ.
