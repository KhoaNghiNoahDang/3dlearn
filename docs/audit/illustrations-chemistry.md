# Audit hình minh họa và thí nghiệm Hóa học 11–12

Ngày audit: 2026-10-31  
Phạm vi: catalog, mapping, coverage, OCR naming và toàn bộ HTML course Hóa hiện có.  
Nguyên tắc: báo cáo chỉ đọc/audit; không sửa `catalog.json`, `content/course-mapping.json` hoặc code course.

## 1. Kết luận nhanh

- `catalog.json` có **25 course Hóa**; tất cả đều có HTML tương ứng trong `courses/` và cover riêng trong `covers/`.
- Hai nguồn SGK hiện có là bản scan ảnh: Hóa 11 có 81 trang, Hóa 12 có 75 trang; manifest đánh dấu `scan-needs-ocr`.
- **25/25 HTML catalog Hóa đều có Three.js/WebGL thật**, không phải giao diện DOM/ảnh thuần:
  - có canvas WebGL và `WebGLRenderer`;
  - có `OrbitControls`, camera phối cảnh, animation loop và pointer interaction;
  - có scene/material/geometry procedural trong bundle inline.
- **0/25 course tải ảnh minh họa SGK, GLB/GLTF hoặc texture raster bên ngoài** trong HTML. Không phát hiện `<img>`, `GLTFLoader`, `TextureLoader`, `.glb`, `.gltf`, `.png`, `.jpg`, `.webp` hay `.svg` asset reference trong 25 course.
- DOM/SVG vẫn được dùng cho tiêu đề, nút, slider, chú thích, đường dẫn callout và bảng kết quả; đây là lớp điều khiển/annotation, không phải phần dựng cảnh chính.
- Các cover `.webp` là asset catalog riêng, không phải hình SGK được nhúng vào mô phỏng.
- Về nội dung SGK: tên/chương/bài trong [`content/phase2/naming-chemistry.json`](../../content/phase2/naming-chemistry.json) là mapping bảo thủ đã OCR mục lục. `page` là trang bắt đầu bài, chưa phải bằng chứng vị trí chính xác của từng hình/thí nghiệm.

## 2. Nguồn và phương pháp

### Nguồn nội dung

| Nguồn | Phạm vi sử dụng |
|---|---|
| [`docs/coverage/chemistry.md`](../coverage/chemistry.md) | Mục lục Hóa 11/12, coverage, nhóm chủ đề và khoảng thiếu |
| [`content/course-mapping.json`](../../content/course-mapping.json) | 25 slug, title catalog, candidate book và mapping hiện hành |
| [`content/phase2/naming-chemistry.json`](../../content/phase2/naming-chemistry.json) | Tên chuẩn hóa, chương/bài/trang OCR và confidence |
| [`catalog.json`](../../catalog.json) | Kiểm tra course/cover/online entry và title catalog |
| [`content/manifest.json`](../../content/manifest.json) | Số trang và trạng thái scan của SGK |
| [`SGK Hóa học 11-mau.pdf`](../../SGK/SGK%20H%C3%B3a%20h%E1%BB%8Dc%2011-mau.pdf) | Bản scan Hóa 11, OCR mục lục/hướng dẫn sử dụng sách |
| [`SGK Hóa học 12-mau.pdf`](../../SGK/SGK%20H%C3%B3a%20h%E1%BB%8Dc%2012-mau.pdf) | Bản scan Hóa 12, OCR mục lục/hướng dẫn sử dụng sách |

### Kiểm tra HTML

Đã quét 25 file `courses/*-step.html` có `legacySubject = chem` trong mapping. Các dấu hiệu được kiểm tra gồm:

- `<canvas>`, `WebGLRenderer`, `PerspectiveCamera`, `OrbitControls`, `requestAnimationFrame`;
- geometry/material/scene procedural và raycast/pointer event;
- `<img>`, `TextureLoader`, `GLTFLoader`, `.glb`, `.gltf`, ảnh raster/SVG ngoài;
- nút, slider, fullscreen/reset, lớp DOM/SVG annotation.

Đây là static audit. Nó xác nhận kiến trúc và mã nguồn có WebGL; chưa thay thế kiểm thử GPU runtime trên từng máy trình duyệt.

## 3. Phân loại renderer và asset

| Phân loại | Số lượng | Kết luận |
|---|---:|---|
| Three.js + WebGL procedural | 25/25 | Cảnh chính dựng bằng geometry/material trong HTML bundle; có camera, ánh sáng, animation và tương tác |
| Canvas nhưng không WebGL | 0/25 | Không có course nào chỉ dùng 2D canvas |
| DOM/ảnh thuần | 0/25 | Không có course Hóa catalog nào là mockup HTML/ảnh thuần |
| Có `<img>`/texture raster/GLB/GLTF trong HTML | 0/25 | Không phát hiện asset minh họa SGK được nhúng trực tiếp |
| Có DOM/SVG overlay | 25/25 | Dùng cho control, label, callout, bảng đọc số và lời giải |

