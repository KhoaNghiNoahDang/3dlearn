# Chemistry coverage audit: Hóa học 11–12

Ngày kiểm tra: 2026-10-31  
Phạm vi: `catalog.json`, `content/course-mapping.json`, 25 course có `subject = chem`, hai PDF `SGK Hóa học 11-mau.pdf` và `SGK Hóa học 12-mau.pdf`.  
Nguyên tắc: báo cáo này chỉ đề xuất chuẩn hóa; không sửa `catalog.json`, `content/course-mapping.json` hoặc nội dung course.

## Kết luận nhanh

- Có 25 course Hóa học: 14 course đang trỏ về `hoa-hoc-11`, 11 course đang trỏ về `hoa-hoc-12`; `flame-step` còn trỏ thêm `hoa-hoc-10`.
- Cả hai PDF là sách **Kết nối tri thức với cuộc sống**. Hóa học 11 có 6 chương/25 bài; Hóa học 12 có 8 chương/30 bài.
- 25 file HTML course đều tồn tại và title trong catalog khớp title trong mapping. Tuy nhiên, phần `catalogTextbookRefs` hiện tại dùng nhiều số chương/tên bộ sách không khớp mục lục hai PDF đã kiểm tra.
- 15 course đang ở mức `candidate` hoặc `cross-grade`; 10 course còn lại được đánh dấu `strong-topic`, nhưng vẫn cần bổ sung trang bằng chứng.
- Không có course nào trong danh sách này có đủ `pdfPage`/`printedPage` để gọi là mapping SGK hoàn tất.

Nguồn code và dữ liệu:

- Catalog: [`catalog.json`](../../catalog.json)
- Mapping: [`content/course-mapping.json`](../../content/course-mapping.json)
- Manifest sách: [`content/manifest.json`](../../content/manifest.json), [`app/content/manifest.ts`](../../app/content/manifest.ts)
- Course HTML: [`courses/`](../../courses/)
- SGK 11: [`SGK Hóa học 11-mau.pdf`](../../SGK/SGK%20H%C3%B3a%20h%E1%BB%8Dc%2011-mau.pdf)
- SGK 12: [`SGK Hóa học 12-mau.pdf`](../../SGK/SGK%20H%C3%B3a%20h%E1%BB%8Dc%2012-mau.pdf)

## Mục lục chuẩn đã đối chiếu

Đây là tên chương/bài đọc từ mục lục trực quan trong PDF. Vì PDF là scan ảnh, số trang dưới đây là trang in trên sách; số trang PDF bắt đầu từ 0/1 tùy công cụ nên khi triển khai cần lưu cả `pdfPage` và `printedPage`.

### Hóa học 11

| Chương | Các bài trong mục lục | Trang in mục lục |
|---|---|---:|
| 1. Cân bằng hóa học | Bài 1 Khái niệm về cân bằng hóa học; Bài 2 Cân bằng trong dung dịch nước | 6–27 |
| 2. Nitrogen – sulfur | Bài 4 Nitrogen; Bài 5 Ammonia - Muối ammonium; Bài 6 Một số hợp chất của nitrogen với oxygen; Bài 7 Sulfur và sulfur dioxide; Bài 8 Sulfuric acid và muối sulfate | 29–55 |
| 3. Đại cương về hóa học hữu cơ | Bài 10 Hợp chất hữu cơ và hóa học hữu cơ; Bài 11 Phương pháp tách biệt và tinh chế hợp chất hữu cơ; Bài 12 Công thức phân tử hợp chất hữu cơ; Bài 13 Cấu tạo hóa học hợp chất hữu cơ | 57–80 |
| 4. Hydrocarbon | Bài 15 Alkane; Bài 16 Hydrocarbon không no; Bài 17 Arene (Hydrocarbon thơm) | 82–110 |
| 5. Dẫn xuất halogen - alcohol - phenol | Bài 19 Dẫn xuất halogen; Bài 20 Alcohol; Bài 21 Phenol | 112–134 |
| 6. Hợp chất carbonyl - carboxylic acid | Bài 23 Hợp chất carbonyl; Bài 24 Carboxylic acid | 136–153 |

### Hóa học 12

