import React from "react";
import type { QuestionTypeUI } from "../pages/AddQuestionsPage";

interface Props {
  question: QuestionTypeUI;
  updateQuestion: (q: QuestionTypeUI) => void;
}

const MCQOptionsTab: React.FC<Props> = ({ question, updateQuestion }) => {
  const addOption = () => {
    updateQuestion({
      ...question,
      options: [
        ...(question.options || []),
        { optionText: "", isCorrect: false },
      ],
    });
  };

  const updateOption = (i: number, field: string, val: any) => {
    const updated = question.options!.map((opt, idx) =>
      idx === i ? { ...opt, [field]: val } : opt
    );
    updateQuestion({ ...question, options: updated });
  };

  const removeOption = (i: number) => {
    const updated = question.options!.filter((_, idx) => idx !== i);
    updateQuestion({ ...question, options: updated });
  };

  return (
    <div className="space-y-4">
      {question.options?.map((opt, i) => (
        <div
          key={i}
          className="border p-3 rounded-lg bg-gray-50 flex items-center gap-3"
        >
          <input
            type="checkbox"
            checked={opt.isCorrect}
            onChange={(e) =>
              updateOption(i, "isCorrect", e.target.checked)
            }
          />

          <input
            value={opt.optionText}
            onChange={(e) =>
              updateOption(i, "optionText", e.target.value)
            }
            className="flex-1 p-2 border rounded-lg"
            placeholder={`Option ${i + 1}`}
          />

          <button
            onClick={() => removeOption(i)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      ))}

      <button
        onClick={addOption}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Add Option
      </button>
    </div>
  );
};

export default MCQOptionsTab;
