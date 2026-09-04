/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CENTRALIZED ASSET REGISTRY — Future Nurse Creator
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * ALL image/asset paths live here.
 *
 * To swap an asset when the final image arrives:
 *   1. Update only this file.
 *   2. Components and the card renderer read from here — no layout changes needed.
 *
 * Placeholder convention:
 *   Pending assets use PLACEHOLDER('label') → "__PLACEHOLDER__label"
 *   <AssetImage> component and isPlaceholder() detect this sentinel and render
 *   a labelled dev-only placeholder box instead of a broken <img>.
 *
 * Final asset convention:
 *   Replace PLACEHOLDER('...') with the real relative URL, e.g. '/assets/home/bg.webp'
 * ══════════════════════════════════════════════════════════════════════════════
 */

// ── Direct Vite Static Asset Imports (Guarantees content-hashed bundling & cache busting) ──
import q1Img from './questions/q1.png';
import q2Img from './questions/q2.png';
import q3Img from './questions/q3.png';
import q4Img from './questions/q4.png';
import q5Img from './questions/q5.png';

// ── Internal helper ───────────────────────────────────────────────────────────
const PLACEHOLDER = (label: string): string => `__PLACEHOLDER__${label}`;

// ── Registry ─────────────────────────────────────────────────────────────────

