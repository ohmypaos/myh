/* ═══════════ LÔ ĐẤT · CAO ĐỘ ═══════════
   Hằng số cấp lô đất, dùng chung cho trang 2D và trang 3D.
   Số liệu mặt bằng nằm ở lib/versions/. */

/* frontAzimuth: góc phương vị của hướng mặt tiền, độ, 0 = bắc, tăng theo chiều kim đồng hồ.
   45 = Đông Bắc → cạnh sau lô (ban công sau, sân phơi) quay Tây Nam, cạnh phải (bếp,
   hành lang ngoài) quay Đông Nam, cạnh trái (tường bao) quay Tây Bắc.

   lat / lon: nơi xây, đã chốt là **Bắc Giang**. Toàn bộ phần nắng dựa vào đây, nên đây là
   một con số thật chứ không phải tuỳ chọn — trước đây trang 3D cho chọn ba thành phố, mà
   người xem quên đổi thì đọc sai hết. */
export const LOT = {w:9.5, d:30.0, frontAzimuth:45, lat:21.27, lon:106.19, place:'Bắc Giang'};

/* Cao độ, mét. Không nhân bản vào từng file mặt bằng — phương án nào đổi chiều cao thì
   khai heights:{...} trong chính file đó để đè lên. */
export const HEIGHTS = {
  floor:  0.45,       // cốt nền nhà so với sân — bậc thềm
  ceiling:3.30,       // sàn nhà → trần
  slab:   0.25,       // dày bản mái
  door:   2.20,       // cao cửa mặc định
  sill:   0.90,       // bệ cửa sổ
  head:   2.20,       // mép trên cửa sổ
  fence:  2.20,       // tường rào quanh sân — đỉnh rào, kể cả phần lan can
  fenceSolid: null,   // phần xây đặc của tường rào; null = xây kín tới đỉnh rào, không có lan can
  alley:  2.80,       // mái hành lang ngoài (R3) — chỉ khi mặt bằng không khai mái nhẹ trùm R3
  only: {             // ngoại lệ theo mã lỗ mở
    D12:{door:2.40},  // cửa lùa kính ra ban công — cao hơn cửa thường
  },
};

/* Kích thước lọt lòng tối thiểu theo loại phòng, mét — dùng để **tô đỏ** khi kéo thanh
   trượt, không dùng để chặn thao tác.

   Chủ nhà chốt giữ nguyên ngày 10/9/2026 (roadmap E2c). Số lấy từ chỗ chật nhất mà chính
   thiết kế hiện tại đã chấp nhận rồi lùi xuống một chút, để không tô đỏ oan:
   hành lang 0.84, WC khách 1.38, phòng thờ 1.90, ban công 1.78. */
export const MIN_CLEAR = { room: 1.80, wet: 1.30, circ: 0.80, storage:0.60, yard: 1.00 };

/* Bậc tam cấp, mét. Cốt nền chia nấc `rise` (0.45 / 0.15 = 3 nấc); nấc trên cùng chính là ngưỡng
   cửa nên chỉ dựng 2 bậc ngoài, nhô 2 × `tread` tính từ mặt tường. Kéo thanh trượt cốt nền thì số
   bậc đổi theo. Cửa nào có bậc, rộng hơn cửa bao nhiêu mỗi bên, mặt bậc riêng nếu khác `tread`
   thì khai ở `steps` của mặt bằng — cửa chính khác cửa phụ; vị trí suy trong lib/envelope.js. */
export const STEP = {rise:0.15, tread:0.30};

/* Mái nhẹ (tôn) — bề dày tấm lợp và tấm trần, tiết diện máng xối, mét. Cố ý **không** nằm trong
   HEIGHTS: đó là kích thước vật liệu chứ không phải cao độ thiết kế, không có thanh trượt nào chỉnh
   tới. Cao độ khai ở `v.roofs` là **mặt dưới** mái, tấm lợp nằm trên đó. Máng xối suy ra ở mép thấp
   (lib/envelope.js), miệng máng ngang mặt dưới mái. Ống xả `pipe` (cạnh tiết diện, ống D90) cắm
   xuống tới `pipeDepth` dưới cốt sân — vào ống ngầm, không đổ ra sân. */
