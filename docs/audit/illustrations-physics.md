# Audit hình minh họa và thí nghiệm Vật lí

Ngày audit: 2026-10-31  
Phạm vi: `SGK/SGK Vật lí 10-mau.pdf`, `SGK/SGK Vật Lí 11-mau.pdf`, `SGK/SGK Vật lí 12-mau.pdf`, catalog, course mapping và 10 course Vật lí hiện có.  
Phạm vi thay đổi: **read-only**; báo cáo này là file duy nhất được tạo, không sửa code, catalog hoặc mapping.

## 1. Kết luận điều hành

- Có 10 mô phỏng Vật lí trong catalog: `photoelectric-step`, `capacitor-step`, `accel-force-step`, `energy-step`, `projectile-step`, `centripetal-step`, `self-induction-step`, `emf-step`, `current-field-step`, `brownian-step` (`catalog.json:444-1226`).
- Cả 10 course đều là bundle tương tác thực tế, không phải HTML tĩnh: có `<canvas>` (`:10`), geometry/model (`:15`), Three renderer/WebGL (`:19`), scene (`:3841`) và controls/OrbitControls (`:4238`). Bằng chứng này xuất hiện trong từng file `courses/<slug>.html` được liệt kê ở bảng §3.
- Chưa có course nào đủ bằng chứng để gắn chắc với **một hình cụ thể + bài + trang SGK**. Lý do: mapping còn `needs-verification`, `textbookPageRefs`/`chapterRefs` trống và PDF là scan ảnh; kết quả OCR hiện là `needs-OCR` (`docs/coverage/physics.md:27-36`, `docs/ocr/physics-final/mapping.csv`).
- Kết quả khớp tốt nhất hiện tại là `projectile-step` với chủ đề nhìn thấy trong SGK Vật lí 10, Bài 12 “Chuyển động ném”; vẫn chỉ xếp **partial**, vì chưa chứng minh được hình/thí nghiệm trong scan chính là “ném ngang” và chưa có số trang/bài phụ xác nhận.
- Nhiều hoạt động nhìn thấy trong các bản SGK mẫu chưa có mô phỏng tương ứng: đo sai số, đo tốc độ, đo gia tốc rơi tự do, dao động/sóng, đo tần số/tốc độ âm, nhiệt học, Boyle/Charles và các thí nghiệm liên quan.

### Quy ước trạng thái

- **Đủ**: có hoạt động/hình SGK xác định được và course có mô hình 3D tương ứng, renderer, scene và điều khiển tương tác; không chỉ khớp tên chung.
- **Một phần**: đã có mô phỏng 3D có chủ đề gần hoặc có candidate mapping, nhưng chưa xác minh được hình/bài/trang hoặc chỉ bao phủ một phần hoạt động SGK.
- **Thiếu**: hoạt động/hình/thí nghiệm đã nhìn thấy trong các trang SGK đã render nhưng chưa có course mô phỏng tương ứng.

## 2. Bằng chứng nguồn SGK

Các trang dưới đây là ảnh render từ pipeline OCR; pipeline đã xác định `pdftoppm` và PyMuPDF nhưng chưa có Tesseract/pytesseract/EasyOCR/RapidOCR. Vì vậy tên bài được ghi theo đối chiếu trực quan, không coi là OCR đã xác nhận.

| Sách | Bằng chứng đã nhìn thấy | Thí nghiệm/hình có ý nghĩa đối với audit |
|---|---|---|
| Vật lí 10 | `docs/ocr/physics-final/pages/vat-li-10/page-018.jpg`, `page-031.jpg`, `page-048.jpg`, `page-050.jpg` và các trang lân cận | Bài 3 thực hành đo sai số; Bài 6 thực hành đo tốc độ; Bài 11 thực hành đo gia tốc rơi tự do; Bài 12 chuyển động ném. Các Bài 1-17 và các hình cơ học cũng xuất hiện trong dải render `page-008.jpg` đến `page-070.jpg`. |
| Vật lí 11 | `docs/ocr/physics-final/pages/vat-li-11/page-008.jpg`, `page-034.jpg`, `page-043.jpg`, `page-050.jpg`, `page-054.jpg`, `page-060.jpg` | Dao động điều hòa; mô tả sóng; thực hành đo tần số sóng âm; giao thoa sóng; sóng dừng; thực hành đo tốc độ truyền âm. |
| Vật lí 12 | `docs/ocr/physics-final/pages/vat-li-12/page-008.jpg`, `page-022.jpg`, `page-030.jpg`, `page-039.jpg`, `page-043.jpg`, `page-047.jpg`, `page-050.jpg`, `page-057.jpg`, `page-060.jpg` | Nhiệt học/thực hành nhiệt; định luật Boyle; định luật Charles; khí lí tưởng; áp suất khí; phần mở đầu Từ trường. |

Các file sách và số trang khai báo trong manifest là `content/manifest.json:77-101` và `content/manifest.json:199-230`. Đây là các bản mẫu 72/61/65 trang; không nên suy ra rằng phần còn lại của SGK không có hoạt động, chỉ có thể kết luận theo phần đã cung cấp/render.

