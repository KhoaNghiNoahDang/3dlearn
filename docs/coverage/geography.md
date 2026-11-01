# Coverage Địa lí 10

## 1. SGK nên dùng làm chuẩn

### Đề xuất tên canonical

**Địa lí 10 – Kết nối tri thức với cuộc sống**

- Nhà xuất bản: Nhà xuất bản Giáo dục Việt Nam.
- ISBN nhìn thấy trên bìa scan: `978-604-0-31083-5`.
- Tổng chủ biên: Lê Huỳnh; đồng chủ biên: Lê Huỳnh, Nguyễn Việt Khôi.
- Tác giả ghi trên bìa: Nguyễn Đình Cử, Vũ Thị Hằng, Trần Thị Hồng Mai, Nguyễn Phương Thảo.
- File local: [`SGK/SGK Địa lí 10-mau.pdf`](../../SGK/SGK%20Địa%20lí%2010-mau.pdf).
- ID đề xuất cho các mapping sau này: `dia-li-10-ket-noi-tri-thuc`.

Đây là bộ sách có bìa ghi rõ “Bộ sách giáo khoa lớp 10 – Kết nối tri thức với cuộc sống”. Không nên tiếp tục gọi chung là `dia-li-10` nếu sau này bổ sung nhiều bộ SGK, vì tên chung sẽ làm lẫn các bài/chương của những bộ khác.

### Phạm vi mục lục đã xác nhận

Mục lục scan cho thấy sách có 3 phần, 13 chương và 40 bài:

- Phần một: Một số vấn đề chung, gồm Bài 1 và Chương 1 Sử dụng bản đồ.
- Phần hai: Địa lí tự nhiên, từ Chương 2 Trái Đất đến Chương 7 Một số quy luật của vỏ địa lí.
- Phần ba: Địa lí kinh tế – xã hội, từ Chương 8 Địa lí dân cư đến Chương 13 Phát triển bền vững và tăng trưởng xanh.

Mục lục ghi các bài từ trang in 5 đến trang in 111; phần thuật ngữ và phiên âm ở trang 113–114. PDF local là scan mẫu 60 trang, nên không đủ lớp text để tự động xác minh toàn bộ hình và chú thích.

## 2. Snapshot course Địa lí hiện có

Catalog hiện có **14/61 course** mang subject `geo`:

| Course | Mức đối chiếu với SGK này | Nhận xét |
|---|---|---|
| `earth-motion-step` | Đủ lõi – Bài 5 | Mô phỏng chuyển động Trái Đất và hệ quả địa lí. |
| `insolation-step` | Đủ lõi – Bài 5 | Đi sâu vào góc nhập xạ, mùa và vành đai nhiệt. |
| `tectonic-step` | Đủ lõi – Bài 6 | Mô phỏng vận động kiến tạo/địa hình kiến tạo. |
| `heating-step` | Đủ lõi – Bài 9 | Mô phỏng nhận nhiệt và cân bằng nhiệt khí quyển. |
| `wind-step` | Đủ lõi – Bài 9 | Mô phỏng khí áp, Coriolis và gió. |
| `thermal-step` | Đủ lõi – Bài 9 | Mô phỏng hoàn lưu nhiệt, gió biển/gió đất. |
| `circulation-step` | Đủ lõi – Bài 9 | Mô phỏng các đai khí áp, đới gió và hoàn lưu. |
| `currents-step` | Một phần – Bài 12 | Bao phủ dòng biển, chưa bao phủ toàn bộ nước biển và đại dương. |
| `enso-step` | Một phần – Bài 12 | Bổ sung tương tác biển–khí quyển; không thay thế toàn bài Bài 12. |
| `water-cycle-step` | Một phần – Bài 11 | Bao phủ vòng tuần hoàn nước, còn thiếu hệ thống nước trên lục địa. |
| `river-step` | Một phần – Bài 7/Bài 11/Bài 13 | Tập trung địa hình sông; chưa phải mô phỏng riêng chế độ nước sông Hồng. |
| `karst-step` | Một phần – Bài 7 | Là ví dụ ngoại lực/địa hình karst, chưa đủ toàn bài Nội lực và ngoại lực. |
| `soil-step` | Đủ lõi – Bài 14 | Bao phủ nhân tố hình thành đất và quan sát phẫu diện đất. |
| `carbon-step` | Một phần – Bài 39/Bài 40 | Liên quan biến đổi khí hậu/an ninh, chưa phủ đầy đủ môi trường, tài nguyên, phát triển bền vững và tăng trưởng xanh. |

