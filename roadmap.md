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
| C5 | Chặng 5 — bỏ quy ước phiên bản, đổi định danh sang tiếng Anh | ✅ xong | |
| **Thiết kế — sửa vào bản hiện hành** ||||
| A0 | Chốt nơi xây — **Bắc Giang** | ✅ xong | |
| A1 | Che nắng tây cho master — chốt **đổ trần ban công + tường trái lên mái** (thay lam đứng) | ✅ xong | |
| A2 | Mái phụ — chốt **mái bàn trà sân chính**, bỏ mái che xe | ✅ xong | |
| A3 | Tường trái Tây Bắc — chốt **sơn chống nóng lúc xây** | ✅ xong | |
| A5 | Chống nóng mái — chốt **lát lớp chống nóng** | ✅ xong | |
| A6 | Bếp — chốt **lợp tôn hai mái + trần tôn**, không đổ mái bê tông | ✅ xong | |
| A7 | Mái sân phơi — chốt **tôn dốc một mái**, chừa dải hở thẳng hàng ban công | ✅ xong | |
| A8 | WC khách 2 × 2 m, tường trong 100, W4 thành ô thoáng — **đã vào `current.js`** | ✅ xong | |
| A9 | Bậc tam cấp, mái hiên cửa chính, sàn bếp và WC khách hạ còn +0.15 — **đã vào `current.js`** | ✅ xong | |
| A10 | Đổ trần ban công sau, tường trái ban công lên mái — thay lam D12, **đã vào `current.js`** | ✅ xong | |
| A4 | Đưa mái bàn trà, mái tôn bếp, mái sân phơi vào `lib/versions/current.js` | ⬜ chưa làm | |
| **Mô hình 3D** ||||
| B1 | Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT` | ✅ xong | |
| B2 | Đi bộ: va chạm và cao độ mắt theo sàn đang đứng | 💤 hoãn | |
| B3 | Nội thất dạng khối trong 3D | 💤 hoãn | |
| B4 | Tường bao dọc hành lang ngoài hạ về cao rào | ✅ xong | |
| **Cấu hình tuỳ chỉnh** ||||
| E0 | Bỏ hằng số ghim trong `validate()` | ✅ xong | |
| E1 | Đổi hướng nhà được | ✅ xong | |
| E2 | Advanced config — ranh phòng và cao độ, lan truyền tự động | ✅ xong | |
| E3 | Lưu cấu hình đặt tên trong `localStorage` | ✅ xong | |
| **Hạ tầng** ||||
| D1 | Bộ kiểm tra cho hình học 3D | ✅ xong | |
| D2 | Gắn CI chạy build + ba lệnh kiểm | ✅ xong | |

---

## Chuyển sang Next.js — xong

- [x] **C1 · Khởi tạo Next, chuyển dữ liệu sang module ES** — `10b8fd7` `7fb5ae9` `8e78e61` `eb49615`
  - [x] Khung Next.js, `package.json`, `.gitignore`
  - [x] Tách `LOT` / `VERSIONS` khỏi thẻ `<script>` trong `index.html`
  - [x] 12 phiên bản đổi từ `definePlan()` sang `export default`, gom ở `lib/versions/index.js`
  - [x] `validate()` (13 phép kiểm) sang `lib/plan.js`, `specMarkdown()` sang `lib/spec.js`
  - [x] `npm run spec` / `spec:check` thay cho việc gọi console rồi dán tay

- [x] **C2 · Trang bản vẽ 2D** — `6511c56`
  - [x] Bộ vẽ SVG chuyển nguyên văn sang `components/draw2d.js`, cố ý không viết lại theo lối React
  - [x] Dọn `#plan` và `#ver` trước khi dựng (StrictMode gọi effect hai lần)
  - [x] Ra đúng bản cũ: 100 nhãn, 13/13 phép kiểm, khung tên có hướng Đông Bắc

- [x] **C3 · Trang 3D** — `f9bd8cf` `251bdc7`
  - [x] `lib/massing.js` — hình học thuần, không dính three.js, chạy được trong node
  - [x] Ba bậc chiều cao tường tự suy từ phòng áp vào, không khai tay
  - [x] `lib/sun.js` — vị trí mặt trời NOAA, đổi sang hệ toạ độ cảnh qua `LOT.huongMatTien`
  - [x] Ẩn mái, toàn cảnh, từ trên xuống, đi bộ trong nhà
  - [x] `3d.md` — ghi lại **vì sao** dựng như đang dựng

- [x] **C4 · Xoá bản HTML cũ** — `777f969` `02a74a2` `872c86c`
  - [x] Xoá `index.html`, `lo-dat.js`, `versions/*.js`
  - [x] Sửa `--check` của `gen-spec` (đang bỏ qua cả dòng "Sinh tự động" nên thay đổi lọt lưới)
  - [x] Viết lại `CLAUDE.md` và `floor-plan.md` theo bố cục Next

- [x] **C5 · Bỏ quy ước phiên bản, đổi định danh sang tiếng Anh**
  - [x] `v12.js` → `current.js` (bản sống), `v1`…`v11` thành kho đối chiếu đóng băng
  - [x] `CLAUDE.md`: thay quy trình "thêm `v<n+1>`" bằng "sửa `current.js`, git giữ lịch sử"
  - [x] Định danh (file, hàm, biến, khoá, `id` DOM) chuyển hết sang tiếng Anh
  - [x] Chú thích và tài liệu giữ tiếng Việt

---

## A · Thiết kế — sửa vào bản hiện hành

Cả nhóm này sửa thẳng vào `lib/versions/current.js`; **không đẻ ra phiên bản mới** — git giữ
lịch sử, commit message phải nói rõ đổi gì và vì sao. Quy trình bắt buộc ở `CLAUDE.md` mục
"Đổi thiết kế": 13 phép kiểm phải sạch, rồi `npm run spec`.

