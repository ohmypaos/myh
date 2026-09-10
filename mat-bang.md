# Mặt bằng nhà cấp 4 — 9.5 × 30 m — HIỆN TRẠNG (v1)

> ⚠️ **File này chỉ mô tả HIỆN TRẠNG (v1)**, tức bản vẽ gốc `banve.png`.
> Phương án đang làm việc là **v12** — xem [`mat-bang-dac-ta.md`](./mat-bang-dac-ta.md).
> Giữ file này lại để đối chiếu, không dùng làm số liệu thi công.

> Nguồn: `banve.png`. Kích thước phòng lấy từ nhãn trên bản vẽ (chính xác).
> Toạ độ và vị trí cửa là **ước lượng** đọc từ ảnh raster — dùng làm mốc, cần xác nhận lại với bản vẽ gốc.

## 1. Thông số lô đất

| Mục | Giá trị |
|---|---|
| Kích thước lô | 9.5 m (ngang) × 30.0 m (sâu) |
| Diện tích lô | 285.0 m² |
| Lô chính (trái) | 5.0 × 30 m = 150.0 m² |
| Lô phụ (phải) | 4.5 × 30 m = 135.0 m² |
| Diện tích có mái (ước) | ~127 m² (không tính hành lang ngoài) |
| Diện tích sân | ~151 m² (53% lô đất) |
| Số phòng ngủ | 2 |

## 2. Hệ toạ độ

Gốc `(0,0)` = góc **trên-trái** của lô.
`X` tăng sang phải (0 → 9.5). `Y` tăng xuống dưới (0 → 30).
Hướng "trên" của bản vẽ = mặt tiền (phía có sân chính/sân phụ).

## 3. Danh sách phòng

### Cột trái — lô chính (x: 0 → 5.0)

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Rộng | Sâu | DT (m²) |
|---|---|---|---|---|---|---|---|---|
| L1 | Sân phụ | 0.0 | 0.0 | 5.0 | 8.0 | 5.0 | 8.0 | 40.00 |
| L2 | Phòng khách | 0.0 | 8.0 | 5.0 | 14.0 | 5.0 | 6.0 | 30.00 |
| L3 | Phòng thờ | 0.0 | 14.0 | 4.1 | 16.0 | 4.1 | 2.0 | 8.20 |
| L4 | Phòng ngủ 1 | 0.0 | 16.0 | 4.1 | 19.5 | 4.1 | 3.5 | 14.35 |
| L5 | WC chung | 0.0 | 19.5 | 4.1 | 21.8 | 4.1 | 2.3 | 9.43 |
| L6 | Phòng ngủ master | 0.0 | 21.8 | 5.0 | 27.5 | 5.0 | 5.7 | 28.50 |
| L7 | Sân sau | 0.0 | 27.5 | 5.0 | 30.0 | 5.0 | 2.5 | 12.50 |
| L8 | Hành lang trong | 4.1 | 14.0 | 5.0 | 21.8 | 0.9 | 7.8 | 7.02 |

**Cộng cột trái = 150.00 m²** ✔ (khớp 5.0 × 30)
Kiểm tra chiều sâu: 8.0 + 6.0 + 2.0 + 3.5 + 2.3 + 5.7 + 2.5 = **30.0** ✔
Kiểm tra chiều ngang: 4.1 (phòng) + 0.9 (hành lang) = **5.0** ✔

### Cột phải — lô phụ (x: 5.0 → 9.5)

| # | Phòng | x₁ | y₁ | x₂ | y₂ | Rộng | Sâu | DT (m²) |
|---|---|---|---|---|---|---|---|---|
| R1 | Sân chính (sân xe) | 5.0 | 0.0 | 9.5 | 18.0 | 4.5 | 18.0 | 81.00 |
| R2 | Bếp + nhà ăn | 5.0 | 18.0 | 8.5 | 25.0 | 3.5 | 7.0 | 24.50 |
| R3 | Hành lang ngoài | 8.5 | 18.0 | 9.5 | 25.0 | 1.0 | 7.0 | 7.00 |
| R4 | Sân phơi / giặt | 5.0 | 25.0 | 9.5 | 30.0 | 4.5 | 5.0 | 22.50 |
| R5 | WC khách | 7.0 | 28.0 | 9.5 | 30.0 | 2.5 | 2.0 | 5.00 |

**Cộng cột phải = 135.00 m²** ✔ (R5 nằm *trong* R4, không cộng riêng)
Kiểm tra chiều sâu: 18.0 + 7.0 + 5.0 = **30.0** ✔
Kiểm tra chiều ngang: 3.5 (bếp) + 1.0 (hành lang ngoài) = **4.5** ✔

> ⚠️ Nhãn "SÂN PHƠI / GIẶT 4.5 × 5.0m" trên bản vẽ **ghi sai**: WC khách (5.0 m²) nằm chồng lên góc dưới-phải. Diện tích sân phơi thực = **17.5 m²**.

## 4. Cửa hiện trạng (ước lượng)

| ID | Nối | Tường | Vị trí ước | Ghi chú |
|---|---|---|---|---|
| D1 | Sân phụ ↔ Phòng khách | y = 8.0 | x ≈ 1.2–2.8 | Cửa kính 3 cánh |
| D2 | Sân chính ↔ Phòng khách | x = 5.0 | y ≈ 13.3 | Cửa chính vào nhà |
| D3 | Phòng khách ↔ Hành lang trong | y = 14.0 | x ≈ 4.5 | Lối vào khu ngủ |
| D4 | Hành lang ↔ Phòng thờ | x = 4.1 | y ≈ 15.0 | Mở **ra** hành lang |
| D5 | Hành lang ↔ Phòng ngủ 1 | x = 4.1 | y ≈ 18.5 | Mở **ra** hành lang |
| D6 | Hành lang ↔ WC chung | x = 4.1 | y ≈ 21.0 | Mở **ra** hành lang |
| D7 | Hành lang ↔ Master | y = 21.8 | x ≈ 4.5 | Cuối hành lang |
| D8 | Sân chính ↔ Bếp | y = 18.0 | x ≈ 7.0 | |
| D9 | Bếp ↔ Sân phơi | y = 25.0 | x ≈ 6.8 | |
| D10 | Sân phơi ↔ WC khách | x = 7.0 | y ≈ 29.0 | |
| — | Sân chính ↔ Sân phơi | qua R3 | x 8.5–9.5 | Lối đi ngoài trời, có mái |

