import React, { useState } from "react";
import AddEditQuestionPopup from "../components/AddEditQuestionPopup";

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

  const openEditPopup = (q: QuestionTypeUI) => {
    setPopupMode("edit");
    setPopupData(q);
  };

  const saveQuestion = (data: QuestionTypeUI) => {
    if (popupMode === "add") {
      setQuestions([...questions, data]);
    } else {
      setQuestions(
        questions.map((q) => (q.order === data.order ? data : q))
      );
    }
    setPopupData(null);
  };

  const deleteQuestion = (order: number) => {
    const filtered = questions.filter((q) => q.order !== order);
    filtered.forEach((q, i) => (q.order = i + 1));
    setQuestions(filtered);
    setPopupData(null);
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

      {/* TILES */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.order}
            onClick={() => openEditPopup(q)}
            className="p-4 bg-white border rounded-xl shadow cursor-pointer hover:bg-blue-50"
          >
            <p className="font-bold text-lg">
              {q.order}. {q.questionText}
            </p>
            <p className="text-gray-600 capitalize">
              Type: {q.type} • Marks: {q.marks}
            </p>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {popupData && (
        <AddEditQuestionPopup
          mode={popupMode}
          data={popupData}
          onSave={saveQuestion}
          onDelete={deleteQuestion}
          onClose={() => setPopupData(null)}
        />
      )}
    </div>
  );
};

export default AddQuestionsPage;