### Nhận xét về coverage hiện tại

Theo rubric trong [`README.md`](README.md), trong 40 bài của SGK này có khoảng:

- **4 bài Đủ lõi:** Bài 5, 6, 9, 14; Bài 5 có hai course bổ trợ nên số course không bằng số bài.
- **7 bài Một phần:** Bài 7, 11, 12, 13, 31, 39, 40.
- **29 bài Thiếu:** chưa có course có thể đối chiếu đáng tin cậy.

Tổng cộng 11/40 bài đã được chạm tới ở mức nào đó; nếu quy đổi `Đủ lõi = 1` và `Một phần = 0.5` thì điểm coverage định hướng là `7.5/40 = 18.75%`. Đây là chỉ số lập kế hoạch, không phải điểm đánh giá chất lượng bài học. Các mapping hiện tại vẫn có trạng thái `needs-verification/provisional`, chưa có số trang/hình chính thức.

## 3. Ma trận 40 bài theo mục lục SGK

Số trang là số trang in trong mục lục scan. `—` nghĩa là chưa có course phù hợp.

| Bài | Tên bài trong SGK Kết nối tri thức | Trang | Coverage | Course liên quan hiện có |
|---:|---|---:|---|---|
| 1 | Môn Địa lí với định hướng nghề nghiệp | 5 | Thiếu | — |
| 2 | Một số phương pháp biểu hiện các đối tượng địa lí trên bản đồ | 7 | Thiếu | — |
| 3 | Sử dụng bản đồ trong học tập và đời sống, một số ứng dụng của GPS và bản đồ số trong đời sống | 12 | Thiếu | — |
| 4 | Sự hình thành Trái Đất, vỏ Trái Đất và vật liệu cấu tạo vỏ Trái Đất | 15 | Thiếu | — |
| 5 | Hệ quả địa lí các chuyển động của Trái Đất | 17 | Đủ lõi | `earth-motion-step`, `insolation-step` |
| 6 | Thạch quyển, thuyết kiến tạo mảng | 21 | Đủ lõi | `tectonic-step` |
| 7 | Nội lực và ngoại lực | 24 | Một phần | `river-step`, `karst-step` |
| 8 | Thực hành: Sự phân bố các vành đai động đất, núi lửa | 27 | Thiếu | — |
| 9 | Khí quyển, các yếu tố khí hậu | 28 | Đủ lõi | `heating-step`, `wind-step`, `thermal-step`, `circulation-step` |
| 10 | Thực hành: Đọc bản đồ các đới và các kiểu khí hậu trên Trái Đất, phân tích biểu đồ một số kiểu khí hậu | 35 | Thiếu | — |
| 11 | Thuỷ quyển, nước trên lục địa | 37 | Một phần | `water-cycle-step`, `river-step` |
| 12 | Nước biển và đại dương | 41 | Một phần | `currents-step`, `enso-step` |
| 13 | Thực hành: Phân tích chế độ nước của sông Hồng | 44 | Một phần | `river-step` |
| 14 | Đất trên Trái Đất | 45 | Đủ lõi | `soil-step` |
| 15 | Sinh quyển | 47 | Thiếu | — |
| 16 | Thực hành: Tìm hiểu sự phân bố đất và sinh vật trên Trái Đất | 49 | Thiếu | — |
| 17 | Vỏ địa lí, quy luật thống nhất và hoàn chỉnh của vỏ địa lí | 51 | Thiếu | — |
| 18 | Quy luật địa đới và quy luật phi địa đới | 53 | Thiếu | — |
| 19 | Quy mô dân số, gia tăng dân số và cơ cấu dân số thế giới | 55 | Thiếu | — |
| 20 | Phân bố dân cư và đô thị hoá trên thế giới | 60 | Thiếu | — |
| 21 | Các nguồn lực phát triển kinh tế | 63 | Thiếu | — |
| 22 | Cơ cấu kinh tế, tổng sản phẩm trong nước và tổng thu nhập quốc gia | 65 | Thiếu | — |
| 23 | Vai trò, đặc điểm, các nhân tố ảnh hưởng tới sự phát triển và phân bố nông nghiệp, lâm nghiệp, thuỷ sản | 67 | Thiếu | — |
| 24 | Địa lí ngành nông nghiệp | 69 | Thiếu | — |
| 25 | Địa lí ngành lâm nghiệp và ngành thuỷ sản | 73 | Thiếu | — |
| 26 | Tổ chức lãnh thổ nông nghiệp, một số vấn đề phát triển nông nghiệp hiện đại trên thế giới và định hướng phát triển nông nghiệp trong tương lai | 76 | Thiếu | — |
| 27 | Thực hành: Vẽ và nhận xét biểu đồ về sản lượng lương thực của thế giới | 78 | Thiếu | — |
| 28 | Vai trò, đặc điểm, cơ cấu ngành công nghiệp, các nhân tố ảnh hưởng tới sự phát triển và phân bố công nghiệp | 79 | Thiếu | — |
| 29 | Địa lí một số ngành công nghiệp | 81 | Thiếu | — |
| 30 | Tổ chức lãnh thổ công nghiệp | 86 | Thiếu | — |
| 31 | Tác động của công nghiệp đối với môi trường, phát triển năng lượng tái tạo, định hướng phát triển công nghiệp trong tương lai | 88 | Một phần | `carbon-step` |
| 32 | Thực hành: Viết báo cáo tìm hiểu một vấn đề về công nghiệp | 90 | Thiếu | — |
| 33 | Cơ cấu, vai trò, đặc điểm, các nhân tố ảnh hưởng tới sự phát triển và phân bố dịch vụ | 91 | Thiếu | — |
| 34 | Địa lí ngành giao thông vận tải | 93 | Thiếu | — |
| 35 | Địa lí ngành bưu chính viễn thông | 98 | Thiếu | — |
| 36 | Địa lí ngành du lịch | 101 | Thiếu | — |
| 37 | Địa lí ngành thương mại và ngành tài chính ngân hàng | 103 | Thiếu | — |
| 38 | Thực hành: Viết báo cáo tìm hiểu về một ngành dịch vụ | 107 | Thiếu | — |
| 39 | Môi trường và tài nguyên thiên nhiên | 108 | Một phần | `carbon-step` |
| 40 | Phát triển bền vững và tăng trưởng xanh | 111 | Một phần | `carbon-step` |

