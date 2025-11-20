import React, { useState } from "react";
import MCQOptionsTab from "./McqOptionsTab";
import type { QuestionTypeUI } from "../pages/AddQuestionsPage";

interface Props {
  mode: "add" | "edit";
  data: QuestionTypeUI;
  onSave: (q: QuestionTypeUI) => void;
  onDelete: (order: number) => void;
  onClose: () => void;
}

const AddEditQuestionPopup: React.FC<Props> = ({
  mode,
  data,
  onSave,
  onDelete,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [question, setQuestion] = useState<QuestionTypeUI>(data);

  const updateField = (field: string, value: any) => {
    setQuestion({ ...question, [field]: value });
  };

  const save = () => {
    if (!question.questionText.trim())
      return alert("Question text is required");
    onSave(question);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">
            {mode === "add" ? "Add Question" : "Edit Question"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">
            ✕
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 ${
              activeTab === "details" ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            Question Details
          </button>

          <button
            className={`flex-1 p-3 ${
              activeTab === "options" ? "bg-blue-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("options")}
          >
            {question.type === "mcq" ? "MCQ Options" : "Typing Rules"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold">Question</label>
                <textarea
                  value={question.questionText}
                  onChange={(e) =>
                    updateField("questionText", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="font-semibold">Type</label>
                <select
                  value={question.type}
                  onChange={(e) =>
                    updateField("type", e.target.value as any)
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="typing">Typing</option>
                  <option value="mcq">MCQ</option>
                </select>
              </div>

              <div>
                <label className="font-semibold">Marks</label>
                <input
                  type="number"
                  value={question.marks}
                  onChange={(e) =>
                    updateField("marks", Number(e.target.value))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* OPTIONS TAB */}
          {activeTab === "options" && (
            <>
              {question.type === "mcq" ? (
                <MCQOptionsTab
                  question={question}
                  updateQuestion={setQuestion}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-semibold">Min Length</label>
                    <input
                      type="number"
                      value={question.answerMinLength}
                      onChange={(e) =>
                        updateField(
                          "answerMinLength",
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Max Length</label>
                    <input
                      type="number"
                      value={question.answerMaxLength}
                      onChange={(e) =>
                        updateField(
                          "answerMaxLength",
                          Number(e.target.value)
                        )
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 flex justify-between border-t">
          {mode === "edit" && (
            <button
              onClick={() => onDelete(question.order)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
          )}

          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={save}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditQuestionPopup;
