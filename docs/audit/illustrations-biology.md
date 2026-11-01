# Audit hình minh hoạ và thí nghiệm Sinh học 10-12

Ngày audit: 2026-10-31  
Phạm vi: SGK Sinh học 10-12 trong `SGK/`, mapping tại
`content/phase2/naming-biology.json` và `docs/coverage/biology.md`, các course
Sinh học trong `courses/`, `courses/cell-viewer.html`, cùng assets trong
`cell/public/` và code procedural trong `cell/src/`.

## Kết luận nhanh

- Catalog hiện có 12 bài Sinh học: 5 bài hiện tượng/thực hành procedural và 7
  bài cấu trúc tế bào đi qua `cell-viewer.html`.
- 5 bài procedural có Canvas + WebGLRenderer + OrbitControls. Đây là 3D tương
  tác thật ở mức renderer, không phải ảnh tĩnh.
- 7 bài cell có Canvas/Three.js trong viewer; 5 dùng GLB, 2 dùng hình học
  procedural. Các wrapper `cell-*-step.html` không tự chứa canvas.
- `phase2-bio-mitosis` và `phase2-bio-osmosis` đã có rail bước, fullscreen,
  reset và đồng bộ bridge; tuy nhiên hiện tại chúng chủ yếu đổi nội dung/bào
  quan focus. Chúng chưa mô phỏng trực tiếp nhiễm sắc thể, dòng nước, thể tích
  không bào hoặc màng tách khỏi thành tế bào.
- Không phát hiện course Sinh học nào chỉ là một ảnh HTML tĩnh. Ảnh hiện có
  chủ yếu là cover/preview; hình minh hoạ chính của course được dựng trên
  Canvas.
- Sinh học 12 hiện thiếu toàn bộ 35 bài theo mục lục SGK Kết nối tri thức;
  chưa có scene 3D, thí nghiệm hoặc mô phỏng chuyên biệt trong catalog.

## Evidence và giới hạn

Tên bài chính thức được đối chiếu từ các trang mục lục đã render:

- `docs/ocr/biology-final/sinh10-toc.png` - Sinh học 10, PDF trang 5 / trang in 4.
- `docs/ocr/biology-final/sinh11-toc.png` - Sinh học 11, PDF trang 6 / trang in 4.
- `docs/ocr/biology-final/sinh12-toc.png` - Sinh học 12, PDF trang 6 / trang in 4.

Tesseract và `pdftotext` không có trong môi trường audit. Evidence được render
bằng `pdftoppm` và đối chiếu trực quan; tên/chapter/page vẫn mang cờ
`needs-review` trong `naming-biology.json`. Các kết luận về code/assets dưới
đây là kiểm kê tĩnh từ file thực tế.

## Quy ước phân loại

| Nhãn | Ý nghĩa |
|---|---|
| 3D đầy đủ | Có Canvas/WebGL và điều khiển camera; nội dung chính đã có mô hình/scene tương ứng với mục tiêu bài. |
| 3D partial | Có renderer và tương tác, nhưng quá trình SGK, trạng thái thí nghiệm, nhãn, dữ liệu hoặc bước giải thích chưa được mô phỏng đầy đủ. |
| Hình/preview | Ảnh PNG/WEBP dùng làm cover, thumbnail, preview hoặc fallback; không tính là thí nghiệm 3D. |
| Missing | Chưa có lesson/scene/asset đủ để hỗ trợ mục tiêu bài. |

## Kiểm kê course hiện tại

### Nhóm hiện tượng và thực hành procedural

Các file sau có `WebGLRenderer`, `OrbitControls` và Canvas trực tiếp trong HTML:

| Slug | Tên trong catalog | Mức 3D | Audit hình/thí nghiệm | Thiếu chính |
|---|---|---|---|---|
| `plasmolysis-step` | Sự hút nước và mất nước của tế bào thực vật | 3D partial | Có scene tế bào/thí nghiệm tương tác procedural | Chưa gắn plant GLB và chưa thể hiện trực tiếp co/ phản co theo biến nồng độ trong cell viewer |
| `transport-step` | Vận chuyển qua màng | 3D partial | Có scene màng và các bước vận chuyển | Chưa có mô hình màng/bào quan cell liên kết trực tiếp; cần phân biệt rõ khuếch tán, kênh, protein mang, chủ động, nhập/xuất bào |
| `impulse-step` | Sự phát sinh và dẫn truyền xung thần kinh | 3D partial | Có scene 3D và bước điện thế/xung | Chưa dùng neuron GLB làm context; chưa có đường xung trực quan gắn với soma-axon-synapse trong cùng viewer |
| `mitosis-step` | Quan sát nguyên phân ở tế bào mô phân sinh đầu rễ | 3D partial | Có scene Canvas/WebGL và rail bước | Cần phase geometry rõ ràng cho kì đầu/giữa/sau/cuối và quan sát kiểu tiêu bản; không nên chỉ đổi label |
| `enzyme-step` | Các điều kiện ảnh hưởng đến hoạt tính enzyme | 3D partial | Có bàn thí nghiệm 3D procedural | Cần liên kết tên chính thức “enzyme amylase” trong SGK, dữ liệu đo/đồ thị và trạng thái biến tính/hồi phục rõ hơn |

Đánh giá: nhóm này đã vượt mức “ảnh minh hoạ”, nhưng `3D renderer` không đồng
nghĩa với `đã mô phỏng đủ thí nghiệm SGK`. Cần audit runtime từng step trước khi
gắn nhãn 3D đầy đủ trong sản phẩm.

### Nhóm cấu trúc tế bào qua cell viewer

Các wrapper `cell-*-step.html` chuyển sang `courses/cell-viewer.html`; viewer
khởi tạo Three.js, `OrbitControls`, `GLTFLoader`, Canvas, cutaway, organelle
chips, step rail và bridge.

| Slug | Tên trong catalog | Renderer/asset | Mức 3D | Audit |
|---|---|---|---|---|
| `cell-plant-step` | Cấu trúc tế bào thực vật | Plant GLB, fallback procedural | 3D đầy đủ về cấu trúc | Có wall, nucleus, chloroplast, vacuole focus; chưa phải mô phỏng quang hợp hay thẩm thấu định lượng |
| `cell-animal-step` | Cấu trúc tế bào động vật | Animal GLB, fallback procedural | 3D đầy đủ về cấu trúc | Có membrane, nucleus, mitochondria, Golgi; chưa mô phỏng đầy đủ vận chuyển hoặc hô hấp |
| `cell-bacteria-step` | Cấu trúc tế bào vi khuẩn | Bacteria-wall GLB, fallback procedural | 3D đầy đủ về cấu trúc | Có wall, nucleoid, flagellum focus; plasmid/ribosome chưa được xác nhận là mesh/animation độc lập |
| `cell-neuron-step` | Cấu trúc tế bào thần kinh | Neuron GLB, fallback procedural | 3D đầy đủ về cấu trúc | Có soma, axon, synapse focus; chưa tự động phát xung theo bước |
| `cell-whiteblood-step` | Tế bào bạch cầu và cơ chế thực bào miễn dịch | White-blood GLB, fallback procedural | 3D partial | Có hình thái/cấu trúc và focus lysosome/nucleus; chưa có chuỗi chân giả - phagosome - tiêu hoá hoàn chỉnh |
| `cell-muscle-step` | Cấu trúc sợi cơ và cơ chế trượt tơ co cơ | Procedural muscle/sarcomere | 3D partial | Có myofibril, sarcolemma, mitochondria; chưa xác nhận animation trượt actin-myosin theo thời gian |
| `cell-epithelial-step` | Tế bào biểu mô: cấu trúc phân cực và hàng rào | Procedural epithelial | 3D partial | Có microvilli, junctions, nucleus; chưa mô phỏng đầy đủ dòng chất qua hàng rào |

### Asset GLB hiện có

