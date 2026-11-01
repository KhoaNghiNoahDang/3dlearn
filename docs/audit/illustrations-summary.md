# Tổng hợp audit hình minh hoạ Địa lí 10

Ngày: 31/10/2026  
Chi tiết: [`illustrations-geography.md`](illustrations-geography.md)

## 1. Bảng điều hành

| Hạng mục | Kết quả audit | Ý nghĩa |
|---|---:|---|
| Bài trong SGK Địa lí 10 | 40 | Phạm vi đối chiếu theo mục lục scan đã xác nhận |
| Course `geo` trong catalog | 14 | Đã chạm tới 11/40 bài ở mức đủ lõi hoặc một phần theo coverage |
| Đủ lõi | 4 bài | Bài 5, 6, 9, 14 |
| Một phần | 7 bài | Bài 7, 11, 12, 13, 31, 39, 40 |
| Thiếu | 29 bài | Cần backlog mới, nhất là các bài thực hành bản đồ/biểu đồ |
| Course hiện có có dấu hiệu Three.js/WebGL | 14/14 | Static audit: có canvas/render pipeline |
| Course hiện có có `OrbitControls` | 14/14 | Static audit: có xoay/pan/zoom hoặc pipeline tương ứng |
| Course hiện có có bước/điều khiển | 14/14 | Static audit: có step UI và listener/slider |
| Course hiện có có sheet SVG/procedural | 14/14 | Là hình/sơ đồ dựng bằng code, chưa đồng nghĩa bản đồ GIS |
| Mô phỏng phase2 P0 | 2 | GPS/bản đồ số và vành đai động đất–núi lửa |
| Phase2 có bằng chứng 3D/layer/filter | 2/2 | Đã thấy trực tiếp trong source HTML |
| Bridge embedded trong raw course HTML | 0/16 | Bridge được inject ở dev/release; cần test pipeline deploy |
| Browser runtime smoke test trong audit này | Chưa chạy | Không nên tuyên bố đã hoàn hảo trên mọi route |
| Bản đồ GIS/ảnh SGK được xác nhận | Chưa có bằng chứng đủ | Cần metadata nguồn, projection/legend hoặc asset ảnh có chú thích |

## 2. Ma trận trạng thái

| Nhóm | Static code | Runtime | Nội dung SGK | Mức ưu tiên |
|---|---|---|---|---|
| 14 course `geo` hiện có | PASS cho 3D/controls/steps | PENDING | 4 đủ lõi, 7 một phần, 3 chủ đề còn cần xác minh sâu | P0 QA |
| GPS/bản đồ số phase2 | PASS: globe, vệ tinh, lớp, tuyến, slider | PENDING bridge/WebGL | Đúng hướng Bài 3, chưa thay thế hình SGK | P0 |
| Động đất–núi lửa phase2 | PASS: boundary, quake depth, volcano layer | PENDING bridge/WebGL | Đúng hướng Bài 8, chưa thay thế hình SGK | P0 |
| Bản đồ phương pháp biểu hiện | Chưa có | Chưa có | Bài 2 thiếu | P0 build |
| Bản đồ/biểu đồ khí hậu | Chưa có course riêng | Chưa có | Bài 10 thiếu | P0 build |
| Chế độ nước sông Hồng | Có `river-step` gần chủ đề | Chưa xác minh | Bài 13 chỉ partial | P0 data |
| Đất–sinh vật phân bố | Có `soil-step` về phẫu diện | Chưa xác minh | Bài 16 thiếu | P0 build |
| Biểu đồ sản lượng lương thực | Chưa có | Chưa có | Bài 27 thiếu | P0 build |
| Ảnh minh hoạ SGK | Chưa xác nhận asset | Chưa có | PDF scan image-only | P1 OCR/source |

## 3. Điều đã được xác nhận

- SGK chuẩn là **Địa lí 10 – Kết nối tri thức với cuộc sống**, có 13 chương và 40 bài.
- 14 course hiện có đều có dấu hiệu tĩnh của mô hình 3D và điều khiển camera; đây là cơ sở tốt để tiếp tục QA và tái sử dụng hệ thống tương tác.
- Hai mô phỏng phase2 không phải ảnh tĩnh: mã nguồn tạo geometry, scene, camera, lớp dữ liệu và thay đổi visibility/giá trị theo thao tác.
- GPS có lưới kinh–vĩ tuyến, điểm dữ liệu, vệ tinh, tia tín hiệu, vùng giao khoảng cách và route; mô phỏng động đất có boundary, mũi tên chuyển động, điểm theo độ sâu và volcano layer.
- Bridge chung được tích hợp theo pipeline Vite/dev và release staging, không nhất thiết xuất hiện trong raw HTML source.

## 4. Điều chưa được xác nhận

- Chưa chạy browser smoke test nên chưa xác nhận thực tế `ready`, `stepChanged`, `modeChanged`, `requestState`, `setMode`, `reset`, `setStep` trên iframe.
- Chưa thể đối chiếu chính xác từng hình/chú thích/trang SGK vì bản PDF hiện là scan không có text layer và chưa có OCR cục bộ.
- Sheet SVG/procedural và code vẽ chart chứng minh có hình minh hoạ, nhưng chưa đủ để kết luận đó là bản đồ chuẩn, biểu đồ đúng số liệu SGK hay ảnh minh hoạ bản quyền.
- Chưa có bằng chứng `river-step` dùng chuỗi số liệu riêng của sông Hồng; nên vẫn phải giữ trạng thái Bài 13 là một phần.

## 5. Rủi ro triển khai cần theo dõi

1. **Bridge:** phải build/serve qua pipeline có inject bridge; mở HTML trực tiếp có thể không có parent bridge.
2. **Module Three.js:** phase2 đang dùng import từ `https://esm.sh`; cần bundle hoặc cache nếu server riêng có môi trường mạng hạn chế.
3. **Dữ liệu và tính đúng SGK:** cần gắn lesson/page/figureRef/source cho từng asset trước khi gọi là coverage chính thức.
4. **Khả năng đọc:** phải test panel lời giải, legend, nhãn trục, tooltip, step bar và full-screen ở nhiều kích thước để không mất chữ.

## 6. Chốt audit

Nền tảng 3D hiện có **đủ cơ sở kỹ thuật để tiếp tục**, và hai P0 phase2 đã có tương tác thật ở mức kiểm tra mã nguồn. Tuy nhiên, sản phẩm **chưa thể được đánh dấu “đã hoàn tất toàn bộ hình minh hoạ/thí nghiệm Địa lí 10”**: coverage nội dung mới 4 bài đủ lõi + 7 bài một phần, các bài thực hành bản đồ/biểu đồ quan trọng còn thiếu, còn runtime bridge/WebGL và độ chính xác hình SGK cần kiểm tra tiếp.

Báo cáo này không sửa catalog, không thêm route và không thay đổi code.

