import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#153448] border-b border-[#3C5B6F]/40 flex items-center px-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-[#DFD0B8]"
        >
          <Menu size={22} />
        </button>

        <h1
          onClick={() => navigate("/admin/dashboard")}
          className="cursor-pointer font-extrabold tracking-wider text-white"
        >
          BOOK<span className="text-[#948979]">-TALES</span>
          <span className="ml-2 text-xs bg-[#3C5B6F] px-2 py-1 rounded">
            ADMIN
          </span>
        </h1>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-4">
        <span className="hidden sm:block text-sm text-[#DFD0B8]">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-[#3C5B6F] text-[#DFD0B8]"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
