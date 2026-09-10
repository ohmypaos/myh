/* Vị trí mặt trời — thuật toán NOAA Solar Calculator.
   Trả về cao độ (góc so với đường chân trời) và phương vị (0 = bắc, thuận kim đồng hồ),
   rồi đổi sang hệ toạ độ cảnh 3D qua phương vị mặt tiền. */

import { frontAzimuth } from './lot.js';

const rad = d => d * Math.PI / 180;
const deg = r => r * 180 / Math.PI;

/* Vĩ độ / kinh độ mấy thành phố để chọn nhanh. Lệch vĩ độ là lệch toàn bộ phần nắng,
   nên phải chọn đúng nơi xây trước khi kết luận điều gì. */
export const PLACES = {
  HN:  {name:'Hà Nội',    lat:21.03, lon:105.85},
  DN:  {name:'Đà Nẵng',   lat:16.05, lon:108.20},
  HCM: {name:'TP.HCM',    lat:10.76, lon:106.70},
};
export const TIMEZONE = 7;

/* Ngày thứ mấy trong năm → ngày/tháng, dùng cho nhãn. Lấy năm không nhuận cho gọn. */
export function dayLabel(n){
  const d = new Date(Date.UTC(2025, 0, 1));
  d.setUTCDate(n);
  return `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
}

/* Bốn mốc đáng xem: hai chí và hai phân. */
export const KEY_DATES = [
  {n: 80,  name:'21/3 · Xuân phân'},
  {n: 172, name:'21/6 · Hạ chí — nắng cao nhất'},
  {n: 266, name:'23/9 · Thu phân'},
  {n: 355, name:'21/12 · Đông chí — nắng thấp nhất'},
];

/* NOAA: γ (vị trí trong năm) → phương trình thời gian + độ nghiêng → góc giờ → cao độ, phương vị. */
export function sunPosition({lat, lon, day, hour, timezone = TIMEZONE}){
  const g = 2 * Math.PI / 365 * (day - 1 + (hour - 12) / 24);

  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
               - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));

  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
             - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
             - 0.002697 * Math.cos(3 * g) + 0.001480 * Math.sin(3 * g);

  const tst = hour * 60 + eqTime + 4 * lon - 60 * timezone;   // giờ mặt trời thật, phút
  const H   = rad(tst / 4 - 180);                             // góc giờ
  const la  = rad(lat);

  const altitude = deg(Math.asin(
    Math.sin(la) * Math.sin(decl) + Math.cos(la) * Math.cos(decl) * Math.cos(H)));

  /* atan2 tính từ hướng nam, tăng về phía tây → cộng 180 để ra phương vị từ bắc. */
  const az = Math.atan2(Math.sin(H),
                        Math.cos(H) * Math.sin(la) - Math.tan(decl) * Math.cos(la));
  const azimuth = (deg(az) + 180 + 360) % 360;

  return {altitude, azimuth, up: altitude > 0};
}

/* Phương vị → vector hướng trong cảnh 3D.
   Cảnh dùng X = x bản vẽ, Z = y bản vẽ, Y = lên trời.
   Mặt tiền (chiều −Y của bản vẽ) ứng với phương vị mặt tiền hiện hành — đọc lúc chạy chứ
   không phải LOT.frontAzimuth cố định, vì hướng đổi được (roadmap E1). */
export function toSceneVector(azimuth, altitude){
  const u = rad(azimuth - frontAzimuth());
  const c = Math.cos(rad(altitude));
  return {x: c * Math.sin(u), y: Math.sin(rad(altitude)), z: -c * Math.cos(u)};
}

const COMPASS = ['Bắc','Đông Bắc','Đông','Đông Nam','Nam','Tây Nam','Tây','Tây Bắc'];
export function compassName(azimuth){
  return COMPASS[Math.round(((azimuth % 360) + 360) % 360 / 45) % 8];
}

/* Mặt trời mọc / lặn trong ngày — quét từng phút, đủ chính xác để ghi nhãn. */
export function sunriseSunset({lat, lon, day}){
  let sunrise = null, sunset = null, wasUp = false;
  for (let m = 0; m <= 24 * 60; m++) {
    const up = sunPosition({lat, lon, day, hour: m / 60}).altitude > 0;
    if (up && !wasUp) sunrise = m / 60;
    if (!up && wasUp) sunset = m / 60;
    wasUp = up;
  }
  return {sunrise, sunset};
}
