import React from 'react';
import {
  ClipboardList,
  HeartHandshake,
  Search,
  Users,
  Lightbulb,
  MessageCircle,
  ChevronLeft,
} from 'lucide-react';
import { Question } from '../types';
import { ASSETS, getQuestionCharacterUrl } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';
import { QuizStepper } from '../components/QuizStepper';
import { playSelectSfx, playNextSfx, playBackSfx } from '../engine/audioManager';

interface QuizViewProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  selectedOption?: string;
  onSelectOption: (optionKey: string) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Option config mapping for colors, badges, and icons matching the Open House mockup
const OPTION_THEMES: Record<
  string,
  {
    bgIcon: string;
    textLetter: string;
    borderActive: string;
    ringActive: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  A: {
    bgIcon: 'bg-[#FF4E72]',
    textLetter: 'text-[#FF4E72]',
    borderActive: 'border-[#FF4E72]',
    ringActive: 'ring-rose-200',
    Icon: ClipboardList,
  },
  B: {
    bgIcon: 'bg-[#F59E0B]',
    textLetter: 'text-[#F59E0B]',
    borderActive: 'border-[#F59E0B]',
    ringActive: 'ring-amber-200',
    Icon: HeartHandshake,
  },
  C: {
    bgIcon: 'bg-[#10B981]',
    textLetter: 'text-[#10B981]',
    borderActive: 'border-[#10B981]',
    ringActive: 'ring-emerald-200',
    Icon: Search,
  },
  D: {
    bgIcon: 'bg-[#0284C7]',
    textLetter: 'text-[#0284C7]',
    borderActive: 'border-[#0284C7]',
    ringActive: 'ring-sky-200',
    Icon: Users,
  },
  E: {
    bgIcon: 'bg-[#8B5CF6]',
    textLetter: 'text-[#8B5CF6]',
    borderActive: 'border-[#8B5CF6]',
    ringActive: 'ring-purple-200',
    Icon: Lightbulb,
  },
  F: {
    bgIcon: 'bg-[#06B6D4]',
    textLetter: 'text-[#06B6D4]',
    borderActive: 'border-[#06B6D4]',
    ringActive: 'ring-cyan-200',
    Icon: MessageCircle,
  },
};

const ALL_QUESTION_STEPS = [1, 2, 3, 4, 5] as const;

