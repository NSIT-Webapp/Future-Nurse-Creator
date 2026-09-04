import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

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
    <header className="relative z-20 flex items-center justify-between px-6 py-4 bg-mahidol-dark/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-3">
        {/* Mahidol Nursing Emblem / Badge */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mahidol-blue to-blue-600 border border-mahidol-gold/40 flex items-center justify-center shadow-md shadow-blue-900/50">
          <span className="text-sm font-black tracking-tighter text-mahidol-gold font-heading">
            NS
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-white tracking-wide font-heading">
              FUTURE NURSE CREATOR
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-mahidol-gold/20 text-mahidol-gold border border-mahidol-gold/40">
              NSMU 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