export const ROOF = {sheet:0.05, ceiling:0.02, gutterWidth:0.15, gutterDepth:0.12, pipe:0.09, pipeDepth:-0.10};

/* Lớp chống nóng trên sàn mái bê tông, mét — kiểu **mái ngược**: chống thấm nằm dưới tấm XPS nên được
   che nắng và đỡ co giãn nhiệt. Từ dưới lên: bản BTCT → vữa tạo dốc (dày thay đổi, không dựng) → chống
   thấm gốc xi măng hoặc màng dán nguội (không khò bitum nóng, không sơn gốc dầu — dung môi làm chảy XPS)
   → `xps` tấm XPS cường độ nén ≥ `xpsStrength` kPa, ghép so le → vải địa kỹ thuật → `screed` vữa cán
   có lưới thép, chia khe co giãn không quá `joint` m chèn keo đàn hồi → `tile` gạch lát. Mặt bằng nào
   khai `roofInsulation` thì mọi bản mái bê tông có lớp này (lib/envelope.js). Chủ nhà chốt 11/9/2026,
   thay cho gạch lỗ chống nóng truyền thống: gạch lỗ trữ nhiệt rồi nhả vào buổi tối. */
export const ROOF_INSULATION = {xps:0.05, screed:0.04, tile:0.02, joint:3.0, xpsStrength:300,
  mat:'chống thấm + XPS 50 mm + vữa cán 40 mm lưới thép + gạch lát'};

/* Cột đỡ mái nhẹ, mét. Vị trí khai ở `posts` của mặt bằng; chiều cao **suy ra** — từ cốt sân lên tới đáy dầm
   biên trên đầu cột (lib/envelope.js); máng xối dừng ở mặt cột, không chồm lên đầu cột. Thép hộp
   vuông `size`, đặt trên tim tường rào: chân chôn trong phần xây đặc, không lấn vào hành lang ngoài.
   `maxSpan` là nhịp dầm biên / xà gồ thép hộp nhẹ vượt được giữa hai chỗ đỡ (tường cao tới mái, hoặc
   cột) — check-3d soi mọi mép mái nhẹ theo số này. Mép trước mái sân chính từ tường phòng khách tới cột
   góc đã là 4.35 m, nên không đặt thấp hơn. Chủ nhà chốt 11/9/2026: thép hộp 100 × 100, nhịp ≤ 3.5 m
   dọc tường rào phải. */
export const POST = {size:0.10, maxSpan:4.5, mat:'thép hộp 100 × 100'};

/* Dầm biên mái nhẹ, mét: thép hộp bề ngang `width`, cao `depth`. **Suy ra, không khai** (lib/envelope.js):
   dầm chạy dọc mọi đoạn mép mái nhẹ không tựa lên tường cao tới mái — từ mặt tường tới mặt tường, đi qua
   đầu cột. Mặt trên dầm chạm mặt dưới mái; cột đỡ dưới đáy dầm. Chủ nhà yêu cầu 11/9/2026 cho thực tế. */
export const BEAM = {width:0.05, depth:0.10, mat:'thép hộp 50 × 100'};

/* Xà gồ đỡ tấm tôn mái nhẹ, mét. Chỉ mái nào khai `purlins:true` mới dựng: vị trí các hàng
   suy theo `maxPitch`, vuông góc chiều dốc; không chép từng thanh vào mặt bằng. `width` là bề
   rộng nhìn trên mặt bằng, `depth` là chiều cao hộp thép. Nhịp thanh tính từ mặt tường / mặt dầm
   đến mặt tựa bên kia, không vượt `maxSpan`. */
export const PURLIN = {width:0.05, depth:0.08, maxPitch:1.20, maxSpan:4.50, mat:'thép hộp 40 × 80'};

/* Lan can thoáng trên tường rào thấp (khi HEIGHTS.fenceSolid thấp hơn fence), mét: trụ vuông
   `post` cách nhau không quá `postGap`, tay vịn vuông `rail` trên cùng, song đứng vuông `bar` bước
   `pitch`. Khe song 0.10 m — trẻ con không chui lọt. Dựng từng thanh để nắng lọt qua khe và đổ bóng
   sọc đúng như thật, không làm tấm trong suốt giả. */
