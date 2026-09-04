import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ASSETS } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';

interface WelcomeViewProps {
  onStart: () => void;
}

/**
 * WelcomeView — Home Screen (Fully Layered Responsive Architecture)
 *
 * Distinct Integrated Layers:
 * 1. data-layer="home-background": Clean campus scenery background (background.jpg)
 * 2. data-layer="home-title": 3D Title Wordmark + Ribbon (title-wordmark.png)
 * 3. data-layer="home-characters": Male & Female students with gentle floating motion (character-male.png & character-female.png)
 * 4. data-layer="home-sound": Modular Sound / Music Control (SoundControl.tsx)
 * 5. data-layer="home-cta": Start Button with soft pulsing glow & active touch feedback
 * 6. data-layer="home-step-cards": 3-step cards with high-DPI native vector typography
 * 7. data-layer="home-mascot": Blue owl mascot with subtle natural bobbing (mascot.png)
 * 8. data-layer="home-footer": High-DPI vector footer text
 */
export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  return (
    <div
      className="relative w-full h-full min-h-full flex flex-col justify-between select-none overflow-hidden animate-fade-in"
      data-slot="home-root"
    >
      {/* ── 1. Background Artwork Layer ───────────────────────────────────── */}
      <img
        src={ASSETS.home.background}
        alt="Mahidol Campus"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* ── 2. Top Header Bar (Mahidol Seal + Sound Control) ─────────────── */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 pt-3 shrink-0">
        {/* University Emblem & Name */}
        <div className="flex items-center gap-2.5">
          <img
            src={ASSETS.home.mahidolSeal}
            alt="ตราสัญลักษณ์มหาวิทยาลัยมหิดล"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm shrink-0"
            draggable={false}
          />
          <div className="leading-tight">
            <h2 className="text-xs sm:text-[13px] font-extrabold text-[#002B7F] font-heading drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              มหาวิทยาลัยมหิดล
            </h2>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#002B7F]/80 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              คณะพยาบาลศาสตร์
            </p>
          </div>
        </div>

        {/* Sound Control Toggle */}
        <SoundControl trackUrl={ASSETS.home.bgmTrack} />
      </div>

      {/* ── 3. Title Wordmark Layer ───────────────────────────────────────── */}
      <div data-layer="home-title" className="relative z-30 flex flex-col items-center pt-0.5 pb-1 shrink-0">
        <img
          src={ASSETS.home.titleWordmark}
          alt="Future Nurse Creator - Mahidol Open House"
          className="w-[70%] sm:w-[64%] max-w-sm h-auto object-contain pointer-events-none drop-shadow-md"
          draggable={false}
        />
        <p className="text-[11px] sm:text-xs font-bold text-[#002B7F] mt-0.5 font-heading tracking-wide bg-white/75 backdrop-blur-[3px] px-3.5 py-0.5 rounded-full shadow-xs border border-white/60 drop-shadow-xs">
          ค้นพบตัวตน สร้างอนาคตพยาบาลในแบบคุณ <span className="text-pink-500">💖</span>
        </p>
      </div>

      {/* ── 4. Character Duo Layer (Male on Left, Female on Right) ────────── */}
      <div
        data-layer="home-characters"
        className="absolute inset-x-0 top-0 bottom-[28%] pointer-events-none z-10 overflow-hidden"
      >
        {/* Male Student (Left side) */}
        <div className="absolute left-[-2%] sm:left-[4%] top-[25%] sm:top-[26%] w-[56%] sm:w-[50%] h-[72%] animate-float-subtle">
          <img
            src={ASSETS.home.characterMale}
            alt="Male Nursing Student"
            className="w-full h-full object-contain object-top drop-shadow-[0_8px_16px_rgba(0,43,127,0.18)]"
            draggable={false}
          />
        </div>

        {/* Female Student (Right side, slightly in front) */}
        <div
          className="absolute right-[-2%] sm:right-[4%] top-[27%] sm:top-[28%] w-[54%] sm:w-[48%] h-[72%] animate-float-subtle"
          style={{ animationDelay: '1.2s' }}
        >
          <img
            src={ASSETS.home.characterFemale}
            alt="Female Nursing Student"
            className="w-full h-full object-contain object-top drop-shadow-[0_8px_16px_rgba(0,43,127,0.18)]"
            draggable={false}
          />
        </div>
      </div>

      {/* ── 5. Primary CTA: Start Button Layer ────────────────────────────── */}
      <div
        data-layer="home-cta"
        className="relative z-20 w-full px-5 sm:px-8 py-1.5 flex justify-center mt-auto"
      >
        <button
          onClick={onStart}
          className="group w-full max-w-sm sm:max-w-md py-3 sm:py-3.5 px-3.5 rounded-full bg-gradient-to-r from-[#FF4E72] via-[#FF3366] to-[#783BE8] hover:from-[#ff5b7d] hover:to-[#8449f0] active:scale-[0.98] transition-all duration-150 flex items-center justify-between shadow-[0_8px_25px_rgba(255,51,102,0.45)] cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400/50 animate-cta-pulse"
          aria-label="เริ่มสร้างอนาคตของคุณเลย! เริ่มค้นหา Future Nurse ของคุณ"
        >
          {/* Rocket Bubble */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-base sm:text-lg">🚀</span>
          </div>

          {/* Text */}
          <span className="text-white font-extrabold text-sm sm:text-base md:text-lg font-heading tracking-wide drop-shadow-sm px-2">
            เริ่มสร้างอนาคตของคุณเลย!
          </span>

          {/* Chevron */}
          <div className="w-7 h-7 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* ── 6. Information Section (3-Step Cards + Mascot) ─────────────────── */}
      <div
        data-layer="home-step-cards"
        className="relative z-20 w-full px-4 sm:px-6 pt-1 pb-1 flex flex-col justify-center bg-gradient-to-t from-white/95 via-white/80 to-transparent backdrop-blur-[2px]"
      >
        {/* Banner Label */}
        <div className="text-center mb-1">
          <span className="text-xs sm:text-sm font-black text-[#002B7F] tracking-wide font-heading drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            ⪢ 3 ขั้นตอน สู่ Future Nurse ของคุณ ⪡
          </span>
        </div>

        {/* Mascot + 3 Cards Row */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-lg mx-auto w-full">
          {/* Mascot (Clean Transparent with subtle natural bobbing) */}
          <div
            data-layer="home-mascot"
            className="w-16 sm:w-20 shrink-0 flex items-end justify-center animate-mascot-bob"
          >
            <img
              src={ASSETS.home.mascot}
              alt="Mascot"
              className="w-full h-auto object-contain drop-shadow-md"
              draggable={false}
            />
          </div>

          {/* 3 Native High-DPI Vector Cards */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 flex-1">
            {/* Card 1 */}
            <div className="relative rounded-xl sm:rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm p-1.5 sm:p-2 flex flex-col items-center justify-between text-center backdrop-blur-sm">
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FF4E72] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow">
                1
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-pink-50 flex items-center justify-center text-xs sm:text-sm mb-0.5">
                📋
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 font-heading leading-tight">
                ตอบคำถามสั้น ๆ
              </p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 mt-0.5 leading-tight">
                เลือกคำตอบที่เป็นตัวคุณที่สุด
              </p>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-xl sm:rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm p-1.5 sm:p-2 flex flex-col items-center justify-between text-center backdrop-blur-sm">
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#F59E0B] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow">
                2
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 flex items-center justify-center text-xs sm:text-sm mb-0.5">
                🤖
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 font-heading leading-tight">
                AI ค้นหา Future Nurse
              </p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 mt-0.5 leading-tight">
                วิเคราะห์จุดเด่นและสายพยาบาล
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-xl sm:rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm p-1.5 sm:p-2 flex flex-col items-center justify-between text-center backdrop-blur-sm">
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#10B981] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow">
                3
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-xs sm:text-sm mb-0.5">
                🪪
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-800 font-heading leading-tight">
                รับ Future Nurse Card
              </p>
              <p className="text-[8px] sm:text-[9px] text-slate-500 mt-0.5 leading-tight">
                ดูผลลัพธ์ บันทึก และแชร์การ์ด
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Native Vector Footer Typography ─────────────────────────────── */}
      <div data-layer="home-footer" className="relative z-20 w-full pb-2 pt-0.5 text-center">
        <p className="text-[11px] sm:text-xs font-bold text-[#002B7F] font-heading drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          มาค้นหา Future Nurse ในตัวคุณกันเถอะ! <span className="text-pink-500">💖</span>
        </p>
      </div>
    </div>
  );
};
