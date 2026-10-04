# Đặc tả mặt bằng — Hiện hành — lô 8.5 × 30 m

> Sinh tự động từ `lib/versions/current.js` lúc 15:27:17 4/10/2026. Không chép tay.
> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–8.5). Y→xuống (0–30).
> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.
> Tường bao **220 mm** · Tường ngăn **100 mm**.

Khuôn đất 8.5 × 30 m: lô chính 4.5 m, lô phụ 4 m. Giữ bố cục nhà chính, hành lang trong và ban công sau; thu ngang các phòng theo nhà 4.5 m. Lô A bên cạnh rộng 4.5 m. Bỏ toàn bộ khối bếp + nhà ăn, hành lang ngoài, WC khách và mái che sân chính. Phần đất trả lại thành sân chính liên tục tới sân phơi; giữ mái sân phơi độc lập, hai vòi nước, máy giặt và giàn phơi. Bỏ trụ và mái cổng, cổng phủ hết ngang lô chính 4.5 m (lọt lòng 4.28 m giữa hai mặt tường); các đoạn phía trước cùng đỉnh cao 2.10 m so với sân trên. Cổng nằm thẳng hàng tường mặt tiền tại ranh trước, bỏ đoạn tường gấp khúc, cổng hạ ngang mặt đường; sân cổng bằng dài 2.3 m để mở cánh, dốc trong sân phụ dài 6.4 m lên nền cao 0.80 m (12.5%). Mặt đường minh hoạ rộng 4 m, ngang nền lô B. Nền đất/sân nhà mình và lô A cao hơn lô B 0.80 m; sàn nhà cao hơn sân 0.45 m.

---

## 1. Tổng quan

| Mục | Tim tường | Sử dụng |
|---|---:|---:|
| Lô đất 8.5 × 30 | 255.00 m² | — |
| Nền lô B (mốc đối chiếu) | +0.00 m | — |
| Nền đất/sân nhà mình và lô A | +0.80 m | Cao hơn nền lô B |
| Sàn nhà so với nền lô B | +1.25 m | Cao hơn sân 0.45 m |
| Đường và chân cổng | +0.00 m so với nền lô B | Thấp hơn sân 0.80 m |
| Tim cổng lùi vào sân | 0.00 m từ ranh trước | Mái và trụ nằm trong đất |
| Sân bằng để mở cổng | 2.30 m | Hai cánh mở trên mặt bằng |
| Dốc trong sân phụ | Dài 6.40 m, lên 0.80 m | Dốc 12.5% |
| Đường minh hoạ | Rộng 4.00 m | Giả định, chưa phải số đo thực tế |
| **Khối nhà chính** | **65.25 m²** | 59.37 m² |
| **Toàn bộ phần kín** | **65.25 m²** | 59.37 m² |
| Sân trống | 189.75 m² | — |
| Tường chiếm chỗ | 5.88 m² | — |

Nhà chính chạy từ `y = 13.5` tới `y = 30.0` → **dài 16.5 m**.

## 2. Bảng phòng

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |
|---|---|---:|---:|---:|---:|---|---:|---|---:|---|
| L1 | SÂN PHỤ | 0.0 | 0.0 | 4.5 | 13.5 | 4.5 × 13.5 | 60.75 | 4.39 × 13.39 | 58.78 | Sân |
| L2 | PHÒNG KHÁCH | 0.0 | 13.5 | 4.5 | 18.5 | 4.5 × 5.0 | 22.50 | 4.28 × 4.84 | 20.72 | Phòng |
| L3 | CẦU THANG | 0.0 | 18.5 | 3.5 | 20.5 | 3.5 × 2.0 | 7.00 | 3.39 × 1.90 | 6.44 | Lưu thông |
| L4 | PHÒNG NGỦ 1 | 0.0 | 20.5 | 3.5 | 23.0 | 3.5 × 2.5 | 8.75 | 3.34 × 2.40 | 8.02 | Phòng |
| L5 | WC CHUNG | 0.0 | 23.0 | 2.0 | 24.5 | 2.0 × 1.5 | 3.00 | 1.84 × 1.40 | 2.58 | Vệ sinh |
| L6 | TIỀN PHÒNG WC | 2.0 | 23.0 | 3.5 | 24.5 | 1.5 × 1.5 | 2.25 | 1.45 × 1.40 | 2.03 | Lưu thông |
| L7 | PHÒNG NGỦ MASTER | 0.0 | 24.5 | 4.5 | 28.0 | 4.5 × 3.5 | 15.75 | 4.28 × 3.34 | 14.30 | Phòng |
| L8 | BAN CÔNG SAU | 0.0 | 28.0 | 4.5 | 30.0 | 4.5 × 2.0 | 9.00 | 4.28 × 1.78 | 7.62 | Sân |
| L9 | HÀNH LANG | 3.5 | 18.5 | 4.5 | 24.5 | 1.0 × 6.0 | 6.00 | 0.89 × 5.95 | 5.30 | Lưu thông |
| R1 | SÂN CHÍNH | 4.5 | 0.0 | 8.5 | 25.0 | 4.0 × 25.0 | 100.00 | 3.89 × 24.89 | 96.82 | Sân |
| R4 | SÂN PHƠI / GIẶT | 4.5 | 25.0 | 8.5 | 30.0 | 4.0 × 5.0 | 20.00 | 3.78 × 4.89 | 18.48 | Sân |

**Kiểm tra:** cột trái 135.00 + cột phải 120.00 = **255.00 m²**
**Chuỗi dọc lô chính:** 13.5 + 5.0 + 2.0 + 2.5 + 1.5 + 3.5 + 2.0 = **30.0**

