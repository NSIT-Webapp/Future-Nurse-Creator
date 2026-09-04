import React, { useEffect } from 'react';
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

  // 3D Skill and Impact Icons
  const aiSkillIconSrc =
    pathId === 'OA' ? '/assets/reveal/stickers/TECH/clipboard-medical.png' :
    pathId === 'ER' ? '/assets/reveal/stickers/ER/heart-ecg.png' :
    pathId === 'COMM' ? '/assets/reveal/stickers/COMM/group-circle.png' :
    pathId === 'INT' ? '/assets/reveal/stickers/INT/globe.png' :
    pathId === 'MH' ? '/assets/reveal/stickers/MH/brain-smile.png' :
    pathId === 'PED' ? '/assets/reveal/stickers/PED/star-blue-smile.png' :
    pathId === 'MAT' ? '/assets/reveal/stickers/MAT/baby-in-heart.png' :
    '/assets/reveal/stickers/TECH/chip-ai.png';

  const impactHeartSrc = pathId === 'OA'
    ? '/assets/reveal/stickers/OA/heart-green.png'
    : '/assets/reveal/stickers/COMM/heart-pink.png';

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
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes float-stagger-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes float-stagger-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(3deg); }
        }
        @keyframes aura-spin-glow {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 0.65; }
          50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.06); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 0.65; }
        }
        .text-3d-bubble {
          text-shadow:
            0 1px 0 #fff,
            0 2px 0 rgba(255,255,255,0.85),
            0 3px 0 rgba(0,0,0,0.15),
            0 8px 16px rgba(0,43,127,0.22);
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
        <div className="h-full w-full rounded-3xl bg-white/92 backdrop-blur-md shadow-[0_16px_48px_rgba(0,43,127,0.2)] border border-white/95 p-3 sm:p-4.5 flex flex-col justify-between overflow-hidden relative">

          {/* ── Card Header: REVEAL Badge, Subtitle & Path Title ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Reveal Sparkle Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#FFCCD5] text-[#FF3366] text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-widest mb-1 shadow-xs">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>✦ REVEAL ✦</span>
              <Sparkles className="w-3 h-3 animate-pulse" />
            </div>

            {/* Subtitle */}
            <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 tracking-tight leading-snug">
              <span className="text-[#FF2D55] font-black">AI </span>
              พบเส้นทางพยาบาลที่ใช่สำหรับคุณแล้ว!
            </h3>

            {/* Caption with pink hearts */}
            <p className="text-[11px] sm:text-xs font-bold text-[#FF3366] mt-0.5 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              <span>💕</span>
              <span>จากคำตอบทั้ง 5 ข้อของคุณ</span>
              <span>💕</span>
            </p>

            {/* Path English Name — Big 3D Bubble typography in path's vibrant color */}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight font-heading mt-1 text-3d-bubble"
              style={{ color: bubbleTextColor }}
            >
              {displayTitleEn}
            </h2>

            {/* Path Thai Ribbon Pill with Flanking White Hearts */}
            <div className="inline-flex items-center justify-center mt-1">
              <div
                className="px-5 py-1 sm:py-1.5 rounded-full text-white text-xs sm:text-sm md:text-base font-extrabold shadow-md tracking-wide flex items-center gap-2"
                style={{ backgroundColor: ribbonColor }}
              >
                <span className="text-[10px] sm:text-xs opacity-90">🤍</span>
                <span>{displayRibbonTh}</span>
                <span className="text-[10px] sm:text-xs opacity-90">🤍</span>
              </div>
            </div>
          </div>

          {/* ── Center Stage: Circular Glow Portal & Character + Floating Stickers ── */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 overflow-visible my-1">
            {/* Pulsing Concentric Aura Portal */}
            <div
              className="absolute top-1/2 left-1/2 w-68 h-68 sm:w-80 sm:h-80 md:w-92 md:h-92 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${themeColor}38 0%, #FF658428 45%, transparent 72%)`,
                animation: 'aura-spin-glow 14s linear infinite',
              }}
            />

            {/* Inner Ring with Subtle Golden/White Border */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-68 sm:h-68 md:w-76 md:h-76 rounded-full border-2 border-white/80 shadow-[0_0_28px_rgba(255,255,255,0.85)] pointer-events-none" />

            {/* Floating 3D Stickers (Enlarged and positioned to frame character) */}
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
                      className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                );
              })}
            </div>

            {/* Center Character (1 of 16 outcomes) */}
            <div className="relative z-10 h-full flex items-end justify-center min-h-0 max-h-[300px] sm:max-h-[360px] md:max-h-[410px]">
              <img
                src={characterImgUrl}
                alt={`${displayTitleEn} - ${isFemale ? 'Female' : 'Male'}`}
                className="h-full w-auto max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,43,127,0.35)] animate-float-subtle select-none"
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>

          {/* ── Card Bottom: Superpower, AI Skill, and Impact Cards (Enlarged) ── */}
          <div className="shrink-0 space-y-2 z-20 pt-1">
            {/* Two Column Grid: Superpower & AI Skill */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              {/* Your Superpower Capsule */}
              <div className="bg-[#FFF5F7]/95 border-2 border-[#FFD9E2] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex items-center gap-2.5 shadow-sm min-h-[66px] sm:min-h-[74px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFE4E9] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1">
                  <img
                    src="/assets/reveal/stickers/COMM/heart-pink.png"
                    alt="Superpower Icon"
                    className="w-full h-full object-contain drop-shadow-2xs"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#FF3366] block leading-tight">
                    Your Superpower
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-[#E11D48] block leading-tight mt-0.5 line-clamp-2">
                    {superpower}
                  </span>
                </div>
              </div>

              {/* Your AI Skill Capsule */}
              <div className="bg-[#F0F9FF]/95 border-2 border-[#BAE6FD] rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex items-center gap-2.5 shadow-sm min-h-[66px] sm:min-h-[74px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#E0F2FE] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1">
                  <img
                    src={aiSkillIconSrc}
                    alt="AI Skill Icon"
                    className="w-full h-full object-contain drop-shadow-2xs"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#0284C7] block leading-tight">
                    Your AI Skill
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-[#0369A1] block leading-tight mt-0.5 line-clamp-2">
                    {aiSkill}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Message Box (Enlarged Pill with 3D Heart & Sparkles) */}
            <div className="bg-white/95 border-2 border-white/90 rounded-2xl sm:rounded-3xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 shadow-sm flex items-center justify-between gap-2.5 sm:gap-3">
              <img
                src={impactHeartSrc}
                alt="Impact Heart"
                className="w-7 h-7 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-2xs"
              />
              <p className="text-xs sm:text-sm md:text-[14.5px] font-bold text-slate-700 leading-snug text-center flex-1">
                {impact}
              </p>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 animate-pulse" />
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
