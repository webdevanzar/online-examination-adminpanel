import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";
import { examKeys } from "./exam";
import { toast } from "sonner";
import type { AxiosError } from "axios";

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
  const res = await axiosInstance.post<CreateQuestionResponse>(
    `/admin/exams/${examId}/questions`,
    data
  );
  return res.data;
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuestionApi,
    onSuccess: (_data, variables) => {
      toast.success("Question created successfully");
      queryClient.invalidateQueries({
        queryKey: examKeys.questions(variables.examId),
      });
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

// =================== UPDATE QUESTION ===================
const updateQuestionApi = async ({
  questionId,
  data,
}: {
  questionId: string;
  data: UpdateQuestionData;
}) => {
  const res = await axiosInstance.put<UpdateQuestionResponse>(
    `/admin/questions/${questionId}`,
    data
  );
  return res.data;
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuestionApi,
    onSuccess: () => {
      toast.success("Question updated successfully");
      // Invalidate all exam queries as we don't know which exam this question belongs to
      queryClient.invalidateQueries({ queryKey: examKeys.all });
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
    onSuccess: (_data, variables) => {
      toast.success(`Created ${variables.questions.length} questions`);
      queryClient.invalidateQueries({
        queryKey: examKeys.questions(variables.examId),
      });
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
