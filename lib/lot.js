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
  fencePrivate: 2.20, // đỉnh mặc định cho đoạn rào khai `solidFences` — xây kín hết, không lan can;
                      // mỗi đoạn khai được đỉnh riêng ở phần tử thứ 5, hai cạnh cần kín khác nhau thì khác cao
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

/* Cổng có hai trụ xây vuông và mái ngói hai dốc. Sống mái nằm trên tim tường rào,
   một mái dốc ra đường, mái kia dốc vào sân; vì vậy phần mái phía đường được phép đua
   ra ngoài ranh lô. `gateRoofs` của mặt bằng chỉ cần chỉ đúng cổng cần áp cấu tạo này. */
export const GATE_ROOF = {pillar:0.50, run:0.85, eave:2.50, rise:0.50, overhang:0.18, tile:0.11, beam:0.20,
  mat:'trụ gạch vuông 500 × 500, giằng BTCT và mái ngói hai dốc ra đường và vào sân'};

/* Cánh cổng sắt hai cánh: khung thép hộp, ba đố ngang và nan đứng. Hai cánh mở vào sân để
   không chiếm phần đường trước nhà; cổng đóng thấp hơn mép mái, ngang đỉnh tường rào riêng tư. */
export const GATE_DOOR = {height:2.10, frame:0.06, slat:0.025, slatPitch:0.12,
  mat:'khung thép hộp, 3 đố ngang và nan sắt đứng'};

/* Lớp chống nóng trên sàn mái bê tông, mét — kiểu **mái ngược**: chống thấm nằm dưới tấm XPS nên được
   che nắng và đỡ co giãn nhiệt. Từ dưới lên: bản BTCT → vữa tạo dốc (dày thay đổi, không dựng) → chống
   thấm gốc xi măng hoặc màng dán nguội (không khò bitum nóng, không sơn gốc dầu — dung môi làm chảy XPS)
   → `xps` tấm XPS cường độ nén ≥ `xpsStrength` kPa, ghép so le → vải địa kỹ thuật → `paver` tấm bê tông
   đúc sẵn `paverSize` vuông **đặt rời**, không vữa, không keo.

   **Lát rời, không cán vữa** (chủ nhà chốt): sau khoảng 5 năm xây tầng 2 thì lớp này nằm dưới sàn tầng 2
   và phải dỡ. Cán vữa 40 mm có lưới thép rồi lát gạch thì dỡ là đục bỏ — dễ phạm vào lớp chống thấm ngay
   bên dưới XPS, mà đó là thứ đắt và khó vá nhất. Lát rời thì nhấc tấm, cuộn vải địa, gỡ XPS, tái dùng
   được gần hết. Đổi lại: mặt lát đi theo dốc mái chứ không phẳng tuyệt đối, khe giữa các tấm hở, và tấm
   phải đủ nặng để gió không bốc — xem `warn` của mặt bằng.

   Mặt bằng nào khai `roofInsulation` thì mọi bản mái bê tông có lớp này (lib/envelope.js). Kiểu mái ngược
   XPS chủ nhà chốt 11/9/2026 thay cho gạch lỗ chống nóng truyền thống: gạch lỗ trữ nhiệt rồi nhả vào buổi
   tối. */
export const ROOF_INSULATION = {xps:0.05, paver:0.04, paverSize:0.40, xpsStrength:300,
  mat:'chống thấm + XPS 50 mm + vải địa kỹ thuật + tấm bê tông đúc sẵn 400 × 400 × 40 đặt rời'};

/* Diềm mép mái hiên, mét — dải ốp bọc quanh mép bản mái đổ ra ngoài tường, làm điểm nhấn cho mặt tiền nhìn thẳng từ
   cổng vào (chủ nhà chốt 12/9/2026): qua mái ngói cổng, mắt dừng đúng ở dải mép bản hiên và lan can mái. Bản nào có
   diềm thì khai ở `overhangFascias` của mặt bằng; hình học suy ở lib/envelope.js.

   Dải cao `height`, **đỉnh bằng mặt lát mái** — không nhô cao hơn: gờ trên mặt lát là chặn nước thoát ra mép bản; phía
   dưới buông thấp hơn mặt dưới bản thành một đường chỉ đậm. Dày `thickness`, áp mặt ngoài bản. Bọc mép ngoài và hai
   đầu, **trừ cạnh nằm trên ranh lô** (đầu bản hay mép ngoài) — không ốp sang đất bên cạnh. Phải nhẹ: treo ở đầu công xôn không cột. Khi xây
   tầng 2 nó thành đường chỉ phân tầng, không phải dỡ. */
