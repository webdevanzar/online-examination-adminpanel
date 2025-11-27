import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// =================== TYPES ===================
export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructions?: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  microphoneRequired: boolean;
  faceDetectionRequired: boolean;
  questionCount: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExamData {
  title: string;
  description: string;
  subject: string;
  instructions?: string;
  startTime: Date | string;
  endTime: Date | string;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  microphoneRequired?: boolean;
  faceDetectionRequired?: boolean;
  questionCount?: number;
  isActive?: boolean;
  isPublished?: boolean;
}

export type UpdateExamData = Partial<CreateExamData>;

export interface Option {
  id?: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: "mcq" | "typing";
  questionText: string;
  marks: number;
  hasMultipleCorrect?: boolean;
  answerMinLength?: number;
  answerMaxLength?: number;
  options?: Option[];
}

// =================== QUERY KEYS ===================
export const examKeys = {
  all: ["exams"] as const,
  lists: () => [...examKeys.all, "list"] as const,
  list: (filters?: any) => [...examKeys.lists(), filters] as const,
  details: () => [...examKeys.all, "detail"] as const,
  detail: (id: string) => [...examKeys.details(), id] as const,
  questions: (examId: string) =>
    [...examKeys.detail(examId), "questions"] as const,
};

// =================== CREATE EXAM ===================
const createExamApi = async (data: CreateExamData) => {
  const res = await axiosInstance.post("/admin/exams", data);
  return res.data;
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExamApi,
    onSuccess: () => {
      toast.success("Exam created successfully");
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg, {
        duration: 1500,
        style: {
          background: "#FEE2E2",
          color: "#B91C1C",
          border: "1px solid #FCA5A5",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    },
  });
};

// =================== GET ALL EXAMS ===================
const getExamsApi = async () => {
  const res = await axiosInstance.get("/admin/exams");
  return res.data as Exam[];
};

export const useGetAllExams = () => {
  return useQuery({
    queryKey: examKeys.lists(),
    queryFn: getExamsApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =================== GET SINGLE EXAM ===================
const getExamByIdApi = async (examId: string) => {
  const res = await axiosInstance.get(`/admin/exams/${examId}`);
  return res.data as Exam;
};

export const useGetExamById = (examId: string) => {
  return useQuery({
    queryKey: examKeys.detail(examId),
    queryFn: () => getExamByIdApi(examId),
    enabled: !!examId,
  });
};

// =================== UPDATE EXAM ===================
const updateExamApi = async ({
  examId,
  data,
}: {
  examId: string;
  data: UpdateExamData;
}) => {
  const res = await axiosInstance.put(`/admin/exams/${examId}`, data);
  return res.data;
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExamApi,
    onSuccess: (_, variables) => {
      toast.success("Exam updated successfully");
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: examKeys.detail(variables.examId),
      });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg, {
        duration: 1500,
        style: {
          background: "#FEE2E2",
          color: "#B91C1C",
          border: "1px solid #FCA5A5",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    },
  });
};

// =================== DELETE EXAM ===================
const deleteExamApi = async (examId: string) => {
  const res = await axiosInstance.delete(`/admin/exams/${examId}`);
  return res.data;
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExamApi,
    onSuccess: () => {
      toast.success("Exam deleted successfully");
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg, {
        duration: 1500,
        style: {
          background: "#FEE2E2",
          color: "#B91C1C",
          border: "1px solid #FCA5A5",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
        },
      });
    },
  });
};

// =================== GET EXAM QUESTIONS ===================
const getExamQuestionsApi = async (examId: string) => {
  const res = await axiosInstance.get(`/admin/exams/${examId}/questions`);
  return res.data.questions as Question[];
};

export const useGetExamQuestions = (examId: string) => {
  return useQuery({
    queryKey: examKeys.questions(examId),
    queryFn: () => getExamQuestionsApi(examId),
    enabled: !!examId,
  });
};
