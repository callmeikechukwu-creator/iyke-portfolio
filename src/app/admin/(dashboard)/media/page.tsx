"use client";

import { useState } from "react";
import { 
  Image as ImageIcon, Upload, Copy, Check, ExternalLink, Loader2, AlertCircle, 
  Sparkles, FileImage 
} from "lucide-react";

interface UploadedAsset {
  relativePath: string;
  secureUrl: string;
  name: string;
}

export default function MediaAdminPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // List of uploaded assets in the current session
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setUploading(true);

    try {
      const folderVal = "general";
      const fileList = Array.from(files);
      const newAssets: UploadedAsset[] = [];

      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folderVal);

        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            newAssets.push({
              relativePath: data.relativePath,
              secureUrl: data.secureUrl,
              name: file.name,
            });
          } else {
            setError(data.error || `Upload failed for ${file.name}`);
          }
        } else {
          setError(`Server rejected upload for ${file.name}`);
        }
      }

      if (newAssets.length > 0) {
        setUploadedAssets([...newAssets, ...uploadedAssets]);
        setSuccess(`Successfully uploaded ${newAssets.length} file(s)!`);
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during media uploads");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyPath = (path: string, index: number) => {
    navigator.clipboard.writeText(path);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6 font-body">
      
      {/* 1. Header Toolbar */}
      <div className="flex justify-between items-center border-b border-ink/5 pb-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-orange" />
            Media Manager
          </h2>
          <p className="text-xs text-muted">
            Upload images directly to Cloudinary and retrieve clean proxy CDN relative paths.
          </p>
        </div>
      </div>

      {/* Action Notification banner */}
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

      {/* 2. Drag & Drop Upload Zone */}
      <div className="bg-cream/20 p-8 md:p-12 rounded-3xl border-2 border-dashed border-ink/10 flex flex-col items-center justify-center gap-4 text-center hover:border-blue/30 transition-all duration-300 relative group">
        
        <div className="p-4 bg-white rounded-full shadow-sm border border-ink/5 group-hover:scale-110 transition-transform duration-300">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-orange" />
          ) : (
            <Upload className="w-8 h-8 text-blue" />
          )}
        </div>

        <div className="flex flex-col gap-1 max-w-sm">
          <span className="text-sm font-semibold text-ink">
            {uploading ? "Uploading media to CDN..." : "Choose images to upload"}
          </span>
          <p className="text-xs text-muted">
            Drag files here, or click to browse. Images will be automatically routed into the secure Cloudinary bucket.
          </p>
        </div>

        {!uploading && (
          <label className="px-5 py-2.5 bg-ink text-cream hover:bg-orange transition-colors duration-300 rounded-full font-semibold text-xs tracking-wider uppercase shadow-sm cursor-pointer">
            Select files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* 3. Session Uploads History */}
      <div className="flex flex-col gap-4 mt-6">
        <h3 className="text-lg font-bold text-ink border-b border-ink/5 pb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-orange" />
          Uploaded Assets this Session
        </h3>

        {uploadedAssets.length === 0 ? (
          <div className="text-center py-12 bg-cream/10 rounded-2xl border border-ink/5 text-xs text-muted">
            Uploaded items will appear here. Copy paths to paste directly into your project creations.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedAssets.map((asset, index) => (
              <div 
                key={index}
                className="p-4 bg-white rounded-2xl border border-ink/5 shadow-sm flex items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 bg-cream/50 rounded-xl border border-ink/5 text-blue flex-shrink-0">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <strong className="text-xs text-ink truncate max-w-[180px]">{asset.name}</strong>
                    <span className="text-[10px] text-muted font-mono truncate max-w-[180px]">
                      {asset.relativePath}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleCopyPath(asset.relativePath, index)}
                    className="p-2 bg-cream hover:bg-blue hover:text-cream text-ink/75 rounded-xl border border-ink/5 transition-all flex items-center justify-center cursor-pointer"
                    title="Copy relative path"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={asset.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-cream hover:bg-orange hover:text-cream text-ink/75 rounded-xl border border-ink/5 transition-all flex items-center justify-center"
                    title="View secure image"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
