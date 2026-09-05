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

  // ── Finish screen assets ────────────────────────────────────────────────────
  finish: {
    hero: '/assets/finish/finish-hero.jpg',
    campusBg: '/assets/finish/campus-bg.jpg',
    duoNurses: '/assets/finish/duo-nurses.png',
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

  // ── Scene Backgrounds (per Nursing Path) ──────────────────────────────────
  scenes: {
    PED:  '/assets/scenes/PED.jpg',
    MH:   '/assets/scenes/MH.jpg',
    ER:   '/assets/scenes/ER.jpg',
    OA:   '/assets/scenes/OA.jpg',
    MAT:  '/assets/scenes/MAT.jpg',
    COMM: '/assets/scenes/COMM.jpg',
    INT:  '/assets/scenes/INT.jpg',
    TECH: '/assets/scenes/TECH.jpg',
  },

  // ── Official Future Nurse Card Templates (9:16 aspect ratio 576×1024) ──────
  cards: {
    backgroundOverlay: PLACEHOLDER('cards/background-overlay'),
    templates: {
      PED:  { female: '/assets/cards/PED_female.jpg',  male: '/assets/cards/PED_male.jpg'   },
      MH:   { female: '/assets/cards/MH_female.jpg',   male: '/assets/cards/MH_male.jpg'    },
      ER:   { female: '/assets/cards/ER_female.jpg',   male: '/assets/cards/ER_male.jpg'    },
      OA:   { female: '/assets/cards/OA_female.jpg',   male: '/assets/cards/OA_male.jpg'    },
      MAT:  { female: '/assets/cards/MAT_female.jpg',  male: '/assets/cards/MAT_female.jpg' },
      COMM: { female: '/assets/cards/COMM_female.jpg', male: '/assets/cards/COMM_male.jpg'  },
      INT:  { female: '/assets/cards/INT_female.jpg',  male: '/assets/cards/INT_female.jpg' },
      TECH: { female: '/assets/cards/TECH_female.jpg', male: '/assets/cards/TECH_male.jpg'  },
    },
  },

  // ── Processing / Analysis screen (2 visual versions based on selected look) ──
  processing: {
    background:  '/assets/processing/background.png',
    innerCardBg: '/assets/processing/inner-card-bg.png',
    female:      '/assets/processing/character-female-half.png',
    male:        '/assets/processing/character-male-half.png',
    robot:       '/assets/processing/ai-robot.png',
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
  reveal: {
    background: '/assets/reveal/background.png',
    PED:  { female: '/characters/PED_female.png',  male: '/characters/PED_male.png'  },
    MH:   { female: '/characters/MH_female.png',   male: '/characters/MH_male.png'   },
    ER:   { female: '/characters/ER_female.png',   male: '/characters/ER_male.png'   },
    OA:   { female: '/characters/OA_female.png',   male: '/characters/OA_male.png'   },
    MAT:  { female: '/characters/MAT_female.png',  male: '/characters/COMM_male.png' },
    COMM: { female: '/characters/COMM_female.png', male: '/characters/COMM_male.png' },
    INT:  { female: '/characters/INT_female.png',  male: '/characters/INT_male.png'  },
    TECH: { female: '/characters/TECH_female.png', male: '/characters/TECH_male.png' },
  },

  // ── Icons / decorative ───────────────────────────────────────────────────────
  icons: {
    sparkle:   PLACEHOLDER('icons/sparkle'),
    nsmuBadge: PLACEHOLDER('icons/nsmu-badge'),
  },

} as const;

// ── Type helpers ──────────────────────────────────────────────────────────────

export type CharacterPathKey = keyof typeof ASSETS.characters;
export type RevealPathKey     = Exclude<keyof typeof ASSETS.reveal, 'background'>;
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

// ── Reveal Floating Stickers ──────────────────────────────────────────────────

export interface RevealStickerConfig {
  id: string;
  name: string;
  src: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size: number;
  animationDelay?: string;
  animationDuration?: string;
  rotate?: string;
  zIndex?: number;
}

const REVEAL_STICKERS_MAP: Record<string, RevealStickerConfig[]> = {
  PED: [
    { id: 'steth', name: 'Stethoscope', src: '/assets/reveal/stickers/PED/stethoscope-child.png', position: { top: '6%', left: '3%' }, size: 92, rotate: '-12deg', animationDelay: '0.4s' },
    { id: 'rings', name: 'Stacking Rings', src: '/assets/reveal/stickers/PED/toy-stacking-rings.png', position: { top: '5%', right: '4%' }, size: 88, rotate: '12deg', animationDelay: '1.2s' },
    { id: 'star_blue', name: 'Star Smile', src: '/assets/reveal/stickers/PED/star-blue-smile.png', position: { top: '38%', left: '1%' }, size: 60, rotate: '-8deg', animationDelay: '1.8s' },
    { id: 'star_yellow', name: 'Star Gold', src: '/assets/reveal/stickers/PED/star-yellow.png', position: { top: '35%', right: '2%' }, size: 58, rotate: '15deg', animationDelay: '0.8s' },
    { id: 'bear', name: 'Teddy Bear', src: '/assets/reveal/stickers/PED/teddy-bear.png', position: { bottom: '4%', left: '2%' }, size: 108, rotate: '-6deg', animationDelay: '0s' },
    { id: 'cube', name: 'Block Cube', src: '/assets/reveal/stickers/PED/toy-block-cube.png', position: { bottom: '5%', right: '3%' }, size: 82, rotate: '14deg', animationDelay: '2.2s' },
  ],
  MH: [
    { id: 'bubble', name: 'Speech Heart', src: '/assets/reveal/stickers/MH/speech-bubble-heart-purple.png', position: { top: '6%', left: '3%' }, size: 94, rotate: '-10deg', animationDelay: '0.2s' },
    { id: 'brain', name: 'Brain Smile', src: '/assets/reveal/stickers/MH/brain-smile.png', position: { top: '5%', right: '4%' }, size: 96, rotate: '8deg', animationDelay: '1.0s' },
    { id: 'heart_p', name: 'Purple Heart', src: '/assets/reveal/stickers/MH/heart-purple.png', position: { top: '36%', left: '2%' }, size: 66, rotate: '-6deg', animationDelay: '1.6s' },
    { id: 'sparkles', name: 'Sparkles Glow', src: '/assets/reveal/stickers/MH/sparkles-glow.png', position: { top: '35%', right: '2%' }, size: 64, rotate: '12deg', animationDelay: '0.6s' },
    { id: 'heart_smile', name: 'Heart Smile', src: '/assets/reveal/stickers/MH/heart-smile.png', position: { bottom: '5%', left: '3%' }, size: 88, rotate: '-8deg', animationDelay: '2.0s' },
    { id: 'zen', name: 'Zen Stones', src: '/assets/reveal/stickers/MH/zen-stones.png', position: { bottom: '4%', right: '3%' }, size: 98, rotate: '6deg', animationDelay: '0s' },
  ],
  ER: [
    { id: 'siren', name: 'Siren Red', src: '/assets/reveal/stickers/ER/siren-red.png', position: { top: '5%', left: '2%' }, size: 98, rotate: '-14deg', animationDelay: '0.1s' },
    { id: 'star_life', name: 'Star of Life', src: '/assets/reveal/stickers/ER/star-of-life.png', position: { top: '5%', right: '4%' }, size: 90, rotate: '10deg', animationDelay: '0.9s' },
    { id: 'sparkles', name: 'Gold Sparkles', src: '/assets/reveal/stickers/ER/sparkles-gold.png', position: { top: '38%', left: '1%' }, size: 56, rotate: '-5deg', animationDelay: '1.7s' },
    { id: 'ecg', name: 'Heart ECG', src: '/assets/reveal/stickers/ER/heart-ecg.png', position: { top: '34%', right: '2%' }, size: 88, rotate: '12deg', animationDelay: '1.1s' },
    { id: 'first_aid', name: 'First Aid Box', src: '/assets/reveal/stickers/ER/first-aid-box-red.png', position: { bottom: '4%', left: '2%' }, size: 98, rotate: '-8deg', animationDelay: '0s' },
    { id: 'clock', name: 'Clock 24/7', src: '/assets/reveal/stickers/ER/clock-24-7.png', position: { bottom: '5%', right: '3%' }, size: 90, rotate: '12deg', animationDelay: '2.1s' },
  ],
  OA: [
    { id: 'heart_green', name: 'Heart Green', src: '/assets/reveal/stickers/OA/heart-green.png', position: { top: '5%', left: '3%' }, size: 92, rotate: '-8deg', animationDelay: '0.3s' },
    { id: 'elderly', name: 'Elderly Walking', src: '/assets/reveal/stickers/OA/elderly-walking.png', position: { top: '5%', right: '4%' }, size: 92, rotate: '8deg', animationDelay: '1.1s' },
    { id: 'leaves', name: 'Green Leaves', src: '/assets/reveal/stickers/OA/leaves-green.png', position: { bottom: '12%', left: '3%' }, size: 76, rotate: '-15deg', animationDelay: '1.8s' },
    { id: 'tea', name: 'Tea Cup', src: '/assets/reveal/stickers/OA/tea-cup.png', position: { top: '32%', left: '2%' }, size: 90, rotate: '-10deg', animationDelay: '0s' },
    { id: 'plant', name: 'Potted Plant', src: '/assets/reveal/stickers/OA/potted-plant-ceramic.png', position: { top: '36%', right: '3%' }, size: 92, rotate: '10deg', animationDelay: '2.3s' },
    { id: 'house', name: 'House Green', src: '/assets/reveal/stickers/OA/house-green.png', position: { bottom: '5%', right: '3%' }, size: 98, rotate: '8deg', animationDelay: '0.7s' },
  ],
  MAT: [
    { id: 'pregnant', name: 'Pregnant Mother', src: '/assets/reveal/stickers/MAT/pregnant-mother.png', position: { top: '5%', left: '3%' }, size: 98, rotate: '-8deg', animationDelay: '0.2s' },
    { id: 'baby_heart', name: 'Baby In Heart', src: '/assets/reveal/stickers/MAT/baby-in-heart.png', position: { top: '5%', right: '4%' }, size: 98, rotate: '8deg', animationDelay: '1.0s' },
    { id: 'sparkles', name: 'Pink Gold Sparkles', src: '/assets/reveal/stickers/MAT/sparkles-pink-gold.png', position: { top: '36%', left: '2%' }, size: 56, rotate: '-6deg', animationDelay: '1.6s' },
    { id: 'footprints', name: 'Baby Footprints', src: '/assets/reveal/stickers/MAT/baby-footprints.png', position: { top: '34%', right: '3%' }, size: 72, rotate: '14deg', animationDelay: '0.8s' },
    { id: 'bottle', name: 'Baby Bottle', src: '/assets/reveal/stickers/MAT/baby-bottle.png', position: { bottom: '4%', left: '3%' }, size: 92, rotate: '-12deg', animationDelay: '0s' },
    { id: 'pacifier', name: 'Pacifier', src: '/assets/reveal/stickers/MAT/baby-pacifier.png', position: { bottom: '5%', right: '3%' }, size: 84, rotate: '12deg', animationDelay: '2.2s' },
  ],
  COMM: [
    { id: 'house', name: 'House Heart', src: '/assets/reveal/stickers/COMM/house-heart.png', position: { top: '5%', left: '3%' }, size: 98, rotate: '-8deg', animationDelay: '0.2s' },
    { id: 'family', name: 'Family Heart', src: '/assets/reveal/stickers/COMM/family-heart.png', position: { top: '5%', right: '4%' }, size: 98, rotate: '8deg', animationDelay: '1.0s' },
    { id: 'pin', name: 'Location Pin', src: '/assets/reveal/stickers/COMM/location-pin.png', position: { top: '33%', left: '3%' }, size: 76, rotate: '8deg', animationDelay: '0.8s' },
    { id: 'heart_pink', name: 'Pink Heart', src: '/assets/reveal/stickers/COMM/heart-pink.png', position: { top: '34%', right: '5%' }, size: 68, rotate: '12deg', animationDelay: '1.4s' },
    { id: 'plant', name: 'Potted Plant', src: '/assets/reveal/stickers/COMM/potted-plant.png', position: { bottom: '5%', left: '2%' }, size: 94, rotate: '10deg', animationDelay: '2.3s' },
    { id: 'kit', name: 'First Aid Kit', src: '/assets/reveal/stickers/COMM/first-aid-kit.png', position: { bottom: '5%', right: '3%' }, size: 94, rotate: '-8deg', animationDelay: '0s' },
  ],
  INT: [
    { id: 'plane', name: 'Airplane', src: '/assets/reveal/stickers/INT/airplane.png', position: { top: '5%', left: '2%' }, size: 115, rotate: '-14deg', animationDelay: '0.1s' },
    { id: 'globe', name: 'Globe', src: '/assets/reveal/stickers/INT/globe.png', position: { top: '5%', right: '3%' }, size: 102, rotate: '10deg', animationDelay: '0.9s' },
    { id: 'bubbles', name: 'Speech Bubbles', src: '/assets/reveal/stickers/INT/speech-bubbles.png', position: { bottom: '16%', left: '3%' }, size: 86, rotate: '-6deg', animationDelay: '1.7s' },
    { id: 'handshake', name: 'Handshake', src: '/assets/reveal/stickers/INT/handshake.png', position: { top: '34%', right: '3%' }, size: 90, rotate: '8deg', animationDelay: '2.2s' },
    { id: 'pin', name: 'Location Pin Pink', src: '/assets/reveal/stickers/INT/location-pin-pink.png', position: { top: '34%', left: '10%' }, size: 60, rotate: '12deg', animationDelay: '0.8s' },
    { id: 'passport', name: 'Passport & Tickets', src: '/assets/reveal/stickers/INT/passport-tickets.png', position: { bottom: '5%', right: '3%' }, size: 98, rotate: '-8deg', animationDelay: '0s' },
  ],
  TECH: [
    { id: 'robot', name: 'AI Robot', src: '/assets/reveal/stickers/TECH/ai-robot.png', position: { top: '5%', left: '3%' }, size: 98, rotate: '-8deg', animationDelay: '0.2s' },
    { id: 'chip', name: 'AI Chip', src: '/assets/reveal/stickers/TECH/chip-ai.png', position: { top: '5%', right: '4%' }, size: 92, rotate: '10deg', animationDelay: '1.0s' },
    { id: 'cloud', name: 'Cloud Upload', src: '/assets/reveal/stickers/TECH/cloud-upload.png', position: { top: '34%', left: '2%' }, size: 76, rotate: '-8deg', animationDelay: '1.7s' },
    { id: 'datacube', name: 'Data Cube', src: '/assets/reveal/stickers/TECH/data-cube.png', position: { top: '34%', right: '3%' }, size: 76, rotate: '12deg', animationDelay: '0.7s' },
    { id: 'monitor', name: 'ECG Monitor', src: '/assets/reveal/stickers/TECH/monitor-ecg.png', position: { bottom: '5%', left: '3%' }, size: 94, rotate: '-10deg', animationDelay: '0s' },
    { id: 'hud', name: 'HUD Vitals', src: '/assets/reveal/stickers/TECH/hud-vitals.png', position: { bottom: '5%', right: '2%' }, size: 102, rotate: '8deg', animationDelay: '2.2s' },
  ],
};

/**
 * Returns the list of 3D floating stickers configured for a specific nursing path.
 */
export function getRevealStickers(pathId: string): RevealStickerConfig[] {
  return REVEAL_STICKERS_MAP[pathId] || [];
}

// ── Convenience lookups ───────────────────────────────────────────────────────

// ── Convenience lookups ───────────────────────────────────────────────────────

/**
 * Returns the card scene background URL for a given Nursing Path.
 */
export function getCardSceneUrl(pathId: string): string {
  const entry = (ASSETS.scenes as Record<string, string>)[pathId];
  return entry || '';
}

/**
 * Returns the card character asset URL for a given Nursing Path and gender.
 */
export function getCardCharacterUrl(pathId: string, gender: 'female' | 'male'): string {
  const entry = ASSETS.characters[pathId as CharacterPathKey];
  return entry ? entry[gender] : '';
}

/**
 * Returns the official card template URL for a given Nursing Path and gender.
 */
export function getCardTemplateUrl(pathId: string, gender: 'female' | 'male' | string = 'female'): string {
  const g: 'female' | 'male' = gender.startsWith('female') ? 'female' : 'male';
  const entry = (ASSETS.cards.templates as Record<string, { female: string; male?: string }>)[pathId];
  if (!entry) return '';
  return entry[g] || entry.female || '';
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

/**
 * Eagerly preloads all analyzing/processing screen assets into browser cache
 * to ensure zero-latency rendering when navigating from Character Select to Analyzing.
 */
export function preloadProcessingAssets(): void {
  if (typeof window === 'undefined' || typeof Image === 'undefined') return;
  const urls = [
    ASSETS.processing.background,
    ASSETS.processing.innerCardBg,
    ASSETS.processing.female,
    ASSETS.processing.male,
    ASSETS.processing.robot,
    ...getProcessingBadges('female_student').map(b => b.imgUrl),
    ...getProcessingBadges('male_student').map(b => b.imgUrl),
  ];
  urls.forEach(url => {
    if (url && !isPlaceholder(url)) {
      const img = new Image();
      img.src = url;
    }
  });
}

/**
 * Eagerly preloads reveal screen background and selected assets.
 */
export function preloadRevealAssets(): void {
  if (typeof window === 'undefined' || typeof Image === 'undefined') return;
  const urls = [
    ASSETS.reveal.background,
    ...Object.values(ASSETS.reveal).flatMap(entry => (
      typeof entry === 'string' ? [entry] : [entry.female, entry.male]
    )),
    ...Object.values(ASSETS.characters).flatMap(c => [c.female, c.male]),
  ];
  urls.forEach(url => {
    if (url && !isPlaceholder(url)) {
      const img = new Image();
      img.src = url;
    }
  });
}
