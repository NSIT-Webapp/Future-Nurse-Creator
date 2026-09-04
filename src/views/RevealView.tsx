import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

import { ResultPayload } from '../types';
import { ASSETS, getRevealStickers } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';
import pathsData from '../data/paths.json';

interface RevealViewProps {
  result: ResultPayload;
  onNext: () => void;
  onBack?: () => void;
}

// ─── Floating Star Particle ───────────────────────────────────────────────────
interface StarParticle {
  id: number;
  x: number;      // % from left
  size: number;   // px
  delay: number;  // s
  duration: number; // s
  opacity: number;
}

function generateStars(count: number): StarParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 3.5 + 2,   // 2–5.5px
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 5, // 5–9s
    opacity: Math.random() * 0.45 + 0.4,
  }));
}

export const RevealView: React.FC<RevealViewProps> = ({ result, onNext, onBack }) => {
  const isFemale = result.characterType === 'female_student';
  const pathId = result.pathId;
  const pathInfo = (pathsData.paths as Record<string, any>)[pathId] || result.path;

  // Male / Female character asset lookup
  const characterImgUrl = isFemale
    ? (ASSETS.characters as any)[pathId]?.female || `/characters/${pathId}_female.png`
    : (ASSETS.characters as any)[pathId]?.male || `/characters/${pathId}_male.png`;

  const stickers = getRevealStickers(pathId);
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  const themeColor = pathInfo.themeColor || '#0284C7';
  const ribbonColor = pathInfo.ribbonColor || '#0284C7';
  const bubbleTextColor = pathInfo.bubbleTextColor || '#0284C7';
  const displayTitleEn = pathInfo.titleEn || result.path.nameEn?.toUpperCase() || 'FUTURE NURSE';
  const displayRibbonTh = pathInfo.ribbonTh || result.path.nameTh || 'พยาบาลแห่งอนาคต';

  const superpower = result.superpower || pathInfo.signatureSuperpower || 'Communication';
  const aiSkill = result.aiSkill || pathInfo.signatureAiSkill || 'Healthcare AI Creator';
  const impact = result.profileImpact || pathInfo.signatureImpact || 'สร้างความเปลี่ยนแปลงที่ดีเพื่อสุขภาวะของผู้คน';

  const aiSkillIconSrc =
    pathId === 'OA'   ? '/assets/reveal/stickers/OA/heart-green.png' :
    pathId === 'ER'   ? '/assets/reveal/stickers/ER/heart-ecg.png' :
    pathId === 'COMM' ? '/assets/reveal/stickers/COMM/group-circle.png' :
    pathId === 'INT'  ? '/assets/reveal/stickers/INT/globe.png' :
    pathId === 'MH'   ? '/assets/reveal/stickers/MH/brain-smile.png' :
    pathId === 'PED'  ? '/assets/reveal/stickers/PED/star-blue-smile.png' :
    pathId === 'MAT'  ? '/assets/reveal/stickers/MAT/baby-in-heart.png' :
    '/assets/reveal/stickers/TECH/chip-ai.png';

  const impactHeartSrc = pathId === 'MH'
    ? '/assets/reveal/stickers/MH/heart-purple.png'
    : pathId === 'OA'
    ? '/assets/reveal/stickers/OA/heart-green.png'
    : '/assets/reveal/stickers/COMM/heart-pink.png';

  // Star particles (stable across renders)
  const stars = useMemo(() => generateStars(16), []);

  // Confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.32 },
        colors: [themeColor, '#FF3366', '#38BDF8', '#F59E0B', '#10B981'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.42, x: 0.35 },
          colors: [themeColor, '#FF3366', '#FFF'],
        });
      }, 450);
      return () => clearTimeout(timer);
    } catch (_e) {}
  }, [themeColor]);

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none bg-cover animate-fade-in scrollbar-none"
      style={{
        backgroundImage: `url(${ASSETS.reveal.background})`,
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
      }}
      data-slot="reveal-root"
    >
      <style>{`
        /* ── Sticker float ── */
        @keyframes float-stagger-1 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-8px) rotate(2deg);} }
        @keyframes float-stagger-2 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-11px) rotate(-3deg);} }
        @keyframes float-stagger-3 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-7px) rotate(3deg);} }

        /* ── Aura Core Animations ── */
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.72; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.96; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes aura-ripple-expand {
          0%   { transform: translate(-50%, -50%) scale(0.92); opacity: 0.85; }
          70%  { transform: translate(-50%, -50%) scale(1.18); opacity: 0.25; }
          100% { transform: translate(-50%, -50%) scale(1.24); opacity: 0; }
        }
        @keyframes aura-spin-rays {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes aura-orbit-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes star-twinkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50%      { transform: scale(1.35) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 8px rgba(255,255,255,1)); }
        }

        /* ── CTA Button Pulse & Shimmer ── */
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 6px 22px rgba(255, 51, 102, 0.42), 0 0 0 0 rgba(255, 51, 102, 0.2); }
          50% { box-shadow: 0 10px 32px rgba(255, 51, 102, 0.68), 0 0 0 6px rgba(255, 51, 102, 0); }
        }
        .btn-next-cta {
          animation: cta-glow 2.5s ease-in-out infinite;
        }

        /* ── Holographic shimmer on title ── */
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .title-shimmer {
          background: linear-gradient(
            105deg,
            var(--title-color) 0%,
            var(--title-color) 30%,
            rgba(255,255,255,0.95) 45%,
            rgba(255,220,100,0.9) 50%,
            rgba(255,255,255,0.95) 55%,
            var(--title-color) 70%,
            var(--title-color) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep 3s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.16)) drop-shadow(0 0 16px rgba(255,255,255,0.45));
        }

        /* ── Half-body character rise-in from bottom ── */
        @keyframes char-bust-rise {
          0%   { transform: translateY(40px) scale(1.2); opacity: 0; }
          65%  { transform: translateY(0px) scale(1.32); opacity: 1; }
          100% { transform: translateY(0px) scale(1.3); opacity: 1; }
        }
        .char-bust-rise {
          animation: char-bust-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.12s;
          opacity: 0;
        }

        /* ── Star particles float up ── */
        @keyframes star-float {
          0%   { transform: translateY(0px) scale(1); opacity: var(--star-opacity); }
          50%  { transform: translateY(-25vh) scale(1.25); opacity: calc(var(--star-opacity) * 0.85); }
          100% { transform: translateY(-50vh) scale(0.6); opacity: 0; }
        }
        .star-particle {
          position: absolute;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 6px 2px rgba(255,255,255,0.85), 0 0 12px 3px rgba(255,255,255,0.35);
          animation: star-float var(--star-dur) ease-in-out infinite;
          animation-delay: var(--star-delay);
          pointer-events: none;
        }

        /* ── Header fade-slide in ── */
        @keyframes header-slide-in {
          from { transform: translateY(-14px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .header-slide-in { animation: header-slide-in 0.45s ease-out forwards; }

        /* ── Info boxes slide up with stagger ── */
        @keyframes box-slide-up {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .box-slide-up-1 { animation: box-slide-up 0.45s ease-out 0.55s both; }
        .box-slide-up-2 { animation: box-slide-up 0.45s ease-out 0.7s both; }
        .box-slide-up-3 { animation: box-slide-up 0.45s ease-out 0.85s both; }
      `}</style>

      {/* Sky ambient lighting gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-blue-950/20 pointer-events-none" />

      {/* Star Particles Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star-particle"
            style={{
              left: `${s.x}%`,
              bottom: `${Math.random() * 25}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--star-opacity': s.opacity,
              '--star-dur': `${s.duration}s`,
              '--star-delay': `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3.5 sm:px-6 pt-3 sm:pt-3.5 max-w-[720px] mx-auto w-full header-slide-in">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 shadow-md flex items-center gap-2 border border-white/85">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-6 sm:h-7.5 md:h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
      </div>

      {/* ── 2. Stepper: 1..8 with Step 6 Highlight ──────────────────────────── */}
      <div className="relative z-30 shrink-0 px-3.5 sm:px-6 pt-1 pb-2 sm:pb-3 max-w-[720px] mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 6;
            const isCurrent = stepNum === 6;
            const isLast = idx === stepperSteps.length - 1;

            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center shrink-0 relative">
                  <div
                    className={`w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,.65)] scale-110 ring-2 sm:ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-xs'
                        : 'bg-white/80 text-slate-400 border border-slate-300/80'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {isCurrent && (
                    <div className="absolute -bottom-4.5 sm:-bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[8px] sm:text-[9px] tracking-wider uppercase shadow-xs whitespace-nowrap animate-pulse">
                      REVEAL
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="flex-1 mx-0.5 flex items-center min-w-[4px]">
                    <div
                      className={`w-full border-t-[2px] ${
                        stepNum < 6 ? 'border-[#1D63D8]' : 'border-white/60'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. Main Body: Adaptive Flex-1 Area ───────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between min-h-0 w-full max-w-[680px] mx-auto px-3 sm:px-5 py-0.5 sm:py-1">

        {/* ── Header Titles ── */}
        <div className="text-center shrink-0">
          {/* REVEAL Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1 rounded-full bg-white/95 border border-rose-200/80 text-[#FF3366] text-xs sm:text-sm font-black uppercase tracking-widest mb-1 shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
            <span>✦ REVEAL ✦</span>
            <span className="text-xs">💕</span>
          </div>

          {/* AI Headline */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-snug drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
            <span className="text-[#FF2D55] font-black">AI </span>
            พบเส้นทางพยาบาลที่ใช่สำหรับคุณแล้ว!
          </h3>

          {/* Path Title EN (Fluid responsive typography) */}
          <h2
            className="text-[clamp(1.75rem,5.5vw,2.85rem)] font-black uppercase leading-tight font-heading mt-1 sm:mt-1.5 title-shimmer px-1"
            style={{ '--title-color': bubbleTextColor } as React.CSSProperties}
          >
            {displayTitleEn}
          </h2>

          {/* Thai Ribbon Pill */}
          <div className="inline-flex items-center justify-center mt-1.5 mb-0.5">
            <div
              className="px-5 sm:px-7 py-1 sm:py-1.5 rounded-full text-white text-base sm:text-lg md:text-xl font-extrabold shadow-md tracking-wide flex items-center gap-2"
              style={{ backgroundColor: ribbonColor }}
            >
              <span className="opacity-90 text-xs sm:text-sm">♥</span>
              <span>{displayRibbonTh}</span>
              <span className="opacity-90 text-xs sm:text-sm">♥</span>
            </div>
          </div>
        </div>

        {/* ── Center Stage: Half-body Character Framing inside Large Aura Portal ── */}
        <div className="flex-1 relative flex items-end justify-center min-h-[170px] sm:min-h-[220px] md:min-h-[270px] overflow-hidden my-auto">
          
          {/* ════════════════════════════════════════════════════════════════════
              MAGICAL AURA PORTAL SYSTEM (Enlarged + Rich Lighting)
             ════════════════════════════════════════════════════════════════════ */}

          {/* 1. Rotating Celestial Sunray Beams */}
          <div
            className="absolute left-1/2 top-[50%] w-[min(98vw,490px)] h-[min(98vw,490px)] rounded-full pointer-events-none opacity-45"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${themeColor}60 30deg, transparent 60deg, #FF658450 90deg, transparent 120deg, ${themeColor}60 180deg, transparent 210deg, #FFD70050 270deg, transparent 300deg, ${themeColor}60 360deg)`,
              animation: 'aura-spin-rays 22s linear infinite',
            }}
          />

          {/* 2. Expanding Divine Ripple Wave */}
          <div
            className="absolute left-1/2 top-[50%] w-[min(86vw,430px)] h-[min(86vw,430px)] rounded-full pointer-events-none border-2 border-white/60"
            style={{
              boxShadow: `0 0 35px ${themeColor}85, inset 0 0 25px rgba(255,255,255,0.85)`,
              animation: 'aura-ripple-expand 3.8s ease-out infinite',
            }}
          />

          {/* 3. Outermost Radial Ambient Aura Glow */}
          <div
            className="absolute left-1/2 top-[50%] w-[min(96vw,480px)] h-[min(96vw,480px)] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${themeColor}70 0%, #FF658430 44%, ${themeColor}18 62%, transparent 75%)`,
              animation: 'aura-pulse 4.5s ease-in-out infinite',
            }}
          />

          {/* 4. Concentric Glowing Celestial White Ring */}
          <div
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[min(84vw,410px)] h-[min(84vw,410px)] rounded-full border-[2.5px] border-white/95 shadow-[0_0_40px_rgba(255,255,255,1),0_0_18px_rgba(255,255,255,0.9)] pointer-events-none"
          />

          {/* 5. Inner Delicate Prismatic Ring */}
          <div
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[min(70vw,340px)] h-[min(70vw,340px)] rounded-full border border-white/55 shadow-[inset_0_0_26px_rgba(255,255,255,0.75)] pointer-events-none"
          />

          {/* 6. Orbiting Stardust Stars around the Celestial Ring */}
          <div
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[min(84vw,410px)] h-[min(84vw,410px)] rounded-full pointer-events-none"
            style={{ animation: 'aura-orbit-spin 16s linear infinite' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 text-amber-200 flex items-center justify-center font-black" style={{ animation: 'star-twinkle 2.2s ease-in-out infinite' }}>
              ✦
            </div>
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white flex items-center justify-center font-black" style={{ animation: 'star-twinkle 2.5s ease-in-out 0.6s infinite' }}>
              ✦
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4.5 h-4.5 text-rose-200 flex items-center justify-center font-black" style={{ animation: 'star-twinkle 2.8s ease-in-out 1.2s infinite' }}>
              ✦
            </div>
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-cyan-200 flex items-center justify-center font-black" style={{ animation: 'star-twinkle 2.4s ease-in-out 1.8s infinite' }}>
              ✦
            </div>
          </div>

          {/* ── Floating 3D Stickers (Enlarged +25%) ── */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {stickers.map((sticker, sIdx) => {
              const animStyle = sIdx % 3 === 0 ? 'float-stagger-1' : sIdx % 3 === 1 ? 'float-stagger-2' : 'float-stagger-3';
              return (
                <div
                  key={sticker.id}
                  className="absolute select-none transition-transform"
                  style={{
                    ...sticker.position,
                    zIndex: sticker.zIndex ?? (sIdx < 3 ? 25 : 15),
                    animation: `${animStyle} ${sticker.animationDuration || '4s'} ease-in-out infinite`,
                    animationDelay: sticker.animationDelay || `${sIdx * 0.35}s`,
                  }}
                >
                  <img
                    src={sticker.src}
                    alt={sticker.name}
                    style={{
                      width: `clamp(58px, calc(${sticker.size} * 1.15px), ${Math.round(sticker.size * 1.25)}px)`,
                      height: 'auto',
                      transform: sticker.rotate ? `rotate(${sticker.rotate})` : undefined,
                    }}
                    className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.2)]"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              );
            })}
          </div>

          {/* ── Half-Body Bust Character ── */}
          <div className="relative z-10 flex items-end justify-center w-full h-full max-h-[clamp(190px,36vh,430px)] origin-bottom">
            <img
              src={characterImgUrl}
              alt={`${displayTitleEn} - ${isFemale ? 'Female' : 'Male'}`}
              className="h-full w-auto max-w-full object-contain object-top drop-shadow-[0_18px_44px_rgba(0,43,127,0.35)] select-none char-bust-rise scale-[1.28] sm:scale-[1.36] origin-top translate-y-[2%] sm:translate-y-[4%]"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>

        {/* ── Bottom Information Capsules (EXTRA ENLARGED & HIGHLY ATTRACTIVE CARDS) ── */}
        <div className="shrink-0 space-y-2.5 sm:space-y-3 pt-2 pb-1.5">
          {/* 2-Column Grid: Superpower & AI Skill */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {/* Superpower Card */}
            <div className="bg-gradient-to-br from-[#FFF5F8]/98 via-white/95 to-[#FFEBF0]/95 border-2 border-rose-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-[0_8px_24px_rgba(255,51,102,0.14)] min-h-[76px] sm:min-h-[90px] md:min-h-[96px] box-slide-up-1 relative overflow-hidden group">
              {/* Subtle shine corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-300/10 rounded-full blur-xl pointer-events-none" />

              {/* Large 3D Icon Container */}
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-tr from-[#FFE4E9] to-[#FFF0F3] flex items-center justify-center shrink-0 overflow-hidden p-2 border-2 border-rose-200 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src="/assets/reveal/stickers/COMM/heart-pink.png"
                  alt="Superpower"
                  className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(255,51,102,0.25)]"
                />
              </div>

              {/* Content text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-500 block leading-tight">
                    Your Superpower
                  </span>
                </div>
                <span className="text-sm sm:text-base md:text-lg font-black text-rose-700 block leading-snug line-clamp-2 drop-shadow-2xs">
                  {superpower}
                </span>
              </div>
            </div>

            {/* AI Skill Card */}
            <div className="bg-gradient-to-br from-[#F0F9FF]/98 via-white/95 to-[#E0F2FE]/95 border-2 border-sky-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-[0_8px_24px_rgba(2,132,199,0.14)] min-h-[76px] sm:min-h-[90px] md:min-h-[96px] box-slide-up-2 relative overflow-hidden group">
              {/* Subtle shine corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-sky-300/10 rounded-full blur-xl pointer-events-none" />

              {/* Large 3D Icon Container */}
              <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-tr from-[#E0F2FE] to-[#F0F9FF] flex items-center justify-center shrink-0 overflow-hidden p-2 border-2 border-sky-200 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={aiSkillIconSrc}
                  alt="AI Skill"
                  className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(2,132,199,0.25)]"
                />
              </div>

              {/* Content text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <Zap className="w-3 h-3 text-sky-500 fill-sky-500" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-sky-600 block leading-tight">
                    Your AI Skill
                  </span>
                </div>
                <span className="text-sm sm:text-base md:text-lg font-black text-sky-800 block leading-snug line-clamp-2 drop-shadow-2xs">
                  {aiSkill}
                </span>
              </div>
            </div>
          </div>

          {/* Impact Message Box (Premium Horizontal Pill) */}
          <div className="bg-gradient-to-r from-white/98 via-[#FFFDF8]/98 to-white/98 border-2 border-amber-200/80 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3.5 sm:py-4 shadow-[0_8px_24px_rgba(0,43,127,0.1)] flex items-center justify-between gap-3 sm:gap-4 box-slide-up-3">
            {/* Large 3D Heart */}
            <img
              src={impactHeartSrc}
              alt="Impact"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
            />
            {/* Message */}
            <p className="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 leading-snug text-center flex-1">
              {impact}
            </p>
            {/* Sparkles */}
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 shrink-0 animate-pulse fill-amber-300" />
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Navigation Action Bar ──────────────────────────────────── */}
      <div className="relative z-30 shrink-0 px-3.5 sm:px-6 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2.5 max-w-[680px] mx-auto w-full flex items-center justify-between gap-3 sm:gap-4">
        {/* Back Button */}
        {onBack ? (
          <button
            onClick={onBack}
            className="flex-1 max-w-[160px] sm:max-w-[200px] min-h-[52px] h-13 sm:h-14 rounded-full bg-white/95 hover:bg-white text-[#002B7F] font-bold text-lg sm:text-xl border-2 border-white/90 shadow-[0_4px_16px_rgba(0,43,127,0.14)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5 text-[#002B7F] stroke-[2.5]" />
            <span>ย้อนกลับ</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={onNext}
          className="flex-[2] max-w-[280px] sm:max-w-[340px] min-h-[52px] h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#FF3366] via-[#FF537A] to-[#FF3366] text-white font-black text-xl sm:text-2xl shadow-lg shadow-rose-500/35 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer btn-next-cta relative overflow-hidden group"
        >
          {/* Glossy top sheen */}
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-full pointer-events-none" />
          
          <span className="relative z-10 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            ดูการ์ดของฉัน
          </span>
          <ChevronRight className="relative z-10 w-6 h-6 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RevealView;
