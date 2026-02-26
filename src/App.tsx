import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Results } from "./pages/Results";
import { Students } from "./pages/Students";
import Layout from "./layouts/Layout";
import Exams from "./pages/Exams";
import AddQuestionsPage from "./pages/AddQuestionsPage";
import ProfilePage from "./pages/profile";
import { ProtectedRouteAfterLogin } from "./middleware/ProtectedRouteAfterLogin";
import { ProtectedRoute } from "./middleware/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (no layout) */}
        <Route element={<ProtectedRouteAfterLogin />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/exam" element={<Exams />} />
            <Route
              path="/exam/:examid/questions"
              element={<AddQuestionsPage />}
            />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
