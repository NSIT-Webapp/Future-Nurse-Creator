import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { SoundControl } from './SoundControl';

interface HeaderProps {
  currentStep?: number;
  totalSteps?: number;
  onReset?: () => void;
  showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  totalSteps = 5,
  onReset,
  showReset = false
}) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-mahidol-dark/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Official Faculty of Nursing Mahidol University Logo */}
        <div className="bg-white/95 rounded-xl px-2 py-1 shadow-sm flex items-center shrink-0">
          <img
            src="/assets/home/faculty-logo.png"
            alt="มหาวิทยาลัยมหิดล คณะพยาบาลศาสตร์"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide font-heading">
              FUTURE NURSE CREATOR
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-mahidol-gold/20 text-mahidol-gold border border-mahidol-gold/40">
              NSMU 2026
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <SoundControl className="!bg-white/10 !text-slate-200 !border-white/20 hover:!bg-white/20" />

        {currentStep && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-mahidol-gold animate-pulse" />
            <span>คำถามที่ {currentStep} / {totalSteps}</span>
          </div>
        )}

        {showReset && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-slate-400 hover:text-white border border-white/10 transition-all"
            title="เริ่มใหม่"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>
        )}
      </div>
    </header>
  );
};
