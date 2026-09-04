import React, { useEffect, useState } from 'react';
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
} from '../engine/shareManager';

interface MobileResultViewProps {
  result: ResultPayload;
  onPlayAgain: () => void;
}

export const MobileResultView: React.FC<MobileResultViewProps> = ({ result, onPlayAgain }) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [showIgModal, setShowIgModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hashtags = getHashtagsString();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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
    return () => {
      isMounted = false;
    };
  }, [result]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = () => {
    if (!cardDataUrl) return;
    downloadCard(cardDataUrl, result);
    showToast('กำลังบันทึกรูปลงเครื่องของคุณ... 📸');
  };

  const handleCopyHashtags = async () => {
    try {
      await navigator.clipboard.writeText(hashtags);
      setCopiedTags(true);
      showToast('คัดลอกแฮชแท็กเรียบร้อยแล้ว! 📋');
      setTimeout(() => setCopiedTags(false), 2500);
    } catch (_) {}
  };

  const handleWebShare = async () => {
    if (!cardDataUrl) return;
    if (isWebShareSupported()) {
      const ok = await shareCardViaWebShare(cardDataUrl, result);
      if (!ok) showToast('สามารถกดบันทึกรูปภาพเพื่อแชร์ได้เลยครับ');
    } else {
      handleCopyHashtags();
    }
  };

  const handleLineShare = () => {
    const text = `นี่คือ Future Nurse Path ของฉัน: ${result.path.nameEn} ${result.path.emoji}\nคณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล`;
    window.open(getLineShareUrl(currentUrl, text), '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    window.open(getFacebookShareUrl(currentUrl), '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = `นี่คือ Future Nurse Path ของฉัน: ${result.path.nameEn} ${result.path.emoji}`;
    window.open(getTwitterShareUrl(currentUrl, text), '_blank', 'noopener,noreferrer');
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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0EDFA] text-[#004BB7] text-xs font-bold border border-[#BBD8F5] mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-mahidol-gold" />
          <span>คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002B7F] mb-0.5 font-heading">
          {result.path.emoji} {result.path.nameEn}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">{result.path.nameTh}</p>
      </div>

      {/* Card Preview (9:16) */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-[280px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 aspect-[9/16] bg-slate-100 flex items-center justify-center">
          {cardDataUrl ? (
            <img
              src={cardDataUrl}
              alt="Future Nurse Card"
              className="w-full h-full object-cover animate-fade-in select-none"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400">กำลังเตรียมการ์ดความละเอียดสูง...</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-4">
        {/* Save My Card Primary Button */}
        <button
          onClick={handleDownload}
          disabled={!cardDataUrl}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/25 transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5 text-amber-300" />
          <span>บันทึกรูปภาพลงเครื่อง (Save Card)</span>
        </button>

        {/* Social Share Icons Row */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 text-center mb-2">
            แชร์เส้นทางนี้ให้เพื่อน ๆ ดู
          </p>
          <div className="flex items-center justify-around">
            {/* LINE */}
            <button
              onClick={handleLineShare}
              className="flex flex-col items-center gap-1 group"
              title="LINE"
            >
              <div className="w-10 h-10 rounded-full bg-[#06C755] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-xs">
                LINE
              </div>
              <span className="text-[10px] text-slate-500">LINE</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center gap-1 group"
              title="Facebook"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-sm">
                f
              </div>
              <span className="text-[10px] text-slate-500">Facebook</span>
            </button>

            {/* Instagram */}
            <button
              onClick={() => setShowIgModal(true)}
              className="flex flex-col items-center gap-1 group"
              title="Instagram"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-500">Instagram</span>
            </button>

            {/* X */}
            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center gap-1 group"
              title="X (Twitter)"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-extrabold text-sm">
                𝕏
              </div>
              <span className="text-[10px] text-slate-500">X</span>
            </button>

            {/* More / Web Share */}
            <button
              onClick={handleWebShare}
              className="flex flex-col items-center gap-1 group"
              title="แชร์ช่องทางอื่น ๆ"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shadow-xs group-hover:scale-105 active:scale-95 transition-all border border-slate-200">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-500">อื่น ๆ</span>
            </button>
          </div>
        </div>

        {/* 1-Click Hashtag Copy Box */}
        <div
          onClick={handleCopyHashtags}
          className="p-3 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#E9F3FF] border border-[#BFDBFE] flex items-center justify-between cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group shadow-xs"
          title="แตะเพื่อคัดลอกแฮชแท็ก"
        >
          <div>
            <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <span># อย่าลืมติดแฮชแท็กนะ!</span>
              {copiedTags && (
                <span className="text-[10px] text-emerald-600 font-bold">(คัดลอกแล้ว ✅)</span>
              )}
            </p>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5 font-mono">
              #NSMahidol #พยาบาลมหิดล #เส้นทางที่ใช่ของฉัน #FutureNurse
            </p>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              handleCopyHashtags();
            }}
            className="p-2 rounded-xl bg-white text-blue-600 shadow-sm border border-blue-100 shrink-0 group-hover:scale-105 transition-transform"
          >
            {copiedTags ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Direct Admission Links (Minimal, clean buttons) */}
      <div className="space-y-2 mb-4">
        <a
          href="https://ns.mahidol.ac.th"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>หลักสูตรพยาบาลศาสตรบัณฑิต (B.N.S.)</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <a
          href="https://tcas.mahidol.ac.th"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs active:scale-[0.99] transition-all"
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ข้อมูลการรับสมัคร TCAS คณะพยาบาลศาสตร์</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Play Again Button */}
      <div className="text-center pb-2">
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors py-1 px-3 rounded-full hover:bg-black/5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
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
