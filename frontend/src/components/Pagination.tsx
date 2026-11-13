interface PaginationProps {
  limit: number;
  offset: number;
  count: number | null;
  onPage: (offset: number) => void;
}

export function Pagination({ limit, offset, count, onPage }: PaginationProps) {
  const total = count ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <button
        type="button"
        onClick={() => onPage(Math.max(0, offset - limit))}
        disabled={offset === 0}
      >
        Previous
      </button>
      <span>
        {" "}
        Page {page} of {pages} — {total} records{" "}
      </span>
      <button
        type="button"
        onClick={() => onPage(offset + limit)}
        disabled={offset + limit >= total}
      >
        Next
      </button>
    </div>
  );
}
