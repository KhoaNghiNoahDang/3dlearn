# Báo cáo coverage Vật lí

Ngày rà soát: 2026-10-31  
Phạm vi: `catalog.json`, `content/course-mapping.json`, 10 course có `subject/legacySubject = phys`, và ba PDF:

- `SGK/SGK Vật lí 10-mau.pdf` - 72 trang
- `SGK/SGK Vật Lí 11-mau.pdf` - 61 trang
- `SGK/SGK Vật lí 12-mau.pdf` - 65 trang

## Kết luận ngắn

- Hiện có **10 mô phỏng Vật lí** trong catalog: 5 gắn hướng Vật lí 10, 4 gắn hướng Vật lí 11, 1 gắn hướng Vật lí 12; `brownian-step` là mapping xuyên khối 10/12.
- Cả 10 mapping trong `content/course-mapping.json` đều đang `needs-verification`, không có `textbookPageRefs` hoặc `chapterRefs` đã xác minh.
- Ba PDF là scan ảnh. Không có text layer; không thể xác nhận đáng tin cậy mục lục, số trang in, hoặc các bài nằm ngoài những trang đã xem bằng OCR tự động.
- Các PDF có dấu hiệu là bản mẫu/trích đoạn: Vật lí 10 kết thúc ở Bài 17, Vật lí 11 kết thúc trong phần Sóng, Vật lí 12 mới đi qua một phần Nhiệt học - Khí lí tưởng - Từ trường. Vì vậy bảng thiếu coverage dưới đây là **thiếu trong phạm vi trang quan sát được**, không phải khẳng định thiếu toàn bộ chương trình Vật lí 10-12.

## Quy tắc đặt tên hiển thị

- `confirmed-from-scan`: tên bài nhìn thấy trực tiếp trên banner/trang bài của PDF đã render.
- `topic-supported-needs-OCR`: chủ đề phù hợp với trang/bài quan sát được hoặc catalog, nhưng chưa đủ bằng chứng để gán khối/chương/bài/số trang chính thức.
- `needs-OCR`: chỉ có bằng chứng từ catalog/course HTML hoặc PDF chưa bao phủ phần nội dung cần đối chiếu; không nên dùng tên như tên bài SGK chính thức.

## Các mô phỏng hiện có

