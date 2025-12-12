import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '../components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          font-sans
        `}
      >
        <div className="app-shell-outer">
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}