### Nhận xét kiến trúc

1. **3D thực sự có tồn tại:** bundle có implementation Three.js inline, WebGL renderer, camera phối cảnh, material, geometry, raycast và OrbitControls. Vì vậy không nên mô tả 25 bài là “HTML giả 3D”.
2. **Mô hình hiện là procedural, không phải bản sao hình SGK:** không có đường dẫn hình sách hoặc mô hình 3D ngoài; mọi bình, ống, lò, pin, điện cực, phân tử và dòng khí/nước được dựng bằng primitive/shader/đường nét trong code.
3. **UI là hybrid:** canvas/WebGL đảm nhiệm hiện tượng và vật thể; DOM/SVG đảm nhiệm chữ, bước học, slider, callout và số đo. Đây là lựa chọn phù hợp để giữ chữ rõ, nhưng cần kiểm thử overlay ở màn hình nhỏ.
4. **Có dấu hiệu bundle lặp:** mỗi HTML tự chứa một bản Three.js rất lớn khoảng 0.9–1.0 MB, thay vì dùng một runtime/module dùng chung. Điều này không làm mất tính 3D nhưng làm tăng kích thước tải và chi phí bảo trì.
5. **Không có bằng chứng asset SGK trong runtime:** title/course có thể bám chủ đề SGK, nhưng hình minh họa hiện tại là diễn giải mới. Cần tách rõ “mô phỏng theo bài SGK” với “hình/figure lấy từ SGK”.

## 4. Đối chiếu từng course Hóa

Trong bảng dưới, `3D/WebGL` là kết quả static audit của HTML; `SGK audit` là mức neo nội dung theo coverage/OCR, không phải đánh giá chất lượng mô phỏng.

### Hóa học 11

| Slug | Tên chuẩn hóa/ý nghĩa minh họa | Neo SGK/OCR | SGK audit | 3D/WebGL và thí nghiệm |
|---|---|---|---|---|
| `haber-step` | Quy trình Haber-Bosch: tổng hợp ammonia | Chương 2, Bài 5, trang mở đầu in 33 | Cao; quy trình công nghiệp, tách khỏi ammonia lab | WebGL procedural; mô phỏng thiết bị/quy trình, không dùng ảnh SGK |
| `rate-step` | Các yếu tố ảnh hưởng đến tốc độ phản ứng hóa học | Chưa có neo chắc trong Hóa 11/12; cần Hóa 10 hoặc nguồn khác | Chưa xác minh | WebGL procedural; có control/step nhưng nguồn SGK thí nghiệm còn thiếu |
| `ball-stick-step` | Lắp mô hình phân tử hợp chất hữu cơ | Chương 3, Bài 10/Bài 13 | Trung bình; course xuyên hai bài, chưa chốt bài chính | WebGL procedural; đúng dạng mô hình 3D quả cầu–que, không tải model ngoài |
| `titration-step` | Chuẩn độ acid-base: xác định điểm tương đương | Chương 1, Bài 2, trang mở đầu in 16 | Cao ở cấp bài; trang thí nghiệm cụ thể chưa audit | WebGL procedural; có slider/điều khiển và lớp đọc số DOM |
| `chlorine-step` | Điều chế và tính chất của chlorine | Không có bài chlorine tương ứng chắc trong Hóa 11/12; cần Hóa 10/nguồn khác | Chưa xác minh | WebGL procedural; mô phỏng hóa chất/dụng cụ nhưng chưa có neo SGK chính thức |
| `sulfuric-step` | Sản xuất sulfuric acid theo phương pháp tiếp xúc | Chương 2, Bài 8, trang mở đầu in 48 | Cao ở cấp bài | WebGL procedural; mô phỏng dây chuyền công nghiệp, không dùng sơ đồ ảnh SGK |
| `hydrolysis-step` | Sự thủy phân của muối | Chương 1, Bài 2, trang mở đầu in 16 | Cao ở cấp mạch cân bằng dung dịch | WebGL procedural; cần giữ tách khỏi chuẩn độ và điện li |
| `ammonia-step` | Ammonia và muối ammonium: điều chế/tính chất | Chương 2, Bài 5, trang mở đầu in 33 | Cao; thí nghiệm đài phun được giữ riêng | WebGL procedural; có tương tác thí nghiệm, không dùng ảnh SGK |
| `equilibrium-step` | Các yếu tố ảnh hưởng đến chuyển dịch cân bằng | Chương 1, Bài 1, trang mở đầu in 6 | Cao ở cấp bài | WebGL procedural; phù hợp mô hình hiện tượng và bước quan sát |
| `flame-step` | Thử màu ngọn lửa và quang phổ nguyên tử | Không có neo chắc trong Hóa 11/12; cần nguồn Hóa 10 | Chưa xác minh | WebGL procedural; có thể biểu diễn ánh sáng/quang phổ nhưng chưa có page/figure SGK |
| `conductivity-step` | Chất điện li và tính dẫn điện của dung dịch | Chương 1, Bài 2, trang mở đầu in 16 | Cao ở cấp bài | WebGL procedural; lớp DOM/SVG đọc số và chú thích, không dùng ảnh |
| `nitric-lab-step` | Nitrogen oxide và nitric acid | Chương 2, Bài 6, trang mở đầu in 38 | Cao ở cấp bài | WebGL procedural; mô phỏng thí nghiệm/chuyển hóa, chưa có mapping figure cụ thể |
| `bromine-step` | Tách bromine từ nước biển | Không có neo chắc trong Hóa 11/12; cần nguồn bổ sung | Chưa xác minh | WebGL procedural; có cảnh quy trình nhưng chưa được chứng minh là hình/thí nghiệm SGK |
| `sulfur-step` | Sulfur, sulfur dioxide và sulfuric acid: tính chất/chuyển hóa | Chương 2, Bài 7/Bài 8 | Cao; course xuyên hai bài | WebGL procedural; nên trình bày là composite lesson, không gán một figure duy nhất |