A1–A3, A5–A7 là **quyết định**, chủ nhà chốt hết ngày 10/9/2026. Số liệu và lý do nằm ở
`3d.md` mục 2a, 2c, 3, 3a, 3b — ở đây chỉ ghi kết quả. A3 và A5 không đổi hình khối, nên A4 gồm
ba thứ: mái bàn trà (A2), mái tôn bếp (A6), mái sân phơi (A7). Che nắng D12 (A1) đổi từ lam sang
đổ trần ban công — toàn hộp nên đã làm luôn ở A10.

### ✅ A0 · Chốt nơi xây — Bắc Giang

`21.27°B, 106.19°Đ`, ghi thẳng vào `LOT` trong `lib/lot.js`.

**Không chặn A1 như đã ghi trước đây.** Tính ra thì mái đua cần để che hết cửa lùa D12 lúc 15h
hạ chí là 1.17 m ở Hà Nội, 1.13 m ở Đà Nẵng, 0.95 m ở TP.HCM — chênh nhau 22 cm trên 10 vĩ độ.
Mùa đông thì cả ba đều 3.7–4.8 m, tức bất khả như nhau. Kết luận của A1 không đổi theo nơi xây.

Nơi xây đổi thật ở hai chỗ khác:

- **Nắng mùa đông qua giếng trời hành lang.** 21/12: Hà Nội 1.0h (đỉnh 0.69 m² sàn được nắng),
  Đà Nẵng 1.8h (1.53 m²), TP.HCM 2.0h (2.30 m²). Mùa hè thì ba nơi như nhau (~2.8h, ~4.4–5.0 m²).
  Hành lang miền Bắc mùa đông tối hơn hẳn.
- **Số ngày trưa mặt trời ở phía Bắc**, ăn vào A3: Hà Nội 53, Đà Nẵng 97, TP.HCM 129 ngày/năm.

Và thứ mô hình **không** tính được mà lại quan trọng hơn vĩ độ: khí hậu. Bắc Giang có mùa đông
lạnh nhiều mây, nên nắng lọt vào nhà mùa đông là thứ *đáng mong*, ngược hẳn với miền Nam.

#### Số của Bắc Giang

| | Mọc → lặn | Trưa | D12 ăn nắng | Mái đua cần lúc 15h |
|---|---|---|---:|---:|
| 21/6 hạ chí | 05:18 → 18:36 | 88° phía **Bắc** | 6.5 h | 1.19 m |
| 23/9 thu phân | 05:48 → 17:48 | 69° Nam | 7.3 h | 2.68 m |
| 21/12 đông chí | 06:32 → 17:15 | 45° Nam | 8.2 h | 4.86 m |

51 ngày mỗi năm trưa mặt trời ở phía Bắc.

### ✅ A1 · Che nắng tây cho master — đổ trần ban công (thay lam đứng)

**Chốt ban đầu: lam đứng sâu 0.4 m, bước 0.6 m, vuông góc mặt kính D12** (đã thay bằng đổ trần
ban công, xem A10). Nắng hè tới D12 xiên từ
Tây–Tây Bắc nên lam chặn gần sạch (9.6 → 0.1 kWh/ngày ngày 21/6); nắng đông gần chính diện nên
lọt qua phần lớn (21.0 → 13.5). Tháng 9 còn 12.3 — cần thêm rèm trong nhà. `3d.md` mục 2a.

- [x] Tính nắng lên D12 theo giờ, ba mốc hạ chí / thu phân / đông chí
- [x] So năm cách: lam dày, lam thưa, nâng tường trái ban công, mái kín ban công, rèm ngoài
- [x] Chủ nhà chốt lam thưa
- [x] **Đổi (11/9/2026): đổ trần ban công + tường trái ban công lên mái, bỏ lam** — ngang lam về sáng
      và nắng hè, tháng 9 nắng lên kính còn một nửa, D12 hết dính mưa. Đã vào `current.js` ở A10

### ✅ A2 · Mái phụ — mái bàn trà ở sân chính

Hoá ra mái phụ **không phải để che xe** mà để kê bàn trà ngoài sân chính, cạnh bếp và phòng
khách. **Mái che xe ở sân phụ bỏ hẳn** — nó cắt phần trời cửa chính D1 nhìn thấy còn 40%.

**Chốt:** `x` 5.0–8.5, `y` 15.0–18.0 (3.5 × 3.0 m, sát góc trong chữ L), cao **3.20 m**, **tôn
cách nhiệt**. Che được cả D2 lẫn cửa bếp D9, vẫn chừa W1 (93% trời). Cái giá: W2 bếp còn 42%
trời, nắng sáng mùa đông vào phòng khách 13.9 → 8.6 kWh/ngày. `3d.md` mục 3.

- [x] So năm vùng phủ: không mái, chòi rời, sát góc, dọc tường nhà chính, chữ L
- [x] Chủ nhà chốt vùng, cao độ, vật liệu, và bỏ mái che xe
- [ ] Vào `current.js` — A4

### ✅ A3 · Tường trái Tây Bắc — sơn chống nóng lúc xây

Tường nhà bên trái dài **16 m** (trước ghi 18 m là tính cả tường rào ban công). Hè mỗi m² nhận
2.47 kWh/ngày, **ít hơn mái 3 lần**; đông gần như 0. Lô bên trái rộng 4.5 m, đang trống, khoảng
5 năm nữa có thể xây nhà ống sát ranh rồi che luôn bức tường này.

**Chốt: sơn chống nóng mặt ngoài ngay lúc xây**, khi đất bên cạnh còn trống. Không tường hai
lớp, không cây leo. Không đổi hình khối. `3d.md` mục 2c.

- [x] Tính nắng lên từng mặt nhà và mái
- [x] Chủ nhà chốt

### ✅ A5 · Chống nóng mái — lát lớp chống nóng

Việc **lộ ra khi tính A3**: mái bằng bê tông ~85 m² (không tính bếp — A6) nhận tổng nhiệt hè
gấp ~4 lần tường trái.

**Chốt: lát lớp chống nóng trên sàn mái bê tông nhà chính** (tấm cách nhiệt hoặc gạch chống
nóng). Không làm mái tôn thông gió phía trên vì phải khoét theo SK1–SK4. Không đổi hình khối.
`3d.md` mục 2c.

- [x] Chủ nhà chốt

