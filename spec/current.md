# Đặc tả mặt bằng — Hiện hành — mái tôn liền dải sân chính, hành lang, sân phơi

> Sinh tự động từ `lib/versions/current.js` lúc 09:49:11 11/9/2026. Không chép tay.
> **Quy ước:** toạ độ và kích thước là **tim tường**. Gốc (0,0) = góc trên-trái lô. X→phải (0–9.5). Y→xuống (0–30).
> Cột **Sử dụng** là kích thước lọt lòng, đã trừ nửa bề dày mỗi tường bao quanh.
> Tường bao **220 mm** · Tường ngăn **100 mm**.

Ban công sau 2.0 m, bếp chữ L. Bếp lợp tôn hai mái (thay bản bê tông); mái sân chính 4.5 × 6 m, mái hành lang ngoài và mái sân phơi là một dải tôn liền vòng quanh bếp, máng xối ở các mép thấp ngoài cùng.

---

## 1. Tổng quan

| Mục | Tim tường | Sử dụng |
|---|---:|---:|
| Lô đất 9.5 × 30 | 285.00 m² | — |
| **Khối nhà chính** | **80.00 m²** | 72.87 m² |
| **Toàn bộ phần kín** | **108.50 m²** | 98.90 m² |
| Hành lang ngoài (có mái, hở) | 7.00 m² | — |
| Sân trống | 169.50 m² | — |
| Tường chiếm chỗ | 9.60 m² | — |

Nhà chính chạy từ `y = 12.0` tới `y = 30.0` → **dài 18.0 m**.

## 2. Bảng phòng

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Tim tường | DT tim | Sử dụng | DT sd | Loại |
|---|---|---:|---:|---:|---:|---|---:|---|---:|---|
| L1 | SÂN PHỤ | 0.0 | 0.0 | 5.0 | 12.0 | 5.0 × 12.0 | 60.00 | 4.89 × 11.78 | 57.60 | Sân |
| L2 | PHÒNG KHÁCH | 0.0 | 12.0 | 5.0 | 17.0 | 5.0 × 5.0 | 25.00 | 4.78 × 4.84 | 23.14 | Phòng |
| L3 | PHÒNG THỜ | 0.0 | 17.0 | 4.0 | 19.0 | 4.0 × 2.0 | 8.00 | 3.84 × 1.90 | 7.30 | Phòng |
| L4 | PHÒNG NGỦ 1 | 0.0 | 19.0 | 4.0 | 22.0 | 4.0 × 3.0 | 12.00 | 3.84 × 2.90 | 11.14 | Phòng |
| L5 | KHO | 0.0 | 22.0 | 1.8 | 24.0 | 1.8 × 2.0 | 3.60 | 1.64 × 1.90 | 3.12 | Lưu thông |
| L6 | WC CHUNG | 1.8 | 22.0 | 4.0 | 24.0 | 2.2 × 2.0 | 4.40 | 2.10 × 1.90 | 3.99 | Vệ sinh |
| L7 | PHÒNG NGỦ MASTER | 0.0 | 24.0 | 5.0 | 28.0 | 5.0 × 4.0 | 20.00 | 4.78 × 3.84 | 18.36 | Phòng |
| L8 | BAN CÔNG SAU | 0.0 | 28.0 | 5.0 | 30.0 | 5.0 × 2.0 | 10.00 | 4.78 × 1.78 | 8.51 | Sân |
| L9 | HÀNH LANG | 4.0 | 17.0 | 5.0 | 24.0 | 1.0 × 7.0 | 7.00 | 0.84 × 6.95 | 5.84 | Lưu thông |
| R1 | SÂN CHÍNH | 5.0 | 0.0 | 9.5 | 18.0 | 4.5 × 18.0 | 81.00 | 4.39 × 17.78 | 78.05 | Sân |
| R2 | BẾP + NHÀ ĂN | 5.0 | 18.0 | 8.5 | 25.0 | 3.5 × 7.0 | 24.50 | 3.34 × 6.78 | 22.65 | Phòng |
| R3 | HÀNH LANG NGOÀI | 8.5 | 18.0 | 9.5 | 25.0 | 1.0 × 7.0 | 7.00 | 0.84 × 7.00 | 5.88 | Lưu thông |
| R4 | SÂN PHƠI / GIẶT | 5.0 | 25.0 | 9.5 | 30.0 | 4.5 × 5.0 | 22.50 | 4.28 × 4.78 | 20.46 | Sân |
| R5 | WC KHÁCH | 7.5 | 28.0 | 9.5 | 30.0 | 2.0 × 2.0 | 4.00 | 1.84 × 1.84 | 3.39 | Vệ sinh |