### Hóa học 12

| Slug | Tên chuẩn hóa/ý nghĩa minh họa | Neo SGK/OCR | SGK audit | 3D/WebGL và thí nghiệm |
|---|---|---|---|---|
| `blast-furnace-step` | Luyện gang trong lò cao | Chương 6, Bài 20, trang mở đầu in 94 | Cao ở cấp bài | WebGL procedural; phù hợp mô hình lò cao/quy trình, không dùng ảnh SGK |
| `smelting-step` | Luyện kim: điện phân nóng chảy và nhiệt luyện | Chương 5 Bài 16 + Chương 6 Bài 20 | Cao nhưng là composite | WebGL procedural; cần giữ hai quy trình/nhánh tách biệt trong UI |
| `coal-gas-step` | Khí hóa than và sử dụng tổng hợp than đá | Không thấy bài tương ứng trong mục lục Hóa 12 đã kiểm tra | Chưa xác minh | WebGL procedural; mô phỏng công nghiệp không có neo SGK an toàn |
| `cement-step` | Sản xuất xi măng | Không thấy bài tương ứng trong mục lục Hóa 12 đã kiểm tra | Chưa xác minh | WebGL procedural; cần đánh dấu enrichment/industry extension |
| `iron-step` | Sắt và hợp chất của sắt | Liên quan Chương 6 Bài 19/Bài 20 và Chương 8 Bài 27; chưa có một lesson duy nhất | Trung bình | WebGL procedural; mô hình chuyển hóa nên ghi là multi-lesson, không phải figure SGK đơn |
| `electrolysis-step` | Điện phân dung dịch và ứng dụng | Chương 5, Bài 16, trang mở đầu in 78 | Cao ở cấp bài | WebGL procedural; có cảnh điện cực/dung dịch và control tương tác |
| `galvanic-step` | Pin điện hóa và nguồn điện hóa học | Chương 5, Bài 15, trang mở đầu in 67 | Cao ở cấp bài | WebGL procedural; mô phỏng pin/dung dịch, không dùng asset điện hóa ngoài |
| `sodium-step` | Nguyên tố nhóm IA: sodium và hợp chất | Chương 7, Bài 24, trang mở đầu in 108 | Cao ở cấp bài | WebGL procedural; phù hợp demonstration, nhưng cần kiểm tra an toàn hóa chất khi diễn giải |
| `corrosion-step` | Ăn mòn kim loại và thiết kế miếng dán giữ nhiệt | Chương 6, Bài 22, trang mở đầu in 102 | Cao; miếng dán là extension | WebGL procedural; mô phỏng ăn mòn/thiết kế, không dùng ảnh SGK |
| `chlor-alkali-step` | Điện phân dung dịch NaCl và công nghiệp chlor-kiềm | Chương 5, Bài 16, trang mở đầu in 78 | Cao ở cấp bài | WebGL procedural; phải tách khỏi `chlorine-step` trong catalog/UI |
| `hou-soda-step` | Sản xuất sodium carbonate theo quy trình công nghiệp | Liên quan Chương 7, Bài 24 nhưng chưa thấy title/process trong mục lục | Thấp; chỉ topic relation | WebGL procedural; không được ghi là hình minh họa SGK đã xác minh |

### Prototype Hóa bổ sung ngoài catalog

