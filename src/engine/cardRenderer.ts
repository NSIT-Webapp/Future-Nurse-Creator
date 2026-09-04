import { ResultPayload, StrengthFamily } from '../types';
import { getCardCharacterUrl, getCardTemplateUrl } from '../assets/registry';

const FAMILY_EMOJI: Record<StrengthFamily, string> = {
  HUMAN_CONNECTION:     '❤️',
  CLINICAL_AWARENESS:   '👀',
  FUTURE_COLLABORATION: '✨',
};

const FAMILY_LABEL: Record<StrengthFamily, string> = {
  HUMAN_CONNECTION:     'Heart Connector',
  CLINICAL_AWARENESS:   'Clinical Instinct',
  FUTURE_COLLABORATION: 'Care Innovator',
};

const CARD_FONT = '"LINE Seed Sans TH", "Noto Sans Thai", "Inter", sans-serif';

function getSuperpowerDesc(result: ResultPayload): string {
  const customMap: Record<string, string> = {
    PED: 'สื่อสารอย่างเข้าใจ เข้าถึงใจเด็กและครอบครัว',
    MH: 'ฟังอย่างเข้าใจ เห็นคุณค่าในความรู้สึก และพร้อมอยู่เคียงข้างอย่างอ่อนโยน',
    ER: 'คุณตั้งสติไว คิดเร็ว และตัดสินใจได้แม่นยำ เมื่ออยู่ในสถานการณ์เร่งด่วน',
    OA: 'ใส่ใจ เข้าใจความต้องการของผู้สูงวัย และดูแลด้วยความอบอุ่นและเคารพ',
    MAT: 'ใส่ใจรายละเอียด สังเกตอาการ และช่วยให้คุณแม่รู้สึกมั่นใจตลอดช่วงเวลาสำคัญของชีวิต',
    COMM: 'เชื่อมโยงผู้คน เข้าใจบริบทของชุมชน และร่วมสร้างสุขภาพที่ดีไปด้วยกัน',
    INT: 'สื่อสารอย่างเข้าใจ เคารพความแตกต่าง และเชื่อมโยงผู้คนจากหลากหลายวัฒนธรรม',
    TECH: 'Turn ideas into smarter, safer, and more human healthcare experiences.',
  };
  return customMap[result.pathId] || result.superpower;
}

function getAiSkillDesc(result: ResultPayload): string {
  const customMap: Record<string, string> = {
    PED: 'สร้างสื่อความรู้ที่เข้าใจง่าย ให้เด็กและครอบครัวคลายกังวล',
    MH: 'ออกแบบสื่อและข้อความที่ช่วยให้ผู้คนเข้าใจและดูแลใจได้ง่ายขึ้น',
    ER: 'วิเคราะห์ข้อมูลสำคัญอย่างรวดเร็ว ช่วยให้ทีมดูแลผู้ป่วยได้อย่างตรงจุด',
    OA: 'ช่วยวางแผนการดูแลและติดตามสุขภาพ เพื่อการดูแลที่ต่อเนื่องและเหมาะสม',
    MAT: 'สร้างสื่อสุขภาพที่เข้าใจง่าย เพื่อช่วยคุณแม่และครอบครัวดูแลตนเองได้ดีขึ้น',
    COMM: 'ใช้ข้อมูลและเครื่องมือดิจิทัลช่วยวางแผนส่งเสริมสุขภาพในชุมชนได้อย่างเหมาะสม',
    INT: 'ใช้ข้อมูลและสื่อดิจิทัลเพื่อช่วยสื่อสารสุขภาพให้ผู้คนจากหลายภาษาเข้าใจได้ง่าย',
    TECH: 'Design digital tools and intelligent systems that elevate patient care.',
  };
  return customMap[result.pathId] || result.aiSkill;
}

function wrapThaiText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const tokens = text.split(/(\s+)/);
  const lines: string[] = [];
  let currentLine = '';

  for (const token of tokens) {
    const testLine = currentLine + token;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine.trim()) lines.push(currentLine.trim());
      if (ctx.measureText(token).width > maxWidth) {
        let chunk = '';
        for (const char of token) {
          if (ctx.measureText(chunk + char).width <= maxWidth) {
            chunk += char;
          } else {
            if (chunk) lines.push(chunk);
            chunk = char;
          }
        }
        currentLine = chunk;
      } else {
        currentLine = token.trimStart();
      }
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  return lines;
}

