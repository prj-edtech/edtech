import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-64">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