## 3. Bảng cửa

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |
|---|---|---:|---:|---:|---:|---|---|---|
| D1 | ngang | 13.5 | 0.65 | 3.85 | 3.20 | 4 cánh | — | Sân phụ ↔ Phòng khách — CỬA CHÍNH 4 cánh, tâm x = 2.25 |
| D2 | dọc | 4.5 | 16.85 | 17.85 | 1.00 | Mở quay | bản lề đầu lớn, mở + | Sân chính ↔ Phòng khách — mở ra sân chính, bản lề phía cuối nhà |
| D3 | ngang | 18.5 | 3.50 | 4.50 | 1.00 | Mở thông | — | Phòng khách ↔ Hành lang — thông suốt, KHÔNG có cánh cửa |
| D4 | dọc | 3.5 | 18.50 | 20.50 | 2.00 | Mở thông | — | Hành lang ↔ Cầu thang — thông suốt, chân thang ở đầu bắc hành lang |
| D5 | dọc | 3.5 | 20.59 | 21.39 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ Phòng ngủ 1 — sát vách buồng thang (chừa 4 cm khuôn), không chừa góc thừa |
| D8 | ngang | 24.5 | 3.50 | 4.40 | 0.90 | Mở quay | bản lề đầu lớn, mở + | Hành lang ↔ Master — mở vào phòng |
| D12 | ngang | 28.0 | 0.65 | 3.85 | 3.20 | Lùa 2 cánh | — | Master ↔ Ban công sau — kính lùa 3.2 m, nguồn sáng duy nhất của master |
| D13 | dọc | 4.5 | 28.60 | 29.40 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Ban công sau ↔ Sân phơi — mở vào ban công, chừa phía sân phơi cho bậc; bản lề phía tường bao sau |
| D14 | dọc | 2.0 | 23.09 | 23.89 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Tiền phòng ↔ WC chung — cửa cánh 0.80 m mở vào WC, bản lề sát vách PN1 (chừa 4 cm khuôn) để cánh mở áp vách, gioăng kín mùi |

## 4. Bảng cửa sổ

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |
|---|---|---:|---:|---:|---:|---|
| W1 | dọc | 4.5 | 14.33 | 16.13 | 1.80 | Phòng khách ← Sân chính — 1.8 m, nằm giữa mặt trong tường mặt tiền và cửa D2, trụ hai bên 0.72 m |
| W2 | ngang | 20.5 | 2.50 | 2.90 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |
| W3 | ngang | 20.5 | 3.00 | 3.40 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |

## 6. Cổng, bậc, mái

| Trục | Vị trí | Từ | Đến | Rộng | Tên |
|---|---:|---:|---:|---:|---|
| ngang | 0.0 | 0.11 | 4.39 | 4.28 | CỔNG TOÀN NGANG 4.5m · LỌT LÒNG 4.28m |

### Cánh cổng sắt

Hai cánh có bản lề ở mặt trong hai trụ, mở vào sân; khung thép hộp với ba đố ngang và nan đứng.

| Mã | Cổng | Cao | Khung | Nan | Bước nan tối đa | Vật liệu |
|---|---|---:|---:|---:|---:|---|
| CG1 | CỔNG TOÀN NGANG 4.5m · LỌT LÒNG 4.28m | 2.10 | 0.06 | 0.03 | 0.12 | khung thép hộp, 3 đố ngang và nan sắt đứng |

### Bậc tam cấp

Vị trí suy từ cửa, đặt phía thấp, bắt đầu từ mặt tường. Số bậc không tính nấc trên cùng — nấc đó chính là ngưỡng cửa.

| Cửa | Xuống | x₁ | y₁ | x₂ | y₂ | Dư mỗi bên | Số bậc | Cao bậc | Mặt bậc |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| D1 | SÂN PHỤ | 0.56 | 12.79 | 3.94 | 13.39 | 0.09 | 2 | 0.15 | 0.30 |
| D2 | SÂN CHÍNH | 4.61 | 16.65 | 5.11 | 17.89 | 0.20 / 0.04 | 2 | 0.15 | 0.25 |
| D13 | SÂN PHƠI / GIẶT | 4.61 | 28.40 | 5.11 | 29.60 | 0.20 | 2 | 0.15 | 0.25 |

### Bản mái đổ ra ngoài tường

Mái hiên, trần ban công — cùng cốt bản mái nhà, bề đua tính từ mặt tường.

| Trục | Vị trí | Từ | Đến | Đua ra | Ghi chú |
|---|---:|---:|---:|---:|---|
| ngang | 13.5 | -0.1 | 4.6 | 1.20 | Mái hiên cửa chính — đổ liền bản mái nhà, công xôn không cột, che bậc D1 |
| ngang | 28.0 | -0.1 | 4.6 | 1.89 | Trần ban công sau — đổ liền bản mái, gác lên tường trái; thay cho lam đứng D12 |

**Diềm mép mái hiên** — khung thép hộp mạ kẽm, ốp tấm gỗ nhựa ngoài trời màu nâu óc chó. Dải cao 0.45 m, dày 0.05 m, áp mặt ngoài bản; đỉnh bằng mặt lát mái, phía dưới buông thấp hơn mặt dưới bản — không nhô trên mặt lát để khỏi chặn nước thoát ra mép. Bọc mép ngoài và hai đầu, trừ cạnh nằm trên ranh lô: trục ngang 13.5 — 2 dải, dài 5.97 m, cốt 3.64 → 4.09 (đầu toạ độ nhỏ nằm trên ranh lô, không ốp).

### Lớp chống nóng mái

Kiểu **mái ngược**: chống thấm nằm dưới tấm cách nhiệt, được che nắng và đỡ co giãn nhiệt. Phủ mọi sàn mái bê tông (PHÒNG KHÁCH, CẦU THANG, PHÒNG NGỦ 1, WC CHUNG, TIỀN PHÒNG WC, PHÒNG NGỦ MASTER, HÀNH LANG) và mái hiên cửa chính, trần ban công sau, tới mặt ngoài tường; chừa giếng trời — quanh mỗi lỗ xây gờ chắn nước cao hơn mặt lát. Diện tích lát **77.92 m²**, mặt lát cốt **4.09** (bản mái 4.00, chưa tính vữa tạo dốc). Lát **rời**, không cán vữa: xây tầng 2 thì nhấc tấm, cuộn vải địa, gỡ XPS — không phải đục, không phạm vào lớp chống thấm.

