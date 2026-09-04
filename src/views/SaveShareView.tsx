import React, { useEffect, useState } from 'react';
import { QrCode, Share2, Check, X, Download, ArrowRight } from 'lucide-react';
import { ResultPayload } from '../types';
import {
  generateResultQrCode,
  isWebShareSupported,
  shareCardViaWebShare,
  downloadCard,
  buildShareCaption,
} from '../engine/shareManager';

interface SaveShareViewProps {
  result: ResultPayload;
  /** Card data URL generated in CardPreviewView — passed down from App state */
  cardDataUrl: string;
  onNext: () => void;
}

/**
 * SaveShareView — Save & Share screen
 *
 * Primary flow (kiosk):
 *   QR Code → visitor scans with own phone → saves from phone
 *
 * Optional enhancement:
 *   Web Share API (if browser supports it) — triggers native iOS share sheet
 *   which may include AirDrop, Messages, etc. via the OS — no custom impl needed.
 *
 * Share logic is isolated in shareManager.ts — not embedded here.
 * To change the sharing strategy, update shareManager.ts only.
 */
export const SaveShareView: React.FC<SaveShareViewProps> = ({
  result,
  cardDataUrl,
  onNext,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);

  const webShareAvailable = isWebShareSupported();

  useEffect(() => {
    let mounted = true;
    generateResultQrCode(result)
      .then(url => { if (mounted) setQrDataUrl(url); })
      .catch(console.error);
    return () => { mounted = false; };
  }, [result]);

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(buildShareCaption(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  const handleWebShare = async () => {
    if (!cardDataUrl) return;
    setSharing(true);
    try {
      const ok = await shareCardViaWebShare(cardDataUrl, result);
      if (!ok && qrDataUrl) setShowQrModal(true); // fallback to QR
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    if (cardDataUrl) downloadCard(cardDataUrl, result);
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 max-w-2xl mx-auto w-full animate-fade-in"
      data-slot="save-share-root"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div data-slot="save-share-header" className="text-center pt-2 pb-3 w-full">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-1">
          บันทึก Future Nurse Card
        </h2>
        <p className="text-sm text-slate-300">สแกน QR Code เพื่อรับการ์ดบนมือถือของคุณ</p>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div
        data-slot="save-share-actions"
        className="w-full max-w-md mx-auto space-y-3 flex-1 flex flex-col justify-center"
      >
        {/* PRIMARY: QR Code */}
        <button
          onClick={() => setShowQrModal(true)}
          disabled={!qrDataUrl}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-[0.98] text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
        >
          <QrCode className="w-5 h-5 text-mahidol-gold" />
          <span>สแกน QR รับการ์ดบนมือถือ</span>
        </button>

        {/* OPTIONAL: Web Share API (only shown if browser supports it) */}
        {webShareAvailable && (
          <button
            onClick={handleWebShare}
            disabled={!cardDataUrl || sharing}
            className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white border border-white/15 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>{sharing ? 'กำลังเปิด...' : 'แชร์ (iOS Share Sheet)'}</span>
          </button>
        )}

        {/* SECONDARY: Direct download (kiosk fallback) */}
        <button
          onClick={handleDownload}
          disabled={!cardDataUrl}
          className="w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] text-slate-400 hover:text-white border border-white/10 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>บันทึกไฟล์ลงอุปกรณ์นี้</span>
        </button>
      </div>

      {/* ── Finish / Next to Thank You ────────────────────────────────────── */}
      <div data-slot="save-share-finish" className="w-full max-w-md mx-auto pt-3 pb-2">
        <button
          onClick={onNext}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all group"
        >
          <span>เสร็จสิ้น (Thank You & Reset)</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ── QR Modal ─────────────────────────────────────────────────────── */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm p-6 text-center rounded-3xl bg-slate-900 border border-mahidol-gold/40 shadow-2xl relative animate-fade-in"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5 text-mahidol-gold" />
              <span>SCAN TO OPEN ON MOBILE</span>
            </div>
            <h3 className="text-xl font-bold font-heading mb-1">สแกนด้วยกล้องมือถือ</h3>
            <p className="text-xs text-slate-400 mb-5">บันทึกการ์ดและแชร์โซเชียลบนมือถือของคุณ</p>

            {/* QR Code */}
            <div className="w-56 h-56 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-2xl mb-5">
              {qrDataUrl
                ? <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                : <div className="w-8 h-8 rounded-full border-4 border-mahidol-gold border-t-transparent animate-spin" />
              }
            </div>

            {/* Caption copy */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyCaption}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                {copied
                  ? <Check className="w-4 h-4 text-emerald-400" />
                  : <Share2 className="w-4 h-4 text-sky-400" />
                }
                <span>{copied ? 'คัดลอกแคปชันแล้ว!' : 'คัดลอกแคปชัน & แฮชแท็ก'}</span>
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="py-3 px-4 rounded-xl bg-mahidol-gold text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
