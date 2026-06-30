"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Menu, X, Mail, ExternalLink, Sparkles, Moon, Star } from "lucide-react";

/* ----------------------------------------------------------------
   画像は /public フォルダに配置してください：
   - /public/nekomata-cat.jpg       … 黒猫キャラクター
   - /public/nekomata-profile.jpg   … プロフィール写真
   （ロゴ画像は内容確認不可のためタイポグラフィロゴで代用しています）
------------------------------------------------------------------- */
const CAT_IMG = "/nekomata-cat.jpg";
const PROFILE_IMG = "/nekomata-profile.jpg";

/* ---------- 共通装飾：薄い背景レイヤー ---------- */
function ArcaneBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
      <svg className="absolute -top-10 -left-10 w-72 h-72" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#E8C97A" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="70" stroke="#E8C97A" strokeWidth="0.6" />
        <polygon points="100,10 184,145 16,145" stroke="#E8C97A" strokeWidth="0.6" fill="none" />
      </svg>
      <svg className="absolute top-1/3 right-0 w-96 h-96 translate-x-1/3" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="85" stroke="#5FD4D6" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" stroke="#5FD4D6" strokeWidth="0.5" />
        <line x1="15" y1="100" x2="185" y2="100" stroke="#5FD4D6" strokeWidth="0.4" />
        <line x1="100" y1="15" x2="100" y2="185" stroke="#5FD4D6" strokeWidth="0.4" />
      </svg>
      <svg className="absolute bottom-0 left-1/4 w-80 h-80 translate-y-1/2" viewBox="0 0 200 200" fill="none">
        <path d="M100 20 L120 80 L180 100 L120 120 L100 180 L80 120 L20 100 L80 80 Z" stroke="#F2A6C8" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

/* ---------- 肉球 / 星 / 月の散らし装飾 ---------- */
function FloatingMotifs({ density = 10, variant = "mixed" }: { density?: number; variant?: "mixed" | "paw" | "star" | "moon" }) {
  const motifs = Array.from({ length: density }).map((_, i) => {
    const left = (i * 37 + 13) % 100;
    const top = (i * 53 + 7) % 100;
    const size = 10 + ((i * 17) % 18);
    const delay = (i % 6) * 1.1;
    const dur = 7 + (i % 5) * 1.6;
    const kind = variant === "mixed" ? (["paw", "star", "moon"] as const)[i % 3] : variant;
    const colors = ["#5FD4D6", "#9FE3C2", "#F2A6C8", "#E8C97A"];
    const color = colors[i % colors.length];
    return (
      <div
        key={i}
        className="absolute opacity-[0.10]"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          animation: `nekoFloat ${dur}s ease-in-out ${delay}s infinite`,
        }}
      >
        {kind === "paw" && (
          <svg viewBox="0 0 24 24" fill={color} width="100%" height="100%">
            <ellipse cx="12" cy="16" rx="6" ry="5" />
            <ellipse cx="5" cy="8" rx="2.3" ry="3" />
            <ellipse cx="10.5" cy="5" rx="2.3" ry="3" />
            <ellipse cx="15.5" cy="5" rx="2.3" ry="3" />
            <ellipse cx="19" cy="8" rx="2.3" ry="3" />
          </svg>
        )}
        {kind === "star" && (
          <svg viewBox="0 0 24 24" fill={color} width="100%" height="100%">
            <path d="M12 1 L14.5 9 L23 9 L16.2 14 L18.5 22 L12 17.2 L5.5 22 L7.8 14 L1 9 L9.5 9 Z" />
          </svg>
        )}
        {kind === "moon" && (
          <svg viewBox="0 0 24 24" fill={color} width="100%" height="100%">
            <path d="M19 13 A8 8 0 1 1 11 3 A6.2 6.2 0 0 0 19 13 Z" />
          </svg>
        )}
      </div>
    );
  });
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{motifs}</div>;
}

/* ---------- 魔法陣SVG（サインアチャー要素） ---------- */
function MagicCircle({
  className = "",
  strokeColor = "#5FD4D6",
  opacity = 1,
}: {
  className?: string;
  strokeColor?: string;
  opacity?: number;
}) {
  return (
    <svg viewBox="0 0 240 240" className={className} style={{ opacity }} aria-hidden="true">
      <circle cx="120" cy="120" r="112" fill="none" stroke={strokeColor} strokeWidth="1" />
      <circle cx="120" cy="120" r="96" fill="none" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="2 4" />
      <circle cx="120" cy="120" r="64" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <polygon points="120,24 209,162 31,162" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      <polygon points="120,216 31,78 209,78" fill="none" stroke={strokeColor} strokeWidth="0.6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 120 + Math.cos(angle) * 112;
        const y1 = 120 + Math.sin(angle) * 112;
        const x2 = 120 + Math.cos(angle) * 118;
        const y2 = 120 + Math.sin(angle) * 118;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="0.8" />;
      })}
    </svg>
  );
}

