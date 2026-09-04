// ── Path IDs (updated: EM→ER, MN→MAT, COM→COMM) ──────────────────────────────
export type PathId = 'PED' | 'MH' | 'ER' | 'OA' | 'MAT' | 'COMM' | 'INT' | 'TECH';

export type CharacterType = 'female_student' | 'male_student';

// ── Trait system ───────────────────────────────────────────────────────────────
export type TraitId = 'EMP' | 'OBS' | 'ACT' | 'COM' | 'COL' | 'INN';

export type StrengthFamily =
  | 'HUMAN_CONNECTION'    // EMP + COM
  | 'CLINICAL_AWARENESS'  // OBS + ACT
  | 'FUTURE_COLLABORATION'; // COL + INN

// ── Path metadata ─────────────────────────────────────────────────────────────
export interface PathInfo {
  id: PathId;
  nameEn: string;
  nameTh: string;
  emoji: string;
  icon: string;
  tagline: string;
  color: string;
  gradient: string;
  accentBg: string;
  badge: string;
  description: string;
  moodTone: string;
  impact: string;
  characterAssetPrefix: string;
}

// ── Question / option models ──────────────────────────────────────────────────
export interface QuestionOption {
  key: string;
  title: string;
  desc?: string;
  emoji?: string;
  icon?: string;
  color?: string;
}

export interface Question {
  id: string;
  step: number;
  category: string;
  categoryTh: string;
  prompt: string;
  subtitle?: string;
  options: QuestionOption[];
}

// ── Quiz state ────────────────────────────────────────────────────────────────
export interface QuizAnswers {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

// ── Profile lookup result ─────────────────────────────────────────────────────
export interface ProfileEntry {
  superpower: string;
  aiSkill: string;
  impact: string;
}

// ── Full result payload ───────────────────────────────────────────────────────
export interface ResultPayload {
  pathId: PathId;
  secondaryPathId: PathId;
  path: PathInfo;
  characterType: CharacterType;
  strengthFamily: StrengthFamily;
  superpower: string;
  aiSkill: string;
  profileImpact: string;
  pathScores: Record<PathId, number>;
  traitScores: Record<TraitId, number>;
  familyScores: Record<StrengthFamily, number>;
  answers: Required<QuizAnswers>;
  timestamp: number;
}
