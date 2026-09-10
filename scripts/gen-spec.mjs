/* Sinh spec/v<n>.md từ lib/versions/v<n>.js.
 *
 *   npm run spec           sinh lại tất cả
 *   npm run spec -- v12    chỉ một phiên bản
 *   npm run spec -- --check  không ghi gì, chỉ báo file nào lệch (dùng cho CI)
 *
 * Đặc tả là kết quả, không phải nguồn — không sửa tay spec/*.md. Xem CLAUDE.md.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERSIONS } from '../lib/versions/index.js';
import { specMarkdown } from '../lib/spec.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'spec');
if (!existsSync(outDir)) mkdirSync(outDir);

const args = process.argv.slice(2);
const check = args.includes('--check');
const only = args.filter(a => !a.startsWith('--'));
const targets = only.length ? VERSIONS.filter(v => only.includes(v.id)) : VERSIONS;

if (!targets.length) {
  console.error(`Không có phiên bản nào khớp: ${only.join(', ')}`);
  process.exit(1);
}

/* Thời gian đổi mỗi lần chạy nên bỏ qua khi so sánh — nhưng chỉ đúng phần thời gian.
   Bỏ qua cả dòng thì đổi đường dẫn hay chữ nghĩa trong đó sẽ lọt lưới --check. */
const boQuaThoiGian = s => s.replace(/^(> Sinh tự động từ .* lúc ).*$/m, '$1');

let lech = 0;
for (const v of targets) {
  const md = specMarkdown(v, VERSIONS);
  const path = join(outDir, `${v.id}.md`);
  const cu = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const giongNhau = boQuaThoiGian(cu) === boQuaThoiGian(md);

  if (check) {
    if (!giongNhau) { lech++; console.log(`LỆCH   spec/${v.id}.md`); }
    continue;
  }
  if (giongNhau && cu) { console.log(`giữ    spec/${v.id}.md`); continue; }
  writeFileSync(path, md);
  console.log(`${cu ? 'ghi đè' : 'tạo   '} spec/${v.id}.md`);
}

if (check) {
  console.log(lech ? `\n${lech} file lệch — chạy "npm run spec" để đồng bộ.`
                   : `\n${targets.length} file spec khớp với dữ liệu phiên bản.`);
  process.exit(lech ? 1 : 0);
}
