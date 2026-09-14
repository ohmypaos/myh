# Đặc tả mặt bằng — Hiện hành — cầu thang lên mái, tum

> Sinh tự động từ `lib/versions/current.js` lúc 09:59:46 14/9/2026. Không chép tay.
> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–9.5). Y→xuống (0–30).
> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.
> Tường bao **220 mm** · Tường ngăn **100 mm**.

Phòng khách 5.0 × 5.0 m, mặt tiền nhà lùi vào y 13.5 cho sân phụ dài 13.5 m; phòng ngủ 1 4.0 × 2.5 m; master 5.0 × 3.5 m. WC chung và phòng kho master đều 2.0 × 1.5 m, với cạnh 2 m dọc vách phòng ngủ 1. Ban công sau 2.0 m, bếp chữ L. Bếp và hành lang ngoài chung một mái tôn hai mái dốc 30% (thay bản bê tông); mái sân chính 4.5 × 6 m và mái sân phơi gá thấp dưới hai mép đua của nó. Sân giếng sát tường bếp có hai vòi âm tường và một máy giặt/sấy dồn vào góc giữa tường bếp và tường nhà chính, dưới mái tôn hiện hữu. Cầu thang chữ U lên mái ở chỗ phòng thờ cũ, thông với phòng khách qua bức lửng; tum xây gọn che đầu thang, một cửa ra thẳng mái, lan can thép quanh mép mái kể cả mái hiên trước — chuẩn bị cho tầng 2 sau khoảng 5 năm. Hệ đèn 40 bộ ốp nổi, độ rọi chung từng phòng tính theo quang thông. Cây xanh: hai chậu cây hai bên bậc cửa chính, bồn hoa xây dọc tường bao trái sân phụ, hai chậu cây ở ban công sau, hai cây bóng mát ở góc sân chính phía cổng.

---

## 1. Tổng quan

| Mục | Tim tường | Sử dụng |
|---|---:|---:|
| Lô đất 9.5 × 30 | 285.00 m² | — |
| **Khối nhà chính** | **72.50 m²** | 65.94 m² |
| **Toàn bộ phần kín** | **100.00 m²** | 91.05 m² |
| Hành lang ngoài (có mái, hở) | 7.00 m² | — |
| Sân trống | 178.00 m² | — |
| Tường chiếm chỗ | 8.95 m² | — |

Nhà chính chạy từ `y = 13.5` tới `y = 30.0` → **dài 16.5 m**.

## 2. Bảng phòng

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |
|---|---|---:|---:|---:|---:|---|---:|---|---:|---|
| L1 | SÂN PHỤ | 0.0 | 0.0 | 5.0 | 13.5 | 5.0 × 13.5 | 67.50 | 4.89 × 13.28 | 64.94 | Sân |
| L2 | PHÒNG KHÁCH | 0.0 | 13.5 | 5.0 | 18.5 | 5.0 × 5.0 | 25.00 | 4.78 × 4.84 | 23.14 | Phòng |
| L3 | CẦU THANG | 0.0 | 18.5 | 4.0 | 20.5 | 4.0 × 2.0 | 8.00 | 3.89 × 1.90 | 7.39 | Lưu thông |
| L4 | PHÒNG NGỦ 1 | 0.0 | 20.5 | 4.0 | 23.0 | 4.0 × 2.5 | 10.00 | 3.84 × 2.40 | 9.22 | Phòng |
| L5 | PHÒNG KHO MASTER | 0.0 | 23.0 | 2.0 | 24.5 | 2.0 × 1.5 | 3.00 | 1.84 × 1.40 | 2.58 | Tủ âm |
| L6 | WC CHUNG | 2.0 | 23.0 | 4.0 | 24.5 | 2.0 × 1.5 | 3.00 | 1.90 × 1.40 | 2.66 | Vệ sinh |
| L7 | PHÒNG NGỦ MASTER | 0.0 | 24.5 | 5.0 | 28.0 | 5.0 × 3.5 | 17.50 | 4.78 × 3.34 | 15.97 | Phòng |
| L8 | BAN CÔNG SAU | 0.0 | 28.0 | 5.0 | 30.0 | 5.0 × 2.0 | 10.00 | 4.78 × 1.78 | 8.51 | Sân |
| L9 | HÀNH LANG | 4.0 | 18.5 | 5.0 | 24.5 | 1.0 × 6.0 | 6.00 | 0.84 × 5.95 | 5.00 | Lưu thông |
| R1 | SÂN CHÍNH | 5.0 | 0.0 | 9.5 | 18.0 | 4.5 × 18.0 | 81.00 | 4.39 × 17.78 | 78.05 | Sân |
| R2 | BẾP + NHÀ ĂN | 5.0 | 18.0 | 8.5 | 25.0 | 3.5 × 7.0 | 24.50 | 3.34 × 6.78 | 22.65 | Phòng |
| R3 | HÀNH LANG NGOÀI | 8.5 | 18.0 | 9.5 | 25.0 | 1.0 × 7.0 | 7.00 | 0.84 × 7.00 | 5.88 | Lưu thông |
| R4 | SÂN PHƠI / GIẶT | 5.0 | 25.0 | 9.5 | 30.0 | 4.5 × 5.0 | 22.50 | 4.28 × 4.78 | 20.46 | Sân |
| R5 | WC KHÁCH | 8.0 | 28.0 | 9.5 | 30.0 | 1.5 × 2.0 | 3.00 | 1.34 × 1.84 | 2.47 | Vệ sinh |

**Kiểm tra:** cột trái 150.00 + cột phải 135.00 = **285.00 m²** (WC khách nằm trong sân phơi, không cộng riêng)
**Chuỗi dọc lô chính:** 13.5 + 5.0 + 2.0 + 2.5 + 1.5 + 3.5 + 2.0 = **30.0**

## 3. Bảng cửa

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |
|---|---|---:|---:|---:|---:|---|---|---|
| D1 | ngang | 13.5 | 0.90 | 4.10 | 3.20 | 4 cánh | — | Sân phụ ↔ Phòng khách — CỬA CHÍNH 4 cánh, tâm x = 2.5 |
| D2 | dọc | 5.0 | 16.85 | 17.85 | 1.00 | Mở quay | bản lề đầu lớn, mở + | Sân chính ↔ Phòng khách — mở ra sân chính, bản lề phía W2; sát tường bếp (chừa 4 cm khuôn), cánh mở áp dọc tường bếp, bậc phía bếp chạy tới mặt tường — không chừa góc thừa |
| D3 | ngang | 18.5 | 4.00 | 5.00 | 1.00 | Mở thông | — | Phòng khách ↔ Hành lang — thông suốt, KHÔNG có cánh cửa |
| D4 | dọc | 4.0 | 18.50 | 20.50 | 2.00 | Mở thông | — | Hành lang ↔ Cầu thang — thông suốt, chân thang ở đầu bắc hành lang |
| D5 | dọc | 4.0 | 20.59 | 21.39 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ Phòng ngủ 1 — sát vách buồng thang (chừa 4 cm khuôn), không chừa góc thừa |
| D6 | dọc | 4.0 | 23.09 | 23.89 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ WC chung — cửa cánh 0.80 m mở vào WC, bản lề sát vách PN1 (chừa 4 cm khuôn) để cánh mở áp vách, gioăng kín mùi |
| D8 | ngang | 24.5 | 4.00 | 4.90 | 0.90 | Mở quay | bản lề đầu lớn, mở + | Hành lang ↔ Master — mở vào phòng |
| D9 | ngang | 18.0 | 6.60 | 7.80 | 1.20 | Mở quay 2 cánh | bản lề hai đầu, mở + | Sân chính ↔ Bếp — 2 cánh nhỏ 0.60 m mở vào bếp, rộng 1.20 m bê đồ ra sân |
| D10 | ngang | 25.0 | 7.40 | 8.20 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Bếp ↔ Sân phơi — mở vào bếp |
| D11 | ngang | 28.0 | 8.09 | 8.89 | 0.80 | Mở quay | bản lề đầu nhỏ, mở + | Sân phơi ↔ WC khách — mở vào WC như WC chung, bản lề sát tường trái WC (chừa 4 cm khuôn); sàn WC cao hơn sân 0.15 nên chỉ bước qua ngưỡng, không có bậc |
| D12 | ngang | 28.0 | 0.90 | 4.10 | 3.20 | Lùa 2 cánh | — | Master ↔ Ban công sau — kính lùa 3.2 m, nguồn sáng duy nhất của master |
| D13 | dọc | 5.0 | 28.60 | 29.40 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Ban công sau ↔ Sân phơi — mở vào ban công, chừa phía sân phơi cho bậc; bản lề phía tường bao sau |
| D14 | ngang | 24.5 | 1.00 | 1.80 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Master ↔ phòng kho — cửa cánh 0.80 m mở vào kho; bản lề đầu phải, vách ngăn kín tới trần |

## 4. Bảng cửa sổ

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |
|---|---|---:|---:|---:|---:|---|
| W1 | dọc | 5.0 | 14.33 | 16.13 | 1.80 | Phòng khách ← Sân chính — 1.8 m, nằm giữa mặt trong tường mặt tiền và cửa D2, trụ hai bên 0.72 m |
| W2 | ngang | 18.0 | 5.30 | 6.30 | 1.00 | Bếp ← Sân chính |
| W3 | dọc | 8.5 | 19.20 | 21.20 | 2.00 | Bếp ← Hành lang ngoài |
| W4 | dọc | 8.0 | 28.70 | 29.30 | 0.60 | WC khách ← Sân phơi — ô thoáng kính mờ lật, bệ 2.00, kèm quạt hút; trên khu tắm |
| W5 | ngang | 20.5 | 3.00 | 3.40 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |
| W6 | ngang | 20.5 | 3.50 | 3.90 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |

## 6. Cổng, bậc, mái

| Trục | Vị trí | Từ | Đến | Rộng | Tên |
|---|---:|---:|---:|---:|---|
| ngang | 0.0 | 0.70 | 4.30 | 3.60 | CỔNG CHÍNH 3.6m |

### Trụ và mái cổng

Mỗi cổng có hai trụ xây vuông đặt **ngoài** khoảng thông; mái ngói hai dốc có sống mái trên tim rào, một bên đua ra đường và bên kia đua vào sân. Bề rộng cổng trong bảng trên là lối thông giữa hai mặt trong trụ.

| Mã | Cổng | Trụ vuông | Đua mỗi phía | Mép mái | Nóc mái | Vật liệu |
|---|---|---:|---:|---:|---:|---|
| GC1 | CỔNG CHÍNH 3.6m | 0.50 × 0.50 | 0.85 | 2.50 | 3.00 | trụ gạch vuông 500 × 500, giằng BTCT và mái ngói hai dốc ra đường và vào sân |

### Cánh cổng sắt

Hai cánh có bản lề ở mặt trong hai trụ, mở vào sân; khung thép hộp với ba đố ngang và nan đứng.

| Mã | Cổng | Cao | Khung | Nan | Bước nan tối đa | Vật liệu |
|---|---|---:|---:|---:|---:|---|
| CG1 | CỔNG CHÍNH 3.6m | 2.10 | 0.06 | 0.03 | 0.12 | khung thép hộp, 3 đố ngang và nan sắt đứng |

### Bậc tam cấp

Vị trí suy từ cửa, đặt phía thấp, bắt đầu từ mặt tường. Số bậc không tính nấc trên cùng — nấc đó chính là ngưỡng cửa.

| Cửa | Xuống | x₁ | y₁ | x₂ | y₂ | Dư mỗi bên | Số bậc | Cao bậc | Mặt bậc |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| D1 | SÂN PHỤ | 0.60 | 12.79 | 4.40 | 13.39 | 0.30 | 2 | 0.15 | 0.30 |
| D2 | SÂN CHÍNH | 5.11 | 16.65 | 5.61 | 17.89 | 0.20 / 0.04 | 2 | 0.15 | 0.25 |
| D13 | SÂN PHƠI / GIẶT | 5.11 | 28.40 | 5.61 | 29.60 | 0.20 | 2 | 0.15 | 0.25 |