**Kiểm tra:** cột trái 150.00 + cột phải 135.00 = **285.00 m²** (WC khách nằm trong sân phơi, không cộng riêng)
**Chuỗi dọc lô chính:** 12.0 + 5.0 + 2.0 + 3.0 + 2.0 + 4.0 + 2.0 = **30.0**

## 3. Bảng cửa

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Loại | Chiều mở | Nối |
|---|---|---:|---:|---:|---:|---|---|---|
| D1 | ngang | 12.0 | 0.90 | 4.10 | 3.20 | 4 cánh | — | Sân phụ ↔ Phòng khách — CỬA CHÍNH 4 cánh, tâm x = 2.5 |
| D2 | dọc | 5.0 | 15.50 | 16.50 | 1.00 | Mở quay | bản lề đầu nhỏ, mở − | Sân chính ↔ Phòng khách — bản lề phía cửa chính |
| D3 | ngang | 17.0 | 4.00 | 5.00 | 1.00 | Mở thông | — | Phòng khách ↔ Hành lang — thông suốt, KHÔNG có cánh cửa |
| D4 | dọc | 4.0 | 17.15 | 17.95 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ Phòng thờ — sát mép bắc |
| D5 | dọc | 4.0 | 19.15 | 19.95 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ Phòng ngủ 1 — sát mép bắc |
| D6 | dọc | 4.0 | 22.15 | 22.95 | 0.80 | Mở quay | bản lề đầu nhỏ, mở − | Hành lang ↔ WC chung — sát mép bắc |
| D7 | ngang | 24.0 | 0.45 | 1.35 | 0.90 | Lùa 1 cánh | — | Master ↔ Kho — lùa 1 cánh |
| D8 | ngang | 24.0 | 4.00 | 4.90 | 0.90 | Mở quay | bản lề đầu lớn, mở + | Hành lang ↔ Master — mở vào phòng |
| D9 | ngang | 18.0 | 6.60 | 7.60 | 1.00 | Mở quay | bản lề đầu lớn, mở + | Sân chính ↔ Bếp |
| D10 | ngang | 25.0 | 7.40 | 8.20 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Bếp ↔ Sân phơi — mở vào bếp |
| D11 | ngang | 28.0 | 8.40 | 9.20 | 0.80 | Mở quay | bản lề đầu nhỏ, mở + | Sân phơi ↔ WC khách — trên trục hành lang ngoài; sàn WC cao hơn sân 0.15 nên chỉ bước qua ngưỡng, không có bậc |
| D12 | ngang | 28.0 | 0.90 | 4.10 | 3.20 | Lùa 2 cánh | — | Master ↔ Ban công sau — kính lùa 3.2 m, nguồn sáng duy nhất của master |
| D13 | dọc | 5.0 | 28.60 | 29.40 | 0.80 | Mở quay | bản lề đầu lớn, mở − | Ban công sau ↔ Sân phơi — mở vào ban công, chừa phía sân phơi cho bậc; bản lề phía tường bao sau |

## 4. Bảng cửa sổ