## 3. Đối chiếu 10 mô phỏng hiện có

| Course | Chủ đề theo catalog | Candidate mapping | Bằng chứng 3D trong file | Đối chiếu SGK/hình | Kết quả |
|---|---|---|---|---|---|
| `photoelectric-step` | Hiệu ứng quang điện (`catalog.json:446`) | Vật lí 12 (`content/course-mapping.json:541-548`) | `courses/photoelectric-step.html:10,15,19,3841,4238` | Không thấy phần quang điện trong 65 trang Vật lí 12 đã render; chưa có figure/page reference. | **Một phần** |
| `capacitor-step` | Tích điện/phóng điện tụ (`catalog.json:470`) | Vật lí 11 (`content/course-mapping.json:568-575`) | `courses/capacitor-step.html:10,15,19,3841,4238` | Scan Vật lí 11 đã thấy chủ yếu Dao động/Sóng; chưa thấy hình tụ điện tương ứng. | **Một phần** |
| `accel-force-step` | Quan hệ gia tốc–lực–khối lượng (`catalog.json:519`) | Vật lí 10 (`content/course-mapping.json:623-630`) | `courses/accel-force-step.html:10,15,19,3841,4238` | Không khớp với hoạt động nhìn thấy ở Bài 11 “Đo gia tốc rơi tự do”; course này không được dùng làm bằng chứng thay thế. | **Một phần** |
| `energy-step` | Bảo toàn cơ năng (`catalog.json:735`) | Vật lí 10 (`content/course-mapping.json:870-877`) | `courses/energy-step.html:10,15,19,3841,4238` | Mapping chỉ trỏ chương sau; phần Vật lí 10 đã render chưa cho thấy hình/thí nghiệm tương ứng. | **Một phần** |
| `projectile-step` | Chuyển động ném ngang (`catalog.json:781`) | Vật lí 10 (`content/course-mapping.json:924-931`) | `courses/projectile-step.html:10,15,19,3841,4238` | Gần với Bài 12 “Chuyển động ném” nhìn thấy ở `vat-li-10/page-050.jpg`; chưa xác nhận hình, ném ngang và trang in. | **Một phần** |
| `centripetal-step` | Lực hướng tâm (`catalog.json:852`) | Vật lí 10 (`content/course-mapping.json:1005-1012`) | `courses/centripetal-step.html:10,15,19,3841,4238` | Chưa thấy bài Chuyển động tròn/Lực hướng tâm trong phần scan được kiểm kê; chưa có figure/page reference. | **Một phần** |
| `self-induction-step` | Tự cảm và dòng Foucault (`catalog.json:875`) | Vật lí 11 (`content/course-mapping.json:1032-1039`) | `courses/self-induction-step.html:10,15,19,3841,4238` | Phần Vật lí 11 đã render chưa đến phần Cảm ứng điện từ; không thể xác nhận hình SGK. | **Một phần** |
| `emf-step` | Suất điện động và điện trở trong (`catalog.json:900`) | Vật lí 11 (`content/course-mapping.json:1060-1067`) | `courses/emf-step.html:10,15,19,3841,4238` | Chưa thấy hoạt động đo nguồn điện tương ứng trong scan đã cung cấp. | **Một phần** |
| `current-field-step` | Từ trường của dòng điện (`catalog.json:1183`) | Vật lí 11 (`content/course-mapping.json:1385-1392`) | `courses/current-field-step.html:10,15,19,3841,4238` | Vật lí 12 scan có mở đầu phần Từ trường (`page-057.jpg`, `page-060.jpg`) nhưng mapping lại trỏ Vật lí 11; chưa xác định đúng sách/hình. | **Một phần** |
| `brownian-step` | Chuyển động Brown/khuếch tán (`catalog.json:1207`) | Vật lí 10 và 12 (`content/course-mapping.json:1412-1419`) | `courses/brownian-step.html:10,15,19,3841,4238` | Mapping xuyên khối; scan đã thấy khí lí tưởng ở Vật lí 12 nhưng chưa thấy hình Brown tương ứng và chưa chọn được sách chính. | **Một phần** |

**Không có dòng “Đủ”** trong bảng trên. Đây là kết luận về mức độ đối chiếu với SGK, không phải kết luận rằng các course không chạy được. Bằng chứng 3D xác nhận bundle có renderer/scene/controls/model, nhưng không tự xác nhận model đó là đúng hình SGK.

## 4. Các hoạt động/hình SGK đã thấy nhưng đang thiếu mô phỏng

