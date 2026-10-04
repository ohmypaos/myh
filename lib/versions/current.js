/* Bản hiện hành: sửa tại đây, không tạo thêm phiên bản.
   house dùng kích thước lọt lòng; X sang lô phụ, Y từ mặt tiền nhà.
   Các phần site giữ sân, cổng, dốc và sân phơi hiện trạng. */
import { withHouse } from '../house.js';

export default withHouse({
  "id": "current",
  "date": "5/10/2026",
  "house": {
    "width": 4.5,
    "depth": 13.4,
    "front": 16.6,
    "base": 0.45,
    "floorRise": 3.06,
    "slab": 0.2,
    "frontBalcony": 1.8,
    "frontPorch": 1.2,
    "rearBalcony": 0,
    "bedroomSideWindows": false,
    "rearBalconyWalls": {
      "left": false,
      "right": false
    },
    "rearSteps": null,
    "ceiling": 2.8,
    "upperWallHeight": 3.05,
    "doorDesign": {
      "main": {
        "width": 3.2,
        "height": 2.6,
        "panels": 4
      },
      "balcony": {
        "width": 3.2,
        "height": 2.5,
        "panels": 2
      },
      "wc": {
        "swingSign": 1
      },
      "finish": "Khung nhôm ghi đậm, kính; cửa chính 4 cánh mở giữa, cửa phòng ngủ 2 cánh lùa trên hai ray",
      "reference": "https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-4-canh-mo-truot.html"
    },
    "roof": {
      "material": "tôn",
      "ceilingMaterial": "trần nhựa",
      "pitch": 30
    },
    "stair": {
      "groundFloorWindow": false,
      "x": 1.3,
      "y": 4.7,
      "w": 3,
      "d": 2,
      "width": 0.95
    },
    "floors": [
      {
        "wall": 0.2,
        "rooms": [
          {
            "id": "living",
            "name": "PHÒNG KHÁCH",
            "x": 0.2,
            "y": 0.2,
            "w": 4.1,
            "d": 4.4,
            "type": "room"
          },
          {
            "id": "kitchen",
            "name": "BẾP + ĂN",
            "x": 0.2,
            "y": 6.8,
            "w": 4.1,
            "d": 2.4,
            "type": "room"
          },
          {
            "id": "wc1",
            "name": "WC1",
            "x": 1.2,
            "y": 9.3,
            "w": 3.1,
            "d": 1.4,
            "type": "wet"
          },
          {
            "id": "bed1",
            "name": "PHÒNG NGỦ 1",
            "x": 0.2,
            "y": 10.8,
            "w": 4.1,
            "d": 2.4,
            "type": "room"
          }
        ],
        "furniture": [
          [
            "sofa",
            3.4,
            1.65,
            0.85,
            1.8,
            {
              "id": "SF1",
              "name": "Sofa chính 2 chỗ",
              "facing": "left",
              "height": 0.85,
              "roomId": "living",
              "note": "Sát cửa sổ phòng khách; quay về kệ TV bên trái, ghế chính của bộ chữ U."
            }
          ],
          [
            "sofa",
            2.25,
            0.8,
            0.8,
            0.8,
            {
              "id": "SF2",
              "name": "Ghế đơn phía trước",
              "facing": "rear",
              "height": 0.85,
              "roomId": "living",
              "note": "Ghế một người phía cửa chính, quay vào bàn trà; nhánh trước của bộ chữ U."
            }
          ],
          [
            "sofa",
            2.25,
            3.3,
            0.8,
            0.8,
            {
              "id": "SF3",
              "name": "Ghế đơn phía sau",
              "facing": "front",
              "height": 0.85,
              "roomId": "living",
              "note": "Ghế một người phía bếp, quay vào bàn trà; nhánh sau của bộ chữ U, lưng về kệ ngăn."
            }
          ],
          [
            "cab",
            0.25,
            1.1,
            0.4,
            2.2,
            {
              "id": "TV1",
              "name": "Kệ TV",
              "height": 0.55,
              "roomId": "living",
              "note": "Ở vị trí sofa cũ, áp tường trái, đối diện bộ ghế chữ U."
            }
          ],
          [
            "shelf",
            1.45,
            4.2,
            2.8,
            0.35,
            {
              "id": "KN1",
              "name": "Kệ ngăn khách / cầu thang",
              "height": 1.4,
              "roomId": "living",
              "note": "Kệ thoáng giữa khách và cầu thang; chừa lối 125 cm bên trái."
            }
          ],
          [
            "table",
            2.3,
            2.05,
            0.65,
            1,
            {
              "id": "BT1",
              "name": "Bàn trà",
              "height": 0.45,
              "roomId": "living",
              "note": "Ở giữa ba sofa phía cửa sổ; cách ghế chính và hai nhánh 45 cm."
            }
          ],
          [
            "kitchen",
            3.65,
            7.0,
            0.6,
            2.1,
            {
              "id": "BK1",
              "name": "Tủ bếp dưới",
              "height": 0.85,
              "roomId": "kitchen",
              "note": "Áp tường phải; mặt thao tác sâu 60 cm.",
              "clearance": {
                "side": "left",
                "depth": 0.9
              }
            }
          ],
          [
            "table",
            1.45,
            7.25,
            0.75,
            1.2,
            {
              "id": "BA1",
              "name": "Bàn ăn 4 người",
              "height": 0.75,
              "roomId": "kitchen",
              "note": "Bốn ghế hai bên; lối đi bên bếp rộng 95 cm."
            }
          ],
          [
            "chair",
            0.95,
            7.3,
            0.45,
            0.45,
            {
              "id": "GA1",
              "name": "Ghế ăn",
              "height": 0.85,
              "roomId": "kitchen",
              "note": "Ghế phía trái bàn ăn."
            }
          ],
          [
            "chair",
            0.95,
            7.9,
            0.45,
            0.45,
            {
              "id": "GA2",
              "name": "Ghế ăn",
              "height": 0.85,
              "roomId": "kitchen",
              "note": "Ghế phía trái bàn ăn."
            }
          ],
          [
            "chair",
            2.25,
            7.3,
            0.45,
            0.45,
            {
              "id": "GA3",
              "facing": "left",
              "name": "Ghế ăn",
              "height": 0.85,
              "roomId": "kitchen",
              "note": "Ghế phía phải bàn ăn."
            }
          ],
          [
            "chair",
            2.25,
            7.9,
            0.45,
            0.45,
            {
              "id": "GA4",
              "facing": "left",
              "name": "Ghế ăn",
              "height": 0.85,
              "roomId": "kitchen",
              "note": "Ghế phía phải bàn ăn."
            }
          ],
          [
            "fridge",
            1.45,
            8.45,
            0.7,
            0.7,
            {
              "id": "TL1",
              "name": "Tủ lạnh",
              "height": 1.75,
              "roomId": "kitchen",
              "note": "Cuối bếp, chừa 5 cm tới tường sau; cửa mở sang phải, giữ lối bên trái tới WC và phòng ngủ sau.",
              "clearance": {
                "side": "right",
                "depth": 0.9
              }
            }
          ],
          [
            "wash",
            1.6,
            5.85,
            0.6,
            0.65,
            {
              "id": "MG1",
              "name": "Máy giặt cửa trước",
              "height": 0.85,
              "roomId": "stair",
              "note": "Dưới vế thang trên; mở cửa về hành lang bên trái.",
              "clearance": {
                "side": "left",
                "depth": 0.6
              }
            }
          ],
          [
            "wc",
            2.1,
            9.95,
            0.395,
            0.7,
            {
              "id": "BC1",
              "name": "Bồn cầu",
              "height": 0.75,
              "roomId": "wc1",
              "note": "Lưng về tường sau; chừa 65 cm phía trước.",
              "clearance": {
                "side": "front",
                "depth": 0.6
              }
            }
          ],
          [
            "lav",
            2.6,
            9.35,
            0.6,
            0.45,
            {
              "id": "LV1",
              "name": "Lavabo treo",
              "height": 0.8,
              "roomId": "wc1",
              "note": "Áp tường trước, đứng dùng phía sau.",
              "clearance": {
                "side": "rear",
                "depth": 0.6
              }
            }
          ],
          [
            "shower",
            3.3,
            9.4,
            0.9,
            1.2,
            {
              "id": "VT1",
              "name": "Vùng tắm đứng",
              "height": 0.05,
              "roomId": "wc1",
              "note": "Ô tắm 90 × 120 cm; chiều cao ghi là bệ sàn, chưa có vách kính."
            }
          ],
          [
            "bed",
            2.16,
            10.9,
            2.09,
            1.76,
            {
              "id": "GN1",
              "name": "Giường đệm 160 × 200",
              "height": 0.95,
              "roomId": "bed1",
              "note": "Kích thước gồm khung; đầu giường về tường phải, chừa 54 cm phía cửa sổ sau."
            }
          ],
          [
            "cab",
            0.3,
            11.65,
            0.6,
            1.4,
            {
              "id": "TA1",
              "name": "Tủ quần áo cửa lùa",
              "height": 2.1,
              "roomId": "bed1",
              "note": "Áp tường trái; mặt tủ hướng vào phòng.",
              "clearance": {
                "side": "right",
                "depth": 0.8
              }
            }
          ]
        ]
      },
      {
        "wall": 0.1,
        "rooms": [
          {
            "id": "master",
            "name": "PHÒNG NGỦ MASTER",
            "x": 0.1,
            "y": 0.1,
            "w": 4.3,
            "d": 2.8,
            "type": "room"
          },
          {
            "id": "office",
            "name": "PHÒNG LÀM VIỆC",
            "x": 1.2,
            "y": 3,
            "w": 3.2,
            "d": 1.6,
            "type": "room"
          },
          {
            "id": "altar",
            "name": "PHÒNG THỜ",
            "x": 1.2,
            "y": 6.8,
            "w": 3.2,
            "d": 2,
            "type": "room"
          },
          {
            "id": "wc2",
            "name": "WC2",
            "x": 1.2,
            "y": 9.3,
            "w": 3.2,
            "d": 1.4,
            "type": "wet"
          },
          {
            "id": "bed2",
            "name": "PHÒNG NGỦ PHỤ",
            "x": 0.1,
            "y": 10.8,
            "w": 4.3,
            "d": 2.5,
            "type": "room"
          }
        ],
        "furniture": [
          [
            "bed",
            2.21,
            0.8,
            2.09,
            1.76,
            {
              "id": "GN2",
              "name": "Giường đệm 160 × 200",
              "height": 0.95,
              "roomId": "master",
              "note": "Kích thước gồm khung; đầu giường về tường phải, thoáng lối ra ban công."
            }
          ],
          [
            "cab",
            0.15,
            0.3,
            0.6,
            1.8,
            {
              "id": "TA2",
              "name": "Tủ quần áo cửa lùa",
              "height": 2.1,
              "roomId": "master",
              "note": "Áp tường trái, không chắn cửa vào master.",
              "clearance": {
                "side": "right",
                "depth": 0.8
              }
            }
          ],
          [
            "desk",
            3.75,
            3.15,
            0.6,
            1.2,
            {
              "id": "BL1",
              "name": "Bàn làm việc",
              "height": 0.75,
              "roomId": "office",
              "note": "Áp tường phải gần cửa sổ; ghế quay vào bàn."
            }
          ],
          [
            "chair",
            3.05,
            3.5,
            0.5,
            0.5,
            {
              "id": "GL1",
              "name": "Ghế làm việc",
              "height": 0.95,
              "roomId": "office",
              "note": "Chừa 70 cm phía sau để kéo ghế.",
              "clearance": {
                "side": "left",
                "depth": 0.7
              }
            }
          ],
          [
            "cab",
            1.4,
            4.15,
            1.2,
            0.35,
            {
              "id": "TS1",
              "name": "Tủ sách",
              "height": 1.8,
              "roomId": "office",
              "note": "Áp tường sau; chiều sâu 35 cm.",
              "clearance": {
                "side": "front",
                "depth": 0.8
              }
            }
          ],
          [
            "altar",
            2.2,
            8.09,
            1.53,
            0.61,
            {
              "id": "TT1",
              "name": "Bàn thờ đứng",
              "height": 1.27,
              "roomId": "altar",
              "note": "Áp tường sau, mặt hướng ra khoảng đứng hành lễ.",
              "clearance": {
                "side": "front",
                "depth": 1
              }
            }
          ],
          [
            "wc",
            2.1,
            9.95,
            0.395,
            0.7,
            {
              "id": "BC2",
              "name": "Bồn cầu",
              "height": 0.75,
              "roomId": "wc2",
              "note": "Thẳng vị trí BC1; lưng về tường sau.",
              "clearance": {
                "side": "front",
                "depth": 0.6
              }
            }
          ],
          [
            "lav",
            2.6,
            9.35,
            0.6,
            0.45,
            {
              "id": "LV2",
              "name": "Lavabo treo",
              "height": 0.8,
              "roomId": "wc2",
              "note": "Thẳng vị trí LV1.",
              "clearance": {
                "side": "rear",
                "depth": 0.6
              }
            }
          ],
          [
            "shower",
            3.3,
            9.4,
            0.9,
            1.2,
            {
              "id": "VT2",
              "name": "Vùng tắm đứng",
              "height": 0.05,
              "roomId": "wc2",
              "note": "Thẳng vị trí VT1; chiều cao ghi là bệ sàn, chưa có vách kính."
            }
          ],
          [
            "bed",
            2.16,
            10.9,
            2.09,
            1.76,
            {
              "id": "GN3",
              "name": "Giường đệm 160 × 200",
              "height": 0.95,
              "roomId": "bed2",
              "note": "Kích thước gồm khung; không chắn cửa vào phòng."
            }
          ],
          [
            "cab",
            0.25,
            11.65,
            0.6,
            1.4,
            {
              "id": "TA3",
              "name": "Tủ quần áo cửa lùa",
              "height": 2.1,
              "roomId": "bed2",
              "note": "Áp tường trái; mặt tủ hướng vào phòng.",
              "clearance": {
                "side": "right",
                "depth": 0.8
              }
            }
          ]
        ]
      }
    ],
    "rearWallAsFence": true
  },
  "site": {
    "groundRise": 0.8,
    "access": {
      "gate": 0,
      "landing": 2.3,
      "length": 6.4,
      "roadWidth": 4
    },
    "neighborAWidth": 4.5
  },
  "solidFences": [
    [
      "h",
      0,
      4.39,
      8.5
    ],
    [
      "v",
      0,
      0,
      1
    ],
    [
      "h",
      30,
      4.5,
      8.5,
      1.8
    ]
  ],
  "gates": [
    [
      "h",
      0,
      0.11,
      4.39,
      "CỔNG TOÀN NGANG 4.5m · LỌT LÒNG 4.28m"
    ]
  ],
  "gateDoors": [
    {
      "id": "CG1",
      "gate": 0
    }
  ],
  "gateRoofs": [],
  "roofs": [
    {
      "id": "RF3",
      "name": "MÁI SÂN PHƠI",
      "at": [
        4.5,
        25,
        8.5,
        28
      ],
      "shape": "mono:y",
      "h": [
        3.5,
        3.2
      ],
      "mat": "tôn cách nhiệt",
      "desc": "Mái sân phơi độc lập 4 × 3 m, dốc 10% về dải phơi hở phía sau; tựa tường nhà chính và hai cột ranh phải, máng thu nước ở mép thấp."
    }
  ],
  "posts": [
    [
      "C1",
      8.5,
      25
    ],
    [
      "C2",
      8.5,
      28
    ]
  ],
  "racks": [
    [
      "GP1",
      "h",
      29.35,
      6,
      8
    ]
  ],
  "planters": [
    [
      "CC1",
      0.35,
      15.85,
      "Trái cửa chính — sát mép ngoài hiên, cùng cốt sàn nhà"
    ],
    [
      "CC2",
      4.15,
      15.85,
      "Phải cửa chính — sát mép ngoài hiên, đối xứng CC1"
    ],
    [
      "CC3",
      5.0,
      29.645,
      "Sân phơi — chuyển khỏi vị trí sau nhà khi nhà áp sát tường bao"
    ],
    [
      "CC4",
      5.5,
      28.65,
      "Sân phơi — chuyển khỏi mép hiên sau để thông lối tam cấp xuống sân"
    ]
  ],
  "trees": [
    [
      "CX1",
      6.5,
      3.6,
      "Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m"
    ],
    [
      "CX2",
      6.5,
      6.9,
      "Cây bóng mát sân chính — tán giữ trong ranh lô 8.5 m"
    ]
  ],
  "flowerBeds": [
    [
      "BH1",
      "v",
      0,
      8.95,
      12.19,
      "Dọc tường bao trái sân phụ, sau đoạn dốc tới mép mái hiên — hứng mưa trọn"
    ]
  ],
  "heights": {
    "fence": 1.8,
    "fenceSolid": 0.8,
    "fencePrivate": 2.1
  },
  "siteFurniture": [
    [
      "washRaised",
      4.65,
      25.15,
      0.6,
      0.6
    ],
    [
      "tap",
      4.61,
      26.55,
      0.18,
      0.1
    ],
    [
      "tap",
      4.61,
      27.25,
      0.18,
      0.1
    ],
    [
      "round",
      5,
      14.53,
      1.4,
      1.4
    ]
  ]
});
