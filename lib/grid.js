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

const anchor = (lines, v) => {
  const base = baseLine(lines, v);
  return { base, off: v - lines[base] };
};
const unanchor = (lines, a) => lines[a.base] + a.off;

/* ═══════════ TUYỆT ĐỐI → LƯỚI ═══════════ */

export function toGrid(plan){
  const xs = [...new Set(plan.rooms.flatMap(r => [r[2], r[2] + r[4]]))].sort((a, b) => a - b);
  const ys = [...new Set(plan.rooms.flatMap(r => [r[3], r[3] + r[5]]))].sort((a, b) => a - b);

  const X = (v, w) => lineAt(xs, v, w);
  const Y = (v, w) => lineAt(ys, v, w);

  const rooms = plan.rooms.map(([id, name, x, y, w, h, type]) => ({
    id, name, type,
    x0: X(x, `phòng ${id} x`), x1: X(x + w, `phòng ${id} x+w`),
    y0: Y(y, `phòng ${id} y`), y1: Y(y + h, `phòng ${id} y+h`),
  }));

  const walls = plan.walls.map(([ax, pos, a, b, t]) => ax === 'h'
    ? { ax, pos: Y(pos, 'tường h'), a: X(a, 'tường h a'), b: X(b, 'tường h b'), t }
    : { ax, pos: X(pos, 'tường v'), a: Y(a, 'tường v a'), b: Y(b, 'tường v b'), t });

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

  return { meta: plan, xs, ys, rooms, walls, doors, windows, gates, skylights, furn, strips, dims };
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

  const walls = g.walls.map(w => w.ax === 'h'
    ? ['h', ys[w.pos], xs[w.a], xs[w.b], w.t]
    : ['v', xs[w.pos], ys[w.a], ys[w.b], w.t]);

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

  return { ...g.meta, rooms, walls, doors, windows, gates, skylights, furn, strips, dims,
           areas: areasOf(rooms) };
}
