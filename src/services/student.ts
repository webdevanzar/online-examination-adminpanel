import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/intercepotor";

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
  createdAt: string;
  updatedAt: string;
}

// =================== QUERY KEYS ===================
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (filters?: any) => [...studentKeys.lists(), filters] as const,
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
