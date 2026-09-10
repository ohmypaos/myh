/* Bộ kiểm tra hình học 3D.
 *
 *   npm run check:3d
 *
 * 13 phép kiểm trong lib/plan.js chỉ soi mặt bằng 2D. Khối 3D do lib/massing.js sinh ra thì
 * chưa có gì canh — mà nó cắt tường theo lỗ mở và khoét mái theo giếng trời, đúng loại việc
 * dễ sai lặng lẽ: thiếu một mảnh hay chồng hai mảnh thì ảnh vẫn trông bình thường.
 *
 * Chạy được trong node vì lib/massing.js cố ý không dính three.js (xem 3d.md mục 5).
 */
import { PLANS } from '../lib/versions/index.js';
import { LOT, heightsOf } from '../lib/lot.js';
import { buildMassing, levels } from '../lib/massing.js';

const EPS = 1e-6;
const AREA_EPS = 1e-4;

const overlap = (a, b, c, d) => Math.max(0, Math.min(b, d) - Math.max(a, c));
const boxArea = b => b.w * b.d;

/* Nửa bề dày tường dày nhất — tường bao nằm trên tim lô nên hộp thò ra ngoài đúng chừng đó. */
const outset = plan => Math.max(0, ...plan.walls.map(w => w[4])) / 2;

const CHECKS = [
  'Mọi hộp có bề rộng, bề sâu và chiều cao dương',
  'Không hộp nào thò ra ngoài lô quá nửa bề dày tường',
  'Không hộp nào cao quá đỉnh mái nhà',
  'Mảnh tường trên cùng một đường tim không chồng nhau',
  'Mỗi lỗ mở thật sự thủng — không mảnh tường nào che tâm lỗ',
  'Diện tích mái bằng phòng kín trừ đúng phần giếng trời',
  'Các mảnh mái không chồng lên nhau',
  'Kính giếng trời nằm đúng cao độ trần',
];

