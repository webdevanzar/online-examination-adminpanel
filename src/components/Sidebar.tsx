import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  BookOpen,
  X
} from "lucide-react";

const Sidebar = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Students", icon: <Users size={20} />, path: "/students" },
    { name: "Exams", icon: <FileCheck size={20} />, path: "/exam" },
    { name: "Results", icon: <BarChart3 size={20} />, path: "/results" },
    { name: "Courses", icon: <BookOpen size={20} />, path: "/courses" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close Button (mobile) */}
        <div className="flex justify-between items-center md:hidden mb-6">
          <h1 className="text-xl font-bold text-blue-600">Menu</h1>
          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* Logo */}
        <h1 className="text-3xl font-bold mb-10 text-blue-600 hidden md:block">
          Admin Panel
        </h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all 
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