### ✅ A6 · Bếp lợp tôn hai mái + trần tôn

Bếp **không đổ mái bê tông** như nhà chính. **Chốt:** nóc chạy ngang ở `y = 21.5`, hai mái đổ về
sân chính và sân phơi, dốc 30%; trần tôn chống nóng cốt 3.75 m (sàn bếp hạ còn +0.15 ở A9 nên cách sàn 3.60 m), đỉnh
nóc cốt 4.80 m — nhô 0.80 m trên mái nhà chính. Máng xối mép bắc bếp, mái bàn trà gá thấp bên
dưới. `3d.md` mục 3a.

- [x] Chủ nhà chốt hướng nóc, cao trần, độ dốc, chỗ nối với mái bàn trà
- [ ] Vào `current.js` — A4

### ✅ A7 · Mái sân phơi / giặt

**Chốt:** phủ `x` 5–9.5, `y` 25–28, chừa hở dải `x` 5–7.5, `y` 28–30 thẳng hàng ban công chạy tới
WC khách. Tôn cách nhiệt, dốc một mái 3.50 m sát bếp → 3.00 m ở mép `y = 28`, gá dưới máng mép
nam mái bếp. Đoạn mép thấp `x` 7.5–9.5 áp tường WC khách, cần viền chống thấm. `3d.md` mục 3b.

Cái giá: bếp bị mái che ba phía, các cửa bếp còn ~55% trời (D10 còn 37%). Mái bàn trà được xem
lại cùng lúc và giữ tôn.

- [x] Tính phần trời các cửa bếp còn nhìn thấy
- [x] Chủ nhà chốt vùng phủ, dạng mái, vật liệu
- [ ] Vào `current.js` — A4

### ✅ A8 · WC khách 2 × 2 m, ô thoáng W4

Thay đổi thuần mặt bằng, không cần loại khối mới, nên **sửa thẳng vào `current.js`** chứ không
chờ A4.

- [x] WC khách 1.6 × 2.0 → **2.0 × 2.0 m** tim tường, nới sang trái: `x` 7.5–9.5. Dải hở sân
      phơi (A7) còn 2.5 × 2.0 m
- [x] Hai tường trong (bắc, tây) 220 → **100 mm** vì phòng nhỏ; hai tường ranh lô giữ 220
- [x] Trần giữ 3.30 m — đã tính hạ xuống 2.60 rồi bỏ
- [x] W4 rộng 0.8 m, bệ 0.90 → **ô thoáng 0.6 × 0.4 m, bệ 1.90 → mép trên 2.30**, kính mờ lật, kèm
      quạt hút. Khai ở `heights.only.W4`; `lib/massing.js` nay đọc bệ / mép trên riêng cho từng
      cửa sổ, trước chỉ cửa đi làm được
- [x] 13 phép kiểm sạch, `npm run spec`, `npm run check` sạch (build + spec + lưới + 3D)
- [x] `scripts/check-3d.mjs` phép kiểm 5 chọc lỗ cửa sổ theo bệ riêng — trước chọc ở bệ mặc định
      0.90 nên báo oan "W4 bị tường bịt"

### ✅ A9 · Bậc tam cấp, mái hiên cửa chính, nền bếp và WC khách

Chốt ngày 10/9/2026, `3d.md` mục 3c. Toàn hộp thẳng trục nên **không phải chờ loại khối mặt dốc
của A4** — làm trước được.

- [x] D13 đổi chiều mở vào ban công — đã vào `current.js`
- [x] Bậc cho D1, D2, D13 (D9, D10 bỏ — sàn bếp hạ còn +0.15): khai trong `current.js` theo mã cửa; kích thước (3 nấc 0.15 tính cả sàn nhà → 2 bậc ngoài,
      mặt 0.30) là hằng số ở `lib/lot.js`, phần dư mỗi bên khai theo từng cửa. Vị trí **suy từ cửa và phía sân** chứ
      không khai toạ độ — dịch tường thì bậc đi theo cửa
- [x] `lib/massing.js` dựng một hộp mỗi bậc; `lib/plan.js` thêm phép kiểm bậc nằm gọn trong sân,
      không chồng nội thất và vùng quét cánh
- [x] Mái hiên cửa chính: khai trong `current.js` bám tường `y = 12`, `x` 0–5, đua 1.2 m; `massing.js`
      dựng thành loại riêng để phép kiểm 6 (diện tích mái) không tính nhầm
- [x] Gỡ `CARPORT_ROOF` khỏi `lib/lot.js` cùng hai thanh trượt mái che xe của E2f (`lib/config.js`,
      `components/scene3d.js`, `components/Plan3D.jsx`, `components/draw2d.js`); cấu hình đã lưu
      còn khoá `carport` phải được bỏ qua êm
- [x] Sàn WC khách (và bếp) có cốt riêng: khai `floorLevels` trong `current.js`; `massing.js` lấy cốt sàn theo phòng thay
      cho một `L.floor` chung — cửa D11 và bệ W4 tính từ cốt đó; `check-3d` phép kiểm 5 chọc theo
      cùng cốt
- [x] Vẽ bậc và mái hiên lên bản 2D, `specMarkdown()` in ra
- [x] `npm run check` sạch, `npm run spec`, cập nhật `floor-plan.md`

Làm ra: `lib/envelope.js` gom cốt sàn từng phòng, bậc và mái hiên — `massing.js`, `validate()`,
bản vẽ 2D, đặc tả cùng dùng. `validate()` thêm **phép kiểm 14** (bậc và mái hiên bám đúng chỗ,
bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa); `check-3d` thêm **phép kiểm 9** (bậc
cao nhất áp tường cửa, thấp hơn ngưỡng cửa đúng một nấc). Mái hiên neo vào lưới như tường; bậc suy từ cửa nên dịch
tường ở thanh trượt là cả hai đi theo.

> **Chủ nhà chỉnh (11/9/2026): tam cấp là 2 bậc, không phải 3** — nấc trên cùng chính là sàn nhà.
> Bản đầu dựng thừa một bậc ngang sàn chìa ra trước cửa. Nay bậc nhô 0.6 m thay vì 0.9 m, góc bàn
> trà nhờ đó rộng ra 2.9 × 2.4 m.

