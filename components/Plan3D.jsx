'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import '../app/plan3d.css';
import { init } from './scene3d.js';

/* Giống Plan2D: React chỉ dựng khung DOM rỗng với đúng các id mà scene3d.js trông đợi,
   rồi gọi init() một lần sau khi mount. init() trả về hàm dọn cảnh. */
export default function Plan3D() {
  useEffect(() => init(), []);

  return (
    <>
      <header>
        <div className="titles">
          <h1>MÔ HÌNH 3D — LÔ 9.5 × 30 m</h1>
          <p className="sub">
            <span id="subAzimuth" />&nbsp;·&nbsp; dựng từ đúng dữ liệu của bản vẽ 2D
          </p>
        </div>

        <div className="bar">
          <label htmlFor="plan3">Phiên bản</label>
          <select id="plan3" defaultValue=""></select>
          <span className="sep" />
          <button id="vOverview">Toàn cảnh</button>
          <button id="vTop">Từ trên xuống</button>
          <button id="vRoof">Ẩn mái</button>
          <button id="vFurniture" title="Ẩn hoặc hiện nội thất; cửa luôn giữ nguyên">Ẩn đồ</button>
          <button id="vDoors" title="Đóng hoặc mở đồng thời mọi cửa đi, gồm cửa quay, cửa 4 cánh, cửa lùa và cổng sắt">
            Đóng toàn bộ cửa
          </button>
          <button id="vWalk" title="Bắt đầu từ cổng chính, đi vào nhà bằng W A S D">
            Đi bộ trong nhà
          </button>
          <Link className="nav" href="/">← Về bản vẽ 2D</Link>
          <span className="hint" id="hint" />
        </div>
      </header>

      <div className="app">
        <div className="sheet"><div id="canvas3d" /></div>

        <aside className="side">
          <section>
            <h2 id="planTitle">Phiên bản</h2>
            <div id="planNote" />
            <p className="vmeta" id="cfgState3" />
          </section>

          <section>
            <h2>Cấu hình đã lưu</h2>
            <div id="cfgSaved3" />
          </section>

          <section>
            <h2>Hướng nhà</h2>

            <label className="sl" htmlFor="azimuth">
              Phương vị mặt tiền — <b id="lblAzimuth" />
            </label>
            <input id="azimuth" type="range" min="0" max="359" step="1" defaultValue="45" />
            <div className="mocs">
              <button id="azReset">Về hướng thiết kế</button>
            </div>
            <p className="doc" style={{ marginTop: 10 }}>
              Chỉ đổi đường đi của nắng và mũi tên bắc — hình khối giữ nguyên. Bản vẽ 2D đọc
              cùng giá trị này nên hai trang không nói hai đằng.
            </p>
          </section>

          <section>
            <h2>Cao độ</h2>
            <div id="heightSliders" />
            <div className="mocs">
              <button id="cfg3Reset">Về cao độ gốc</button>
            </div>
          </section>

          <section>
            <h2>Bảng công tắc</h2>
            <div id="switchBoard3" />
            <p className="doc" style={{ marginTop: 8 }}>
              Bật thì thân đèn sáng lên, tắt thì xám. Mô hình không dựng nguồn sáng thật — ánh đèn không rọi lên
              tường, độ sáng xem ở bảng độ rọi trong đặc tả. <b>⇄</b> là công tắc hai chiều.
            </p>
          </section>

          <section>
            <h2>Mặt trời</h2>

            <label className="sl" htmlFor="day">
              Ngày trong năm — <b id="lblDay" />
            </label>
            <input id="day" type="range" min="1" max="365" step="1" defaultValue="172" />
            <div className="mocs" id="keyDates" />

            <label className="sl" htmlFor="hour">
              Giờ — <b id="lblHour" />
            </label>
            <input id="hour" type="range" min="0" max="24" step="0.25" defaultValue="15" />

            <p className="sun" id="sunInfo" />
          </section>

          <section>
            <h2>Đọc mô hình này thế nào</h2>
            <p className="doc">
              Mô hình để <b>tự soi phương án</b>, không phải ảnh render bán hàng: chỉ có khối
              tường, sàn, mái — chưa có nội thất và vật liệu.
            </p>
            <div className="note">
              <b>Đừng tin ảnh về độ sáng.</b> Ở đây không có ánh sáng gián tiếp (không mô phỏng
              GI). <b>Vệt nắng trực tiếp</b> qua giếng trời thì hình học chính xác — rơi đúng chỗ,
              đúng giờ, tin được. Nhưng phần lớn ánh sáng thật trong hành lang là ánh dội lại từ
              tường, thứ mô hình này không dựng. Kết luận “đủ sáng rồi” từ ảnh thì <b>không</b> tin
              được.
            </div>
            <div className="note">
              <b>Nơi xây: Bắc Giang</b> (21.27°B). Đã chốt và ghi vào <code>lib/lot.js</code>,
              không còn chọn được — quên đổi là đọc sai toàn bộ phần nắng.
            </div>
            <p className="doc">
              <b>Chưa dựng dù đã chốt:</b> mái bàn trà, mái tôn bếp, mái sân phơi — cần loại khối
              mái dốc mà mô hình chưa có. Xem <code>roadmap.md</code> A4.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
