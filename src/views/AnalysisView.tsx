import React, { useEffect, useState } from 'react';
import { ChevronLeft, Loader2, Sparkles, Zap } from 'lucide-react';
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
  MH:   { textColor: 'text-[#4338CA]' },
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

  // Analysis progress percentage (0 -> 100%)
  const [progress, setProgress] = useState(0);

  // Stepper state: 1..8 steps
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  // Helper to find specific badge item by path ID
  const findBadge = (id: string): ProcessingBadgeItem =>
    badges.find((b) => b.pathId === id) || badges[0];

  const badgePED  = findBadge('PED');
  const badgeER   = findBadge('ER');
  const badgeCOMM = findBadge('COMM');
  const badgeMH   = findBadge('MH');
  const badgeOA   = findBadge('OA');
  const badgeINT  = findBadge('INT');
  const badgeTECH = findBadge('TECH');
  const badgeMAT  = isFemale ? findBadge('MAT') : null;

  // Scanning sequence order (Circular Clockwise Orbit around center student)
  const scanSequence: string[] = isFemale
    ? ['PED', 'MAT', 'MH', 'OA', 'INT', 'TECH', 'COMM', 'ER']
    : ['PED', 'MH', 'OA', 'INT', 'TECH', 'COMM', 'ER'];

  // Active highlighted badge index
  const [activeScanIdx, setActiveScanIdx] = useState(0);
  const currentScanningPathId = scanSequence[activeScanIdx] || '';

  // Eagerly ensure all badge images are decoded in memory
  useEffect(() => {
    badges.forEach((b) => {
      const img = new Image();
      img.src = b.imgUrl;
    });
  }, [badges]);

  // Clockwise orbit scanning cycle every 350ms
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setActiveScanIdx((prev) => (prev + 1) % scanSequence.length);
    }, 350);

    return () => clearInterval(scanInterval);
  }, [scanSequence.length]);

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
            particleCount: 120,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#002B7F', '#FF3366', '#00A3FF', '#10B981', '#F5A623', '#8B5CF6'],
          });
        } catch (_e) {}
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Dynamic suspense analysis message based on progress percentage
  const getStatusMessage = (pct: number) => {
    if (pct < 25) return '🔍 กำลังประมวลผลคำตอบของคุณ...';
    if (pct < 55) return '⚡ กำลังสแกนทักษะและบุคลิกภาพเฉพาะทาง...';
    if (pct < 85) return '✨ กำลังคำนวณเส้นทางพยาบาลที่ใช่ที่สุด...';
    return '🎉 ค้นพบพลังพยาบาลที่ใช่สำหรับคุณแล้ว!';
  };

  // Reusable badge item renderer
  const renderBadge = (badge: ProcessingBadgeItem, isFlipped: boolean = false) => {
    const isScanning = currentScanningPathId === badge.pathId;
    const theme = BADGE_THEMES[badge.pathId] || { textColor: 'text-[#002B7F]' };

    return (
      <div
        key={badge.pathId}
        className={`flex flex-col items-center justify-center transition-all duration-300 select-none relative ${
          isScanning
            ? 'scale-115 z-30 drop-shadow-[0_0_22px_rgba(255,51,102,0.95)]'
            : 'hover:scale-105 drop-shadow-xs'
        }`}
      >
        {/* Live Scanning Tag */}
        {isScanning && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FF3366] text-white text-[7px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-md flex items-center gap-0.5 whitespace-nowrap animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-current" />
            <span>SCANNING</span>
          </div>
        )}

        {/* Floating Badge Icon (Flipped horizontally on right side to gaze inward) */}
        <div className={`w-13 h-13 sm:w-15 sm:h-15 md:w-17 md:h-17 flex items-center justify-center ${isScanning ? 'animate-bounce-gentle' : ''}`}>
          <img
            src={badge.imgUrl}
            alt={badge.titleEn}
            className={`w-full h-full object-contain ${isFlipped ? 'scale-x-[-1]' : ''}`}
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Badge Title */}
        <span
          className={`text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-black tracking-tight uppercase text-center mt-0.5 leading-tight px-0.5 max-w-[85px] sm:max-w-[110px] drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] ${theme.textColor}`}
        >
          {badge.titleEn}
        </span>
      </div>
    );
  };

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover animate-fade-in"
      style={{
        backgroundImage: `url(${ASSETS.processing.background})`,
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
      }}
    >
      <style>{`
        @keyframes scanbeam {
          0% { top: 10%; opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { top: 88%; opacity: 0; }
        }
        .animate-scan-beam {
          animation: scanbeam 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* ── Soft Ambient Lighting Overlay ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-blue-900/15 pointer-events-none" />

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-2 sm:pt-3 max-w-[720px] mx-auto w-full">
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

      {/* ── 2. Stepper: 1..8 with Step 5 highlighted as ANALYZING ───────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 pt-1 pb-3 sm:pb-4 max-w-[720px] mx-auto w-full">
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
                    <div className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[8px] sm:text-[8.5px] tracking-wider uppercase shadow-sm whitespace-nowrap animate-pulse">
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
      <div className="relative z-20 flex-1 flex flex-col justify-between w-full max-w-[680px] md:max-w-[740px] mx-auto px-2 sm:px-4 min-h-0 mt-0.5 sm:mt-1">
        <div
          className="h-full w-full rounded-3xl shadow-[0_16px_48px_rgba(0,43,127,0.22)] p-2 sm:p-3 flex flex-col justify-between overflow-hidden relative border border-white/80"
          style={{
            backgroundImage: `url(${ASSETS.processing.innerCardBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
          }}
        >
          {/* Laser Scanner Beam traversing vertically for sci-fi tension */}
          <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#38bdf8] animate-scan-beam pointer-events-none z-20" />

          {/* ── Card Header: Title & Info ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Analyzing Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              <span>ANALYZING</span>
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
            </div>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-heading leading-tight drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              <span className="text-[#FF2D55]">AI </span>
              กำลังวิเคราะห์
            </h2>
            <h3 className="text-xs sm:text-sm md:text-base font-black text-[#0A2540] tracking-tight leading-snug drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
              เส้นทางพยาบาลที่ใช่สำหรับคุณ...
            </h3>

            {/* Sub-caption */}
            <p className="text-[10px] sm:text-xs font-bold text-[#FF3366] mt-0.5 flex items-center justify-center gap-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.95)]">
              <span>💕 จากคำตอบทั้ง {totalQuestions} ข้อของคุณ 💕</span>
            </p>
          </div>

          {/* ── Center Stage: Authentic Mockup Circular Orbit Layout ── */}
          <div className="flex-1 relative flex flex-col justify-between min-h-0 overflow-hidden my-0.5 px-1 sm:px-2">

            {/* Pulsing Concentric Holographic Radar Aura in Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-radial from-cyan-300/30 via-pink-300/10 to-transparent animate-pulse pointer-events-none" />

            {/* ── TOP TIER: PED (left) | MAT (center if female) | MH (right) ── */}
            <div className="relative z-20 flex items-start justify-between w-full px-1 sm:px-2 pt-0.5">
              {/* Top Left: Pediatric Nurse */}
              <div className="w-[28%] sm:w-[26%] flex justify-center">
                {renderBadge(badgePED, false)}
              </div>

              {/* Top Center: Maternal & Newborn (Female only) */}
              <div className="flex-1 flex justify-center">
                {badgeMAT ? renderBadge(badgeMAT, false) : <div className="h-4" />}
              </div>

              {/* Top Right: Mental Health Nurse (Gaze Inward) */}
              <div className="w-[28%] sm:w-[26%] flex justify-center">
                {renderBadge(badgeMH, true)}
              </div>
            </div>

            {/* ── MIDDLE TIER: Flank Badges + Center Student ── */}
            <div className="relative z-10 flex-1 flex items-center justify-between min-h-0 px-1 sm:px-2">
              {/* Left Flank: Emergency (upper) + Community (lower) */}
              <div className="w-[28%] sm:w-[26%] flex flex-col justify-around h-full py-0.5 z-20 space-y-1.5 sm:space-y-2.5">
                {renderBadge(badgeER, false)}
                {renderBadge(badgeCOMM, false)}
              </div>

              {/* Center Column: Student Character (Waist-up, centered between tiers) */}
              <div className="flex-1 h-full relative flex items-center justify-center min-h-0 px-1">
                <div className="relative w-full h-full flex items-center justify-center max-h-[280px] sm:max-h-[340px] md:max-h-[380px]">
                  <img
                    src={centerCharacterUrl}
                    alt={isFemale ? 'Female Student' : 'Male Student'}
                    className="h-full w-auto max-w-full object-contain drop-shadow-[0_16px_36px_rgba(0,43,127,0.38)] animate-float-subtle select-none scale-105 sm:scale-115"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
              </div>

              {/* Right Flank: Older Adult (upper) + International (lower) (Gaze Inward) */}
              <div className="w-[28%] sm:w-[26%] flex flex-col justify-around h-full py-0.5 z-20 space-y-1.5 sm:space-y-2.5">
                {renderBadge(badgeOA, true)}
                {renderBadge(badgeINT, true)}
              </div>
            </div>

            {/* ── BOTTOM TIER: Nursing + Technology in Center Hologram Frame ── */}
            <div className="relative z-20 flex justify-center w-full pb-1">
              <div
                className={`rounded-xl px-2.5 py-1 flex items-center gap-1.5 transition-all duration-300 ${
                  currentScanningPathId === 'TECH'
                    ? 'scale-110 drop-shadow-[0_0_20px_rgba(56,189,248,0.95)]'
                    : 'hover:scale-105 drop-shadow-xs'
                }`}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={badgeTECH.imgUrl}
                    alt={badgeTECH.titleEn}
                    className="w-full h-full object-contain"
                    loading="eager"
                    decoding="sync"
                  />
                </div>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-[#0284C7] tracking-tight uppercase leading-tight whitespace-nowrap drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  NURSING + TECHNOLOGY
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 4. Floating AI Robot Mascot Status Bar (Outside Card on Campus Background) ──── */}
      <div className="relative z-20 shrink-0 px-3 sm:px-6 pt-1.5 max-w-[680px] md:max-w-[740px] mx-auto w-full">
        <div className="bg-white/95 backdrop-blur-md border border-white/90 rounded-2xl px-3.5 py-2 sm:py-2.5 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <img
              src={ASSETS.processing.robot}
              alt="AI Robot Mascot"
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 object-contain drop-shadow-sm animate-mascot-bob shrink-0"
            />
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 font-heading leading-tight">
                <span className="truncate">{getStatusMessage(progress)}</span>
                <span className="text-blue-600 text-[11px] sm:text-xs font-mono shrink-0 ml-1.5 font-extrabold">{progress}%</span>
              </div>
              {/* Live Progress Bar with glowing gradient */}
              <div className="w-full bg-slate-200/70 rounded-full h-2 sm:h-2.5 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-[#FF3366] to-[#FF6584] rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(255,51,102,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-pink-600 leading-tight mt-0.5">
                โปรดรอสักครู่ ระบบกำลังค้นหาตัวตนที่แท้จริงของคุณ 💕
              </div>
            </div>
          </div>

          {/* Animated Spinner Loader */}
          <div className="flex items-center justify-center shrink-0 pl-1">
            <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-[#FF3366]" />
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Navigation & Action Bar (Outside Card on Campus Background) ──── */}
      <div className="relative z-20 shrink-0 px-3 sm:px-6 pb-2.5 sm:pb-3.5 pt-1 max-w-[680px] md:max-w-[740px] mx-auto w-full flex items-center justify-between gap-3">
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
