---
title: "Chính sách bảo mật"
group: "Legal"
desc: "Witch Launcher thu thập gì, không thu thập gì, và dữ liệu của bạn được xử lý như thế nào."
---

## Bảo mật nhá glance {#overview}

Witch Launcher là trình chạy cộng đồng, mã nguồn mở cho Minecraft: Java Edition trên iPhone và iPad. Nó được phân phối theo giấy phép **GPL-3.0**, không có **quảng cáo**, không có **dò vết**, và không có **télemetri** theo thiết kế.

| Câu hỏi | Câu trả lời |
| --- | --- |
| Chúng tôi thu thập dữ liệu cá nhân? | **Không.** Witch Launcher không thu thập, lưu trữ hoặc truyền bất kỳ dữ liệu cá nhân nào về bạn. |
| Chúng tôi theo dõi bạn? | **Không.** Không có phân tích, không mã quảng cáo, không vân tay người dùng và không phân hạng hồ sơ. |
| Chúng tôi bán dữ liệu? | **Không.** Không có gì để bán vì không có gì được thu thập. |
| Chúng tôi gửi tệp trò chơi? | **Không.** Bạn phải tự cung cấp tệp Minecraft: Java Edition và tài khoản của mình. |
| Chúng tôi yêu cầu tài khoản? | **Không.** Chơi cục bộ (offline) hoạt động không cần tài khoản. Tài khoản Microsoft, demo và Ely.by là tùy chọn. |

## Những gì trình chạy có thể truy cập {#access}

Witch Launcher chạy hoàn toàn trên thiết bị của bạn. Các truy cập sau được thực hiện **cục bộ** và không bao giờ rời khỏi thiết bị trừ khi bạn tự主动 thực hiện:

| Truy cập | Mục đích | Rời khỏi thiết bị? |
| --- | --- | --- |
| Bộ nhớ thiết bị | Lưu trữ phiên bản trò chơi, mod, thế giới, shader, gói plugin (`.plgw`), cài đặt (`plugins.json`, `state.json`) và nhật ký | Không |
| Mạng (tùy chọn của bạn) | Tải Java runtime, LWJGL, mod, gói mod, gói shader và gói tài nguyên từ Modrinth, CurseForge hoặc các镜 bạn cấu hình | Có — chỉ khi bạn tự tải |
| Mạng (xác thực) | Đăng nhập với Microsoft, Ely.by hoặc tài khoản demo để xác thực quyền sở hữu Minecraft: Java Edition | Có — chỉ khi bạn đăng nhập |
| Camera / microfono | **Không bao giờ được truy cập** | Không |
| Danh bạ / vị trí / sức khỏe | **Không bao giờ được truy cập** | Không |

## Tài khoản và xác thực {#accounts}

Nếu bạn chọn đăng nhập với tài khoản Microsoft, Ely.by hoặc demo:

- Xác thực diễn qua luồng web của chính dịch vụ đó (OAuth / mã thiết bị). Witch Launcher **không** thấy hoặc lưu trữ mật khẩu của bạn.
- Mã phiên được lưu trữ trong thư mục riêng của trình chạy trên thiết bị của bạn, được khóa theo hồ sơ, và chỉ được dùng để khởi chạy Minecraft: Java Edition.
- Bạn có thể xoá bất kỳ tài khoản kia khi nào từ **Cài đặt → Tài khoản**. Việc xoá sẽ xóa dữ liệu phiên đã lưu.

## Dịch vụ bên thứ ba {#third-party}

Khi bạn sử dụng các tính năng nội dung tùy chọn, thiết bị của bạn có thể kết nối đến các dịch vụ bên thứ ba. Những dịch vụ này **không được vận hành bởi Witch Launcher**, và chính sách bảo mật của chính chúng có hiệu lực:

| Dịch vụ | Sử dụng | Chính sách |
| --- | --- | --- |
| Modrinth | Duyệt và tải mod, gói mod, gói tài nguyên | Chính sách bảo mật của Modrinth |
| CurseForge | Duyệt và nhập gói mod qua `manifest.json` | Chính sách bảo mật của CurseForge |
| MCHeads | Hình đại diện Minecraft (tùy chọn) | MCHeads là dịch vụ công khai miễn phí |
| GitHub | Tải bản dựng trình chạy và tài nguyên runtime | Chính sách bảo mật của GitHub |