### Bản mái đổ ra ngoài tường

Mái hiên, trần ban công — cùng cốt bản mái nhà, bề đua tính từ mặt tường.

| Trục | Vị trí | Từ | Đến | Đua ra | Ghi chú |
|---|---:|---:|---:|---:|---|
| ngang | 13.5 | -0.1 | 5.1 | 1.20 | Mái hiên cửa chính — đổ liền bản mái nhà, công xôn không cột, che bậc D1 |
| ngang | 28.0 | -0.1 | 5.1 | 1.89 | Trần ban công sau — đổ liền bản mái, gác lên tường trái; thay cho lam đứng D12 |

**Diềm mép mái hiên** — khung thép hộp mạ kẽm, ốp tấm gỗ nhựa ngoài trời màu nâu óc chó. Dải cao 0.45 m, dày 0.05 m, áp mặt ngoài bản; đỉnh bằng mặt lát mái, phía dưới buông thấp hơn mặt dưới bản — không nhô trên mặt lát để khỏi chặn nước thoát ra mép. Bọc mép ngoài và hai đầu, trừ cạnh nằm trên ranh lô: trục ngang 13.5 — 2 dải, dài 6.47 m, cốt 3.64 → 4.09 (đầu toạ độ nhỏ nằm trên ranh lô, không ốp).

### Lớp chống nóng mái

Kiểu **mái ngược**: chống thấm nằm dưới tấm cách nhiệt, được che nắng và đỡ co giãn nhiệt. Phủ mọi sàn mái bê tông (PHÒNG KHÁCH, CẦU THANG, PHÒNG NGỦ 1, PHÒNG KHO MASTER, WC CHUNG, PHÒNG NGỦ MASTER, HÀNH LANG, WC KHÁCH) và mái hiên cửa chính, trần ban công sau, tới mặt ngoài tường; chừa giếng trời — quanh mỗi lỗ xây gờ chắn nước cao hơn mặt lát. Diện tích lát **88.28 m²**, mặt lát cốt **4.09** (bản mái 4.00, chưa tính vữa tạo dốc). Lát **rời**, không cán vữa: xây tầng 2 thì nhấc tấm, cuộn vải địa, gỡ XPS — không phải đục, không phạm vào lớp chống thấm.

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
| RF1 | MÁI SÂN CHÍNH | 5.0 · 13.5 · 9.5 · 18.0 | 5.11 · 13.50 · 9.61 · 18.00 | dốc một mái theo y (dốc 10%) | 3.05 → 3.50 | tôn cách nhiệt |
| RF2 | MÁI BẾP + HÀNH LANG | 5.0 · 18.0 · 9.5 · 25.0 | 5.11 · 17.69 · 9.61 · 25.31 | hai mái, nóc theo y ở 21.5 (dốc 30%) | 3.75 → 4.80 | tôn cách nhiệt |
| RF3 | MÁI SÂN PHƠI | 5.0 · 25.0 · 9.5 · 28.0 | 5.11 · 25.00 · 9.61 · 28.00 | dốc một mái theo y (dốc 10%) | 3.50 → 3.20 | tôn cách nhiệt |

- RF2 có **trần tôn cốt 3.75** — BẾP + NHÀ ĂN không đổ mái bê tông; cách sàn phòng 3.60 m

**Máng xối** — suy ra ở mép thấp của mái nhẹ. Không có máng ở đoạn mép nối liền mạch sang mái khác cùng cao độ (nước chảy tiếp) và đoạn đua ra trên một mái thấp hơn (nước rơi xuống mái ấy). Miệng máng ngang mặt dưới mái ở mép, rộng 0.15 m, sâu 0.12 m.

| Mái | Mép | Từ | Đến | Dài | Miệng máng | Đặt |
|---|---|---:|---:|---:|---:|---|
| RF1 | y = 13.50 | 5.11 | 9.45 | 4.34 | 3.05 | dưới mép mái |
| RF3 | y = 27.95 | 7.95 | 9.47 | 1.52 | 3.21 | trong mép, sát chân tường cao hơn mái |
| RF3 | y = 28.00 | 5.11 | 7.95 | 2.84 | 3.20 | dưới mép mái |

**Ống xả đứng** — mỗi dải máng một ống 90 mm ở đầu sát tường bao, chạy thẳng xuống, cắm dưới cốt sân vào ống ngầm — không đổ ra sân.

| Mái | x₁ | y₁ | x₂ | y₂ | Từ cốt (đáy máng) | Áp |
|---|---:|---:|---:|---:|---:|---|
| RF1 | 9.30 | 13.46 | 9.39 | 13.54 | 2.93 | mặt trong tường bao |
| RF3 | 9.30 | 27.83 | 9.39 | 27.92 | 3.08 | mặt trong tường bao |

**Cột đỡ mái nhẹ** — thép hộp 100 × 100, đứng ở chỗ mép mái không tựa lên tường cao tới mái. Vị trí khai theo tâm cột; chiều cao suy ra: từ cốt sân tới đáy dầm biên trên đầu cột. Nhịp giữa hai chỗ đỡ dọc một mép mái không quá 4.5 m.

| Mã | x | y | Đỉnh cột | Đỡ mái | Dưới dầm |
|---|---:|---:|---:|---|---|
| C1 | 9.50 | 13.50 | 2.95 | RF1 | có |
| C2 | 9.50 | 15.75 | 3.17 | RF1 | có |
| C3 | 9.50 | 18.05 | 3.65 | RF2 | có |
| C4 | 9.50 | 21.50 | 4.68 | RF2 | có |
| C5 | 9.50 | 24.95 | 3.65 | RF2 | có |

**Dầm biên** — thép hộp 50 × 100, suy ra dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái, từ mặt tường tới mặt tường, đi qua đầu cột. Mặt trên chạm mặt dưới mái (dầm dọc chiều dốc nghiêng theo mái); ở mép có máng thì dầm lùi vào sau máng, đoạn chui dưới máng hạ xuống đáy máng.

| Mái | Tuyến | Từ | Đến | Dài | Mặt trên | Ghi chú |
|---|---|---:|---:|---:|---|---|
| RF1 | y = 13.50 | 5.11 | 9.47 | 4.36 | 3.06 → 3.06 |  |
| RF1 | y = 18.00 | 8.55 | 9.47 | 0.92 | 3.50 → 3.50 |  |
| RF1 | x = 9.50 | 13.50 | 18.00 | 4.50 | 3.05 → 3.50 | nghiêng theo mái |
| RF2 | y = 18.00 | 8.55 | 9.47 | 0.92 | 3.75 → 3.75 |  |
| RF2 | y = 25.00 | 8.55 | 9.47 | 0.92 | 3.75 → 3.75 |  |
| RF2 | x = 9.50 | 18.00 | 21.50 | 3.50 | 3.75 → 4.80 | nghiêng theo mái |
| RF2 | x = 9.50 | 21.50 | 25.00 | 3.50 | 4.80 → 3.75 | nghiêng theo mái |
| RF3 | y = 25.00 | 8.55 | 9.47 | 0.92 | 3.50 → 3.50 |  |
| RF3 | y = 28.00 | 5.11 | 7.95 | 2.84 | 3.21 → 3.21 |  |
| RF3 | x = 9.50 | 25.00 | 27.95 | 2.95 | 3.50 → 3.21 | nghiêng theo mái |

**Xà gồ** — thép hộp 40 × 80, đặt vuông góc chiều dốc, mặt trên chạm mặt dưới tôn. Số hàng suy ra để bước dọc mái không quá 1.20 m; mỗi thanh dừng ở mặt tường hoặc dầm biên, nhịp không quá 4.50 m.

| Mái | Mã | Tuyến | Từ | Đến | Nhịp | Mặt trên |
|---|---|---|---:|---:|---:|---:|
| RF1 | RF1-P1 | y = 14.63 | 5.11 | 9.47 | 4.36 | 3.16 |
| RF1 | RF1-P2 | y = 15.75 | 5.11 | 9.47 | 4.36 | 3.27 |
| RF1 | RF1-P3 | y = 16.88 | 5.11 | 9.47 | 4.36 | 3.39 |

### Cầu thang lên mái

Cao bậc suy ra từ mặt sàn tới mặt mái đi lại được chia đều số nấc; nấc cuối mỗi vế lên chiếu nghỉ / mặt mái, nên số mặt bậc ít hơn số nấc một. Bản thang dày 0.12 m dưới mặt bậc, gầm thang hở. Lỗ thang cũng là lỗ khoét bản mái.

| Mã | Tên | Lỗ thang x₁ · y₁ · x₂ · y₂ | Rộng vế | Nấc (vế 1 + vế 2) | Cao bậc | Mặt bậc | Chiếu nghỉ | Từ cốt → tới cốt |
|---|---|---|---:|---|---:|---:|---:|---|
| CT1 | CẦU THANG LÊN MÁI | 0.11 · 18.55 · 3.87 · 20.45 | 0.90 | 10 + 12 | 0.170 | 0.26 | 2.15 | 0.45 → 4.19 |

Lan can thang cao 0.90 m dọc mép vế 2 giáp phòng khách (trên bức lửng cao 1.00 m) và ở mép lỗ thang trên mặt mái. Khe giữa hai vế rộng 0.10 m: mỗi vế một tay vịn ở mép trong, chết vào một trụ ở đầu khe trên chiếu nghỉ.

### Tum

Tường gạch 100 trát sơn, mái tôn, ô lấy sáng polycarbonate, ô thoáng lá kính gắn tường xếp nghiêng sát mái. Vùng 0.00 · 18.50 · 3.92 · 20.50 (tim vách), sàn là mặt mái cốt 4.09, mặt dưới mái tum 6.79; tường dày 100 mm, ô thoáng cao 0.30 m sát mái trên hai vách dài, gắn 4 lá kính cố định xếp nghiêng chéo xuống ra ngoài (lá trên chồng mép lá dưới — mưa hắt, lá cây không vào). Mái tum đua ngắn 0.18 m ra khỏi mặt ngoài tường (cạnh trên ranh lô không đua), mép bọc diềm gập cao 0.12 m. Trên cửa có ô văng đua 0.60 m, dài hơn cửa 0.20 m mỗi bên. Cửa ra mái có cánh mở vào trong tum, chốt từ trong nhà, ngưỡng có gờ chắn nước cao 0.10 m, cao 2.20 m tính từ mặt mái:vách x = 3.92, y 18.63–19.43. Ô polycarbonate đậy trọn lỗ thang. Dỡ đi khi xây tầng 2.

### Lan can mái

Lan can thép sơn, trụ bắt nở vào đỉnh tường, cao 1.10 m từ mặt mái cốt 4.09.

| Trục | Vị trí | Từ | Đến | Dài |
|---|---:|---:|---:|---:|
| ngang | 12.23 | 0.00 | 5.00 | 5.00 |
| dọc | 0.00 | 12.23 | 18.50 | 6.27 |
| dọc | 0.00 | 20.50 | 30.00 | 9.50 |
| ngang | 30.00 | 0.00 | 5.00 | 5.00 |
| dọc | 5.00 | 12.23 | 19.13 | 6.90 |
| dọc | 5.00 | 23.87 | 30.00 | 6.13 |

### Bồn nước trên mái

Bồn inox 1000 L nằm ngang, giá thép sơn hai bộ kiềng, chân có bản đế dàn tải. Thân Ø 0.96 × 1.59 m trên giá cao 0.60 m; bốn chân thép 50 × 50 mm, mỗi chân một **bản đế 300 × 300 mm** dàn tải xuống lớp chống nóng — chân trần đặt thẳng lên tấm lát thì ép quá sức XPS.