| Lớp (dưới lên) | Dày (m) | Ghi chú |
|---|---:|---|
| Bản mái BTCT | 0.25 | |
| Vữa tạo dốc | thay đổi | dốc về chỗ thoát nước; không dựng trong 3D |
| Chống thấm | — | gốc xi măng hoặc màng dán nguội; **không** khò bitum nóng, **không** sơn gốc dầu — dung môi làm chảy XPS |
| Tấm XPS | 0.05 | cường độ nén ≥ 300 kPa, ghép so le; phủ kín ngay, không để phơi nắng; không nhầm xốp trắng EPS |
| Vải địa kỹ thuật | — | lớp lọc trên XPS, giữ rác và cát khỏi lọt xuống khe tấm |
| Tấm bê tông đúc sẵn | 0.04 | 400 × 400 mm **đặt rời** — không vữa, không keo; mặt lát đi theo dốc mái, khe giữa các tấm để hở cho nước xuống |

### Mái nhẹ

Mái phụ lợp tôn, không phải bản bê tông liền mái nhà. Vùng phủ khai theo tim tường; tấm mái thật lùi vào mặt trong bức tường nào cao hơn nó và đua ra mặt ngoài bức nào thấp hơn, nên hai cột dưới đây lệch nhau nửa bề dày tường. Cao độ là **mặt dưới** mái, tấm lợp dày 0.05 m.

| Mã | Tên | Vùng khai | Tấm mái dựng | Dạng | Cao độ mặt dưới | Vật liệu |
|---|---|---|---|---|---|---|
| RF3 | MÁI SÂN PHƠI | 4.5 · 25.0 · 8.5 · 28.0 | 4.61 · 25.00 · 8.61 · 28.00 | dốc một mái theo y (dốc 10%) | 3.50 → 3.20 | tôn cách nhiệt |

**Máng xối** — suy ra ở mép thấp của mái nhẹ. Không có máng ở đoạn mép nối liền mạch sang mái khác cùng cao độ (nước chảy tiếp) và đoạn đua ra trên một mái thấp hơn (nước rơi xuống mái ấy). Miệng máng ngang mặt dưới mái ở mép, rộng 0.15 m, sâu 0.12 m.

| Mái | Mép | Từ | Đến | Dài | Miệng máng | Đặt |
|---|---|---:|---:|---:|---:|---|
| RF3 | y = 28.00 | 4.61 | 8.45 | 3.84 | 3.20 | dưới mép mái |

**Ống xả đứng** — mỗi dải máng một ống 90 mm ở đầu sát tường bao, chạy thẳng xuống, cắm dưới cốt sân vào ống ngầm — không đổ ra sân.

| Mái | x₁ | y₁ | x₂ | y₂ | Từ cốt (đáy máng) | Áp |
|---|---:|---:|---:|---:|---:|---|
| RF3 | 8.30 | 27.95 | 8.39 | 28.04 | 3.08 | mặt trong tường bao |

**Cột đỡ mái nhẹ** — thép hộp 100 × 100, đứng ở chỗ mép mái không tựa lên tường cao tới mái. Vị trí khai theo tâm cột; chiều cao suy ra: từ cốt sân tới đáy dầm biên trên đầu cột. Nhịp giữa hai chỗ đỡ dọc một mép mái không quá 4.5 m.

| Mã | x | y | Đỉnh cột | Đỡ mái | Dưới dầm |
|---|---:|---:|---:|---|---|
| C1 | 8.50 | 25.00 | 3.40 | RF3 | có |
| C2 | 8.50 | 28.00 | 3.10 | RF3 | có |

**Dầm biên** — thép hộp 50 × 100, suy ra dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái, từ mặt tường tới mặt tường, đi qua đầu cột. Mặt trên chạm mặt dưới mái (dầm dọc chiều dốc nghiêng theo mái); ở mép có máng thì dầm lùi vào sau máng, đoạn chui dưới máng hạ xuống đáy máng.

| Mái | Tuyến | Từ | Đến | Dài | Mặt trên | Ghi chú |
|---|---|---:|---:|---:|---|---|
| RF3 | y = 25.00 | 4.61 | 8.47 | 3.86 | 3.50 → 3.50 |  |
| RF3 | y = 28.00 | 4.61 | 8.47 | 3.86 | 3.21 → 3.21 |  |
| RF3 | x = 8.50 | 25.00 | 28.00 | 3.00 | 3.50 → 3.20 | nghiêng theo mái |

### Cầu thang lên mái

Cao bậc suy ra từ mặt sàn tới mặt mái đi lại được chia đều số nấc; nấc cuối mỗi vế lên chiếu nghỉ / mặt mái, nên số mặt bậc ít hơn số nấc một. Bản thang dày 0.12 m dưới mặt bậc, gầm thang hở. Lỗ thang cũng là lỗ khoét bản mái.

| Mã | Tên | Lỗ thang x₁ · y₁ · x₂ · y₂ | Rộng vế | Nấc (vế 1 + vế 2) | Cao bậc | Mặt bậc | Chiếu nghỉ | Từ cốt → tới cốt |
|---|---|---|---:|---|---:|---:|---:|---|
| CT1 | CẦU THANG LÊN MÁI | 0.11 · 18.55 · 3.37 · 20.45 | 0.76 | 11 + 11 | 0.170 | 0.25 | 2.32 | 0.45 → 4.19 |

Lan can thang cao 0.90 m dọc mép vế 2 giáp phòng khách (trên bức lửng cao 1.00 m) và ở mép lỗ thang trên mặt mái. Khe giữa hai vế rộng 0.38 m: mỗi vế một tay vịn ở mép trong, chết vào một trụ ở đầu khe trên chiếu nghỉ.

### Tum

Tường gạch 100 trát sơn, mái tôn, ô lấy sáng polycarbonate, ô thoáng lá kính gắn tường xếp nghiêng sát mái. Vùng 0.00 · 18.50 · 3.42 · 20.50 (tim vách), sàn là mặt mái cốt 4.09, mặt dưới mái tum 6.79; tường dày 100 mm, ô thoáng cao 0.30 m sát mái trên hai vách dài, gắn 4 lá kính cố định xếp nghiêng chéo xuống ra ngoài (lá trên chồng mép lá dưới — mưa hắt, lá cây không vào). Mái tum đua ngắn 0.18 m ra khỏi mặt ngoài tường (cạnh trên ranh lô không đua), mép bọc diềm gập cao 0.12 m. Trên cửa có ô văng đua 0.60 m, dài hơn cửa 0.20 m mỗi bên. Cửa ra mái có cánh mở vào trong tum, chốt từ trong nhà, ngưỡng có gờ chắn nước cao 0.10 m, cao 2.20 m tính từ mặt mái:vách x = 3.42, y 18.61–19.31. Ô polycarbonate đậy trọn lỗ thang. Dỡ đi khi xây tầng 2.

