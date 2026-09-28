"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const next =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("next") || "/admin"
            : "/admin";
        router.replace(next);
        router.refresh();
      } else {
        setError(data.error || "Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border-amber rounded-3xl p-8 max-w-sm w-full shadow-md space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary-950 text-accent-gold flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>

        <div>
          <h1 className="font-heading font-bold text-xl text-text-primary">Admin Access</h1>
          <p className="text-sm text-text-secondary mt-1">
            Enter the admin password to continue.
          </p>
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2.5 rounded-xl border border-border-amber bg-cream text-sm text-text-primary focus:outline-none focus:border-primary-600"
          required
        />

        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-hover text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
          <span>{isSubmitting ? "Checking..." : "Unlock Admin Panel"}</span>
        </button>
      </form>
    </div>
  );
}
