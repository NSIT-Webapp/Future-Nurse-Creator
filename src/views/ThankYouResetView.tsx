import React, { useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCcw,
  Heart,
  ChevronRight,
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

interface ThankYouResetViewProps {
  result: ResultPayload | null;
  cardDataUrl?: string;
  onReset: () => void;
  onViewCardAgain?: () => void;
}

const HASHTAGS = [
  '#NSMUOPENHOUSE2026',
  '#NURSESOFTHAILAND',
  '#NSMUTCAS70',
  '#MahidolNursing',
  '#คณะพยาบาลศาสตร์มหิดล',
];

const STEPS = [
  { id: 1, label: 'WELCOME' },
  { id: 2, label: 'FUTURE NURSE' },
  { id: 3, label: '8 QUESTIONS' },
  { id: 4, label: 'ANALYZING' },
  { id: 5, label: 'MATCHING' },
  { id: 6, label: 'REVEAL' },
  { id: 7, label: 'SAVE & SHARE' },
  { id: 8, label: 'FINISH' },
];

const ENCOURAGING_QUOTES = [
  'สู้ๆ นะว่าที่พยาบาลมหิดล! 🤍',
  'ขอให้ TCAS รอบนี้เป็นของน้องนะ ✨',
  'แล้วมาเจอกันที่รั้วมหิดลนะครับ/ค่ะ! 💙',
  'เชื่อมั่นในพลังพิเศษของตัวเองนะ! 🌟',
  'ยินดีต้อนรับสู่ครอบครัวพยาบาลศิริราชนะ 🏥',
  'พยาบาลแห่งแผ่นดิน ยินดีต้อนรับเสมอ 🌿',
  'อนาคตพยาบาลที่ยอดเยี่ยมกำลังรอน้องอยู่! 💫',
  'หัวใจที่พร้อมดูแลผู้อื่น คือพลังที่ยิ่งใหญ่ที่สุด 💖',
];

/**
 * ThankYouResetView — Final Step 8 (FINISH)
 *
 * Responsive, Kiosk & Mobile-ready celebration screen:
 * - Duo Nurse Mascot Hero with interactive tap reaction & quotes
 * - Official Faculty Admissions announcement (TCAS & Social Media)
 * - 60-second auto-reset countdown with progress bar & touch-to-extend
 * - 1-Click Hashtags copy
 * - Share Now & Try Again CTAs
 * - Confetti celebration on entry
 */
export const ThankYouResetView: React.FC<ThankYouResetViewProps> = ({
  onReset,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Interactive Mascot State ───────────────────────────────────────────────
  const [quoteIndex, setQuoteIndex] = useState<number | null>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState<boolean>(false);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [tapHearts, setTapHearts] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Confetti effect on mount ───────────────────────────────────────────────
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.22 },
        colors: ['#00A3FF', '#38BDF8', '#F5A623', '#FF69B4', '#10B981', '#FFFFFF'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.35 },
          colors: ['#00A3FF', '#F5A623', '#FFFFFF'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.35 },
          colors: ['#00A3FF', '#F5A623', '#FFFFFF'],
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

  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, []);

  // ── Mascot Tap Interaction ─────────────────────────────────────────────────
  const handleMascotTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleUserActivity();

    setQuoteIndex(prev => {
      if (ENCOURAGING_QUOTES.length <= 1) return 0;
      const next = Math.floor(Math.random() * ENCOURAGING_QUOTES.length);
      return next === prev ? (next + 1) % ENCOURAGING_QUOTES.length : next;
    });
    setShowSpeechBubble(true);
    setIsBouncing(true);

    const heartId = Date.now();
    setTapHearts(prev => [
      ...prev.slice(-4),
      {
        id: heartId,
        x: 35 + Math.random() * 30,
        y: 30 + Math.random() * 25,
        scale: 0.85 + Math.random() * 0.4,
      },
    ]);

    window.setTimeout(() => setIsBouncing(false), 520);
    window.setTimeout(() => {
      setTapHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 1150);

    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowSpeechBubble(false);
    }, 3500);
  };

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

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 60) * 100));

  return (
    <div
      onClick={handleUserActivity}
      onTouchStart={handleUserActivity}
      className="flex-1 flex flex-col h-full w-full bg-gradient-to-b from-[#EFF6FF] via-[#E2EEFC] to-[#D0E5FF] text-slate-800 overflow-y-auto overflow-x-hidden relative select-none"
      data-slot="thank-you-finish-root"
    >
      {/* ── Top Bar with Mahidol Logo & SoundControl ────────────────────────── */}
      <header className="flex items-center justify-between px-3 sm:px-6 pt-2.5 pb-1.5 relative z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/90 rounded-xl p-1 shadow-sm border border-sky-100 flex items-center shrink-0">
            <img
              src="/assets/home/faculty-logo.png"
              alt="คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล"
              className="h-6 sm:h-7 md:h-8 w-auto object-contain"
            />
          </div>
          <div className="hidden xs:block text-left">
            <div className="text-[11px] sm:text-xs font-bold text-mahidol-blue font-heading leading-tight">
              มหาวิทยาลัยมหิดล
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-600 font-medium">
              คณะพยาบาลศาสตร์
            </div>
          </div>
        </div>

        <SoundControl
          className="!bg-white/90 !text-slate-700 !border-sky-200 hover:!bg-white shadow-sm scale-90 sm:scale-100"
          size="sm"
        />
      </header>

      {/* ── Stepper (8 Steps) ────────────────────────────────────────────────── */}
      <div className="px-2 sm:px-6 py-2 shrink-0">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-3.5 sm:top-4 left-2 right-2 h-0.5 bg-sky-200 -z-0" />
          {STEPS.map(s => {
            const isFinish = s.id === 8;
            return (
              <div key={s.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-sm transition-all ${
                    isFinish
                      ? 'bg-rose-500 text-white ring-4 ring-rose-200 scale-110'
                      : 'bg-white text-sky-600 border border-sky-300'
                  }`}
                >
                  {s.id}
                </div>
                <span
                  className={`text-xs mt-1 font-semibold tracking-tight whitespace-nowrap hidden sm:block ${
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

      {/* ── Main Content Container ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between px-3 sm:px-6 py-1.5 max-w-2xl md:max-w-3xl mx-auto w-full space-y-2.5 sm:space-y-3">
        {/* ── Title Banner ──────────────────────────────────────────────────── */}
        <div className="text-center pt-0.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-bold shadow-sm mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>FINISH</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-mahidol-blue font-heading tracking-tight flex items-center justify-center gap-2">
            <span>ขอบคุณที่ค้นพบเส้นทางพยาบาลของคุณ!</span>
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 inline-block animate-pulse shrink-0" />
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-semibold mt-1">
            ขอให้คุณก้าวไปเป็นพยาบาลที่สร้างการเปลี่ยนแปลงให้สังคม 💙
          </p>
        </div>

        {/* ── Hero Visual: Separated Campus BG + Transparent Duo Nurses + Interactive Tap + Hashtags ──── */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-white/90 bg-sky-100 flex items-end justify-center min-h-[220px] xs:min-h-[250px] sm:min-h-[280px] md:min-h-[320px] aspect-[4/3] xs:aspect-[16/11] sm:aspect-[16/10]">
          {/* Layer 1: Campus Background Image */}
          <img
            src={ASSETS.finish.campusBg}
            alt="Mahidol Campus Background"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            draggable={false}
          />

          {/* Layer 1.5: Soft ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-sky-400/10 pointer-events-none" />

          {/* Layer 2: Transparent Duo Nurses (Foreground Mascot - Anchored flush to bottom) */}
          <div
            onClick={handleMascotTap}
            onTouchStart={handleMascotTap}
            className="relative z-10 w-full h-full cursor-pointer select-none flex items-end justify-center transition-transform active:scale-[0.99]"
            title="แตะที่ตัวพี่พยาบาลเพื่อรับกำลังใจ"
          >
            {/* Mascot Image — perfectly grounded with bottom cut-off clipped cleanly by card frame */}
            <div className="w-full h-full flex items-end justify-center overflow-hidden">
              <img
                src={ASSETS.finish.duoNurses}
                alt="Faculty of Nursing Mahidol Duo Mascot"
                className={`h-[125%] max-h-[125%] w-auto max-w-[98%] sm:max-w-[92%] object-contain object-bottom filter drop-shadow-2xl translate-y-[14%] ${
                  isBouncing ? 'animate-mascot-bounce' : 'animate-float-subtle'
                }`}
                draggable={false}
              />
            </div>

            {/* Speech Bubble Above Nurses */}
            {showSpeechBubble && quoteIndex !== null && (
              <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-40 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/95 text-slate-800 text-sm sm:text-base font-bold shadow-xl border-2 border-sky-200 animate-scale-up text-center max-w-[85%] sm:max-w-[340px]">
                <span>{ENCOURAGING_QUOTES[quoteIndex]}</span>
                {/* Bubble Tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-white/95 filter drop-shadow-sm" />
              </div>
            )}

            {/* Tap Hint Badge when not open */}
            {!showSpeechBubble && (
              <div className="absolute top-2 left-2 sm:left-3 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-sky-200/90 text-xs sm:text-sm font-semibold text-sky-700 shadow-sm animate-pulse">
                <span>แตะที่ตัวพี่พยาบาลสิ!</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
            )}

            {/* Floating Hearts upon Tap */}
            {tapHearts.map(h => (
              <div
                key={h.id}
                className="absolute pointer-events-none z-30 animate-float-heart"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: `scale(${h.scale})`,
                }}
              >
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 drop-shadow-md" />
              </div>
            ))}

            {/* Layer 3: Floating Hashtag Card (Bottom-Right overlay) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 bg-white/90 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-md border border-sky-100 max-w-[160px] xs:max-w-[190px] sm:max-w-[230px] text-left"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-800 leading-none">
                  <Camera className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">อย่าลืมติดแฮชแท็กนะ! ✧</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 text-xs sm:text-sm text-sky-600 font-semibold font-mono leading-tight">
                {HASHTAGS.slice(0, 4).map((tag) => (
                  <span key={tag} className="truncate hover:text-blue-700">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={handleCopyHashtags}
                className="w-full mt-2 py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 border border-sky-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedTags ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">คัดลอกแล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกแท็ก</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Admissions & Social Media Announcement Box ─────────────────────── */}
        <div className="bg-gradient-to-r from-blue-900/95 via-mahidol-blue to-blue-900/95 text-white rounded-2xl p-3 sm:p-4 shadow-md border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-mahidol-gold" />
            </div>
            <div className="text-sm sm:text-base leading-snug text-blue-50 font-medium">
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
            className="w-full sm:w-auto shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-mahidol-gold hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>ข้อมูลหลักสูตร & TCAS</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* ── Action Section ("เริ่มใหม่อีกครั้ง") ────────────────────────────── */}
        <div className="shrink-0 max-w-lg mx-auto w-full">
          {/* Try Again / Reset for Next Player */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="w-full min-h-[64px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] text-white rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 sm:gap-4 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-45 transition-transform">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-heading">
                  เริ่มใหม่อีกครั้ง
                </div>
                <div className="text-sm sm:text-base text-emerald-100 font-medium">
                  ทำแบบประเมินใหม่ / สำรวจเส้นทางอื่น
                </div>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* ── 60-second Auto-reset Countdown Bar ──────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-sm border border-sky-100 flex items-center justify-between gap-3 max-w-2xl mx-auto w-full shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="text-sm sm:text-base text-slate-600 font-semibold hidden xs:inline">
              ระบบจะเริ่มใหม่โดยอัตโนมัติ หากไม่มีการใช้งานภายใน 60 วินาที
            </span>
            <span className="text-sm text-slate-600 font-semibold xs:hidden">
              เริ่มใหม่ใน
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex-1 h-2 sm:h-2.5 bg-sky-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Seconds badge */}
          <div className="shrink-0 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-sm sm:text-base font-bold font-mono">
            {timeLeft} วินาที
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-2 px-4 sm:px-6 text-center text-xs sm:text-sm text-slate-500 border-t border-sky-200/60 bg-white/40 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <span>Thank you for being part of our future of nursing. 💙</span>
        <span className="font-bold text-mahidol-blue">
          FACULTY OF NURSING, MAHIDOL UNIVERSITY
        </span>
      </footer>
    </div>
  );
};