### Lan can mái

Lan can thép sơn, trụ bắt nở vào đỉnh tường, cao 1.10 m từ mặt mái cốt 4.09.

| Trục | Vị trí | Từ | Đến | Dài |
|---|---:|---:|---:|---:|
| ngang | 12.23 | 0.00 | 4.50 | 4.50 |
| dọc | 0.00 | 12.23 | 18.50 | 6.27 |
| dọc | 0.00 | 20.50 | 30.00 | 9.50 |
| ngang | 30.00 | 0.00 | 4.50 | 4.50 |
| dọc | 4.50 | 12.23 | 30.00 | 17.77 |

### Bồn nước trên mái

Bồn inox 1000 L nằm ngang, giá thép sơn hai bộ kiềng, chân có bản đế dàn tải. Thân Ø 0.96 × 1.59 m trên giá cao 0.60 m; bốn chân thép 50 × 50 mm, mỗi chân một **bản đế 300 × 300 mm** dàn tải xuống lớp chống nóng — chân trần đặt thẳng lên tấm lát thì ép quá sức XPS.

| Mã | Dung tích | Trục nằm | Hình chiếu x₁ · y₁ · x₂ · y₂ | Chân giá cốt | Đỉnh bồn cốt |
|---|---:|---|---|---:|---:|
| BN1 | 1000 L | dọc | 3.29 · 28.26 · 4.25 · 29.85 | 4.09 | 5.65 |

### Giàn phơi

Giàn phơi trụ thép hộp 50 × 50 sơn tĩnh điện, đầu chữ V chìa hai bên, hai thanh phơi inox Ø27. Mặt cắt **hình tam giác ngược**: trụ cao 1.50 m, trên đầu trụ hai tay chìa vươn lên 0.25 m và ra 0.25 m mỗi bên, đỡ hai thanh phơi ở cốt 1.80 m. Hai thanh vì thế cách nhau 0.50 m theo phương ngang — treo kín cả hai mà quần áo không chạm nhau. Đặt ngoài trời, ở dải sân chừa không lợp mái — treo dưới mái thì mất nắng.

| Mã | Sân | Trục | Tim tuyến | Từ | Đến | Dài tuyến | Hai thanh ở | Tổng dây phơi |
|---|---|---|---:|---:|---:|---:|---|---:|
| GP1 | SÂN PHƠI / GIẶT | ngang | 29.35 | 6.00 | 8.00 | 2.00 m | y 29.10 · 29.60 | 4.00 m |

### Cây xanh

Phối cảnh ngoài sân. Mô hình 3D chỉ dựng khối tượng trưng — chậu trụ tròn, thân trụ, tán cây hình bầu — để cảm tỉ lệ và thấy bóng đổ.

**Cây bóng mát** — cây bóng mát tán gọn (bàng Đài Loan, lộc vừng), ô gốc 1.0 × 1.0 bó vỉa gạch cao 150. Thân Ø 0.25; tán Ø 3.30 dày 2.80 m, mặt dưới tán cao 2.50 m trên mặt sân — đi lại, dắt xe máy dưới tán không vướng cành. Tán không vươn ra ngoài lô. Ô gốc 1.00 × 1.00 m bó vỉa cao 0.15 m.

| Mã | Sân | Tâm gốc x | Tâm gốc y | Tán x₁ · y₁ · x₂ · y₂ | Đỉnh tán cốt | Ghi chú |
|---|---|---:|---:|---|---:|---|
| CX1 | SÂN CHÍNH | 6.50 | 3.60 | 4.85 · 1.95 · 8.15 · 5.25 | 5.30 | Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m |
| CX2 | SÂN CHÍNH | 6.50 | 6.90 | 4.85 · 5.25 · 8.15 · 8.55 | 5.30 | Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m |

**Chậu cây** — chậu gốm / xi măng Ø400 cao 450, cây cảnh dáng đứng. Chậu Ø 0.40 cao 0.45 m; tán Ø 0.44, cao 0.80 m trên miệng chậu.

| Mã | Sân | Tâm x | Tâm y | Đỉnh tán cốt | Ghi chú |
|---|---|---:|---:|---:|---|
| CC1 | SÂN PHỤ | 0.355 | 13.09 | 1.25 | Trái bậc cửa chính D1 — giữa mặt tường trái sân phụ và mép bậc, dưới mái hiên |
| CC2 | SÂN PHỤ | 4.145 | 13.09 | 1.25 | Phải bậc cửa chính D1 — đối xứng CC1 qua trục cửa x = 2.25, dưới mái hiên |
| CC3 | BAN CÔNG SAU | 0.355 | 29.64 | 1.70 | Ban công sau — góc trái sát rào sau, dưới trần ban công |
| CC4 | BAN CÔNG SAU | 4.145 | 29.64 | 1.70 | Ban công sau — góc phải sát rào sau, cạnh cửa D13, ngoài vùng quét cánh |

**Bồn hoa xây** — bó vỉa gạch 100 trát vữa cao 250, lưng áp tường có chống thấm, lỗ thoát nước chân bồn. Rộng 0.50 m tính từ mặt tường, mép bó vỉa cao 0.25 m trên mặt sân, mặt đất trồng thấp hơn mép 0.05 m; khóm hoa chia đều dọc bồn, bước chừng 0.50 m.

| Mã | Sân | Áp tường | Từ | Đến | Dài | Chiếm x₁ · y₁ · x₂ · y₂ | Khóm hoa | Ghi chú |
|---|---|---|---:|---:|---:|---|---:|---|
| BH1 | SÂN PHỤ | x = 0.00 | 8.95 | 12.19 | 3.24 m | 0.11 · 8.95 · 0.61 · 12.19 | 6 | Dọc tường bao trái sân phụ, sau đoạn dốc tới mép mái hiên — hứng mưa trọn |

### Tường xây lên hết chiều cao nhà

Chiều cao tường mặc định suy từ phòng áp vào; các đoạn dưới đây khai riêng dù chỉ áp vào sân.