export const QuizView: React.FC<QuizViewProps> = ({
  question,
  currentStep,
  totalSteps,
  selectedOption,
  onSelectOption,
  onNext,
  onBack,
}) => {
  const canProceed = Boolean(selectedOption);

  // Preload all 5 character images immediately upon QuizView mounting
  React.useEffect(() => {
    ALL_QUESTION_STEPS.forEach((step) => {
      const img = new Image();
      img.src = getQuestionCharacterUrl(step);
    });
  }, []);

  const handleSelectOption = (key: string) => {
    playSelectSfx(key);
    onSelectOption(key);
  };

  const handleBack = () => {
    playBackSfx();
    onBack?.();
  };

  const handleNext = () => {
    if (canProceed) {
      playNextSfx();
      onNext?.();
    }
  };

  return (
    <div
      className="relative w-full h-full min-h-full flex flex-col justify-between select-none overflow-y-auto overflow-x-hidden animate-fade-in pb-4"
      data-slot="quiz-root"
    >
      {/* ── 1. Sky Background Artwork Layer ─────────────────────────────── */}
      <img
        src="/assets/home/sky-bg.png"
        alt="Sky Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* ── 2. Top Header Bar (Faculty Logo + Sound Control) ─────────────── */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 pt-3 sm:pt-4 shrink-0">
        {/* Official Faculty of Nursing Mahidol University Logo */}
        <div className="flex items-center shrink-0 select-none">
          <img
            src={ASSETS.home.facultyLogo}
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Sound Control Toggle */}
        <SoundControl trackUrl={ASSETS.home.bgmTrack} size="lg" />
      </div>

      {/* ── 3. Stepper & Progress Bar ──────────────────────────────────────── */}
      <div className="relative z-30 shrink-0 mt-1 sm:mt-2">
        <QuizStepper currentQuestion={currentStep} totalQuestions={totalSteps} />
      </div>

      {/* ── 4. Main Question Card Container ─────────────────────────────────── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-3 sm:px-5 md:px-6 pt-2 pb-6 max-w-3xl mx-auto w-full">
        <div className="relative w-full">

          {/* Unified Question Card (Slightly faint/translucent frosted glass bg-white/80) */}
          <div className="relative z-10 w-full rounded-[28px] sm:rounded-[32px] bg-white/80 backdrop-blur-lg shadow-[0_14px_40px_rgba(0,43,127,0.12)] border border-white/60 p-4 sm:p-6 md:p-7 flex flex-col justify-between min-h-[490px]">

            {/* Nurse Mascot: In front of white card (z-20), peeking behind Row A (z-30) */}
            {/* Stacked pre-rendered images guarantee 0ms instant transition without delay or pop-in */}
            <div className="absolute top-3 sm:top-2 md:top-1 right-4 sm:right-5 md:right-6 w-[7.5rem] sm:w-[9.5rem] md:w-44 aspect-[3/4] pointer-events-none z-20 drop-shadow-[0_12px_28px_rgba(0,43,127,0.22)] select-none overflow-visible">
              <div className="relative w-full h-full animate-float-subtle flex items-start justify-center">
                {ALL_QUESTION_STEPS.map((step) => {
                  const isCurrent = step === currentStep;
                  return (
                    <img
                      key={step}
                      src={getQuestionCharacterUrl(step)}
                      alt={`Nurse Character Step ${step}`}
                      loading="eager"
                      decoding="sync"
                      className={`absolute inset-x-0 top-0 w-full h-full object-contain object-top transition-opacity duration-150 ease-out will-change-[opacity] ${
                        isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                      draggable={false}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── Header Inside Card: Step Badge & Big Prompt (pr reserved for mascot) ── */}
            <div className="relative z-20 pr-28 sm:pr-36 md:pr-44 mb-2.5 sm:mb-3.5">
              {/* Step Progress Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF4E72] to-[#FF3366] text-white text-[16px] sm:text-[17px] font-semibold tracking-wide shadow-sm mb-2">
                คำถาม {currentStep} จาก {totalSteps}
              </div>

              {/* Main Question Prompt (30-34px Bold, max 2-3 lines) */}
              <h2 className="question-text text-[26px] sm:text-[30px] md:text-[34px] font-bold text-[#002B7F] leading-[1.38] drop-shadow-xs">
                {question.prompt}
              </h2>

              {/* Supporting Text Callout */}
              <p className="text-[17px] sm:text-[18px] font-semibold text-[#FF3366] mt-2 flex items-center gap-1.5 leading-[1.45]">
                <span>💖</span> เลือกคำตอบที่ใกล้กับตัวคุณที่สุด
              </p>
            </div>

            {/* ── Choices List (Clean, No A-F letters, Height >= 76px, Text 21-24px) ── */}
            <div className="relative z-30 flex flex-col gap-2.5 sm:gap-3 my-1">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const theme = OPTION_THEMES[opt.key] || OPTION_THEMES.A;
                const IconComp = theme.Icon;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(opt.key)}
                    className={`answer-btn group relative w-full min-h-[76px] sm:min-h-[78px] md:min-h-[80px] flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 active:scale-[0.99] text-left cursor-pointer select-none ${
                      isSelected
                        ? `bg-rose-50/90 ${theme.borderActive} border-2 shadow-md ring-2 ${theme.ringActive}`
                        : 'bg-white hover:bg-slate-50/90 border-slate-200/90 shadow-xs hover:border-sky-300'
                    }`}
                  >
                    {/* Left: Icon Bubble + Option Text (No A-F letter badges) */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                      {/* Icon Bubble */}
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${theme.bgIcon}`}
                      >
                        <IconComp className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
                      </div>

                      {/* Option Text (21-24px, SemiBold 600, Line-height 1.4-1.5) */}
                      <span className="text-[19px] sm:text-[21px] md:text-[23px] font-semibold text-slate-800 leading-[1.42]">
                        {opt.title}
                      </span>
                    </div>

                    {/* Right: Radio Selection Circle */}
                    <div className="shrink-0 ml-2">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#FF3366] bg-[#FF3366] shadow-xs'
                            : 'border-slate-300 bg-white group-hover:border-sky-400'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white animate-scale-in" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Bottom Navigation Inside Card: Back / Next (Friendly Journey Microcopy) ── */}
            <div className="relative z-30 flex items-center justify-between pt-3.5 sm:pt-4 mt-auto border-t border-slate-100/80">
              {/* Back Button (18-20px SemiBold) */}
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full border-2 border-[#002B7F] text-[#002B7F] bg-white hover:bg-sky-50 active:scale-95 font-semibold text-[17px] sm:text-[19px] transition-all shadow-xs"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                <span>ย้อนกลับ</span>
              </button>

              {/* Next Button (22-24px Bold) */}
              <button
                type="button"
                disabled={!canProceed}
                onClick={handleNext}
                className={`inline-flex items-center gap-2 px-7 sm:px-9 py-2.5 sm:py-3 rounded-full font-bold text-[19px] sm:text-[22px] transition-all duration-150 shadow-md ${
                  canProceed
                    ? 'bg-gradient-to-r from-[#FF4E72] via-[#FF3366] to-[#783BE8] hover:from-[#ff5b7d] hover:to-[#8449f0] active:scale-95 text-white shadow-[0_4px_15px_rgba(255,51,102,0.4)] cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300/60'
                }`}
              >
                <span>{currentStep === totalSteps ? '✨ ดู Future Nurse ของฉัน' : 'ต่อไป →'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
