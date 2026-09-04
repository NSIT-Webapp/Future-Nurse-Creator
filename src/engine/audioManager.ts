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

// ── Web Audio Sound Effects (SFX) Synthesizer ─────────────────────────────
// Real-time zero-latency audio synthesis that respects global mute and iOS policies.
let sfxContext: AudioContext | null = null;

function getSfxContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sfxContext) {
    sfxContext = new AudioCtx();
  }
  if (sfxContext.state === 'suspended') {
    sfxContext.resume().catch(() => {});
  }
  return sfxContext;
}

/**
 * Plays a bubbly, rounded pop/chime when selecting a quiz option (A-F).
 * Pitch scales melodically across A, B, C, D, E, F.
 */
export function playSelectSfx(optionKey?: string): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const pitchMap: Record<string, number> = {
      A: 523.25, // C5
      B: 587.33, // D5
      C: 659.25, // E5
      D: 698.46, // F5
      E: 783.99, // G5
      F: 880.00, // A5
    };
    const baseFreq = (optionKey && pitchMap[optionKey]) || 587.33;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Gentle upward bubble pop: quick frequency sweep
    osc.frequency.setValueAtTime(baseFreq * 1.18, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 0.08);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (_e) {}
}

/**
 * Plays an upbeat, positive 2-tone chime when clicking "Next" (ถัดไป).
 */
export function playNextSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Note 2: A5 (880.00 Hz) - rising happy chord
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.06);
    gain2.gain.setValueAtTime(0.26, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.18);
  } catch (_e) {}
}

/**
 * Plays a soft, polite tap tone when clicking "Back" (ย้อนกลับ).
 */
export function playBackSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(460, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch (_e) {}
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
  playSelectSfx,
  playNextSfx,
  playBackSfx,
};