export const FASCIA = {height:0.45, thickness:0.05, mat:'khung thép hộp mạ kẽm, ốp tấm gỗ nhựa ngoài trời màu nâu óc chó'};

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
  // Tủ module dưới gầm thang (`stairCab`): cao suy ra tới sát mặt dưới bậc thấp nhất phủ lên, chừa `gap`; thấp hơn `min` thì
  // không đáng làm tủ (lib/envelope.js stairCabinetOf).
  stairCab:{ gap:0.02, min:0.30 },
};

/* Cánh cửa đi trong 3D, mét. Mặc định cửa quay dựng cánh **đang mở 90°** về phía `open` — đúng nét
   cánh trên bản vẽ 2D, và đi bộ vẫn qua được. Nút 3D có thể đóng / mở đồng thời mọi cửa cánh. Cửa 4
   cánh (cửa chính phòng khách) mặc định có hai cánh ngoài đóng, hai cánh giữa mở; cửa lùa giữ tấm
   kính trong lỗ như trước. */
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

/* Bồn nước inox trên mái, mét. Vị trí khai ở `tanks` của mặt bằng (quyết định thiết kế: đặt đâu thì
   kết cấu bên dưới phải biết); cao độ **suy ra** — chân giá đỡ đứng trên mặt mái đi lại được.

   Bồn **nằm ngang** `dia` đường kính, `len` bề dài, trên giá thép cao `stand`: thấp hơn bồn đứng nên
   đỡ chắn tầm và đỡ hứng gió, lại là kiểu quen thuộc trên mái nhà ống. Cao trình nhà đã cho đủ áp cho
   tầng trệt nên giá đỡ không cần cao — nó ở đó để bồn không nằm trực tiếp lên lớp chống nóng và còn
   chỗ vệ sinh gầm bồn.

   **`cradle` là thanh kiềng ngang, không bỏ được.** Bồn nằm ngang tì xuống theo **một đường tim ở đáy trụ**,
   còn chân thì đứng ở bốn góc hình chiếu — chỗ ấy mặt trụ đã cong lên cao hơn đáy 11 cm, nên chân chống thẳng
   lên là bồn treo lơ lửng không chạm gì. Mỗi đầu một thanh kiềng bắc ngang hai chân, mặt trên đúng cốt đáy trụ;
   bồn nằm trên hai thanh ấy.

   **`pad` là bản đế, không phải chi tiết trang trí.** Lớp chống nóng lát tấm rời trên XPS (ROOF_INSULATION):
   một chân `leg` 50 × 50 đỡ 1/4 bồn đầy nước ép xuống cỡ 1000 kPa, quá sức XPS 300 kPa — phải có bản đế
   rộng `pad` dàn tải xuống còn khoảng 1/10. Xem `warn` của mặt bằng. */
export const TANK = {dia:0.96, len:1.59, stand:0.60, leg:0.05, cradle:0.05, pad:0.30, padThick:0.02, volume:1000,
  mat:'bồn inox 1000 L nằm ngang, giá thép sơn hai bộ kiềng, chân có bản đế dàn tải'};

/* Giàn phơi ngoài trời, mét. Tuyến khai ở `racks` của mặt bằng — `[mã, trục, vị trí, từ, đến]`, cùng dạng
   với tuyến tường và lan can; hình học suy ra.

   **Mặt cắt hình tam giác ngược** (chủ nhà chốt): hai trụ thép hộp `post` cao `head` ở hai đầu tuyến, trên
   đầu mỗi trụ hai tay chìa `arm` vươn chéo lên ra hai bên — lên `rise`, ra `spread` mỗi bên — đỡ **hai thanh
   phơi** inox Ø `bar` chạy suốt tuyến. Hai thanh vì thế cách nhau `2 × spread` theo phương ngang chứ không
   xếp chồng lên nhau: treo kín cả hai thanh mà quần áo không chạm nhau, hong được nhiều đồ hơn kiểu nhiều
   thanh xếp tầng. Cao độ thanh suy ra, không khai.

   Trụ đứng chứ không treo dưới mái: chỗ đặt là **dải chừa hở** của sân phơi (3d.md mục 3b), chừa đúng để
   phơi nắng — treo dưới mái thì quần áo mất nắng, mà nắng chiều Tây Nam ở đây là thứ đã trả giá để giữ. */
