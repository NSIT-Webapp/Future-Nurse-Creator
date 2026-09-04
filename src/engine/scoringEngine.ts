import pathsData from '../data/paths.json';
import scoringData from '../data/scoring.json';
import profilesData from '../data/profiles.json';
import { PathId, CharacterType, TraitId, StrengthFamily, ResultPayload, QuizAnswers } from '../types';
import { getSessionId } from './sessionManager';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type PathScoring = Record<string, Record<string, Record<string, number>>>;
type TraitScoring = Record<string, Record<string, Record<string, number>>>;

const PATH_IDS = scoringData.pathOrder as PathId[];
const TRAIT_IDS: TraitId[] = ['EMP', 'OBS', 'ACT', 'COM', 'COL', 'INN'];

function zeroPathScores(): Record<PathId, number> {
  const s: Partial<Record<PathId, number>> = {};
  PATH_IDS.forEach(p => { s[p] = 0; });
  return s as Record<PathId, number>;
}

function zeroTraitScores(): Record<TraitId, number> {
  return { EMP: 0, OBS: 0, ACT: 0, COM: 0, COL: 0, INN: 0 };
}

/**
 * Deterministic tie-breaking for path selection.
 * Tie-break order: Q5 → Q1 → Q4 → session-id rotation.
 */
function breakPathTie(tiedPaths: PathId[], answers: Required<QuizAnswers>): PathId {
  const pathScoring = scoringData.pathScoring as PathScoring;
  const tieOrder = scoringData.pathTieBreaker as string[]; // ['q5', 'q1', 'q4']

  for (const qId of tieOrder) {
    const ans = answers[qId as keyof QuizAnswers];
    if (!ans) continue;
    const qRow = pathScoring[qId]?.[ans] ?? {};
    const maxScore = Math.max(...tiedPaths.map(p => qRow[p] ?? 0));
    const survivors = tiedPaths.filter(p => (qRow[p] ?? 0) === maxScore);
    if (survivors.length === 1) return survivors[0];
    tiedPaths = survivors;
  }

  // Final fallback: deterministic rotation via session counter
  const sessionId = getSessionId();
  return tiedPaths[sessionId % tiedPaths.length];
}

/**
 * Deterministic tie-breaking for Strength Family.
 * Tie-break order: Q5 → Q3 → Q2 → Q1 → Q4 → session rotation
 */