| Mã | Trục | Vị trí | Từ | Đến | Rộng | Vị trí |
|---|---|---:|---:|---:|---:|---|
| W1 | dọc | 5.0 | 12.60 | 14.40 | 1.80 | Phòng khách ← Sân chính |
| W2 | ngang | 18.0 | 5.30 | 6.30 | 1.00 | Bếp ← Sân chính |
| W3 | dọc | 8.5 | 19.20 | 21.20 | 2.00 | Bếp ← Hành lang ngoài |
| W4 | dọc | 7.5 | 28.70 | 29.30 | 0.60 | WC khách ← Sân phơi — ô thoáng kính mờ lật, bệ 2.00, kèm quạt hút |

## 5. Lấy sáng trên mái

| Mã | Tên | x | y | Kích thước | Ghi chú |
|---|---|---:|---:|---|---|
| SK1 | GIẾNG TRỜI HÀNH LANG | 4.10 | 17.40 | 0.8 × 6.2 | Hành lang — nguồn sáng duy nhất, hành lang không có cửa sổ nào |
| SK2 | CỬA TRỜI | 2.30 | 19.60 | 1.3 × 1.3 | Phòng ngủ 1 — cửa trời có cánh lật, đặt lệch khỏi đầu giường |
| SK3 | CỬA TRỜI | 1.60 | 17.50 | 1.0 × 1.0 | Phòng thờ — cửa trời có cánh lật, đặt trước kệ thờ |
| SK4 | Ô THOÁNG | 2.60 | 22.60 | 0.8 × 0.7 | WC chung — ô thoáng kèm quạt hút |

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
| ngang | 12.0 | -0.1 | 5.1 | 1.20 | Mái hiên cửa chính — đổ liền bản mái nhà, che bậc D1 |
| ngang | 28.0 | -0.1 | 5.1 | 1.89 | Trần ban công sau — đổ liền bản mái, gác lên tường trái; thay cho lam đứng D12 |

### Mái nhẹ

Mái phụ lợp tôn, không phải bản bê tông liền mái nhà. Vùng phủ khai theo tim tường; tấm mái thật lùi vào mặt trong bức tường nào cao hơn nó và đua ra mặt ngoài bức nào thấp hơn, nên hai cột dưới đây lệch nhau nửa bề dày tường. Cao độ là **mặt dưới** mái, tấm lợp dày 0.05 m.

| Mã | Tên | Vùng khai | Tấm mái dựng | Dạng | Cao độ mặt dưới | Vật liệu |
|---|---|---|---|---|---|---|
| RF1 | MÁI SÂN CHÍNH | 5.0 · 12.0 · 9.5 · 18.0 | 5.11 · 12.00 · 9.61 · 18.00 | dốc một mái theo y (dốc 10%) | 2.90 → 3.50 | tôn cách nhiệt |
| RF2 | MÁI BẾP | 5.0 · 18.0 · 8.5 · 25.0 | 5.11 · 17.69 · 8.55 · 25.31 | hai mái, nóc theo y ở 21.5 (dốc 30%) | 3.75 → 4.80 | tôn cách nhiệt |
| RF3 | MÁI SÂN PHƠI | 5.0 · 25.0 · 9.5 · 28.0 | 5.11 · 25.00 · 9.61 · 28.00 | dốc một mái theo y (dốc 10%) | 3.50 → 3.20 | tôn cách nhiệt |
| RF4 | MÁI HÀNH LANG | 8.5 · 18.0 · 9.5 · 25.0 | 8.55 · 18.00 · 9.61 · 25.00 | hai mái, nóc theo y ở 21.5 (dốc 10%) | 3.50 → 3.85 | tôn cách nhiệt |

- RF2 có **trần tôn cốt 3.75** — BẾP + NHÀ ĂN không đổ mái bê tông; cách sàn phòng 3.60 m

**Máng xối** — suy ra ở mép thấp của mái nhẹ. Không có máng ở đoạn mép nối liền mạch sang mái khác cùng cao độ (nước chảy tiếp) và đoạn đua ra trên một mái thấp hơn (nước rơi xuống mái ấy). Miệng máng ngang mặt dưới mái ở mép, rộng 0.15 m, sâu 0.12 m.

