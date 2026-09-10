# Kế hoạch triển khai

Cập nhật 10/9/2026.

**Cách dùng file này:** mỗi task có một mã (`A1`, `B2`…) và một trạng thái. Làm xong thì đổi
trạng thái trong bảng **và** tick ô trong phần chi tiết. Task nào đẻ ra việc mới thì thêm vào
đúng nhóm, đừng ghi rải rác trong commit message.

| Trạng thái | Nghĩa |
|---|---|
| ✅ xong | Đã làm, đã kiểm, đã commit |
| 🔵 đang làm | Có người đang cầm |
| ⏸ chờ quyết | Chặn ở quyết định của chủ nhà, không phải chuyện mã |
| ⬜ chưa làm | Đã thống nhất là cần, chưa ai đụng |
| 💤 hoãn | Biết là thiếu, cố ý chưa làm |

---

## Toàn cảnh

| Mã | Việc | Trạng thái | Chặn bởi |
|---|---|---|---|
| **Chuyển sang Next.js** ||||
| C1 | Chặng 1 — khởi tạo Next, chuyển dữ liệu sang module ES | ✅ xong | |
| C2 | Chặng 2 — trang bản vẽ 2D | ✅ xong | |
| C3 | Chặng 3 — trang 3D, khối nhà và đường đi của nắng | ✅ xong | |
| C4 | Chặng 4 — xoá bản HTML cũ, viết lại tài liệu | ✅ xong | |
| **Thiết kế → gộp thành v13** ||||
| A0 | Chốt nơi xây (vĩ độ) | ⏸ chờ quyết | |
| A1 | Che nắng tây cho master | ⏸ chờ quyết | A0 |
| A2 | Mái che sân phụ vào dữ liệu phiên bản | ⏸ chờ quyết | |
| A3 | Tường bao trái Tây Bắc — trễ pha nhiệt | ⏸ chờ quyết | |
| A4 | Dựng `lib/versions/v13.js` từ A1–A3 | ⬜ chưa làm | A1, A2, A3 |
| **Mô hình 3D** ||||
| B1 | Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT` | ⬜ chưa làm | A0 |
| B2 | Đi bộ: va chạm và cao độ mắt theo sàn đang đứng | 💤 hoãn | |
| B3 | Nội thất dạng khối trong 3D | 💤 hoãn | |
| **Hạ tầng** ||||
| D1 | Bộ kiểm tra cho hình học 3D | ⬜ chưa làm | |
| D2 | Gắn CI chạy build + spec:check + kiểm 3D | ⬜ chưa làm | D1 |

---

## Chuyển sang Next.js — xong

- [x] **C1 · Khởi tạo Next, chuyển dữ liệu sang module ES** — `10b8fd7` `7fb5ae9` `8e78e61` `eb49615`
  - [x] Khung Next.js, `package.json`, `.gitignore`
  - [x] Tách `LOT` / `VERSIONS` khỏi thẻ `<script>` trong `index.html`
  - [x] 12 phiên bản đổi từ `definePlan()` sang `export default`, gom ở `lib/versions/index.js`
  - [x] `validate()` (13 phép kiểm) sang `lib/plan.js`, `specMarkdown()` sang `lib/spec.js`
  - [x] `npm run spec` / `spec:check` thay cho việc gọi console rồi dán tay

- [x] **C2 · Trang bản vẽ 2D** — `6511c56`
  - [x] Bộ vẽ SVG chuyển nguyên văn sang `components/ve2d.js`, cố ý không viết lại theo lối React
  - [x] Dọn `#plan` và `#ver` trước khi dựng (StrictMode gọi effect hai lần)
  - [x] Ra đúng bản cũ: 100 nhãn, 13/13 phép kiểm, khung tên có hướng Đông Bắc

- [x] **C3 · Trang 3D** — `f9bd8cf` `251bdc7`
  - [x] `lib/khoi3d.js` — hình học thuần, không dính three.js, chạy được trong node
  - [x] Ba bậc chiều cao tường tự suy từ phòng áp vào, không khai tay
  - [x] `lib/sun.js` — vị trí mặt trời NOAA, đổi sang hệ toạ độ cảnh qua `LOT.huongMatTien`
  - [x] Ẩn mái, toàn cảnh, từ trên xuống, đi bộ trong nhà
  - [x] `3d.md` — ghi lại **vì sao** dựng như đang dựng

