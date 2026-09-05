import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Maximize2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
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
 * Features:
 * 1. Single, crisp, official Future Nurse Card display (no double/overlapping cards)
 * 2. Path-Colored Ambient Breathing Aura
 * 3. Tap to Zoom / Fullscreen Modal
 * 4. Celebratory Confetti on card ready
 * 5. Floating "เส้นทางที่ใช่สำหรับคุณ! 💕" speech bubble
 */
export const CardPreviewView: React.FC<CardPreviewViewProps> = ({
  result,
  onCardReady,
  onNext,
  onBack,
}) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cardAspect, setCardAspect] = useState<string>('9 / 16');
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const hasFiredConfetti = useRef(false);

  // Stepper state: 1..8 steps (7 is active)
  const stepperSteps = [1, 2, 3, 4, 5, 6, 7, 8];

  const pathColor = result.path.color || '#FF6584';

  useEffect(() => {
    let mounted = true;

    async function generate() {
      try {
        const cardUrl = await renderFutureNurseCard(result);

        if (!mounted) return;
        setCardDataUrl(cardUrl);
        onCardReady(cardUrl);

        // Celebratory Confetti burst on card ready (fires once)
        if (!hasFiredConfetti.current) {
          hasFiredConfetti.current = true;
          try {
            confetti({
              particleCount: 55,
              spread: 70,
              origin: { y: 0.55 },
              colors: ['#FF3366', '#FF6584', '#00A3FF', '#F5A623', '#10B981'],
            });
          } catch (_e) {}
        }
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

  useEffect(() => {
    if (!cardDataUrl) {
      setCardAspect('9 / 16');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setCardAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
    img.src = cardDataUrl;
  }, [cardDataUrl]);

  // Subtle 3D Tilt for interactive depth
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10, active: true });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

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
      <div className="absolute top-36 right-8 text-amber-300/70 text-base sm:text-lg pointer-events-none animate-pulse">
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
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2.5 sm:px-3 py-0.5 rounded-full bg-[#FF3366] text-white font-black text-xs tracking-wider uppercase shadow-xs whitespace-nowrap animate-pulse">
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

          {/* ── Top Info Section (Matches user mockup) ── */}
          <div className="text-center shrink-0 pt-0.5">
            {/* Card Preview Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] text-white text-xs sm:text-sm font-black uppercase tracking-widest mb-1 shadow-xs">
              <span>✦ CARD PREVIEW ✦</span>
            </div>

            {/* Headline with Heart accents */}
            <h2 className="text-2xl sm:text-3xl md:text-[34px] font-black text-slate-800 tracking-tight font-heading leading-tight flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
              <span>นี่คือ <span className="text-[#FF3366]">Future Nurse Card</span> ของคุณ!</span>
              <span className="text-xl sm:text-2xl text-[#FF3366] animate-pulse">💕</span>
            </h2>

            {/* Sub-caption */}
            <p className="text-base sm:text-lg font-semibold text-slate-600 mt-1">
              ตรวจสอบการ์ดของคุณก่อนบันทึกและแชร์
            </p>
          </div>

          {/* ── Center Stage: Single Clean Future Nurse Card Display ── */}
          <div className="relative flex-1 w-full flex items-center justify-center min-h-0 my-1">

            {/* Path-Colored Ambient Breathing Aura */}
            <div
              className="absolute w-56 sm:w-64 h-80 sm:h-96 rounded-full blur-3xl opacity-35 animate-pulse pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(circle, ${pathColor} 0%, transparent 70%)`,
              }}
            />

            {/* Single Solid Card Frame (No dark box, beautiful drop-shadow) */}
            <div
              className="relative h-full max-h-[min(520px,50dvh)] sm:max-h-[min(560px,54dvh)] md:max-h-[600px] max-w-[min(92vw,360px)] sm:max-w-[400px] select-none rounded-[22px] sm:rounded-[28px] drop-shadow-[0_16px_36px_rgba(0,43,127,0.18)] overflow-hidden flex items-center justify-center transition-transform duration-200"
              style={{
                aspectRatio: cardAspect,
                transform: tilt.active
                  ? `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
                  : 'none',
              }}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {generating ? (
                <div className="flex flex-col items-center gap-2.5 p-6 text-center bg-white/70 backdrop-blur-md rounded-2xl">
                  <Loader2 className="w-8 h-8 text-[#FF3366] animate-spin" />
                  <p className="text-xs font-bold text-slate-500">กำลังเตรียมการ์ดของคุณ...</p>
                </div>
              ) : cardDataUrl ? (
                <>
                  <img
                    src={cardDataUrl}
                    alt={`Future Nurse Card — ${result.path.nameEn}`}
                    className="w-full h-full object-contain select-none card-crisp"
                    draggable={false}
                  />

                  {/* Subtle Holographic Specular Light Sheen on hover/tilt */}
                  {tilt.active && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-150"
                      style={{
                        background: `linear-gradient(${110 + tilt.x * 2.5}deg, transparent 20%, rgba(255,255,255,0.4) 45%, rgba(255,215,0,0.35) 50%, rgba(135,206,250,0.35) 55%, transparent 80%)`,
                      }}
                    />
                  )}

                  {/* Quick Fullscreen Zoom Button */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <button
                      onClick={() => setIsZoomed(true)}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs flex items-center justify-center active:scale-90 transition-all border border-white/70"
                      title="แตะเพื่อดูภาพขยายเต็มจอ"
                    >
                      <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#002B7F]" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400 text-center px-4">
                  ไม่สามารถสร้างการ์ดได้ กรุณาลองใหม่อีกครั้ง
                </p>
              )}
            </div>

            {/* Floating Cloud Speech Bubble on Right: "เส้นทางที่ใช่สำหรับคุณ! 💕" */}
            <div className="hidden xs:flex absolute -right-2 sm:right-1 md:right-3 top-1/2 -translate-y-1/2 flex-col items-center z-30 pointer-events-none animate-float-subtle">
              <div className="relative bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-lg border border-white/90 text-center">
                <p className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                  เส้นทางที่ใช่
                </p>
                <p className="text-xs sm:text-sm font-black text-[#FF3366] leading-tight">
                  สำหรับคุณ! 💕
                </p>
                {/* Cloud speech tail */}
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rotate-45 border-l border-b border-white/80" />
              </div>
            </div>
          </div>

          {/* ── Pagination Indicator: ● 1 / 1 (Clean, no flip controls) ── */}
          <div className="shrink-0 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-slate-600 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-xs" />
            <span>1 / 1</span>
          </div>

          {/* ── Tip Box: "💡 พร้อมแล้ว? ไปบันทึกและแชร์การ์ดของคุณได้เลย ✨" ── */}
          <div className="shrink-0 w-full max-w-md mx-auto mb-1">
            <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-full py-2 px-4 sm:px-5 shadow-xs flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-[#002B7F] text-center">
              <span>💡</span>
              <span>พร้อมแล้ว? ไปบันทึกและแชร์การ์ดของคุณได้เลย ✨</span>
            </div>
          </div>

          {/* ── Bottom Action Buttons: "ย้อนกลับ" and "บันทึกและแชร์" ── */}
          <div className="shrink-0 w-full max-w-lg mx-auto flex items-center justify-between gap-3 pt-1">
            {/* Back Button */}
            {onBack ? (
              <button
                onClick={onBack}
                className="flex-1 min-h-[56px] py-3.5 px-6 rounded-full bg-white hover:bg-slate-50 text-[#002B7F] font-bold text-lg sm:text-xl border-2 border-slate-200 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#002B7F] stroke-[2.5]" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {/* Next / Save & Share CTA Button */}
            <button
              onClick={onNext}
              disabled={generating}
              className="flex-1 min-h-[56px] py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] hover:brightness-105 active:scale-95 text-white font-black text-xl sm:text-2xl shadow-lg shadow-rose-400/35 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              <span>บันทึกและแชร์</span>
              <ChevronRight className="w-6 h-6 text-white stroke-[3]" />
            </button>
          </div>

        </div>
      </div>

      {/* ── #3 Fullscreen Zoom Lightbox Modal ───────────────────────────────── */}
      {isZoomed && cardDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center active:scale-90 transition-all border border-white/30 z-10"
            title="ปิดหน้าต่างขยาย"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Zoomed high-res card */}
          <div
            className="relative max-h-[88vh] max-w-[92vw] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40 animate-scale-up"
            style={{ aspectRatio: cardAspect }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={cardDataUrl}
              alt={`Zoomed Future Nurse Card — ${result.path.nameEn}`}
              className="w-full h-full object-contain select-none"
            />
          </div>

          <p className="text-xs text-white/70 mt-3 flex items-center gap-1 font-medium">
            <span>แตะพื้นที่ว่างเพื่อปิด</span>
          </p>
        </div>
      )}
    </div>
  );
};
