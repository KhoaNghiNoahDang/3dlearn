# Tiêu chí coverage SGK

Thư mục này ghi nhận mức độ đối chiếu giữa SGK trong `SGK/` và các mô phỏng đang có trong `courses/`. Đây là báo cáo nội dung, không phải nguồn dữ liệu runtime; không sửa `catalog.json`, `content/course-mapping.json` hoặc mã mô phỏng trong phạm vi báo cáo coverage.

## Nguồn và giới hạn

- Nguồn sách: `SGK/SGK Địa lí 10-mau.pdf`.
- Đối chiếu course: `catalog.json`, `courses/*.html` và mapping hiện có trong `content/course-mapping.json`.
- Các PDF SGK hiện là scan ảnh. `content/manifest.json` ghi nhận file Địa lí 10 có 60 trang PDF, không có lớp text và cần OCR/manual check.
- Vì vậy, số trang trong mục lục dưới đây là số trang in được nhìn thấy trong scan, không phải chỉ số trang PDF. Tên hình và số hình chỉ được ghi khi đã kiểm chứng; các asset đề xuất được đánh dấu là “đề xuất”, không coi là trích dẫn chính thức từ SGK.

## Mức coverage

| Mức | Ý nghĩa | Cách tính |
|---|---|---|
| `Đủ lõi` | Course hiện có mô phỏng trực tiếp khái niệm trung tâm của bài, có các bước quan sát/thao tác tương ứng. | 1.0 điểm |
| `Một phần` | Course có liên quan, nhưng chỉ bao phủ một hiện tượng, một tiểu mục hoặc một bài thực hành; chưa đủ phạm vi kiến thức/kĩ năng của bài SGK. | 0.5 điểm |
| `Thiếu` | Chưa có course có thể đối chiếu đáng tin cậy với bài đó. | 0 điểm |
| `Cần xác minh` | Có dấu hiệu phù hợp nhưng mapping hiện tại chưa có số trang/chương/hình hoặc PDF chưa OCR. | Không cộng thêm điểm; phải kiểm tra thủ công |

## Quy tắc đối chiếu

1. Đối chiếu theo **bài SGK**, không chỉ theo từ khóa trong tên course.
2. Một course được tính `Đủ lõi` khi mục tiêu, mô hình, các bước và câu hỏi của course cùng hướng vào năng lực chính của bài.
3. Một course có thể liên quan đến nhiều bài, nhưng không được dùng để biến một nhóm bài thành “đã phủ” nếu nó chỉ mô phỏng một phần hiện tượng.
4. Bài thực hành được chấm riêng. Có mô phỏng lý thuyết gần đó không đồng nghĩa đã có công cụ đọc bản đồ, vẽ/nhận xét biểu đồ, phân tích số liệu hoặc viết báo cáo.
5. Hình minh họa cần được lập backlog riêng theo chức năng: bản đồ, mặt cắt, sơ đồ quá trình, biểu đồ, mô hình 3D, lớp dữ liệu và công cụ thao tác.
6. Không sao chép nguyên bản hình SGK vào sản phẩm. Khi triển khai, tạo asset giáo dục mới có chú thích nguồn, quyền sử dụng rõ ràng và kiểm duyệt thuật ngữ tiếng Việt.

## Cách đọc báo cáo Địa lí

- Phần **SGK đề xuất** chốt tên sách/edition để tránh trộn nhiều bộ sách.
- Phần **course hiện có** cho biết những gì đang chạy trong catalog.
- Phần **ma trận 40 bài** là coverage theo mục lục SGK Kết nối tri thức.
- Phần **backlog bài và hình** là danh sách cần bổ sung; đây là đề xuất triển khai, không phải thay đổi catalog.

