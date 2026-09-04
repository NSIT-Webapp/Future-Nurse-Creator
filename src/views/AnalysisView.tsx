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

  // Stepper state: 1..8 steps
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  // Cycling badge highlight every 350ms
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setActiveBadgeIdx((prev) => (prev + 1) % badges.length);
    }, 350);

    return () => clearInterval(scanInterval);
  }, [badges.length]);

  // Complete analysis after 4.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#002B7F', '#FF3366', '#00A3FF', '#10B981', '#F5A623', '#8B5CF6'],
        });
      } catch (_e) {}
      onComplete();
    }, 4200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Split badges into Left and Right columns around the center character
  const midPoint = Math.ceil(badges.length / 2);
  const leftBadges = badges.slice(0, midPoint);
  const rightBadges = badges.slice(midPoint);

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover bg-center bg-no-repeat animate-fade-in"
      style={{
        backgroundImage: `url(${ASSETS.processing.background})`,
      }}
    >
      {/* ── Soft Ambient Lighting Overlay ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-blue-900/15 pointer-events-none" />

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 max-w-4xl mx-auto w-full">
        {/* Faculty Logo Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md flex items-center gap-2 border border-white/80">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-6 sm:h-7 w-auto object-contain"
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,0.65)] scale-110 ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-sm'
                        : 'bg-slate-200/90 text-slate-500 border border-slate-300'
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

      {/* ── 3. Main Frosted Card Container ──────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-3 sm:px-6 pb-3 sm:pb-4 min-h-0">
        <div className="h-full w-full bg-white/90 backdrop-blur-md rounded-3xl border-2 border-white/90 shadow-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden relative">

          {/* ── Card Header: Title & Info ── */}
          <div className="text-center shrink-0 pt-1">
            {/* Analyzing Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/15 via-rose-500/20 to-pink-500/15 border border-pink-400/40 text-pink-600 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 shadow-xs">
              <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
              <span>ANALYZING</span>
              <span className="text-xs">❤️</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-heading leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600">
                AI{' '}
              </span>
              กำลังวิเคราะห์
            </h2>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-700 tracking-tight leading-snug">
              เส้นทางพยาบาลที่ใช่สำหรับคุณ...
            </h3>

            {/* Sub-caption */}
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5 flex items-center justify-center gap-1">
              <span>✨ จากคำตอบทั้ง {totalQuestions} ข้อของคุณ 💕</span>
            </p>
          </div>

          {/* ── Center Stage: Center Character & Surrounding Orbiting Badges ── */}
          <div className="flex-1 relative flex items-center justify-between my-1 sm:my-2 min-h-0 overflow-hidden">

            {/* Left Badges Column */}
            <div className="w-[28%] sm:w-[25%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-1.5">
              {leftBadges.map((badge, idx) => {
                const isScanning = activeBadgeIdx === idx;
                return (
                  <div
                    key={badge.pathId}
                    className={`rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-center transition-all duration-300 border ${
                      isScanning
                        ? 'bg-white border-pink-400 ring-2 ring-pink-400/70 shadow-lg shadow-pink-200/80 scale-105'
                        : 'bg-white/80 hover:bg-white border-sky-200/70 shadow-xs'
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 overflow-hidden flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain drop-shadow-xs"
                        loading="eager"
                      />
                    </div>
                    <span className="text-[7.5px] sm:text-[8.5px] font-black text-[#002B7F] tracking-tight uppercase text-center mt-0.5 line-clamp-1 leading-tight px-0.5">
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Center Thoughtful Character with Glowing Radar Circles */}
            <div className="flex-1 h-full relative flex items-center justify-center z-10 px-1">
              {/* Concentric Glowing Radar Circles */}
              <div className="absolute w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full border border-sky-300/40 bg-radial from-sky-200/30 via-transparent to-transparent animate-pulse pointer-events-none" />
              <div className="absolute w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full border border-dashed border-sky-400/50 animate-spin-slow pointer-events-none" />

              {/* Student Character Full Image */}
              <div className="relative h-full max-h-[260px] sm:max-h-[300px] md:max-h-[340px] flex items-center justify-center">
                <img
                  src={centerCharacterUrl}
                  alt={isFemale ? 'Female Student' : 'Male Student'}
                  className="h-full w-auto object-contain drop-shadow-xl animate-float-subtle select-none"
                />
              </div>
            </div>

            {/* Right Badges Column */}
            <div className="w-[28%] sm:w-[25%] flex flex-col justify-around h-full z-20 py-1 space-y-1 sm:space-y-1.5">
              {rightBadges.map((badge, rIdx) => {
                const globalIdx = midPoint + rIdx;
                const isScanning = activeBadgeIdx === globalIdx;
                return (
                  <div
                    key={badge.pathId}
                    className={`rounded-xl sm:rounded-2xl p-1 sm:p-1.5 flex flex-col items-center justify-center transition-all duration-300 border ${
                      isScanning
                        ? 'bg-white border-sky-400 ring-2 ring-sky-400/70 shadow-lg shadow-sky-200/80 scale-105'
                        : 'bg-white/80 hover:bg-white border-sky-200/70 shadow-xs'
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 overflow-hidden flex items-center justify-center">
                      <img
                        src={badge.imgUrl}
                        alt={badge.titleEn}
                        className="w-full h-full object-contain drop-shadow-xs"
                        loading="eager"
                      />
                    </div>
                    <span className="text-[7.5px] sm:text-[8.5px] font-black text-[#002B7F] tracking-tight uppercase text-center mt-0.5 line-clamp-1 leading-tight px-0.5">
                      {badge.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 4. Floating AI Robot Mascot Status Bar ──────────────────────── */}
          <div className="shrink-0 bg-gradient-to-r from-sky-50/95 via-blue-50/95 to-pink-50/90 border border-sky-200/90 rounded-2xl px-3 py-1.5 sm:py-2 shadow-sm flex items-center justify-between gap-2.5 my-1">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <img
                src={ASSETS.processing.robot}
                alt="AI Robot Mascot"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm animate-mascot-bob"
              />
              <div className="text-left">
                <div className="text-xs sm:text-sm font-black text-slate-800 font-heading leading-tight">
                  กำลังประมวลผลคำตอบของคุณ
                </div>
                <div className="text-[10.5px] sm:text-xs font-extrabold text-pink-600 leading-tight">
                  โปรดรอสักครู่ 💕
                </div>
              </div>
            </div>

            {/* Rotating Dots Loader */}
            <div className="flex items-center gap-1 text-pink-500">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-pink-500" />
            </div>
          </div>

          {/* ── 5. Bottom Navigation & Action Bar ────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-between gap-3 pt-1">
            {/* Back Button */}
            {onBack ? (
              <button
                onClick={onBack}
                className="px-4 sm:px-5 py-2 rounded-full bg-white hover:bg-slate-50 text-[#002B7F] font-bold text-xs sm:text-sm border border-slate-200/80 shadow-sm flex items-center gap-1 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-[#002B7F]" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div />
            )}

            {/* Active Analyzing Status Pill */}
            <div className="px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 animate-cta-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              <span>กำลังวิเคราะห์...</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
