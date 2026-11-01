# EasyOCR audit Hóa học 11–12

Ngày audit: 2026-10-31  
Phạm vi: 25 course Hóa trong catalog/mapping, prototype `phase2-chem-acid-base-titration`, SGK Hóa 11–12 và các báo cáo coverage hiện có.

## Kết quả

- EasyOCR 1.7.2 đã được chạy bằng CPU với ngôn ngữ `vi + en`, detector `craft_mlt_25k.pth`, recognizer `latin_g2.pth`.
- OCR mục lục Hóa 11 xác nhận các neo: Bài 1 trang 6, Bài 2 trang 16, Bài 5 trang 33, Bài 6 trang 38, Bài 7 trang 42, Bài 8 trang 48, Bài 10 trang 57, Bài 13 trang 74; các mục lục tiếp theo nằm ở PDF page 7.
- OCR mục lục Hóa 12 xác nhận: Bài 15 trang 67, Bài 16 trang 78, Bài 20 trang 94, Bài 22 trang 102, Bài 24 trang 108, Bài 27 trang 128; các mục lục này nằm ở PDF page 7.
- Mapping riêng đã tạo tại [`content/phase2/naming-chemistry-easyocr.json`](../../content/phase2/naming-chemistry-easyocr.json).
- Không sửa [`catalog.json`](../../catalog.json) hoặc [`content/course-mapping.json`](../../content/course-mapping.json).
- Không tạo mô phỏng P0 mới: acid-base titration đã có cả `courses/titration-step.html` và prototype `courses/phase2-chem-acid-base-titration.html`; chưa có gap mới đủ evidence để tạo thêm mà không đoán.

## Bằng chứng OCR

| Sách | Ảnh OCR | Kết quả dùng trong mapping |
|---|---|---|
| Hóa 11 | `tmp/pdf-audit/hoa11-06.png` | Mục lục Chương 1–3; nhận diện Bài 1/2/4/5/6/7/8/10/11/12/13 |
| Hóa 11 | `tmp/pdf-audit/hoa11-07.png` | Mục lục Chương 4–6; dùng để loại trừ các chủ đề Hóa 12 khỏi Hóa 11 |
| Hóa 12 | `tmp/pdf-audit/hoa12-06.png` | Mục lục Chương 1–4 |
| Hóa 12 | `tmp/pdf-audit/hoa12-07.png` | Mục lục Chương 5–8; nhận diện Bài 15/16/18/19/20/21/22/24/25/27/28/29 |

`page.pdf` trong JSON là chỉ số trang vật lý của PDF; `page.printed` là số trang in. Đây là lesson-start evidence từ mục lục, không phải trang chi tiết của từng hình hoặc hoạt động thí nghiệm.

## Chuẩn hóa tên và các cặp phải tách

### Ammonia và Haber-Bosch

- `ammonia-step`: **Ammonia và muối ammonium: điều chế và tính chất**, hoạt động phòng thí nghiệm/đài phun, neo Hóa 11 Bài 5.
- `haber-step`: **Quy trình Haber-Bosch: tổng hợp ammonia**, quy trình công nghiệp, cũng neo vào Bài 5 nhưng không phải cùng activity.

Không dùng chung displayTitle hoặc lesson node chi tiết cho hai course.

### Chlorine và chlor-alkali

- `chlorine-step`: giữ `unverified`; mục lục EasyOCR Hóa 11/12 không cung cấp neo chlorine đủ chắc.
- `chlor-alkali-step`: **Điện phân dung dịch NaCl và công nghiệp chlor-kiềm**, Hóa 12 Chương 5 Bài 16.

Chlorine là chất/chủ đề thí nghiệm; chlor-alkali là quy trình điện phân công nghiệp.

### Luyện gang và luyện kim

- `blast-furnace-step`: **Luyện gang trong lò cao**, Hóa 12 Chương 6 Bài 20.
- `smelting-step`: **Luyện kim: điện phân nóng chảy và nhiệt luyện**, composite Hóa 12 Bài 16 + Bài 20.

Không gộp hai course thành một lesson hoặc một hình minh họa duy nhất.

### Điện li, thủy phân và chuẩn độ

- `conductivity-step`: **Chất điện li và tính dẫn điện của dung dịch**.
- `hydrolysis-step`: **Sự thủy phân của muối**.
- `titration-step` và `phase2-chem-acid-base-titration`: **Chuẩn độ acid-base: xác định điểm tương đương**.

Cả ba cùng nằm trong mạch Hóa 11 Bài 2 theo mục lục, nhưng là ba hoạt động khác nhau và phải giữ ba activity type riêng trên UI.

## Đối chiếu 25 course catalog

| Nhóm | Course | Quyết định tên/mapping |
|---|---|---|
| Hóa 11, confidence cao | `haber-step`, `titration-step`, `sulfuric-step`, `hydrolysis-step`, `ammonia-step`, `equilibrium-step`, `conductivity-step`, `nitric-lab-step`, `sulfur-step` | Chuẩn hóa displayTitle theo tên bài/chủ đề OCR; giữ composite khi cần |
| Hóa 11, confidence trung bình | `ball-stick-step` | Giữ hai bài liên quan; chưa ép một lesson duy nhất |
| Hóa 11, chưa xác minh | `rate-step`, `chlorine-step`, `flame-step`, `bromine-step` | Không gán SGK 11/12; cần nguồn Hóa 10 hoặc sách khác |
| Hóa 12, confidence cao | `blast-furnace-step`, `smelting-step`, `electrolysis-step`, `galvanic-step`, `sodium-step`, `corrosion-step`, `chlor-alkali-step` | Neo theo Bài 15/16/20/22/24; composite giữ nhiều bài |
| Hóa 12, composite/thấp | `iron-step`, `hou-soda-step` | Giữ nhiều bài hoặc chỉ quan hệ chủ đề; không gọi là exact SGK |
| Hóa 12, chưa xác minh | `coal-gas-step`, `cement-step` | Không thấy title tương ứng trong mục lục EasyOCR |

Danh sách máy đọc đầy đủ, gồm `displayTitle`, `textbookTitle`, `chapter`, `lesson`, `page`, `confidence` và evidence, nằm trong JSON; bảng này chỉ tóm tắt quyết định.

## Kiểm tra prototype Phase 2

`courses/phase2-chem-acid-base-titration.html` là file độc lập ngoài catalog, có canvas Three.js/WebGL procedural, slider thể tích, nút thêm 1 mL/0.1 mL, pH/đổi màu chỉ thị, xoay-pan-zoom và fullscreen. Nó dùng cùng neo Hóa 11 Bài 2 với `titration-step` nhưng là prototype riêng; không sửa mapping chung.

## Giới hạn và việc cần làm tiếp

1. EasyOCR đã xác nhận mục lục, nhưng chưa đủ để xác định `figureRef` hoặc trang chi tiết của từng thí nghiệm.
2. Các course `unverified` không được chuẩn hóa theo tên SGK chính thức khi thiếu source.
3. Cần OCR tiếp các trang có nhãn “Hoạt động thí nghiệm” nếu muốn gắn `experimentPage`/`figureRef`.
4. Cần kiểm tra thủ công apparatus và kết quả quan sát của từng mô phỏng trước khi gắn badge “Theo hoạt động SGK”.
5. Không có SGK Hóa 10 trong `SGK/`, vì vậy không được suy đoán các mapping flame/chlorine/rate/bromine về Hóa 10.
