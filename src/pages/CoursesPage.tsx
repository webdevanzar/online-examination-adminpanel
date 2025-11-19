export default function CoursesPage() {
  const courses = [
    {
      title: "Mathematics",
      description: "Covers Algebra, Geometry, Calculus, and Trigonometry.",
      teacher: "Dr. Amelia Johnson",
      duration: "6 Months",
    },
    {
      title: "Physics",
      description: "Learn mechanics, waves, electricity, and modern physics.",
      teacher: "Prof. David Miller",
      duration: "4 Months",
    },
    {
      title: "Chemistry",
      description: "Covers organic, inorganic, and physical chemistry.",
      teacher: "Dr. Sarah Collins",
      duration: "5 Months",
    },
    {
      title: "Computer Science",
      description: "Covers programming, data structures, and algorithms.",
      teacher: "Mr. Jason Carter",
      duration: "6 Months",
    },
    {
      title: "Biology",
      description: "Learn human anatomy, cells, genetics, and ecosystems.",
      teacher: "Dr. Olivia Brown",
      duration: "4 Months",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h2 className="text-3xl font-semibold mb-6">Available Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">{course.title}</h3>
            <p className="text-gray-700 mb-3">{course.description}</p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Instructor:</span> {course.teacher}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">Duration:</span> {course.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
