import React, { useEffect } from 'react';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';

interface ThankYouResetViewProps {
  onReset: () => void;
}

/**
 * ThankYouResetView — Thank You & Reset Screen
 *
 * Final step in kiosk visitor flow:
 * Save & Share → Thank You & Reset → Home
 *
 * Displays a warm thank-you message and triggers complete session wipe
 * before navigating back to Home.
 *
 * Auto-returns to Home after 15 seconds if left unattended.
 */
export const ThankYouResetView: React.FC<ThankYouResetViewProps> = ({ onReset }) => {
  // Auto-reset after 15 seconds of displaying thank-you screen
  useEffect(() => {
    const timer = setTimeout(() => {
      onReset();
    }, 15000);
    return () => clearTimeout(timer);
  }, [onReset]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-between p-6 max-w-lg mx-auto w-full text-center animate-fade-in"
      data-slot="thank-you-reset-root"
    >
      {/* ── Top badge ──────────────────────────────────────────────────────── */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-mahidol-gold/20 via-amber-500/10 to-mahidol-gold/20 border border-mahidol-gold/50 text-xs font-semibold text-mahidol-gold tracking-wide mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NSMU OPEN HOUSE 2026</span>
        </div>
      </div>

      {/* ── Central Thank You Card ─────────────────────────────────────────── */}
      <div className="my-auto py-6 flex flex-col items-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-mahidol-blue to-blue-600 border-2 border-mahidol-gold/50 flex items-center justify-center shadow-xl shadow-blue-900/40 text-mahidol-gold mb-2">
          <Heart className="w-10 h-10 fill-mahidol-gold/30 animate-pulse" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
          ขอบคุณที่ร่วมกิจกรรม!
        </h2>

        <p className="text-lg font-semibold bg-gradient-to-r from-sky-300 via-blue-200 to-mahidol-gold bg-clip-text text-transparent font-heading">
          Future Nurse Creator
        </p>

        <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
          หวังว่าคุณจะได้ค้นพบเส้นทางพยาบาลและพลังพิเศษในแบบของคุณ<br />
          แล้วพบกันที่ <span className="text-white font-medium">คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล</span>
        </p>
      </div>

      {/* ── Reset & Return to Home Button ──────────────────────────────────── */}
      <div className="w-full max-w-sm mx-auto pb-4">
        <button
          onClick={onReset}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all group"
        >
          <span>กลับสู่หน้าหลัก (สำหรับผู้เล่นคนถัดไป)</span>
          <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
        </button>
        <p className="text-[11px] text-slate-400 mt-2.5">
          ระบบจะรีเซ็ตและกลับสู่หน้าหลักอัตโนมัติใน 15 วินาที
        </p>
      </div>
    </div>
  );
};