| Trục | Vị trí | Từ | Đến |
|---|---:|---:|---:|
| dọc | 0.0 | 28.0 | 30.0 |
| dọc | 4.5 | 28.0 | 30.0 |

## 7. Tường

**Tường rào** (đoạn chỉ áp sân, không phải tường nâng): xây đặc cao **0.80 m** so với sân, phía trên là **lan can song thoáng** tới đỉnh rào **1.80 m** — trụ 80 mm cách nhau ≤ 2.0 m, song 20 mm bước 120 mm; chừa trống trên cổng và cửa.

**Đoạn rào xây kín** — không lan can, để che tầm nhìn; đỉnh đo từ cốt sân, chỗ nào sàn cao hơn sân thì rào nhô lên ít hơn đúng bằng chênh cốt: trục ngang 0.0 (4.4–8.5) đỉnh **2.10 m**; trục dọc 0.0 (0.0–1.0) đỉnh **2.10 m**; trục ngang 30.0 (0.0–8.5) đỉnh **1.80 m**. Cổng và cửa trên đoạn ấy cao theo đỉnh rào.

| Trục | Vị trí | Từ | Đến | Dày (mm) |
|---|---:|---:|---:|---:|
| ngang | 0.0 | 4.4 | 8.5 | 220 |
| ngang | 30.0 | 0.0 | 8.5 | 220 |
| dọc | 0.0 | 0.0 | 30.0 | 220 |
| dọc | 8.5 | 0.0 | 30.0 | 220 |
| ngang | 13.5 | 0.0 | 4.5 | 220 |
| ngang | 28.0 | 0.0 | 4.5 | 220 |
| dọc | 4.5 | 13.5 | 28.0 | 220 |
| dọc | 4.5 | 28.0 | 30.0 | 220 |
| ngang | 18.5 | 0.0 | 3.2 | 100 |
| ngang | 20.5 | 0.0 | 3.5 | 100 |
| ngang | 23.0 | 0.0 | 3.5 | 100 |
| ngang | 24.5 | 0.0 | 4.5 | 100 |
| dọc | 3.5 | 20.5 | 23.0 | 100 |
| dọc | 2.0 | 23.0 | 24.5 | 100 |

## 8. Nội thất

| Loại | x | y | Rộng | Sâu |
|---|---:|---:|---:|---:|
| sofa | 0.25 | 14.80 | 2.60 | 0.85 |
| sofa | 0.25 | 15.65 | 0.85 | 1.20 |
| tbl | 1.40 | 16.05 | 1.30 | 0.80 |
| shrine | 0.11 | 17.95 | 0.70 | 0.50 |
| tvShelf | 0.81 | 17.95 | 2.85 | 0.50 |
| stairCab | 0.11 | 19.60 | 0.90 | 0.85 |
| stairCab | 1.01 | 19.60 | 0.52 | 0.85 |
| stairCab | 1.53 | 19.60 | 0.52 | 0.85 |
| stairCab | 2.05 | 19.60 | 0.52 | 0.85 |
| bedw | 0.25 | 21.35 | 1.80 | 1.60 |
| cab | 0.30 | 20.80 | 0.45 | 0.45 |
| cab | 2.85 | 21.75 | 0.60 | 1.20 |
| cab | 2.10 | 23.85 | 1.30 | 0.60 |
| lav | 1.35 | 24.00 | 0.55 | 0.45 |
| wc | 0.11 | 23.88 | 0.68 | 0.42 |
| shower | 0.11 | 23.05 | 1.00 | 0.70 |
| bedw | 0.25 | 25.20 | 2.00 | 1.80 |
| cab | 0.30 | 24.60 | 0.45 | 0.45 |
| cab | 0.30 | 27.20 | 0.45 | 0.45 |
| desk | 3.75 | 25.49 | 0.60 | 1.20 |
| desk | 3.75 | 26.69 | 0.60 | 1.20 |
| chair | 3.05 | 25.85 | 0.48 | 0.48 |
| chair | 3.05 | 27.05 | 0.48 | 0.48 |
| tap | 4.61 | 26.15 | 0.18 | 0.10 |
| tap | 4.61 | 27.25 | 0.18 | 0.10 |
| washRaised | 4.65 | 25.15 | 0.60 | 0.60 |
| round | 5.00 | 14.53 | 1.40 | 1.40 |

### Chiếu sáng

**30 bộ đèn, 472 W, 43000 lm.** Nhà chính đổ bản bê tông thẳng, không trần giả, nên đèn trong nhà là **ốp nổi**; ống luồn dây và hộp đấu đèn trần phải đặt sẵn trong bản mái trước khi đổ. Đèn trần áp mặt dưới vật che thấp nhất ngay trên nó — cao độ trong bảng là suy ra, không khai. Đèn tường cao tính từ sàn phía đèn quay vào.

