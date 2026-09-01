import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Users", path: "/admin/users", icon: Users },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-full w-64
        bg-[#153448] text-[#DFD0B8]
        pt-16 border-r border-[#3C5B6F]/40
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <nav className="p-4 space-y-2">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-4 py-3 rounded-lg font-medium
              transition
              ${
                isActive
                  ? "bg-[#3C5B6F] text-white"
                  : "hover:bg-[#3C5B6F]/60"
              }
            `
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
