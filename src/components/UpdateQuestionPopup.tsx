import React, { useEffect, useState } from "react";

interface OptionType {
  optionText: string;
  isCorrect: boolean;
}

interface QuestionData {
  id?: string;
  type: "mcq" | "typing";
  questionText: string;
  marks: number;
  options?: OptionType[];
  answerMinLength?: number | null;
  answerMaxLength?: number | null;
}

interface Props {
  isOpen: boolean;
  initialData: QuestionData | null;
  onClose: () => void;
  onUpdate: (updated: QuestionData) => void;
}

const UpdateQuestionPopup: React.FC<Props> = ({
  isOpen,
  initialData,
  onClose,
  onUpdate,
}) => {
  const [type, setType] = useState<"mcq" | "typing">("mcq");
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);

  const [options, setOptions] = useState<OptionType[]>([]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const [answerMinLength, setAnswerMinLength] = useState<number | null>(null);
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setQuestionText(initialData.questionText);
      setMarks(initialData.marks);

      if (initialData.type === "mcq") {
        setOptions(initialData.options || []);
        const correctCount =
          initialData.options?.filter((o) => o.isCorrect).length || 0;
        setAllowMultiple(correctCount > 1);
      }

      if (initialData.type === "typing") {
        setAnswerMinLength(initialData.answerMinLength || null);
        setAnswerMaxLength(initialData.answerMaxLength || null);
      }
    }
  }, [initialData]);

  const handleOptionChange = (index: number, field: string, value: any) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleSingleCorrect = (index: number) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updated);
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { optionText: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = () => {
    if (!initialData) return;

    const updated: QuestionData = {
      ...initialData,
      type,
      questionText,
      marks,
      options: type === "mcq" ? options : undefined,
      answerMinLength: type === "typing" ? answerMinLength : null,
      answerMaxLength: type === "typing" ? answerMaxLength : null,
    };

    onUpdate(updated);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-8 space-y-6">

        <h2 className="text-xl font-semibold">Update Question</h2>

        {/* Question Text */}
        <div className="space-y-2">
          <label className="font-medium">Question</label>
          <textarea
            className="w-full border rounded-lg p-3"
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>

        {/* Marks */}
        <div className="space-y-2">
          <label className="font-medium">Marks</label>
          <input
            type="number"
            className="w-full border rounded-lg p-3"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </div>

        {/* ======================
            MCQ UPDATE SECTION
        ======================= */}
        {type === "mcq" && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">MCQ Options</h3>

            {/* Switch to allow multiple correct answers */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
              <span className="text-gray-700 text-sm">
                Allow multiple correct answers
              </span>
            </label>

            {options.map((opt, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border p-3 rounded-lg"
              >
                <input
                  type="text"
                  className="flex-1 border rounded p-2"
                  value={opt.optionText}
                  onChange={(e) =>
                    handleOptionChange(index, "optionText", e.target.value)
                  }
                />

                {allowMultiple ? (
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) =>
                      handleOptionChange(index, "isCorrect", e.target.checked)
                    }
                  />
                ) : (
                  <input
                    type="radio"
                    name="correct"
                    checked={opt.isCorrect}
                    onChange={() => handleSingleCorrect(index)}
                  />
                )}

                {options.length > 1 && (
                  <button
                    className="text-red-500"
                    onClick={() => removeOption(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addOption}
              className="text-blue-600 hover:underline"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* ======================
            TYPING QUESTION UPDATE SECTION
        ======================= */}
        {type === "typing" && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Typing Answer Settings</h3>

            <div>
              <label className="font-medium">Minimum Length</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3"
                value={answerMinLength || ""}
                onChange={(e) => setAnswerMinLength(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-medium">Maximum Length</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3"
                value={answerMaxLength || ""}
                onChange={(e) => setAnswerMaxLength(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuestionPopup;
