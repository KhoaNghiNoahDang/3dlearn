# Production deployment guide

Tài liệu này mô tả cách đóng gói và vận hành bản static của 3D Learn trên server riêng. Phạm vi hiện tại là frontend React/Vite và 54 bài mô phỏng legacy; backend, tài khoản và OCR worker chưa nằm trong release này.

## 1. Layout release bắt buộc

Một release hợp lệ phải có:

```text
release/<version>/
  app/                       # app/index.html và bundle đã build
  courses/                  # 54 bài HTML legacy
  covers/                   # ảnh cover
  content/
    manifest.json
    course-mapping.json
  app/legacy/manifest.json
```

Không đưa các file sau vào web root public:

```text
SGK/*.pdf
.env*
.git/
node_modules/
_viethoa/
logs/
```

PDF SGK là source scan lớn và cần xác minh quyền phân phối. Nếu được phép dùng trên server, lưu ở storage private có quyền truy cập riêng; không copy vào `dist`.

## 2. Build và validation

Trên máy build:

```powershell
npm ci
npm run build
node scripts/validate-release.mjs --artifact dist --source .
```

Validator kiểm tra app HTML/bundle, `courses/`, `covers/`, ba manifest runtime, đủ bài theo `catalog.json`, không có PDF và không có source/private directories.

Có thể xuất báo cáo JSON:

```powershell
node scripts/validate-release.mjs --artifact dist --source . --json > release-validation.json
```

Build hiện tại chỉ tạo app bundle; vì vậy validator sẽ fail cho tới khi staging/deploy copy các thư mục runtime vào artifact. Đây là fail-fast có chủ đích để không deploy bản thiếu bài 3D.

## 3. Staging release trên server

Dùng thư mục release bất biến và một liên kết `current`:

```text
/srv/3dlearn/releases/<version>/
/srv/3dlearn/current -> /srv/3dlearn/releases/<version>/
/srv/3dlearn-private/textbooks/
/srv/3dlearn-backups/
```

Quy trình:

1. Tạo `<version>` từ tag Git hoặc mã build, ví dụ `2026.10.31-001`.
2. Upload artifact đã pass validator vào `/srv/3dlearn/releases/<version>/`.
3. Kiểm tra quyền đọc của user web server.
4. Chạy smoke test cục bộ trên release.
5. Chuyển `current` sang release mới bằng thao tác atomic.
6. Reload Nginx/Caddy nếu cần.
7. Kiểm tra HTTP từ bên ngoài.
8. Giữ tối thiểu ba release gần nhất để rollback.

## 4. Smoke test sau deploy

Kiểm tra các URL:

```text
/app/
/app/lesson/capacitor-step
/courses/capacitor-step.html
/covers/capacitor-step.webp
```

Expected:

- `/app/` trả `200` và content type HTML;
- lesson trả app shell hoặc route fallback, không phải `404`;
- course trả `200` và content type HTML;
- cover trả `200` với image content type;
- không có route public tới `/SGK/*.pdf` nếu chưa có chính sách truy cập.

## 5. Reverse proxy và cache

Asset thật phải được xử lý trước SPA fallback:

```text
/courses/*  -> file HTML legacy
/covers/*   -> file ảnh
/app/*      -> app/index.html nếu không phải file thật
/assets/*   -> bundle hash của Vite
```

Không rewrite `/courses/*` hoặc `/covers/*` thành app shell.

Cache khuyến nghị:

```text
assets/*.js, assets/*.css  public, max-age=31536000, immutable
covers/*                    public, max-age=604800, must-revalidate
courses/*.html              public, max-age=300, must-revalidate
app/index.html              no-cache
SGK/PDF private             private, no-store
```

Tối thiểu cần có HTTPS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP phù hợp và `Permissions-Policy` giới hạn camera/microphone/geolocation.

## 6. Rollback

Rollback chỉ thay đổi symlink/current release; không xóa release cũ trong lúc xử lý sự cố.

1. Xác định release đang chạy và release gần nhất đã pass smoke test.
2. Đổi `current` về release đó bằng thao tác atomic.
3. Reload reverse proxy.
4. Kiểm tra `/app/`, một lesson, một course HTML và một cover.
5. Ghi incident: version lỗi, thời điểm, triệu chứng và nguyên nhân.
6. Giữ release lỗi để điều tra; chỉ xóa sau khi đã lưu log cần thiết.

Không sửa trực tiếp file trong release đang chạy. Mỗi release phải immutable.

## 7. Backup asset và khôi phục

Backup những thứ không thể tái tạo nhanh từ Git:

- cover và simulation asset đã phát hành;
- manifest/content approved;
- PDF private nếu có quyền lưu trữ;
- checksum và version release;
- cấu hình reverse proxy không chứa secret.

Không cần backup `node_modules`, cache build hoặc chỉ riêng `dist`; có thể tái tạo từ source và lockfile.

Lịch tối thiểu:

```text
Hàng ngày: backup asset/private storage thay đổi
Hàng tuần: snapshot đầy đủ và kiểm tra checksum
Hàng tháng: test restore vào staging riêng
```

Nguyên tắc:

1. Có ít nhất một bản sao ngoài server production.
2. Mã hóa storage private và giới hạn quyền đọc.
3. Không ghi đè backup cũ; dùng retention theo ngày/tuần/tháng.
4. Lưu manifest release cùng backup để biết asset thuộc version nào.
5. Thử khôi phục thực tế, không chỉ kiểm tra file tồn tại.

## 8. Production checklist

### Artifact

- [ ] `npm ci` dùng đúng lockfile.
- [ ] Build hoàn tất không có TypeScript error.
- [ ] `node scripts/validate-release.mjs --artifact <path>` pass.
- [ ] App, courses, covers và ba manifest tồn tại.
- [ ] Không có PDF SGK trong artifact public.
- [ ] Không có `.env`, `.git`, `node_modules` hoặc thư mục source private.

### Server

- [ ] Chỉ Nginx/Caddy public port 80/443.
- [ ] HTTPS và certificate hoạt động.
- [ ] App fallback không che mất `/courses/*` và `/covers/*`.
- [ ] Có cache policy cho bundle, HTML legacy và cover.
- [ ] Có security headers.
- [ ] Có log rotation và disk alert.
- [ ] Có `/healthz` hoặc kiểm tra HTTP tương đương.

### Smoke test

- [ ] `/app/` trả 200.
- [ ] Deep link `/app/lesson/capacitor-step` không 404.
- [ ] Iframe `/courses/capacitor-step.html` trả 200.
- [ ] Cover trả 200.
- [ ] Mở thử một bài Vật lí, Hoá học, Sinh học và Địa lí.
- [ ] Xoay/zoom/fullscreen hoạt động trên desktop.
- [ ] Touch và layout mobile hoạt động.
- [ ] Tab Network không có 404 cho asset chính.

### Rollback và backup

- [ ] Có ít nhất ba release gần nhất.
- [ ] Biết release nào là last-known-good.
- [ ] Đã thử rollback trên staging.
- [ ] Backup asset có version/checksum.
- [ ] Đã thử restore gần đây.
- [ ] Secrets nằm ngoài repository.

## 9. Giới hạn của release hiện tại

Release này chưa bao gồm API/backend, tài khoản, PostgreSQL/Redis, OCR pipeline, CMS duyệt nội dung hoặc shared 3D engine thay thế 54 bài legacy. Đây là static production baseline; khi bổ sung backend, cần tách API và storage thành service riêng, không nhúng secret hoặc PDF private vào frontend build.
