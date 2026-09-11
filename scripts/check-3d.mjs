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
import { COLORS, GLASS_KINDS, ROOF_KINDS } from '../components/palette.js';
import { LOT, STEP, ROOF, ROOF_INSULATION, POST, BEAM, PURLIN, RAILING, FURNITURE, STAIR, TUM, TANK, RACK, ROOF_RAILING, heightsOf } from '../lib/lot.js';
import { buildMassing, levels } from '../lib/massing.js';
import { openingFloor, stepsOf, lightRoofs, roofOver, clearRect, roomsAlong, floorOf, wallThickness, purlinsOf,
         stairsOf, tumOf, roofHoles, roofWalkTop, roofRailingsOf, tanksOf, racksOf, solidFencesOf, gateRoofsOf } from '../lib/envelope.js';
import { WALK, walkSolids, supportAt, stepWalk } from '../lib/walk.js';

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
  'Đi bộ: qua được mọi cửa và cổng cả hai chiều, tới nơi đứng đúng cốt sàn phòng bên kia; không đi xuyên được tường nhà',
  'Nội thất: khối của mỗi món nằm gọn trong chỗ khai và phủ gần trọn nó, chân chạm sàn phòng chứa nó, thấp hơn trần. Cánh cửa: cửa quay 1 cánh, cửa 4 cánh 4 cánh, áp mép lỗ, đứng phía mở, cao đúng đầu cửa',
  'Cột đỡ mái nhẹ: mỗi cột một khối đúng chỗ khai, chân chạm sân, đỉnh chạm mặt dưới mái hoặc đáy máng; mọi mép mái nhẹ có tường cao tới mái hoặc cột đỡ, không nhịp nào quá POST.maxSpan, không hẫng ở đầu mép; đoạn mép không tựa tường có dầm, dầm chạm mái hoặc máng, hai đầu gối lên tường, cột hay dầm khác',
  'Xà gồ mái nhẹ: mỗi thanh đúng vị trí suy ra, mặt trên chạm tấm tôn, hai đầu tựa tường hoặc dầm, nhịp và bước không vượt giới hạn thiết kế',
  'Lớp chống nóng mái: chỉ có khi mặt bằng khai; nằm ngay trên mặt bản mái, dày đúng cấu tạo; phủ kín mọi bản mái bê tông và mái đổ ra ngoài được khai, trừ chỗ khối nhô cao hơn mái; không phủ giếng trời, không lát ra chỗ không có bản mái hay đỉnh tường nhà bên dưới',
  'Giàn phơi: đủ hai trụ, bốn tay chìa và hai thanh phơi; trụ đứng trên cốt sân, tay chìa nối đầu trụ lên ngọn, hai thanh chạy suốt tuyến và lệch đều hai bên đúng tầm chìa — mặt cắt đúng hình tam giác ngược',
  'Bồn nước trên mái: đủ khối thân, chân, bản đế và hai thanh kiềng; chân đứng đúng mặt mái, kiềng bắc ngang trục đỡ đúng đường tim đáy trụ (không thì bồn treo lơ lửng); bản đế đủ rộng để áp lực xuống lớp chống nóng không quá sức XPS; thân đúng đường kính và nằm gọn trong hình chiếu khai',
  'Màu và nhóm ẩn mái: mọi loại khối massing.js sinh ra đều có màu khai trong components/palette.js (thiếu thì âm thầm tô màu tường), và mọi khối đứng từ cốt mặt mái trở lên đều nằm trong nhóm bị nút "Ẩn mái" giấu',
  'Cầu thang lên mái: đủ khối, bậc đều và không cao quá giới hạn, bậc trên cùng lên đúng mặt mái; đi bộ từ chân thang lên mái, ra vào qua từng cửa tum rồi xuống lại không vướng; đủ khoảng đầu trên mọi mặt bậc; hai mép trong giáp khe giữa hai vế có tay vịn chạy hết vế và trụ ở đầu khe; tum trùm kín lỗ thang; lan can mái đứng trên mặt mái',
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
    /* Mái cổng có nửa mái chìa qua ranh y = 0 ra phía đường; đó là chủ ý của cấu tạo,
       không phải khối nhà lấn lô. Còn mọi khối khác vẫn giữ giới hạn nửa dày tường. */
    if (b.kind === 'gateRoofTile' || b.kind === 'gatePillar' || b.kind === 'gateCap') continue;
    if (b.x < -out - EPS || b.x + b.w > LOT.w + out + EPS
     || b.z < -out - EPS || b.z + b.d > LOT.d + out + EPS)
      e.push(`hộp ${b.kind} thò ra ngoài lô: x ${n(b.x)}…${n(b.x + b.w)}, z ${n(b.z)}…${n(b.z + b.d)}`);
  }

  /* 3 — cao quá đỉnh thiết kế. Không còn là đỉnh mái nhà: nóc mái tôn bếp cố ý nhô cao hơn mặt
     mái bê tông. Mốc suy từ **số khai** (đỉnh mái nhà, nóc mái nhẹ cao nhất cộng bề dày tấm lợp)
     chứ không lấy từ khối đã dựng — lấy từ khối dựng thì phép kiểm tự nói đúng mọi lúc. */
  const insulationT = ROOF_INSULATION.xps + ROOF_INSULATION.paver;
  /* Tum và lan can mái đứng trên mặt mái: cộng từ số khai (TUM, ROOF_RAILING), không từ khối. */
  const walkTop = L.houseTop + (plan.roofInsulation ? insulationT : 0);
  const design = Math.max(walkTop, ...lightRoofs(plan).map(r => r.high + ROOF.sheet),
                          ...gateRoofsOf(plan).filter(r => !r.error).map(r => r.ridge + r.tile),
                          plan.tum ? walkTop + TUM.clear + ROOF.sheet : 0,
                          plan.roofRailings?.length ? walkTop + ROOF_RAILING.height : 0);
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
  const blockers = m.boxes.filter(b => /Wall$/.test(b.kind) || b.kind === 'railing' || b.kind === 'doorLeaf');

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
  /* Cửa sổ cánh lật (`hopper`): đúng một tấm kính nghiêng, chân ở bệ, đỉnh ở mép trên lỗ, phủ đủ bề ngang lỗ, nằm phía
     khai và ngả đúng độ mở tính từ mặt tường. */
  for (const [id, ax, pos, a, b] of plan.windows) {
    const hop = (H.only[id] || {}).hopper;
    if (!hop) continue;
    const sashes = m.prisms.filter(p => p.kind === 'sash' && p.id === id);
    if (sashes.length !== 1) { e.push(`${id} cánh lật: ${sashes.length} tấm, phải 1`); continue; }
    const s = sashes[0], t = wallThickness(plan, ax, pos, a, b), face = pos + Math.sign(hop) * t / 2;
    const sill = base([id, ax, pos, a, b]) + (H.only[id].sill ?? H.sill), head = base([id, ax, pos, a, b]) + (H.only[id].head ?? H.head);
    const [u0, u1, n0, n1] = ax === 'h' ? [s.x, s.x + s.w, s.z, s.z + s.d] : [s.z, s.z + s.d, s.x, s.x + s.w];
    const nearFace = hop > 0 ? n0 : n1, farEdge = hop > 0 ? n1 : n0;
    if (Math.abs(u0 - a) > EPS || Math.abs(u1 - b) > EPS || Math.abs(nearFace - face) > EPS || Math.abs(farEdge - face - hop) > EPS
        || Math.abs(Math.min(...s.yb) - sill) > EPS || Math.abs(Math.max(...s.yt) - head) > EPS)
      e.push(`${id} cánh lật dựng lệch lỗ, mặt tường hoặc độ mở`);
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
    /* Lỗ khoét: giếng trời và lỗ cầu thang lên mái. */
    for (const { x: sx, y: sy, w: sw, h: sh } of roofHoles(plan))
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
  /* Đồ đạc và cánh cửa chạm nhau (cánh quét vào tủ, hai món kê sát) là chuyện bố trí trên mặt bằng —
     validate() đã soi, và kho đối chiếu còn lỗi loại đó là bình thường. Ở đây chỉ đòi chúng không đâm
     vào phần xây. */
  const movable = b => b.kind === 'furniture' || b.kind === 'doorLeaf';
  let clashes = 0;
  for (let i = 0; i < solid.length; i++)
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i], b = solid[j];
      if (movable(a) && movable(b)) continue;
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
  /* Máng dừng ở mặt dầm biên dọc tường bao (lib/envelope.js): mươi phân tôn đua qua dầm ra trên đỉnh tường bao
     không có máng. Điểm soi nằm trên dầm, hoặc quá mặt dầm không tới 0.1 m dọc mép, thì cho qua. */
  const beamsAll = [...m.boxes.filter(b => b.kind === 'beam'), ...m.prisms.filter(p => p.kind === 'beam')];
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
              || gutterBoxes.some(g => covers(g) && Math.abs(g.y1 - h) < 1e-3)
              || beamsAll.some(q => along === 'x'
                   ? u > q.x - 0.1 && u < q.x + q.w + 0.1 && c > q.z - 0.01 && c < q.z + q.d + 0.01
                   : u > q.z - 0.1 && u < q.z + q.d + 0.1 && c > q.x - 0.01 && c < q.x + q.w + 0.01);
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
     cốt xây đặc → đỉnh rào và có tâm nằm trên đường tim một bức tường khai trong `walls`.
     Ngoại lệ là đoạn khai `solidFences`: xây kín tới `fencePrivate`, và **không được có thanh lan can
     nào** trên đoạn ấy — khai kín để riêng tư mà vẫn dựng lan can là hỏng đúng mục đích. */
  const railBoxes = m.boxes.filter(b => b.kind === 'railing');
  /* Tâm khối phải nằm sát đúng đường tim đoạn khai (trong 0.06, tức lọt hẳn trong lõi bức tường 220):
     lấy rộng hơn là vơ luôn thanh lan can **của tuyến vuông góc** đứng ở góc, sát mặt trong bức rào kín —
     thanh ấy là của cạnh bên, hợp lệ. */
  const onPriv = b => (plan.solidFences || []).some(([ax, pos, a, c]) => {
    const [mid, s0, s1] = ax === 'h' ? [b.z + b.d / 2, b.x, b.x + b.w] : [b.x + b.w / 2, b.z, b.z + b.d];
    return Math.abs(mid - pos) < 0.06 && s1 > a - 0.12 && s0 < c + 0.12;
  });
  const privRail = railBoxes.find(onPriv);
  if (privRail) e.push(`đoạn rào khai xây kín vẫn có thanh lan can quanh x ${n(privRail.x)}, z ${n(privRail.z)}`);
  /* Mỗi đoạn một đỉnh riêng: mảnh rào trên đoạn nào phải cao đúng đỉnh đoạn ấy — không thấp hơn (hụt kín)
     cũng không cao hơn. So với chính đỉnh khai, không so với một số chung. */
  for (const f of solidFencesOf(plan)) {
    const mine = m.boxes.filter(b => b.kind === 'fenceWall' && (f.ax === 'h'
      ? Math.abs(b.z + b.d / 2 - f.pos) < 0.06 && b.x + b.w > f.a + EPS && b.x < f.b - EPS
      : Math.abs(b.x + b.w / 2 - f.pos) < 0.06 && b.z + b.d > f.a + EPS && b.z < f.b - EPS));
    if (!mine.length) { e.push(`đoạn rào xây kín trục ${f.ax} ${n(f.pos)} (${n(f.a)}–${n(f.b)}) không dựng mảnh tường nào`); continue; }
    const bad = mine.find(b => Math.abs(b.y1 - f.top) > EPS && b.y1 < f.top - EPS);
    const over = mine.find(b => b.y1 > f.top + EPS);
    if (over) e.push(`đoạn rào xây kín trục ${f.ax} ${n(f.pos)} có mảnh cao ${n(over.y1)}, quá đỉnh khai ${n(f.top)}`);
    else if (bad) e.push(`đoạn rào xây kín trục ${f.ax} ${n(f.pos)} có mảnh chỉ cao ${n(bad.y1)}, hụt đỉnh khai ${n(f.top)}`);
  }
  if (H.fenceSolid == null) {
    if (railBoxes.length) e.push(`mặt bằng không khai fenceSolid mà có ${railBoxes.length} thanh lan can`);
  } else {
    const tall = m.boxes.find(b => b.kind === 'fenceWall' && !onPriv(b) && b.y1 > H.fenceSolid + EPS);
    if (tall) e.push(`tường rào quanh x ${n(tall.x)}, z ${n(tall.z)} xây tới ${n(tall.y1)}, quá cốt xây đặc ${n(H.fenceSolid)}`);
    /* Chạm đường tim chứ không đòi tâm nằm đúng trên tim: ở góc hai tuyến lan can, thanh bị cắt còn
       mẩu lệch nửa bề dày — vẫn là lan can của bức tường ấy. */
    const onWall = b => plan.walls.some(([ax, pos, a, c]) => ax === 'h'
      ? pos >= b.z - EPS && pos <= b.z + b.d + EPS && b.x >= a - 0.2 && b.x + b.w <= c + 0.2
      : pos >= b.x - EPS && pos <= b.x + b.w + EPS && b.z >= a - 0.2 && b.z + b.d <= c + 0.2);
    const stray = railBoxes.find(b => !onPriv(b) && (b.y0 < H.fenceSolid - EPS || b.y1 > L.fenceTop + EPS || !onWall(b)));
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

  /* 16 — đi bộ, bằng đúng lib/walk.js mà trang 3D dùng. Mỗi cửa và cổng: đứng trước lỗ phía này, đi
     thẳng vuông góc qua tâm lỗ sang phía kia — không được vướng, và tới nơi phải đứng đúng cốt sàn
     phòng bên kia (bậc thiếu, bậc cao quá một nấc, ngưỡng sai cốt đều lộ ở đây). Điểm đứng cách mặt
     tường vừa đủ qua khỏi bậc và tầm vai — soi **lối cửa**, không soi cả căn phòng: đi sâu 1.2 m vào
     phòng thì vướng giường, bàn trà, mà đó không phải lỗi. Đồ kê chắn ngay trước cửa thì vẫn báo. Chiều đi lên chỉ đòi
     khi cửa có bậc hoặc chênh không quá một nấc: kho đối chiếu chưa có bậc thì sàn nhà cao 0.45 là
     không trèo được, đúng như thật. Phía ngoài cổng là ngõ, ngang cốt sân.
     Cửa 'open' là chỗ không có tường (như phép 5): chỉ đi thử khi đúng là không khai tường ở đó — v2…v4
     có lối 'open' nằm trên một tường khai suốt, massing.js dựng tường ấy kín, dữ liệu kho đối chiếu.
     Rồi chiều ngược lại: đi thẳng vào giữa từng mảnh tường nhà cao suốt — phải bị chặn trước tim. */
  /* Chỉ phần xây. Trong trang 3D người đi bộ vẫn vướng đồ đạc và cánh cửa, nhưng chúng chắn lối là chuyện
     bố trí trên mặt bằng (validate() soi vùng quét cánh) — tủ đầu giường master lấn 0.3 m trước cửa lùa
     D7 vẫn lách qua được, cánh cửa mở hết chắn hành lang 0.9 m ở kho đối chiếu là đúng như thật. */
  const solids = walkSolids(m).filter(s => s.kind !== 'furniture' && s.kind !== 'doorLeaf');
  const stepList = stepsOf(plan).filter(s => !s.error);
  const withSteps = new Set(stepList.map(s => s.id));
  const passages = [
    ...plan.doors.filter(d => d[5] !== 'open' || !wallThickness(plan, d[1], d[2], d[3], d[4]))
      .map(d => ({ id: d[0], ax: d[1], pos: d[2], a: d[3], b: d[4] })),
    ...plan.gates.map(g => ({ id: g[4] || 'cổng', ax: g[0], pos: g[1], a: g[2], b: g[3] })),
  ];
  const at = (o, u, c) => (o.ax === 'h' ? [u, c] : [c, u]);
  for (const o of passages) {
    const mid = (o.a + o.b) / 2;
    const half = wallThickness(plan, o.ax, o.pos, o.a, o.b) / 2;
    /* Mỗi phía: cốt sàn, và điểm đứng — qua khỏi mặt tường, bậc phía ấy và tầm vai, nhưng không chạm
       tường đối diện. */
    const side = dir => {
      const r = roomsAlong(plan.rooms, o.ax, o.pos, o.a, o.b)
        .find(r => (Math.abs((o.ax === 'h' ? r[3] : r[2]) - o.pos) < EPS ? 1 : -1) === dir);
      const depth = r ? (o.ax === 'h' ? r[5] : r[4]) - 0.11 - WALK.radius - 0.02 : 1.2;
      const st = stepList.find(s => s.id === o.id && s.dir === dir);
      const want = half + (st ? st.depth : 0) + WALK.radius + 0.15;
      return { level: r ? floorOf(plan, r, H.floor) : 0, c: o.pos + dir * Math.min(want, depth) };
    };
    const sides = { [-1]: side(-1), [1]: side(1) };
    /* Thử **cả bề ngang lỗ**, không chỉ tim lỗ: lỗ rộng thì tim lỗ không nhất thiết là lối đi — D4 là cả
       cạnh hở của buồng thang, tim lỗ rơi đúng khe giữa hai vế, chỗ có tay vịn, còn người thì đi trên vế.

       Nhưng "có **một** lối nào đó qua được" thì quá lỏng: nửa cửa bị bịt cũng lọt. Luật: qua được nếu
       **tim lỗ thông** (cửa thường chỉ có một lối, đúng như cũ), **hoặc** có một **dải liền** rộng ít nhất
       MIN_PASS đi qua được ở chỗ khác (lỗ rộng thì lối lệch tim vẫn là lối thật). Nửa cửa 0.9 m bị bịt cho
       dải liền chừng 0.2 m — dưới ngưỡng, vẫn báo. Bề ngang lấy theo tim người, đã trừ tầm vai hai bên. */
    const MIN_PASS = 0.30, STEP_U = 0.05;
    const lo = o.a + WALK.radius, hi = o.b - WALK.radius;
    const lines = hi <= lo + EPS ? []
      : Array.from({ length: Math.floor((hi - lo) / STEP_U) + 1 }, (_, i) => lo + i * STEP_U);
    for (const dir of [-1, 1]) {
      const from = sides[-dir], to = sides[dir];
      if (to.level - from.level > WALK.climb + EPS && !withSteps.has(o.id)) continue;
      const tryLine = u => {
        const [x0, z0] = at(o, u, from.c), [x1, z1] = at(o, u, to.c);
        const start = { x: x0, z: z0, foot: supportAt(solids, x0, z0, from.level) };
        const r = stepWalk(solids, start, x1 - x0, z1 - z0);
        return { r, why: r.hit || Math.hypot(r.x - x1, r.z - z1) > 1e-3 ? 'block'
                      : Math.abs(r.foot - to.level) > EPS ? 'level' : null };
      };
      const centre = tryLine(mid);
      if (!centre.why) continue;
      let run = 0, best = 0;
      for (const u of lines) {
        if (tryLine(u).why) run = 0; else { run += STEP_U; best = Math.max(best, run); }
        if (best >= MIN_PASS - EPS) break;
      }
      if (best >= MIN_PASS - EPS) continue;
      const { r, why } = centre, arrow = `${o.id} ${dir > 0 ? '→' : '←'}`;
      if (why === 'block')
        e.push(`đi bộ ${arrow} vướng ${r.hit?.kind ?? '?'} ở ${o.ax === 'h' ? 'z' : 'x'} ${n(o.ax === 'h' ? r.z : r.x)} (cửa ở ${o.pos}, mặt tường ±${half})`);
      else
        e.push(`đi bộ ${arrow} tới nơi đứng ở cốt ${n(r.foot)}, sàn bên kia ${n(to.level)}`);
    }
  }
  for (const b of m.boxes.filter(b => b.kind === 'houseWall' && b.y0 < EPS && b.y1 > WALK.body + 1)) {
    const alongX = b.w > b.d, len = alongX ? b.w : b.d;
    if (len < 2 * WALK.radius + 0.2) continue;
    const pos = alongX ? b.z + b.d / 2 : b.x + b.w / 2;
    const u = alongX ? b.x + b.w / 2 : b.z + b.d / 2;
    for (const dir of [-1, 1]) {
      const c0 = pos - dir * 0.5;
      const [x0, z0] = alongX ? [u, c0] : [c0, u];
      if (x0 < 0 || x0 > LOT.w || z0 < 0 || z0 > LOT.d) continue;
      /* Không có nội thất trong `solids` cũng là điều phải có ở đây: tủ kê sát tường chặn trước thì phép
         thử "tường có chặn không" qua mà chẳng soi gì. */
      const foot = supportAt(solids, x0, z0, H.floor);
      const r = stepWalk(solids, { x: x0, z: z0, foot }, alongX ? 0 : dir, alongX ? dir : 0);
      if (((alongX ? r.z : r.x) - pos) * dir > 0) {
        e.push(`đi bộ xuyên được tường nhà ở ${alongX ? `z ${n(pos)}, x ${n(u)}` : `x ${n(pos)}, z ${n(u)}`}`);
        break;
      }
    }
  }

  /* 17 — nội thất và cánh cửa. Tra thẳng từ `furn` và `doors`, không gọi hàm dựng: các khối của mỗi món
     (giường, sofa có nhiều khối — gom theo `item`) phải nằm trong chữ nhật khai và hộp bao của chúng phủ
     gần trọn nó (massing cắt phần lấn tường, cỡ 1 cm), khối thấp nhất chạm cốt sàn phòng chứa nó (tra
     floorLevels / cốt nền), cao dương và không chạm trần. Không đâm vào phần
     xây thì phép 10 soi. Mỗi cửa quay có một cánh, cửa 4 cánh bốn cánh — tổng bề rộng các cánh đo dọc
     tường không quá bề rộng lỗ, cánh nằm trọn phía mở tính từ mặt tường, chân ở ngưỡng, đỉnh ở đầu cửa.
     Cánh không chắn lối thì phép 5 (điểm chọc giữa lỗ) và phép 16 (đi bộ qua cửa) đã soi. */
  const furnBoxes = m.boxes.filter(b => b.kind === 'furniture');
  for (const [i, [kind, x, y, w, h]] of (plan.furn || []).entries()) {
    const room = plan.rooms.find(([, , rx, ry, rw, rh]) =>
      x >= rx - 0.01 && y >= ry - 0.01 && x + w <= rx + rw + 0.01 && y + h <= ry + rh + 0.01);
    if (!room) continue;                                // validate() đã báo
    const at = `nội thất ${kind} @${x},${y}`;
    const parts = furnBoxes.filter(b => b.item === i);
    if (!parts.length) { e.push(`${at} không có khối nào`); continue; }
    const WP = FURNITURE.washPlinth;
    const pad = kind === 'washRaised' ? WP.pad : 0;   // bệ sân máy giặt rộng hơn thân máy mỗi phía
    if (parts.some(b => b.x < x - pad - EPS || b.z < y - pad - EPS || b.x + b.w > x + w + pad + EPS || b.z + b.d > y + h + pad + EPS))
      e.push(`${at} có khối thò ra ngoài chữ nhật khai`);
    const bw = Math.max(...parts.map(b => b.x + b.w)) - Math.min(...parts.map(b => b.x));
    const bd = Math.max(...parts.map(b => b.z + b.d)) - Math.min(...parts.map(b => b.z));
    if (bw * bd < 0.8 * w * h) e.push(`${at} chỉ phủ ${n(bw)} × ${n(bd)} trên ${w} × ${h} khai`);
    const f = plan.floorLevels?.[room[0]] ?? (room[6] !== 'yard' && room[0] !== 'R3' || /^BAN CÔNG/.test(room[1]) ? H.floor : 0);
    const low = Math.min(...parts.map(b => b.y0)), high = Math.max(...parts.map(b => b.y1));
    const base = kind === 'washRaised' ? m.boxes.filter(b => b.item === i && b.kind === 'ground') : [];
    if (kind === 'washRaised' && (base.length !== 1 || Math.abs(base[0].y0 - f) > EPS || Math.abs(base[0].y1 - (f + WP.rise)) > EPS))
      e.push(`${at} không có bệ sân nâng đúng ${WP.rise} m`);
    const expectedLow = kind === 'washRaised' ? f + WP.rise : f;
    if (kind !== 'tap' && Math.abs(low - expectedLow) > EPS) e.push(`${at} chân ở cốt ${n(low)}, phải ở ${n(expectedLow)}`);
    /* Kệ thờ cố ý kéo lên tận trần — chạm trần được, không đâm qua. */
    const ceilingCap = kind === 'shrine' ? f + H.ceiling + EPS : L.ceiling - 0.3;
    if (!(high > low) || high > ceilingCap) e.push(`${at} cao tới ${n(high)}, sát trần ${n(L.ceiling)}`);
  }
  const stray = furnBoxes.filter(b => !(b.item >= 0 && b.item < (plan.furn || []).length));
  if (stray.length) e.push(`${stray.length} khối nội thất không thuộc món khai nào`);
  const leaves = m.boxes.filter(b => b.kind === 'doorLeaf');
  for (const [id, ax, pos, a, b, style, , open] of plan.doors) {
    const mine = leaves.filter(l => l.id === id);
    const want = style === 'swing' ? 1 : style === 'quad' ? 4 : 0;
    if (mine.length !== want) { e.push(`cửa ${id} (${style}) có ${mine.length} cánh, phải ${want}`); continue; }
    const t = Math.max(0, ...plan.walls
      .filter(w => w[0] === ax && Math.abs(w[1] - pos) < EPS && w[2] < b && w[3] > a).map(w => w[4]));
    const face = pos + open * t / 2;
    const sill = base([id, ax, pos, a, b]);
    const head = sill + ((H.only[id] || {}).door ?? H.door);
    let width = 0, closed = 0;
    for (const l of mine) {
      const [u0, u1, n0, n1] = ax === 'h' ? [l.x, l.x + l.w, l.z, l.z + l.d] : [l.z, l.z + l.d, l.x, l.x + l.w];
      width += u1 - u0;
      if (u0 < a - EPS || u1 > b + EPS) e.push(`cánh cửa ${id} thò ra ngoài lỗ ${a}–${b}`);
      /* Cánh đứng đúng chỗ (chừa 0.1 m cho phần bản lề lùi về mặt tường bên cạnh). Phép 5 chọc ở tim tường
         còn cánh mở bắt đầu từ mặt tường, nên cánh đứng chắn giữa lỗ chỉ lộ ở đây — đã phá thử đúng kiểu
         đó và phép 5 không thấy. */
      else if (n0 >= pos - t / 2 - EPS && n1 <= pos + t / 2 + EPS) {
        /* Cánh đóng — nằm trong bề dày tường. Chỉ cửa 4 cánh có, và phải là cánh ngoài, áp một đầu lỗ. */
        closed++;
        if (style !== 'quad' || (u0 - a > 0.1 && b - u1 > 0.1)) e.push(`cánh cửa ${id} đóng chắn giữa lỗ ${a}–${b}`);
      } else {
        /* Cánh mở — áp bản lề: đầu lỗ với cửa quay, mép trong cánh ngoài (1/4 và 3/4 lỗ) với cửa 4 cánh. */
        const hinges = style === 'quad' ? [a + (b - a) / 4, b - (b - a) / 4] : [a, b];
        if (!hinges.some(hg => Math.abs(u0 - hg) < 0.1 || Math.abs(u1 - hg) < 0.1))
          e.push(`cánh cửa ${id} không áp bản lề (${hinges.map(n).join(' / ')}), đứng chắn lối`);
        if ((open > 0 ? n0 - face : face - n1) < -EPS) e.push(`cánh cửa ${id} không nằm phía mở`);
      }
      if (Math.abs(l.y0 - sill) > EPS || Math.abs(l.y1 - head) > EPS)
        e.push(`cánh cửa ${id} cao ${n(l.y0)}–${n(l.y1)}, lỗ ${n(sill)}–${n(head)}`);
    }
    if (style === 'quad' && closed !== 2) e.push(`cửa 4 cánh ${id} có ${closed} cánh đóng, phải 2 cánh ngoài`);
    if (width > b - a + EPS) e.push(`các cánh cửa ${id} rộng ${n(width)} quá lỗ ${n(b - a)}`);
  }

  /* 18 — cột đỡ mái nhẹ. Hai chuyện:
     a) Cột khai nào cũng có đúng một khối ở đúng tâm, đúng tiết diện, chân ở cốt sân, đỉnh chạm vật thấp
        nhất ngay trên nó — mặt dưới tấm mái (tra spanAt trên lăng trụ đã dựng) hoặc đáy máng. Hở là cột
        không đỡ gì, cao hơn là cột đâm thủng mái (phép 10 chỉ bắt được phần sau).
     b) Soi kết cấu, không soi cột: đi dọc từng mép mái nhẹ (vùng khai theo tim), đánh dấu chỗ nào có tường
        cao tới mặt dưới mái hoặc có cột ngay dưới. Hai chỗ đỡ liền nhau không được xa quá POST.maxSpan, và
        đầu mép không được hẫng quá 0.3 m. Không lấy cột từ `posts` mà lấy từ khối đã dựng: xoá một cột
        khỏi dữ liệu là mép ấy phải đỏ ngay. */
  const postBoxes = m.boxes.filter(b => b.kind === 'post');
  const onPlan = (p, b) => overlap(p.x, p.x + p.w, b.x, b.x + b.w) > EPS && overlap(p.z, p.z + p.d, b.z, b.z + b.d) > EPS;
  for (const [id, x, y] of plan.posts || []) {
    const mine = postBoxes.filter(b => b.id === id);
    if (mine.length !== 1) { e.push(`cột ${id} có ${mine.length} khối`); continue; }
    const b = mine[0];
    if (Math.abs(b.x + b.w / 2 - x) > EPS || Math.abs(b.z + b.d / 2 - y) > EPS
     || Math.abs(b.w - POST.size) > EPS || Math.abs(b.d - POST.size) > EPS)
      e.push(`cột ${id} dựng lệch chỗ khai (${x}, ${y}) hoặc sai tiết diện`);
    if (Math.abs(b.y0) > EPS) e.push(`cột ${id} chân ở cốt ${n(b.y0)}, không đứng trên sân`);
    const caps = [
      ...panels.filter(p => onPlan(p, b)).flatMap(p => {
        const [c0, c1] = p.axis === 'x' ? [Math.max(p.x, b.x), Math.min(p.x + p.w, b.x + b.w)]
                                        : [Math.max(p.z, b.z), Math.min(p.z + p.d, b.z + b.d)];
        return [spanAt(p, c0)[0], spanAt(p, c1)[0]];
      }),
      ...gutterBoxes.filter(g => onPlan(g, b)).map(g => g.y0),
      ...m.boxes.filter(g => g.kind === 'beam' && onPlan(g, b)).map(g => g.y0),
      ...m.prisms.filter(p => p.kind === 'beam' && onPlan(p, b)).flatMap(p => {
        const [c0, c1] = p.axis === 'x' ? [Math.max(p.x, b.x), Math.min(p.x + p.w, b.x + b.w)]
                                        : [Math.max(p.z, b.z), Math.min(p.z + p.d, b.z + b.d)];
        return [spanAt(p, c0)[0], spanAt(p, c1)[0]];
      }),
    ];
    if (!caps.length) e.push(`cột ${id} không có mái nào bên trên`);
    else if (Math.abs(Math.min(...caps) - b.y1) > 1e-3)
      e.push(`cột ${id} đỉnh ở ${n(b.y1)}, vật bên trên (mặt dưới mái / đáy máng) ở ${n(Math.min(...caps))}`);
  }
  const holders = [...m.boxes.filter(b => /Wall$/.test(b.kind) || b.kind === 'post'), ...m.prisms.filter(p => /Wall$/.test(p.kind))];

  /* c) Dầm: mặt trên chạm vật ngay trên (mặt dưới tấm mái hoặc đáy máng — soi hơi lùi vào trong đoạn, đúng
        ranh thì chạm cả máng bên cạnh), hai đầu gối lên tường, cột hay đoạn dầm khác trong vòng 6 cm. */
  const beamParts = [...m.boxes.filter(b => b.kind === 'beam'), ...m.prisms.filter(p => p.kind === 'beam')];
  const alongXOf = q => q.axis ? q.axis === 'x' : q.w >= q.d;
  for (const bm of beamParts) {
    const alongX = alongXOf(bm);
    const [u0, u1] = alongX ? [bm.x, bm.x + bm.w] : [bm.z, bm.z + bm.d];
    const cn = alongX ? bm.z + bm.d / 2 : bm.x + bm.w / 2;
    const pt = u => (alongX ? [u, cn] : [cn, u]);
    const span = u => (bm.axis ? spanAt(bm, u) : [bm.y0, bm.y1]);
    for (const u of [u0 + Math.min(0.01, (u1 - u0) / 3), u1 - Math.min(0.01, (u1 - u0) / 3)]) {
      const [px, pz] = pt(u);
      const inP = q => px >= q.x - EPS && px <= q.x + q.w + EPS && pz >= q.z - EPS && pz <= q.z + q.d + EPS;
      const above = [...panels.filter(inP).map(p => spanAt(p, p.axis === 'x' ? px : pz)[0]),
                     ...gutterBoxes.filter(inP).map(g => g.y0)];
      const top = span(u)[1];
      if (!above.length || Math.abs(Math.min(...above) - top) > 0.01) {
        e.push(`dầm ${bm.id} quanh x ${n(px)}, z ${n(pz)}: mặt trên ${n(top)}, vật bên trên ở ${above.length ? n(Math.min(...above)) : 'không có'}`);
        break;
      }
    }
    for (const u of [u0, u1]) {
      const [px, pz] = pt(u), bot = span(u)[0];
      const rests = [...holders, ...beamParts.filter(q => q !== bm)].some(s =>
        px >= s.x - 0.06 && px <= s.x + s.w + 0.06 && pz >= s.z - 0.06 && pz <= s.z + s.d + 0.06
        && (s.axis ? spanAt(s, Math.min(s.axis === 'x' ? s.x + s.w : s.z + s.d, Math.max(s.axis === 'x' ? s.x : s.z, s.axis === 'x' ? px : pz)))[1] : s.y1) >= bot - 0.01);
      if (!rests) e.push(`đầu dầm ${bm.id} ở x ${n(px)}, z ${n(pz)} không gối lên tường, cột hay dầm nào`);
    }
  }
  for (const R of lightRoofs(plan)) {
    const edges = [['h', R.y0, R.x0, R.x1], ['h', R.y1, R.x0, R.x1], ['v', R.x0, R.y0, R.y1], ['v', R.x1, R.y0, R.y1]];
    for (const [ax, pos, a, b] of edges) {
      const steps = Math.max(1, Math.round((b - a) / 0.05)), held = [], bare = [];
      for (let i = 0; i <= steps; i++) {
        const u = a + (b - a) * i / steps;
        const [px, pz] = ax === 'h' ? [u, pos] : [pos, u];
        const under = R.axis === 'x' ? R.under(px) : R.axis === 'y' ? R.under(pz) : R.under(0);
        /* Tường phải lên tới mặt dưới mái (chừa 6 cm: tường dừng ở chỗ thấp nhất trong bề dày của nó). Cột thì
           đứng dưới đáy dầm, mà dầm chui dưới máng thì còn thấp hơn — chừa đủ bề cao dầm cộng máng. */
        const on = s => px >= s.x - EPS && px <= s.x + s.w + EPS && pz >= s.z - EPS && pz <= s.z + s.d + EPS;
        const topAt = s => (s.axis ? spanAt(s, s.axis === 'x' ? px : pz)[1] : s.y1);
        const byWall = holders.some(s => s.kind !== 'post' && on(s) && topAt(s) >= under - 0.06);
        const byPost = holders.some(s => s.kind === 'post' && on(s) && topAt(s) >= under - (BEAM.depth + ROOF.gutterDepth + 0.03));
        if (byWall || byPost) held.push(u);
        /* Không tựa tường thì phải có dầm dọc mép: trong 15 cm bề ngang (dầm lùi sau máng), 6 cm dọc trục. */
        const nearBeam = q => { const [ex, ez] = alongXOf(q) ? [0.06, 0.15] : [0.15, 0.06];
          return px >= q.x - ex && px <= q.x + q.w + ex && pz >= q.z - ez && pz <= q.z + q.d + ez; };
        if (!byWall && !beamParts.some(nearBeam)) bare.push(u);
      }
      const where = `mép ${ax === 'h' ? 'y' : 'x'} = ${pos} mái ${R.id}`;
      if (bare.length) e.push(`${where}: đoạn không tựa tường mà không có dầm, quanh ${n(bare[0])}–${n(bare[bare.length - 1])}`);
      if (!held.length) { e.push(`${where} không có tường hay cột nào đỡ`); continue; }
      const hang = Math.max(held[0] - a, b - held[held.length - 1]);
      if (hang > 0.3) e.push(`${where} hẫng ${n(hang)} m ở đầu mép`);
      for (let i = 1; i < held.length; i++)
        if (held[i] - held[i - 1] > POST.maxSpan + 1e-3) {
          e.push(`${where}: nhịp ${n(held[i - 1])}–${n(held[i])} dài ${n(held[i] - held[i - 1])} m, quá ${POST.maxSpan} m`);
          break;
        }
    }
  }

  /* 19 — xà gồ. Không soi lại trực tiếp `purlinsOf()` để kết luận kết cấu: so khối đã dựng với
     danh sách suy ra, rồi soi cốt chạm tôn, hai gối và nhịp thực tế. */
  const purlinBoxes = m.boxes.filter(b => b.kind === 'purlin');
  const expectedPurlins = purlinsOf(plan);
  if (purlinBoxes.length !== expectedPurlins.length)
    e.push(`dựng ${purlinBoxes.length} xà gồ, cần ${expectedPurlins.length}`);
  const purlinSupports = [...m.boxes.filter(b => /Wall$/.test(b.kind) || b.kind === 'beam'),
                           ...m.prisms.filter(p => p.kind === 'beam')];
  for (const p of expectedPurlins) {
    const b = purlinBoxes.find(q => q.id === p.id);
    if (!b) { e.push(`thiếu xà gồ ${p.id}`); continue; }
    const alongX = p.ax === 'h', span = alongX ? b.w : b.d;
    if (Math.abs(b.x - p.rect.x) > EPS || Math.abs(b.z - p.rect.y) > EPS
     || Math.abs(b.w - p.rect.w) > EPS || Math.abs(b.d - p.rect.h) > EPS)
      e.push(`xà gồ ${p.id} dựng lệch tuyến suy ra`);
    if (Math.abs(b.y1 - p.top) > 1e-3 || Math.abs(b.y1 - b.y0 - PURLIN.depth) > EPS)
      e.push(`xà gồ ${p.id} sai cao độ / tiết diện`);
    if (span > PURLIN.maxSpan + EPS)
      e.push(`xà gồ ${p.id} nhịp ${n(span)} m, quá ${PURLIN.maxSpan} m`);
    const mid = [b.x + b.w / 2, b.z + b.d / 2];
    const touchRoof = panels.some(q => q.id === p.roofId && inPlan(q, ...mid)
      && spanAt(q, q.axis === 'x' ? mid[0] : mid[1])[0] >= b.y1 - EPS
      && spanAt(q, q.axis === 'x' ? mid[0] : mid[1])[0] - b.y1 < 0.01);
    if (!touchRoof) e.push(`xà gồ ${p.id} không chạm đúng mặt dưới tôn`);
    for (const end of alongX ? [b.x, b.x + b.w] : [b.z, b.z + b.d]) {
      const cross = alongX ? b.z + b.d / 2 : b.x + b.w / 2;
      const rests = purlinSupports.some(s => {
        const face = alongX ? Math.abs(end - s.x) < 0.02 || Math.abs(end - (s.x + s.w)) < 0.02
                            : Math.abs(end - s.z) < 0.02 || Math.abs(end - (s.z + s.d)) < 0.02;
        const across = alongX ? cross >= s.z - EPS && cross <= s.z + s.d + EPS
                              : cross >= s.x - EPS && cross <= s.x + s.w + EPS;
        const sx = alongX ? end : cross, sz = alongX ? cross : end;
        const cap = s.axis ? spanAt(s, s.axis === 'x' ? sx : sz)[1] : s.y1;
        return face && across && cap >= b.y0 - 0.01;
      });
      if (!rests) e.push(`đầu xà gồ ${p.id} không tựa tường hoặc dầm`);
    }
  }

  /* 20 — lớp chống nóng mái. Tra từ số khai và khối đã dựng, không gọi roofInsulationOf(). Lấy mẫu dày
     (bước 0.1 m, lệch khỏi bội số 5 cm để không rơi đúng ranh mảnh) trên từng bản mái bê tông và bản mái
     đổ ra ngoài được khai: điểm nào không nằm dưới một khối nhô cao hơn mặt mái phải có **đúng một** mảnh
     lớp — thiếu là hở chống thấm, hai là chồng. Ngược lại mỗi mảnh lớp phải có bên dưới một bản đỡ ở cốt
     mái (bản mái được phủ, hoặc đỉnh tường nhà) — lát ra mái hiên không khai hay ra ngoài khối nhà là lộ.
     Và không mảnh nào phủ giếng trời. */
  const insBoxes = m.boxes.filter(b => b.kind === 'roofInsulation');
  if (!plan.roofInsulation) {
    if (insBoxes.length) e.push(`mặt bằng không khai roofInsulation mà có ${insBoxes.length} mảnh lớp chống nóng`);
  } else {
    const top = L.houseTop + insulationT;
    const off = insBoxes.find(b => Math.abs(b.y0 - L.houseTop) > EPS || Math.abs(b.y1 - top) > EPS);
    if (off) e.push(`lớp chống nóng quanh x ${n(off.x)}, z ${n(off.z)} ở cốt ${n(off.y0)}–${n(off.y1)}, phải ${n(L.houseTop)}–${n(top)}`);

    const near = (b, ax, pos) => ax === 'h' ? Math.abs(b.z - pos) < 0.2 || Math.abs(b.z + b.d - pos) < 0.2
                                            : Math.abs(b.x - pos) < 0.2 || Math.abs(b.x + b.w - pos) < 0.2;
    const covered = [
      ...m.boxes.filter(b => b.kind === 'roof'),
      ...m.boxes.filter(b => b.kind === 'overhang'
        && (plan.roofInsulation.overhangs || []).some(([ax, pos]) => near(b, ax, pos))),
    ];
    const raised = [...m.boxes, ...m.prisms]
      .filter(b => b.kind !== 'roofInsulation' && b.y1 > L.houseTop + EPS && b.y0 < top - EPS);
    const inP = (q, x, z) => x > q.x + EPS && x < q.x + q.w - EPS && z > q.z + EPS && z < q.z + q.d - EPS;
    const onP = (q, x, z) => x >= q.x - EPS && x <= q.x + q.w + EPS && z >= q.z - EPS && z <= q.z + q.d + EPS;
    const grid = (b, f) => {
      for (let x = b.x + 0.037; x < b.x + b.w; x += 0.1)
        for (let z = b.z + 0.041; z < b.z + b.d; z += 0.1) if (f(x, z)) return;
    };

    for (const s of covered)
      grid(s, (x, z) => {
        if (raised.some(q => inP(q, x, z))) return false;
        const k = insBoxes.filter(b => inP(b, x, z)).length;
        if (k === 1) return false;
        e.push(`lớp chống nóng ${k ? `chồng ${k} mảnh` : 'hở'} ở x ${n(x)}, z ${n(z)} trên bản ${s.kind}`);
        return true;
      });

    /* Mép lớp phải ra tới mặt ngoài tường: ngay ngoài mép mỗi bản được phủ (0.03 m — lọt trong nửa tường 100),
       chỗ nào là đỉnh tường nhà ở cốt mái thì cũng phải có lớp. Dừng ở tim tường thì hở nửa bề dày — đã phá thử
       đúng kiểu đó, các mẫu bên trong bản mái không thấy. */
    const tops = m.boxes.filter(b => b.kind === 'houseWall' && Math.abs(b.y1 - L.houseTop) < EPS);
    ring: for (const s of covered) {
      const pts = [];
      for (let u = s.x + 0.037; u < s.x + s.w; u += 0.1) pts.push([u, s.z - 0.03], [u, s.z + s.d + 0.03]);
      for (let u = s.z + 0.041; u < s.z + s.d; u += 0.1) pts.push([s.x - 0.03, u], [s.x + s.w + 0.03, u]);
      for (const [x, z] of pts) {
        if (!tops.some(q => inP(q, x, z)) || raised.some(q => inP(q, x, z))) continue;
        if (!insBoxes.some(b => inP(b, x, z))) {
          e.push(`lớp chống nóng dừng trước mặt ngoài tường ở x ${n(x)}, z ${n(z)} — đỉnh tường nhà để trần`);
          break ring;
        }
      }
    }

    const bases = [...covered, ...tops];
    for (const b of insBoxes)
      grid(b, (x, z) => {
        if (bases.some(q => onP(q, x, z))) return false;
        e.push(`lớp chống nóng ở x ${n(x)}, z ${n(z)} không có bản mái hay đỉnh tường nhà bên dưới`);
        return true;
      });

    for (const { id, x: sx, y: sy, w: sw, h: sh } of roofHoles(plan))
      for (const [x, z] of [[sx + sw / 2, sy + sh / 2], [sx + 0.02, sy + 0.02], [sx + sw - 0.02, sy + sh - 0.02]])
        if (insBoxes.some(b => inP(b, x, z))) { e.push(`lớp chống nóng phủ lên ${id}`); break; }
  }

  /* 21 — cầu thang lên mái, tum, lan can mái. Soi trên khối đã dựng bằng đúng lib/walk.js của trang 3D:
     a) khối bậc đủ số, mặt bậc cách đều một nấc không quá STAIR.maxRise, nấc cuối lên đúng mặt mái đi lại được
        (tra từ số khai, không từ stairsOf());
     b) đi bộ: từ sàn trước chân vế 1, lên hết vế 1, ngang chiếu nghỉ, lên hết vế 2 ra mặt mái, qua cửa tum ra ngoài
        — rồi đi ngược lại xuống tới sàn. Vướng lan can, vách tum, bản mái hay bậc cao quá tầm bước đều lộ ở đây;
     c) khoảng đầu: trên tâm mọi mặt bậc không có khối nào (kể cả tấm polycarbonate) thấp hơn STAIR.headroom;
     d) tum: mọi điểm trong lỗ thang có mái tum hoặc tấm lấy sáng bên trên; tâm cửa tum thủng;
     e) lan can mái: chân đúng mặt mái, đỉnh đúng cao lan can, mỗi đoạn đã cắt có thanh;
     f) khe giữa hai vế: mỗi mép trong có tay vịn chạy hết vế, cao đúng STAIR.rail trên mũi bậc, và có trụ ở
        đầu khe — mép hở không tay vịn là rơi thẳng xuống vế dưới. */
  const walkTopOf = walkTop;
  const allSolid = [...m.boxes, ...m.prisms].filter(b => b.kind !== 'furniture' && b.kind !== 'doorLeaf');
  for (const s of stairsOf(plan)) {
    if (s.error) continue;
    const mine = m.boxes.filter(b => b.kind === 'stair' && b.id === s.id);
    const [r1, r2] = s.risers;
    if (mine.length !== r1 + r2 - 1) e.push(`cầu thang ${s.id} dựng ${mine.length} khối, cần ${r1 + r2 - 1}`);
    const base = floorOf(plan, plan.rooms.find(r => r[0] === s.room), H.floor);
    const levelsUp = [...new Set(mine.map(b => +b.y1.toFixed(6)))].sort((a, b) => a - b);
    /* Nấc cuối lên mặt mái, hoặc lên mặt gờ chắn nước ngưỡng cửa tum nếu thang ra thẳng cửa tum. */
    const stairTop = walkTopOf + (plan.tum ? TUM.curb : 0);
    const rises = [base, ...levelsUp, stairTop].map((y, i, a) => (i ? y - a[i - 1] : null)).slice(1);
    if (Math.max(...rises) - Math.min(...rises) > 1e-3 || Math.max(...rises) > STAIR.maxRise + EPS)
      e.push(`cầu thang ${s.id} bậc không đều hoặc quá cao: ${rises.map(n).join(' / ')}`);

    const W = s.width, hole = s.hole;
    const c1 = hole.y + hole.h - W / 2, c2 = hole.y + W / 2, xl = hole.x + W / 2;
    const xStart = s.start1 + WALK.radius + 0.05, xOut = hole.x + hole.w + 0.45;
    const t = tumOf(plan);
    const route = [[xStart, c1], [xl, c1], [xl, c2], [xOut, c2]];
    /* Mỗi cửa tum: từ chỗ vừa lên tới mặt mái, đi tới ngang tâm cửa rồi thẳng ra ngoài 0.5 m. */
    const exits = (t ? t.doors : []).map(d => {
      const dm = (d.a + d.b) / 2;
      const out = Math.abs(d.pos - (d.ax === 'h' ? t.y0 : t.x0)) < EPS ? -1 : 1;
      return { d, pts: d.ax === 'h' ? [[xOut, c2], [dm, c2], [dm, d.pos + out * 0.5]]
                                    : [[xOut, c2], [xOut, dm], [d.pos + out * 0.5, dm]] };
    });
    const solids21 = walkSolids(m).filter(q => q.kind !== 'furniture' && q.kind !== 'doorLeaf');
    const walkRoute = (pts, foot) => {
      let p = { x: pts[0][0], z: pts[0][1], foot: supportAt(solids21, pts[0][0], pts[0][1], foot) };
      for (const [x, z] of pts.slice(1)) {
        const r = stepWalk(solids21, p, x - p.x, z - p.z);
        if (r.hit || Math.hypot(r.x - x, r.z - z) > 1e-3) return { stuck: r };
        p = r;
      }
      return { p };
    };
    const up = walkRoute(route, base);
    if (up.stuck) e.push(`đi bộ lên thang ${s.id} vướng ${up.stuck.hit?.kind ?? '?'} ở x ${n(up.stuck.x)}, z ${n(up.stuck.z)}, cốt ${n(up.stuck.foot)}`);
    else if (Math.abs(up.p.foot - walkTopOf) > EPS) e.push(`đi bộ lên thang ${s.id} tới nơi ở cốt ${n(up.p.foot)}, mặt mái ${n(walkTopOf)}`);
    else {
      for (const { d, pts } of exits) {
        const where = `cửa tum trục ${d.ax} ${d.pos}`;
        const go = walkRoute(pts, walkTopOf);
        const back = go.stuck ? null : walkRoute([...pts].reverse(), walkTopOf);
        const bad = go.stuck || back?.stuck;
        if (bad) e.push(`đi bộ qua ${where} vướng ${bad.hit?.kind ?? '?'} ở x ${n(bad.x)}, z ${n(bad.z)}`);
        else if (Math.abs(go.p.foot - walkTopOf) > EPS || Math.abs(back.p.foot - walkTopOf) > EPS)
          e.push(`đi bộ qua ${where} tới nơi ở cốt ${n(go.p.foot)}, mặt mái ${n(walkTopOf)}`);
        else if (go.p.x > t.x0 && go.p.x < t.x1 && go.p.z > t.y0 && go.p.z < t.y1)
          e.push(`đi bộ qua ${where} vẫn còn ở trong tum — cửa không nằm trên vách`);
      }
      const down = walkRoute([...route].reverse(), walkTopOf);
      if (down.stuck) e.push(`đi bộ xuống thang ${s.id} vướng ${down.stuck.hit?.kind ?? '?'} ở x ${n(down.stuck.x)}, z ${n(down.stuck.z)}`);
      else if (Math.abs(down.p.foot - base) > EPS) e.push(`đi bộ xuống thang ${s.id} tới nơi ở cốt ${n(down.p.foot)}, sàn ${n(base)}`);
    }

    /* Khe giữa hai vế: hai mép trong đều là mép hở. Đòi tay vịn dọc từng mép, chạy gần hết bề dài vế, và một
       khối bịt đầu khe. Lấy từ khối đã dựng, không từ số khai. */
    const well = s.hole.h - 2 * s.width;
    if (well > EPS) {
      const rails = [...m.boxes, ...m.prisms].filter(b => b.kind === 'stairRail' && b.id === s.id);
      const xs0 = s.landing.x + s.landing.w;
      const sides = [
        { name: 'vế 2', edge: s.hole.y + s.width, from: xs0, to: s.hole.x + s.hole.w },
        { name: 'vế 1', edge: s.hole.y + s.hole.h - s.width, from: xs0, to: s.start1 },
      ];
      for (const { name, edge, from, to } of sides) {
        const run = rails.filter(b => b.w > b.d && b.z < edge + RAILING.rail + EPS && b.z + b.d > edge - RAILING.rail - EPS
                                      && b.x < to - EPS && b.x + b.w > from + EPS);
        const cover = run.length ? Math.min(...run.map(b => b.x + b.w)) - Math.max(...run.map(b => b.x)) : 0;
        if (cover < (to - from) * 0.9)
          e.push(`cầu thang ${s.id}: mép trong ${name} giáp khe rộng ${n(well)} m chỉ có tay vịn ${n(cover)} / ${n(to - from)} m`);
      }
      const head = rails.find(b => b.x + b.w <= xs0 + EPS && b.z < sides[0].edge + EPS && b.z + b.d > sides[1].edge - EPS
                                   && b.y1 > s.landingTop + STAIR.rail - EPS);
      if (!head) e.push(`cầu thang ${s.id}: đầu khe giữa hai vế để hở, không có trụ vịn trên chiếu nghỉ`);
    }

    for (const b of mine) {
      const cx = b.x + b.w / 2, cz = b.z + b.d / 2;
      const over = [...allSolid, ...m.glass].filter(q => q !== b && q.y0 > b.y1 + EPS
        && cx > q.x && cx < q.x + q.w && cz > q.z && cz < q.z + q.d).map(q => q.axis ? spanAt(q, q.axis === 'x' ? cx : cz)[0] : q.y0);
      if (over.length && Math.min(...over) - b.y1 < STAIR.headroom - EPS) {
        e.push(`cầu thang ${s.id} quanh x ${n(cx)}, z ${n(cz)}: khoảng đầu ${n(Math.min(...over) - b.y1)} m`);
        break;
      }
    }

    if (!t) { e.push(`cầu thang ${s.id} lên mái mà không có tum`); continue; }
    const covers = [...m.boxes.filter(b => b.kind === 'tumRoof'), ...m.glass.filter(g => g.kind === 'tumGlass')];
    miss: for (let x = hole.x + 0.03; x < hole.x + hole.w; x += 0.2)
      for (let z = hole.y + 0.03; z < hole.y + hole.h; z += 0.2)
        if (!covers.some(q => x >= q.x - EPS && x <= q.x + q.w + EPS && z >= q.z - EPS && z <= q.z + q.d + EPS)) {
          e.push(`lỗ thang ${s.id} hở trời ở x ${n(x)}, z ${n(z)} — tum không trùm`);
          break miss;
        }
  }
  const tm = tumOf(plan);
  /* Cửa tum phải là lỗ thật trên vách: tâm lỗ không có vách, và ngay trên đầu cửa có lanh tô vách tum — khai cửa
     lệch khỏi vách thì không có lanh tô nào, đi bộ vẫn qua vì chẳng có gì chắn. */
  if (tm && !tm.doors.length) e.push('tum không có cửa ra mái');
  /* Mái tum đua ra khỏi mặt ngoài tường đủ TUM.eave ở mọi cạnh không nằm trên ranh lô, và không đua ra ngoài lô. */
  if (tm) {
    /* Diềm gập: mỗi cạnh có đua một dải, cao đúng TUM.fascia, mặt trên bằng mặt tôn, áp mép ngoài mái. Ô văng: mỗi cửa một
       tấm phía ngoài tum, phủ bề ngang cửa cộng lề hai bên, đua đủ, nằm giữa đầu cửa và mặt dưới mái tum. */
    const fas = m.boxes.filter(b => b.kind === 'tumFascia');
    const eaveSides = [tm.x0 > EPS, tm.x1 < LOT.w - EPS, tm.y0 > EPS, tm.y1 < LOT.d - EPS].filter(Boolean).length;
    if (fas.length !== eaveSides) e.push(`mái tum có ${fas.length} dải diềm, phải ${eaveSides} (mỗi cạnh có đua một dải)`);
    if (fas.some(b => Math.abs(b.y1 - tm.top) > EPS || Math.abs(b.y1 - b.y0 - TUM.fascia) > EPS))
      e.push('diềm mái tum sai cao độ — mặt trên phải bằng mặt tôn');
    for (const d of tm.doors) {
      const out = Math.abs(d.pos - (d.ax === 'h' ? tm.y0 : tm.x0)) < EPS ? -1 : 1;
      const face = d.pos + out * TUM.wall / 2, head = tm.base + TUM.door;
      const ok = m.boxes.some(b => b.kind === 'tumCanopy' && b.y0 >= head - EPS && b.y1 <= tm.under + EPS && (d.ax === 'v'
        ? Math.abs((out > 0 ? b.x : b.x + b.w) - face) < EPS && b.w >= TUM.canopy - EPS && b.z <= d.a - TUM.canopyMargin + EPS && b.z + b.d >= d.b + TUM.canopyMargin - EPS
        : Math.abs((out > 0 ? b.z : b.z + b.d) - face) < EPS && b.d >= TUM.canopy - EPS && b.x <= d.a - TUM.canopyMargin + EPS && b.x + b.w >= d.b + TUM.canopyMargin - EPS));
      if (!ok) e.push(`cửa tum trục ${d.ax} ${d.pos} không có ô văng phía ngoài phủ đủ cửa`);
    }
    /* Lá kính ô thoáng: nằm gọn trong dải ô thoáng và bề dày tường, thấp ở mặt ngoài tum; mỗi ô đủ TUM.louvers lá, lá
       trên chồng mép lá dưới (không có khe thẳng cho mưa hắt). */
    const ventLo = tm.under - TUM.ventGap - TUM.vent, ventHi = tm.under - TUM.ventGap;
    const lv = m.prisms.filter(p => p.kind === 'louver');
    const groups = {};
    for (const p of lv) (groups[`${n(p.x)}|${n(p.z)}`] ||= []).push(p);
    if (!lv.length) e.push('tum không có lá kính ô thoáng');
    for (const g of Object.values(groups)) {
      const p0 = g[0], wallZ = p0.z + p0.d / 2, outSmall = Math.abs(wallZ - tm.y0) < EPS;
      if (g.length !== TUM.louvers) e.push(`ô thoáng tum quanh x ${n(p0.x)}, z ${n(wallZ)} có ${g.length} lá kính, phải ${TUM.louvers}`);
      if (g.some(p => p.y0 < ventLo - EPS || p.y1 > ventHi + EPS || Math.abs(p.d - TUM.wall) > EPS))
        e.push(`lá kính ô thoáng tum quanh x ${n(p0.x)}, z ${n(wallZ)} ra ngoài dải ô thoáng hoặc bề dày tường`);
      if (g.some(p => (outSmall ? p.yt[0] > p.yt[1] : p.yt[1] > p.yt[0])))
        e.push(`lá kính ô thoáng tum quanh x ${n(p0.x)}, z ${n(wallZ)} không nghiêng xuống ra phía ngoài`);
      const sorted = [...g].sort((p, q) => q.y1 - p.y1);
      for (let i = 1; i < sorted.length; i++)
        if (Math.min(...sorted[i - 1].yb) > Math.max(...sorted[i].yt) + EPS) {
          e.push(`lá kính ô thoáng tum quanh x ${n(p0.x)}, z ${n(wallZ)} hở khe thẳng giữa hai lá`);
          break;
        }
    }
    const tr = m.boxes.filter(b => b.kind === 'tumRoof');
    const bx = tr.length && [Math.min(...tr.map(b => b.x)), Math.max(...tr.map(b => b.x + b.w)),
                             Math.min(...tr.map(b => b.z)), Math.max(...tr.map(b => b.z + b.d))];
    const hw = TUM.wall / 2, need = (u, edge) => (Math.abs(u) < EPS || Math.abs(u - edge) < EPS ? 0 : TUM.eave);
    if (!bx) e.push('tum không có mái');
    else if (bx[0] > tm.x0 - hw - need(tm.x0, LOT.w) + EPS || bx[1] < tm.x1 + hw + need(tm.x1, LOT.w) - EPS
          || bx[2] > tm.y0 - hw - need(tm.y0, LOT.d) + EPS || bx[3] < tm.y1 + hw + need(tm.y1, LOT.d) - EPS)
      e.push(`mái tum đua không đủ ${TUM.eave} m ra khỏi mặt tường`);
    else if (bx[0] < -hw - EPS || bx[1] > LOT.w + hw + EPS || bx[2] < -hw - EPS || bx[3] > LOT.d + hw + EPS)
      e.push('mái tum đua ra ngoài ranh lô');
  }
  for (const d of tm ? tm.doors : []) {
    const dm = (d.a + d.b) / 2, y = tm.base + 1.0;
    const [px, pz] = d.ax === 'h' ? [dm, d.pos] : [d.pos, dm];
    if (m.boxes.some(b => b.kind === 'tumWall' && inside(b, px, y, pz))) e.push(`cửa tum trục ${d.ax} ${d.pos} bị vách tum bịt`);
    if (!m.boxes.some(b => b.kind === 'tumWall' && inside(b, px, tm.base + TUM.door + 0.01, pz)))
      e.push(`cửa tum trục ${d.ax} ${d.pos} không nằm trên vách tum nào`);
    /* Cánh cửa: đúng một cánh chạm lỗ cửa ở đầu bản lề, không đè lên lỗ thang (cánh quét lên bậc là nguy), chân ở mặt
       gờ chắn nước, cao đúng đầu cửa. */
    const hingeU = d.hinge === 'a' ? d.a : d.b;
    const leaves = m.boxes.filter(b => b.kind === 'tumDoor' && (d.ax === 'h'
      ? hingeU >= b.x - EPS && hingeU <= b.x + b.w + EPS && Math.min(Math.abs(b.z - d.pos), Math.abs(b.z + b.d - d.pos)) < TUM.wall
      : hingeU >= b.z - EPS && hingeU <= b.z + b.d + EPS && Math.min(Math.abs(b.x - d.pos), Math.abs(b.x + b.w - d.pos)) < TUM.wall));
    /* Lỗ thang tra từ số khai, không từ cánh đã dựng — cánh dựng theo `open` khai nên so với chính nó không bao giờ lộ. */
    const overHole = b => roofHoles(plan).some(q => overlap(b.x, b.x + b.w, q.x, q.x + q.w) > EPS && overlap(b.z, b.z + b.d, q.y, q.y + q.h) > EPS);
    if (leaves.length !== 1) e.push(`cửa tum trục ${d.ax} ${d.pos} có ${leaves.length} cánh, phải 1`);
    else if (overHole(leaves[0]) || Math.abs(leaves[0].y0 - tm.base - TUM.curb) > EPS || Math.abs(leaves[0].y1 - tm.base - TUM.door) > EPS)
      e.push(`cánh cửa tum trục ${d.ax} ${d.pos} quét lên lỗ thang hoặc sai cao độ`);
    /* Gờ chắn nước: phủ trọn bề ngang lỗ ngay trên đường tim, cao đúng TUM.curb trên mặt mái. */
    const curb = m.boxes.find(b => b.kind === 'tumCurb' && inside(b, px, tm.base + TUM.curb / 2, pz));
    if (!curb) e.push(`cửa tum trục ${d.ax} ${d.pos} không có gờ chắn nước`);
    else if ((d.ax === 'h' ? curb.w : curb.d) < d.b - d.a - EPS || Math.abs(curb.y1 - tm.base - TUM.curb) > EPS)
      e.push(`gờ chắn nước cửa tum trục ${d.ax} ${d.pos} hụt bề ngang lỗ hoặc sai cao`);
  }
  const roofRailBoxes = m.boxes.filter(b => b.kind === 'roofRailing');
  /* Mọi thanh nằm gọn giữa mặt mái và đỉnh lan can (tay vịn thì ở trên cùng); mỗi tuyến khai có thanh đứng
     chân đúng mặt mái — lan can lơ lửng hay cắm xuống bản mái đều lộ. */
  const badRail = roofRailBoxes.find(b => b.y0 < walkTopOf - EPS || b.y1 > walkTopOf + ROOF_RAILING.height + EPS);
  if (badRail) e.push(`lan can mái quanh x ${n(badRail.x)}, z ${n(badRail.z)} cao ${n(badRail.y0)}–${n(badRail.y1)}, ra ngoài khoảng mặt mái ${n(walkTopOf)} → đỉnh lan can`);
  /* Soi **từng đoạn đã cắt**, không phải cả tuyến khai: tuyến x = 5 bị đầu hồi bếp cắt làm đôi, so với cả
     tuyến thì một đầu có thanh là đã cho qua — nửa kia mất sạch vẫn lọt. Mỗi đoạn phải có trụ đứng trên mặt
     mái, và các thanh của nó phải chạy hết đoạn (chừa nửa trụ ở hai đầu). */
  for (const { ax, pos, a, b } of roofRailingsOf(plan).filter(r => !r.error)) {
    const mine = roofRailBoxes.filter(q => ax === 'h'
      ? pos >= q.z - EPS && pos <= q.z + q.d + EPS && q.x < b - EPS && q.x + q.w > a + EPS
      : pos >= q.x - EPS && pos <= q.x + q.w + EPS && q.z < b - EPS && q.z + q.d > a + EPS);
    const s0 = ax === 'h' ? q => q.x : q => q.z, s1 = ax === 'h' ? q => q.x + q.w : q => q.z + q.d;
    if (!mine.some(q => Math.abs(q.y0 - walkTopOf) < EPS))
      e.push(`đoạn lan can mái trục ${ax} ${pos} (${n(a)}–${n(b)}) không có thanh nào đứng trên mặt mái`);
    else if (Math.min(...mine.map(s0)) > a + RAILING.post || Math.max(...mine.map(s1)) < b - RAILING.post)
      e.push(`đoạn lan can mái trục ${ax} ${pos} (${n(a)}–${n(b)}) chỉ có thanh trong khoảng `
             + `${n(Math.min(...mine.map(s0)))}–${n(Math.max(...mine.map(s1)))}`);
  }

  /* 22 — bồn nước trên mái, lấy từ khối đã dựng. Bốn bản đế nằm trên mặt mái, bốn chân nối bản đế lên đáy
     thân, thân đúng đường kính và gọn trong hình chiếu khai. Bản đế soi theo **áp lực thật**, không so với
     chính TANK.pad: bồn đầy nước chia đều bốn chân, ép xuống lớp chống nóng không được quá sức nén của XPS
     (ROOF_INSULATION.xpsStrength) — thu nhỏ bản đế trong lot.js là lộ ngay. Chồng khối thì phép 10 bắt riêng. */
  for (const t of tanksOf(plan)) {
    if (t.errors.length) { e.push(...t.errors); continue; }
    const mine = m.boxes.filter(b => b.id === t.id && (b.kind === 'tank' || b.kind === 'tankStand'));
    const body = mine.filter(b => b.kind === 'tank'), stand = mine.filter(b => b.kind === 'tankStand');
    if (body.length !== 1) { e.push(`bồn nước ${t.id} dựng ${body.length} thân, cần 1`); continue; }
    if (stand.length !== 8) e.push(`bồn nước ${t.id} dựng ${stand.length} khối giá, cần 8 (4 bản đế + 4 chân)`);
    const [bd] = body;
    if (bd.x < t.x - EPS || bd.z < t.y - EPS || bd.x + bd.w > t.x + t.w + EPS || bd.z + bd.d > t.y + t.h + EPS)
      e.push(`thân bồn ${t.id} lọt ra ngoài hình chiếu khai`);
    if (Math.abs(bd.y1 - bd.y0 - TANK.dia) > EPS) e.push(`thân bồn ${t.id} cao ${n(bd.y1 - bd.y0)}, cần đúng đường kính ${n(TANK.dia)}`);
    const pads = stand.filter(b => Math.abs(b.y0 - t.base) < EPS);
    if (pads.length !== 4) e.push(`bồn nước ${t.id} có ${pads.length} khối chân đứng trên mặt mái ${n(t.base)}, cần 4 bản đế`);
    else if (plan.roofInsulation) {
      /* kPa: nước 1 L = 1 kg, g ≈ 9.81; mỗi bản đế đỡ 1/4 bồn đầy. */
      const each = Math.min(...pads.map(b => b.w * b.d));
      const kPa = t.volume * 9.81 / 1000 / 4 / each;
      if (kPa > ROOF_INSULATION.xpsStrength - EPS)
        e.push(`bản đế bồn ${t.id} rộng ${n(each, 3)} m² ép ${Math.round(kPa)} kPa xuống lớp chống nóng, quá sức XPS ${ROOF_INSULATION.xpsStrength} kPa`);
    }
    const legs = stand.filter(b => Math.abs(b.y1 - t.legTop) < EPS);
    if (legs.length !== 4) e.push(`bồn nước ${t.id} có ${legs.length} chân lên tới đỉnh chân ${n(t.legTop)}, cần 4`);
    else if (legs.some(q => !pads.some(p => Math.abs(p.y1 - q.y0) < EPS
                                            && q.x >= p.x - EPS && q.x + q.w <= p.x + p.w + EPS
                                            && q.z >= p.z - EPS && q.z + q.d <= p.z + p.d + EPS)))
      e.push(`có chân bồn ${t.id} không đứng trọn trên bản đế nào`);
    /* Kiềng: hai thanh bắc **ngang trục bồn**, mặt trên đúng cốt đáy thân, và phải chạy qua **đường tim đáy
       trụ** — chính chỗ bồn tì xuống. Thiếu kiềng thì bồn treo lơ lửng trên bốn chân ở góc: hộp bao chạm chân
       nhưng mặt trụ ở đó đã cong lên cao hơn. Đúng lỗi đã gặp. */
    const cradles = m.boxes.filter(b => b.id === t.id && b.kind === 'tankCradle');
    if (cradles.length !== 2) e.push(`bồn nước ${t.id} dựng ${cradles.length} thanh kiềng, cần 2`);
    else {
      const mid = t.axis === 'x' ? bd.z + bd.d / 2 : bd.x + bd.w / 2;
      for (const c of cradles) {
        if (Math.abs(c.y1 - bd.y0) > EPS || Math.abs(c.y0 - t.legTop) > EPS)
          e.push(`thanh kiềng bồn ${t.id} ở cốt ${n(c.y0)}–${n(c.y1)}, cần ${n(t.legTop)}–${n(bd.y0)}`);
        const [s0, s1] = t.axis === 'x' ? [c.z, c.z + c.d] : [c.x, c.x + c.w];
        if (mid < s0 + EPS || mid > s1 - EPS)
          e.push(`thanh kiềng bồn ${t.id} chạy ${n(s0)}–${n(s1)}, không qua đường tim đáy trụ ${n(mid)}`);
      }
    }
  }

  /* 23 — giàn phơi, lấy từ khối đã dựng. Mặt cắt phải đúng **tam giác ngược**: hai trụ ở hai đầu tuyến đứng
     từ cốt sân lên đầu trụ; bốn tay chìa, mỗi trụ hai tay, chân ở đầu trụ và ngọn cao hơn; hai thanh phơi chạy
     suốt tuyến, lệch đều hai bên đúng tầm chìa và nằm trên ngọn tay. Hai thanh chồng lên nhau hay thanh tụt
     vào giữa đều lộ ở đây. */
  for (const r of racksOf(plan)) {
    if (r.errors.length) { e.push(...r.errors); continue; }
    const mine = m.boxes.filter(b => b.id === r.id);
    const posts = mine.filter(b => b.kind === 'rack'), bars = mine.filter(b => b.kind === 'rackBar');
    const arms = m.prisms.filter(b => b.id === r.id && b.kind === 'rackArm');
    if (posts.length !== 2) e.push(`giàn phơi ${r.id} dựng ${posts.length} trụ, cần 2`);
    else if (posts.some(p => Math.abs(p.y0 - r.base) > EPS || Math.abs(p.y1 - r.headTop) > EPS))
      e.push(`trụ giàn phơi ${r.id} không đứng từ cốt sân ${n(r.base)} lên đầu trụ ${n(r.headTop)}`);
    if (arms.length !== 4) e.push(`giàn phơi ${r.id} dựng ${arms.length} tay chìa, cần 4`);
    else if (arms.some(q => Math.abs(Math.min(...q.yb) - r.headTop) > EPS || Math.max(...q.yb) <= r.headTop + EPS))
      e.push(`tay chìa giàn phơi ${r.id} không vươn chéo lên từ đầu trụ ${n(r.headTop)}`);
    if (bars.length !== 2) { e.push(`giàn phơi ${r.id} dựng ${bars.length} thanh phơi, cần 2`); continue; }
    for (const side of [-1, 1]) {
      const want = r.pos + side * r.spread;
      const bar = bars.find(b => Math.abs(((r.ax === 'h' ? b.z + b.d / 2 : b.x + b.w / 2)) - want) < EPS);
      if (!bar) { e.push(`giàn phơi ${r.id} thiếu thanh phơi lệch ${n(side * r.spread)} khỏi tuyến`); continue; }
      if (Math.abs((bar.y0 + bar.y1) / 2 - r.barMid) > EPS)
        e.push(`thanh phơi ${r.id} lệch ${n(side * r.spread)} nằm ở cốt ${n((bar.y0 + bar.y1) / 2)}, cần ${n(r.barMid)}`);
      const [s0, s1] = r.ax === 'h' ? [bar.x, bar.x + bar.w] : [bar.z, bar.z + bar.d];
      if (s0 > r.a + EPS || s1 < r.b - EPS)
        e.push(`thanh phơi ${r.id} chỉ chạy ${n(s0)}–${n(s1)}, tuyến ${n(r.a)}–${n(r.b)}`);
    }
  }

  /* 24 — màu và nhóm ẩn mái. Hai chỗ hỏng lặng lẽ mà 23 phép trên không thấy vì chúng chỉ soi hình học:
     thêm một loại khối mà quên khai màu thì nó rơi về màu tường và trông "gần đúng"; thêm một khối đứng
     trên mái mà quên cho vào ROOF_KINDS thì bấm "Ẩn mái" xong nó vẫn che mất phần trong nhà. Đọc thẳng
     components/palette.js — cùng một nguồn scene3d.js dùng, không phải danh sách chép lại. */
  for (const b of [...m.boxes, ...m.prisms])
    if (!COLORS[b.kind] && !GLASS_KINDS.has(b.kind)) {
      e.push(`loại khối '${b.kind}' không có màu khai trong palette.js — 3D sẽ tô nhầm màu tường`);
      break;
    }
  for (const g of m.glass)
    if (!GLASS_KINDS.has(g.kind) && !COLORS[g.kind]) {
      e.push(`loại kính '${g.kind}' không có trong palette.js`);
      break;
    }
  /* Đứng **trên mặt mái đi lại được** thì phải bị "Ẩn mái" giấu. Suy từ cao độ chứ không chép danh sách:
     thêm khối mới trên mái là lộ ngay. */
  const onRoof = [...m.boxes, ...m.prisms, ...m.glass].find(b => b.y0 > walkTop - EPS && !ROOF_KINDS.has(b.kind));
  if (onRoof) e.push(`khối '${onRoof.kind}' đứng ở cốt ${n(onRoof.y0)}, trên mặt mái ${n(walkTop)}, mà "Ẩn mái" không giấu`);

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
