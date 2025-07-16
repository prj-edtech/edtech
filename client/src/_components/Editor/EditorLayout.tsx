import { useState } from "react";
import { Outlet } from "react-router-dom";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";
import EditorMobileNavbar from "./EditorMobileNavbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col lg:min-h-screen">
      <EditorNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* For mobile only */}
      <EditorMobileNavbar />
      <div className="flex flex-1">
        <EditorSidebar isOpen={isSidebarOpen} />
        <main className="flex-1 lg:p-6 overflow-y-auto lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
