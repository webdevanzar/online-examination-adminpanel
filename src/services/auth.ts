import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { axiosInstance } from "../utils/intercepotor";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  loginSuccess,
  logoutSuccess,
  updateProfile,
} from "../store/slice/authSlice";

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
      console.log("Admin Login Successful");
    },
    onError: (err) => {
      console.log("Admin Login Failed", err);
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
      console.log("Admin Logged Out");
    },
    onError: (err) => {
      console.log("Logout failed", err);
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
    onSuccess: (data) => {
      console.log("Admin Registered Successfully", data);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err) => {
      console.log("Admin Registration Failed", err);
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
    onError: (err) => {
      console.log("Profile update failed", err);
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
    onError: (err) => {
      console.log("Image delete failed", err);
    },
  });
};
