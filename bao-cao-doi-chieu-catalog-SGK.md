# Báo cáo đối chiếu catalog/manifest với thư mục SGK

Ngày kiểm tra: 2026-10-31  
Phạm vi: `catalog.json`, các manifest/catalog liên quan, `courses/`, `SGK/*.pdf`; không sửa code hay dữ liệu nguồn.

## 1. Kết luận nhanh

- Catalog chính `catalog.json`: **61 bài**, gồm Hóa 25, Địa lí 14, Sinh học 12, Vật lí 10.
- `courses/`: **63 file HTML** (64 file nếu tính mọi loại file đệ quy theo lần quét đầu). Có 61 slug tương ứng catalog; `index.html` và `cell-viewer.html` là file ngoài catalog, nhiều khả năng là shell/tiện ích, không phải bài catalog.
- Có 9 PDF SGK: Địa lí 10; Hóa học 11–12; Sinh học 10–12; Vật lí 10–12. Tổng số trang theo metadata/manifest: **679 trang**.
- `content/course-mapping.json` đã có mapping cho 61 bài: **7 `verified-curriculum`**, **54 `needs-verification`**. Trạng thái này phù hợp với `content/manifest.json`, trong đó cả 9 PDF đều được phân loại **image-only-scan**, không có text layer và cần OCR/kiểm tra thủ công.
- Vì PDF là scan ảnh, báo cáo này **không khẳng định tên chương/bài hoặc số trang trong PDF** nếu không có bằng chứng OCR/mục lục đã xác minh. Các tên SGK trong `catalog.json` được xem là tham chiếu ứng viên, không phải nguồn sự thật cuối cùng.

## 2. Nguồn và cấu trúc đã đọc

### Catalog/manifest

| Tệp | Vai trò/quan sát |
|---|---|
| `catalog.json` | Nguồn catalog chính; 61 bản ghi, có `slug`, `subject`, `title`, `type`, `question`, `textbook[]`, `steps`, `file`, `cover`, `online`. |
| `content/manifest.json` | Manifest phạm vi SGK; khai báo 9 sách, số trang, trạng thái scan, kế hoạch OCR và `mappingFile`. |
| `content/course-mapping.json` | Mapping 61 bài; có chủ đề, sách ứng viên, kiểu khớp, trạng thái, độ tin cậy, dẫn chứng catalog và ghi chú xác minh. |
| `app/legacy/manifest.json` | Manifest runtime legacy; 61 lesson, sinh từ `catalog.json`, route `/legacy/{slug}`, trạng thái curriculum mặc định `needs-book-page-mapping`. |
| `app/content/manifest.ts` | Manifest TypeScript cho ứng dụng; đã đọc cấu trúc file, không sửa. |
| `_viethoa/manifest.json`, `_viethoa/src/catalog.json`, `_viethoa/out/catalog-p001.json` | Bản việt hóa/đầu ra cũ; có dữ liệu tên bài và tham chiếu, nhưng không phải nguồn catalog hiện hành. |
| `dist/...` | Bản build chứa bản sao catalog/manifest; không dùng làm nguồn đối chiếu độc lập. |

### SGK

| File | Môn/lớp | Trang | Metadata đáng chú ý |
|---|---:|---:|---|
| `SGK Địa lí 10-mau.pdf` | Địa lí 10 | 60 | PDF scan ảnh; cần OCR |
| `SGK Hóa học 11-mau.pdf` | Hóa học 11 | 81 | PDF scan ảnh; cần OCR |
| `SGK Hóa học 12-mau.pdf` | Hóa học 12 | 75 | PDF scan ảnh; cần OCR |
| `SGK Sinh học 10-mau.pdf` | Sinh học 10 | 82 | PDF scan ảnh; cần OCR |
| `SGK Sinh học 11-mau.pdf` | Sinh học 11 | 97 | PDF scan ảnh; cần OCR |
| `SGK Sinh học 12-mau.pdf` | Sinh học 12 | 86 | PDF scan ảnh; cần OCR |
| `SGK Vật lí 10-mau.pdf` | Vật lí 10 | 72 | PDF scan ảnh; cần OCR |
| `SGK Vật Lí 11-mau.pdf` | Vật lí 11 | 61 | Tên file viết hoa `Lí`; manifest chuẩn hóa thành `Vật lí` |
| `SGK Vật lí 12-mau.pdf` | Vật lí 12 | 65 | PDF scan ảnh; cần OCR |

Metadata PDF cho thấy thời điểm tạo/sửa ngày 2026-10-31. Không thấy title/author/subject hữu ích để xác định mục lục. `content/manifest.json` ghi nhận mỗi trang là image object và `textPages: 0`.

