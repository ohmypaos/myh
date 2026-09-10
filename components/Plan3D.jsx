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
            Mặt tiền quay Đông Bắc &nbsp;·&nbsp; dựng từ đúng dữ liệu của bản vẽ 2D
          </p>
        </div>

        <div className="bar">
          <label htmlFor="plan3">Phiên bản</label>
          <select id="plan3" defaultValue=""></select>
          <span className="sep" />
          <button id="vOverview">Toàn cảnh</button>
          <button id="vTop">Từ trên xuống</button>
          <button id="vRoof">Ẩn mái</button>
          <button id="vWalk" title="Đứng trong hành lang để cảm nhận tỉ lệ đứng">
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
          </section>

          <section>
            <h2>Mặt trời</h2>

            <label className="sl" htmlFor="place">Nơi xây</label>
            <select id="place" defaultValue="" />

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
              <b>Chọn đúng nơi xây trước khi kết luận.</b> Lệch vĩ độ là lệch toàn bộ phần nắng.
            </div>
            <p className="doc">
              Mái che sân phụ (chỗ để xe) mới khai tạm ở <code>lib/lot.js</code>, chưa vào dữ liệu
              phiên bản — nó là thay đổi thiết kế nên phải thành v13. Xem <code>3d.md</code> mục 3.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