## 4. Backlog bài còn thiếu và hình minh hoạ đề xuất

Các tên slug dưới đây chỉ là đề xuất cho giai đoạn thiết kế, **không được thêm vào catalog trong báo cáo này**. Asset nên ưu tiên mô hình/biểu đồ có thao tác, không chỉ đưa ảnh tĩnh vào panel.

### P0 – Kĩ năng nền và các bài thực hành

| Bài thiếu | Slug đề xuất | Hình/asset cần bổ sung |
|---|---|---|
| Bài 1 – Môn Địa lí với định hướng nghề nghiệp | `geo-career-map-step` | Sơ đồ liên kết Địa lí tự nhiên, kinh tế–xã hội với nghề bản đồ, GIS, địa chất, quy hoạch, du lịch, môi trường; thẻ nghề có tình huống. |
| Bài 2 – Phương pháp biểu hiện trên bản đồ | `map-symbols-step` | Bản đồ tương tác chuyển giữa phương pháp chấm điểm, kí hiệu, nền chất lượng, đường chuyển động, khoanh vùng, bản đồ–biểu đồ; legend không bị mất chữ. |
| Bài 3 – Bản đồ, GPS và bản đồ số | `gps-digital-map-step` | Quả địa cầu 3D có vệ tinh GPS, tam giác định vị, lớp bản đồ, đo khoảng cách/diện tích và dựng tuyến đường. |
| Bài 8 – Vành đai động đất, núi lửa | `earthquake-volcano-belts-step` | Quả địa cầu với ranh giới mảng, điểm chấn tâm, núi lửa, lát cắt hút chìm và bộ lọc theo độ sâu. |
| Bài 10 – Bản đồ đới/kiểu khí hậu và biểu đồ khí hậu | `climate-map-chart-step` | Bản đồ đới khí hậu liên kết với biểu đồ nhiệt–mưa; chọn trạm để đọc dữ liệu, đổi thang và nhận xét. |
| Bài 13 – Chế độ nước sông Hồng | `red-river-regime-step` | Mô hình lưu vực sông Hồng, mùa lũ/mùa cạn, đường quá trình lưu lượng, thanh mưa theo tháng và thao tác so sánh. |
| Bài 16 – Phân bố đất và sinh vật | `soil-biome-distribution-step` | Bản đồ lớp đất–thảm thực vật thế giới, chuyển vĩ độ/cao độ, bật/tắt lớp và đối chiếu chú giải. |
| Bài 27 – Biểu đồ sản lượng lương thực | `world-food-chart-step` | Trình dựng biểu đồ cột/đường, nhập hoặc kéo dữ liệu mẫu, chọn đúng loại biểu đồ và nhận xét xu hướng. |
| Bài 32 – Báo cáo về công nghiệp | `industry-report-step` | Workspace thu thập nguồn, chọn chỉ tiêu, chèn bản đồ/biểu đồ và xuất dàn ý báo cáo có kiểm tra thiếu dữ liệu. |
| Bài 38 – Báo cáo về dịch vụ | `service-report-step` | Workspace tương tự Bài 32 nhưng có bản đồ tuyến, ảnh điểm đến và chỉ tiêu lưu lượng/khách hàng. |

