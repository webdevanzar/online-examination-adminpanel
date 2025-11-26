import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Clock,
  FileCheck,
  Search,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import CreateExamPopup from "../components/CreateExamPopup";
import UpdateExamPopup from "../components/UpdateExamPopup";
import {
  useGetAllExams,
  useCreateExam,
  useDeleteExam,
  useUpdateExam,
  type CreateExamData,
  type UpdateExamData,
  type Exam,
} from "../services/exam";
import { formatRelativeDate } from "../utils/helpers";

const Exams: React.FC = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "active" | "completed">("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const { data: exams, isLoading, error } = useGetAllExams();
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();
  const deleteExamMutation = useDeleteExam();


  // Get unique subjects for filter
  const subjects = useMemo(() => {
    if (!exams) return [];
    return Array.from(new Set(exams.map((exam) => exam.subject).filter(Boolean)));
  }, [exams]);

  // Filter and categorize exams
  const {  allFilteredExams } = useMemo(() => {
    if (!exams) return { upcomingExams: [], activeExams: [], completedExams: [], allFilteredExams: [] };

    let filtered = exams;

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(search.toLowerCase()) ||
          exam.subject.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((exam) => exam.subject === subjectFilter);
    }

    // Categorize
    const now = new Date();
    const upcoming = filtered.filter((exam) => new Date(exam.startTime) > now);
    const active = filtered.filter(
      (exam) => new Date(exam.startTime) <= now && new Date(exam.endTime) >= now
    );
    const completed = filtered.filter((exam) => new Date(exam.endTime) < now);

    // Apply status filter
    let statusFiltered = filtered;
    if (statusFilter === "upcoming") statusFiltered = upcoming;
    else if (statusFilter === "active") statusFiltered = active;
    else if (statusFilter === "completed") statusFiltered = completed;

    return {
      upcomingExams: upcoming,
      activeExams: active,
      completedExams: completed,
      allFilteredExams: statusFiltered,
    };
  }, [exams, search, subjectFilter, statusFilter]);

  const handleSaveExam = async (data: any) => {
    try {
      const examData: CreateExamData = {
        title: data.title,
        description: data.description || "",
        subject: data.subject,
        instructions: data.instructions || "",
        startTime: data.startTime,
        endTime: data.endTime,
        duration: Number(data.duration),
        totalMarks: Number(data.totalMarks),
        passingMarks: Number(data.passingMarks),
        microphoneRequired: data.microphoneRequired || false,
        faceDetectionRequired: data.faceDetectionRequired || false,
      };

      await createExamMutation.mutateAsync(examData);
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to create exam:", error);
    }
  };

  const handleUpdateExam = async (data: UpdateExamData) => {
    if (!selectedExam) return;

    try {
      await updateExamMutation.mutateAsync({
        examId: selectedExam.id,
        data,
      });
      setShowUpdatePopup(false);
      setSelectedExam(null);
    } catch (error) {
      console.error("Failed to update exam:", error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await deleteExamMutation.mutateAsync(examId);
      } catch (error) {
        console.error("Failed to delete exam:", error);
      }
    }
  };

  const openUpdatePopup = (exam: Exam) => {
    setSelectedExam(exam);
    setShowUpdatePopup(true);
    setMenuOpen(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest('.menu-container')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const getExamStatus = (exam: any) => {
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);
    const now = new Date();

    if (start > now) return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (start <= now && end >= now) return { label: "Active", color: "bg-green-100 text-green-800" };
    return { label: "Completed", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Exam Management</h2>
          <p className="text-gray-500 text-sm mt-1">Create and manage exams</p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Create Exam
        </button>
      </div>

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
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        {!isLoading && exams && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {allFilteredExams.length} of {exams.length} exams
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">
            Failed to load exams. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : allFilteredExams.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileCheck className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No exams found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {search || subjectFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first exam"}
          </p>
          {!search && statusFilter === "all" && (
            <button
              onClick={() => setShowPopup(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Exam
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFilteredExams.map((exam) => {
            const status = getExamStatus(exam);
            return (
              <div
                key={exam.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 relative group"
              >
                {/* Action Menu */}
                <div className="absolute top-4 right-4 menu-container">
                  <button
                    onClick={() => setMenuOpen(menuOpen === exam.id ? null : exam.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>

                  {menuOpen === exam.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => openUpdatePopup(exam)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                      >
                        <Edit size={14} />
                        Edit Exam Details
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/exam/${exam.id}/questions`);
                          setMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit size={14} />
                        Manage Questions
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteExam(exam.id);
                          setMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 border-t border-gray-100"
                      >
                        <Trash2 size={14} />
                        Delete Exam
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  onClick={() => navigate(`/exam/${exam.id}/questions`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 pr-8">
                      {exam.title}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{formatRelativeDate(exam.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={14} />
                      <span>{exam.duration} minutes</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    {exam.subject && (
                      <span className="text-xs text-gray-500 font-medium">{exam.subject}</span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    {exam.questionCount || 0} questions • {exam.totalMarks} marks
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPopup && (
        <CreateExamPopup onClose={() => setShowPopup(false)} onSave={handleSaveExam} />
      )}

      {showUpdatePopup && selectedExam && (
        <UpdateExamPopup
          exam={selectedExam}
          onClose={() => {
            setShowUpdatePopup(false);
            setSelectedExam(null);
          }}
          onUpdate={handleUpdateExam}
        />
      )}
    </div>
  );
};

export default Exams;
