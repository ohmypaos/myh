/* ═══════════ MÔ HÌNH LƯỚI ═══════════
   Đổi một mặt bằng (toạ độ tuyệt đối) thành mô hình lưới và ngược lại.

   Vì sao lưới chứ không phải "chồng phòng": hành lang L9 chạy y 17→24, vắt qua ba băng
   ngang, nên không nằm gọn trong chồng nào. Lưới thì diễn tả được — nó chỉ bám vào đường
   17 và 24. Xem roadmap mục E2.

   Lưới là mô hình **suy ra lúc nạp**, không phải định dạng lưu. lib/versions/*.js vẫn giữ
   toạ độ tuyệt đối, nên validate(), spec/ và massing.js không phải biết gì về file này.

   Đã nghiệm: mọi tường và mọi lỗ mở ở cả 12 phương án đều bám đúng đường lưới, không ngoại lệ.

   ── Neo cái gì vào đâu ──
   Mép phòng, vị trí tường, vị trí lỗ mở  → bám thẳng vào một đường lưới.
   Bề dài lỗ mở, nội thất, giếng trời     → neo vào đường lưới gần nhất về phía nhỏ, **giữ
                                             nguyên kích thước**. Cửa rộng 0.9 m dịch tường
                                             xong vẫn phải rộng 0.9 m, không được co giãn
                                             theo tỉ lệ. */

import { LOT } from './lot.js';

const EPS = 1e-6;

/* Chỉ số của đường lưới trùng với v. Ném lỗi nếu không có — dữ liệu nào không bám lưới thì
   phải biết ngay, đừng lặng lẽ nắn về đường gần nhất. */
function lineAt(lines, v, what){
  const i = lines.findIndex(x => Math.abs(x - v) < EPS);
  if (i < 0) throw new Error(`${what}: ${v} không nằm trên đường lưới nào`);
  return i;
}

/* Đường lưới gần nhất về phía nhỏ — dùng làm gốc neo cho những thứ giữ nguyên kích thước. */
function baseLine(lines, v){
  let i = 0;
  for (let k = 0; k < lines.length; k++) if (lines[k] <= v + EPS) i = k;
  return i;
}

/* Chỉ số đường lưới trùng với v, hoặc −1. */
const findLine = (lines, v) => lines.findIndex(x => Math.abs(x - v) < EPS);

/* Một cạnh của mái nhẹ: mép nào trùng đường lưới thì bám đường, mép nào không thì **giữ bề
   phủ** so với mép kia. Mái bàn trà phủ y 15→18: mép 18 là tường bếp, mép 15 lửng giữa sân —
   dịch tường bếp thì cả mái đi theo, vẫn phủ 3 m, chứ không bị kéo dãn ra. */
function toSpan(lines, a, b, what){
  const ia = findLine(lines, a), ib = findLine(lines, b);
  if (ia >= 0 && ib >= 0) return { a: ia, b: ib };
  if (ib >= 0) return { b: ib, len: b - a };
  if (ia >= 0) return { a: ia, len: b - a };
  return { at: anchor(lines, a), len: b - a, what };
}

function fromSpan(lines, s){
  if (s.a != null && s.b != null) return [lines[s.a], lines[s.b]];
  if (s.b != null) return [lines[s.b] - s.len, lines[s.b]];
  if (s.a != null) return [lines[s.a], lines[s.a] + s.len];
  const a = unanchor(lines, s.at);
  return [a, a + s.len];
}

const anchor = (lines, v) => {
  const base = baseLine(lines, v);
  return { base, off: v - lines[base] };
};
const unanchor = (lines, a) => lines[a.base] + a.off;

/* Neo vào đường lưới **gần nhất về cả hai phía**, giữ độ lệch có dấu. Dành cho thứ khai theo **mặt tường**
   chứ không theo tim: mép lỗ thang y = 18.95 là mặt trong vách PN1 ở đường 19.0, neo về phía nhỏ (đường 18)
   là dịch vách PN1 thì lỗ thang đứng yên. Nội thất thì không dùng cách này — nó neo vào gốc phòng chứa nó,
   xem ghi chú ở inRoom(). */
