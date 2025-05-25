import { ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";

const EditorLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <EditorNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <EditorSidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto ml-64">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
