/**
 * gen-favicons.mjs
 * Run from the iyke-portfolio project root:
 *   node gen-favicons.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('./public');
const svgPath   = path.join(publicDir, 'favicon.svg');

console.log('Reading SVG from:', svgPath);
const svgBuf = fs.readFileSync(svgPath);

async function toPng(size, outName) {
  const outPath = path.join(publicDir, outName);
  await sharp(svgBuf, { density: 288 })
    .resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);
  console.log(`✓ ${outName} (${size}×${size})`);
}

async function buildIco(sizes) {
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(svgBuf, { density: 288 })
        .resize(size, size, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
        .png({ compressionLevel: 9 })
        .toBuffer()
    )
  );

  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * sizes.length;
  const totalHeaderSize = headerSize + dirSize;

  let offset = totalHeaderSize;
  const offsets = pngBuffers.map(buf => {
    const o = offset;
    offset += buf.length;
    return o;
  });

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  const dirEntries = Buffer.alloc(dirSize);
  sizes.forEach((size, i) => {
    const entry = dirEntries.subarray(i * dirEntrySize, (i + 1) * dirEntrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(pngBuffers[i].length, 8);
    entry.writeUInt32LE(offsets[i], 12);
  });

  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, Buffer.concat([header, dirEntries, ...pngBuffers]));
  const kbSize = (fs.statSync(icoPath).size / 1024).toFixed(1);
  console.log(`✓ favicon.ico (${sizes.join('+')}px ICO, ${kbSize} KB)`);
}

async function main() {
  console.log('\n🎨 Generating favicons from SVG…\n');
  await toPng(16,  'favicon-16x16.png');
  await toPng(32,  'favicon-32x32.png');
  await toPng(48,  'favicon-48x48.png');
  await buildIco([16, 32, 48]);
  await toPng(180, 'apple-touch-icon.png');
  await toPng(192, 'android-chrome-192x192.png');
  await toPng(512, 'android-chrome-512x512.png');
  await toPng(512, 'icon.png');
  await toPng(512, 'maskable-icon-512x512.png');
  await toPng(150, 'mstile-150x150.png');
  console.log('\n✅ All favicons regenerated!');
}

main().catch(err => { console.error(err); process.exit(1); });
