import { Route, Routes } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Results } from "./pages/Results";
import { Courses } from "./pages/Courses";
import { Students } from "./pages/Students";
import Layout from "./layouts/Layout";
import Exams from "./pages/Exams";
import AddQuestionsPage from "./pages/AddQuestionsPage";

function App() {
  return (
    <Routes>
      {/* Auth Pages (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout */}
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/exam" element={<Exams />} />
        <Route path="/exam/:examid" element={<AddQuestionsPage />} />

        
        <Route path="/results" element={<Results />} />
        <Route path="/courses" element={<Courses />} />
      </Route>
    </Routes>
  );
}

export default App;
