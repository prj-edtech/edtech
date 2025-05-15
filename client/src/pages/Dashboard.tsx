import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "../_components/Unauthorized";
import AdminDashboard from "../_components/Admin/AdminDashboard";
import ReviewerDashboard from "../_components/ReviewerDashboard";
import EditorDashboard from "../_components/Editor/EditorDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const roles = user && user["https://edtechadmin.dev/roles"];
  if (!roles || roles.length === 0) return <Unauthorized />;

  if (roles.includes("admin")) return <AdminDashboard />;
  if (roles.includes("editor")) return <EditorDashboard />;
  if (roles.includes("reviewer")) return <ReviewerDashboard />;

  return <Unauthorized />;
};

export default Dashboard;