- [x] **C4 · Xoá bản HTML cũ** — `777f969` `02a74a2` `872c86c`
  - [x] Xoá `index.html`, `lo-dat.js`, `versions/*.js`
  - [x] Sửa `--check` của `gen-spec` (đang bỏ qua cả dòng "Sinh tự động" nên thay đổi lọt lưới)
  - [x] Viết lại `CLAUDE.md` và `mat-bang.md` theo bố cục Next

---

## A · Thiết kế → gộp thành v13

Cả nhóm này sửa vào **một** `lib/versions/v13.js`, không phải mỗi việc một bản. Quy trình bắt
buộc ở `CLAUDE.md` mục "Thêm phiên bản mới": không sửa v12, thêm dòng vào
`lib/versions/index.js`, chạy `npm run spec`, thêm dòng vào bảng lịch sử trong `mat-bang.md`.

### ⏸ A0 · Chốt nơi xây (vĩ độ)

Chặn A1 và B1. Đang cho chọn Hà Nội / Đà Nẵng / TP.HCM, **mặc định Hà Nội**. Sai vĩ độ thì
toàn bộ phần nắng sai theo, nên phải chốt trước khi dùng mô hình để kết luận bất cứ điều gì.

- [ ] Chủ nhà xác nhận nơi xây

### ⏸ A1 · Che nắng tây cho master

Nhiều khả năng là **nội dung chính của v13**. Master chỉ có một nguồn sáng: cửa lùa D12 rộng
3.2 m quay **Tây Nam**, mà ban công sau là loại `yard` nên không có mái — hiện D12 không có gì
che.

**Che bằng hình khối ngang là bất khả**, đã tính: 15h cao độ ~45°, che hết cửa cao 2.4 m cần
mái đua 2.4 m; 16h30 cao độ ~25° thì cần hơn 5 m. Phải là **lam đứng, rèm ngoài, hoặc giàn cây
trên ban công**. Xem `3d.md` mục 2a.

- [ ] Mở `/3d`, chọn đúng nơi xây (A0), kéo giờ tới 15h–16h30 ngày hạ chí **và** đông chí
- [ ] Chốt cách che: lam đứng / rèm ngoài / giàn cây
- [ ] Nếu cách che đổi hình khối (giàn, mái ban công) thì phải vào dữ liệu v13

> Đọc vệt nắng thì tin được, đọc độ sáng thì không — mô hình không có ánh sáng gián tiếp.
> Xem `3d.md` mục 6.

### ⏸ A2 · Mái che sân phụ vào dữ liệu phiên bản

Đang khai tạm ở `MAI_CHE` trong `lib/lot.js` (`x:0, w:5.0, tuY:12.0, dai:5.5, cao:2.80`) để 3D
dựng được. Nó là **thay đổi thiết kế** nên đúng quy trình phải vào v13.

Đánh đổi (`3d.md` mục 3): được cái đi từ xe vào nhà không dính mưa, nhưng nó nằm ngay trước
cửa chính D1 và che mất đúng nguồn sáng Đông Bắc dịu nhất nhà. Chốt **không phủ quá ~5.5 m**,
chừa hơn 6 m hở trời phía cổng.

- [ ] Chủ nhà chốt chiều dài phủ
- [ ] Chuyển `MAI_CHE` từ `lib/lot.js` vào `lib/versions/v13.js`
- [ ] `lib/khoi3d.js` đang đọc thẳng `MAI_CHE` — sửa để đọc từ phiên bản
- [ ] Bỏ đoạn "khai tạm" trong `3d.md` mục 3 và `CLAUDE.md` mục "Chưa xác định"

### ⏸ A3 · Tường bao trái Tây Bắc — trễ pha nhiệt

