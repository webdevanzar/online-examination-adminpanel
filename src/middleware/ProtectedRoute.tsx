import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
