import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ResultPayload, StrengthFamily } from '../types';
import { AssetImage } from '../components/AssetImage';
import { getRevealArtworkUrl } from '../assets/registry';

interface RevealViewProps {
  result: ResultPayload;
  onNext: () => void;
}

const FAMILY_LABELS: Record<StrengthFamily, string> = {
  HUMAN_CONNECTION:     'Human Connection',
  CLINICAL_AWARENESS:   'Clinical Awareness',
  FUTURE_COLLABORATION: 'Future Collaboration',
};

const FAMILY_EMOJI: Record<StrengthFamily, string> = {
  HUMAN_CONNECTION:     '❤️',
  CLINICAL_AWARENESS:   '👀',
  FUTURE_COLLABORATION: '💡',
};

/**
 * RevealView — "ช่วงเฉลยผล"
 *
 * This screen creates the reveal moment before the user sees the full card.
 * It is intentionally kept as a structural skeleton until the final mockup arrives.
 *
 * Content slots (populated from result data — no manual copy):
 *   ■ [REVEAL_ARTWORK]   — reveal artwork per nursing path (ASSETS.reveal[pathId])
 *   ■ [PATH_EMOJI]       — nursing path emoji
 *   ■ [PATH_NAME_EN]     — nursing path English name
 *   ■ [PATH_NAME_TH]     — nursing path Thai name
 *   ■ [STRENGTH_FAMILY]  — strength family label
 *   ■ [SUPERPOWER]       — superpower string
 *   ■ [NEXT_BUTTON]      — navigates to Card Preview
 *
 * Layout note:
 *   The structure uses named slot containers so that when the final mockup
 *   arrives, only className / visual-layer props need to change — not the
 *   data connections or navigation logic.
 *
 * Animation note:
 *   The outer wrapper has data-slot="reveal-root" and data-animate="ready"
 *   so future entrance animations can target it without touching JSX.
 */
export const RevealView: React.FC<RevealViewProps> = ({ result, onNext }) => {
  // 16 Reveal character variants (8 Nursing Paths × 2 Looks)
  const revealArtworkUrl = getRevealArtworkUrl(result.pathId, result.characterType);
  const isFemale = result.characterType === 'female_student';

  return (
    <div
      className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 max-w-xl mx-auto w-full animate-fade-in overflow-y-auto"
      data-slot="reveal-root"
      data-animate="ready"
    >
      {/* ── Fixed: Header & Branding & 5-question indicator ─────────────────── */}
      <div data-slot="reveal-header" className="text-center pt-1 w-full shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mahidol-gold/20 border border-mahidol-gold/40 text-xs font-bold text-mahidol-gold mb-1 font-heading">
          <Sparkles className="w-3.5 h-3.5" />
          <span>YOUR FUTURE NURSING PATH</span>
        </div>
        <p className="text-xs text-slate-400">
          จากคำตอบทั้ง 5 ข้อของคุณ • {isFemale ? 'Female Look 👩‍⚕️' : 'Male Look 👨‍⚕️'}
        </p>
      </div>

      {/* ── Dynamic: Path Identity ────────────────────────────────────────── */}
      <div data-slot="reveal-path-identity" className="text-center my-2 space-y-0.5 shrink-0">
        <div className="text-4xl sm:text-5xl" data-slot="path-emoji">{result.path.emoji}</div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-tight"
          data-slot="path-name-en"
        >
          {result.path.nameEn}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-medium" data-slot="path-name-th">
          {result.path.nameTh}
        </p>
      </div>

      {/* ── Dynamic: Reveal Character Artwork (1 of 16 variants) ───────────── */}
      {/*
        SLOT: REVEAL_ARTWORK
        Source: ASSETS.reveal[pathId][gender] via getRevealArtworkUrl()
        Consistent in concept with Card character (same path + look + mood),
        tailored for the reveal presentation moment.
      */}
      <div
        data-slot="reveal-artwork"
        className="relative w-full max-w-[220px] sm:max-w-[260px] mx-auto aspect-square flex items-center justify-center my-2 shrink-0"
      >
        <AssetImage
          src={revealArtworkUrl}
          alt={`Reveal artwork for ${result.path.nameEn} (${isFemale ? 'Female' : 'Male'})`}
          className="w-full h-full object-contain"
          placeholderClassName="w-full aspect-square max-w-[220px] sm:max-w-[260px]"
        />
      </div>

      {/* ── Dynamic: Result Content Badges (Superpower, AI Skill, Impact) ── */}
      <div data-slot="reveal-dynamic-content" className="w-full space-y-2 mb-4">
        {/* Your Superpower */}
        <div
          data-slot="reveal-superpower"
          className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-left"
        >
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
              {FAMILY_EMOJI[result.strengthFamily]} YOUR SUPERPOWER
            </span>
            <span className="text-sm font-bold text-white block truncate" data-slot="superpower-value">
              {result.superpower}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 shrink-0 font-medium">
            {FAMILY_LABELS[result.strengthFamily]}
          </span>
        </div>

        {/* Your AI Skill */}
        <div
          data-slot="reveal-ai-skill"
          className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3 text-left"
        >
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-300 block">
              ⚡ YOUR AI SKILL
            </span>
            <span className="text-sm font-bold text-white block truncate" data-slot="ai-skill-value">
              {result.aiSkill}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-200 shrink-0 font-medium">
            AI Collaboration
          </span>
        </div>

        {/* Your Impact */}
        <div
          data-slot="reveal-impact"
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-left"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            🌟 YOUR IMPACT
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed" data-slot="impact-value">
            {result.profileImpact}
          </p>
        </div>
      </div>

      {/* ── Fixed: Next Button (CTA leads to Card Preview) ───────────────────── */}
      <div data-slot="reveal-cta" className="w-full max-w-sm mx-auto pb-1 shrink-0">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 transition-all group"
        >
          <span>ดู Future Nurse Card ของฉัน</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
