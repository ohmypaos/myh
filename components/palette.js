/* ═══════════ BẢNG MÀU · NHÓM KHỐI ═══════════
   Tách khỏi components/scene3d.js để **phép kiểm đọc được cùng một nguồn**: scripts/check-3d.mjs không
   nạp được scene3d.js (nó kéo theo three.js và DOM), mà đọc bằng biểu thức chính quy thì mong manh.
   Ở đây chỉ có dữ liệu thuần, không phụ thuộc gì. */

/* Bảng màu giấy can, cùng tông với bản vẽ 2D. Khoá phải trùng `kind` mà massing.js sinh ra. */
export const COLORS = {
  houseWall:   0xefece4,
  partitionWall:0xb8c3c5,   // vách nhựa ngăn phòng, không phải tường xây
  lowWall:     0xefece4,     // bức lửng giữa phòng khách và buồng thang — trát sơn như tường nhà
  stair:       0xe2dccd,     // bản thang, chiếu nghỉ
  stairRail:   0x4f4c46,     // lan can thang, lan can mép lỗ thang
  tumWall:     0xefece4,     // tường gạch tum trát sơn, cùng màu tường nhà
  tumRoof:     0xb9bcb8,     // mái tôn tum
  tumDoor:     0x8d6e4f,     // cánh cửa tum ra mái
  tumCurb:     0xefece4,     // gờ chắn nước ngưỡng cửa tum
  tumFascia:   0x6a716e,     // diềm gập bọc mép mái tum — sẫm để viền mái đọc thành một nét gọn
  tumCanopy:   0x6a716e,     // ô văng trên cửa tum, cùng màu diềm
  roofRailing: 0x4f4c46,     // lan can thép mép mái
  tank:        0xc6cacb,     // bồn inox — xám sáng ánh kim, tách khỏi tôn xám lạnh
  tankStand:   0x6a716e,     // giá thép và bản đế dưới bồn
  tankCradle:  0x6a716e,     // thanh kiềng ngang đỡ đáy bồn
  rack:        0x6a716e,     // trụ giàn phơi, cùng màu giá bồn
  rackArm:     0x6a716e,     // tay chìa chéo trên đầu trụ giàn phơi
  rackBar:     0xc6cacb,     // thanh phơi inox
  planter:     0xa9644a,     // chậu cây — nâu đất nung
  bedCurb:     0xd9d3c4,     // bó vỉa bồn hoa trát vữa, cùng tông rào xây
  soil:        0x6f5a45,     // đất trồng trong bồn hoa
  plant:       0x5f8f4a,     // tán cây, khóm hoa
  bloom:       0xd8577e,     // chùm hoa trên khóm
  trunk:       0x6b5440,     // thân cây bóng mát
  fenceWall:   0xd9d3c4,
  railing:     0x4f4c46,     // lan can sắt sơn tối trên tường rào thấp
  floor:       0xe8e3d6,
  ground:      0xcfccc0,
  roof:        0xc9c2b2,
  alleyRoof:   0xbdb6a6,
  overhang:    0xc9c2b2,
  roofInsulation:0xc39b82,  // gạch lát trên lớp chống nóng mái — tông gạch nhạt, tách khỏi bê tông
  metalRoof:   0xb9bcb8,     // tôn — xám hơi lạnh, tách khỏi bê tông
  gutter:      0x7d8582,     // máng xối — tối hơn tôn cho thấy rõ viền mép mái
  downpipe:    0x6a716e,     // ống xả đứng áp tường bao
  gatePillar:  0xd9d3c4,     // trụ cổng gạch vuông, cùng tông rào xây
  gateCap:     0xd9d3c4,     // đầu trụ vát khít mặt dưới mái ngói
  gateBeam:    0xd9d3c4,     // giằng BTCT nối hai trụ ngay dưới sống mái
  gateDoor:    0x30363a,     // khung và nan cổng sắt sơn tối
  gateRoofTile:0x9e4f3d,     // mái ngói đất nung trên cổng
  post:        0x55595a,     // cột thép hộp đỡ mái nhẹ
  beam:        0x55595a,     // dầm biên thép hộp, cùng màu cột
  purlin:      0x73787a,     // xà gồ dưới tấm tôn, nhỏ hơn dầm biên
  ceiling:     0xe4e0d4,
  dropCeiling: 0xe9e6dc,     // trần giả thạch cao / nhựa
  step:        0xe2dccd,
  furniture:   0xc4ab86,     // nội thất — gỗ nhạt, tách khỏi tường và sàn
  doorLeaf:    0x8d6e4f,     // cánh cửa đi — gỗ sẫm
  lamp:        0xfff1cc,     // đèn tường trong nhà và ngoài sân — vàng nhạt, dựng không đổ bóng sáng tối
  ceilingLamp: 0xfff1cc,     // đèn trần, đèn thả
  roofLamp:    0xfff1cc,     // đèn trên tường tum
  switchPlate: 0xf7f6f0,     // mặt bảng công tắc — nhựa trắng
  roofSwitch:  0xf7f6f0,     // bảng công tắc trên tường tum
  glass:       0xa9cfe0,
};

/* Loại khối **đèn**: dựng bằng vật liệu không nhận sáng (luôn sáng đều một màu) cho đọc ra ngay là bóng đèn, kể cả
   trong bóng râm. Chỉ là thân đèn — mô hình không phát sáng thật (không dựng nguồn sáng điểm): không có bóng đổ
   thì ánh đèn xuyên tường sang phòng bên, ảnh đêm sẽ nói sai. */
export const LAMP_KINDS = new Set(['lamp', 'ceilingLamp', 'roofLamp']);

/* Loại khối **kính**: dựng bằng vật liệu trong suốt, cố ý không có trong COLORS. */
export const GLASS_KINDS = new Set(['glass', 'sash', 'louver', 'tumGlass']);

/* Loại khối bị nút "Ẩn mái" giấu. Gồm cả mái tôn, máng xối, dầm, xà gồ, trần — và **mọi thứ đứng trên
   mặt mái đi lại được** (tum, lan can mái, bồn nước): không giấu thì bấm "Ẩn mái" xong vẫn không nhìn
   được xuống trong nhà. Đầu hồi là tường, cố ý giữ lại. check-3d phép 24 soi: khối nào đứng từ cốt mặt
   mái trở lên mà không nằm trong danh sách này là lọt lưới. */
export const ROOF_KINDS = new Set([
  'roof', 'alleyRoof', 'overhang', 'roofInsulation', 'metalRoof', 'gateRoofTile', 'gateBeam', 'gutter', 'beam', 'purlin',
  'ceiling', 'dropCeiling', 'ceilingLamp', 'roofLamp', 'roofSwitch',
  'tumWall', 'tumRoof', 'tumGlass', 'tumDoor', 'tumCurb', 'louver', 'tumFascia', 'tumCanopy',
  'roofRailing', 'tank', 'tankStand', 'tankCradle',
]);