const nearAnchor = (lines, v) => {
  let base = 0;
  for (let k = 1; k < lines.length; k++)
    if (Math.abs(lines[k] - v) < Math.abs(lines[base] - v)) base = k;
  return { base, off: v - lines[base] };
};

/* ═══════════ TUYỆT ĐỐI → LƯỚI ═══════════ */

export function toGrid(plan){
  /* Ngoài mép phòng, đầu một vách hồi ngắn cũng là một mốc hình học thật: nếu không đưa nó vào
     lưới thì không thể dựng ngược hay kéo chính xác vách đó. */
  const xs = [...new Set([
    ...plan.rooms.flatMap(r => [r[2], r[2] + r[4]]),
    ...plan.walls.flatMap(([ax, pos, a, b]) => ax === 'h' ? [a, b] : [pos]),
  ])].sort((a, b) => a - b);
  const ys = [...new Set([
    ...plan.rooms.flatMap(r => [r[3], r[3] + r[5]]),
    ...plan.walls.flatMap(([ax, pos, a, b]) => ax === 'h' ? [pos] : [a, b]),
  ])].sort((a, b) => a - b);

  const X = (v, w) => lineAt(xs, v, w);
  const Y = (v, w) => lineAt(ys, v, w);

  const rooms = plan.rooms.map(([id, name, x, y, w, h, type]) => ({
    id, name, type,
    x0: X(x, `phòng ${id} x`), x1: X(x + w, `phòng ${id} x+w`),
    y0: Y(y, `phòng ${id} y`), y1: Y(y + h, `phòng ${id} y+h`),
  }));

  const walls = plan.walls.map(([ax, pos, a, b, t, material]) => {
    const core = ax === 'h'
      ? { ax, pos: Y(pos, 'tường h'), a: X(a, 'tường h a'), b: X(b, 'tường h b'), t }
      : { ax, pos: X(pos, 'tường v'), a: Y(a, 'tường v a'), b: Y(b, 'tường v b'), t };
    return material === undefined ? core : { ...core, material };
  });

  /* Lỗ mở: vị trí bám đường, còn bề dài neo vào đường nhỏ hơn và giữ nguyên chiều rộng. */
  const opening = (ax, pos, a, b, what) => {
    const along = ax === 'h' ? xs : ys;
    return {
      pos: ax === 'h' ? Y(pos, what) : X(pos, what),
      at: anchor(along, a),
      len: b - a,
    };
  };

  const doors = plan.doors.map(d => ({ rest: d, ...opening(d[1], d[2], d[3], d[4], `cửa ${d[0]}`) }));
  const windows = plan.windows.map(w => ({ rest: w, ...opening(w[1], w[2], w[3], w[4], `cửa sổ ${w[0]}`) }));
  const gates = plan.gates.map(g => ({ rest: g, ...opening(g[0], g[1], g[2], g[3], 'cổng') }));

  /* Nội thất và lấy sáng mái neo vào **gốc phòng chứa nó**, không phải đường lưới gần nhất.
     Neo vào đường gần nhất là sai và sai lặng lẽ: chậu rửa ở y = 24.3 nằm trong BẾP (gốc
     y = 18) lại bám vào đường 24 của master, còn bếp nấu ở y = 21.9 bám đường 19 — hai món
     cùng một phòng neo vào hai đường khác nhau, dịch một đường là chúng trôi ra xa nhau. */
  const holds = (r, x, y, w, h) =>
    x >= r[2] - 0.01 && y >= r[3] - 0.01 &&
    x + w <= r[2] + r[4] + 0.01 && y + h <= r[3] + r[5] + 0.01;

  const inRoom = (x, y, w, h) => {
    const r = plan.rooms.find(rm => holds(rm, x, y, w, h));
    return r
      ? { x: { base: X(r[2], 'gốc phòng x'), off: x - r[2] },
          y: { base: Y(r[3], 'gốc phòng y'), off: y - r[3] } }
      : { x: anchor(xs, x), y: anchor(ys, y) };   // không phòng nào chứa — về cách neo chung
  };

  const skylights = plan.skylights.map(([id, name, x, y, w, h, desc]) => ({
    id, name, desc, ...inRoom(x, y, w, h), w, h,
  }));

  const furn = plan.furn.map(([kind, x, y, w, h]) => ({
    kind, ...inRoom(x, y, w, h), w, h,
  }));

  const strips = plan.strips.map(([a, b]) => [Y(a, 'strip a'), Y(b, 'strip b')]);

  const dims = {
    left:   plan.dims.left.map(v => Y(v, 'dims.left')),
    bottom: plan.dims.bottom.map(v => X(v, 'dims.bottom')),
    innerY: Y(plan.dims.innerY, 'dims.innerY'),
    innerX: plan.dims.innerX.map(v => X(v, 'dims.innerX')),
  };

  /* Mái hiên bám tường nên neo như tường: vị trí và hai đầu vào đường lưới, bề đua giữ nguyên.
     Chỉ có ở mặt bằng nào khai nó — thêm khoá rỗng vào bản khác là phép thử khứ hồi lệch. */
  const overhangs = plan.overhangs?.map(([ax, pos, a, b, depth, desc]) => ax === 'h'
    ? { ax, pos: Y(pos, 'mái hiên'), a: X(a, 'mái hiên a'), b: X(b, 'mái hiên b'), depth, desc }
    : { ax, pos: X(pos, 'mái hiên'), a: Y(a, 'mái hiên a'), b: Y(b, 'mái hiên b'), depth, desc });

  /* Tường nâng lên hết chiều cao nhà: vị trí và hai đầu bám đường lưới như tường. */
  /* Đoạn rào xây kín: neo hệt tường nâng — vị trí và hai đầu bám đường lưới. */
  const solidFences = plan.solidFences?.map(([ax, pos, a, b, top]) => ax === 'h'
    ? { ax, pos: Y(pos, 'rào kín'), a: X(a, 'rào kín a'), b: X(b, 'rào kín b'), top }
    : { ax, pos: X(pos, 'rào kín'), a: Y(a, 'rào kín a'), b: Y(b, 'rào kín b'), top });

  const fullHeightWalls = plan.fullHeightWalls?.map(([ax, pos, a, b]) => ax === 'h'
    ? { ax, pos: Y(pos, 'tường nâng'), a: X(a, 'tường nâng a'), b: X(b, 'tường nâng b') }
    : { ax, pos: X(pos, 'tường nâng'), a: Y(a, 'tường nâng a'), b: Y(b, 'tường nâng b') });

  /* Mái nhẹ neo vào lưới như tường: dịch tường x = 5 hay y = 18 là mái đi theo. Mép nào không
     nằm trên đường lưới thì giữ bề phủ so với mép kia (toSpan). Cao độ không dính lưới. */
  const roofs = plan.roofs?.map(r => ({
    rest: r,
    x: toSpan(xs, r.at[0], r.at[2], `mái ${r.id} x`),
    y: toSpan(ys, r.at[1], r.at[3], `mái ${r.id} y`),
  }));

  /* Cột đỡ mái: như lỗ mở — neo vào đường lưới gần nhất phía nhỏ, giữ độ lệch. Cột nằm đúng trên đường
     (góc bếp y = 18) thì độ lệch 0, bám đường; cột giữa nhịp (y = 15) đi theo đường phía trên nó. */
  const posts = plan.posts?.map(([id, x, y]) => ({ id, x: anchor(xs, x), y: anchor(ys, y) }));

  /* Lớp chống nóng mái chọn mái đổ ra ngoài theo tường nó bám — neo vị trí vào đường lưới như mái hiên, không
     thì kéo tường y = 28 là trần ban công đi mà tham chiếu đứng lại, validate() báo và trần mất lớp. */
  const roofInsulation = plan.roofInsulation && {
    ...plan.roofInsulation,
    overhangs: (plan.roofInsulation.overhangs || []).map(([ax, pos]) =>
      ({ ax, pos: ax === 'h' ? Y(pos, 'lớp chống nóng') : X(pos, 'lớp chống nóng') })),
  };

  /* Cầu thang lên mái: `at` là lọt lòng buồng thang, tức **mặt tường** — ba mép bám mặt của ba đường lưới
     (nearAnchor). Mép x lớn thì **không** neo vào lưới: nó là đầu vế 2, do `width`, `tread` và số nấc quyết
     định (stairsOf kiểm đúng chuyện đó), nên giữ nguyên bề dài chạy so với mép x nhỏ. */
  const stairs = plan.stairs?.map(s => {
    const [x0, y0, x1, y1] = s.at;
    const { at, ...rest } = s;
    return { rest, x: nearAnchor(xs, x0), run: x1 - x0, y0: nearAnchor(ys, y0), y1: nearAnchor(ys, y1) };
  });

  /* Tum: ba cạnh bám lưới như tường, cạnh x lớn áp sát đầu vế 2 nên đi theo thang — giữ bề ngang.
     Cửa tum nằm trên một cạnh của tum, neo theo **chính cạnh ấy**; bề dài cửa giữ nguyên như mọi lỗ mở. */
  const tum = plan.tum && (() => {
    const [x0, y0, x1, y1] = plan.tum.at;
    const edges = { v: [x0, x1], h: [y0, y1] };
    const doors = (plan.tum.doors || []).map(([ax, pos, a, b, ...rest]) => {
      const i = edges[ax].findIndex(e => Math.abs(e - pos) < EPS);
      if (i < 0) throw new Error(`cửa tum trục ${ax} ${pos}: không nằm trên cạnh nào của tum`);
      const along = ax === 'h' ? xs : ys;
      return { ax, edge: i, at: anchor(along, a), len: b - a, rest };
    });
    return { x: nearAnchor(xs, x0), w: x1 - x0, y0: nearAnchor(ys, y0), y1: nearAnchor(ys, y1), doors };
  })();

  /* Lan can mái: tuyến khai liền, cả ba số đều là mép mái hay tim tường — bám mặt đường gần nhất. Tuyến
     trước ở y = 10.73 là mép ngoài bản hiên, neo vào đường 12 mà nó đua ra từ đó. */
  const roofRailings = plan.roofRailings?.map(([ax, pos, a, b]) => {
    const [across, along] = ax === 'h' ? [ys, xs] : [xs, ys];
    return { ax, pos: nearAnchor(across, pos), a: nearAnchor(along, a), b: nearAnchor(along, b) };
  });

  /* Bồn nước: góc nhỏ hình chiếu bám mặt đường gần nhất, như lan can mái. Kích thước là của cái bồn, ở
     TANK — không co giãn theo lưới. */
  const tanks = plan.tanks?.map(([id, x, y, axis]) =>
    ({ id, axis, x: nearAnchor(xs, x), y: nearAnchor(ys, y) }));

  /* Giàn phơi: vị trí tuyến bám mặt đường gần nhất, còn **bề dài giữ nguyên** — nó là đồ mua sẵn, dịch
     tường thì nó đi theo chứ không dài ngắn ra. */
  const racks = plan.racks?.map(([id, ax, pos, a, b]) => {
    const [across, along] = ax === 'h' ? [ys, xs] : [xs, ys];
    return { id, ax, pos: nearAnchor(across, pos), at: nearAnchor(along, a), len: b - a };
  });

  return { meta: plan, xs, ys, rooms, walls, doors, windows, gates, skylights, furn, strips, dims,
           overhangs, fullHeightWalls, solidFences, roofs, posts, roofInsulation, stairs, tum, roofRailings, tanks, racks };
}

