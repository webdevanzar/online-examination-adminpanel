import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";

interface CreateExamPopupProps {
  onClose: () => void;
  onSave: (data: CreateExamData) => void;
}

interface CreateExamData {
  title: string;
  description: string;
  subject: string;
  instructions: string;
  startTime: string;
  endTime: string;
  totalMarks: string | number;
  passingMarks: string | number;
  microphoneRequired: boolean;
  faceDetectionRequired: boolean;
  // Question settings kept as-is in local state (not validated here)
  questionText: string;
  marks: string | number;
  type: string;
  hasMultipleCorrect: boolean;
  answerMinLength: string | number;
  answerMaxLength: string | number;
  options: { text: string; isCorrect: boolean }[];
}

const CreateExamPopup = ({ onClose, onSave }: CreateExamPopupProps) => {
  const [form, setForm] = useState({
    // Exam Fields
    title: "",
    description: "",
    subject: "",
    instructions: "",

    startTime: "",
    endTime: "",
    totalMarks: "",
    passingMarks: "",

    microphoneRequired: false,
    faceDetectionRequired: true,

    // Question Fields
    questionText: "",
    marks: "",
    type: "mcq",
    hasMultipleCorrect: false,

    answerMinLength: "",
    answerMaxLength: "",

    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name as keyof CreateExamData;
    const value = ((): string | number | boolean => {
      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        return target.checked;
      }
      return target.value;
    })();
    setForm((prev) => ({
      ...prev,
      [name]: value as CreateExamData[typeof name],
    }));
  };

  const ExamSchema = z
    .object({
      title: z.string().min(1, "Title is required"),
      subject: z.string().min(1, "Subject is required"),
      totalMarks: z.coerce.number().min(1, "Total marks is required"),
      passingMarks: z.coerce.number().min(0, "Passing marks is required"),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
      instructions: z.string().optional(),
      description: z.string().optional(),
    })
    .refine(
      (v) => new Date(v.endTime) > new Date(v.startTime),
      { path: ["endTime"], message: "End time must be after start time" }
    )
    .refine(
      (v) => v.passingMarks <= v.totalMarks,
      { path: ["passingMarks"], message: "Passing marks cannot be greater than total marks" }
    );

  type ExamFormInput = z.input<typeof ExamSchema>;
  type ExamFormOutput = z.output<typeof ExamSchema>;

  const methods = useForm<ExamFormInput, undefined, ExamFormOutput>({
    mode: "onTouched",
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      title: form.title,
      subject: form.subject,
      totalMarks: Number(form.totalMarks),
      passingMarks: Number(form.passingMarks),
      startTime: form.startTime,
      endTime: form.endTime,
      instructions: form.instructions,
      description: form.description,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-[650px] rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Create Exam</h2>
          <button onClick={onClose} className="text-xl font-bold text-gray-500">
            ✖
          </button>
        </div>

        {/* ---------------- EXAM FIELDS ---------------- */}
        <h3 className="font-semibold text-lg mb-2">Exam Details</h3>
        <FormProvider {...methods}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name={"title"}
              label="Title"
              placeholder="Exam Title"
              rules={{ required: "Title is required" }}
            />

            <InputField
              name={"subject"}
              label="Subject"
              placeholder="Subject"
              rules={{ required: "Subject is required" }}
            />

            <InputField
              name={"totalMarks"}
              label="Total Marks"
              type="number"
              placeholder="Total Marks"
              rules={{ required: "Total marks is required" }}
            />

            <InputField
              name={"passingMarks"}
              label="Passing Marks"
              type="number"
              placeholder="Passing Marks"
              rules={{ required: "Passing marks is required" }}
            />

            <InputField
              name={"startTime"}
              label="Start Time"
              type="datetime-local"
              placeholder="Start"
              rules={{ required: "Start time is required" }}
            />

            <InputField
              name={"endTime"}
              label="End Time"
              type="datetime-local"
              placeholder="End"
              rules={{ required: "End time is required" }}
            />
          </div>
        </FormProvider>

        <textarea
          name="description"
          placeholder="Exam Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mt-3 h-20"
        ></textarea>

        <textarea
          name="instructions"
          placeholder="Instructions"
          value={form.instructions}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full mt-2 h-20"
        ></textarea>

        {/* SETTINGS */}
        <div className="flex gap-6 mt-3">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="microphoneRequired"
              checked={form.microphoneRequired}
              onChange={handleChange}
            />
            Microphone Required
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="faceDetectionRequired"
              checked={form.faceDetectionRequired}
              onChange={handleChange}
            />
            Face Detection Required
          </label>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              // Trigger form validation
              const isValid = await methods.trigger();

              if (!isValid) {
                return; // Don't submit if form is invalid
              }

              const values = methods.getValues() as ExamFormOutput;
              onSave({ ...form, ...values });
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPopup;
