import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputField } from "./InputField";
import Modal from "./Modal";
import { BookOpen, Clock, Award } from "lucide-react";

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
  questionText: string;
  marks: string | number;
  type: string;
  hasMultipleCorrect: boolean;
  answerMinLength: string | number;
  answerMaxLength: string | number;
  options: { text: string; isCorrect: boolean }[];
}

const CreateExamPopup = ({ onClose, onSave }: CreateExamPopupProps) => {
  const [form] = useState({
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
    .refine((v) => new Date(v.endTime) > new Date(v.startTime), {
      path: ["endTime"],
      message: "End time must be after start time",
    })
    .refine((v) => v.passingMarks <= v.totalMarks, {
      path: ["passingMarks"],
      message: "Passing marks cannot be greater than total marks",
    });

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
    <Modal isOpen={true} onClose={onClose} title="Create Exam" size="lg">
      <div className="space-y-8">
        <FormProvider {...methods}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <BookOpen size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                Basic Configuration
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Define exam metadata and schedule
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name={"title"}
              label="Exam Title"
              placeholder="Ex: Midterm Biology 2024"
              rules={{ required: "Title is required" }}
            />

            <InputField
              name={"subject"}
              label="Subject / Category"
              placeholder="Ex: Molecular Biology"
              rules={{ required: "Subject is required" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Clock size={18} className="text-blue-600" />
                Schedule
              </div>
              <InputField
                name={"startTime"}
                label="Start Date & Time"
                type="datetime-local"
                rules={{ required: "Start time is required" }}
              />
              <InputField
                name={"endTime"}
                label="End Date & Time"
                type="datetime-local"
                rules={{ required: "End time is required" }}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Award size={18} className="text-emerald-600" />
                Grading
              </div>
              <InputField
                name={"totalMarks"}
                label="Total Possible Marks"
                type="number"
                placeholder="100"
                rules={{ required: "Total marks is required" }}
              />
              <InputField
                name={"passingMarks"}
                label="Required to Pass"
                type="number"
                placeholder="40"
                rules={{ required: "Passing marks is required" }}
              />
            </div>
          </div>

          {/* <div className="flex items-center gap-4 mt-8 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
              <GraduationCap size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 leading-tight">
                Exam Content
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Optional additional information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                General Description
              </label>
              <textarea
                {...methods.register("description")}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                rows={3}
                placeholder="A brief overview of the exam topic..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Candidate Instructions
              </label>
              <textarea
                {...methods.register("instructions")}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                rows={3}
                placeholder="Instructions for students (proctoring rules, etc)..."
              />
            </div>
          </div> */}

          <div className="flex justify-stretch gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                const isValid = await methods.trigger();
                if (!isValid) return;
                const values = methods.getValues() as ExamFormOutput;
                onSave({ ...form, ...values });
              }}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Create Exam
            </button>
          </div>
        </FormProvider>
      </div>
    </Modal>
  );
};

export default CreateExamPopup;
