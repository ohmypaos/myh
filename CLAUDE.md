# Dự án mặt bằng nhà 9.5 × 30 m

Tài liệu và trao đổi trong repo này viết bằng **tiếng Việt**.

## Cấu trúc

Ứng dụng Next.js, hai trang: `/` bản vẽ 2D, `/3d` mô hình khối và đường đi của nắng.

```bash
npm run dev
```

| Đường dẫn | Vai trò |
|---|---|
| `lib/versions/v<n>.js` | **Nguồn sự thật của số liệu.** Mỗi file một phiên bản, `export default {...}` |
| `lib/versions/index.js` | Gom 12 phiên bản thành mảng `VERSIONS`. Thứ tự mảng = thứ tự dropdown |
| `lib/lot.js` | Hằng số cấp lô đất: `LOT`, `CAO` (cao độ), `MAI_CHE` |
| `lib/plan.js` | Diện tích thông thủy và **13 phép kiểm** `validate()` |
| `lib/spec.js` | `specMarkdown()` — sinh đặc tả |
| `lib/khoi3d.js` | Đổi dữ liệu phiên bản thành khối 3D. Hình học thuần, không dính three.js |
| `lib/sun.js` | Vị trí mặt trời (NOAA) |
| `components/ve2d.js` · `ve3d.js` | Bộ vẽ. Không dính React — React chỉ dựng DOM rỗng rồi gọi `khoiTao()` |
| `components/Plan2D.jsx` · `Plan3D.jsx` | Khung DOM cho hai bộ vẽ trên |
| `app/` | Route và CSS |
| `scripts/gen-spec.mjs` | `npm run spec` / `npm run spec:check` |
| `spec/v<n>.md` | Đặc tả sinh tự động từ `lib/versions/v<n>.js`. **Không sửa tay** |
| `mat-bang.md` | Trang chỉ mục + hiện trạng gốc v1 và đánh giá (viết tay) |
| `3d.md` | Ghi chú thiết kế mô hình 3D — **vì sao** dựng như đang dựng |
| `banve.png` | Bản vẽ gốc của chủ nhà, chỉ để đối chiếu |

Ba thứ phải luôn khớp nhau: **sửa `lib/versions/` → sinh lại `spec/` → cập nhật bảng lịch sử trong `mat-bang.md`**.

## Quy ước số liệu

- Toạ độ và kích thước là **tim tường**. Gốc `(0,0)` = góc trên-trái lô. X → phải (0–9.5), Y → xuống (0–30).
- Tường bao **220 mm**, tường ngăn **100 mm**.
- Đơn vị mét, số thập phân dùng dấu chấm.

## Thêm phiên bản mới — quy trình bắt buộc

**1. Tạo `lib/versions/v<n+1>.js`, không sửa file bản cũ.**
Chép từ file bản gần nhất rồi sửa. Mỗi file là một snapshot đầy đủ (rooms, walls, doors,
windows, skylights, gates, strips, furn, dims, areas, note, changes, warn). Lịch sử v1…v12 là
dữ liệu đối chiếu — sửa bản cũ là làm hỏng lịch sử. Sửa tại chỗ chỉ chấp nhận khi đó là **lỗi
của chính bản đó** (sai số, sai mô tả), không phải thay đổi thiết kế.

**2. Thêm vào `lib/versions/index.js`** — một dòng `import`, và thêm vào cuối mảng
`VERSIONS`. Thứ tự mảng = thứ tự trong dropdown; bản mới nhất phải nằm cuối vì trang mặc
định mở phần tử cuối.

**3. Chạy bộ kiểm tra — phải sạch trước khi đi tiếp.**
`validate()` trong `lib/plan.js` có 13 phép kiểm (cộng diện tích, chuỗi kích thước, cửa nằm
trên tường, phòng kín có cửa, nội thất không chồng nhau và không nằm trong vùng quét cánh
cửa…). Lỗi hiện ngay trên cột phải khi mở bản vẽ. **Không commit phiên bản hiện hành còn
lỗi.** Các bản cũ v1…v11 còn lỗi là bình thường — chúng là bước trung gian.

**4. Sinh lại `spec/v<n+1>.md` — không bao giờ gõ tay.**

```bash
npm run spec
```

Sửa `specMarkdown()` thì `npm run spec` cũng tự sinh lại toàn bộ `spec/*.md`. Muốn biết có
file nào lệch mà không ghi đè thì `npm run spec:check` (thoát khác 0 nếu lệch).

**5. Cập nhật bảng "Lịch sử phiên bản" trong `mat-bang.md`** — thêm một dòng: link, tóm tắt,
diện tích kín, kết quả bộ kiểm tra.

Một phiên bản = một commit gồm đủ: `lib/versions/v<n>.js` + dòng trong `lib/versions/index.js`
+ `spec/v<n>.md` + dòng mới trong `mat-bang.md`.

## Trang 3D

Cao độ nằm ở `CAO` trong `lib/lot.js` chứ không nhân bản vào từng phiên bản; bản nào đổi
chiều cao thì khai `heights:{...}` trong chính file phiên bản đó để đè lên. `lib/khoi3d.js`
suy chiều cao tường từ phòng áp vào, không khai tay. Lý do của từng lựa chọn nằm ở `3d.md` —
đọc trước khi sửa.

## Hướng

**Mặt tiền quay Đông Bắc** (`LOT.huongMatTien = 45`, phương vị độ, 0 = bắc, thuận kim đồng hồ).
Suy ra: cạnh sau lô (ban công sau, sân phơi) quay **Tây Nam** — nắng chiều gắt;
cạnh phải (bếp, hành lang ngoài) quay **Đông Nam**; tường bao trái quay **Tây Bắc**.

## Chưa xác định

- **Mái che sân phụ** — chỗ để xe, mái nối thẳng từ nhà chính ra. Đang khai tạm ở `MAI_CHE`
  trong `lib/lot.js` để 3D dựng được, **chưa vào dữ liệu phiên bản**. Nó là thay đổi thiết kế
  nên chốt xong phải thành `lib/versions/v13.js` chứ không sửa v12. Xem `3d.md` mục 3.
- **Che nắng tây cho master** — cửa lùa D12 quay Tây Nam, ban công sau không mái, mái đua
  không cứu được. Nhiều khả năng đây là thay đổi chính của v13. Xem `3d.md` mục 2a.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
