# Đặc tả mặt bằng — Hiện hành — cầu thang lên mái, tum

> Sinh tự động từ `lib/versions/current.js` lúc 19:10:16 11/9/2026. Không chép tay.
> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–9.5). Y→xuống (0–30).
> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.
> Tường bao **220 mm** · Tường ngăn **100 mm**.

Ban công sau 2.0 m, bếp chữ L. Bếp và hành lang ngoài chung một mái tôn hai mái dốc 30% (thay bản bê tông); mái sân chính 4.5 × 6 m và mái sân phơi gá thấp dưới hai mép đua của nó. Sân giếng sát tường bếp có hai vòi âm tường và một máy giặt/sấy dồn vào góc giữa tường bếp và tường nhà chính, dưới mái tôn hiện hữu. Cầu thang chữ U lên mái ở chỗ phòng thờ cũ, thông với phòng khách qua bức lửng; tum xây gọn che đầu thang, một cửa ra thẳng mái, lan can thép quanh mép mái kể cả mái hiên trước — chuẩn bị cho tầng 2 sau khoảng 5 năm.

---

## 1. Tổng quan

| Mục | Tim tường | Sử dụng |
|---|---:|---:|
| Lô đất 9.5 × 30 | 285.00 m² | — |
| **Khối nhà chính** | **80.00 m²** | 72.95 m² |
| **Toàn bộ phần kín** | **107.70 m²** | 98.25 m² |
| Hành lang ngoài (có mái, hở) | 7.00 m² | — |
| Sân trống | 170.30 m² | — |
| Tường chiếm chỗ | 9.45 m² | — |

Nhà chính chạy từ `y = 12.0` tới `y = 30.0` → **dài 18.0 m**.

## 2. Bảng phòng

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |
|---|---|---:|---:|---:|---:|---|---:|---|---:|---|
| L1 | SÂN PHỤ | 0.0 | 0.0 | 5.0 | 12.0 | 5.0 × 12.0 | 60.00 | 4.89 × 11.78 | 57.60 | Sân |
| L2 | PHÒNG KHÁCH | 0.0 | 12.0 | 5.0 | 16.9 | 5.0 × 4.8 | 24.25 | 4.78 × 4.69 | 22.42 | Phòng |
| L3 | CẦU THANG | 0.0 | 16.9 | 4.0 | 19.0 | 4.0 × 2.1 | 8.60 | 3.89 × 2.05 | 7.97 | Lưu thông |
| L4 | PHÒNG NGỦ 1 | 0.0 | 19.0 | 4.0 | 22.0 | 4.0 × 3.0 | 12.00 | 3.84 × 2.90 | 11.14 | Phòng |
| L5 | THAY ĐỒ / KHO MASTER | 0.0 | 22.0 | 2.4 | 24.0 | 2.4 × 2.0 | 4.80 | 2.24 × 1.90 | 4.26 | Tủ âm |
| L6 | WC CHUNG | 2.4 | 22.0 | 4.0 | 24.0 | 1.6 × 2.0 | 3.20 | 1.50 × 1.90 | 2.85 | Vệ sinh |
| L7 | PHÒNG NGỦ MASTER | 0.0 | 24.0 | 5.0 | 28.0 | 5.0 × 4.0 | 20.00 | 4.78 × 3.84 | 18.36 | Phòng |
| L8 | BAN CÔNG SAU | 0.0 | 28.0 | 5.0 | 30.0 | 5.0 × 2.0 | 10.00 | 4.78 × 1.78 | 8.51 | Sân |
| L9 | HÀNH LANG | 4.0 | 16.9 | 5.0 | 24.0 | 1.0 × 7.2 | 7.15 | 0.84 × 7.10 | 5.96 | Lưu thông |
| R1 | SÂN CHÍNH | 5.0 | 0.0 | 9.5 | 18.0 | 4.5 × 18.0 | 81.00 | 4.39 × 17.78 | 78.05 | Sân |
| R2 | BẾP + NHÀ ĂN | 5.0 | 18.0 | 8.5 | 25.0 | 3.5 × 7.0 | 24.50 | 3.34 × 6.78 | 22.65 | Phòng |
| R3 | HÀNH LANG NGOÀI | 8.5 | 18.0 | 9.5 | 25.0 | 1.0 × 7.0 | 7.00 | 0.84 × 7.00 | 5.88 | Lưu thông |
| R4 | SÂN PHƠI / GIẶT | 5.0 | 25.0 | 9.5 | 30.0 | 4.5 × 5.0 | 22.50 | 4.28 × 4.78 | 20.46 | Sân |
| R5 | WC KHÁCH | 7.9 | 28.0 | 9.5 | 30.0 | 1.6 × 2.0 | 3.20 | 1.44 × 1.84 | 2.65 | Vệ sinh |

**Kiểm tra:** cột trái 150.00 + cột phải 135.00 = **285.00 m²** (WC khách nằm trong sân phơi, không cộng riêng)
**Chuỗi dọc lô chính:** 12.0 + 4.9 + 2.1 + 3.0 + 2.0 + 4.0 + 2.0 = **30.0**