> **Chủ nhà chỉnh tiếp (11/9/2026): hạ sàn bếp và WC khách còn +0.15 so với sân** — chênh đúng
> một nấc nên D9, D10, D11 không dựng bậc, mà sàn vẫn cao hơn sân. Lần đầu làm thành ngang sân,
> chủ nhà sửa lại. Dữ liệu vì thế đổi từ danh sách phòng ở cốt sân (`atGrade`) sang cốt sàn riêng
> từng phòng (`floorLevels`); số bậc tính theo chênh cốt hai bên cửa. Mái giữ cốt nên trần cách sàn
> bếp và sàn WC khách 3.60 m; hạ mái bếp theo sàn thì mép mái thấp hơn mép cao mái sân phơi. Góc bàn
> trà hết bậc D9, còn 2.9 × 3.0 m. Phần trời cửa bếp tính lại: W2 42%, D9 52%, D10 37%, cả bếp vẫn
> 55%.

> **Chủ nhà chỉnh tiếp (11/9/2026): bậc không đều, bậc cửa phụ hẹp lại.** Bậc đo từ tim tường nên
> nửa bề dày tường (0.11 m) nuốt mất phần bậc trên — bậc trên lộ ra 0.19 m, bậc dưới 0.30 m. Nay
> bậc và mái hiên **đo từ mặt ngoài tường**; `check-3d` phép kiểm 9 đòi bậc cao nhất áp đúng mặt
> tường và các mặt bậc đều nhau. Phần dư mỗi bên khai theo từng cửa, bỏ `STEP.margin` chung:
> `steps:{D1:0.30, D2:0.20, D13:0.20}` — thử 0.10 cho cửa phụ thì chủ nhà thấy quá hẹp, dễ hụt chân.
> Góc bàn trà còn 2.8 × 3.0 m.

> **Chủ nhà chỉnh tiếp (11/9/2026): mặt bậc cửa phụ D2, D13 còn 0.25 m** (cửa chính giữ 0.30),
> nhô 0.5 m thay vì 0.6 m. `steps` đổi sang `{ mã cửa: { margin, tread } }`, bỏ trống `tread` thì
> lấy `STEP.tread`. Góc bàn trà còn 2.9 × 3.0 m.

> **Vấp khi thử dịch lưới:** kéo `x = 5` sang 5.4 làm cửa D10 vắt qua đường `x = 8.5`, bậc nhận
> nhầm hành lang ngoài là "phía sân" và quay vào trong bếp. Đã sửa: phía bậc lấy **ngược phía
> phòng cốt nền**, rồi mới tìm sân ở phía đó.

> **Bảng lịch sử trong `floor-plan.md` ghi sai số lỗi từ trước** (v5, v9, v10, v11) — đối chiếu
> `validate()` ở commit trước A9 thì số lỗi của cả 12 bản không đổi, chỉ bảng viết tay bị lệch.
> Đã sửa theo số thật.

### ⬜ A4 · Đưa ba mái mới vào `lib/versions/current.js`

Không còn bị chặn. Theo đúng 4 bước ở `CLAUDE.md` mục "Đổi thiết kế", nhưng **không chỉ là sửa
số**: mái bàn trà, mái tôn bếp, mái sân phơi đều là loại khối mà dữ liệu mặt bằng chưa có
chỗ khai. Mái tôn bếp và mái sân phơi cùng cần **mặt dốc** — làm một loại khối dùng chung.

**Mái sân phơi**

- [ ] Khai trong `current.js` cùng kiểu với mái bàn trà, thêm độ dốc: `x` 5–9.5, `y` 25–28,
      3.50 → 3.00, tôn
- [ ] `lib/massing.js` dựng bằng loại khối mặt dốc của mái tôn bếp
- [ ] Vẽ lên bản 2D
- [ ] `check-3d`: mép cao mái sân phơi thấp hơn mép nam mái bếp; mép thấp cao hơn đầu cửa D11

**Mái tôn bếp**

- [ ] Khai loại mái của bếp trong `current.js`: tôn hai mái, nóc chạy ngang, dốc 30%. Kho đối
      chiếu v1…v11 giữ mái bằng như cũ
- [ ] `lib/massing.js`: bỏ bản mái bê tông trên R2; sinh hai mặt dốc, trần tôn cốt 3.75, hai đầu
      hồi tam giác; tường bắc và nam bếp dừng ở mép mái 3.75 thay vì 4.00
- [ ] `components/scene3d.js` dựng được khối không phải hộp thẳng trục
- [ ] `scripts/check-3d.mjs`: sửa phép kiểm 3 và 6; thêm phép kiểm mái bàn trà thấp hơn mép mái bếp

**Mái bàn trà — thay `CARPORT_ROOF`**

- [ ] Khoá mới trong `current.js` cho mái phụ: `x` 5.0–8.5, `y` 15.0–18.0, cao 3.20, tôn
- [ ] `lib/massing.js` dựng mái bàn trà từ dữ liệu mặt bằng (gỡ `CARPORT_ROOF` đã chuyển sang A9)
- [ ] Neo mái vào lưới (`lib/grid.js`) để dịch tường `x = 5` hay `y = 18` thì mái đi theo — bài
      học ở E2f: để rời là mái lơ lửng tách khỏi nhà. Mép `x = 8.5` và `y = 18` trùng đường lưới,
      mép `y = 15` thì chưa
- [ ] Có làm thanh trượt cho mái bàn trà không — thanh trượt mái che xe đã gỡ ở A9
- [ ] Dời bàn tròn từ `(6.4, 11.6)` vào dưới mái, tránh vùng quét cánh D2, D9 và bậc D2
      (A9) — góc còn ~2.9 × 3.0 m, thừa chỗ cho bàn 1.4 m kèm ghế
- [ ] Vẽ mái lên bản 2D

**Chung**

