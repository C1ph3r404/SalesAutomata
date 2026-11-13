export function Loading({ label = "Loading..." }: { label?: string }) {
  return <p role="status">{label}</p>;
}

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div>
      <p role="alert">Error: {message}</p>
      {onRetry ? <button onClick={onRetry}>Retry</button> : null}
    </div>
  );
}

export function Empty({ label = "No records." }: { label?: string }) {
  return <p>{label}</p>;
}
