/**
 * generate-ico.mjs
 * Wraps public/favicon-32x32.png into a valid ICO binary and writes
 * it to src/app/favicon.ico, replacing the Vercel default.
 *
 * ICO format: 6-byte header + 16-byte directory + raw PNG data.
 * Modern browsers (Chrome, Firefox, Edge, Safari) all support
 * ICO files that embed PNG payloads — no rasterisation needed.
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, "..");

const pngPath = path.join(root, "public", "favicon-32x32.png");
const icoPath = path.join(root, "src", "app", "favicon.ico");

const png     = fs.readFileSync(pngPath);
const pngSize = png.length;

/* ── ICO Header (6 bytes) ─────────────────────── */
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved — must be 0
header.writeUInt16LE(1, 2); // type: 1 = ICO (2 = CUR)
header.writeUInt16LE(1, 4); // image count: 1

/* ── Directory Entry (16 bytes) ──────────────── */
const dir = Buffer.alloc(16);
dir.writeUInt8(32, 0);        // width  (32px; use 0 for 256px)
dir.writeUInt8(32, 1);        // height (32px; use 0 for 256px)
dir.writeUInt8(0,  2);        // palette size (0 = truecolor)
dir.writeUInt8(0,  3);        // reserved
dir.writeUInt16LE(1,  4);     // color planes
dir.writeUInt16LE(32, 6);     // bits per pixel
dir.writeUInt32LE(pngSize, 8);// byte size of image data
dir.writeUInt32LE(22,      12);// offset to image data (6 + 16 = 22)

/* ── Write ICO ────────────────────────────────── */
fs.writeFileSync(icoPath, Buffer.concat([header, dir, png]));

console.log(`✅ favicon.ico written → ${icoPath}`);
console.log(`   Source: favicon-32x32.png (${pngSize} bytes)`);
console.log(`   Total ICO size: ${6 + 16 + pngSize} bytes`);
