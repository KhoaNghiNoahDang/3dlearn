# EasyOCR audit - SGK Vật lí 10-12

Ngày: 2026-10-31  
Phạm vi: PDF trong `SGK/`, catalog/mapping hiện có và `phase2-phys-free-fall`.  
Chính sách: không cài package/model, không tải weights, không sửa catalog khi chưa có confidence cao.

## Kết quả môi trường

| Thành phần | Kết quả |
|---|---|
| EasyOCR import | Thành công, `1.7.2` |
| PyTorch | `2.6.0+cu124` |
| torchvision | `0.21.0+cu124` |
| PyMuPDF | `1.28.2` |
| pdftoppm/pdfinfo | Poppler `26.07.0` |
| EasyOCR model weights | Không có trong `C:\Users\Admin\.EasyOCR\model` |
| EasyOCR Reader | Không khởi tạo được với `download_enabled=False` vì thiếu model weights; không tải xuống |
| Tesseract/pytesseract | Không có |

EasyOCR vì vậy được xác nhận là **import được nhưng chưa usable để OCR** trong môi trường hiện tại. Không dùng một OCR giả lập để nâng confidence. Các trang mục lục/tiêu đề đã được render bằng `pdftoppm` vào `docs/ocr/physics-easyocr/pages/vat-li-10`, `vat-li-11`, `vat-li-12`; việc đối chiếu tên bài là visual/manual ở nơi đã thấy rõ.

## Kiểm tra PDF

Các file nguồn theo `content/manifest.json:77-101,199-230`:

| sourceBookId | PDF | Trang render kiểm tra |
|---|---|---|
| `vat-li-10` | `SGK/SGK Vật lí 10-mau.pdf` | 1-20, trong đó tiêu đề Bài 1-3 và phần đầu chương Động học được kiểm tra |
| `vat-li-11` | `SGK/SGK Vật Lí 11-mau.pdf` | 1-20, trong đó phần đầu Dao động/Sóng được kiểm tra |
| `vat-li-12` | `SGK/SGK Vật lí 12-mau.pdf` | 1-20, trong đó phần đầu Nhiệt học/Khí lí tưởng được kiểm tra |

Các PDF cung cấp là scan ảnh, không có text layer đủ dùng cho việc trích xuất tự động. Do thiếu model EasyOCR, không có kết quả OCR machine-readable đáng tin cậy để ghi đè lên visual/manual evidence.

## Mapping naming

| Course | sourceBook | chapter | lesson | printedPage | figureRef | confidence | quyết định |
|---|---|---|---|---:|---|---|---|
| `photoelectric-step` | `vat-li-12` | - | - | - | - | needs-review | Không đổi tên |
| `capacitor-step` | `vat-li-11` | - | - | - | - | needs-review | Không đổi tên |
| `accel-force-step` | `vat-li-10` | - | - | - | - | needs-review | Không đổi tên; không gán nhầm cho Bài 11 rơi tự do |
| `energy-step` | `vat-li-10` | - | - | - | - | needs-review | Không đổi tên |
| `projectile-step` | `vat-li-10` | Động học | Bài 12. Chuyển động ném | - | - | needs-review | Không đổi tên; chỉ là khớp chủ đề gần |
| `centripetal-step` | `vat-li-10` | - | - | - | - | needs-review | Không đổi tên |
| `self-induction-step` | `vat-li-11` | - | - | - | - | needs-review | Không đổi tên |
| `emf-step` | `vat-li-11` | - | - | - | - | needs-review | Không đổi tên |
| `current-field-step` | `vat-li-11`? | - | - | - | - | needs-review | Không đổi tên; cần giải quyết lệch Vật lí 11/12 |
| `brownian-step` | - | - | - | - | - | needs-review | Không đổi tên; mapping xuyên khối |
| `phase2-phys-free-fall` | `vat-li-10` | Động học | Bài 11. Thực hành: Đo gia tốc rơi tự do | 47 | - | medium-manual-visual | Giữ displayTitle hiện có, chưa canonical hóa |

Chi tiết machine-readable nằm trong `content/phase2/naming-physics-easyocr.json`. Tất cả 10 record catalog đều giữ `displayTitle: null` trong overlay vì không có confidence cao. Không có sửa nào vào `catalog.json`.

## Đối chiếu P0 `phase2-phys-free-fall`

P0 đã tồn tại tại `courses/phase2-phys-free-fall.html` và được khai báo trong `content/phase2/chemistry-physics.json:50-85`. Đây là mô phỏng thật, không phải placeholder:

- `Scene` và `WebGLRenderer` ở `courses/phase2-phys-free-fall.html:48-49`;
- nhiều `Mesh`/`BoxGeometry`/`CylinderGeometry`/`SphereGeometry` và các bộ phận giá, thước, cảm biến, tia quang ở `:53-65`;
- manifest Phase 2 đã mô tả điều chỉnh độ cao, thả vật, ghi nhiều lần đo và tính `g = 2h/t²` ở `content/phase2/chemistry-physics.json:63-77`.

Vì P0 đã có implementation cụ thể, không tạo thêm mô phỏng thứ hai. Việc còn lại là xác nhận figure/page bằng OCR có model weights và smoke-test route.

## Catalog mutation

Không đổi tên hiển thị trong catalog. Lý do: yêu cầu chỉ cho phép đổi khi confidence cao, trong khi EasyOCR reader không thể chạy do model weights chưa có; các mapping khác vẫn là candidate/provisional. `projectile-step` và `phase2-phys-free-fall` có bằng chứng chủ đề/tên trực quan, nhưng chưa đủ để ghi thành tên canonical kèm trang/hình.

## Lệnh kiểm tra đã chạy

```powershell
python -c "import easyocr; print(easyocr.__version__)"
python -c "import easyocr; easyocr.Reader(['vi','en'], gpu=False, download_enabled=False)"
pdftoppm -f 1 -l 20 -jpeg -r 150 "SGK/SGK Vật lí 10-mau.pdf" docs/ocr/physics-easyocr/pages/vat-li-10/page
pdftoppm -f 1 -l 20 -jpeg -r 150 "SGK/SGK Vật Lí 11-mau.pdf" docs/ocr/physics-easyocr/pages/vat-li-11/page
pdftoppm -f 1 -l 20 -jpeg -r 150 "SGK/SGK Vật lí 12-mau.pdf" docs/ocr/physics-easyocr/pages/vat-li-12/page
```

Reader init trả về lỗi thiếu model/permission trong thư mục model; không có network/install action nào được thực hiện.
