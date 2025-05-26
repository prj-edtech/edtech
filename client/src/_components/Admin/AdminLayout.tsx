import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <AdminSidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
