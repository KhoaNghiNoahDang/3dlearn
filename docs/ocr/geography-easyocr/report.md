# Báo cáo EasyOCR – Địa lí 10

Ngày chạy: 31/10/2026  
Nguồn: [`SGK/SGK Địa lí 10-mau.pdf`](../../../SGK/SGK%20Địa%20lí%2010-mau.pdf)  
Mapping: [`content/phase2/naming-geography-easyocr.json`](../../../content/phase2/naming-geography-easyocr.json)

## 1. Phạm vi thực hiện

Đã dùng EasyOCR với ngôn ngữ `vi` + `en`, CPU, render PDF ở scale 1.4. Raw evidence được lưu tạm tại `tmp/easyocr-geography/selected.json`; file tạm không được dùng làm catalog runtime.

Các trang PDF đã OCR:

| PDF page | Mục đích | Kết quả |
|---:|---|---|
| 4–5 | Mục lục, tên 40 bài, chương, trang in | Đủ để chuẩn hóa tên bài và số trang mục lục |
| 13 | Nội dung Bài 3 | Xác nhận tiêu đề GPS/bản đồ số và mục sử dụng bản đồ |
| 28 | Nội dung Bài 8 | Xác nhận tiêu đề, Hình 8 và câu hỏi về vành đai động đất/núi lửa |
| 36 | Nội dung Bài 10 | Xác nhận bài thực hành đọc bản đồ đới khí hậu và phân tích biểu đồ |
| 45 | Nội dung Bài 13 | Xác nhận tiêu đề, Bảng 13, trạm Hà Nội, dãy lưu lượng và yêu cầu vẽ biểu đồ |
| 50 | Nội dung Bài 16 | Xác nhận thực hành phân bố đất và sinh vật, Hình 16.1 |

Đã thử khởi chạy OCR toàn bộ 60 trang ở scale 2.0 nhưng tốc độ CPU quá cao; phiên đó dừng sau trang đầu để chuyển sang tập trang bằng chứng có giá trị trực tiếp cho naming/P0. Vì vậy đây là **OCR có chọn trang**, không phải tuyên bố OCR toàn bộ sách.

## 2. Chuẩn hóa tên SGK

Mục lục EasyOCR ở PDF page 4–5 xác nhận sách có 13 chương và 40 bài, tên sách là **Địa lí 10 – Kết nối tri thức với cuộc sống**. Tên chuẩn trong JSON dùng chính tả:

- `Địa lí`, không dùng `Địa lý` làm tên canonical;
- `thuỷ quyển`, `thuỷ sản`, `đô thị hoá`, `vỏ địa lí`;
- `Mặt Trời`, `Trái Đất`, `sông Hồng`;
- giữ tiền tố `Thực hành:` đối với Bài 8, 10, 13, 16, 27, 32 và 38.

Mapping ghi `confidence: high` cho tên bài sau khi kết hợp box EasyOCR ở mục lục, chuẩn hóa lỗi tách dòng/dấu tiếng Việt, đối chiếu trực quan mục lục đã render và đối chiếu số trang/thứ tự 40 bài trong coverage. Đây là confidence của tên chuẩn hóa sau review, không phải confidence thô của mọi box OCR. Ví dụ Bài 7 có box tên “Nội lực và ngoại lực” confidence thô 0.371 nhưng chữ vẫn đọc được khi nhìn vùng mục lục; Bài 6 và các tên dài bị EasyOCR tách thành nhiều box.

## 3. Bằng chứng P0 mới: Bài 13 – sông Hồng

EasyOCR ở PDF page 45 đọc được:

- `BÀI 13`;
- `THỰC HÀNH: PHÂN TÍCH CHẾ ĐỘ NƯỚC CỦA SÔNG HỒNG`;
- `BẢNG 13 LƯU LƯỢNG NƯỚC TRUNG BÌNH THÁNG CỦA SÔNG HỒNG TẠI TRẠM HÀ NỘI`;
- yêu cầu vẽ biểu đồ thể hiện lưu lượng nước trung bình tháng của sông Hồng;
- hướng dẫn: tháng có trị số lớn hơn trị số trung bình là tháng mùa lũ, thấp hơn là tháng mùa cạn.

Dãy số OCR được đọc theo 12 tháng, đơn vị m³/s:

| Tháng | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Lưu lượng | 1455 | 1343 | 1215 | 1522 | 2403 | 4214 | 7300 | 7266 | 5181 | 3507 | 2240 | 1517 |

Tính từ dãy số: tổng 12 tháng là 39 163 m³/s; trung bình tháng là 3 263,58 m³/s; tháng lớn hơn trung bình là VI–X (5 tháng); tháng nhỏ hơn trung bình là XI–V (7 tháng). Đây là evidence đủ mạnh để tạo một mô phỏng P0 thật, không placeholder.

## 4. Đối chiếu 14 course hiện có

