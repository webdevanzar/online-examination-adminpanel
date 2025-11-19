import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {/* Top bar (mobile only) */}
        <div className="md:hidden flex items-center px-4 py-3 bg-white shadow">
          <button onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
          <h2 className="text-xl font-semibold ml-4">Admin Panel</h2>
        </div>

        {/* Scrollable Outlet Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
