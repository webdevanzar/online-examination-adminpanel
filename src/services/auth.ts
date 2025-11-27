import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { axiosInstance } from "../utils/intercepotor";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  loginSuccess,
  logoutSuccess,
  updateProfile,
} from "../store/slice/authSlice";
import type { AxiosError } from "axios";

// =================== TYPES ===================
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

// =================== LOGIN ===================
const loginAdminApi = async (data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) => {
  const res = await axiosInstance.post("/admin/login", data);
  return res.data as AdminLoginResponse;
};

export const useAdminLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: loginAdminApi,
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      toast.success("Logged in successfully");
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

// =================== LOGOUT ===================
const logoutAdminApi = async () => {
  const res = await axiosInstance.post("/admin/logout");
  return res.data;
};

export const useAdminLogout = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: logoutAdminApi,
    onSuccess: () => {
      dispatch(logoutSuccess());
      toast.success("Logged out");
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

// =================== REGISTER ===================
const registerAdminApi = async (formData: FormData) => {
  const res = await axiosInstance.post("/admin/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const useAdminRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAdminApi,
    onSuccess: () => {
      toast.success("Admin registered successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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

// =================== UPDATE PROFILE ===================
const updateAdminProfileApi = async (formData: FormData) => {
  const res = await axiosInstance.put("/admin/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const useAdminProfileUpdate = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: updateAdminProfileApi,
    onSuccess: (data) => {
      console.log("Admin Profile Updated");

      dispatch(updateProfile(data.user));
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

// =================== ADD PROFILE IMAGE ===================
const addAdminProfileImageApi = async (formData: FormData) => {
  const res = await axiosInstance.put("/admin/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const useAddAdminProfileImage = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: addAdminProfileImageApi,
    onSuccess: (data) => {
      console.log("Profile Image Uploaded");
      dispatch(updateProfile(data.user));
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

// =================== DELETE PROFILE IMAGE ===================
const deleteAdminProfileImageApi = async () => {
  const res = await axiosInstance.delete("/admin/profile-image");
  return res.data;
};

export const useDeleteAdminProfileImage = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: deleteAdminProfileImageApi,
    onSuccess: (data) => {
      console.log("Profile Image Deleted");
      dispatch(updateProfile(data.user));
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