| Slug | Tên catalog hiện tại | Candidate book | Đề xuất tên hiển thị | Trạng thái bằng chứng | Ghi chú |
|---|---|---|---|---|---|
| `photoelectric-step` | Hiệu ứng quang điện | `vat-li-12` | Hiệu ứng quang điện | `needs-OCR` | Chủ đề và tên có trong catalog; phần Hiệu ứng quang điện không xuất hiện trong 65 trang PDF Vật lí 12 đã cung cấp. Không xác nhận được bài/chương/trang. |
| `capacitor-step` | Quan sát sự tích điện và phóng điện của tụ điện | `vat-li-11` | Quan sát sự tích điện và phóng điện của tụ điện | `needs-OCR` | Tên hoạt động chỉ có trong catalog. 61 trang PDF Vật lí 11 quan sát được tập trung vào Dao động và Sóng, chưa thấy phần điện học/tụ điện. |
| `accel-force-step` | Thí nghiệm: Tìm hiểu mối liên hệ giữa gia tốc với lực và khối lượng | `vat-li-10` | Giữ tên mô phỏng; **không gắn nhãn bài SGK hiện tại** | `needs-OCR` + lệch mapping | PDF Vật lí 10 nhìn thấy Bài 11 là “THỰC HÀNH: ĐO GIA TỐC RƠI TỰ DO”, không phải tên trong catalog. Cần xác minh nguồn chương trình của mô phỏng hoặc đổi mapping sau OCR. |
| `energy-step` | Thí nghiệm: Kiểm chứng định luật bảo toàn cơ năng | `vat-li-10` | Giữ tên mô phỏng; chưa xác nhận tên bài SGK | `needs-OCR` | Catalog trỏ tới Chương 8 nhưng bản PDF Vật lí 10 chỉ quan sát đến Chương III/Bài 17; không có bằng chứng scan cho Chương 8. |
| `projectile-step` | Thí nghiệm: Tìm hiểu đặc điểm của chuyển động ném ngang | `vat-li-10` | “Thí nghiệm: Tìm hiểu đặc điểm của chuyển động ném ngang” | `topic-supported-needs-OCR` | PDF Vật lí 10 nhìn thấy Bài 12 “CHUYỂN ĐỘNG NÉM”; chủ đề phù hợp nhưng chưa chứng minh được tên phụ “ném ngang”, số bài và số trang. |
| `centripetal-step` | Tìm hiểu mối liên hệ giữa độ lớn lực hướng tâm với bán kính, tốc độ góc và khối lượng | `vat-li-10` | Giữ tên mô phỏng; chưa xác nhận tên bài SGK | `needs-OCR` | Mapping trỏ Chương 6/Bài 2 nhưng phần trang quan sát được của Vật lí 10 chưa cho thấy bài Chuyển động tròn/Lực hướng tâm. |
| `self-induction-step` | Tự cảm và dòng Foucault | `vat-li-11` | Tự cảm và dòng Foucault | `needs-OCR` | Tên/chủ đề chỉ được hỗ trợ bởi catalog; PDF Vật lí 11 mẫu đã xem chưa đến phần Cảm ứng điện từ. |
| `emf-step` | Đo suất điện động và điện trở trong của nguồn điện | `vat-li-11` | Đo suất điện động và điện trở trong của nguồn điện | `needs-OCR` | Catalog gắn một thí nghiệm điện học nhưng PDF Vật lí 11 mẫu đã xem chưa có bằng chứng scan tương ứng. |
| `current-field-step` | Từ trường của dòng điện | `vat-li-11` | Từ trường của dòng điện | `needs-OCR` | Tên/chủ đề phù hợp về mặt khái niệm; PDF Vật lí 11 mẫu chưa hiển thị được phần Từ trường. Không xác nhận Bài 1/trang. |
| `brownian-step` | Chuyển động Brown và sự khuếch tán | `vat-li-10`, `vat-li-12` | Chuyển động Brown và sự khuếch tán | `needs-OCR` | Mapping xuyên khối chưa có bằng chứng scan đủ để chọn khối chính. Cần đối chiếu phần Thuyết động học phân tử/khí lí tưởng và mục lục chính thức. |

### Tên có thể dùng ngay ở UI

Chỉ nên xem đây là tên **mô phỏng**, không phải tên bài SGK đã xác minh: toàn bộ 10 tên catalog ở trên. Riêng `projectile-step` có bằng chứng chủ đề gần nhất từ trang nhìn thấy là “Chuyển động ném”, nhưng vẫn giữ `needs-OCR` cho quan hệ bài/chương/trang.

## Những bài/hoạt động SGK chưa có mô phỏng

Danh sách dưới đây chỉ tính những bài nhìn thấy rõ trong các trang scan đã render.

### Vật lí 10 - phần scan nhìn thấy

PDF cho thấy ba chương đầu và các bài sau:

| Bài nhìn thấy trong SGK | Tình trạng mô phỏng |
|---|---|
| Bài 1. Làm quen với Vật lí | Chưa có |
| Bài 2. Các quy tắc an toàn trong phòng thực hành Vật lí | Chưa có |
| Bài 3. Thực hành tính sai số trong phép đo. Ghi kết quả đo | Chưa có |
| Bài 4. Độ dịch chuyển và quãng đường đi được | Chưa có |
| Bài 5. Tốc độ và vận tốc | Chưa có |
| Bài 6. Thực hành: Đo tốc độ của vật chuyển động | Chưa có |
| Bài 7. Đồ thị độ dịch chuyển - thời gian | Chưa có |
| Bài 8. Chuyển động biến đổi. Gia tốc | Chưa có |
| Bài 9. Chuyển động thẳng biến đổi đều | Chưa có |
| Bài 10. Sự rơi tự do | Chưa có |
| Bài 11. Thực hành: Đo gia tốc rơi tự do | Chưa có; `accel-force-step` không khớp tên/nội dung mapping hiện tại |
| Bài 12. Chuyển động ném | `projectile-step` bao phủ gần chủ đề, cần xác minh mức độ và tên phụ |
| Bài 13. Tổng hợp và phân tích lực. Cân bằng lực | Chưa có |
| Bài 14. Định luật 1 Newton | Chưa có |
| Bài 15. Định luật 2 Newton | Chưa có |
| Bài 16. Định luật 3 Newton | Chưa có |
| Bài 17. Trọng lực và lực căng | Chưa có |

