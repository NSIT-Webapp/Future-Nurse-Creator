import React, { useEffect, useState } from 'react';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { CharacterType } from '../types';
import { ASSETS, getProcessingBadges, ProcessingBadgeItem } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';

interface AnalysisViewProps {
  onComplete: () => void;
  characterType?: CharacterType;
  totalQuestions?: number;
  onBack?: () => void;
}

const BADGE_THEMES: Record<string, { textColor: string }> = {
  PED:  { textColor: 'text-[#002B7F]' },
  ER:   { textColor: 'text-[#DC2626]' },
  COMM: { textColor: 'text-[#002B7F]' },
  MH:   { textColor: 'text-[#3730A3]' },
  OA:   { textColor: 'text-[#059669]' },
  INT:  { textColor: 'text-[#002B7F]' },
  TECH: { textColor: 'text-[#0284C7]' },
  MAT:  { textColor: 'text-[#DC2626]' },
};

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

  // Layout distribution matching official design mockups:
  // Male (7 roles):
  // - Left: PED, ER, COMM
  // - Right: MH, OA, INT
  // - Center Bottom: TECH
  // Female (8 roles):
  // - Left: PED, ER, COMM, MAT
  // - Right: MH, OA, INT, TECH
  const findBadge = (id: string): ProcessingBadgeItem =>
    badges.find((b) => b.pathId === id) || badges[0];

  const leftBadges: ProcessingBadgeItem[] = isFemale
    ? [findBadge('PED'), findBadge('ER'), findBadge('COMM'), findBadge('MAT')]
    : [findBadge('PED'), findBadge('ER'), findBadge('COMM')];

  const rightBadges: ProcessingBadgeItem[] = isFemale
    ? [findBadge('MH'), findBadge('OA'), findBadge('INT'), findBadge('TECH')]
    : [findBadge('MH'), findBadge('OA'), findBadge('INT')];

  const centerBottomBadge: ProcessingBadgeItem | null = !isFemale ? findBadge('TECH') : null;

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
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-2.5 sm:pt-3.5 max-w-xl mx-auto w-full">
        {/* Faculty Logo Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1 shadow-md flex items-center gap-2 border border-white/80">
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

      {/* ── 2. Stepper: 1..8 with Step 5 highlighted as ANALYZING ───────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 py-1.5 max-w-xl mx-auto w-full">
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

                  {/* Pink ANALYZING Pill under step 5 */}
                  {isCurrent && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[8px] sm:text-[8.5px] tracking-wider uppercase shadow-xs whitespace-nowrap animate-pulse">
                      ANALYZING
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex-1 mx-1 flex items-center justify-center min-w-[8px] sm:min-w-[14px]">
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

      {/* ── 3. Main Stage Card: High-Res Holographic Sky Window ───────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between max-w-xl mx-auto w-full px-2.5 sm:px-4 min-h-0 mt-1">
        <div
          className="h-full w-full rounded-3xl shadow-[0_16px_48px_rgba(0,43,127,0.22)] p-2.5 sm:p-3.5 flex flex-col justify-between overflow-hidden relative border border-white/80"
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
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] text-white text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-widest mb-1 shadow-sm">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>ANALYZING</span>
              <Sparkles className="w-3 h-3 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-heading leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              <span className="text-[#FF2D55]">AI </span>
              กำลังวิเคราะห์
            </h2>
            <h3 className="text-sm sm:text-base md:text-lg font-black text-[#0A2540] tracking-tight leading-snug drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              เส้นทางพยาบาลที่ใช่สำหรับคุณ...
            </h3>

            {/* Sub-caption */}
            <p className="text-[11px] sm:text-xs font-bold text-[#FF3366] mt-0.5 flex items-center justify-center gap-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
              <span>💕 จากคำตอบทั้ง {totalQuestions} ข้อของคุณ 💕</span>
            </p>
          </div>

          {/* ── Center Stage: Orbiting Floating Badges & Center Student ── */}
          <div className="flex-1 relative flex items-center justify-between min-h-0 overflow-hidden my-0.5">

            {/* Left Badges Column (Floating without solid white boxes) */}
            <div className="w-[30%] sm:w-[28%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-2">
              {leftBadges.map((badge, idx) => {
                const isScanning = activeBadgeIdx === idx;
                const colorClass = BADGE_THEMES[badge.pathId]?.textColor || 'text-[#002B7F]';
                return (
                  <div
                    key={badge.pathId}
                    className={`flex flex-col items-center justify-center transition-all duration-300 select-none ${
                      isScanning
                        ? 'scale-110 drop-shadow-[0_0_16px_rgba(255,100,150,0.9)]'
                        : 'hover:scale-105 drop-shadow-xs'
                    }`}
                  >
                    <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain"
                        loading="eager"
                        decoding="sync"
                      />
                    </div>
                    <span
                      className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-tight uppercase text-center mt-0.5 leading-tight px-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] ${colorClass}`}
                    >
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Student Standing on the Holographic Stage */}
            <div className="flex-1 h-full relative flex flex-col items-center justify-end z-10 px-1 min-h-0 pb-1">
              {/* Subtle Glowing Radial Pulse over the artwork's holographic radar */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-radial from-cyan-300/30 via-pink-300/15 to-transparent animate-pulse pointer-events-none" />

              {/* Student Character Full Image — Placed directly above the pedestal */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0 max-h-[300px] sm:max-h-[360px] md:max-h-[420px]">
                <img
                  src={centerCharacterUrl}
                  alt={isFemale ? 'Female Student' : 'Male Student'}
                  className="h-full w-auto max-w-full object-contain drop-shadow-[0_14px_30px_rgba(0,43,127,0.35)] animate-float-subtle select-none"
                  loading="eager"
                  decoding="sync"
                />
              </div>

              {/* Center Bottom Badge for Male (NURSING + TECHNOLOGY in Tech Hologram Frame) */}
              {centerBottomBadge && (
                <div
                  className={`-mt-2 rounded-xl px-2.5 py-1 flex flex-col items-center transition-all duration-300 z-20 bg-white/45 backdrop-blur-xs border border-sky-300/70 shadow-sm ${
                    activeBadgeIdx === 6
                      ? 'scale-110 ring-2 ring-sky-400 shadow-md shadow-sky-300/80'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 overflow-hidden flex items-center justify-center">
                    <img
                      src={centerBottomBadge.imgUrl}
                      alt={centerBottomBadge.titleEn}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                  <span className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black text-[#0284C7] tracking-tight uppercase text-center leading-tight whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    NURSING + TECHNOLOGY
                  </span>
                </div>
              )}
            </div>

            {/* Right Badges Column (Floating without solid white boxes) */}
            <div className="w-[30%] sm:w-[28%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-2">
              {rightBadges.map((badge, rIdx) => {
                const globalIdx = leftBadges.length + rIdx;
                const isScanning = activeBadgeIdx === globalIdx;
                const colorClass = BADGE_THEMES[badge.pathId]?.textColor || 'text-[#002B7F]';
                return (
                  <div
                    key={badge.pathId}
                    className={`flex flex-col items-center justify-center transition-all duration-300 select-none ${
                      isScanning
                        ? 'scale-110 drop-shadow-[0_0_16px_rgba(255,100,150,0.9)]'
                        : 'hover:scale-105 drop-shadow-xs'
                    }`}
                  >
                    <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain"
                        loading="eager"
                        decoding="sync"
                      />
                    </div>
                    <span
                      className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-tight uppercase text-center mt-0.5 leading-tight px-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] ${colorClass}`}
                    >
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* ── 4. Floating AI Robot Mascot Status Bar (Outside Card on Campus Background) ──── */}
      <div className="relative z-20 shrink-0 px-3 sm:px-6 pt-2 max-w-xl mx-auto w-full">
        <div className="bg-white/92 backdrop-blur-md border border-white/90 rounded-2xl px-3.5 py-2 sm:py-2.5 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <img
              src={ASSETS.processing.robot}
              alt="AI Robot Mascot"
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain drop-shadow-sm animate-mascot-bob shrink-0"
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
              <div className="text-[10.5px] sm:text-xs font-bold text-pink-600 leading-tight mt-0.5">
                โปรดรอสักครู่ 💕
              </div>
            </div>
          </div>

          {/* Animated Spinner Loader */}
          <div className="flex items-center justify-center shrink-0 pl-1">
            <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-pink-500" />
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Navigation & Action Bar (Outside Card on Campus Background) ──── */}
      <div className="relative z-20 shrink-0 px-3 sm:px-6 pb-2.5 sm:pb-3.5 pt-1.5 max-w-xl mx-auto w-full flex items-center justify-between gap-3">
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

        {/* Active Analyzing Status Pill */}
        <div className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-400/30 flex items-center gap-2 animate-cta-pulse">
          <Sparkles className="w-4 h-4 animate-spin text-white" />
          <span>กำลังวิเคราะห์...</span>
        </div>
      </div>
    </div>
  );
};