| Mã | Dung tích | Trục nằm | Hình chiếu x₁ · y₁ · x₂ · y₂ | Chân giá cốt | Đỉnh bồn cốt |
|---|---:|---|---|---:|---:|
| BN1 | 1000 L | dọc | 3.79 · 28.26 · 4.75 · 29.85 | 4.09 | 5.65 |

### Giàn phơi

Giàn phơi trụ thép hộp 50 × 50 sơn tĩnh điện, đầu chữ V chìa hai bên, hai thanh phơi inox Ø27. Mặt cắt **hình tam giác ngược**: trụ cao 1.50 m, trên đầu trụ hai tay chìa vươn lên 0.25 m và ra 0.25 m mỗi bên, đỡ hai thanh phơi ở cốt 1.80 m. Hai thanh vì thế cách nhau 0.50 m theo phương ngang — treo kín cả hai mà quần áo không chạm nhau. Đặt ngoài trời, ở dải sân chừa không lợp mái — treo dưới mái thì mất nắng.

| Mã | Sân | Trục | Tim tuyến | Từ | Đến | Dài tuyến | Hai thanh ở | Tổng dây phơi |
|---|---|---|---:|---:|---:|---:|---|---:|
| GP1 | SÂN PHƠI / GIẶT | ngang | 29.35 | 6.30 | 7.75 | 1.45 m | y 29.10 · 29.60 | 2.90 m |

### Cây xanh

Phối cảnh ngoài sân. Mô hình 3D chỉ dựng khối tượng trưng — chậu trụ tròn, thân trụ, tán cây hình bầu — để cảm tỉ lệ và thấy bóng đổ.

**Cây bóng mát** — cây bóng mát tán gọn (bàng Đài Loan, lộc vừng), ô gốc 1.0 × 1.0 bó vỉa gạch cao 150. Thân Ø 0.25; tán Ø 3.30 dày 2.80 m, mặt dưới tán cao 2.50 m trên mặt sân — đi lại, dắt xe máy dưới tán không vướng cành. Tán không vươn ra ngoài lô. Ô gốc 1.00 × 1.00 m bó vỉa cao 0.15 m.

| Mã | Sân | Tâm gốc x | Tâm gốc y | Tán x₁ · y₁ · x₂ · y₂ | Đỉnh tán cốt | Ghi chú |
|---|---|---:|---:|---|---:|---|
| CX1 | SÂN CHÍNH | 7.85 | 1.75 | 6.20 · 0.10 · 9.50 · 3.40 | 5.30 | Góc sân chính phía cổng — sát rào mặt tiền, tán tới đúng ranh lô phải và ranh mặt tiền |
| CX2 | SÂN CHÍNH | 7.85 | 5.05 | 6.20 · 3.40 · 9.50 · 6.70 | 5.30 | Sân chính dọc rào phải — tán nối liền CX1, dừng trước dải sân trống trước mái sân chính |

**Chậu cây** — chậu gốm / xi măng Ø400 cao 450, cây cảnh dáng đứng. Chậu Ø 0.40 cao 0.45 m; tán Ø 0.44, cao 0.80 m trên miệng chậu.

| Mã | Sân | Tâm x | Tâm y | Đỉnh tán cốt | Ghi chú |
|---|---|---:|---:|---:|---|
| CC1 | SÂN PHỤ | 0.355 | 13.09 | 1.25 | Trái bậc cửa chính D1 — giữa mặt tường trái sân phụ và mép bậc, dưới mái hiên |
| CC2 | SÂN PHỤ | 4.645 | 13.09 | 1.25 | Phải bậc cửa chính D1 — đối xứng CC1 qua trục cửa x = 2.5, dưới mái hiên |
| CC3 | BAN CÔNG SAU | 0.355 | 29.64 | 1.70 | Ban công sau — góc trái sát rào sau, dưới trần ban công |
| CC4 | BAN CÔNG SAU | 4.645 | 29.64 | 1.70 | Ban công sau — góc phải sát rào sau, cạnh cửa D13, ngoài vùng quét cánh |

**Bồn hoa xây** — bó vỉa gạch 100 trát vữa cao 250, lưng áp tường có chống thấm, lỗ thoát nước chân bồn. Rộng 0.50 m tính từ mặt tường, mép bó vỉa cao 0.25 m trên mặt sân, mặt đất trồng thấp hơn mép 0.05 m; khóm hoa chia đều dọc bồn, bước chừng 0.50 m.

| Mã | Sân | Áp tường | Từ | Đến | Dài | Chiếm x₁ · y₁ · x₂ · y₂ | Khóm hoa | Ghi chú |
|---|---|---|---:|---:|---:|---|---:|---|
| BH1 | SÂN PHỤ | x = 0.00 | 0.25 | 12.19 | 11.94 m | 0.11 · 0.25 · 0.61 · 12.19 | 23 | Dọc tường bao trái sân phụ, từ sau trụ cổng tới mép mái hiên — hứng mưa trọn |

### Tường xây lên hết chiều cao nhà

Chiều cao tường mặc định suy từ phòng áp vào; các đoạn dưới đây khai riêng dù chỉ áp vào sân.

| Trục | Vị trí | Từ | Đến |
|---|---:|---:|---:|
| dọc | 0.0 | 28.0 | 30.0 |
| dọc | 5.0 | 28.0 | 30.0 |

### Cốt sàn riêng

Mặc định phòng kín và ban công ở cốt nền nhà, sân ở cốt sân. Các phòng dưới đây khai riêng:

- R2 BẾP + NHÀ ĂN — cao hơn sân **0.15 m**
- R5 WC KHÁCH — cao hơn sân **0.15 m**

### Trần giả

Trần thạch cao / nhựa treo dưới bản mái bê tông, phủ phần lọt lòng; bản mái và tường giữ nguyên cốt.

- R5 WC KHÁCH — trần cao **2.70 m** tính từ sàn phòng (cốt 2.85 so với sân)

## 7. Tường

**Tường rào** (đoạn chỉ áp sân, không phải tường nâng): xây đặc cao **0.80 m** so với sân, phía trên là **lan can song thoáng** tới đỉnh rào **1.80 m** — trụ 80 mm cách nhau ≤ 2.0 m, song 20 mm bước 120 mm; chừa trống trên cổng và cửa.

**Đoạn rào xây kín** — không lan can, để che tầm nhìn; đỉnh đo từ cốt sân, chỗ nào sàn cao hơn sân thì rào nhô lên ít hơn đúng bằng chênh cốt: trục ngang 0.0 (0.0–9.5) đỉnh **2.10 m**; trục ngang 30.0 (0.0–8.0) đỉnh **1.80 m**. Cổng và cửa trên đoạn ấy cao theo đỉnh rào.

| Trục | Vị trí | Từ | Đến | Dày (mm) |
|---|---:|---:|---:|---:|
| ngang | 0.0 | 0.0 | 9.5 | 220 |
| ngang | 30.0 | 0.0 | 9.5 | 220 |
| dọc | 0.0 | 0.0 | 30.0 | 220 |
| dọc | 9.5 | 0.0 | 30.0 | 220 |
| ngang | 13.5 | 0.0 | 5.0 | 220 |
| ngang | 28.0 | 0.0 | 5.0 | 220 |
| dọc | 5.0 | 13.5 | 28.0 | 220 |
| dọc | 5.0 | 28.0 | 30.0 | 220 |
| ngang | 18.5 | 0.0 | 3.7 | 100 |
| ngang | 20.5 | 0.0 | 4.0 | 100 |
| ngang | 23.0 | 0.0 | 4.0 | 100 |
| ngang | 24.5 | 0.0 | 5.0 | 100 |
| dọc | 4.0 | 20.5 | 24.5 | 100 |
| dọc | 2.0 | 23.0 | 24.5 | 100 |
| ngang | 18.0 | 5.0 | 8.5 | 220 |
| ngang | 25.0 | 5.0 | 8.5 | 220 |
| dọc | 8.5 | 18.0 | 25.0 | 100 |
| ngang | 28.0 | 8.0 | 9.5 | 100 |
| dọc | 8.0 | 28.0 | 30.0 | 100 |

## 8. Nội thất

| Loại | x | y | Rộng | Sâu |
|---|---:|---:|---:|---:|
| sofa | 0.25 | 14.80 | 2.60 | 0.85 |
| sofa | 0.25 | 15.65 | 0.85 | 1.20 |
| tbl | 1.40 | 16.05 | 1.30 | 0.80 |
| shrine | 0.11 | 17.95 | 0.70 | 0.50 |
| tvShelf | 0.81 | 17.95 | 2.85 | 0.50 |
| bedw | 0.25 | 21.35 | 1.80 | 1.60 |
| cab | 0.30 | 20.80 | 0.45 | 0.45 |
| cab | 3.35 | 21.75 | 0.60 | 1.20 |
| cab | 0.10 | 23.10 | 0.60 | 1.30 |
| cab | 0.70 | 23.10 | 1.20 | 0.60 |
| lav | 3.40 | 24.00 | 0.55 | 0.45 |
| wc | 2.20 | 23.77 | 0.42 | 0.68 |
| shower | 2.05 | 23.05 | 1.15 | 0.70 |
| bedw | 0.25 | 25.20 | 2.00 | 1.80 |
| cab | 0.30 | 24.60 | 0.45 | 0.45 |
| cab | 0.30 | 27.20 | 0.45 | 0.45 |
| desk | 4.25 | 25.49 | 0.60 | 1.20 |
| desk | 4.25 | 26.69 | 0.60 | 1.20 |
| chair | 3.55 | 25.85 | 0.48 | 0.48 |
| chair | 3.55 | 27.05 | 0.48 | 0.48 |
| kitsink | 5.15 | 24.30 | 2.15 | 0.60 |
| kithob | 5.15 | 21.90 | 0.60 | 2.40 |
| tap | 5.11 | 26.15 | 0.18 | 0.10 |
| tap | 5.11 | 27.25 | 0.18 | 0.10 |
| washRaised | 5.15 | 25.15 | 0.60 | 0.60 |
| lav | 8.99 | 28.05 | 0.40 | 0.55 |
| wc | 8.71 | 29.32 | 0.68 | 0.42 |
| shower | 8.05 | 28.80 | 0.64 | 1.09 |
| round | 5.50 | 14.53 | 1.40 | 1.40 |

### Chiếu sáng

**40 bộ đèn, 675 W, 62000 lm.** Nhà chính đổ bản bê tông thẳng, không trần giả, nên đèn trong nhà là **ốp nổi**; ống luồn dây và hộp đấu đèn trần phải đặt sẵn trong bản mái trước khi đổ. Đèn trần áp mặt dưới vật che thấp nhất ngay trên nó — cao độ trong bảng là suy ra, không khai. Đèn tường cao tính từ sàn phía đèn quay vào.

