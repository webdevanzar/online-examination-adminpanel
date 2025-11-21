import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateExamPopup from "../components/CreateExamPopup";

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  score?: string;
}

const Exams: React.FC = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);

  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([
    { id: 1, subject: "Mathematics II", date: "2025-02-10", time: "10:00 AM" },
    { id: 2, subject: "Biology Final", date: "2025-02-14", time: "01:00 PM" },
    { id: 3, subject: "Computer Science Quiz", date: "2025-02-20", time: "09:30 AM" },
  ]);

  const finishedExams: Exam[] = [
    { id: 10, subject: "Physics Internal", date: "2024-12-12", time: "", score: "Published" },
    { id: 11, subject: "Chemistry Quiz", date: "2024-12-18", time: "", score: "Published" },
    { id: 12, subject: "English Midterm", date: "2025-01-05", time: "", score: "Pending" },
  ];

  const handleSaveExam = (newExam: any) => {
    setUpcomingExams((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        subject: newExam.subject,
        date: newExam.exam_start_time,
        time: newExam.exam_start_time,
      },
    ]);
    setShowPopup(false);
  };

  // CORRECT navigation route
  const openAddQuestions = (exam: Exam) => {
    navigate(`/exam/${exam.id}/questions`, { state: exam });
  };

  return (
    <div className="relative min-h-screen p-10 bg bg-linear-to-br from-[#F3E8FF] to-[#E0F2FE] font-body">

      <button
        onClick={() => setShowPopup(true)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg hover:bg-blue-700"
      >
        +
      </button>

      <h1 className="text-4xl font-heading font-bold mb-3 text-gray-800">Exam Schedule</h1>
      <p className="text-gray-600 mb-10 text-lg">View upcoming and completed examinations</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* UPCOMING EXAMS */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-lg font-heading font-semibold mb-5 bg-blue-700 text-white px-4 py-2 rounded-md w-fit">
            Upcoming Exams
          </h2>

          <ul className="space-y-4">
            {upcomingExams.map((exam) => (
              <li
                key={exam.id}
                onClick={() => openAddQuestions(exam)}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm cursor-pointer hover:bg-blue-50 hover:shadow-md transition"
              >
                <p className="text-xl font-semibold text-blue-600 font-heading">{exam.subject}</p>
                <p className="text-gray-600 font-body">Date: {exam.date}</p>
                <p className="text-gray-600 font-body">Time: {exam.time}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* FINISHED EXAMS */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-lg font-heading font-semibold mb-5 bg-green-700 text-white px-4 py-2 rounded-md w-fit">
            Finished Exams
          </h2>

          <ul className="space-y-4">
            {finishedExams.map((exam) => (
              <li
                key={exam.id}
                onClick={() => openAddQuestions(exam)}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm cursor-pointer hover:bg-green-50 hover:shadow-md transition"
              >
                <p className="text-xl font-semibold text-green-600 font-heading">{exam.subject}</p>
                <p className="text-gray-600 font-body">Date: {exam.date}</p>
                <p className="text-gray-600 font-body">Result: <span className="font-semibold">{exam.score}</span></p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showPopup && (
        <CreateExamPopup onClose={() => setShowPopup(false)} onSave={handleSaveExam} />
      )}
    </div>
  );
};

export default Exams;
