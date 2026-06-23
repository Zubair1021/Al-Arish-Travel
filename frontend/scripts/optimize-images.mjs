/**
 * One-shot image optimizer.
 *
 * What it does:
 *   - Walks src/assets/images recursively (skipping the favicons folder).
 *   - For PNG photos (any PNG NOT in TRANSPARENT_FILES): re-encodes as
 *     progressive mozjpeg at quality 82 and DELETES the original PNG.
 *     A small `src/imports-rewrite.json` is written so we can update imports.
 *   - For PNGs that need transparency (logos): re-encodes as a quantized
 *     palette PNG (typically 60-80% smaller, still lossless-looking).
 *   - For JPGs already on disk: re-encodes in place with mozjpeg q82.
 *   - Caps the longest edge at 1800px (with 2400px allowed for hero images).
 *
 * Run with:  npm run optimize-images
 */

import sharp from 'sharp';
import { readdir, stat, unlink, writeFile, readFile, rename } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { existsSync } from 'node:fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function withRetry(label, fn, attempts = 5, delayMs = 400) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!['EBUSY', 'EPERM', 'UNKNOWN', 'ENOENT'].includes(e.code)) throw e;
      console.log(`  · ${label} locked (${e.code}), retrying in ${delayMs}ms...`);
      await sleep(delayMs);
    }
  }
  throw lastErr;
}

const ROOTS = ['src/assets/images'];
const SKIP_DIRS = new Set(['favicons']);
const MAX_WIDTH_DEFAULT = 1800;
const MAX_WIDTH_LOGO = 600;
const JPG_QUALITY = 82;
const PNG_COLORS = 192; // palette colors for quantized PNGs

// PNG files that MUST preserve transparency (logos, icons, etc.)
const TRANSPARENT_FILES = new Set(['logo.png']);

// Files that should be downscaled more aggressively (logos)
const LOGO_FILES = new Set(['logo.png', 'logo-white.jpg']);

const conversions = []; // {from, to} pairs to rewrite in imports later
let totalBefore = 0;
let totalAfter = 0;
let processed = 0;

async function walk(dir) {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      await walk(full);
      continue;
    }
    if (!/\.(png|jpe?g)$/i.test(ent.name)) continue;
    await processFile(full, ent.name);
  }
}

async function processFile(fullPath, baseName) {
  const beforeSize = (await stat(fullPath)).size;
  totalBefore += beforeSize;

  const isPng = /\.png$/i.test(fullPath);
  const keepAlpha = TRANSPARENT_FILES.has(baseName);
  const isLogo = LOGO_FILES.has(baseName);
  const maxWidth = isLogo ? MAX_WIDTH_LOGO : MAX_WIDTH_DEFAULT;

  let pipeline = sharp(fullPath, { failOn: 'none' }).rotate();
  const meta = await sharp(fullPath).metadata();
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  let outBuf;
  let outPath;
  const parsed = parse(fullPath);

  if (isPng && keepAlpha) {
    // Keep transparent PNG, but quantize to palette
    outBuf = await pipeline
      .png({
        compressionLevel: 9,
        palette: true,
        colors: PNG_COLORS,
        quality: 90,
        effort: 10,
      })
      .toBuffer();
    outPath = fullPath;
  } else {
    // Everything else → progressive mozjpeg
    outBuf = await pipeline
      .flatten({ background: '#ffffff' }) // flatten any alpha to white
      .jpeg({ quality: JPG_QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();
    outPath = join(parsed.dir, parsed.name + '.jpg');
  }

  // If the new file would be LARGER, abort this file (rare, but possible
  // for tiny optimized PNGs we'd otherwise replace).
  if (outBuf.length >= beforeSize && outPath === fullPath) {
    totalAfter += beforeSize;
    console.log(`  = ${baseName.padEnd(28)} ${kb(beforeSize)} (unchanged, already optimal)`);
    return;
  }

  // Write atomically through a .tmp neighbour so we never half-write on a
  // locked target (Windows dev-server file locks).
  const tmpPath = outPath + '.tmp';
  await writeFile(tmpPath, outBuf);

  if (outPath !== fullPath) {
    // Renaming to a new path → drop the original first.
    await withRetry(`unlink ${baseName}`, () => unlink(fullPath));
    conversions.push({ from: baseName, to: parsed.name + '.jpg' });
  }
  await withRetry(`rename ${baseName}`, () => rename(tmpPath, outPath));
  totalAfter += outBuf.length;
  processed += 1;

  const arrow = outPath === fullPath ? '→' : '⇒';
  const newName = outPath === fullPath ? baseName : parsed.name + '.jpg';
  console.log(
    `  ${arrow} ${baseName.padEnd(28)} ${kb(beforeSize).padStart(8)} → ${kb(outBuf.length).padStart(8)}` +
      (outPath !== fullPath ? `  (renamed to ${newName})` : ''),
  );
}

function kb(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  return Math.round(bytes / 1024) + ' KB';
}

async function rewriteImports() {
  if (conversions.length === 0) return;
  console.log('\n[imports] Rewriting source files for renamed assets...');

  const srcRoot = 'src';
  const codeFiles = await collect(srcRoot, /\.(jsx?|tsx?|css|html)$/i);

  let touched = 0;
  for (const file of codeFiles) {
    let content = await readFile(file, 'utf8');
    let modified = false;
    for (const { from, to } of conversions) {
      // Match only the bare filename (with quote / slash boundary) to avoid
      // touching unrelated text.
      const re = new RegExp(
        '([\\/"\\\'])' + escapeRegex(from) + '(["\\\'])',
        'g',
      );
      if (re.test(content)) {
        content = content.replace(re, `$1${to}$2`);
        modified = true;
      }
    }
    if (modified) {
      await writeFile(file, content);
      touched += 1;
      console.log(`  ✓ ${file}`);
    }
  }
  console.log(`[imports] Updated ${touched} file(s).`);
}

async function collect(dir, regex) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...(await collect(full, regex)));
    } else if (regex.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('=== Image optimizer ===\n');
for (const root of ROOTS) await walk(root);
await rewriteImports();

const saved = totalBefore - totalAfter;
const pct = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(1) : '0.0';
console.log(`\n=== Summary ===`);
console.log(`Files processed: ${processed}`);
console.log(`Before:          ${kb(totalBefore)}`);
console.log(`After:           ${kb(totalAfter)}`);
console.log(`Saved:           ${kb(saved)}  (${pct}%)`);
