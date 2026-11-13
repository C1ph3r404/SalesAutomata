"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="panel mt-6 p-6">
      <p className="micro-strong">Something went wrong</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
        {error.message || "The workspace could not load."}
      </p>
      <button type="button" onClick={reset} className="tag tag-blue mt-4">
        Try again
      </button>
    </div>
  );
}