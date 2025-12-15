import type { Metadata } from "next";
import "./style.css";
import Sidebar from '../components/Sidebar';
import StarfieldBackground from '../components/StarfieldBackground';

export const metadata: Metadata = {
  title: "故事屋",
  description: "打造獨一無二的故事情節與角色設定。",
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