## 3. Đối chiếu tên và trạng thái mapping

### Khớp chắc theo dữ liệu mapping hiện có (7 bài)

Đây là 7 bản ghi đã được gắn `verified-curriculum` trong `content/course-mapping.json`; vẫn nên giữ lại bước kiểm tra trực tiếp ảnh/mục lục nếu cần số trang.

| Slug | Tên bài hiện có | Mapping SGK đề xuất |
|---|---|---|
| `cell-plant-step` | Cấu trúc tế bào thực vật | Sinh 10, Chương 2 Cấu trúc tế bào, Bài 8 Tế bào nhân thực |
| `cell-animal-step` | Cấu trúc tế bào động vật | Sinh 10, Chương 2 Cấu trúc tế bào, Bài 8 Tế bào nhân thực |
| `cell-bacteria-step` | Cấu trúc tế bào vi khuẩn (Tế bào nhân sơ) | Sinh 10, Chương 2 Cấu trúc tế bào, Bài 7 Tế bào nhân sơ |
| `cell-neuron-step` | Cấu trúc tế bào thần kinh (Neuron) | Sinh 11, Chương 2 Cảm ứng ở sinh vật, Bài 17 Cảm ứng ở động vật |
| `cell-whiteblood-step` | Tế bào bạch cầu và cơ chế thực bào miễn dịch | Sinh 11, Chương 1 Trao đổi chất và năng lượng, Bài 12 Miễn dịch ở động vật |
| `cell-muscle-step` | Cấu trúc sợi cơ và cơ chế trượt tơ co cơ | Sinh 11, Chương 2 Cảm ứng ở sinh vật, Bài 17 Cảm ứng ở động vật (phần vận động) |
| `cell-epithelial-step` | Tế bào biểu mô: Cấu trúc phân cực và chức năng hàng rào | Sinh 10 Bài 8; đồng thời liên hệ Sinh 11 Bài 8 Dinh dưỡng và tiêu hóa ở động vật |

### Khớp chủ đề/ứng viên, chưa xác nhận bằng PDF (54 bài)

54 bài còn lại có tên/chủ đề phù hợp với một hoặc nhiều sách ứng viên trong mapping, nhưng chưa đủ chắc để gọi là tên SGK chính thức. Các nhóm mapping đề xuất theo catalog hiện tại:

- Hóa 11: ammonia/Haber; tốc độ phản ứng; mô hình phân tử hữu cơ; chuẩn độ acid–base; chlorine; sulfur/sulfuric acid; điện li–pH–thủy phân; điện phân; pin điện hóa; cân bằng hóa học; nitrogen/acid nitric; sodium; quang phổ nguyên tử; năng lượng hóa học; phản ứng ion.
- Hóa 12: luyện gang; luyện kim điện phân muối nóng chảy/nhiệt nhôm; xi măng; than khí hóa; ăn mòn và miếng dán giữ nhiệt.
- Địa lí 10: địa hình sông; chuyển động Trái Đất, mùa và vành đai nhiệt; dòng biển; El Niño/La Niña; khí quyển nhận nhiệt; karst; biến đổi khí hậu; kiến tạo; đất; hoàn lưu nhiệt; gió; vòng tuần hoàn nước; đai khí áp/đới gió.
- Vật lí 10–12: hiệu ứng quang điện; tụ điện; chuyển động Trái Đất/hệ quả địa lí không thuộc Vật lí nên cần kiểm tra môn; gia tốc–lực–khối lượng; bảo toàn cơ năng; ném ngang; lực hướng tâm; cảm ứng/tự cảm/Foucault; suất điện động và điện trở trong; từ trường; chuyển động Brown/khuếch tán.
- Sinh 10–12: vận chuyển qua màng; hút/mất nước tế bào thực vật; nguyên phân; enzyme; xung thần kinh; các bài cấu trúc tế bào đã nêu ở nhóm verified.

Danh sách 54 slug, tên, `candidateBookIds`, `matchType`, `confidence`, `textbook` và `chapterRefs` đầy đủ đã có trong `content/course-mapping.json`; không lặp lại nguyên bảng dài tại đây để tránh tạo bản sao dễ lệch khỏi nguồn máy đọc được.

## 4. Các tên lệch hoặc cần chuẩn hóa

