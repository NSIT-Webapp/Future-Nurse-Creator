import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const configs = [
  // 1. COMM
  {
    file: 'COMM_female.jpg',
    width: 576, height: 1024,
    rects: [
      { x: 98, y: 410, w: 177, h: 85, fill: '#F0FDF4' },
      { x: 98, y: 542, w: 177, h: 85, fill: '#F0FDF4' },
      { x: 98, y: 792, w: 177, h: 56, fill: '#F0FDF4' },
    ],
  },
  {
    file: 'COMM_male.jpg',
    width: 576, height: 1024,
    rects: [
      { x: 98, y: 410, w: 177, h: 85, fill: '#F0FDF4' },
      { x: 98, y: 542, w: 177, h: 85, fill: '#F0FDF4' },
      { x: 98, y: 792, w: 177, h: 56, fill: '#F0FDF4' },
    ],
  },

  // 2. TECH
  {
    file: 'TECH_female.jpg',
    width: 576, height: 1024,
    rects: [
      { x: 98, y: 375, w: 177, h: 100, fill: '#EFF7FA' },
      { x: 98, y: 526, w: 177, h: 100, fill: '#EFF7FA' },
      { x: 98, y: 794, w: 177, h: 60, fill: '#EFF7FA' },
    ],
  },
  {
    file: 'TECH_male.jpg',
    width: 576, height: 1024,
    rects: [
      { x: 98, y: 375, w: 177, h: 100, fill: '#EFF7FA' },
      { x: 98, y: 526, w: 177, h: 100, fill: '#EFF7FA' },
      { x: 98, y: 794, w: 177, h: 60, fill: '#EFF7FA' },
    ],
  },

  // 3. PED
  {
    file: 'PED_female.jpg',
    width: 576, height: 1024,
    rects: [
      { x: 92, y: 360, w: 160, h: 24, fill: '#FFF5F7' },
      { x: 28, y: 386, w: 236, h: 80, rx: 8, fill: '#FFF9F9' },
      { x: 92, y: 544, w: 160, h: 24, fill: '#FFF5F7' },
      { x: 28, y: 570, w: 236, h: 80, rx: 8, fill: '#FFF9F9' },
      { x: 92, y: 815, w: 160, h: 24, fill: '#FFF5F7' },
      { x: 28, y: 842, w: 236, h: 58, rx: 8, fill: '#FFF9F9' },
    ],
  },
  {
    file: 'PED_male.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 352, w: 235, h: 96, rx: 6, fill: '#FCF0F2' },
      { x: 115, y: 518, w: 235, h: 96, rx: 6, fill: '#FCF0F2' },
      { x: 115, y: 830, w: 235, h: 76, rx: 6, fill: '#FCF0F2' },
    ],
  },

  // 4. ER
  {
    file: 'ER_female.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 378, w: 235, h: 98, rx: 6, fill: '#FDF8F4' },
      { x: 115, y: 535, w: 235, h: 98, rx: 6, fill: '#FDF8F4' },
      { x: 115, y: 805, w: 235, h: 82, rx: 6, fill: '#FDF8F4' },
    ],
  },
  {
    file: 'ER_male.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 368, w: 235, h: 98, rx: 6, fill: '#FDF8F4' },
      { x: 115, y: 516, w: 235, h: 98, rx: 6, fill: '#FDF8F4' },
      { x: 115, y: 792, w: 235, h: 90, rx: 6, fill: '#FDF8F4' },
    ],
  },

  // 5. MH
  {
    file: 'MH_female.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 418, w: 235, h: 85, rx: 6, fill: '#F3EFF7' },
      { x: 115, y: 568, w: 235, h: 85, rx: 6, fill: '#F3EFF7' },
      { x: 115, y: 848, w: 235, h: 62, rx: 6, fill: '#F3EFF7' },
    ],
  },
  {
    file: 'MH_male.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 418, w: 235, h: 85, rx: 6, fill: '#F3EFF7' },
      { x: 115, y: 568, w: 235, h: 85, rx: 6, fill: '#F3EFF7' },
      { x: 115, y: 848, w: 235, h: 62, rx: 6, fill: '#F3EFF7' },
    ],
  },

  // 6. OA
  {
    file: 'OA_female.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 385, w: 235, h: 95, rx: 6, fill: '#F8F6E7' },
      { x: 115, y: 528, w: 235, h: 95, rx: 6, fill: '#F8F6E7' },
      { x: 115, y: 798, w: 235, h: 65, rx: 6, fill: '#F8F6E7' },
    ],
  },
  {
    file: 'OA_male.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 385, w: 235, h: 95, rx: 6, fill: '#F8F6E7' },
      { x: 115, y: 528, w: 235, h: 95, rx: 6, fill: '#F8F6E7' },
      { x: 115, y: 798, w: 235, h: 65, rx: 6, fill: '#F8F6E7' },
    ],
  },

  // 7. MAT
  {
    file: 'MAT_female.jpg',
    width: 682, height: 1024,
    rects: [
      { x: 115, y: 395, w: 235, h: 85, rx: 6, fill: '#FDF0F0' },
      { x: 115, y: 525, w: 235, h: 85, rx: 6, fill: '#FDF0F0' },
      { x: 115, y: 792, w: 235, h: 65, rx: 6, fill: '#FDF0F0' },
    ],
  },

  // 8. INT
  {
    file: 'INT_female.jpg',
    width: 819, height: 1024,
    rects: [
      { x: 130, y: 375, w: 260, h: 110, rx: 6, fill: '#EBF5FF' },
      { x: 130, y: 535, w: 260, h: 110, rx: 6, fill: '#EBF5FF' },
      { x: 130, y: 815, w: 260, h: 70, rx: 6, fill: '#EBF5FF' },
    ],
  },
];

async function cleanAll() {
  for (const cfg of configs) {
    const inputPath = path.join('public/assets/cards_original', cfg.file);
    const outputPath = path.join('public/assets/cards', cfg.file);

    const svgElements = cfg.rects.map(r => {
      const rxAttr = r.rx ? `rx="${r.rx}"` : '';
      return `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" ${rxAttr} fill="${r.fill}" />`;
    }).join('\n');

    const svg = Buffer.from(`
      <svg width="${cfg.width}" height="${cfg.height}" xmlns="http://www.w3.org/2000/svg">
        ${svgElements}
      </svg>
    `);

    await sharp(inputPath)
      .composite([{ input: svg, blend: 'over' }])
      .jpeg({ quality: 96, mozjpeg: true })
      .toFile(outputPath);

    console.log(`✓ Cleaned ${cfg.file}`);
  }
}

cleanAll().catch(console.error);
