# Audit hình minh hoạ và tương tác – Địa lí 10

## 1. Phạm vi và cách đọc kết quả

Ngày audit: 31/10/2026  
Phạm vi: SGK Địa lí 10, báo cáo coverage Địa lí, 14 course `geo` hiện có, và 2 mô phỏng `phase2-geo-*`. Báo cáo này **chỉ đọc và đánh giá**, không sửa catalog hay code.

Nguồn SGK chuẩn đang dùng là **Địa lí 10 – Kết nối tri thức với cuộc sống** tại [`SGK/SGK Địa lí 10-mau.pdf`](../../SGK/SGK%20Địa%20lí%2010-mau.pdf). File scan có 60 trang PDF nhưng PyMuPDF trả về 0 trang có text; không có Tesseract/OCR engine cục bộ để đọc tự động toàn bộ chú thích hình. Mục lục đã được kiểm tra trực quan ở các trang PDF 4–5, xác nhận sách có 13 chương và 40 bài, từ trang in 5 đến 111.

Vì vậy, các trạng thái trong báo cáo có nghĩa:

- **PASS – static**: mã nguồn thể hiện rõ mô hình/lớp dữ liệu/điều khiển tương ứng; chưa đồng nghĩa đã QA trên browser.
- **PARTIAL**: có một phần ý tưởng hoặc mô hình liên quan nhưng chưa đủ bài thực hành, dữ liệu địa phương, bản đồ/biểu đồ hay chú thích SGK.
- **PENDING – runtime**: cần chạy route trong Vite/LessonShell để xác nhận bridge, WebGL, resize, chữ và hành vi thực tế.
- **NOT CONFIRMED**: chưa đủ bằng chứng để gọi là bản đồ địa lí thật, ảnh SGK thật hoặc biểu đồ đúng dữ liệu SGK.

## 2. Kết luận nhanh

- Coverage hiện tại đối chiếu theo [`docs/coverage/geography.md`](../coverage/geography.md): **4 bài đủ lõi, 7 bài một phần, 29 bài thiếu**; chỉ số kế hoạch quy đổi là 7,5/40 = 18,75%.
- Catalog có 14 course `geo`. Cả 14 file đều có dấu hiệu tĩnh của Three.js/WebGL, `OrbitControls`, các bước học và điều khiển dạng slider/nút.
- Cả 14 course đều có code dựng một “sheet” SVG/procedural để minh hoạ; đây là hình/sơ đồ tương tác nội bộ, **chưa đủ bằng chứng để gọi là bản đồ GIS hoặc hình SGK**.
- Hai mô phỏng phase2 có bằng chứng tương tác 3D rõ ràng: quả địa cầu, lớp dữ liệu, vệ tinh/đường truyền, ranh giới mảng, điểm động đất, núi lửa, slider và bước học.
- Bridge không nằm trực tiếp trong source HTML course; nó được tiêm khi chạy dev qua `vite.config.ts` và khi stage release qua `scripts/stage-release.mjs`. Vì vậy source scan thấy `bridge=false` là đặc tính kiến trúc, không tự động là lỗi.
- Chưa thực hiện browser smoke test trong phiên audit này. Do đó chưa thể khẳng định 16 route (14 course hiện có + 2 phase2) hoạt động hoàn hảo trên máy triển khai.

## 3. Đối chiếu SGK và hình/hoạt động cần có

