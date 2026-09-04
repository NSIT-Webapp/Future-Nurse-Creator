/**
 * shareManager.ts — Share & Save logic (isolated from Card UI)
 *
 * Primary flow:  QR Code → visitor scans with own phone → saves from phone
 * Enhancement:   Web Share API (if browser supports it)
 * Fallback:      QR Code modal
 *
 * This module is intentionally decoupled from any React component so that
 * the sharing strategy can be changed without touching UI code.
 */

import QRCodeLib from 'qrcode';
import { ResultPayload } from '../types';
import { encodeResultState } from './stateCompressor';

// ── QR Code generation ────────────────────────────────────────────────────────

/** Generates a QR code data URL that encodes the session result into the URL hash. */
export async function generateResultQrCode(result: ResultPayload): Promise<string> {
  const encoded = encodeResultState(result);
  const base = window.location.origin + window.location.pathname;
  const mobileUrl = `${base}#result=${encoded}`;

  return QRCodeLib.toDataURL(mobileUrl, {
    width: 320,
    margin: 2,
    color: { dark: '#002B7F', light: '#FFFFFF' },
  });
}

// ── Web Share API ────────────────────────────────────────────────────────────

/** Returns true if the current browser/device supports the Web Share API. */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Attempts to share the card image using the Web Share API.
 * Falls back gracefully — callers should handle the returned boolean.
 *
 * Returns true if share was initiated, false if unsupported or failed.
 */
export async function shareCardViaWebShare(
  cardDataUrl: string,
  result: ResultPayload
): Promise<boolean> {
  if (!isWebShareSupported()) return false;

  try {
    // Convert data URL to Blob for sharing
    const res = await fetch(cardDataUrl);
    const blob = await res.blob();
    const file = new File(
      [blob],
      `FutureNurse_${result.pathId}_${result.strengthFamily}.png`,
      { type: 'image/png' }
    );

    const canShareFiles =
      typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

    if (canShareFiles) {
      await navigator.share({
        title: `Future Nurse Creator — ${result.path.nameEn}`,
        text: buildShareCaption(result),
        files: [file],
      });
    } else {
      // Share URL only (no file)
      await navigator.share({
        title: `Future Nurse Creator — ${result.path.nameEn}`,
        text: buildShareCaption(result),
        url: window.location.href,
      });
    }
    return true;
  } catch (err: unknown) {
    // User cancelled — not an error
    if (err instanceof Error && err.name === 'AbortError') return false;
    console.warn('[shareManager] Web Share failed:', err);
    return false;
  }
}

// ── Direct download (secondary, kiosk use only) ───────────────────────────────

/**
 * Triggers a direct file download of the card PNG to the current device.
 * On kiosk iPads this saves to the kiosk device — not the visitor's phone.
 * Prefer QR code flow for visitors.
 */
export function downloadCard(cardDataUrl: string, result: ResultPayload): void {
  const a = document.createElement('a');
  a.download = `FutureNurse_${result.pathId}_${result.strengthFamily}_${Date.now()}.png`;
  a.href = cardDataUrl;
  a.click();
}

// ── Mobile Result URL ─────────────────────────────────────────────────────────

/** Builds the full mobile result URL for the given result payload. */
export function getMobileResultUrl(result: ResultPayload): string {
  const encoded = encodeResultState(result);
  const base = window.location.origin + window.location.pathname;
  return `${base}#result=${encoded}`;
}

// ── Official Hashtags ─────────────────────────────────────────────────────────

export const OFFICIAL_HASHTAGS = [
  '#NSMahidol',
  '#พยาบาลมหิดล',
  '#เส้นทางที่ใช่ของฉัน',
  '#FutureNurse'
];

export function getHashtagsString(): string {
  return OFFICIAL_HASHTAGS.join(' ');
}

// ── Social Share URLs ─────────────────────────────────────────────────────────

export function getLineShareUrl(url: string, text: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${url}`)}`;
}

export function getFacebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getTwitterShareUrl(url: string, text: string): string {
  const tags = 'NSMahidol,พยาบาลมหิดล,FutureNurse,เส้นทางที่ใช่ของฉัน';
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(tags)}`;
}

// ── Caption builder ───────────────────────────────────────────────────────────

/** Builds the standard social media caption + hashtags. */
export function buildShareCaption(result: ResultPayload): string {
  return [
    `My Future Nursing Path is ${result.path.nameEn} ${result.path.emoji}`,
    `Superpower: ${result.superpower}`,
    `ค้นพบ Future Nurse ในแบบของฉันที่ คณะพยาบาลศาสตร์ มหาวิทยาลัยมหิดล`,
    ``,
    getHashtagsString(),
  ].join('\n');
}
