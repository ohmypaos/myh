/* ═══════════ LÔ ĐẤT · CAO ĐỘ ═══════════
   Hằng số cấp lô đất, dùng chung cho trang 2D và trang 3D.
   Số liệu mặt bằng nằm ở lib/versions/. */

/* frontAzimuth: góc phương vị của hướng mặt tiền, độ, 0 = bắc, tăng theo chiều kim đồng hồ.
   45 = Đông Bắc → cạnh sau lô (ban công sau, sân phơi) quay Tây Nam, cạnh phải (bếp,
   hành lang ngoài) quay Đông Nam, cạnh trái (tường bao) quay Tây Bắc. */
export const LOT = {w:9.5, d:30.0, frontAzimuth:45};

/* ═══════════ HƯỚNG — ĐỔI TẠM ĐỂ THỬ ═══════════
   Phương vị mặt tiền là thứ duy nhất hiện cho đổi lúc chạy (roadmap E1). Giữ ở localStorage
   chứ không phải biến trong một trang, để bản vẽ 2D và mô hình 3D không nói hai đằng.

   Chạy trong node (gen-spec) thì không có localStorage — khi đó trả về giá trị gốc. Hướng
   không đụng tới hình học nên validate() và spec/ không phụ thuộc hàm này.

   E3 sau này gom nó vào cấu hình đặt tên; giờ để một khoá riêng cho gọn. */
const AZIMUTH_KEY = 'myh.frontAzimuth';

export function frontAzimuth(){
  try {
    const raw = globalThis.localStorage?.getItem(AZIMUTH_KEY);
    const deg = Number(raw);
    if (raw !== null && raw !== '' && Number.isFinite(deg)) return ((deg % 360) + 360) % 360;
  } catch { /* localStorage bị chặn hoặc không có — dùng giá trị gốc */ }
  return LOT.frontAzimuth;
}

/* deg = null để trả về hướng gốc. */
export function setFrontAzimuth(deg){
  try {
    if (deg === null) globalThis.localStorage?.removeItem(AZIMUTH_KEY);
    else globalThis.localStorage?.setItem(AZIMUTH_KEY, String(deg));
  } catch { /* không lưu được thì thôi, phiên này vẫn chạy */ }
}

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

/* Mái che sân phụ — chỗ để xe, nối thẳng từ mép nhà chính chạy ngược ra cổng.
   CHƯA vào dữ liệu mặt bằng, tạm khai ở đây để 3D dựng được. Xem 3d.md mục 3. */
export const CARPORT_ROOF = {x:0.0, w:5.0, fromY:12.0, length:5.5, height:2.80};

/* Cao độ áp dụng cho một phương án: mặc định HEIGHTS, đè bằng v.heights nếu có. */
export function heightsOf(v){
  return Object.assign({}, HEIGHTS, v && v.heights, {
    only: Object.assign({}, HEIGHTS.only, v && v.heights && v.heights.only),
  });
}
