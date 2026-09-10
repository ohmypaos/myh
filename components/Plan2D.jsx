'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import '../app/plan2d.css';
import { init } from './draw2d.js';

/* React chỉ dựng khung DOM rỗng với đúng các id mà draw2d.js trông đợi, rồi gọi init()
   một lần sau khi mount. Toàn bộ việc vẽ do mã cũ đảm nhiệm — xem đầu file draw2d.js. */
export default function Plan2D() {
  useEffect(() => init(), []);

  return (
    <>
      <header>
        <div className="titles">
          <h1>MẶT BẰNG TẦNG TRỆT — LÔ 9.5 × 30 m</h1>
          <p className="sub" id="subline">
            285 m² &nbsp;·&nbsp; Tỉ lệ 1:100 &nbsp;·&nbsp; Kích thước tim tường
          </p>
        </div>

        <div className="bar">
          <label htmlFor="ver">Phiên bản</label>
          <select id="ver" defaultValue=""></select>
          <span className="sep" />
          <button id="zOut" title="Thu nhỏ (phím −)">−</button>
          <span className="zoomval" id="zVal">100%</span>
          <button id="zIn" title="Phóng to (phím +)">+</button>
          <span className="sep" />
          <button id="zFit" title="Xem toàn bộ (phím 0)">Vừa khung</button>
          <button id="zWide">Vừa bề ngang</button>
          <button id="z100">100%</button>
          <span className="sep" />
          <button id="zDim" title="Đổi giữa kích thước tim tường và kích thước sử dụng">
            Nhãn: Tim tường
          </button>
          <span className="sep" />
          <button id="zRot" title="Xoay bản vẽ 90° (phím R)">⟳ Xoay 90°</button>
          <button id="zSide" title="Ẩn cột bảng để bản vẽ rộng hơn">Ẩn bảng</button>
          <button id="zFull" title="Toàn màn hình (phím F · thoát bằng Esc)">⛶ Toàn màn hình</button>
          <Link className="nav" href="/3d">Xem 3D →</Link>
          <span className="hint">Lăn chuột để zoom · kéo để di chuyển · phím + − 0 R F</span>
        </div>
      </header>

      <div className="app">
        <div className="sheet">
          <div className="viewer"><svg id="plan" /></div>
          <button id="zExit" title="Thoát toàn màn hình (Esc)" aria-label="Thoát toàn màn hình">✕</button>
        </div>

        <aside className="side">
          <section>
            <h2 id="vTitle">Phiên bản</h2>
            <p className="vmeta" id="vMeta" />
            <div id="vNote" />
            <ul className="vlist" id="vChanges" />
            <div id="vCheck" />
          </section>
          <section>
            <h2>Tuỳ chỉnh kích thước</h2>
            <p className="vmeta">
              Mỗi thanh là <b>một bức tường</b> — tường chung tính là một, nên kéo nó là thấy
              ngay cả hai bên đổi cùng lúc. Cửa, giếng trời và nội thất đi theo.
            </p>
            <div id="cfgSliders" />
            <p className="vmeta" id="cfgState" />
            <button id="cfgReset">Về kích thước gốc</button>
          </section>

          <section>
            <h2>Cấu hình đã lưu</h2>
            <div id="cfgSaved" />
            <p className="vmeta">
              Lưu ở máy anh, không nằm trong dự án. Chốt được phương án nào thì vẫn phải sửa
              vào <code>lib/versions/current.js</code> rồi <code>npm run spec</code>.
            </p>
          </section>

          <section>
            <h2>Bảng thống kê phòng</h2>
            <table id="sched" />
          </section>
          <section>
            <h2>Bảng cửa</h2>
            <table id="tblDoors" />
          </section>
          <section id="secWin">
            <h2>Bảng cửa sổ</h2>
            <table id="tblWins" />
          </section>
          <section id="secSky">
            <h2>Bảng lấy sáng mái</h2>
            <table id="tblSky" />
          </section>
          <section>
            <h2>Ký hiệu chung</h2>
            <table id="legend" />
            <div className="note" id="warn" />
          </section>
        </aside>
      </div>
    </>
  );
}
