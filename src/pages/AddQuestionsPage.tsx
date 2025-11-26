import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Clock,
  Calendar,
  Eye,
  CheckCircle,
  Loader2,
} from "lucide-react";
import AddEditQuestionPopup from "../components/AddEditQuestionPopup";
import ViewQuestionPopup from "../components/ViewQuestionPopup";
import type { QuestionViewData } from "../components/ViewQuestionPopup";
import { useGetExamById, useGetExamQuestions } from "../services/exam";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  type CreateQuestionData,
} from "../services/question";
import { formatDateTime } from "../utils/helpers";

export interface OptionType {
  id?: string;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionTypeUI {
  id?: string;
  order: number;
  type: "typing" | "mcq";
  questionText: string;
  marks: number;
  hasMultipleCorrect?: boolean;
  answerMinLength?: number;
  answerMaxLength?: number;
  options?: OptionType[];
}

const AddQuestionsPage = () => {
  const { examid } = useParams<{ examid: string }>();
  const navigate = useNavigate();

  const {
    data: exam,
    isLoading: examLoading,
    error: examError,
  } = useGetExamById(examid!);
  const {
    data: questions,
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetExamQuestions(examid!);

  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  const [popupData, setPopupData] = useState<QuestionTypeUI | null>(null);
  const [, setPopupMode] = useState<"add" | "edit">("add");
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<QuestionTypeUI | null>(null);

  // Redirect if no exam ID
  useEffect(() => {
    if (!examid) {
      navigate("/exam");
    }
  }, [examid, navigate]);

  const openAddPopup = () => {
    setPopupMode("add");
    setPopupData({
      order: (questions?.length || 0) + 1,
      type: "typing",
      questionText: "",
      marks: 1,
      answerMinLength: 0,
      answerMaxLength: 200,
      options: [],
    });
  };

  const openViewPopup = (q: any) => {
    setSelected(q);
    setViewOpen(true);
  };

  const saveQuestion = async (data: QuestionTypeUI) => {
    if (!examid) return;

    try {
      const questionData: CreateQuestionData = {
        type: data.type,
        questionText: data.questionText,
        marks: data.marks,
        hasMultipleCorrect: data.hasMultipleCorrect,
        answerMinLength: data.answerMinLength,
        answerMaxLength: data.answerMaxLength,
        options: data.options?.map((opt) => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
      };

      // Check if question has an ID to determine update vs create
      if (data.id) {
        await updateQuestionMutation.mutateAsync({
          questionId: data.id,
          data: questionData,
        });
      } else {
        await createQuestionMutation.mutateAsync({
          examId: examid,
          data: questionData,
        });
      }

      setPopupData(null);
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestionMutation.mutateAsync(questionId);
      setPopupData(null);
      setSelected(null);
      setViewOpen(false);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const isLoading = examLoading || questionsLoading;
  const hasError = examError || questionsError;

  return (
    <div className="min-h-screen animate-fadeIn">
      {/* Header */}
      <div className="bg-linear-to-r rounded-t-2xl from-blue-500 to-blue-600 text-white px-6 py-8 md:py-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-white/20 rounded w-1/4"></div>
            </div>
          ) : exam ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Manage Questions
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold mt-1 text-blue-100">
                  {exam.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-blue-100">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    {formatDateTime(exam.startTime)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Clock size={14} />
                    {exam.duration} min
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    Total: {exam.totalMarks} marks
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    Assigned: {questions?.reduce((sum, q) => sum + q.marks, 0) || 0} marks
                  </span>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    (exam.totalMarks - (questions?.reduce((sum, q) => sum + q.marks, 0) || 0)) === 0
                      ? 'bg-green-500/20 text-green-100'
                      : 'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    Remaining: {exam.totalMarks - (questions?.reduce((sum, q) => sum + q.marks, 0) || 0)} marks
                  </span>
                </div>
              </div>
              <button
                onClick={openAddPopup}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50 hover:shadow-md transition-all duration-200 font-medium self-start md:self-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                <span>Add Question</span>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold">Exam not found</h1>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {hasError && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Failed to load exam or questions. Please try refreshing the page.
            </p>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : questions?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Get started by adding your first question to this exam.
            </p>
            <button
              onClick={openAddPopup}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions?.map((q, index) => (
              <div
                key={q.id}
                onClick={() => openViewPopup(q)}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {index + 1}. {q.questionText || "Untitled question"}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                          {q.type.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center text-gray-600">
                          <FileText
                            size={14}
                            className="mr-1.5 text-gray-400"
                          />
                          {q.type === "mcq"
                            ? `${q.options?.length || 0} Options`
                            : "Text Answer"}
                        </span>
                        <span className="inline-flex items-center text-gray-600">
                          <CheckCircle
                            size={14}
                            className="mr-1.5 text-green-500"
                          />
                          {q.marks} {q.marks === 1 ? "Mark" : "Marks"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewPopup(q);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Popup */}
      {popupData && (
        <AddEditQuestionPopup
          isOpen={true}
          initialData={popupData}
          onClose={() => setPopupData(null)}
          onSubmit={(data) => {
            saveQuestion({
              ...popupData,
              ...data,
            } as QuestionTypeUI);
          }}
        />
      )}

      {/* View/Edit/Delete Popup */}
      {selected && (
        <ViewQuestionPopup
          isOpen={viewOpen}
          question={selected as QuestionViewData}
          onClose={() => setViewOpen(false)}
          onUpdate={(updated: QuestionViewData) => {
            saveQuestion(updated as QuestionTypeUI);
            setViewOpen(false);
          }}
          onDelete={() => {
            if (selected.id) {
              deleteQuestion(selected.id);
            }
          }}
        />
      )}

      {/* Loading Overlay */}
      {(createQuestionMutation.isPending ||
        updateQuestionMutation.isPending ||
        deleteQuestionMutation.isPending) && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-500" size={24} />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestionsPage;
