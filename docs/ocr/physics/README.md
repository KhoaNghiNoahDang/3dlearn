# OCR infrastructure - Vật lí

Pipeline:

```powershell
node scripts/ocr/scan-sgk.mjs --subject physics
```

Mặc định pipeline:

- chỉ đọc PDF trong `SGK/`;
- chọn ba sách Vật lí theo `content/manifest.json`;
- phát hiện `pdfinfo`, `pdftoppm`, `tesseract` và các Python module local;
- đọc số trang bằng `pdfinfo`;
- render PDF pages 1-12 của mỗi sách bằng `pdftoppm`;
- nếu có Tesseract, lưu raw OCR cạnh ảnh render;
- ghi `run.json`, `record.schema.json`, `records.jsonl` và `latest.json` trong run timestamp;
- không sửa `catalog.json`, `content/course-mapping.json`, PDF nguồn hoặc app runtime.

Chọn trang khác:

```powershell
node scripts/ocr/scan-sgk.mjs --subject physics --pages 1-20
node scripts/ocr/scan-sgk.mjs --subject physics --pages 1-8,12,17
```

## Schema evidence record

`records.jsonl` dùng schema bắt buộc:

```json
{
  "sourceBookId": "vat-li-10",
  "chapter": null,
  "lesson": null,
  "printedPage": null,
  "figureRef": null,
  "confidence": "unverified"
}
```

Pipeline hiện không tự tạo record từ OCR. Đây là chủ ý an toàn: tên chương/bài, số trang in và mã hình chỉ được điền sau khi người rà soát nhìn thấy bằng chứng trên trang scan. `pdfPage` trong `run.json` là chỉ số trang vật lý của PDF, không phải `printedPage`.

## Output contract

- `latest.json`: con trỏ tới run mới nhất.
- `runs/<timestamp>/run.json`: tool inventory, sách đã quét, trang render và trạng thái review.
- `runs/<timestamp>/record.schema.json`: JSON Schema cho record evidence.
- `runs/<timestamp>/records.jsonl`: file dữ liệu chốt; để trống nếu chưa có bằng chứng đã review.
- `runs/<timestamp>/<sourceBookId>/page-XXX.jpg`: ảnh trang đã render.
- `runs/<timestamp>/<sourceBookId>/page-XXX.txt`: raw OCR nếu Tesseract khả dụng.

Không coi raw OCR là source of truth cho đến khi có bước review riêng.
