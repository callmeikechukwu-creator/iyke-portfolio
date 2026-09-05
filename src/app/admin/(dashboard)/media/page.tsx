"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
  FileImage,
  Folder,
  Trash2,
  RefreshCw,
  Search,
  Cloud,
  Zap,
} from "lucide-react";
import { optimizeMedia } from "@/lib/storage-client";

interface CloudAsset {
  key: string;
  cdnUrl: string;
  gatewayUrl: string;
  size: number;
  etag?: string;
  uploadedAt: string;
  contentType: string;
  metadata?: {
    project?: string;
    folder?: string;
    filename?: string;
    tags?: string;
    alt?: string;
    width?: string;
    height?: string;
    blurDataURL?: string;
  };
}

const FOLDERS = [
  { id: "all", label: "All Assets" },
  { id: "projects", label: "Projects" },
  { id: "brand", label: "Brand Kit" },
  { id: "blog", label: "Blog" },
  { id: "general", label: "General" },
];

export default function MediaAdminPage() {
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [assets, setAssets] = useState<CloudAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("projects");
  const [uploadTags, setUploadTags] = useState("");
  const [compressionLog, setCompressionLog] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"cdn" | "rel" | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const folderParam = activeFolder === "all" ? "" : activeFolder;
      const res = await fetch(`/api/admin/media?folder=${encodeURIComponent(folderParam)}&limit=100`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAssets(data.files || []);
      } else {
        setError(data.error || "Failed to load cloud media");
      }
    } catch (err: any) {
      setError("Network error fetching media from storage gateway");
    } finally {
      setLoading(false);
    }
  }, [activeFolder]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    setError("");
    setSuccess("");
    setUploading(true);
    setCompressionLog([]);

    const fileList = Array.from(rawFiles);
    const newLogs: string[] = [];

    try {
      for (const file of fileList) {
        // 1. Run client-side visually-lossless WebP optimizer (Path A)
        const opt = await optimizeMedia(file, { quality: 0.88 });

        if (opt.wasCompressed) {
          const origMb = (opt.originalSize / 1024 / 1024).toFixed(2);
          const optKb = (opt.optimizedSize / 1024).toFixed(0);
          newLogs.push(
            `⚡ Compressed '${file.name}' (${origMb} MB) → WebP (${optKb} KB, -${opt.savingsPercent}%) in ${opt.durationMs}ms`
          );
        } else {
          newLogs.push(`📦 Bypassed '${file.name}' (native format retained)`);
        }
        setCompressionLog([...newLogs]);

        // 2. Transmit to server proxy
        const formData = new FormData();
        formData.append("file", opt.file);
        formData.append("folder", uploadFolder);
        formData.append("tags", uploadTags);
        formData.append("alt", `Portfolio asset ${opt.filename}`);
        if (opt.width) formData.append("width", String(opt.width));
        if (opt.height) formData.append("height", String(opt.height));
        if (opt.blurDataURL) formData.append("blurDataURL", opt.blurDataURL);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || `Upload rejected for ${file.name}`);
        }
      }

      setSuccess(`Successfully optimized and uploaded ${fileList.length} asset(s) to R2!`);
      setTimeout(() => setSuccess(""), 5000);
      await fetchAssets();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to permanently delete this asset from the cloud?\n\nKey: ${key}`)) {
      return;
    }

    setDeletingKey(key);
    setError("");
    try {
      const res = await fetch(`/api/admin/media?key=${encodeURIComponent(key)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAssets((prev) => prev.filter((a) => a.key !== key));
        setSuccess("Asset permanently removed from Cloudflare R2.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to delete asset");
      }
    } catch (err: any) {
      setError("Network error deleting asset");
    } finally {
      setDeletingKey(null);
    }
  };

  const handleCopy = (text: string, key: string, type: "cdn" | "rel") => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedKey(null);
      setCopiedType(null);
    }, 2000);
  };

  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const keyMatch = asset.key.toLowerCase().includes(q);
    const tagsMatch = (asset.metadata?.tags || "").toLowerCase().includes(q);
    return keyMatch || tagsMatch;
  });

  return (
    <div className="flex flex-col gap-6 font-body pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/5 pb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Media Center</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-blue/10 text-blue border border-blue/20 flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-blue" />
              Cloudflare R2 • Zero Egress
            </span>
          </div>
          <p className="text-xs text-muted">
            Centralized media storage gateway for the portfolio. High-speed global edge CDN distribution with client-side WebP auto-compression.
          </p>
        </div>

        <button
          onClick={fetchAssets}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2 bg-cream hover:bg-ink hover:text-cream text-ink text-xs font-semibold rounded-xl border border-ink/10 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-orange/5 border border-orange/20 text-orange text-sm rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 text-sm rounded-2xl flex items-start gap-2.5">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2. Upload Zone with Client-Side Optimizer */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-ink/5 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-ink/5 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange" />
            <h3 className="text-sm font-bold text-ink">Fast On-The-Go Upload & Compression</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Folder className="w-3.5 h-3.5 text-muted" />
              <span className="text-muted font-medium">Destination Folder:</span>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cream/50 border border-ink/10 text-ink focus:outline-none focus:border-blue"
              >
                <option value="projects">projects/</option>
                <option value="brand">brand/</option>
                <option value="blog">blog/</option>
                <option value="general">general/</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={uploadTags}
              onChange={(e) => setUploadTags(e.target.value)}
              className="px-3 py-1 text-xs rounded-lg bg-cream/50 border border-ink/10 text-ink placeholder:text-muted/60 focus:outline-none focus:border-blue max-w-[180px]"
            />
          </div>
        </div>

        {/* Drag and drop input */}
        <div className="border-2 border-dashed border-ink/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center hover:border-blue/30 transition-all bg-cream/10">
          <div className="p-3.5 bg-white rounded-full shadow-sm border border-ink/5">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-orange" />
            ) : (
              <Upload className="w-6 h-6 text-blue" />
            )}
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <span className="text-sm font-semibold text-ink">
              {uploading ? "Compressing & Streaming to R2..." : "Drop images, videos, or documents to upload"}
            </span>
            <p className="text-xs text-muted">
              Heavy camera shots & PNGs are automatically converted to crisp WebP on-the-fly (-90% size) with alpha transparency preserved. SVGs & videos are kept untouched.
            </p>
          </div>

          {!uploading && (
            <label className="px-5 py-2.5 bg-ink text-cream hover:bg-orange transition-colors duration-300 rounded-full font-semibold text-xs tracking-wider uppercase shadow-sm cursor-pointer mt-1">
              Select files
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {/* Compression readout feedback */}
        {compressionLog.length > 0 && (
          <div className="bg-cream/40 p-3.5 rounded-xl border border-ink/5 flex flex-col gap-1.5 text-[11px] font-mono text-ink/80 max-h-32 overflow-y-auto">
            {compressionLog.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-orange flex-shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Cloud Explorer */}
      <div className="flex flex-col gap-4">
        {/* Filters and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFolder === f.id
                    ? "bg-ink text-cream shadow-sm"
                    : "bg-white text-muted hover:text-ink border border-ink/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search filename or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-ink/10 text-ink placeholder:text-muted/60 focus:outline-none focus:border-blue"
            />
          </div>
        </div>

        {/* Asset Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
            <span className="text-xs">Loading assets from Cloudflare R2...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-16 bg-white rounded-2xl border border-ink/5 text-center flex flex-col items-center justify-center gap-2 text-muted text-xs">
            <FileImage className="w-8 h-8 text-muted/40" />
            <span>No assets found in this folder.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => {
              const filename = asset.key.split("/").pop() || asset.key;
              const isImage = asset.contentType.startsWith("image/");
              const isVideo = asset.contentType.startsWith("video/");
              const relativePath = asset.key.replace(/^iyke-portfolio/, "");

              return (
                <div
                  key={asset.key}
                  className="bg-white rounded-2xl border border-ink/5 p-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-ink/15 transition-all group"
                >
                  {/* Thumbnail / Media Preview */}
                  <div className="aspect-[4/3] rounded-xl bg-cream/50 overflow-hidden relative flex items-center justify-center border border-ink/5 mb-2.5">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.cdnUrl}
                        alt={filename}
                        loading="lazy"
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : isVideo ? (
                      <video
                        src={asset.cdnUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                        playsInline
                      />
                    ) : (
                      <FileImage className="w-8 h-8 text-blue/60" />
                    )}

                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-mono font-medium bg-black/60 text-white backdrop-blur-sm">
                      {(asset.size / 1024).toFixed(1)} KB
                    </span>
                  </div>

                  {/* Metadata info */}
                  <div className="flex flex-col gap-1 mb-3">
                    <span className="text-xs font-semibold text-ink truncate" title={filename}>
                      {filename}
                    </span>
                    <span className="text-[10px] text-muted font-mono truncate" title={relativePath}>
                      {relativePath}
                    </span>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-ink/5 gap-1">
                    <div className="flex items-center gap-1">
                      {/* Copy Relative Path */}
                      <button
                        onClick={() => handleCopy(relativePath, asset.key, "rel")}
                        className="p-1.5 bg-cream hover:bg-blue hover:text-white rounded-lg text-ink/75 transition-colors cursor-pointer"
                        title="Copy Relative Path (e.g. /projects/filename.webp)"
                      >
                        {copiedKey === asset.key && copiedType === "rel" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Open CDN in new tab */}
                      <a
                        href={asset.cdnUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-cream hover:bg-orange hover:text-white rounded-lg text-ink/75 transition-colors"
                        title="Open live Edge CDN URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Delete asset */}
                    <button
                      onClick={() => handleDelete(asset.key)}
                      disabled={deletingKey === asset.key}
                      className="p-1.5 hover:bg-red-50 text-muted hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete from R2"
                    >
                      {deletingKey === asset.key ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
