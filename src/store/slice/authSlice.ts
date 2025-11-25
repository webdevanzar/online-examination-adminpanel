import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser } from "../../services/auth";

interface AuthState {
  isAuthenticated: boolean;
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const initialState: AuthState = {
  isAuthenticated: false,
  id: "",
  fullName: "",
  email: "",
  profileImage: undefined,
  isActive: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<AdminUser>
    ) => {
      const user = action.payload;
      state.isAuthenticated = true;
      state.id = user.id;
      state.fullName = user.fullName;
      state.email = user.email;
      state.profileImage = user.profileImage ?? "";
      state.isActive = user.isActive;
      state.createdAt = new Date(user.createdAt ?? new Date());
      state.updatedAt = new Date(user.updatedAt ?? new Date());
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.id = "";
      state.fullName = "";
      state.email = "";
      state.profileImage = undefined;
      state.isActive = false;
      state.createdAt = new Date();
      state.updatedAt = new Date();
    },
    updateProfile: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export default authSlice.reducer;
export const { loginSuccess, logoutSuccess, updateProfile } = authSlice.actions;