/* ═══════════ DỊCH MỘT ĐƯỜNG ═══════════
   Vì mọi thứ đã neo vào lưới nên lan truyền không cần mã riêng: đổi giá trị một đường rồi
   dựng lại là phòng, tường, cửa, giếng trời, nội thất và chuỗi kích thước tự đi theo.

   Đúng luật đã chốt — chỉ đụng liền kề, không lan xa hơn: chỉ những thứ bám vào **đúng
   đường đó** mới đổi, các đường khác đứng yên. */

export function withLine(g, axis, index, value){
  const lines = [...(axis === 'x' ? g.xs : g.ys)];
  lines[index] = value;
  return axis === 'x' ? { ...g, xs: lines } : { ...g, ys: lines };
}

/* Đường kéo được: mọi đường trừ bốn cạnh lô. Kèm khoảng kéo (hai đường kề) và tên các phòng
   áp vào — để nhãn thanh trượt nói được nó ngăn cách cái gì với cái gì. */
export function movableLines(g){
  const out = [];
  for (const axis of ['x', 'y']) {
    const lines = axis === 'x' ? g.xs : g.ys;
    const edge = axis === 'x' ? LOT.w : LOT.d;
    lines.forEach((value, index) => {
      if (Math.abs(value) < EPS || Math.abs(value - edge) < EPS) return;   // cạnh lô, cố định
      const lo = axis === 'x' ? 'x0' : 'y0', hi = axis === 'x' ? 'x1' : 'y1';
      const before = g.rooms.filter(r => r[hi] === index);   // phòng kết thúc ở đường này
      const after  = g.rooms.filter(r => r[lo] === index);   // phòng bắt đầu từ đường này
      out.push({
        axis, index, value,
        min: lines[index - 1], max: lines[index + 1],
        before: before.map(r => r.name),
        after:  after.map(r => r.name),
      });
    });
  }
  return out;
}