export const RACK = {post:0.05, bar:0.027, arm:0.04, head:1.50, rise:0.25, spread:0.25,
  mat:'giàn phơi trụ thép hộp 50 × 50 sơn tĩnh điện, đầu chữ V chìa hai bên, hai thanh phơi inox Ø27'};

/* Cây xanh ngoài sân, mét — phối cảnh. Hai loại, hai cách khai ở mặt bằng; hình học suy ở lib/envelope.js.

   `pot` — **chậu cây** đặt rời, khai ở `planters` theo tâm chậu. Chậu tròn đường kính `dia`, cao `height`; cây dáng
   đứng, tán đường kính `crown`, cao `plant` tính từ miệng chậu, gốc cắm sâu `sink` vào chậu. Cỡ chậu chọn theo chỗ
   hẹp nhất đang dùng: khe giữa mặt tường và mép bậc cửa chính chỉ 0.49 m — chậu 0.40 còn 4 cm mỗi bên, tán 0.44
   không chạm tường hay bậc.

   `bed` — **bồn hoa xây** áp tường, khai ở `flowerBeds` theo tuyến tường như giàn phơi. Lưng bồn là chính bức tường
   (chống thấm mặt tường phần tiếp đất), ba phía còn lại bó vỉa gạch dày `curb`; bồn rộng `width` tính từ mặt tường,
   mép cao `height` trên mặt sân, mặt đất trồng thấp hơn mép `soil` cho khỏi tràn khi tưới. Cao 0.25 m — hơn mặt sân
   một chút như chủ nhà muốn, đủ giữ đất và không bị bước nhầm vào (tầm bước 0.20, lib/walk.js), vẫn thấp hơn đầu gối.
   Hoa trồng thành khóm tán `clump`, cao `plant` trên mặt đất, bước `pitch` dọc bồn; mỗi khóm một chùm hoa `bloom`.

   `tree` — **cây bóng mát** trồng xuống đất, khai ở `trees` theo tâm gốc. Ô gốc vuông `pit` bó vỉa dày `pitCurb` cao
   `pitHeight`, đất thấp hơn mép `soil` — sân lát gạch vẫn chừa đất cho rễ thở và nước ngấm. Thân Ø `trunk`; tán
   đường kính `crown`, dày `crownHeight`, **mặt dưới tán cao `clear`** trên mặt sân: người đứng, xe máy dắt qua dưới tán
   không vướng cành (lib/walk.js người cao 1.70). Tán không được vươn ra ngoài lô — sang đất hàng xóm hay ra ngõ là
   chuyện tranh chấp, nên chọn cây tán gọn và tỉa giữ cỡ.

   3D chỉ dựng khối tượng trưng — chậu trụ tròn, thân trụ, tán cây hình bầu — đủ để cảm tỉ lệ và thấy bóng đổ, không
   phải mô hình cây. Chủ nhà yêu cầu 11/9/2026. */
export const GARDEN = {
  tree: { trunk:0.25, clear:2.50, crown:3.30, crownHeight:2.80, pit:1.00, pitCurb:0.10, pitHeight:0.15, soil:0.05,
          mat:'cây bóng mát tán gọn (bàng Đài Loan, lộc vừng), ô gốc 1.0 × 1.0 bó vỉa gạch cao 150' },
  pot: { dia:0.40, height:0.45, crown:0.44, plant:0.80, sink:0.08,
         mat:'chậu gốm / xi măng Ø400 cao 450, cây cảnh dáng đứng' },
  bed: { width:0.50, curb:0.10, height:0.25, soil:0.05, clump:0.36, plant:0.35, bloom:0.22, pitch:0.50,
         mat:'bó vỉa gạch 100 trát vữa cao 250, lưng áp tường có chống thấm, lỗ thoát nước chân bồn' },
};

/* Đèn, mét. Vị trí khai ở `lights` (đèn trần, đèn thả) và `wallLights` (đèn tường) của mặt bằng; cao độ **suy
   ra** — đèn trần áp mặt dưới vật che thấp nhất ngay trên nó (bản mái, trần tôn, trần giả, mái nhẹ, xà gồ, mái
   cổng), đèn tường tính từ sàn phía nó quay vào (lib/envelope.js, lib/massing.js).

   Mỗi loại một bộ đèn mua sẵn: `size` bề ngang (đèn tròn khai theo đường kính, dựng thành ô vuông), `depth` bề
   dày (đèn trần: theo phương đứng; đèn tường: nhô khỏi mặt tường), `height` cao thân đèn tường, `watt` / `lumen`
   quang thông danh định LED 4000 K, `ip` cấp chống nước. `pendant` treo chao sao cho đáy chao cách sàn `drop`.

   Nhà chính đổ bản bê tông thẳng, **không trần thạch cao** (trừ WC khách) — nên đèn trong nhà là **ốp nổi**, không
   âm trần: âm trần phải có trần giả, tức thêm một lớp mà thiết kế cố ý không có. */