## 5. Đánh giá kích thước

### Đạt
| Phòng | Kích thước | Ghi chú |
|---|---|---|
| Phòng khách | 5.0 × 6.0 = 30.0 m² | Rộng rãi, tỉ lệ tốt |
| Bếp + nhà ăn | 3.5 × 7.0 = 24.5 m² | Đủ bàn ăn 6 ghế + bếp chữ L |
| Phòng ngủ 1 | 4.1 × 3.5 = 14.35 m² | Đạt chuẩn |
| WC khách | 2.5 × 2.0 = 5.0 m² | Đủ |
| Hành lang ngoài | 1.0 × 7.0 | Hẹp nhưng đúng chức năng lối phụ |

### Cần chỉnh
| # | Phòng | Vấn đề | Đề xuất |
|---|---|---|---|
| S1 | **Phòng thờ** 4.1 × 2.0 | Sâu 2.0m quá cạn. Tủ thờ sâu 0.6–0.87m → còn ~1.2m đứng lễ, không lùi đủ để vái. | Tăng sâu ≥ 2.4m |
| S2 | **WC chung** 4.1 × 2.3 | Quá lớn và quá dài cho 1 WC; ~1.6m bên phải bỏ trống. | Thu còn ~2.5 × 2.3; trả phần dư cho phòng thờ (S1) hoặc phòng ngủ 1 |
| S3 | **Master** 5.0 × 5.7 = 28.5 m² | Thừa DT nhưng **không có WC riêng** — phải ra hành lang. Bố cục ngược. | Cắt 5.0 × 2.2 làm WC + tủ áo; phòng ngủ còn 5.0 × 3.5 vẫn đủ rộng |
| S4 | **Hành lang trong** 0.9 × 7.8 | Hẹp hơn chuẩn 1.0–1.2m; kín hoàn toàn, **không cửa sổ** → tối và bí | Nới lên 1.0–1.1m; bổ sung giếng trời hoặc ô thoáng |
| S5 | **Sân phơi** | Nhãn ghi 22.5 m² nhưng thực 17.5 m² (WC khách chiếm chỗ) | Sửa nhãn bản vẽ |
| S6 | **Sân chính** 4.5 × 18.0 = 81 m² | Chiếm 28% lô đất chỉ để 1 xe + bộ bàn ngoài trời | Nguồn dự trữ nếu cần thêm phòng ngủ 3 |
| S7 | **Tổng thể** | 285 m² đất chỉ có **2 phòng ngủ** — mật độ rất thấp | Lô cỡ này thường bố trí được 3–4 phòng ngủ |

## 6. Đề xuất chỉnh vị trí cửa

Ràng buộc: **không đổi vị trí phòng**, chỉ chỉnh cửa.

| # | Đề xuất | Lý do | Ưu tiên |
|---|---|---|---|
| C1 | **Mở cửa mới: Hành lang trong → Bếp** tại tường `x = 5.0`, đoạn `y = 18.0–21.8` | Hiện bếp chỉ vào được từ sân chính hoặc sân phơi. Đi từ phòng ngủ xuống bếp phải **ra ngoài trời** — mưa là ướt. Tường phải của hành lang giáp thẳng bếp 3.8m → mở cửa được ngay. | **Cao nhất** |
| C2 | **Mở cửa mới: Master → WC chung** tại tường `y = 21.8`, đoạn `x = 0–4.1` | Tường nam WC chung giáp thẳng master. Thành WC dùng chung 2 lối (jack-and-jill) → master có WC trong mà **không phải dời phòng nào**. | Cao |
| C3 | **Đảo chiều D4, D5, D6 — mở vào trong phòng** | Cánh 0.8m quét gần hết lòng hành lang 0.9m; hai cửa mở cùng lúc va nhau. Riêng WC (D6) nên dùng **cửa lùa**. | Cao |
| C4 | **Mở cửa/cửa sổ lớn: Master → Sân sau** tại tường `y = 27.5` | Sân sau 12.5 m² hiện chỉ để thoáng, không có lối vào lau dọn/bảo trì. | Trung bình |
| C5 | Giữ nguyên D8, D9 | Đúng luồng công năng: nấu → giặt → phơi. | — |

## 7. Nếu áp dụng cả S1–S3 + C1–C4 (tham khảo)

Cột trái, chiều sâu vẫn giữ tổng 30.0:

| Phòng | Kích thước mới | DT |
|---|---|---|
| Phòng thờ | 4.1 × 2.4 | 9.84 |
| Phòng ngủ 1 | 4.1 × 3.5 | 14.35 |
| WC chung | 2.5 × 2.3 | 5.75 |
| Tủ/kho (phần dư WC cũ) | 1.6 × 2.3 | 3.68 |
| Master | 5.0 × 3.5 | 17.50 |
| WC master + tủ áo | 5.0 × 2.2 | 11.00 |

*(Cần cân lại 0.4m chênh do phòng thờ tăng sâu — lấy từ sân phụ 8.0 → 7.6 hoặc sân sau 2.5 → 2.1.)*
