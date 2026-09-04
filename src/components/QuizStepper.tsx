import React from 'react';
import { Check } from 'lucide-react';

interface QuizStepperProps {
  currentQuestion?: number; // 1 to 5 (legacy)
  activeStep?: number;      // 1 to 8 (generic)
  totalQuestions?: number;  // default 5
  className?: string;
}

/**
 * QuizStepper — Responsive 8-Step Stepper & Progress Bar
 * Matches the exact design of the Open House quiz mockup:
 * - Step 1: WELCOME
 * - Step 2..6: QUESTION 1 to 5
 * - Step 7: CHOOSE LOOK
 * - Step 8: ANALYZING
 * - Connecting lines
 * - Check badges on completed steps
 * - Active glowing pink badge
 */
export const QuizStepper: React.FC<QuizStepperProps> = ({
  currentQuestion,
  activeStep,
  totalQuestions: _totalQuestions = 5,
  className = '',
}) => {
  const steps = [
    { num: 1, label: 'WELCOME', sub: 'START' },
    { num: 2, label: 'QUESTION 1', sub: 'Q1' },
    { num: 3, label: 'QUESTION 2', sub: 'Q2' },
    { num: 4, label: 'QUESTION 3', sub: 'Q3' },
    { num: 5, label: 'QUESTION 4', sub: 'Q4' },
    { num: 6, label: 'QUESTION 5', sub: 'Q5' },
    { num: 7, label: 'CHOOSE LOOK', sub: 'LOOK' },
    { num: 8, label: 'ANALYZING', sub: 'ANALYZE' },
  ];

  // Determine current active step number (1 to 8)
  const activeStepNum = activeStep ?? ((currentQuestion ?? 1) + 1);

  return (
    <div className={`w-full flex items-center justify-center px-1 sm:px-4 py-2 select-none ${className}`}>
      <div className="flex items-center justify-between w-full max-w-2xl">
        {steps.map((step, idx) => {
          const isActive = step.num === activeStepNum;
          const isCompleted = step.num < activeStepNum;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.num}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center shrink-0 relative">
                <div className="relative">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_18px_rgba(255,51,102,0.65)] scale-110 sm:scale-115 ring-4 ring-rose-200/70'
                        : isCompleted
                        ? 'bg-[#1D63D8] text-white shadow-sm'
                        : 'bg-slate-200 text-slate-500 border border-slate-300'
                    }`}
                  >
                    {step.num}
                  </div>

                  {/* Checkmark badge on completed steps */}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sky-400 border border-white flex items-center justify-center text-white shadow-xs">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={`mt-1.5 text-[8px] sm:text-[9.5px] md:text-[10.5px] font-bold tracking-tight transition-colors whitespace-nowrap text-center ${
                    isActive
                      ? 'text-[#FF3366] font-extrabold drop-shadow-xs'
                      : isCompleted
                      ? 'text-[#002B7F]'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.sub}</span>
                </span>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mx-0.5 sm:mx-1 flex items-center justify-center min-w-[8px] sm:min-w-[16px] -mt-4">
                  <div
                    className={`w-full border-t-2 transition-colors ${
                      step.num < activeStepNum
                        ? 'border-[#1D63D8]'
                        : 'border-slate-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