export const RAILING = {post:0.08, postGap:2.0, rail:0.05, bar:0.02, pitch:0.12};

/* Nội thất dạng khối trong 3D — chiều cao theo loại trong `furn`, mét, tính từ sàn phòng chứa nó.
   Như ROOF, cố ý **không** nằm trong HEIGHTS: đó là kích thước đồ đạc chứ không phải cao độ thiết kế,
   không có thanh trượt nào. Mỗi món một hộp đặc — đủ để cảm tỉ lệ khi đi bộ, không vẽ chi tiết.
   `cab` dùng cho ba thứ khác hẳn nhau nên chia theo chỗ đặt và cỡ: ở phòng khách là kệ tivi, nhỏ
   dưới `smallArea` m² là tủ đầu giường, còn lại là tủ áo / kệ kho cao sát đầu người.
   Buồng tắm đứng (`shower`) chỉ dựng khay sàn, vách kính để trống cho nhìn xuyên.
   Giường và sofa **không** là một hộp đặc kín từ sàn: khối đặc cỡ ấy trông to và nặng hơn đồ thật
   nhiều (chủ nhà thấy giường "chiếm rất nhiều không gian" dù cỡ đúng nệm 1m6, 1m8). Giường có chân,
   gầm hở, khung, nệm lõm vào mép khung, đầu giường ở cạnh mà bản vẽ 2D vẽ gối; sofa là mặt ngồi thấp
   kèm tựa lưng mỏng ở cạnh dài phía xa tâm phòng. Số đo từ sàn. */
export const FURNITURE = {
  bed:{ legs:0.15, leg:0.06, frame:0.30, mattress:0.50, inset:0.04, head:1.00, headThickness:0.06 },
  sofa:{ seat:0.42, back:0.80, backThickness:0.18 },
  chair:{ seat:0.45, back:0.85, backThickness:0.06 },
  tbl:0.45, altar:1.27, desk:0.75,
  // Kệ thờ liền kệ tivi, kéo lên trần: tủ đồ thờ cao `cabinet`, tầng thờ ở mặt tủ và các cao `tiers`, tấm kệ dày
  // `shelf`, tấm hậu / vách ngăn dày `panel`. Cao tổng = cao trần phòng (massing.js).
  shrine:{ cabinet:0.85, tiers:[1.55, 2.25], shelf:0.04, panel:0.03 },
  // Kệ tivi thấp hai tầng liền kệ thờ: tầng dưới tủ kín để đồ cao `cabinet`; tầng trên hở giữa hai tấm đầu kệ, mặt
  // kệ để tivi / loa ở cao `top`, tấm dày `board`. Bản khung ô lên trần đã thử và bỏ — nhìn bí (chủ nhà 11/9/2026).
  tvShelf:{ cabinet:0.28, top:0.55, board:0.03 }, dine:0.75, round:0.70,
  kit:0.85, kitsink:0.85, kithob:0.85, wash:0.85, washRaised:0.85, dishwasher:0.85, tap:0.15,
  // Bệ sân dưới máy giặt: cao `rise`, rộng hơn thân máy `pad` mỗi phía — dùng chung 2D, 3D, check-3d.
  washPlinth:{ rise:0.15, pad:0.04 },
  lav:0.85, wc:0.75, shower:0.05, car:1.50,
  cab:{ living:0.60, small:0.55, tall:2.00, smallArea:0.5 },
};

/* Cánh cửa đi trong 3D, mét. Cửa quay dựng cánh **đang mở 90°** về phía `open` — đúng nét cánh trên
   bản vẽ 2D, và đi bộ vẫn qua được. Cửa 4 cánh (cửa chính phòng khách): **hai cánh ngoài đóng, hai
   cánh giữa mở** — chủ nhà chốt tạm ngày 11/9/2026, 2D vẽ theo cùng quy ước. Cửa lùa giữ tấm kính
   trong lỗ như trước. */
export const DOOR_LEAF = {thickness:0.04};

