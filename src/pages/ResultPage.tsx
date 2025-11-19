export default function ResultPage() {
  // Example data (you can replace with API data)
  const results = [
    { name: "John Doe", score: 85, status: "Pass" },
    { name: "Emma Watson", score: 92, status: "Pass" },
    { name: "Liam Carter", score: 42, status: "Fail" },
    { name: "Sophia Taylor", score: 30, status: "Fail" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-semibold mb-6">Exam Results</h2>

      <div className="bg-white rounded-xl shadow-md p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-sm">Student Name</th>
              <th className="p-3 text-sm">Score</th>
              <th className="p-3 text-sm">Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((student, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3">{student.score}</td>

                {/* IF FAIL → RED TEXT | IF PASS → GREEN TEXT */}
                <td
                  className={`p-3 font-semibold ${
                    student.status === "Fail" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {student.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
