# OCR đối chiếu tên Hóa học 11–12

Ngày audit: 2026-10-31

## Phạm vi

- Đối chiếu 25 course có `legacySubject = chem` trong `content/course-mapping.json` với hai file scan:
  - `SGK/SGK Hóa học 11-mau.pdf`
  - `SGK/SGK Hóa học 12-mau.pdf`
- Chuẩn hóa tên hiển thị và ghi mapping riêng tại `content/phase2/naming-chemistry.json`.
- Không sửa `catalog.json` hoặc `content/course-mapping.json`.

## Cách lấy bằng chứng

PDF không có text layer. Các trang hướng dẫn và mục lục được render thành ảnh rồi OCR tiếng Việt/Anh bằng Tesseract.js; các tên và số trang trong JSON chỉ được dùng khi đọc được trực tiếp từ mục lục hoặc đối chiếu được với tên bài trong báo cáo coverage.

Với hai sách, phần mục lục cho thấy PDF page = printed page + 2 ở các trang nội dung. `page.pdf` trong mapping là chỉ số trang vật lý của PDF; `page.printed` là số trang in trong sách. Đây là trang bắt đầu của bài, không phải khẳng định vị trí chính xác của từng thí nghiệm.

## Kết quả bảo thủ

- Hóa 11: 14 course có neo trực tiếp hoặc liên quan đến các bài trong Chương 1, 2, 3.
- Hóa 12: 11 course có neo trực tiếp hoặc liên quan đến các bài trong Chương 5, 6, 7, 8.
- `rate-step`, `chlorine-step`, `bromine-step`, `flame-step`, `coal-gas-step`, `cement-step` không được gán bài Hóa 11/12 khi mục lục không đủ bằng chứng.
- `ball-stick-step`, `iron-step`, `smelting-step`, `sulfur-step` là các mô phỏng xuyên nhiều bài; mapping giữ mảng bài/trang thay vì đoán một bài duy nhất.
- Hóa 10 chưa có PDF trong `SGK/`; các chủ đề cần Hóa 10 được đánh dấu `unverified` và ghi chú rõ trong JSON.

## Quy tắc sử dụng

`confidence = high` không có nghĩa mọi chi tiết thí nghiệm đã được kiểm duyệt theo từng trang; nó nghĩa là neo bài/chương và trang mở đầu bài đã đọc được từ mục lục. Khi cần trích đúng trang hoạt động, phải audit tiếp các trang nội dung của bài đó.
