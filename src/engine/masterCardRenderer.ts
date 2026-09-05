import { ResultPayload, PathId, CharacterType } from '../types';

const FONT = '"LINE Seed Sans TH", "Noto Sans Thai", sans-serif';

type Box = { x: number; y: number; width: number; height: number };
type Section = { y: number; descTop: number; bottom: number };
type Master = {
  url: string; width: number; height: number; color: string;
  textX: number; textWidth: number; descX: number; descWidth: number;
  titleHeight: number; sections: [Section, Section]; impact: Box;
};

const agingLayout = {
  width: 1280, height: 1920, color: '#19351D', textX: 240, textWidth: 345,
  descX: 76, descWidth: 505, titleHeight: 68,
  sections: [
    { y: 744, descTop: 810, bottom: 884 },
    { y: 1010, descTop: 1086, bottom: 1148 },
  ] as [Section, Section],
  impact: { x: 240, y: 1490, width: 345, height: 96 },
};

// Each coordinate system follows its supplied artwork, without cropping or
// forcing the Community (9:16) and International (4:5) masters into 2:3.
export const CARD_MASTERS: Partial<Record<PathId, Partial<Record<CharacterType, Master>>>> = {
  OA: {
    male_student: { ...agingLayout, url: '/assets/cards/masters/OA_male.png' },
    female_student: { ...agingLayout, url: '/assets/cards/masters/OA_female.png' },
  },
  COMM: { male_student: {
    url: '/assets/cards/masters/COMM_male.png', width: 1153, height: 2048, color: '#073B67',
    textX: 212, textWidth: 323, descX: 60, descWidth: 475, titleHeight: 72,
    sections: [{ y: 853, descTop: 922, bottom: 990 }, { y: 1118, descTop: 1192, bottom: 1247 }],
    impact: { x: 210, y: 1614, width: 325, height: 91 },
  }, female_student: {
    url: '/assets/cards/masters/COMM_female.png', width: 1153, height: 2048, color: '#073B67',
    textX: 212, textWidth: 323, descX: 60, descWidth: 475, titleHeight: 72,
    sections: [{ y: 853, descTop: 922, bottom: 990 }, { y: 1118, descTop: 1192, bottom: 1247 }],
    impact: { x: 210, y: 1614, width: 325, height: 91 },
  } },
  INT: { male_student: {
    url: '/assets/cards/masters/INT_male.png', width: 1408, height: 1759, color: '#133F7D',
    textX: 267, textWidth: 352, descX: 80, descWidth: 540, titleHeight: 92,
    sections: [{ y: 678, descTop: 776, bottom: 832 }, { y: 934, descTop: 1046, bottom: 1111 }],
    impact: { x: 266, y: 1406, width: 355, height: 91 },
  }, female_student: {
    url: '/assets/cards/masters/INT_female.png', width: 1408, height: 1759, color: '#133F7D',
    // Keep titles left of the hand extending into the AI Skill panel.
    textX: 267, textWidth: 295, descX: 80, descWidth: 540, titleHeight: 92,
    sections: [{ y: 678, descTop: 776, bottom: 832 }, { y: 947, descTop: 1050, bottom: 1111 }],
    impact: { x: 266, y: 1406, width: 355, height: 91 },
  } },
  MH: {
    male_student: {
      url: '/assets/cards/masters/MH_male.png', width: 1280, height: 1920, color: '#392665',
      textX: 255, textWidth: 325, descX: 80, descWidth: 495, titleHeight: 85,
      sections: [{ y: 816, descTop: 881, bottom: 960 }, { y: 1094, descTop: 1170, bottom: 1262 }],
      impact: { x: 254, y: 1595, width: 291, height: 92 },
    },
    female_student: {
      url: '/assets/cards/masters/MH_female.png', width: 1280, height: 1920, color: '#392665',
      textX: 254, textWidth: 326, descX: 80, descWidth: 498, titleHeight: 85,
      sections: [{ y: 809, descTop: 875, bottom: 954 }, { y: 1087, descTop: 1166, bottom: 1260 }],
      impact: { x: 252, y: 1599, width: 301, height: 94 },
    },
  },
  PED: {
    male_student: {
      url: '/assets/cards/masters/PED_male.png', width: 1280, height: 1920, color: '#66203A',
      textX: 246, textWidth: 331, descX: 76, descWidth: 484, titleHeight: 85,
      sections: [{ y: 749, descTop: 800, bottom: 882 }, { y: 1010, descTop: 1086, bottom: 1169 }],
      impact: { x: 244, y: 1492, width: 254, height: 89 },
    },
    female_student: {
      url: '/assets/cards/masters/PED_female.png', width: 1280, height: 1920, color: '#66203A',
      textX: 246, textWidth: 331, descX: 76, descWidth: 505, titleHeight: 85,
      sections: [{ y: 732, descTop: 805, bottom: 880 }, { y: 1010, descTop: 1086, bottom: 1170 }],
      impact: { x: 244, y: 1492, width: 333, height: 89 },
    },
  },
  ER: {
    male_student: {
      url: '/assets/cards/masters/ER_male.png', width: 1280, height: 1920, color: '#65262D',
      textX: 239, textWidth: 372, descX: 70, descWidth: 539, titleHeight: 85,
      sections: [{ y: 710, descTop: 781, bottom: 859 }, { y: 990, descTop: 1068, bottom: 1134 }],
      impact: { x: 240, y: 1483, width: 367, height: 145 },
    },
    female_student: {
      url: '/assets/cards/masters/ER_female.png', width: 1280, height: 1920, color: '#65262D',
      textX: 244, textWidth: 372, descX: 70, descWidth: 545, titleHeight: 85,
      sections: [{ y: 731, descTop: 805, bottom: 878 }, { y: 1018, descTop: 1102, bottom: 1163 }],
      impact: { x: 244, y: 1528, width: 370, height: 116 },
    },
  },
  TECH: {
    male_student: {
      url: '/assets/cards/masters/TECH_male.png', width: 1153, height: 2048, color: '#073B67',
      textX: 225, textWidth: 273, descX: 65, descWidth: 432, titleHeight: 94,
      sections: [{ y: 780, descTop: 859, bottom: 949 }, { y: 1087, descTop: 1168, bottom: 1279 }],
      impact: { x: 218, y: 1621, width: 277, height: 129 },
    },
    female_student: {
      url: '/assets/cards/masters/TECH_female.png', width: 1153, height: 2048, color: '#073B67',
      textX: 229, textWidth: 267, descX: 67, descWidth: 429, titleHeight: 94,
      sections: [{ y: 778, descTop: 855, bottom: 946 }, { y: 1082, descTop: 1162, bottom: 1267 }],
      impact: { x: 217, y: 1603, width: 263, height: 131 },
    },
  },
  MAT: { female_student: {
    url: '/assets/cards/masters/MAT_female.png', width: 1280, height: 1920, color: '#66203A',
    textX: 248, textWidth: 353, descX: 73, descWidth: 528, titleHeight: 68,
    sections: [{ y: 749, descTop: 836, bottom: 890 }, { y: 984, descTop: 1093, bottom: 1149 }],
    impact: { x: 247, y: 1490, width: 354, height: 89 },
  } },
};

