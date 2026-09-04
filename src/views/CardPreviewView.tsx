import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ResultPayload } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';

interface CardPreviewViewProps {
  result: ResultPayload;
  /** Called when the generated card data URL is ready (App stores it for SaveShareView). */
  onCardReady: (cardDataUrl: string) => void;
  onNext: () => void;
}

/**
 * CardPreviewView — Full-view display of the generated Future Nurse Card
 *
 * Responsibilities:
 *   1. Generate the Future Nurse Card (1080×1920 canvas → PNG data URL)
 *   2. Display it as a full-view preview
 *   3. Notify App.tsx when the card is ready (via onCardReady)
 *   4. "บันทึกและแชร์" → navigates to SaveShareView
 *
 * This screen shows the ACTUAL CARD (all elements: path, character, superpower,
 * AI skill, impact, branding, footer) — not a simplified reveal moment.
 *
 * Layout note:
 *   Structural placeholder until final mockup arrives.
 *   data-slot attributes mark each region for easy visual-layer replacement.
 *
 * The card generation logic lives entirely in cardRenderer.ts — not here.
 */
export const CardPreviewView: React.FC<CardPreviewViewProps> = ({
  result,
  onCardReady,
  onNext,
}) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(true);

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
    return () => { mounted = false; };
  }, [result, onCardReady]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 max-w-2xl mx-auto w-full animate-fade-in"
      data-slot="card-preview-root"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div data-slot="card-preview-header" className="text-center pt-1 pb-3 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mahidol-gold/20 border border-mahidol-gold/40 text-xs font-bold text-mahidol-gold mb-1.5 font-heading">
          <Sparkles className="w-3.5 h-3.5" />
          <span>YOUR FUTURE NURSE CARD</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
          {result.path.emoji} {result.path.nameEn}
        </h2>
        <p className="text-sm text-slate-400">{result.path.nameTh}</p>
      </div>

      {/* ── Card display slot ──────────────────────────────────────────────── */}
      {/*
        SLOT: CARD_PREVIEW
        Displays the generated 1080×1920 card image.
        The aspect ratio (9/16) and max-width are intentional — do not change
        without updating the card renderer dimensions.
      */}
      <div
        data-slot="card-preview-image"
        className="relative w-full max-w-[240px] sm:max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[9/16] bg-slate-900 flex items-center justify-center flex-1 my-3"
      >
        {generating ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-mahidol-gold border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400">กำลังสร้างการ์ด...</p>
          </div>
        ) : cardDataUrl ? (
          <img
            src={cardDataUrl}
            alt="Future Nurse Card"
            className="w-full h-full object-cover animate-fade-in"
            draggable={false}
          />
        ) : (
          <p className="text-xs text-slate-500 text-center px-4">
            ไม่สามารถสร้างการ์ดได้<br />กรุณาลองใหม่
          </p>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div data-slot="card-preview-cta" className="w-full max-w-sm mx-auto pb-2">
        <button
          onClick={onNext}
          disabled={generating}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 transition-all group disabled:opacity-50 disabled:cursor-wait"
        >
          <span>บันทึกและแชร์</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
