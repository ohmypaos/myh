/* Bộ kiểm tra hình học 3D.
 *
 *   npm run check:3d
 *
 * 15 phép kiểm trong lib/plan.js chỉ soi mặt bằng 2D. Khối 3D do lib/massing.js sinh ra thì
 * chưa có gì canh — mà nó cắt tường theo lỗ mở và khoét mái theo giếng trời, đúng loại việc
 * dễ sai lặng lẽ: thiếu một mảnh hay chồng hai mảnh thì ảnh vẫn trông bình thường.
 *
 * Chạy được trong node vì lib/massing.js cố ý không dính three.js (xem 3d.md mục 5).
 */
import { PLANS } from '../lib/versions/index.js';
import { LOT, STEP, ROOF, heightsOf } from '../lib/lot.js';
import { buildMassing, levels } from '../lib/massing.js';
import { openingFloor, stepsOf, lightRoofs, roofOver, clearRect } from '../lib/envelope.js';

const EPS = 1e-6;
const AREA_EPS = 1e-4;

const overlap = (a, b, c, d) => Math.max(0, Math.min(b, d) - Math.max(a, c));
const boxArea = b => b.w * b.d;

/* Nửa bề dày tường dày nhất — tường bao nằm trên tim lô nên hộp thò ra ngoài đúng chừng đó. */
const outset = plan => Math.max(0, ...plan.walls.map(w => w[4])) / 2;

/* Cao độ [mặt dưới, mặt trên] của một khối tại toạ độ `u` dọc trục nghiêng. Hộp thẳng trục thì
   ở đâu cũng như nhau; lăng trụ mái dốc thì nội suy tuyến tính giữa hai đầu. */
function spanAt(b, u){
  if (!b.axis) return [b.y0, b.y1];
  const [a0, a1] = b.axis === 'x' ? [b.x, b.x + b.w] : [b.z, b.z + b.d];
  const f = a1 - a0 > EPS ? Math.min(1, Math.max(0, (u - a0) / (a1 - a0))) : 0;
  return [b.yb[0] + (b.yb[1] - b.yb[0]) * f, b.yt[0] + (b.yt[1] - b.yt[0]) * f];
}

/* Hai khối đâm vào nhau bao nhiêu. Hai hộp thẳng trục thì trả về **thể tích** phần chồng như
   trước; có mặt nghiêng thì hộp bao không nói được gì, phải chia nhỏ dọc trục nghiêng và trả về
   **độ đâm sâu** theo phương đứng — chạm mặt (mái gá đúng lên đỉnh tường) ra 0, không tính là
   chồng. Mọi mái trong dự án chỉ dốc theo một trục nên không phải xét lưới hai chiều. */
function penetration(a, b){
  const ox = overlap(a.x, a.x + a.w, b.x, b.x + b.w);
  const oz = overlap(a.z, a.z + a.d, b.z, b.z + b.d);
  if (ox <= EPS || oz <= EPS) return 0;
  const flat = overlap(a.y0, a.y1, b.y0, b.y1);
  if (!a.axis && !b.axis) return Math.max(0, ox * oz * flat);
  if (flat <= 0) return 0;
  /* Hai mặt nghiêng khác trục thì không có ở đây; nếu có, so bằng hộp bao cho an toàn. */
  if (a.axis && b.axis && a.axis !== b.axis) return flat;
  const axis = a.axis || b.axis;
  const [c0, c1] = axis === 'x'
    ? [Math.max(a.x, b.x), Math.min(a.x + a.w, b.x + b.w)]
    : [Math.max(a.z, b.z), Math.min(a.z + a.d, b.z + b.d)];
  let deep = 0;
  for (let i = 0; i <= 200; i++) {
    const u = c0 + (c1 - c0) * i / 200;
    const [al, ah] = spanAt(a, u), [bl, bh] = spanAt(b, u);
    deep = Math.max(deep, Math.min(ah, bh) - Math.max(al, bl));
  }
  return deep;
}

const CHECKS = [
  'Mọi khối có bề rộng, bề sâu và chiều cao dương',
  'Không khối nào thò ra ngoài lô quá nửa bề dày tường',
  'Không khối nào cao quá đỉnh cao nhất của thiết kế',
  'Mảnh tường trên cùng một đường tim không chồng nhau',
  'Mỗi lỗ mở thật sự thủng — không mảnh tường nào che tâm lỗ',
  'Mái che kín đúng phòng kín trừ phần giếng trời — bản bê tông hoặc trần tôn',
  'Các mảnh mái không chồng lên nhau',
  'Kính giếng trời nằm đúng cao độ trần',
  'Bậc cần có đều dựng được, đều nhau, bậc cao nhất áp mặt tường cửa và thấp hơn ngưỡng đúng một nấc',
  'Không hai khối đặc nào chồng lên nhau — chồng là có mặt trùng, nhấp nháy khi xoay',
  'Góc tường kín — chỗ hai tường gặp nhau không khuyết ô nửa bề dày',
  'Mái nhẹ gá thấp dưới mái kề nó, và không hạ xuống dưới đầu lỗ mở nào nó phủ',
];

