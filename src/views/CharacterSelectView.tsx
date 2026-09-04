import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CharacterType } from '../types';
import { ASSETS } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';
import { QuizStepper } from '../components/QuizStepper';

interface CharacterSelectViewProps {
  initialCharacter?: CharacterType;
  onSelect?: (characterType: CharacterType) => void;
  onConfirm?: (characterType: CharacterType) => void;
  onBack?: () => void;
}

export const CharacterSelectView: React.FC<CharacterSelectViewProps> = ({
  initialCharacter = 'male_student',
  onSelect,
  onConfirm,
  onBack,
}) => {
  const [selected, setSelected] = useState<CharacterType>(initialCharacter);

  const handleNext = () => {
    if (onConfirm) {
      onConfirm(selected);
    } else if (onSelect) {
      onSelect(selected);
    }
  };

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${ASSETS.characterSelect.background})`,
      }}
    >
      {/* ── Soft Lighting / Vignette Overlay ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/15 via-transparent to-blue-900/25 pointer-events-none" />

      {/* ── 1. Top Bar / Header ────────────────────────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-3 sm:pt-4 max-w-4xl mx-auto w-full">
        {/* Faculty Logo Pill */}
        <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md flex items-center gap-2 border border-white/80">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </div>

        {/* Decorative Floating Cross & Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block text-pink-400/80 text-xl animate-pulse font-bold">
            ✚
          </div>
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
      </div>

      {/* ── 2. Stepper (Step 7 Active) ──────────────────────────────────────── */}
      <div className="relative z-30 shrink-0 mt-1.5 sm:mt-2.5 px-2">
        <QuizStepper activeStep={7} />
      </div>

      {/* ── 3. Main Frosted Glass Card Container ────────────────────────────── */}
      <div className="relative z-20 flex-1 min-h-0 flex flex-col items-center justify-center px-3 sm:px-6 pt-2 pb-4 sm:pb-6 max-w-3xl mx-auto w-full">
        <div className="w-full h-full max-h-[760px] sm:max-h-[820px] rounded-[28px] sm:rounded-[36px] bg-white/88 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,43,127,0.18)] border border-white/75 px-4 sm:px-7 py-3 sm:py-5 flex flex-col justify-between items-center">

          {/* Title Header with Sparkles & Heart */}
          <div className="shrink-0 text-center mb-1 sm:mb-2">
            <div className="inline-flex items-center justify-center gap-2 mb-0.5">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-300 animate-spin-slow" />
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold tracking-tight font-heading">
                <span className="text-[#002B7F]">เลือก </span>
                <span className="bg-gradient-to-r from-[#FF2B6D] via-[#FF5277] to-[#1E62D0] bg-clip-text text-transparent">
                  Future Nurse Look
                </span>
              </h2>
              <span className="text-xl sm:text-2xl animate-pulse">💖</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed flex items-center justify-center gap-2">
              <span className="text-pink-400 text-xs">✦</span>
              <span>เลือกคาแรกเตอร์ที่อยากให้แสดงในผลลัพธ์</span>
              <span className="text-pink-400 text-xs">✦</span>
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              ตัวเลือกนี้ไม่มีผลต่อผลการวิเคราะห์
            </p>
          </div>

          {/* ── 2 Big Choice Cards (Male & Female) ─────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-2xl flex-1 min-h-0 my-1 sm:my-2">

            {/* ── Male Look Card ───────────────────────────────────────────── */}
            <div
              onClick={() => setSelected('male_student')}
              className={`group relative rounded-[22px] sm:rounded-[28px] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-between border-2 select-none shadow-md ${
                selected === 'male_student'
                  ? 'border-[#1D63D8] ring-4 ring-blue-300/60 shadow-[0_10px_28px_rgba(29,99,216,0.28)] scale-[1.015]'
                  : 'border-blue-200/70 hover:border-blue-300 hover:scale-[1.01]'
              } bg-gradient-to-b from-[#EBF4FF] via-[#E4F0FF] to-[#D6E8FE] h-full p-2.5 sm:p-4`}
            >
              {/* Background Medical SVG Decor */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-55">
                {/* ECG Wave Top Left */}
                <svg className="absolute top-8 left-2 w-16 h-8 text-blue-400 stroke-current" fill="none" viewBox="0 0 100 40">
                  <path d="M0 20 L25 20 L32 5 L42 35 L50 15 L56 24 L62 20 L100 20" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* Medical Cross Top Right */}
                <div className="absolute top-10 right-4 text-blue-400 text-xl font-black opacity-60">✚</div>
                {/* Hexagon Pattern */}
                <svg className="absolute top-16 right-2 w-12 h-12 text-blue-300/40 stroke-current" fill="none" viewBox="0 0 60 60">
                  <polygon points="30,5 55,18 55,42 30,55 5,42 5,18" strokeWidth="2" />
                </svg>
              </div>

              {/* Card Title Header */}
              <div className="relative z-10 shrink-0 text-center pt-1">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-[#1D63D8] font-heading tracking-wide">
                  Future Nurse
                </h3>
                <p className="text-[10px] sm:text-xs font-bold text-blue-600/80 tracking-wider">
                  – Male Look –
                </p>
              </div>

              {/* Character Illustration (Expanded Height) */}
              <div className="relative z-10 w-full flex-1 min-h-0 flex items-end justify-center overflow-hidden">
                <img
                  src={ASSETS.characterSelect.maleThumbnail}
                  alt="Future Nurse Male Look"
                  className="h-full max-h-[340px] sm:max-h-[420px] md:max-h-[460px] w-auto object-contain object-bottom drop-shadow-[0_12px_20px_rgba(29,99,216,0.22)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Radio Indicator Button */}
              <div className="relative z-10 shrink-0 mt-2 mb-0.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected === 'male_student'
                      ? 'border-[#1D63D8] bg-white shadow-[0_0_12px_rgba(29,99,216,0.5)] ring-2 ring-blue-300'
                      : 'border-blue-300 bg-white/80'
                  }`}
                >
                  {selected === 'male_student' && (
                    <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#1D63D8]" />
                  )}
                </div>
              </div>
            </div>

            {/* ── Female Look Card ─────────────────────────────────────────── */}
            <div
              onClick={() => setSelected('female_student')}
              className={`group relative rounded-[22px] sm:rounded-[28px] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col items-center justify-between border-2 select-none shadow-md ${
                selected === 'female_student'
                  ? 'border-[#FF3366] ring-4 ring-rose-300/60 shadow-[0_10px_28px_rgba(255,51,102,0.28)] scale-[1.015]'
                  : 'border-pink-200/70 hover:border-pink-300 hover:scale-[1.01]'
              } bg-gradient-to-b from-[#FFF0F5] via-[#FFE4EE] to-[#FFD8E6] h-full p-2.5 sm:p-4`}
            >
              {/* Background Medical SVG Decor */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-55">
                {/* Medical Cross Top Left */}
                <div className="absolute top-10 left-4 text-pink-400 text-xl font-black opacity-60">✚</div>
                {/* Stethoscope Silhouette Top Right */}
                <svg className="absolute top-8 right-3 w-12 h-12 text-pink-400 stroke-current opacity-70" fill="none" viewBox="0 0 64 64">
                  <path d="M16 12 C16 32, 48 32, 48 12" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M32 30 L32 44 C32 50, 42 50, 42 44 L42 40" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="42" cy="38" r="4" strokeWidth="2" />
                </svg>
                {/* Hexagon Pattern */}
                <svg className="absolute top-16 left-2 w-12 h-12 text-pink-300/40 stroke-current" fill="none" viewBox="0 0 60 60">
                  <polygon points="30,5 55,18 55,42 30,55 5,42 5,18" strokeWidth="2" />
                </svg>
              </div>

              {/* Card Title Header */}
              <div className="relative z-10 shrink-0 text-center pt-1">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-[#FF3366] font-heading tracking-wide">
                  Future Nurse
                </h3>
                <p className="text-[10px] sm:text-xs font-bold text-rose-500/80 tracking-wider">
                  – Female Look –
                </p>
              </div>

              {/* Character Illustration (Expanded Height) */}
              <div className="relative z-10 w-full flex-1 min-h-0 flex items-end justify-center overflow-hidden">
                <img
                  src={ASSETS.characterSelect.femaleThumbnail}
                  alt="Future Nurse Female Look"
                  className="h-full max-h-[340px] sm:max-h-[420px] md:max-h-[460px] w-auto object-contain object-bottom drop-shadow-[0_12px_20px_rgba(255,51,102,0.22)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Radio Indicator Button */}
              <div className="relative z-10 shrink-0 mt-2 mb-0.5">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected === 'female_student'
                      ? 'border-[#FF3366] bg-white shadow-[0_0_12px_rgba(255,51,102,0.5)] ring-2 ring-rose-300'
                      : 'border-pink-300 bg-white/80'
                  }`}
                >
                  {selected === 'female_student' && (
                    <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-[#FF3366]" />
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Hint Note */}
          <div className="shrink-0 mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium">
            <span className="text-pink-500 font-bold">✦</span>
            <span>คุณสามารถเปลี่ยน Look ได้ภายหลังในหน้าผลลัพธ์</span>
          </div>

          {/* ── Action Buttons Row ─────────────────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4 w-full max-w-md">
            {/* Back Button */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex-1 max-w-[170px] py-2.5 sm:py-3 px-4 rounded-full bg-white hover:bg-slate-50 border-2 border-[#002B7F] text-[#002B7F] font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>ย้อนกลับ</span>
              </button>
            )}

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 max-w-[170px] py-2.5 sm:py-3 px-4 rounded-full bg-gradient-to-r from-[#FF2B6D] to-[#FF5277] hover:from-[#e92060] hover:to-[#f0456b] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(255,43,109,0.35)] active:scale-95 transition-all"
            >
              <span>ต่อไป</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