function check(plan){
  const e = [];
  const m = buildMassing(plan);
  const H = heightsOf(plan);
  const L = levels(H);
  const all = [...m.boxes, ...m.glass];
  const out = outset(plan);
  const n = x => +x.toFixed(4);

  /* 1 — hộp suy biến hoặc NaN. */
  for (const b of all) {
    const ok = [b.x, b.z, b.w, b.d, b.y0, b.y1].every(Number.isFinite)
      && b.w > EPS && b.d > EPS && b.y1 - b.y0 > EPS;
    if (!ok) e.push(`hộp ${b.kind} suy biến: ${JSON.stringify(b)}`);
  }

  /* 2 — thò ra ngoài lô. */
  for (const b of all) {
    if (b.x < -out - EPS || b.x + b.w > LOT.w + out + EPS
     || b.z < -out - EPS || b.z + b.d > LOT.d + out + EPS)
      e.push(`hộp ${b.kind} thò ra ngoài lô: x ${n(b.x)}…${n(b.x + b.w)}, z ${n(b.z)}…${n(b.z + b.d)}`);
  }

  /* 3 — cao quá đỉnh mái. */
  for (const b of all)
    if (b.y1 > L.houseTop + EPS)
      e.push(`hộp ${b.kind} cao ${n(b.y1)} > đỉnh mái ${n(L.houseTop)}`);

  /* 4 — mảnh tường chồng nhau. Chỉ soi các mảnh nằm trên cùng một đường tim: hai bức tường
     vuông góc thì đương nhiên chồng nhau ở góc, đó không phải lỗi. */
  const walls = m.boxes.filter(b => /Wall$/.test(b.kind));
  const line = b => (b.w < b.d ? `v${n(b.x + b.w / 2)}` : `h${n(b.z + b.d / 2)}`);
  const byLine = {};
  for (const b of walls) (byLine[line(b)] ||= []).push(b);
  for (const [key, list] of Object.entries(byLine))
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const ov = overlap(a.x, a.x + a.w, b.x, b.x + b.w)
                 * overlap(a.z, a.z + a.d, b.z, b.z + b.d)
                 * overlap(a.y0, a.y1, b.y0, b.y1);
        if (ov > AREA_EPS) {
          e.push(`hai mảnh tường trên đường ${key} chồng nhau ${n(ov)} m³`);
          i = j = list.length;
        }
      }

  /* 5 — lỗ mở có thật sự thủng không. Đây là phép kiểm độc lập nhất: nó không tính lại theo
     lối của massing.js mà chỉ hỏi một câu — chọc một điểm vào giữa lỗ, có đụng tường không.
     Cửa 'open' bỏ qua: chỗ đó vốn không có tường chứ không phải có cửa (xem D3). */
  const inside = (b, px, py, pz) =>
    px > b.x + EPS && px < b.x + b.w - EPS &&
    pz > b.z + EPS && pz < b.z + b.d - EPS &&
    py > b.y0 + EPS && py < b.y1 - EPS;

  const holes = [
    ...plan.doors.filter(d => d[5] !== 'open')
      .map(d => ({ id: d[0], ax: d[1], pos: d[2], a: d[3], b: d[4],
                   y: L.floor + 0.05 })),
    ...plan.windows
      .map(w => ({ id: w[0], ax: w[1], pos: w[2], a: w[3], b: w[4],
                   y: L.floor + H.sill + 0.05 })),
    ...plan.gates
      .map(g => ({ id: g[4] || 'cổng', ax: g[0], pos: g[1], a: g[2], b: g[3], y: 0.05 })),
  ];

  for (const o of holes) {
    const mid = (o.a + o.b) / 2;
    const px = o.ax === 'h' ? mid : o.pos;
    const pz = o.ax === 'h' ? o.pos : mid;
    const hit = walls.find(b => inside(b, px, o.y, pz));
    if (hit) e.push(`${o.id} bị mảnh ${hit.kind} bịt tại cao độ ${n(o.y)}`);
  }

  /* 6 — diện tích mái. Bắt được cả mảnh thiếu lẫn mảnh chồng của phép khoét giếng trời. */
  const enclosed = plan.rooms.filter(r => r[6] !== 'yard' && r[0] !== 'R3');
  let want = 0;
  for (const [, , x, y, w, h] of enclosed) {
    want += w * h;
    for (const [, , sx, sy, sw, sh] of plan.skylights)
      want -= overlap(x, x + w, sx, sx + sw) * overlap(y, y + h, sy, sy + sh);
  }
  const got = m.boxes.filter(b => b.kind === 'roof').reduce((s, b) => s + boxArea(b), 0);
  if (Math.abs(got - want) > AREA_EPS)
    e.push(`diện tích mái ${n(got)} ≠ phòng kín trừ giếng trời ${n(want)}`);

  /* 7 — mảnh mái chồng nhau. Tổng diện tích có thể vẫn đúng nếu chỗ chồng bù chỗ thiếu, nên
     phải soi từng cặp chứ không tin mỗi phép 6. */
  const roof = m.boxes.filter(b => b.kind === 'roof');
  for (let i = 0; i < roof.length; i++)
    for (let j = i + 1; j < roof.length; j++) {
      const a = roof[i], b = roof[j];
      const ov = overlap(a.x, a.x + a.w, b.x, b.x + b.w) * overlap(a.z, a.z + a.d, b.z, b.z + b.d);
      if (ov > AREA_EPS) { e.push(`hai mảnh mái chồng nhau ${n(ov)} m²`); i = j = roof.length; }
    }

  /* 8 — kính giếng trời phải nằm ở cao độ trần, không lửng lơ. */
  for (const [id, , x, y] of plan.skylights) {
    const g = m.glass.find(b => Math.abs(b.x - x) < EPS && Math.abs(b.z - y) < EPS);
    if (!g) e.push(`${id} không có kính`);
    else if (Math.abs(g.y0 - L.ceiling) > EPS)
      e.push(`${id} kính ở cao độ ${n(g.y0)}, phải là cốt trần ${n(L.ceiling)}`);
  }

  return { errors: e, boxes: m.boxes.length, glass: m.glass.length };
}

let failed = 0;
for (const plan of PLANS) {
  let r;
  try { r = check(plan); }
  catch (err) { failed++; console.log(`GÃY    ${plan.id.padEnd(8)} ${err.message}`); continue; }

  const size = `${r.boxes} hộp, ${r.glass} kính`;
  if (r.errors.length) {
    failed++;
    console.log(`LỖI    ${plan.id.padEnd(8)} ${size}`);
    for (const x of r.errors.slice(0, 6)) console.log(`         ${x}`);
    if (r.errors.length > 6) console.log(`         … và ${r.errors.length - 6} lỗi nữa`);
  } else {
    console.log(`sạch   ${plan.id.padEnd(8)} ${size}`);
  }
}

console.log();
console.log(CHECKS.map((c, i) => `${i + 1}. ${c}`).join('\n'));
console.log();
console.log(failed
  ? `${failed}/${PLANS.length} phương án có lỗi hình học 3D.`
  : `Cả ${PLANS.length} phương án qua ${CHECKS.length} phép kiểm hình học 3D.`);
process.exit(failed ? 1 : 0);
