import { PathId, ResultPayload, StrengthFamily } from '../types';

type IdentityTone = {
  archetype: string;
  thName: string;
  traitLine: string;
};

const PATH_FALLBACK: Record<PathId, IdentityTone> = {
  PED: {
    archetype: 'Little Hearts Guardian',
    thName: 'ผู้พิทักษ์หัวใจดวงเล็ก',
    traitLine: 'Gentle care for brave little hearts',
  },
  MH: {
    archetype: 'Safe Space Maker',
    thName: 'ผู้สร้างพื้นที่ปลอดภัยทางใจ',
    traitLine: 'Listening deeply, healing gently',
  },
  ER: {
    archetype: 'Calm Action Hero',
    thName: 'ฮีโร่แห่งสติในวินาทีสำคัญ',
    traitLine: 'Ready, steady, life-saving care',
  },
  OA: {
    archetype: 'Dignity Care Guardian',
    thName: 'ผู้ดูแลชีวิตอย่างมีศักดิ์ศรี',
    traitLine: 'Warm support for confident aging',
  },
  MAT: {
    archetype: 'New Beginnings Guardian',
    thName: 'ผู้ดูแลจุดเริ่มต้นของชีวิต',
    traitLine: 'Gentle care from the very first breath',
  },
  COMM: {
    archetype: 'Health for All Connector',
    thName: 'ผู้เชื่อมสุขภาพถึงทุกชุมชน',
    traitLine: 'Care that reaches every home',
  },
  INT: {
    archetype: 'Global Care Bridge',
    thName: 'สะพานการดูแลไร้พรมแดน',
    traitLine: 'Connecting cultures through care',
  },
  TECH: {
    archetype: 'Care Innovation Builder',
    thName: 'ผู้สร้างนวัตกรรมเพื่อการดูแล',
    traitLine: 'Smarter tools, more human care',
  },
};

const FAMILY_VARIANTS: Record<StrengthFamily, Partial<Record<PathId, IdentityTone>>> = {
  HUMAN_CONNECTION: {
    PED: { archetype: 'Little Hearts Guardian', thName: 'ผู้พิทักษ์หัวใจดวงเล็ก', traitLine: 'Communication that turns care into comfort' },
    MH: { archetype: 'Safe Space Maker', thName: 'ผู้สร้างพื้นที่ปลอดภัยทางใจ', traitLine: 'Empathy that helps people feel seen' },
    ER: { archetype: 'First Response Heart', thName: 'หัวใจแนวหน้าในเวลาวิกฤต', traitLine: 'Fast decisions with a human touch' },
    OA: { archetype: 'Warm Dignity Guardian', thName: 'ผู้ดูแลศักดิ์ศรีด้วยความอบอุ่น', traitLine: 'Compassion that makes aging feel secure' },
    MAT: { archetype: 'New Beginnings Guardian', thName: 'ผู้ดูแลจุดเริ่มต้นของชีวิต', traitLine: 'Reassurance for every new family' },
    COMM: { archetype: 'Community Heart Connector', thName: 'หัวใจที่เชื่อมทุกชุมชน', traitLine: 'Care that feels close, kind, and reachable' },
    INT: { archetype: 'Global Care Bridge', thName: 'สะพานการดูแลไร้พรมแดน', traitLine: 'Cross-cultural care with confidence' },
    TECH: { archetype: 'Human-Centered Innovator', thName: 'นักนวัตกรรมที่เข้าใจคน', traitLine: 'Technology shaped by empathy' },
  },
  CLINICAL_AWARENESS: {
    PED: { archetype: 'Tiny Signs Detective', thName: 'นักสังเกตสัญญาณเล็กของเด็ก', traitLine: 'Small details, safer child care' },
    MH: { archetype: 'Emotional Insight Keeper', thName: 'ผู้มองเห็นสัญญาณลึกในใจ', traitLine: 'Noticing what feelings cannot say' },
    ER: { archetype: 'Calm Under Pressure', thName: 'ผู้มีสติในทุกวินาทีฉุกเฉิน', traitLine: 'Clear judgment when time matters most' },
    OA: { archetype: 'Active Aging Sentinel', thName: 'ผู้เฝ้าดูแลวัยสูงอายุอย่างรอบคอบ', traitLine: 'Early insight for safer aging' },
    MAT: { archetype: 'Gentle Signs Guardian', thName: 'ผู้ดูแลสัญญาณชีวิตแรกเริ่ม', traitLine: 'Careful observation for mother and baby' },
    COMM: { archetype: 'Community Health Scout', thName: 'ผู้มองภาพรวมสุขภาพชุมชน', traitLine: 'Seeing risks before they spread' },
    INT: { archetype: 'Global Trend Observer', thName: 'ผู้จับสัญญาณสุขภาพระดับโลก', traitLine: 'Learning from the world to improve care' },
    TECH: { archetype: 'Clinical AI Insight Engineer', thName: 'นักวิเคราะห์ข้อมูลเพื่อการดูแล', traitLine: 'Data-driven care with clinical sense' },
  },
  FUTURE_COLLABORATION: {
    PED: { archetype: 'Playful Care Creator', thName: 'ผู้สร้างการดูแลที่เด็กเข้าใจง่าย', traitLine: 'Making health knowledge feel friendly' },
    MH: { archetype: 'Wellbeing Network Builder', thName: 'ผู้สร้างเครือข่ายเยียวยาใจ', traitLine: 'Support systems for lasting recovery' },
    ER: { archetype: 'Emergency System Maker', thName: 'ผู้สร้างระบบช่วยชีวิตที่เร็วขึ้น', traitLine: 'Better response through better teamwork' },
    OA: { archetype: 'Active Aging Connector', thName: 'ผู้เชื่อมพลังดูแลผู้สูงวัย', traitLine: 'Families, communities, and care in sync' },
    MAT: { archetype: 'Family Care Connector', thName: 'ผู้เชื่อมครอบครัวสู่การเริ่มต้นที่มั่นคง', traitLine: 'Support networks for new beginnings' },
    COMM: { archetype: 'Health Ecosystem Builder', thName: 'ผู้สร้างระบบสุขภาพของชุมชน', traitLine: 'Joining people together for better health' },
    INT: { archetype: 'Cross-Border Care Builder', thName: 'ผู้สร้างเครือข่ายการดูแลข้ามพรมแดน', traitLine: 'Collaboration that travels across cultures' },
    TECH: { archetype: 'Care Innovation Architect', thName: 'สถาปนิกนวัตกรรมการดูแล', traitLine: 'Building the future of nursing with AI' },
  },
};

export function getCardIdentity(result: Pick<ResultPayload, 'pathId' | 'strengthFamily' | 'characterType'>) {
  const pathIdentity = FAMILY_VARIANTS[result.strengthFamily]?.[result.pathId] || PATH_FALLBACK[result.pathId];
  const familyCode: Record<StrengthFamily, string> = {
    HUMAN_CONNECTION: 'HC',
    CLINICAL_AWARENESS: 'CA',
    FUTURE_COLLABORATION: 'FC',
  };
  const genderCode = result.characterType === 'female_student' ? 'W' : 'M';

  return {
    ...pathIdentity,
    familyLabel: result.strengthFamily.replace(/_/g, ' '),
    familyCode: familyCode[result.strengthFamily],
    cardId: `FN-2026-${result.pathId}-${familyCode[result.strengthFamily]}-${genderCode}`,
  };
}
