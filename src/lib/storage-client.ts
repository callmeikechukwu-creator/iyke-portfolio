/**
 * Iyke Universal Storage & Media Optimization Client
 * ============================================================
 * Universal, visually-lossless media engine:
 * 1. Fast on-the-fly client-side WebP compression (q: 88%)
 * 2. Full 8-bit alpha transparency preservation
 * 3. Automatic dimension & aspect ratio extraction
 * 4. Micro-blur base64 placeholder (blurDataURL) generator
 * 5. Safe bypass for SVGs, Videos, GIFs, and PDFs
 * ============================================================
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0 (default: 0.88 - visually lossless)
  generateBlur?: boolean;
}

export interface OptimizationResult {
  file: File | Blob;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  blurDataURL?: string;
  originalSize: number;
  optimizedSize: number;
  savingsPercent: number;
  durationMs: number;
  wasCompressed: boolean;
}

export interface UploadOptions extends OptimizeOptions {
  folder?: string;
  tags?: string[];
  alt?: string;
  apiKey?: string;
  gatewayUrl?: string;
  skipOptimization?: boolean;
}

export interface UploadResult {
  success: boolean;
  key: string;
  cdnUrl: string;
  gatewayUrl: string;
  filename: string;
  size: number;
  contentType: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  stats?: {
    originalSize: number;
    optimizedSize: number;
    savingsPercent: number;
    durationMs: number;
  };
}

const BYPASS_EXTENSIONS = new Set([".svg", ".mp4", ".webm", ".gif", ".pdf", ".json", ".xml"]);

/**
 * Check if a file should bypass raster compression
 */
export function shouldBypassCompression(filename: string, mimeType: string): boolean {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (BYPASS_EXTENSIONS.has(ext)) return true;
  if (mimeType.startsWith("video/") || mimeType === "image/svg+xml" || mimeType === "image/gif" || mimeType === "application/pdf") {
    return true;
  }
  return false;
}

/**
 * Generate a micro-blur base64 placeholder for progressive image loading
 */
function generateMicroBlur(img: CanvasImageSource, width: number, height: number): string {
  if (typeof document === "undefined") return "";
  const blurCanvas = document.createElement("canvas");
  const blurSize = 20;
  const aspect = width / height;

  if (aspect >= 1) {
    blurCanvas.width = blurSize;
    blurCanvas.height = Math.max(1, Math.round(blurSize / aspect));
  } else {
    blurCanvas.height = blurSize;
    blurCanvas.width = Math.max(1, Math.round(blurSize * aspect));
  }

  const ctx = blurCanvas.getContext("2d");
  if (!ctx) return "";

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, blurCanvas.width, blurCanvas.height);

  return blurCanvas.toDataURL("image/webp", 0.4);
}

/**
 * Optimizes an image visually-lossless in-browser via HTML5 Canvas
 */
