import { useState, useMemo } from "react";
import { Search, BarChart3, ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import Table from "../components/Table";
import { useGetAllExams } from "../services/exam";
import { useGetExamAttempts } from "../services/attempt";
import { formatDateTime, getStatusBadgeColor, sortByField } from "../utils/helpers";

type SortField = "studentName" | "score" | "submittedAt";
type SortDirection = "asc" | "desc";

export const Results = () => {
  const [search, setSearch] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pass" | "fail">("all");
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { data: exams, isLoading: examsLoading } = useGetAllExams();

  // Get attempts for the selected exam (or first exam if "all")
  const examIdForQuery = selectedExamId === "all" ? exams?.[0]?.id || "" : selectedExamId;
  const {
    data: attempts,
    isLoading: attemptsLoading,
    error: attemptsError,
  } = useGetExamAttempts(examIdForQuery);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort attempts
  const filteredAndSortedAttempts = useMemo(() => {
    if (!attempts) return [];

    let filtered = attempts.filter((attempt) => attempt.isSubmitted);

    // Search filter
    if (search) {
      filtered = filtered.filter((attempt) =>
        attempt.student?.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((attempt) => {
        const passed =
          attempt.score >= (attempt.exam?.passingMarks || attempt.exam?.totalMarks || 0) * 0.5;
        return statusFilter === "pass" ? passed : !passed;
      });
    }

    // Sort
    const sortedData = [...filtered].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortField === "studentName") {
        aVal = a.student?.fullName || "";
        bVal = b.student?.fullName || "";
      } else if (sortField === "score") {
        aVal = a.score;
        bVal = b.score;
      } else if (sortField === "submittedAt") {
        aVal = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        bVal = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      }

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return sortedData;
  }, [attempts, search, statusFilter, sortField, sortDirection]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredAndSortedAttempts.length) return { total: 0, passed: 0, failed: 0, avgScore: 0 };

    const total = filteredAndSortedAttempts.length;
    let passed = 0;
    let totalScore = 0;

    filteredAndSortedAttempts.forEach((attempt) => {
      const passingScore =
        attempt.exam?.passingMarks || attempt.exam?.totalMarks
          ? attempt.exam.totalMarks * 0.5
          : 0;
      if (attempt.score >= passingScore) passed++;
      totalScore += attempt.score;
    });

    return {
      total,
      passed,
      failed: total - passed,
      avgScore: total > 0 ? (totalScore / total).toFixed(1) : 0,
    };
  }, [filteredAndSortedAttempts]);

  const isLoading = examsLoading || attemptsLoading;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Exam Results</h2>
        <p className="text-gray-500 text-sm mt-1">
          Review student performance and exam results
        </p>
      </div>

      {/* Statistics Cards */}
      {!isLoading && filteredAndSortedAttempts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">Total Attempts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">Passed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.passed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">Failed</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm font-medium">Average Score</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgScore}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Exam Filter */}
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={examsLoading}
          >
            <option value="all">All Exams</option>
            {exams?.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="pass">Passed</option>
            <option value="fail">Failed</option>
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => handleSort("studentName")}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm ${
              sortField === "studentName"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Student Name
            {sortField === "studentName" && (
              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
            )}
          </button>

          <button
            onClick={() => handleSort("score")}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm ${
              sortField === "score"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Score
            {sortField === "score" && (
              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
            )}
          </button>

          <button
            onClick={() => handleSort("submittedAt")}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm ${
              sortField === "submittedAt"
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Submitted Date
            {sortField === "submittedAt" && (
              <ArrowUpDown size={14} className={sortDirection === "desc" ? "rotate-180" : ""} />
            )}
          </button>
        </div>

        {/* Results Count */}
        {!isLoading && attempts && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedAttempts.length} of {attempts.filter((a) => a.isSubmitted).length} results
          </div>
        )}
      </div>

      {/* Error State */}
      {attemptsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            Failed to load results. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredAndSortedAttempts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 text-sm">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "No exam attempts have been submitted yet"}
          </p>
        </div>
      ) : (
        <Table
          fields={["S.No", "Student Name", "Exam", "Score", "Status", "Submitted"]}
          data={filteredAndSortedAttempts}
          formatRow={(attempt: any, index: number) => {
            const passingScore =
              attempt.exam?.passingMarks || attempt.exam?.totalMarks * 0.5;
            const isPassed = attempt.score >= passingScore;

            return (
              <>
                <td className="p-4 text-gray-700 whitespace-nowrap">{index + 1}</td>
                <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                  {attempt.student?.fullName || "Unknown"}
                </td>
                <td className="p-4 text-gray-600 whitespace-nowrap">
                  {attempt.exam?.title || "Unknown"}
                </td>
                <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">
                  {attempt.score}/{attempt.exam?.totalMarks || 0}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPassed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isPassed ? (
                      <>
                        <CheckCircle size={12} /> Pass
                      </>
                    ) : (
                      <>
                        <XCircle size={12} /> Fail
                      </>
                    )}
                  </span>
                </td>
                <td className="p-4 text-gray-600 whitespace-nowrap text-sm">
                  {attempt.submittedAt
                    ? formatDateTime(attempt.submittedAt)
                    : "Not submitted"}
                </td>
              </>
            );
          }}
          stickyHeaderOffset="0px"
        />
      )}
    </div>
  );
};
