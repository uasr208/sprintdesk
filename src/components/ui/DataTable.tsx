import { useState } from "react";
import { cn } from "../../utils/cn";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  className,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof T) => {
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-slate-700 bg-slate-800",
        className,
      )}
    >
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-700">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.accessorKey)}
                onClick={() => handleSort(col.accessorKey)}
                className="cursor-pointer px-6 py-3 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {sortField === col.accessorKey && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sortedData.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-slate-700/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.accessorKey)} className="px-6 py-4">
                  {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
