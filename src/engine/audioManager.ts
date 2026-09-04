/**
 * audioManager.ts — Global Background Audio & Sound Controller
 *
 * Responsibilities:
 * - Default state: MUTED / OFF (respects iOS Safari autoplay policy)
 * - User toggle on/off: initializes and plays audio context upon explicit gesture
 * - Session persistence: maintains user preference across screens
 * - Reset behavior: Thank You & Reset returns audio to default (muted / stopped)
 * - Safe failover: gracefully handles missing audio file or blocked playback
 */

let bgmAudio: HTMLAudioElement | null = null;
let isMutedState = true;
const listeners = new Set<(isMuted: boolean) => void>();

export function getAudioMuted(): boolean {
  return isMutedState;
}

export function subscribeAudio(listener: (isMuted: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(fn => fn(isMutedState));
}

/**
 * Toggle sound on/off
 * If unmuting, begins playback (user gesture required on iOS).
 */
export function toggleAudio(trackUrl?: string): boolean {
  isMutedState = !isMutedState;

  if (!isMutedState) {
    if (!bgmAudio && trackUrl) {
      try {
        bgmAudio = new Audio(trackUrl);
        bgmAudio.loop = true;
        bgmAudio.volume = 0.5;
      } catch (err) {
        console.warn('Audio init warning:', err);
      }
    }

    if (bgmAudio) {
      bgmAudio.play().catch(err => {
        console.warn('Audio playback prevented by browser policy:', err);
        isMutedState = true; // revert if blocked
      });
    }
  } else {
    if (bgmAudio) {
      bgmAudio.pause();
    }
  }

  notifyListeners();
  return isMutedState;
}

/**
 * Reset audio to default muted/stopped state on kiosk session reset.
 */
export function resetAudioState(): void {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
  isMutedState = true;
  notifyListeners();
}
