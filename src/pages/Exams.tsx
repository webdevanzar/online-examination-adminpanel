

const Exams = () => {
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
    <div className="min-h-screen p-10 bg bg-linear-to-br from-[#F3E8FF] to-[#E0F2FE] font-body">

      <h1 className="text-4xl font-heading font-bold mb-3 text-gray-800">
        Exam Schedule
      </h1>
      <p className="text-gray-600 mb-10 text-lg">
        View upcoming and completed examinations
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* UPCOMING EXAMS */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-lg font-heading font-semibold mb-5 
            bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white 
            px-4 py-2 rounded-md w-fit">
            Upcoming Exams
          </h2>

          <ul className="space-y-4">
            {upcomingExams.map((exam, index) => (
              <li key={index}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm">
                
                <p className="text-xl font-semibold text-blue-600 font-heading">
                  {exam.subject}
                </p>
                <p className="text-gray-600 font-body">Date: {exam.date}</p>
                <p className="text-gray-600 font-body">Time: {exam.time}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* FINISHED EXAMS */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-lg font-heading font-semibold mb-5 
            bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white 
            px-4 py-2 rounded-md w-fit">
            Finished Exams
          </h2>

          <ul className="space-y-4">
            {finishedExams.map((exam, index) => (
              <li key={index}
                className="border border-gray-200 rounded-xl p-4 bg-[#F9FAFB] shadow-sm">
                
                <p className="text-xl font-semibold text-green-600 font-heading">
                  {exam.subject}
                </p>
                <p className="text-gray-600 font-body">Date: {exam.date}</p>
                <p className="text-gray-600 font-body">
                  Result: <span className="font-semibold">{exam.score}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Exams;
