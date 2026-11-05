---
title: "Credits"
group: "Reference"
desc: "Con người, những dự án và nền tảng mà Witch Launcher đứng trên."
---

## Người duy trì {#maintainer}

Witch Launcher là một fork độc lập, do cộng đồng duy trì, kế thừa Amethyst, và được giữ bởi **DuyAnh662 (Za_d626)**.

> [!NOTE] [Discord](https://discord.gg/9JYymD7EY) · [TikTok](https://tiktok.com/@za_d626) · [YouTube](https://youtube.com/@za_d626) · [X](https://x.com/duyanh662)

## Dòng dõi {#lineage}

Không gì ở đây bắt đầu từ bàn trắng — launcher kế thừa mười lăm năm những người đặt Minecraft: Java Edition lên phần cứng không thuộc của nó:

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

Hãy tự xem những bộ rễ: [Boardwalk](https://github.com/zhuowei/Boardwalk), [PojavLauncher](https://github.com/PojavLauncherTeam), [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) và [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25). Người đóng góp thượng nguồn xứng đáng lời cảm ơn sâu nhất, nhất là **@crystall1nedev** và **@khanhduytran0** cho bản port iOS, **@artdeell**, **@Mathius-Boulay**, **@zhuowei**, **@jkcoxson**, **@Diatrus**, **@Catsruledogs** và **@T1k-T1k**.

## Thành phần bên ngoài {#third-party}

Khoảng hai mươi lăm dự án nằm bên trong Witch Launcher. Những cái quan trọng nhất:

| Thành phần | Giấy phép | Vai trò |
| --- | --- | --- |
| [Amethyst-iOS](https://github.com/AngelAuraMC/Amethyst-iOS) | GPL-3.0 | Nền fork trực tiếp — launcher chạm-trước và bản port iOS |
| [Amethyst-iOS-25](https://github.com/catsruledogs/Amethyst-iOS-25) | GPL-3.0 | Nhánh 2025 được duy trì mà Witch kế tục |
| [Boardwalk](https://github.com/zhuowei/Boardwalk) | Apache-2.0 | Bản port Minecraft: Java Edition đầu tiên lên iOS |
| [Caciocavallo](https://github.com/PojavLauncherTeam/caciocavallo) | GPL-2.0 | Bộ công cụ giao diện AWT trên nền Java 8 |
| [gl4es](https://github.com/ptitSeb/gl4es) | MIT | Tầng dịch OpenGL 2.1 cho các phiên bản cũ |
| [Mesa 3D](https://gitlab.freedesktop.org/mesa/mesa) | MIT | OpenGL đằng sau renderer Zink |
| [MetalANGLE](https://github.com/khanhduytran0/metalangle) | BSD-2-Clause | ANGLE chạy trên Metal, renderer OpenGL ES |
| [MoltenVK](https://github.com/KhronosGroup/MoltenVK) | Apache-2.0 | Vulkan trên Metal; nền của Zink và Frame Generation |
| [openal-soft](https://github.com/kcat/openal-soft) | LGPL-2.0 | Đầu ra âm thanh của game |
| [Azul Zulu JDK](https://www.azul.com/downloads/?package=jdk) | GPLv2 + Classpath Exception | Runtime Java 8 / 17 / 21 / 25 đóng gói sẵn |
| [LWJGL3](https://github.com/PojavLauncherTeam/lwjgl3) | BSD-3-Clause | Các ràng buộc cửa sổ, input và OpenGL cho game |
| [LWJGLX](https://github.com/PojavLauncherTeam/lwjglx) | Unlisted | Tầng tương thích API LWJGL2 cho LWJGL3 |
| [shaderc](https://github.com/khanhduytran0/shaderc) | Apache-2.0 | Biên dịch shader được các renderer Vulkan dùng |
| [LTW](https://github.com/MojoLauncher/LTW) | LGPL-3.0 | Renderer OpenGL 3.3 thử nghiệm cho 1.17+ |
| [StikJIT](https://github.com/StikDebug/StikJIT) | MPL-2.0 | Helper JIT tích hợp nhúng trong ứng dụng |
| [StikDebug](https://github.com/StikDebug/StikDebug) | AGPL-3.0 | Các JIT script và hướng dẫn pairing |
| [LocalDevVPN](https://github.com/jkcoxson/LocalDevVPN) | StosVPN | VPN hand-off loopback dùng cho kích hoạt JIT |
| [Husk](https://github.com/Leviidev/Husk) | GPL-2.0-or-later | Triển khai tham chiếu của helper JIT dạng app-extension |
| [MMMarkdown](https://github.com/mdiep/MMMarkdown) | MIT | Render Markdown cho menu chính |
| [MCHeads](https://mc-heads.net) | Service | Ảnh đại diện Minecraft, cung cấp miễn phí |

> [!NOTE] Những phần nhỏ lấp các khe: **jsr305** (BSD-3), **fishhook** (BSD-3), **UnzipKit** (BSD-2), **NRFileManager** (MPL-2.0), **DyldDeNeuralyzer**, **DBNumberedSlider** (Apache-2.0) và **AltKit**. Mọi liên kết và giấy phép nằm trong [credits.md](https://github.com/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS/blob/main/credits.md) thượng nguồn.

## Giấy phép {#license}

Witch Launcher được phát hành dưới **GNU General Public License v3.0**; văn bản đầy đủ là [tệp LICENSE](https://github.com/Witch-Launcher/Witch_launcher/blob/main/LICENSE) trong kho. Mọi thành phần bên ngoài nêu trên giữ giấy phép và bản quyền riêng, và điều khoản của chúng đi cùng những build của chúng.

Một dòng miễn trừ nhỏ, giữ dưới dạng văn bản: Minecraft là thương hiệu của Mojang Studios. Witch Launcher không liên kết với Mojang Studios, Microsoft hay dự án Amethyst, và không đóng gói tệp game hay chứng chỉ.
