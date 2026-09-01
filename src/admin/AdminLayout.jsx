import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#DFD0B8]">
      <AdminNavbar onToggleSidebar={() => setOpen(!open)} />

      <div className="flex pt-16">
        <AdminSidebar isOpen={open} onClose={() => setOpen(false)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