| Mã | Loại | W | lm | Phòng | Vị trí | Gắn | Thân đèn cốt | Ghi chú |
|---|---|---:|---:|---|---|---|---|---|
| Đ1 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHỤ | 2.50 · 0.00 | trần, cách sàn 2.74 m | 2.66 → 2.74 | Cổng chính — dưới giằng mái cổng, rọi cả phía ngõ lẫn phía sân |
| Đ2 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHỤ | 1.60 · 12.80 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Mái hiên cửa chính — rọi bậc D1, nửa trái |
| Đ3 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHỤ | 3.40 · 12.80 | trần, cách sàn 3.75 m | 3.67 → 3.75 | Mái hiên cửa chính — rọi bậc D1, nửa phải |
| Đ4 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 1.30 · 14.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, trên sofa |
| Đ5 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 3.70 · 14.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, lối từ cửa chính |
| Đ6 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 1.30 · 17.25 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, giữa bàn nước và kệ thờ |
| Đ7 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG KHÁCH | 3.70 · 17.25 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng khách — lưới 2 × 2, trước kệ tivi và cửa D2 |
| Đ8 | đèn tường hắt | 8 | 600 | CẦU THANG | tường x = 0.00, y 19.50, quay + | tường, tâm cao 3.20 m trên sàn | 3.59 → 3.71 | Cầu thang — tường trái ở chiếu nghỉ |
| Đ9 | đèn tường hắt | 8 | 600 | CẦU THANG | tường x = 3.92, y 19.03, quay − | tường, tâm cao 2.35 m trên sàn | 6.38 → 6.50 | Đầu thang — trong tum, trên lanh tô cửa ra mái |
| Đ10 | đèn tường ngoài trời IP65 | 10 | 800 | MÁI | tường x = 3.92, y 19.90, quay + | tường, tâm cao 1.90 m trên sàn | 5.89 → 6.09 | Mái — mặt ngoài tum cạnh cửa, rọi sân thượng và lối tới bồn nước |
| Đ11 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 4.47 · 19.40 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — đầu bắc, chân cầu thang |
| Đ12 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 4.47 · 21.95 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — giữa, trước cửa PN1 |
| Đ13 | downlight ốp nổi Ø150 | 12 | 1100 | HÀNH LANG | 4.47 · 24.10 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Hành lang — đầu nam, trước WC chung và cửa master |
| Đ14 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG NGỦ 1 | 2.03 · 21.75 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Phòng ngủ 1 — giữa phòng; phòng không cửa sổ ra trời, ban ngày cũng cần |
| Đ15 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ 1 | tường x = 0.00, y 21.55, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Phòng ngủ 1 — đọc sách, đầu giường phía kệ |
| Đ16 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ 1 | tường x = 0.00, y 22.75, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Phòng ngủ 1 — đọc sách, đầu giường phía vách kho |
| Đ17 | ốp trần LED Ø400 | 24 | 2400 | PHÒNG KHO MASTER | 1.00 · 23.75 | trần, cách sàn 3.30 m | 3.70 → 3.75 | Phòng kho — giữa khoảng đứng trước hai tủ |
| Đ18 | ốp trần chống ẩm Ø250 IP44 | 18 | 1600 | WC CHUNG | 3.00 · 23.75 | trần, cách sàn 3.30 m | 3.67 → 3.75 | WC chung — ốp trần chống ẩm |
| Đ19 | đèn tường hắt | 8 | 600 | WC CHUNG | tường y = 24.50, x 3.67, quay − | tường, tâm cao 1.85 m trên sàn | 2.24 → 2.36 | WC chung — đèn gương trên lavabo, vách master |
| Đ20 | ốp trần LED Ø500 | 36 | 3600 | PHÒNG NGỦ MASTER | 2.50 · 26.00 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — lệch về phía chân giường, không chói mắt người nằm |
| Đ21 | downlight ốp nổi Ø150 | 12 | 1100 | PHÒNG NGỦ MASTER | 1.90 · 24.70 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — lối vào từ D8, trước cửa phòng kho D14 |
| Đ22 | downlight ốp nổi Ø150 | 12 | 1100 | PHÒNG NGỦ MASTER | 4.35 · 26.70 | trần, cách sàn 3.30 m | 3.69 → 3.75 | Master — trên bàn làm việc |
| Đ23 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ MASTER | tường x = 0.00, y 24.82, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Master — đọc sách, trên tủ đầu giường phía cửa |
| Đ24 | đèn tường hắt | 8 | 600 | PHÒNG NGỦ MASTER | tường x = 0.00, y 27.43, quay + | tường, tâm cao 1.10 m trên sàn | 1.49 → 1.61 | Master — đọc sách, trên tủ đầu giường phía ban công |
| Đ25 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | BAN CÔNG SAU | 1.60 · 29.05 | trần, cách sàn 3.30 m | 3.67 → 3.75 | Ban công sau — dưới trần ban công, nửa trái |
| Đ26 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | BAN CÔNG SAU | 3.40 · 29.05 | trần, cách sàn 3.30 m | 3.67 → 3.75 | Ban công sau — dưới trần ban công, nửa phải |
| Đ27 | đèn thả chao Ø350 IP65 | 15 | 1300 | SÂN CHÍNH | 6.20 · 15.23 | thả, đáy chao cách sàn 2.10 m | 2.10 → 3.22 | Sân chính — đèn thả trên bàn trà, treo giữa hai hàng xà gồ |
| Đ28 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN CHÍNH | 7.30 · 14.00 | trần, cách sàn 3.09 m | 3.01 → 3.09 | Sân chính — mép trước mái, rọi ra sân trống |
| Đ29 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN CHÍNH | 7.60 · 17.20 | trần, cách sàn 3.41 m | 3.33 → 3.41 | Sân chính — trước cửa bếp D9 và lối vào hành lang ngoài |
| Đ30 | ốp trần LED Ø500 | 36 | 3600 | BẾP + NHÀ ĂN | 6.78 · 19.24 | trần, cách sàn 3.60 m | 3.69 → 3.75 | Bếp — dọc phòng, đầu bắc |
| Đ31 | ốp trần LED Ø500 | 36 | 3600 | BẾP + NHÀ ĂN | 6.78 · 21.50 | trần, cách sàn 3.60 m | 3.69 → 3.75 | Bếp — dọc phòng, giữa |
| Đ32 | ốp trần LED Ø500 | 36 | 3600 | BẾP + NHÀ ĂN | 6.78 · 23.76 | trần, cách sàn 3.60 m | 3.69 → 3.75 | Bếp — dọc phòng, đầu nam |
| Đ33 | đèn tường hắt | 8 | 600 | BẾP + NHÀ ĂN | tường x = 5.00, y 23.60, quay + | tường, tâm cao 1.60 m trên sàn | 1.69 → 1.81 | Bếp — rọi mặt bếp nhánh dọc, chỗ sơ chế cạnh góc chữ L |
| Đ34 | đèn tường hắt | 8 | 600 | BẾP + NHÀ ĂN | tường y = 25.00, x 6.20, quay − | tường, tâm cao 1.60 m trên sàn | 1.69 → 1.81 | Bếp — rọi chậu rửa nhánh ngang |
| Đ35 | đèn tường ngoài trời IP65 | 10 | 800 | HÀNH LANG NGOÀI | tường x = 8.50, y 18.70, quay + | tường, tâm cao 2.30 m trên sàn | 2.20 → 2.40 | Hành lang ngoài — đầu bắc, trên tường đông bếp |
| Đ36 | đèn tường ngoài trời IP65 | 10 | 800 | HÀNH LANG NGOÀI | tường x = 8.50, y 23.60, quay + | tường, tâm cao 2.30 m trên sàn | 2.20 → 2.40 | Hành lang ngoài — đầu nam |
| Đ37 | ốp trần ngoài trời Ø200 IP65 | 12 | 1000 | SÂN PHƠI / GIẶT | 7.40 · 26.50 | trần, cách sàn 3.34 m | 3.26 → 3.34 | Sân phơi — dưới mái sân phơi |
| Đ38 | đèn tường ngoài trời IP65 | 10 | 800 | SÂN PHƠI / GIẶT | tường x = 5.00, y 26.70, quay + | tường, tâm cao 2.10 m trên sàn | 2.00 → 2.20 | Sân giếng — rọi hai vòi nước và máy giặt |
| Đ39 | ốp trần chống ẩm Ø250 IP44 | 18 | 1600 | WC KHÁCH | 8.65 · 29.00 | trần, cách sàn 2.70 m | 2.77 → 2.85 | WC khách — trên trần giả |
| Đ40 | đèn tường hắt | 8 | 600 | WC KHÁCH | tường x = 9.50, y 28.33, quay − | tường, tâm cao 1.85 m trên sàn | 1.94 → 2.06 | WC khách — đèn gương trên lavabo, góc tường cửa |

**Độ rọi chung** — phương pháp quang thông: E = Σ lm × UF × 0.8 / diện tích lọt lòng. UF tra theo chỉ số phòng K = S / (h × (dài + rộng)), h từ trần tới mặt làm việc 0.75 m, bảng gần đúng cho đèn ốp trần tán xạ, trần tường sơn sáng. Chỉ đèn trần và đèn thả tính vào; đèn tường là đèn cục bộ. Số ra để so với ngưỡng, sai chừng ±20% — không phải số đo.

| Phòng | Số đèn | W | lm (đèn trần) | Lọt lòng m² | Cao trần | K | UF | Độ rọi chung | Ngưỡng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| L1 SÂN PHỤ | 3 | 36 | 3000 | — | — | — | — | — | không tính |
| L2 PHÒNG KHÁCH | 4 | 144 | 14400 | 23.14 | 3.30 | 0.94 | 0.50 | **247 lx** | 150 lx ✓ |
| L3 CẦU THANG | 2 | 16 | 0 | — | — | — | — | — | không tính |
| L4 PHÒNG NGỦ 1 | 3 | 52 | 3600 | 9.22 | 3.30 | 0.58 | 0.39 | **123 lx** | 100 lx ✓ |
| L5 PHÒNG KHO MASTER | 1 | 24 | 2400 | 2.58 | 3.30 | 0.31 | 0.29 | **213 lx** | 100 lx ✓ |
| L6 WC CHUNG | 2 | 26 | 1600 | 2.66 | 3.30 | 0.32 | 0.29 | **139 lx** | 100 lx ✓ |
| L7 PHÒNG NGỦ MASTER | 5 | 76 | 5800 | 15.97 | 3.30 | 0.77 | 0.45 | **131 lx** | 100 lx ✓ |
| L8 BAN CÔNG SAU | 2 | 24 | 2000 | — | — | — | — | — | không tính |
| L9 HÀNH LANG | 3 | 36 | 3300 | 5.00 | 3.30 | 0.29 | 0.28 | **148 lx** | 100 lx ✓ |
| R1 SÂN CHÍNH | 3 | 39 | 3300 | — | — | — | — | — | không tính |
| R2 BẾP + NHÀ ĂN | 5 | 124 | 10800 | 22.65 | 3.60 | 0.79 | 0.46 | **174 lx** | 150 lx ✓ |
| R3 HÀNH LANG NGOÀI | 2 | 20 | 0 | — | — | — | — | — | không tính |
| R4 SÂN PHƠI / GIẶT | 2 | 22 | 1000 | — | — | — | — | — | không tính |
| R5 WC KHÁCH | 2 | 26 | 1600 | 2.47 | 2.70 | 0.40 | 0.33 | **171 lx** | 100 lx ✓ |
| MÁI | 1 | 10 | — | — | — | — | — | — | không tính |

**Cụm đèn và công tắc** — 25 cụm, 14 bảng công tắc (mặt công tắc chữ nhật 120 × 75, tối đa 4 hạt). Mỗi hạt bật / tắt đúng một cụm; cụm có hạt ở hai bảng là **công tắc hai chiều** — đi thêm dây giữa hai bảng.

