import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* <AdminSidebar /> */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
