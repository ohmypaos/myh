/* ═══════════ LÔ ĐẤT · CAO ĐỘ ═══════════
   Hằng số cấp lô đất, dùng chung cho trang 2D và trang 3D.
   Số liệu từng phiên bản nằm ở lib/versions/v<n>.js. */

/* huongMatTien: góc phương vị của hướng mặt tiền, độ, 0 = bắc, tăng theo chiều kim đồng hồ.
   45 = Đông Bắc → cạnh sau lô (ban công, sân phơi) quay Tây Nam, cạnh phải (bếp,
   hành lang ngoài) quay Đông Nam, cạnh trái (tường bao) quay Tây Bắc. */
export const LOT = {w:9.5, d:30.0, huongMatTien:45};

/* Cao độ, mét. Giống nhau ở cả 12 phiên bản nên để đây, không nhân bản vào từng file.
   Phiên bản nào đổi chiều cao thì khai heights:{...} trong chính file đó để đè lên. */
export const CAO = {
  nen:   0.45,        // cốt nền nhà so với sân — bậc thềm
  tran:  3.30,        // sàn nhà → trần
  mai:   0.25,        // dày bản mái
  cua:   2.20,        // cao cửa mặc định
  soDuoi:0.90,        // bệ cửa sổ
  soTren:2.20,        // mép trên cửa sổ
  rao:   2.20,        // tường rào quanh sân
  hienNgoai: 2.80,    // mái hành lang ngoài (R3)
  rieng: {            // ngoại lệ theo mã lỗ mở
    D12:{cua:2.40},   // cửa lùa kính ra ban công — cao hơn cửa thường
  },
};

/* Mái che sân phụ — chỗ để xe, nối thẳng từ mép nhà chính chạy ngược ra cổng.
   CHƯA vào dữ liệu phiên bản: đây là thay đổi thiết kế nên đúng quy trình phải thành
   v13, không sửa v12. Tạm khai ở đây để 3D dựng được. Xem 3d.md mục 3. */
export const MAI_CHE = {x:0.0, w:5.0, tuY:12.0, dai:5.5, cao:2.80};

/* Cao độ áp dụng cho một phiên bản: mặc định CAO, đè bằng v.heights nếu có. */
export function caoDo(v){
  return Object.assign({}, CAO, v && v.heights, {
    rieng: Object.assign({}, CAO.rieng, v && v.heights && v.heights.rieng),
  });
}
