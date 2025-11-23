import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {/* Common Header */}
        <Header onMenuClick={() => setOpen(true)} />

        {/* Scrollable Outlet Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