## 3. Bảng cửa

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |
|---|---|---:|---:|---:|---:|---|---|---|
| D1 | ngang | 12.0 | 0.90 | 4.10 | 3.20 | 4 cánh | — | Sân phụ ↔ Phòng khách — CỬA CHÍNH 4 cánh, tâm x = 2.5 |
| D2 | dọc | 5.0 | 15.50 | 16.50 | 1.00 | Mở quay | bản lề đầu nhỏ, mở − | Sân chính ↔ Phòng khách — bản lề phía cửa chính |
| D3 | ngang | 16.9 | 4.00 | 5.00 | 1.00 | Mở thông | — | Phòng khách ↔ Hành lang — thông suốt, KHÔNG có cánh cửa |
| D4 | dọc | 4.0 | 16.85 | 19.00 | 2.15 | Mở thông | — | Hành lang ↔ Cầu thang — thông suốt, chân thang ở đầu bắc hành lang |
| D5 | dọc | 4.0 | 19.15 | 19.95 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ Phòng ngủ 1 — sát mép bắc |
| D6 | dọc | 4.0 | 22.15 | 22.95 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ WC chung — cửa cánh 0.80 m mở vào WC, gioăng kín mùi; vùng quét chừa trống |
| D8 | ngang | 24.0 | 4.00 | 4.90 | 0.90 | Mở quay | bản lề đầu lớn, mở + | Hành lang ↔ Master — mở vào phòng |
| D9 | ngang | 18.0 | 6.60 | 7.60 | 1.00 | Mở quay | bản lề đầu lớn, mở + | Sân chính ↔ Bếp |
| D10 | ngang | 25.0 | 7.40 | 8.20 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Bếp ↔ Sân phơi — mở vào bếp |
| D11 | ngang | 28.0 | 8.40 | 9.20 | 0.80 | Mở quay | bản lề đầu nhỏ, mở + | Sân phơi ↔ WC khách — trên trục hành lang ngoài; sàn WC cao hơn sân 0.15 nên chỉ bước qua ngưỡng, không có bậc |
| D12 | ngang | 28.0 | 0.90 | 4.10 | 3.20 | Lùa 2 cánh | — | Master ↔ Ban công sau — kính lùa 3.2 m, nguồn sáng duy nhất của master |
| D13 | dọc | 5.0 | 28.60 | 29.40 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Ban công sau ↔ Sân phơi — mở vào ban công, chừa phía sân phơi cho bậc; bản lề phía tường bao sau |
| D14 | ngang | 24.0 | 1.50 | 2.30 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Master ↔ phòng thay đồ/kho — cửa cánh 0.80 m mở vào kho; bản lề đầu phải, chỉ cách vách WC 0.10 m; vách ngăn kín tới trần |

## 4. Bảng cửa sổ

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |
|---|---|---:|---:|---:|---:|---|
| W1 | dọc | 5.0 | 12.60 | 14.40 | 1.80 | Phòng khách ← Sân chính |
| W2 | ngang | 18.0 | 5.30 | 6.30 | 1.00 | Bếp ← Sân chính |
| W3 | dọc | 8.5 | 19.20 | 21.20 | 2.00 | Bếp ← Hành lang ngoài |
| W4 | dọc | 7.9 | 28.70 | 29.30 | 0.60 | WC khách ← Sân phơi — ô thoáng kính mờ lật, bệ 2.00, kèm quạt hút |
| W5 | ngang | 19.0 | 3.00 | 3.40 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |
| W6 | ngang | 19.0 | 3.50 | 3.90 | 0.40 | Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1 |

## 6. Cổng, bậc, mái

| Trục | Vị trí | Từ | Đến | Rộng | Tên |
|---|---:|---:|---:|---:|---|
| ngang | 0.0 | 0.70 | 4.30 | 3.60 | CỔNG CHÍNH 3.6m |

### Bậc tam cấp

Vị trí suy từ cửa, đặt phía thấp, bắt đầu từ mặt tường. Số bậc không tính nấc trên cùng — nấc đó chính là ngưỡng cửa.

| Cửa | Xuống | x₁ | y₁ | x₂ | y₂ | Dư mỗi bên | Số bậc | Cao bậc | Mặt bậc |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| D1 | SÂN PHỤ | 0.60 | 11.29 | 4.40 | 11.89 | 0.30 | 2 | 0.15 | 0.30 |
| D2 | SÂN CHÍNH | 5.11 | 15.30 | 5.61 | 16.70 | 0.20 | 2 | 0.15 | 0.25 |
| D13 | SÂN PHƠI / GIẶT | 5.11 | 28.40 | 5.61 | 29.60 | 0.20 | 2 | 0.15 | 0.25 |

### Bản mái đổ ra ngoài tường

Mái hiên, trần ban công — cùng cốt bản mái nhà, bề đua tính từ mặt tường.

