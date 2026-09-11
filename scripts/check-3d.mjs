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
  'Mái nhẹ kề nhau thì nối liền mạch cùng cao độ hoặc gá thấp hẳn bên dưới, và không hạ xuống dưới đầu lỗ mở nào nó phủ',
  'Mép thấp nào của mái nhẹ không chảy tiếp hay rơi xuống mái khác cũng có máng, mỗi dải máng có ống xả xuống ống ngầm',
  'Tường rào có lan can: phần xây không vượt cốt xây đặc, lan can nằm gọn giữa cốt xây đặc và đỉnh rào, trên tuyến tường có thật',
  'Trần giả dựng đúng cốt khai, dưới bản mái, và cao hơn đầu mọi cửa, cửa sổ trên tường phòng ấy',
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

  /* Cửa và cổng chọc thêm một điểm sát đỉnh lối đi (đầu cửa, nhưng không quá đỉnh rào): lan can trên
     tường rào thấp phải chừa trống cả chiều cao lối đi, không chỉ phần xây. */
  const base = o => openingFloor(plan, L, o[1], o[2], o[3], o[4]);
  const upper = head => Math.min(head, L.fenceTop) - 0.05;
  const holes = [
    ...plan.doors.filter(d => d[5] !== 'open')
      .map(d => ({ id: d[0], ax: d[1], pos: d[2], a: d[3], b: d[4],
                   ys: [base(d) + 0.05, upper(base(d) + ((H.only[d[0]] || {}).door ?? H.door))] })),
    ...plan.windows
      .map(w => ({ id: w[0], ax: w[1], pos: w[2], a: w[3], b: w[4],
                   ys: [base(w) + ((H.only[w[0]] || {}).sill ?? H.sill) + 0.05] })),
    ...plan.gates
      .map(g => ({ id: g[4] || 'cổng', ax: g[0], pos: g[1], a: g[2], b: g[3], ys: [0.05, upper(Infinity)] })),
  ];
  const blockers = m.boxes.filter(b => /Wall$/.test(b.kind) || b.kind === 'railing');

  for (const o of holes) {
    const mid = (o.a + o.b) / 2;
    const px = o.ax === 'h' ? mid : o.pos;
    const pz = o.ax === 'h' ? o.pos : mid;
    for (const y of o.ys) {
      const hit = blockers.find(b => inside(b, px, y, pz));
      if (hit) { e.push(`${o.id} bị mảnh ${hit.kind} bịt tại cao độ ${n(y)}`); break; }
    }
    /* Lan can là song mảnh: chọc một điểm dễ lọt khe giữa hai song. Nên với cửa và cổng soi cả bề ngang
       lối đi — không thanh nào được nằm trên đường tim ấy, chồng vào [a, b], trong chiều cao lối đi. */
    if (o.ys.length < 2) continue;
    const [y0, y1] = [o.ys[0] - 0.05, o.ys[1] + 0.05];
    const rail = m.boxes.find(b => b.kind === 'railing' && (o.ax === 'h'
        ? o.pos >= b.z - EPS && o.pos <= b.z + b.d + EPS && overlap(b.x, b.x + b.w, o.a, o.b) > EPS
        : o.pos >= b.x - EPS && o.pos <= b.x + b.w + EPS && overlap(b.z, b.z + b.d, o.a, o.b) > EPS)
      && overlap(b.y0, b.y1, y0, y1) > EPS);
    if (rail) e.push(`${o.id} bị lan can chắn lối, cao ${n(rail.y0)}–${n(rail.y1)}`);
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
     a) hai mái kề nhau lệch cốt **một chút** — mái trên chưa đủ cao để đặt máng xối dưới mép nó,
        mà cũng không nối phẳng được với mái dưới: nước đổ thẳng vào khe. Chỉ hai cách là đúng: nối
        **liền mạch** (cùng cao độ suốt mép chung — mái hành lang ngoài vào mái sân chính, sân phơi)
        hoặc gá **thấp hẳn** bên dưới (mái sân chính, sân phơi dưới mép mái bếp). Soi từng điểm dọc
        mép chung chứ không so cao độ cả tấm: mái dốc thì cả tấm cao thấp đủ kiểu.
     b) mái tụt xuống dưới đầu một lỗ mở nó phủ — bịt mất cửa. */
  const panels = m.prisms.filter(p => p.kind === 'metalRoof');
  const gapOf = (a0, a1, b0, b1) => Math.max(a0 - b1, b0 - a1);
  for (let i = 0; i < panels.length; i++)
    for (let j = i + 1; j < panels.length; j++) {
      const a = panels[i], b = panels[j];
      if (a.id === b.id) continue;
      /* Mép chung: sát nhau (hở dưới 0.2 m) theo một trục, chồng lên nhau dọc trục kia. */
      const dx = gapOf(a.x, a.x + a.w, b.x, b.x + b.w), dz = gapOf(a.z, a.z + a.d, b.z, b.z + b.d);
      const alongX = dz > -EPS && dz < 0.2 && -dx > EPS, alongZ = dx > -EPS && dx < 0.2 && -dz > EPS;
      /* Chồng lên nhau trên mặt bằng (mái bếp đua ra trên mái sân chính): khắp phần chồng, một mái
         phải nằm hẳn dưới mái kia. */
      if (dx < -EPS && dz < -EPS) {
        const kinds = new Set();
        const [x0, x1] = [Math.max(a.x, b.x), Math.min(a.x + a.w, b.x + b.w)];
        const [z0, z1] = [Math.max(a.z, b.z), Math.min(a.z + a.d, b.z + b.d)];
        for (let k = 0; k <= 10; k++) for (let l = 0; l <= 10; l++) {
          const x = x0 + (x1 - x0) * k / 10, z = z0 + (z1 - z0) * l / 10;
          const [al, ah] = spanAt(a, a.axis === 'x' ? x : z), [bl, bh] = spanAt(b, b.axis === 'x' ? x : z);
          kinds.add(ah < bl - EPS ? 'aBelow' : bh < al - EPS ? 'bBelow' : 'bad');
        }
        if (kinds.size > 1 || kinds.has('bad'))
          e.push(`mái ${a.id} và ${b.id} chồng nhau trên mặt bằng mà không mái nào nằm hẳn dưới mái kia`);
        continue;
      }
      if (!alongX && !alongZ) continue;
      const [s, t] = alongX ? [Math.max(a.x, b.x), Math.min(a.x + a.w, b.x + b.w)]
                            : [Math.max(a.z, b.z), Math.min(a.z + a.d, b.z + b.d)];
      /* Toạ độ mép của mỗi tấm quay về phía tấm kia. */
      const [ea, eb] = alongX ? (a.z < b.z ? [a.z + a.d, b.z] : [a.z, b.z + b.d])
                              : (a.x < b.x ? [a.x + a.w, b.x] : [a.x, b.x + b.w]);
      const at = (p, u, c) => spanAt(p, p.axis === 'x' ? (alongX ? u : c) : (alongX ? c : u));
      const kinds = new Set();
      for (let k = 0; k <= 20; k++) {
        const u = s + (t - s) * k / 20;
        const [al, ah] = at(a, u, ea), [bl, bh] = at(b, u, eb);
        kinds.add(Math.abs(al - bl) < 1e-3 ? 'flush' : ah < bl - EPS ? 'aBelow' : bh < al - EPS ? 'bBelow' : 'bad');
      }
      if (kinds.size > 1 || kinds.has('bad'))
        e.push(`mái ${a.id} và ${b.id} kề nhau mà không nối phẳng, cũng không mái nào gá thấp hẳn dưới mái kia`);
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

  /* 13 — máng xối và ống xả. Soi trên khối đã dựng, không gọi lại gutters(): dọc mép thấp của từng
     tấm mái, mỗi điểm phải hoặc là chỗ cắt bên trong cùng một mái (tấm cùng mã nằm kề), hoặc chảy
     tiếp sang mái khác cùng cao độ, hoặc rơi xuống một mái thấp hơn ngay bên dưới, hoặc có hộp máng
     phủ đường mép với miệng ngang mặt dưới mái. */
  const gutterBoxes = m.boxes.filter(b => b.kind === 'gutter');
  const inPlan = (q, x, z) => x > q.x + EPS && x < q.x + q.w - EPS && z > q.z + EPS && z < q.z + q.d - EPS;
  for (const p of panels) {
    if (!p.axis || Math.abs(p.yb[1] - p.yb[0]) < EPS) continue;
    const far = p.yb[1] < p.yb[0], h = Math.min(...p.yb), out = far ? 1 : -1;
    const along = p.axis === 'z' ? 'x' : 'z';
    const c = p.axis === 'z' ? (far ? p.z + p.d : p.z) : (far ? p.x + p.w : p.x);
    const [a, b] = along === 'x' ? [p.x, p.x + p.w] : [p.z, p.z + p.d];
    /* q nằm phía `side` của đường mép (+1 = phía toạ độ lớn) và phủ điểm u dọc mép. */
    const meets = (q, u, side) => {
      const [n0, n1, qa, qb] = along === 'x' ? [q.z, q.z + q.d, q.x, q.x + q.w] : [q.x, q.x + q.w, q.z, q.z + q.d];
      return u > qa - EPS && u < qb + EPS && Math.abs((side > 0 ? n0 : n1) - c) < 1e-6;
    };
    for (let k = 0; k < 9; k++) {
      const u = a + (b - a) * (k + 0.5) / 9;
      const pt = along === 'x' ? [u, c] : [c, u];
      const drop = along === 'x' ? [u, c + out * 0.01] : [c + out * 0.01, u];
      const covers = g => {
        const [n0, n1, ga, gb] = along === 'x' ? [g.z, g.z + g.d, g.x, g.x + g.w] : [g.x, g.x + g.w, g.z, g.z + g.d];
        return u > ga - EPS && u < gb + EPS && c > n0 - EPS && c < n1 + EPS;
      };
      const ok = panels.some(q => q !== p && meets(q, u, out) &&
                   (q.id === p.id || Math.abs(spanAt(q, q.axis === 'x' ? pt[0] : pt[1])[0] - h) < 1e-3))
              || panels.some(q => q.id !== p.id && inPlan(q, ...drop)
                   && spanAt(q, q.axis === 'x' ? drop[0] : drop[1])[1] < h - EPS)
              || gutterBoxes.some(g => covers(g) && Math.abs(g.y1 - h) < 1e-3);
      if (!ok) {
        e.push(`mép thấp mái ${p.id} ở ${along === 'x' ? 'z' : 'x'} ${n(c)} không có máng xối quanh ${along} ${n(u)}`);
        break;
      }
    }
  }
  /* Mỗi dải máng (hộp máng cùng mái nối đầu nhau) phải có một ống xả: đỉnh ống áp đáy một hộp máng
     của dải, nằm lọt dưới hộp ấy, và cắm xuống dưới cốt sân. */
  const pipes = m.boxes.filter(b => b.kind === 'downpipe');
  const runs = [];
  for (const g of gutterBoxes) {
    const joined = runs.filter(r => r.some(o => o.id === g.id && overlap(o.x - EPS, o.x + o.w + EPS, g.x, g.x + g.w) > 0
                                                              && overlap(o.z - EPS, o.z + o.d + EPS, g.z, g.z + g.d) > 0));
    const merged = [g, ...joined.flat()];
    for (const r of joined) runs.splice(runs.indexOf(r), 1);
    runs.push(merged);
  }
  for (const r of runs) {
    const ok = pipes.some(p => p.y0 < -EPS && r.some(g => Math.abs(p.y1 - g.y0) < 1e-3
      && p.x >= g.x - EPS && p.x + p.w <= g.x + g.w + EPS && p.z >= g.z - EPS && p.z + p.d <= g.z + g.d + EPS));
    if (!ok) e.push(`dải máng mái ${r[0].id} quanh x ${n(r[0].x)}, z ${n(r[0].z)} không có ống xả xuống ống ngầm`);
  }

  /* 14 — tường rào có lan can. Mặt bằng không khai `fenceSolid` thì không được có lan can nào. Có
     khai thì: không mảnh tường rào nào cao quá cốt xây đặc; mỗi thanh lan can nằm gọn trong khoảng
     cốt xây đặc → đỉnh rào và có tâm nằm trên đường tim một bức tường khai trong `walls`. */
  const railBoxes = m.boxes.filter(b => b.kind === 'railing');
  if (H.fenceSolid == null) {
    if (railBoxes.length) e.push(`mặt bằng không khai fenceSolid mà có ${railBoxes.length} thanh lan can`);
  } else {
    const tall = m.boxes.find(b => b.kind === 'fenceWall' && b.y1 > H.fenceSolid + EPS);
    if (tall) e.push(`tường rào quanh x ${n(tall.x)}, z ${n(tall.z)} xây tới ${n(tall.y1)}, quá cốt xây đặc ${n(H.fenceSolid)}`);
    /* Chạm đường tim chứ không đòi tâm nằm đúng trên tim: ở góc hai tuyến lan can, thanh bị cắt còn
       mẩu lệch nửa bề dày — vẫn là lan can của bức tường ấy. */
    const onWall = b => plan.walls.some(([ax, pos, a, c]) => ax === 'h'
      ? pos >= b.z - EPS && pos <= b.z + b.d + EPS && b.x >= a - 0.2 && b.x + b.w <= c + 0.2
      : pos >= b.x - EPS && pos <= b.x + b.w + EPS && b.z >= a - 0.2 && b.z + b.d <= c + 0.2);
    const stray = railBoxes.find(b => b.y0 < H.fenceSolid - EPS || b.y1 > L.fenceTop + EPS || !onWall(b));
    if (stray) e.push(`thanh lan can lạc chỗ quanh x ${n(stray.x)}, z ${n(stray.z)}, cao ${n(stray.y0)}–${n(stray.y1)}`);
  }

  /* 15 — trần giả. Tra thẳng từ số khai và danh sách lỗ mở, không gọi dropCeilingsOf(): phòng khai
     trần giả phải có đúng một tấm nằm trong phòng ở cốt sàn + cao khai, dưới mặt dưới bản mái, và
     không lỗ mở nào trên bốn tường của phòng cao quá mặt dưới tấm — hạ trần mà quên cửa là trần cắt
     ngang cửa. */
  for (const [id, h] of Object.entries(plan.dropCeilings || {})) {
    const r = plan.rooms.find(x => x[0] === id);
    if (!r) continue;                                   // validate() đã báo
    const [, , rx, ry, rw, rh] = r;
    const y = (plan.floorLevels?.[id] ?? H.floor) + h;
    const tiles = m.boxes.filter(b => b.kind === 'dropCeiling'
      && b.x >= rx - EPS && b.x + b.w <= rx + rw + EPS && b.z >= ry - EPS && b.z + b.d <= ry + rh + EPS);
    if (tiles.length !== 1 || Math.abs(tiles[0].y0 - y) > EPS) {
      e.push(`trần giả ${id} phải có một tấm ở cốt ${n(y)}, dựng ${tiles.map(b => n(b.y0)).join(', ') || 'không có'}`);
      continue;
    }
    if (tiles[0].y1 > L.ceiling + EPS) e.push(`trần giả ${id} đâm vào bản mái (${n(tiles[0].y1)} > ${n(L.ceiling)})`);
    const onRoom = ([ax, pos, a, b]) => ax === 'h'
      ? (Math.abs(pos - ry) < EPS || Math.abs(pos - ry - rh) < EPS) && a < rx + rw && b > rx
      : (Math.abs(pos - rx) < EPS || Math.abs(pos - rx - rw) < EPS) && b > ry && a < ry + rh;
    for (const o of heads.filter(o => onRoom([o.ax, o.pos, o.a, o.b])))
      if (o.head > y + EPS) e.push(`đầu ${o.id} (${n(o.head)}) cao hơn trần giả ${id} (${n(y)})`);
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
