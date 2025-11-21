import React, { useState, useEffect } from "react";

interface OptionType {
  optionText: string;
  isCorrect: boolean;
}

interface QuestionData {
  type: string;
  questionText: string;
  marks: number;
  options?: OptionType[];
  answerMinLength?: number | null;
  answerMaxLength?: number | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionData) => void;
  initialData?: QuestionData | null;
}

const AddEditQuestionPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [type, setType] = useState("mcq");
  const [questionText, setQuestionText] = useState("");
  const [marks, setMarks] = useState(1);

  const [options, setOptions] = useState<OptionType[]>([
    { optionText: "", isCorrect: false },
  ]);

  const [allowMultiple, setAllowMultiple] = useState(false);

  const [answerMinLength, setAnswerMinLength] = useState<number | null>(null);
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setQuestionText(initialData.questionText);
      setMarks(initialData.marks);
      setOptions(initialData.options || [{ optionText: "", isCorrect: false }]);
      setAnswerMinLength(initialData.answerMinLength || null);
      setAnswerMaxLength(initialData.answerMaxLength || null);

      // auto-enable multiple checkbox if more than one correct answer exists
      const correctCount = initialData.options?.filter((o) => o.isCorrect).length || 0;
      setAllowMultiple(correctCount > 1);
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

  const handleSubmit = () => {
    const payload: QuestionData = {
      type,
      questionText,
      marks,
      options: type === "mcq" ? options : undefined,
      answerMinLength: type === "typing" ? answerMinLength : null,
      answerMaxLength: type === "typing" ? answerMaxLength : null,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[650px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-8 space-y-6">

        <h2 className="text-2xl font-semibold">
          {isEdit ? "Edit Question" : "Add Question"}
        </h2>

        {/* Question Type Tabs */}
        <div className="flex gap-4 border-b pb-2">
          {["mcq", "typing"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded transition-all ${
                type === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t === "mcq" ? "MCQ" : "Typing Answer"}
            </button>
          ))}
        </div>

        {/* Question */}
        <div className="space-y-2">
          <label className="font-medium">Question Text</label>
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

        {/* MCQ Section */}
        {type === "mcq" && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Options</h3>

            {/* Toggle for allowing multiple correct answers */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                Allow multiple correct answers
              </span>
            </label>

            <div className="space-y-3">
              {options.map((opt, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border rounded-lg p-3"
                >
                  {/* Option text */}
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 border rounded p-2"
                    value={opt.optionText}
                    onChange={(e) =>
                      handleOptionChange(index, "optionText", e.target.value)
                    }
                  />

                  {/* Correct Answer Selector */}
                  {allowMultiple ? (
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          "isCorrect",
                          e.target.checked
                        )
                      }
                    />
                  ) : (
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={opt.isCorrect}
                      onChange={() => handleSingleCorrect(index)}
                    />
                  )}

                  {/* Delete option */}
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
            </div>

            <button
              onClick={addOption}
              className="text-blue-600 mt-2 hover:underline"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Typing Answer Section */}
        {type === "typing" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-medium">Minimum Answer Length</label>
              <input
                type="number"
                className="w-full border rounded-lg p-3"
                value={answerMinLength || ""}
                onChange={(e) => setAnswerMinLength(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium">Maximum Answer Length</label>
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddEditQuestionPopup;