function breakStrengthTie(
  tiedFamilies: StrengthFamily[],
  answers: Required<QuizAnswers>,
  familyTraitMap: Record<StrengthFamily, TraitId[]>
): StrengthFamily {
  const traitScoring = scoringData.traitScoring as TraitScoring;
  const tieOrder = scoringData.strengthTieBreaker as string[]; // ['q5','q3','q2','q1','q4']

  for (const qId of tieOrder) {
    const ans = answers[qId as keyof QuizAnswers];
    if (!ans) continue;
    const qRow = traitScoring[qId]?.[ans] ?? {};

    // Score each family by summing its constituent traits for this answer
    const familyScoreForQ = (fam: StrengthFamily): number =>
      familyTraitMap[fam].reduce((sum, t) => sum + (qRow[t] ?? 0), 0);

    const maxScore = Math.max(...tiedFamilies.map(familyScoreForQ));
    const survivors = tiedFamilies.filter(f => familyScoreForQ(f) === maxScore);
    if (survivors.length === 1) return survivors[0];
    tiedFamilies = survivors;
  }

  const sessionId = getSessionId();
  return tiedFamilies[sessionId % tiedFamilies.length];
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function calculateResult(
  answers: Required<QuizAnswers>,
  characterType: CharacterType
): ResultPayload {
  const pathScoring = scoringData.pathScoring as PathScoring;
  const traitScoring = scoringData.traitScoring as TraitScoring;

  // 1. Accumulate path scores
  const pathScores = zeroPathScores();
  const QUESTIONS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

  for (const qId of QUESTIONS) {
    const ans = answers[qId];
    if (!ans) continue;
    const qMap = pathScoring[qId]?.[ans] ?? {};
    for (const p of PATH_IDS) {
      pathScores[p] += qMap[p] ?? 0;
    }
  }

  // 2. Accumulate trait scores
  const traitScores = zeroTraitScores();
  for (const qId of QUESTIONS) {
    const ans = answers[qId];
    if (!ans) continue;
    const qMap = traitScoring[qId]?.[ans] ?? {};
    for (const t of TRAIT_IDS) {
      traitScores[t] += qMap[t] ?? 0;
    }
  }

  // 3. Compute Strength Family scores
  const familyTraitMap: Record<StrengthFamily, TraitId[]> = {
    HUMAN_CONNECTION:    ['EMP', 'COM'],
    CLINICAL_AWARENESS:  ['OBS', 'ACT'],
    FUTURE_COLLABORATION:['COL', 'INN'],
  };
  const FAMILIES: StrengthFamily[] = ['HUMAN_CONNECTION', 'CLINICAL_AWARENESS', 'FUTURE_COLLABORATION'];

  const familyScores: Record<StrengthFamily, number> = {
    HUMAN_CONNECTION: traitScores.EMP + traitScores.COM,
    CLINICAL_AWARENESS: traitScores.OBS + traitScores.ACT,
    FUTURE_COLLABORATION: traitScores.COL + traitScores.INN,
  };

  // 4. Select primary path (deterministic)
  const maxPathScore = Math.max(...PATH_IDS.map(p => pathScores[p]));
  let topPaths = PATH_IDS.filter(p => pathScores[p] === maxPathScore);
  const primaryPathId: PathId = topPaths.length === 1
    ? topPaths[0]
    : breakPathTie(topPaths, answers);

  // 5. Select secondary path (second highest, excluding primary)
  const remainingPaths = PATH_IDS.filter(p => p !== primaryPathId);
  const maxSecScore = Math.max(...remainingPaths.map(p => pathScores[p]));
  let topSecPaths = remainingPaths.filter(p => pathScores[p] === maxSecScore);
  const secondaryPathId: PathId = topSecPaths.length === 1
    ? topSecPaths[0]
    : breakPathTie(topSecPaths, answers);

  // 6. Select strength family (deterministic)
  const maxFamilyScore = Math.max(...FAMILIES.map(f => familyScores[f]));
  let topFamilies = FAMILIES.filter(f => familyScores[f] === maxFamilyScore);
  const strengthFamily: StrengthFamily = topFamilies.length === 1
    ? topFamilies[0]
    : breakStrengthTie(topFamilies, answers, familyTraitMap);

  // 7. Lookup profile (Superpower, AI Skill, Impact)
  const profileEntry = (profilesData as any)[primaryPathId]?.[strengthFamily] ?? {
    superpower: 'Future Nurse',
    aiSkill: 'Healthcare AI Creator',
    impact: 'เปลี่ยนการดูแลสุขภาพสู่อนาคตที่ดีกว่า',
  };

  // 8. Load path info; apply MAT + male character fallback
  const pathInfo = (pathsData.paths as any)[primaryPathId];

  // Visual availability rule: MAT has no male character asset
  // → use COMM male character for rendering (visual only, scoring unchanged)
  const effectiveAssetPrefix: string =
    primaryPathId === 'MAT' && characterType === 'male_student'
      ? 'COMM'
      : pathInfo.characterAssetPrefix;

  // Attach the effective asset prefix as a runtime property (non-breaking)
  const pathInfoWithAsset = { ...pathInfo, effectiveAssetPrefix };

  return {
    pathId: primaryPathId,
    secondaryPathId,
    path: pathInfoWithAsset,
    characterType,
    strengthFamily,
    superpower: profileEntry.superpower,
    aiSkill: profileEntry.aiSkill,
    profileImpact: profileEntry.impact,
    pathScores,
    traitScores,
    familyScores,
    answers,
    timestamp: Date.now(),
  };
}