- [ ] `specMarkdown()` in được hai loại khối mới
- [ ] Ghi sơn chống nóng tường trái (A3) và lớp chống nóng mái (A5) vào `warn` để đặc tả có
- [ ] Cập nhật `note` và `changes`
- [ ] 13 phép kiểm **sạch**, `npm run check` sạch
- [ ] `npm run spec`
- [ ] Cập nhật `floor-plan.md`
- [ ] Bỏ mục "Đã chốt, chưa vào dữ liệu" trong `CLAUDE.md` và dòng tương ứng ở `3d.md` mục 8

### ✅ A10 · Đổ trần ban công sau, tường trái lên mái — thay lam D12

Chủ nhà hỏi có nên đổ trần ban công sau không (11/9/2026). Tính ra đổ trần kèm xây tường trái ban
công lên tới mái **ngang lam đứng** về độ sáng (D12 thấy 54% trời, lam 53%), nắng hè (0.3 so với 0.1
kWh/ngày) và nắng đông (12.4 so với 12.5), **hơn hẳn** tháng 9 (6.2 so với 11.8), lại che mưa cho D12
và ban công. Chốt thay lam. `3d.md` mục 2a.

- [x] Trần ban công: bản mái đổ ra ngoài tường `y = 28`, `x` 0–5, tới tim tường rào sau (đua 1.89 m
      từ mặt tường) — khai ở `overhangs`, cùng loại với mái hiên cửa chính
- [x] Tường trái ban công (`x = 0`, `y` 28–30) xây lên hết chiều cao nhà để đỡ bản và chắn nắng Tây
      Tây Bắc — khai ở `fullHeightWalls`, ngoại lệ khai tay duy nhất cho luật "chiều cao tường suy
      từ phòng áp vào"; neo vào lưới như tường
- [x] `validate()` phép kiểm 14 soi thêm: tường nâng phải nằm trên một bức tường có thật
- [x] Rào ban công ↔ sân phơi và rào sau giữ 2.2 m — dải hở 1.55 m dưới trần là chỗ lấy sáng
- [x] Lớp chống nóng mái (A5) phủ luôn trần ban công
- [x] Bỏ phần lam khỏi A4

---

## B · Mô hình 3D

### ✅ B1 · Bỏ dropdown nơi xây

Chốt xong nơi xây thì dropdown ba thành phố chỉ còn là cái bẫy — quên đổi là đọc sai toàn bộ
phần nắng.

- [x] `lat` / `lon` / `place` vào `LOT` trong `lib/lot.js`
- [x] Bỏ `<select id="place">` khỏi `Plan3D.jsx` và phần xử lý trong `scene3d.js`
- [x] Bỏ luôn bảng `PLACES` trong `lib/sun.js` — `sunPosition()` vốn nhận `lat`/`lon` làm tham
      số nên muốn đối chiếu nơi khác vẫn làm được, không cần bảng nào

### 💤 B2 · Đi bộ: va chạm và cao độ mắt

`components/scene3d.js`, hàm `moveWalk()`: đi xuyên tường được, và cao độ mắt luôn tính từ cốt nền
nhà (`MUC.nen + 1.60`) nên bước ra sân thì lửng lơ 45 cm.

**Cố ý hoãn** — đủ dùng để soi tỉ lệ đứng, vốn là mục đích chính của mô hình. Chủ nhà xác nhận
giữ hoãn ngày 10/9/2026.

- [ ] Cao độ mắt tra theo phòng đang đứng (`lib/envelope.js` đã biết qua `floorOf()`)
- [ ] Chặn va chạm theo danh sách hộp tường

### 💤 B3 · Nội thất dạng khối trong 3D

Mới có khối tường, sàn, mái. Dữ liệu đã có sẵn ở `furn` của từng mặt bằng (2D đang vẽ), chỉ
thiếu chiều cao. **Cố ý hoãn** — làm nếu thấy cần cảm nhận tỉ lệ kỹ hơn. Xem `3d.md` mục 8.
Chủ nhà xác nhận giữ hoãn ngày 10/9/2026.

- [ ] Thêm chiều cao cho từng loại nội thất vào `HEIGHTS` trong `lib/lot.js`
- [ ] Dựng hộp trong `lib/massing.js`

### ✅ B4 · Tường bao dọc hành lang ngoài hạ về cao rào

`lib/massing.js` từng có bậc tường thứ ba, "tường hiên": tường nào chỉ áp vào hành lang ngoài
(R3) thì cao 2.80 m, bằng mái hiên. Thực tế chỉ có một đoạn — tường bao phải `x = 9.5`,
`y` 18–25 — và nó không cần cao thế: mái hiên đua 1 m ra từ tường bếp, không gác lên tường bao.

- [x] Bỏ bậc tường hiên, còn hai bậc: tường nhà và tường rào
- [x] Mái hiên giữ 2.80 m; giữa rào 2.20 m và mái hở 0.6 m
- [x] `npm run check:3d` sạch

---

## E · Cấu hình tuỳ chỉnh

Cho phép người xem sửa **mọi kích thước bên trong** và **hướng nhà** ngay trên trang, mặc định
lấy từ bản hiện hành. Mục đích: thử "nếu hành lang rộng 1.2 m thì sao", "nếu xoay nhà 15° thì
nắng đổi thế nào" mà không phải sửa mã.

**Lô đất giữ cố định 9.5 × 30 m** — `LOT.w` và `LOT.d` không nằm trong phạm vi sửa. Hướng nhà
thì có: đó là quay lô chứ không phải đổi kích thước lô.

### Quyết định phải chốt trước khi code

**Đã chốt.** Cấu hình tuỳ chỉnh sống trong `localStorage` của người xem, đặt tên được và mở
lại được (E3). `lib/versions/current.js` **vẫn là nguồn sự thật duy nhất** và `spec/` vẫn sinh
từ nó — trang là tĩnh, không có backend để ghi ngược.

Hệ quả phải nói rõ trên giao diện: chỉnh trong trình duyệt **không phải là đổi thiết kế thật**.
Nhãn luôn hiện đang xem cấu hình nào để không ai nhầm.

### ✅ E0 · Bỏ hằng số ghim trong `validate()`