async function renderTemplateCard(
  ctx: CanvasRenderingContext2D,
  result: ResultPayload,
  templateUrl: string,
  width: number,
  height: number
): Promise<void> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = (e) => reject(e);
    setTimeout(() => reject(new Error('Image load timeout')), 3500);
    el.src = templateUrl;
  });

  // 1. Draw base high-res template image
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Smart Dynamic Text Overlay for Pediatric Nursing (with dashed bracket placeholders)
  const isPedFemale = result.pathId === 'PED' && result.characterType === 'female_student';

  if (isPedFemale) {
    // A. Your Superpower:
    // Cover [Strength Name]
    ctx.fillStyle = '#FFF2F4';
    roundRect(ctx, 195, 652, 280, 48, 8);
    ctx.fill();

    // Draw Strength Name
    ctx.save();
    ctx.fillStyle = '#C2185B';
    ctx.font = `bold 30px ${CARD_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(result.superpower, 202, 676);
    ctx.restore();

    // Redraw [Strength Description] dashed box & fill
    ctx.save();
    roundRect(ctx, 75, 726, 436, 164, 18);
    ctx.fillStyle = '#FFF8F8';
    ctx.fill();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    // Draw Thai strength description
    ctx.save();
    ctx.fillStyle = '#4A3E3D';
    ctx.font = `600 23px ${CARD_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const strengthDesc = getSuperpowerDesc(result);
    const sLines = wrapThaiText(ctx, strengthDesc, 390);
    const startSY = 808 - ((sLines.length - 1) * 32) / 2;
    sLines.forEach((line, i) => {
      ctx.fillText(line, 75 + 436 / 2, startSY + i * 32);
    });
    ctx.restore();

    // B. Your AI Skill:
    // Cover [AI Skill Name]
    ctx.fillStyle = '#FFF2F4';
    roundRect(ctx, 195, 1008, 280, 48, 8);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#C2185B';
    ctx.font = `bold 28px ${CARD_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(result.aiSkill, 202, 1032);
    ctx.restore();

    // Redraw [AI Skill Description] dashed box & fill
    ctx.save();
    roundRect(ctx, 75, 1082, 436, 164, 18);
    ctx.fillStyle = '#FFF8F8';
    ctx.fill();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#4A3E3D';
    ctx.font = `600 23px ${CARD_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const aiDesc = getAiSkillDesc(result);
    const aiLines = wrapThaiText(ctx, aiDesc, 390);
    const startAiY = 1164 - ((aiLines.length - 1) * 32) / 2;
    aiLines.forEach((line, i) => {
      ctx.fillText(line, 75 + 436 / 2, startAiY + i * 32);
    });
    ctx.restore();

    // C. Your Impact:
    // Cover [Impact Title]
    ctx.fillStyle = '#FFF2F4';
    roundRect(ctx, 195, 1515, 280, 48, 8);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#C2185B';
    ctx.font = `bold 28px ${CARD_FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(result.path.badge || 'Child Care Champion', 202, 1539);
    ctx.restore();

    // Redraw [Impact Description] dashed box & fill
    ctx.save();
    roundRect(ctx, 75, 1582, 436, 110, 18);
    ctx.fillStyle = '#FFF8F8';
    ctx.fill();
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#4A3E3D';
    ctx.font = `600 22px ${CARD_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const impactLines = wrapThaiText(ctx, result.profileImpact, 390);
    const startImpY = 1637 - ((impactLines.length - 1) * 30) / 2;
    impactLines.forEach((line, i) => {
      ctx.fillText(line, 75 + 436 / 2, startImpY + i * 30);
    });
    ctx.restore();
  }
}

export async function renderFutureNurseCard(
  result: ResultPayload,
  customCanvas?: HTMLCanvasElement
): Promise<string> {
  const canvas = customCanvas || document.createElement('canvas');
  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Enable high quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Check if official high-res Card Template exists
  const genderKey = result.characterType === 'female_student' ? 'female' : 'male';
  const templateUrl = getCardTemplateUrl(result.pathId, genderKey);

  if (templateUrl) {
    try {
      await renderTemplateCard(ctx, result, templateUrl, width, height);
      return canvas.toDataURL('image/png', 0.95);
    } catch (err) {
      console.warn('[cardRenderer] Template render failed, falling back to procedural:', err);
    }
  }

  // 2. Procedural Fallback Base Gradient (Deep Mahidol Blue & Path-accented radial aura)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#061329');
  bgGrad.addColorStop(0.4, '#0A1E3F');
  bgGrad.addColorStop(1, '#020B18');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Path colored ambient light orb in background
  const pathColor = result.path.color || '#00A3FF';
  const glowGrad = ctx.createRadialGradient(width * 0.75, height * 0.45, 50, width * 0.75, height * 0.45, 600);
  glowGrad.addColorStop(0, hexToRgba(pathColor, 0.45));
  glowGrad.addColorStop(0.5, hexToRgba(pathColor, 0.15));
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle geometric grid & tech aesthetic lines
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 40; x < width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 40; y < height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Outer Card Frame & Golden Border Accents
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  roundRect(ctx, 40, 40, width - 80, height - 80, 36);
  ctx.stroke();

  // Gold accent corner brackets
  ctx.strokeStyle = '#F5A623';
  ctx.lineWidth = 4;
  drawCornerAccents(ctx, 40, 40, width - 80, height - 80, 50);
  ctx.restore();

  // 3. Header Section (Y: 70 - 240)
  // Top-Right: NSMU OPEN HOUSE 2026 Badge
  const badgeX = width - 80;
  const badgeY = 80;
  drawBadge(ctx, badgeX, badgeY, 'NSMU OPEN HOUSE 2026');

  // Top-Left: Path Identity & Emoji
  ctx.save();
  // Emoji / Icon Circle
  ctx.fillStyle = hexToRgba(pathColor, 0.2);
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(120, 140, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = `54px ${CARD_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(result.path.emoji, 120, 142);

  // Path Title EN & TH (38-42px ExtraBold 800)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 40px ${CARD_FONT}`;
  ctx.fillText(result.path.nameEn.toUpperCase(), 190, 125);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 26px ${CARD_FONT}`;
  ctx.fillText(result.path.nameTh, 190, 165);

  // Path Role Badge (16-18px SemiBold 600)
  const roleBadgeWidth = ctx.measureText(result.path.badge).width + 30;
  ctx.fillStyle = hexToRgba(pathColor, 0.25);
  roundRect(ctx, 190, 182, roleBadgeWidth, 34, 17);
  ctx.fill();
  ctx.fillStyle = '#38BDF8';
  ctx.font = `600 16px ${CARD_FONT}`;
  ctx.fillText(result.path.badge.toUpperCase(), 205, 205);

  // Strength Family badge (right of path name) (16-18px SemiBold 600)
  const familyLabel = `${FAMILY_EMOJI[result.strengthFamily]}  ${FAMILY_LABEL[result.strengthFamily]}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
  const famBadgeW = ctx.measureText(familyLabel).width + 40;
  roundRect(ctx, 190, 220, famBadgeW, 30, 15);
  ctx.fill();
  ctx.fillStyle = '#CBD5E1';
  ctx.font = `600 16px ${CARD_FONT}`;
  ctx.fillText(familyLabel, 210, 241);
  ctx.restore();

  // Header Divider
  const headerDivGrad = ctx.createLinearGradient(80, 265, width - 80, 265);
  headerDivGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  headerDivGrad.addColorStop(0.5, pathColor);
  headerDivGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  ctx.strokeStyle = headerDivGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 265);
  ctx.lineTo(width - 80, 265);
  ctx.stroke();

  // 4. Character Section (Right Side)
  const charX = width - 420;
  const charY = 295;
  const charW = 360;
  const charH = 880;
  await drawCharacterIllustration(ctx, result, charX, charY, charW, charH);

  // 5. Left Content Section (Y: 285 - 1640, X: 80 - 620)
  let currentY = 285;
  const contentWidth = 540;

  // Box 1: Your Nursing Superpower
  currentY = drawSectionBox(
    ctx,
    80,
    currentY,
    contentWidth,
    'YOUR NURSING SUPERPOWER',
    `✨  ${result.superpower}`,
    `${FAMILY_EMOJI[result.strengthFamily]} ${FAMILY_LABEL[result.strengthFamily]}`,
    '',
    '#F5A623',
    '#FEF3C7'
  );

  // Box 2: Your AI Skill
  currentY += 20;
  currentY = drawSectionBox(
    ctx,
    80,
    currentY,
    contentWidth,
    'YOUR AI SKILL',
    `⚡ ${result.aiSkill}`,
    '',
    '',
    '#00A3FF',
    '#E0F2FE'
  );

  // Box 3: Mood & Tone
  currentY += 20;
  currentY = drawImpactBox(
    ctx,
    80,
    currentY,
    contentWidth,
    result.path.moodTone,
    result.profileImpact
  );

  // Box 4: Your Impact (full-width personal message box)
  currentY += 20;
  drawPersonalMessageBox(
    ctx,
    80,
    currentY,
    width - 160,
    result.profileImpact,
    pathColor
  );

  // 6. Footer Section (Y: 1680 - 1880)
  const footerY = 1710;
  
  // Footer divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, footerY);
  ctx.lineTo(width - 80, footerY);
  ctx.stroke();

  // Tagline
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `italic 600 24px ${CARD_FONT}`;
  ctx.fillText(`“ ${result.path.tagline} ”`, width / 2, footerY + 50);

  // Memory Stamp
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 16px ${CARD_FONT}`;
  ctx.letterSpacing = '3px';
  ctx.fillText('A FUTURE NURSE MEMORY FROM', width / 2, footerY + 95);

  ctx.fillStyle = '#F5A623';
  ctx.font = `700 22px ${CARD_FONT}`;
  ctx.letterSpacing = '1.5px';
  ctx.fillText('FACULTY OF NURSING, MAHIDOL UNIVERSITY', width / 2, footerY + 130);
  ctx.restore();

  return canvas.toDataURL('image/png', 0.95);
}

// --- Helper Drawing Functions ---

function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((s) => s + s).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCornerAccents(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  len: number
) {
  // Top-left
  ctx.beginPath();
  ctx.moveTo(x, y + len);
  ctx.lineTo(x, y);
  ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + len, y + h);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}

function drawBadge(ctx: CanvasRenderingContext2D, rightX: number, topY: number, text: string) {
  ctx.save();
  ctx.font = `700 18px ${CARD_FONT}`;
  const textWidth = ctx.measureText(text).width;
  const paddingX = 20;
  const badgeW = textWidth + paddingX * 2;
  const badgeH = 44;
  const badgeX = rightX - badgeW;

  // Badge background
  const badgeGrad = ctx.createLinearGradient(badgeX, topY, badgeX + badgeW, topY + badgeH);
  badgeGrad.addColorStop(0, '#B45309');
  badgeGrad.addColorStop(0.5, '#F5A623');
  badgeGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = badgeGrad;
  roundRect(ctx, badgeX, topY, badgeW, badgeH, 22);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Badge text
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, badgeX + badgeW / 2, topY + badgeH / 2 + 1);
  ctx.restore();
}

function drawSectionBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  categoryLabel: string,
  titleEn: string,
  titleTh: string,
  description: string,
  accentColor: string,
  _titleColor: string
): number {
  ctx.save();

  // Measure description lines
  ctx.font = `400 20px ${CARD_FONT}`;
  const lines = wrapText(ctx, description, w - 40);
  const boxHeight = 135 + lines.length * 28;

  // Box background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.strokeStyle = hexToRgba(accentColor, 0.4);
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, boxHeight, 18);
  ctx.fill();
  ctx.stroke();

  // Left accent bar
  ctx.fillStyle = accentColor;
  roundRect(ctx, x, y + 15, 6, boxHeight - 30, 3);
  ctx.fill();

  // Category Tag (14-16px SemiBold)
  ctx.fillStyle = accentColor;
  ctx.font = `600 15px ${CARD_FONT}`;
  ctx.letterSpacing = '1px';
  ctx.fillText(categoryLabel, x + 24, y + 36);

  // Title EN (22-26px Bold)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 24px ${CARD_FONT}`;
  ctx.fillText(titleEn, x + 24, y + 70);

  // Title TH (18-20px SemiBold)
  if (titleTh) {
    ctx.fillStyle = '#CBD5E1';
    ctx.font = `600 19px ${CARD_FONT}`;
    ctx.fillText(titleTh, x + 24, y + 100);
  }

  // Description (400 Regular)
  ctx.fillStyle = '#94A3B8';
  ctx.font = `400 20px ${CARD_FONT}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, x + 24, y + 132 + index * 28);
  });

  ctx.restore();
  return y + boxHeight;
}

function drawImpactBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  moodTone: string,
  impact: string
): number {
  ctx.save();
  ctx.font = `600 20px ${CARD_FONT}`;
  const impactLines = wrapText(ctx, impact, w - 40);
  const boxHeight = 145 + impactLines.length * 26;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, boxHeight, 18);
  ctx.fill();
  ctx.stroke();

  // Mood & Tone
  ctx.fillStyle = '#38BDF8';
  ctx.font = `600 15px ${CARD_FONT}`;
  ctx.fillText('MOOD & TONE', x + 24, y + 32);

  ctx.fillStyle = '#F1F5F9';
  ctx.font = `600 20px ${CARD_FONT}`;
  ctx.fillText(moodTone, x + 24, y + 62);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 24, y + 80);
  ctx.lineTo(x + w - 24, y + 80);
  ctx.stroke();

  // Impact (13-15px Semibold)
  ctx.fillStyle = '#34D399';
  ctx.font = `600 15px ${CARD_FONT}`;
  ctx.fillText('YOUR IMPACT', x + 24, y + 106);

  // Impact text (20-22px Semibold)
  ctx.fillStyle = '#CBD5E1';
  ctx.font = `600 20px ${CARD_FONT}`;
  impactLines.forEach((line, index) => {
    ctx.fillText(line, x + 24, y + 134 + index * 26);
  });

  ctx.restore();
  return y + boxHeight;
}

function drawPersonalMessageBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  message: string,
  themeColor: string
) {
  ctx.save();
  ctx.font = `600 21px ${CARD_FONT}`;
  const lines = wrapText(ctx, message, w - 80);
  const boxHeight = 85 + lines.length * 32;

  // Box background with subtle theme gradient
  const boxGrad = ctx.createLinearGradient(x, y, x + w, y + boxHeight);
  boxGrad.addColorStop(0, hexToRgba(themeColor, 0.15));
  boxGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
  ctx.fillStyle = boxGrad;
  ctx.strokeStyle = hexToRgba(themeColor, 0.6);
  ctx.lineWidth = 2;
  roundRect(ctx, x, y, w, boxHeight, 20);
  ctx.fill();
  ctx.stroke();

  // Quote marks
  ctx.fillStyle = hexToRgba(themeColor, 0.5);
  ctx.font = 'bold 60px Georgia, serif';
  ctx.fillText('“', x + 25, y + 55);

  // Message lines (20-22px Semibold)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 21px ${CARD_FONT}`;
  lines.forEach((line, index) => {
    ctx.fillText(line, x + 65, y + 45 + index * 32);
  });

  ctx.restore();
}

async function drawCharacterIllustration(
  ctx: CanvasRenderingContext2D,
  result: ResultPayload,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const genderKey = result.characterType === 'female_student' ? 'female' : 'male';
  // Asset path resolved from centralized registry — swap assets in registry.ts only
  const assetUrl = getCardCharacterUrl(result.pathId, genderKey);

  let imgLoaded = false;
  try {
    const img = new Image();
    img.src = assetUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject();
      setTimeout(() => reject(), 1200); // 1.2s timeout fallback
    });

    // Draw pre-generated character image
    ctx.save();
    // Character aura backplate
    const auraGrad = ctx.createRadialGradient(x + w / 2, y + h / 2, 40, x + w / 2, y + h / 2, w * 0.7);
    auraGrad.addColorStop(0, hexToRgba(result.path.color, 0.3));
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(x - 50, y, w + 100, h);

    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    imgLoaded = true;
  } catch (_e) {
    imgLoaded = false;
  }

  if (!imgLoaded) {
    // Elegant Mahidol Nursing Student Vector Artwork Fallback
    drawMahidolNurseStudentVector(ctx, result, x, y, w, h);
  }
}

