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
 * 1. เสียงกดตัวเลือก (A-F) — "ปิ๊งๆๆ" (Crystal Sparkle / Twinkle Chime)
 * สไตล์: ประกายแก้ววิ้งวับ 3 จังหวะเร็ว (Staccato Fairy Sparkle)
 * โทน: เสียงสูงใส (High Register C6 - G7) ในคีย์ G Major เข้ากับเพลง "Spark Care"
 */
export function playSelectSfx(optionKey?: string): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    // Harmonic chords in G Major diatonic scale (สอดคล้องกับคอร์ดในเพลง Spark Care 100%)
    const chordSparkles: Record<string, number[]> = {
      A: [1567.98, 1975.53, 2349.32], // G6 -> B6 -> D7 (G Major Triad Sparkle)
      B: [1760.00, 2217.46, 2637.02], // A6 -> C#7 -> E7 (A Major Shimmer)
      C: [1567.98, 2093.00, 2637.02], // G6 -> C7 -> E7 (C Major Inversion)
      D: [1318.51, 1567.98, 1975.53], // E6 -> G6 -> B6 (E minor Sweet)
      E: [1174.66, 1479.98, 1760.00], // D6 -> F#6 -> A6 (D Major Crystal)
      F: [1975.53, 2349.32, 3135.96], // B6 -> D7 -> G7 (High G Diamond Sparkle)
    };

    const notes = (optionKey && chordSparkles[optionKey]) || [1567.98, 1975.53, 2349.32];
    const now = ctx.currentTime;

    // 3 rapid micro-sparkles spaced 34ms apart ("ปิ๊ง - ปิ๊ง - ปิ๊ง!")
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.034;
      const duration = 0.16 + idx * 0.03;
      const volume = 0.13 + idx * 0.03;

      // Crystalline bell sine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);

      // Light air shimmer overtone
      const shim = ctx.createOscillator();
      const shimGain = ctx.createGain();
      shim.type = 'triangle';
      shim.frequency.setValueAtTime(freq * 2.0, startTime);

      shimGain.gain.setValueAtTime(0.0001, startTime);
      shimGain.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.002);
      shimGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.5);

      shim.connect(shimGain);
      shimGain.connect(ctx.destination);
      shim.start(startTime);
      shim.stop(startTime + duration * 0.5);
    });
  } catch (_e) {}
}

/**
 * 2. เสียงปุ่ม "ถัดไป" (Next Button) — "ตึ๊ง-ตึ๊งงง" (Warm Resonant Chime / Upward Perfect 5th)
 * สไตล์: เสียงระฆังอบอุ่น กังวาน มั่นใจ (แตกต่างจากเสียงปิ๊งๆๆ ของตัวเลือกอย่างชัดเจน)
 * โทน: D5 (587.33 Hz) -> G5 (783.99 Hz) คอร์ด V -> I ที่ให้ความรู้สึกก้าวหน้า สำเร็จ เข้ากับ Warm Piano ของเพลง
 */
export function playNextSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 2-tone warm progression: D5 (587.33 Hz) -> G5 (783.99 Hz)
    // Richer, deeper, more sustained than the high staccato sparkles
    const progression = [
      { time: now, freq: 587.33, vol: 0.22, dur: 0.24 }, // D5 (Warmth)
      { time: now + 0.09, freq: 783.99, vol: 0.28, dur: 0.40 }, // G5 (Triumphant Resolution)
    ];

    progression.forEach(({ time, freq, vol, dur }) => {
      // Fundamental warm body
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.006); // rounder, smoother attack
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      // Warm overtone (octave harmonic for round bell/chime resonance)
      const warmOsc = ctx.createOscillator();
      const warmGain = ctx.createGain();
      warmOsc.type = 'triangle';
      warmOsc.frequency.setValueAtTime(freq * 2.0, time);

      warmGain.gain.setValueAtTime(0.0001, time);
      warmGain.gain.linearRampToValueAtTime(vol * 0.25, time + 0.006);
      warmGain.gain.exponentialRampToValueAtTime(0.0001, time + dur * 0.7);

      osc.connect(gain);
      warmOsc.connect(warmGain);
      gain.connect(ctx.destination);
      warmGain.connect(ctx.destination);

      osc.start(time);
      warmOsc.start(time);
      osc.stop(time + dur);
      warmOsc.stop(time + dur);
    });
  } catch (_e) {}
}

