import React, { useEffect, useState } from 'react';
import {
  Download,
  Share2,
  RotateCcw,
  Link as LinkIcon,
  Copy,
  Check,
  Lightbulb,
  MessageCircle,
  Camera,
  X,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import { ResultPayload } from '../types';
import {
  generateResultQrCode,
  isWebShareSupported,
  shareCardViaWebShare,
  downloadCard,
  getMobileResultUrl,
  getHashtagsString,
  getLineShareUrl,
  getFacebookShareUrl,
  getTwitterShareUrl,
} from '../engine/shareManager';

interface SaveShareViewProps {
  result: ResultPayload;
  /** Card data URL generated in CardPreviewView — passed down from App state */
  cardDataUrl: string;
  onNext: () => void;
  onReset?: () => void;
}

export const SaveShareView: React.FC<SaveShareViewProps> = ({
  result,
  cardDataUrl,
  onNext,
  onReset,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [showIgModal, setShowIgModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mobileUrl = getMobileResultUrl(result);
  const hashtags = getHashtagsString();

  useEffect(() => {
    let mounted = true;
    generateResultQrCode(result)
      .then(url => {
        if (mounted) setQrDataUrl(url);
      })
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, [result]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopiedLink(true);
      showToast('คัดลอกลิงก์การ์ดเรียบร้อยแล้ว ✨');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {
      showToast('ไม่สามารถคัดลอกได้อัตโนมัติ');
    }
  };

  const handleCopyHashtags = async () => {
    try {
      await navigator.clipboard.writeText(hashtags);
      setCopiedTags(true);
      showToast('คัดลอกแฮชแท็กเรียบร้อยแล้ว! 📋');
      setTimeout(() => setCopiedTags(false), 2500);
    } catch (_) {}
  };

  const handleDownload = () => {
    if (cardDataUrl) {
      downloadCard(cardDataUrl, result);
      showToast('ดาวน์โหลดรูปภาพลงเครื่องแล้ว (หรือสแกน QR เพื่อลงมือถือ)');
    }
  };

  const handleWebShare = async () => {
    if (!cardDataUrl) return;
    setSharing(true);
    try {
      if (isWebShareSupported()) {
        const ok = await shareCardViaWebShare(cardDataUrl, result);
        if (!ok) {
          showToast('คุณสามารถสแกน QR หรือแชร์ผ่านลิงก์ด้านบนได้ครับ');
        }
      } else {
        handleCopyLink();
      }
    } finally {
      setSharing(false);
    }
  };

  const handleLineShare = () => {
    const text = `นี่คือ Future Nurse Path ของฉัน: ${result.path.nameEn} ${result.path.emoji}\nคณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล`;
    window.open(getLineShareUrl(mobileUrl, text), '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    window.open(getFacebookShareUrl(mobileUrl), '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = `นี่คือ Future Nurse Path ของฉัน: ${result.path.nameEn} ${result.path.emoji}`;
    window.open(getTwitterShareUrl(mobileUrl, text), '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="flex-1 flex flex-col justify-between w-full h-full max-w-4xl mx-auto px-4 sm:px-6 py-2.5 bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-[#E9F3FA] text-slate-800 overflow-y-auto animate-fade-in relative rounded-3xl shadow-xl"
      data-slot="save-share-root"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-medium border border-white/20 animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mahidol-gold animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header & Title ─────────────────────────────────────────────── */}
      <div data-slot="save-share-header" className="text-center pt-1 pb-1 shrink-0">
        {/* Pink Badge */}
        <div className="inline-flex items-center justify-center px-4 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-sm mb-1">
          SAVE & SHARE
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-[#002B7F] font-heading tracking-tight flex items-center justify-center gap-1.5">
          <span className="text-amber-400">✨</span>
          <span>บันทึกและแชร์การ์ดของคุณ!</span>
          <span className="text-amber-400">✨</span>
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
          เก็บไว้เป็นแรงบันดาลใจ และแบ่งปันเส้นทางพยาบาลที่ใช่ของคุณ
        </p>
      </div>

      {/* ── 2-Column Main Content ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:gap-5 items-center my-auto py-1">
        {/* ── Left Column: Card Preview & Tip ─────────────────────────────── */}
        <div className="flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#E0EDFA] text-[#004BB7] text-[10px] font-bold tracking-wide mb-1.5 border border-[#BBD8F5]">
            MY FUTURE NURSE CARD
          </div>

          {/* Card preview 9:16 aspect */}
          <div className="relative w-full max-w-[210px] sm:max-w-[230px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl border-2 border-white/80 bg-slate-100 flex items-center justify-center">
            {cardDataUrl ? (
              <img
                src={cardDataUrl}
                alt="Future Nurse Card"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 p-4 text-center">
                <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-xs text-slate-500">กำลังประมวลผลการ์ด...</p>
              </div>
            )}
          </div>

          {/* Card page indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium my-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1 / 1</span>
            <span className="w-2 h-2 rounded-full bg-slate-300" />
          </div>

          {/* Tip Banner */}
          <div className="w-full max-w-[280px] p-2 sm:p-2.5 rounded-2xl bg-[#EFF6FF] border border-[#D0E5FC] flex items-center gap-2 shadow-sm">
            <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400/30" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-700 leading-snug">
              <span className="font-bold text-blue-900">TIP:</span> บันทึกการ์ดนี้ไว้เตือนใจว่า{' '}
              <span className="text-blue-700 font-medium">“คุณคือพลังแห่งการเปลี่ยนแปลง”</span>
            </p>
          </div>
        </div>

        {/* ── Right Column: Share & Connect Box ────────────────────────────── */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-lg border border-sky-100 flex flex-col justify-between space-y-2.5">
          {/* Box Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 font-heading">
                แชร์ให้เพื่อน ๆ ของคุณ!
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                บอกต่อเส้นทางพยาบาลที่ใช่สำหรับคุณ
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center p-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 shadow-inner">
            <div className="w-28 h-28 sm:w-32 sm:h-32 p-1.5 rounded-xl bg-white shadow-md flex items-center justify-center border border-slate-100">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              )}
            </div>
            <div className="text-center mt-1.5">
              <p className="text-[11px] font-bold text-slate-800">สแกน QR เพื่อดูการ์ดของคุณ</p>
              <p className="text-[9px] text-slate-400">หรือแชร์ลิงก์ให้เพื่อน</p>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div className="flex items-center gap-1.5 p-1 pl-2.5 rounded-xl bg-[#F0F5FA] border border-slate-200">
            <LinkIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-[11px] text-slate-600 truncate flex-1 font-mono">
              https://ns.mahidol.ac.th/mycard...
            </span>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold border border-slate-200 shadow-xs flex items-center gap-1 active:scale-95 transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>คัดลอก</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Icons Row */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1.5">แชร์ผ่าน</p>
            <div className="flex items-center justify-between gap-1">
              {/* LINE */}
              <button
                onClick={handleLineShare}
                className="flex flex-col items-center gap-0.5 group"
                title="LINE"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#06C755] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-[10px]">
                  LINE
                </div>
                <span className="text-[9px] text-slate-500">LINE</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center gap-0.5 group"
                title="Facebook"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-bold text-xs">
                  f
                </div>
                <span className="text-[9px] text-slate-500">Facebook</span>
              </button>

              {/* Instagram */}
              <button
                onClick={() => setShowIgModal(true)}
                className="flex flex-col items-center gap-0.5 group"
                title="Instagram"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-slate-500">Instagram</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center gap-0.5 group"
                title="X (Twitter)"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-all font-extrabold text-xs">
                  𝕏
                </div>
                <span className="text-[9px] text-slate-500">X (Twitter)</span>
              </button>

              {/* Other / More */}
              <button
                onClick={handleWebShare}
                className="flex flex-col items-center gap-0.5 group"
                title="ช่องทางอื่น ๆ"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-all border border-slate-200">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[9px] text-slate-500">อื่น ๆ</span>
              </button>
            </div>
          </div>

          {/* Hashtag Box */}
          <div
            onClick={handleCopyHashtags}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#E9F3FF] border border-[#BFDBFE] flex items-center justify-between cursor-pointer hover:border-blue-400 active:scale-[0.99] transition-all group"
            title="คลิกเพื่อคัดลอกแฮชแท็กทั้งหมด"
          >
            <div>
              <p className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                <span># อย่าลืมติดแฮชแท็กนะ!</span>
                {copiedTags && (
                  <span className="text-[9px] text-emerald-600 font-normal">
                    (คัดลอกแล้ว ✅)
                  </span>
                )}
              </p>
              <p className="text-[9px] sm:text-[10px] text-blue-700 font-medium mt-0.5">
                #NSMahidol &nbsp; #พยาบาลมหิดล
              </p>
              <p className="text-[9px] sm:text-[10px] text-blue-700 font-medium">
                #เส้นทางที่ใช่ของฉัน &nbsp; #FutureNurse
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white text-blue-500 shadow-sm flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action Bar (3 Primary Buttons) ─────────────────────────── */}
      <div
        data-slot="save-share-actions"
        className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto w-full pt-2 pb-1 shrink-0"
      >
        {/* 1. บันทึกภาพ */}
        <button
          onClick={handleDownload}
          disabled={!cardDataUrl}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <div className="text-center sm:text-left">
            <div>บันทึกภาพ</div>
            <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Save Image</div>
          </div>
        </button>

        {/* 2. แชร์เลย */}
        <button
          onClick={handleWebShare}
          disabled={!cardDataUrl || sharing}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 text-sky-500" />
          <div className="text-center sm:text-left">
            <div>แชร์เลย</div>
            <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Share Now</div>
          </div>
        </button>

        {/* 3. เริ่มใหม่อีกครั้ง / Finish */}
        <button
          onClick={onReset || onNext}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-sm hover:shadow transition-all"
        >
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <div className="text-center sm:text-left">
            <div>เริ่มใหม่อีกครั้ง</div>
            <div className="text-[9px] text-slate-400 font-normal hidden sm:block">Try Again</div>
          </div>
        </button>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="text-center text-[10px] sm:text-[11px] text-slate-500 pt-0.5 pb-0.5 shrink-0">
        ขอบคุณที่มาร่วมค้นหาเส้นทางพยาบาลที่ใช่กับเรา 💖
      </div>

      {/* ── Instagram Guide Modal ─────────────────────────────────────────── */}
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
            <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
              1. กด <span className="font-bold text-blue-600">"บันทึกภาพ"</span> เพื่อดาวน์โหลดการ์ด
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