| Nguồn | Hoạt động/hình đã thấy | Course tương ứng | Kết quả và bằng chứng |
|---|---|---|---|
| Vật lí 10, Bài 3 | Thực hành tính sai số trong phép đo, ghi kết quả đo | Chưa có | **Thiếu** — `page-018.jpg`; không có slug trong 10 dòng mapping Vật lí. |
| Vật lí 10, Bài 6 | Thực hành đo tốc độ của vật chuyển động | Chưa có | **Thiếu** — `page-031.jpg`. Không nên gán nhầm cho `accel-force-step`. |
| Vật lí 10, Bài 11 | Thực hành đo gia tốc rơi tự do | Chưa có | **Thiếu** — `page-048.jpg`; `accel-force-step` là thí nghiệm a–F–m, không phải rơi tự do (`docs/coverage/physics.md:29,62`). |
| Vật lí 10, Bài 12 | Chuyển động ném và các hình quỹ đạo | `projectile-step` | **Một phần** — `page-050.jpg`, course có 3D nhưng tên “ném ngang” và figure cụ thể chưa xác minh. |
| Vật lí 11, Bài 1-3/5-7 | Dao động điều hòa, năng lượng, tắt dần/cưỡng bức/cộng hưởng | Chưa có | **Thiếu** — `page-008.jpg`, `page-012.jpg`, `page-016.jpg`, `page-022.jpg`, `page-026.jpg`, `page-030.jpg`. Không có course dao động trong mapping Vật lí. |
| Vật lí 11, Bài 8/12/13 | Mô tả sóng, giao thoa sóng, sóng dừng | Chưa có | **Thiếu** — `page-034.jpg`, `page-050.jpg`, `page-054.jpg`. `current-field-step`/`self-induction-step` không phải mô phỏng sóng. |
| Vật lí 11, Bài 10/15 | Đo tần số sóng âm, đo tốc độ truyền âm | Chưa có | **Thiếu** — `page-043.jpg`, `page-060.jpg`. |
| Vật lí 12, Bài 1-5 | Chuyển thể, nội năng, nhiệt độ, nhiệt dung riêng, nhiệt nóng chảy và phần thực hành nhiệt | Chưa có | **Thiếu** — `page-008.jpg`, `page-022.jpg`, `page-030.jpg`. `energy-step` là cơ học, không phải hoạt động nhiệt. |
| Vật lí 12, Bài 9-12 | Boyle, Charles, phương trình khí lí tưởng, áp suất khí theo mô hình động học | Chưa có | **Thiếu** — `page-039.jpg`, `page-043.jpg`, `page-047.jpg`, `page-050.jpg`. `brownian-step` chỉ gần chủ đề và chưa xác minh figure. |
| Vật lí 12, phần III | Hình/hoạt động mở đầu Từ trường | `current-field-step` | **Một phần** — `page-057.jpg`, `page-060.jpg`; mapping hiện trỏ Vật lí 11, cần xác minh lại sách/chương trước khi gọi là đủ. |

## 5. Đánh giá runtime và mức “3D thật”

Audit tĩnh cho thấy 10 course đều có đủ dấu hiệu của mô phỏng WebGL/Three.js: canvas, renderer, scene, geometry/model và controls. Vì yêu cầu lần này không sửa code và không phải test trình duyệt tương tác, báo cáo **không** khẳng định FPS, resize, bridge/shell lifecycle hay mọi thao tác nút đều đã pass runtime. Cần chạy smoke test riêng trên từng route để xác nhận:

1. iframe mở được và canvas có kích thước lớn hơn 0;
2. camera/orbit controls nhận drag, wheel và touch;
3. nút bước/slider trong `catalog.json` thực sự thay đổi scene;
4. resize tab không làm canvas trắng;
5. không có lỗi console/asset 404;
6. bridge không nuốt sự kiện pointer hoặc làm mất state khi chuyển bài.

Vì vậy nhãn **Một phần** trong bảng §3 bao gồm cả thiếu bằng chứng curriculum/figure; nó không phải bug runtime.

## 6. Ưu tiên bổ sung mô phỏng

1. **P0 — Vật lí 10:** tạo/đối chiếu `free-fall-measurement`, `speed-measurement`, `measurement-error`; đây là các thực hành đã thấy rõ và hiện đang thiếu.
2. **P0 — Vật lí 11:** dao động, cộng hưởng, giao thoa/sóng dừng, đo tần số và tốc độ âm; đây là cụm hình/thí nghiệm lớn nhất đang thiếu.
3. **P1 — Vật lí 12:** Boyle/Charles/khí lí tưởng và thực hành nhiệt; cần tách `brownian-step` khỏi mapping xuyên khối nếu OCR xác nhận chương cụ thể.
4. **P1 — Chuẩn hóa mapping:** chỉ điền `chapterRefs`, `textbookPageRefs`, `figureRef` sau OCR/đối chiếu ảnh; không đổi tên course thành tên SGK chỉ vì chủ đề gần.
5. **P2 — Runtime smoke test:** chụp bằng chứng canvas/controls/scene cho từng route và lưu kết quả test riêng, tách khỏi audit coverage.

## 7. Tệp và dòng bằng chứng chính

- `catalog.json:444-1226` — 10 course Vật lí, title, file và cover.
- `content/course-mapping.json:541-1419` — candidate book mapping; page/chapter refs chưa được xác minh.
- `content/manifest.json:77-101,199-230` — tên file và số trang SGK Vật lí.
- `docs/coverage/physics.md:27-36,62-63,83,100,106-107` — kết luận coverage hiện tại và cảnh báo mismatch.
- `docs/ocr/physics-final/mapping.csv` — schema mapping OCR; các dòng Vật lí chưa có page/chapter confidence đủ để xác nhận.

