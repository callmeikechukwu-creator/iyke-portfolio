"use client";

import { useState } from "react";

/**
 * CopyShareLinkButton
 * Small client-side island for the blog post "Copy Share URL" action.
 * Pulled out of the (server) blog post page because event handlers
 * can't be passed as props from a Server Component to a DOM element.
 */
export default function CopyShareLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context, etc.)
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-5 py-2 border border-border hover:border-vermillion hover:text-vermillion text-[10px] font-bold font-body rounded-full active:scale-95 transition-all uppercase tracking-wider"
    >
      {copied ? "Copied!" : "Copy Share URL"}
    </button>
  );
}
