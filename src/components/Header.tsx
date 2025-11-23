import { Menu, Search, UserCircle2 } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, placeholder = "Search...", onSearch }) => {
  const [value, setValue] = useState("");

  const handleChange = (v: string) => {
    setValue(v);
    onSearch?.(v);
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              type="text"
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            <UserCircle2 />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