Witch Launcher không kiểm soát các dịch vụ này và không nhận bất kỳ dữ liệu nào từ chúng ngoài những gì trình duyệt hoặc trình tải của bạn gửi trực tiếp.

## Nhật ký và chẩn đoán {#logs}

Witch Launcher ghi nhật ký khởi chạy vào thư mục riêng của trình chạy để gỡ lỗi sự cố và vấn đề JIT. Nhật ký chứa:

- Phiên bản trình chạy, mô hình thiết bị, phiên bản iOS, trình kết xuất và phiên bản Minecraft
- Phương pháp JIT, trạng thái ghép cặp, sự kiện khởi tạo trình kết xuất
- Kết quả tải plugin và bộ đếm sự cố

**Nhật ký chỉ ở cục bộ.** Nó không bao giờ được tải lên bởi trình chạy. Nếu bạn báo lỗi trên GitHub, bạn chọn xem có đính kèm nhật ký không — và bạn nên xóa mã phiên hoặc thông tin nhận dạng cá nhân trước khi chia sẻ.

## Hệ thống plugin {#plugins}

Gói plugin đã ký `.plgw` chạy mã JavaScript hoặc mã gốc bên trong tiến trình trình chạy. Một plugin:

- Có thể đọc và ghi cài đặt của riêng nó (`state.json`) qua API JS `Witch` hoặc API gốc `host->get_setting` / `host->set_setting`
- Có thể ghi thông báo nhật ký qua `Witch.log` / `host->log`
- Không thể truy cập danh bạ, vị trí, microfono, camera hoặc hệ thống tệp bên ngoài vùng chứa của trình chạy
- Plugin gốc chạy không được c sandbox trong tiến trình trình chạy — chỉ cài mã bạn tin tưởng và có thể biên dịch lại từ mã nguồn công khai

Các trạng thái xác thực plugin (chưa xác thực / đã xác thực / bị thu hồi / không hợp lệ) được kiểm tra đối với đăng ký Witch. Đăng ký chỉ lưu băm do nhà xuất bản cung cấp, khóa công khai và ID khóa — không phải dữ liệu cá nhân của bạn.

## Trẻ em {#children}

Witch Launcher không cố tình thu thập dữ liệu cá nhân từ bất kỳ ai, bao gồm cả trẻ em. Không yêu cầu tài khoản để chơi cục bộ, do đó dữ liệu của trẻ em không bao giờ được thu thập bởi chính trình chạy.

## Quyền của bạn {#rights}

Vì Witch Launcher không thu thập dữ liệu cá nhân, không có gì để truy cập, sửa, xuất hoặc xoá ở phía chúng tôi — chúng tôi không có nó. Tất cả dữ liệu của bạn (cài đặt, thế giới, mod, trạng thái plugin, tài khoản) sống trên thiết bị của bạn dưới sự kiểm soát của bạn. Bạn có thể xoá nó bằng cách gỡ ứng dụng hoặc xóa dữ liệu ứng dụng của trình chạy.

## Thay đổi {#changes}

Chính sách bảo mật này có thể được cập nhật khi trình chạy phát triển. Phiên bản hiện tại luôn có sẵn tại `/docs/#/privacy`. Việc tiếp tục sử dụng trình chạy sau khi các thay đổi có hiệu lực có nghĩa là bạn chấp nhận chính sách đã cập nhật.

## Liên hệ {#contact}

Câu hỏi về chính sách bảo mật này: mở sự kiện trên [kho lưu trữ GitHub của Witch Launcher](https://github.com/Witch-Launcher/Witch_launcher) hoặc liên hệ với người bảo trì thông qua các liên kết trên trang [thành tựu](#/credits).

---

*Witch Launcher không liên kết với Mojang Studios hoặc Microsoft. Minecraft là nhãn hiệu của Mojang Studios. Witch Launcher không gửi tệp trò chơi hoặc chứng chỉ Microsoft.*
