import React, { useState } from "react";
import Modal from "./Modal";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "./InputField";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Type,
  ListChecks,
} from "lucide-react";

interface OptionType {
  optionText: string;
  isCorrect: boolean;
}

interface QuestionData {
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
  const [type, setType] = useState<QuestionData["type"]>(
    initialData?.type || "mcq",
  );
  const [questionText, setQuestionText] = useState(
    initialData?.questionText || "",
  );
  const [options, setOptions] = useState<OptionType[]>(
    initialData?.options || [{ optionText: "", isCorrect: false }],
  );
  const [allowMultiple, setAllowMultiple] = useState(
    (initialData?.options?.filter((o) => o.isCorrect).length || 0) > 1,
  );
  const [answerMinLength, setAnswerMinLength] = useState<number | null>(
    initialData?.answerMinLength ?? null,
  );
  const [answerMaxLength, setAnswerMaxLength] = useState<number | null>(
    initialData?.answerMaxLength ?? null,
  );

  type FormValues = { marks: number };
  const methods = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { marks: initialData?.marks ?? 1 },
  });

  const handleOptionChange = (
    index: number,
    field: "optionText" | "isCorrect",
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

  const handleSubmit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    if (!questionText.trim()) {
      alert("Please enter question text");
      return;
    }

    if (type === "mcq") {
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
    const payload: QuestionData = {
      type,
      questionText,
      marks: Number(marks),
      ...(type === "mcq" && { options, hasMultipleCorrect: allowMultiple }),
      ...(type === "typing" && {
        answerMinLength,
        answerMaxLength,
      }),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Question" : "Create New Question"}
      size="lg"
    >
      <div className="space-y-8">
        <FormProvider {...methods}>
          {/* Question Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Question Type
            </label>
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
              {[
                { id: "mcq", label: "Multiple Choice", icon: ListChecks },
                { id: "typing", label: "Typing Answer", icon: Type },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as QuestionData["type"])}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    type === t.id
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
                >
                  <t.icon size={18} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Question Text */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Question Content
              </label>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                rows={4}
                placeholder="Ex: What is the primary function of DNA?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            {/* Marks */}
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

          {/* MCQ Options Section */}
          {type === "mcq" && (
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
                      placeholder={`Choice text...`}
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

          {/* Typing Answer Section */}
          {type === "typing" && (
            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Min Length (chars)
                </label>
                <input
                  type="number"
                  placeholder="0"
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
                  placeholder="Unlimited"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                  value={answerMaxLength || ""}
                  onChange={(e) => setAnswerMaxLength(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-stretch gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isEdit ? "Update Question" : "Create Question"}
            </button>
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default AddEditQuestionPopup;
