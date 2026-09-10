# Dự án mặt bằng nhà 9.5 × 30 m

Tài liệu và trao đổi trong repo này viết bằng **tiếng Việt**.

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `index.html` | Phần **dùng chung**: giao diện, bộ vẽ SVG, `validate()`, `specMarkdown()`. Không chứa số liệu phiên bản |
| `versions/v<n>.js` | **Nguồn sự thật của số liệu.** Mỗi file một phiên bản, gọi `definePlan({...})` để tự đăng ký |
| `spec/v<n>.md` | Đặc tả sinh tự động từ `versions/v<n>.js`. **Không sửa tay** |
| `mat-bang.md` | Trang chỉ mục + hiện trạng gốc v1 và đánh giá (viết tay) |
| `banve.png` | Bản vẽ gốc của chủ nhà, chỉ để đối chiếu |

Ba thứ trên phải luôn khớp nhau: **sửa `versions/` → sinh lại `spec/` → cập nhật bảng lịch sử trong `mat-bang.md`**.

## Quy ước số liệu

- Toạ độ và kích thước là **tim tường**. Gốc `(0,0)` = góc trên-trái lô. X → phải (0–9.5), Y → xuống (0–30).
- Tường bao **220 mm**, tường ngăn **100 mm**.
- Đơn vị mét, số thập phân dùng dấu chấm.

## Thêm phiên bản mới — quy trình bắt buộc

**1. Tạo `versions/v<n+1>.js`, không sửa file bản cũ.**
Chép từ file bản gần nhất rồi sửa. Mỗi file là một snapshot đầy đủ (rooms, walls, doors,
windows, skylights, gates, strips, furn, dims, areas, note, changes, warn). Lịch sử v1…v12 là
dữ liệu đối chiếu — sửa bản cũ là làm hỏng lịch sử. Sửa tại chỗ chỉ chấp nhận khi đó là **lỗi
của chính bản đó** (sai số, sai mô tả), không phải thay đổi thiết kế.

**2. Thêm một thẻ `<script src="versions/v<n+1>.js"></script>`** vào cuối danh sách trong
`index.html`. Thứ tự thẻ = thứ tự trong dropdown; bản mới nhất phải nằm cuối vì
`loadVersion()` mặc định mở phần tử cuối.

**3. Chạy bộ kiểm tra — phải sạch trước khi đi tiếp.**
`validate()` có 13 phép kiểm (cộng diện tích, chuỗi kích thước, cửa nằm trên tường, phòng kín
có cửa, nội thất không chồng nhau và không nằm trong vùng quét cánh cửa…). Lỗi hiện ngay trên
cột phải khi mở bản vẽ. **Không commit phiên bản hiện hành còn lỗi.** Các bản cũ v1…v11 còn
lỗi là bình thường — chúng là bước trung gian.

**4. Sinh lại `spec/v<n+1>.md` — không bao giờ gõ tay.**

```bash
python3 -m http.server 8777        # trong thư mục repo
```

Mở `http://localhost:8777/index.html` (Playwright MCP không mở được `file://`), gọi trong console:

```js
specMarkdown(spec.latest())        // hoặc spec.byId('v13') / spec.current()
```

Ghi nguyên văn kết quả vào `spec/v<n+1>.md`. Thanh công cụ **không có nút tải spec** — đồng bộ
là việc của quy trình này. Sửa `specMarkdown()` thì phải sinh lại **toàn bộ** `spec/*.md`:

```js
JSON.stringify(Object.fromEntries(VERSIONS.map(v => [v.id, specMarkdown(v)])))
```

**5. Cập nhật bảng "Lịch sử phiên bản" trong `mat-bang.md`** — thêm một dòng: link, tóm tắt,
diện tích kín, kết quả bộ kiểm tra.

Một phiên bản = một commit gồm đủ: `versions/v<n>.js` + thẻ script trong `index.html` +
`spec/v<n>.md` + dòng mới trong `mat-bang.md`.

## Chưa xác định

- **Hướng bắc thật của lô đất** — bản vẽ mới chỉ có mũi tên "MẶT TIỀN". Cần biết trước khi mô phỏng nắng.
- **Cao độ** — dữ liệu phiên bản chưa có chiều cao nào (cao trần, cao cửa, bệ cửa sổ, mái).
  Khi dựng 3D, thêm cao độ vào chính `versions/v<n>.js` để 3D và 2D dùng chung một nguồn.
