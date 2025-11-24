import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, FileText, Clock, Calendar, Eye, CheckCircle } from "lucide-react";
import AddEditQuestionPopup from "../components/AddEditQuestionPopup";
import ViewQuestionPopup from "../components/ViewQuestionPopup";
import type { QuestionViewData } from "../components/ViewQuestionPopup";

interface ExamData {
  id: number;
  subject: string;
  date: string;
  time: string;
  score?: string;
}

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
  const location = useLocation();
  const navigate = useNavigate();
  const exam = (location.state as ExamData | undefined) ?? null;
  const [questions, setQuestions] = useState<QuestionTypeUI[]>([]);

  useEffect(() => {
    if (!location.state) {
      // If no exam data is available, redirect back to exams
      navigate('/exam');
    }
  }, [location.state, navigate]);

  const [popupData, setPopupData] = useState<QuestionTypeUI | null>(null);
  const [popupMode, setPopupMode] = useState<"add" | "edit">("add");
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<QuestionTypeUI | null>(null);

  const openAddPopup = () => {
    setPopupMode("add");
    setPopupData({
      order: questions.length + 1,
      type: "typing",
      questionText: "",
      marks: 1,
      answerMinLength: 0,
      answerMaxLength: 200,
      options: [],
    });
  };

  const openViewPopup = (q: QuestionTypeUI) => {
    setSelected(q);
    setViewOpen(true);
  };

  const saveQuestion = (data: QuestionTypeUI) => {
    const normalized: QuestionTypeUI = {
      ...data,
      answerMinLength: data.answerMinLength ?? undefined,
      answerMaxLength: data.answerMaxLength ?? undefined,
    };
    if (popupMode === "add") {
      setQuestions((prev) => [...prev, normalized]);
    } else {
      setQuestions((prev) => prev.map((q) => (q.order === normalized.order ? normalized : q)));
    }
    setPopupData(null);
  };

  const deleteQuestion = (order: number) => {
    const filtered = questions.filter((q) => q.order !== order);
    filtered.forEach((q, i) => (q.order = i + 1));
    setQuestions(filtered);
    setPopupData(null);
    setSelected(null);
    setViewOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white px-6 py-8 md:py-10 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage Questions</h1>
              {exam && (
                <h2 className="text-xl md:text-2xl font-semibold mt-1 text-blue-100">{exam.subject}</h2>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-blue-100">
                {exam?.date && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Calendar size={14} /> {exam.date}
                  </span>
                )}
                {exam?.time && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full">
                    <Clock size={14} /> {exam.time}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={openAddPopup}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-200 font-medium self-start md:self-center"
            >
              <Plus size={18} />
              <span>Add Question</span>
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {questions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No questions yet</h3>
            <p className="mt-1 text-gray-500">Get started by adding your first question.</p>
            <button
              onClick={openAddPopup}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {questions.map((q) => (
              <div
                key={q.order}
                onClick={() => openViewPopup(q)}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {q.order}. {q.questionText || "Untitled question"}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {q.type.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center text-gray-600">
                          <FileText size={14} className="mr-1.5 text-gray-400" />
                          {q.type === 'mcq' ? `${q.options?.length || 0} Options` : 'Text Answer'}
                        </span>
                        <span className="inline-flex items-center text-gray-600">
                          <CheckCircle size={14} className="mr-1.5 text-green-500" />
                          {q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewPopup(q);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50"
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

      {/* Popup */}
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
            const normalized: QuestionTypeUI = {
              ...updated,
              answerMinLength: updated.answerMinLength ?? undefined,
              answerMaxLength: updated.answerMaxLength ?? undefined,
            };
            setQuestions((prev) => prev.map((q) => (q.order === normalized.order ? { ...q, ...normalized } : q)));
            setSelected((prev) => (prev ? { ...prev, ...normalized } : prev));
            setViewOpen(false);
          }}
          onDelete={deleteQuestion}
        />
      )}
    </div>
  );
};

export default AddQuestionsPage;
