---
title: "Nhật ký thay đổi"
group: "Reference"
desc: "Fork đã đổi gì, qua từng bản phát hành. Lấy từ news.md của launcher."
---

## 0.0.4 {#v0-0-4}

0.0.4 là bản phát hành lớn nhất kể từ khi fork. Renderer nền **TGLMT** học được cách chạy shader pack qua **Iris**, tải runtime và LWJGL chuyển hoàn toàn vào trong ứng dụng với tải đa luồng, và tầng điều khiển nhận thêm một loạt công tắc mới. Build và asset có ký nằm trên [trang GitHub releases](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Đã thêm

- **TGLMT với hỗ trợ Iris** — Minecraft 26.3 và renderer OpenGL 4.6 đi đường Metal có thể chạy shader pack qua Iris; Shader Makeup được xác nhận chạy tốt.
- **Chọn phông chữ** — typography launcher theo ý, cạnh các điều khiển kích thước UI mới.
- **Tải runtime trong ứng dụng** — runtime Java và LWJGL được update hoặc download ngay từ launcher, với tải đa luồng cho cả những asset game nặng.
- **Công tắc cử chỉ** — tùy chọn giữ màn hình để phá/đặt khối, cử chỉ con trỏ chuột và cuộn, và nhấn đôi hotbar để chuyển vật trên tay sang tay phụ (bản cảm ứng của việc nhấn <kbd>F</kbd>).
- **Thông tin thiết bị qua F3** — màn debug nay báo chip thiết bị, phiên bản iOS, tên và phiên bản launcher, mã build và loại phát hành (dev hay chính thức).
- **Bộ điều khiển tùy chỉnh** — các nút đầu vào và đầu ra, cú pháp legacy chỉnh lại cùng tùy chọn định dạng mới, tương thích với định dạng điều khiển của Zalith Launcher 2.
- **52 gói ngôn ngữ đầy đủ** — mọi ngôn ngữ được hỗ trợ đều bật sẵn, gồm cả địa phương chữ chạy từ phải sang trái.
- **Vulkan 1.4** — stack Vulkan chuyển lên 1.4, cùng một MobileGL đã cập nhật với các tối ưu hóa.
- **Bản MobileGlues cũ** — bản MobileGlues trước được giữ lại cho các thế giới cũ.
- **Khử răng cưa con trỏ chuột** — mép con trỏ tùy chỉnh mượt hơn.
- **Biểu đồ hiệu năng** — xuất biểu đồ trực tiếp từ các bản ghi built-in.

### Đã cập nhật

- **Cú pháp điều khiển tùy chỉnh** — hỗ trợ Zalith Launcher 2; cú pháp legacy được chỉnh lại và thêm tùy chọn định dạng.
- **MobileGL** — tối ưu hóa và làm mới.
- **Kiểu con trỏ chuột** — đổi hình con trỏ và cách co giãn.
- **Vulkan 1.4** — stack Vulkan tiến lên cùng đợt làm mới MobileGL.

### Đã sửa

- **JIT và Java Development Kit** — cả hai nay chạy được trên mọi thiết bị được hỗ trợ.
- **Java 8 và 17** — các runtime cũ nhất khởi động đúng.
- **Crash UI** — một sự crash của launcher trên một số màn hình đã hết.
- **Lỗi co giãn con trỏ chuột** — con trỏ không còn bị co sai kích thước.
- **Ẩn file** — file ẩn không còn bị hiện ở những chỗ không nên hiện.
- **Cập nhật launcher, runtime Java và LWJGL** — đường cập nhật trong ứng dụng hoạt động ổn định.
- **Tải map** — map tải lại được.
- **Viền và thanh cài đặt** — viền bảng cài đặt và thanh trên cùng hiển thị đúng.
- **Thiếu nền cho tài khoản table** — dòng tài khoản đã có nền.
- **Rà soát renderer** — MoltenVK, Zink (V25.0.7), MobileGL, LTW, gl4es, Tinygl4angle và MobileGlues đều được sửa.
- **Crash Minecraft 26.3** — sửa trên 1.8.9, 1.16.5 và 1.18.2.
- **Con trỏ chuột iOS 27** — ẩn trên các bản bị ảnh hưởng (chưa xác minh).
- **Đổi logo** và một loạt lỗi nhỏ.

> [!NOTE] Đợt rà renderer sửa được nhiều thứ, nhưng các renderer thử nghiệm vẫn có thể crash hoặc render sai — nếu một cái khó chịu, hãy bắt đầu lại từ renderer **Tự động** (xem [FAQ](#/faq#performance)).

## 0.0.3 {#v0-0-3}

0.0.3 đặt nền móng mà fork hiện tại sống trên đó: profile, cá nhân hóa, mốc TGLMT đầu tiên, và debug tốt hơn cho iOS 26 và 27. Asset nằm trên [trang GitHub releases](https://github.com/Witch-Launcher/Witch_launcher/releases).

### Đã thêm

- **Renderer TGLMT** — hỗ trợ Sodium đầy đủ trên renderer đi đường Metal (hỗ trợ shader Iris chỉ tới trong 0.0.4), cùng những bản sửa của riêng nó.
- **Profile** — các profile game tách rời, với cài đặt, mod, shader, resource pack và thế giới riêng.
- **Cá nhân hóa** — theme, màu nhấn, blur, viền, bo góc, phông tùy chỉnh và icon ứng dụng.
- **Debug JIT iOS 26 / 27** — ghi log debug riêng cho việc xử lý lỗi JIT trên các bản iOS mới nhất.
- **Màn dọc mới** — một bố cục dọc cho điện thoại, cùng các bản sửa cho việc chuyển đổi ngang và dọc.

### Đã sửa

- **UI launcher và tùy chọn** — các cài đặt chưa áp dụng được nay đã áp dụng.
- **Renderer MobileGL** — các vấn đề hiển thị trong đường MobileGL.
- **Tối ưu UI/UX tổng thể** — trên toàn bộ launcher.
- **Các panel** — sửa bố cục ở nhiều panel.

## Cũ hơn {#earlier}

Các bản phát hành trước lúc fork mang phiên bản Amethyst được thừa kế — dòng 1.x và 2.x từ nhánh thượng nguồn. Những tag, ghi chú và asset đó vẫn được lưu trữ trên [trang GitHub releases](https://github.com/Witch-Launcher/Witch_launcher/releases), cùng mọi build ở trên.

> [!NOTE] Trang này mirrors [`news.md`](https://github.com/Angel-Aura-Amethyst-iOS/Angel-Aura-Amethyst-iOS/blob/main/news.md) của launcher — file trong repo là nguồn chân lý.
