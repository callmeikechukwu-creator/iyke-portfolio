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
interface StorageClientConfig {
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
interface OptimizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    generateBlur?: boolean;
}
interface OptimizationResult {
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
interface UploadOptions extends OptimizeOptions {
    folder?: string;
    tags?: string[];
    alt?: string;
    skipOptimization?: boolean;
}
interface UploadResult {
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
interface ListOptions {
    folder?: string;
    limit?: number;
    cursor?: string;
    tag?: string;
}
interface ListResult {
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
interface DeleteResult {
    success: boolean;
    deletedKey: string;
}
/**
 * Check if a file should bypass raster compression
 */
declare function shouldBypassCompression(filename: string, mimeType?: string): boolean;
/**
 * Optimizes an image visually-lossless in-browser via HTML5 Canvas
 */
declare function optimizeMedia(file: File, options?: OptimizeOptions): Promise<OptimizationResult>;
/**
 * Universal Storage Client Instance
 */
declare class IykeStorageClient {
    private config;
    constructor(config: StorageClientConfig);
    /**
     * Upload an asset to the storage gateway with auto-compression
     */
    upload(file: File, options?: UploadOptions): Promise<UploadResult>;
    /**
     * List files in the project namespace
     */
    listFiles(options?: ListOptions): Promise<ListResult>;
    /**
     * Delete an asset by its key
     */
    deleteFile(key: string): Promise<DeleteResult>;
}
/**
 * Factory function to create a storage client instance
 */
declare function createStorageClient(config: StorageClientConfig): IykeStorageClient;

export { type DeleteResult, IykeStorageClient, type ListOptions, type ListResult, type OptimizationResult, type OptimizeOptions, type StorageClientConfig, type UploadOptions, type UploadResult, createStorageClient, optimizeMedia, shouldBypassCompression };