Mùa hè mặt trời lặn chếch lên phía bắc (~293°) nên bức tường đặc 18 m này ăn nắng muộn suốt
chiều. Gạch 220 đặc trễ pha nhiệt 4–5 tiếng → nhả nhiệt vào **buổi tối**, đúng lúc đi ngủ, mà
sau nó là phòng ngủ 1 và master, không có cửa sổ nào để xả.

Mới là suy luận từ hướng, **chưa tính toán gì**. Xem `3d.md` mục 2c.

- [ ] Quyết có xử lý hay không
- [ ] Nếu có: tường hai lớp hay cây leo, và chỉ đoạn giáp hai phòng ngủ hay cả 18 m

### ⬜ A4 · Dựng `lib/versions/v13.js`

Chỉ làm khi A1–A3 đã chốt. Theo đúng 5 bước ở `CLAUDE.md`.

- [ ] Chép `v12.js` → `v13.js`, sửa theo A1–A3
- [ ] Thêm `import` và phần tử cuối mảng trong `lib/versions/index.js`
- [ ] 13 phép kiểm phải **sạch** — không commit bản hiện hành còn lỗi
- [ ] `npm run spec`
- [ ] Thêm dòng vào bảng "Lịch sử phiên bản" trong `mat-bang.md`

---

## B · Mô hình 3D

### ⬜ B1 · Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT`

Chặn bởi A0. Khi đã chốt nơi xây thì dropdown ba thành phố chỉ còn là cái bẫy — người xem quên
đổi là đọc sai toàn bộ phần nắng.

- [ ] Đưa `lat` / `lon` thật vào `LOT` trong `lib/lot.js`
- [ ] Bỏ `<select id="noi">` khỏi `Plan3D.jsx` và phần xử lý trong `ve3d.js`
- [ ] Giữ `NOI` trong `lib/sun.js` hay bỏ — tuỳ còn dùng để đối chiếu không

### 💤 B2 · Đi bộ: va chạm và cao độ mắt

`components/ve3d.js`, hàm `diChuyen()`: đi xuyên tường được, và cao độ mắt luôn tính từ cốt nền
nhà (`MUC.nen + 1.60`) nên bước ra sân thì lửng lơ 45 cm.

**Cố ý hoãn** — đủ dùng để soi tỉ lệ đứng, vốn là mục đích chính của mô hình.

- [ ] Cao độ mắt tra theo phòng đang đứng (`lib/khoi3d.js` đã biết qua `oCotNha`)
- [ ] Chặn va chạm theo danh sách hộp tường

### 💤 B3 · Nội thất dạng khối trong 3D

Mới có khối tường, sàn, mái. Dữ liệu đã có sẵn ở `v.furn` của từng phiên bản (2D đang vẽ), chỉ
thiếu chiều cao. **Cố ý hoãn** — làm nếu thấy cần cảm nhận tỉ lệ kỹ hơn. Xem `3d.md` mục 8.

- [ ] Thêm chiều cao cho từng loại nội thất vào `CAO` trong `lib/lot.js`
- [ ] Dựng hộp trong `lib/khoi3d.js`

---

## D · Hạ tầng

### ⬜ D1 · Bộ kiểm tra cho hình học 3D

13 phép kiểm của `validate()` chỉ soi mặt bằng 2D. `lib/khoi3d.js` cố ý viết thuần hình học,
không dính three.js, nên **chạy được trong node** — thêm `scripts/check-3d.mjs` theo đúng lối
`gen-spec.mjs`.

- [ ] Mọi hộp có `w`, `d`, `y1-y0` dương và hữu hạn, ở cả 12 phiên bản
- [ ] Diện tích mái phủ đúng các phòng kín, trừ đúng phần giếng trời
- [ ] Không lỗ mở nào vượt đỉnh đoạn tường chứa nó
- [ ] Thêm `npm run check:3d` vào `package.json`

### ⬜ D2 · Gắn CI

`npm run spec:check` và `npm run build` đều đã thoát khác 0 khi hỏng, chưa có workflow nào gọi.

- [ ] Workflow chạy `npm run build`, `npm run spec:check`, `npm run check:3d`