### P1 – Bổ sung các mảng nội dung lớn

| Bài thiếu | Slug đề xuất | Hình/asset cần bổ sung |
|---|---|---|
| Bài 4 – Hình thành Trái Đất, vỏ và vật liệu | `earth-crust-materials-step` | Quả địa cầu cắt lớp, dòng thời gian hình thành Trái Đất, phân biệt vỏ lục địa/vỏ đại dương và mẫu khoáng vật. |
| Bài 7 – Nội lực và ngoại lực | `internal-external-forces-step` | Sa bàn địa hình có nâng/hạ, phong hoá, xâm thực, vận chuyển, bồi tụ; thanh thời gian để so sánh tốc độ tác động. |
| Bài 11 – Thuỷ quyển và nước trên lục địa | `continental-water-step` | Lưu vực, sông, hồ, băng tuyết, nước ngầm và dòng chảy mặt trong một mặt cắt địa hình. |
| Bài 12 – Nước biển và đại dương | `ocean-water-step` | Địa hình đáy biển, nhiệt độ–độ muối theo độ sâu, sóng/thuỷ triều/dòng biển và lớp dữ liệu đại dương. |
| Bài 15 – Sinh quyển | `biosphere-step` | Mặt cắt sinh quyển, mạng lưới hệ sinh thái và dòng năng lượng/vật chất; zoom từ quần xã đến sinh vật. |
| Bài 17 – Vỏ địa lí và quy luật thống nhất | `geographic-envelope-step` | Mô hình 4 quyển tương tác; thay đổi một thành phần để thấy chuỗi phản hồi đất–nước–khí–sinh vật. |
| Bài 18 – Quy luật địa đới và phi địa đới | `geographic-zonation-step` | Quả địa cầu theo vĩ độ và mặt cắt sườn núi theo độ cao; bật/tắt đai địa đới, phi địa đới. |
| Bài 19 – Dân số và cơ cấu dân số | `world-population-step` | Đường tăng dân số, tháp tuổi, cơ cấu giới tính và mô hình chuyển tiếp dân số có thanh thời gian. |
| Bài 20 – Phân bố dân cư và đô thị hoá | `population-urbanization-step` | Bản đồ mật độ dân cư, luồng di cư, lõi đô thị/vùng ven đô và mô hình đô thị hoá theo thời gian. |
| Bài 21 – Nguồn lực phát triển kinh tế | `economic-resources-step` | Bản đồ lớp tài nguyên tự nhiên, lao động, vốn, khoa học–công nghệ và hạ tầng; kéo thả để tạo tổ hợp phát triển. |
| Bài 22 – GDP, GNI và cơ cấu kinh tế | `gdp-gni-structure-step` | Dashboard 3D/2D so sánh GDP–GNI, cơ cấu nông nghiệp–công nghiệp–dịch vụ và biểu đồ chuyển dịch. |
| Bài 23 – Nhân tố nông, lâm, thuỷ sản | `agriculture-factors-step` | Mặt bàn nhiều lớp khí hậu–đất–địa hình–nước–thị trường; thay đổi một nhân tố để xem vùng sản xuất. |
| Bài 24 – Địa lí nông nghiệp | `agriculture-geography-step` | Mô hình cây trồng/vật nuôi, mùa vụ, năng suất và vùng sản xuất theo khí hậu. |
| Bài 25 – Lâm nghiệp và thuỷ sản | `forestry-fisheries-step` | Mô hình rừng theo tầng, chuỗi khai thác–bảo tồn và ngư trường, dòng hải lưu, sản lượng. |
| Bài 26 – Tổ chức lãnh thổ và nông nghiệp tương lai | `modern-agriculture-territory-step` | Vùng chuyên canh, nông trại thẳng đứng, tưới chính xác, cảm biến và kịch bản biến đổi khí hậu. |
| Bài 28 – Cơ cấu và phân bố công nghiệp | `industry-structure-factors-step` | Mạng lưới nguyên liệu–năng lượng–lao động–thị trường–giao thông và bộ lọc ngành. |
| Bài 29 – Một số ngành công nghiệp | `industry-sectors-step` | Các module năng lượng, luyện kim, hoá chất, chế biến, điện tử; mỗi module có chuỗi đầu vào–sản phẩm–tác động. |
| Bài 30 – Tổ chức lãnh thổ công nghiệp | `industrial-territory-step` | Sa bàn khu/cụm/trung tâm công nghiệp, tuyến logistics, vùng nguyên liệu và bài toán chọn vị trí. |
| Bài 31 – Công nghiệp, môi trường và năng lượng tái tạo | `green-industry-step` | Nhà máy có dòng phát thải, bộ lọc, điện mặt trời/gió, lưu trữ và thanh cân bằng chi phí–phát thải. |
| Bài 33 – Địa lí ngành dịch vụ | `service-sector-step` | Mạng nút dịch vụ, luồng người/hàng/thông tin và các nhân tố phân bố. |
| Bài 34 – Giao thông vận tải | `transport-geography-step` | Mạng đường bộ/sắt/biển/hàng không, nút trung chuyển, chi phí–thời gian–phát thải. |
| Bài 35 – Bưu chính viễn thông | `telecom-geography-step` | Mạng cáp quang, trạm phát, vệ tinh, độ trễ và vùng phủ; bản đồ lớp có chú giải rõ. |
| Bài 36 – Du lịch | `tourism-geography-step` | Bản đồ tuyến điểm, mùa vụ, sức chứa, dòng khách và mô hình điểm đến 3D. |
| Bài 37 – Thương mại và tài chính ngân hàng | `trade-finance-flows-step` | Quả địa cầu với luồng hàng/vốn, cảng–thị trường, cán cân thương mại và mạng ngân hàng. |
| Bài 39 – Môi trường và tài nguyên thiên nhiên | `environment-resources-step` | Chu trình tài nguyên, ô nhiễm đất–nước–không khí, khai thác–phục hồi và các ngưỡng cảnh báo. |
| Bài 40 – Phát triển bền vững và tăng trưởng xanh | `sustainable-green-growth-step` | Bảng cân bằng kinh tế–xã hội–môi trường, mục tiêu phát triển bền vững và mô phỏng các kịch bản xanh. |