| Bài SGK | Nội dung/hình hoặc thực hành cần thể hiện | Hiện trạng trong workspace | Đánh giá |
|---:|---|---|---|
| 2 | Các phương pháp biểu hiện đối tượng trên bản đồ: kí hiệu, chấm điểm, khoanh vùng, nền chất lượng, đường chuyển động, bản đồ–biểu đồ | Chưa có course catalog hoặc phase2 chuyên biệt | **Thiếu – P0** |
| 3 | Bản đồ, GPS và bản đồ số; lớp dữ liệu, định vị, đo khoảng cách/tuyến | `phase2-geo-gps-step.html`; chưa có trong catalog chung | **PASS – static; PENDING runtime** |
| 8 | Thực hành phân bố vành đai động đất, núi lửa | `phase2-geo-earthquake-volcano-step.html`; chưa có trong catalog chung | **PASS – static; PENDING runtime** |
| 10 | Bản đồ các đới/kiểu khí hậu và phân tích biểu đồ nhiệt – mưa | Chưa có course/phase2 tương ứng | **Thiếu – P0** |
| 13 | Phân tích chế độ nước sông Hồng bằng bảng/biểu đồ và mùa lũ – cạn | `river-step` có mô hình địa hình sông, nhưng coverage ghi rõ chưa phải dữ liệu/chế độ nước sông Hồng | **PARTIAL – P0** |
| 16 | Phân bố đất và sinh vật trên thế giới; bản đồ lớp và chú giải | `soil-step` chỉ tập trung nhân tố hình thành đất/phẫu diện | **Thiếu – P0** |
| 27 | Vẽ và nhận xét biểu đồ sản lượng lương thực thế giới | Chưa có course/phase2 trình dựng biểu đồ theo dữ liệu SGK | **Thiếu – P0** |
| 32, 38 | Viết báo cáo thực hành về công nghiệp/dịch vụ, cần nguồn, bản đồ, biểu đồ và dàn ý | Chưa có workspace tương ứng | **Thiếu – P0** |
| 5 | Chuyển động Trái Đất, mùa, góc nhập xạ, vành đai nhiệt | `earth-motion-step`, `insolation-step` | **Đủ lõi theo coverage; static interaction evidence** |
| 6 | Thạch quyển và kiến tạo mảng | `tectonic-step` | **Đủ lõi theo coverage; static interaction evidence** |
| 7 | Nội lực, ngoại lực, địa hình | `river-step`, `karst-step` | **PARTIAL** |
| 9 | Khí quyển, nhận nhiệt, khí áp, gió và hoàn lưu | `heating-step`, `wind-step`, `thermal-step`, `circulation-step` | **Đủ lõi theo coverage; static interaction evidence** |
| 11 | Thuỷ quyển, nước trên lục địa, vòng tuần hoàn | `water-cycle-step`, `river-step` | **PARTIAL** |
| 12 | Nước biển, đại dương, dòng biển và biển – khí quyển | `currents-step`, `enso-step` | **PARTIAL** |
| 14 | Nhân tố hình thành đất và phẫu diện | `soil-step` | **Đủ lõi theo coverage; static interaction evidence** |
| 31, 39, 40 | Công nghiệp và môi trường; tài nguyên; phát triển bền vững/tăng trưởng xanh | `carbon-step` có liên hệ biến đổi khí hậu/an ninh, không thay thế trọn các bài | **PARTIAL** |

Các bài còn lại trong ma trận 40 bài của coverage hiện chưa có asset/course đủ đáng tin cậy để đối chiếu. Đặc biệt chưa có bằng chứng về các hình/bản đồ/biểu đồ cho phần dân cư, đô thị hoá, nguồn lực, nông nghiệp, công nghiệp, dịch vụ, giao thông, du lịch, thương mại và tài chính.

## 4. Audit 14 course Địa lí hiện có

| Course | Nội dung chính | 3D + OrbitControls | Bước/điều khiển | Sheet SVG/procedural | Bản đồ địa lí thật | Trạng thái |
|---|---|---:|---:|---:|---:|---|
| `earth-motion-step` | Hệ quả chuyển động Trái Đất | Có | Có | Có | Chưa xác minh | PASS-static |
| `insolation-step` | Góc nhập xạ, mùa, vành đai nhiệt | Có | Có | Có | Chưa xác minh | PASS-static |
| `tectonic-step` | Địa hình kiến tạo | Có | Có | Có | Chưa xác minh | PASS-static |
| `heating-step` | Khí quyển nhận nhiệt | Có | Có | Có | Chưa xác minh | PASS-static |
| `wind-step` | Gió và chuyển động ngang không khí | Có | Có | Có | Chưa xác minh | PASS-static |
| `thermal-step` | Hoàn lưu nhiệt | Có | Có | Có | Chưa xác minh | PASS-static |
| `circulation-step` | Đai khí áp, đới gió, hoàn lưu | Có | Có | Có | Chưa xác minh | PASS-static |
| `currents-step` | Dòng biển | Có | Có | Có | Chưa xác minh | PASS-static |
| `enso-step` | El Niño, La Niña | Có | Có | Có | Chưa xác minh | PASS-static |
| `water-cycle-step` | Vòng tuần hoàn nước | Có | Có | Có | Chưa xác minh | PASS-static |
| `river-step` | Địa hình sông | Có | Có | Có | Chưa xác minh | PARTIAL |
| `karst-step` | Địa hình các-xtơ | Có | Có | Có | Chưa xác minh | PARTIAL |
| `soil-step` | Hình thành đất, phẫu diện | Có | Có | Có | Chưa xác minh | PASS-static |
| `carbon-step` | Biến đổi khí hậu/an ninh | Có | Có | Có | Chưa xác minh | PARTIAL |