| Mái | Mép | Từ | Đến | Dài | Miệng máng | Đặt |
|---|---|---:|---:|---:|---:|---|
| RF1 | y = 12.00 | 5.11 | 9.61 | 4.50 | 2.90 | dưới mép mái |
| RF3 | y = 27.95 | 7.45 | 9.61 | 2.16 | 3.21 | trong mép, sát chân tường cao hơn mái |
| RF3 | y = 28.00 | 5.11 | 7.45 | 2.34 | 3.20 | dưới mép mái |

**Ống xả đứng** — mỗi dải máng một ống 90 mm ở đầu sát tường bao, chạy thẳng xuống, cắm dưới cốt sân vào ống ngầm — không đổ ra sân.

| Mái | x₁ | y₁ | x₂ | y₂ | Từ cốt (đáy máng) | Áp |
|---|---:|---:|---:|---:|---:|---|
| RF1 | 9.30 | 11.96 | 9.39 | 12.04 | 2.78 | mặt trong tường bao |
| RF3 | 9.30 | 27.83 | 9.39 | 27.92 | 3.08 | mặt trong tường bao |

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
| ngang | 17.0 | 0.0 | 4.0 | 100 |
| ngang | 19.0 | 0.0 | 4.0 | 100 |
| ngang | 22.0 | 0.0 | 4.0 | 100 |
| ngang | 24.0 | 0.0 | 5.0 | 100 |
| dọc | 4.0 | 17.0 | 24.0 | 100 |
| dọc | 1.8 | 22.0 | 24.0 | 100 |
| ngang | 18.0 | 5.0 | 8.5 | 220 |
| ngang | 25.0 | 5.0 | 8.5 | 220 |
| dọc | 8.5 | 18.0 | 25.0 | 100 |
| ngang | 28.0 | 7.5 | 9.5 | 100 |
| dọc | 7.5 | 28.0 | 30.0 | 100 |

## 8. Nội thất

| Loại | x | y | Rộng | Sâu |
|---|---:|---:|---:|---:|
| sofa | 0.25 | 13.50 | 0.85 | 2.40 |
| sofa | 3.10 | 14.00 | 0.85 | 1.00 |
| tbl | 1.50 | 14.40 | 1.30 | 0.80 |
| cab | 2.20 | 16.40 | 1.80 | 0.50 |
| altar | 0.15 | 17.15 | 0.60 | 1.70 |
| bedw | 0.25 | 19.90 | 2.00 | 1.60 |
| cab | 3.30 | 20.30 | 0.60 | 1.50 |
| cab | 0.15 | 22.15 | 1.50 | 0.50 |
| lav | 1.95 | 22.20 | 0.45 | 0.80 |
| wc | 1.95 | 23.10 | 0.42 | 0.68 |
| shower | 3.00 | 22.95 | 0.90 | 0.90 |
| bedw | 0.25 | 25.20 | 2.10 | 1.85 |
| cab | 0.30 | 24.60 | 0.45 | 0.45 |
| cab | 0.30 | 27.20 | 0.45 | 0.45 |
| cab | 1.80 | 24.15 | 1.80 | 0.55 |
| desk | 3.55 | 25.00 | 1.30 | 1.50 |
| kitsink | 5.15 | 24.30 | 2.15 | 0.60 |
| kithob | 5.15 | 21.90 | 0.60 | 2.40 |
| dine | 6.40 | 19.60 | 1.05 | 2.20 |
| wash | 5.20 | 25.20 | 0.65 | 0.65 |
| wc | 8.05 | 29.10 | 0.42 | 0.68 |
| lav | 9.00 | 28.95 | 0.40 | 0.60 |
| round | 6.35 | 15.60 | 1.40 | 1.40 |

---

## 9. Điểm cần lưu ý