| Cụm | Tên | Đèn | W | Hạt ở bảng |
|---|---|---|---:|---|
| CĐ1 | Cổng | Đ1 | 12 | BCT1 |
| CĐ2 | Hiên cửa chính | Đ2, Đ3 | 24 | BCT1 |
| CĐ3 | Phòng khách — phía sofa | Đ4, Đ6 | 72 | BCT1 |
| CĐ4 | Phòng khách — phía lối đi | Đ5, Đ7 | 72 | BCT1 |
| CĐ5 | Cầu thang | Đ8, Đ9 | 16 | BCT3, BCT4 (hai chiều) |
| CĐ6 | Sân thượng | Đ10 | 10 | BCT4 |
| CĐ7 | Hành lang | Đ11, Đ12, Đ13 | 36 | BCT3, BCT7 (hai chiều) |
| CĐ8 | PN1 — đèn trần | Đ14 | 36 | BCT5, BCT6 (hai chiều) |
| CĐ9 | PN1 — đầu giường | Đ15, Đ16 | 16 | BCT5, BCT6 (hai chiều) |
| CĐ10 | Phòng kho | Đ17 | 24 | BCT9 |
| CĐ11 | WC chung — đèn trần | Đ18 | 18 | BCT7 |
| CĐ12 | WC chung — gương | Đ19 | 8 | BCT7 |
| CĐ13 | Master — đèn trần | Đ20 | 36 | BCT8, BCT10 (hai chiều) |
| CĐ14 | Master — lối vào, bàn làm việc | Đ21, Đ22 | 24 | BCT8 |
| CĐ15 | Master — đầu giường | Đ23, Đ24 | 16 | BCT8, BCT10 (hai chiều) |
| CĐ16 | Ban công sau | Đ25, Đ26 | 24 | BCT11 |
| CĐ17 | Đèn thả bàn trà | Đ27 | 15 | BCT2 |
| CĐ18 | Sân chính | Đ28, Đ29 | 24 | BCT2, BCT12 (hai chiều) |
| CĐ19 | Bếp — đèn trần | Đ30, Đ31, Đ32 | 108 | BCT12 |
| CĐ20 | Bếp — rọi mặt bếp, chậu rửa | Đ33, Đ34 | 16 | BCT12 |
| CĐ21 | Hành lang ngoài | Đ35, Đ36 | 20 | BCT12, BCT13 (hai chiều) |
| CĐ22 | Sân phơi | Đ37 | 12 | BCT13 |
| CĐ23 | Sân giếng | Đ38 | 10 | BCT13 |
| CĐ24 | WC khách — đèn trần | Đ39 | 18 | BCT14 |
| CĐ25 | WC khách — gương | Đ40 | 8 | BCT14 |

| Bảng | Phòng | Vị trí | Tâm cao | Hạt (từ trái) | Ghi chú |
|---|---|---|---:|---|---|
| BCT1 | PHÒNG KHÁCH | tường y = 13.50, x 4.30, quay + | 1.25 m | CĐ3 · CĐ4 · CĐ2 · CĐ1 | Phòng khách — trong cửa chính D1, phía phải |
| BCT2 | PHÒNG KHÁCH | tường x = 5.00, y 16.70, quay − | 1.25 m | CĐ18 · CĐ17 | Phòng khách — cạnh cửa D2 ra sân chính, phía then cửa |
| BCT3 | HÀNH LANG | tường x = 5.00, y 18.80, quay − | 1.25 m | CĐ7 · CĐ5 | Hành lang — đầu bắc, cạnh chân cầu thang |
| BCT4 | CẦU THANG | tường y = 18.50, x 3.75, quay + | 1.25 m | CĐ5 · CĐ6 | Đầu thang — trong tum, vách bắc sát cửa ra mái; cao tính từ mặt mái |
| BCT5 | PHÒNG NGỦ 1 | tường x = 4.00, y 21.54, quay − | 1.25 m | CĐ8 · CĐ9 | Phòng ngủ 1 — trong cửa D5, phía then cửa |
| BCT6 | PHÒNG NGỦ 1 | tường x = 0.00, y 21.03, quay + | 0.75 m | CĐ9 · CĐ8 | Phòng ngủ 1 — đầu giường, ngay trên kệ đầu giường |
| BCT7 | HÀNH LANG | tường x = 4.00, y 24.10, quay + | 1.25 m | CĐ7 · CĐ11 · CĐ12 | Hành lang — ngoài cửa WC chung D6, gần cửa master |
| BCT8 | PHÒNG NGỦ MASTER | tường y = 24.50, x 3.85, quay + | 1.25 m | CĐ13 · CĐ14 · CĐ15 | Master — trong cửa D8, phía then cửa |
| BCT9 | PHÒNG NGỦ MASTER | tường y = 24.50, x 0.82, quay + | 1.25 m | CĐ10 | Master — bên trái cửa phòng kho D14 |
| BCT10 | PHÒNG NGỦ MASTER | tường x = 0.00, y 24.82, quay + | 0.75 m | CĐ15 · CĐ13 | Master — đầu giường, trên tủ đầu giường phía cửa |
| BCT11 | PHÒNG NGỦ MASTER | tường y = 28.00, x 0.70, quay − | 1.25 m | CĐ16 | Master — cạnh cửa lùa ban công D12 |
| BCT12 | BẾP + NHÀ ĂN | tường y = 18.00, x 6.45, quay + | 1.25 m | CĐ19 · CĐ20 · CĐ18 · CĐ21 | Bếp — trong cửa D9 ra sân chính, cạnh bản lề cánh trái |
| BCT13 | BẾP + NHÀ ĂN | tường y = 25.00, x 7.25, quay − | 1.25 m | CĐ22 · CĐ23 · CĐ21 | Bếp — trong cửa D10 ra sân phơi, phía then cửa |
| BCT14 | SÂN PHƠI / GIẶT | tường y = 28.00, x 9.04, quay − | 1.25 m | CĐ24 · CĐ25 | Sân phơi — ngoài cửa WC khách D11, dưới mái; mặt có nắp che nước |

---

## 9. Điểm cần lưu ý

**Ban công 2.0 m đổi hẳn vai trò.** Ở 1.0 m nó chỉ là khe thoáng; 2.0 m thì kê được bàn nhỏ và phơi được đồ, đồng thời khoảng lùi khỏi tường rào sau xa hơn nên master nhận sáng khá hơn hẳn. Master vẫn không có cửa sổ nào — toàn bộ ánh sáng qua cửa lùa D12 rộng 3.2 m.

**Tam giác bếp:** bếp nấu ở nhánh dọc, chậu rửa ở nhánh ngang, tủ lạnh nên đặt ở đầu bắc nhánh dọc — ba điểm tạo tam giác cạnh khoảng 1.5–2.0 m, đúng tầm thao tác.

**Phòng khách mất nắng Đông Nam.** Mái sân chính trùm hết dọc tường phòng khách: W1 còn 27% phần trời (mái bàn trà cũ 92%), D2 còn 26% (cũ 54%); nắng trực tiếp lên W1 + D2 ngày đông chí còn 18% so với không mái (cũ 70%). Phòng khách giờ sáng chủ yếu nhờ cửa chính D1.

**Bếp bị mái che ba phía** — mái sân chính phía bắc, mái bếp kéo sang hành lang phía đông, mái sân phơi phía nam, đều là tôn không cho sáng qua. Mái sân chính rộng ra nên W2 còn 20%, D9 25% phần trời; W3 sáng hơn trước vì mái trên hành lang nâng cao (nay mép 3.75), D10 37% (mép mái sân phơi nâng lên 3.20). Sân giếng bên dưới mái chỉ có hai vòi âm tường và máy giặt dồn vào góc, để lối ra bếp qua D10 không bị thiết bị chiếm. Ngày âm u phải bật đèn bếp ban ngày. Đã cân nhắc tấm lấy sáng và không chọn.

**Hành lang ngoài hứng mưa tạt nhiều hơn.** Mái bếp kéo sang nên khoảng hở giữa đỉnh rào 1.80 và đáy dầm mép mái rộng 1.85 m ở hai đầu, 2.9 m dưới nóc, quay Đông Nam — mưa gió tạt vào lối đi và tường đông bếp; thấy ướt thì thêm diềm tôn hoặc lam ở đầu hồi phía rào. Cột C4 dưới nóc cao ~4.7 m đứng trên rào chỉ xây đặc 0.80 — kỹ sư kết cấu xem lại tiết diện và liên kết chân cột.

**Cầu thang và tum — nghĩ cho tầng 2.** Móng, cột, dầm nhà chính phải tính cho 2 tầng cộng tum ngay bây giờ; tường gạch tum phải đứng trên dầm, không xây thẳng lên bản mái; bản mái sẽ thành sàn tầng 2, lỗ thang đổ sẵn dầm bo. Sau khi bỏ giếng trời, **đầu nam hành lang (gần master) tối hơn**: chỉ còn ánh sáng từ tum rọi xuống buồng thang. **Phòng ngủ 1 chỉ còn ánh sáng mượn** qua hai ô thoáng nhỏ W5, W6 ra buồng thang — không cửa sổ ra trời, ban ngày tối; hợp làm phòng ngủ phụ, phòng khách ở lại. Cánh lật cố định nên không đóng được: tiếng động và ánh đèn đêm ở cầu thang vẫn qua ô. Muốn đóng được thì làm cánh lật có tay chốt thay vì cố định. **Cửa tum ra thẳng mái, không có chiếu tới**: cánh phải mở ra phía mái (mở vào là quét lên bậc), chốt bằng then ở mặt trong cánh. Người đi lên đứng trên bậc cuối mới mở được cửa — lắp tay nắm và đèn ở đầu thang, đừng để đồ trước cửa phía mái. Gờ chắn nước 10 cm ở ngưỡng, ô văng 0.6 m che trên cửa, cửa mở ra được gió ép vào khuôn; vẫn cần gioăng và mặt mái trước cửa dốc ra ngoài. Ô thoáng tum gắn lá kính xếp nghiêng chéo xuống, lá trên chồng mép lá dưới, lại nằm dưới mái đua — mưa hắt và lá cây không vào; lá kính bám bụi, thỉnh thoảng phải lau. Buồng thang thông phòng khách nên hơi lạnh máy lạnh bay lên tum — mở máy lạnh thì đóng cửa đầu thang. Lớp chống nóng XPS trên mái sẽ nằm dưới sàn tầng 2 sau 5 năm, nên **đã chốt lát rời** — dỡ bằng cách nhấc tấm chứ không đục.

**WC chung không còn ô thoáng.** Quạt hút âm trần nối ống PVC lên mái, đầu ống có chụp chắn mưa và đi xuyên lớp chống thấm có cổ ống — sau này đi tiếp lên theo hộp kỹ thuật tầng 2. Chọn quạt có van một chiều để gió mái không thổi ngược mùi vào.

**Giàn phơi chỉ 2.90 m dây, và phơi ngoài trời thì phụ thuộc thời tiết.** Dải hở chỉ 2.9 × 2.0 m, lại phải chừa cả bậc cửa D13 **và chỗ đứng ở chân bậc** (0.66 m) ở đầu tây, nên tuyến chỉ dài 1.45 m. Muốn dài hơn thì phải quay giàn dọc theo tường WC khách như bản đầu — được 3.10 m nhưng không còn nằm dọc tường bao sau. Kiểu tam giác ngược bù lại bằng chỗ treo rộng: hai thanh cách nhau 0.50 m nên treo kín cả hai mà quần áo không chạm nhau — hơn hẳn xếp ba thanh chồng tầng dù tổng mét dây ít hơn. Nhà bốn người giặt một mẻ lớn vẫn không đủ chỗ, phải phơi thêm dưới mái sân phơi hoặc dùng máy sấy. Bắc Giang có mùa nồm và mưa phùn kéo dài, những ngày ấy phơi ngoài trời vô ích — **máy giặt/sấy ở góc sân giếng là thứ gánh việc**, giàn phơi chỉ để tận dụng ngày nắng. Muốn thêm dây thì gắn giàn treo kéo tay dưới mái sân phơi (đoạn `y` 25–28), nhưng chỗ đó không có nắng.

**Bồn nước 1000 L trên trần ban công — nói với kỹ sư kết cấu.** Bồn đầy nước nặng cỡ 1 tấn, đứng trên bản trần ban công sau (nhịp 5 m gác hai tường bên `x = 0` và `x = 5`), không phải trên mái nhà chính có dầm cột. Đã đặt dọc áp sát tường `x = 5` để tải nằm sát gối, nhưng **bản trần ban công vẫn phải được tính với tải này** — cả khi sau 5 năm xây tầng 2 và bồn chuyển chỗ. Bốn chân giá phải có bản đế 300 × 300: chân trần 50 × 50 ép xuống cỡ 1000 kPa, quá sức nén XPS 300 kPa, tấm lát sẽ lún và XPS bị bẹp. Đường cấp lên bồn và ống xuống đi trong hộp kỹ thuật, chỗ xuyên lớp chống thấm phải có cổ ống — giống ống quạt hút WC chung. Bồn phơi nắng cả ngày thì nước nóng về chiều: muốn nước mát thì bọc cách nhiệt hoặc che, nhưng che thì lại thêm khối trên mái.

