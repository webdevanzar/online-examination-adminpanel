import React, { useState, useMemo, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

const Exams: React.FC = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "active" | "completed"
  >("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const { data: exams, isLoading, error } = useGetAllExams();
  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();
  const deleteExamMutation = useDeleteExam();

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    if (!exams) return [];
    return Array.from(
      new Set(exams.map((exam) => exam.subject).filter(Boolean)),
    );
  }, [exams]);

  // Filter and categorize exams
  const { allFilteredExams } = useMemo(() => {
    if (!exams)
      return {
        upcomingExams: [],
        activeExams: [],
        completedExams: [],
        allFilteredExams: [],
      };

    let filtered = exams;

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(search.toLowerCase()) ||
          exam.subject.toLowerCase().includes(search.toLowerCase()),
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
      (exam) =>
        new Date(exam.startTime) <= now && new Date(exam.endTime) >= now,
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
      if (menuOpen && !(event.target as Element).closest(".menu-container")) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const getExamStatus = (exam: any) => {
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);
    const now = new Date();

    if (start > now)
      return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (start <= now && end >= now)
      return { label: "Active", color: "bg-green-100 text-green-800" };
    return { label: "Completed", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Exam Management
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Create, monitor, and manage your online assessments.
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-bold group"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={18} />
          </div>
          Create New Exam
        </button>
      </div>

      {/* Filters Container */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        {!isLoading && exams && (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold">
              {allFilteredExams.length}
            </div>
            <span className="text-slate-500 font-medium">
              exams found matching your criteria
            </span>
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

      {/* Exam Grid */}
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 animate-pulse"
              >
                <div className="h-8 bg-slate-100 rounded-xl w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-xl w-1/2 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 rounded-xl w-full"></div>
                  <div className="h-4 bg-slate-50 rounded-xl w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allFilteredExams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-4xl shadow-sm border border-slate-100 p-20 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileCheck className="text-slate-300" size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              No exams found
            </h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
              {search || subjectFilter !== "all" || statusFilter !== "all"
                ? "We couldn't find any exams matching your current filters. Try resetting them."
                : "Your platform is ready for some content. Start by creating your very first examination."}
            </p>
            {!search && statusFilter === "all" && (
              <button
                onClick={() => setShowPopup(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold"
              >
                Create Exam
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allFilteredExams.map((exam) => {
              const status = getExamStatus(exam);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={exam.id}
                  className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 relative group"
                >
                  {/* Action Menu */}
                  <div className="absolute top-6 right-6 menu-container">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === exam.id ? null : exam.id)
                      }
                      className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <MoreVertical size={20} className="text-slate-400" />
                    </button>

                    <AnimatePresence>
                      {menuOpen === exam.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <button
                            onClick={() => openUpdatePopup(exam)}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                          >
                            <Edit size={16} />
                            Edit Details
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/exam/${exam.id}/questions`);
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                          >
                            <Plus size={16} />
                            Manage Questions
                          </button>
                          <div className="border-t border-slate-50"></div>
                          <button
                            onClick={() => {
                              handleDeleteExam(exam.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete Exam
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div
                    onClick={() => navigate(`/exam/${exam.id}/questions`)}
                    className="cursor-pointer"
                  >
                    <div className="mb-6">
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {exam.title}
                    </h3>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <Calendar size={14} className="text-slate-400" />
                        </div>
                        <span>{formatRelativeDate(exam.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <Clock size={14} className="text-slate-400" />
                        </div>
                        <span>{exam.duration} minutes</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Subject
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {exam.subject || "General"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Questions
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {exam.questionCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {showPopup && (
        <CreateExamPopup
          onClose={() => setShowPopup(false)}
          onSave={handleSaveExam}
        />
      )}

      {showUpdatePopup && selectedExam && (
        <UpdateExamPopup
          exam={selectedExam}
          isOpen={showUpdatePopup}
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