| Trục | Vị trí | Từ | Đến | Đua ra | Ghi chú |
|---|---:|---:|---:|---:|---|
| ngang | 12.0 | -0.1 | 5.1 | 1.20 | Mái hiên cửa chính — đổ liền bản mái nhà, công xôn không cột, che bậc D1 |
| ngang | 28.0 | -0.1 | 5.1 | 1.89 | Trần ban công sau — đổ liền bản mái, gác lên tường trái; thay cho lam đứng D12 |

### Lớp chống nóng mái

Kiểu **mái ngược**: chống thấm nằm dưới tấm cách nhiệt, được che nắng và đỡ co giãn nhiệt. Phủ mọi sàn mái bê tông (PHÒNG KHÁCH, CẦU THANG, PHÒNG NGỦ 1, THAY ĐỒ / KHO MASTER, WC CHUNG, PHÒNG NGỦ MASTER, HÀNH LANG, WC KHÁCH) và mái hiên cửa chính, trần ban công sau, tới mặt ngoài tường; chừa giếng trời — quanh mỗi lỗ xây gờ chắn nước cao hơn mặt lát. Diện tích lát **95.66 m²**, mặt lát cốt **4.09** (bản mái 4.00, chưa tính vữa tạo dốc). Lát **rời**, không cán vữa: xây tầng 2 thì nhấc tấm, cuộn vải địa, gỡ XPS — không phải đục, không phạm vào lớp chống thấm.

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
| RF1 | MÁI SÂN CHÍNH | 5.0 · 12.0 · 9.5 · 18.0 | 5.11 · 12.00 · 9.61 · 18.00 | dốc một mái theo y (dốc 10%) | 2.90 → 3.50 | tôn cách nhiệt |
| RF2 | MÁI BẾP + HÀNH LANG | 5.0 · 18.0 · 9.5 · 25.0 | 5.11 · 17.69 · 9.61 · 25.31 | hai mái, nóc theo y ở 21.5 (dốc 30%) | 3.75 → 4.80 | tôn cách nhiệt |
| RF3 | MÁI SÂN PHƠI | 5.0 · 25.0 · 9.5 · 28.0 | 5.11 · 25.00 · 9.61 · 28.00 | dốc một mái theo y (dốc 10%) | 3.50 → 3.20 | tôn cách nhiệt |

- RF2 có **trần tôn cốt 3.75** — BẾP + NHÀ ĂN không đổ mái bê tông; cách sàn phòng 3.60 m

**Máng xối** — suy ra ở mép thấp của mái nhẹ. Không có máng ở đoạn mép nối liền mạch sang mái khác cùng cao độ (nước chảy tiếp) và đoạn đua ra trên một mái thấp hơn (nước rơi xuống mái ấy). Miệng máng ngang mặt dưới mái ở mép, rộng 0.15 m, sâu 0.12 m.

| Mái | Mép | Từ | Đến | Dài | Miệng máng | Đặt |
|---|---|---:|---:|---:|---:|---|
| RF1 | y = 12.00 | 5.11 | 9.45 | 4.34 | 2.90 | dưới mép mái |
| RF3 | y = 27.95 | 7.85 | 9.47 | 1.62 | 3.21 | trong mép, sát chân tường cao hơn mái |
| RF3 | y = 28.00 | 5.11 | 7.85 | 2.74 | 3.20 | dưới mép mái |

**Ống xả đứng** — mỗi dải máng một ống 90 mm ở đầu sát tường bao, chạy thẳng xuống, cắm dưới cốt sân vào ống ngầm — không đổ ra sân.

| Mái | x₁ | y₁ | x₂ | y₂ | Từ cốt (đáy máng) | Áp |
|---|---:|---:|---:|---:|---:|---|
| RF1 | 9.30 | 11.96 | 9.39 | 12.04 | 2.78 | mặt trong tường bao |
| RF3 | 9.30 | 27.83 | 9.39 | 27.92 | 3.08 | mặt trong tường bao |

**Cột đỡ mái nhẹ** — thép hộp 100 × 100, đứng ở chỗ mép mái không tựa lên tường cao tới mái. Vị trí khai theo tâm cột; chiều cao suy ra: từ cốt sân tới đáy dầm biên trên đầu cột. Nhịp giữa hai chỗ đỡ dọc một mép mái không quá 4.5 m.

| Mã | x | y | Đỉnh cột | Đỡ mái | Dưới dầm |
|---|---:|---:|---:|---|---|
| C1 | 9.50 | 12.00 | 2.80 | RF1 | có |
| C2 | 9.50 | 15.00 | 3.09 | RF1 | có |
| C3 | 9.50 | 18.05 | 3.65 | RF2 | có |
| C4 | 9.50 | 21.50 | 4.68 | RF2 | có |
| C5 | 9.50 | 24.95 | 3.65 | RF2 | có |

**Dầm biên** — thép hộp 50 × 100, suy ra dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái, từ mặt tường tới mặt tường, đi qua đầu cột. Mặt trên chạm mặt dưới mái (dầm dọc chiều dốc nghiêng theo mái); ở mép có máng thì dầm lùi vào sau máng, đoạn chui dưới máng hạ xuống đáy máng.

