import z from "zod";
import { QuestionType } from "../types";

const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(32, "Must be at most 32 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/\d/, "Must include a number")
  .transform((password) => password.trim());

//register schema for admin
export const AdminRegisterSchema = z.object({
  fullName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email({ message: "Invalid email address" }),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});
export type AdminRegisterSchemaType = z.infer<typeof AdminRegisterSchema>;
export const UpdateAdminSchema = AdminRegisterSchema.partial();
export type UpdateAdminSchemaType = z.infer<typeof UpdateAdminSchema>;

//login schema for admin
export const AdminLoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});
export type AdminLoginSchemaType = z.infer<typeof AdminLoginSchema>;

//create exam schema
export const CreateExamSchema = z
  .object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(5, "Description is required"),
    subject: z.string().min(2, "Subject is required"),
    instructions: z.string().optional(),

    startTime: z.coerce.date(),
    endTime: z.coerce.date(),

    totalMarks: z.number().min(1),
    passingMarks: z.number().min(0),

    microphoneRequired: z.boolean().optional().default(false),
    faceDetectionRequired: z.boolean().optional().default(true),

    questionCount: z.number().min(0).default(0),

    isActive: z.boolean().optional().default(true),
    isPublished: z.boolean().optional().default(false),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => data.passingMarks <= data.totalMarks, {
    message: "Passing marks cannot exceed total marks",
    path: ["passingMarks"],
  });
export type CreateExamSchemaType = z.infer<typeof CreateExamSchema>;

//update exam schema
export const UpdateExamSchema = CreateExamSchema.partial();
export type UpdateExamSchemaType = z.infer<typeof UpdateExamSchema>;

// ---------- OPTION SCHEMA ----------
export const OptionSchema = z.object({
  optionText: z.string().min(1, "Option text required"),
  isCorrect: z.boolean(),
});

// ---------- CREATE QUESTION ----------
export const CreateQuestionSchema = z
  .object({
    type: z.enum(QuestionType.map((type) => type.id)),

    questionText: z.string().min(5),

    marks: z.number().min(0.1).default(1),

    hasMultipleCorrect: z.boolean().optional().default(false),

    // Typing (optional)
    answerMinLength: z.number().optional(),
    answerMaxLength: z.number().optional(),

    // MCQ OPTIONS (optional but required if type=mcq)
    options: z.array(OptionSchema).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.type === "mcq") {
        return (
          data.options &&
          data.options.length > 0 &&
          data.options.some((opt) => opt.isCorrect)
        );
      }
      return true;
    },
    {
      message: "MCQ questions must have at least one correct option",
      path: ["options"],
    }
  );

export type CreateQuestionSchemaType = z.infer<typeof CreateQuestionSchema>;

// ---------- UPDATE QUESTION (PARTIAL) ----------
export const UpdateQuestionSchema = CreateQuestionSchema.partial();
export type UpdateQuestionSchemaType = z.infer<typeof UpdateQuestionSchema>;

// ---------- PASSWORD CHANGE SCHEMA ----------
export const PasswordChangeSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
export type PasswordChangeSchemaType = z.infer<typeof PasswordChangeSchema>;

// ---------- LOG CHEAT EVENT ----------
export const LogCheatEventSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  confidence: z.number().min(0).max(1, "Confidence must be between 0 and 1"),
  screenshot: z.string().optional(),
});
export type LogCheatEventSchemaType = z.infer<typeof LogCheatEventSchema>;