export const ASSETS = {

  // ── Branding ────────────────────────────────────────────────────────────────
  branding: {
    logoFaculty:  PLACEHOLDER('branding/nsmu-logo'),
    logoMahidol:  PLACEHOLDER('branding/mahidol-logo'),
    wordmark:     PLACEHOLDER('branding/future-nurse-creator-wordmark'),
  },

  // ── Home screen modular assets ─────────────────────────────────────────────
  home: {
    // Primary separated layers (integrated from newly provided assets):
    background:        '/assets/home/background.jpg',
    characterMale:     '/assets/home/character-male.png',
    characterFemale:   '/assets/home/character-female.png',
    titleWordmark:     '/assets/home/title-wordmark.png',
    mascot:            '/assets/home/mascot.png',
    hero:              '/assets/home/home-hero.png',

    // Granular modular slots (ready for progressive incoming assets):
    titleBadge:        PLACEHOLDER('home/title-badge'),
    decorativeIcons:   PLACEHOLDER('home/decorative-icons'),
    ctaRocket:         PLACEHOLDER('home/cta-rocket'),
    stepIcon1:         PLACEHOLDER('home/step-icon-1'),
    stepIcon2:         PLACEHOLDER('home/step-icon-2'),
    stepIcon3:         PLACEHOLDER('home/step-icon-3'),
    universityLogo:    '/assets/home/faculty-logo.png',
    facultyLogo:       '/assets/home/faculty-logo.png',
    mahidolSeal:       '/assets/home/mahidol-seal.png',
    bgmTrack:          '/audio/bgm.mp3',
  },

  // ── Choose Future Look screen ────────────────────────────────────────────────
  characterSelect: {
    background:      '/assets/home/background.jpg',
    femaleThumbnail: '/assets/character-select/character-female.png',
    maleThumbnail:   '/assets/character-select/character-male.png',
  },

  // ── Question character illustrations (Q1–Q5) ────────────────────────────────
  // INDEPENDENT of Future Look selection.
  // These are presenter/illustration images fixed per question — not per player.
  // Replace each PLACEHOLDER with the final asset path when ready.
  questions: {
    nursePresenter: q1Img,
    q1: q1Img,
    q2: q2Img,
    q3: q3Img,
    q4: q4Img,
    q5: q5Img,
  },

  // ── Card character illustrations (per Nursing Path × gender) ─────────────────
  // Used by: cardRenderer.ts, CardPreviewView
  // MAT has no male character asset → mapped to COMM male as fallback.
  characters: {
    PED:  { female: '/characters/PED_female.png',  male: '/characters/PED_male.png'  },
    MH:   { female: '/characters/MH_female.png',   male: '/characters/MH_male.png'   },
    ER:   { female: '/characters/ER_female.png',   male: '/characters/ER_male.png'   },
    OA:   { female: '/characters/OA_female.png',   male: '/characters/OA_male.png'   },
    MAT:  { female: '/characters/MAT_female.png',  male: '/characters/COMM_male.png' },
    COMM: { female: '/characters/COMM_female.png', male: '/characters/COMM_male.png' },
    INT:  { female: '/characters/INT_female.png',  male: '/characters/INT_male.png'  },
    TECH: { female: '/characters/TECH_female.png', male: '/characters/TECH_male.png' },
  },

  // ── Processing / Analysis screen (2 visual versions based on selected look) ──
  processing: {
    background: '/assets/processing/background.png',
    female:     '/assets/processing/character-female.png',
    male:       '/assets/processing/character-male.png',
    robot:      '/assets/processing/ai-robot.png',
    badges: {
      female: {
        PED:  '/assets/processing/badges/female/PED.png',
        MH:   '/assets/processing/badges/female/MH.png',
        ER:   '/assets/processing/badges/female/ER.png',
        OA:   '/assets/processing/badges/female/OA.png',
        MAT:  '/assets/processing/badges/female/MAT.png',
        COMM: '/assets/processing/badges/female/COMM.png',
        INT:  '/assets/processing/badges/female/INT.png',
        TECH: '/assets/processing/badges/female/TECH.png',
      },
      male: {
        PED:  '/assets/processing/badges/male/PED.png',
        MH:   '/assets/processing/badges/male/MH.png',
        ER:   '/assets/processing/badges/male/ER.png',
        OA:   '/assets/processing/badges/male/OA.png',
        COMM: '/assets/processing/badges/male/COMM.png',
        INT:  '/assets/processing/badges/male/INT.png',
        TECH: '/assets/processing/badges/male/TECH.png',
      },
    },
  },

  // ── Reveal screen artwork (8 Nursing Paths × 2 Looks = 16 outcomes) ─────────
  // Each path has 1 Female reveal character and 1 Male reveal character.
  // Conceptually connected to the Card character, but presentation moment asset.
  reveal: {
    PED:  { female: PLACEHOLDER('reveal/PED_female'),  male: PLACEHOLDER('reveal/PED_male')  },
    MH:   { female: PLACEHOLDER('reveal/MH_female'),   male: PLACEHOLDER('reveal/MH_male')   },
    ER:   { female: PLACEHOLDER('reveal/ER_female'),   male: PLACEHOLDER('reveal/ER_male')   },
    OA:   { female: PLACEHOLDER('reveal/OA_female'),   male: PLACEHOLDER('reveal/OA_male')   },
    MAT:  { female: PLACEHOLDER('reveal/MAT_female'),  male: PLACEHOLDER('reveal/MAT_male')  },
    COMM: { female: PLACEHOLDER('reveal/COMM_female'), male: PLACEHOLDER('reveal/COMM_male') },
    INT:  { female: PLACEHOLDER('reveal/INT_female'),  male: PLACEHOLDER('reveal/INT_male')  },
    TECH: { female: PLACEHOLDER('reveal/TECH_female'), male: PLACEHOLDER('reveal/TECH_male') },
  },

  // ── Card template ────────────────────────────────────────────────────────────
  cards: {
    backgroundOverlay: PLACEHOLDER('cards/background-overlay'),
  },

  // ── Icons / decorative ───────────────────────────────────────────────────────
  icons: {
    sparkle:   PLACEHOLDER('icons/sparkle'),
    nsmuBadge: PLACEHOLDER('icons/nsmu-badge'),
  },

} as const;

// ── Type helpers ──────────────────────────────────────────────────────────────

export type CharacterPathKey = keyof typeof ASSETS.characters;
export type RevealPathKey     = keyof typeof ASSETS.reveal;
export type QuestionCharKey   = keyof typeof ASSETS.questions;

// ── Status helpers ────────────────────────────────────────────────────────────

/** Returns true if the path is still a development placeholder. */
export function isPlaceholder(path: string): boolean {
  return typeof path === 'string' && path.startsWith('__PLACEHOLDER__');
}

/** Returns a human-readable label from a placeholder path. */
export function placeholderLabel(path: string): string {
  return path.replace('__PLACEHOLDER__', '');
}