/**
 * 3. เสียงปุ่ม "ย้อนกลับ" (Back Button) — "ตุ่ม" (Soft Wooden/Marimba Tap)
 * สไตล์: นุ่มนวล สุภาพ เสียงต่ำลงเล็กน้อย
 * โทน: G4 (392.00 Hz) -> D4 (293.66 Hz)
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
    // Gentle downward soft tone
    osc.frequency.setValueAtTime(392.00, now); // G4
    osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.12); // D4

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (_e) {}
}

/**
 * 4. เสียงปุ่ม "เริ่มสร้างอนาคตของคุณเลย!" — "🚀 Let's Go / Rocket Launch Fanfare"
 * สไตล์: เสียงฟิ้วทะยานขึ้น (Rocket Riser) + คอร์ดฉลองชัยชนะก้าวสู่อนาคต (G4 -> B4 -> D5 -> G5)
 * ให้ความรู้สึก: ตื่นเต้น มีพลัง ทะยานไปข้างหน้าแบบ "Let's Go!"
 */
export function playStartLaunchSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A. Sub-bass punch (ให้ความรู้สึกกดติดมือ มีน้ำหนัก ณ เสี้ยววินาทีแรก)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.25, now + 0.006);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.16);

    // B. Upward Whoosh / Rocket Riser (เสียงจรวดทะยานฟิ้วววแบบโมเดิร์น)
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = 'sawtooth';
    sweepOsc.frequency.setValueAtTime(260, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1280, now + 0.22);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(3400, now + 0.22);
    filter.Q.value = 2.5;

    sweepGain.gain.setValueAtTime(0.001, now);
    sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

    sweepOsc.connect(filter);
    filter.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.26);

    // C. Triumphant 4-Note Major Arpeggio (Ascending Fanfare: G4 -> B4 -> D5 -> G5)
    // จังหวะทะยานกระชับ 4 โน้ต ให้ฟีลลิ่ง "Let's - Go - To - Future!"
    const fanfareNotes = [
      { timeOffset: 0.04, freq: 392.00, dur: 0.22, vol: 0.20 }, // G4
      { timeOffset: 0.10, freq: 493.88, dur: 0.24, vol: 0.23 }, // B4
      { timeOffset: 0.16, freq: 587.33, dur: 0.28, vol: 0.26 }, // D5
      { timeOffset: 0.22, freq: 783.99, dur: 0.65, vol: 0.32 }, // G5 (Triumphant High Peak!)
    ];

    fanfareNotes.forEach(({ timeOffset, freq, dur, vol }) => {
      const noteTime = now + timeOffset;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(vol, noteTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + dur);

      // Warm overtone for arcade game polish
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(freq * 1.5, noteTime);

      harmGain.gain.setValueAtTime(0.0001, noteTime);
      harmGain.gain.linearRampToValueAtTime(vol * 0.3, noteTime + 0.008);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur * 0.7);

      harmOsc.connect(harmGain);
      harmGain.connect(ctx.destination);
      harmOsc.start(noteTime);
      harmOsc.stop(noteTime + dur * 0.7);
    });

    // D. Final Diamond Sparkle Shimmer (G6 -> C7) ประกายวิ้งวับส่งท้าย
    const peakTime = now + 0.24;
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(1567.98, peakTime);
    sparkleOsc.frequency.exponentialRampToValueAtTime(2093.00, peakTime + 0.35);

    sparkleGain.gain.setValueAtTime(0.0001, peakTime);
    sparkleGain.gain.linearRampToValueAtTime(0.16, peakTime + 0.01);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, peakTime + 0.45);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start(peakTime);
    sparkleOsc.stop(peakTime + 0.45);
  } catch (_e) {}
}

/**
 * 5. เสียงติ๊กเรดาร์สแกน (Soft Radar Ping / Gentle Crystal Tick)
 * สไตล์: เสียงติ๊กนุ่มๆ ใสๆ เบาสบายหู ตามจังหวะเรดาร์หมุนผ่านแต่ละการ์ด
 * โทน: โน้ตในสเกล G Major Pentatonic ระดับเสียงเบามาก (Vol ~0.04) ไม่รบกวนเพลงคลอ
 */
