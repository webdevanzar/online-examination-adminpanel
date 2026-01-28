import { CheckCircle, Users, FileCheck, Clock, TrendingUp } from "lucide-react";
import { useGetAllExams } from "../services/exam";
import { useGetAllStudents } from "../services/student";
import { formatRelativeDate } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    data: exams,
    isLoading: examsLoading,
    error: examsError,
  } = useGetAllExams();
  const {
    data: students,
    isLoading: studentsLoading,
    error: studentsError,
  } = useGetAllStudents();

  const now = new Date();

  // Calculate stats
  const totalStudents = students?.length || 0;
  const totalExams = exams?.length || 0;
  const activeExams =
    exams?.filter(
      (exam) =>
        new Date(exam.startTime) <= now && new Date(exam.endTime) >= now,
    ).length || 0;

  // Get upcoming exams (sorted by start time)
  const upcomingExams =
    exams
      ?.filter((exam) => new Date(exam.startTime) > now)
      ?.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      ?.slice(0, 5) || [];

  // Recent exams (created recently)
  const recentExams =
    exams
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      ?.slice(0, 5) || [];

  const isLoading = examsLoading || studentsLoading;
  const hasError = examsError || studentsError;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          System Overview
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          Efficiently manage and monitor your examination platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Total Students */}
        <button
          onClick={() => navigate("/students")}
          className="relative overflow-hidden bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 text-left group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors"></div>
          {isLoading ? (
            <div className="animate-pulse relative z-10">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded w-1/3"></div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Users size={24} />
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                  Active Now
                </span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Total Students
              </p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {totalStudents.toLocaleString()}
              </h3>
            </div>
          )}
        </button>

        {/* Total Exams */}
        <button
          onClick={() => navigate("/exam")}
          className="relative overflow-hidden bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 text-left group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors"></div>
          {isLoading ? (
            <div className="animate-pulse relative z-10">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded w-1/3"></div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <FileCheck size={24} />
                </div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full group-hover:bg-indigo-100 transition-colors">
                  Full Suite
                </span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Total Exams
              </p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {totalExams.toLocaleString()}
              </h3>
            </div>
          )}
        </button>

        {/* Active Exams */}
        <button
          onClick={() => navigate("/exam")}
          className="relative overflow-hidden bg-white p-8 rounded-4xl  shadow-sm border border-slate-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 text-left group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100 transition-colors"></div>
          {isLoading ? (
            <div className="animate-pulse relative z-10">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded w-1/3"></div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Clock size={24} />
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-100 transition-colors">
                  Live Now
                </span>
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Active Exams
              </p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                {activeExams}
              </h3>
            </div>
          )}
        </button>
      </div>

      {/* Error State */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-500" size={20} />
            <h4 className="text-xl font-semibold text-gray-900">
              Recent Activities
            </h4>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentExams.length > 0 ? (
            <ul className="space-y-3">
              {recentExams.map((exam) => (
                <li
                  key={exam.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <CheckCircle
                    className="text-blue-500 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">
                      New exam "{exam.title}" created
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatRelativeDate(exam.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <FileCheck className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 text-sm">No recent activities</p>
            </div>
          )}
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-500" size={20} />
            <h4 className="text-xl font-semibold text-gray-900">
              Upcoming Exams
            </h4>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : upcomingExams.length > 0 ? (
            <ul className="space-y-4">
              {upcomingExams.map((exam) => (
                <li
                  key={exam.id}
                  className="p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(`/exam/${exam.id}/questions`)}
                >
                  <p className="font-medium text-gray-900 truncate">
                    {exam.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatRelativeDate(exam.startTime)}
                  </p>
                  {exam.subject && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {exam.subject}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 text-sm">No upcoming exams</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