| Mái | Tuyến | Từ | Đến | Dài | Mặt trên | Ghi chú |
|---|---|---:|---:|---:|---|---|
| RF1 | y = 12.00 | 5.11 | 9.47 | 4.36 | 2.91 → 2.91 |  |
| RF1 | y = 18.00 | 8.55 | 9.47 | 0.92 | 3.50 → 3.50 |  |
| RF1 | x = 9.50 | 12.00 | 18.00 | 6.00 | 2.90 → 3.50 | nghiêng theo mái |
| RF2 | y = 18.00 | 8.55 | 9.47 | 0.92 | 3.75 → 3.75 |  |
| RF2 | y = 25.00 | 8.55 | 9.47 | 0.92 | 3.75 → 3.75 |  |
| RF2 | x = 9.50 | 18.00 | 21.50 | 3.50 | 3.75 → 4.80 | nghiêng theo mái |
| RF2 | x = 9.50 | 21.50 | 25.00 | 3.50 | 4.80 → 3.75 | nghiêng theo mái |
| RF3 | y = 25.00 | 8.55 | 9.47 | 0.92 | 3.50 → 3.50 |  |
| RF3 | y = 28.00 | 5.11 | 7.85 | 2.74 | 3.21 → 3.21 |  |
| RF3 | x = 9.50 | 25.00 | 27.95 | 2.95 | 3.50 → 3.21 | nghiêng theo mái |

**Xà gồ** — thép hộp 40 × 80, đặt vuông góc chiều dốc, mặt trên chạm mặt dưới tôn. Số hàng suy ra để bước dọc mái không quá 1.20 m; mỗi thanh dừng ở mặt tường hoặc dầm biên, nhịp không quá 4.50 m.

| Mái | Mã | Tuyến | Từ | Đến | Nhịp | Mặt trên |
|---|---|---|---:|---:|---:|---:|
| RF1 | RF1-P1 | y = 13.20 | 5.11 | 9.47 | 4.36 | 3.02 |
| RF1 | RF1-P2 | y = 14.40 | 5.11 | 9.47 | 4.36 | 3.14 |
| RF1 | RF1-P3 | y = 15.60 | 5.11 | 9.47 | 4.36 | 3.26 |
| RF1 | RF1-P4 | y = 16.80 | 5.11 | 9.47 | 4.36 | 3.38 |

### Cầu thang lên mái

Cao bậc suy ra từ mặt sàn tới mặt mái đi lại được chia đều số nấc; nấc cuối mỗi vế lên chiếu nghỉ / mặt mái, nên số mặt bậc ít hơn số nấc một. Bản thang dày 0.12 m dưới mặt bậc, gầm thang hở. Lỗ thang cũng là lỗ khoét bản mái.

| Mã | Tên | Lỗ thang x₁ · y₁ · x₂ · y₂ | Rộng vế | Nấc (vế 1 + vế 2) | Cao bậc | Mặt bậc | Chiếu nghỉ | Từ cốt → tới cốt |
|---|---|---|---:|---|---:|---:|---:|---|
| CT1 | CẦU THANG LÊN MÁI | 0.11 · 16.90 · 3.92 · 18.95 | 0.95 | 10 + 12 | 0.170 | 0.26 | 2.15 | 0.45 → 4.19 |

Lan can thang cao 0.90 m dọc mép vế 2 giáp phòng khách (trên bức lửng cao 1.00 m) và ở mép lỗ thang trên mặt mái. Khe giữa hai vế rộng 0.15 m: mỗi vế một tay vịn ở mép trong, chết vào một trụ ở đầu khe trên chiếu nghỉ.

### Tum

Tường gạch 100 trát sơn, mái tôn, ô lấy sáng polycarbonate, ô thoáng lá kính gắn tường xếp nghiêng sát mái. Vùng 0.00 · 16.85 · 3.97 · 19.00 (tim vách), sàn là mặt mái cốt 4.09, mặt dưới mái tum 6.79; tường dày 100 mm, ô thoáng cao 0.30 m sát mái trên hai vách dài, gắn 4 lá kính cố định xếp nghiêng chéo xuống ra ngoài (lá trên chồng mép lá dưới — mưa hắt, lá cây không vào). Mái tum đua ngắn 0.18 m ra khỏi mặt ngoài tường (cạnh trên ranh lô không đua), mép bọc diềm gập cao 0.12 m. Trên cửa có ô văng đua 0.60 m, dài hơn cửa 0.20 m mỗi bên. Cửa ra mái có cánh mở vào trong tum, chốt từ trong nhà, ngưỡng có gờ chắn nước cao 0.10 m, cao 2.20 m tính từ mặt mái:vách x = 3.97, y 16.98–17.78. Ô polycarbonate đậy trọn lỗ thang. Dỡ đi khi xây tầng 2.

### Lan can mái

Lan can thép sơn, trụ bắt nở vào đỉnh tường, cao 1.10 m từ mặt mái cốt 4.09.

