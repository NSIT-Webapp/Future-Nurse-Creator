import React, { useEffect, useState } from 'react';
import { Sparkles, Download, QrCode, RotateCcw, Share2, Check, X } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { ResultPayload, StrengthFamily } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';
import { encodeResultState } from '../engine/stateCompressor';
import { buildShareCaption } from '../engine/shareManager';

interface ResultViewProps {
  result: ResultPayload;
  onReset: () => void;
}

const FAMILY_META: Record<StrengthFamily, { emoji: string; label: string; color: string }> = {
  HUMAN_CONNECTION:    { emoji: '❤️', label: 'Heart Connector',    color: 'from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-300' },
  CLINICAL_AWARENESS:  { emoji: '👀', label: 'Clinical Instinct',  color: 'from-sky-500/20 to-blue-500/20 border-sky-400/40 text-sky-300' },
  FUTURE_COLLABORATION:{ emoji: '✨', label: 'Care Innovator',     color: 'from-violet-500/20 to-purple-500/20 border-violet-400/40 text-violet-300' },
};

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const familyMeta = FAMILY_META[result.strengthFamily];

  useEffect(() => {
    let isMounted = true;
    async function generate() {
      try {
        const dataUrl = await renderFutureNurseCard(result);
        if (!isMounted) return;
        setCardDataUrl(dataUrl);

        const encoded = encodeResultState(result);
        const base = window.location.origin + window.location.pathname;
        const mobileUrl = `${base}#result=${encoded}`;
        const qr = await QRCodeLib.toDataURL(mobileUrl, {
          width: 320, margin: 2,
          color: { dark: '#002B7F', light: '#FFFFFF' }
        });
        if (!isMounted) return;
        setQrDataUrl(qr);
      } catch (e) { console.error(e); }
    }
    generate();
    return () => { isMounted = false; };
  }, [result]);

  const handleDownload = () => {
    if (!cardDataUrl) return;
    const a = document.createElement('a');
    a.download = `Future_Nurse_${result.pathId}_${result.strengthFamily}_${Date.now()}.png`;
    a.href = cardDataUrl;
    a.click();
  };

  const caption = buildShareCaption(result);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(caption); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch (_) {}
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 max-w-2xl mx-auto w-full animate-fade-in">
      {/* Banner */}
      <div className="text-center pt-1 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-mahidol-gold/20 border border-mahidol-gold/40 text-xs font-semibold text-mahidol-gold mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FUTURE NURSE CARD</span>
        </div>
        <h2 className="text-hero sm:text-display font-extrabold text-white mb-0.5 leading-[1.15]">
          {result.path.emoji} {result.path.nameEn}
        </h2>
        <p className="text-base text-slate-300 mb-2 font-semibold">{result.path.nameTh}</p>

        {/* Strength Family Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r border text-sm font-semibold ${familyMeta.color}`}>
          <span>{familyMeta.emoji}</span>
          <span>{familyMeta.label}</span>
          <span className="mx-1 opacity-40">•</span>
          <span className="font-bold text-white">{result.superpower}</span>
        </div>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center my-2">
        <div className="relative w-full max-w-[260px] sm:max-w-xs rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[9/16] bg-slate-900 flex items-center justify-center">
          {cardDataUrl ? (
            <img src={cardDataUrl} alt="Future Nurse Card" className="w-full h-full object-cover animate-fade-in" />
          ) : (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-mahidol-gold border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400">กำลังสร้างการ์ด 1080×1920...</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2 pb-2 w-full max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setShowQrModal(true)}
            disabled={!qrDataUrl}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-96 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            <QrCode className="w-5 h-5 text-mahidol-gold" />
            <span>สแกนรับบนมือถือ</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!cardDataUrl}
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-96 text-white border border-white/15 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <span>บันทึกรูปลงเครื่อง</span>
          </button>
        </div>
        <button
          onClick={onReset}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all"
        >
          <span>ให้เพื่อนลองต่อ / เล่นอีกครั้ง</span>
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div onClick={() => setShowQrModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-sm p-6 text-center rounded-3xl bg-slate-900 border border-mahidol-gold/40 shadow-2xl relative animate-scale-up">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5 text-mahidol-gold" />
              <span>SCAN TO OPEN ON MOBILE</span>
            </div>
            <h3 className="text-xl font-bold font-heading mb-1">สแกนด้วยกล้องมือถือ</h3>
            <p className="text-xs text-slate-400 mb-5">บันทึกการ์ดและแชร์โซเชียลบนมือถือ</p>
            <div className="w-56 h-56 mx-auto p-3 rounded-2xl bg-white flex items-center justify-center shadow-2xl mb-5">
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={handleCopy} className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 flex items-center justify-center gap-2 border border-white/10 transition-colors">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-sky-400" />}
                <span>{copied ? 'คัดลอกแคปชันแล้ว!' : 'คัดลอกแคปชัน & แฮชแท็ก'}</span>
              </button>
              <button onClick={() => setShowQrModal(false)} className="py-3 px-4 rounded-xl bg-mahidol-gold text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
