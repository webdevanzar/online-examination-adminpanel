import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileCheck, BarChart3, X } from "lucide-react";

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { name: "Students", icon: <Users size={20} />, path: "/students" },
    { name: "Exams", icon: <FileCheck size={20} />, path: "/exam" },
    { name: "Results", icon: <BarChart3 size={20} />, path: "/results" },
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
          fixed md:static top-0 left-0 h-full w-72 bg-slate-900 text-slate-300 shadow-2xl p-6 z-50 border-r border-slate-800
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close Button (mobile) */}
        <div className="flex justify-between items-center md:hidden mb-8">
          <h1 className="text-xl font-bold text-white tracking-tight">Menu</h1>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="mb-12 px-2 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                EXAM<span className="text-blue-500">HUB</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Admin Control
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 font-semibold shadow-inner"
                    : "hover:bg-slate-800/50 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`transition-colors ${
                      isActive
                        ? "text-blue-500"
                        : "text-slate-500 group-hover:text-blue-400"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.name}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="p-4 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-slate-800/50 shadow-lg">
            <p className="text-xs font-medium text-slate-400 mb-2 italic">
              Integrity & Excellence
            </p>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
