import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// =================== TYPES ===================
export interface ExamAttempt {
  id: string;
  studentId: string;
  examId: string;
  startedAt: Date;
  submittedAt?: Date;
  isSubmitted: boolean;
  score: number;
  student?: {
    id: string;
    fullName: string;
    email: string;
  };
  exam?: {
    id: string;
    title: string;
    totalMarks: number;
  };
}

export interface CheatEventData {
  eventType: string;
  confidence: number;
  screenshot?: string;
}

// =================== QUERY KEYS ===================
export const attemptKeys = {
  all: ["attempts"] as const,
  lists: () => [...attemptKeys.all, "list"] as const,
  list: (filters?: any) => [...attemptKeys.lists(), filters] as const,
  details: () => [...attemptKeys.all, "detail"] as const,
  detail: (id: string) => [...attemptKeys.details(), id] as const,
  byExam: (examId: string) => [...attemptKeys.all, "exam", examId] as const,
  byStudent: (studentId: string) =>
    [...attemptKeys.all, "student", studentId] as const,
};

// =================== GET EXAM ATTEMPTS ===================
const getExamAttemptsApi = async (examId: string) => {
  const res = await axiosInstance.get(`/admin/exams/${examId}/attempts`);
  return res.data as ExamAttempt[];
};

export const useGetExamAttempts = (examId: string) => {
  return useQuery({
    queryKey: attemptKeys.byExam(examId),
    queryFn: () => getExamAttemptsApi(examId),
    enabled: !!examId,
  });
};

// =================== TERMINATE ATTEMPT ===================
const terminateAttemptApi = async (attemptId: string) => {
  const res = await axiosInstance.post(
    `/admin/attempts/${attemptId}/terminate`
  );
  return res.data;
};

export const useTerminateAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: terminateAttemptApi,
    onSuccess: () => {
      toast.success("Attempt terminated successfully");
      queryClient.invalidateQueries({ queryKey: attemptKeys.all });
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

// =================== LOG CHEAT EVENT ===================
const logCheatEventApi = async ({
  attemptId,
  data,
}: {
  attemptId: string;
  data: CheatEventData;
}) => {
  const res = await axiosInstance.post(
    `/admin/attempts/${attemptId}/cheat-events`,
    data
  );
  return res.data;
};

export const useLogCheatEvent = () => {
  return useMutation({
    mutationFn: logCheatEventApi,
    onSuccess: () => {
      toast.success("Cheat event logged successfully");
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
