import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import ReviewerSidebar from "./ReviewerSidebar";
import ReviewerNavbar from "./ReviewerNavbar";

const ReviewerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <ReviewerSidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <ReviewerNavbar />
        <main className="flex-1 p-6">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default ReviewerLayout;