/* Kích thước lọt lòng của từng phòng sau khi dựng lại — để biết phòng nào bị ép quá.
   Trả về theo mã phòng, kèm cả kích thước tim tường lẫn lọt lòng. */
export function roomSizes(plan){
  const out = {};
  for (const [id, name, , , w, h] of plan.rooms) out[id] = { name, w, h };
  return out;
}

/* ═══════════ LƯỚI → TUYỆT ĐỐI ═══════════ */

/* areas là số suy ra, không phải số khai — dịch một đường là nó đổi. Tính lại đúng cách mà
   validate() và specMarkdown() trông đợi: san = diện tích lô trừ phần kín và hành lang ngoài. */
function areasOf(rooms){
  const A = r => r[4] * r[5];
  const kin = rooms.filter(r => r[6] !== 'yard' && r[0] !== 'R3').reduce((s, r) => s + A(r), 0);
  const hl  = rooms.filter(r => r[0] === 'R3').reduce((s, r) => s + A(r), 0);
  const n = x => +x.toFixed(2);
  return { kin: n(kin), hl: n(hl), san: n(LOT.w * LOT.d - kin - hl) };
}

export function fromGrid(g){
  const { xs, ys } = g;

  const rooms = g.rooms.map(r =>
    [r.id, r.name, xs[r.x0], ys[r.y0], xs[r.x1] - xs[r.x0], ys[r.y1] - ys[r.y0], r.type]);

  const walls = g.walls.map(w => {
    const core = w.ax === 'h'
      ? ['h', ys[w.pos], xs[w.a], xs[w.b], w.t]
      : ['v', xs[w.pos], ys[w.a], ys[w.b], w.t];
    return w.material === undefined ? core : [...core, w.material];
  });

  /* Lỗ mở giữ nguyên thứ tự và mọi trường khác của tuple gốc, chỉ thay bốn số toạ độ. */
  const place = (o, ax, iPos, iA, iB) => {
    const out = [...o.rest];
    const along = ax === 'h' ? xs : ys;
    const a = unanchor(along, o.at);
    out[iPos] = ax === 'h' ? ys[o.pos] : xs[o.pos];
    out[iA] = a;
    out[iB] = a + o.len;
    return out;
  };

  const doors   = g.doors.map(o => place(o, o.rest[1], 2, 3, 4));
  const windows = g.windows.map(o => place(o, o.rest[1], 2, 3, 4));
  const gates   = g.gates.map(o => place(o, o.rest[0], 1, 2, 3));

  const skylights = g.skylights.map(s =>
    [s.id, s.name, unanchor(xs, s.x), unanchor(ys, s.y), s.w, s.h, s.desc]);

  const furn = g.furn.map(f => [f.kind, unanchor(xs, f.x), unanchor(ys, f.y), f.w, f.h]);

  const strips = g.strips.map(([a, b]) => [ys[a], ys[b]]);

  const dims = {
    left:   g.dims.left.map(i => ys[i]),
    bottom: g.dims.bottom.map(i => xs[i]),
    innerY: ys[g.dims.innerY],
    innerX: g.dims.innerX.map(i => xs[i]),
  };

  const overhangs = g.overhangs && g.overhangs.map(o => o.ax === 'h'
    ? ['h', ys[o.pos], xs[o.a], xs[o.b], o.depth, o.desc]
    : ['v', xs[o.pos], ys[o.a], ys[o.b], o.depth, o.desc]);

  const solidFences = g.solidFences && g.solidFences.map(w => {
    const core = w.ax === 'h' ? ['h', ys[w.pos], xs[w.a], xs[w.b]] : ['v', xs[w.pos], ys[w.a], ys[w.b]];
    return w.top === undefined ? core : [...core, w.top];
  });

  const fullHeightWalls = g.fullHeightWalls && g.fullHeightWalls.map(w => w.ax === 'h'
    ? ['h', ys[w.pos], xs[w.a], xs[w.b]]
    : ['v', xs[w.pos], ys[w.a], ys[w.b]]);

  const roofs = g.roofs && g.roofs.map(r => {
    const [x0, x1] = fromSpan(xs, r.x), [y0, y1] = fromSpan(ys, r.y);
    return { ...r.rest, at: [x0, y0, x1, y1] };
  });

  const posts = g.posts && g.posts.map(p => [p.id, unanchor(xs, p.x), unanchor(ys, p.y)]);

  const roofInsulation = g.roofInsulation && {
    ...g.roofInsulation,
    overhangs: g.roofInsulation.overhangs.map(o => [o.ax, o.ax === 'h' ? ys[o.pos] : xs[o.pos]]),
  };

  const stairs = g.stairs && g.stairs.map(s => {
    const x0 = unanchor(xs, s.x);
    return { ...s.rest, at: [x0, unanchor(ys, s.y0), x0 + s.run, unanchor(ys, s.y1)] };
  });

  const tum = g.tum && (() => {
    const x0 = unanchor(xs, g.tum.x), y0 = unanchor(ys, g.tum.y0), y1 = unanchor(ys, g.tum.y1);
    const at = [x0, y0, x0 + g.tum.w, y1];
    const edges = { v: [at[0], at[2]], h: [at[1], at[3]] };
    const doors = g.tum.doors.map(d => {
      const a = unanchor(d.ax === 'h' ? xs : ys, d.at);
      return [d.ax, edges[d.ax][d.edge], a, a + d.len, ...d.rest];
    });
    return { ...g.meta.tum, at, doors };
  })();

  const tanks = g.tanks && g.tanks.map(t => [t.id, unanchor(xs, t.x), unanchor(ys, t.y), t.axis]);

  const racks = g.racks && g.racks.map(r => {
    const [across, along] = r.ax === 'h' ? [ys, xs] : [xs, ys];
    const a = unanchor(along, r.at);
    return [r.id, r.ax, unanchor(across, r.pos), a, a + r.len];
  });

  const roofRailings = g.roofRailings && g.roofRailings.map(r => {
    const [across, along] = r.ax === 'h' ? [ys, xs] : [xs, ys];
    return [r.ax, unanchor(across, r.pos), unanchor(along, r.a), unanchor(along, r.b)];
  });

  return { ...g.meta, rooms, walls, doors, windows, gates, skylights, furn, strips, dims,
           ...(overhangs ? { overhangs } : {}), ...(fullHeightWalls ? { fullHeightWalls } : {}), ...(solidFences ? { solidFences } : {}),
           ...(roofs ? { roofs } : {}), ...(posts ? { posts } : {}),
           ...(roofInsulation ? { roofInsulation } : {}),
           ...(stairs ? { stairs } : {}), ...(tum ? { tum } : {}),
           ...(roofRailings ? { roofRailings } : {}), ...(tanks ? { tanks } : {}), ...(racks ? { racks } : {}), areas: areasOf(rooms) };
}