Các hoạt động nên ưu tiên phát triển từ phần này: đo sai số, đo tốc độ, đồ thị x-t, đo gia tốc rơi tự do, cân bằng lực và ba định luật Newton. Đây là các hoạt động có thể tạo tương tác 3D trực quan mà hiện chưa có course tương ứng.

### Vật lí 11 - phần scan nhìn thấy

Các trang đã xem cho thấy phần Dao động và Sóng. Các bài/hoạt động sau chưa có course tương ứng:

- Dao động điều hòa, mô tả dao động điều hòa, vận tốc/gia tốc trong dao động điều hòa.
- Năng lượng trong dao động điều hòa và các bài thực hành/hoạt động liên quan.
- Mô tả sóng, giao thoa sóng, sóng dừng.
- Bài thực hành đo tần số của sóng âm.
- Bài thực hành đo tốc độ truyền âm.
- Sóng điện từ và các bài tập/hoạt động mô hình hóa trên phần sóng.

Các course `capacitor-step`, `self-induction-step`, `emf-step`, `current-field-step` có thể thuộc các phần điện học/từ trường về sau, nhưng không được xác nhận từ bản PDF mẫu hiện có; gắn `needs-OCR`.

### Vật lí 12 - phần scan nhìn thấy

Các trang đã xem cho thấy phần Vật lí nhiệt, Khí lí tưởng và mở đầu Từ trường. Chưa có course tương ứng cho:

- Cấu trúc của chất và sự chuyển thể.
- Nội năng và định luật I của nhiệt động lực học.
- Nhiệt độ, thang nhiệt độ - nhiệt kế.
- Nhiệt dung riêng.
- Nhiệt nóng chảy riêng.
- Định luật Boyle, định luật Charles.
- Phương trình trạng thái khí lí tưởng.
- Áp suất khí theo mô hình động học phân tử.
- Các bài thực hành/đo đạc trong phần nhiệt học và khí lí tưởng.
- Các bài mở đầu phần Từ trường xuất hiện ở cuối bản scan.

`photoelectric-step` chưa được đối chiếu với phần Quang học/Lượng tử ánh sáng vì phần đó không xuất hiện trong 65 trang PDF Vật lí 12 được cung cấp.

## Đề xuất backlog coverage

### Ưu tiên 1 - sửa độ chính xác mapping

1. OCR mục lục và các trang bài của Vật lí 10 để xác minh `accel-force-step`; hiện có dấu hiệu mapping sai với Bài 11.
2. Xác minh `projectile-step` là toàn bộ Bài 12 hay chỉ hoạt động ném ngang.
3. Không hiển thị `chapterRefs`, số bài hoặc số trang SGK trên UI cho bất kỳ course nào khi chưa OCR.

### Ưu tiên 2 - bổ sung mô phỏng bám phần scan

1. Vật lí 10: sai số phép đo, đo tốc độ, rơi tự do, cân bằng lực/Newton.
2. Vật lí 11: dao động điều hòa, sóng trên mặt nước, giao thoa và sóng dừng, đo tần số/tốc độ truyền âm.
3. Vật lí 12: nhiệt dung riêng, nhiệt nóng chảy, định luật Boyle/Charles, phương trình khí lí tưởng.

### Ưu tiên 3 - xác minh các course hiện có ngoài phạm vi scan

OCR hoặc bổ sung bản đầy đủ cho các phần Điện học, Cảm ứng điện từ, Từ trường, Quang học và Lượng tử ánh sáng trước khi gắn course vào tên bài SGK chính thức.

## Bằng chứng và giới hạn

- `catalog.json` cung cấp 10 course Vật lí, tên mô phỏng, câu hỏi và các textbook reference hiện tại.
- `content/course-mapping.json` xác nhận tất cả mapping Vật lí đang provisional/`needs-verification`, không có page refs chính thức.
- Render trực quan các trang bìa, hướng dẫn sử dụng, trang mở đầu chương và trang mở đầu bài trong ba PDF cho thấy PDF là scan ảnh; không dùng text extraction để suy diễn tên bài.
- Các trang sample không đủ để khẳng định coverage của toàn bộ SGK. Báo cáo này cố ý không nâng cấp bất kỳ mapping nào thành verified curriculum.