| Trục | Vị trí | Từ | Đến | Dài |
|---|---:|---:|---:|---:|
| ngang | 10.73 | 0.00 | 5.00 | 5.00 |
| dọc | 0.00 | 10.73 | 16.85 | 6.12 |
| dọc | 0.00 | 19.00 | 30.00 | 11.00 |
| ngang | 30.00 | 0.00 | 5.00 | 5.00 |
| dọc | 5.00 | 10.73 | 19.13 | 8.40 |
| dọc | 5.00 | 23.87 | 30.00 | 6.13 |

### Bồn nước trên mái

Bồn inox 1000 L nằm ngang, giá thép sơn, chân có bản đế dàn tải. Thân Ø 0.96 × 1.59 m trên giá cao 0.60 m; bốn chân thép 50 × 50 mm, mỗi chân một **bản đế 300 × 300 mm** dàn tải xuống lớp chống nóng — chân trần đặt thẳng lên tấm lát thì ép quá sức XPS.

| Mã | Dung tích | Trục nằm | Hình chiếu x₁ · y₁ · x₂ · y₂ | Chân giá cốt | Đỉnh bồn cốt |
|---|---:|---|---|---:|---:|
| BN1 | 1000 L | dọc | 0.25 · 28.20 · 1.21 · 29.79 | 4.09 | 5.65 |

### Giàn phơi

Giàn phơi trụ thép hộp 50 × 50 sơn tĩnh điện, đầu chữ V chìa hai bên, hai thanh phơi inox Ø27. Mặt cắt **hình tam giác ngược**: trụ cao 1.50 m, trên đầu trụ hai tay chìa vươn lên 0.25 m và ra 0.25 m mỗi bên, đỡ hai thanh phơi ở cốt 1.80 m. Hai thanh vì thế cách nhau 0.50 m theo phương ngang — treo kín cả hai mà quần áo không chạm nhau. Đặt ngoài trời, ở dải sân chừa không lợp mái — treo dưới mái thì mất nắng.

| Mã | Sân | Trục | Tim tuyến | Từ | Đến | Dài tuyến | Hai thanh ở | Tổng dây phơi |
|---|---|---|---:|---:|---:|---:|---|---:|
| GP1 | SÂN PHƠI / GIẶT | ngang | 29.35 | 5.75 | 7.70 | 1.95 m | y 29.10 · 29.60 | 3.90 m |

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

| Trục | Vị trí | Từ | Đến | Dày (mm) |
|---|---:|---:|---:|---:|
| ngang | 0.0 | 0.0 | 9.5 | 220 |
| ngang | 30.0 | 0.0 | 9.5 | 220 |
| dọc | 0.0 | 0.0 | 30.0 | 220 |
| dọc | 9.5 | 0.0 | 30.0 | 220 |
| ngang | 12.0 | 0.0 | 5.0 | 220 |
| ngang | 28.0 | 0.0 | 5.0 | 220 |
| dọc | 5.0 | 12.0 | 28.0 | 220 |
| dọc | 5.0 | 28.0 | 30.0 | 220 |
| ngang | 16.9 | 0.0 | 3.7 | 100 |
| ngang | 19.0 | 0.0 | 4.0 | 100 |
| ngang | 22.0 | 0.0 | 4.0 | 100 |
| ngang | 24.0 | 0.0 | 5.0 | 100 |
| dọc | 4.0 | 19.0 | 24.0 | 100 |
| dọc | 2.4 | 22.0 | 24.0 | 100 |
| ngang | 18.0 | 5.0 | 8.5 | 220 |
| ngang | 25.0 | 5.0 | 8.5 | 220 |
| dọc | 8.5 | 18.0 | 25.0 | 100 |
| ngang | 28.0 | 7.9 | 9.5 | 100 |
| dọc | 7.9 | 28.0 | 30.0 | 100 |

## 8. Nội thất

| Loại | x | y | Rộng | Sâu |
|---|---:|---:|---:|---:|
| sofa | 0.25 | 13.30 | 2.60 | 0.85 |
| sofa | 0.25 | 14.15 | 0.85 | 1.20 |
| tbl | 1.40 | 14.55 | 1.30 | 0.80 |
| shrine | 0.11 | 16.30 | 0.70 | 0.50 |
| tvShelf | 0.81 | 16.30 | 2.85 | 0.50 |
| bedw | 0.25 | 19.90 | 2.00 | 1.60 |
| cab | 3.30 | 20.30 | 0.60 | 1.50 |
| cab | 0.10 | 22.10 | 0.60 | 1.75 |
| cab | 0.70 | 22.10 | 1.60 | 0.60 |
| lav | 2.50 | 22.15 | 0.45 | 0.55 |
| wc | 2.50 | 23.05 | 0.42 | 0.68 |
| shower | 3.05 | 23.05 | 0.80 | 0.80 |
| bedw | 0.25 | 25.20 | 2.10 | 1.85 |
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
| wc | 8.05 | 29.10 | 0.42 | 0.68 |
| lav | 9.00 | 28.95 | 0.40 | 0.60 |
| round | 5.50 | 12.80 | 1.40 | 1.40 |

---

## 9. Điểm cần lưu ý