/* Cầu thang, mét. Vị trí và số bậc khai ở `stairs` của mặt bằng; cao bậc **suy ra** = (mặt mái − sàn) / tổng
   số nấc. `maxRise` / `minTread` là giới hạn đi lại thoải mái (validate() soi). Mỗi mặt bậc dựng thành một
   khối dày `flight` dưới mặt bậc — bản thang răng cưa, gầm thang hở chứ không đặc từ sàn. `parapet` là bức lửng
   xây giữa phòng khách và buồng thang (tường khai `material:'low'`), `rail` là cao lan can thang và lan can mép lỗ
   thang — song thoáng kiểu RAILING, không tấm đặc; tim lan can dọc mép lỗ lùi vào `railThickness / 2`. `headroom` là khoảng đầu tối thiểu trên mặt bậc (check-3d soi).
   Chủ nhà chốt 11/9/2026: làm thang lên mái ngay, chờ tầng 2 sau khoảng 5 năm. */
export const STAIR = {maxRise:0.18, minTread:0.25, flight:0.12, parapet:1.00, rail:0.90, railThickness:0.04, headroom:2.00};

/* Tum trên mái che đầu cầu thang, mét — **tường gạch** trát sơn (chủ nhà chốt: không làm vách tôn / nhựa), mái
   tôn, ô polycarbonate đậy lỗ thang. Dỡ đi khi xây tầng 2. `clear` từ mặt mái tới mặt dưới mái tum; `door` cao cửa ra
   mái; `wall` bề dày tường — 100 để mặt trong vách bắc trùng mép lỗ thang, dày hơn là tường đè ra khoảng trống lỗ.
   Thông gió: ô thoáng cao `vent` sát dưới mái (cách `ventGap`) trên hai vách dài, chừa `ventMargin` ở hai đầu mỗi
   đoạn tường cho trụ. Trong ô gắn cố định `louvers` lá kính dày `louverGlass`, mỗi lá nghiêng chéo xuống ra phía ngoài
   `louverDrop` qua bề dày tường; lá trên chồng mép lá dưới nên không có đường thẳng xuyên qua — mưa hắt, lá cây không
   vào, gió vẫn qua khe (chủ nhà chốt 11/9/2026). `curb` gờ chắn nước ở ngưỡng cửa tum, cao hơn mặt mái, cánh cửa đứng trên gờ; thang ra thẳng cửa
   thì nấc cuối lên mặt gờ. `eave` mái tum đua ra khỏi mặt ngoài tường — ngắn cho gọn, cạnh nào nằm trên ranh lô thì không đua
   (lib/envelope.js); mép đua bọc **diềm gập** cao `fascia`, dày `fasciaT`, mặt trên bằng mặt tôn — che mép tấm tôn, không
   còn trông như tấm phẳng chìa ra. Trên mỗi cửa tum một **ô văng** đua `canopy` ra phía ngoài, dài hơn cửa `canopyMargin`
   mỗi bên, dày `canopyThick`, cách đầu cửa `canopyGap` — che mưa khi mở cửa, thay cho mái đua rộng (chủ nhà chốt hướng
   này 11/9/2026: mái đua 0.40 nhìn thô). */
export const TUM = {clear:2.70, vent:0.30, ventGap:0.10, ventMargin:0.40, door:2.20, wall:0.10, curb:0.10, eave:0.18,
  fascia:0.12, fasciaT:0.02, canopy:0.60, canopyMargin:0.20, canopyThick:0.05, canopyGap:0.05,
  louvers:4, louverDrop:0.08, louverGlass:0.006,
  mat:'tường gạch 100 trát sơn, mái tôn, ô lấy sáng polycarbonate, ô thoáng lá kính gắn tường xếp nghiêng sát mái'};

/* Lan can thép quanh mép mái nhà chính, mét — lên được mái thì phải có. Tuyến khai ở `roofRailings` của mặt
   bằng, dựng từng thanh như lan can rào (RAILING), chân đứng trên mặt lớp chống nóng. Tháo lắp lại lên mái
   tầng 2 được. */
export const ROOF_RAILING = {height:1.10, mat:'lan can thép sơn, trụ bắt nở vào đỉnh tường'};

/* Cao độ áp dụng cho một phương án: mặc định HEIGHTS, đè bằng v.heights nếu có. */
export function heightsOf(v){
  return Object.assign({}, HEIGHTS, v && v.heights, {
    only: Object.assign({}, HEIGHTS.only, v && v.heights && v.heights.only),
  });
}
