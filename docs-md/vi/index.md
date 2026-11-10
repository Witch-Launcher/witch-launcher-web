---
title: "Tổng quan"
group: "Reference"
desc: "Mọi thứ về việc chạy Minecraft: Java Edition trên iPhone và iPad — từ lần sideload đầu tiên đến plugin, renderer và lịch sử phát hành."
---

## Đi tiếp ở đâu {#next}

Mới dùng launcher? Hãy bắt đầu với [Bắt đầu](#/getting-started), rồi mở [FAQ](#/faq) trong một tab suốt tuần ra mắt. Tin tức dự án, ảnh chụp màn hình và bản tải về nằm trên [trang chính](../index.html).

## Các dự án đứng sau launcher {#projects}

Launcher chỉ là lớp vỏ. Toàn bộ stack kết xuất, các lớp tương thích và runtime plugin đều nằm ở những kho riêng, và mỗi kho đều có bộ tài liệu riêng.

Mỗi dự án bên dưới được đọc thẳng từ kho của nó — thứ tự trang do chính `docs/DOCS_MANIFEST.json` trong kho quyết định, nên chỉ cần push là trang cập nhật ngay mà không cần sửa website. Một bản sao được giữ lại ở đây để dự phòng khi mất mạng.

| Dự án | Là gì | Giấy phép |
| --- | --- | --- |
| **Witch Launcher** | Bản launcher iOS — phiên bản, bộ nạp, runtime, tài khoản, plugin | GPL-3.0 |
| **TGLMT** | OpenGL 4.6 Core chạy trên Metal — đường kết xuất nhanh nhất | MIT |
| **TGLES** | OpenGL ES 3.2 trên Metal — lớp tương thích đứng sau MobileGL | MIT |
| **MetalCompat** | Runtime tương thích mở rộng Metal hiện đại trên GPU Apple cũ | MIT |
| **MetalBridge** | Bridge Swift đưa API Metal chỉ có trên macOS sang Metal công khai của iOS | — |

> [!TIP] Nhấn <kbd>[</kbd> và <kbd>]</kbd> để chuyển trang. Bên trong một dự án, nút trước/sau sẽ duyệt theo đúng thứ tự trong manifest của dự án đó.
