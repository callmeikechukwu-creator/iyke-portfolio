/**
 * iyke-storage
 * ============================================================
 * Universal zero-egress media storage client with visually-lossless
 * client-side WebP auto-compression, blurhash generation, and
 * Cloudflare R2 edge gateway support.
 *
 * @author Alaeto Ikechukwu
 * @license MIT
 * ============================================================
 */

export interface StorageClientConfig {
  /**
   * Base URL of your Cloudflare Storage Gateway Worker
   * e.g. "https://iyke-storage-gateway.workers.dev" or custom domain
   */
  gatewayUrl: string;

  /**
   * Project-scoped API key (e.g. "ik_live_project_...")
   */
  apiKey: string;

  /**
   * Default target quality for WebP compression (0.0 to 1.0, default: 0.88 - visually lossless)
   */
  defaultQuality?: number;

  /**
   * Maximum boundary dimension for responsive scaling (default: 2560px for Retina / 2.5K)
   */
  maxDimension?: number;

  /**
   * Whether to generate base64 blur placeholders automatically (default: true)
   */
  generateBlur?: boolean;
}

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 - 1.0 (default: 0.88)
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

export interface ListOptions {
  folder?: string;
  limit?: number;
  cursor?: string;
  tag?: string;
}

export interface ListResult {
  success: boolean;
  project: string;
  count: number;
  cursor?: string;
  truncated?: boolean;
  files: Array<{
    key: string;
    cdnUrl: string;
    gatewayUrl: string;
    size: number;
    uploadedAt: string;
    contentType: string;
    metadata: Record<string, string>;
  }>;
}

export interface DeleteResult {
  success: boolean;
  deletedKey: string;
}

const BYPASS_EXTENSIONS = new Set([".svg", ".mp4", ".webm", ".gif", ".pdf", ".json", ".xml"]);

/**
 * Check if a file should bypass raster compression
 */
export function shouldBypassCompression(filename: string, mimeType?: string): boolean {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (BYPASS_EXTENSIONS.has(ext)) return true;
  if (mimeType) {
    if (
      mimeType.startsWith("video/") ||
      mimeType === "image/svg+xml" ||
      mimeType === "image/gif" ||
      mimeType === "application/pdf"
    ) {
      return true;
    }
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
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const originalSize = file.size;
  const originalName = file.name;
  const mimeType = file.type || "";

  // Bypass non-raster formats or server-side environments
  if (shouldBypassCompression(originalName, mimeType) || typeof window === "undefined") {
    return {
      file,
      filename: originalName,
      mimeType,
      originalSize,
      optimizedSize: originalSize,
      savingsPercent: 0,
      durationMs: Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime),
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
          durationMs: Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime),
          wasCompressed: false,
        });
        return;
      }

      // Preserve alpha transparency
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Generate instant micro-blur placeholder
      const blurDataURL = options.generateBlur !== false ? generateMicroBlur(canvas, targetWidth, targetHeight) : undefined;

      // Export as modern WebP
      canvas.toBlob(
        (blob) => {
          const durationMs = Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime);

          if (!blob || blob.size >= originalSize) {
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
        durationMs: Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - startTime),
        wasCompressed: false,
      });
    };

    img.src = objectUrl;
  });
}

/**
 * Universal Storage Client Instance
 */
export class IykeStorageClient {
  private config: StorageClientConfig;

  constructor(config: StorageClientConfig) {
    if (!config.gatewayUrl) {
      throw new Error("[iyke-storage] gatewayUrl is required in configuration");
    }
    if (!config.apiKey) {
      throw new Error("[iyke-storage] apiKey is required in configuration");
    }

    this.config = {
      ...config,
      gatewayUrl: config.gatewayUrl.replace(/\/+$/, ""),
      defaultQuality: config.defaultQuality ?? 0.88,
      maxDimension: config.maxDimension ?? 2560,
      generateBlur: config.generateBlur ?? true,
    };
  }

  /**
   * Upload an asset to the storage gateway with auto-compression
   */
  async upload(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    const opt = options.skipOptimization
      ? {
          file,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          originalSize: file.size,
          optimizedSize: file.size,
          savingsPercent: 0,
          durationMs: 0,
          wasCompressed: false,
        }
      : await optimizeMedia(file, {
          quality: options.quality ?? this.config.defaultQuality,
          maxWidth: options.maxWidth ?? this.config.maxDimension,
          maxHeight: options.maxHeight ?? this.config.maxDimension,
          generateBlur: options.generateBlur ?? this.config.generateBlur,
        });

    const folder = options.folder || "general";
    const tagsStr = (options.tags || []).join(",");
    const alt = options.alt || `Asset ${opt.filename}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": opt.mimeType || "application/octet-stream",
      "x-filename": opt.filename,
      "x-folder": folder,
      "x-tags": tagsStr,
      "x-alt": alt,
    };

    if (opt.width) headers["x-width"] = String(opt.width);
    if (opt.height) headers["x-height"] = String(opt.height);
    if (opt.blurDataURL) headers["x-blur"] = opt.blurDataURL;

    const buffer = await opt.file.arrayBuffer();
    const res = await fetch(`${this.config.gatewayUrl}/v1/upload`, {
      method: "POST",
      headers,
      body: buffer,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `[iyke-storage] Upload failed with status ${res.status}`);
    }

    return {
      success: true,
      key: json.data.key,
      cdnUrl: json.data.cdnUrl,
      gatewayUrl: json.data.gatewayUrl,
      filename: json.data.filename,
      size: json.data.size,
      contentType: json.data.contentType,
      width: opt.width,
      height: opt.height,
      blurDataURL: opt.blurDataURL,
      stats: {
        originalSize: opt.originalSize,
        optimizedSize: opt.optimizedSize,
        savingsPercent: opt.savingsPercent,
        durationMs: opt.durationMs,
      },
    };
  }

  /**
   * List files in the project namespace
   */
  async listFiles(options: ListOptions = {}): Promise<ListResult> {
    const url = new URL(`${this.config.gatewayUrl}/v1/files`);
    if (options.folder && options.folder !== "all") {
      url.searchParams.set("folder", options.folder);
    }
    if (options.limit) url.searchParams.set("limit", String(options.limit));
    if (options.cursor) url.searchParams.set("cursor", options.cursor);
    if (options.tag) url.searchParams.set("tag", options.tag);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `[iyke-storage] Failed to list files`);
    }

    return json;
  }

  /**
   * Delete an asset by its key
   */
  async deleteFile(key: string): Promise<DeleteResult> {
    const res = await fetch(`${this.config.gatewayUrl}/v1/files/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || `[iyke-storage] Failed to delete file`);
    }

    return json;
  }
}

/**
 * Factory function to create a storage client instance
 */
export function createStorageClient(config: StorageClientConfig): IykeStorageClient {
  return new IykeStorageClient(config);
}
