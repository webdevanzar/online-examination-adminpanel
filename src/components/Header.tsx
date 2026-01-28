import {
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  Shield,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminLogout } from "../services/auth";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, email, profileImage } = useSelector(
    (state: RootState) => state.auth,
  );

  const { mutate: logout, isPending } = useAdminLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/login");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Determine current page info
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/")
      return { title: "Dashboard", icon: <LayoutDashboard size={18} /> };
    if (path.startsWith("/students"))
      return { title: "Students Management", icon: <Users size={18} /> };
    if (path.startsWith("/exam"))
      return { title: "Exams Control", icon: <FileCheck size={18} /> };
    if (path.startsWith("/results"))
      return { title: "Results Analytics", icon: <BarChart3 size={18} /> };
    if (path.startsWith("/profile"))
      return { title: "Admin Profile", icon: <User size={18} /> };
    return { title: "Admin Panel", icon: <Shield size={18} /> };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="h-20 px-4 md:px-8 flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            aria-label="Open sidebar"
            onClick={onMenuClick}
            className="md:hidden inline-flex items-center justify-center rounded-2xl p-3 bg-white/5 text-white hover:bg-white/10 focus:outline-none transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>

          {/* Dynamic Page Title */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              {pageInfo.icon}
            </div>
            <div>
              <h2 className="text-white font-black text-lg tracking-tight leading-none">
                {pageInfo.title}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Admin Control Center
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative" ref={profileRef}>
          {/* User Info - Desktop */}
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-black text-white leading-none">
              {fullName}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Administrator
            </span>
          </div>

          <div
            onClick={toggleProfile}
            className="group relative flex items-center p-1 rounded-2xl cursor-pointer transition-all duration-300 active:scale-90"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-white transition-all bg-slate-800">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    "https://ui-avatars.com/api/?name=" +
                    (fullName || "Admin") +
                    "&background=0f172a&color=fff"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute right-0 top-20 w-80 bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-50 backdrop-blur-3xl"
              >
                <div className="p-8 bg-linear-to-br from-blue-600 to-indigo-700 text-white relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${fullName}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl leading-tight uppercase tracking-tight">
                        {fullName}
                      </h3>
                      <p className="text-sm font-bold text-white/70 truncate mt-1">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-sm font-black text-slate-300 hover:bg-white/5 hover:text-white rounded-2xl transition-all group"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <User size={20} />
                    </div>
                    Account Profile
                  </button>
                  <div className="mx-4 border-t border-white/5"></div>
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-sm font-black text-slate-300 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all group"
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                  >
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <LogOut size={20} />
                    </div>
                    {isPending ? "Signing out..." : "Log Out"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
