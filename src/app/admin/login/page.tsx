"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to admin projects dashboard page
        router.push("/admin/projects");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-12 selection:bg-orange/20 selection:text-ink">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-ink/5 shadow-md flex flex-col gap-6">
        
        {/* Header Title */}
        <div className="flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold tracking-widest text-orange uppercase font-body">
            Security Gateway
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Admin Portal
          </h1>
          <p className="text-sm text-muted font-body">
            Please authorize to access system operations.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-orange/5 border border-orange/20 text-orange text-sm rounded-2xl flex items-start gap-2.5 font-body">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email input */}
          <div className="flex flex-col gap-1.5 font-body">
            <label className="text-xs font-semibold text-ink/70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@iykevisualsdev.me"
                className="w-full pl-11 pr-4 py-3 bg-cream/40 border border-ink/5 focus:border-blue focus:bg-white transition-all duration-300 rounded-2xl text-sm text-ink outline-none"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5 font-body">
            <label className="text-xs font-semibold text-ink/70">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-cream/40 border border-ink/5 focus:border-blue focus:bg-white transition-all duration-300 rounded-2xl text-sm text-ink outline-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 bg-ink text-cream hover:bg-orange disabled:bg-muted/40 disabled:cursor-not-allowed transition-all duration-300 rounded-full font-semibold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cream" />
                Authorizing session...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="text-center font-body text-xs text-muted/60 mt-2">
          &copy; {new Date().getFullYear()} Ikechukwu Alaeto. All rights reserved.
        </div>

      </div>
    </div>
  );
}
