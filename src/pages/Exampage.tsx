export default function ExamPage() {
  // Demo exam data — you can replace with API data later
  const upcomingExams = [
    { subject: "Mathematics II", date: "2025-02-10", time: "10:00 AM" },
    { subject: "Biology Final", date: "2025-02-14", time: "01:00 PM" },
    { subject: "Computer Science Quiz", date: "2025-02-20", time: "09:30 AM" },
  ];

  const finishedExams = [
    { subject: "Physics Internal", date: "2024-12-12", score: "Published" },
    { subject: "Chemistry Quiz", date: "2024-12-18", score: "Published" },
    { subject: "English Midterm", date: "2025-01-05", score: "Pending" },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Exam Schedule</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upcoming Exams</h2>

          <ul className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <li key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                <p className="text-lg font-semibold text-blue-600">{exam.subject}</p>
                <p className="text-gray-600">Date: {exam.date}</p>
                <p className="text-gray-600">Time: {exam.time}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Finished Exams */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Finished Exams</h2>

          <ul className="space-y-4">
            {finishedExams.map((exam, index) => (
              <li key={index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                <p className="text-lg font-semibold text-green-600">{exam.subject}</p>
                <p className="text-gray-600">Date: {exam.date}</p>
                <p className="text-gray-600">
                  Result: <span className="font-medium">{exam.score}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
