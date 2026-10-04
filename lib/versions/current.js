/* Bản hiện hành: sửa tại đây, không tạo thêm phiên bản.
   house dùng kích thước lọt lòng; X sang lô phụ, Y từ mặt tiền nhà.
   Các phần site giữ sân, cổng, dốc và sân phơi hiện trạng. */
import { withHouse } from '../house.js';

export default withHouse({
  "id": "current",
  "date": "4/10/2026",
  "house": {
    "width": 4.5,
    "depth": 16,
    "front": 14,
    "base": 0.45,
    "floorRise": 3.06,
    "slab": 0.2,
    "frontBalcony": 1.8,
    "frontPorch": 1.2,
    "rearBalcony": 1,
    "bedroomSideWindows": false,
    "rearBalconyWalls": {"left": true, "right": false},
    "ceiling": 2.8,
    "upperWallHeight": 3.05,
    "doorDesign": {
      "main": {"width": 3.2, "height": 2.6, "panels": 4},
      "balcony": {"width": 3.2, "height": 2.5, "panels": 4},
      "finish": "Khung nhôm ghi đậm, kính; 4 cánh lùa mở giữa",
      "reference": "https://eurowindow.biz/cua-vach-nhom/cua-di-nhom/cua-di-nhom-4-canh-mo-truot.html"
    },
    "roof": {
      "material": "tôn",
      "ceilingMaterial": "trần nhựa",
      "pitch": 30
    },
    "stair": {
      "x": 1.3,
      "y": 8.8,
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
            "d": 4.6,
            "type": "room"
          },
          {
            "id": "kitchen",
            "name": "BẾP + ĂN",
            "x": 0.2,
            "y": 4.9,
            "w": 4.1,
            "d": 3.8,
            "type": "room"
          },
          {
            "id": "wc1",
            "name": "WC1",
            "x": 1.2,
            "y": 10.9,
            "w": 3.1,
            "d": 1.4,
            "type": "wet"
          },
          {
            "id": "bed1",
            "name": "PHÒNG NGỦ 1",
            "x": 0.2,
            "y": 12.4,
            "w": 4.1,
            "d": 2.4,
            "type": "room"
          }
        ],
        "furniture": [
          [
            "sofa",
            0.35,
            1,
            0.85,
            2.3
          ],
          [
            "table",
            1.6,
            2,
            1.1,
            0.65
          ],
          [
            "kitchen",
            3.6,
            5.2,
            0.6,
            2.5
          ],
          [
            "table",
            1.8,
            5.6,
            0.8,
            1.4
          ],
          [
            "wash",
            1.6,
            9.95,
            0.6,
            0.6
          ],
          [
            "wc",
            1.4,
            11.2,
            0.65,
            0.65
          ],
          [
            "lav",
            2.35,
            11,
            0.6,
            0.45
          ],
          [
            "shower",
            3.35,
            10.95,
            0.85,
            1.25
          ],
          [
            "bed",
            2,
            12.7,
            2,
            1.6
          ],
          [
            "cab",
            0.3,
            13.3,
            0.6,
            1.3
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
            "d": 3.4,
            "type": "room"
          },
          {
            "id": "office",
            "name": "PHÒNG LÀM VIỆC",
            "x": 1.2,
            "y": 3.6,
            "w": 3.2,
            "d": 2.2,
            "type": "room"
          },
          {
            "id": "altar",
            "name": "PHÒNG THỜ",
            "x": 1.2,
            "y": 5.9,
            "w": 3.2,
            "d": 2.8,
            "type": "room"
          },
          {
            "id": "wc2",
            "name": "WC2",
            "x": 1.2,
            "y": 10.9,
            "w": 3.2,
            "d": 1.4,
            "type": "wet"
          },
          {
            "id": "bed2",
            "name": "PHÒNG NGỦ PHỤ",
            "x": 0.1,
            "y": 12.4,
            "w": 4.3,
            "d": 2.5,
            "type": "room"
          }
        ],
        "furniture": [
          [
            "bed",
            2,
            0.6,
            2,
            1.6
          ],
          [
            "cab",
            0.25,
            1.1,
            0.6,
            1.6
          ],
          [
            "desk",
            3.6,
            3.9,
            0.6,
            1.3
          ],
          [
            "cab",
            1.4,
            5.2,
            1.2,
            0.45
          ],
          [
            "altar",
            2.1,
            7.95,
            1.8,
            0.6
          ],
          [
            "wc",
            1.4,
            11.2,
            0.65,
            0.65
          ],
          [
            "lav",
            2.35,
            11,
            0.6,
            0.45
          ],
          [
            "shower",
            3.35,
            10.95,
            0.85,
            1.25
          ],
          [
            "bed",
            2,
            12.7,
            2,
            1.6
          ],
          [
            "cab",
            0.25,
            13.3,
            0.6,
            1.3
          ]
        ]
      }
    ]
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
      0,
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
      13.25,
      "Trái cửa chính — sát mép ngoài hiên, cùng cốt sàn nhà"
    ],
    [
      "CC2",
      4.15,
      13.25,
      "Phải cửa chính — sát mép ngoài hiên, đối xứng CC1"
    ],
    [
      "CC3",
      0.355,
      29.645,
      "Ban công sau — góc trái sát rào sau, dưới trần ban công"
    ],
    [
      "CC4",
      4.145,
      29.645,
      "Ban công sau — góc phải sát rào sau, cạnh cửa D13, ngoài vùng quét cánh"
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
