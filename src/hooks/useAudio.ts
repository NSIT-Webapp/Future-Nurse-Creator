import { useState, useEffect, useCallback } from 'react';
import { audioManager } from '../engine/audioManager';

export function useAudio() {
  const [audioState, setAudioState] = useState(audioManager.getState());

  useEffect(() => {
    return audioManager.subscribe(setAudioState);
  }, []);

  const toggle = useCallback(() => {
    return audioManager.toggle();
  }, []);

  const play = useCallback(() => {
    return audioManager.play();
  }, []);

  const pause = useCallback(() => {
    audioManager.pause();
  }, []);

  return {
    isPlaying: audioState.isPlaying,
    isMuted: audioState.isMuted,
    toggle,
    play,
    pause,
  };
}
