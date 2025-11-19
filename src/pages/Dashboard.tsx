import { CheckCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";


export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Overview</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-lg bg-white shadow"
            />
            <div className="w-10 h-10 rounded-full bg-blue-500"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600">TOTAL STUDENTS</p>
            <h3 className="text-3xl font-bold">12,500</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600">TOTAL EXAMS</p>
            <h3 className="text-3xl font-bold">450</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-gray-600">EXAMS IN PROGRESS</p>
            <h3 className="text-3xl font-bold">15</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-4">Recent Activities</h4>

            <ul className="space-y-3 text-gray-700">

              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={20} />
                John Doe started \"Calculus History Final\"
              </li>

              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={20} />
                New exam \"Physics II\" created by Admin
              </li>

              <li className="flex items-center gap-3">
                <CheckCircle className="text-blue-600" size={20} />
                Result for \"Chemistry Quiz\" released
              </li>

            </ul>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold mb-4">Upcoming Exams</h4>

            <ul className="space-y-4 text-gray-700">

              <li>
                <p className="font-medium">Algebra II Quiz</p>
                <p className="text-sm text-gray-500">Oct 15, 2023</p>
              </li>

              <li>
                <p className="font-medium">Biology Final</p>
                <p className="text-sm text-gray-500">Dec 15, 2023</p>
              </li>

            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
