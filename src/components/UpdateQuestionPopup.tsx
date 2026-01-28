import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "./InputField";
import Modal from "./Modal";
import { Plus, Trash2, CheckCircle2, Circle, HelpCircle } from "lucide-react";

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
  hasMultipleCorrect?: boolean;
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
  const [questionText, setQuestionText] = useState(
    initialData?.questionText || "",
  );
  type FormValues = { marks: number };
  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { marks: initialData?.marks || 1 },
  });
  const [options, setOptions] = useState<OptionType[]>(
    initialData?.type === "mcq" ? initialData.options || [] : [],
  );
  const [allowMultiple, setAllowMultiple] = useState(
    initialData?.type === "mcq" && initialData.options
      ? initialData.options.filter((o) => o.isCorrect).length > 1
      : false,
  );
  const [answerMinLength, setAnswerMinLength] = useState<number | null>(
    initialData?.type === "typing" ? initialData.answerMinLength || null : null,
  );
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(
    initialData?.type === "typing" ? initialData.answerMaxLength || null : null,
  );

  const handleOptionChange = (
    index: number,
    field: keyof OptionType,
    value: string | boolean,
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    const isValid = await methods.trigger();
    if (!isValid) return;

    if (!questionText.trim()) {
      alert("Please enter question text");
      return;
    }

    if (initialData.type === "mcq") {
      if (options.length < 2) {
        alert("Please add at least 2 options for MCQ");
        return;
      }
      if (options.some((opt) => !opt.optionText.trim())) {
        alert("All options must have text");
        return;
      }
      if (!options.some((opt) => opt.isCorrect)) {
        alert("Please select at least one correct answer");
        return;
      }
    }

    const { marks } = methods.getValues();
    const updatedQuestion: QuestionData = {
      ...initialData,
      id: initialData.id,
      questionText,
      marks: Number(marks),
      ...(initialData.type === "mcq"
        ? { options, hasMultipleCorrect: allowMultiple }
        : {
            answerMinLength,
            answerMaxLength,
          }),
    };

    onUpdate(updatedQuestion);
    onClose();
  };

  if (!initialData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Question" size="lg">
      <div className="space-y-8">
        <FormProvider {...methods}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                Question Configuration
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Type:{" "}
                <span className="text-blue-600 uppercase tracking-wider text-xs">
                  {initialData.type}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Question Content
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Marks
              </label>
              <InputField
                name={"marks"}
                label=""
                type="number"
                placeholder="1"
                rules={{ required: "Marks is required" }}
                className="font-bold text-lg"
              />
            </div>
          </div>

          {initialData.type === "mcq" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900">Options & Answers</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded-lg border-slate-300 focus:ring-blue-500"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                  />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors uppercase tracking-wider">
                    Allow Multiple
                  </span>
                </label>
              </div>

              <div className="space-y-3">
                {options.map((opt, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl hover:border-blue-200 hover:bg-white transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-700 placeholder:text-slate-300"
                      value={opt.optionText}
                      onChange={(e) =>
                        handleOptionChange(index, "optionText", e.target.value)
                      }
                    />

                    <div className="flex items-center gap-2 pr-2 border-l border-slate-200 pl-4">
                      {allowMultiple ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleOptionChange(
                              index,
                              "isCorrect",
                              !opt.isCorrect,
                            )
                          }
                          className={`p-1.5 rounded-lg transition-all ${
                            opt.isCorrect
                              ? "bg-emerald-100 text-emerald-600"
                              : "text-slate-300 hover:bg-slate-100 hover:text-slate-400"
                          }`}
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSingleCorrect(index)}
                          className={`p-1.5 rounded-lg transition-all ${
                            opt.isCorrect
                              ? "bg-emerald-100 text-emerald-600"
                              : "text-slate-300 hover:bg-slate-100 hover:text-slate-400"
                          }`}
                        >
                          {opt.isCorrect ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                      )}

                      {options.length > 1 && (
                        <button
                          className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addOption}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all w-fit"
              >
                <Plus size={18} />
                Add Choice
              </button>
            </div>
          )}

          {initialData.type === "typing" && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Min Length (chars)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                  value={answerMinLength || ""}
                  onChange={(e) => setAnswerMinLength(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Max Length (chars)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                  value={answerMaxLength || ""}
                  onChange={(e) => setAnswerMaxLength(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="flex justify-stretch gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Update Question
            </button>
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default UpdateQuestionPopup;
