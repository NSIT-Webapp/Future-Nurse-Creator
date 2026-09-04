import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAudioMuted, subscribeAudio, toggleAudio } from '../engine/audioManager';

interface SoundControlProps {
  className?: string;
  trackUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SoundControl — Modular Audio Toggle Button
 *
 * - Default: Muted / Off
 * - Accessible: ARIA labels, keyboard focusable, touch-optimized (min 44px)
 * - Persistent: Syncs with global audioManager across screens
 */
export const SoundControl: React.FC<SoundControlProps> = ({
  className = '',
  trackUrl = '/audio/bgm.mp3',
  size = 'md',
}) => {
  const [isMuted, setIsMuted] = useState(getAudioMuted());

  useEffect(() => {
    return subscribeAudio(muted => setIsMuted(muted));
  }, []);

  const handleToggle = () => {
    toggleAudio(trackUrl);
  };

  const isLg = size === 'lg';

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/95 hover:bg-white active:scale-95 transition-all duration-150 shadow-md border-2 border-slate-200/90 font-bold text-slate-800 backdrop-blur-md cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-rose-400/40 ${
        isLg
          ? 'px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base'
          : 'px-4 py-2 sm:px-4.5 sm:py-2.5 text-xs sm:text-sm'
      } ${className}`}
      aria-label={isMuted ? 'เปิดเสียงเพลงประกอบ' : 'ปิดเสียงเพลงประกอบ'}
      title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
    >
      {isMuted ? (
        <>
          <VolumeX className={isLg ? 'w-5 h-5 sm:w-6 sm:h-6 text-rose-500' : 'w-4 h-4 sm:w-5 sm:h-5 text-rose-500'} />
          <span className="font-bold tracking-wide">เปิดเสียง</span>
        </>
      ) : (
        <>
          <Volume2 className={`${isLg ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} text-rose-500 animate-pulse`} />
          <span className="font-bold tracking-wide">ปิดเสียง</span>
        </>
      )}
    </button>
  );
};
