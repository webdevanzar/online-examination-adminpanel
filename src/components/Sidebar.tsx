import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h1>

      <nav className="space-y-4 text-gray-700">
        <Link to="/" className="block hover:text-blue-600">Dashboard</Link>
        <Link to="/users" className="block hover:text-blue-600">Users</Link>
        <Link to="/exam" className="block hover:text-blue-600 font-medium">
          Exams
        </Link>
        <Link to="/results" className="block hover:text-blue-600">Results</Link>
        <Link to="/courses" className="block hover:text-blue-600">Courses</Link>
        <Link to="/settings" className="block hover:text-blue-600">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
