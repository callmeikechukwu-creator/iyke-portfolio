/**
 * generate-favicon.mjs
 *
 * Renders the "IA" monogram using the actual Stack Sans Notch font
 * via Puppeteer, then saves high-fidelity PNGs at all required sizes.
 *
 * Outputs:
 *   src/app/icon.png               ← Next.js primary favicon (512×512)
 *   public/favicon-16x16.png
 *   public/favicon-32x32.png
 *   public/favicon-48x48.png
 *   public/apple-touch-icon.png    (180×180)
 *   public/android-chrome-192x192.png
 *   public/android-chrome-512x512.png
 *   public/maskable-icon-512x512.png
 *   public/mstile-150x150.png
 *   public/favicon.ico             (served statically)
 */

import puppeteer  from "puppeteer";
import fs         from "fs";
import path       from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const root       = path.resolve(__dirname, "..");
const publicDir  = path.resolve(root, "public");
const appDir     = path.resolve(root, "src", "app");
const templatePath = path.resolve(__dirname, "favicon-template.html");

/* ── Output file definitions ─────────────────────────────────── */
const outputs = [
  // The master — used by Next.js as the primary icon
  { dest: path.join(appDir,    "icon.png"),                   size: 512, mask: false },
  // Public variants
  { dest: path.join(publicDir, "icon.png"),                   size: 512, mask: false },
  { dest: path.join(publicDir, "android-chrome-512x512.png"), size: 512, mask: false },
  { dest: path.join(publicDir, "maskable-icon-512x512.png"),  size: 512, mask: true  },
  { dest: path.join(publicDir, "android-chrome-192x192.png"), size: 192, mask: false },
  { dest: path.join(publicDir, "apple-touch-icon.png"),       size: 180, mask: false },
  { dest: path.join(publicDir, "mstile-150x150.png"),         size: 150, mask: false },
  { dest: path.join(publicDir, "favicon-48x48.png"),          size: 48,  mask: false },
  { dest: path.join(publicDir, "favicon-32x32.png"),          size: 32,  mask: false },
  { dest: path.join(publicDir, "favicon-16x16.png"),          size: 16,  mask: false },
];

/* ── Maskable safe-zone padding (10% on each side = 20% total) ── */
const MASK_PADDING_FACTOR = 0.10; // 10% on each side

async function run() {
  console.log("🎨  Generating high-fidelity favicons with Stack Sans Notch...\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Load the template and wait for fonts to be ready
  const fileUrl = `file:///${templatePath.replace(/\\/g, "/")}`;
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for Google Fonts to actually load & render
  await page.evaluate(() =>
    document.fonts.ready.then(() => {
      // Extra small delay to let the browser paint
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    })
  );

  /* ── Master screenshot at device scale 2 (1024px → downsample to 512) ── */
  await page.setViewport({ width: 512, height: 512, deviceScaleFactor: 2 });

  // Take the master at 2× resolution for quality
  const masterBuffer = await page.screenshot({
    clip: { x: 0, y: 0, width: 512, height: 512 },
    type: "png",
    omitBackground: false,
  });

  await browser.close();

  /* ── Write all sizes using CSS scaling trick via a new browser session ── */
  const browser2 = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page2 = await browser2.newPage();

  for (const { dest, size, mask } of outputs) {
    const padding = mask ? Math.round(size * MASK_PADDING_FACTOR) : 0;
    const iconSize = size - padding * 2;

    const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${size}px;
    height: ${size}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${mask ? "#D63A2F" : "transparent"};
  }
  img {
    width: ${iconSize}px;
    height: ${iconSize}px;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
</style>
</head>
<body>
  <img src="data:image/png;base64,${masterBuffer.toString("base64")}" alt=""/>
</body>
</html>`;

    await page2.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page2.setContent(html, { waitUntil: "domcontentloaded" });

    const buf = await page2.screenshot({
      clip: { x: 0, y: 0, width: size, height: size },
      type: "png",
      omitBackground: !mask,
    });

    fs.writeFileSync(dest, buf);
    const label = path.relative(root, dest).replace(/\\/g, "/");
    console.log(`  ✅  ${label} (${size}×${size}${mask ? " maskable" : ""})`);
  }

  await browser2.close();

  /* ── Write favicon.ico (wraps the 32px PNG in ICO format) ─────────── */
  const png32 = fs.readFileSync(path.join(publicDir, "favicon-32x32.png"));
  const icoPath = path.join(publicDir, "favicon.ico");

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(1, 4); // count: 1 image

  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0);
  dir.writeUInt8(32, 1);
  dir.writeUInt8(0,  2);
  dir.writeUInt8(0,  3);
  dir.writeUInt16LE(1,           4);
  dir.writeUInt16LE(32,          6);
  dir.writeUInt32LE(png32.length, 8);
  dir.writeUInt32LE(22,          12);

  fs.writeFileSync(icoPath, Buffer.concat([header, dir, png32]));
  console.log(`  ✅  public/favicon.ico (32×32 ICO)`);

  /* ── Delete old src/app/favicon.ico to prevent Next.js from processing it ── */
  const oldIcoPath = path.join(appDir, "favicon.ico");
  if (fs.existsSync(oldIcoPath)) {
    fs.unlinkSync(oldIcoPath);
    console.log(`  🗑   Removed src/app/favicon.ico (moved to public/favicon.ico)`);
  }

  /* ── Delete the old path-based icon.svg so PNG takes precedence ────── */
  const svgPath = path.join(appDir, "icon.svg");
  if (fs.existsSync(svgPath)) {
    fs.unlinkSync(svgPath);
    console.log(`  🗑   Removed src/app/icon.svg (replaced by icon.png)`);
  }

  console.log("\n✨  Done! All favicon assets generated with Stack Sans Notch.\n");
  console.log("   ⚠  Open an incognito window (or Ctrl+Shift+Del → cached images)");
  console.log("      to see the new favicon — browsers cache these aggressively.\n");
}

run().catch((err) => {
  console.error("❌  Favicon generation failed:", err.message || err);
  process.exit(1);
});