| Course | Bài SGK chuẩn hóa gần nhất | Đánh giá |
|---|---|---|
| `earth-motion-step` | Bài 5 – Hệ quả địa lí các chuyển động của Trái Đất | Đủ lõi; giữ nguyên catalog, mapping mới chuẩn hóa display title |
| `insolation-step` | Bài 5 | Đủ lõi, bổ trợ góc nhập xạ/mùa/vành đai nhiệt |
| `tectonic-step` | Bài 6 – Thạch quyển, thuyết kiến tạo mảng | Đủ lõi theo chủ đề |
| `heating-step`, `wind-step`, `thermal-step`, `circulation-step` | Bài 9 – Khí quyển, các yếu tố khí hậu | Đủ lõi theo các nhánh khí quyển/gió/hoàn lưu |
| `soil-step` | Bài 14 – Đất trên Trái Đất | Đủ lõi |
| `water-cycle-step` | Bài 11 – Thuỷ quyển, nước trên lục địa | Một phần |
| `river-step` | Bài 7, 11, 13 | Một phần; trước patch chưa có bảng chế độ nước sông Hồng |
| `karst-step` | Bài 7 – Nội lực và ngoại lực | Một phần, chỉ là ví dụ địa hình các-xtơ |
| `currents-step`, `enso-step` | Bài 12 – Nước biển và đại dương | Một phần |
| `carbon-step` | Liên hệ Bài 31, 39, 40 | Chủ đề liên quan, không gán thành tên bài SGK |

Không course nào trong 14 course bị đổi tên hoặc đưa vào catalog bởi lần OCR này.

## 5. Đối chiếu phase2 và mô phỏng mới

| Phase2 | Evidence OCR | Tương tác static |
|---|---|---|
| `phase2-geo-gps-step` | PDF page 13 xác nhận tiêu đề GPS/bản đồ số và cách đọc bản đồ | Globe 3D, lưới, lớp điểm, vệ tinh, đường truyền, vùng giao khoảng cách, route, slider, bước |
| `phase2-geo-earthquake-volcano-step` | PDF page 28 xác nhận Bài 8, Hình 8 và quan hệ vành đai–mảng kiến tạo | Globe 3D, boundary, mũi tên chuyển động, điểm theo độ sâu, núi lửa, slider, bước |
| `phase2-geo-red-river-regime-step` | PDF page 45 xác nhận Bài 13, Bảng 13 và nhiệm vụ vẽ biểu đồ | Lưu vực/sông 3D procedural, biểu đồ cột 12 tháng, đường trung bình, phân lớp mùa lũ/cạn, chọn tháng, dòng chảy, bước, full-screen |

### Mô phỏng sông Hồng đã tạo

File: [`courses/phase2-geo-red-river-regime-step.html`](../../../courses/phase2-geo-red-river-regime-step.html)

Mô phỏng có sáu bước: đọc bảng số liệu; tính trung bình; xác định mùa lũ; xác định mùa cạn; đọc biểu đồ; tự kiểm tra.

Các thao tác là tương tác thật:

- kéo để xoay/pan/zoom mô hình bằng `OrbitControls`;
- chọn tháng 1–12 và đọc số m³/s trực tiếp;
- bật/tắt đường trung bình;
- bật/tắt màu mùa lũ/mùa cạn;
- bật/tắt marker dòng chảy procedural;
- reset, phím mũi tên, `R`, `F` và full-screen.

Mô hình dùng đúng dãy số Bảng 13, dựng sông bằng `CatmullRomCurve3` + `TubeGeometry`, tạo cột biểu đồ 3D từ lưu lượng, và tô mùa theo quy tắc lớn hơn/nhỏ hơn trung bình của SGK.

Metadata phase2 đã bổ sung mô phỏng trong [`content/phase2/geography.json`](../../../content/phase2/geography.json), nhưng **catalog chung không thay đổi**.

## 6. Kiểm tra kỹ thuật

- JSON mới đã được kiểm tra bằng parser Node sau khi tạo.
- Source mới có import `three`, `OrbitControls`, canvas `#gl`, 6 nút `[data-step-index]`, slider tháng và dữ liệu 12 tháng.
- Bridge không nhúng trực tiếp vào course HTML; Vite dev plugin/release staging sẽ inject `scripts/bridge/legacy-bridge.js` như hai phase2 hiện có.
- Chưa chạy browser runtime trong báo cáo này; cần smoke test `ready`, `setMode`, `setStep`, `reset`, `requestState`, `stepChanged` trên iframe.

## 7. Hạn chế và bước tiếp theo

1. Đây là EasyOCR selected-pages audit, chưa phải OCR toàn bộ 60 trang. Không gán figureRef mới ngoài những gì đọc được trực tiếp ở các trang đã chọn.
2. Cần một lượt kiểm duyệt scan page 45 để chốt dãy số Bảng 13 trước khi coi dữ liệu là nguồn bất biến lâu dài.
3. Bài 10 và Bài 16 đã có bằng chứng hình/bản đồ trong scan nhưng chưa tạo mô phỏng mới vì giới hạn tối đa một P0; chúng vẫn nằm trong backlog.
4. Cần chạy route mới dưới Vite và LessonShell để kiểm tra WebGL, bridge, responsive, không mất chữ và full-screen.
5. Không sửa `catalog.json`; chỉ khi runtime QA và review dữ liệu hoàn tất mới xem xét catalog integration ở một phase riêng.

