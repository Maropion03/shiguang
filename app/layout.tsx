import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "拾光 · 为此刻的你拾起一本书",
  description: "答几道题,让此刻的心境为你拾起一本书。AI 生成 · 豆瓣验证。",
  openGraph: {
    title: "拾光 · 为此刻的你拾起一本书",
    description: "答几道题,让此刻的心境为你拾起一本书。",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F5F1E8"
};

// 注:故意不从 Google Fonts 加载 Noto Serif SC / Sans SC ——
// 国内移动网络下 fonts.googleapis.com 大概率被屏蔽或极慢,
// <link rel="stylesheet"> 也是 render-blocking,会导致页面打不开。
// 改用纯系统字体栈(iOS Songti SC / Android Noto Serif CJK fallback),
// tailwind.config.ts 与 globals.css 已在 font-family 链里保留 "Noto Serif SC"
// 作为占位,若用户本地装了这套字体会自动用上。

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen relative">
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
