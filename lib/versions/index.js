/* v1…v11 là kho đối chiếu — đóng băng, không sửa nữa. Chúng ghi lại mạch suy nghĩ dẫn tới
   phương án hiện hành, và cho phép so hai phương án cạnh nhau trong cùng bản vẽ.

   current.js là bản sống: thay đổi thiết kế sửa thẳng vào đó, git giữ lịch sử. Không thêm
   v13, v14… nữa. Xem CLAUDE.md.

   DRAFTS là bản nháp: phương án lớn đang thử song song, tách từ current.js — chốt thì chép sang
   current.js rồi xoá, bỏ thì xoá. */

import v1 from './v1.js';
import v2 from './v2.js';
import v3 from './v3.js';
import v4 from './v4.js';
import v5 from './v5.js';
import v6 from './v6.js';
import v7 from './v7.js';
import v8 from './v8.js';
import v9 from './v9.js';
import v10 from './v10.js';
import v11 from './v11.js';
import stairBack from './stair-back.js';
import current from './current.js';

export const ARCHIVE = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11];
export const DRAFTS = [stairBack];
export const CURRENT = current;

/* Thứ tự trong mảng = thứ tự hiển thị trong dropdown. Bản hiện hành nằm cuối — trang mở mặc định
   phần tử cuối, nên nháp đứng ngay trước nó. */
export const PLANS = [...ARCHIVE, ...DRAFTS, CURRENT];
export const byId = id => PLANS.find(p => p.id === id);
