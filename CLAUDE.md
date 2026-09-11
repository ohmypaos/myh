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
| `lib/lot.js` | Hằng số cấp lô đất: `LOT`, `HEIGHTS` (cao độ), `STEP` (bậc tam cấp), `ROOF` (bề dày tôn lợp, tấm trần, tiết diện máng xối), `RAILING` (lan can trên tường rào), `FURNITURE` (chiều cao nội thất 3D), `DOOR_LEAF` (cánh cửa 3D), `POST` (cột đỡ mái nhẹ), `MIN_CLEAR` |
| `lib/plan.js` | Diện tích thông thủy và **15 phép kiểm** `validate()` |
| `lib/envelope.js` | Vỏ nhà: cốt sàn từng phòng, bậc tam cấp, mái hiên, mái nhẹ — suy từ cửa và tường, dùng chung cho 3D, phép kiểm, 2D, đặc tả |
| `lib/spec.js` | `specMarkdown()` — sinh đặc tả |
| `lib/massing.js` | `buildMassing()` — đổi dữ liệu mặt bằng thành khối 3D: `boxes` hộp thẳng trục và `prisms` lăng trụ mặt nghiêng (mái tôn dốc, đầu hồi). Hình học thuần, không dính three.js |
| `lib/walk.js` | Đi bộ trong 3D: người cao 1.70 m đứng trên mặt nào, vướng khối nào — hình học thuần, `check-3d` dùng chung |
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
roofs, dims, areas, note, changes, warn). Cập nhật luôn `note` và `changes` cho khớp với thiết kế
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
án nào đổi chiều cao thì khai `heights:{...}` trong chính file đó để đè lên. Bản hiện hành khai
`fence` 1.80 và `fenceSolid` 0.80: tường rào xây đặc tới 0.80, phía trên lan can thoáng dựng từng thanh.

**Mái phụ lợp tôn** khai ở `roofs` của mặt bằng: vùng phủ theo tim tường, dạng (`flat`, `mono:y`,
`gable:y`) và cao độ **mặt dưới**; độ dốc suy từ cao độ với nhịp, không khai tay. Mái trùm trọn
một phòng kín thì phòng đó bỏ bản bê tông, thay bằng trần tôn ở cốt `ceiling`, và đỉnh các bức
tường chỉ đỡ phòng ấy tự bám mặt dưới mái — đầu hồi tam giác ra theo, không khai (phòng hở như hành
lang ngoài có mái trùm thì không). Hai mái kề nhau hoặc nối phẳng cùng cao độ, hoặc gá thấp hẳn bên
dưới (mái trên được đua chồng lên, khai `eave`); **máng xối** suy ở mép thấp không nối sang mái khác
và không đua trên mái thấp hơn, mỗi dải máng một **ống xả** áp tường bao — không khai. Mép mái không tựa lên tường cao tới mái thì cần
**cột đỡ**: vị trí khai ở `posts` (quyết định thiết kế), chiều cao suy tới mặt dưới mái hoặc đáy máng. `lib/massing.js`
suy chiều cao tường từ phòng áp vào, không khai tay — trừ đoạn khai ở `fullHeightWalls` (hai tường
bên ban công sau: tường trái đỡ trần ban công, tường phải có cửa D13). Cốt sàn từng phòng, bậc tam cấp và mái
hiên suy ở `lib/envelope.js` — mặt bằng chỉ khai cửa có bậc kèm phần rộng hơn cửa và mặt bậc (`steps`), phòng có cốt sàn
riêng (`floorLevels`), phòng có trần giả hạ thấp (`dropCeilings`) và tường có mái hiên (`overhangs`). Lý do của từng lựa chọn nằm ở `3d.md` —
đọc trước khi sửa.

## Hướng

**Mặt tiền quay Đông Bắc** (`LOT.frontAzimuth = 45`, phương vị độ, 0 = bắc, thuận kim đồng hồ).
Suy ra: cạnh sau lô (ban công sau, sân phơi) quay **Tây Nam** — nắng chiều gắt;
cạnh phải (bếp, hành lang ngoài) quay **Đông Nam**; tường bao trái quay **Tây Bắc**.

## Đã chốt, không nằm trong mô hình

Hai việc chống nóng chủ nhà chốt ngày 10/9/2026 **không đổi hình khối** nên không có gì để dựng —
chúng sống trong `warn` của mặt bằng và trong `3d.md` mục 2c, đừng tưởng là còn thiếu:

- **Sơn chống nóng mặt ngoài tường trái** ngay lúc xây, khi lô bên cạnh còn trống.
- **Lát lớp chống nóng trên sàn mái bê tông** nhà chính, kể cả phần trần ban công sau.

Chi tiết và trạng thái từng việc: `roadmap.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
