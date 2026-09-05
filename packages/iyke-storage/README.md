# iyke-storage ⚡

[![npm version](https://img.shields.io/npm/v/iyke-storage.svg?style=flat-square)](https://www.npmjs.com/package/iyke-storage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Zero Egress](https://img.shields.io/badge/Zero_Egress_Fees-Cloudflare_R2-orange.svg?style=flat-square)](https://www.cloudflare.com/developer-platform/r2/)

Universal zero-egress media storage client with **visually-lossless client-side WebP auto-compression**, progressive **blurhash generation**, intrinsic dimension extraction, and **Cloudflare R2 + Workers KV edge gateway** support.

---

## 🌟 Why iyke-storage?

Uploading heavy images (10MB–25MB camera shots or PNG mockups) over mobile networks is slow, drains user data, and clogs cloud buckets. 

`iyke-storage` solves this by introducing a **perceptual client-side optimization pipeline**:
- **⚡ Fast On-The-Go WebP Auto-Compression**: Slashes 20 MB images down to ~400 KB in under 100ms on the user's device before network transfer.
- **💎 Full Alpha Transparency Preserved**: Transparent PNG cutouts, shadows, and vector logos never get black or white backgrounds.
- **📏 Intrinsic Metadata**: Extracts exact `width`, `height`, and `aspectRatio` for zero Cumulative Layout Shift (CLS).
- **🌀 Instant Progressive Blur**: Auto-generates a tiny base64 placeholder (`blurDataURL`) for instant loading skeletons.
- **🛡️ Format-Aware Protection**: Vectors (SVG), videos (MP4, WebM), animated GIFs, PDFs, and fonts bypass lossy compression automatically.
- **☁️ Zero Egress Fees**: Native Cloudflare R2 edge gateway with 1-year immutable caching.
- **🔑 Dynamic Edge API Keys**: Project-isolated keys hashed with SHA-256 and resolved at 300+ global Cloudflare KV edge locations.

---

## 📦 Installation

```bash
npm install iyke-storage
# or
pnpm add iyke-storage
# or
yarn add iyke-storage
```

---

## 🚀 Quick Start

### Mode 1: With Cloudflare R2 Gateway (Full Suite)

Initialize the storage client with your gateway URL and project API key:

```ts
import { createStorageClient } from "iyke-storage";

const storage = createStorageClient({
  gatewayUrl: process.env.NEXT_PUBLIC_STORAGE_GATEWAY_URL!,
  apiKey: process.env.NEXT_PUBLIC_STORAGE_API_KEY!,
});

// Upload a user-selected File:
async function handleUpload(file: File) {
  const result = await storage.upload(file, {
    folder: "projects",
    tags: ["case-study", "ui"],
    alt: "Hero dashboard mockup",
  });

  console.log(result.cdnUrl);      // https://gateway.../cdn/project/folder/file.webp
  console.log(result.blurDataURL);  // data:image/webp;base64,...
  console.log(result.width, result.height); // 1920, 1080
  console.log(result.stats);        // { originalSize: 18400000, optimizedSize: 420000, savingsPercent: 97 }
}
```

---

### Mode 2: Standalone Optimizer (Use With Any Cloud)

Even if you use **AWS S3, Supabase Storage, Firebase, or Uploadthing**, you can use the standalone perceptual optimizer directly in your browser:

```ts
import { optimizeMedia } from "iyke-storage";

async function onFileSelected(file: File) {
  // Compresses PNG/JPEG to WebP in ~80ms on device
  const opt = await optimizeMedia(file, {
    quality: 0.88,       // 88% is visually lossless
    maxWidth: 2560,      // Retina boundary cap
    generateBlur: true,  // Auto micro-blur placeholder
  });

  console.log(opt.file);           // WebP File object ready for S3 / Supabase upload
  console.log(opt.blurDataURL);    // Instant blur placeholder
  console.log(opt.savingsPercent); // e.g. 92%
}
```

---

## 💻 Terminal CLI (`npx iyke-storage`)

`iyke-storage` comes with an official command line tool:

```bash
# List all active project keys
npx iyke-storage keys list

# Generate a new project-scoped key for a new SaaS or mobile app
npx iyke-storage keys create --project my-new-saas --name "Mobile App Client"

# Revoke an API key globally in milliseconds
npx iyke-storage keys revoke key_7a8f1234

# Upload any asset directly from your terminal
npx iyke-storage upload ./screenshot.png --folder brand
```

---

## ⚙️ Configuration Reference

### `StorageClientConfig`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `gatewayUrl` | `string` | **Required** | Edge worker gateway URL |
| `apiKey` | `string` | **Required** | Project API key (`ik_live_...`) |
| `defaultQuality` | `number` | `0.88` | Target WebP quality (0.0 to 1.0) |
| `maxDimension` | `number` | `2560` | Maximum width or height boundary (px) |
| `generateBlur` | `boolean` | `true` | Generate base64 progressive blur |

### `UploadOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `folder` | `string` | `"general"` | Destination folder within project |
| `tags` | `string[]` | `[]` | Search and categorization tags |
| `alt` | `string` | `""` | Accessibility text stored in R2 metadata |
| `quality` | `number` | `0.88` | Custom quality override for this upload |
| `skipOptimization` | `boolean` | `false` | Upload raw file without compression |

---

## 📄 License

MIT © Alaeto Ikechukwu
