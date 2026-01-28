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
            className="text-center py-20 px-4 bg-red-50/30"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-bold mb-2">
                !
              </div>
              <p className="text-lg font-black text-red-900 tracking-tight">
                Something went wrong
              </p>
              <p className="text-sm text-red-600 font-medium max-w-xs mx-auto">
                {error}
              </p>
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
            className="text-center py-24 px-4 bg-white"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 font-bold mb-2">
                ?
              </div>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                No data available
              </p>
              <p className="text-sm text-slate-500 font-medium tracking-wide">
                There are no records to display at this time.
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
        className={`group transition-all duration-200 border-b border-slate-50 last:border-0 ${
          onRowClick
            ? "hover:bg-slate-50/80 cursor-pointer active:scale-[0.995]"
            : "hover:bg-slate-50/50"
        }`}
      >
        {formatRow(item, index)}
      </tr>
    ));
  };

  return (
    <div className="w-full bg-white border border-slate-100 rounded-4xl shadow-2xl shadow-slate-200/50 overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="w-full overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse min-w-[900px]">
          <thead
            className="bg-slate-50/50 border-b border-slate-100 sticky z-10 backdrop-blur-md"
            style={{ top: stickyHeaderOffset }}
          >
            <tr>
              {fields.map((field: string, index: number) => (
                <th
                  key={index}
                  className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap"
                >
                  <span className="relative inline-block">{field}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {renderBody()}
            {isLoadingMore && (
              <tr>
                <td colSpan={fields.length} className="p-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-500 animate-pulse">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    Loading more...
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
