# Content write scope

Thư mục này là lớp dữ liệu trung gian cho SGK Việt Nam và 54 mô phỏng hiện có. Phạm vi này chỉ tạo manifest/mapping, không sửa runtime.

## Files

- `manifest.json`: 9 sách, nguồn PDF, số trang và kết quả audit scan bằng PyMuPDF.
- `course-mapping.json`: 54 mapping bước đầu từ `catalog.json`/course slug sang sách Việt Nam và chủ đề ứng viên.
- `README.md`: quy ước xác minh và giới hạn dữ liệu.

## Kết quả audit PDF

Cả 9 PDF trong `SGK/` đều có `textPages=0`, `textRatio=0` và mỗi trang có 1 image object. Vì vậy đây là scan ảnh thuần túy: không gán số trang/chương chính thức, không khẳng định mapping đã đúng, và không tạo nội dung OCR giả.

## Trạng thái

Tất cả mapping dùng `mappingStatus: needs-verification`. Các trường `candidateBookIds`, `topic`, `matchType` chỉ là điểm bắt đầu dựa trên tên bài, loại bài và textbook refs trong catalog hiện tại. Các refs hiện tại có nhiều dấu hiệu thuộc bộ sách ngoài Việt Nam nên được lưu như bằng chứng legacy, không dùng làm nguồn chuẩn.

## Quy trình xác minh tiếp theo

1. OCR từng PDF bằng tiếng Việt, giữ confidence theo block.
2. Đọc mục lục và trang đầu mỗi chương; lập chapter IDs và số trang in.
3. Đối chiếu từng course với tiêu đề/khái niệm/hình/thí nghiệm trong SGK.
4. Điền `chapterRefs` và `textbookPageRefs`; ghi `evidencePages` sau kiểm duyệt.
5. Chỉ chuyển sang `verified` khi một người kiểm duyệt xác nhận scan, OCR và mapping.

