/**
 * Build a crisp navbar logo from the master logo.png (trim + resize).
 * Run: node scripts/build-logo-nav.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'src/assets/images/logo.png';
const OUT = 'src/assets/images/logo-nav.png';
const TARGET_WIDTH = 1280;

const buf = await sharp(SRC)
  .trim({ threshold: 12 })
  .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
  .png({ compressionLevel: 9, quality: 100, effort: 10 })
  .toBuffer();

await writeFile(join(OUT), buf);

const meta = await sharp(buf).metadata();
console.log(`Wrote ${OUT} — ${meta.width}x${meta.height}, ${Math.round(buf.length / 1024)} KB`);
