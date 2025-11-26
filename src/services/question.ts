import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";
import { toast } from "sonner";
import { examKeys } from "./exam";

// =================== TYPES ===================
export interface OptionData {
  optionText: string;
  isCorrect: boolean;
}

export interface CreateQuestionData {
  type: "mcq" | "typing";
  questionText: string;
  marks: number;
  hasMultipleCorrect?: boolean;
  answerMinLength?: number;
  answerMaxLength?: number;
  options?: OptionData[];
}

export type UpdateQuestionData = Partial<CreateQuestionData>;

// API Response Types
export interface CreateQuestionResponse {
  message: string;
  questionId: string;
  currentTotalMarks: number;
  examTotalMarks: number;
  remainingMarks: number;
}

export interface UpdateQuestionResponse {
  message: string;
  currentTotalMarks: number;
  examTotalMarks: number;
  remainingMarks: number;
}

// =================== CREATE QUESTION ===================
const createQuestionApi = async ({
  examId,
  data,
}: {
  examId: string;
  data: CreateQuestionData;
}) => {
  const res = await axiosInstance.post<CreateQuestionResponse>(`/admin/exams/${examId}/questions`, data);
  return res.data;
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionApi,
    onSuccess: (data, variables) => {
      toast.success(`Question created successfully. Remaining marks: ${data.remainingMarks}/${data.examTotalMarks}`);
      queryClient.invalidateQueries({ queryKey: examKeys.questions(variables.examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.examId) });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Failed to create question";
      toast.error(errorMessage);
      console.error("Create question failed:", err);
    },
  });
};

// =================== UPDATE QUESTION ===================
const updateQuestionApi = async ({
  questionId,
  data,
}: {
  questionId: string;
  data: UpdateQuestionData;
}) => {
  const res = await axiosInstance.put<UpdateQuestionResponse>(`/admin/questions/${questionId}`, data);
  return res.data;
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionApi,
    onSuccess: (data) => {
      toast.success(`Question updated successfully. Remaining marks: ${data.remainingMarks}/${data.examTotalMarks}`);
      // Invalidate all exam queries as we don't know which exam this question belongs to
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Failed to update question";
      toast.error(errorMessage);
      console.error("Update question failed:", err);
    },
  });
};

// =================== DELETE QUESTION ===================
const deleteQuestionApi = async (questionId: string) => {
  const res = await axiosInstance.delete(`/admin/questions/${questionId}`);
  return res.data;
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      toast.success("Question deleted successfully");
      // Invalidate all exam queries as we don't know which exam this question belongs to
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Failed to delete question";
      toast.error(errorMessage);
      console.error("Delete question failed:", err);
    },
  });
};

// =================== BULK CREATE QUESTIONS ===================
const bulkCreateQuestionsApi = async ({
  examId,
  questions,
}: {
  examId: string;
  questions: CreateQuestionData[];
}) => {
  // Create questions one by one (could be optimized with a bulk API endpoint)
  const promises = questions.map((question) =>
    axiosInstance.post(`/admin/exams/${examId}/questions`, question)
  );
  const results = await Promise.all(promises);
  return results.map((r) => r.data);
};

export const useBulkCreateQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreateQuestionsApi,
    onSuccess: (_, variables) => {
      toast.success(`${variables.questions.length} questions created successfully`);
      queryClient.invalidateQueries({ queryKey: examKeys.questions(variables.examId) });
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.examId) });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || "Failed to create questions";
      toast.error(errorMessage);
      console.error("Bulk create questions failed:", err);
    },
  });
};