export async function optimizeMedia(
  file: File,
  options: OptimizeOptions = {}
): Promise<OptimizationResult> {
  const startTime = performance.now();
  const originalSize = file.size;
  const originalName = file.name;
  const mimeType = file.type || "";

  // Bypass non-raster formats (SVGs, videos, animations, docs)
  if (shouldBypassCompression(originalName, mimeType) || typeof window === "undefined") {
    return {
      file,
      filename: originalName,
      mimeType,
      originalSize,
      optimizedSize: originalSize,
      savingsPercent: 0,
      durationMs: Math.round(performance.now() - startTime),
      wasCompressed: false,
    };
  }

  const maxWidth = options.maxWidth || 2560;
  const maxHeight = options.maxHeight || 2560;
  const quality = options.quality ?? 0.88; // 88% WebP is perceptually lossless

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // Scale down only if image exceeds 2.5K boundaries (preserve high-density Retina)
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d", { alpha: true });

      if (!ctx) {
        // Fallback to original
        resolve({
          file,
          filename: originalName,
          mimeType,
          width: targetWidth,
          height: targetHeight,
          aspectRatio: targetWidth / targetHeight,
          originalSize,
          optimizedSize: originalSize,
          savingsPercent: 0,
          durationMs: Math.round(performance.now() - startTime),
          wasCompressed: false,
        });
        return;
      }

      // Preserve alpha transparency: clear canvas with zero fill
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Generate instant micro-blur placeholder
      const blurDataURL = options.generateBlur !== false ? generateMicroBlur(canvas, targetWidth, targetHeight) : undefined;

      // Convert to modern WebP with alpha preservation
      canvas.toBlob(
        (blob) => {
          const durationMs = Math.round(performance.now() - startTime);

          if (!blob || blob.size >= originalSize) {
            // If the compressed version is somehow larger, preserve the original file
            resolve({
              file,
              filename: originalName,
              mimeType,
              width: targetWidth,
              height: targetHeight,
              aspectRatio: targetWidth / targetHeight,
              blurDataURL,
              originalSize,
              optimizedSize: originalSize,
              savingsPercent: 0,
              durationMs,
              wasCompressed: false,
            });
            return;
          }

          const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
          const optimizedFilename = `${baseName}.webp`;
          const optimizedFile = new File([blob], optimizedFilename, { type: "image/webp" });
          const savings = Math.max(0, Math.round(((originalSize - blob.size) / originalSize) * 100));

          resolve({
            file: optimizedFile,
            filename: optimizedFilename,
            mimeType: "image/webp",
            width: targetWidth,
            height: targetHeight,
            aspectRatio: Number((targetWidth / targetHeight).toFixed(3)),
            blurDataURL,
            originalSize,
            optimizedSize: blob.size,
            savingsPercent: savings,
            durationMs,
            wasCompressed: true,
          });
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file,
        filename: originalName,
        mimeType,
        originalSize,
        optimizedSize: originalSize,
        savingsPercent: 0,
        durationMs: Math.round(performance.now() - startTime),
        wasCompressed: false,
      });
    };

    img.src = objectUrl;
  });
}

/**
 * Upload a media file to the Storage Gateway with automatic optimization
 */
export async function uploadMedia(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  const gatewayUrl =
    options.gatewayUrl ||
    process.env.NEXT_PUBLIC_STORAGE_GATEWAY_URL ||
    "https://iyke-storage-gateway.iyke-storage-gateway.workers.dev";

  const apiKey = options.apiKey || process.env.NEXT_PUBLIC_STORAGE_API_KEY || "ik_live_portfolio_master";

  // 1. Run client-side visually-lossless optimization
  const optimized = options.skipOptimization
    ? {
        file,
        filename: file.name,
        mimeType: file.type,
        originalSize: file.size,
        optimizedSize: file.size,
        savingsPercent: 0,
        durationMs: 0,
        wasCompressed: false,
      }
    : await optimizeMedia(file, options);

  const folder = options.folder || "general";
  const tagsStr = (options.tags || []).join(",");
  const alt = options.alt || `Media asset ${optimized.filename}`;

  // 2. Prepare headers for Gateway
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": optimized.mimeType || "application/octet-stream",
    "x-filename": optimized.filename,
    "x-folder": folder,
    "x-tags": tagsStr,
    "x-alt": alt,
  };

  if (optimized.width) headers["x-width"] = String(optimized.width);
  if (optimized.height) headers["x-height"] = String(optimized.height);
  if (optimized.blurDataURL) headers["x-blur"] = optimized.blurDataURL;

  // 3. Dispatch payload
  const buffer = await optimized.file.arrayBuffer();
  const res = await fetch(`${gatewayUrl}/v1/upload`, {
    method: "POST",
    headers,
    body: buffer,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Upload failed with status ${res.status}`);
  }

  return {
    success: true,
    key: json.data.key,
    cdnUrl: json.data.cdnUrl,
    gatewayUrl: json.data.gatewayUrl,
    filename: json.data.filename,
    size: json.data.size,
    contentType: json.data.contentType,
    width: optimized.width,
    height: optimized.height,
    blurDataURL: optimized.blurDataURL,
    stats: {
      originalSize: optimized.originalSize,
      optimizedSize: optimized.optimizedSize,
      savingsPercent: optimized.savingsPercent,
      durationMs: optimized.durationMs,
    },
  };
}
