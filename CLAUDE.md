# Dự án mặt bằng nhà 9.5 × 30 m

**Ngôn ngữ.** Tài liệu, chú thích trong mã và trao đổi viết bằng **tiếng Việt**.
Mọi **định danh** — tên file, tên hàm, tên biến, khoá của object, `id` trong DOM — viết bằng
**tiếng Anh**.

## Cấu trúc

Ứng dụng Next.js, hai trang: `/` bản vẽ 2D, `/3d` mô hình khối và đường đi của nắng.

```bash
npm run dev
```

| Đường dẫn | Vai trò |
|---|---|
| `lib/versions/current.js` | **Nguồn sự thật của số liệu.** File sống — sửa thẳng vào đây |
| `lib/versions/v1.js` … `v11.js` | Kho đối chiếu, **đóng băng**. Không sửa, không thêm bản mới |
| `lib/versions/index.js` | `ARCHIVE`, `CURRENT`, `PLANS`. Thứ tự `PLANS` = thứ tự dropdown |
| `lib/lot.js` | Hằng số cấp lô đất: `LOT`, `HEIGHTS` (cao độ), `STEP` (bậc tam cấp), `MIN_CLEAR` |
| `lib/plan.js` | Diện tích thông thủy và **14 phép kiểm** `validate()` |
| `lib/envelope.js` | Vỏ nhà: cốt sàn từng phòng, bậc tam cấp, mái hiên — suy từ cửa và tường, dùng chung cho 3D, phép kiểm, 2D, đặc tả |
| `lib/spec.js` | `specMarkdown()` — sinh đặc tả |
| `lib/massing.js` | `buildMassing()` — đổi dữ liệu mặt bằng thành khối 3D. Hình học thuần, không dính three.js |
| `lib/sun.js` | Vị trí mặt trời (NOAA) |
| `components/draw2d.js` · `scene3d.js` | Bộ vẽ. Không dính React — React chỉ dựng DOM rỗng rồi gọi `init()` |
| `components/Plan2D.jsx` · `Plan3D.jsx` | Khung DOM cho hai bộ vẽ trên |
| `app/` | Route và CSS |
| `scripts/gen-spec.mjs` | `npm run spec` / `npm run spec:check` |
| `spec/current.md`, `spec/v<n>.md` | Đặc tả sinh tự động. **Không sửa tay** |
| `floor-plan.md` | Trang chỉ mục + hiện trạng gốc v1 và đánh giá (viết tay) |
| `3d.md` | Ghi chú thiết kế mô hình 3D — **vì sao** dựng như đang dựng |
| `roadmap.md` | **Việc còn dang dở**, có trạng thái từng task. Đọc trước khi nhận việc mới; làm xong thì cập nhật |
| `original-drawing.png` | Bản vẽ gốc của chủ nhà, chỉ để đối chiếu |

Ba thứ phải luôn khớp nhau: **sửa `lib/versions/current.js` → sinh lại `spec/` → cập nhật `floor-plan.md`**.

## Quy ước số liệu

- Toạ độ và kích thước là **tim tường**. Gốc `(0,0)` = góc trên-trái lô. X → phải (0–9.5), Y → xuống (0–30).
- Tường bao **220 mm**, tường ngăn **100 mm**.
- Đơn vị mét, số thập phân dùng dấu chấm.

## Đổi thiết kế — quy trình bắt buộc

**Không thêm v13, v14… nữa.** Trước đây mỗi thay đổi thiết kế đẻ ra một file phiên bản mới;
nay chỉ còn **một bản sống** là `lib/versions/current.js`, sửa thẳng vào đó. Lịch sử do git
giữ — `git log -p lib/versions/current.js` cho thấy từng bước, và quay lại bất cứ mốc nào
cũng được. Đổi lại, **commit message phải nói rõ đổi gì và vì sao**, vì nó thay chỗ của
trường `changes` trước kia.

`v1.js`…`v11.js` **đóng băng**: chúng là kho đối chiếu, cho phép so hai phương án cạnh nhau
trong cùng bản vẽ. Không sửa, trừ khi đó là **lỗi của chính bản đó** (sai số, sai mô tả).

