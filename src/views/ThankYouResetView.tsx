import React, { useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Heart,
  Bot,
  Users,
  ChevronRight,
  Share2,
  Copy,
  Check,
  GraduationCap,
  ExternalLink,
  Clock,
  Camera,
} from 'lucide-react';
import { ResultPayload } from '../types';
import { ASSETS } from '../assets/registry';
import { SoundControl } from '../components/SoundControl';
import { isWebShareSupported, shareCardViaWebShare, buildShareCaption } from '../engine/shareManager';

interface ThankYouResetViewProps {
  result: ResultPayload | null;
  cardDataUrl?: string;
  onReset: () => void;
  onViewCardAgain?: () => void;
}

const HASHTAGS = [
  '#NSMUOPENHOUSE2026',
  '#NURSESOFTHELAND',
  '#NSMUTCAS70',
  '#MahidolNursing',
  '#คณะพยาบาลศาสตร์มหิดล',
];

const STEPS = [
  { id: 1, label: 'WELCOME' },
  { id: 2, label: 'FUTURE NURSE' },
  { id: 3, label: 'QUESTIONS' },
  { id: 4, label: 'ANALYZING' },
  { id: 5, label: 'MATCHING' },
  { id: 6, label: 'REVEAL' },
  { id: 7, label: 'SAVE & SHARE' },
  { id: 8, label: 'FINISH' },
];

/**
 * ThankYouResetView — Final Step 8 (FINISH)
 *
 * Designed for Kiosk Open House 2026:
 * - Focus on gratitude, celebration & inspiring future nursing students
 * - Celebratory confetti burst on entry
 * - Result summary & mascot illustration
 * - Official Faculty Admissions announcement (TCAS & Social Media)
 * - 60-second auto-reset countdown with progress bar & touch-to-extend
 * - No Save Image button (already handled in Step 7)
 * - No QR Code (focused purely on thank you & outro)
 */
