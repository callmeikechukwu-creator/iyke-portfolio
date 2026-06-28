/**
 * generate-icons.mjs
 * Generates all PNG favicon/icon sizes from the master SVG using Puppeteer.
 * Run once: node scripts/generate-icons.mjs
 *
 * Output:
 *   public/favicon-16x16.png
 *   public/favicon-32x32.png
 *   public/favicon-48x48.png
 *   public/apple-touch-icon.png        (180x180)
 *   public/android-chrome-192x192.png
 *   public/android-chrome-512x512.png
 *   public/maskable-icon-512x512.png   (with safe-zone padding for adaptive icons)
 *   public/mstile-150x150.png          (Windows tile)
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

// Read the master SVG
const svgPath = path.resolve(__dirname, "../src/app/icon.svg");
const svgContent = fs.readFileSync(svgPath, "utf-8");

// Encode SVG as data URI
const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

const sizes = [
  { name: "favicon-16x16.png",          size: 16,  padding: 0 },
  { name: "favicon-32x32.png",          size: 32,  padding: 0 },
  { name: "favicon-48x48.png",          size: 48,  padding: 0 },
  { name: "apple-touch-icon.png",       size: 180, padding: 0 },
  { name: "android-chrome-192x192.png", size: 192, padding: 0 },
  { name: "android-chrome-512x512.png", size: 512, padding: 0 },
  { name: "maskable-icon-512x512.png",  size: 512, padding: 80 }, // 80px safe zone
  { name: "mstile-150x150.png",         size: 150, padding: 0 },
];

async function generateIcons() {
  console.log("🎨 Generating favicon PNG files...\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  for (const { name, size, padding } of sizes) {
    const totalSize = size;
    const iconSize = size - padding * 2;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: ${totalSize}px;
            height: ${totalSize}px;
            background: ${padding > 0 ? "#D63A2F" : "transparent"};
            display: flex;
            align-items: center;
            justify-content: center;
          }
          img {
            width: ${iconSize}px;
            height: ${iconSize}px;
          }
        </style>
      </head>
      <body>
        <img src="${svgDataUri}" alt="IA" />
      </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.setViewport({ width: totalSize, height: totalSize, deviceScaleFactor: 1 });

    const outputPath = path.join(publicDir, name);
    await page.screenshot({
      path: outputPath,
      clip: { x: 0, y: 0, width: totalSize, height: totalSize },
      omitBackground: padding === 0,
    });

    console.log(`  ✅ ${name} (${totalSize}x${totalSize})`);
  }

  await browser.close();
  console.log("\n✨ All icons generated successfully!\n");
  console.log("📁 Files saved to: public/");
}

generateIcons().catch((err) => {
  console.error("❌ Icon generation failed:", err);
  process.exit(1);
});
