"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (id: string) => void;
    };
  }
}

export default function GlobalGatekeeper({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [fadeAway, setFadeAway] = useState(false);

  // Check if already verified on mount
  useEffect(() => {
    const isHuman = localStorage.getItem("iyke_human_verified");
    if (isHuman === "true") {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  // Initialize Turnstile when the script loads
  const handleScriptLoad = () => {
    if (verified) return;

    // Set callback on window
    window.onloadTurnstileCallback = () => {
      if (window.turnstile) {
        window.turnstile.render("#turnstile-container", {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "3x00000000000000000000FF", // Always-pass test key
          theme: "dark",
          callback: (token) => {
            if (token) {
              setStatus("success");
              localStorage.setItem("iyke_human_verified", "true");
              // Delay fade out to display the success state nicely
              setTimeout(() => {
                setFadeAway(true);
                setTimeout(() => {
                  setVerified(true);
                }, 500); // Match Tailwind transition duration
              }, 1200);
            }
          },
          "error-callback": () => {
            setStatus("failed");
          },
        });
      }
    };

    // Execute callback if already ready
    if (window.onloadTurnstileCallback) {
      window.onloadTurnstileCallback();
    }
  };

  // If verified state is still loading, show nothing to avoid flash of content
  if (verified === null) {
    return <div className="fixed inset-0 bg-base z-[9999]" />;
  }

  // If verified, bypass gatekeeper completely
  if (verified) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Cloudflare Turnstile script loaded asynchronously */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base p-6 transition-all duration-500 ease-out select-none ${
          fadeAway ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,58,47,0.06),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Security Box */}
        <div className="w-full max-w-[440px] bg-surface/40 backdrop-blur-md border border-border p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
          {/* Glowing Top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-vermillion/40 to-transparent" />

          {/* Animated Security Status Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center mt-2">
            {/* Spinning Radar Ring */}
            <div
              className={`absolute inset-0 rounded-full border border-vermillion/10 border-t-vermillion/50 border-r-vermillion/30 animate-spin ${
                status === "success" && "border-green-500/30 border-t-green-500 animate-none opacity-40"
              }`}
            />
            {/* Inner Ring */}
            <div className="absolute w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full border border-border/40" />

            {/* Icons based on verification status */}
            {status === "verifying" && <Cpu className="w-8 h-8 text-vermillion animate-pulse" />}
            {status === "success" && <ShieldCheck className="w-8 h-8 text-green-500 animate-scale-in" />}
            {status === "failed" && <ShieldAlert className="w-8 h-8 text-vermillion animate-bounce" />}
          </div>

          {/* Text labels */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-vermillion uppercase tracking-[0.25em] font-body">
              {status === "verifying" && "[ decrypting connection ]"}
              {status === "success" && "[ connection verified ]"}
              {status === "failed" && "[ verification failed ]"}
            </span>
            <h1 className="text-xl font-bold font-body text-ink uppercase tracking-tight leading-tight">
              IKECHUKWU ALAETO
            </h1>
            <p className="text-[11px] font-bold text-muted font-body uppercase tracking-wider">
              Secure Entry Checkpoint
            </p>
          </div>

          <p className="text-xs text-muted leading-relaxed font-body max-w-[280px]">
            {status === "verifying" && "Verifying browser credentials to block automated spam bots."}
            {status === "success" && "Verification successful. Unlocking portfolio gateway."}
            {status === "failed" && "Browser verification failed. Please refresh the page to retry."}
          </p>

          {/* Turnstile Placeholder Container */}
          <div className="min-h-[65px] flex items-center justify-center mt-2">
            <div id="turnstile-container" className="cf-turnstile"></div>
          </div>
        </div>

        {/* Brand Label Footer */}
        <div className="absolute bottom-8 text-[9px] font-bold text-muted uppercase tracking-[0.2em] font-body opacity-50">
          PROT-v6.1 // MONGODB SECURED CHANNEL
        </div>
      </div>
    </>
  );
}
