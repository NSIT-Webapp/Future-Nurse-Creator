import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ResultPayload } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';
import { ASSETS } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';

interface CardPreviewViewProps {
  result: ResultPayload;
  /** Called when the generated card data URL is ready (App stores it for SaveShareView). */
  onCardReady: (cardDataUrl: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

/**
 * CardPreviewView — Step 7: "CARD PREVIEW"
 * Matches the official Open House Mockup (Image 1):
 * - Top Faculty Header & Sound Toggle
 * - Stepper with Step 7 Active (Pink CARD PREVIEW badge)
 * - Main Glassmorphic White Container with "✦ CARD PREVIEW ✦"
 * - Title "นี่คือ Future Nurse Card ของคุณ!"
 * - Full-view 9:16 Card display with floating cloud speech bubble
 * - Pagination "1 / 1"
 * - Tip bar "💡 พร้อมแล้ว? ไปบันทึกและแชร์การ์ดของคุณได้เลย ✨"
 * - Action buttons: "← ย้อนกลับ" and "บันทึกและแชร์ >"
 */
export const CardPreviewView: React.FC<CardPreviewViewProps> = ({
  result,
  onCardReady,
  onNext,
  onBack,
}) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(true);

  // Stepper state: 1..8 steps (7 is active)
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    let mounted = true;

    async function generate() {
      try {
        const dataUrl = await renderFutureNurseCard(result);
        if (!mounted) return;
        setCardDataUrl(dataUrl);
        onCardReady(dataUrl);
      } catch (e) {
        console.error('[CardPreviewView] Card generation failed:', e);
      } finally {
        if (mounted) setGenerating(false);
      }
    }

    generate();
    return () => {
      mounted = false;
    };
  }, [result, onCardReady]);

  return (
    <div
      className="relative h-full w-full flex flex-col justify-between overflow-hidden select-none bg-cover bg-center animate-fade-in"
      style={{
        backgroundImage: `url(${ASSETS.processing.background})`,
        backgroundPosition: 'center bottom',
        backgroundSize: 'cover',
      }}
      data-slot="card-preview-root"
    >
      {/* ── Soft Ambient Lighting / Vignette Overlay ────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300/15 via-transparent to-blue-900/15 pointer-events-none" />

      {/* Floating decorative ambient sparkles & hearts */}
      <div className="absolute top-20 left-6 text-pink-300/60 text-lg sm:text-xl pointer-events-none animate-pulse">
        💖
      </div>
      <div className="absolute top-36 right-8 text-amber-300/70 text-base sm:text-lg pointer-events-none animate-bounce">
        ✨
      </div>
      <div className="absolute bottom-28 left-8 text-amber-300/60 text-sm sm:text-base pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-36 right-6 text-pink-300/60 text-lg sm:text-xl pointer-events-none animate-pulse">
        💕
      </div>

      {/* ── 1. Top Bar: Faculty Logo + Audio Toggle ──────────────────────────── */}
      <div className="relative z-30 shrink-0 flex items-center justify-between px-3 sm:px-6 pt-2.5 sm:pt-3 max-w-xl mx-auto w-full">
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

      {/* ── 2. Stepper: 1..8 with Step 7 highlighted as CARD PREVIEW ─────────── */}
      <div className="relative z-30 shrink-0 px-3 sm:px-6 py-1 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between w-full">
          {stepperSteps.map((stepNum, idx) => {
            const isCompleted = stepNum < 7;
            const isCurrent = stepNum === 7;
            const isLast = idx === stepperSteps.length - 1;

            return (
              <React.Fragment key={stepNum}>
                {/* Step Circle & Badge */}
                <div className="flex flex-col items-center shrink-0 relative">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_16px_rgba(255,51,102,0.65)] scale-110 ring-4 ring-rose-200/80'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-sm'
                        : 'bg-white/80 text-slate-400 border border-slate-300/80'
                    }`}
                  >
                    {stepNum}
                  </div>

                  {/* Pink CARD PREVIEW Pill under step 7 */}
                  {isCurrent && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-[7.5px] sm:text-[8px] tracking-wider uppercase shadow-xs whitespace-nowrap animate-pulse">
                      CARD PREVIEW
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex-1 mx-0.5 sm:mx-1 flex items-center justify-center min-w-[6px] sm:min-w-[12px]">
                    <div
                      className={`w-full border-t-2 transition-colors ${
                        stepNum < 6
                          ? 'border-[#1D63D8]'
                          : stepNum === 6
                          ? 'border-[#FF3366]/80'
                          : 'border-slate-300/80'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. Main Stage Container: Frosted Glass White Card ────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col justify-between max-w-xl mx-auto w-full px-2.5 sm:px-4 min-h-0 mt-3 sm:mt-3.5 mb-1 sm:mb-2">
        <div className="h-full w-full rounded-[28px] sm:rounded-[36px] bg-white/92 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,43,127,0.18)] border border-white/80 p-3 sm:p-4 flex flex-col justify-between items-center overflow-hidden">

          {/* ── Top Info Section ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Card Preview Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] text-white text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-widest mb-1 shadow-xs">
              <span>✦ CARD PREVIEW ✦</span>
            </div>

            {/* Headline with Heart accents */}
            <h2 className="text-xl sm:text-2xl md:text-[26px] font-black text-slate-800 tracking-tight font-heading leading-tight flex items-center justify-center gap-1.5">
              <span>นี่คือ</span>
              <span className="bg-gradient-to-r from-[#FF2B6D] via-[#FF5277] to-[#1E62D0] bg-clip-text text-transparent">
                Future Nurse Card
              </span>
              <span>ของคุณ!</span>
              <span className="text-base sm:text-lg animate-pulse">💖</span>
            </h2>

            {/* Sub-caption */}
            <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-0.5">
              ตรวจสอบการ์ดของคุณก่อนบันทึกและแชร์
            </p>
          </div>

          {/* ── Center Stage: Future Nurse Card Display ── */}
          <div className="relative flex-1 w-full flex items-center justify-center min-h-0 my-1">
            {/* Card Frame (9:16 aspect ratio matching high-res output) */}
            <div className="relative h-full max-h-[460px] sm:max-h-[520px] md:max-h-[560px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/90 bg-slate-900 flex items-center justify-center transition-all">
              {generating ? (
                <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                  <Loader2 className="w-8 h-8 text-[#FF3366] animate-spin" />
                  <p className="text-xs font-bold text-slate-300">กำลังเตรียมการ์ดของคุณ...</p>
                </div>
              ) : cardDataUrl ? (
                <img
                  src={cardDataUrl}
                  alt={`Future Nurse Card — ${result.path.nameEn}`}
                  className="w-full h-full object-cover animate-fade-in select-none"
                  draggable={false}
                />
              ) : (
                <p className="text-xs text-slate-400 text-center px-4">
                  ไม่สามารถสร้างการ์ดได้ กรุณาลองใหม่อีกครั้ง
                </p>
              )}
            </div>

            {/* Floating Cloud Speech Bubble on Right: "เส้นทางที่ใช่สำหรับคุณ! 💕" */}
            <div className="hidden xs:flex absolute -right-2 sm:right-1 md:right-3 top-1/2 -translate-y-1/2 flex-col items-center z-30 pointer-events-none animate-float-subtle">
              <div className="relative bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl shadow-lg border border-white/90 text-center">
                <p className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight">
                  เส้นทางที่ใช่
                </p>
                <p className="text-[10px] sm:text-[11px] font-black text-[#FF3366] leading-tight">
                  สำหรับคุณ! 💕
                </p>
                {/* Cloud speech tail */}
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-l border-b border-white/80" />
              </div>
            </div>
          </div>

          {/* ── Pagination Indicator: "● 1 / 1" ── */}
          <div className="shrink-0 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shadow-xs" />
            <span>1 / 1</span>
          </div>

          {/* ── Tip Box: "💡 พร้อมแล้ว? ไปบันทึกและแชร์การ์ดของคุณได้เลย ✨" ── */}
          <div className="shrink-0 w-full max-w-sm mx-auto mb-1">
            <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-full py-1.5 px-3 sm:px-4 shadow-xs flex items-center justify-center gap-1.5 text-[10.5px] sm:text-xs font-bold text-[#002B7F] text-center">
              <span>💡</span>
              <span>พร้อมแล้ว? ไปบันทึกและแชร์การ์ดของคุณได้เลย ✨</span>
            </div>
          </div>

          {/* ── Bottom Action Buttons: "ย้อนกลับ" and "บันทึกและแชร์" ── */}
          <div className="shrink-0 w-full max-w-md mx-auto flex items-center justify-between gap-3 pt-1">
            {/* Back Button */}
            {onBack ? (
              <button
                onClick={onBack}
                className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-full bg-white hover:bg-slate-50 text-[#002B7F] font-semibold text-[17px] sm:text-[19px] border border-slate-200 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#002B7F]" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {/* Next / Save & Share CTA Button */}
            <button
              onClick={onNext}
              disabled={generating}
              className="flex-1 py-2.5 sm:py-3.5 px-4 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] hover:brightness-105 active:scale-95 text-white font-bold text-[18px] sm:text-[20px] shadow-md shadow-rose-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              <span>บันทึกและแชร์</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
