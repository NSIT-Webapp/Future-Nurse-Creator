import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  GraduationCap,
  RotateCcw,
  Camera,
  X,
  Sparkles,
  Lightbulb,
  MoreHorizontal,
} from 'lucide-react';
import { ResultPayload } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';
import {
  downloadCard,
  getHashtagsString,
  getLineShareUrl,
  getFacebookShareUrl,
  getTwitterShareUrl,
  shareCardViaWebShare,
  isWebShareSupported,
  buildShareCaption,
} from '../engine/shareManager';
import { playSelectSfx } from '../engine/audioManager';

const PATH_TIPS: Record<string, string> = {
  PED: 'รอยยิ้มและความสดใสของเด็ก ๆ จะเป็นพลังขับเคลื่อนที่ยิ่งใหญ่ของคุณ',
  MH: 'ความเห็นอกเห็นใจและการรับฟังอย่างเข้าใจของคุณ คือพื้นที่ปลอดภัยของทุกคน',
  ER: 'ความสุขุมและสติที่มั่นคงของคุณ คือความหวังในทุกวินาทีวิกฤต',
  OA: 'ความใส่ใจและอ่อนโยนของคุณ ช่วยให้ผู้สูงวัยใช้ชีวิตอย่างมีศักดิ์ศรีและมีความสุข',
  MAT: 'ความละเอียดอ่อนและการดูแลด้วยหัวใจของคุณ คือจุดเริ่มต้นที่งดงามของชีวิตใหม่',
  COMM: 'ความเข้าใจและเชื่อมโยงของคุณ คือสะพานสร้างความเข้มแข็งให้ทุกชุมชน',
  INT: 'การเปิดกว้างและวิสัยทัศน์สากลของคุณ จะพาการพยาบาลไทยก้าวไกลไร้พรมแดน',
  TECH: 'ความคิดสร้างสรรค์และนวัตกรรมของคุณ จะเปลี่ยนโฉมวงการสุขภาพสู่อนาคต',
};

interface MobileResultViewProps {
  result: ResultPayload;
  onPlayAgain: () => void;
}

