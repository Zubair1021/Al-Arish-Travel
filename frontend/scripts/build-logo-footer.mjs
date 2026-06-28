/**
 * Build a crisp footer logo from logo-white.jpg (trim + resize, white background kept).
 * Run: node scripts/build-logo-footer.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'src/assets/images/logo-white.jpg';
const OUT = 'src/assets/images/logo-footer.png';
const TARGET_WIDTH = 1280;

const buf = await sharp(SRC)
  .trim({ threshold: 12 })
  .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
  .png({ compressionLevel: 9, quality: 100, effort: 10, palette: false })
  .toBuffer();

await writeFile(OUT, buf);

const meta = await sharp(buf).metadata();
console.log(`Wrote ${OUT} — ${meta.width}x${meta.height}, ${Math.round(buf.length / 1024)} KB`);
