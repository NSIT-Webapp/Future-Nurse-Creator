import React, { useEffect, useState } from 'react';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { CharacterType } from '../types';
import { ASSETS, getProcessingBadges } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';

interface AnalysisViewProps {
  onComplete: () => void;
  characterType?: CharacterType;
  totalQuestions?: number;
  onBack?: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  onComplete,
  characterType = 'female_student',
  totalQuestions = 5,
  onBack,
}) => {
  const isFemale = characterType === 'female_student';
  const badges = getProcessingBadges(characterType);
  const centerCharacterUrl = isFemale ? ASSETS.processing.female : ASSETS.processing.male;

  // Active highlighted badge index (cycles sequentially to simulate AI scanning)
  const [activeBadgeIdx, setActiveBadgeIdx] = useState(0);

  // Analysis progress percentage (0 -> 100%)
  const [progress, setProgress] = useState(0);

  // Stepper state: 1..8 steps
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  // Eagerly ensure all badge images are decoded in memory
  useEffect(() => {
    badges.forEach((b) => {
      const img = new Image();
      img.src = b.imgUrl;
    });
  }, [badges]);

  // Cycling badge highlight every 380ms
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setActiveBadgeIdx((prev) => (prev + 1) % badges.length);
    }, 380);

    return () => clearInterval(scanInterval);
  }, [badges.length]);

  // Complete analysis smoothly over 7.5 seconds with live progress bar
  useEffect(() => {
    const totalDurationMs = 7500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDurationMs) * 100));
      setProgress(pct);

      if (elapsed >= totalDurationMs) {
        clearInterval(interval);
        try {
          confetti({
            particleCount: 110,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#002B7F', '#FF3366', '#00A3FF', '#10B981', '#F5A623', '#8B5CF6'],
          });
        } catch (_e) {}
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Layout distribution:
  // - Female (8 badges): 4 Left, 4 Right
  // - Male (7 badges): 3 Left, 3 Right, 1 Center Bottom (Nursing + Technology)
  const leftBadges = isFemale ? badges.slice(0, 4) : badges.slice(0, 3);
  const rightBadges = isFemale ? badges.slice(4, 8) : badges.slice(3, 6);
  const centerBottomBadge = !isFemale && badges.length >= 7 ? badges[6] : null;

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover animate-fade-in"
      style={{
        backgroundImage: `url(${ASSETS.processing.background})`,
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
      }}
    >
      {/* ── Soft Ambient Lighting Overlay ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-blue-900/15 pointer-events-none" />

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 max-w-4xl mx-auto w-full">
        {/* Faculty Logo Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-2 border border-white/80">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-6 sm:h-7 md:h-8 w-auto object-contain"
          />
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
      </div>

      {/* ── 2. Stepper: 1..8 with Step 5 highlighted as ANALYZING ───────────── */}
      <div className="relative z-30 shrink-0 px-2 sm:px-6 py-2 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 5;
            const isCurrent = stepNum === 5;
            const isLast = idx === stepperSteps.length - 1;

            return (
              <React.Fragment key={stepNum}>
                {/* Step Circle & Badge */}
                <div className="flex flex-col items-center shrink-0 relative">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,0.65)] scale-110 ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-sm'
                        : 'bg-white/70 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {stepNum}
                  </div>

                  {/* Pink ANALYZING Pill under step 5 */}
                  {isCurrent && (
                    <div className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-extrabold text-[8px] sm:text-[9px] tracking-wider uppercase shadow-sm whitespace-nowrap animate-pulse">
                      ANALYZING
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex-1 mx-1 flex items-center justify-center min-w-[10px] sm:min-w-[16px]">
                    <div
                      className={`w-full border-t-2 transition-colors ${
                        stepNum < 5 ? 'border-[#1D63D8]' : 'border-slate-300/80'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. Main Stage Card with High-Res Sci-Fi Sky & Radar Background ────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-2 sm:px-4 md:px-6 pb-2 sm:pb-3.5 min-h-0">
        <div
          className="h-full w-full rounded-3xl shadow-[0_12px_40px_rgba(0,43,127,0.22)] p-2.5 sm:p-3.5 md:p-4 flex flex-col justify-between overflow-hidden relative border border-white/70"
          style={{
            backgroundImage: `url(${ASSETS.processing.innerCardBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
          }}
        >

          {/* ── Card Header: Title & Info ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Analyzing Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-white/85 backdrop-blur-xs border border-pink-400/50 text-pink-600 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
              <span>ANALYZING</span>
              <span className="text-xs">❤️</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-heading leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600">
                AI{' '}
              </span>
              กำลังวิเคราะห์
            </h2>
            <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800 tracking-tight leading-snug drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              เส้นทางพยาบาลที่ใช่สำหรับคุณ...
            </h3>

            {/* Sub-caption */}
            <p className="text-[10.5px] sm:text-xs font-bold text-slate-700 mt-0.5 flex items-center justify-center gap-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
              <span>✨ จากคำตอบทั้ง {totalQuestions} ข้อของคุณ 💕</span>
            </p>
          </div>

          {/* ── Center Stage: Large Center Character & Surrounding Orbiting Badges ── */}
          <div className="flex-1 relative flex items-center justify-between my-1 min-h-0 overflow-hidden">

            {/* Left Badges Column */}
            <div className="w-[30%] sm:w-[26%] md:w-[24%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-2">
              {leftBadges.map((badge, idx) => {
                const isScanning = activeBadgeIdx === idx;
                return (
                  <div
                    key={badge.pathId}
                    className={`w-full rounded-2xl p-1.5 sm:p-2 md:p-2.5 flex flex-col items-center justify-center transition-all duration-300 border animate-scale-up ${
                      isScanning
                        ? 'bg-white border-pink-400 ring-2 ring-pink-400/80 shadow-lg shadow-pink-200/90 scale-105'
                        : 'bg-white/95 hover:bg-white border-white/90 shadow-sm'
                    }`}
                  >
                    <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 overflow-hidden flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain drop-shadow-xs"
                        loading="eager"
                        decoding="sync"
                        width={72}
                        height={72}
                      />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-black text-[#002B7F] tracking-tight uppercase text-center mt-1 leading-tight px-1 line-clamp-1">
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Thoughtful Character with subtle pulse glow matching high-res artwork radar */}
            <div className="flex-1 h-full relative flex flex-col items-center justify-center z-10 px-1 min-h-0">
              {/* Subtle Glowing Pulse over the background holographic radar */}
              <div className="absolute w-44 h-44 sm:w-60 sm:h-60 md:w-76 md:h-76 rounded-full bg-radial from-cyan-300/25 via-pink-300/10 to-transparent animate-pulse pointer-events-none" />

              {/* Student Character Full Image — Fills generous vertical height above platform */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0 max-h-[340px] sm:max-h-[420px] md:max-h-[480px]">
                <img
                  src={centerCharacterUrl}
                  alt={isFemale ? 'Female Student' : 'Male Student'}
                  className="h-full w-auto max-w-full object-contain drop-shadow-[0_12px_28px_rgba(0,43,127,0.3)] animate-float-subtle select-none"
                  loading="eager"
                  decoding="sync"
                />
              </div>

              {/* Center Bottom Badge for Male (NURSING + TECHNOLOGY) */}
              {centerBottomBadge && (
                <div
                  className={`mt-1 rounded-2xl px-2.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 border animate-scale-up z-20 ${
                    activeBadgeIdx === 6
                      ? 'bg-white border-sky-400 ring-2 ring-sky-400/80 shadow-lg shadow-sky-200/90 scale-105'
                      : 'bg-white/95 hover:bg-white border-white/90 shadow-sm'
                  }`}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden flex items-center justify-center shrink-0">
                    <img
                      src={centerBottomBadge.imgUrl}
                      alt={centerBottomBadge.titleEn}
                      className="w-full h-full object-contain drop-shadow-xs"
                      loading="eager"
                      decoding="sync"
                      width={48}
                      height={48}
                    />
                  </div>
                  <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-black text-[#002B7F] tracking-tight uppercase whitespace-nowrap">
                    {centerBottomBadge.titleEn}
                  </span>
                </div>
              )}
            </div>

            {/* Right Badges Column */}
            <div className="w-[30%] sm:w-[26%] md:w-[24%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-2">
              {rightBadges.map((badge, rIdx) => {
                const globalIdx = leftBadges.length + rIdx;
                const isScanning = activeBadgeIdx === globalIdx;
                return (
                  <div
                    key={badge.pathId}
                    className={`w-full rounded-2xl p-1.5 sm:p-2 md:p-2.5 flex flex-col items-center justify-center transition-all duration-300 border animate-scale-up ${
                      isScanning
                        ? 'bg-white border-sky-400 ring-2 ring-sky-400/80 shadow-lg shadow-sky-200/90 scale-105'
                        : 'bg-white/95 hover:bg-white border-white/90 shadow-sm'
                    }`}
                  >
                    <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 overflow-hidden flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain drop-shadow-xs"
                        loading="eager"
                        decoding="sync"
                        width={72}
                        height={72}
                      />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-black text-[#002B7F] tracking-tight uppercase text-center mt-1 leading-tight px-1 line-clamp-1">
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 4. Floating AI Robot Mascot Status Bar with Live Progress ──── */}
          <div className="shrink-0 bg-white/92 backdrop-blur-md border border-white/90 rounded-2xl px-3 py-1.5 sm:py-2 shadow-md flex items-center justify-between gap-2.5 my-1">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <img
                src={ASSETS.processing.robot}
                alt="AI Robot Mascot"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 object-contain drop-shadow-sm animate-mascot-bob shrink-0"
              />
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 font-heading leading-tight">
                  <span>กำลังประมวลผลคำตอบของคุณ</span>
                  <span className="text-blue-600 text-[11px] sm:text-xs font-mono">{progress}%</span>
                </div>
                {/* Live Progress Bar */}
                <div className="w-full bg-slate-200/70 rounded-full h-1.5 sm:h-2 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-pink-500 rounded-full transition-all duration-75 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] sm:text-[11px] font-extrabold text-pink-600 leading-tight mt-0.5">
                  โปรดรอสักครู่ 💕
                </div>
              </div>
            </div>

            {/* Rotating Dots Loader */}
            <div className="flex items-center gap-1 text-pink-500 shrink-0">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-pink-500" />
            </div>
          </div>

          {/* ── 5. Bottom Navigation & Action Bar ────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-between gap-3 pt-1">
            {/* Back Button */}
            {onBack ? (
              <button
                onClick={onBack}
                className="px-4 sm:px-5 py-2 rounded-full bg-white/95 hover:bg-white text-[#002B7F] font-bold text-xs sm:text-sm border border-white shadow-md flex items-center gap-1 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-[#002B7F]" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div />
            )}

            {/* Active Analyzing Status Pill */}
            <div className="px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/25 flex items-center gap-2 animate-cta-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              <span>กำลังวิเคราะห์...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

