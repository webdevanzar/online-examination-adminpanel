import axios from "axios";
import { store } from "../store";
import { logoutSuccess } from "../store/slice/authSlice";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://webcams-cruz-involve-winners.trycloudflare.com/api",
  withCredentials: true, //  for sending cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - maybe token expired");
      store.dispatch(logoutSuccess());

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
