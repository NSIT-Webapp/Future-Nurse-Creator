import React from 'react';

interface QuizStepperProps {
  currentQuestion: number; // 1 to 5
  totalQuestions?: number; // default 5
  className?: string;
}

/**
 * QuizStepper — Responsive Stepper & Progress Bar
 * Matches the exact design of the Open House quiz mockup:
 * - Step 1: WELCOME
 * - Step 2..6: QUESTION 1 to 5
 * - Connecting dashed lines
 * - Active glowing pink badge
 * - Terminal heart icon
 */
export const QuizStepper: React.FC<QuizStepperProps> = ({
  currentQuestion,
  totalQuestions = 5,
  className = '',
}) => {
  // Steps: 1: WELCOME, 2..total+1: QUESTION 1..total
  const steps = [
    { num: 1, label: 'WELCOME', sub: 'WELCOME' },
    ...Array.from({ length: totalQuestions }, (_, i) => ({
      num: i + 2,
      label: `QUESTION ${i + 1}`,
      sub: `Q${i + 1}`,
    })),
  ];

  // Active step index in steps array:
  // When currentQuestion = 1, active step is step 2 (QUESTION 1)
  const activeStepNum = currentQuestion + 1;

  return (
    <div className={`w-full flex items-center justify-center px-2 sm:px-4 py-2 select-none ${className}`}>
      <div className="flex items-center justify-between w-full max-w-xl">
        {steps.map((step, idx) => {
          const isActive = step.num === activeStepNum;
          const isCompleted = step.num < activeStepNum;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.num}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm font-heading transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#FF3366] to-[#FF6584] text-white shadow-[0_0_16px_rgba(255,51,102,0.6)] scale-110 sm:scale-115 ring-4 ring-rose-200/60'
                      : isCompleted
                      ? 'bg-[#002B7F] text-white shadow-sm'
                      : 'bg-sky-100 text-sky-600 border border-sky-200'
                  }`}
                >
                  {step.num}
                </div>

                {/* Text Label */}
                <span
                  className={`mt-1 text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-tight transition-colors ${
                    isActive
                      ? 'text-[#FF3366] font-extrabold drop-shadow-xs'
                      : isCompleted
                      ? 'text-[#002B7F]'
                      : 'text-sky-400'
                  }`}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.sub}</span>
                </span>
              </div>

              {/* Connecting Dashed Line */}
              {!isLast && (
                <div className="flex-1 mx-1 sm:mx-1.5 flex items-center justify-center min-w-[12px] sm:min-w-[20px] -mt-4">
                  <div
                    className={`w-full border-t-2 border-dashed transition-colors ${
                      isCompleted ? 'border-[#002B7F]/60' : 'border-sky-300/80'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* Heart Deco at end */}
        <div className="ml-1 sm:ml-2 -mt-4 text-pink-400 text-sm sm:text-base animate-pulse shrink-0">
          💖
        </div>
      </div>
    </div>
  );
};