export const MobileResultView: React.FC<MobileResultViewProps> = ({ result, onPlayAgain }) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showIgModal, setShowIgModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cardAspect, setCardAspect] = useState<string>('9 / 16');

  // 3D Tilt & Holographic glare state
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const hashtags = getHashtagsString();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const customTip = PATH_TIPS[result.pathId] || 'คุณคือพลังแห่งการเปลี่ยนแปลง';
  const shareCaption = buildShareCaption(result);

  useEffect(() => {
    let isMounted = true;
    async function generateCard() {
      try {
        const dataUrl = await renderFutureNurseCard(result);
        if (isMounted) setCardDataUrl(dataUrl);
      } catch (e) {
        console.error('Failed to generate card on mobile:', e);
      }
    }
    generateCard();

    // Gentle celebration confetti burst on mount
    const confettiTimer = setTimeout(() => {
      if (!isMounted) return;
      try {
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { y: 0.35 },
          colors: ['#002B7F', '#0EA5E9', '#F5A623', '#FF5C8D'],
          disableForReducedMotion: true,
        });
      } catch (_) {}
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(confettiTimer);
    };
  }, [result]);

  useEffect(() => {
    if (!cardDataUrl) {
      setCardAspect('9 / 16');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setCardAspect(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
    };
    img.src = cardDataUrl;
  }, [cardDataUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3D Tilt handlers
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = Math.max(-8, Math.min(8, ((y - centerY) / centerY) * -8));
    const rotY = Math.max(-8, Math.min(8, ((x - centerX) / centerX) * 8));

    setRotate({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
    setIsHovered(true);
  };

  const handleCardMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  const handleCardTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = Math.max(-9, Math.min(9, ((y - centerY) / centerY) * -9));
    const rotY = Math.max(-9, Math.min(9, ((x - centerX) / centerX) * 9));

    setRotate({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.4,
    });
    setIsHovered(true);
  };

  const handleCardTouchEnd = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  const handleDownload = () => {
    if (!cardDataUrl || saveStatus === 'saving') return;
    setSaveStatus('saving');
    playSelectSfx('F');
    if ('vibrate' in navigator) navigator.vibrate?.([25]);

    setTimeout(() => {
      downloadCard(cardDataUrl, result);
      setSaveStatus('saved');
      if ('vibrate' in navigator) navigator.vibrate?.([20, 40, 20]);
      showToast('บันทึกการ์ดลงเครื่องเรียบร้อยแล้ว! 📸');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    }, 350);
  };

  const handleCopyHashtags = async () => {
    try {
      playSelectSfx('A');
      if ('vibrate' in navigator) navigator.vibrate?.([15]);
      await navigator.clipboard.writeText(hashtags);
      setCopiedTags(true);
      showToast('คัดลอกแฮชแท็กเรียบร้อยแล้ว! 📋');
      setTimeout(() => setCopiedTags(false), 2500);
    } catch (_) {}
  };

  const handleWebShare = async () => {
    if (!cardDataUrl) return;
    playSelectSfx('C');
    if (isWebShareSupported()) {
      const ok = await shareCardViaWebShare(cardDataUrl, result);
      if (!ok) showToast('สามารถกดบันทึกรูปภาพเพื่อแชร์ได้เลยครับ');
    } else {
      handleCopyHashtags();
    }
  };

  const handleLineShare = () => {
    playSelectSfx('D');
    window.open(getLineShareUrl(currentUrl, shareCaption), '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    playSelectSfx('D');
    window.open(getFacebookShareUrl(currentUrl), '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    playSelectSfx('D');
    window.open(getTwitterShareUrl(currentUrl, shareCaption), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-[#E9F3FA] text-slate-800 p-4 sm:p-6 max-w-md mx-auto flex flex-col justify-between animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-medium border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mahidol-gold animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-2 pb-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E0EDFA] text-[#004BB7] text-xs sm:text-sm font-bold border border-[#BBD8F5] mb-2 shadow-xs">
          <Sparkles className="w-4 h-4 text-mahidol-gold" />
          <span>คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล</span>
        </div>
        <p className="text-sm sm:text-base font-extrabold text-[#FF3366] mb-1 tracking-wide">
          บันทึก แชร์ และส่งต่อ Future Nurse Card ของคุณ
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#002B7F] mb-1 font-heading">
          {result.path.emoji} {result.path.nameEn}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-semibold">{result.path.nameTh}</p>
      </div>

      {/* Card Preview (9:16) with 3D Tilt & Glare */}
      <div className="flex flex-col items-center mb-4">
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          onTouchMove={handleCardTouchMove}
          onTouchEnd={handleCardTouchEnd}
          style={{
            aspectRatio: cardAspect,
            transform: `perspective(700px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
              isHovered ? 'scale3d(1.025, 1.025, 1.025)' : 'scale3d(1, 1, 1)'
            }`,
            transition: isHovered
              ? 'transform 0.08s ease-out'
              : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="relative w-full max-w-[280px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-slate-100 flex items-center justify-center select-none cursor-pointer"
          title="แตะเพื่อหมุนดูมิติการ์ด"
        >
          {/* Holographic light glare overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 35%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />

          {cardDataUrl ? (
            <img
              src={cardDataUrl}
              alt="Future Nurse Card"
              className="w-full h-full object-contain animate-fade-in select-none pointer-events-none"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-slate-500">กำลังเตรียมการ์ดความละเอียดสูง...</p>
            </div>
          )}
        </div>

        {/* Tip Banner with Personalized Inspiring Quote */}
        <div className="w-full max-w-[300px] mt-3 p-3 rounded-2xl bg-white/90 backdrop-blur-xs border border-sky-100 flex items-center gap-2.5 shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400/30" />
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-snug font-medium">
            <span className="font-bold text-blue-900">TIP:</span> {customTip}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-4">
        {/* Save My Card Primary Button (Morphing State) */}
        <button
          onClick={handleDownload}
          disabled={!cardDataUrl || saveStatus === 'saving'}
          className={`w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-lg sm:text-xl flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 ${
            saveStatus === 'saved'
              ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-[1.01]'
              : saveStatus === 'saving'
              ? 'bg-blue-100 text-blue-800 shadow-none'
              : 'bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-[0.98] text-white shadow-blue-600/25'
          } disabled:opacity-50`}
        >
          {saveStatus === 'saved' ? (
            <>
              <Check className="w-6 h-6 text-white" />
              <span>บันทึกการ์ดลงเครื่องเรียบร้อย! 🎉</span>
            </>
          ) : saveStatus === 'saving' ? (
            <>
              <div className="w-6 h-6 rounded-full border-2 border-blue-800 border-t-transparent animate-spin" />
              <span>กำลังเตรียมบันทึกภาพ...</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6 text-amber-300" />
              <span>บันทึกรูปภาพลงเครื่อง (Save Card)</span>
            </>
          )}
        </button>

        {/* Social Share Icons Row */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-bold text-slate-600 text-center mb-2.5">
            แชร์ไปยัง social media ของคุณ
          </p>
          <div className="flex items-center justify-around">
            {/* LINE */}
            <button
              onClick={handleLineShare}
              className="flex flex-col items-center gap-1 group"
              title="LINE"
            >
              <div className="w-11 h-11 rounded-full bg-[#06C755] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-xs">
                LINE
              </div>
              <span className="text-xs font-semibold text-slate-600">LINE</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-1 group"
              title="Facebook"
            >
              <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-base">
                f
              </div>
              <span className="text-xs font-semibold text-slate-600">Facebook</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => setShowIgModal(true)}
              className="flex flex-col items-center gap-1 group"
              title="Instagram"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Instagram</span>
            </button>

            {/* X */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-1 group"
              title="X (Twitter)"
            >
              <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-extrabold text-base">
                𝕏
              </div>
              <span className="text-xs font-semibold text-slate-600">X</span>
            </button>

            {/* More / Web Share */}
            <button
              onClick={handleWebShare}
              className="flex flex-col items-center gap-1 group"
              title="แชร์ช่องทางอื่น ๆ"
            >
              <div className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all border border-slate-200">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-600">อื่น ๆ</span>
            </button>
          </div>
        </div>

        {/* 1-Click Hashtag Copy Box */}
        <div
          onClick={handleCopyHashtags}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#E9F3FF] border border-[#BFDBFE] flex items-center justify-between cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group shadow-xs"
          title="แตะเพื่อคัดลอกแฮชแท็ก"
        >
          <div>
            <p className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
              <span># อย่าลืมติดแฮชแท็กนะ!</span>
              {copiedTags && (
                <span className="text-xs text-emerald-600 font-bold">(คัดลอกแล้ว ✅)</span>
              )}
            </p>
            <p className="text-xs sm:text-sm text-blue-700 font-semibold mt-0.5 font-mono">
              #NSMahidol #พยาบาลมหิดล #เส้นทางที่ใช่ของฉัน #FutureNurse
            </p>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              handleCopyHashtags();
            }}
            className="p-2.5 rounded-xl bg-white text-blue-600 shadow-sm border border-blue-100 shrink-0 group-hover:scale-105 transition-transform"
          >
            {copiedTags ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Direct Admission Links (Minimal, clean buttons) */}
      <div className="space-y-2 mb-4">
        <a
          href="https://ns.mahidol.ac.th/nurse_en/bns/bns2022_study.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 text-sm sm:text-base font-bold text-slate-800 border border-slate-200 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>ประชาสัมพันธ์หลักสูตรพยาบาลศาสตรบัณฑิต</span>
          </span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>

        <a
          href="https://tcas.mahidol.ac.th"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 text-sm sm:text-base font-bold text-slate-800 border border-slate-200 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>TCAS มหิดล</span>
          </span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* Play Again Button */}
      <div className="text-center pb-2">
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors py-1.5 px-4 rounded-full hover:bg-black/5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ลองค้นหาเส้นทางใหม่อีกครั้ง</span>
        </button>
      </div>

      {/* Instagram Guide Modal */}
      {showIgModal && (
        <div
          onClick={() => setShowIgModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm p-5 text-center rounded-3xl bg-white text-slate-800 shadow-2xl relative animate-scale-up border border-slate-100"
          >
            <button
              onClick={() => setShowIgModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-lg mb-2.5">
              <Camera className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold font-heading text-slate-900 mb-1">
              แชร์ไปยัง Instagram 📸
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              1. กด <span className="font-bold text-blue-600">"บันทึกรูปภาพลงเครื่อง"</span>
              <br />
              2. เปิดแอป Instagram แล้วโพสต์ลง <span className="font-bold text-pink-600">Story</span> หรือ Feed ได้ทันที!
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left mb-3.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                แฮชแท็กที่เตรียมไว้ให้:
              </p>
              <p className="text-[11px] text-blue-700 font-mono select-all font-medium">
                {hashtags}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleCopyHashtags();
                  setShowIgModal(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold text-xs sm:text-sm hover:from-blue-500 hover:to-sky-500 transition-all shadow-md active:scale-95"
              >
                คัดลอกแฮชแท็ก & ปิดหน้าต่าง
              </button>
              <button
                onClick={handleDownload}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
              >
                บันทึกรูปลงเครื่องตอนนี้
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