| Mã | Loại | W | lm | Phòng | Vị trí | Gắn | Thân đèn cốt | Ghi chú |
|---|---|---:|---:|---|---|---|---|---|
| Đ1 | đèn tường ngoài trời IP65 | 10 | 800 | SÂN PHỤ | tường x = 0.00, y 0.50, quay + | tường, tâm cao 2.30 m trên sàn | 1.40 → 1.60 | Cổng chính — đèn tường bên trái, không còn mái cổng |
| Đ2 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHỤ | 1.60 · 12.80 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Mái hiên cửa chính — rọi bậc D1, nửa trái |
| Đ3 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHỤ | 3.40 · 12.80 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Mái hiên cửa chính — rọi bậc D1, nửa phải |
| Đ4 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 1.30 · 14.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, trên sofa |
| Đ5 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 3.70 · 14.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, lối từ cửa chính |
| Đ6 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 1.30 · 17.25 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, giữa bàn nước và kệ thờ |
| Đ7 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 3.70 · 17.25 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, trước kệ tivi và cửa D2 |
| Đ8 | đèn tường hắt | 8 | 600 | CẦU THANG | tường x = 0.00, y 20.00, quay + | tường, tâm cao 3.20 m trên sàn | 3.59 → 3.71 | Cầu thang — tường trái ở chiếu nghỉ, nửa phía vế 1 |
| Đ9 | đèn tường hắt | 8 | 600 | CẦU THANG | tường x = 3.42, y 18.96, quay − | tường, tâm cao 2.35 m trên sàn | 6.38 → 6.50 | Đầu thang — trong tum, trên lanh tô cửa ra mái |
| Đ10 | đèn tường ngoài trời IP65 | 10 | 800 | MÁI | tường x = 3.42, y 19.90, quay + | tường, tâm cao 1.90 m trên sàn | 5.89 → 6.09 | Mái — mặt ngoài tum cạnh cửa, rọi sân thượng và lối tới bồn nước |
| Đ11 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 3.97 · 19.40 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — đầu bắc, chân cầu thang |
| Đ12 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 3.97 · 21.95 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — giữa, trước cửa PN1 |
| Đ13 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 3.97 · 24.10 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — đầu nam, trước WC chung và cửa master |
| Đ14 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG NGỦ 1 | 2.03 · 21.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng ngủ 1 — giữa phòng; phòng không cửa sổ ra trời, ban ngày cũng cần |
| Đ15 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ 1 | tường x = 0.00, y 21.55, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Phòng ngủ 1 — đọc sách, đầu giường phía kệ |
| Đ16 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ 1 | tường x = 0.00, y 22.75, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Phòng ngủ 1 — đọc sách, đầu giường phía vách kho |
| Đ17 | ốp trần chống ẩm Ø250 IP44 | 18 | 1600 | WC CHUNG | 1.13 · 23.75 | trần, cách sàn 3.30 m | 3.67 → 3.75 | WC chung — ốp trần chống ẩm, giữa phòng |
| Đ18 | downlight ốp nổi Ø150 | 12 | 1100 | TIỀN PHÒNG WC | 2.90 · 23.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Tiền phòng WC — trước tủ đồ và cửa WC chung |
| Đ19 | đèn tường hắt | 8 | 600 | WC CHUNG | tường y = 24.50, x 1.63, quay − | tường, tâm cao 1.85 m trên sàn | 2.24 → 2.36 | WC chung — đèn gương trên lavabo, vách master |
| Đ20 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG NGỦ MASTER | 2.50 · 26.00 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — lệch về phía chân giường, không chói mắt người nằm |
| Đ21 | downlight ốp nổi Ø150 | 12 | 1100 | PHÒNG NGỦ MASTER | 1.90 · 24.70 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — lối vào từ D8 |
| Đ22 | downlight ốp nổi Ø150 | 12 | 1100 | PHÒNG NGỦ MASTER | 4.05 · 26.70 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — trên bàn làm việc |
| Đ23 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ MASTER | tường x = 0.00, y 24.82, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Master — đọc sách, trên tủ đầu giường phía cửa |
| Đ24 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ MASTER | tường x = 0.00, y 27.43, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Master — đọc sách, trên tủ đầu giường phía ban công |
| Đ25 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | BAN CÔNG SAU | 1.60 · 29.05 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Ban công sau — dưới trần ban công, nửa trái |
| Đ26 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | BAN CÔNG SAU | 3.40 · 29.05 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Ban công sau — dưới trần ban công, nửa phải |
| Đ28 | đèn tường ngoài trời IP65 | 10 | 800 | SÂN CHÍNH | tường x = 4.50, y 14.00, quay + | tường, tâm cao 2.30 m trên sàn | 2.20 → 2.40 | Sân chính — đèn tường phía trước |
| Đ29 | đèn tường ngoài trời IP65 | 10 | 800 | SÂN CHÍNH | tường x = 4.50, y 18.20, quay + | tường, tâm cao 2.30 m trên sàn | 2.20 → 2.40 | Sân chính — đèn tường gần cửa phụ D2 |
| Đ37 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHƠI / GIẶT | 6.50 · 26.50 | trần, cách sàn 3.34 m | 3.26 → 3.34 | Sân phơi — dưới mái sân phơi |
| Đ38 | đèn tường ngoài trời IP65 | 10 | 800 | SÂN PHƠI / GIẶT | tường x = 4.50, y 26.70, quay + | tường, tâm cao 2.10 m trên sàn | 2.00 → 2.20 | Sân giếng — rọi hai vòi nước và máy giặt |

**Độ rọi chung** — phương pháp quang thông: E = Σ lm × UF × 0.8 / diện tích lọt lòng. UF tra theo chỉ số phòng K = S / (h × (dài + rộng)), h từ trần tới mặt làm việc 0.75 m, bảng gần đúng cho đèn ốp trần tán xạ, trần tường sơn sáng. Chỉ đèn trần và đèn thả tính vào; đèn tường là đèn cục bộ. Số ra để so với ngưỡng, sai chừng ±20% — không phải số đo.

| Phòng | Số đèn | W | lm (đèn trần) | Lọt lòng m² | Cao trần | K | UF | Độ rọi chung | Ngưỡng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| L1 SÂN PHỤ | 3 | 34 | 2000 | — | — | — | — | — | không tính |
| L2 PHÒNG KHÁCH | 4 | 144 | 14400 | 20.72 | 3.30 | 0.89 | 0.48 | **268 lx** | 150 lx ✓ |
| L3 CẦU THANG | 2 | 16 | 0 | — | — | — | — | — | không tính |
| L4 PHÒNG NGỦ 1 | 3 | 52 | 3600 | 8.02 | 3.30 | 0.55 | 0.38 | **138 lx** | 100 lx ✓ |
| L5 WC CHUNG | 2 | 26 | 1600 | 2.58 | 3.30 | 0.31 | 0.29 | **142 lx** | 100 lx ✓ |
| L6 TIỀN PHÒNG WC | 1 | 12 | 1100 | 2.03 | 3.30 | 0.28 | 0.28 | **121 lx** | 100 lx ✓ |
| L7 PHÒNG NGỦ MASTER | 5 | 76 | 5800 | 14.30 | 3.30 | 0.74 | 0.44 | **143 lx** | 100 lx ✓ |
| L8 BAN CÔNG SAU | 2 | 24 | 2000 | — | — | — | — | — | không tính |
| L9 HÀNH LANG | 3 | 36 | 3300 | 5.00 | 3.30 | 0.29 | 0.28 | **148 lx** | 100 lx ✓ |
| R1 SÂN CHÍNH | 2 | 20 | 0 | — | — | — | — | — | không tính |
| R4 SÂN PHƠI / GIẶT | 2 | 22 | 1000 | — | — | — | — | — | không tính |
| MÁI | 1 | 10 | — | — | — | — | — | — | không tính |

