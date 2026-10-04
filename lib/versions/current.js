/* Mặt bằng hiện hành — file sống, sửa thẳng vào đây khi thiết kế đổi; git giữ lịch sử.
   Không thêm v13, v14… nữa. v1…v11 bên cạnh là kho đối chiếu, đóng băng. Xem CLAUDE.md.
   Khuôn đất hiện hành 8.5 × 30 m, lô chính 4.5 m và lô phụ 4 m. */
export default {
  id:'current', label:"Hiện hành — lô 8.5 × 30 m", date:"4/10/2026",
  note:"Khuôn đất 8.5 × 30 m: lô chính 4.5 m, lô phụ 4 m. Giữ bố cục nhà chính, hành lang trong và ban công sau; thu ngang các phòng theo nhà 4.5 m. Lô A bên cạnh rộng 4.5 m. Bỏ toàn bộ khối bếp + nhà ăn, hành lang ngoài, WC khách và mái che sân chính. Phần đất trả lại thành sân chính liên tục tới sân phơi; giữ mái sân phơi độc lập, hai vòi nước, máy giặt và giàn phơi. Bỏ trụ và mái cổng, cổng phủ hết ngang lô chính 4.5 m (lọt lòng 4.28 m giữa hai mặt tường); các đoạn phía trước cùng đỉnh cao 2.10 m so với sân trên. Cổng nằm thẳng hàng tường mặt tiền tại ranh trước, bỏ đoạn tường gấp khúc, cổng hạ ngang mặt đường; sân cổng bằng dài 2.3 m để mở cánh, dốc trong sân phụ dài 6.4 m lên nền cao 0.80 m (12.5%). Mặt đường minh hoạ rộng 4 m, ngang nền lô B. Nền đất/sân nhà mình và lô A cao hơn lô B 0.80 m; sàn nhà cao hơn sân 0.45 m.",
  changes:["Bỏ đoạn tường hồi gấp khúc tại x=4.5; đưa cổng về y=0 thẳng hàng tường mặt tiền. Sân mở cổng 2.3 m, dốc từ y=2.30 tới 8.70 m; bồn hoa lùi sau đầu dốc 0.25 m.","Bỏ hai trụ và toàn bộ mái cổng; bỏ hai đoạn tường ngang thu hẹp lối vào. Cổng phủ hết ngang lô chính 4.5 m, lọt lòng 4.28 m; cánh bắt vào tường hai bên. Sân mở cổng tăng lên 2.3 m, đèn cổng chuyển sang tường trái.","Khuôn 8.5 m: nhà/lô chính 4.5 m + lô phụ 4 m; lô A bên cạnh 4.5 m. Cổng thu còn 3.1 m để mái và hai trụ nằm trong ranh; hành lang trong giữ 1 m. Thang hai vế rộng 0.76 m, mặt bậc 0.25 m, 11 + 11 nấc.","Xây kín đoạn tường hồi trái vào cổng; nâng các đoạn thấp phía mặt cổng lên cùng đỉnh 2.10 m so với sân trên (2.90 m so với đường), nối sát hai trụ.","Lùi tim cổng và hai trụ vào sân 1 m: mái nằm trọn trong đất, mép ngoài cách ranh 0.15 m. Giữ khoảng bằng 2 m sau cổng để mở cánh, dốc nối tiếp phía trong.","Hạ cổng ngang mặt đường/nền lô B; sân bằng 2 m để mở cánh, dốc trong sân phụ dài 6.4 m lên 0.80 m (12.5%). Mặt đường rộng 4 m chỉ để minh hoạ.","Khuôn đất ngang <b>8.5 m</b>: lô chính 4.5 m + lô phụ 4 m; chiều sâu giữ 30 m, diện tích 255 m².","Bỏ khối bếp + nhà ăn, hành lang ngoài và WC khách, gồm tường, cửa, nội thất và hệ điện đi kèm.","Bỏ mái che sân chính và mái bếp; sân chính mở rộng thành 4 × 25 m, thông tới sân phơi 4 × 5 m.","Nâng nền đất/sân nhà mình và lô A cao hơn lô B <b>0.80 m</b>; sàn nhà cao hơn nền lô B 1.25 m.","Nâng tường giáp lô B bằng phía lô A: phần xây cao 0.80 m trên sân, đỉnh lan can cao 1.80 m trên sân; giữ chênh nền 0.80 m.","Giữ hành lang trong nhà và bố cục lô chính; mái sân phơi có cột đỡ độc lập, rào sau khép kín tới ranh 8.5 m."],
  warn:"Thang lên mái đã thu từ 0.90 xuống 0.76 m mỗi vế để vừa nhà 4.5 m; lối đi hẹp hơn bản cũ. Đường giả định ngang nền lô B, rộng 4 m để minh hoạ; chưa có số đo đường thực tế. <b>Bản hiện hành không còn bếp.</b> Vị trí nấu ăn mới chưa được bố trí. Sân chính không có mái: đường từ cửa phụ tới sân giặt/phơi đi ngoài trời. Mái sân phơi độc lập có máng và ống thoát nước ở mép thấp. Giữ hai vòi nước và máy giặt trên bệ nâng dưới mái sân phơi. Các phương án cũ vẫn giữ khuôn 9.5 × 30 m để đối chiếu.",
  areas:{"kin":65.25,"hl":0,"san":189.75},
  dims:{"left":[0,13.5,18.5,20.5,23,24.5,28,30],"bottom":[0,4.5,8.5],"innerY":18.5,"innerX":[0,3.5,4.5]},
  /* W2 và W3 là ô thoáng kính mờ PN1 ra buồng thang, đặt trên tầm mắt. */
  heights:{"fence":1.8,"fenceSolid":0.8,"fencePrivate":2.1,"only":{"W2":{"sill":2.4,"head":2.7,"hopper":0.12},"W3":{"sill":2.4,"head":2.7,"hopper":0.12}}},

  /* Nền sân nhà mình và lô A cao hơn lô B 0.80 m; tường giáp hai bên cùng cao tính từ sân. */
  site:{"groundRise":0.8,"access":{"gate":0,"landing":2.3,"length":6.4,"roadWidth":4},"neighborAWidth":4.5},
  dropCeilings:{},

  steps:{"D1":{"margin":0.09},"D2":{"margin":[0.2,0.04],"tread":0.25},"D13":{"margin":0.2,"tread":0.25}},
  floorLevels:{},
  /* Bản mái đổ ra ngoài tường: [trục, vị trí tường, từ, đến, đua ra, mô tả]. Phía đua suy từ phía
     không có phòng kín, bề đua tính từ mặt tường. Trần ban công đua 1.89 m = từ mặt tường master
     (28.11) tới tim tường rào sau (30.00). */
  overhangs:[
    ["h",13.5,0,4.5,1.2,"Mái hiên cửa chính — đổ liền bản mái nhà, công xôn không cột, che bậc D1"],
    ["h",28,0,4.5,1.89,"Trần ban công sau — đổ liền bản mái, gác lên tường trái; thay cho lam đứng D12"]
  ],
  /* Đoạn tường xây lên hết chiều cao nhà dù chỉ áp vào sân: [trục, vị trí, từ, đến]. Tường ranh
     trái của ban công — đỡ trần ban công và chắn nắng chiều hè Tây Tây Bắc (3d.md mục 2a). Tường
     phải của ban công (có cửa D13 ra sân phơi) cũng xây tới trần, không làm rào lan can. */
  fullHeightWalls:[
    ["v",0,28,30],
    ["v",4.5,28,30]
  ],

  solidFences:[
    ["h",0,4.39,8.5],
    ["v",0,0,1],
    ["h",30,0,8.5,1.8]
  ],

  roofInsulation:{ overhangs:[['h',13.5], ['h',28.0]] },
  /* Diềm mép mái hiên cửa chính (FASCIA trong lib/lot.js) — điểm nhấn mặt tiền nhìn thẳng từ cổng: qua mái ngói cổng
     (sống 3.0), mắt dừng đúng ở mép bản hiên và lan can mái. Chủ nhà chốt 12/9/2026. Dải 0.45 m bọc mép ngoài và đầu
     phía sân chính; đầu trái nằm trên ranh lô, không ốp. Trần ban công sau không làm — không nhìn thấy từ cổng. */
  overhangFascias:[['h',13.5]],

  roofs:[
    {"id":"RF3","name":"MÁI SÂN PHƠI","at":[4.5,25,8.5,28],"shape":"mono:y","h":[3.5,3.2],"mat":"tôn cách nhiệt","desc":"Mái sân phơi độc lập 4 × 3 m, dốc 10% về dải phơi hở phía sau; tựa tường nhà chính và hai cột ranh phải, máng thu nước ở mép thấp."}
  ],

  posts:[
    ["C1",8.5,25],
    ["C2",8.5,28]
  ],
  rooms:[
    ["L1","SÂN PHỤ",0,0,4.5,13.5,"yard"],
    ["L2","PHÒNG KHÁCH",0,13.5,4.5,5,"room"],
    ["L3","CẦU THANG",0,18.5,3.5,2,"circ"],
    ["L4","PHÒNG NGỦ 1",0,20.5,3.5,2.5,"room"],
    ["L5","WC CHUNG",0,23,2,1.5,"wet"],
    ["L6","TIỀN PHÒNG WC",2,23,1.5,1.5,"circ"],
    ["L7","PHÒNG NGỦ MASTER",0,24.5,4.5,3.5,"room"],
    ["L8","BAN CÔNG SAU",0,28,4.5,2,"yard"],
    ["L9","HÀNH LANG",3.5,18.5,1,6,"circ"],
    ["R1","SÂN CHÍNH",4.5,0,4,25,"yard"],
    ["R4","SÂN PHƠI / GIẶT",4.5,25,4,5,"yard"]
  ],
  walls:[
    ["h",0,4.39,8.5,0.22],
    ["h",30,0,8.5,0.22],
    ["v",0,0,30,0.22],
    ["v",8.5,0,30,0.22],
    ["h",13.5,0,4.5,0.22],
    ["h",28,0,4.5,0.22],
    ["v",4.5,13.5,28,0.22],
    ["v",4.5,28,30,0.22],
    ["h",18.5,0,3.16,0.1,"low"],
    ["h",20.5,0,3.5,0.1,"plastic"],
    ["h",23,0,3.5,0.1,"plastic"],
    ["h",24.5,0,4.5,0.1,"plastic"],
    ["v",3.5,20.5,23,0.1,"plastic"],
    ["v",2,23,24.5,0.1,"plastic"]
  ],
  doors:[
    ["D1","h",13.5,0.65,3.85,"quad","a",1,"","Sân phụ ↔ Phòng khách — CỬA CHÍNH 4 cánh, tâm x = 2.25"],
    ["D2","v",4.5,16.85,17.85,"swing","b",1,"","Sân chính ↔ Phòng khách — mở ra sân chính, bản lề phía cuối nhà"],
    ["D3","h",18.5,3.5,4.5,"open","","","","Phòng khách ↔ Hành lang — thông suốt, KHÔNG có cánh cửa"],
    ["D4","v",3.5,18.5,20.5,"open","","","","Hành lang ↔ Cầu thang — thông suốt, chân thang ở đầu bắc hành lang"],
    ["D5","v",3.5,20.59,21.39,"swing","a",-1,"","Hành lang ↔ Phòng ngủ 1 — sát vách buồng thang (chừa 4 cm khuôn), không chừa góc thừa"],
    ["D8","h",24.5,3.5,4.4,"swing","b",1,"","Hành lang ↔ Master — mở vào phòng"],
    ["D12","h",28,0.65,3.85,"slide","","","","Master ↔ Ban công sau — kính lùa 3.2 m, nguồn sáng duy nhất của master"],
    ["D13","v",4.5,28.6,29.4,"swing","b",-1,"","Ban công sau ↔ Sân phơi — mở vào ban công, chừa phía sân phơi cho bậc; bản lề phía tường bao sau"],
    ["D14","v",2,23.09,23.89,"swing","a",-1,"","Tiền phòng ↔ WC chung — cửa cánh 0.80 m mở vào WC, bản lề sát vách PN1 (chừa 4 cm khuôn) để cánh mở áp vách, gioăng kín mùi"]
  ],
  windows:[
    ["W1","v",4.5,14.33,16.13,"","Phòng khách ← Sân chính — 1.8 m, nằm giữa mặt trong tường mặt tiền và cửa D2, trụ hai bên 0.72 m"],
    ["W2","h",20.5,2.5,2.9,"","Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1"],
    ["W3","h",20.5,3,3.4,"","Phòng ngủ 1 ← Cầu thang — ô thoáng nhỏ, cánh kính mờ lật cố định ngả vào phòng, sát cửa PN1"]
  ],
  /* Bỏ hết giếng trời, cửa trời và ô thoáng trên mái (chủ nhà chốt 11/9/2026): sau này xây tầng 2 là phải bịt.
     Buồng thang dưới tum thay vai giếng trời; WC chung thoát mùi bằng quạt hút âm trần nối ống lên mái (warn). */
  skylights:[],
  /* Thang chữ U trong buồng 3.5 × 2 m: lỗ x=0.11–3.37, hai vế rộng 0.76 m,
     mặt bậc 0.25 m, 11 + 11 nấc. Tum áp đầu vế 2, cửa rộng 0.70 m. */
  stairs:[
    {"id":"CT1","name":"CẦU THANG LÊN MÁI","room":"L3","width":0.76,"tread":0.25,"risers":[11,11],"at":[0.11,18.55,3.37,20.45]}
  ],  /* Tum tường gạch 100, mái tôn, gọn trên buồng thang: tường đông áp sát đầu vế 2 (tim x = 3.92, mặt trong trùng mép lỗ
     thang), thay lan can mép lỗ. **Một cửa** trên tường ấy, ngay đầu vế 2 — bước lên hết thang là qua cửa ra mái, không
     có chiếu tới trong tum. Cánh mở ra phía mái (mở vào là quét lên bậc), then chốt mặt trong — từ mái không vào nhà tự
     do được. Bản lề đầu z nhỏ, cánh mở áp về phía bức lửng. Dỡ đi khi xây tầng 2. */
  tum:{"at":[0,18.5,3.42,20.5],"doors":[["v",3.42,18.61,19.31,"a",1]]},

  roofRailings:[
    ["h",12.23,0,4.5],
    ["v",0,12.23,30],
    ["h",30,0,4.5],
    ["v",4.5,12.23,30]
  ],
  /* Bồn nước inox 1000 L nằm ngang, **góc cuối nhà phía phải trên trần ban công sau** (chủ nhà chỉnh
     11/9/2026: dời sát mép sau và thẳng trục vòi nước sân phơi). Hình chiếu `x` 3.79–4.75, `y` 28.26–29.85.

     Thân **nằm dọc trục y, áp sát tường `x = 4.5`**: trần ban công gác lên hai tường bên `x = 0` và `x = 4.5`
     nên nó nhịp 5 m theo x — đặt dọc sát một gối là cả tấn nước nằm trong 1.2 m quanh gối, thay vì ra giữa
     nhịp. Chọn gối `x = 4.5` thay vì `x = 0` vì **hai vòi nước sân phơi nằm ngay dưới, áp mặt ngoài chính bức
     tường ấy** (`x` 5.11, `y` 26.15 và 27.25): ống cấp xuống chạy thẳng trong tuyến tường, không phải vòng
     ngang qua trần ban công.

     Chừa 0.14 khỏi mặt trong tường `x = 4.5` cho chỗ luồn tay, 0.15 khỏi tim rào sau — không đụng lan can mái
     tuyến nào. Đỉnh bồn cốt 5.65, thấp hơn tum. */
  tanks:[
    ["BN1",3.29,28.26,"y"]
  ],
  racks:[
    ["GP1","h",29.35,6,8]
  ],
  /* Cây xanh — phối cảnh (GARDEN trong lib/lot.js), chủ nhà yêu cầu 11/9/2026.
     Hai chậu cây hai bên bậc cửa chính D1: khe giữa mặt tường trái sân phụ (0.11) và mép trái bậc (0.60) chỉ 0.49 m,
     chậu Ø0.40 đặt giữa khe — tâm x 0.355; chậu kia đối xứng qua trục cửa x = 2.25. Tâm y giữa bề sâu hai bậc
     (11.29–11.89). Cả hai dưới mái hiên — không hứng mưa, phải tưới tay (warn). */
  planters:[
    ["CC1",0.355,13.09,"Trái bậc cửa chính D1 — giữa mặt tường trái sân phụ và mép bậc, dưới mái hiên"],
    ["CC2",4.145,13.09,"Phải bậc cửa chính D1 — đối xứng CC1 qua trục cửa x = 2.25, dưới mái hiên"],
    ["CC3",0.355,29.645,"Ban công sau — góc trái sát rào sau, dưới trần ban công"],
    ["CC4",4.145,29.645,"Ban công sau — góc phải sát rào sau, cạnh cửa D13, ngoài vùng quét cánh"]
  ],
  /* Hai cây giữ tán Ø3.30 trong ranh 8.5 m; lùi khỏi mái cổng để không chồng khối. */
  trees:[
    ["CX1",6.5,3.6,"Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m"],
    ["CX2",6.5,6.9,"Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m"]
  ],
  /* Bồn hoa bắt đầu y=8.95, lùi 0.25 m sau đầu dốc; đứng trên sân bằng,
     dừng tại mép mái hiên y=12.19. Bồn rộng 0.50 m, cao hơn sân 0.25 m. */
  flowerBeds:[
    ["BH1","v",0,8.95,12.19,"Dọc tường bao trái sân phụ, sau đoạn dốc tới mép mái hiên — hứng mưa trọn"]
  ],
  /* Cổng phủ hết lô chính 4.5 m theo tim, hai tường 220 mm để lại lọt lòng 4.28 m. */
  gates:[
    ["h",0,0.11,4.39,"CỔNG TOÀN NGANG 4.5m · LỌT LÒNG 4.28m"]
  ],
  /* Bỏ toàn bộ trụ xây, giằng và mái cổng. Cánh cổng bắt trực tiếp vào tường hai bên. */
  gateRoofs:[],
  /* Cổng sắt hai cánh nan đứng, bản lề tại mặt trong hai trụ; hai cánh mở vào sân bằng 2.3 m. */
  gateDoors:[{ id:'CG1', gate:0 }],
  /* Đèn trần, đèn thả: [mã, loại, x, y, mô tả] — tâm đèn. Loại ở LIGHT (lib/lot.js); cao độ suy ra: áp mặt dưới vật
     che thấp nhất ngay trên (bản mái, trần tôn, trần giả, mái hiên, mái nhẹ, giằng cổng).

     Nhà chính đổ bản bê tông thẳng, không trần giả, nên **đèn ốp nổi** và **ống luồn dây, hộp đấu phải đặt sẵn trong
     bản mái đúng các toạ độ dưới đây trước khi đổ** (warn). Đèn trần phòng ngủ không đặt thẳng trên mặt người nằm:
     master lệch về phía chân giường, PN1 giữa phòng mà giường áp tường trái. Mái sân chính: đèn tránh hàng xà gồ
     (y 13.2, 14.4, 15.6, 16.8) và dầm mép trước. Không đèn nào treo trên lỗ thang — cao 6 m trên bậc, không thay
     bóng được; buồng thang dùng đèn tường ở `wallLights`. */
  lights:[
    ["Đ2","outdoor",1.6,12.8,"Mái hiên cửa chính — rọi bậc D1, nửa trái"],
    ["Đ3","outdoor",3.4,12.8,"Mái hiên cửa chính — rọi bậc D1, nửa phải"],
    ["Đ4","panelL",1.3,14.75,"Phòng khách — lưới 2 × 2, trên sofa"],
    ["Đ5","panelL",3.7,14.75,"Phòng khách — lưới 2 × 2, lối từ cửa chính"],
    ["Đ6","panelL",1.3,17.25,"Phòng khách — lưới 2 × 2, giữa bàn nước và kệ thờ"],
    ["Đ7","panelL",3.7,17.25,"Phòng khách — lưới 2 × 2, trước kệ tivi và cửa D2"],
    ["Đ11","down",3.97,19.4,"Hành lang — đầu bắc, chân cầu thang"],
    ["Đ12","down",3.97,21.95,"Hành lang — giữa, trước cửa PN1"],
    ["Đ13","down",3.97,24.1,"Hành lang — đầu nam, trước WC chung và cửa master"],
    ["Đ14","panelL",2.03,21.75,"Phòng ngủ 1 — giữa phòng; phòng không cửa sổ ra trời, ban ngày cũng cần"],
    ["Đ17","damp",1.13,23.75,"WC chung — ốp trần chống ẩm, giữa phòng"],
    ["Đ18","down",2.9,23.75,"Tiền phòng WC — trước tủ đồ và cửa WC chung"],
    ["Đ20","panelL",2.5,26,"Master — lệch về phía chân giường, không chói mắt người nằm"],
    ["Đ21","down",1.9,24.7,"Master — lối vào từ D8"],
    ["Đ22","down",4.05,26.7,"Master — trên bàn làm việc"],
    ["Đ25","outdoor",1.6,29.05,"Ban công sau — dưới trần ban công, nửa trái"],
    ["Đ26","outdoor",3.4,29.05,"Ban công sau — dưới trần ban công, nửa phải"],
    ["Đ37","outdoor",6.5,26.5,"Sân phơi — dưới mái sân phơi"]
  ],
  /* Đèn tường: [mã, loại, trục, vị trí, dọc, hướng, cao, mô tả] — trên tường (trục, vị trí), tâm ở `dọc`, quay về
     phía `hướng`, tâm cao `cao` tính từ sàn phía đèn quay vào (tường tum: từ mặt mái).

     Cầu thang: đèn tường trái ở chiếu nghỉ và đèn trên lanh tô cửa tum, **công tắc hai chiều** chân thang / đầu
     thang. Đèn chiếu nghỉ cao 1.50 m trên chiếu nghỉ — với tới được, và thân đèn nằm dưới mép bản mái ở miệng lỗ thang. Đèn đầu thang
     cách bậc cuối 2.25 m. */
  wallLights:[
    ["Đ1","wallOut","v",0,0.5,1,2.3,"Cổng chính — đèn tường bên trái, không còn mái cổng"],
    ["Đ8","wall","v",0,20,1,3.2,"Cầu thang — tường trái ở chiếu nghỉ, nửa phía vế 1"],
    ["Đ9","wall","v",3.42,18.96,-1,2.35,"Đầu thang — trong tum, trên lanh tô cửa ra mái"],
    ["Đ10","wallOut","v",3.42,19.9,1,1.9,"Mái — mặt ngoài tum cạnh cửa, rọi sân thượng và lối tới bồn nước"],
    ["Đ15","wall","v",0,21.55,1,1.1,"Phòng ngủ 1 — đọc sách, đầu giường phía kệ"],
    ["Đ16","wall","v",0,22.75,1,1.1,"Phòng ngủ 1 — đọc sách, đầu giường phía vách kho"],
    ["Đ19","wall","h",24.5,1.625,-1,1.85,"WC chung — đèn gương trên lavabo, vách master"],
    ["Đ23","wall","v",0,24.825,1,1.1,"Master — đọc sách, trên tủ đầu giường phía cửa"],
    ["Đ24","wall","v",0,27.425,1,1.1,"Master — đọc sách, trên tủ đầu giường phía ban công"],
    ["Đ38","wallOut","v",4.5,26.7,1,2.1,"Sân giếng — rọi hai vòi nước và máy giặt"],
    ["Đ28","wallOut","v",4.5,14,1,2.3,"Sân chính — đèn tường phía trước"],
    ["Đ29","wallOut","v",4.5,18.2,1,2.3,"Sân chính — đèn tường gần cửa phụ D2"]
  ],

  lux:{"L2":150,"L4":100,"L5":100,"L6":100,"L7":100,"L9":100},
  /* Cụm đèn: [mã, tên, [mã đèn]] — mỗi hạt công tắc bật / tắt đúng một cụm, đèn nào cũng thuộc đúng một cụm. Chia cụm
     theo cách dùng chứ không theo phòng: phòng khách hai cụm để bật nửa phòng khi xem tivi; đèn trần, đèn phụ, đèn đầu
     giường master là ba cụm; đèn gương WC tách khỏi đèn trần; đèn thả bàn trà tách khỏi đèn sân chính. */
  lightGroups:[
    ["CĐ1","Cổng",["Đ1"]],
    ["CĐ2","Hiên cửa chính",["Đ2","Đ3"]],
    ["CĐ3","Phòng khách — phía sofa",["Đ4","Đ6"]],
    ["CĐ4","Phòng khách — phía lối đi",["Đ5","Đ7"]],
    ["CĐ5","Cầu thang",["Đ8","Đ9"]],
    ["CĐ6","Sân thượng",["Đ10"]],
    ["CĐ7","Hành lang",["Đ11","Đ12","Đ13"]],
    ["CĐ8","PN1 — đèn trần",["Đ14"]],
    ["CĐ9","PN1 — đầu giường",["Đ15","Đ16"]],
    ["CĐ10","WC chung — đèn trần",["Đ17"]],
    ["CĐ11","Tiền phòng WC",["Đ18"]],
    ["CĐ12","WC chung — gương",["Đ19"]],
    ["CĐ13","Master — đèn trần",["Đ20"]],
    ["CĐ14","Master — lối vào, bàn làm việc",["Đ21","Đ22"]],
    ["CĐ15","Master — đầu giường",["Đ23","Đ24"]],
    ["CĐ16","Ban công sau",["Đ25","Đ26"]],
    ["CĐ18","Sân chính",["Đ28","Đ29"]],
    ["CĐ22","Sân phơi",["Đ37"]],
    ["CĐ23","Sân giếng",["Đ38"]],
  ],

  switches:[
    ["BCT1","h",13.5,4.3,1,1.25,["CĐ3","CĐ4","CĐ2","CĐ1"],"Phòng khách — trong cửa chính D1, phía phải"],
    ["BCT2","v",4.5,16.7,-1,1.25,["CĐ18"],"Phòng khách — cạnh cửa D2 ra sân chính, phía then cửa"],
    ["BCT3","v",4.5,18.8,-1,1.25,["CĐ7","CĐ5"],"Hành lang — đầu bắc, cạnh chân cầu thang"],
    ["BCT4","h",18.5,3.2,1,1.25,["CĐ5","CĐ6"],"Đầu thang — trong tum, vách bắc sát cửa ra mái; cao tính từ mặt mái"],
    ["BCT5","v",3.5,21.54,-1,1.25,["CĐ8","CĐ9"],"Phòng ngủ 1 — trong cửa D5, phía then cửa"],
    ["BCT6","v",0,21.03,1,0.75,["CĐ9","CĐ8"],"Phòng ngủ 1 — đầu giường, ngay trên kệ đầu giường"],
    ["BCT7","v",4.5,24.1,-1,1.25,["CĐ7","CĐ11"],"Hành lang — đầu nam, tường đông đối diện tiền phòng WC, gần cửa master"],
    ["BCT8","h",24.5,3.35,1,1.25,["CĐ13","CĐ14","CĐ15"],"Master — trong cửa D8, phía then cửa"],
    ["BCT9","v",2,24.04,1,1.25,["CĐ10","CĐ12"],"Tiền phòng WC — ngoài cửa WC chung D14, phía then cửa"],
    ["BCT10","v",0,24.825,1,0.75,["CĐ15","CĐ13"],"Master — đầu giường, trên tủ đầu giường phía cửa"],
    ["BCT11","h",28,0.45,-1,1.25,["CĐ16"],"Master — cạnh cửa lùa ban công D12"],
    ["BCT12","v",4.5,27.8,1,1.25,["CĐ22","CĐ23"],"Sân phơi — công tắc chống nước trên tường nhà chính, dưới mái"]
  ],
  strips:[[0,13.5]],
  furn:[
    ["sofa",0.25,14.8,2.6,0.85],
    ["sofa",0.25,15.65,0.85,1.2],
    ["tbl",1.4,16.05,1.3,0.8],
    ["shrine",0.11,17.95,0.7,0.5],
    ["tvShelf",0.81,17.95,2.85,0.5],
    ["stairCab",0.11,19.6,0.9,0.85],
    ["stairCab",1.01,19.6,0.52,0.85],
    ["stairCab",1.53,19.6,0.52,0.85],
    ["stairCab",2.05,19.6,0.52,0.85],
    ["bedw",0.25,21.35,1.8,1.6],
    ["cab",0.3,20.8,0.45,0.45],
    ["cab",2.85,21.75,0.6,1.2],
    ["cab",2.1,23.85,1.3,0.6],
    ["lav",1.35,24,0.55,0.45],
    ["wc",0.11,23.88,0.68,0.42],
    ["shower",0.11,23.05,1,0.7],
    ["bedw",0.25,25.2,2,1.8],
    ["cab",0.3,24.6,0.45,0.45],
    ["cab",0.3,27.2,0.45,0.45],
    ["desk",3.75,25.49,0.6,1.2],
    ["desk",3.75,26.69,0.6,1.2],
    ["chair",3.05,25.85,0.48,0.48],
    ["chair",3.05,27.05,0.48,0.48],
    ["tap",4.61,26.15,0.18,0.1],
    ["tap",4.61,27.25,0.18,0.1],
    ["washRaised",4.65,25.15,0.6,0.6],
    ["round",5,14.53,1.4,1.4]
  ],
};