| Asset | Kích thước gần đúng | Vai trò |
|---|---:|---|
| `plant-cell-first001.glb` | 56.5 MB | Plant cell, phase2 mitosis/osmosis context |
| `white-blood-cell-user.glb` | 53.9 MB | White blood cell |
| `neuron-nih.glb` | 2.8 MB | Neuron |
| `animal-cell-nih.glb` | 1.5 MB | Animal cell |
| `bacteria-wall-nih.glb` | 0.5 MB | Bacterial wall |

PNG trong `cell/public/cell-renders/`,
`cell/public/cell-renders-transparent/` và `cell/public/nih-previews/` là
preview/thumbnail/reference; không tính là mô hình thí nghiệm.

## Audit Phase 2

| Phase 2 | Tên chính thức liên quan | Có 3D | Đã có thao tác | Mức thực nghiệm hiện tại |
|---|---|---|---|---|
| `phase2-bio-mitosis` | Chu kì tế bào và nguyên phân; liên quan thực hành quan sát tiêu bản | Plant GLB qua `cell-viewer?phase=mitosis` | 6 bước, previous/next, click rail, reset, fullscreen, bridge | Partial: step text và organelle focus thay đổi; chưa có chromosome geometry/animation theo từng kì |
| `phase2-bio-osmosis` | Trao đổi chất qua màng; thực hành co và phản co nguyên sinh | Plant GLB qua `cell-viewer?phase=osmosis` | 6 bước, previous/next, click rail, reset, fullscreen, bridge | Partial: step text và vacuole/wall focus thay đổi; chưa thay đổi thể tích, áp suất trương, nồng độ hay khoảng cách màng-thành |

Hai phase2 bài có giá trị như lớp dẫn hướng/giải thích 3D, nhưng chưa nên gọi là
“thí nghiệm ảo đầy đủ” nếu không có state model tương ứng.

## Đối chiếu SGK và phần thiếu

### Sinh học 10

| Cụm nội dung chính thức | Hiện trạng hình/thí nghiệm | Phân loại |
|---|---|---|
| Tế bào nhân sơ | `cell-bacteria-step` + GLB | 3D đầy đủ về cấu trúc |
| Tế bào nhân thực | `cell-plant-step`, `cell-animal-step` + GLB | 3D đầy đủ về cấu trúc |
| Trao đổi chất qua màng tế bào | `transport-step` procedural; phase2 osmosis | 3D partial |
| Thực hành co và phản co nguyên sinh | `plasmolysis-step`; phase2 osmosis | 3D partial |
| Chuyển hoá năng lượng/enzyme | `enzyme-step` procedural | 3D partial |
| Chu kì tế bào và nguyên phân | `mitosis-step`; phase2 mitosis | 3D partial |
| Giảm phân | Chưa có lesson riêng; phase2 chỉ nói rõ giới hạn nguyên phân | Missing |
| Thực hành tiêu bản nguyên phân và giảm phân | Chưa có microscope/slide mode đầy đủ | Missing/partial |
| Công nghệ tế bào | Chưa có scene | Missing |
| Vi sinh vật và virus | Chưa có lesson Sinh học tương ứng trong catalog | Missing |

### Sinh học 11

| Cụm nội dung chính thức | Hiện trạng hình/thí nghiệm | Phân loại |
|---|---|---|
| Miễn dịch ở người và động vật | White blood GLB, focus lysosome/nucleus | 3D partial |
| Cảm ứng ở động vật | Neuron GLB + `impulse-step` procedural | 3D partial/covered |
| Dinh dưỡng và tiêu hoá ở động vật | Epithelial procedural, microvilli/junctions | 3D partial |
| Trao đổi nước/khoáng ở thực vật | Chưa có lesson chuyên biệt | Missing |
| Quang hợp ở thực vật | Có chloroplast trong cell GLB nhưng không có thí nghiệm quang hợp | Missing/partial context-only |
| Hô hấp ở thực vật/động vật | Chưa có scene chuyên biệt | Missing |
| Tuần hoàn, bài tiết, cân bằng nội môi | Chưa có scene chuyên biệt | Missing |
| Cảm ứng ở thực vật | Chưa có scene chuyên biệt | Missing |
| Sinh trưởng và phát triển | Chưa có scene chuyên biệt | Missing |
| Sinh sản ở sinh vật | Chưa có scene chuyên biệt | Missing |