**Cụm đèn và công tắc** — 19 cụm, 12 bảng công tắc (mặt công tắc chữ nhật 120 × 75, tối đa 4 hạt). Mỗi hạt bật / tắt đúng một cụm; cụm có hạt ở hai bảng là **công tắc hai chiều** — đi thêm dây giữa hai bảng.

| Cụm | Tên | Đèn | W | Hạt ở bảng |
|---|---|---|---:|---|
| CĐ1 | Cổng | Đ1 | 10 | BCT1 |
| CĐ2 | Hiên cửa chính | Đ2, Đ3 | 24 | BCT1 |
| CĐ3 | Phòng khách — phía sofa | Đ4, Đ6 | 72 | BCT1 |
| CĐ4 | Phòng khách — phía lối đi | Đ5, Đ7 | 72 | BCT1 |
| CĐ5 | Cầu thang | Đ8, Đ9 | 16 | BCT3, BCT4 (hai chiều) |
| CĐ6 | Sân thượng | Đ10 | 10 | BCT4 |
| CĐ7 | Hành lang | Đ11, Đ12, Đ13 | 36 | BCT3, BCT7 (hai chiều) |
| CĐ8 | PN1 — đèn trần | Đ14 | 36 | BCT5, BCT6 (hai chiều) |
| CĐ9 | PN1 — đầu giường | Đ15, Đ16 | 16 | BCT5, BCT6 (hai chiều) |
| CĐ10 | WC chung — đèn trần | Đ17 | 18 | BCT9 |
| CĐ11 | Tiền phòng WC | Đ18 | 12 | BCT7 |
| CĐ12 | WC chung — gương | Đ19 | 8 | BCT9 |
| CĐ13 | Master — đèn trần | Đ20 | 36 | BCT8, BCT10 (hai chiều) |
| CĐ14 | Master — lối vào, bàn làm việc | Đ21, Đ22 | 24 | BCT8 |
| CĐ15 | Master — đầu giường | Đ23, Đ24 | 16 | BCT8, BCT10 (hai chiều) |
| CĐ16 | Ban công sau | Đ25, Đ26 | 24 | BCT11 |
| CĐ18 | Sân chính | Đ28, Đ29 | 20 | BCT2 |
| CĐ22 | Sân phơi | Đ37 | 12 | BCT12 |
| CĐ23 | Sân giếng | Đ38 | 10 | BCT12 |

| Bảng | Phòng | Vị trí | Tâm cao | Hạt (từ trái) | Ghi chú |
|---|---|---|---:|---|---|
| BCT1 | PHÒNG KHÁCH | tường y = 13.50, x 4.30, quay + | 1.25 m | CĐ3 · CĐ4 · CĐ2 · CĐ1 | Phòng khách — trong cửa chính D1, phía phải |
| BCT2 | PHÒNG KHÁCH | tường x = 4.50, y 16.70, quay − | 1.25 m | CĐ18 | Phòng khách — cạnh cửa D2 ra sân chính, phía then cửa |
| BCT3 | HÀNH LANG | tường x = 4.50, y 18.80, quay − | 1.25 m | CĐ7 · CĐ5 | Hành lang — đầu bắc, cạnh chân cầu thang |
| BCT4 | CẦU THANG | tường y = 18.50, x 3.20, quay + | 1.25 m | CĐ5 · CĐ6 | Đầu thang — trong tum, vách bắc sát cửa ra mái; cao tính từ mặt mái |
| BCT5 | PHÒNG NGỦ 1 | tường x = 3.50, y 21.54, quay − | 1.25 m | CĐ8 · CĐ9 | Phòng ngủ 1 — trong cửa D5, phía then cửa |
| BCT6 | PHÒNG NGỦ 1 | tường x = 0.00, y 21.03, quay + | 0.75 m | CĐ9 · CĐ8 | Phòng ngủ 1 — đầu giường, ngay trên kệ đầu giường |
| BCT7 | HÀNH LANG | tường x = 4.50, y 24.10, quay − | 1.25 m | CĐ7 · CĐ11 | Hành lang — đầu nam, tường đông đối diện tiền phòng WC, gần cửa master |
| BCT8 | PHÒNG NGỦ MASTER | tường y = 24.50, x 3.35, quay + | 1.25 m | CĐ13 · CĐ14 · CĐ15 | Master — trong cửa D8, phía then cửa |
| BCT9 | TIỀN PHÒNG WC | tường x = 2.00, y 24.04, quay + | 1.25 m | CĐ10 · CĐ12 | Tiền phòng WC — ngoài cửa WC chung D14, phía then cửa |
| BCT10 | PHÒNG NGỦ MASTER | tường x = 0.00, y 24.82, quay + | 0.75 m | CĐ15 · CĐ13 | Master — đầu giường, trên tủ đầu giường phía cửa |
| BCT11 | PHÒNG NGỦ MASTER | tường y = 28.00, x 0.45, quay − | 1.25 m | CĐ16 | Master — cạnh cửa lùa ban công D12 |
| BCT12 | SÂN PHƠI / GIẶT | tường x = 4.50, y 27.80, quay + | 1.25 m | CĐ22 · CĐ23 | Sân phơi — công tắc chống nước trên tường nhà chính, dưới mái |

---

## 9. Điểm cần lưu ý

Thang lên mái đã thu từ 0.90 xuống 0.76 m mỗi vế để vừa nhà 4.5 m; lối đi hẹp hơn bản cũ. Đường giả định ngang nền lô B, rộng 4 m để minh hoạ; chưa có số đo đường thực tế. **Bản hiện hành không còn bếp.** Vị trí nấu ăn mới chưa được bố trí. Sân chính không có mái: đường từ cửa phụ tới sân giặt/phơi đi ngoài trời. Mái sân phơi độc lập có máng và ống thoát nước ở mép thấp. Giữ hai vòi nước và máy giặt trên bệ nâng dưới mái sân phơi. Các phương án cũ vẫn giữ khuôn 9.5 × 30 m để đối chiếu.

## 10. Kết quả bộ kiểm tra