**Mái hiên cửa chính thành một phần sân thượng.** Bản công xôn 1.2 m không cột nay có người đi lại và lan can bắt ở mép ngoài — kỹ sư kết cấu phải tính lại tải và neo trụ lan can; lan can mép công xôn chịu lực đẩy ngang lớn nhất. **Diềm ốp mép mái hiên** cũng treo đúng đầu công xôn: giữ nó nhẹ — khung thép hộp mạ kẽm, tấm gỗ nhựa, không ốp đá hay xây gạch; neo khung vào mặt bên bản chứ không khoan xuyên lớp chống thấm trên mặt bản. Mép dưới diềm buông thấp hơn bản 0.11 m nên làm luôn rãnh nhỏ giọt ở mép dưới, không thì nước mưa men theo mặt dưới bản vào trần hiên.

**Rào kín hai cạnh trước / sau — riêng tư đổi lấy chút nắng.** Mặt tiền (`y = 0`) xây kín **2.10 m**, cạnh sau (`y = 30`, tới `x` 8.0) xây kín **1.80 m**, cả hai không lan can. Đo trên chính khối đã dựng (giờ nắng trực tiếp): chỗ giàn phơi cốt 1.80 **không đổi** — 9.5 h hạ chí, 7.0 h thu phân, 5.7 h đông chí, đúng bằng khi còn lan can, vì rào sau vẫn 1.80; giữa cửa D12 của master cốt 1.20 thì **đông chí 4.6 → 3.6 h**, thu phân 3.3 → 2.8 h — phần mất là ánh sáng vốn lọt qua khe lan can, nay bị bịt. Giữa sân phụ 13.1 → 12.4 h hạ chí do rào trước cao 2.10.

**Rào sau 1.80 kín tới đâu.** Sân phơi cốt bằng sân nên rào nhô đủ 1.80, trên tầm mắt 1.58 — đứng giặt phơi thì kín. Nhưng **ban công sau cao hơn sân 0.45** nên rào chỉ nhô **1.35 m** trên sàn ban công, dưới tầm mắt: ngồi ở ban công thì kín, **đứng thì nhìn qua được và bị nhìn lại** — người ngoài thấy từ khoảng ngực trở lên. Muốn kín cả khi đứng thì đoạn sau phải 2.05 m trở lên, và lúc đó chỗ phơi mất khoảng 2 h nắng đông chí — chủ nhà chốt không đổi lấy chỗ phơi. **Chỗ ngồi ở ban công** (cốt 1.00) là nơi mất nhiều nhất: đông chí 5.7 → 2.8 h nắng. **Đã thử lam chéo thay mảng xây đặc rồi bỏ** (3d.md mục 2a): dựng thật và đo thì chỗ ngồi ban công được lại 2.8 → 4.3 h, nhưng cửa D12 chỉ 3.6 → 3.8 h — nắng tới D12 phần lớn đi qua **trên đỉnh rào** chứ không qua dải lam; lại thêm tiền, thêm công, hở tiếng động và dễ trèo hơn mảng gạch đặc, nhất là ở mặt tiền quay ra ngõ.

Hai cạnh bên `x = 0` và `x = 9.5` giữ rào 1.80 xây đặc 0.80 + lan can, nên từ nhà bên vẫn nhìn thấy sân chính, sân phơi và ban công — muốn kín nữa thì thêm rèm, lam hay cây ở đoạn đó. Cổng chính nay cao 2.10 m theo rào. Ban công cao hơn sân 0.45 nên lan can sau ban công cao 1.35 m tính từ sàn ban công — vẫn trên mức 1.1 m thường đòi cho lan can.

**Đèn — chốt vị trí đèn trần trước khi đổ mái.** Bản mái bê tông đổ thẳng, không trần giả, nên ống luồn dây và hộp đấu đèn phải **đặt sẵn trong bản mái** đúng toạ độ đèn trần trước khi đổ; đổ xong mới dời đèn là phải đục bản hoặc đi ống nổi. Dưới mái tôn thì dây chạy dọc xà gồ, dầm, dời lúc nào cũng được. **Công tắc:** 14 bảng, 25 cụm đèn, mỗi hạt một cụm. Bảng cạnh cửa đặt phía then cửa, tâm cao 1.25 m; hai phòng ngủ có thêm bảng ở đầu giường cao 0.75. **Hai chiều** ở cầu thang (chân thang — trong tum), hành lang (hai đầu), đèn trần và đèn đầu giường hai phòng ngủ (cửa — đầu giường), sân chính (cửa D2 — cửa D9), hành lang ngoài (cửa D9 — cửa D10): mỗi cụm hai chiều cần đi thêm dây giữa hai bảng, báo thợ điện trước khi đổ mái. Đèn ngoài sân bật từ trong nhà: cổng và hiên ở cửa chính, sân phơi và sân giếng ở cửa D10. Công tắc WC khách ở ngoài trời dưới mái sân phơi — dùng mặt có nắp che nước. Đèn cổng, sân giếng nên thêm cảm biến chuyển động. Ánh sáng **3000 K** (vàng ấm) cho phòng ngủ, phòng khách; **4000 K** cho bếp, WC, bàn làm việc. Đèn ngoài trời đều **IP65** — mái sân chính và hành lang ngoài hứng mưa tạt; hai WC dùng đèn chống ẩm. Phòng ngủ 1 không có cửa sổ ra trời nên **ban ngày cũng phải bật đèn**, bếp ngày âm u cũng vậy. **Độ rọi trong đặc tả là số tính** theo phương pháp quang thông, sai chừng ±20%, không phải đo — mua đèn thì so quang thông (lm) ghi trên hộp chứ đừng so công suất (W). Đèn thả trên bàn trà đáy chao cách nền 2.10 m, không đụng đầu nhưng ở ngoài trời, gió lùa là đung đưa: chọn chao nặng hoặc cần treo cứng. Hai đèn trên tường tum dỡ theo tum khi xây tầng 2 — để sẵn dây chờ.

**Cây xanh sân phụ.** Bồn hoa BH1 lấy tường rào trái làm lưng: **chống thấm mặt trong tường** lên cao hơn mặt đất trồng trước khi đổ đất — không thì tường ẩm, rêu, bong sơn; chân bó vỉa chừa **lỗ thoát nước** ra sân, đáy bồn lót sỏi. Bồn cao 0.25, khóm hoa chừng 0.6 m — thấp hơn phần rào xây đặc 0.80, nên **không che được tầm nhìn từ lô bên cạnh** qua lan can; muốn kín thì trồng dây leo bám lan can. Cánh cổng trái mở ra nằm cách mép bồn 9 cm — đừng để cây bò tràn ra mép. Hai chậu CC1, CC2 nằm dưới mái hiên nên **không hứng mưa, phải tưới tay**, và chỉ có nắng sáng xiên (mặt tiền Đông Bắc, hiên đua 1.2 m) — chọn cây chịu bóng bán phần, dáng đứng. Chậu cách mép bậc chỉ 4 cm: mua chậu miệng không quá Ø0.40, tán không chồm lên bậc. Hai chậu ban công CC3, CC4 cũng dưới trần ban công, tưới tay; ban công quay Tây Nam, nắng chiều gắt — chọn cây chịu nắng nóng.

**Hai cây bóng mát CX1, CX2 che nắng buổi sáng, không che nắng chiều.** Chúng đứng ở góc Đông của sân chính. Tính bóng của tâm tán (cao 3.9 m) theo đường đi của nắng: hạ chí bóng rơi vào sân chính từ khoảng 8 h tới 13 h, thu phân 10 h – 14 h, đông chí chỉ quanh trưa; **từ 14 h trở đi bóng đổ sang lô bên phải và ra ngõ**. Nắng chiều Tây Nam của sân chính vốn đã bị khối nhà và mái sân chính chặn phần lớn. Muốn bóng mát buổi chiều thì cây phải đứng phía Tây Nam chỗ cần che — trong lô này là sân phơi, nơi cố ý giữ nắng. Tán Ø3.30 chạm đúng ranh lô phải và ranh mặt tiền: **phải tỉa giữ cỡ** hằng năm, không thì cành vươn sang đất bên cạnh và ra ngõ. Chọn cây tán gọn, rễ ăn sâu, không rễ nổi — bàng Đài Loan, lộc vừng; tránh cây rễ mạnh (đa, si, bàng ta) cách móng rào chỉ 1 m và móng nhà. Mặt dưới tán 2.50 m: dắt xe máy, đi lại dưới tán không vướng, nhưng xe tải cao không vào góc đó được. Lá rụng xuống mái sân chính và máng xối mép trước ở `y` 12 — cách mép tán CX2 5.3 m nên ít, vẫn nên vét máng mùa lá rụng.

**Sơn chống nóng tường trái — không đổi hình khối, đừng quên:** sơn mặt ngoài tường trái (16 m quay Tây Bắc) ngay lúc xây, khi lô bên cạnh còn trống và dựng được giàn giáo.

**Lớp chống nóng mái — chỗ đáng tiền nhất** (mái bê tông nhận nhiệt hè gấp ~4 lần bức tường trái). XPS được che kín thì bền cỡ 30–50 năm; thứ hỏng trước là lớp chống thấm, nên khi thi công: chống thấm nằm **dưới** XPS, không khò bitum nóng hay sơn gốc dầu; lát tấm ngay, không để XPS phơi nắng; mua đúng XPS ô kín, không phải xốp trắng EPS; tạo dốc từ lớp dưới cho nước không đọng dưới tấm; quanh mọi lỗ trên mái xây gờ cao hơn mặt lát. Dột thì nhấc tấm và gỡ XPS là tới được lớp chống thấm — đó chính là cái lợi của lát rời.

**Lát rời — phải giữ mấy điều.** Tấm đủ nặng để gió không bốc: 400 × 400 × 40 bê tông nặng chừng 15 kg/m², đặt sát nhau và có lan can 1.1 m quanh mép mái nên đủ; **đừng thay bằng tấm mỏng hay tấm nhựa**. Mép mái, quanh lỗ thang và chân tường tum là chỗ gió xoáy mạnh nhất — hàng tấm ngoài cùng nên chèn khít hoặc dán điểm. Khe giữa các tấm để hở cho nước xuống, nên rác và lá đọng trong khe: mỗi năm nhấc vài tấm ở chỗ thoát nước mà vét. Mặt lát đi theo dốc mái, **không phẳng tuyệt đối** — kê bồn nước hay chân giàn phơi thì phải đệm. Đi trên tấm rời có tiếng cộc và tấm hơi bập bênh nếu lớp dưới không đều: cán phẳng mặt XPS trước khi trải vải địa.

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
| current ← | cầu thang lên mái, tum | 100.0 |

### Thay đổi ở Hiện hành — cầu thang lên mái, tum

