import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Copy,
  Download,
  GraduationCap,
  Lightbulb,
  QrCode,
  ScanLine,
  Share2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { ResultPayload } from '../types';
import { generateResultQrCode } from '../engine/shareManager';

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

const MOBILE_HANDOFF_ITEMS = [
  { label: 'บันทึกการ์ดลงเครื่อง', icon: Download },
  { label: 'แชร์ไปยัง social media ของตนเอง', icon: Share2 },
  { label: 'คัดลอก hashtag งาน', icon: Copy },
  { label: 'ดูข้อมูลหลักสูตรและ TCAS มหิดล', icon: GraduationCap },
];

interface SaveShareViewProps {
  result: ResultPayload;
  /** Card data URL generated in CardPreviewView — passed down from App state */
  cardDataUrl: string;
  onNext: () => void;
}

export const SaveShareView: React.FC<SaveShareViewProps> = ({
  result,
  cardDataUrl,
  onNext,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cardAspect, setCardAspect] = useState<string>('9 / 16');

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const customTip = PATH_TIPS[result.pathId] || 'คุณคือพลังแห่งการเปลี่ยนแปลง';

  useEffect(() => {
    let mounted = true;
    generateResultQrCode(result)
      .then(url => {
        if (mounted) setQrDataUrl(url);
      })
      .catch(console.error);

    const confettiTimer = setTimeout(() => {
      if (!mounted) return;
      try {
        confetti({
          particleCount: 26,
          spread: 55,
          origin: { y: 0.4 },
          colors: ['#002B7F', '#0EA5E9', '#F5A623', '#FF5C8D'],
          disableForReducedMotion: true,
        });
      } catch (_) {}
    }, 280);

    return () => {
      mounted = false;
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

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = Math.max(-7, Math.min(7, ((y - centerY) / centerY) * -7));
    const rotY = Math.max(-7, Math.min(7, ((x - centerX) / centerX) * 7));

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

    const rotX = Math.max(-8, Math.min(8, ((y - centerY) / centerY) * -8));
    const rotY = Math.max(-8, Math.min(8, ((x - centerX) / centerX) * 8));

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

  return (
    <div
      className="flex-1 flex flex-col justify-between w-full h-full max-w-4xl mx-auto px-4 sm:px-6 py-2.5 bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-[#E9F3FA] text-slate-800 overflow-y-auto animate-fade-in relative rounded-3xl shadow-xl"
      data-slot="save-share-root"
    >
      <div data-slot="save-share-header" className="text-center pt-1 pb-1 shrink-0">
        <div className="inline-flex items-center justify-center px-4 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-sm mb-1">
          SAVE & SHARE
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#002B7F] font-heading tracking-tight flex items-center justify-center gap-1.5">
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300/40" />
          <span>สแกนเพื่อบันทึกการ์ดของคุณ</span>
          <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300/40" />
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
          หน้านี้ใช้สำหรับดูตัวอย่างบน iPad และส่งต่อไปยังมือถือเท่านั้น
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-center my-auto py-1">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#E0EDFA] text-[#004BB7] text-[10px] font-bold tracking-wide mb-1.5 border border-[#BBD8F5]">
            MY FUTURE NURSE CARD
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            onTouchMove={handleCardTouchMove}
            onTouchEnd={handleCardTouchEnd}
            className="relative w-full max-w-[240px] sm:max-w-[270px] md:max-w-[300px] rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 bg-slate-100 flex items-center justify-center select-none"
            style={{
              aspectRatio: cardAspect,
              transform: `perspective(700px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
                isHovered ? 'scale3d(1.025, 1.025, 1.025)' : 'scale3d(1, 1, 1)'
              }`,
              transition: isHovered
                ? 'transform 0.08s ease-out'
                : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            title="แตะหรือเลื่อนเมาส์เพื่อดูมิติการ์ด"
          >
            <div
              className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-2xl"
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
                className="w-full h-full object-contain select-none pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-xs text-slate-500">กำลังประมวลผลการ์ด...</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium my-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1 / 1</span>
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>

          <div className="w-full max-w-[300px] p-2 sm:p-2.5 rounded-2xl bg-[#EFF6FF] border border-[#D0E5FC] flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400/30" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-700 leading-snug">
              <span className="font-bold text-blue-900">TIP:</span> {customTip}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border border-sky-100 flex flex-col items-center justify-center gap-3.5 min-h-[360px]">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs border border-sky-100">
            <QrCode className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
              สแกน QR Code ด้วยมือถือ
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              หลังสแกน QR Code จะเปิดหน้าการ์ดส่วนตัวบนมือถือ เพื่อบันทึก ส่งต่อ และดูข้อมูลสำหรับสมัครเรียน
            </p>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-b from-sky-50 to-white p-3.5 border border-sky-100 shadow-inner">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-sky-700 border border-sky-100 shadow-sm flex items-center gap-1">
              <ScanLine className="w-3 h-3" />
              <span>SCAN ONLY</span>
            </div>
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 p-2 rounded-2xl bg-white shadow-md flex items-center justify-center border border-slate-100">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              )}
            </div>
          </div>

          <div className="w-full rounded-2xl bg-[#EFF6FF] border border-[#CFE5FF] px-3 py-2.5 flex items-start gap-2">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-blue-900 font-semibold leading-relaxed">
              เพื่อความปลอดภัยของ iPad ในบูธ หน้านี้ปิดการดาวน์โหลดและการแชร์ออกจากเครื่อง กรุณาทำรายการบนมือถือของคุณเท่านั้น
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            {MOBILE_HANDOFF_ITEMS.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="min-h-14 rounded-2xl bg-slate-50 border border-slate-100 px-2.5 py-2 flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-xl bg-white text-sky-600 flex items-center justify-center shadow-xs shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] sm:text-[11px] leading-tight font-bold text-slate-600">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-slot="save-share-actions" className="max-w-xs mx-auto w-full pt-2 pb-1 shrink-0">
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-[#FF5E80] to-[#FF3366] hover:brightness-105 active:scale-[0.98] text-white font-extrabold text-sm shadow-md shadow-rose-400/30 transition-all"
        >
          <Check className="w-4 h-4 text-white" />
          <span>เสร็จสิ้น</span>
        </button>
      </div>

      <div className="text-center text-[10px] sm:text-[11px] text-slate-500 pt-0.5 pb-0.5 shrink-0">
        ขอบคุณที่มาร่วมค้นหาเส้นทางพยาบาลที่ใช่กับเรา 💖
      </div>
    </div>
  );
};
