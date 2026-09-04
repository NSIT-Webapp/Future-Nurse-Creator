import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAudioMuted, subscribeAudio, toggleAudio } from '../engine/audioManager';

interface SoundControlProps {
  className?: string;
  trackUrl?: string;
}

/**
 * SoundControl — Modular Audio Toggle Button
 *
 * - Default: Muted / Off
 * - Accessible: ARIA labels, keyboard focusable
 * - Persistent: Syncs with global audioManager across screens
 */
export const SoundControl: React.FC<SoundControlProps> = ({
  className = '',
  trackUrl = '/audio/bgm.mp3',
}) => {
  const [isMuted, setIsMuted] = useState(getAudioMuted());

  useEffect(() => {
    return subscribeAudio(muted => setIsMuted(muted));
  }, []);

  const handleToggle = () => {
    toggleAudio(trackUrl);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm border border-slate-200/80 text-xs font-semibold text-slate-700 backdrop-blur-sm cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-rose-400/50 ${className}`}
      aria-label={isMuted ? 'เปิดเสียงเพลงประกอบ' : 'ปิดเสียงเพลงประกอบ'}
      title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[11px] font-medium">เปิดเสียง</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span className="text-[11px] font-medium">ปิดเสียง</span>
        </>
      )}
    </button>
  );
};
