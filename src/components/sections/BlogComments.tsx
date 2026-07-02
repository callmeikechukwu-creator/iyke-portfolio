"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, User, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentItem {
  id: string;
  blogPostId: string;
  authorName: string;
  content: string;
  approved: boolean;
  createdAt: string;
}

interface BlogCommentsProps {
  blogPostId: string;
  initialComments: any[];
}

export default function BlogComments({ blogPostId, initialComments }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [pendingComments, setPendingComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load author's pending comments from localStorage on mount.
  // Cross-check against initialComments: if a pending comment has already
  // been approved (its ID exists in initialComments), remove it from
  // localStorage so it doesn't render twice.
  useEffect(() => {
    const stored = localStorage.getItem("iyke_pending_comments");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as CommentItem[];
      const approvedIds = new Set(initialComments.map((c: CommentItem) => c.id));

      // Keep only pending comments for this post that are NOT yet approved
      const stillPending = parsed.filter(
        (c) => c.blogPostId === blogPostId && !approvedIds.has(c.id)
      );

      // Write the cleaned list (all posts, not just this one) back to storage
      const otherPosts = parsed.filter((c) => c.blogPostId !== blogPostId);
      const cleaned = [...otherPosts, ...stillPending];
      localStorage.setItem("iyke_pending_comments", JSON.stringify(cleaned));

      setPendingComments(stillPending);
    } catch (e) {
      console.error("Failed to parse pending comments:", e);
    }
  }, [blogPostId, initialComments]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogPostId,
          authorName: name,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit comment");
      }

      const newComment = {
        ...data.comment,
        createdAt: new Date().toISOString(),
      };

      // Add to local state pending list
      const updatedPending = [newComment, ...pendingComments];
      setPendingComments(updatedPending);

      // Save to localStorage global pending list
      const stored = localStorage.getItem("iyke_pending_comments");
      let allPending: CommentItem[] = [];
      if (stored) {
        try {
          allPending = JSON.parse(stored);
        } catch (e) {
          allPending = [];
        }
      }
      allPending = [newComment, ...allPending];
      localStorage.setItem("iyke_pending_comments", JSON.stringify(allPending));

      // Reset form
      setName("");
      setContent("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalCommentsCount = comments.length + pendingComments.length;

  return (
    <div className="border-t border-border mt-16 pt-12 max-w-[680px] mx-auto select-none">
      {/* Comments Header */}
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="w-5 h-5 text-vermillion" />
        <h3 className="text-xl font-bold uppercase font-logo text-ink tracking-tight">
          Discussion ({totalCommentsCount})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-surface/50 border border-border/80 p-6 rounded-3xl mb-12 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted font-body mb-1">
          Share your feedback
        </h4>

        {error && (
          <div className="flex items-start gap-2.5 bg-vermillion/5 border border-vermillion/20 text-vermillion text-xs font-display p-3.5 rounded-2xl">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name-input" className="text-[10px] font-bold text-muted uppercase tracking-wider font-body">Name</label>
          <input
            id="name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="John Doe"
            maxLength={50}
            className="w-full bg-base/5 border border-border px-4 py-3 rounded-2xl text-xs font-display text-ink focus:outline-none focus:border-vermillion/50 focus:ring-1 focus:ring-vermillion/20 disabled:opacity-50 transition-all font-medium"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="comment-input" className="text-[10px] font-bold text-muted uppercase tracking-wider font-body">Comment</label>
          <textarea
            id="comment-input"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Write your feedback..."
            maxLength={500}
            className="w-full bg-base/5 border border-border px-4 py-3 rounded-2xl text-xs font-display text-ink focus:outline-none focus:border-vermillion/50 focus:ring-1 focus:ring-vermillion/20 disabled:opacity-50 resize-none transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !content.trim()}
          className="self-end inline-flex items-center gap-2 px-6 py-3 bg-ink hover:bg-vermillion text-base hover:text-white text-xs font-bold font-body rounded-full active:scale-95 disabled:opacity-40 disabled:hover:bg-ink disabled:hover:text-base transition-all uppercase tracking-wider cursor-pointer"
        >
          {loading ? "Posting..." : "Post Comment"} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {totalCommentsCount === 0 ? (
          /* Empty State Graphic */
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4 bg-surface/30 border border-border/40 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-base/5 border border-border flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-muted/60" />
            </div>
            <div className="flex flex-col gap-1.5 px-6">
              <h5 className="text-display text-sm font-bold uppercase tracking-tight text-ink font-logo">
                BE THE FIRST TO SHARE YOUR THOUGHTS
              </h5>
              <p className="text-[11px] text-muted leading-relaxed font-display font-medium max-w-[240px] mx-auto">
                No comments have been posted yet. Start the conversation by sharing your thoughts.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Show Pending comments first (Greyed out for author feedback) */}
            {pendingComments.map((comment) => (
              <div
                key={comment.id}
                className="relative p-5 rounded-2xl bg-surface/20 border border-dashed border-border-strong opacity-60 flex flex-col gap-3 shadow-[inset_0_0_12px_rgba(26,24,20,0.02)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted" />
                    <span className="text-xs font-black text-ink uppercase tracking-tight font-body">
                      {comment.authorName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber/5 border border-amber/20 px-2 py-0.5 rounded text-[8px] font-bold text-amber uppercase tracking-wider font-body">
                    <Clock className="w-2 h-2" /> Awaiting Approval
                  </div>
                </div>
                <p className="text-xs text-muted leading-relaxed font-display font-medium whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}

            {/* 2. Show Approved comments */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted" />
                    <span className="text-xs font-black text-ink uppercase tracking-tight font-body">
                      {comment.authorName}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider font-display">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }).format(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-xs text-ink/80 leading-relaxed font-display font-medium whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