**Ban công 2.0 m đổi hẳn vai trò.** Ở 1.0 m nó chỉ là khe thoáng; 2.0 m thì kê được bàn nhỏ và phơi được đồ, đồng thời khoảng lùi khỏi tường rào sau xa hơn nên master nhận sáng khá hơn hẳn. Master vẫn không có cửa sổ nào — toàn bộ ánh sáng qua cửa lùa D12 rộng 3.2 m.

**Tam giác bếp:** bếp nấu ở nhánh dọc, chậu rửa ở nhánh ngang, tủ lạnh nên đặt ở đầu bắc nhánh dọc — ba điểm tạo tam giác cạnh khoảng 1.5–2.0 m, đúng tầm thao tác.

**Phòng khách mất nắng Đông Nam.** Mái sân chính trùm hết dọc tường phòng khách: W1 còn 27% phần trời (mái bàn trà cũ 92%), D2 còn 26% (cũ 54%); nắng trực tiếp lên W1 + D2 ngày đông chí còn 18% so với không mái (cũ 70%). Phòng khách giờ sáng chủ yếu nhờ cửa chính D1.

**Bếp bị mái che ba phía** — mái sân chính phía bắc, mái bếp kéo sang hành lang phía đông, mái sân phơi phía nam, đều là tôn không cho sáng qua. Mái sân chính rộng ra nên W2 còn 20%, D9 25% phần trời; W3 sáng hơn trước vì mái trên hành lang nâng cao (nay mép 3.75), D10 37% (mép mái sân phơi nâng lên 3.20). Sân giếng bên dưới mái chỉ có hai vòi âm tường và máy giặt dồn vào góc, để lối ra bếp qua D10 không bị thiết bị chiếm. Ngày âm u phải bật đèn bếp ban ngày. Đã cân nhắc tấm lấy sáng và không chọn.

**Hành lang ngoài hứng mưa tạt nhiều hơn.** Mái bếp kéo sang nên khoảng hở giữa đỉnh rào 1.80 và đáy dầm mép mái rộng 1.85 m ở hai đầu, 2.9 m dưới nóc, quay Đông Nam — mưa gió tạt vào lối đi và tường đông bếp; thấy ướt thì thêm diềm tôn hoặc lam ở đầu hồi phía rào. Cột C4 dưới nóc cao ~4.7 m đứng trên rào chỉ xây đặc 0.80 — kỹ sư kết cấu xem lại tiết diện và liên kết chân cột.

**Cầu thang và tum — nghĩ cho tầng 2.** Móng, cột, dầm nhà chính phải tính cho 2 tầng cộng tum ngay bây giờ; tường gạch tum phải đứng trên dầm, không xây thẳng lên bản mái; bản mái sẽ thành sàn tầng 2, lỗ thang đổ sẵn dầm bo. Sau khi bỏ giếng trời, **đầu nam hành lang (gần master) tối hơn**: chỉ còn ánh sáng từ tum rọi xuống buồng thang. **Phòng ngủ 1 chỉ còn ánh sáng mượn** qua hai ô thoáng nhỏ W5, W6 ra buồng thang — không cửa sổ ra trời, ban ngày tối; hợp làm phòng ngủ phụ, phòng khách ở lại. Cánh lật cố định nên không đóng được: tiếng động và ánh đèn đêm ở cầu thang vẫn qua ô. Muốn đóng được thì làm cánh lật có tay chốt thay vì cố định. **Cửa tum ra thẳng mái, không có chiếu tới**: cánh phải mở ra phía mái (mở vào là quét lên bậc), chốt bằng then ở mặt trong cánh. Người đi lên đứng trên bậc cuối mới mở được cửa — lắp tay nắm và đèn ở đầu thang, đừng để đồ trước cửa phía mái. Gờ chắn nước 10 cm ở ngưỡng, ô văng 0.6 m che trên cửa, cửa mở ra được gió ép vào khuôn; vẫn cần gioăng và mặt mái trước cửa dốc ra ngoài. Ô thoáng tum gắn lá kính xếp nghiêng chéo xuống, lá trên chồng mép lá dưới, lại nằm dưới mái đua — mưa hắt và lá cây không vào; lá kính bám bụi, thỉnh thoảng phải lau. Buồng thang thông phòng khách nên hơi lạnh máy lạnh bay lên tum — mở máy lạnh thì đóng cửa đầu thang. Lớp chống nóng XPS trên mái sẽ nằm dưới sàn tầng 2 sau 5 năm, nên **đã chốt lát rời** — dỡ bằng cách nhấc tấm chứ không đục.

**WC chung không còn ô thoáng.** Quạt hút âm trần nối ống PVC lên mái, đầu ống có chụp chắn mưa và đi xuyên lớp chống thấm có cổ ống — sau này đi tiếp lên theo hộp kỹ thuật tầng 2. Chọn quạt có van một chiều để gió mái không thổi ngược mùi vào.

