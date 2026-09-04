import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

import { CharacterType } from '../types';
import { getProcessingArtworkUrl, isPlaceholder } from '../assets/registry';
import { AssetImage } from '../components/AssetImage';

interface AnalysisViewProps {
  onComplete: () => void;
  characterType?: CharacterType;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onComplete, characterType = 'female_student' }) => {
  const isFemale = characterType === 'female_student';
  const processingArtwork = getProcessingArtworkUrl(characterType);
  const hasCustomArtwork = !isPlaceholder(processingArtwork);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    // Step 1 check at 700ms
    const t1 = setTimeout(() => {
      setStep1Done(true);
    }, 700);

    // Step 2 check at 1400ms
    const t2 = setTimeout(() => {
      setStep2Done(true);
    }, 1400);

    // Step 3 check at 2100ms
    const t3 = setTimeout(() => {
      setStep3Done(true);
      setCountdown(3);
    }, 2100);

    // Countdown 3 -> 2 -> 1
    const t4 = setTimeout(() => setCountdown(2), 2600);
    const t5 = setTimeout(() => setCountdown(1), 3100);

    // Complete at 3600ms
    const t6 = setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#002B7F', '#F5A623', '#00A3FF', '#10B981', '#FF6584']
        });
      } catch (_e) {}
      onComplete();
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full text-center animate-fade-in">
      {/* Processing Look Indicator (Visual difference only: Female vs Male) */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide shadow-sm transition-all animate-fade-in"
        style={{
          borderColor: isFemale ? 'rgba(244, 114, 182, 0.4)' : 'rgba(56, 189, 248, 0.4)',
          backgroundColor: isFemale ? 'rgba(244, 114, 182, 0.1)' : 'rgba(56, 189, 248, 0.1)',
          color: isFemale ? '#F472B6' : '#38BDF8',
        }}
      >
        <span>{isFemale ? '👩‍⚕️' : '👨‍⚕️'}</span>
        <span>{isFemale ? 'Processing — Female Look' : 'Processing — Male Look'}</span>
      </div>

      {/* Central Processing Visual (Look-based Artwork or Animated AI Orb) */}
      <div className="relative mb-6 flex items-center justify-center">
        {hasCustomArtwork ? (
          <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl p-1 bg-white/5">
            <AssetImage
              src={processingArtwork}
              alt={`Processing ${isFemale ? 'Female' : 'Male'}`}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div
            className={`w-32 h-32 rounded-full p-1 animate-spin shadow-2xl ${
              isFemale
                ? 'bg-gradient-to-tr from-pink-600 via-rose-400 to-amber-300 shadow-pink-500/30'
                : 'bg-gradient-to-tr from-mahidol-blue via-sky-500 to-mahidol-gold shadow-sky-500/30'
            }`}
          >
            <div className="w-full h-full rounded-full bg-mahidol-deep flex items-center justify-center">
              {countdown !== null ? (
                <span className="text-4xl font-black text-mahidol-gold font-heading animate-scale-up">
                  {countdown}
                </span>
              ) : (
                <Cpu className={`w-12 h-12 animate-pulse ${isFemale ? 'text-pink-400' : 'text-sky-400'}`} />
              )}
            </div>
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-mahidol-gold text-slate-950 flex items-center justify-center shadow-lg font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Main Title & Locked 5-question text */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 font-heading">
        {countdown !== null ? 'เจอแล้ว!' : 'กำลังวิเคราะห์ผลลัพธ์...'}
      </h2>
      <p className="text-sm text-slate-300 mb-2">
        จากคำตอบทั้ง 5 ข้อของคุณ
      </p>
      <p className="text-xs text-slate-400 mb-6">
        {countdown !== null ? 'เตรียมพบกับ Future Nurse ในแบบของคุณ' : 'ระบบกำลังค้นหาเส้นทางพยาบาลและพลังพิเศษที่ใช่ที่สุด'}
      </p>

      {/* 3 Step Progress Cards */}
      <div className="w-full space-y-3 text-left">
        {/* Step 1 */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            step1Done
              ? 'bg-blue-950/50 border-blue-500/40 text-blue-100'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <span className="text-sm font-medium">กำลังค้นหาสิ่งที่คุณให้ความสำคัญ...</span>
          {step1Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-scale-up" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
          )}
        </div>

        {/* Step 2 */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            step2Done
              ? 'bg-blue-950/50 border-blue-500/40 text-blue-100'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <span className="text-sm font-medium">กำลังค้นหา Nursing Superpower...</span>
          {step2Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-scale-up" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
          )}
        </div>

        {/* Step 3 */}
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            step3Done
              ? 'bg-blue-950/50 border-blue-500/40 text-blue-100'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <span className="text-sm font-medium">กำลังจับคู่ Future Nursing Path...</span>
          {step3Done ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-scale-up" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};