### Bằng chứng tĩnh đã kiểm tra

- Mỗi file course đều có `THREE`, `WebGLRenderer`/canvas hoặc pipeline render tương đương, và import `OrbitControls`.
- Mỗi file có UI bước học và các listener chuyển bước; nhiều file có slider/switch để thay đổi biến mô hình.
- Các file có logic vẽ Canvas/SVG và bộ dựng sheet procedural. Những dấu hiệu `chart`, `plot`, `lineTo`, `arc`, `fillRect` chứng minh có code vẽ dữ liệu/hình minh hoạ, nhưng không đủ để kết luận biểu đồ đang dùng đúng bộ số liệu SGK hay có đầy đủ tooltip/legend trên runtime.
- Không tìm thấy bằng chứng đủ mạnh về asset ảnh SGK được nạp như ảnh tĩnh hoặc texture có nguồn/chú thích. Hình hiện có nên được gọi là **minh hoạ procedural**, trừ khi route runtime và metadata chứng minh khác.

## 5. Audit hai mô phỏng phase2

### `phase2-geo-gps-step.html` – Bài 3

**Đã thấy trong mã nguồn:**

- WebGL canvas, quả địa cầu, lớp khí quyển, lưới kinh – vĩ tuyến, điểm dữ liệu, điểm đích, vệ tinh, tia tín hiệu, vùng giao khoảng cách và tuyến Hà Nội – Đà Nẵng – Thành phố Hồ Chí Minh.
- Sáu bước: mở bản đồ số, bật lớp dữ liệu, ba vệ tinh, giao nhau khoảng cách, đo/dẫn đường, tự kiểm tra.
- `OrbitControls` cho xoay/pan/zoom; nút tự xoay; bật/tắt lưới; slider mật độ điểm và số vệ tinh; reset; phím mũi tên và `R`.
- `showStep()` thay đổi nội dung hướng dẫn và visibility của lớp dữ liệu, vệ tinh, vùng khoảng cách, tuyến đường.

**Kết luận:** mô hình 3D và thao tác là thật ở mức source static, không phải ảnh chụp. Bridge tương thích nhờ các nút `[data-step-index]` và bridge chung. Chưa xác minh trực tiếp message `ready`, `stepChanged`, `modeChanged`, `state` trên browser.

### `phase2-geo-earthquake-volcano-step.html` – Bài 8

**Đã thấy trong mã nguồn:**

- WebGL canvas, quả địa cầu/lớp vỏ, lưới, đường ranh giới mảng, mũi tên hướng chuyển động, điểm động đất có độ sâu, nón núi lửa procedural.
- Sáu bước: quan sát toàn cầu, ranh giới mảng, kiểu chuyển động, động đất theo độ sâu, vành đai núi lửa, tự kiểm tra.
- `OrbitControls` cho xoay/pan/zoom; tự xoay; bật/tắt ranh giới; bật/tắt núi lửa; slider ngưỡng độ sâu; reset; phím mũi tên và `R`.
- `filterQuakes()` thật sự cập nhật `visible` của điểm động đất theo độ sâu và bước hiện tại.

**Kết luận:** có tương tác 3D và lọc dữ liệu thật ở mức source static. Bridge tương thích nhờ các nút `[data-step-index]` và bridge chung. Chưa xác minh trực tiếp message/state trên browser.

## 6. Phân biệt tương tác thật và hình tĩnh

