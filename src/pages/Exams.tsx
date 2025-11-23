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
    <div className="relative min-h-screen p-6 md:p-10 bg-gray-50">

      <button
        onClick={() => setShowPopup(true)}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center shadow hover:bg-blue-700"
        aria-label="Create Exam"
      >
        +
      </button>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Exam Schedule</h1>
      <p className="text-gray-600 mb-8">View upcoming and completed examinations</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* UPCOMING EXAMS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-5">Upcoming Exams</h2>

          <ul className="space-y-4">
            {upcomingExams.map((exam) => (
              <li
                key={exam.id}
                onClick={() => openAddQuestions(exam)}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm cursor-pointer hover:bg-blue-50 hover:shadow transition"
              >
                <p className="text-lg md:text-xl font-semibold text-blue-600">{exam.subject}</p>
                <p className="text-gray-600">Date: {exam.date}</p>
                <p className="text-gray-600">Time: {exam.time}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* FINISHED EXAMS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-5">Finished Exams</h2>

          <ul className="space-y-4">
            {finishedExams.map((exam) => (
              <li
                key={exam.id}
                onClick={() => openAddQuestions(exam)}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm cursor-pointer hover:bg-gray-50 hover:shadow transition"
              >
                <p className="text-lg md:text-xl font-semibold text-gray-800">{exam.subject}</p>
                <p className="text-gray-600">Date: {exam.date}</p>
                <p className="text-gray-600">Result: <span className="font-semibold">{exam.score}</span></p>
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
