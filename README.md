# Witch Launcher — Trang giới thiệu (WebGPU / B&W)

Trang landing đơn trang, chủ đề **trắng đen**, dùng **WebGPU** để render hiệu ứng 3D
(tinh thể đơn sắc raymarching + nền fbm), nội dung **song ngữ Việt / Anh**.

## Chạy trên máy tính

WebGPU yêu cầu "secure context" (localhost hoặc https). Mở terminal trong thư mục `web/`:

```bash
cd web
python3 -m http.server 8080
```

Rồi mở trình duyệt: **http://localhost:8080**
(Khuyên dùng Chrome/Edge 113+ hoặc Safari Technology Preview để có WebGPU.)

## Cấu trúc

```
web/
  index.html          # cấu trúc trang + nội dung song ngữ
  css/style.css       # hệ thống thiết kế trắng đen, glass, hiệu ứng
  js/renderer.js      # WebGPU: khởi tạo device + WGSL raymarcher (trong suốt)
  js/main.js          # chuyển ngôn, reveal khi cuộn, boot WebGPU + video
  assets/logo_dev.png # logo dev THẬT (từ logo-dev.png gốc, nền trong suốt)
  assets/hero.mp4     # video nền (từ bản screen record của launcher)
  assets/hero.mov     # bản gốc .mov (nguồn dự phòng cho Safari)
  assets/favicon.svg
```

## Ghi chú

- **Nền video cố định (fixed)**: vào trang thấy video **sắc nét bình thường**; khi cuộn xuống,
  video tự động **làm mờ (Gaussian Blur) tăng dần** + lớp scrim tối dần để dễ đọc nội dung.
  Tinh thể WebGPU 3D vẫn giữ sắc nét nổi trên video.
- Nếu trình duyệt không hỗ trợ WebGPU → ẩn canvas, vẫn giữ video nền.
  Nếu cả video lỗi → hiện nền gradient thay thế.
- **Logo** là bản knockout từ `logo-dev.png` gốc của app (trắng trên nền trong suốt),
  không phải SVG tái tạo.
- Nội dung tải về / version / iOS được hỗ trợ là thông tin minh họa — cập nhật link thực tế khi cần.