**Giàn phơi chỉ 3.90 m dây, và phơi ngoài trời thì phụ thuộc thời tiết.** Dải hở chỉ 2.9 × 2.0 m, lại phải chừa bậc cửa D13 ở đầu tây, nên tuyến chỉ dài 1.95 m. Kiểu tam giác ngược bù lại bằng chỗ treo rộng: hai thanh cách nhau 0.50 m nên treo kín cả hai mà quần áo không chạm nhau — hơn hẳn xếp ba thanh chồng tầng dù tổng mét dây ít hơn. Nhà bốn người giặt một mẻ lớn vẫn không đủ chỗ, phải phơi thêm dưới mái sân phơi hoặc dùng máy sấy. Bắc Giang có mùa nồm và mưa phùn kéo dài, những ngày ấy phơi ngoài trời vô ích — **máy giặt/sấy ở góc sân giếng là thứ gánh việc**, giàn phơi chỉ để tận dụng ngày nắng. Muốn thêm dây thì gắn giàn treo kéo tay dưới mái sân phơi (đoạn `y` 25–28), nhưng chỗ đó không có nắng.

**Bồn nước 1000 L trên trần ban công — nói với kỹ sư kết cấu.** Bồn đầy nước nặng cỡ 1 tấn, đứng trên bản trần ban công sau (nhịp 5 m gác hai tường bên `x = 0` và `x = 5`), không phải trên mái nhà chính có dầm cột. Đã đặt dọc áp sát tường trái để tải nằm sát gối, nhưng **bản trần ban công vẫn phải được tính với tải này** — cả khi sau 5 năm xây tầng 2 và bồn chuyển chỗ. Bốn chân giá phải có bản đế 300 × 300: chân trần 50 × 50 ép xuống cỡ 1000 kPa, quá sức nén XPS 300 kPa, tấm lát sẽ lún và XPS bị bẹp. Đường cấp lên bồn và ống xuống đi trong hộp kỹ thuật, chỗ xuyên lớp chống thấm phải có cổ ống — giống ống quạt hút WC chung. Bồn phơi nắng cả ngày thì nước nóng về chiều: muốn nước mát thì bọc cách nhiệt hoặc che, nhưng che thì lại thêm khối trên mái.

**Mái hiên cửa chính thành một phần sân thượng.** Bản công xôn 1.2 m không cột nay có người đi lại và lan can bắt ở mép ngoài — kỹ sư kết cấu phải tính lại tải và neo trụ lan can; lan can mép công xôn chịu lực đẩy ngang lớn nhất.

**Rào thoáng thì lộ.** Tường rào chỉ xây đặc 0.80 m, phía trên là lan can: từ ngõ và nhà bên nhìn xuyên được vào sân chính, sân phơi và ban công. Muốn kín chỗ nào thì thêm rèm, lam hay cây ở đoạn đó. Ban công cao hơn sân 0.45 nên lan can sau ban công cao 1.35 m tính từ sàn ban công — vẫn trên mức 1.1 m thường đòi cho lan can.

**Sơn chống nóng tường trái — không đổi hình khối, đừng quên:** sơn mặt ngoài tường trái (16 m quay Tây Bắc) ngay lúc xây, khi lô bên cạnh còn trống và dựng được giàn giáo.

**Lớp chống nóng mái — chỗ đáng tiền nhất** (mái bê tông nhận nhiệt hè gấp ~4 lần bức tường trái). XPS được che kín thì bền cỡ 30–50 năm; thứ hỏng trước là lớp chống thấm, nên khi thi công: chống thấm nằm **dưới** XPS, không khò bitum nóng hay sơn gốc dầu; lát tấm ngay, không để XPS phơi nắng; mua đúng XPS ô kín, không phải xốp trắng EPS; tạo dốc từ lớp dưới cho nước không đọng dưới tấm; quanh mọi lỗ trên mái xây gờ cao hơn mặt lát. Dột thì nhấc tấm và gỡ XPS là tới được lớp chống thấm — đó chính là cái lợi của lát rời.

**Lát rời — phải giữ mấy điều.** Tấm đủ nặng để gió không bốc: 400 × 400 × 40 bê tông nặng chừng 15 kg/m², đặt sát nhau và có lan can 1.1 m quanh mép mái nên đủ; **đừng thay bằng tấm mỏng hay tấm nhựa**. Mép mái, quanh lỗ thang và chân tường tum là chỗ gió xoáy mạnh nhất — hàng tấm ngoài cùng nên chèn khít hoặc dán điểm. Khe giữa các tấm để hở cho nước xuống, nên rác và lá đọng trong khe: mỗi năm nhấc vài tấm ở chỗ thoát nước mà vét. Mặt lát đi theo dốc mái, **không phẳng tuyệt đối** — kê bồn nước hay chân giàn phơi thì phải đệm. Đi trên tấm rời có tiếng cộc và tấm hơi bập bênh nếu lớp dưới không đều: cán phẳng mặt XPS trước khi trải vải địa.

## 10. Kết quả bộ kiểm tra

