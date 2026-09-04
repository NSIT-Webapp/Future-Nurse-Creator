import React, { useEffect, useMemo } from 'react';
import { ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
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
    size: Math.random() * 4 + 2,   // 2–6px
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 5, // 5–9s
    opacity: Math.random() * 0.5 + 0.4,
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

  // ── Effect 3: Star particles (stable across renders) ─────────────────────
  const stars = useMemo(() => generateStars(18), []);

  // ── Confetti on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.35 }, colors: [themeColor, '#FF3366', '#38BDF8', '#F59E0B', '#10B981'] });
      setTimeout(() => {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.45, x: 0.3 }, colors: [themeColor, '#FF3366', '#FFF'] });
      }, 500);
    } catch (_e) {}
  }, [themeColor]);

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden select-none bg-cover animate-fade-in"
      style={{ backgroundImage: `url(${ASSETS.reveal.background})`, backgroundPosition: 'center bottom', backgroundSize: 'cover' }}
      data-slot="reveal-root"
    >
      <style>{`
        /* ── Sticker float ── */
        @keyframes float-stagger-1 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-8px) rotate(2deg);} }
        @keyframes float-stagger-2 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-11px) rotate(-3deg);} }
        @keyframes float-stagger-3 { 0%,100%{transform:translateY(0px) rotate(0deg);} 50%{transform:translateY(-7px) rotate(3deg);} }

        /* ── Aura glow ── */
        @keyframes aura-pulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1);} 50%{opacity:.9;transform:translateX(-50%) scale(1.06);} }

        /* ── CTA button ── */
        @keyframes cta-pulse { 0%,100%{box-shadow:0 6px 24px rgba(255,51,102,.45);} 50%{box-shadow:0 8px 32px rgba(255,51,102,.7);} }
        .animate-cta-pulse { animation: cta-pulse 2.5s ease-in-out infinite; }

        /* ── EFFECT 1: Holographic shimmer on title ── */
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
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.18)) drop-shadow(0 0 20px rgba(255,255,255,0.5));
        }

        /* ── EFFECT 2: Character bounce-in from bottom ── */
        @keyframes char-bounce-in {
          0%   { transform: translateY(60px) scale(0.85); opacity: 0; }
          60%  { transform: translateY(-12px) scale(1.03); opacity: 1; }
          80%  { transform: translateY(6px) scale(0.98); }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        .char-bounce-in {
          animation: char-bounce-in 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.15s;
          opacity: 0;
        }

        /* ── EFFECT 3: Star particles float up ── */
        @keyframes star-float {
          0%   { transform: translateY(0px) scale(1); opacity: var(--star-opacity); }
          50%  { transform: translateY(-30vh) scale(1.3); opacity: calc(var(--star-opacity) * 0.8); }
          100% { transform: translateY(-60vh) scale(0.6); opacity: 0; }
        }
        .star-particle {
          position: absolute;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 6px 2px rgba(255,255,255,0.9), 0 0 12px 4px rgba(255,255,255,0.4);
          animation: star-float var(--star-dur) ease-in-out infinite;
          animation-delay: var(--star-delay);
          pointer-events: none;
        }
        .star-particle::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%);
        }

        /* ── Header fade-slide in ── */
        @keyframes header-slide-in {
          from { transform: translateY(-16px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .header-slide-in { animation: header-slide-in 0.5s ease-out forwards; }

        /* ── Info boxes slide up with stagger ── */
        @keyframes box-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .box-slide-up-1 { animation: box-slide-up 0.4s ease-out 0.7s both; }
        .box-slide-up-2 { animation: box-slide-up 0.4s ease-out 0.85s both; }
        .box-slide-up-3 { animation: box-slide-up 0.4s ease-out 1.0s both; }
      `}</style>

      {/* Sky gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-blue-900/20 pointer-events-none" />

      {/* ── EFFECT 3: Star Particles ─────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className="star-particle"
            style={{
              left: `${s.x}%`,
              bottom: `${Math.random() * 30}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              '--star-opacity': s.opacity,
              '--star-dur': `${s.duration}s`,
              '--star-delay': `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Top Bar */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-5 pt-2.5 sm:pt-3 max-w-[720px] mx-auto w-full header-slide-in">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1 shadow-md flex items-center gap-2 border border-white/80">
          <img src={ASSETS.home.facultyLogo} alt="มหาวิทยาลัยมหิดล" className="h-6 sm:h-7 w-auto object-contain" />
        </div>
        <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
      </div>

      {/* Stepper */}
      <div className="relative z-30 shrink-0 px-3 sm:px-5 pt-1 pb-3 sm:pb-4 max-w-[720px] mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 6;
            const isCurrent = stepNum === 6;
            const isLast = idx === stepperSteps.length - 1;
            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center shrink-0 relative">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                    isCurrent ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,.65)] scale-110 ring-4 ring-rose-200/80'
                    : isCompleted ? 'bg-[#1D63D8] text-white shadow-sm'
                    : 'bg-white/80 text-slate-400 border border-slate-300/80'}`}>
                    {stepNum}
                  </div>
                  {isCurrent && (
                    <div className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[8px] tracking-wider uppercase shadow-sm whitespace-nowrap animate-pulse">
                      REVEAL
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="flex-1 mx-0.5 flex items-center">
                    <div className={`w-full border-t-2 ${stepNum < 6 ? 'border-[#1D63D8]' : 'border-white/60'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col min-h-0 w-full max-w-[680px] mx-auto px-3 sm:px-4">

        {/* Header Block */}
        <div className="text-center shrink-0">
          <div className="inline-flex items-center gap-1.5 px-4 py-0.5 rounded-full bg-white/95 border border-rose-200/80 text-[#FF3366] text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-1 shadow-sm">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>✦ REVEAL ✦</span>
            <span>💕</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-snug drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]">
            <span className="text-[#FF2D55] font-black">AI </span>
            พบเส้นทางพยาบาลที่ใช่สำหรับคุณแล้ว!
          </h3>

          <p className="text-[11px] sm:text-xs font-bold text-rose-500 mt-0.5 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            <span>💕</span><span>จากคำตอบทั้ง 5 ข้อของคุณ</span><span>💕</span>
          </p>

          {/* ── EFFECT 1: Holographic Shimmer Title ── */}
          <h2
            className="text-[28px] sm:text-[34px] md:text-[40px] font-black uppercase leading-tight font-heading mt-1.5 title-shimmer"
            style={{ '--title-color': bubbleTextColor } as React.CSSProperties}
          >
            {displayTitleEn}
          </h2>

          <div className="inline-flex items-center justify-center mt-1 mb-0.5">
            <div className="px-5 py-1 rounded-full text-white text-xs sm:text-sm font-extrabold shadow-md tracking-wide flex items-center gap-2" style={{ backgroundColor: ribbonColor }}>
              <span className="opacity-90">♥</span>
              <span>{displayRibbonTh}</span>
              <span className="opacity-90">♥</span>
            </div>
          </div>
        </div>

        {/* Character Stage */}
        <div className="flex-1 relative flex items-end justify-center min-h-0 overflow-visible">
          {/* Aura glow */}
          <div
            className="absolute left-1/2 bottom-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full pointer-events-none"
            style={{ transform: 'translateX(-50%)', background: `radial-gradient(circle, ${themeColor}50 0%, ${themeColor}22 50%, transparent 72%)`, animation: 'aura-pulse 5s ease-in-out infinite' }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border-2 border-white/70 shadow-[0_0_30px_rgba(255,255,255,0.85)] pointer-events-none" />

          {/* Floating Stickers */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {stickers.map((sticker, sIdx) => {
              const animStyle = sIdx % 3 === 0 ? 'float-stagger-1' : sIdx % 3 === 1 ? 'float-stagger-2' : 'float-stagger-3';
              return (
                <div key={sticker.id} className="absolute select-none" style={{ ...sticker.position, zIndex: sticker.zIndex ?? (sIdx < 3 ? 25 : 15), animation: `${animStyle} ${sticker.animationDuration || '4s'} ease-in-out infinite`, animationDelay: sticker.animationDelay || `${sIdx * 0.4}s` }}>
                  <img src={sticker.src} alt={sticker.name} style={{ width: `${sticker.size}px`, height: 'auto', transform: sticker.rotate ? `rotate(${sticker.rotate})` : undefined }} className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]" loading="eager" decoding="sync" />
                </div>
              );
            })}
          </div>

          {/* ── EFFECT 2: Character bounce-in from bottom ── */}
          <div className="relative z-10 flex items-end justify-center w-full h-full max-h-[340px] sm:max-h-[390px] md:max-h-[440px]">
            <img
              src={characterImgUrl}
              alt={`${displayTitleEn} - ${isFemale ? 'Female' : 'Male'}`}
              className="h-full w-auto max-w-full object-contain drop-shadow-[0_16px_40px_rgba(0,43,127,0.3)] select-none char-bounce-in"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>

        {/* Bottom Info — staggered slide-up */}
        <div className="shrink-0 space-y-1.5 pt-2 pb-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/95 border border-rose-100 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 shadow-md min-h-[60px] sm:min-h-[68px] box-slide-up-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 overflow-hidden p-1 border border-rose-100">
                <img src="/assets/reveal/stickers/COMM/heart-pink.png" alt="Superpower" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-400 block">Your Superpower</span>
                <span className="text-[11px] sm:text-[12px] font-black text-rose-600 block leading-tight mt-0.5 line-clamp-2">{superpower}</span>
              </div>
            </div>
            <div className="bg-white/95 border border-sky-100 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2 shadow-md min-h-[60px] sm:min-h-[68px] box-slide-up-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 overflow-hidden p-1 border border-sky-100">
                <img src={aiSkillIconSrc} alt="AI Skill" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-500 block">Your AI Skill</span>
                <span className="text-[11px] sm:text-[12px] font-black text-sky-700 block leading-tight mt-0.5 line-clamp-2">{aiSkill}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/95 border border-white/80 rounded-2xl px-3 sm:px-4 py-2.5 shadow-md flex items-center gap-2.5 box-slide-up-3">
            <img src={impactHeartSrc} alt="Impact" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" />
            <p className="text-[11px] sm:text-xs font-bold text-slate-700 leading-snug text-center flex-1">{impact}</p>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="relative z-30 shrink-0 px-3 sm:px-5 pb-3 sm:pb-4 pt-2 max-w-[680px] mx-auto w-full flex items-center justify-between gap-3">
        {onBack ? (
          <button onClick={onBack} className="px-5 py-2 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-[#002B7F] font-bold text-xs sm:text-sm border border-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all">
            <ChevronLeft className="w-4 h-4 text-[#002B7F]" />
            <span>ย้อนกลับ</span>
          </button>
        ) : <div />}
        <button onClick={onNext} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF3366] via-[#FF5E80] to-[#FF3366] hover:from-[#FF2D55] hover:to-[#FF5E80] text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all animate-cta-pulse">
          <span>ดูการ์ดของฉัน</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RevealView;
