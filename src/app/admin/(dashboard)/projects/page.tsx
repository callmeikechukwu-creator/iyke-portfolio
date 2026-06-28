"use client";

import { useEffect, useState } from "react";
import { 
  FolderKanban, Plus, Pencil, Trash2, Eye, Globe, Github, 
  ArrowLeft, Check, AlertCircle, Loader2, Sparkles, Upload 
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string;
  featured: boolean;
  order: number;
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [techStackText, setTechStackText] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  // File Upload State
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError("Failed to load projects");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while loading projects");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      // Auto-generate slug from title
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .substring(0, 50)
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "projects");

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Store relative path (e.g. /projects/filename.jpg)
          // accessed via cdn.iykevisualsdev.me/projects/filename.jpg
          setImageUrl(data.relativePath);
          setSuccess("Image uploaded successfully!");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError(data.error || "File upload failed");
        }
      } else {
        setError("Failed to upload image file");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during file upload");
    } finally {
      setUploading(false);
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setBody("");
    setTechStackText("");
    setLiveUrl("");
    setGithubUrl("");
    setImageUrl("");
    setFeatured(false);
    setOrder(projects.length + 1);
    setError("");
    setShowForm(true);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setBody(project.body || "");
    setTechStackText(project.techStack.join(", "));
    setLiveUrl(project.liveUrl || "");
    setGithubUrl(project.githubUrl || "");
    setImageUrl(project.imageUrl);
    setFeatured(project.featured);
    setOrder(project.order);
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setError("");

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Project deleted successfully!");
        setProjects(projects.filter(p => p.id !== id));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting the project");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const techStack = techStackText
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      description,
      body: body || null,
      techStack,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      imageUrl,
      featured,
      order: Number(order),
    };

    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingId ? "Project updated!" : "Project created!");
        setShowForm(false);
        fetchProjects();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save project");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-body">
      
      {/* 1. Header Toolbar */}
      <div className="flex justify-between items-center border-b border-ink/5 pb-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-orange" />
            Projects Showcase
          </h2>
          <p className="text-xs text-muted">
            Manage your project database list and showcase items.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-cream hover:bg-orange transition-colors duration-300 rounded-full font-semibold text-xs tracking-wide shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Project
          </button>
        )}
      </div>

      {/* Action Notifications */}
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

      {/* 2. Form View */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-cream/30 p-6 rounded-2xl border border-ink/5">
          
          <div className="flex justify-between items-center border-b border-ink/5 pb-4 mb-2">
            <h3 className="font-semibold text-ink text-lg flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange animate-spin" />
              {editingId ? "Edit Project Entry" : "Create Project Entry"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Naturalist E-commerce"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Unique URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. naturalist-ecommerce"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none font-mono"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-ink/70">Brief Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a clear, concise overview summarizing the project..."
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none resize-y"
              />
            </div>

            {/* Tech Stack */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Technologies (Comma separated) *</label>
              <input
                type="text"
                required
                value={techStackText}
                onChange={(e) => setTechStackText(e.target.value)}
                placeholder="Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
              />
            </div>

            {/* Image Upload Row */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Cover Image path / upload *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /projects/naturalist.jpg"
                  className="flex-1 px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
                />
                
                <label className="px-4 py-2.5 bg-ink text-cream hover:bg-orange transition-colors rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Live URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Live Demo URL</label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
              />
            </div>

            {/* GitHub URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">GitHub Codebase URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
              />
            </div>

            {/* Order */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ink/70">Display Order Index</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-ink/5">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-orange focus:ring-orange accent-orange cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-bold text-ink/70 cursor-pointer">
                Highlight as Featured Project (Show on Home)
              </label>
            </div>

            {/* Markdown Case Study Body */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold text-ink/70">Case Study content (HTML allowed)</label>
              <textarea
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="<h2>Introduction</h2><p>Provide deep technical context, architectural logs, or system choices here...</p>"
                className="w-full px-4 py-2.5 bg-white border border-ink/5 focus:border-blue transition-all rounded-xl text-sm outline-none resize-y font-mono"
              />
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 border-t border-ink/5 pt-4 mt-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 border border-ink/10 text-ink hover:bg-cream rounded-full font-semibold text-xs tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-ink text-cream hover:bg-orange disabled:bg-muted/40 disabled:cursor-not-allowed transition-colors duration-300 rounded-full font-semibold text-xs tracking-wide shadow-sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Project Entry"
              )}
            </button>
          </div>

        </form>
      ) : (
        /* 3. List Table View */
        <div className="flex flex-col">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-orange" />
                <span className="text-sm text-muted">Retrieving project database...</span>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-cream/10 rounded-2xl border border-dashed border-ink/10 flex flex-col items-center gap-3">
              <FolderKanban className="w-10 h-10 text-muted/40" />
              <p className="text-sm text-muted">No projects found. Seed or create items.</p>
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-ink text-cream hover:bg-orange transition-colors rounded-full font-semibold text-xs"
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-ink/5">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-cream/40 border-b border-ink/5 text-ink/75 font-semibold">
                    <th className="px-6 py-4">Sort</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Tech Stack</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr 
                      key={project.id}
                      className="border-b border-ink/5 hover:bg-cream/10 transition-colors"
                    >
                      {/* Order */}
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-ink/65">
                        #{project.order}
                      </td>

                      {/* Detail Info */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="flex flex-col gap-0.5">
                          <strong className="text-ink text-[15px]">{project.title}</strong>
                          <span className="text-xs text-muted truncate font-mono">{project.slug}</span>
                        </div>
                      </td>

                      {/* Stack Tags */}
                      <td className="px-6 py-4 max-w-[240px]">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-[10px] bg-cream px-2 py-0.5 rounded text-ink/80 border border-ink/5"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Featured State */}
                      <td className="px-6 py-4">
                        {project.featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange/10 text-orange text-[10px] font-bold rounded-full border border-orange/10 uppercase tracking-wide">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-cream text-muted text-[10px] font-semibold rounded-full border border-ink/5 uppercase tracking-wide">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-cream hover:text-orange text-muted/80 transition-colors rounded-xl"
                            title="Preview Case Study"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          
                          <button
                            onClick={() => startEdit(project)}
                            className="p-2 hover:bg-cream hover:text-blue text-muted/80 transition-colors rounded-xl cursor-pointer"
                            title="Edit project"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 text-muted/80 transition-colors rounded-xl cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
