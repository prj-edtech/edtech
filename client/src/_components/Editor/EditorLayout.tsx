import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import EditorSidebar from "./EditorSidebar";
import EditorNavbar from "./EditorNavbar";

const EditorLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <EditorNavbar />
        <main className="flex-1 p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
