import type { Metadata } from "next";
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
