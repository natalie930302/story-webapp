import type { Metadata } from "next";
import "./style.css";
import Sidebar from '../components/Sidebar';
import StarfieldBackground from '../components/StarfieldBackground';

export const metadata: Metadata = {
  title: "溫馨故事屋",
  description: "一個充滿故事與互動的溫暖空間",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="root-body">
        <StarfieldBackground />
        <div className="layout-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}