- Ban công sau 1.0 → **2.0 m sâu** (5.0 × 2.0 = 10.00 m²) — nay ngồi được, không chỉ để thoáng
- Nhà chính 17.0 → **18.0 m**; sân phụ bù lại 13.0 → 12.0 m
- Bếp thêm **nhánh kệ vuông góc** dài 2.4 m dọc tường tây → bếp chữ L
- **Bếp nấu tách sang nhánh dọc**, chậu rửa giữ ở nhánh ngang — hết nấu và rửa chen nhau
- Chậu rửa vẫn quay ra sân phơi, bếp nấu quay vào trong
- WC khách chốt **1.6 × 2.0 m**, áp tường sau; hai tường trong xuống 100 mm
- **WC chung thu còn 1.6 × 2.0 m**, cửa cánh mở vào trong có gioăng kín mùi; bỏ tủ âm PN1, dải kho cũ thành **phòng thay đồ/kho Master 2.4 × 2.0 m** với hai tủ cao 2.0 m chữ L; vách nhựa kín tới trần, cửa cánh 0.80 m mở về Master
- **Toàn bộ vách ngăn nội bộ** phòng ngủ, hành lang và WC chung đổi thành **vách nhựa cao đến trần**, không chịu lực; tường bao và tường tiếp xúc sân/mưa vẫn xây
- W4 thu thành **ô thoáng 0.6 × 0.4 m**, bệ 2.00 — không nhìn ra được
- **Trần WC khách hạ còn 2.70 m** (trần giả dưới bản mái; trước cao 3.60 vì sàn hạ mà mái giữ cốt) — ô thoáng W4 nâng lên theo, bệ 1.90 → 2.00, mép trên 2.40
- D13 đổi chiều **mở vào ban công** — cánh không quét lên bậc phía sân phơi
- **Bậc tam cấp** cho D1, D2, D13 — 2 bậc ngoài, nấc trên là sàn nhà; mỗi nấc 15 cm, tính từ mặt tường. D1 mặt bậc 30 cm, rộng hơn cửa 0.3 m mỗi bên; cửa phụ D2, D13 gọn hơn — mặt bậc 25 cm, dư 0.2 m mỗi bên
- Sàn bếp **hạ còn +0.15 so với sân** — D9, D10 chỉ còn một nấc ở ngưỡng, khỏi dựng bậc; mái bếp giữ cốt nên trần cách sàn 3.60 m
- **Mái hiên bê tông** đua 1.2 m trước cửa chính, thay cho mái che xe đã bỏ
- Sàn WC khách **hạ còn +0.15 so với sân**, cùng cốt với bếp — D11 khỏi dựng bậc
- **Đổ trần ban công sau**, tường trái ban công xây lên tới mái — thay cho lam đứng D12: ngang lam về sáng và nắng hè, tháng 9 nắng lên kính còn một nửa, D12 hết dính mưa
- **Mái sân chính** trùm hết bề ngang lô phụ 4.5 m, từ mặt tiền nhà chính (y = 12) tới bếp — tôn cách nhiệt dốc 10% ra phía cổng, mặt dưới 3.50 sát bếp → 2.90. Thay mái bàn trà 3.5 × 3.0 m; đổi lại W1, D2 phòng khách mất gần hết trời và nắng Đông Nam. Mái che xe ở sân phụ bỏ hẳn
- **Mái bếp trùm luôn hành lang ngoài** — một mái hai dốc 30% trên x 5–9.5, thay tấm phẳng 2.80 rồi mái hành lang riêng 3.50 → 3.85: bỏ đường áp tôn thấp vào đầu hồi bếp dài 7 m, chỗ dễ dột nhất cụm mái. Đi từ sân chính qua hành lang ra sân phơi, WC khách vẫn không qua khe hở nào
- **Mái bếp đua 0.20 m** ở hai mép thấp suốt bề ngang 4.5 m, không làm máng — nước rơi xuống mái sân chính và mái sân phơi bên dưới
- **Mái sân phơi** dốc 17% → **10%** (mép thấp 3.00 → 3.20)
- **Tường rào hạ 2.20 → 1.80 m**, chỉ xây đặc 0.80 m, phía trên là lan can song thoáng — lấy sáng, lấy gió thay cho tường cao kín. Hai tường bên ban công (tường ranh trái, tường có cửa D13 ra sân phơi) vẫn xây tới trần; lan can chỉ ở rào sau ban công và rào quanh các sân
- **Cổng chính 2.4 → 3.6 m**, tâm vẫn thẳng cửa chính — ô tô vào thoải mái
- **Cổng chính có hai trụ gạch vuông 500 × 500, giằng BTCT, mái ngói hai dốc dày và cổng sắt hai cánh nan đứng** — trụ lên tới sống mái, giằng nối hai trụ ngay dưới sống mái nên mái không lơ lửng; hai cánh sắt mở vào sân; mái chìa đều **ra đường và vào sân**; khoảng thông xe 3.6 m giữ nguyên giữa hai mặt trong trụ
- **Máng xối** chỉ còn ở mép trước mái sân chính và mép thấp mái sân phơi (đoạn áp tường WC khách đặt sát chân tường); mỗi máng một **ống xả** áp mặt trong tường bao phải, xuống ống ngầm chứ không đổ ra sân
- **Bếp lợp tôn hai mái** thay bản bê tông: nóc chạy ngang ở y = 21.5, dốc 30%, mép mái 3.75 → nóc 4.80 (nhô 0.85 m trên mái nhà); trần tôn cốt 3.75, cách sàn bếp 3.60 m, chỉ trong bếp — hành lang ngoài không trần. Tường bắc và nam bếp dừng ở mép mái, tường đông bếp lên tới mặt dưới mái, nằm gọn dưới tôn liền
- **Mái sân phơi** dốc một mái phủ y 25–28, chừa dải hở 2.5 × 2.0 m thẳng hàng ban công để còn chỗ phơi nắng
- **Bàn trà ngoài sân dời ra sát W1**, thẳng giữa cửa sổ, vẫn dưới mái sân chính — trước đứng chắn lối vào cửa bếp D9
- **Sofa phòng khách xếp chữ L** ở góc tây bắc, cạnh dài quay về kệ tivi — thay hai ghế đối diện nhau; lối từ cửa chính sang hành lang chừa trống ~2 m phía đông
- **Kệ thờ + kệ tivi một khối** tựa bức lửng y = 16.85, quay ra cửa chính — thay phòng thờ. Kệ thờ 0.7 m phía trong sát tường trái: tủ đồ thờ dưới, ba tầng thờ trên, **vách ngăn với kệ tivi kéo lên trần**; liền bên là **kệ tivi thấp hai tầng** 2.85 m chạy tới đầu trong bức lửng — tầng dưới tủ để đồ, tầng trên để tivi, loa; phía trên kệ để thoáng nhìn qua lan can về cầu thang
- **Cột đỡ mái nhẹ** — 5 cột thép hộp 100 × 100 trên tim tường rào phải (y = 12, 15, 18.05, 21.5, 24.95), nhịp ≤ 3.5 m: trước đó cả mép đông mái sân chính, mái bếp phần trùm hành lang, mái sân phơi không có gì đỡ vì rào chỉ xây 0.80. C3, C5 lùi 5 cm vào hẳn dưới mái bếp để lên tới dầm mái bếp; dầm mái sân chính và mái sân phơi dừng ở mặt cột. C4 dưới nóc cao ~4.7 m
- **Dầm biên thép hộp 50 × 100** dọc mọi mép mái nhẹ không tựa tường — tuyến tường rào phải (nghiêng theo mái, đi qua đầu cột), mép trước mái sân chính, mép dải hở mái sân phơi, hai chỗ mái bếp đua chồng lên mái sân chính và mái sân phơi (mỗi mái một dầm, đứng sát nhau); ở mép có máng thì dầm lùi vào sau máng. Cột hạ đỉnh xuống đáy dầm
- **Xà gồ mái sân chính** — 4 thanh thép hộp 40 × 80, bước 1.20 m, chạy vuông góc dốc mái từ tường phòng khách tới dầm dọc tường rào; tấm tôn không còn vượt nhịp trống 4.5 m
- **Góc làm việc master** — thay bàn 1.3 × 1.5 m bằng 2 bàn 0.6 × 1.2 m nối nhau dọc tường phải, kèm 2 ghế làm việc riêng
- **Bỏ bàn ăn trong bếp** — nhà ăn trên chiếu trải sàn, không dùng bàn; nhánh bếp chữ L có thêm chỗ trống
- **Sân giếng sát tường bếp** — dành một khoảng 1.5 m ngay ngoài D10, hai vòi âm tường giãn nhau trên tường nhà chính; mái sân phơi giữ nguyên. Một máy giặt/sấy 0.60 × 0.60 m ở góc giữa tường bếp và tường nhà chính, kê trên bệ sân 0.68 × 0.68 m cao 0.15 m để nước rửa sân không ảnh hưởng máy; bỏ máy rửa bát
- **Lớp chống nóng mái kiểu mái ngược, lát rời** — chống thấm + tấm XPS 50 mm + vải địa kỹ thuật + **tấm bê tông đúc sẵn 400 × 400 × 40 đặt rời** (chủ nhà chốt: không cán vữa, không dán keo), phủ mọi sàn mái bê tông (nhà chính, WC khách), trần ban công sau và mái hiên cửa chính, tới mặt ngoài tường; chừa giếng trời. Mặt mái 4.00 → 4.09. Lát rời để **dỡ được khi xây tầng 2**: nhấc tấm, cuộn vải địa, gỡ XPS — tái dùng gần hết, và không phải đục vữa ngay trên lớp chống thấm, thứ đắt và khó vá nhất. Cái giá: mặt lát đi theo dốc mái chứ không phẳng tuyệt đối, khe tấm hở. Chọn thay gạch lỗ chống nóng (trữ nhiệt rồi nhả vào buổi tối, ngay trên phòng ngủ) và thay mái tôn trên sàn mái (phải khoét theo giếng trời; lợp sát trần thì khe gió không lùa được)
- **Rào mặt tiền và rào sau xây kín, bỏ lan can** (chủ nhà chỉnh 11/9/2026 — lấy riêng tư): hai cạnh lộ nhất là mặt tiền quay ra ngõ và cạnh sau quay sang nhà phía sau. **Hai cạnh khác cao:** mặt tiền **2.10 m** (đứng ngoài ngõ nhìn thẳng vào sân và cửa chính, cần kín hẳn), cạnh sau chỉ **1.80 m** — bằng đỉnh rào thường, chỉ khác là xây kín thay cho lan can. Cạnh sau tới `x = 8.0`, từ đó ra ranh phải đã là tường WC khách. Hai cạnh bên `x = 0` và `x = 9.5` giữ rào 1.80 xây đặc 0.80 + lan can song thoáng. **Ở mức này chỗ phơi không mất nắng nào** (giàn phơi giữ nguyên 5.7 h đông chí, 7.0 h thu phân); chỉ cửa D12 của master mất phần sáng lọt qua khe lan can — đông chí 4.6 → 3.6 h, thu phân 3.3 → 2.8 h
- **Giàn phơi ngoài trời** ở sân phơi, **dọc theo tường bao sau** `y = 30` (chủ nhà chỉnh: không đặt cạnh WC khách nữa): tuyến ngang `y = 29.35`, `x` 5.75–7.70. **Mặt cắt hình tam giác ngược** — hai trụ thép hộp 50 × 50 cao 1.50, trên đầu mỗi trụ hai tay chìa vươn lên 0.25 và ra 0.25 mỗi bên, đỡ **hai thanh phơi** inox Ø27 ở cốt 1.80. Hai thanh cách nhau 0.50 theo phương ngang chứ không xếp chồng: treo kín cả hai mà quần áo không chạm nhau, hong được nhiều đồ hơn kiểu nhiều thanh xếp tầng. **2.90 m dây phơi**. Đặt trong **dải chừa hở** `y` 28–30, chỗ cố ý không lợp mái để còn nắng; nắng chiều Tây Nam vào thẳng. Đầu tây lùi tới `x` 6.30 — chừa 0.66 m chỗ đứng ở chân bậc cửa D13, không chỉ qua khỏi mép bậc
- **Bồn nước inox 1000 L** nằm ngang trên giá thép, **góc cuối nhà phía phải trên trần ban công sau** (chủ nhà chỉnh 11/9/2026: dời sát mép sau và thẳng trục vòi nước sân phơi) — thân dọc trục y áp sát tường `x = 5`: trần ban công gác hai tường bên nên nó nhịp 5 m theo x, đặt dọc sát một gối thì cả tấn nước nằm trong 1.2 m quanh gối thay vì ra giữa nhịp; chọn gối `x = 5` vì **hai vòi nước sân phơi nằm ngay dưới, áp mặt ngoài chính bức tường ấy** nên ống cấp chạy thẳng trong tuyến tường. Giá đỡ có **hai thanh kiềng bắc ngang** đỡ đúng đường tim đáy trụ — chân đứng ở bốn góc chống thẳng lên là hụt vào mặt cong, bồn treo lơ lửng. Bốn chân có **bản đế 300 × 300** dàn tải — chân trần đặt thẳng lên tấm lát ép cỡ 1000 kPa, quá sức XPS 300 kPa
- **Cầu thang chữ U lên mái** thay phòng thờ (chuẩn bị tầng 2 sau khoảng 5 năm): hai vế rộng 0.95 m, 22 nấc cao ≈ 0.170, mặt bậc 0.26, chiếu nghỉ sát tường trái; chân thang ở đầu bắc hành lang. Bỏ vách phòng khách – phòng thờ, thay bằng **bức lửng 1 m** kèm **lan can song thoáng** (không tấm đặc cho khỏi bí) — phòng khách nhận sáng và gió từ tum. Phòng khách 5 × 5 → 5 × 4.85
- **Tum tường gạch** (không vách tôn / nhựa), mái tôn, trên buồng thang; mặt dưới mái tum 2.70 m trên mặt mái, ô thoáng 0.30 m sát mái gắn **4 lá kính xếp nghiêng chéo xuống** — gió qua, mưa hắt và lá cây không vào, ô polycarbonate đậy trọn lỗ thang, tum **gọn, tường áp sát đầu thang, một cửa** ngay đầu vế 2 — lên hết thang là ra thẳng mái; cánh mở ra phía mái, **then chốt mặt trong** — không ai từ mái vào nhà tự do — ngưỡng có **gờ chắn nước** cao 0.10 m làm nấc cuối của thang; **mái tum đua ngắn 0.18 m bọc diềm gập** ba phía (phía ranh lô trái không đua) cho gọn, **ô văng 0.6 m** che trên cửa; dỡ khi xây tầng 2
- **Lan can thép 1.1 m** quanh mép mái nhà chính, **bao luôn mái hiên cửa chính** — mái thành sân thượng: phơi đồ, bồn nước, bảo trì lớp chống nóng. Khai tuyến liền cả bốn cạnh; đoạn chừa ở vách tum và ở chỗ đầu hồi bếp nhô trên mặt mái (tuyến x = 5) nay **suy từ hình học** thay cho hai số chép tay — đầu hồi chỉ thật sự chắn từ y 19.20 đến 23.80, lan can dài thêm 0.40 m mỗi đầu
- **Bỏ giếng trời hành lang SK1, hai cửa trời SK2, SK3 và ô thoáng WC chung SK4** — xây tầng 2 là phải bịt; mái bê tông không còn lỗ nào ngoài lỗ thang. WC chung dùng quạt hút nối ống lên mái. Phòng ngủ 1 lấy gió, sáng qua **hai ô thoáng nhỏ W5, W6** (0.40 × 0.30 m, bệ 2.40) ra buồng thang, dồn về phía cửa PN1 — **cánh kính mờ lật cố định** ngả vào phòng, người bên thang đứng thấp hơn bệ chỉ nhìn thấy trần. Thay ô kính cố định và ô lật to đã thử, nhìn vào dễ quá
- **Hệ đèn 40 bộ, khoảng 675 W** — **ốp nổi** vì nhà chính đổ bản bê tông thẳng, không trần giả (trừ WC khách). Phòng khách 4 đèn Ø500 lưới 2 × 2 ở kích thước 5.0 × 5.0 m; mỗi phòng ngủ một đèn Ø500 cộng hai đèn tường đọc sách đầu giường, master thêm downlight trên bàn làm việc và ở lối vào; bếp 3 đèn Ø500 dọc phòng cộng đèn rọi mặt bếp và chậu rửa; hành lang 3 downlight; hai WC đèn chống ẩm cộng đèn gương; cầu thang đèn tường ở chiếu nghỉ và trên lanh tô cửa tum, công tắc hai chiều. Ngoài trời đèn IP65: giằng cổng, mái hiên, trần ban công, mái sân chính (kèm **đèn thả trên bàn trà**), hành lang ngoài, mái sân phơi, sân giếng, cạnh cửa tum trên mái. Độ rọi chung tính theo phương pháp quang thông — mọi phòng khai ngưỡng đều đạt
- **14 bảng công tắc, 25 cụm đèn** — mỗi hạt bật / tắt một cụm, đèn nào cũng thuộc đúng một cụm. Bảng đặt cạnh cửa phía then cửa, tâm cao 1.25 m; hai phòng ngủ thêm bảng đầu giường 0.75 m. Công tắc hai chiều ở cầu thang, hành lang, đèn trần và đầu giường hai phòng ngủ, sân chính, hành lang ngoài. Trên bản vẽ 2D và mô hình 3D bấm được từng hạt để bật / tắt cụm đèn
- **Cây xanh sân phụ** (phối cảnh) — **hai chậu cây** Ø0.40 hai bên bậc cửa chính, đặt giữa khe 0.49 m giữa mặt tường và mép bậc, đối xứng qua trục cửa, dưới mái hiên; **bồn hoa xây** dọc tường bao trái sân phụ phía nhà chính, từ sau trụ cổng (`y` 0.25) tới mép mái hiên (`y` 10.69): rộng 0.50 m, mép bó vỉa cao **0.25 m** trên mặt sân, đất thấp hơn mép 0.05, 20 khóm hoa. Sân phụ còn 4.28 m lọt lòng cho lối vào và đỗ xe
- **Hai chậu cây ban công sau** — Ø0.40 ở hai góc sát rào sau, để trống giữa ban công và trước cửa lùa D12 cho chỗ ngồi; chậu cạnh D13 đứng ngoài vùng quét cánh
- **Hai cây bóng mát ở góc sân chính phía cổng** — dọc rào phải, tâm gốc `x` 7.85, `y` 1.75 và 5.05; tán Ø3.30 nối liền thành dải bóng 6.6 m, tới đúng ranh lô phải và ranh mặt tiền, không vươn ra ngoài; mặt dưới tán cao 2.50, đỉnh 5.30; ô gốc 1 × 1 m bó vỉa cao 0.15. Bóng tán rơi vào sân chính từ khoảng 8 h tới 13 h mùa hè
- **Diềm ốp mép mái hiên cửa chính** — điểm nhấn mặt tiền nhìn thẳng từ cổng: dải cao 0.45 m, khung thép hộp ốp gỗ nhựa nâu, bọc mép ngoài bản hiên 5.27 m và đầu phía sân chính; đỉnh bằng mặt lát mái 4.09, buông thấp hơn mặt dưới bản 0.11 m. Mép bản bê tông mỏng thành một đường ngang đậm, cân với mái ngói cổng phía trước; xây tầng 2 thì thành đường chỉ phân tầng
- **Giường phòng ngủ 1 1.6 × 1.8 m; giường master 1.8 × 2.0 m** — đầu giường áp tường trái theo đúng chiều ngắn 1.6 m và 1.8 m trong mô hình 3D
- **Phòng ngủ 1: tủ quần áo ra vách cửa vào, thêm kệ đầu giường** — tủ 1.2 × 0.6 m cao 2.0 áp vách hành lang phía nam cửa D5, chừa bảng công tắc cạnh then cửa; giường về sát tường trái, kệ đầu giường 0.45 × 0.45 phía lối lên giường, bảng công tắc đầu giường ngay trên kệ. Chân giường tới mặt tủ 1.30 m
- **Cửa bếp D9 thành 2 cánh nhỏ** — lỗ 1.00 → 1.20 m (nới về phía hành lang ngoài), hai cánh 0.60 m bản lề hai đầu cùng mở vào bếp: mở cả hai là lối rộng bê đồ, nồi, bàn ra sân; đi lại thường chỉ mở một cánh, cánh quét ngắn 0.6 m
- **WC chung: cửa D6 mở vào trong** — cánh không còn quét ra hành lang; lavabo và bồn cầu cùng áp vách master, lavabo dọc trục x ở góc hành lang, bồn cầu ở góc vách kho; khu tắm 1.15 × 0.70 m góc tây bắc trước bồn cầu, sàn phẳng dốc về phễu thu, có rèm; đèn gương dời theo lavabo
- **Buồng thang thu còn 4 × 2.0 m** — bức lửng dời từ `y` 18.35 xuống 18.50, phòng khách 5.0 × 6.35 → **5.0 × 6.5 m**, kệ thờ + kệ tivi lùi theo; hai vế thang 0.95 → **0.90 m**, khe giữa 0.15 → 0.10, số nấc, mặt bậc và cao bậc giữ nguyên; chiếu nghỉ hẹp theo vế nên đầu vế 2 và tường đông tum lùi 5 cm (`x` 3.92), cửa tum dời theo đầu vế 2
- **Phòng khách 5.0 × 5.0 m, nhà chính ngắn đi 1.5 m** — mặt tiền nhà lùi từ `y` 12 vào 13.5, sân phụ dài 13.5 m; mọi phòng từ buồng thang về sau giữ nguyên. Cửa chính, mái hiên + diềm, bậc, hai chậu cây, bồn hoa, lan can mái trước lùi theo; sofa, bàn nước, đèn phòng khách dời theo. Mái sân chính thu còn 4.5 m (`y` 13.5–18) giữ dốc 10%, mép thấp nâng 2.90 → 3.05; cột C1 lùi theo, C2 về giữa nhịp; bàn trà và đèn thả lùi theo W1
- **Cửa D2 dồn về góc bếp** — `y` 15.5–16.5 → 16.85–17.85, sát tường bếp, gần cửa sổ bếp W2 và cửa bếp D9; bậc D2 phía bếp chạy tới đúng mặt tường bếp. Công tắc cạnh then cửa dời theo
- **WC khách cùng cỡ và bố trí như WC chung** — 1.6 × 2.0 → **1.5 × 2.0 m** (tường trái `x` 7.9 → 8.0, dải hở sân phơi rộng thêm 0.1 m); cửa D11 mở vào, bản lề phía sân phơi; lavabo và bồn cầu cùng áp tường ranh lô, lavabo ở góc tường cửa, bồn cầu ở góc rào sau; khu tắm 0.64 × 1.09 m trước bồn cầu, sàn phẳng dốc về phễu thu, có rèm; đèn gương và công tắc ngoài cửa dời theo
- **Cửa sổ W1 về giữa tường, rộng lại 1.8 m** — `y` 14.33–16.13, cách đều mặt tường mặt tiền và cửa D2 (trụ 0.72 m mỗi bên); bàn trà ngoài sân và đèn thả lùi theo, vẫn thẳng giữa W1
- **Cửa D2 mở ra sân chính, bản lề phía W2** — cánh không còn quét vào phòng khách; mở ra thì lơ lửng trên hai bậc tam cấp (bậc sát cửa thấp hơn ngưỡng 0.15 m) nên không vướng. Công tắc BCT2 dời sang phía then cửa ở đầu bắc. Cửa dời sát tường bếp (`y` 16.85–17.85, chừa 4 cm khuôn): cánh mở áp dọc tường bếp, bậc phía bếp chạy tới đúng mặt tường — bỏ đoạn tường 0.24 m và khe 4 cm thừa giữa cửa với tường bếp
- **Cửa D5, D6, D11 sát góc tường phía bản lề** — mỗi cửa lùi 6 cm, chỉ chừa 4 cm khuôn thay cho khe 0.10 m không dùng được: D5 sát vách buồng thang, D6 sát vách PN1, D11 sát tường trái WC khách; cánh mở áp gọn vào vách. Công tắc phía then D5, D11 lùi theo
- **Phòng khách 5.0 × 6.35 m** — nhận thêm 1.5 m chiều dài từ việc rút phòng ngủ 1 còn 4.0 × 2.5 m, master còn 5.0 × 3.5 m, và WC/kho sâu 1.5 m; WC chung và phòng kho master **cùng 2.0 × 1.5 m**, cạnh 2.0 m dọc vách phòng ngủ 1
