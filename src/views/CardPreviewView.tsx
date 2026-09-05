import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Maximize2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResultPayload } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';
import { ASSETS } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';

interface CardPreviewViewProps {
  result: ResultPayload;
  onCardReady: (cardDataUrl: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const CardPreviewView: React.FC<CardPreviewViewProps> = ({ result, onCardReady, onNext, onBack }) => {
  const [cardDataUrl, setCardDataUrl] = useState('');
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const hasFiredConfetti = useRef(false);

  useEffect(() => {
    let mounted = true;
    setGenerating(true);
    setCardDataUrl('');
    setError('');
    async function generate() {
      try {
        const url = await renderFutureNurseCard(result);
        if (!mounted) return;
        setCardDataUrl(url);
        onCardReady(url);
        if (!hasFiredConfetti.current) {
          hasFiredConfetti.current = true;
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 }, disableForReducedMotion: true });
          }
        }
      } catch (e) {
        if (mounted) setError('ยังสร้างการ์ดไม่สำเร็จ กรุณาลองอีกครั้ง');
        console.error('[CardPreviewView]', e);
      } finally {
        if (mounted) setGenerating(false);
      }
    }
    void generate();
    return () => { mounted = false; };
  }, [result, onCardReady, attempt]);

  useEffect(() => {
    if (isZoomed) dialog.current?.showModal();
    else dialog.current?.close();
  }, [isZoomed]);

  return (
    <div className="h-full w-full overflow-y-auto bg-cover bg-center text-[#002B7F]" style={{ backgroundImage: `url(${ASSETS.processing.background})` }} data-slot="card-preview-root">
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-2 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-5">
        <div className="flex shrink-0 items-center justify-between">
          <div className="rounded-full bg-white px-3 py-1.5">
            <img src={ASSETS.home.facultyLogo} alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์" className="h-6 w-auto" />
          </div>
          <SoundControl trackUrl={ASSETS.home.bgmTrack} size="md" />
        </div>
        <nav aria-label="ความคืบหน้า" className="flex shrink-0 items-center justify-between gap-1 py-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(step => (
            <React.Fragment key={step}>
              {step > 1 && <span className="h-0.5 flex-1 bg-blue-200" />}
              <span aria-current={step === 7 ? 'step' : undefined} aria-label={`ขั้นตอน ${step}${step === 7 ? ' ตรวจสอบการ์ด' : ''}`} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === 7 ? 'bg-[#FF3366] text-white' : step < 7 ? 'bg-[#1D63D8] text-white' : 'bg-white text-slate-500'}`}>{step}</span>
            </React.Fragment>
          ))}
        </nav>
        <h1 className="shrink-0 text-center text-xl font-bold leading-snug sm:text-2xl">Future Nurse Card ของคุณ</h1>
        <div className="relative flex min-h-[300px] shrink-0 items-center justify-center" style={{ height: 'max(300px, calc(100dvh - 278px))' }}>
          {generating ? (
            <div role="status" className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6">
              <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin" />
              <p>กำลังเตรียมการ์ดของคุณ...</p>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl bg-white p-6 text-center">
              <p>{error}</p>
              <button onClick={() => setAttempt(n => n + 1)} className="mt-3 min-h-11 rounded-full bg-[#002B7F] px-5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">ลองอีกครั้ง</button>
            </div>
          ) : (
            <button onClick={() => setIsZoomed(true)} aria-label="ขยายการ์ดเพื่ออ่านข้อความ" className="flex h-full w-full items-center justify-center rounded-2xl transition-transform active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              <img src={cardDataUrl} alt={`Future Nurse Card — ${result.path.nameEn}`} className="h-full w-full object-contain drop-shadow-[0_16px_36px_rgba(0,43,127,0.22)] select-none" draggable={false} />
            </button>
          )}
        </div>
        <button onClick={() => setIsZoomed(true)} disabled={!cardDataUrl || generating} className="flex min-h-10 shrink-0 items-center justify-center gap-2 text-sm font-semibold text-[#002B7F] hover:text-[#001f5c] disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 transition-colors">
          <Maximize2 aria-hidden="true" className="h-4 w-4" />ขยายเพื่ออ่านข้อความ
        </button>
        <div className="flex shrink-0 gap-3">
          {onBack && (
            <button onClick={onBack} className="flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-4 font-bold text-[#002B7F] shadow-sm active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />ย้อนกลับ
            </button>
          )}
          <button onClick={onNext} disabled={generating || !cardDataUrl} className="flex min-h-12 flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] hover:brightness-105 active:scale-95 px-5 font-bold text-white shadow-lg shadow-rose-400/30 disabled:opacity-40 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
            <span>บันทึกและแชร์</span>
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        onClick={(e) => { if (e.target === dialog.current) setIsZoomed(false); }}
        onCancel={() => setIsZoomed(false)}
        onClose={() => setIsZoomed(false)}
        aria-label="ภาพการ์ดขยาย"
        className="fixed inset-0 m-auto h-[96dvh] max-h-none w-[96vw] max-w-none overflow-auto rounded-2xl bg-[#0b1329]/90 p-4 text-white backdrop:bg-black/80 backdrop-blur-sm"
      >
        <div className="sticky top-0 z-10 flex justify-end pb-2">
          <button onClick={() => setIsZoomed(false)} aria-label="ปิดภาพขยาย" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-90 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        {cardDataUrl && (
          <div className="flex items-center justify-center min-h-[calc(100%-48px)]">
            <img
              src={cardDataUrl}
              alt={`การ์ดขยาย — ${result.path.nameEn}`}
              className="max-h-[86vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
              onClick={() => setIsZoomed(false)}
            />
          </div>
        )}
      </dialog>
    </div>
  );
};

export default CardPreviewView;