export function playRadarTickSfx(stepIndex: number = 0): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const scale = [
      987.77,  // B5
      1174.66, // D6
      1318.51, // E6
      1567.98, // G6
      1760.00, // A6
      1975.53, // B6
      2349.32, // D7
      2637.02, // E7
    ];
    const freq = scale[stepIndex % scale.length] || 1567.98;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Ultra-soft and short gentle blip
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (_e) {}
}

/**
 * 6. เสียงพลิกการ์ด 3D เผยสายอาชีพ (Card Flip "ฟิ้ว-วิ้ง!" / Unlock Chime)
 * สไตล์: เสียงหมุนไพ่ฟิ้วเบาๆ + กระดิ่งแก้วเฉลยการ์ด (D6 -> G6 -> B6)
 * ให้ความรู้สึก: ตื่นเต้นเหมือนเปิดได้การ์ดใบใหม่ในเกมกาชา
 */
export function playCardFlipSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A. Soft Upward Card Swish (เสียงลมหมุนไพ่)
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(320, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

    sweepGain.gain.setValueAtTime(0.0001, now);
    sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.14);

    // B. Crystal Unlock Chime Triad (D6 -> G6 -> B6)
    const chimeNotes = [
      { offset: 0.03, freq: 1174.66, dur: 0.22, vol: 0.12 }, // D6
      { offset: 0.07, freq: 1567.98, dur: 0.26, vol: 0.15 }, // G6
      { offset: 0.11, freq: 1975.53, dur: 0.38, vol: 0.18 }, // B6 (Sparkle peak!)
    ];

    chimeNotes.forEach(({ offset, freq, dur, vol }) => {
      const noteTime = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(vol, noteTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + dur);
    });
  } catch (_e) {}
}

/**
 * 7. เสียงประมวลผลเสร็จสิ้น 100% (Victory Swell & Sparkle Fanfare)
 * สไตล์: ฮาร์ปแก้วไล่เสียงขึ้นอย่างสง่างาม + เสียงระฆังฉลองชัยชนะก่อนพลุ Confetti แตก
 * ให้ความรู้สึก: ค้นพบตัวตนที่แท้จริงแล้ว!
 */
export function playAnalysisCompleteSfx(): void {
  if (isMuted) return;
  try {
    const ctx = getSfxContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A. Ascending Victory Harp Arpeggio: G4 -> D5 -> G5 -> B5 -> D6 -> G6
    const harpNotes = [
      { offset: 0.00, freq: 392.00, dur: 0.35, vol: 0.18 }, // G4
      { offset: 0.06, freq: 587.33, dur: 0.38, vol: 0.20 }, // D5
      { offset: 0.12, freq: 783.99, dur: 0.42, vol: 0.23 }, // G5
      { offset: 0.18, freq: 987.77, dur: 0.48, vol: 0.25 }, // B5
      { offset: 0.24, freq: 1174.66, dur: 0.55, vol: 0.28 }, // D6
      { offset: 0.30, freq: 1567.98, dur: 0.85, vol: 0.34 }, // G6 (Brilliant Peak)
    ];

    harpNotes.forEach(({ offset, freq, dur, vol }) => {
      const noteTime = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(vol, noteTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + dur);
    });

    // B. Shimmering High Sparkle Overtones
    const peakTime = now + 0.32;
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();
    sparkleOsc.type = 'triangle';
    sparkleOsc.frequency.setValueAtTime(2093.00, peakTime); // C7
    sparkleOsc.frequency.exponentialRampToValueAtTime(3135.96, peakTime + 0.5); // G7

    sparkleGain.gain.setValueAtTime(0.0001, peakTime);
    sparkleGain.gain.linearRampToValueAtTime(0.18, peakTime + 0.01);
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, peakTime + 0.65);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);
    sparkleOsc.start(peakTime);
    sparkleOsc.stop(peakTime + 0.65);
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
  playStartLaunchSfx,
  playRadarTickSfx,
  playCardFlipSfx,
  playAnalysisCompleteSfx,
};