/* ---------- セクション見出し（章のラベル付き） ---------- */
function ChapterHeading({ glyph, title, sub }: { glyph: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 sm:mb-14 text-center">
      <div className="flex items-center justify-center gap-3 mb-3" aria-hidden="true">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#E8C97A]/60" />
        <span className="text-[11px] tracking-[0.25em] uppercase text-[#E8C97A]/80 font-serif">{glyph}</span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#E8C97A]/60" />
      </div>
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#F1ECDF] tracking-wide">{title}</h2>
      {sub && <p className="mt-3 text-sm sm:text-base text-[#9FE3C2]/80 font-serif italic">{sub}</p>}
    </div>
  );
}

export default function NekomataGuide() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", "about", "activities", "magic", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const navItems = [
    { id: "about", label: "プロフィール" },
    { id: "activities", label: "活動紹介" },
    { id: "magic", label: "猫と魔法" },
    { id: "contact", label: "お問い合わせ" },
  ];

  return (
    <div
      className="relative min-h-screen w-full text-[#EDE7F6] overflow-x-hidden"
      style={{
        background: "linear-gradient(160deg, #0b0712 0%, #150f24 35%, #1a1130 65%, #110a1d 100%)",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Serif+JP:wght@400;500&family=Noto+Sans+JP:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        .font-display { font-family: 'Zen Maru Gothic', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', 'Noto Serif JP', serif; }
        html { scroll-behavior: smooth; }
        @keyframes nekoFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-14px) rotate(6deg); } }
        @keyframes nekoTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.55; } }
        @keyframes nekoFlicker { 0%, 100% { opacity: 0.85; transform: scaleY(1); } 45% { opacity: 1; transform: scaleY(1.05); } 70% { opacity: 0.7; transform: scaleY(0.95); } }
        @keyframes nekoDrift { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.5; } 90% { opacity: 0.3; } 100% { transform: translateY(-120px) translateX(20px); opacity: 0; } }
        @keyframes nekoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes nekoSpinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .spin-slow { animation: nekoSpin 90s linear infinite; }
        .spin-slow-rev { animation: nekoSpinRev 70s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .spin-slow, .spin-slow-rev, .twinkle, .flicker, .drift, .float-cat { animation: none !important; }
        }
        .twinkle { animation: nekoTwinkle 3.4s ease-in-out infinite; }
        .flicker { animation: nekoFlicker 2.2s ease-in-out infinite; }
        .drift { animation: nekoDrift linear infinite; }
        .float-cat { animation: nekoFloat 6s ease-in-out infinite; }
        a:focus-visible, button:focus-visible {
          outline: 2px solid #5FD4D6;
          outline-offset: 3px;
          border-radius: 4px;
        }
        .glass-frame {
          background: linear-gradient(145deg, rgba(95,212,214,0.18), rgba(232,201,122,0.10));
          backdrop-filter: blur(2px);
        }
      `}</style>

      {/* ============ NAV ============ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0b0712]/90 backdrop-blur-md shadow-[0_2px_24px_rgba(95,212,214,0.08)]" : "bg-transparent"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between" aria-label="メインナビゲーション">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group" aria-label="ねこねこ錬金工房 トップへ">
            <span className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
              <MagicCircle className="absolute inset-0 spin-slow" strokeColor="#E8C97A" opacity={0.5} />
              <Moon size={15} className="text-[#9FE3C2] relative z-10" strokeWidth={1.5} />
            </span>
           <span className="font-display text-base sm:text-lg tracking-wide text-[#F1ECDF] group-hover:text-[#5FD4D6] transition-colors">
           ねこねこ<span className="text-[#5FD4D6]">錬金工房</span>
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`text-sm tracking-wide transition-colors relative py-1 ${
                    activeSection === item.id ? "text-[#5FD4D6]" : "text-[#EDE7F6]/80 hover:text-[#F2A6C8]"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#5FD4D6]" />}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-[#F1ECDF] p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-[#0b0712]/97 backdrop-blur-md border-t border-[#5FD4D6]/15">
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left py-3 text-base tracking-wide border-b border-white/5 ${
                      activeSection === item.id ? "text-[#5FD4D6]" : "text-[#EDE7F6]/85"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-5 sm:px-8 overflow-hidden">
        <ArcaneBackdrop />
        <FloatingMotifs density={14} variant="mixed" />

        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => {
            const left = (i * 41 + 5) % 100;
            const top = (i * 29 + 3) % 70;
            const delay = (i % 8) * 0.4;
            return (
              <span
                key={i}
                className="twinkle absolute rounded-full bg-[#F1ECDF]"
                style={{ left: `${left}%`, top: `${top}%`, width: 2, height: 2, animationDelay: `${delay}s` }}
              />
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => {
            const left = (i * 53 + 8) % 100;
            const delay = (i % 5) * 1.6;
            const dur = 9 + (i % 4) * 2;
            const colors = ["#5FD4D6", "#F2A6C8", "#E8C97A"];
            return (
              <span
                key={i}
                className="drift absolute rounded-full"
                style={{
                  left: `${left}%`,
                  bottom: "10%",
                  width: 3,
                  height: 3,
                  background: colors[i % colors.length],
                  animationDelay: `${delay}s`,
                  animationDuration: `${dur}s`,
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="relative mx-auto mb-8 w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
            <MagicCircle className="absolute inset-0 w-full h-full spin-slow" strokeColor="#5FD4D6" opacity={0.55} />
            <MagicCircle
              className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] spin-slow-rev"
              strokeColor="#E8C97A"
              opacity={0.4}
            />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-10" aria-hidden="true">
              <span className="flicker block w-1 h-3 rounded-full bg-[#E8C97A] blur-[1px]" />
              <span className="flicker block w-1 h-3 rounded-full bg-[#F2A6C8] blur-[1px]" style={{ animationDelay: "0.6s" }} />
            </div>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full glass-frame border border-[#5FD4D6]/30 flex items-center justify-center float-cat overflow-hidden">
              <Image
                src={CAT_IMG}
                alt="ねこねこ錬金工房のブランドキャラクター、黒猫"
                fill
                sizes="160px"
                className="object-contain p-3 drop-shadow-[0_0_18px_rgba(95,212,214,0.25)]"
              />
            </div>
          </div>

          <p className="font-serif italic text-[#9FE3C2] text-sm sm:text-base tracking-[0.15em] mb-3">令和の魔女・アーティスト</p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#F1ECDF] tracking-wide leading-tight mb-2">
           ねこねこ<span className="text-[#5FD4D6]">錬金工房</span>
         </h1>

          <div className="flex items-center justify-center gap-2 my-6 text-[#E8C97A]/70" aria-hidden="true">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8C97A]/60" />
            <Sparkles size={14} />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8C97A]/60" />
          </div>

          <p className="text-[#EDE7F6]/90 text-base sm:text-lg leading-loose max-w-xl mx-auto mb-1">
           古代の叡智と最新テクノロジーが出会う、創造の工房。
         </p>
         <p className="text-[#EDE7F6]/90 text-base sm:text-lg leading-loose max-w-xl mx-auto mb-1">
           占術、癒し、アート、生成AIによるものづくりまで。
         </p>
         <p className="text-[#EDE7F6]/75 text-sm sm:text-base leading-loose max-w-xl mx-auto mt-4">
        「人生を少し面白くする体験」を
        <br className="hidden sm:block" />
           お届けしています。
         </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={() => scrollTo("about")}
              className="px-7 py-3 rounded-full font-display text-sm tracking-wide text-[#0b0712] bg-gradient-to-r from-[#5FD4D6] to-[#9FE3C2] hover:shadow-[0_0_24px_rgba(95,212,214,0.45)] transition-shadow w-full sm:w-auto"
            >
              プロフィールを見る
            </button>
            <button
              onClick={() => scrollTo("activities")}
              className="px-7 py-3 rounded-full font-display text-sm tracking-wide text-[#F1ECDF] border border-[#F2A6C8]/50 hover:bg-[#F2A6C8]/10 transition-colors w-full sm:w-auto"
            >
              活動紹介を見る
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-7 py-3 rounded-full font-display text-sm tracking-wide text-[#F1ECDF] border border-[#E8C97A]/40 hover:bg-[#E8C97A]/10 transition-colors w-full sm:w-auto"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="relative py-20 sm:py-28 px-5 sm:px-8">
        <ArcaneBackdrop />
        <FloatingMotifs density={6} variant="paw" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <ChapterHeading glyph="chapter one" title="工房職人" sub="自己紹介" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-3 rounded-3xl glass-frame border border-[#E8C97A]/25" aria-hidden="true" />
              <div className="relative w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border border-[#5FD4D6]/30 shadow-[0_0_30px_rgba(95,212,214,0.18)]">
                <Image src={PROFILE_IMG} alt="ネコマタトモのプロフィール写真" fill sizes="192px" className="object-cover" />
              </div>
              <span
                className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-[#0b0712] border border-[#5FD4D6]/40 flex items-center justify-center"
                aria-hidden="true"
              >
                <Star size={14} className="text-[#E8C97A]" />
              </span>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-display text-xl sm:text-2xl text-[#F1ECDF] mb-1">ネコマタ トモ</h3>
              <p className="font-serif italic text-[#9FE3C2] text-sm mb-6">令和の魔女・錬金術師</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {["牡羊座 / O型", "MBTI：INTJ-A（建築家）", "数秘：4"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs tracking-wide px-3 py-1.5 rounded-full border border-[#F2A6C8]/30 text-[#F2A6C8]/90 font-serif"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-4 text-[#EDE7F6]/85 text-sm sm:text-base leading-loose max-w-xl">
                <p>元・繊細さん。環境アレルギーや精神疾患により寝たきり・引きこもりを経験。</p>
                <p>西洋医学だけでは解決できない領域や根本的な問題解決に興味を持ち、オーラやエーテル体のヒーリングやメンタルケアを学び始める。</p>
                <p>その後、8000年の霊統を受け継ぐ魔法学校にて学びを深め、令和の魔女として活動を開始。</p>
                <p>魔女になったことで本来の創造性を取り戻し、アート・映像制作・音楽制作・歌唱・ヒーリングや占いなど領域を超えた表現活動を行うようになる。</p>
               <p>幼い頃から、土台や構造、仕組みが気になる性分。セッションにおいても現代における社会生活で停滞しがちなエネルギーを動かしたり、情熱を再稼働させたり、止まっている流れを本来の流れに戻すことを得意とする。</p>
                <p className="text-[#9FE3C2]/90">現在は茅ヶ崎を拠点に活動。健康オタク。体に良くて美味しいものが大好き。保護猫3匹と暮らしている。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ACTIVITIES ============ */}
      <section id="activities" className="relative py-20 sm:py-28 px-5 sm:px-8">
        <ArcaneBackdrop />
        <FloatingMotifs density={8} variant="star" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <ChapterHeading glyph="chapter two" title="活動紹介" sub="Activities" />

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                eyebrow: "ヒーリングサロン",
                title: "マタタビの杜",
                desc: "錬金術 × アート のセッション。ヒーリング、瞑想、占いなどを通して、自分らしさや可能性と出会うための時間をご提供しています。",
                cta: "マタタビの杜を見る",
                url: "https://tomo22.vercel.app/",
                accent: "#5FD4D6",
              },
              {
                eyebrow: "音楽活動",
                title: "ニューロナ",
                desc: "茅ヶ崎発。あんぐらねこねこ音楽隊。ダークでポップなオリジナル楽曲を制作・配信しています。",
                cta: "ニューロナを見る",
                url: "https://neurona.jp/",
                accent: "#F2A6C8",
              },
              {
                eyebrow: "アート活動",
                title: "Instagram",
                desc: "イラスト、創作活動、猫たちとの暮らし。日常の中にある小さな魔法を発信しています。",
                cta: "作品を見る",
                url: "https://www.instagram.com/pop_nyart/",
                accent: "#E8C97A",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative rounded-2xl border border-white/10 p-7 sm:p-8 bg-white/[0.02] hover:bg-white/[0.04] hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute top-4 right-4 w-9 h-9 opacity-60 group-hover:opacity-90 transition-opacity">
                  <Image src={CAT_IMG} alt="" aria-hidden="true" fill sizes="36px" className="object-contain" />
                </div>
                <span className="inline-block text-[11px] tracking-[0.2em] uppercase font-serif mb-3" style={{ color: card.accent }}>
                  {card.eyebrow}
                </span>
                <h3 className="font-display text-xl sm:text-2xl text-[#F1ECDF] mb-4">{card.title}</h3>
                <p className="text-[#EDE7F6]/75 text-sm leading-loose mb-7 min-h-[88px]">{card.desc}</p>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-display tracking-wide pb-1 border-b transition-colors"
                  style={{ color: card.accent, borderColor: `${card.accent}55` }}
                >
                  {card.cta}
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATS & MAGIC ============ */}
      <section id="magic" className="relative py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
        <ArcaneBackdrop />
        <FloatingMotifs density={12} variant="mixed" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ChapterHeading glyph="chapter three" title="猫と魔法のある暮らし" sub="Cats &amp; Magic" />

          <div className="relative mx-auto mb-10 w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <MagicCircle className="absolute inset-0 w-full h-full spin-slow-rev" strokeColor="#9FE3C2" opacity={0.45} />
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full glass-frame border border-[#9FE3C2]/30 flex items-center justify-center float-cat overflow-hidden">
              <Image
                src={CAT_IMG}
                alt="魔法陣の中で佇む黒猫キャラクター"
                fill
                sizes="144px"
                className="object-contain p-3"
              />
            </div>
          </div>

          <p className="text-[#EDE7F6]/90 text-base sm:text-lg leading-loose max-w-xl mx-auto mb-1">
            保護猫たちと暮らしながら、アートと音楽と魔法を楽しんでいます。
          </p>
          <p className="text-[#EDE7F6]/90 text-base sm:text-lg leading-loose max-w-xl mx-auto mb-1 mt-4">小さな魔法を日常に。</p>
          <p className="text-[#EDE7F6]/90 text-base sm:text-lg leading-loose max-w-xl mx-auto">自分らしさを取り戻す旅のお手伝いをしています。</p>

          <div className="flex items-center justify-center gap-6 mt-10 text-[#E8C97A]/50" aria-hidden="true">
            <Moon size={16} />
            <Star size={12} />
            <Sparkles size={16} />
            <Star size={12} />
            <Moon size={16} />
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="relative py-20 sm:py-28 px-5 sm:px-8">
        <ArcaneBackdrop />
        <FloatingMotifs density={6} variant="moon" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <ChapterHeading glyph="chapter four" title="お問い合わせ" sub="Contact" />

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image src={CAT_IMG} alt="お問い合わせへ案内する黒猫キャラクター" fill sizes="48px" className="object-contain" />
            </div>
            <p className="text-[#EDE7F6]/85 text-sm sm:text-base leading-loose text-left">
              セッション予約、イベント出演依頼、コラボレーション、取材、その他お問い合わせはこちら。
            </p>
          </div>

          <p className="font-serif italic text-[#9FE3C2] text-sm mb-8 break-all">tomonekomata22@gmail.com</p>

          <a
            href="mailto:tomonekomata22@gmail.com"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-display text-base tracking-wide text-[#0b0712] bg-gradient-to-r from-[#5FD4D6] via-[#9FE3C2] to-[#E8C97A] hover:shadow-[0_0_30px_rgba(95,212,214,0.5)] transition-shadow"
          >
            <Mail size={17} />
            メールで問い合わせる
          </a>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative pt-16 pb-10 px-5 sm:px-8 border-t border-white/10">
        <ArcaneBackdrop />
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <MagicCircle className="absolute inset-0 spin-slow" strokeColor="#E8C97A" opacity={0.4} />
            <div className="relative w-10 h-10">
              <Image src={CAT_IMG} alt="ねこねこ錬金工房" fill sizes="40px" className="object-contain" />
            </div>
          </div>
          <p className="font-display text-lg text-[#F1ECDF] tracking-wide mb-1">ねこねこ錬金工房</p>
          <p className="font-serif italic text-[#9FE3C2]/80 text-sm mb-1">令和の魔女・アーティスト ネコマタトモ</p>
          <p className="text-[#EDE7F6]/40 text-xs mb-6">© Nekomata Tomo</p>

          <nav aria-label="フッターリンク" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="https://tomo22.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EDE7F6]/60 hover:text-[#5FD4D6] transition-colors"
            >
              マタタビの杜
            </a>
            <a
              href="https://neurona.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EDE7F6]/60 hover:text-[#F2A6C8] transition-colors"
            >
              ニューロナ
            </a>
            <a
              href="https://www.instagram.com/pop_nyart/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EDE7F6]/60 hover:text-[#E8C97A] transition-colors"
            >
              Instagram
            </a>
            <a href="mailto:tomonekomata22@gmail.com" className="text-[#EDE7F6]/60 hover:text-[#9FE3C2] transition-colors">
              メール
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
