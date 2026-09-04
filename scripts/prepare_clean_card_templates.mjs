import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const cardsDir = path.resolve('public/assets/cards');

const files = [
  'PED_female.jpg',
  'PED_male.jpg',
  'MH_female.jpg',
  'MH_male.jpg',
  'ER_female.jpg',
  'ER_male.jpg',
  'OA_female.jpg',
  'OA_male.jpg',
  'MAT_female.jpg',
  'COMM_female.jpg',
  'COMM_male.jpg',
  'INT_female.jpg',
  'TECH_female.jpg',
  'TECH_male.jpg',
];

function roundRect(x, y, w, h, r) {
  return `M ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
}

function scaleRect(rect, width, height) {
  const sx = width / 1080;
  const sy = height / 1920;
  return {
    x: Math.round(rect.x * sx),
    y: Math.round(rect.y * sy),
    w: Math.round(rect.w * sx),
    h: Math.round(rect.h * sy),
    r: Math.round(rect.r * Math.min(sx, sy)),
  };
}

function dynamicTextRegions(filename) {
  const isNarrow = filename.includes('PED_female') || filename.includes('COMM') || filename.includes('TECH');

  if (isNarrow) {
    return [
      { x: 176, y: 590, w: 352, h: 330, r: 18 },
      { x: 176, y: 930, w: 352, h: 350, r: 18 },
      { x: 176, y: 1286, w: 352, h: 194, r: 18 },
      { x: 176, y: 1474, w: 352, h: 230, r: 18 },
    ];
  }

  return [
    { x: 170, y: 604, w: 400, h: 252, r: 18 },
    { x: 170, y: 892, w: 400, h: 280, r: 18 },
    { x: 170, y: 1184, w: 400, h: 222, r: 18 },
    { x: 170, y: 1414, w: 400, h: 252, r: 18 },
  ];
}

function overlaySvg(width, height, filename) {
  const regions = dynamicTextRegions(filename).map((rect) => scaleRect(rect, width, height));
  const shapes = regions.map((rect) => {
    const outer = roundRect(rect.x, rect.y, rect.w, rect.h, rect.r);
    const inner = roundRect(rect.x + 2, rect.y + 2, rect.w - 4, rect.h - 4, Math.max(4, rect.r - 2));
    return `
      <path d="${outer}" fill="#ffffff"/>
      <path d="${inner}" fill="#ffffff"/>
    `;
  }).join('');

  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="soften">
          <feGaussianBlur stdDeviation="0.35"/>
        </filter>
      </defs>
      <g filter="url(#soften)">
        ${shapes}
      </g>
    </svg>
  `);
}

for (const file of files) {
  const input = path.join(cardsDir, file);
  const output = path.join(cardsDir, file.replace(/\.jpg$/, '_clean.jpg'));
  await fs.access(input);

  const image = sharp(input);
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing dimensions for ${file}`);
  }

  await image
    .composite([{ input: overlaySvg(metadata.width, metadata.height, file), blend: 'over' }])
    .jpeg({ quality: 96, mozjpeg: true })
    .toFile(output);

  console.log(`created ${path.relative(process.cwd(), output)}`);
}
