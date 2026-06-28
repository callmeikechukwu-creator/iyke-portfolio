"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/admin/login");
        router.refresh();
      } else {
        console.error("Logout API failed");
      }
    } catch (error) {
      console.error("Failed to execute logout request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white disabled:bg-muted/15 disabled:text-muted transition-all duration-300 rounded-xl text-sm font-semibold cursor-pointer select-none"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <span>Log Out</span>
    </button>
  );
}
