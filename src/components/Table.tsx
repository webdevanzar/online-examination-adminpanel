import React, { useRef, useEffect } from "react";
import { TableShimmer } from "./Shimmer";

// Define the TableProps interface
interface TableProps<T> {
  fields: string[];
  data?: T[];
  formatRow: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  maxHeight?: string;
  onRowClick?: (item: T, index: number) => void;
  stickyHeaderOffset?: string;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const Table = <T,>({
  fields,
  data = [],
  formatRow,
  isLoading,
  error,
  maxHeight = "calc(100vh - 300px)",
  onRowClick,
  stickyHeaderOffset = "0px",
  onLoadMore,
  isLoadingMore,
}: TableProps<T>) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for infinite loading
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !onLoadMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when scrolled 80% down
      if (scrollPercentage > 0.8 && !isLoadingMore) {
        onLoadMore();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, isLoadingMore]);

  const renderBody = () => {
    if (isLoading) {
      return <TableShimmer columns={fields.length} />;
    }

    if (error) {
      return (
        <tr>
          <td
            colSpan={fields.length}
            className="text-center py-16 px-4 bg-red-50"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold text-red-700">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </td>
        </tr>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <tr>
          <td
            colSpan={fields.length}
            className="text-center py-16 px-4 bg-gray-50"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-gray-600">
                No data available
              </p>
              <p className="text-xs text-gray-500">
                There are no records to display
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return data.map((item, index) => (
      <tr
        key={index}
        onClick={() => onRowClick?.(item, index)}
        className={
          onRowClick
            ? "hover:bg-gray-50 cursor-pointer transition-colors duration-150"
            : ""
        }
      >
        {formatRow(item, index)}
      </tr>
    ));
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse min-w-[850px]">
          <thead
            className="bg-gray-100 border-b-2 border-gray-300 sticky z-10 shadow-sm"
            style={{ top: stickyHeaderOffset }}
          >
            <tr>
              {fields.map((field: string, index: number) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">{renderBody()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
