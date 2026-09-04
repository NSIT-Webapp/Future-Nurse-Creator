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
 * Plays a bright, sparkling crystal chime ("ปิ๊งๆๆ" / fairy sparkle) when selecting a quiz option (A-F).
 * Synthesizes a rapid 3-step shimmering arpeggio with crystalline bell harmonics.
 */
export function playSelectSfx(optionKey?: string): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    // Bright pentatonic root frequencies (C6 - E7 range) for luminous, sparkling crystal tones
    const rootPitches: Record<string, number> = {
      A: 1318.51, // E6
      B: 1479.98, // F#6
      C: 1661.22, // G#6
      D: 1975.53, // B6
      E: 2217.46, // C#7
      F: 2637.02, // E7
    };
    const baseFreq = (optionKey && rootPitches[optionKey]) || 1479.98;

    const now = ctx.currentTime;

    // 3 rapid micro-sparkles: "ปิ๊ง - ปิ๊ง - ปิ๊ง!" (approx. 38ms spacing)
    // Intervals: Root (1.0) -> Major 3rd (1.26) -> 5th/Octave (1.50)
    const sparkles = [
      { delay: 0.000, freqMultiplier: 1.00, volume: 0.15, duration: 0.18 },
      { delay: 0.038, freqMultiplier: 1.26, volume: 0.18, duration: 0.22 },
      { delay: 0.076, freqMultiplier: 1.50, volume: 0.20, duration: 0.28 },
    ];

    sparkles.forEach(({ delay, freqMultiplier, volume, duration }) => {
      const startTime = now + delay;
      const freq = baseFreq * freqMultiplier;

      // 1) Pure fundamental sine wave (crystalline bell body)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.003); // instant clickless attack
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // shimmering bell decay

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);

      // 2) Crystal sparkle overtone (triangle harmonic at 2x octave for luminous glitter)
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmerOsc.type = 'triangle';
      shimmerOsc.frequency.setValueAtTime(freq * 2.0, startTime);

      shimmerGain.gain.setValueAtTime(0.0001, startTime);
      shimmerGain.gain.linearRampToValueAtTime(volume * 0.35, startTime + 0.002);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmerOsc.start(startTime);
      shimmerOsc.stop(startTime + duration * 0.6);
    });
  } catch (_e) {}
}

/**
 * Plays an upbeat, luminous 2-tone crystal chime when clicking "Next" (ถัดไป).
 */
export function playNextSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Rising cheerful high bells: G6 (1567.98 Hz) -> C7 (2093.00 Hz)
    const notes = [
      { time: now, freq: 1567.98, vol: 0.16, dur: 0.18 },
      { time: now + 0.075, freq: 2093.00, vol: 0.22, dur: 0.32 },
    ];

    notes.forEach(({ time, freq, vol, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);

      // Light sparkle overtone
      const shim = ctx.createOscillator();
      const shimGain = ctx.createGain();
      shim.type = 'triangle';
      shim.frequency.setValueAtTime(freq * 2, time);
      shimGain.gain.setValueAtTime(0.0001, time);
      shimGain.gain.linearRampToValueAtTime(vol * 0.3, time + 0.003);
      shimGain.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.5);
      shim.connect(shimGain);
      shimGain.connect(ctx.destination);
      shim.start(time);
      shim.stop(time + dur * 0.5);
    });
  } catch (_e) {}
}

/**
 * Plays a gentle, pleasant pastel chime when clicking "Back" (ย้อนกลับ).
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
    // Gentle downward soft bell: 1046.50 Hz (C6) -> 783.99 Hz (G5)
    osc.frequency.setValueAtTime(1046.50, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
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