**Sạch — qua toàn bộ 16 phép kiểm.**

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
14. Bậc, mái hiên, tường nâng, cốt sàn riêng, lớp chống nóng mái khai đúng chỗ; bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa
15. Mái nhẹ khai đủ và không chồng nhau; mái nào trùm phòng kín thì trùm trọn và có cốt trần; cột đỡ mái nằm trong lô, dưới một mái nhẹ, không đứng giữa nội thất
16. Cầu thang lên mái: vế và chiếu nghỉ khớp lỗ thang, cao bậc và mặt bậc trong giới hạn, nằm gọn trong phòng, không vướng nội thất hay cánh cửa; có tum trùm kín lỗ thang, cửa tum trên vách; có lan can mép mái đứng trên mái bê tông

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
| current ← | cầu thang lên mái, tum | 107.7 |

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
- **Giàn phơi ngoài trời** ở sân phơi, **dọc theo tường bao sau** `y = 30` (chủ nhà chỉnh: không đặt cạnh WC khách nữa): tuyến ngang `y = 29.35`, `x` 5.75–7.70. **Mặt cắt hình tam giác ngược** — hai trụ thép hộp 50 × 50 cao 1.50, trên đầu mỗi trụ hai tay chìa vươn lên 0.25 và ra 0.25 mỗi bên, đỡ **hai thanh phơi** inox Ø27 ở cốt 1.80. Hai thanh cách nhau 0.50 theo phương ngang chứ không xếp chồng: treo kín cả hai mà quần áo không chạm nhau, hong được nhiều đồ hơn kiểu nhiều thanh xếp tầng. **3.90 m dây phơi**. Đặt trong **dải chừa hở** `y` 28–30, chỗ cố ý không lợp mái để còn nắng; nắng chiều Tây Nam vào thẳng. Đầu tây lùi tới `x` 5.75 để qua khỏi bậc cửa D13 — lối từ ban công ra sân không chui dưới quần áo ướt
- **Bồn nước inox 1000 L** nằm ngang trên giá thép, **góc cuối nhà trên trần ban công sau** — thân dọc trục y áp sát tường trái: trần ban công gác hai tường bên nên nó nhịp 5 m theo x, đặt dọc sát một gối thì cả tấn nước nằm trong 1.2 m quanh gối thay vì ra giữa nhịp. Bốn chân có **bản đế 300 × 300** dàn tải — chân trần đặt thẳng lên tấm lát ép cỡ 1000 kPa, quá sức XPS 300 kPa
- **Cầu thang chữ U lên mái** thay phòng thờ (chuẩn bị tầng 2 sau khoảng 5 năm): hai vế rộng 0.95 m, 22 nấc cao ≈ 0.170, mặt bậc 0.26, chiếu nghỉ sát tường trái; chân thang ở đầu bắc hành lang. Bỏ vách phòng khách – phòng thờ, thay bằng **bức lửng 1 m** kèm **lan can song thoáng** (không tấm đặc cho khỏi bí) — phòng khách nhận sáng và gió từ tum. Phòng khách 5 × 5 → 5 × 4.85
- **Tum tường gạch** (không vách tôn / nhựa), mái tôn, trên buồng thang; mặt dưới mái tum 2.70 m trên mặt mái, ô thoáng 0.30 m sát mái gắn **4 lá kính xếp nghiêng chéo xuống** — gió qua, mưa hắt và lá cây không vào, ô polycarbonate đậy trọn lỗ thang, tum **gọn, tường áp sát đầu thang, một cửa** ngay đầu vế 2 — lên hết thang là ra thẳng mái; cánh mở ra phía mái, **then chốt mặt trong** — không ai từ mái vào nhà tự do — ngưỡng có **gờ chắn nước** cao 0.10 m làm nấc cuối của thang; **mái tum đua ngắn 0.18 m bọc diềm gập** ba phía (phía ranh lô trái không đua) cho gọn, **ô văng 0.6 m** che trên cửa; dỡ khi xây tầng 2
- **Lan can thép 1.1 m** quanh mép mái nhà chính, **bao luôn mái hiên cửa chính** — mái thành sân thượng: phơi đồ, bồn nước, bảo trì lớp chống nóng. Khai tuyến liền cả bốn cạnh; đoạn chừa ở vách tum và ở chỗ đầu hồi bếp nhô trên mặt mái (tuyến x = 5) nay **suy từ hình học** thay cho hai số chép tay — đầu hồi chỉ thật sự chắn từ y 19.20 đến 23.80, lan can dài thêm 0.40 m mỗi đầu
- **Bỏ giếng trời hành lang SK1, hai cửa trời SK2, SK3 và ô thoáng WC chung SK4** — xây tầng 2 là phải bịt; mái bê tông không còn lỗ nào ngoài lỗ thang. WC chung dùng quạt hút nối ống lên mái. Phòng ngủ 1 lấy gió, sáng qua **hai ô thoáng nhỏ W5, W6** (0.40 × 0.30 m, bệ 2.40) ra buồng thang, dồn về phía cửa PN1 — **cánh kính mờ lật cố định** ngả vào phòng, người bên thang đứng thấp hơn bệ chỉ nhìn thấy trần. Thay ô kính cố định và ô lật to đã thử, nhìn vào dễ quá