function drawMahidolNurseStudentVector(
  ctx: CanvasRenderingContext2D,
  result: ResultPayload,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const centerX = x + w / 2;
  const isFemale = result.characterType === 'female_student';
  const isCommunity = result.pathId === 'COMM';

  // Backplate glow
  const auraGrad = ctx.createRadialGradient(centerX, y + h * 0.45, 50, centerX, y + h * 0.45, w * 0.85);
  auraGrad.addColorStop(0, hexToRgba(result.path.color, 0.35));
  auraGrad.addColorStop(0.8, hexToRgba(result.path.color, 0.05));
  auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(x - 40, y, w + 80, h);

  // Soft podium / pedestal
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.beginPath();
  ctx.ellipse(centerX, y + h - 40, w * 0.4, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head / Hair
  const headY = y + 190;
  const headRadius = 65;

  // Female hair bun or male neat hair
  ctx.fillStyle = '#1E1B18';
  if (isFemale) {
    // Hair Bun at back
    ctx.beginPath();
    ctx.arc(centerX, headY - 45, 38, 0, Math.PI * 2);
    ctx.fill();
  }

  // Face
  ctx.fillStyle = '#FCE7D0';
  ctx.beginPath();
  ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  // Hair Top/Front
  ctx.fillStyle = '#1E1B18';
  ctx.beginPath();
  ctx.arc(centerX, headY - 15, headRadius + 2, Math.PI, Math.PI * 2);
  ctx.fill();

  // Female White Nursing Cap (Mahidol standard: pure white, no stripe, no cap for community)
  if (isFemale && !isCommunity) {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 68, headY - 35);
    ctx.lineTo(centerX + 68, headY - 35);
    ctx.lineTo(centerX + 50, headY - 78);
    ctx.lineTo(centerX - 50, headY - 78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Eyes & Smile
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(centerX - 24, headY + 5, 5, 0, Math.PI * 2);
  ctx.arc(centerX + 24, headY + 5, 5, 0, Math.PI * 2);
  ctx.fill();

  // Warm smile
  ctx.strokeStyle = '#EA580C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, headY + 18, 16, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Uniform Body
  const uniformColor = isCommunity ? '#0284C7' : '#FFFFFF'; // Community blue training uniform or Pure White
  const uniformStroke = isCommunity ? '#0369A1' : '#CBD5E1';

  // Torso / Jacket
  ctx.fillStyle = uniformColor;
  ctx.strokeStyle = uniformStroke;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX - 40, headY + 60); // Neck left
  ctx.lineTo(centerX - 120, headY + 160); // Shoulder left
  ctx.lineTo(centerX - 100, headY + 460); // Torso bottom left
  ctx.lineTo(centerX + 100, headY + 460); // Torso bottom right
  ctx.lineTo(centerX + 120, headY + 160); // Shoulder right
  ctx.lineTo(centerX + 40, headY + 60); // Neck right
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Mahidol "NS" Embroidered Monogram on chest
  ctx.fillStyle = isCommunity ? '#FFFFFF' : '#002B7F';
  ctx.font = `bold 20px ${CARD_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('NS', centerX - 60, headY + 220);

  // Stethoscope or Path Prop
  ctx.strokeStyle = '#00A3FF';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(centerX, headY + 190, 55, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Lower uniform (Skirt for female white uniform, Pants for male or community)
  if (isFemale && !isCommunity) {
    // White Skirt
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, headY + 460);
    ctx.lineTo(centerX + 100, headY + 460);
    ctx.lineTo(centerX + 125, headY + 620);
    ctx.lineTo(centerX - 125, headY + 620);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Pants (Dark Blue / White / Community)
    const pantsColor = isCommunity ? '#0F172A' : isFemale ? '#FFFFFF' : '#002B7F';
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.moveTo(centerX - 95, headY + 460);
    ctx.lineTo(centerX + 95, headY + 460);
    ctx.lineTo(centerX + 105, headY + 650);
    ctx.lineTo(centerX + 10, headY + 650);
    ctx.lineTo(centerX, headY + 520);
    ctx.lineTo(centerX - 10, headY + 650);
    ctx.lineTo(centerX - 105, headY + 650);
    ctx.closePath();
    ctx.fill();
  }

  // Floating Path Badge Icon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeStyle = result.path.color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centerX + 100, headY + 100, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.font = `36px ${CARD_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(result.path.emoji, centerX + 100, headY + 102);

  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