export const ThankYouResetView: React.FC<ThankYouResetViewProps> = ({
  result,
  cardDataUrl,
  onReset,
  onViewCardAgain,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Confetti effect on mount ───────────────────────────────────────────────
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.25 },
        colors: ['#F5A623', '#00A3FF', '#38BDF8', '#FF69B4', '#10B981'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.4 },
          colors: ['#F5A623', '#00A3FF', '#FFFFFF'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.4 },
          colors: ['#F5A623', '#00A3FF', '#FFFFFF'],
        });
      }, 400);

      return () => clearTimeout(timer);
    } catch (_) {}
  }, []);

  // ── 60-second auto-reset timer ─────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onReset]);

  // Touch or click anywhere resets countdown to 60s
  const handleUserActivity = useCallback(() => {
    setTimeLeft(60);
  }, []);

  // ── Copy hashtags ──────────────────────────────────────────────────────────
  const handleCopyHashtags = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUserActivity();
    try {
      await navigator.clipboard.writeText(HASHTAGS.join(' '));
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } catch (_) {}
  };

  // ── Share handler ──────────────────────────────────────────────────────────
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUserActivity();
    if (result && cardDataUrl && isWebShareSupported()) {
      await shareCardViaWebShare(cardDataUrl, result);
    } else if (result) {
      try {
        await navigator.clipboard.writeText(buildShareCaption(result));
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (_) {}
    }
  };

  // Character illustration
  const characterSrc = result
    ? ASSETS.characters[result.pathId]?.[result.characterType === 'female_student' ? 'female' : 'male'] ||
      '/characters/PED_male.png'
    : '/characters/PED_male.png';

  const pathNameEn = result?.path.nameEn || 'Pediatric Nursing';
  const pathNameTh = result?.path.nameTh || 'พยาบาลเด็ก';
  const superpower = result?.superpower || 'Communication';
  const aiSkill = result?.aiSkill || 'Patient Education Creator';
  const impact =
    result?.profileImpact || 'คุณทำให้การดูแลเด็กอบอุ่น เข้าใจง่าย และรู้สึกปลอดภัย';

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 60) * 100));

  return (
    <div
      onClick={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="flex-1 flex flex-col h-full w-full bg-gradient-to-b from-[#EFF6FF] via-[#E2EEFC] to-[#D4E6FA] text-slate-800 overflow-y-auto overflow-x-hidden relative select-none"
      data-slot="thank-you-finish-root"
    >
      {/* ── Top Bar with Mahidol Logo & SoundControl ────────────────────────── */}
      <header className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 relative z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/90 rounded-xl p-1.5 shadow-sm border border-sky-100 flex items-center shrink-0">
            <img
              src="/assets/home/faculty-logo.png"
              alt="คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>
          <div className="hidden xs:block">
            <div className="text-xs sm:text-sm font-bold text-mahidol-blue font-heading leading-tight">
              มหาวิทยาลัยมหิดล
            </div>
            <div className="text-[10px] sm:text-xs text-slate-600 font-medium">
              คณะพยาบาลศาสตร์
            </div>
          </div>
        </div>

        <SoundControl
          className="!bg-white/90 !text-slate-700 !border-sky-200 hover:!bg-white shadow-sm"
          size="sm"
        />
      </header>

      {/* ── Stepper (8 Steps) ────────────────────────────────────────────────── */}
      <div className="px-3 sm:px-6 py-2 shrink-0">
        <div className="flex items-center justify-between max-w-xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-3 left-3 right-3 h-0.5 bg-sky-200 -z-0" />
          {STEPS.map(s => {
            const isFinish = s.id === 8;
            return (
              <div key={s.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition-all ${
                    isFinish
                      ? 'bg-rose-500 text-white ring-4 ring-rose-200 scale-110'
                      : 'bg-white text-sky-600 border border-sky-300'
                  }`}
                >
                  {s.id}
                </div>
                <span
                  className={`text-[8px] sm:text-[9px] mt-1 font-medium tracking-tight whitespace-nowrap hidden sm:block ${
                    isFinish ? 'text-rose-600 font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Content Area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between px-4 sm:px-6 py-2 max-w-4xl mx-auto w-full space-y-3 sm:space-y-4">
        {/* Title & Inspirational Subtitle */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>FINISH</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-mahidol-blue font-heading tracking-tight flex items-center justify-center gap-2">
            <span>ขอบคุณที่ค้นพบเส้นทางพยาบาลของคุณ!</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 inline-block animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            ขอให้คุณก้าวไปเป็นพยาบาลที่สร้างการเปลี่ยนแปลงให้สังคม 🤍
          </p>
        </div>

        {/* ── Center Stage: 3-column Result summary + 3D Mascot + Hashtags ──── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* LEFT: Result Summary Card (5 cols) */}
          <div className="md:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md border border-sky-100 flex flex-col space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              สรุปผลลัพธ์ของคุณ
            </div>

            {/* Path Title */}
            <div className="flex items-center gap-3 pb-2 border-b border-sky-100">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-sm shrink-0">
                <Heart className="w-6 h-6 fill-white/80" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-500">เส้นทางที่ใช่สำหรับคุณ</div>
                <div className="text-base sm:text-lg font-extrabold text-mahidol-blue leading-tight truncate">
                  {pathNameEn}
                </div>
                <div className="text-xs text-sky-700 font-semibold">{pathNameTh}</div>
              </div>
            </div>

            {/* Superpower */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-4 h-4 fill-pink-600/30" />
              </div>
              <div className="text-xs">
                <div className="text-[10px] text-slate-500 font-medium">Your Superpower</div>
                <div className="font-bold text-slate-800">{superpower}</div>
              </div>
            </div>

            {/* AI Skill */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="text-[10px] text-slate-500 font-medium">Your AI Skill</div>
                <div className="font-bold text-slate-800">{aiSkill}</div>
              </div>
            </div>

            {/* Impact */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="text-[10px] text-slate-500 font-medium">Your Impact</div>
                <div className="text-slate-600 leading-snug line-clamp-2">{impact}</div>
              </div>
            </div>

            {/* View Card Again CTA */}
            {onViewCardAgain && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCardAgain();
                }}
                className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 border border-sky-200 text-xs font-bold flex items-center justify-between transition-all"
              >
                <span>ดูการ์ดของฉันอีกครั้ง</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* CENTER: Mascot Character (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center relative py-2">
            {/* Background Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/40 via-blue-200/30 to-amber-200/40 rounded-full blur-2xl -z-10" />

            <div className="relative w-44 sm:w-56 md:w-60 max-w-full aspect-square flex items-center justify-center">
              <img
                src={characterSrc}
                alt="Future Nurse Character"
                className="w-full h-full object-contain filter drop-shadow-xl animate-float-subtle"
              />
            </div>
          </div>

          {/* RIGHT: Hashtags Box (4 cols) */}
          <div className="md:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md border border-sky-100 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 mb-2">
                <Camera className="w-4 h-4 text-rose-500" />
                <span>อย่าลืมติดแฮชแท็กนะ! ✦</span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-sky-600 font-semibold font-mono">
                {HASHTAGS.map((tag) => (
                  <span key={tag} className="hover:text-blue-700 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Copy Hashtags Button */}
            <button
              onClick={handleCopyHashtags}
              className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              {copiedTags ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">คัดลอกแฮชแท็กแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกแฮชแท็ก</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Admissions & Social Media Announcement Box ─────────────────────── */}
        <div className="bg-gradient-to-r from-blue-900/90 via-mahidol-blue to-blue-900/90 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-mahidol-gold" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed text-blue-50">
              สามารถติดตามข่าวการรับสมัครนักศึกษาของคณะพยาบาลศาสตร์ได้ที่{' '}
              <a
                href="https://ns.mahidol.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="underline font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-0.5 ml-0.5"
              >
                <span>https://ns.mahidol.ac.th</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>{' '}
              และ Social Media Faculty of Nursing, Mahidol University ทุกช่องทาง
            </div>
          </div>

          <a
            href="https://ns.mahidol.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 px-4 py-2 rounded-xl bg-mahidol-gold hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>ข้อมูลหลักสูตร & TCAS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* ── Action Section ("อยากทำอะไรต่อดี?") ────────────────────────────── */}
        {/* Strictly NO Save Image button, NO QR code as requested */}
        <div>
          <div className="text-xs font-bold text-slate-600 text-center mb-2">
            อยากทำอะไรต่อดี?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto w-full">
            {/* Action 1: Share Now */}
            <button
              onClick={handleShare}
              className="bg-white/90 hover:bg-white active:scale-[0.98] border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {shared ? 'คัดลอกข้อความแล้ว!' : 'แชร์ให้เพื่อน'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {shared ? 'แชร์ผลลัพธ์ลงโซเชียลได้ทันที' : 'Share Now'}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Action 2: Try Again / Reset for Next Player */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">เริ่มใหม่อีกครั้ง</div>
                  <div className="text-[11px] text-emerald-100">
                    ทำแบบประเมินใหม่ / สำหรับผู้เล่นคนถัดไป
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        {/* ── 60-second Auto-reset Countdown Bar ──────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-sky-100 flex items-center justify-between gap-3 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="text-xs text-slate-600 font-medium hidden sm:inline">
              ระบบจะเริ่มใหม่อัตโนมัติ หากไม่มีการใช้งานภายใน 60 วินาที
            </span>
            <span className="text-xs text-slate-600 font-medium sm:hidden">
              เริ่มใหม่อัตโนมัติใน
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 h-2 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Seconds badge */}
          <div className="shrink-0 px-2.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold font-mono">
            {timeLeft} วินาที
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-2 px-4 text-center text-[10px] text-slate-500 border-t border-sky-200/60 bg-white/40 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <span>Thank you for being part of our future of nursing. 🤍</span>
        <span className="font-semibold text-mahidol-blue">
          FACULTY OF NURSING, MAHIDOL UNIVERSITY
        </span>
      </footer>
    </div>
  );
};