**Ban công 2.0 m đổi hẳn vai trò.** Ở 1.0 m nó chỉ là khe thoáng; 2.0 m thì kê được bàn nhỏ và phơi được đồ, đồng thời khoảng lùi khỏi tường rào sau xa hơn nên master nhận sáng khá hơn hẳn. Master vẫn không có cửa sổ nào — toàn bộ ánh sáng qua cửa lùa D12 rộng 3.2 m.

**Tam giác bếp:** bếp nấu ở nhánh dọc, chậu rửa ở nhánh ngang, tủ lạnh nên đặt ở đầu bắc nhánh dọc — ba điểm tạo tam giác cạnh khoảng 1.5–2.0 m, đúng tầm thao tác.

**Phòng khách mất nắng Đông Nam.** Mái sân chính trùm hết dọc tường phòng khách: W1 còn 27% phần trời (mái bàn trà cũ 92%), D2 còn 26% (cũ 54%); nắng trực tiếp lên W1 + D2 ngày đông chí còn 18% so với không mái (cũ 70%). Phòng khách giờ sáng chủ yếu nhờ cửa chính D1.

**Bếp bị mái che ba phía** — mái sân chính phía bắc, mái hành lang phía đông, mái sân phơi phía nam, đều là tôn không cho sáng qua. Mái sân chính rộng ra nên W2 còn 20%, D9 25% phần trời; W3 sáng hơn trước vì mái hành lang nâng cao, D10 37% (mép mái sân phơi nâng lên 3.20). Ngày âm u phải bật đèn bếp ban ngày. Đã cân nhắc tấm lấy sáng và không chọn.

**Rào thoáng thì lộ.** Tường rào chỉ xây đặc 0.80 m, phía trên là lan can: từ ngõ và nhà bên nhìn xuyên được vào sân chính, sân phơi và ban công. Muốn kín chỗ nào thì thêm rèm, lam hay cây ở đoạn đó. Ban công cao hơn sân 0.45 nên lan can sau ban công cao 1.35 m tính từ sàn ban công — vẫn trên mức 1.1 m thường đòi cho lan can.

**Hai việc chống nóng không đổi hình khối, đừng quên khi thi công:** sơn chống nóng mặt ngoài tường trái (16 m quay Tây Bắc) ngay lúc xây, khi lô bên cạnh còn trống và dựng được giàn giáo; lát lớp chống nóng trên toàn bộ sàn mái bê tông nhà chính, kể cả phần trần ban công sau. Mái bê tông nhận nhiệt hè gấp ~4 lần bức tường trái nên đó mới là chỗ đáng tiền.

## 10. Kết quả bộ kiểm tra

**Sạch — qua toàn bộ 15 phép kiểm.**

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
14. Bậc, mái hiên, tường nâng, cốt sàn riêng khai đúng chỗ; bậc nằm gọn trong sân, không vướng nội thất hay cánh cửa
15. Mái nhẹ khai đủ và không chồng nhau; mái nào trùm phòng kín thì trùm trọn và có cốt trần

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
| current ← | mái tôn liền dải sân chính, hành lang, sân phơi | 108.5 |

### Thay đổi ở Hiện hành — mái tôn liền dải sân chính, hành lang, sân phơi