| Loại asset | Bằng chứng hiện có | Kết luận audit |
|---|---|---|
| Mô hình 3D | Three.js/WebGL, scene, camera, renderer, OrbitControls; phase2 có nhóm object và visibility theo bước | **Tương tác thật ở static audit**; cần runtime smoke test |
| Quả địa cầu/bề mặt địa lí | Sphere, grid, points, lines, procedural geometry | **Minh hoạ 3D procedural**, chưa phải dữ liệu GIS có nguồn |
| Bản đồ 2D | Sheet SVG/procedural builder có `geo`/layout data ở một số course | **Có sơ đồ/hình vẽ**, chưa đủ bằng chứng là bản đồ địa lí chuẩn có projection, scale, legend và dataset |
| Biểu đồ | Có code vẽ chart/plot và nhiều slider | **Có dấu hiệu biểu đồ tương tác**, chưa kiểm chứng đúng dữ liệu, trục, đơn vị, tooltip và nhận xét SGK |
| Ảnh minh hoạ | Chưa thấy pipeline asset ảnh SGK/texture có nguồn trong các course đã quét | **Chưa xác nhận ảnh thật**; không nên ghi là “hình SGK” |
| Bridge | Inject bởi Vite dev plugin và release staging | **Có cơ chế build**, cần test iframe/parent message trên route thực tế |

## 7. Khoảng trống và rủi ro

1. **Bài thực hành còn thiếu:** Bài 2, 10, 13, 16, 27 và các bài báo cáo 32/38 cần bản đồ/biểu đồ/dữ liệu riêng; không thể suy ra đã phủ chỉ vì có một course 3D gần chủ đề.
2. **`river-step` chưa phải Bài 13:** cần chuỗi số liệu sông Hồng theo tháng, mùa lũ/mùa cạn, trục biểu đồ, đơn vị và phần nhận xét.
3. **Phase2 chưa ở catalog:** hai mô phỏng tồn tại trong `content/phase2/geography.json` nhưng chưa được thư viện course chung hiển thị; audit này không thay đổi điều đó.
4. **Bridge phụ thuộc pipeline:** mở trực tiếp file HTML ngoài Vite/release có thể không có bridge injection. Route deploy phải đi qua pipeline đã staging bridge.
5. **Phụ thuộc mạng:** các module Three.js của phase2 dùng import URL `https://esm.sh`; cần quyết định chiến lược bundle/cache trước deploy offline hoặc mạng trường học hạn chế.
6. **QA chữ và responsive chưa được xác nhận ở đây:** cần kiểm tra màn hình nhỏ, panel lời giải, legend, nhãn trục, tooltip và full-screen để tránh mất chữ/cắt nội dung.
7. **Độ chính xác SGK chưa chốt:** vì PDF là scan image-only và chưa OCR toàn bộ, chưa thể gắn figureRef/số trang/hình cụ thể cho từng asset.

## 8. Kiểm tra tiếp theo được đề xuất

### P0 – runtime smoke test

Chạy Vite và kiểm tra cả hai phase2 trong LessonShell/iframe:

- nhận `ready` sau khi load;
- parent gửi `setMode` với `rotate`, `pan`, `zoom` mà không phá `OrbitControls`;
- `setStep`, `reset`, `requestState` trả state hợp lệ;
- UI gửi `stepChanged`/`modeChanged` đúng bước/chế độ;
- slider, reset, resize, full-screen và phím tắt không làm mất canvas/chữ.

### P0 – nội dung SGK

- Bổ sung asset riêng cho Bài 2, 10, 13, 16, 27.
- Với mỗi asset, ghi `sourceBookId`, `lesson`, `printedPage`, `figureRef`, loại hình (`map`, `chart`, `diagram`, `photo`, `3d-model`) và nguồn dữ liệu.
- Không gọi procedural globe/sheet là “bản đồ SGK” nếu chưa đối chiếu chú thích.

### P1 – chất lượng hiển thị

- Kiểm thử 1280×720, 1440×900, tablet và màn hình dọc.
- Kiểm tra legend/trục/nhãn bằng overflow và zoom; ưu tiên xuống dòng thay vì cắt chữ.
- Thêm test dữ liệu biên cho slider, step cuối, reset nhiều lần và mất kết nối module.