### Sinh học 12

Theo mục lục SGK Kết nối tri thức đã render, Sinh học 12 có 35 bài trong các
nhóm di truyền phân tử, di truyền nhiễm sắc thể, di truyền quần thể, tiến hoá
và sinh thái. Hiện catalog không có slug Sinh học 12 nào.

| Cụm SGK 12 | Hiện trạng | Phân loại |
|---|---|---|
| DNA, tái bản DNA, gene, biểu hiện gene | Chỉ có thể tái dùng kỹ thuật ball-stick/procedural ở mức ý tưởng; chưa có lesson | Missing |
| Đột biến gene/nhiễm sắc thể, di truyền học người | Chưa có scene/mô hình | Missing |
| Mendel, liên kết gene, di truyền quần thể | Chưa có mô phỏng dữ liệu/biểu đồ | Missing |
| Tiến hoá | Chưa có cây phát sinh, bằng chứng hoặc timeline | Missing |
| Quần thể, quần xã, hệ sinh thái | Chưa có scene hệ thống | Missing |
| Phục hồi, bảo tồn, phát triển bền vững | Chưa có scene/map/project | Missing |

Không nên dùng cell viewer làm đại diện chính cho các nhóm Sinh học 12 này; cell
chỉ phù hợp làm lớp nền cho DNA/chromosome ở một số bài sau khi có state model
riêng.

## Phân loại tổng hợp

| Phạm vi | 3D đầy đủ | 3D partial | Missing |
|---|---:|---:|---:|
| 5 bài procedural Sinh học hiện có | 0 | 5 | 0 |
| 7 bài cell hiện có | 4 về cấu trúc tế bào | 3 | 0 |
| 2 bài Phase 2 | 0 | 2 | 0 |
| Sinh học 10 theo các mục lục liên quan | 2 cụm cấu trúc + 5 scene partial | nhiều | giảm phân, virus, vi sinh vật, công nghệ tế bào và thực hành microscope |
| Sinh học 11 theo các mục lục liên quan | 0 ở mức quy trình đầy đủ | 4 cụm liên quan | phần lớn sinh lí còn lại |
| Sinh học 12 | 0 | 0 | toàn bộ lesson catalog/scene |

Lưu ý: “3D đầy đủ” ở bảng cell chỉ có nghĩa là đủ nền hình học/camera/focus
cho mục tiêu cấu trúc. Nó không có nghĩa là đã mô phỏng toàn bộ quá trình sinh
học hoặc thí nghiệm của chương.

## Khuyến nghị tiếp theo

1. Giữ `cell-viewer` làm renderer cho cấu trúc; bổ sung state machine riêng cho
   mitosis và osmosis thay vì chỉ thay text/organelle focus.
2. Với nguyên phân: thêm chromosome proxies, spindle, phase visibility và
   chuyển cảnh kì đầu -> kì giữa -> kì sau -> kì cuối; giữ plant GLB làm nền.
3. Với co nguyên sinh: thêm biến `externalSolute`, `waterVolume`, `turgor` và
   animation màng sinh chất rời thành tế bào; giữ fallback procedural khi GLB
   chưa tải.
4. Với `impulse-step`: ghép camera focus neuron và đường xung với neuron GLB;
   không thay thế thí nghiệm điện thế hiện có.
5. Tạo các lesson riêng cho giảm phân, virus, vi sinh vật, DNA và sinh thái;
   không gắn nhãn “covered” chỉ vì đã có một cell preview.
6. Khi mở rộng curriculum, duy trì mapping riêng như
   `content/phase2/naming-biology.json`, không sửa catalog chung cho đến khi
   đã có page-level review từ giáo viên.

## Không thay đổi trong audit này

- Không sửa code, catalog, manifest hoặc course.
- Không tải model ngoài.
- Không thay đổi GLB/procedural assets.
- Chỉ tạo báo cáo audit này.

