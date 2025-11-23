import React from "react";

interface TableShimmerProps {
  columns: number;
  rows?: number;
}

export const TableShimmer: React.FC<TableShimmerProps> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: columns }).map((__, c) => (
            <td key={c} className="px-6 py-4">
              <div className="h-4 w-full max-w-[140px] bg-gray-200 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
