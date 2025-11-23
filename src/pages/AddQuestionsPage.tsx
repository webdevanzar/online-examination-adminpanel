import { useState } from "react";
import AddEditQuestionPopup from "../components/AddEditQuestionPopup";
import ViewQuestionPopup from "../components/ViewQuestionPopup";
import type { QuestionViewData } from "../components/ViewQuestionPopup";

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
  const [questions, setQuestions] = useState<QuestionTypeUI[]>([]);
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Questions</h1>

        <button
          onClick={openAddPopup}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Question
        </button>
      </div>

      {/* Tiles */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.order}
            onClick={() => openViewPopup(q)}
            className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer hover:bg-blue-50 hover:shadow transition"
          >
            <p className="font-bold text-lg text-gray-800">
              {q.order}. {q.questionText || "Untitled question"}
            </p>

            <p className="text-gray-600 capitalize">
              Type: {q.type} • Marks: {q.marks}
            </p>
          </div>
        ))}
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
