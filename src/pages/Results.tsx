import { useState, useMemo } from "react";
import {
  Search,
  BarChart3,
  ArrowUpDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Table from "../components/Table";
import AttemptReviewModal from "../components/AttemptReviewModal";
import { useGetAllExams } from "../services/exam";
import {
  useGetAllAttempts,
  useGetAttemptReview,
  useGetExamAttempts,
  useGradeAttempt,
} from "../services/attempt";
import { useGetAllStudents } from "../services/student";
import { formatDateTime } from "../utils/helpers";

type SortField = "studentName" | "score" | "submittedAt";
type SortDirection = "asc" | "desc";

export const Results = () => {
  const [search, setSearch] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string>("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pass" | "fail">(
    "all",
  );
  const [sortField, setSortField] = useState<SortField>("submittedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  const { data: exams, isLoading: examsLoading } = useGetAllExams();
  const { data: students, isLoading: studentsLoading } = useGetAllStudents();
  const gradeAttemptMutation = useGradeAttempt();

  const { data: allAttempts, isLoading: allAttemptsLoading } =
    useGetAllAttempts(selectedExamId === "all");

  const { data: examAttempts, isLoading: examAttemptsLoading } =
    useGetExamAttempts(selectedExamId, selectedExamId !== "all");

  const attempts = selectedExamId === "all" ? allAttempts : examAttempts;
  const isLoadingBody =
    selectedExamId === "all" ? allAttemptsLoading : examAttemptsLoading;

  const {
    data: attemptReview,
    isLoading: attemptReviewLoading,
    error: attemptReviewError,
  } = useGetAttemptReview(reviewAttemptId || "", !!reviewAttemptId);

  const closeReview = () => {
    setReviewAttemptId(null);
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getIsPassed = (attempt: any) => {
    const passingScore =
      attempt.exam?.passingMarks ?? (attempt.exam?.totalMarks || 0) * 0.5;
    return attempt.score >= passingScore;
  };

  // Filter and sort attempts
  const filteredAndSortedAttempts = useMemo(() => {
    if (!attempts) return [];

    let filtered = attempts.filter((attempt) => attempt.isSubmitted);

    // Student filter
    if (selectedStudentId !== "all") {
      filtered = filtered.filter(
        (attempt) =>
          String(attempt.student?.id ?? "") === String(selectedStudentId),
      );
    }

    // Search filter
    if (search) {
      filtered = filtered.filter((attempt) =>
        attempt.student?.fullName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((attempt) => {
        const passed = getIsPassed(attempt);
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
  }, [
    attempts,
    selectedStudentId,
    search,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredAndSortedAttempts.length)
      return { total: 0, passed: 0, failed: 0, avgScore: 0 };

    const total = filteredAndSortedAttempts.length;
    let passed = 0;
    let totalScore = 0;

    filteredAndSortedAttempts.forEach((attempt) => {
      const passingScore =
        attempt.exam?.passingMarks ?? (attempt.exam?.totalMarks || 0) * 0.5;
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

  const isLoading = examsLoading || studentsLoading || isLoadingBody;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Performance &{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            Results
          </span>
        </h2>
        <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
          Analyze student performance and review examination attempts
        </p>
      </div>

      {/* Statistics Cards */}
      {!isLoading && filteredAndSortedAttempts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              Total Attempts
            </p>
            <p className="text-3xl font-black text-slate-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              Passed
            </p>
            <p className="text-3xl font-black text-emerald-600 mt-2">
              {stats.passed}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              Failed
            </p>
            <p className="text-3xl font-black text-red-600 mt-2">
              {stats.failed}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
              Average Score
            </p>
            <p className="text-3xl font-black text-blue-600 mt-2 text-linear-to-r from-blue-600 to-indigo-600">
              {stats.avgScore}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          {/* Student Filter */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
            disabled={studentsLoading}
          >
            <option value="all">All Students</option>
            {students?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>

          {/* Exam Filter */}
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
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
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "pass" | "fail")
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pass">Passed</option>
            <option value="fail">Failed</option>
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-3 mt-8 flex-wrap">
          <button
            onClick={() => handleSort("studentName")}
            className={`px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
              sortField === "studentName"
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Student Name
            {sortField === "studentName" && (
              <ArrowUpDown
                size={14}
                className={sortDirection === "desc" ? "rotate-180" : ""}
              />
            )}
          </button>

          <button
            onClick={() => handleSort("score")}
            className={`px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
              sortField === "score"
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Score
            {sortField === "score" && (
              <ArrowUpDown
                size={14}
                className={sortDirection === "desc" ? "rotate-180" : ""}
              />
            )}
          </button>

          <button
            onClick={() => handleSort("submittedAt")}
            className={`px-6 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-2 text-sm font-bold ${
              sortField === "submittedAt"
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            Submitted Date
            {sortField === "submittedAt" && (
              <ArrowUpDown
                size={14}
                className={sortDirection === "desc" ? "rotate-180" : ""}
              />
            )}
          </button>
        </div>

        {/* Results Count */}
        {!isLoading && attempts && (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">
              {filteredAndSortedAttempts.length}
            </div>
            <span className="text-slate-500 font-medium">
              results found matching your criteria (out of{" "}
              {attempts.filter((a) => a.isSubmitted).length} total submissions)
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-xl w-1/4"></div>
                  <div className="h-3 bg-slate-50 rounded-xl w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredAndSortedAttempts.length === 0 ? (
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 p-20 text-center">
          <BarChart3 className="mx-auto text-slate-300 mb-6" size={64} />
          <h3 className="text-2xl font-black text-slate-900 mb-2">
            No results found
          </h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters to find what you're looking for."
              : "No exam attempts have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
          <Table
            fields={[
              "S.No",
              "Student Name",
              "Exam",
              "Score",
              "Status",
              "Submitted",
              "Actions",
            ]}
            data={filteredAndSortedAttempts}
            formatRow={(attempt, index: number) => {
              const isPassed = getIsPassed(attempt);
              return (
                <>
                  <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                    {attempt.student?.fullName || "Unknown"}
                  </td>
                  <td className="p-4 text-slate-700 font-medium whitespace-nowrap">
                    {attempt.exam?.title || "Unknown"}
                  </td>
                  <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                    {attempt.score}/{attempt.exam?.totalMarks || 0}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          isPassed
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <CheckCircle size={10} /> Passed
                          </>
                        ) : (
                          <>
                            <XCircle size={10} /> Failed
                          </>
                        )}
                      </span>
                      {attempt.gradedBy && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          By {attempt.gradedBy.fullName}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-medium whitespace-nowrap text-sm">
                    {attempt.submittedAt
                      ? formatDateTime(attempt.submittedAt)
                      : "Not submitted"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => setReviewAttemptId(attempt.id)}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow-blue-500/20 disabled:opacity-50"
                      disabled={!attempt.isSubmitted}
                    >
                      Review
                    </button>
                  </td>
                </>
              );
            }}
            stickyHeaderOffset="0px"
          />
        </div>
      )}

      <AttemptReviewModal
        isOpen={!!reviewAttemptId}
        onClose={closeReview}
        data={attemptReview}
        isLoading={attemptReviewLoading}
        isError={!!attemptReviewError}
        isSaving={gradeAttemptMutation.isPending}
        onSave={(answers) => {
          if (!reviewAttemptId) return;
          gradeAttemptMutation.mutate(
            { attemptId: reviewAttemptId, answers },
            {
              onSuccess: () => closeReview(),
            },
          );
        }}
      />
    </div>
  );
};
