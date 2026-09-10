import './chung.css';

export const metadata = {
  title: 'Mặt bằng 9.5 × 30',
  description: 'Bản vẽ mặt bằng tương tác và mô hình 3D cho lô đất 9.5 × 30 m',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
