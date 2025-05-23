import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "../_components/Unauthorized";
import AdminDashboard from "../_components/Admin/AdminDashboard";
import EditorDashboard from "../_components/Editor/EditorDashboard";
import { Navigate } from "react-router-dom";
import ReviewerDashboard from "@/_components/Reviewer/ReviewerDashboard";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const roles = user && user["https://edtechadmin.dev/roles"];
  if (!roles || roles.length === 0) return <Unauthorized />;

  if (roles.includes("admin")) return <AdminDashboard />;
  if (roles.includes("editor")) return <EditorDashboard />;
  if (roles.includes("reviewer")) return <ReviewerDashboard />;

  return <Unauthorized />;
};

export default Dashboard;