export const LIGHT = {
  panel:   { mount:'ceiling', size:0.40, depth:0.05, watt:24, lumen:2400, name:'ốp trần LED Ø400' },
  panelL:  { mount:'ceiling', size:0.50, depth:0.06, watt:36, lumen:3600, name:'ốp trần LED Ø500' },
  damp:    { mount:'ceiling', size:0.25, depth:0.08, watt:18, lumen:1600, ip:44, name:'ốp trần chống ẩm Ø250' },
  down:    { mount:'ceiling', size:0.15, depth:0.06, watt:12, lumen:1100, name:'downlight ốp nổi Ø150' },
  outdoor: { mount:'ceiling', size:0.20, depth:0.08, watt:12, lumen:1000, ip:65, name:'ốp trần ngoài trời Ø200' },
  pendant: { mount:'pendant', size:0.35, depth:0.25, drop:2.10, watt:15, lumen:1300, ip:65, name:'đèn thả chao Ø350' },
  wall:    { mount:'wall', size:0.25, depth:0.10, height:0.12, watt:8, lumen:600, name:'đèn tường hắt' },
  wallOut: { mount:'wall', size:0.20, depth:0.12, height:0.20, watt:10, lumen:800, ip:65, name:'đèn tường ngoài trời' },
};

/* Bảng công tắc gắn tường, mét. Vị trí khai ở `switches` của mặt bằng như đèn tường (tường, vị trí dọc tường, hướng
   quay, tâm cao tính từ sàn phía nó quay vào); mỗi bảng gồm các **hạt**, mỗi hạt bật / tắt một **cụm đèn** khai ở
   `lightGroups`. Một cụm có hạt ở hai bảng là công tắc hai chiều. Mặt chữ nhật `width` × `height`, nhô `depth` khỏi
   mặt tường, tối đa `maxGangs` hạt một mặt. Cao tâm thường 1.25 m cạnh cửa, 0.75 m ở đầu giường. */
export const SWITCH = { width:0.12, height:0.075, depth:0.01, maxGangs:4, mat:'mặt công tắc chữ nhật 120 × 75, tối đa 4 hạt' };

/* Độ rọi chung trong phòng — **phương pháp quang thông** (lumen method), không phải mô phỏng quang học:
   E = Σ lumen × UF × MF / diện tích lọt lòng. Chỉ đèn trần và đèn thả tính vào độ rọi chung; đèn tường là đèn
   cục bộ (đầu giường, gương, mặt bếp), cộng vào thì số đẹp lên mà mặt sàn không sáng thêm bao nhiêu.

   `uf` là hệ số sử dụng theo **chỉ số phòng** K = S / (h × (dài + rộng)), h là khoảng từ đèn tới mặt làm việc
   `workPlane` — bảng gần đúng cho đèn ốp trần tán xạ, phản xạ trần / tường / sàn 0.7 / 0.5 / 0.2 (trần tường sơn
   sáng). Phòng hẹp và cao (hành lang, WC) K nhỏ nên phần lớn ánh sáng rơi lên tường. `maintenance` là hệ số suy
   giảm (bụi, LED yếu dần). Số ra để **so với ngưỡng**, sai chừng ±20% — muốn chính xác phải có file IES của
   đúng bộ đèn mua. Ngưỡng từng phòng khai ở `lux` của mặt bằng. */
export const LIGHTING = {
  workPlane:0.75, maintenance:0.8,
  uf:[[0.3,0.28],[0.4,0.33],[0.5,0.37],[0.6,0.40],[0.8,0.46],[1.0,0.51],[1.25,0.56],[1.5,0.60],[2.0,0.65],[2.5,0.68],[3.0,0.71],[4.0,0.74],[5.0,0.76]],
};

/* Cao độ áp dụng cho một phương án: mặc định HEIGHTS, đè bằng v.heights nếu có. */
export function heightsOf(v){
  return Object.assign({}, HEIGHTS, v && v.heights, {
    only: Object.assign({}, HEIGHTS.only, v && v.heights && v.heights.only),
  });
}