**Chặn E2.** Ba phép kiểm đầu ghim số cứng `150`, `135`, `30`. Vì lô cố định nên `30` không sao
— nó chính là `LOT.d`, chỉ cần thay tên cho khỏi lặp số.

Hai số kia thì **có vấn đề**: `150 = 5.0 × 30` và `135 = 4.5 × 30` phụ thuộc vào **ranh cột
trái/phải ở `x = 5.0`**. Bức tường ấy là thứ người ta sẽ muốn thử dịch đầu tiên — nó quyết định
nhà rộng bao nhiêu so với sân bên hông. Dịch nó là hai phép kiểm đỏ ngay dù mặt bằng đúng.

Cách suy: **`ranh = max(x + w)` trên các phòng cột trái**, rồi

```
L = ranh × LOT.d          R = (LOT.w − ranh) × LOT.d
```

Đã nghiệm trên cả 12 phương án — khớp tuyệt đối.

> **Đừng dùng `dims.bottom[1]`.** Trông thì giống ranh cột nhưng không phải: v2 có
> `dims.bottom[1] = 2.4` trong khi ranh cột vẫn ở `5.0`. Suy từ `dims` là sai ngay ở bản thứ hai.

- [x] Suy `150` / `135` theo công thức trên, `30` lấy từ `LOT.d`
- [x] Sửa luôn chuỗi mô tả trong `CHECKS` cho khỏi ghim số
- [x] Chạy lại cả kho đối chiếu: v1…v11 giữ **nguyên số lỗi cũ** — giống hệt cả nội dung thông báo
- [x] Giả lập dịch ranh cột `5.0 → 5.5`: hai phép kiểm không còn đỏ (trước là 165 m² → đỏ ngay)

> Phép kiểm còn **mạnh nguyên**: nó chuyển từ "cột trái phải đúng 150 m²" sang "cột trái phải
> lấp kín đúng phần lô của mình" — hở hay chồng đều lộ, và `L + R = 285` vẫn suy ra được.

### ✅ E1 · Đổi hướng nhà được

Rẻ nhất nhóm, làm riêng được. Hướng **không đụng gì tới hình học** — chỉ đổi đường đi của nắng
và mũi tên bắc.

Hoá ra có **hai** chỗ ghi cứng hướng chứ không phải một: bảng ký hiệu trong `draw2d.js`, và cả
dòng phụ đầu trang 3D (`Plan3D.jsx`) — chỗ thứ hai chỉ lộ ra khi kéo thanh trượt rồi thấy tiêu
đề vẫn nói "Đông Bắc".

Giá trị nằm ở `localStorage` qua `frontAzimuth()` / `setFrontAzimuth()` trong `lib/lot.js`, chứ
không phải biến trong một trang — nếu để riêng thì 2D và 3D nói hai đằng ngay khi kéo. Chạy
trong node (gen-spec) không có `localStorage` nên hàm trả về giá trị gốc; hướng không đụng hình
học nên `validate()` và `spec/` không phụ thuộc nó.

- [x] Thanh trượt phương vị mặt tiền trên trang 3D, kèm nút về hướng thiết kế
- [x] `draw2d.js` đọc hướng thật qua `compassName()` thay vì chuỗi ghim cứng
- [x] Dòng phụ đầu trang 3D cũng đọc hướng thật
- [x] Mũi tên bắc xoay theo — tách thành `aimNorth()`, gọi lại mỗi lần đổi hướng
- [x] Kiểm: kéo sang 225° thì 3D đổi nắng, F5 vẫn giữ, và bảng ký hiệu 2D ghi
      "Tây Nam (phương vị 225°)"; bấm về hướng thiết kế thì cả hai trang về 45° · Đông Bắc

> Bản vẽ 2D **không xoay** theo — nó vẽ theo lô, hướng chỉ là thông tin kèm. Mũi tên "MẶT TIỀN"
> vẫn chỉ về cạnh `y = 0` như cũ, đúng như vậy.

> **E3 sẽ gom khoá này vào cấu hình đặt tên.** Giờ để riêng một khoá `myh.frontAzimuth` cho gọn.

### ✅ E2 · Advanced config — ranh phòng và cao độ

**Phạm vi: ranh giới phòng + cao độ + mái che sân phụ.** Cụ thể là vị trí các bức tường ngăn
(đường lưới), `HEIGHTS` và `CARPORT_ROOF` trong `lib/lot.js`.

Nằm **ngoài** phạm vi: `LOT.w` / `LOT.d` (lô cố định), bề dày tường, vị trí và chiều rộng từng
cửa / cửa sổ, kích thước giếng trời. Mô hình lưới không phủ mấy thứ đó — chúng cần ràng buộc
riêng cho từng loại (cửa phải nằm gọn trong đoạn tường, hai lỗ mở không được chồng nhau), là
một dự án khác. Cửa và cửa sổ vẫn **đi theo** tường khi tường dịch, chỉ là không sửa trực tiếp
được.

**Đã chốt: sửa có ràng buộc, lan truyền tự động.** Nới master lên thì phòng kề co lại tương
ứng, không để người dùng tự cân số rồi đọc lỗi. Bộ 13 phép kiểm vẫn chạy sau mỗi lần sửa,
nhưng đóng vai **lưới an toàn** chứ không phải cách chính để giữ bản vẽ đúng.

#### Mô hình: đường lưới, không phải chồng phòng

Cách nghĩ hiển nhiên — "cột trái là một chồng phòng, sửa cái này thì cái dưới co lại" — **sai**.
Đo thử trên bản hiện hành, dịch mép `y = 24` (mép trên master) kéo theo:

| Kéo theo | Cụ thể |
|---|---|
| 3 phòng đổi kích thước | L5 KHO, L6 WC CHUNG, **L9 HÀNH LANG** |
| 1 tường | `['h', 24.0, …]` |
| 2 cửa | D7, D8 |
| chuỗi `dims.left` | `… 22 24 28 …` phải tính lại |
| 5 món nội thất trong master | giường, 3 tủ, bàn làm việc |

Chỗ bất ngờ là **L9 HÀNH LANG**: nó chạy dọc `y 17→24`, tức vắt qua ba băng ngang, nên không
nằm gọn trong "chồng" nào. Mô hình chồng phòng không diễn tả được nó.

