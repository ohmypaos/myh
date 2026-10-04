import { NEIGHBOR_LOTS, heightsOf } from './lot.js';

/* Chỉ thêm ba cạnh ngoài mỗi lô; cạnh giáp nhà dùng tường có sẵn.
   Các hộp kết thúc ở mặt tường nối tiếp để góc kín mà không chồng khối. */
export function buildSurroundings(plan){
  const H = heightsOf(plan);
  const boxes = [];
  for (const lot of NEIGHBOR_LOTS) {
    const left = lot.x < 0;
    const shared = left ? lot.x + lot.w : lot.x;
    const thickness = plan.walls.find(w => w[0] === 'v' && w[1] === shared)?.[4] ?? 0.22;
    const half = thickness / 2;
    const outer = left ? lot.x : lot.x + lot.w;
    const x = lot.x + half;
    boxes.push({ ...lot, y0:-0.12, y1:0, kind:'ground' });
    boxes.push({ x:outer-half, z:lot.z-half, w:thickness, d:lot.d+thickness,
      y0:0, y1:H.fencePrivate, kind:'fenceWall' });
    for (const z of [lot.z-half, lot.z+lot.d-half])
      boxes.push({ x, z, w:lot.w-thickness, d:thickness,
        y0:0, y1:H.fencePrivate, kind:'fenceWall' });
  }
  return boxes;
}

/* Nhà hàng xóm chỉ là khối bao để thấy kích thước và bóng đổ.
   Hai mặt bên chạm mặt trong tường bao, không dựng thêm tường trùng.
   Khoảng lùi và chiều sâu theo tim tường; trần hiên đo tới mặt dưới bản. */
export function buildNeighborHouse(plan){
  const lot = NEIGHBOR_LOTS.find(l => l.house);
  const h = lot.house;
  const thickness = plan.walls.find(w => w[0] === 'v' && w[1] === lot.x)?.[4] ?? 0.22;
  const front = lot.z+lot.d-h.rearGap-h.depth;
  const footprint = { x:lot.x+thickness/2, z:front+h.porchDepth,
    w:lot.w-thickness, d:h.depth-h.porchDepth };
  const porch = { ...footprint, z:front, d:h.porchDepth };
  const yard = { ...porch, z:porch.z-h.yard.depth, d:h.yard.depth };
  const top = h.ceiling+h.roofRise;
  const porchTop = h.ceiling+0.20;
  const tile = 0.12;
  const boxes = [
    { ...footprint, y0:0, y1:h.ceiling, kind:'houseWall' },
    { ...porch, y0:h.ceiling, y1:porchTop, kind:'overhang' },
  ];
  /* Tường bao hiên xây từ mặt đất lên sát mặt dưới trần.
     Cắt hai cạnh bên ở mặt tường trước/sau để góc khép kín, không chồng khối. */
  const porchWalls = [
    { ...porch, d:thickness },
    { ...porch, z:porch.z+porch.d-thickness, d:thickness },
    { ...porch, z:porch.z+thickness, w:thickness, d:porch.d-2*thickness },
    { ...porch, x:porch.x+porch.w-thickness, z:porch.z+thickness,
      w:thickness, d:porch.d-2*thickness },
  ];
  for (const wall of porchWalls)
    boxes.push({ ...wall, y0:0, y1:h.ceiling,
      kind:'houseWall', part:'porchWall' });
  const prisms = [];
  /* Mái sân nối vào mặt trước hiên, mép cao dưới trần 0.10 m;
     mép thấp hướng ra sân ở cốt 3.50 m. Hai hàng cột đỡ, đầu sau tựa tường hiên. */
  const yardHigh = h.ceiling-0.10;
  const sheet = 0.05;
  prisms.push({ ...yard, axis:'z', yb:[h.yard.low,yardHigh],
    yt:[h.yard.low+sheet,yardHigh+sheet], y0:h.yard.low, y1:yardHigh+sheet, kind:'metalRoof' });
  const post = 0.10;
  for (const z of [yard.z, yard.z+yard.d/2])
    for (const x of [yard.x, yard.x+yard.w-post]) {
      const height = at => h.yard.low+(yardHigh-h.yard.low)*(at-yard.z)/yard.d;
      prisms.push({ x, z, w:post, d:post, axis:'z', yb:[0,0],
        yt:[height(z),height(z+post)], y0:0, y1:height(z+post), kind:'post' });
    }
  for (const back of [false, true]) {
    const rect = { ...footprint, z:footprint.z+(back ? footprint.d/2 : 0), d:footprint.d/2, axis:'z' };
    const lower = back ? [top-tile,h.ceiling] : [h.ceiling,top-tile];
    const upper = lower.map(y => y+tile);
    prisms.push({ ...rect, yb:[h.ceiling,h.ceiling], yt:lower,
      y0:h.ceiling, y1:top-tile, kind:'houseWall' });
    prisms.push({ ...rect, yb:lower, yt:upper,
      y0:h.ceiling, y1:top, kind:'gateRoofTile' });
  }
  return { footprint, porch, yard, boxes, prisms, top };
}
