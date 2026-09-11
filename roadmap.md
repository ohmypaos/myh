# Kế hoạch triển khai

Cập nhật 11/9/2026.

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
| A5 | Chống nóng mái — chốt **mái ngược XPS** (chống thấm + XPS 50 mm + vữa cán + gạch), **đã vào `current.js`** | ✅ xong | |
| A6 | Bếp — chốt **lợp tôn hai mái + trần tôn**, không đổ mái bê tông | ✅ xong | |
| A7 | Mái sân phơi — chốt **tôn dốc một mái**, chừa dải hở thẳng hàng ban công | ✅ xong | |
| A8 | WC khách 1.6 × 2 m, tường trong 100, W4 thành ô thoáng — **đã vào `current.js`** | ✅ xong | |
| A9 | Bậc tam cấp, mái hiên cửa chính, sàn bếp và WC khách hạ còn +0.15 — **đã vào `current.js`** | ✅ xong | |
| A10 | Đổ trần ban công sau, tường trái ban công lên mái — thay lam D12, **đã vào `current.js`** | ✅ xong | |
| A4 | Đưa mái bàn trà, mái tôn bếp, mái sân phơi vào `lib/versions/current.js` | ✅ xong | |
| A11 | Mái sân chính 4.5 × 6 m liền dải với mái hành lang và mái sân phơi, máng xối trong 3D | ✅ xong | |
| A12 | Tường rào 1.80 m, xây đặc 0.80 m + lan can song thoáng; tường D13 lên trần; cổng chính 3.6 m | ✅ xong | |
| A13 | WC khách: trần giả 2.70 m, ô thoáng W4 nâng lên 2.00–2.40 | ✅ xong | |
| A14 | Cột và dầm đỡ mái nhẹ — 5 cột thép hộp trên tường rào phải, nhịp ≤ 3.5 m, dầm biên suy ra | ✅ xong | |
| A15 | Bỏ bàn ăn trong bếp — ăn trên chiếu trải sàn | ✅ xong | |
| A16 | WC chung 1.6 × 2.0 m cửa cánh mở vào, gioăng kín mùi; kho cũ thành phòng thay đồ/kho Master 2.4 × 2.0 m | ✅ xong | Hai tủ cao 2.0 m chữ L; vách nhựa kín trần, cửa cánh 0.80 m mở về Master; bỏ tủ âm PN1 |
| A17 | Vách ngăn nội bộ phòng thờ, phòng ngủ, hành lang và WC chung là vách nhựa tới trần | ✅ xong | Không chịu lực; tường bao và vách tiếp xúc sân/mưa vẫn xây |
| A18 | Sân giếng sát tường bếp; bố trí lại cụm máy | ✅ xong | Ba vòi nước ở sân giếng; mái và cột giữ nguyên |
| A19 | Gộp mái hành lang ngoài vào mái bếp — một mái hai dốc 30% trên `x` 5–9.5 | ✅ xong | |
| A20 | Cầu thang chữ U lên mái thay phòng thờ, tum xây, lan can mái; bỏ SK1–SK4 — chuẩn bị tầng 2 | ✅ xong | |
| A21 | Việc tồn sau A20: neo thang / tum / lan can mái vào lưới, tay vịn khe giữa hai vế, XPS lát rời | ⬜ chưa làm | XPS lát rời chờ chủ nhà quyết |
| **Mô hình 3D** ||||
| B1 | Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT` | ✅ xong | |
| B2 | Đi bộ: va chạm và cao độ mắt theo sàn đang đứng | ✅ xong | |
| B3 | Nội thất dạng khối và cánh cửa đi trong 3D | ✅ xong | |
| B4 | Tường bao dọc hành lang ngoài hạ về cao rào | ✅ xong | |
| B5 | Góc tường vuông, hết mái nhấp nháy | ✅ xong | |
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
"Đổi thiết kế": 15 phép kiểm phải sạch, rồi `npm run spec`.

A1–A3, A5–A7 là **quyết định**, chủ nhà chốt hết ngày 10/9/2026. Số liệu và lý do nằm ở
`3d.md` mục 2a, 2c, 3, 3a, 3b — ở đây chỉ ghi kết quả. A3 không đổi hình khối; A5 lúc chốt cũng
tưởng là không, tới 11/9/2026 chốt cụ thể lớp XPS thì mặt mái lên 0.11 m và đã dựng. A4 gồm
ba thứ: mái bàn trà (A2), mái tôn bếp (A6), mái sân phơi (A7) — đã làm xong. Che nắng D12 (A1)
đổi từ lam sang đổ trần ban công — toàn hộp nên đã làm luôn ở A10.

**Cả nhóm A đã vào dữ liệu.** Không còn việc nào ở đây chờ chuyển từ quyết định sang `current.js`.

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
- [x] Vào `current.js` — A4, mã `RF1`

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
nóng). Không làm mái tôn thông gió phía trên vì phải khoét theo SK1–SK4. `3d.md` mục 2c.

- [x] Chủ nhà chốt
- [x] **Chốt cụ thể (11/9/2026): mái ngược XPS** — chống thấm → XPS 50 mm → vải địa kỹ thuật → vữa cán
      40 mm lưới thép, khe co giãn ≤ 3 m → gạch lát. So với mái tôn sát trần (khe gió không lùa, hiệu quả
      chỉ ngang lát) và gạch lỗ (trữ nhiệt nhả vào tối) — bảng so ở `3d.md` mục 2c
- [x] `ROOF_INSULATION` trong `lib/lot.js`; khai `roofInsulation:{overhangs:[['h',28.0]]}` trong `current.js` —
      mọi bản mái bê tông phủ phòng kín (nhà chính, WC khách) tự có lớp, trần ban công sau khai thêm; mái hiên
      cửa chính lúc đầu chừa, chủ nhà chốt phủ luôn — `overhangs:[['h',12.0], ['h',28.0]]`. `roofInsulationOf()` trong `lib/envelope.js`, `validate()` báo khai mái đổ ra ngoài không có thật
- [x] `lib/massing.js` dựng khối `roofInsulation` cốt 4.00–4.11: bản mái theo tim + trần ban công + mọi đỉnh tường
      nhà ở cốt mái, chừa giếng trời và chân đầu hồi bếp — 65 mảnh, 95.31 m² (kể cả mái hiên); 3D tô màu gạch, "Ẩn mái" giấu cùng;
      `specMarkdown()` in bảng cấu tạo
- [x] `check-3d` thêm **phép kiểm 20**: đúng cốt và bề dày, phủ kín bản mái được phủ, ra tới mặt ngoài tường, không
      lát ra ngoài bản đỡ, không phủ giếng trời
- [x] Phá thử: bỏ khoét giếng trời → phép 20 báo lát không có bản đỡ; bỏ trừ đầu hồi → phép 10 báo chồng tường; dừng
      lớp ở tim tường → phép 20 báo đỉnh tường để trần; lát mái đổ ra ngoài không khai (thử trên mái hiên cửa chính,
      lúc chưa khai) → phép 20 báo không có bản đỡ
- [x] Mái hiên cửa chính **không cần cột** — công xôn 1.2 m, dày 0.25, lớp chống nóng thêm ~1.3 kN/m²; thép chịu lực
      ở lớp trên neo vào bản mái nhà, kỹ sư kết cấu chốt. Tính sơ bộ ở `3d.md` mục 3c. Trần ban công gác hai tường bên, không phải công xôn
- [x] Bản bê tông tô theo mặt trong 3D: mặt dưới màu trần, cạnh màu tường, mặt trên bê tông — trần hiên, trần ban công
      cùng màu trần trong nhà (chủ nhà thấy lệch màu)

> **Vấp ở phép 20:** bản đầu chỉ lấy mẫu bên trong bản mái nên dừng lớp ở tim tường vẫn sạch. Thêm vòng mẫu ngay
> ngoài mép thì lộ luôn một chỗ hở thật ở bản dựng: góc hai tường nâng bên ban công kéo tới mặt ngoài rào sau
> (`z` 30.00–30.11) mà trần ban công chỉ đổ tới tim. Đổi vùng phủ từ "mở phòng ra nửa bề dày tường" sang "cộng mọi
> đỉnh tường nhà ở cốt mái".
- [x] Cảnh báo thi công vào `warn`: chống thấm dưới XPS, không bitum nóng / sơn gốc dầu, không để tấm phơi nắng,
      không nhầm EPS, khe co giãn, gờ quanh giếng trời
- [x] `lib/grid.js` neo vị trí mái đổ ra ngoài trong `roofInsulation` vào đường lưới như mái hiên — thử kéo `y = 28`
      sang 27.6: tham chiếu thành 27.6, trần ban công vẫn có lớp. Không neo thì tham chiếu đứng lại, `validate()` báo
      và trần ban công mất lớp
- [ ] Không vẽ lên bản 2D — lớp phủ gần hết nửa trái bản vẽ, chỉ thêm rối; thông tin nằm ở đặc tả

### ✅ A6 · Bếp lợp tôn hai mái + trần tôn

Bếp **không đổ mái bê tông** như nhà chính. **Chốt:** nóc chạy ngang ở `y = 21.5`, hai mái đổ về
sân chính và sân phơi, dốc 30%; trần tôn chống nóng cốt 3.75 m (sàn bếp hạ còn +0.15 ở A9 nên cách sàn 3.60 m), đỉnh
nóc cốt 4.80 m — nhô 0.80 m trên mái nhà chính. Máng xối mép bắc bếp, mái bàn trà gá thấp bên
dưới. `3d.md` mục 3a.

- [x] Chủ nhà chốt hướng nóc, cao trần, độ dốc, chỗ nối với mái bàn trà
- [x] Vào `current.js` — A4, mã `RF2`

### ✅ A7 · Mái sân phơi / giặt

**Chốt:** phủ `x` 5–9.5, `y` 25–28, chừa hở dải `x` 5–7.5, `y` 28–30 thẳng hàng ban công chạy tới
WC khách. Tôn cách nhiệt, dốc một mái 3.50 m sát bếp → 3.00 m ở mép `y = 28`, gá dưới máng mép
nam mái bếp. Đoạn mép thấp `x` 7.5–9.5 áp tường WC khách, cần viền chống thấm. `3d.md` mục 3b.

Cái giá: bếp bị mái che ba phía, các cửa bếp còn ~55% trời (D10 còn 37%). Mái bàn trà được xem
lại cùng lúc và giữ tôn.

- [x] Tính phần trời các cửa bếp còn nhìn thấy
- [x] Chủ nhà chốt vùng phủ, dạng mái, vật liệu
- [x] Vào `current.js` — A4, mã `RF3`

### ✅ A8 · WC khách, ô thoáng W4

Thay đổi thuần mặt bằng, không cần loại khối mới, nên **sửa thẳng vào `current.js`** chứ không
chờ A4.

- [x] WC khách chốt **1.6 × 2.0 m** tim tường, áp tường phải và sau: `x` 7.9–9.5. Dải hở sân
      phơi (A7) thành 2.9 × 2.0 m
- [x] Hai tường trong (bắc, tây) 220 → **100 mm** vì phòng nhỏ; hai tường ranh lô giữ 220
- [x] Trần giữ 3.30 m — đã tính hạ xuống 2.60 rồi bỏ (A13 sau đó làm trần giả 2.70)
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

### ✅ A4 · Đưa ba mái mới vào `lib/versions/current.js`

Ba mái là **một loại khai chung** — `roofs` trong mặt bằng, mỗi mái một object: vùng phủ theo tim
tường, dạng (`flat` · `mono:y` · `gable:y`) và cao độ **mặt dưới**. Độ dốc suy từ cao độ và nhịp
chứ không khai tay: bếp 3.75 → 4.80 trên nửa nhịp 3.5 m ra đúng 30% đã chốt. Bề dày tấm lợp và
tấm trần ở `ROOF` trong `lib/lot.js`.

**Mái sân phơi** — `RF3`

- [x] Khai trong `current.js`: `x` 5–9.5, `y` 25–28, `mono:y` 3.50 → 3.00, tôn
- [x] Dựng bằng loại khối mặt dốc dùng chung với mái bếp
- [x] Vẽ lên bản 2D, kèm mũi tên chỉ chiều nước chảy
- [x] `check-3d` phép kiểm 12 soi cả hai: mái nào cũng phải gá thấp hẳn dưới mái kề nó, và không
      mái nào hạ xuống dưới đầu lỗ mở nó phủ (D11 ở đây)

**Mái tôn bếp** — `RF2`

- [x] Khai `gable:y` 3.75 → 4.80, nóc ở giữa nhịp (`y` 21.5), kèm `ceiling: 3.75`. Kho đối chiếu
      v1…v11 không có khoá `roofs` nên giữ mái bằng như cũ
- [x] `lib/massing.js`: bỏ bản mái bê tông trên R2, thay bằng trần tôn; hai mặt dốc và hai đầu hồi
      dựng bằng loại khối mới
- [x] **Đỉnh tường suy ra, không khai**: bức nào chỉ đỡ phòng lợp mái nhẹ thì bám mặt dưới mái —
      tường bắc và nam bếp tự dừng ở mép mái, tường đông tự thành đầu hồi nghiêng, tường tây giữ
      4.00 (còn đỡ phòng đổ bê tông) rồi nhô thêm tam giác bên trên
- [x] `components/scene3d.js` dựng lăng trụ mặt nghiêng bằng `BufferGeometry` không chỉ mục
- [x] `scripts/check-3d.mjs`: phép kiểm 3 lấy mốc đỉnh thiết kế thay cho đỉnh mái nhà, phép kiểm 6
      tính cả trần tôn, phép kiểm 10 đo độ đâm sâu khi có mặt nghiêng, thêm phép kiểm 12

**Mái bàn trà** — `RF1`, thay `CARPORT_ROOF`

- [x] Khai `flat` 3.20, `x` 5.0–8.5, `y` 15.0–18.0, tôn
- [x] Neo vào lưới (`lib/grid.js`): mép nào trùng đường lưới thì bám đường, mép `y = 15` không có
      đường nào thì **giữ bề phủ** so với mép kia — dịch tường bếp là cả mái đi theo, vẫn phủ 3 m,
      không bị kéo dãn
- [x] **Không thêm thanh trượt.** Hai thanh của E2f chỉnh mái che xe đã gỡ ở A9; mái nhẹ nay bám
      lưới nên kéo tường là chỉnh được vùng phủ, thanh riêng chỉ thêm chỗ để lệch
- [x] Dời bàn tròn từ `(6.4, 11.6)` vào `(6.35, 15.6)` — lọt trong mái, tránh bậc D2 và vùng quét
      cánh D2, D9; ghế vẫn chừa lối đi thẳng từ D9 ra

**Chung**

- [x] `specMarkdown()` in bảng mái nhẹ, kèm cả vùng khai lẫn tấm mái thật để thấy phần lùi / đua
- [x] Sơn chống nóng tường trái (A3) và lớp chống nóng mái (A5) vào `warn`
- [x] Cập nhật `note`, `changes`, `label`, `date`
- [x] `validate()` thêm **phép kiểm 15** (mái nhẹ khai đủ, không chồng nhau, trùm phòng kín thì
      trùm trọn và có cốt trần) — sạch 15/15
- [x] `npm run check` sạch, `npm run spec`, cập nhật `floor-plan.md`
- [x] Bỏ mục "Đã chốt, chưa vào dữ liệu" trong `CLAUDE.md`, cập nhật `3d.md` mục 3, 3a, 3b, 4, 5, 8

> **Mép mái không nằm ở tim tường.** Khai vùng phủ theo tim tường cho dễ đọc và dễ neo lưới, nhưng
> tấm mái thật phải **lùi vào mặt trong** bức tường nào cao hơn nó và **đua ra mặt ngoài** bức nào
> thấp hơn. Bỏ qua chuyện này là hỏng theo kiểu khó thấy: để mái dừng ở tim tường thì trần tôn —
> vốn bắt vào mặt trong tường — nhô cao hơn mặt dưới mái ở sát mép, hai khối cắm vào nhau; để mái
> đua ra qua bức tường cao hơn thì mái cắm thẳng vào tường nhà chính. Cả hai chỉ lộ khi xoay mô
> hình. Đã gặp đúng cả hai khi dựng, phép kiểm 10 bắt được sau khi dạy nó đo mặt nghiêng.

> **Hệ quả về số:** mép mái bếp ở tim tường là 3.75 nhưng mép tấm mái thật (đua ra mặt ngoài
> tường) hạ còn 3.72, và nóc cao 4.85 tính cả bề dày tôn — "nhô 0.80 m trên mái nhà chính" trong
> `3d.md` là đo ở mặt dưới, cộng tấm lợp thì 0.85.

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

### ✅ A11 · Mái sân chính liền dải, máng xối

Chủ nhà muốn (11/9/2026) mái hành lang ngoài liền mạch với mái sân phơi và mái sân chính, mái sân
chính rộng hết 4.5 m lô phụ và chạy hết chiều dài nhà chính, và thấy được máng nước trong 3D. Số
liệu, lý do, cái giá: `3d.md` mục 3.

- [x] `RF1` đổi thành **mái sân chính** `x` 5–9.5, `y` 12–18, dốc 10% ra phía cổng, mặt dưới 3.50 → 2.90
- [x] Mái hành lang ngoài vào `roofs` thành `RF4`, tôn hai mái 3.50 → nóc 3.85 — hai đầu cùng cốt
      3.50 với mép cao mái sân chính và mái sân phơi. Tấm phẳng `alleyRoof` 2.80 chỉ còn dựng cho kho
      đối chiếu; thanh trượt `alley` giấu khi mặt bằng có mái nhẹ trùm R3
- [x] `roofOver()` chỉ nhận **phòng kín** (`roofCovering()` cho mọi phòng): mái trùm hành lang hở
      không đội tường rào lên, không đòi cốt trần
- [x] `roofPanels()` cắt tấm ở đầu tường trên mép mái (tính cả phần kéo góc), lùi / đua theo từng
      đoạn — mái sân chính qua khỏi góc bếp chạy thẳng tới mái hành lang, không hở khe 0.11 m
- [x] `gutters()` suy máng ở mép thấp, trừ đoạn nối phẳng; `massing.js` dựng hộp `gutter`, 3D tô màu
      và "Ẩn mái" giấu cùng; 2D vẽ dải máng và gộp tấm mái theo phía nóc; `specMarkdown()` in bảng máng
- [x] `check-3d` phép kiểm 12 viết lại: soi từng điểm dọc mép chung, cho nối phẳng hoặc gá thấp hẳn;
      thêm **phép kiểm 13** — mép thấp nào không chảy sang mái khác cũng có máng
- [x] Phá thử: nâng RF4 lệch 2 cm ở chỗ nối → phép 12 báo cả RF1 lẫn RF3 (phép 10 báo luôn máng
      đâm mái); bỏ một máng → phép 13 báo đúng mép `y = 12`
- [x] Tính lại phần trời và nắng phòng khách, ghi vào `warn` và `3d.md` mục 3
- [x] `npm run check` sạch, `npm run spec`

**Chủ nhà chỉnh tiếp (11/9/2026)** sau khi xem bản đầu:

- [x] **Mái bếp không máng** — khai `eave: 0.20` trong `roofs`, `roofPanels()` đua mép thấp thêm chừng
      đó; `gutters()` bỏ máng ở đoạn ngay bên dưới có mái thấp hơn đỡ nước
- [x] **Mái sân phơi gãy khúc ở thẳng tường bếp** — dốc 17% gặp mái hành lang 10%. Đổi mái sân phơi
      sang 10% (3.50 → 3.20), cả dải cùng một độ dốc
- [x] **Ống xả** — `downpipes()` suy từ dải máng, ống ở đầu sát tường bao, cắm xuống dưới cốt sân vào
      ống ngầm; dựng 3D (`downpipe`), chấm trên 2D, bảng trong đặc tả. Máng dưới mép tự do nay treo
      giữa mép thay vì ngoài mép, để hai đoạn máng mái sân phơi nối đầu nhau được
- [x] `check-3d` phép 12 soi thêm mái chồng nhau trên mặt bằng; phép 13 nhận nước rơi xuống mái
      thấp hơn và đòi mỗi dải máng có ống xả
- [x] Phá thử: mái bếp đua 1.5 m cắm xuống mái sân chính → phép 12 báo; bỏ ống xả → phép 13 báo

> **Cái giá lớn nhất: phòng khách.** W1 còn 27% phần trời (mái bàn trà 92%), D2 26% (54%); nắng
> trực tiếp lên W1 + D2 ngày đông chí còn 18% so với không mái (mái bàn trà 70%). Ngày 10/9 chính
> chỗ này là lý do chọn mái sát góc thay mái dọc tường nhà chính.

### ✅ A12 · Tường rào thấp, lan can thoáng

Chủ nhà muốn (11/9/2026) hạ tường rào, kết hợp lan can thoáng để lấy sáng thay cho tường cao kín.
Đầu tiên nói xây 1 m; hỏi lại chiều cao thường dùng rồi chốt **đỉnh rào 1.80, xây đặc 0.80**. Số nắng:
`3d.md` mục 2a.

- [x] `HEIGHTS.fenceSolid` (mặc định `null` = xây kín) và `RAILING` trong `lib/lot.js`; bản hiện hành
      khai `heights:{fence:1.80, fenceSolid:0.80}` — kho đối chiếu giữ rào kín 2.20
- [x] `lib/massing.js`: tường rào chỉ xây tới `fenceSolid`, lan can dựng từng thanh (trụ, tay vịn, song),
      chừa trống trên cổng và cửa; `resolveOverlaps()` cắt lan can đâm vào tường nhà và chỗ hai tuyến
      gặp nhau ở góc
- [x] Thanh trượt cao độ 3D thêm "phần xây đặc", và nay lấy giá trị đầu từ `heightsOf(plan)` — trước
      lấy thẳng `HEIGHTS` nên bỏ qua cao độ khai trong mặt bằng
- [x] `specMarkdown()` ghi cấu tạo tường rào ở mục Tường
- [x] `check-3d` phép 5 soi cả bề ngang cổng và cửa, không thanh lan can nào chắn lối; thêm **phép kiểm
      14** (phần xây không vượt cốt xây đặc, lan can nằm gọn và trên tuyến tường có thật)
- [x] Tính lại nắng lên D12: hè không đổi, tháng 9 6.9 → 8.7, đông 13.1 → 16.2 kWh/ngày
- [x] Phá thử: dựng lan can suốt qua cổng và cửa → phép 5 báo

**Chủ nhà chỉnh tiếp (11/9/2026):**

- [x] Tường phải ban công (`x = 5`, `y` 28–30, có cửa D13) không làm rào mà xây tới trần — thêm vào
      `fullHeightWalls`. Nắng đông chí lên D12 vì vậy 17.8 → 16.2, vẫn hơn rào kín cũ (13.1)
- [x] Cổng chính 2.4 → **3.6 m** (`x` 0.7–4.3), tâm vẫn thẳng cửa chính — ô tô vào thoải mái
- [x] Rào không được che cổng: mô hình vốn đã chừa trống, phép 5 xác nhận. Chủ nhà thấy lan can chắn
      cổng đúng lúc đang phá thử phép 5 trên dev server

> **Vấp ở phép 5:** bản đầu chỉ chọc thêm một điểm giữa lối đi, và phá thử thì nó vẫn sạch — điểm
> rơi đúng khe giữa hai song, ở cao độ trùng mép dưới tay vịn. Đổi sang soi cả bề ngang lối đi.

> **Lộ tầm nhìn.** Rào thoáng từ 0.80 m trở lên nên từ ngõ và nhà bên nhìn thấy sân và ban công. Rào
> mặt tiền quay ra đường thường còn chịu quy định địa phương về phần xây đặc — nên hỏi trước khi xin
> phép xây.

### ✅ A13 · Trần WC khách, ô thoáng W4

Chủ nhà thấy (11/9/2026) ô thoáng WC khách hơi thấp và trần quá cao cho một WC. Trần thật ra cách sàn
WC **3.60 m** chứ không phải 3.30: sàn WC hạ còn +0.15 ở A9 mà bản mái giữ cốt.

- [x] **Trần giả 2.70 m** tính từ sàn WC — khai `dropCeilings:{R5:2.70}`. Bản mái và tường WC giữ nguyên:
      hạ cả khối thì mép thấp mái sân phơi (3.20, áp tường bắc WC) mất chỗ tựa, máng sát tường hỏng
- [x] W4 bệ 1.90 → **2.00**, mép trên 2.30 → **2.40** — còn cách trần 0.30 m
- [x] `dropCeilingsOf()` trong `lib/envelope.js`; `massing.js` dựng tấm `dropCeiling` phủ lọt lòng, 3D
      "Ẩn mái" giấu cùng; `validate()` báo khai sai phòng; `specMarkdown()` in mục Trần giả
- [x] `check-3d` thêm **phép kiểm 15**: tấm đúng cốt, dưới bản mái, cao hơn đầu mọi cửa trên tường phòng
- [x] Phá thử: hạ trần giả xuống 2.20 → phép 15 báo đầu W4 cao hơn trần

### ✅ A14 · Cột đỡ mái nhẹ

`3d.md` mục 8 ghi từ lúc dựng mái sân chính: mái phụ lơ lửng, chưa có cột. Dò trên khối đã dựng (11/9/2026):
mái bếp tựa tường suốt bốn mép; còn **suốt tuyến tường rào phải `x = 9.5`, `y` 12–28** — mép đông của mái
sân chính, mái hành lang, mái sân phơi — không có gì đỡ, vì rào chỉ xây đặc 0.80 mà mái ở 2.90–3.85. Hai mép
tự do khác nằm giữa hai tường (mép trước mái sân chính 4.5 m, mép dải hở mái sân phơi 2.5 m), dầm vượt được.

**Chủ nhà chốt:** 5 cột, nhịp ≤ 3.5 m (`y` 12, 15, 18, 21.5, 25 — đầu `y = 28` có tường WC khách), **thép hộp
100 × 100** đặt trên tim tường rào. Không lấn hành lang ngoài (lọt lòng 0.84 m, ngưỡng 0.80), không vướng bàn
trà. Phương án 3 cột ở chỗ nối mái bị bỏ: nhịp 6–7 m phải thép I hoặc giàn.

- [x] Vị trí khai ở `posts` trong `current.js`; tiết diện và nhịp tối đa ở `POST` trong `lib/lot.js`
- [x] Chiều cao **suy ra** (`postsOf()` trong `lib/envelope.js`): ban đầu tới mặt dưới tấm mái hoặc đáy máng;
      có dầm (dưới đây) thì tới đáy dầm
- [x] `lib/massing.js` dựng khối `post`; gỡ chồng như tường nên phần rào xây và lan can nhường chỗ cho cột
- [x] Neo vào lưới như lỗ mở: cột trên đường lưới bám đường, cột giữa nhịp đi theo đường phía trên nó
- [x] Vẽ 2D (ô đặc kèm mã), bảng trong đặc tả, màu thép trong 3D
- [x] `validate()` phép 15 soi thêm: cột trong lô, dưới một mái nhẹ, không trùng mã, không đứng giữa nội thất
- [x] `check-3d` thêm **phép kiểm 18**: mỗi cột đúng chỗ, chân chạm sân, đỉnh chạm mái / máng; và soi **kết
      cấu** — dọc mọi mép mái nhẹ, hai chỗ đỡ liền nhau (tường cao tới mái hoặc cột) không xa quá 4.5 m, đầu
      mép không hẫng quá 0.3 m. Lấy cột từ khối đã dựng, không từ `posts`
- [x] Phá thử: bỏ C2 → phép 18 báo nhịp 5.9 m; C2 dời ra ngoài mái → `validate()` và phép 18 báo; đỉnh cột thò
      lên 10 cm → phép 18 và phép 10 báo; đỉnh hụt 10 cm → phép 18 báo cả 5 cột (phép 10 không thấy được hở)
- [x] **Dầm biên** (chủ nhà yêu cầu 11/9/2026 "cho thực tế") — thép hộp 50 × 100 (`BEAM`), **suy ra** ở
      `beamsOf()`: dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái, đi qua đầu cột; mặt trên chạm mặt
      dưới mái (dầm dọc tường rào nghiêng theo mái, cắt ở nóc mái hành lang), cột hạ xuống đáy dầm
- [x] Mép có máng tự do: dầm lùi vào sau máng. Máng dừng ở mặt dầm dọc tường bao và ở mặt cột góc — `gutters()`
      cắt đầu máng; `beamLines()` tách riêng để gutters() dùng mà không vòng lặp
- [x] Dựng 3D (lăng trụ khi nghiêng, "Ẩn mái" giấu cùng), vẽ 2D, bảng trong đặc tả
- [x] Phép 18 thêm: đoạn mép không tựa tường phải có dầm; dầm chạm mái hoặc máng; hai đầu dầm gối lên tường,
      cột hay dầm khác. Phép 13 cho qua mươi phân tôn đua qua dầm ra trên đỉnh tường bao (không có máng)
- [x] Phá thử dầm: bỏ hết dầm ngang → phép 18 báo đủ 5 đoạn mép không có dầm; hạ mặt trên dầm 5 cm → phép 18
      báo dầm không chạm mái; bỏ cắt máng ở mặt cột → phép 18 báo đầu dầm không gối lên cột góc
- [x] **Xà gồ mái sân chính** — `RF1.purlins:true` suy ra 4 thanh thép hộp 40 × 80 ở `y` 13.20,
      14.40, 15.60, 16.80 (bước 1.20 m), chạy vuông góc dốc từ tường phòng khách tới mặt dầm dọc
      tường rào; nhịp thực 4.365 m. Dựng 2D/3D, in đặc tả; phép 19 soi cốt chạm tôn, gối hai đầu,
      nhịp và bước. Tiết diện thi công vẫn cần kỹ sư kết cấu chốt theo tải thực.

> **Vấp ở dầm:** bản đầu cho dầm dọc tường rào nội suy thẳng hai đầu nên nằm phẳng 3.50 dưới nóc 3.85 của mái
> hành lang — cột giữa ra 3.40 thay vì 3.745. Rồi máng chạy xuyên qua tuyến dầm ở góc WC khách làm dầm gãy bậc,
> rồi máng chồm 2.5 cm lên đầu cột góc làm cột hạ dưới đáy dầm. Phép 18 bắt cả hai lỗi sau (đầu dầm không gối).

### ✅ A15 · Bỏ bàn ăn trong bếp

Chủ nhà (11/9/2026): nhà thường ăn trên chiếu trải sàn, không dùng bàn. Bỏ `dine` khỏi `furn`, `floor-plan.md`
sửa dòng bếp. Tên phòng giữ "BẾP + NHÀ ĂN".

> **`POST.maxSpan` là 4.5 chứ không 3.5.** Nhịp 3.5 m chủ nhà chốt là dọc tường rào; mép trước mái sân chính
> từ tường phòng khách tới cột góc đã 4.35 m và không đặt cột giữa được (vướng ghế bàn trà, giữa sân). Phép
> kiểm lấy ngưỡng dầm thép hộp nhẹ vượt được, 4.5 m.

### ✅ A18 · Sân giếng sát tường bếp

- [x] Dành sân giếng `4.5 × 1.5 m` (`y = 25.0–26.5`) ngay ngoài D10; đặt hai vòi âm tường giãn nhau trên cạnh nhà chính.
- [x] Chỉ giữ một máy giặt/sấy sau bếp, tại góc vuông giữa tường bếp và tường nhà chính, kê trên bệ sân nâng 0.15 m; bỏ máy rửa bát.
- [x] Giữ nguyên RF3, hệ máng xối và năm cột đỡ hiện hữu; `check-3d` qua đủ phép kết cấu.

---

### ✅ A19 · Gộp mái hành lang ngoài vào mái bếp

Chủ nhà hỏi (11/9/2026) có nên gộp mái bếp với mái che hành lang; bảo thử. Lý do chính: bỏ đường áp mái
hành lang thấp (3.50–3.85) vào đầu hồi bếp dài 7 m. Cái giá: mưa tạt vào hành lang, cột C4 ~4.7 m. `3d.md`
mục 3, 3a.

- [x] `RF2` phủ `x` 5–9.5, bỏ `RF4`; trần tôn vẫn chỉ trong bếp (R3 hở)
- [x] `beamLines()`: hai mái chung đường mép mà **lệch cao độ** thì mỗi mái một dầm, nằm hẳn về phía mái
      mình — trước đó chỉ giữ dầm của mái đầu tiên, mép mái bếp hẫng 0.95 m (phép 18 báo)
- [x] C3, C5 lùi 5 cm vào hẳn dưới mái bếp (`y` 18.05, 24.95) để lên tới dầm mái bếp — đứng giữa ranh thì đỉnh
      cột dừng ở đáy dầm mái thấp, đầu dầm mái bếp không gối vào đâu (phép 18 báo)
- [x] `roofPanels()` kéo các mảnh đua cùng một mép thẳng hàng — trước gãy bậc 0.11 m ở `x = 8.55`
- [x] Phần trời lỗ bếp: W2, D9, D10 không đổi, W3 nhích lên (3d.md mục 3)
- [x] `note`, `changes`, `warn`, `npm run spec`, `npm run check` sạch
- [x] Chủ nhà chốt, commit

### ✅ A20 · Cầu thang lên mái, tum, lan can mái

Chủ nhà thấy (11/9/2026) nhiều ô cửa trên trần không hợp khi sau này làm tầng 2. Hỏi ra: **tầng 2 sau khoảng 5 năm,
chỉ trên nhà chính**; gia đình chỉ thờ thổ địa thần tài. Chốt: làm thang lên mái ngay ở chỗ phòng thờ cũ, tum khung
thép lợp tôn, lan can thép quanh mép mái, bỏ hết SK1–SK3; bỏ vách phòng khách – phòng thờ (chủ nhà đề xuất), giữ
bức lửng 1 m. Số liệu, lý do, cái giá: `3d.md` mục 3d.

- [x] `current.js`: phòng khách 5 × 4.85, `L3` thành CẦU THANG, hành lang từ `y` 16.85; tường `'low'`; cửa D4 mở
      thông; W5 ô kính mờ PN1; kệ tivi 2.5 m + kệ thần tài; `stairs`, `tum`, `roofRailings`
- [x] `lib/lot.js`: `STAIR`, `TUM`, `ROOF_RAILING`, `FURNITURE.shrine`
- [x] `lib/envelope.js`: `stairsOf()`, `tumOf()`, `roofRailingsOf()`, `roofHoles()`, `roofWalkTop()`
- [x] `lib/massing.js`: bức lửng, bậc răng cưa, lan can thang (có lăng trụ nghiêng), tum, lan can mái; khoét lỗ thang
      khỏi bản mái và lớp chống nóng
- [x] `validate()` **phép 16**; `check-3d` phép 3, 6, 20 tính lỗ thang và tum, thêm **phép 21** (đi bộ lên mái và xuống)
- [x] 2D: bậc, chiếu nghỉ, đường LÊN, tum, lan can mái, bức lửng, kệ thần tài; 3D: màu, "Ẩn mái" giấu tum; đặc tả
- [x] Chủ nhà chỉnh sau bản đầu: bỏ luôn SK4 (WC chung dùng quạt hút nối ống lên mái); tum có cửa ra cả hai phía —
      `tum.doors` thành danh sách, phép 21 đi ra vào qua từng cửa; lan can mái bao luôn mái hiên cửa chính
- [x] Chủ nhà chỉnh tiếp: lan can thang song thoáng thay tấm đặc; kệ thờ + kệ tivi một khối, kệ thờ sát tường trái
      nhiều tầng (tủ đồ thờ dưới), vách ngăn với kệ tivi lên trần — `FURNITURE.shrine`, phép 17 cho kệ thờ chạm trần
- [x] Kệ tivi: thử kệ ô thoáng lên trần tới mép hành lang — nhìn bí, bỏ; chốt kệ thấp hai tầng (`tvShelf`: tủ để đồ
      dưới, mặt kệ tivi / loa trên) dài tới đầu trong bức lửng
- [x] Bỏ ô kính mờ W5 của PN1 — mất riêng tư; PN1 không còn ánh sáng tự nhiên (ghi `warn`)
- [x] Hai cửa tum có cánh, khoá, mở ra phía mái: `tum.doors` thêm bản lề và chiều mở, `validate()` đòi mở ra ngoài,
      3D dựng cánh `tumDoor`, 2D vẽ cung quét, phép 21 soi mỗi cửa một cánh phía ngoài tum
- [x] Tum xây tường gạch 100 thay vách tôn: bỏ dải lam hở + cột góc, thay ô thoáng lam sát mái trên hai vách dài
- [x] PN1 hai ô thoáng cửa lật kính mờ W5, W6 đặt cao ra buồng thang (đoạn chiếu nghỉ, đầu trên vế 1); cửa tum đổi sang
      mở vào trong để chốt từ trong nhà — `validate()` và phép 21 đòi cánh nằm phía trong tum
- [x] Ô thoáng PN1 thu còn 0.40 × 0.30, bệ 2.40, dồn về phía cửa PN1; cánh kính lật cố định dựng trong 3D — `hopper` trong
      `heights.only`, `massing.js` dựng lăng trụ `sash` thay tấm kính phẳng, `check-3d` phép 5 soi tấm lật khớp lỗ và độ mở
- [x] Gờ chắn nước 0.10 ở ngưỡng hai cửa tum (`tumCurb`, cánh đứng trên gờ); mái tum đua 0.40 ba phía, cạnh trên ranh
      lô không đua (`tumOf().roof`) — phép 21 soi gờ và độ đua, đi bộ vẫn bước qua gờ
- [x] Tum gọn một cửa: tường đông áp sát đầu vế 2 thay lan can mép lỗ, cửa ngay đầu vế 2 ra thẳng mái, cánh mở ra
      (không có chiếu tới), then chốt mặt trong; nấc cuối lên gờ chắn nước — vế 2 thêm một nấc (10 + 12, cao 0.171).
      `tumOf()` đòi tường và cửa ở đầu thang; phép 21 soi cánh không quét lên lỗ thang
- [x] Mái tum vát dốc về phía đông — chủ nhà không cần, giữ mái phẳng đua 0.40
- [x] Ô thoáng tum gắn 4 lá kính cố định xếp nghiêng chéo xuống ra ngoài (`TUM.louvers`, lăng trụ `louver`); phép 21 soi
      số lá, nằm trong dải ô thoáng, nghiêng đúng chiều, lá trên chồng mép lá dưới
- [x] Mái tum đua 0.40 nhìn thô → đua 0.18 bọc diềm gập (`tumFascia`), ô văng 0.6 trên cửa (`tumCanopy`); phép 21 soi
      diềm và ô văng. Đã cân nhắc tường chắn mái (máng giấu dễ tắc lá) và mái bê tông (nặng, khó dỡ)
- [x] Chủ nhà chốt, commit

### ⬜ A21 · Việc tồn sau A20

- [ ] Neo thang, tum, lan can mái vào lưới (E2) — kéo thanh trượt `y` 16.85 thì thang đang đứng yên
- [ ] Tay vịn dọc khe giữa hai vế thang
- [ ] Lớp chống nóng XPS kiểu lát rời để tháo khi xây tầng 2 — chờ chủ nhà quyết

## B · Mô hình 3D

### ✅ B1 · Bỏ dropdown nơi xây

Chốt xong nơi xây thì dropdown ba thành phố chỉ còn là cái bẫy — quên đổi là đọc sai toàn bộ
phần nắng.

- [x] `lat` / `lon` / `place` vào `LOT` trong `lib/lot.js`
- [x] Bỏ `<select id="place">` khỏi `Plan3D.jsx` và phần xử lý trong `scene3d.js`
- [x] Bỏ luôn bảng `PLACES` trong `lib/sun.js` — `sunPosition()` vốn nhận `lat`/`lon` làm tham
      số nên muốn đối chiếu nơi khác vẫn làm được, không cần bảng nào

### ✅ B2 · Đi bộ: va chạm và cao độ mắt

`components/scene3d.js`, hàm `moveWalk()`: đi xuyên tường được, và cao độ mắt luôn tính từ cốt nền
nhà nên bước ra sân thì lửng lơ 45 cm. Hoãn ngày 10/9/2026, chủ nhà gọi làm ngày 11/9/2026.

- [x] `lib/walk.js` — hình học thuần như `massing.js`: người là khối trụ đứng trên mặt `foot`, soi
      trên đúng danh sách khối đã dựng (tường, lan can, bậc, sàn) chứ không suy lại từ mặt bằng
- [x] **Người cao 1.70 m** (chủ nhà chốt), mắt 1.58, vai rộng 0.5 m
- [x] Cao độ mắt theo **mặt đang đứng**, không tra theo phòng: bước lên bậc tam cấp, qua ngưỡng cửa,
      xuống sàn bếp +0.15 đều đi theo từng nấc. Bước lên được một nấc (0.20), không trèo được hai;
      tầm mắt đuổi theo cho êm
- [x] Va chạm trượt dọc tường, chia nhỏ bước cho khỏi xuyên tường mỏng khi khung hình giật
- [x] `check-3d` thêm **phép kiểm 16**: đi thử qua mọi cửa và cổng cả hai chiều bằng chính `lib/walk.js`,
      tới nơi phải đứng đúng cốt sàn phòng bên kia; đi thẳng vào từng mảnh tường nhà thì phải bị chặn
- [x] Phá thử: tắt va chạm → phép 16 báo xuyên tường; bỏ dựng bậc → D1, D2, D13 báo vướng
- [x] Điểm khởi tạo nút **Đi bộ trong nhà** ở ngay phía trong cổng chính, nhìn vào sân; suy từ cổng
      khai trong từng phương án (bản cũ có cổng xe + cổng bộ thì ưu tiên cổng bộ), không ghim toạ độ

> **Vấp: kẹt sau khi bước xuống.** Bản đầu soi mỗi vị trí mới xem có vật cản trong tầm bán kính
> không. Vừa bước khỏi ngưỡng 0.45 xuống sân thì mép ngưỡng sau lưng thành vật cao hơn tầm bước, vẫn
> nằm sát chân — đứng im tại chỗ. Nay chỉ cản khi bước **tiến lại gần** vật.

> **Hai bán kính.** Chỉ dùng bề ngang vai thì kẹt trước bậc tam cấp: tâm còn dưới sân mà vòng vai đã
> chạm bậc thứ hai, cao hơn tầm bước. Vật thấp dưới đầu gối nên chỉ cản theo mũi chân.

> **Vướng nội thất và cánh cửa** từ B3. Kính cửa lùa không cản, coi như mở.

### ✅ B3 · Nội thất dạng khối và cánh cửa đi trong 3D

Mới có khối tường, sàn, mái. Dữ liệu đã có sẵn ở `furn` của từng mặt bằng (2D đang vẽ), chỉ
thiếu chiều cao. Hoãn ngày 10/9/2026; chủ nhà gọi làm ngày 11/9/2026 **kèm cánh cửa đi** — cửa
quay trước đó chỉ là lỗ trống.

- [x] Chiều cao theo loại ở `FURNITURE` trong `lib/lot.js` — **không** vào `HEIGHTS` như định ban đầu:
      giống `ROOF`, đó là kích thước đồ đạc chứ không phải cao độ thiết kế, không có thanh trượt nào
- [x] `cab` dùng cho ba thứ nên chia: ở phòng khách là kệ tivi 0.60, nhỏ dưới 0.5 m² là tủ đầu giường
      0.55, còn lại tủ áo / kệ kho 2.00. Buồng tắm đứng chỉ dựng khay sàn, không dựng vách kính
- [x] `lib/massing.js` dựng mỗi món một hộp đứng trên sàn phòng chứa nó, **cắt theo lọt lòng phòng** —
      mặt bằng khai theo tim với dung sai 1 cm nên chậu rửa bếp, lavabo WC khách lấn tường chừng ấy
- [x] Cánh cửa (`DOOR_LEAF`): cửa quay dựng cánh **mở 90°** về phía `open` đúng nét 2D; cửa 4 cánh D1 chủ
      nhà chốt tạm **hai cánh ngoài đóng, hai cánh giữa mở** (lối còn ~1.5 m), 2D sửa cho khớp — trước vẽ
      hai cánh ngoài mở; cửa lùa giữ tấm kính. Cánh nằm trong lọt lòng phòng phía mở — lỗ D8 khai tới 4.90 mà
      mặt tường bên cạnh ở 4.89; hành lang 0.9 m ở kho đối chiếu thì cánh dừng ở mặt tường đối diện
- [x] Người đi bộ vướng nội thất và cánh cửa
- [x] **Giường và sofa nhiều khối** thay hộp đặc — chủ nhà thấy giường "chiếm rất nhiều không gian". Cỡ
      giường đúng nệm 1m6, 1m8 nên giữ, chỉ đổi cách dựng: chân, gầm hở, khung, nệm lõm, đầu giường; sofa
      mặt ngồi 0.42 + tựa lưng 0.18 ở cạnh dài phía xa tâm phòng. Các khối mang `item` để phép 17 gom
- [x] **Bố trí lại trong `current.js`** khi xem 3D: bàn trà ngoài sân dời ra sát ngoài W1 (trước chắn lối
      vào cửa bếp D9); sofa phòng khách xếp chữ L góc tây bắc thay hai ghế đối diện; kệ tivi dài hết
      tường `y = 17`
- [x] `check-3d` thêm **phép kiểm 17** (mỗi món một khối đúng chỗ, đúng cốt sàn, dưới trần; đủ số cánh,
      áp một đầu lỗ, đứng phía mở, cao đúng đầu cửa); phép 5 coi cánh cửa là vật bịt lỗ
- [x] Phép 10 bỏ qua cặp đồ đạc ↔ cánh cửa / đồ đạc ↔ đồ đạc, phép 16 chỉ đi thử trên phần xây và chỉ
      qua khỏi lối cửa — chắn lối là chuyện bố trí, `validate()` soi trên mặt bằng
- [x] Phá thử: bỏ cắt theo tường → phép 10 báo; cánh mở ngược phía → phép 17 báo; cánh đứng giữa lỗ →
      phép 17 báo; nệm thò ra ngoài khung → phép 17 báo

> **Vấp ở phá thử:** cánh đứng chắn giữa lỗ cửa mà cả 17 phép vẫn sạch. Phép 5 chọc điểm ở tim tường,
> còn cánh bắt đầu từ mặt tường nên không bao giờ bị chọc trúng; phép 16 thì cố ý bỏ cánh cửa. Phép 17
> nay đòi cánh áp một đầu lỗ.

> **Lộ ra khi đi thử:** tủ đầu giường master lấn 0.3 m trước cửa lùa D7 — vẫn lách qua được, không
> phải lỗi, nhưng đi thẳng giữa cửa là vướng. Ở kho đối chiếu v1…v3, cửa phòng thờ mở hết thì cánh
> chắn ngang hành lang 0.9 m.

### ✅ B4 · Tường bao dọc hành lang ngoài hạ về cao rào

`lib/massing.js` từng có bậc tường thứ ba, "tường hiên": tường nào chỉ áp vào hành lang ngoài
(R3) thì cao 2.80 m, bằng mái hiên. Thực tế chỉ có một đoạn — tường bao phải `x = 9.5`,
`y` 18–25 — và nó không cần cao thế: mái hiên đua 1 m ra từ tường bếp, không gác lên tường bao.

- [x] Bỏ bậc tường hiên, còn hai bậc: tường nhà và tường rào
- [x] Mái hiên giữ 2.80 m; giữa rào 2.20 m và mái hở 0.6 m
- [x] `npm run check:3d` sạch

### ✅ B5 · Góc tường vuông, hết mái nhấp nháy

Chủ nhà thấy (11/9/2026) góc tường không vuông mà "giao nhau ở tim tường", và mái nhấp nháy như bị
tường xuyên qua khi xoay. Cùng một gốc: khối tường dựng đúng từ tim tới tim — góc ngoài khuyết ô
nửa bề dày, góc trong hai khối chồng nhau, còn tường nhà cao đúng bằng đỉnh mái lọt vào dưới bản
mái nên mặt trên trùng nhau (z-fighting). `3d.md` mục 5 và 6.

- [x] Kéo hai đầu thật của bức tường thêm nửa bề dày tường vuông góc gặp nó
- [x] `resolveOverlaps()` trong `lib/massing.js`: bản mái giữ nguyên, khoét khỏi tường; tường chồng
      tường thì tường cao hơn giữ phần chồng. Diện tích mái không đổi — phép kiểm 6 vẫn đúng nghĩa
- [x] `check-3d` thêm phép kiểm 10 (không hai khối đặc nào chồng nhau) và 11 (góc tường kín)
- [x] Chạy hai phép kiểm mới trên massing cũ: bắt đúng cả hai lỗi — v1 có 93 cặp khối chồng, 11
      góc khuyết. Bản sửa: cả 12 phương án qua 11 phép kiểm

> **Vấp ở phép kiểm 11:** điểm chọc rơi đúng ranh hai mảnh tường sát nhau (vệt tường cắt theo mép
> giếng trời SK1) nên so "nằm hẳn bên trong" thì không mảnh nào nhận — báo khuyết oan. Đổi sang
> tính cả điểm nằm trên mặt hộp.

> **Chủ nhà thấy tiếp:** trần hiên cửa chính và trần ban công hụt bề rộng so với nhà — bản mái
> phủ từ tim tới tim (`x` 0–5) trong khi khối nhà, sau khi kéo góc, chạy từ mặt ngoài tường
> (−0.11–5.11). Nay bản mái đổ ra ngoài kéo hai đầu tới mặt ngoài tường, dùng chung `jointHalf()`
> trong `lib/envelope.js` với phần kéo góc tường để hai bên không lệch nhau nữa.

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

> **Liên đới với A2 — đã xử lý.** Chủ nhà chốt bỏ mái che xe, thay bằng mái bàn trà ở sân chính
> (A2). Hai thanh trượt của E2f đã gỡ ở A9, và A4 chốt **không làm thanh trượt thay thế**: mái nhẹ
> bám lưới nên kéo tường là vùng phủ đổi theo.

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

`scripts/check-3d.mjs`, chạy bằng `npm run check:3d`. Ban đầu tám phép kiểm, nay **20** (B5 thêm
10 và 11, A9 thêm 9, A4 thêm 12, A11 thêm 13, A12 thêm 14, A13 thêm 15, B2 thêm 16, B3 thêm 17, A14 thêm 18 và 19, A5 thêm 20); cả 12 phương án qua sạch. Tám phép đầu:

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