export function getCardMaster(result: Pick<ResultPayload, 'pathId' | 'characterType'>) {
  // Maternal has one approved artwork; both look selections use that card.
  // Preserve the participant's selected look and scoring payload.
  const look = result.pathId === 'MAT' ? 'female_student' : result.characterType;
  return CARD_MASTERS[result.pathId]?.[look];
}

type TypeStyle = { title: number; body: number; impact: number; leading: number; gap: number };
// Optical sizes are authored per artwork, in that artwork's coordinate system.
// A compact two-line heading must leave enough room for its full description.
const CARD_TYPE: Record<string, [TypeStyle, TypeStyle, number]> = {
  OA_male: [{ title: 35, body: 28, impact: 28, leading: 1.24, gap: 6 }, { title: 33, body: 27, impact: 28, leading: 1.22, gap: 5 }, 1.24],
  OA_female: [{ title: 35, body: 28, impact: 28, leading: 1.24, gap: 6 }, { title: 33, body: 27, impact: 28, leading: 1.22, gap: 5 }, 1.24],
  COMM_male: [{ title: 33, body: 27, impact: 27, leading: 1.22, gap: 6 }, { title: 31, body: 26, impact: 27, leading: 1.22, gap: 6 }, 1.24],
  COMM_female: [{ title: 33, body: 27, impact: 27, leading: 1.22, gap: 6 }, { title: 31, body: 26, impact: 27, leading: 1.22, gap: 6 }, 1.24],
  INT_male: [{ title: 36, body: 28, impact: 28, leading: 1.22, gap: 7 }, { title: 34, body: 28, impact: 28, leading: 1.22, gap: 7 }, 1.22],
  INT_female: [{ title: 34, body: 28, impact: 28, leading: 1.22, gap: 7 }, { title: 32, body: 27, impact: 28, leading: 1.22, gap: 7 }, 1.22],
  MH_male: [{ title: 34, body: 28, impact: 26, leading: 1.24, gap: 7 }, { title: 32, body: 28, impact: 26, leading: 1.24, gap: 7 }, 1.22],
  MH_female: [{ title: 34, body: 28, impact: 26, leading: 1.24, gap: 7 }, { title: 32, body: 28, impact: 26, leading: 1.24, gap: 7 }, 1.22],
  PED_male: [{ title: 34, body: 28, impact: 25, leading: 1.24, gap: 8 }, { title: 32, body: 28, impact: 25, leading: 1.24, gap: 8 }, 1.22],
  PED_female: [{ title: 34, body: 28, impact: 28, leading: 1.24, gap: 8 }, { title: 32, body: 28, impact: 28, leading: 1.24, gap: 8 }, 1.24],
  ER_male: [{ title: 36, body: 28, impact: 30, leading: 1.24, gap: 8 }, { title: 34, body: 28, impact: 30, leading: 1.24, gap: 8 }, 1.26],
  ER_female: [{ title: 36, body: 28, impact: 29, leading: 1.24, gap: 8 }, { title: 34, body: 28, impact: 29, leading: 1.24, gap: 8 }, 1.25],
  TECH_male: [{ title: 34, body: 27, impact: 27, leading: 1.25, gap: 8 }, { title: 32, body: 27, impact: 27, leading: 1.25, gap: 8 }, 1.25],
  TECH_female: [{ title: 34, body: 27, impact: 27, leading: 1.25, gap: 8 }, { title: 32, body: 27, impact: 27, leading: 1.25, gap: 8 }, 1.25],
  MAT_female: [{ title: 32, body: 26, impact: 28, leading: 1.20, gap: 5 }, { title: 32, body: 27, impact: 28, leading: 1.22, gap: 6 }, 1.22],
};

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const Segmenter = (Intl as any).Segmenter;
  const words: string[] = Segmenter
    ? Array.from(new Segmenter('th', { granularity: 'word' }).segment(text), (s: any) => s.segment)
    : text.split(/(\s+)/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if (ctx.measureText(line + word).width <= width) { line += word; continue; }
    if (line.trim()) lines.push(line.trim());
    line = word.trimStart();
    // Split only an oversized token, and only at grapheme boundaries:
    // Thai vowels and tone marks must never detach from their base character.
    if (ctx.measureText(line).width > width) {
      const graphemes: string[] = Segmenter
        ? Array.from(new Segmenter('th', { granularity: 'grapheme' }).segment(line), (s: any) => s.segment)
        : [line];
      line = '';
      for (const grapheme of graphemes) {
        if (line && ctx.measureText(line + grapheme).width > width) { lines.push(line); line = ''; }
        line += grapheme;
      }
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

type TextPlan = { lines: string[]; size: number; height: number; leading: number; weight: number };
function plan(ctx: CanvasRenderingContext2D, text: string, width: number, size: number, leading: number, weight: number): TextPlan {
  ctx.font = `${weight} ${size}px ${FONT}`;
  const lines = wrap(ctx, text, width);
  return { lines, size, height: lines.length * size * leading, leading, weight };
}
function paint(ctx: CanvasRenderingContext2D, p: TextPlan, x: number, y: number) {
  ctx.font = `${p.weight} ${p.size}px ${FONT}`;
  ctx.textBaseline = 'alphabetic';
  p.lines.forEach((line, i) => ctx.fillText(line, x, y + p.size + i * p.size * p.leading));
}

export function drawFittedMasterText(ctx: CanvasRenderingContext2D, text: string, box: Box,
  maxSize: number, minSize: number, weight: number, leading = 1.24): number {
  for (let size = maxSize; size >= minSize; size--) {
    const p = plan(ctx, text, box.width, size, leading, weight);
    if (p.height > box.height) continue;
    paint(ctx, p, box.x, box.y);
    return p.height;
  }
  throw new Error(`ข้อความยาวเกินพื้นที่การ์ด: ${text}`);
}

export async function renderFinishedMaster(
  ctx: CanvasRenderingContext2D, result: ResultPayload,
  descriptions: { superpower: string; aiSkill: string },
): Promise<string> {
  const master = getCardMaster(result);
  if (!master) throw new Error('No supplied master for this path and look');
  const image = new Image();
  image.src = master.url;
  await Promise.all([
    image.decode().catch(() => {}),
    document.fonts?.load?.(`400 26px ${FONT}`, 'การดูแลผู้สูงวัย').catch(() => {}),
    document.fonts?.load?.(`700 34px ${FONT}`, 'Smart Care Planner').catch(() => {}),
  ]);
  ctx.canvas.height = 1920;
  ctx.canvas.width = Math.round(image.naturalWidth / image.naturalHeight * 1920);
  ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.scale(ctx.canvas.width / master.width, ctx.canvas.height / master.height);
  ctx.fillStyle = master.color;
  ctx.textAlign = 'left';

  const titles = [result.superpower, result.aiSkill];
  const descriptionsBySection = [descriptions.superpower, descriptions.aiSkill];
  const key = master.url.split('/').pop()!.replace('.png', '');
  const typography = CARD_TYPE[key];
  master.sections.forEach((section, index) => {
    const style = typography[index];
    if (typeof style === 'number') throw new Error('Missing section typography');
    // Fit the heading AND description together. Prefer readable body copy
    // over a large heading which forces the description into tiny type.
    for (let bodySize = style.body; bodySize >= 22; bodySize--) {
      for (let titleSize = style.title; titleSize >= 26; titleSize--) {
        const heading = plan(ctx, titles[index], master.textWidth, titleSize, 1.16, 700);
        if (heading.height > master.titleHeight) continue;
        const descY = Math.max(section.descTop, section.y + heading.height + style.gap);
        const body = plan(ctx, descriptionsBySection[index], master.descWidth, bodySize, style.leading, 400);
        if (descY + body.height > section.bottom) continue;
        paint(ctx, heading, master.textX, section.y);
        paint(ctx, body, master.descX, descY);
        return;
      }
    }
    throw new Error(`ไม่สามารถจัดข้อความให้อ่านได้: ${key} section ${index}`);
  });
  const style = typography[0];
  drawFittedMasterText(ctx, result.profileImpact, master.impact, style.impact, 22, 400, typography[2]);
  ctx.restore();
  return ctx.canvas.toDataURL('image/png');
}
