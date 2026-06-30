import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ネコマタトモ案内所",
  description: "猫と魔法とアートの案内所。令和の魔女・アーティスト ネコマタトモの総合案内サイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
