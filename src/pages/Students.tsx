export const Students = () => {
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 987 654 3210",
    address: "New York, USA",
    joined: "2021",
    courses: [
      { course: "Mathematics", year: "2022", status: "Completed" },
      { course: "Computer Science", year: "2023", status: "Completed" },
      { course: "Physics", year: "2023", status: "In Progress" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-semibold mb-6">User Profile</h2>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-2xl font-bold text-blue-600 mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {user.address}
          </p>
          <p>
            <span className="font-semibold">Joined:</span> {user.joined}
          </p>
        </div>
      </div>

      {/* Courses Card */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-blue-600 mb-4">
          Course History
        </h3>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-sm">Course Name</th>
              <th className="p-3 text-sm">Year</th>
              <th className="p-3 text-sm">Status</th>
            </tr>
          </thead>

          <tbody>
            {user.courses.map((c, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition">
                <td className="p-3">{c.course}</td>
                <td className="p-3">{c.year}</td>
                <td className="p-3 font-semibold text-gray-700">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
