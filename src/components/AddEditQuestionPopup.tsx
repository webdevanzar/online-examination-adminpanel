import React, { useState } from "react";
import Modal from "./Modal";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "./InputField";

interface OptionType {
  optionText: string;
  isCorrect: boolean;
}

interface QuestionData {
  type: "mcq" | "typing";
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
  const isEdit = Boolean(initialData);
  const [type, setType] = useState<QuestionData["type"]>(initialData?.type || "mcq");
  const [questionText, setQuestionText] = useState(initialData?.questionText || "");
  const [options, setOptions] = useState<OptionType[]>(initialData?.options || [{ optionText: "", isCorrect: false }]);
  const [allowMultiple, setAllowMultiple] = useState(
    (initialData?.options?.filter((o) => o.isCorrect).length || 0) > 1
  );
  const [answerMinLength, setAnswerMinLength] = useState<number | null>(initialData?.answerMinLength ?? null);
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(initialData?.answerMaxLength ?? null);

  type FormValues = { marks: number };
  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { marks: initialData?.marks ?? 1 },
  });

  const handleOptionChange = (
    index: number,
    field: "optionText" | "isCorrect",
    value: string | boolean
  ) => {
    const updated = [...options];
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

  const handleSubmit = () => {
    const { marks } = methods.getValues();
    const payload: QuestionData = {
      type,
      questionText,
      marks: Number(marks),
      options: type === "mcq" ? options : undefined,
      answerMinLength: type === "typing" ? answerMinLength : null,
      answerMaxLength: type === "typing" ? answerMaxLength : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Question" : "Add Question"} size="lg">
      <div className="space-y-6">
        <FormProvider {...methods}>
        {/* Question Type Tabs */}
        <div className="flex gap-2 border-b pb-2">
          {["mcq", "typing"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as QuestionData["type"])}
              className={`px-3 py-2 rounded-md text-sm transition ${
                type === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
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
          <InputField
            name={"marks"}
            label=""
            type="number"
            placeholder="Marks"
            rules={{ required: "Marks is required" }}
            className=""
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
              <span className="text-sm text-gray-700">Allow multiple correct answers</span>
            </label>

            <div className="space-y-3">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-4 border rounded-lg p-3">
                  {/* Option text */}
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 border rounded p-2"
                    value={opt.optionText}
                    onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                  />

                  {/* Correct Answer Selector */}
                  {allowMultiple ? (
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
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
                    <button className="text-red-500" onClick={() => removeOption(index)}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addOption} className="text-blue-600 mt-2 hover:underline">
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
        <div className="flex justify-end gap-4 pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Cancel
          </button>

          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default AddEditQuestionPopup;
