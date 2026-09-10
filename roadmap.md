# Kế hoạch triển khai

Cập nhật 10/9/2026.

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
| A0 | Chốt nơi xây (vĩ độ) | ⏸ chờ quyết | |
| A1 | Che nắng tây cho master | ⏸ chờ quyết | A0 |
| A2 | Mái che sân phụ vào dữ liệu phiên bản | ⏸ chờ quyết | |
| A3 | Tường bao trái Tây Bắc — trễ pha nhiệt | ⏸ chờ quyết | |
| A4 | Đưa A1–A3 vào `lib/versions/current.js` | ⬜ chưa làm | A1, A2, A3 |
| **Mô hình 3D** ||||
| B1 | Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT` | ⬜ chưa làm | A0 |
| B2 | Đi bộ: va chạm và cao độ mắt theo sàn đang đứng | 💤 hoãn | |
| B3 | Nội thất dạng khối trong 3D | 💤 hoãn | |
| **Cấu hình tuỳ chỉnh** ||||
| E0 | Bỏ hằng số ghim trong `validate()` | ⬜ chưa làm | |
| E1 | Đổi hướng nhà được | ⬜ chưa làm | |
| E2 | Advanced config — ranh phòng và cao độ, lan truyền tự động | ⬜ chưa làm | E0 |
| E3 | Lưu cấu hình đặt tên trong `localStorage` | ⬜ chưa làm | E2 |
| **Hạ tầng** ||||
| D1 | Bộ kiểm tra cho hình học 3D | ⬜ chưa làm | |
| D2 | Gắn CI chạy build + spec:check + kiểm 3D | ⬜ chưa làm | D1 |

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
"Đổi thiết kế": 13 phép kiểm phải sạch, rồi `npm run spec`.

Ba việc A1–A3 độc lập nhau nên cứ chốt được cái nào thì làm cái đó, mỗi cái một commit.

### ⏸ A0 · Chốt nơi xây (vĩ độ)

Chặn A1 và B1. Đang cho chọn Hà Nội / Đà Nẵng / TP.HCM, **mặc định Hà Nội**. Sai vĩ độ thì
toàn bộ phần nắng sai theo, nên phải chốt trước khi dùng mô hình để kết luận bất cứ điều gì.

- [ ] Chủ nhà xác nhận nơi xây

### ⏸ A1 · Che nắng tây cho master

Nhiều khả năng là **thay đổi lớn tiếp theo**. Master chỉ có một nguồn sáng: cửa lùa D12 rộng
3.2 m quay **Tây Nam**, mà ban công sau là loại `yard` nên không có mái — hiện D12 không có gì
che.

**Che bằng hình khối ngang là bất khả**, đã tính: 15h cao độ ~45°, che hết cửa cao 2.4 m cần
mái đua 2.4 m; 16h30 cao độ ~25° thì cần hơn 5 m. Phải là **lam đứng, rèm ngoài, hoặc giàn cây
trên ban công**. Xem `3d.md` mục 2a.

- [ ] Mở `/3d`, chọn đúng nơi xây (A0), kéo giờ tới 15h–16h30 ngày hạ chí **và** đông chí
- [ ] Chốt cách che: lam đứng / rèm ngoài / giàn cây
- [ ] Nếu cách che đổi hình khối (giàn, mái ban công) thì phải vào `current.js`

> Đọc vệt nắng thì tin được, đọc độ sáng thì không — mô hình không có ánh sáng gián tiếp.
> Xem `3d.md` mục 6.

### ⏸ A2 · Mái che sân phụ vào dữ liệu phiên bản

Đang khai tạm ở `CARPORT_ROOF` trong `lib/lot.js`
(`x:0, w:5.0, fromY:12.0, length:5.5, height:2.80`) để 3D
dựng được. Nó là **thay đổi thiết kế** nên đúng quy trình phải vào `current.js`.

Đánh đổi (`3d.md` mục 3): được cái đi từ xe vào nhà không dính mưa, nhưng nó nằm ngay trước
cửa chính D1 và che mất đúng nguồn sáng Đông Bắc dịu nhất nhà. Chốt **không phủ quá ~5.5 m**,
chừa hơn 6 m hở trời phía cổng.

- [ ] Chủ nhà chốt chiều dài phủ
- [ ] Chuyển `CARPORT_ROOF` từ `lib/lot.js` vào `lib/versions/current.js`
- [ ] `lib/massing.js` đang đọc thẳng `CARPORT_ROOF` — sửa để đọc từ dữ liệu mặt bằng
- [ ] Bỏ đoạn "khai tạm" trong `3d.md` mục 3 và `CLAUDE.md` mục "Chưa xác định"

### ⏸ A3 · Tường bao trái Tây Bắc — trễ pha nhiệt

Mùa hè mặt trời lặn chếch lên phía bắc (~293°) nên bức tường đặc 18 m này ăn nắng muộn suốt
chiều. Gạch 220 đặc trễ pha nhiệt 4–5 tiếng → nhả nhiệt vào **buổi tối**, đúng lúc đi ngủ, mà
sau nó là phòng ngủ 1 và master, không có cửa sổ nào để xả.

Mới là suy luận từ hướng, **chưa tính toán gì**. Xem `3d.md` mục 2c.

- [ ] Quyết có xử lý hay không
- [ ] Nếu có: tường hai lớp hay cây leo, và chỉ đoạn giáp hai phòng ngủ hay cả 18 m

### ⬜ A4 · Đưa A1–A3 vào `lib/versions/current.js`

Theo đúng 4 bước ở `CLAUDE.md` mục "Đổi thiết kế".

- [ ] Sửa `current.js`, cập nhật luôn `note` và `changes`
- [ ] 13 phép kiểm phải **sạch** — không commit bản hiện hành còn lỗi
- [ ] `npm run spec`
- [ ] Cập nhật `floor-plan.md` nếu đổi phần đánh giá

---

## B · Mô hình 3D

### ⬜ B1 · Bỏ dropdown nơi xây, đưa toạ độ thật vào `LOT`

Chặn bởi A0. Khi đã chốt nơi xây thì dropdown ba thành phố chỉ còn là cái bẫy — người xem quên
đổi là đọc sai toàn bộ phần nắng.

- [ ] Đưa `lat` / `lon` thật vào `LOT` trong `lib/lot.js`
- [ ] Bỏ `<select id="place">` khỏi `Plan3D.jsx` và phần xử lý trong `scene3d.js`
- [ ] Giữ `PLACES` trong `lib/sun.js` hay bỏ — tuỳ còn dùng để đối chiếu không

### 💤 B2 · Đi bộ: va chạm và cao độ mắt

`components/scene3d.js`, hàm `moveWalk()`: đi xuyên tường được, và cao độ mắt luôn tính từ cốt nền
nhà (`MUC.nen + 1.60`) nên bước ra sân thì lửng lơ 45 cm.

**Cố ý hoãn** — đủ dùng để soi tỉ lệ đứng, vốn là mục đích chính của mô hình.

- [ ] Cao độ mắt tra theo phòng đang đứng (`lib/massing.js` đã biết qua `atFloorLevel`)
- [ ] Chặn va chạm theo danh sách hộp tường

### 💤 B3 · Nội thất dạng khối trong 3D

Mới có khối tường, sàn, mái. Dữ liệu đã có sẵn ở `furn` của từng mặt bằng (2D đang vẽ), chỉ
thiếu chiều cao. **Cố ý hoãn** — làm nếu thấy cần cảm nhận tỉ lệ kỹ hơn. Xem `3d.md` mục 8.

- [ ] Thêm chiều cao cho từng loại nội thất vào `HEIGHTS` trong `lib/lot.js`
- [ ] Dựng hộp trong `lib/massing.js`

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

### ⬜ E0 · Bỏ hằng số ghim trong `validate()`

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

- [ ] Suy `150` / `135` theo công thức trên, `30` lấy từ `LOT.d`
- [ ] Sửa luôn chuỗi mô tả trong `CHECKS` cho khỏi ghim số
- [ ] Chạy lại cả kho đối chiếu: v1…v11 phải giữ **nguyên số lỗi cũ**, không nhiều hơn không ít hơn

### ⬜ E1 · Đổi hướng nhà được

Rẻ nhất nhóm, làm riêng được. `LOT.frontAzimuth` hiện chỉ chảy vào `toSceneVector()` trong
`lib/sun.js` — đổi nó **không đụng gì tới hình học**, chỉ đổi đường đi của nắng và mũi tên bắc.

Nhưng có một chỗ đang nói dối: `components/draw2d.js` ghi **cứng** chuỗi
`"Mặt tiền quay hướng Đông Bắc (phương vị 45°)"` trong bảng ký hiệu, không đọc `LOT`. Đổi
hướng mà không sửa chỗ này thì bản vẽ 2D ghi sai.

- [ ] Thanh trượt phương vị mặt tiền trên trang 3D
- [ ] `draw2d.js` đọc `LOT.frontAzimuth` và `compassName()` thay vì chuỗi ghim cứng
- [ ] Mũi tên bắc trong 3D đã tự xoay theo — chỉ cần kiểm lại

### ⬜ E2 · Advanced config — ranh phòng và cao độ

**Phạm vi: ranh giới phòng + cao độ.** Cụ thể là vị trí các bức tường ngăn (đường lưới) và
`HEIGHTS` trong `lib/lot.js`.

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

- [ ] **E2a · Dựng mô hình lưới + phép thử khứ hồi.** Suy lưới từ toạ độ tuyệt đối, rồi dựng
      ngược lại toạ độ từ lưới và so — phải **trùng khít trên cả 12 phương án**. Đây là mốc
      chứng minh mô hình đúng; chưa qua thì đừng viết tiếp phần lan truyền.
- [ ] **E2b · Lan truyền tới phòng kề.** Mọi phòng, tường, cửa, cửa sổ, giếng trời và nội thất
      bám vào đường đó đi theo; `dims` tính lại. **Dừng ở phòng kề** — không đẩy dây chuyền,
      không chặn thao tác.
- [ ] **E2c · Kích thước tối thiểu.** Dữ liệu mới, chưa có ở đâu. Để ở `lib/lot.js` cạnh
      `HEIGHTS`. Dùng để **tô đỏ**, không dùng để chặn.
      **Số cụ thể chưa chốt** — cần chủ nhà cho con số thật, đừng bịa. Lưu ý hành lang hiện đã
      là 0.84 m lọt lòng, tức gần như không co được nữa; ngưỡng đặt sai thì nó đỏ ngay từ đầu.
- [ ] **E2d · Sidebar kéo thả — một thanh trượt cho mỗi bức tường.** Không phải mỗi phòng một
      thanh: **tường chung tính là một**, nên kéo nó là thấy ngay cả hai phòng hai bên đổi cùng
      lúc, không có chỗ mập mờ "nới master thì mép nào dịch". Nhãn ghi tên hai phòng nó ngăn
      cách, bên cạnh là kích thước hiện tại của cả hai — **số nào bị ép quá thì đỏ lên**.
      Dùng thanh trượt chứ không phải ô nhập số: gõ tay dễ ra số vô lý và không thấy hệ quả
      trong lúc gõ.
- [ ] **E2e · Thanh trượt cao độ.** `HEIGHTS`: cao trần, cao cửa, bệ cửa sổ, dày mái. Không dính
      lưới nên làm độc lập được, và là thứ đổi hẳn cảm giác tỉ lệ đứng trong 3D.
- [ ] 13 phép kiểm chạy sau mỗi lần sửa, hiện lỗi ngay tại chỗ — lưới an toàn

> **Nội thất là chỗ dễ vỡ.** Phép kiểm 12 và 13 đòi nội thất nằm gọn trong phòng và không nằm
> trong vùng quét cánh cửa. Co phòng lại mà nội thất đứng yên là đỏ ngay. Lúc nạp phải neo mỗi
> món vào phòng chứa nó để nó đi theo.

### ⬜ E3 · Lưu cấu hình đặt tên

Cấu hình lưu vào `localStorage` **kèm tên người dùng tự đặt**, mở lại chọn được — để so
"phương án hành lang rộng" với "phương án master sâu" mà không phải kéo lại từ đầu.

- [ ] Lưu cấu hình hiện tại kèm tên
- [ ] Danh sách cấu hình đã lưu, chọn để xem, xoá được
- [ ] Nhãn luôn hiện đang xem cấu hình nào, và nút về mặc định
- [ ] Cả 2D và 3D cùng đọc một cấu hình — chuyển trang không mất

> **`current.js` vẫn là nguồn sự thật.** Cấu hình trong `localStorage` chỉ nằm ở máy người xem;
> `spec/` vẫn sinh từ `current.js`. Chốt được phương án nào thì vẫn phải sửa tay vào
> `current.js` rồi `npm run spec` — đúng quy trình ở `CLAUDE.md`. Muốn đỡ chép tay thì thêm nút
> xuất ra đoạn mã đúng định dạng `current.js`, nhưng đó là việc phụ, chưa cần ngay.

> **Liên đới với B1.** B1 định bỏ dropdown nơi xây khi đã chốt vĩ độ. Nếu làm E2 trước thì nơi
> xây nên chuyển hẳn vào panel cấu hình chứ không nằm rời trên thanh công cụ — cân nhắc gộp.

---

## D · Hạ tầng

### ⬜ D1 · Bộ kiểm tra cho hình học 3D

13 phép kiểm của `validate()` chỉ soi mặt bằng 2D. `lib/massing.js` cố ý viết thuần hình học,
không dính three.js, nên **chạy được trong node** — thêm `scripts/check-3d.mjs` theo đúng lối
`gen-spec.mjs`.

- [ ] Mọi hộp có `w`, `d`, `y1-y0` dương và hữu hạn, ở cả kho đối chiếu lẫn bản hiện hành
- [ ] Diện tích mái phủ đúng các phòng kín, trừ đúng phần giếng trời
- [ ] Không lỗ mở nào vượt đỉnh đoạn tường chứa nó
- [ ] Thêm `npm run check:3d` vào `package.json`

### ⬜ D2 · Gắn CI

`npm run spec:check` và `npm run build` đều đã thoát khác 0 khi hỏng, chưa có workflow nào gọi.

- [ ] Workflow chạy `npm run build`, `npm run spec:check`, `npm run check:3d`
