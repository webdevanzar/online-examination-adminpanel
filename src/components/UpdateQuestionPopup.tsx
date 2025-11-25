import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "./InputField";

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
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  type FormValues = { marks: number };
  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { marks: initialData?.marks || 1 },
  });
  const [options, setOptions] = useState<OptionType[]>(initialData?.type === 'mcq' ? initialData.options || [] : []);
  const [allowMultiple, setAllowMultiple] = useState(
    initialData?.type === 'mcq' && initialData.options 
      ? initialData.options.filter((o) => o.isCorrect).length > 1 
      : false
  );
  const [answerMinLength, setAnswerMinLength] = useState<number | null>(
    initialData?.type === 'typing' ? initialData.answerMinLength || null : null
  );
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(
    initialData?.type === 'typing' ? initialData.answerMaxLength || null : null
  );

  const handleOptionChange = (
    index: number,
    field: keyof OptionType,
    value: string | boolean
  ) => {
    const updated = [...options];
    // Ensure correct types
    if (field === "optionText") updated[index].optionText = String(value);
    if (field === "isCorrect") updated[index].isCorrect = Boolean(value);
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

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!initialData) return;

    const { marks } = methods.getValues();
    const updatedQuestion: QuestionData = {
      ...initialData,
      questionText,
      marks: Number(marks),
      ...(initialData.type === "mcq"
        ? { options, allowMultiple }
        : {
            answerMinLength,
            answerMaxLength,
          }),
    };

    onUpdate(updatedQuestion);
    onClose();
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-xl font-semibold">Update Question</h2>
        <FormProvider {...methods}>

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
          <InputField
            name={"marks"}
            label=""
            type="number"
            placeholder="Marks"
            rules={{ required: "Marks is required" }}
          />
        </div>

        {/* Question Type Display */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">
            Question Type: <span className="capitalize">{initialData.type}</span>
          </h3>
        </div>

        {/* MCQ Options Section */}
        {initialData.type === "mcq" && (
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

        {/* Typing Answer Section */}
        {initialData.type === "typing" && (
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
        </FormProvider>
      </div>
    </div>
  );
};

export default UpdateQuestionPopup;
