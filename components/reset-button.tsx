"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetButton({
  className = "tag tag-ghost",
  label = "Reset demo",
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function reset() {
    if (loading) return;
    if (!window.confirm("Reset all demo data? This cannot be undone.")) return;

    setLoading(true);

    try {
      const response = await fetch("/api/reset", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Reset failed");
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={reset}
      className={className}
      disabled={loading}
    >
      {loading ? "Resetting…" : label}
    </button>
  );
}