| Chương | Các bài trong mục lục | Trang in mục lục |
|---|---|---:|
| 1. Ester - lipid | Bài 1 Ester - Lipid; Bài 2 Xà phòng và chất giặt rửa | 6–18 |
| 2. Carbohydrate | Bài 4 Giới thiệu về carbohydrate. Glucose và fructose; Bài 5 Saccharose và maltose; Bài 6 Tinh bột và cellulose | 20–33 |
| 3. Hợp chất chứa nitrogen | Bài 8 Amine; Bài 9 Amino acid và peptide; Bài 10 Protein và enzyme | 35–49 |
| 4. Polymer | Bài 12 Đại cương về polymer; Bài 13 Vật liệu polymer | 51–65 |
| 5. Pin điện và điện phân | Bài 15 Thế điện cực và nguồn điện hóa học; Bài 16 Điện phân | 67–85 |
| 6. Đại cương về kim loại | Bài 18 Cấu tạo và liên kết trong tinh thể kim loại; Bài 19 Tính chất vật lí và tính chất hóa học của kim loại; Bài 20 Kim loại trong tự nhiên và phương pháp tách kim loại; Bài 21 Hợp kim; Bài 22 Sự ăn mòn kim loại | 87–106 |
| 7. Nguyên tố nhóm IA và nhóm IIA | Bài 24 Nguyên tố nhóm IA; Bài 25 Nguyên tố nhóm IIA | 108–126 |
| 8. Sơ lược về dãy kim loại chuyển tiếp thứ nhất và phức chất | Bài 27 Đại cương về kim loại chuyển tiếp dãy thứ nhất; Bài 28 Sơ lược về phức chất; Bài 29 Một số tính chất và ứng dụng của phức chất | 128–142 |

## Mapping đề xuất theo course

### Hóa học 11

| Slug | Tên hiện tại | Tên hiển thị đề xuất | Neo SGK đề xuất | Trạng thái |
|---|---|---|---|---|
| `haber-step` | Tổng hợp ammonia | **Quy trình Haber-Bosch: tổng hợp ammonia** | Hóa 11, Chương 2, Bài 5 | Giữ riêng với ammonia phòng thí nghiệm |
| `rate-step` | Các yếu tố ảnh hưởng đến tốc độ phản ứng hoá học | **Các yếu tố ảnh hưởng đến tốc độ phản ứng hóa học** | Không có bài tương ứng trong mục lục Hóa 11–12; cần SGK Hóa 10 hoặc nguồn khác | Thiếu nguồn |
| `ball-stick-step` | Lắp mô hình rỗng (quả cầu - que) tìm hiểu cấu trúc phân tử hợp chất hữu cơ | **Lắp mô hình phân tử hợp chất hữu cơ** | Hóa 11, Chương 3, Bài 10/Bài 13 | Cần xác định bài chính |
| `titration-step` | Chuẩn độ acid mạnh bằng base mạnh | **Chuẩn độ acid-base** | Hóa 11, Chương 1, Bài 2 | Hoạt động mở rộng, không phải tên bài trong mục lục |
| `chlorine-step` | Điều chế và tính chất của chlorine | **Điều chế và tính chất của chlorine** | Không có neo trong Hóa 11–12; nhiều khả năng thuộc mạch Halogen của Hóa 10 | Thiếu nguồn |
| `sulfuric-step` | Điều chế H₂SO₄ (PP tiếp xúc) | **Sản xuất sulfuric acid theo phương pháp tiếp xúc** | Hóa 11, Chương 2, Bài 8 | Chuẩn hóa lại chương/bài |
| `hydrolysis-step` | Sự thủy phân của muối và ứng dụng | **Sự thủy phân của muối** | Hóa 11, Chương 1, Bài 2 | Tách khỏi chuẩn độ và điện li |
| `ammonia-step` | Điều chế và tính chất của ammonia (gồm thí nghiệm “đài phun”) | **Ammonia và muối ammonium: điều chế, tính chất và thí nghiệm đài phun** | Hóa 11, Chương 2, Bài 5 | Giữ riêng với Haber-Bosch |
| `equilibrium-step` | Tìm hiểu các yếu tố ảnh hưởng đến chuyển dịch cân bằng hoá học | **Các yếu tố ảnh hưởng đến chuyển dịch cân bằng hóa học** | Hóa 11, Chương 1, Bài 1 | Tên hoạt động; neo vào cân bằng hóa học |
| `flame-step` | Thử màu ngọn lửa và quang phổ nguyên tử | **Thử màu ngọn lửa và quang phổ nguyên tử** | Chưa có neo trong hai PDF; candidate có `hoa-hoc-10` nhưng file không có | Thiếu SGK Hóa 10 |
| `conductivity-step` | Sự điện li của chất điện li, tính dẫn điện của dung dịch và bản chất của phản ứng ion | **Chất điện li và tính dẫn điện của dung dịch** | Hóa 11, Chương 1, Bài 2 | Không gộp với chuẩn độ |
| `nitric-lab-step` | Tính chất của nitric acid đặc, loãng và sự chuyển hóa các oxide của nitrogen | **Nitrogen oxide và nitric acid** | Hóa 11, Chương 2, Bài 6 | Chuẩn hóa theo mục lục |
| `bromine-step` | Tách bromine từ nước biển: phương pháp thổi khí | **Tách bromine từ nước biển** | Không có neo trong Hóa 11–12; cần xác định sách/tiết mở rộng | Thiếu nguồn |
| `sulfur-step` | Tính chất của sulfur, sulfur dioxide, sulfuric acid đặc và sự chuyển hóa giữa các chất chứa sulfur | **Sulfur, sulfur dioxide và sulfuric acid: tính chất và chuyển hóa** | Hóa 11, Chương 2, Bài 7-Bài 8 | Tách khỏi quy trình sản xuất sulfuric acid |

