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
  fence:  2.20,       // tường rào quanh sân
  alley:  2.80,       // mái hành lang ngoài (R3)
  only: {             // ngoại lệ theo mã lỗ mở
    D12:{door:2.40},  // cửa lùa kính ra ban công — cao hơn cửa thường
  },
};

/* Kích thước lọt lòng tối thiểu theo loại phòng, mét — dùng để **tô đỏ** khi kéo thanh
   trượt, không dùng để chặn thao tác.

   Chủ nhà chốt giữ nguyên ngày 10/9/2026 (roadmap E2c). Số lấy từ chỗ chật nhất mà chính
   thiết kế hiện tại đã chấp nhận rồi lùi xuống một chút, để không tô đỏ oan:
   hành lang 0.84, WC khách 1.38, phòng thờ 1.90, ban công 1.78. */
export const MIN_CLEAR = { room: 1.80, wet: 1.30, circ: 0.80, yard: 1.00 };

/* Bậc tam cấp, mét. Cốt nền chia nấc `rise` (0.45 / 0.15 = 3 nấc); nấc trên cùng chính là ngưỡng
   cửa nên chỉ dựng 2 bậc ngoài, nhô 2 × `tread` tính từ mặt tường. Kéo thanh trượt cốt nền thì số
   bậc đổi theo. Cửa nào có bậc, rộng hơn cửa bao nhiêu mỗi bên, mặt bậc riêng nếu khác `tread`
   thì khai ở `steps` của mặt bằng — cửa chính khác cửa phụ; vị trí suy trong lib/envelope.js. */
export const STEP = {rise:0.15, tread:0.30};

/* Cao độ áp dụng cho một phương án: mặc định HEIGHTS, đè bằng v.heights nếu có. */
export function heightsOf(v){
  return Object.assign({}, HEIGHTS, v && v.heights, {
    only: Object.assign({}, HEIGHTS.only, v && v.heights && v.heights.only),
  });
}
