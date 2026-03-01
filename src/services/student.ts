import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";
import { toast } from "sonner";

// =================== TYPES ===================
export interface Student {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  dob?: Date;
  gender?: string;
  selfieVideo?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStudentData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: "male" | "female" | "other";
  dob?: Date;
  isActive?: boolean;
}

export interface ResetPasswordData {
  newPassword: string;
}

// =================== QUERY KEYS ===================
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters?: unknown) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

// =================== GET ALL STUDENTS ===================
const getStudentsApi = async () => {
  const res = await axiosInstance.get("/admin/students");
  return res.data as Student[];
};

export const useGetAllStudents = () => {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudentsApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// =================== GET SINGLE STUDENT ===================
const getStudentByIdApi = async (studentId: string) => {
  const res = await axiosInstance.get(`/admin/students/${studentId}`);
  return res.data as Student;
};

export const useGetStudentById = (studentId: string) => {
  return useQuery({
    queryKey: studentKeys.detail(studentId),
    queryFn: () => getStudentByIdApi(studentId),
    enabled: !!studentId,
  });
};

// =================== UPDATE STUDENT ===================
const updateStudentApi = async ({
  studentId,
  data,
}: {
  studentId: string;
  data: UpdateStudentData;
}) => {
  const res = await axiosInstance.put(`/admin/students/${studentId}`, data);
  return res.data;
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentApi,
    onSuccess: () => {
      toast.success("Student updated successfully");
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
    onError: () => {
      
    },
  });
};

// =================== DELETE STUDENT ===================
const deleteStudentApi = async (studentId: string) => {
  const res = await axiosInstance.delete(`/admin/students/${studentId}`);
  return res.data;
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
    onError: () => {
    
    },
  });
};

// =================== Activate STUDENT ===================


// =================== RESET STUDENT PASSWORD ===================
const resetStudentPasswordApi = async ({
  studentId,
  data,
}: {
  studentId: string;
  data: ResetPasswordData;
}) => {
  const res = await axiosInstance.post(
    `/admin/students/${studentId}/reset-password`,
    data
  );
  return res.data;
};

export const useResetStudentPassword = () => {
  return useMutation({
    mutationFn: resetStudentPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: () => {
      
    },
  });
};
