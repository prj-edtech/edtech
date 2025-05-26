import { useState } from "react";
import { Outlet } from "react-router-dom";
import ReviewerNavbar from "./ReviewerNavbar";
import ReviewerSidebar from "./ReviewerSidebar";

const ReviewerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <ReviewerNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <ReviewerSidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReviewerLayout;