| File | Trạng thái | Audit renderer | Quan hệ SGK |
|---|---|---|---|
| [`courses/phase2-chem-acid-base-titration.html`](../../courses/phase2-chem-acid-base-titration.html) | Có trong `courses/` và metadata Phase 2 nhưng chưa phải slug catalog | Three.js module + WebGL canvas, procedural; không có ảnh/GLTF | Bám Hóa 11 Chương 1 Bài 2 theo [`content/phase2/chemistry-physics.json`](../../content/phase2/chemistry-physics.json); cần phân biệt với `titration-step` khi hiển thị hai entry |

## 5. Đánh giá hình minh họa và thí nghiệm theo SGK

### Những gì đã có

- Có một canvas 3D trung tâm cho mỗi course, camera phối cảnh và điều khiển xoay/zoom/pan.
- Các quy trình công nghiệp có thể biểu diễn tốt bằng procedural scene: Haber-Bosch, sulfuric acid, lò cao, điện phân, chlor-alkali, soda.
- Các thí nghiệm có thể thao tác bằng slider/nút/bước: chuẩn độ, ammonia, cân bằng, điện li, nitric acid, galvanic, electrolysis, corrosion.
- Overlay DOM/SVG giúp đặt tên dụng cụ, số đo, callout và lời giải mà không phụ thuộc vào texture chữ trong WebGL.

### Những gì chưa có bằng chứng

- Chưa có mapping `figureRef`/số hình SGK cho 25 course.
- Chưa có asset provenance cho “hình minh họa theo SGK”; code chỉ chứng minh cảnh procedural tự dựng.
- Chưa audit từng trang nội dung của mỗi bài để khẳng định một cảnh 3D tương ứng với đúng thí nghiệm SGK, thay vì chỉ đúng chủ đề.
- Sáu chủ đề đang thiếu/không chắc nguồn (`rate`, `chlorine`, `bromine`, `flame`, `coal-gas`, `cement`) không nên được gắn nhãn “mô phỏng thí nghiệm SGK” trong giao diện.

## 6. Các rủi ro cần xử lý trước khi gọi là “bám SGK”

1. **Bám bài không đồng nghĩa bám hình:** mapping chương/bài hiện có không chứng minh figure hoặc apparatus cụ thể.
2. **Một số course composite:** `ball-stick`, `iron`, `smelting`, `sulfur` cần hiển thị nhiều bài/nhánh, không tạo một breadcrumb SGK duy nhất.
3. **Tên catalog và title HTML chưa hoàn toàn đồng nhất:** ví dụ Haber, lò cao, khí hóa than, sulfuric acid, ammonia, xi măng và soda có title HTML diễn giải khác title catalog. Nên dùng lớp `displayTitle`/`textbookTitle` trong naming riêng, không sửa catalog trong audit này.
4. **Tải lặp Three.js:** 25 bundle độc lập làm tăng kích thước và khiến sửa renderer/OrbitControls phải lặp hoặc rebuild nhiều file.
5. **Fallback WebGL:** static audit chưa chứng minh trải nghiệm khi WebGL bị tắt, GPU yếu hoặc trình duyệt chặn canvas. Cần thêm thông báo fallback rõ ràng ở runtime.
6. **An toàn hóa chất:** cảnh sodium, chlorine, bromine, nitric acid và sulfuric acid cần ghi rõ “mô phỏng an toàn”, không diễn giải như hướng dẫn thao tác thật ngoài phòng thí nghiệm.

## 7. Backlog xác minh hình/thí nghiệm

1. OCR/render từng trang nội dung có nhãn “Hoạt động thí nghiệm” trong hai SGK; lưu `printedPage`, `pdfPage`, `figureRef` và crop evidence.
2. Tạo bảng `course -> sgkActivity -> figure/experiment -> page -> confidence`; không dùng trang mở đầu bài thay cho trang thí nghiệm.
3. Đối chiếu apparatus procedural với hình SGK ở mức chức năng: bình, ống, điện cực, dòng khí, chỉ thị, cảm biến và kết quả quan sát.
4. Gắn nhãn trong UI: `Theo chủ đề SGK`, `Theo hoạt động SGK`, hoặc `Mở rộng công nghiệp`; không dùng chung một badge “SGK” cho cả ba mức.
5. Đưa Three.js core/OrbitControls về shared runtime hoặc chunk dùng chung ở bước kiến trúc tiếp theo; giữ scene data/course logic riêng.

## 8. Phạm vi không làm trong audit này

- Không sửa HTML, JavaScript, CSS, catalog, mapping hoặc asset.
- Không kết luận 25 course đã khớp chính xác từng hình/thí nghiệm trong SGK.
- Không coi các URL `online` trong catalog là bằng chứng kỹ thuật/runtime độc lập.
