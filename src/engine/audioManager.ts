/**
 * ══════════════════════════════════════════════════════════════════════════════
 * AUDIO MANAGER — Future Nurse Creator
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Kiosk Background Music Controller:
 * - Compatible with iOS Safari gesture/touch activation requirements
 * - Looping background soundtrack (/audio/bgm.mp3)
 * - Reactive subscription for UI buttons (SoundControl, Header)
 * - Safe error handling (catches browser audio autoplay restrictions)
 */

let globalAudio: HTMLAudioElement | null = null;
let isMuted: boolean = false; // Default unmuted ("เปิดเสียงไว้เลย")
let isPlaying: boolean = false;
const listeners = new Set<(muted: boolean, playing: boolean) => void>();

function notify() {
  listeners.forEach(fn => {
    try {
      fn(isMuted, isPlaying);
    } catch (_e) {}
  });
}

// Auto-unlock audio on first touch/click/key if browser blocked initial autoplay
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (!isMuted && (!globalAudio || globalAudio.paused)) {
      playAudio().catch(() => {});
    }
  };
  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });
}

function getOrCreateAudio(trackUrl: string = '/audio/bgm.mp3'): HTMLAudioElement {
  if (!globalAudio) {
    globalAudio = new Audio(trackUrl);
    globalAudio.loop = true;
    globalAudio.volume = 0.45;
    globalAudio.preload = 'auto';

    globalAudio.addEventListener('play', () => {
      isPlaying = true;
      notify();
    });

    globalAudio.addEventListener('pause', () => {
      isPlaying = false;
      notify();
    });

    globalAudio.addEventListener('ended', () => {
      // Loop backup
      globalAudio?.play().catch(() => {});
    });
  } else if (trackUrl && !globalAudio.src.endsWith(trackUrl)) {
    globalAudio.src = trackUrl;
  }
  return globalAudio;
}

/**
 * Returns true if audio is currently muted/paused.
 */
export function getAudioMuted(): boolean {
  return isMuted;
}

/**
 * Returns true if audio is actively playing.
 */
export function isAudioPlaying(): boolean {
  return isPlaying;
}

/**
 * Subscribes a listener to audio state changes. Returns unsubscribe function.
 */
export function subscribeAudio(listener: (muted: boolean, playing: boolean) => void): () => void {
  listeners.add(listener);
  listener(isMuted, isPlaying);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Plays background music with the specified track URL.
 */
export async function playAudio(trackUrl: string = '/audio/bgm.mp3'): Promise<boolean> {
  const audio = getOrCreateAudio(trackUrl);
  isMuted = false;
  audio.muted = false;
  try {
    await audio.play();
    isPlaying = true;
    notify();
    return true;
  } catch (_err) {
    // Autoplay prevented by browser policy until interaction
    isPlaying = false;
    notify();
    return false;
  }
}

/**
 * Pauses background music.
 */
export function pauseAudio(): void {
  if (globalAudio) {
    globalAudio.pause();
    isMuted = true;
    isPlaying = false;
    notify();
  }
}

/**
 * Toggles audio between playing (unmuted) and paused (muted).
 */
export function toggleAudio(trackUrl: string = '/audio/bgm.mp3'): boolean {
  const audio = getOrCreateAudio(trackUrl);
  if (!audio.paused && !isMuted) {
    pauseAudio();
    return false;
  } else {
    playAudio(trackUrl);
    return true;
  }
}

/**
 * Resets audio state on kiosk session reset.
 */
export function resetAudioState(): void {
  if (globalAudio && !isMuted) {
    if (globalAudio.paused) {
      globalAudio.play().catch(() => {});
    }
  }
}

export const audioManager = {
  getAudioMuted,
  isAudioPlaying,
  getState: () => ({ isPlaying, isMuted }),
  subscribe: (fn: (state: { isPlaying: boolean; isMuted: boolean }) => void) => {
    return subscribeAudio((m, p) => fn({ isMuted: m, isPlaying: p }));
  },
  subscribeAudio,
  playAudio,
  play: playAudio,
  pauseAudio,
  pause: pauseAudio,
  toggleAudio,
  toggle: toggleAudio,
  resetAudioState,
};