**1. Sửa `lib/versions/current.js`.**
File là một snapshot đầy đủ (rooms, walls, doors, windows, skylights, gates, strips, furn,
dims, areas, note, changes, warn). Cập nhật luôn `note` và `changes` cho khớp với thiết kế
mới — đó là phần hiện trên cột phải của bản vẽ.

**2. Chạy bộ kiểm tra — phải sạch trước khi đi tiếp.**
`validate()` trong `lib/plan.js` có 14 phép kiểm (cộng diện tích, chuỗi kích thước, cửa nằm
trên tường, phòng kín có cửa, nội thất không chồng nhau và không nằm trong vùng quét cánh
cửa, bậc nằm gọn trong sân…). Lỗi hiện ngay trên cột phải khi mở bản vẽ. **Không commit bản hiện hành còn lỗi.**
Các bản trong kho đối chiếu còn lỗi là bình thường — chúng là bước trung gian.

**3. Sinh lại đặc tả — không bao giờ gõ tay.**

```bash
npm run spec
```

Sửa `specMarkdown()` thì lệnh trên cũng tự sinh lại toàn bộ `spec/*.md`. Muốn biết có file
nào lệch mà không ghi đè thì `npm run spec:check` (thoát khác 0 nếu lệch).

**4. Cập nhật `floor-plan.md`** nếu thay đổi đủ lớn để đổi phần đánh giá hoặc bảng lịch sử.

Một thay đổi thiết kế = một commit gồm đủ: `lib/versions/current.js` + `spec/current.md`
(+ `floor-plan.md` nếu cần).

## Trang 3D

Cao độ nằm ở `HEIGHTS` trong `lib/lot.js` chứ không nhân bản vào từng file mặt bằng; phương
án nào đổi chiều cao thì khai `heights:{...}` trong chính file đó để đè lên. `lib/massing.js`
suy chiều cao tường từ phòng áp vào, không khai tay. Cốt sàn từng phòng, bậc tam cấp và mái
hiên suy ở `lib/envelope.js` — mặt bằng chỉ khai mã cửa có bậc (`steps`), phòng có cốt sàn
riêng (`floorLevels`) và tường có mái hiên (`overhangs`). Lý do của từng lựa chọn nằm ở `3d.md` —
đọc trước khi sửa.

## Hướng

**Mặt tiền quay Đông Bắc** (`LOT.frontAzimuth = 45`, phương vị độ, 0 = bắc, thuận kim đồng hồ).
Suy ra: cạnh sau lô (ban công sau, sân phơi) quay **Tây Nam** — nắng chiều gắt;
cạnh phải (bếp, hành lang ngoài) quay **Đông Nam**; tường bao trái quay **Tây Bắc**.

## Đã chốt, chưa vào dữ liệu

Chủ nhà chốt ngày 10/9/2026, việc đưa vào `lib/versions/current.js` là A4 trong `roadmap.md`.

- **Mái bàn trà ở sân chính** — mái che xe ở sân phụ đã bỏ hẳn, cửa chính thay bằng mái hiên
  bê tông (đã vào dữ liệu). Xem `3d.md` mục 3.
- **Lam đứng cho D12** — che nắng tây cho master. Xem `3d.md` mục 2a.
- **Sơn chống nóng tường trái** lúc xây và **lát lớp chống nóng mái** — không đổi hình khối,
  không phải sửa mô hình. Xem `3d.md` mục 2c.
- **Bếp lợp tôn hai mái + trần tôn**, không đổ mái bê tông. `lib/massing.js` hiện chỉ sinh hộp
  thẳng trục nên chưa dựng được mái dốc. Xem `3d.md` mục 3a.
- **Mái sân phơi** — tôn dốc một mái phủ `y` 25–28, chừa dải hở thẳng hàng ban công. Xem `3d.md`
  mục 3b.
Chi tiết và trạng thái từng việc: `roadmap.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