Mô hình đúng là **lưới toạ độ**: tập các đường `y` (và `x`), mỗi phòng khai hai mép của nó bám
vào đường nào. Dịch một đường → mọi thứ bám vào nó đi theo, phòng nào có hai mép ở hai đường
khác nhau thì tự co giãn. L9 vắt qua ba băng vẫn đúng vì nó chỉ bám vào đường `17` và `24`.

**Chỉ đụng liền kề, không lan xa hơn.** Dịch một đường thì **mọi phòng có mép bám vào đúng
đường đó** co giãn — có thể là ba bốn phòng chứ không phải hai, xem bảng trên: dịch `y = 24`
đụng cả KHO, WC CHUNG lẫn HÀNH LANG. Cái *không* xảy ra là dây chuyền: các đường khác đứng
yên, phòng không bám vào đường đang dịch thì không suy suyển. Nếu phòng kề bị ép xuống dưới kích thước tối thiểu thì
**không chặn thao tác, không đẩy tiếp** — con số của phòng đó **hiện đỏ** để người dùng thấy
mình vừa lấn quá và tự lùi lại.

Ví dụ của anh: master `4 → 6 m` là kéo đường `24` về `22`. Đường `22` đứng yên, nên băng
KHO / WC CHUNG bị ép từ 2 m xuống 0 — số của WC chung đỏ lên ngay tại đó.

#### Giữ nguyên định dạng dữ liệu

Lưới là mô hình **suy ra lúc nạp**, không phải định dạng lưu. `current.js` vẫn giữ toạ độ tuyệt
đối như hiện nay, nên `validate()`, `spec/`, `massing.js` không phải sửa gì.

- [x] **E2a · Dựng mô hình lưới + phép thử khứ hồi.** `lib/grid.js`, chạy bằng
      `npm run check:grid`. Cả 12 phương án dựng ngược khớp khít. Khảo sát trước đó cho thấy
      **mọi tường và mọi lỗ mở đều bám đúng đường lưới**, không ngoại lệ nào.
- [x] **E2b · Lan truyền tới phòng kề.** Hoá ra **không cần mã riêng**: mọi thứ đã neo vào lưới
      nên `withLine()` chỉ đổi một con số rồi dựng lại, phòng / tường / cửa / giếng trời / nội
      thất / `dims` / `areas` tự đi theo. Đúng luật: chỉ thứ bám vào đúng đường đó mới đổi.
- [x] **E2c · Kích thước tối thiểu.** `MIN_CLEAR` trong `lib/lot.js`, dùng để **tô đỏ**, không
      chặn. **Chủ nhà chốt giữ nguyên ngày 10/9/2026** — đặt bằng chỗ chật nhất mà chính thiết kế
      hiện tại đã chấp nhận rồi lùi xuống chút, để không tô đỏ oan: hành lang 0.84,
      WC khách 1.38, phòng thờ 1.90, ban công 1.78 → ngưỡng `circ 0.80 · wet 1.30 · room 1.80 ·
      yard 1.00`.
- [x] **E2d · Sidebar kéo thả — một thanh trượt cho mỗi bức tường**, ở trang bản vẽ 2D (chỗ
      nhìn thấy kích thước và kết quả 13 phép kiểm). 13 thanh: nhãn ghi tên các phòng hai bên,
      dưới là kích thước lọt lòng của từng phòng, **số nào hẹp hơn ngưỡng thì đỏ**.
- [x] **E2e · Thanh trượt cao độ**, ở trang 3D (chỗ nhìn thấy hệ quả). 8 thanh.
- [x] **E2f · Thanh trượt mái che sân phụ**, ở trang 3D. Đúng hai thanh — `length` và `height`;
      `x`, `w`, `fromY` suy từ phòng sân phụ. Thanh `length` hiện kèm số **hở bao nhiêu mét phía
      cổng** theo thời gian thực.
- [x] 13 phép kiểm chạy sau mỗi lần kéo, hiện lỗi ngay ở cột phải — lưới an toàn
- [x] Cấu hình dùng chung ở `lib/config.js` (`localStorage`), 2D và 3D đọc cùng một chỗ

> **Đường lưới kéo được: 13 trên 17.** Bốn cạnh lô cố định. Khoảng kéo của mỗi thanh là hai
> đường kề, chừa 0.1 m để hai đường không trùng nhau — trùng là phòng bẹp bằng 0 và mọi thứ dựa
> trên nó thành vô nghĩa. Đó là giữ hình học hợp lệ, không phải "chặn khi chật": chật thì vẫn
> kéo được, chỉ tô đỏ.

#### Mái che sân phụ: chỉ hai con số là tự do

`CARPORT_ROOF` có năm trường, nhưng đo trên bản hiện hành thì **ba trong số đó đang bám vào
sân phụ**, không phải số độc lập:

| Trường | Giá trị | Thực chất |
|---|---:|---|
| `x` | 0.0 | mép trái lô |
| `w` | 5.0 | **= bề rộng sân phụ** — bám ranh cột `x = 5.0` |
| `fromY` | 12.0 | **= mép sau sân phụ** — bám đường lưới `y = 12` |
| `length` | 5.5 | tự do |
| `height` | 2.80 | tự do |

Nên `x`, `w`, `fromY` phải **suy từ phòng sân phụ**, không cho kéo. Nếu để rời thì dịch tường
nhà ở `y = 12` sẽ làm mái che lơ lửng tách khỏi nhà — đúng kiểu lỗi không ai để ý cho tới lúc
nhìn 3D thấy sai.

Hai thanh trượt thật:

- **`length` — phủ dài bao nhiêu.** Kèm số **"hở bao nhiêu mét phía cổng"** đổi theo thời gian
  thực. Đây là đánh đổi chính của cả hạng mục (`3d.md` mục 3): phủ càng dài càng đỡ mưa nhưng
  càng bịt nguồn sáng Đông Bắc dịu nhất nhà qua cửa chính D1. Hiện phủ 5.5 / 12 m, hở 6.5 m.