### Hóa học 12

| Slug | Tên hiện tại | Tên hiển thị đề xuất | Neo SGK đề xuất | Trạng thái |
|---|---|---|---|---|
| `blast-furnace-step` | Luyện gang lò cao | **Luyện gang trong lò cao** | Hóa 12, Chương 6, Bài 20 | Tách khỏi luyện kim điện phân/nhiệt nhôm |
| `smelting-step` | Luyện kim: điện phân muối nóng chảy + nhiệt nhôm | **Luyện kim: điện phân nóng chảy và nhiệt luyện** | Hóa 12, Chương 5, Bài 16 + Chương 6, Bài 20 | Chủ đề quy trình liên bài |
| `coal-gas-step` | Sử dụng tổng hợp than đá: lấy khí hóa than làm mạch chính | **Khí hóa than và sử dụng tổng hợp than đá** | Không có bài tương ứng trong mục lục Hóa 12 hiện có | Chủ đề mở rộng/thiếu nguồn |
| `cement-step` | Sản xuất xi măng | **Sản xuất xi măng** | Không có bài tương ứng trong mục lục Hóa 12 hiện có | Chủ đề mở rộng/thiếu nguồn |
| `iron-step` | Sắt và hợp chất: chuyển hóa giữa các số oxi hóa của sắt | **Sắt và hợp chất của sắt** | Neo gần nhất: Hóa 12, Chương 6, Bài 20 và Chương 8, Bài 27-Bài 29 | Cần xác minh bài chính |
| `electrolysis-step` | Nguyên lý điện phân: điện phân dung dịch copper(II) chloride và dung dịch muối ăn bão hòa | **Điện phân dung dịch và ứng dụng** | Hóa 12, Chương 5, Bài 16 | Tên hiển thị ngắn hơn, giữ chi tiết trong mô tả |
| `galvanic-step` | Pin điện hóa: từ một dung dịch đến hai dung dịch | **Pin điện hóa và nguồn điện hóa học** | Hóa 12, Chương 5, Bài 15 | Không gắn vào Chương 6 |
| `sodium-step` | Tính chất của kim loại sodium (gồm cách dập cháy sodium) | **Nguyên tố nhóm IA: sodium và hợp chất** | Hóa 12, Chương 7, Bài 24 | Sửa mapping cũ đang trỏ nhầm Chương 2 |
| `corrosion-step` | Ăn mòn hấp thụ oxygen và thiết kế miếng dán giữ nhiệt | **Ăn mòn kim loại và thiết kế miếng dán giữ nhiệt** | Hóa 12, Chương 6, Bài 22 | Phần miếng dán là dự án mở rộng |
| `chlor-alkali-step` | Công nghiệp chlor-kiềm | **Điện phân dung dịch NaCl và công nghiệp chlor-kiềm** | Hóa 12, Chương 5, Bài 16 | Tách khỏi chlorine phòng thí nghiệm |
| `hou-soda-step` | Phương pháp Hầu Đức Bảng | **Sản xuất sodium carbonate (soda) theo quy trình công nghiệp** | Neo gần nhất: Hóa 12, Chương 7, Bài 24 | Giữ “Hầu Đức Bảng” trong alias/ghi chú, cần xác minh SGK |

## Các cặp chủ đề phải tách trên giao diện và dữ liệu

### 1. Ammonia và Haber-Bosch

| Course | Bản chất | Tên chuẩn hóa |
|---|---|---|
| `ammonia-step` | Điều chế trong phòng thí nghiệm, tính chất ammonia, thí nghiệm đài phun | Ammonia và muối ammonium: điều chế và tính chất |
| `haber-step` | Quy trình công nghiệp, cân bằng, áp suất, nhiệt độ, tuần hoàn khí | Quy trình Haber-Bosch: tổng hợp ammonia |

Hai course cùng neo vào Hóa 11 Chương 2 Bài 5 nhưng không phải một bài trùng lặp: một bên là **thí nghiệm/tính chất**, một bên là **quy trình công nghiệp**.

### 2. Chlorine và chlor-alkali

| Course | Bản chất | Mapping đề xuất |
|---|---|---|
| `chlorine-step` | Điều chế và tính chất chlorine trong bộ thí nghiệm | Chưa đủ SGK Hóa 11–12; cần bổ sung Hóa 10 hoặc sách nguồn đúng |
| `chlor-alkali-step` | Điện phân dung dịch NaCl ở quy mô công nghiệp | Hóa 12 Chương 5 Bài 16 |