- Ban công sau 1.0 → **2.0 m sâu** (5.0 × 2.0 = 10.00 m²) — nay ngồi được, không chỉ để thoáng
- Nhà chính 17.0 → **18.0 m**; sân phụ bù lại 13.0 → 12.0 m
- Bếp thêm **nhánh kệ vuông góc** dài 2.4 m dọc tường tây → bếp chữ L
- **Bếp nấu tách sang nhánh dọc**, chậu rửa giữ ở nhánh ngang — hết nấu và rửa chen nhau
- Chậu rửa vẫn quay ra sân phơi, bếp nấu quay vào trong
- WC khách 1.6 → **2.0 × 2.0 m**, hai tường trong xuống 100 mm
- W4 thu thành **ô thoáng 0.6 × 0.4 m**, bệ 2.00 — không nhìn ra được
- **Trần WC khách hạ còn 2.70 m** (trần giả dưới bản mái; trước cao 3.60 vì sàn hạ mà mái giữ cốt) — ô thoáng W4 nâng lên theo, bệ 1.90 → 2.00, mép trên 2.40
- D13 đổi chiều **mở vào ban công** — cánh không quét lên bậc phía sân phơi
- **Bậc tam cấp** cho D1, D2, D13 — 2 bậc ngoài, nấc trên là sàn nhà; mỗi nấc 15 cm, tính từ mặt tường. D1 mặt bậc 30 cm, rộng hơn cửa 0.3 m mỗi bên; cửa phụ D2, D13 gọn hơn — mặt bậc 25 cm, dư 0.2 m mỗi bên
- Sàn bếp **hạ còn +0.15 so với sân** — D9, D10 chỉ còn một nấc ở ngưỡng, khỏi dựng bậc; mái bếp giữ cốt nên trần cách sàn 3.60 m
- **Mái hiên bê tông** đua 1.2 m trước cửa chính, thay cho mái che xe đã bỏ
- Sàn WC khách **hạ còn +0.15 so với sân**, cùng cốt với bếp — D11 khỏi dựng bậc
- **Đổ trần ban công sau**, tường trái ban công xây lên tới mái — thay cho lam đứng D12: ngang lam về sáng và nắng hè, tháng 9 nắng lên kính còn một nửa, D12 hết dính mưa
- **Mái sân chính** trùm hết bề ngang lô phụ 4.5 m, từ mặt tiền nhà chính (y = 12) tới bếp — tôn cách nhiệt dốc 10% ra phía cổng, mặt dưới 3.50 sát bếp → 2.90. Thay mái bàn trà 3.5 × 3.0 m; đổi lại W1, D2 phòng khách mất gần hết trời và nắng Đông Nam. Mái che xe ở sân phụ bỏ hẳn
- **Mái hành lang ngoài** từ tấm phẳng 2.80 thành tôn hai mái 3.50 → nóc 3.85, hai đầu nối phẳng vào mái sân chính và mái sân phơi — đi từ sân chính qua hành lang ra sân phơi, WC khách không qua khe hở nào; nước mái hành lang chảy tiếp sang hai mái ấy
- **Mái bếp đua 0.20 m** ra ngoài tường ở hai mép thấp, không làm máng — nước rơi xuống mái sân chính và mái sân phơi bên dưới
- **Mái sân phơi** dốc 17% → **10%** (mép thấp 3.00 → 3.20), cùng mặt phẳng với nửa nam mái hành lang — hết gãy khúc ở chỗ nối
- **Tường rào hạ 2.20 → 1.80 m**, chỉ xây đặc 0.80 m, phía trên là lan can song thoáng — lấy sáng, lấy gió thay cho tường cao kín. Hai tường bên ban công (tường ranh trái, tường có cửa D13 ra sân phơi) vẫn xây tới trần; lan can chỉ ở rào sau ban công và rào quanh các sân
- **Cổng chính 2.4 → 3.6 m**, tâm vẫn thẳng cửa chính — ô tô vào thoải mái
- **Máng xối** chỉ còn ở mép trước mái sân chính và mép thấp mái sân phơi (đoạn áp tường WC khách đặt sát chân tường); mỗi máng một **ống xả** áp mặt trong tường bao phải, xuống ống ngầm chứ không đổ ra sân
- **Bếp lợp tôn hai mái** thay bản bê tông: nóc chạy ngang ở y = 21.5, dốc 30%, mép mái 3.75 → nóc 4.80 (nhô 0.85 m trên mái nhà); trần tôn cốt 3.75, cách sàn bếp 3.60 m. Tường bắc và nam bếp dừng ở mép mái, tường đông thành đầu hồi
- **Mái sân phơi** dốc một mái phủ y 25–28, chừa dải hở 2.5 × 2.0 m thẳng hàng ban công để còn chỗ phơi nắng
- **Bàn trà dời** từ giữa sân chính vào dưới mái RF1, tránh bậc D2 và vùng quét cánh D2, D9