1. **Tên môn:** catalog dùng `phys`, còn tên SGK dùng “Vật lí”; file `SGK Vật Lí 11-mau.pdf` viết hoa “Lí”. Nên chuẩn hóa hiển thị về “Vật lí”, giữ nguyên tên file vật lý.
2. **Thuật ngữ Hóa học:** catalog trộn tiếng Việt và tiếng Anh (`ammonia`, `chlorine`, `sulfur`, `acid`, `base`, `sodium`, `nitrogen`). Đây có thể là chủ ý theo bộ sách, nhưng cần đối chiếu đúng chính tả/kiểu gọi của từng SGK trước khi đổi tên.
3. **“Tổng hợp ammonia” vs “Điều chế và tính chất của ammonia” vs “Công nghiệp tổng hợp ammonia”:** có nhiều bài cùng trường chủ đề; không nên gộp chỉ theo từ khóa ammonia. Đề xuất giữ 3 mapping riêng: kiến thức ammonia, thí nghiệm điều chế, và quy trình Haber công nghiệp.
4. **“Điều chế và tính chất của chlorine” vs “Công nghiệp chlor-kiềm”:** liên quan nhưng không đồng nhất; một bài về điều chế/tính chất chlorine, một bài về quy trình điện phân sản xuất NaOH/Cl₂/H₂.
5. **“Luyện gang lò cao” vs “Luyện kim: điện phân muối nóng chảy + nhiệt nhôm”:** cùng nhóm kim loại nhưng là hai quy trình khác nhau; giữ hai mapping riêng vào Hóa 12.
6. **Tên bài mô phỏng dài hơn tên bài SGK:** các tên như “Sự phát triển của địa hình sông”, “Hiệu ứng quang điện”, “Chuẩn độ acid mạnh bằng base mạnh” có thể là tên bài tương đối sát; các tên có phần diễn giải/quy trình nên tách `displayTitle` và `textbookTitle` sau OCR.
7. **Một số bài là bài giảng tổng hợp, không phải một tiêu đề SGK duy nhất:** ví dụ “Thử màu ngọn lửa và quang phổ nguyên tử”, “Tính chất của sulfur... và sự chuyển hóa...”, “Nguyên lý điện phân...”. Đề xuất mapping kiểu `composite`, liên kết nhiều bài/hoạt động thay vì ép vào một tên.

## 5. Thiếu và ngoài phạm vi

- **Thiếu khả năng xác nhận chính thức:** chưa có OCR/mục lục/chương/số trang đáng tin cậy cho 54 bài; `textbook[]` trong catalog chỉ là tham chiếu ứng viên.
- **Thiếu SGK theo môn:** thư mục hiện chỉ có Địa lí 10, Hóa 11–12, Sinh 10–12, Vật lí 10–12. Không có PDF Địa lí 11–12 hoặc các khối còn lại để xác nhận các mapping cross-grade.
- **Ngoài catalog:** `courses/index.html` và `courses/cell-viewer.html` không có slug trong `catalog.json`; nên coi là hạ tầng/tiện ích, không phải bài thiếu mapping, trừ khi UI định tuyến chúng như bài học.
- **Không phát hiện slug catalog nào thiếu file HTML:** 61 slug trong catalog đều có file `courses/{slug}.html` tương ứng theo basename.
- **Không nên coi `dist/` là nguồn độc lập:** các manifest trong `dist` là bản build/copy, không bổ sung bài hoặc SGK mới.

## 6. Mapping đề xuất và quy trình xác minh

1. Giữ nguyên `catalog.json` và code hiện tại; không đổi tên bài hàng loạt khi chưa OCR.
2. Dùng `content/course-mapping.json` làm lớp mapping trung gian; giữ `mappingStatus: needs-verification` cho 54 bài.
3. OCR riêng từng PDF, lưu kết quả ngoài code runtime; trích mục lục, tên chương/bài, hoạt động thí nghiệm và số trang in trên sách.
4. So khớp theo thứ tự: tên chính xác → từ khóa chủ đề + môn/lớp → nội dung thí nghiệm/quy trình → kiểm tra ảnh trang sách.
5. Chỉ chuyển sang `verified-curriculum` khi có `bookId`, chương, bài và trang đã kiểm tra thủ công; với bài ghép nhiều chủ đề dùng `matchType: composite` và nhiều `chapterRefs`.
6. Sau khi xác minh, nên bổ sung trường `textbookTitle` (tên nguyên văn SGK), `displayTitle` (tên bài trên app), `bookId`, `chapter`, `lesson`, `printedPages`, `evidence`.

## 7. Tệp bằng chứng chính

- `C:\Users\Admin\3dlearn\catalog.json`
- `C:\Users\Admin\3dlearn\content\manifest.json`
- `C:\Users\Admin\3dlearn\content\course-mapping.json`
- `C:\Users\Admin\3dlearn\app\legacy\manifest.json`
- `C:\Users\Admin\3dlearn\SGK\*.pdf`

