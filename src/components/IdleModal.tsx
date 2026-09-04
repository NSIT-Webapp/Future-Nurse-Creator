import React from 'react';
import { AlertCircle, Touchpad } from 'lucide-react';

interface IdleModalProps {
  isWarning: boolean;
  secondsRemaining: number;
  onContinue: () => void;
}

export const IdleModal: React.FC<IdleModalProps> = ({
  isWarning,
  secondsRemaining,
  onContinue
}) => {
  if (!isWarning) return null;

  return (
    <div
      onClick={onContinue}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-fade-in cursor-pointer select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-8 text-center rounded-3xl bg-gradient-to-b from-slate-900 via-mahidol-dark to-slate-950 border border-mahidol-gold/40 shadow-2xl shadow-mahidol-gold/20 animate-scale-up"
      >
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-mahidol-gold/20 border-2 border-mahidol-gold/60 flex items-center justify-center text-mahidol-gold animate-bounce">
          <AlertCircle className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-heading">
          ยังอยู่กับเราไหม?
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          หน้าจอจะรีเซ็ตกลับสู่หน้าเริ่มต้นอัตโนมัติใน
        </p>

        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mahidol-blue/50 border-4 border-mahidol-gold flex items-center justify-center shadow-inner">
          <span className="text-4xl font-black text-mahidol-gold font-heading">
            {secondsRemaining}
          </span>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-98 transition-all"
        >
          <Touchpad className="w-5 h-5" />
          <span>แตะหน้าจอเพื่อเล่นต่อ</span>
        </button>
      </div>
    </div>
  );
};
