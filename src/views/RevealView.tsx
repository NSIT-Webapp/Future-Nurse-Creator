import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
        @keyframes float-stagger-1 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-7px) rotate(2deg);} }
        @keyframes float-stagger-2 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-10px) rotate(-3deg);} }
        @keyframes float-stagger-3 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-6px) rotate(3deg);} }

        /* ── Aura glow ── */
        @keyframes aura-pulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1);} 50%{opacity:.9;transform:translateX(-50%) scale(1.06);} }

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

        /* ── Character rise-in from bottom ── */
        @keyframes char-rise-in {
          0%   { transform: translateY(50px) scale(0.88); opacity: 0; }
          65%  { transform: translateY(0px) scale(1.01); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        .char-rise-in {
          animation: char-rise-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .box-slide-up-1 { animation: box-slide-up 0.4s ease-out 0.6s both; }
        .box-slide-up-2 { animation: box-slide-up 0.4s ease-out 0.75s both; }
        .box-slide-up-3 { animation: box-slide-up 0.4s ease-out 0.9s both; }
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
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-2.5 sm:pt-3 max-w-[720px] mx-auto w-full header-slide-in">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 sm:px-3.5 py-1 shadow-md flex items-center gap-2 border border-white/85">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-5.5 sm:h-7 md:h-7.5 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
      </div>

      {/* ── 2. Stepper: 1..8 with Step 6 Highlight ──────────────────────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 pt-1 pb-2.5 sm:pb-3.5 max-w-[720px] mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 6;
            const isCurrent = stepNum === 6;
            const isLast = idx === stepperSteps.length - 1;

            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center shrink-0 relative">
                  <div
                    className={`w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] sm:text-xs md:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_16px_rgba(255,51,102,.65)] scale-110 ring-2 sm:ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-xs'
                        : 'bg-white/80 text-slate-400 border border-slate-300/80'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {isCurrent && (
                    <div className="absolute -bottom-4 sm:-bottom-4.5 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[7.5px] sm:text-[8.5px] tracking-wider uppercase shadow-xs whitespace-nowrap animate-pulse">
                      REVEAL
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="flex-1 mx-0.5 flex items-center min-w-[4px]">
                    <div
                      className={`w-full border-t-[1.5px] sm:border-t-2 ${
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
      <div className="relative z-20 flex-1 flex flex-col justify-between min-h-0 w-full max-w-[680px] mx-auto px-2.5 sm:px-4 py-1">

        {/* ── Header Titles ── */}
        <div className="text-center shrink-0">
          {/* REVEAL Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-0.5 rounded-full bg-white/95 border border-rose-200/80 text-[#FF3366] text-[9.5px] sm:text-[11px] font-black uppercase tracking-widest mb-1 shadow-xs">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
            <span>✦ REVEAL ✦</span>
            <span className="text-[10px]">💕</span>
          </div>

          {/* AI Headline */}
          <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 tracking-tight leading-snug drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
            <span className="text-[#FF2D55] font-black">AI </span>
            พบเส้นทางพยาบาลที่ใช่สำหรับคุณแล้ว!
          </h3>

          {/* 5 Questions Subtitle */}
          <p className="text-[10px] sm:text-[11.5px] md:text-xs font-bold text-rose-500 mt-0.5 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            <span>💕</span>
            <span>จากคำตอบทั้ง 5 ข้อของคุณ</span>
            <span>💕</span>
          </p>

          {/* Path Title EN (Fluid responsive typography) */}
          <h2
            className="text-[clamp(1.4rem,4.5vw,2.4rem)] font-black uppercase leading-tight font-heading mt-1 sm:mt-1.5 title-shimmer px-1"
            style={{ '--title-color': bubbleTextColor } as React.CSSProperties}
          >
            {displayTitleEn}
          </h2>

          {/* Thai Ribbon Pill */}
          <div className="inline-flex items-center justify-center mt-1 mb-0.5">
            <div
              className="px-4 sm:px-5.5 py-0.5 sm:py-1 rounded-full text-white text-[11px] sm:text-xs md:text-sm font-extrabold shadow-md tracking-wide flex items-center gap-1.5 sm:gap-2"
              style={{ backgroundColor: ribbonColor }}
            >
              <span className="opacity-90 text-[9px] sm:text-xs">♥</span>
              <span>{displayRibbonTh}</span>
              <span className="opacity-90 text-[9px] sm:text-xs">♥</span>
            </div>
          </div>
        </div>

        {/* ── Center Stage: Aura Glow, Character & 3D Stickers ── */}
        <div className="flex-1 relative flex items-end justify-center min-h-[160px] sm:min-h-[220px] md:min-h-[280px] overflow-visible my-auto">
          {/* Radial Aura Glow */}
          <div
            className="absolute left-1/2 bottom-0 w-[min(72vw,360px)] h-[min(72vw,360px)] rounded-full pointer-events-none"
            style={{
              transform: 'translateX(-50%)',
              background: `radial-gradient(circle, ${themeColor}50 0%, ${themeColor}20 50%, transparent 72%)`,
              animation: 'aura-pulse 5s ease-in-out infinite',
            }}
          />
          {/* Inner Ring */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(58vw,290px)] h-[min(58vw,290px)] rounded-full border-2 border-white/70 shadow-[0_0_26px_rgba(255,255,255,0.85)] pointer-events-none" />

          {/* Floating Stickers */}
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
                      width: `clamp(42px, calc(${sticker.size} * 0.85px), ${sticker.size}px)`,
                      height: 'auto',
                      transform: sticker.rotate ? `rotate(${sticker.rotate})` : undefined,
                    }}
                    className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.16)]"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              );
            })}
          </div>

          {/* Character Cutout */}
          <div className="relative z-10 flex items-end justify-center w-full h-full max-h-[clamp(180px,36vh,420px)]">
            <img
              src={characterImgUrl}
              alt={`${displayTitleEn} - ${isFemale ? 'Female' : 'Male'}`}
              className="h-full w-auto max-w-full object-contain drop-shadow-[0_14px_36px_rgba(0,43,127,0.3)] select-none char-rise-in"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>

        {/* ── Bottom Information Capsules ── */}
        <div className="shrink-0 space-y-1.5 sm:space-y-2 pt-1 pb-1">
          {/* 2-Column Grid: Superpower & AI Skill */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
            {/* Superpower */}
            <div className="bg-white/95 border border-rose-100/90 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-sm min-h-[52px] sm:min-h-[64px] box-slide-up-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-50 flex items-center justify-center shrink-0 overflow-hidden p-1 border border-rose-100">
                <img src="/assets/reveal/stickers/COMM/heart-pink.png" alt="Superpower" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-400 block leading-tight">
                  Your Superpower
                </span>
                <span className="text-[10.5px] sm:text-[12.5px] font-black text-rose-600 block leading-tight mt-0.5 line-clamp-2">
                  {superpower}
                </span>
              </div>
            </div>

            {/* AI Skill */}
            <div className="bg-white/95 border border-sky-100/90 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-sm min-h-[52px] sm:min-h-[64px] box-slide-up-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-50 flex items-center justify-center shrink-0 overflow-hidden p-1 border border-sky-100">
                <img src={aiSkillIconSrc} alt="AI Skill" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-500 block leading-tight">
                  Your AI Skill
                </span>
                <span className="text-[10.5px] sm:text-[12.5px] font-black text-sky-700 block leading-tight mt-0.5 line-clamp-2">
                  {aiSkill}
                </span>
              </div>
            </div>
          </div>

          {/* Impact Message Box */}
          <div className="bg-white/95 border border-white/85 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm flex items-center gap-2 sm:gap-2.5">
            <img src={impactHeartSrc} alt="Impact" className="w-5.5 h-5.5 sm:w-7 sm:h-7 object-contain shrink-0" />
            <p className="text-[10.5px] sm:text-xs md:text-[13px] font-bold text-slate-700 leading-snug text-center flex-1">
              {impact}
            </p>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Navigation Action Bar ──────────────────────────────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 max-w-[680px] mx-auto w-full flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Back Button */}
        {onBack ? (
          <button
            onClick={onBack}
            className="flex-1 max-w-[140px] sm:max-w-[180px] h-11 sm:h-12.5 rounded-full bg-white/95 hover:bg-white text-[#002B7F] font-black text-xs sm:text-sm md:text-base border-2 border-white/90 shadow-[0_4px_16px_rgba(0,43,127,0.12)] flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#002B7F] stroke-[2.5]" />
            <span>ย้อนกลับ</span>
          </button>
        ) : (
          <div />
        )}

        {/* View My Card CTA Button */}
        <button
          onClick={onNext}
          className="flex-[2] max-w-[260px] sm:max-w-[310px] h-11 sm:h-12.5 rounded-full bg-gradient-to-r from-[#FF3366] via-[#FF537A] to-[#FF3366] text-white font-black text-xs sm:text-sm md:text-base shadow-lg shadow-rose-500/35 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition-all cursor-pointer btn-next-cta relative overflow-hidden group"
        >
          {/* Glossy top sheen */}
          <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent rounded-t-full pointer-events-none" />
          
          <span className="relative z-10 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            ดูการ์ดของฉัน
          </span>
          <ChevronRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default RevealView;
