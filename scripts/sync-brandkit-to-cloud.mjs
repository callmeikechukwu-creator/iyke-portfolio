import fs from "fs";
import path from "path";

const GATEWAY_URL = "https://iyke-storage-gateway.iyke-storage-gateway.workers.dev";
const API_KEY = "ik_live_portfolio_master";
const BRANDKIT_DIR = "C:\\Users\\user\\Downloads\\Design\\IykeVisuals_BrandKit_2\\kit";

const MIME_TYPES = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".gif": "image/gif",
  ".json": "application/json",
  ".md": "text/markdown",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
};

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      results.push({ fullPath, relPath, filename: entry.name, size: fs.statSync(fullPath).size });
    }
  }
  return results;
}

async function uploadFile(fileInfo, index, total) {
  const ext = path.extname(fileInfo.filename).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";

  // Determine subfolder inside "brand"
  // e.g. icons/master/icon.svg -> folder = "brand/icons/master"
  const dirPart = path.dirname(fileInfo.relPath);
  const folder = dirPart === "." ? "brand" : `brand/${dirPart}`;

  const buffer = fs.readFileSync(fileInfo.fullPath);
  const cleanFilename = fileInfo.filename.toLowerCase().replace(/[^a-z0-9._-]/g, "-");

  const headers = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": mime,
    "x-folder": folder,
    "x-filename": cleanFilename,
    "x-tags": `brand,brandkit,${dirPart.split("/")[0]}`,
    "x-alt": `Brand kit asset ${cleanFilename}`,
  };

  try {
    const res = await fetch(`${GATEWAY_URL}/v1/upload`, {
      method: "POST",
      headers,
      body: buffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[${index}/${total}] ❌ Failed: ${fileInfo.relPath} (${res.status}): ${errText}`);
      return null;
    }

    const json = await res.json();
    console.log(`[${index}/${total}] ✅ ${fileInfo.relPath} (${(fileInfo.size / 1024).toFixed(1)} KB) -> ${json.data?.cdnUrl}`);
    return json.data;
  } catch (err) {
    console.error(`[${index}/${total}] ❌ Network error on ${fileInfo.relPath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log("Reading assets from:", BRANDKIT_DIR);
  if (!fs.existsSync(BRANDKIT_DIR)) {
    console.error("Brand kit directory not found:", BRANDKIT_DIR);
    process.exit(1);
  }

  // Focus on core brand assets: icons, wordmark, animations, docs
  const targetFolders = ["icons", "wordmark", "animations", "docs"];
  let allFiles = [];

  for (const folder of targetFolders) {
    const folderPath = path.join(BRANDKIT_DIR, folder);
    const files = getAllFiles(folderPath, BRANDKIT_DIR);
    allFiles = allFiles.concat(files);
  }

  const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
  console.log(`Found ${allFiles.length} brand kit files (${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
  console.log("Starting cloud upload to Cloudflare R2 via Iyke Storage Gateway...\n");

  const CONCURRENCY = 4;
  let completed = 0;
  const results = [];

  for (let i = 0; i < allFiles.length; i += CONCURRENCY) {
    const chunk = allFiles.slice(i, i + CONCURRENCY);
    const promises = chunk.map((f, idx) => uploadFile(f, i + idx + 1, allFiles.length));
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults.filter(Boolean));
  }

  console.log(`\n🎉 Upload Complete! ${results.length} / ${allFiles.length} files successfully synced to R2 cloud storage.`);
}

run().catch(console.error);
