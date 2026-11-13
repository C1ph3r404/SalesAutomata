import type { ReactNode } from "react";

export type KeyValueEntry = [string, ReactNode];

export function KeyValue({ entries }: { entries: KeyValueEntry[] }) {
  return (
    <dl>
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value === null || value === undefined || value === "" ? "—" : value}</dd>
        </div>
      ))}
    </dl>
  );
}