// ── Convenience lookups ───────────────────────────────────────────────────────

/**
 * Returns the card character asset URL for a given Nursing Path and gender.
 */
export function getCardCharacterUrl(pathId: string, gender: 'female' | 'male'): string {
  const entry = ASSETS.characters[pathId as CharacterPathKey];
  return entry ? entry[gender] : '';
}

/**
 * Returns the question character asset URL for a 1-based question step.
 * NOT tied to Future Look selection.
 */
export function getQuestionCharacterUrl(step: 1 | 2 | 3 | 4 | 5): string {
  const key = `q${step}` as QuestionCharKey;
  return ASSETS.questions[key];
}

/**
 * Returns the processing visual artwork URL for the selected look.
 */
export function getProcessingArtworkUrl(gender: 'female' | 'male' | string): string {
  const g: 'female' | 'male' = gender.startsWith('female') ? 'female' : 'male';
  return ASSETS.processing[g];
}

/**
 * Returns the reveal artwork URL for a given Nursing Path and look (16 variants).
 */
export function getRevealArtworkUrl(pathId: string, gender: 'female' | 'male' | string = 'female'): string {
  const g: 'female' | 'male' = gender.startsWith('female') ? 'female' : 'male';
  const entry = ASSETS.reveal[pathId as RevealPathKey];
  return entry ? entry[g] : PLACEHOLDER(`reveal/${pathId}_${g}`);
}

export interface ProcessingBadgeItem {
  pathId: string;
  titleEn: string;
  imgUrl: string;
}

/**
 * Returns list of badges for the analyzing screen (8 for female, 7 for male).
 */
export function getProcessingBadges(gender: 'female' | 'male' | string = 'female'): ProcessingBadgeItem[] {
  const isFemale = gender.startsWith('female');
  if (isFemale) {
    return [
      { pathId: 'PED',  titleEn: 'PEDIATRIC NURSE',         imgUrl: ASSETS.processing.badges.female.PED },
      { pathId: 'MH',   titleEn: 'MENTAL HEALTH NURSE',      imgUrl: ASSETS.processing.badges.female.MH },
      { pathId: 'ER',   titleEn: 'EMERGENCY NURSE',          imgUrl: ASSETS.processing.badges.female.ER },
      { pathId: 'OA',   titleEn: 'OLDER ADULT NURSE',        imgUrl: ASSETS.processing.badges.female.OA },
      { pathId: 'MAT',  titleEn: 'MATERNAL & NEWBORN NURSE', imgUrl: ASSETS.processing.badges.female.MAT },
      { pathId: 'COMM', titleEn: 'COMMUNITY NURSE',          imgUrl: ASSETS.processing.badges.female.COMM },
      { pathId: 'INT',  titleEn: 'INTERNATIONAL NURSE',      imgUrl: ASSETS.processing.badges.female.INT },
      { pathId: 'TECH', titleEn: 'NURSING + TECHNOLOGY',     imgUrl: ASSETS.processing.badges.female.TECH },
    ];
  } else {
    return [
      { pathId: 'PED',  titleEn: 'PEDIATRIC NURSE',     imgUrl: ASSETS.processing.badges.male.PED },
      { pathId: 'MH',   titleEn: 'MENTAL HEALTH NURSE',  imgUrl: ASSETS.processing.badges.male.MH },
      { pathId: 'ER',   titleEn: 'EMERGENCY NURSE',      imgUrl: ASSETS.processing.badges.male.ER },
      { pathId: 'OA',   titleEn: 'OLDER ADULT NURSE',    imgUrl: ASSETS.processing.badges.male.OA },
      { pathId: 'COMM', titleEn: 'COMMUNITY NURSE',      imgUrl: ASSETS.processing.badges.male.COMM },
      { pathId: 'INT',  titleEn: 'INTERNATIONAL NURSE',  imgUrl: ASSETS.processing.badges.male.INT },
      { pathId: 'TECH', titleEn: 'NURSING + TECHNOLOGY', imgUrl: ASSETS.processing.badges.male.TECH },
    ];
  }
}

