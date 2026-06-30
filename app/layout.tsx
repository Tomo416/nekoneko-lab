import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ねこねこ錬金工房",
  description:
    "古代の叡智と最新テクノロジーが出会う創造の工房。占術や癒しの施術、生成AIを使ったものづくり、アート、米粉のお菓子カフェなど、人生を少し面白くする体験をお届けします。",
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
