import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIP 專屬入口 | 香氛品牌",
  description: "探索您的專屬香調",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