**Sạch — qua toàn bộ 18 phép kiểm.**

1. Cột trái lấp kín phần lô của nó, không hở không chồng
2. Cột phải lấp kín phần lô còn lại
3. Chuỗi kích thước dọc cộng đủ chiều sâu lô
4. Diện tích kín khai báo khớp tính toán
5. Chuỗi kích thước khớp ranh giới phòng thật
6. Mọi mã cửa có mô tả
7. Mọi mã cửa sổ có mô tả
8. Mã cửa sổ liên tục W1…Wn
9. Cửa có cánh nằm gọn trên một đoạn tường
10. Mọi phòng kín có ít nhất một cửa
11. Hai lỗ mở trên cùng tường không chồng nhau
12. Nội thất nằm trong phòng và không chồng nhau
13. Nội thất không nằm trong vùng quét cánh cửa
14. Bậc, mái hiên, diềm mái hiên, tường nâng, cốt sàn riêng, lớp chống nóng mái khai đúng chỗ; bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa
15. Mái nhẹ khai đủ và không chồng nhau; mái nào trùm phòng kín thì trùm trọn và có cốt trần; cột đỡ mái nằm trong lô, dưới một mái nhẹ, không đứng giữa nội thất
16. Cầu thang lên mái: vế và chiếu nghỉ khớp lỗ thang, cao bậc và mặt bậc trong giới hạn, nằm gọn trong phòng, không vướng nội thất hay cánh cửa; có tum trùm kín lỗ thang, cửa tum trên vách; có lan can mép mái đứng trên mái bê tông
17. Đèn: mã không trùng, đúng loại; đèn trần có trần hay mái bên trên để gắn, không treo trên lỗ thang; đèn tường nằm trên tường có thật, không đè lỗ cửa; phòng nào cũng có đèn; phòng khai ngưỡng độ rọi thì đèn trần đạt ngưỡng; khai công tắc thì đèn nào cũng thuộc đúng một cụm, cụm nào cũng có hạt công tắc, bảng công tắc trên tường thật, không đè lỗ cửa, không quá số hạt
18. Cây xanh: chậu cây, bồn hoa, ô gốc cây bóng mát nằm gọn trong lọt lòng một cái sân, không đè phòng kín; tán cây không vươn ra ngoài lô; bồn hoa áp trọn một bức tường, không chắn cửa hay cổng; không chồng bậc, nội thất, giàn phơi, cột, trụ cổng, không nằm trong vùng quét cánh cửa hay cánh cổng, không chồng nhau

---

## 11. Lịch sử phiên bản

| Bản | Nội dung | DT kín |
|---|---|---:|
| v1 | Hiện trạng (original-drawing.png) | 127.0 |
| v2 | Khuyến nghị lần 1 | 129.0 |
| v3 | Sau 7 điểm chỉnh | 121.5 |
| v4 | Sân sau thu nhỏ, lưu thông qua sân chính | 134.0 |
| v5 | Thu gọn phòng, ghi số thông thủy | 124.5 |
| v6 | Kho mở từ master, WC thu bề rộng | 124.5 |
| v7 | WC khách thu nhỏ, chỉnh cửa | 122.7 |
| v8 | Nhà chính rút còn 16 m | 102.7 |
| v9 | Khách 5×5, cửa dồn sát mép | 107.7 |
| v10 | Nội thất áp tường trái | 107.7 |
| v11 | Bàn làm việc, kệ bếp áp tường sau | 107.7 |
| current ← | lô 8.5 × 30 m | 65.3 |

### Thay đổi ở Hiện hành — lô 8.5 × 30 m

- Bỏ đoạn tường hồi gấp khúc tại x=4.5; đưa cổng về y=0 thẳng hàng tường mặt tiền. Sân mở cổng 2.3 m, dốc từ y=2.30 tới 8.70 m; bồn hoa lùi sau đầu dốc 0.25 m.
- Bỏ hai trụ và toàn bộ mái cổng; bỏ hai đoạn tường ngang thu hẹp lối vào. Cổng phủ hết ngang lô chính 4.5 m, lọt lòng 4.28 m; cánh bắt vào tường hai bên. Sân mở cổng tăng lên 2.3 m, đèn cổng chuyển sang tường trái.
- Khuôn 8.5 m: nhà/lô chính 4.5 m + lô phụ 4 m; lô A bên cạnh 4.5 m. Cổng thu còn 3.1 m để mái và hai trụ nằm trong ranh; hành lang trong giữ 1 m. Thang hai vế rộng 0.76 m, mặt bậc 0.25 m, 11 + 11 nấc.
- Xây kín đoạn tường hồi trái vào cổng; nâng các đoạn thấp phía mặt cổng lên cùng đỉnh 2.10 m so với sân trên (2.90 m so với đường), nối sát hai trụ.
- Lùi tim cổng và hai trụ vào sân 1 m: mái nằm trọn trong đất, mép ngoài cách ranh 0.15 m. Giữ khoảng bằng 2 m sau cổng để mở cánh, dốc nối tiếp phía trong.
- Hạ cổng ngang mặt đường/nền lô B; sân bằng 2 m để mở cánh, dốc trong sân phụ dài 6.4 m lên 0.80 m (12.5%). Mặt đường rộng 4 m chỉ để minh hoạ.
- Khuôn đất ngang **8.5 m**: lô chính 4.5 m + lô phụ 4 m; chiều sâu giữ 30 m, diện tích 255 m².
- Bỏ khối bếp + nhà ăn, hành lang ngoài và WC khách, gồm tường, cửa, nội thất và hệ điện đi kèm.
- Bỏ mái che sân chính và mái bếp; sân chính mở rộng thành 4 × 25 m, thông tới sân phơi 4 × 5 m.
- Nâng nền đất/sân nhà mình và lô A cao hơn lô B **0.80 m**; sàn nhà cao hơn nền lô B 1.25 m.
- Nâng tường giáp lô B bằng phía lô A: phần xây cao 0.80 m trên sân, đỉnh lan can cao 1.80 m trên sân; giữ chênh nền 0.80 m.
- Giữ hành lang trong nhà và bố cục lô chính; mái sân phơi có cột đỡ độc lập, rào sau khép kín tới ranh 8.5 m.
