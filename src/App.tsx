import { Route, Routes } from "react-router-dom"
import LoginForm from "./pages/Loginform"
import Signup from "./pages/Signup"
import Dashboard from "./pages/dashboard"
import ExamPage from "./pages/Exampage"
import ResultPage from "./pages/ResultPage"
import UserPage from "./pages/UserPage"
import CoursesPage from "./pages/CoursesPage"

function App() {

  return (
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Signup"element={<Signup />}/>
        <Route path="/exam"element={<ExamPage />}/>
        <Route path="/results"element={<ResultPage/>}/>
        <Route path="/courses"element={<CoursesPage/>}/>
        <Route path="/users" element={<UserPage/>}/>
        
       
      </Routes>
  )
}


export default App