function check(plan){
  const e = [];
  const m = buildMassing(plan);
  const H = heightsOf(plan);
  const L = levels(H);
  const all = [...m.boxes, ...m.glass, ...m.prisms];
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

  /* 3 — cao quá đỉnh thiết kế. Không còn là đỉnh mái nhà: nóc mái tôn bếp cố ý nhô cao hơn mặt
     mái bê tông. Mốc suy từ **số khai** (đỉnh mái nhà, nóc mái nhẹ cao nhất cộng bề dày tấm lợp)
     chứ không lấy từ khối đã dựng — lấy từ khối dựng thì phép kiểm tự nói đúng mọi lúc. */
  const design = Math.max(L.houseTop, ...lightRoofs(plan).map(r => r.high + ROOF.sheet));
  for (const b of all)
    if (b.y1 > design + EPS)
      e.push(`hộp ${b.kind} cao ${n(b.y1)} > đỉnh thiết kế ${n(design)}`);

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
     Cửa 'open' bỏ qua: chỗ đó vốn không có tường chứ không phải có cửa (xem D3).
     Điểm chọc tính từ cốt sàn của lỗ mở — WC khách nằm ở cốt sân nên D11, W4 thấp hơn cửa khác. */
  const inside = (b, px, py, pz) =>
    px > b.x + EPS && px < b.x + b.w - EPS &&
    pz > b.z + EPS && pz < b.z + b.d - EPS &&
    py > b.y0 + EPS && py < b.y1 - EPS;

  const base = o => openingFloor(plan, L, o[1], o[2], o[3], o[4]);
  const holes = [
    ...plan.doors.filter(d => d[5] !== 'open')
      .map(d => ({ id: d[0], ax: d[1], pos: d[2], a: d[3], b: d[4],
                   y: base(d) + 0.05 })),
    ...plan.windows
      .map(w => ({ id: w[0], ax: w[1], pos: w[2], a: w[3], b: w[4],
                   y: base(w) + ((H.only[w[0]] || {}).sill ?? H.sill) + 0.05 })),
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
  for (const r of enclosed) {
    /* Phòng lợp mái nhẹ được che bằng trần tôn, mà trần tôn bắt vào mặt trong tường nên chỉ
       phủ phần lọt lòng — tính theo đúng chữ nhật ấy. */
    const c = roofOver(plan, r) ? clearRect(plan, r)
                                : { x: r[2], y: r[3], w: r[4], h: r[5] };
    want += c.w * c.h;
    for (const [, , sx, sy, sw, sh] of plan.skylights)
      want -= overlap(c.x, c.x + c.w, sx, sx + sw) * overlap(c.y, c.y + c.h, sy, sy + sh);
  }
  /* Bếp lợp tôn nên không có bản bê tông, nhưng vẫn phải được che kín: trần tôn tính vào đây,
     và phòng nào có mái nhẹ phủ mà thiếu trần thì lộ ra ở tổng diện tích. */
  const got = m.boxes.filter(b => b.kind === 'roof' || b.kind === 'ceiling')
                     .reduce((s, b) => s + boxArea(b), 0);
  if (Math.abs(got - want) > AREA_EPS)
    e.push(`mái + trần ${n(got)} ≠ phòng kín trừ giếng trời ${n(want)}`);
  for (const r of enclosed) {
    const light = roofOver(plan, r);
    if (light && light.ceiling === undefined)
      e.push(`${r[0]} ${r[1]} lợp mái nhẹ ${light.id} mà mái không khai cốt trần`);
  }

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

  /* 9 — bậc. Nấc trên cùng của tam cấp là ngưỡng cửa, nên bậc cao nhất dựng ra phải thấp hơn
     ngưỡng khoảng một nấc và áp vào đúng đường tim tường có cửa: sai nấc là vấp ở ngưỡng cửa,
     tách khỏi tường là bậc lơ lửng giữa sân. Ngưỡng lấy theo cốt sàn của lỗ mở — cùng số mà
     phép kiểm 5 dùng — chứ không lấy nấc do envelope.js tính. */
  const byDoor = {};
  for (const b of m.boxes.filter(b => b.kind === 'step')) (byDoor[b.id] ||= []).push(b);
  for (const s of stepsOf(plan))
    if (!s.error && !byDoor[s.id]) e.push(`bậc ${s.id} khai mà không dựng được`);
  for (const [id, list] of Object.entries(byDoor)) {
    const top = list.reduce((p, b) => (b.y1 > p.y1 ? b : p));
    const d = plan.doors.find(x => x[0] === id);
    const sill = d ? openingFloor(plan, L, d[1], d[2], d[3], d[4]) : NaN;
    const gap = sill - top.y1;
    if (!(gap > STEP.rise * 0.5 && gap < STEP.rise * 1.5))
      e.push(`bậc ${id} cao nhất ở ${n(top.y1)}, ngưỡng cửa ${n(sill)} — phải thấp hơn đúng một nấc`);
    /* Áp vào mặt tường: đường tim ± nửa bề dày tường dưới cửa, tra thẳng từ danh sách tường. */
    const t = d ? Math.max(0, ...plan.walls
      .filter(w => w[0] === d[1] && Math.abs(w[1] - d[2]) < EPS && w[2] < d[4] && w[3] > d[3])
      .map(w => w[4])) : 0;
    const faces = d ? [d[2] - t / 2, d[2] + t / 2] : [];
    const near = v => faces.some(f => Math.abs(v - f) < EPS);
    const touches = d && (d[1] === 'h'
      ? near(top.z) || near(top.z + top.d)
      : near(top.x) || near(top.x + top.w));
    if (!touches) e.push(`bậc cao nhất của ${id} không áp vào mặt tường cửa`);

    /* Các bậc phải đều: mọi mặt bậc cùng một bề sâu. (Lỗi đo từ tim tường — bậc trên bị tường
       nuốt mất nửa bề dày — thì điều kiện "áp mặt tường" ở trên bắt, không phải điều kiện này.) */
    const depths = list.map(b => (d && d[1] === 'h' ? b.d : b.w));
    if (Math.max(...depths) - Math.min(...depths) > EPS)
      e.push(`bậc ${id} không đều: mặt bậc ${depths.map(n).join(' / ')}`);
  }

  /* 10 — hai khối đặc không được chồng lên nhau. Chồng nhau là có mặt trùng nhau, và mặt trùng
     thì card đồ hoạ vẽ lúc mặt này lúc mặt kia — mái nhấp nháy như bị tường xuyên qua khi xoay.
     Sàn và nền không tính: sàn lọt trong chân tường, không có mặt nào lộ ra trùng.
     Mái tôn dốc và đầu hồi có mặt nghiêng nên đo bằng độ đâm sâu (penetration) chứ không phải
     thể tích hộp bao — hộp bao của một mặt dốc chồng lên hàng xóm là chuyện thường. */
  const solid = [...m.boxes.filter(b => b.kind !== 'floor' && b.kind !== 'ground'), ...m.prisms];
  let clashes = 0;
  for (let i = 0; i < solid.length; i++)
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i], b = solid[j];
      const ov = penetration(a, b);
      const bad = a.axis || b.axis ? ov > 1e-4 : ov > 1e-6;
      if (bad && clashes++ < 3)
        e.push(`${a.kind} và ${b.kind} chồng nhau ${a.axis || b.axis ? `${n(ov)} m` : `${n(ov)} m³`}`
             + ` quanh x ${n(Math.max(a.x, b.x))}, z ${n(Math.max(a.z, b.z))}`);
    }
  if (clashes > 3) e.push(`… tổng cộng ${clashes} cặp khối chồng nhau`);

  /* 11 — góc tường kín. Chỗ đầu một bức tường gặp tường vuông góc, ô giao nhau phải có tường:
     dựng mỗi mảnh đúng từ tim tới tim thì góc ngoài khuyết một ô nửa bề dày. Chọc bốn điểm sát bốn
     góc ô đó ở chân tường. Cổng và cửa ở cốt sân để trống chân tường nên bỏ qua điểm rơi vào đó. */
  const wallBoxes = m.boxes.filter(b => /Wall$/.test(b.kind));
  /* Tính cả điểm nằm trên mặt hộp: điểm chọc có thể rơi đúng ranh hai mảnh tường sát nhau (vệt
     tường cắt theo mép giếng trời chẳng hạn) — nằm-hẳn-bên-trong thì không mảnh nào nhận nó. */
  const covers = (b, px, py, pz) =>
    px >= b.x - EPS && px <= b.x + b.w + EPS &&
    pz >= b.z - EPS && pz <= b.z + b.d + EPS &&
    py >= b.y0 - EPS && py <= b.y1 + EPS;
  const groundOpenings = [
    ...plan.doors.filter(d => d[5] !== 'open')
      .map(d => [d[1], d[2], d[3], d[4], openingFloor(plan, L, d[1], d[2], d[3], d[4])]),
    ...plan.gates.map(g => [g[0], g[1], g[2], g[3], 0]),
  ].filter(o => o[4] < 0.05);
  const inOpening = (x, z) => groundOpenings.some(([ax, pos, a, b]) => ax === 'h'
    ? Math.abs(z - pos) < 0.2 && x > a - EPS && x < b + EPS
    : Math.abs(x - pos) < 0.2 && z > a - EPS && z < b + EPS);
  const gaps = new Set();
  for (const [ax, pos, a, b, t] of plan.walls)
    for (const end of [a, b]) {
      const perp = plan.walls.filter(([pax, ppos, pa, pb]) =>
        pax !== ax && Math.abs(ppos - end) < EPS && pa <= pos + EPS && pb >= pos - EPS);
      if (!perp.length) continue;
      const half = Math.max(...perp.map(w => w[4])) / 2, k = 0.01;
      for (const da of [-half + k, half - k]) for (const dc of [-t / 2 + k, t / 2 - k]) {
        const x = ax === 'h' ? end + da : pos + dc, z = ax === 'h' ? pos + dc : end + da;
        if (inOpening(x, z)) continue;
        if (!wallBoxes.some(bx => covers(bx, x, 0.05, z))) gaps.add(`x ${n(ax === 'h' ? end : pos)}, z ${n(ax === 'h' ? pos : end)}`);
      }
    }
  if (gaps.size) e.push(`góc tường khuyết ở ${[...gaps].slice(0, 4).join('; ')}${gaps.size > 4 ? ` … (${gaps.size} góc)` : ''}`);

  /* 12 — mái nhẹ. Hai chuyện dễ sai khi kéo thanh trượt hay chỉnh cao độ mái:
     a) hai mái gặp nhau ngang cốt — nước mái trên đổ thẳng vào mép mái dưới, không có chỗ đặt
        máng xối. Mái bàn trà và mái sân phơi đều phải gá **thấp hẳn** dưới mép mái bếp.
     b) mái tụt xuống dưới đầu một lỗ mở nó phủ — bịt mất cửa. */
  const panels = m.prisms.filter(p => p.kind === 'metalRoof');
  const sideBySide = (a, b) => {
    const dx = Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w));
    const dz = Math.max(a.z - (b.z + b.d), b.z - (a.z + a.d));
    return dx < 0.2 && dz < 0.2 && (dx > -EPS || dz > -EPS);
  };
  for (let i = 0; i < panels.length; i++)
    for (let j = i + 1; j < panels.length; j++) {
      const a = panels[i], b = panels[j];
      if (a.id === b.id || !sideBySide(a, b)) continue;
      const lo = Math.max(...a.yt), hi = Math.min(...b.yb);
      const lo2 = Math.max(...b.yt), hi2 = Math.min(...a.yb);
      if (!(lo < hi - EPS || lo2 < hi2 - EPS))
        e.push(`mái ${a.id} và ${b.id} gặp nhau ngang cốt — không mái nào gá thấp hẳn dưới mái kia`);
    }
  const heads = [
    ...plan.doors.filter(d => d[5] !== 'open')
      .map(d => ({ id: d[0], ax: d[1], pos: d[2], a: d[3], b: d[4],
                   head: base(d) + ((H.only[d[0]] || {}).door ?? H.door) })),
    ...plan.windows
      .map(w => ({ id: w[0], ax: w[1], pos: w[2], a: w[3], b: w[4],
                   head: base(w) + ((H.only[w[0]] || {}).head ?? H.head) })),
  ];
  for (const o of heads) {
    const mid = (o.a + o.b) / 2;
    const px = o.ax === 'h' ? mid : o.pos, pz = o.ax === 'h' ? o.pos : mid;
    for (const p of panels) {
      if (px < p.x - EPS || px > p.x + p.w + EPS || pz < p.z - EPS || pz > p.z + p.d + EPS) continue;
      const [under] = spanAt(p, p.axis === 'x' ? px : pz);
      if (under < o.head - EPS)
        e.push(`mái ${p.id} ở cốt ${n(under)} thấp hơn đầu ${o.id} (${n(o.head)})`);
    }
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