- **`height` — cao bao nhiêu.** Trần trên là chiều cao tường nhà (`4.00 m`) vì nó gá vào đó.

> Nếu cho `w` kéo được để làm mái hẹp hơn sân phụ thì phải neo mép nào — trái, phải, hay giữa.
> Chưa cần; mặc định bằng đúng bề rộng sân phụ.

> **Liên đới với A2 — nay đã lỗi thời.** Chủ nhà chốt bỏ mái che xe, thay bằng mái bàn trà ở
> sân chính (A2). Hai thanh trượt của E2f đang chỉnh một mái không còn trong thiết kế; A4 quyết
> bỏ hay đổi chúng.

> **Nội thất là chỗ dễ vỡ — đã vấp đúng chỗ này.** Neo vào đường lưới gần nhất là sai, và sai
> lặng lẽ: chậu rửa ở `y = 24.3` nằm trong BẾP (gốc `y = 18`) lại bám đường `24` của master,
> còn bếp nấu ở `y = 21.9` bám đường `19` — hai món cùng một phòng neo vào hai đường khác nhau,
> dịch một đường là chúng trôi ra xa nhau và bếp báo "chậu rửa chồng bếp nấu" dù bếp không hề
> bị đụng tới. Phải neo vào **gốc phòng chứa nó**. Đã sửa; nay nới master thì giường master đi
> theo còn bếp đứng yên.

### ✅ E3 · Lưu cấu hình đặt tên

Cấu hình lưu vào `localStorage` **kèm tên người dùng tự đặt**, mở lại chọn được — để so
"phương án hành lang rộng" với "phương án master sâu" mà không phải kéo lại từ đầu.

- [x] Lưu cấu hình hiện tại kèm tên
- [x] Danh sách cấu hình đã lưu, chọn để xem, xoá được
- [x] Nhãn nói rõ đang xem cấu hình nào, hay là **bản tuỳ chỉnh chưa lưu** — so bằng nội dung
      chứ không phải cờ, nên sửa tiếp một chút là nhãn đổi ngay
- [x] Cả 2D và 3D cùng đọc một cấu hình — `components/savedConfigs.js` dựng một lần, gắn vào
      cả hai trang
- [x] Gom hướng mặt tiền vào cấu hình chung (E1 để tạm ở khoá riêng) — lưu một cấu hình là lưu
      luôn cả hướng

Mở một cấu hình lưu cho **mặt bằng khác** thì bỏ phần `lines` — chỉ số đường lưới không chuyển
được sang mặt bằng khác. Cao độ, mái che và hướng thì vẫn dùng được nên giữ.

> **`current.js` vẫn là nguồn sự thật.** Cấu hình trong `localStorage` chỉ nằm ở máy người xem;
> `spec/` vẫn sinh từ `current.js`. Chốt được phương án nào thì vẫn phải sửa tay vào
> `current.js` rồi `npm run spec` — đúng quy trình ở `CLAUDE.md`. Muốn đỡ chép tay thì thêm nút
> xuất ra đoạn mã đúng định dạng `current.js`, nhưng đó là việc phụ. **Chủ nhà chốt hoãn ngày
> 10/9/2026** — đợt A4 toàn khối mới mà thanh trượt không chạm tới, nút xuất không giúp gì.

> **Liên đới với B1.** B1 định bỏ dropdown nơi xây khi đã chốt vĩ độ. Nếu làm E2 trước thì nơi
> xây nên chuyển hẳn vào panel cấu hình chứ không nằm rời trên thanh công cụ — cân nhắc gộp.

---

## D · Hạ tầng

### ✅ D1 · Bộ kiểm tra cho hình học 3D

13 phép kiểm của `validate()` chỉ soi mặt bằng 2D. `lib/massing.js` cắt tường theo lỗ mở và
khoét mái theo giếng trời — đúng loại việc dễ sai lặng lẽ, vì thiếu một mảnh hay chồng hai
mảnh thì ảnh vẫn trông bình thường.

`scripts/check-3d.mjs`, chạy bằng `npm run check:3d`. Tám phép kiểm, cả 12 phương án qua sạch:

1. Mọi hộp có bề rộng, bề sâu và chiều cao dương
2. Không hộp nào thò ra ngoài lô quá nửa bề dày tường
3. Không hộp nào cao quá đỉnh mái nhà
4. Mảnh tường trên cùng một đường tim không chồng nhau
5. **Mỗi lỗ mở thật sự thủng** — chọc một điểm vào giữa lỗ, không mảnh tường nào được chứa nó
6. Diện tích mái bằng phòng kín trừ đúng phần giếng trời
7. Các mảnh mái không chồng lên nhau
8. Kính giếng trời nằm đúng cao độ trần

> **Phép kiểm 5 là cái đáng giá nhất.** Bảy phép còn lại ít nhiều tính lại theo cùng lối với
> `massing.js` nên có nguy cơ cùng sai một kiểu. Phép 5 thì không: nó chỉ hỏi một câu hình
> học — chọc một điểm vào giữa lỗ mở, có đụng tường không.

> **Bộ kiểm tra qua ngay lần đầu là chuyện đáng ngờ**, nên đã phá `massing.js` ba kiểu để xem
> nó có thật sự bắt được: bỏ khoét giếng trời (phép 6 báo `121.5 ≠ 112.66`), không cắt lỗ mở
> (phép 5 báo `D1 bị mảnh houseWall bịt`), nhân đôi mảnh mái (phép 6 và 7 cùng báo). Cả ba đều
> bị bắt.

### ✅ D2 · Gắn CI

`.github/workflows/ci.yml` chạy trên mọi push và pull request. `npm run check` chạy đúng bốn
lệnh ấy ở máy, cùng thứ tự.

- [x] `npm run build`
- [x] `npm run spec:check`
- [x] `npm run check:grid`
- [x] `npm run check:3d`

Thứ tự cố ý: build gãy thì ba lệnh sau chạy cũng vô nghĩa. Cả ba lệnh kiểm đều thoát khác 0
khi có lỗi — đã thử làm lệch một file `spec/` để xác nhận `spec:check` thoát `1`.
