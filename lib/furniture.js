/* Mã và số đo lấy trực tiếp từ bản hiện hành, dùng chung cho nhãn 2D, bảng chú thích và đặc tả. */
export function furnitureOf(plan,index){
  const f=plan.house.floors[index];
  return f.furniture.map(([kind,x,y,w,d,meta={}])=>({kind,x,y,w,d,...meta,
    room:f.rooms.find(r=>r.id===meta.roomId)?.name??'DƯỚI CẦU THANG',
    length:Math.max(w,d),depth:Math.min(w,d)}));
}

export function furnitureClearance(item){
  if(!item.clearance)return null;
  const {x,y,w,d,clearance:{side,depth}}=item;
  return side==='left'?{x:x-depth,y,w:depth,d}:side==='right'?{x:x+w,y,w:depth,d}
    :side==='front'?{x,y:y-depth,w,d:depth}:{x,y:y+d,w,d:depth};
}

export const FURNITURE_SOURCES=[
  {name:'Khung giường và đệm 160 × 200 cm — IKEA',url:'https://www.ikea.com/fi/en/p/malm-bed-frame-high-white-s09929373/'},
  {name:'Bàn ăn 4 người 120 × 75 cm — IKEA',url:'https://www.ikea.com.tr/en/product/ingo-pine-seats-4-kitchen-table-14630009'},
  {name:'Bàn làm việc 120 × 60 cm — IKEA',url:'https://www.ikea.com.cy/en/products/lagkapten-adils-desk-120x60-cm/79030508/'},
  {name:'Bồn cầu 700 × 395 × 747 mm — TOTO',url:'https://vn.toto.com/en/cs769drw11-2/'},
];
