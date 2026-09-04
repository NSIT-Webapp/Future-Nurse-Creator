import React, { useEffect } from 'react';
import { ChevronLeft, ArrowRight, Sparkles, Heart, Zap } from 'lucide-react';
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

export const RevealView: React.FC<RevealViewProps> = ({ result, onNext, onBack }) => {
  const isFemale = result.characterType === 'female_student';
  const pathId = result.pathId;
  const pathInfo = (pathsData.paths as Record<string, any>)[pathId] || result.path;

  // Character cutout URL (1 of 16 outcomes)
  const characterImgUrl = isFemale
    ? (ASSETS.characters as any)[pathId]?.female || `/characters/${pathId}_female.png`
    : (ASSETS.characters as any)[pathId]?.male || `/characters/${pathId}_male.png`;

  // 3D Floating Stickers for this specific nursing path
  const stickers = getRevealStickers(pathId);

  // Stepper steps 1..8 with step 6 REVEAL active
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  // Dynamic Theme Colors
  const themeColor = pathInfo.themeColor || '#0284C7';
  const ribbonColor = pathInfo.ribbonColor || '#0284C7';
  const bubbleTextColor = pathInfo.bubbleTextColor || '#0284C7';
  const displayTitleEn = pathInfo.titleEn || result.path.nameEn?.toUpperCase() || 'FUTURE NURSE';
  const displayRibbonTh = pathInfo.ribbonTh || result.path.nameTh || 'พยาบาลแห่งอนาคต';

  // Copywriting (fallback to signature copy if not present in result)
  const superpower = result.superpower || pathInfo.signatureSuperpower || 'Communication';
  const aiSkill = result.aiSkill || pathInfo.signatureAiSkill || 'Healthcare AI Creator';
  const impact = result.profileImpact || pathInfo.signatureImpact || 'สร้างความเปลี่ยนแปลงที่ดีเพื่อสุขภาวะของผู้คน';

  // Confetti celebration on view reveal
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 },
        colors: [themeColor, '#FF3366', '#38BDF8', '#F59E0B', '#10B981'],
      });
    } catch (_e) {}
  }, [themeColor]);

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover animate-fade-in"
      style={{
        backgroundImage: `url(${ASSETS.reveal.background})`,
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
      }}
      data-slot="reveal-root"
    >
      <style>{`
        @keyframes float-stagger-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(2deg); }
        }
        @keyframes float-stagger-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(-3deg); }
        }
        @keyframes float-stagger-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes aura-spin-glow {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 0.65; }
          50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.05); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 0.65; }
        }
        .text-3d-bubble {
          text-shadow:
            0 1px 0 #fff,
            0 2px 0 rgba(255,255,255,0.7),
            0 3px 0 rgba(0,0,0,0.12),
            0 6px 12px rgba(0,43,127,0.18);
        }
      `}</style>

      {/* ── Soft Ambient Lighting Overlay ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/10 via-transparent to-blue-900/15 pointer-events-none" />

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-2.5 sm:pt-3 max-w-[720px] mx-auto w-full">
        {/* Faculty Logo Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1 shadow-md flex items-center gap-2 border border-white/80">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
      </div>

      {/* ── 2. Stepper: 1..8 with Step 6 highlighted as REVEAL ──────────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 pt-1 pb-4 sm:pb-5 max-w-[720px] mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 6;
            const isCurrent = stepNum === 6;
            const isLast = idx === stepperSteps.length - 1;

            return (
              <React.Fragment key={stepNum}>
                {/* Step Circle & Badge */}
                <div className="flex flex-col items-center shrink-0 relative">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,0.65)] scale-110 ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-sm'
                        : 'bg-white/80 text-slate-400 border border-slate-300/80'
                    }`}
                  >
                    {stepNum}
                  </div>

                  {/* Pink REVEAL Pill under step 6 */}
                  {isCurrent && (
                    <div className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[8px] sm:text-[8.5px] tracking-wider uppercase shadow-sm whitespace-nowrap animate-pulse">
                      REVEAL
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex-1 mx-1 flex items-center justify-center min-w-[8px] sm:min-w-[14px]">
                    <div
                      className={`w-full border-t-2 transition-colors ${
                        stepNum < 6 ? 'border-[#1D63D8]' : 'border-slate-300/80'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. Main Card Window: Frosted Glass Dreamy Container ─────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between w-full max-w-[680px] md:max-w-[720px] mx-auto px-2 sm:px-4 min-h-0 mt-1 sm:mt-2">
        <div className="h-full w-full rounded-3xl bg-white/92 backdrop-blur-md shadow-[0_16px_48px_rgba(0,43,127,0.2)] border border-white/95 p-3 sm:p-4 flex flex-col justify-between overflow-hidden relative">

          {/* ── Card Header: REVEAL Badge, Subtitle & Path Title ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Reveal Sparkle Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#FFCCD5] text-[#FF3366] text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-widest mb-0.5 shadow-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>✦ REVEAL ✦</span>
              <Sparkles className="w-3 h-3 animate-pulse" />
            </div>

            {/* Subtitle */}
            <h3 className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
              <span className="text-[#FF2D55] font-extrabold">AI </span>
              พบเส้นทางพยาบาลที่ใช่สำหรับคุณแล้ว!
            </h3>

            {/* Path English Name — 3D Bubble typography in path's vibrant color */}
            <h2
              className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-tight uppercase leading-tight font-heading mt-0.5 text-3d-bubble"
              style={{ color: bubbleTextColor }}
            >
              {displayTitleEn}
            </h2>

            {/* Path Thai Ribbon Pill */}
            <div className="inline-flex items-center justify-center mt-1">
              <div
                className="px-4 py-0.5 sm:py-1 rounded-full text-white text-xs sm:text-sm font-extrabold shadow-sm tracking-wide"
                style={{ backgroundColor: ribbonColor }}
              >
                {displayRibbonTh}
              </div>
            </div>
          </div>

          {/* ── Center Stage: Circular Glow Portal & Character + Floating Stickers ── */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-visible my-1">
            {/* Pulsing Concentric Aura Portal */}
            <div
              className="absolute top-1/2 left-1/2 w-64 h-64 sm:w-76 sm:h-76 md:w-84 md:h-84 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${themeColor}33 0%, #FF658422 45%, transparent 70%)`,
                animation: 'aura-spin-glow 14s linear infinite',
              }}
            />

            {/* Inner Ring with Subtle Golden/White Border */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border border-white/80 shadow-[0_0_24px_rgba(255,255,255,0.8)] pointer-events-none" />

            {/* Floating 3D Stickers (Surrounding Character) */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {stickers.map((sticker, sIdx) => {
                const animStyle = sIdx % 3 === 0
                  ? 'float-stagger-1'
                  : sIdx % 3 === 1
                  ? 'float-stagger-2'
                  : 'float-stagger-3';

                return (
                  <div
                    key={sticker.id}
                    className="absolute select-none transition-transform"
                    style={{
                      ...sticker.position,
                      zIndex: sticker.zIndex ?? (sIdx < 3 ? 25 : 15),
                      animation: `${animStyle} ${sticker.animationDuration || '4s'} ease-in-out infinite`,
                      animationDelay: sticker.animationDelay || `${sIdx * 0.4}s`,
                    }}
                  >
                    <img
                      src={sticker.src}
                      alt={sticker.name}
                      style={{
                        width: `${sticker.size}px`,
                        height: 'auto',
                        transform: sticker.rotate ? `rotate(${sticker.rotate})` : undefined,
                      }}
                      className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                );
              })}
            </div>

            {/* Center Character (1 of 16 outcomes) */}
            <div className="relative z-10 h-full flex items-end justify-center min-h-0 max-h-[300px] sm:max-h-[360px] md:max-h-[400px]">
              <img
                src={characterImgUrl}
                alt={`${displayTitleEn} - ${isFemale ? 'Female' : 'Male'}`}
                className="h-full w-auto max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,43,127,0.35)] animate-float-subtle select-none"
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>

          {/* ── Card Bottom: Superpower, AI Skill, and Impact Cards ── */}
          <div className="shrink-0 space-y-1.5 z-20">
            {/* Two Column Grid: Superpower & AI Skill */}
            <div className="grid grid-cols-2 gap-2">
              {/* Your Superpower Capsule */}
              <div className="bg-[#FFF5F7] border border-[#FFE0E6] rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFE4E9] flex items-center justify-center shrink-0 text-[#FF3366]">
                  <Heart className="w-4 h-4 fill-[#FF3366]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#FF3366] block leading-tight">
                    YOUR SUPERPOWER
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 block truncate leading-tight mt-0.5">
                    {superpower}
                  </span>
                </div>
              </div>

              {/* Your AI Skill Capsule */}
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 shadow-xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0 text-[#0284C7]">
                  <Zap className="w-4 h-4 fill-[#0284C7]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#0284C7] block leading-tight">
                    YOUR AI SKILL
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 block truncate leading-tight mt-0.5">
                    {aiSkill}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Message Box */}
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl px-3 py-1.5 sm:py-2 text-center shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                🌟 YOUR IMPACT
              </span>
              <p className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-700 leading-snug">
                &ldquo;{impact}&rdquo;
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. Bottom Navigation & Action Bar ───────────────────────────────── */}
      <div className="relative z-20 shrink-0 px-3 sm:px-6 pb-2.5 sm:pb-3.5 pt-2 max-w-[680px] md:max-w-[720px] mx-auto w-full flex items-center justify-between gap-3">
        {/* Back Button */}
        {onBack ? (
          <button
            onClick={onBack}
            className="px-5 py-2 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-[#002B7F] font-bold text-xs sm:text-sm border border-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-[#002B7F]" />
            <span>ย้อนกลับ</span>
          </button>
        ) : (
          <div />
        )}

        {/* View My Card Button (Pink Glossy Pill with Arrow) */}
        <button
          onClick={onNext}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF3366] via-[#FF5E80] to-[#FF3366] hover:from-[#FF2D55] hover:to-[#FF5E80] text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-500/35 flex items-center gap-2 active:scale-95 transition-all animate-cta-pulse"
        >
          <span>ดูการ์ดของฉัน</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RevealView;
