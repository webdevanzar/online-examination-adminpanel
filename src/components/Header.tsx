import { Menu, Search, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogout } from "../services/auth";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface HeaderProps {
  onMenuClick?: () => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  placeholder = "Search...",
  onSearch,
}) => {
  const [value, setValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { fullName, email, profileImage } = useSelector(
    (state: RootState) => state.auth
  );

  const { mutate: logout, isPending } = useAdminLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out");
        navigate("/login");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };
  const handleChange = (v: string) => {
    setValue(v);
    onSearch?.(v);
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm border-b border-gray-200">
      <div className="h-16 px-4 md:px-6 flex justify-between items-center gap-3">
        <button
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 max-w-3xl w-full">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-sm transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 relative" ref={profileRef}>
          <div
            onClick={toggleProfile}
            className="flex items-center rounded-full hover:scale-105 hover:transition-all duration-200 cursor-pointer transition-colors p-1"
          >
            {profileImage ? (
              <img
                title="Profile"
                src={profileImage}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover cursor-pointer sm:ml-2"
              />
            ) : (
              <img
                title="Profile"
                src={"https://ui-avatars.com/api/?name=" + fullName}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover cursor-pointer sm:ml-2"
              />
            )}
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  {profileImage ? (
                    <img
                      title="Profile"
                      src={profileImage}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer sm:ml-2"
                    />
                  ) : (
                    <img
                      title="Profile"
                      src={"https://ui-avatars.com/api/?name=" + fullName}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer sm:ml-2"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{fullName}</h3>
                    <p className="text-sm text-blue-100">{email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={18} className="text-blue-600" />
                  View Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                >
                  <LogOut size={18} className="text-red-600" />
                  {isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
