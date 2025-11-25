import { Menu, Search, UserCircle2, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogout } from "../services/auth";
import { toast } from "sonner";

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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-sm border-b">
      <div className="h-16 px-4 md:px-6 flex justify-between items-center gap-3">
        <button
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1 max-w-2xl w-full">
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 relative" ref={profileRef}>
          <div
            onClick={toggleProfile}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
              <UserCircle2 size={24} />
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-4 bg-linear-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">John Doe</h3>
                    <p className="text-sm text-blue-100">john@example.com</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={18} className="text-blue-500" />
                  View Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors"
                  onClick={() => {
                    handleLogout();
                    setIsProfileOpen(false);
                  }}
                >
                  <LogOut size={18} className="text-red-500" />
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
