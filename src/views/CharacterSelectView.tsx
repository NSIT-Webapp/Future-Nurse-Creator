import React from 'react';
import { ArrowRight, UserCheck } from 'lucide-react';
import { CharacterType } from '../types';

interface CharacterSelectViewProps {
  onSelect: (characterType: CharacterType) => void;
}

export const CharacterSelectView: React.FC<CharacterSelectViewProps> = ({ onSelect }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 max-w-lg mx-auto w-full animate-fade-in text-center">
      {/* Title */}
      <div className="pt-2">
        <span className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-3">
          CHOOSE FUTURE LOOK
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-heading">
          เลือก Future Look ของคุณ
        </h2>
        <p className="text-base text-slate-300 max-w-xs mx-auto">
          เลือกสไตล์ตัวละครเพื่อสร้างการ์ด Future Nurse
        </p>
      </div>

      {/* 2 Big Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {/* Female Student Card */}
        <button
          onClick={() => onSelect('female_student')}
          className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border-2 border-white/15 hover:border-pink-400 active:scale-95 transition-all text-left flex flex-col items-center justify-between shadow-xl"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/30 border-2 border-pink-400/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
            👩‍⚕️
          </div>

          <div className="text-center w-full">
            <h3 className="text-lg font-bold text-white mb-1 font-heading group-hover:text-pink-300 transition-colors">
              Female Look
            </h3>
            <p className="text-xs text-slate-400 mb-3">นักศึกษาพยาบาลหญิง (Female Student)</p>
            <div className="py-1 px-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-200">
              ชุดพิธีการพยาบาลสีขาว / หมวกพยาบาล
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-pink-400 group-hover:translate-x-1 transition-transform">
            <span>เลือก Female Look</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Male Student Card */}
        <button
          onClick={() => onSelect('male_student')}
          className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border-2 border-white/15 hover:border-sky-400 active:scale-95 transition-all text-left flex flex-col items-center justify-between shadow-xl"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/30 border-2 border-sky-400/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
            👨‍⚕️
          </div>

          <div className="text-center w-full">
            <h3 className="text-lg font-bold text-white mb-1 font-heading group-hover:text-sky-300 transition-colors">
              Male Look
            </h3>
            <p className="text-xs text-slate-400 mb-3">นักศึกษาพยาบาลชาย (Male Student)</p>
            <div className="py-1 px-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-200">
              ชุดเครื่องแบบพยาบาลมหิดล / กางเกงสีกรม
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
            <span>เลือก Male Look</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Note */}
      <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 flex items-center gap-2.5 justify-center">
        <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
        <span>ตัวเลือกนี้ไม่มีผลต่อคะแนนเส้นทางพยาบาล (ใช้สำหรับภาพประกอบการ์ด)</span>
      </div>
    </div>
  );
};