Không gộp hai course theo từ khóa “chlorine”: chlorine là sản phẩm/chất nghiên cứu; chlor-alkali là quy trình điện phân nước muối.

### 3. Luyện gang và luyện kim

| Course | Bản chất | Mapping đề xuất |
|---|---|---|
| `blast-furnace-step` | Khử quặng sắt bằng carbon/CO trong lò cao để tạo gang | Hóa 12 Chương 6 Bài 20 |
| `smelting-step` | Điện phân nóng chảy và nhiệt nhôm để tách kim loại | Hóa 12 Chương 5 Bài 16 + Chương 6 Bài 20 |

“Luyện gang” là một quy trình cụ thể; “luyện kim” là nhóm phương pháp rộng hơn. Không dùng chung title hoặc cùng một lesson node.

### 4. Acid-base, điện li và thủy phân muối

| Course | Câu hỏi trung tâm | Mapping đề xuất |
|---|---|---|
| `conductivity-step` | Chất điện li, ion và khả năng dẫn điện | Hóa 11 Chương 1 Bài 2 |
| `hydrolysis-step` | Ion của muối phản ứng với nước làm dung dịch có tính acid/base | Hóa 11 Chương 1 Bài 2 |
| `titration-step` | Xác định nồng độ bằng phản ứng trung hòa và điểm tương đương | Hóa 11 Chương 1 Bài 2 |

Ba course có thể cùng nằm trong mạch “cân bằng dung dịch nước”, nhưng phải giữ ba activity type khác nhau: `conductivity`, `salt-hydrolysis`, `acid-base-titration`.

## Phần thiếu và lỗi mapping cần xử lý sau

### Thiếu nguồn sách

1. `flame-step` tham chiếu `hoa-hoc-10`, nhưng `SGK/` chỉ có Hóa 11 và Hóa 12 trong phạm vi Hóa học. Cần bổ sung `SGK Hóa học 10-mau.pdf` hoặc chuyển mapping sang nguồn hợp lệ.
2. `rate-step`, `chlorine-step`, `bromine-step` không có điểm neo chắc chắn trong mục lục Hóa 11–12. Không nên gắn nhãn “theo SGK Hóa 11/12” trước khi có sách nguồn phù hợp.
3. `coal-gas-step` và `cement-step` không xuất hiện như bài/chương trong mục lục Hóa 12 đã kiểm tra; nên đánh dấu `enrichment`/`industry-extension` thay vì bài SGK.

### Lệch chương/bài trong mapping hiện tại

- Hóa 11 hiện bị ghi thành các chương như “Chương 5 Nitrogen và hợp chất”, trong khi PDF Hóa 11 ghi Nitrogen - sulfur là **Chương 2**.
- Hóa 11 `sulfuric-step` nên về **Chương 2, Bài 8**, không phải Chương 5.
- Hóa 11 `ball-stick-step` nên về **Chương 3**, không phải Chương 7.
- Hóa 11 `haber-step` và `ammonia-step` nên về **Chương 2, Bài 5**, không phải một chương Nitrogen đánh số khác.
- Hóa 12 `electrolysis-step`, `galvanic-step`, `chlor-alkali-step` nên về **Chương 5**, không phải Chương 4.
- Hóa 12 `corrosion-step` nên về **Chương 6, Bài 22**.
- Hóa 12 `sodium-step` và `hou-soda-step` nên neo gần nhất vào **Chương 7, Bài 24**, không phải Chương 2.
- Hóa 12 `blast-furnace-step` và phần tách kim loại trong `smelting-step` nên neo vào **Chương 6, Bài 20**, không phải Chương 8.

## Đề xuất schema mapping chuẩn hóa

Khi có bước cập nhật dữ liệu riêng, mỗi course Hóa nên có các trường:

```json
{
  "courseSlug": "ammonia-step",
  "displayTitle": "Ammonia và muối ammonium: điều chế và tính chất",
  "bookId": "hoa-hoc-11",
  "series": "Kết nối tri thức với cuộc sống",
  "grade": 11,
  "chapter": "Chương 2. Nitrogen - sulfur",
  "lesson": "Bài 5. Ammonia - Muối ammonium",
  "activityType": "laboratory",
  "pdfPage": null,
  "printedPage": null,
  "confidence": "topic-verified",
  "evidence": "SGK Hóa học 11-mau.pdf, mục lục và trang hoạt động"
}
```

Các trường trang và `confidence = exact` chỉ được điền sau khi đối chiếu từng trang hoạt động trong PDF. Báo cáo này không thay đổi catalog chung.