## 5. Thứ tự triển khai khuyến nghị

1. **Lấp nền tảng kĩ năng:** Bài 2, 3, 8, 10, 13, 16, 27. Đây là các bài giúp người học đọc bản đồ, dữ liệu và biểu đồ, đồng thời làm cho các mô phỏng sau dễ sử dụng hơn.
2. **Hoàn chỉnh tự nhiên:** Bài 4, 7, 11, 12, 15, 17, 18. Tận dụng lại hệ thống quả địa cầu, lớp dữ liệu, mặt cắt và dòng chảy đã có.
3. **Mở rộng kinh tế – xã hội:** Bài 19–26, 28–38. Ưu tiên mô hình bản đồ/lớp dữ liệu và công cụ biểu đồ trước khi làm 3D chi tiết.
4. **Chốt môi trường và tương lai:** Bài 31, 39, 40. Có thể tái sử dụng một phần `carbon-step`, nhưng phải tách nội dung SGK rõ ràng thay vì coi course hiện tại là đã phủ.

## 6. Việc cần xác minh trước khi biến backlog thành course

- OCR toàn bộ PDF hoặc đối chiếu thủ công từng bài với bản in đầy đủ; scan hiện có chỉ đủ để xác nhận bìa, mục lục và một phần nội dung.
- Ghi `chapter`, `lesson`, `printedPage`, `figureRef` và `sourceBookId` cho từng course.
- Xác minh hình nào là bản đồ, biểu đồ, sơ đồ hay ảnh minh họa; không dùng nhãn “hình SGK” nếu chưa đọc được chú thích.
- Kiểm tra thuật ngữ chính tả thống nhất: `Địa lí`, `thuỷ quyển`, `thuỷ sản`, `đô thị hoá`, `vỏ địa lí`.
- Khi triển khai, giữ panel lời giải và bước học tự xuống dòng, có vùng cuộn, không cắt chữ ở màn hình nhỏ.

