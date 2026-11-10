---
title: "FAQ"
group: "Reference"
desc: "Câu trả lời ngắn cho những câu hỏi hay gặp nhất. Các hướng dẫn sâu hơn được đặt liên kết ngay trong dòng."
---

## Cài đặt & JIT {#setup-jit}

### Vì sao game báo “Waiting for JIT”?

Minecraft: Java Edition không thể khởi động thiếu biên dịch just-in-time, và băng thông báo nghĩa là helper JIT của Witch chưa được kích hoạt. Chạy hết danh mục cho phương án cài đặt của bạn, rồi chạy lại:

- **SideStore / AltStore** — attach VPN debug vào Witch để tiến trình <kbd>CS_DEBUGGED</kbd> sống khỏe, hoặc chạy qua **StikDebug**.
- **StikDebug** — giữ nó attach vào Witch trong suốt phiên.
- **TrollStore** — bật tùy chọn **URL Scheme** trong TrollStore nếu Witch cứ chờ.
- **StikJIT tích hợp (iOS 17.4+)** — cung cấp tệp pairing trong Cài đặt → Game → JIT và kết nối LocalDevVPN. Chi tiết trong [hướng dẫn JIT](#/projects/launcher/jit).
- **Jailbroken** — bật JIT enabler của jail và chọn phương pháp khớp trong Cài đặt.

Các bản cập nhật hệ thống có thể làm hỏng một thiết lập chạy tốt ngày hôm qua — rà lại kết nối debugger, VPN và TrollStore URL Scheme trước khi đổ lỗi cho ứng dụng.

### iOS 26 và 27 khác gì?

JIT trên các bản phát hành này mong manh: StikDebug phải giữ attach trong lúc game chạy, script `UniversalJIT26.js` được sao vào clipboard khi cần, và một bản cập nhật OS tương lai có thể lặng lẽ đổi điều gì hoạt động. 0.0.3 đã thêm ghi log debug JIT riêng đúng cho trường hợp này — tái hiện lỗi và đọc log trước khi báo cáo.

> [!IMPORTANT] Trên iOS 26 và 27, giữ StikDebug attach cho tới khi Minecraft đóng hẳn. Detach giữa phiên là nguyên nhân phổ biến nhất của một game chết vài phút sau khi chạy.

## Hiệu năng & renderer {#performance}

### Nên chọn renderer nào?

**Bắt đầu với Tự động.** Cài đặt → Renderer & Display có vài lựa chọn, và renderer được đánh dấu thử nghiệm có thể crash hoặc render sai một phần thế giới. Khi muốn đi xa hơn:

- **TGLMT** — OpenGL 4.6 Core qua Metal, đường nhanh nhất trên A11 Bionic trở lên. Ưu tiên trên thiết bị mới, nhất là cho thế giới 1.17+.
- **MobileGlues / LTW** — các đường OpenGL 4.0 / 3.3 cho 1.17+, vẫn đang thử nghiệm.
- **Zink** — Mesa 25 trên MoltenVK, OpenGL 4.1.
- **gl4es / MetalANGLE** — các con đường tương thích cho các phiên bản Minecraft cũ.

Quay về Tự động trước khi ném một bug về render thế giới lỗi.

### Shader chạy được không?

Có — qua **TGLMT** với **Iris**. Hỗ trợ Sodium về trong 0.0.3 và shader pack Iris trong 0.0.4; Shader Makeup được xác nhận chạy tốt. Chưa renderer nào khác có đường shader, nên shader pack đòi TGLMT trên một thiết bị hỗ trợ Metal, A11 trở lên. Shader pack cũng nhạy với phiên bản Minecraft — hãy ghép pack với phiên bản mà tác giả của nó build cho.

### Frame Generation giá gì?

Frame Generation nội suy hoặc ngoại suy khung hình (hai chế độ Motion-Adaptive GPU và Camera 3D Reproject) và đòi renderer **MoltenVK** với hỗ trợ Metal compute. Giá là thật: nó rút nhiều pin hơn và chạy thiết bị nóng thấy rõ. Là công cụ đẹp cho phiên gắn dock hoặc cắm sạc — đừng kỳ vọng gì khi điện thoại nằm trong túi.

> [!TIP] Nếu thiết bị ấm lên, kết hợp Frame Generation với co giãn độ phân giải hoặc FSR 1.0 trong Cài đặt → Renderer & Display thay vì nâng tần số nền.

### Launcher báo thiếu RAM. Giờ làm sao?

Witch không thể tự biến ra bộ nhớ — iOS giới hạn dung lượng RAM mà một app sideloaded được phép dùng, và Minecraft chạm trần đó rất dễ với các modpack lớn. Khi launcher báo thiếu bộ nhớ (hoặc game chết ngay khi đang nạp), hãy cài [**GetMoreRam**](https://github.com/hugeBlack/GetMoreRam) — nó ký lại bản sideloaded của bạn với entitlement *Increased Memory Limit* để iOS cho app dùng nhiều RAM hơn:

1. Sideload **GetMoreRam** vào thiết bị.
2. Mở app → **Settings** → đăng nhập bằng chính tài khoản bạn dùng để ký Witch.
3. Vào **App IDs** → **Refresh** → chọn **Witch** → **Add Increased Memory Limit**.
4. Cài lại Witch từ SideStore / AltStore.
5. Mở lại — kiểm tra xem Minecraft giờ có khởi động và chạy ổn định không.

Nó không thêm RAM vật lý; nó gỡ trần giới hạn của từng app — vốn là lý do cùng một thế giới mở được trên máy này nhưng bị kill trên máy kia. Việc này không liên quan đến phần cấp phát bộ nhớ JVM trong cài đặt của Witch — nâng `-Xmx` không giúp gì nếu iOS kill tiến trình trước.

## Nội dung & tài khoản {#content}

### Vì sao mod của tôi không nạp?

Kiểm tra bốn thứ mà nội dung thường đòi:

- **Phiên bản** — mod, pack hay shader phải tồn tại cho phiên bản Minecraft bạn chọn.
- **Loader** — Fabric, Quilt, Forge, NeoForge hoặc OptiFine phải khớp những gì nội dung kỳ vọng; loader cài từ trình chọn phiên bản.
- **Renderer** — một số mod gọi những đường chỉ một số renderer cung cấp.
- **Bộ nhớ** — nâng phần cấp phát bộ nhớ trong JVM arguments nếu game chết trong lúc nạp; quản lý RAM tự động giúp trên thiết bị nhỏ.

Các profile tách rời: mod và resource pack cài vào profile hiện tại không xuất hiện ở profile khác, nên hãy chắc bạn đã chạy đúng profile mình đã chỉnh.

### Modpack CurseForge của tôi không chịu cài. Giờ sao?

Các pack CurseForge được phân phối với một `manifest.json` liệt kê mọi lượt tải. Cài một-chạm không sẵn có cho mọi pack — khi trình duyệt từ chối một cái, hãy tải archive về và nhập thủ công; launcher sẽ giải manifest và tải những tệp nó tải được. Nếu các tệp cụ thể vẫn lỗi, chúng thường dính một lần API outage phía nhà cung cấp — các tính năng nội dung trực tuyến phụ thuộc dịch vụ bên thứ ba và có thể tạm thời không khả dụng.

### Báo lỗi thế nào?

Mở một [issue trên GitHub](https://github.com/Witch-Launcher/Witch_launcher) với đầy đủ những thứ dưới đây — báo cáo thiếu một nửa sẽ bị chờ lâu nhất:

- model thiết bị và phiên bản iOS / iPadOS
- phiên bản Witch Launcher
- renderer và phiên bản Minecraft
- mod loader và danh sách mod đã cài
- các bước tái hiện
- log hoặc crash report liên quan

Pull request cũng được hoan nghênh, nhưng không bao giờ commit chứng chỉ ký, provisioning profile, API key hay các bí mật khác.
