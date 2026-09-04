import React from 'react';
import {
  Sparkles, ShieldCheck, Zap, HeartHandshake, Ear, Eye, Users,
  Lightbulb, MessageSquareQuote, ListOrdered, Search, Cpu, Globe
} from 'lucide-react';
import { Question } from '../types';
import { AssetImage } from '../components/AssetImage';
import { getQuestionCharacterUrl } from '../assets/registry';

interface QuizViewProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  selectedOption?: string;
  onSelectOption: (optionKey: string) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  ShieldCheck, Zap, HeartHandshake, Ear, Eye, Users, Lightbulb,
  MessageSquareQuote, ListOrdered, Search, Cpu, Globe, Sparkles,
  FileSearch: Search,
};

export const QuizView: React.FC<QuizViewProps> = ({
  question,
  currentStep,
  totalSteps,
  selectedOption,
  onSelectOption,
}) => {
  // Question character: per-question presenter illustration.
  // NOT tied to Future Look / characterType — independent system.
  const characterSrc = getQuestionCharacterUrl(question.step as 1 | 2 | 3 | 4 | 5);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-2xl mx-auto w-full animate-fade-in">

      {/* ── Question header ──────────────────────────────────────────────── */}
      {/* shrink-0: never compressed by flex children below */}
      <div className="text-center pt-1 pb-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mahidol-gold/15 border border-mahidol-gold/30 text-xs font-semibold text-mahidol-gold mb-2 font-heading">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ข้อที่ {currentStep} จาก {totalSteps} • {question.categoryTh}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug mb-1 font-heading">
          {question.prompt}
        </h2>
        {question.subtitle && (
          <p className="text-xs sm:text-sm text-slate-300">{question.subtitle}</p>
        )}
      </div>

      {/* ── Question Character Illustration ──────────────────────────────── */}
      {/*
        SLOT: QUESTION_CHARACTER (Q1–Q5)
        Source: ASSETS.questions.q{n} via getQuestionCharacterUrl()
        Layout strategy:
          - flex-1 min-h-0: fills ALL remaining height between header and answer grid
          - On iPad mini landscape (~80px available): image shrinks naturally
          - On iPad Pro landscape (~300px available): image grows naturally
          - object-contain object-bottom: preserves aspect ratio, anchors to baseline
          - NOT tied to Future Look / characterType selection
        To replace: update ASSETS.questions.q{n} in registry.ts — no component change needed
      */}
      <div
        data-slot="question-character"
        data-question={`q${question.step}`}
        className="flex-1 min-h-[72px] flex justify-center items-end pb-1"
      >
        <AssetImage
          src={characterSrc}
          alt={`Q${question.step} Character`}
          className="max-h-full w-auto object-contain object-bottom"
          placeholderClassName="w-36 sm:w-44 h-full"
        />
      </div>

      {/* ── 2×3 Touch Grid (6 options) ──────────────────────────────────── */}
      {/* shrink-0: grid never compressed — answer buttons stay touch-friendly */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-2 shrink-0">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const IconComponent = opt.icon ? (iconMap[opt.icon] || Sparkles) : Sparkles;

          return (
            <button
              key={opt.key}
              onClick={() => onSelectOption(opt.key)}
              className={`group relative p-3 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-200 active:scale-[0.96] select-none min-h-[100px] sm:min-h-[118px] ${
                isSelected
                  ? 'bg-gradient-to-br from-mahidol-blue to-blue-700 border-mahidol-gold shadow-lg shadow-blue-900/60 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/15 border-white/10 hover:border-white/25 shadow-md'
              }`}
            >
              {/* Key badge + icon */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs font-heading transition-colors ${
                  isSelected
                    ? 'bg-mahidol-gold text-slate-950 shadow-sm'
                    : 'bg-white/10 text-white group-hover:bg-white/20'
                }`}>
                  {opt.key}
                </div>
                <IconComponent className={`w-5 h-5 ${isSelected ? 'text-mahidol-gold' : 'text-sky-300/80'}`} />
              </div>

              {/* Option title */}
              <p className={`text-sm font-semibold leading-snug font-heading transition-colors ${
                isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'
              }`}>
                {opt.title}
              </p>

              {/* Selected indicator dot */}
              <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full transition-all ${
                isSelected ? 'bg-mahidol-gold' : 'opacity-0'
              }`} />
            </button>
          );
        })}
      </div>

      {/* ── Progress indicator ───────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 pt-3 pb-1 shrink-0">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i + 1 < currentStep
                ? 'w-4 h-2 bg-mahidol-gold/70'
                : i + 1 === currentStep
                  ? 'w-6 h-2 bg-mahidol-gold'
                  : 'w-2 h-2 bg-white/20'
            }`}
          />
        ))}
        <span className="text-[11px] text-slate-400 ml-1">แตะตัวเลือกเพื่อไปต่อ</span>
      </div>
    </div>
  );
};
