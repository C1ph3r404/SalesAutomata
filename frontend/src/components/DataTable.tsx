import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  actions?: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  actions,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p>No records.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
          {actions ? <th>Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getKey(row)}>
            {columns.map((column) => (
              <td key={column.key}>
                {column.render
                  ? column.render(row)
                  : String((row as Record<string, unknown>)[column.key] ?? "—")}
              </td>
            ))}
            {actions ? <td>{actions(row)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
