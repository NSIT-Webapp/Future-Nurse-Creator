import React, { useEffect, useState } from 'react';
import { Sparkles, Download, Share2, Copy, Check, ExternalLink, GraduationCap, RotateCcw } from 'lucide-react';
import { ResultPayload } from '../types';
import { renderFutureNurseCard } from '../engine/cardRenderer';

interface MobileResultViewProps {
  result: ResultPayload;
  onPlayAgain: () => void;
}

export const MobileResultView: React.FC<MobileResultViewProps> = ({ result, onPlayAgain }) => {
  const [cardDataUrl, setCardDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

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

  const officialCaption = `My Future Nursing Path is ${result.path.nameEn} ${result.path.emoji}\nค้นพบ Future Nurse ในแบบของฉันที่ NSMU Open House 2026\n\n#NSMUOPENHOUSE2026 #NURSESOFTHELAND #NSMUTCAS70 #MahidolNursing #คณะพยาบาลศาสตร์มหิดล`;

  const handleDownload = () => {
    if (!cardDataUrl) return;
    const link = document.createElement('a');
    link.download = `Future_Nurse_${result.pathId}.png`;
    link.href = cardDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Future Nurse: ${result.path.nameEn}`,
          text: officialCaption,
          url: window.location.href
        });
      } catch (_err) {}
    } else {
      handleCopyCaption();
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(officialCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_err) {}
  };

  return (
    <div className="min-h-screen bg-mahidol-deep text-white p-4 sm:p-6 max-w-lg mx-auto flex flex-col justify-between animate-fade-in">
      {/* Header */}
      <div className="text-center pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-mahidol-gold/20 border border-mahidol-gold/40 text-xs font-bold text-mahidol-gold mb-2 font-heading">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NSMU OPEN HOUSE 2026</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1 font-heading">
          {result.path.emoji} {result.path.nameEn}
        </h1>
        <p className="text-sm text-slate-300 font-medium">{result.path.nameTh}</p>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 aspect-[9/16] bg-slate-900 flex items-center justify-center">
          {cardDataUrl ? (
            <img
              src={cardDataUrl}
              alt="Future Nurse Card"
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-mahidol-gold border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400">กำลังโหลดการ์ดความละเอียดสูง...</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-6">
        {/* Save My Card */}
        <button
          onClick={handleDownload}
          disabled={!cardDataUrl}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-mahidol-gold via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:scale-98 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Save My Card (บันทึกรูปลงเครื่อง)</span>
        </button>

        {/* Share & Copy Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 active:scale-96 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share My Future</span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-96 text-white border border-white/15 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-300" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกแคปชัน'}</span>
          </button>
        </div>
      </div>

      {/* Discover Nursing @ NS */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-mahidol-blue flex items-center justify-center text-mahidol-gold font-bold text-sm">
            NS
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">Discover Nursing @ NS</h3>
            <p className="text-[11px] text-slate-400">คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          พร้อมก้าวสู่เส้นทางพยาบาลแห่งอนาคตกับหลักสูตรพยาบาลศาสตรบัณฑิตชั้นนำระดับสากล และโอกาสการเรียนรู้รอบด้าน
        </p>

        <div className="space-y-2">
          <a
            href="https://ns.mahidol.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-sky-300 hover:text-sky-200 border border-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-mahidol-gold" />
              <span>หลักสูตรพยาบาลศาสตรบัณฑิต (B.N.S.)</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://tcas.mahidol.ac.th"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-sky-300 hover:text-sky-200 border border-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-mahidol-gold" />
              <span>ข้อมูลการรับสมัคร TCAS คณะพยาบาลศาสตร์</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Play Again Button */}
      <div className="text-center pb-4">
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ลองเล่นใหม่อีกครั้ง</span>
        </button>
      </div>
    </div>
  );
};
