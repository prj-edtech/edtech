import { useAuth0 } from "@auth0/auth0-react";
import Unauthorized from "../_components/Unauthorized";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const roles = user && user["https://edtechadmin.dev/roles"];
  if (!roles || roles.length === 0) return <Unauthorized />;

  if (roles.includes("admin")) return <Navigate to="/admin" replace />;
  if (roles.includes("editor")) return <Navigate to="/editor" replace />;
  if (roles.includes("reviewer")) return <Navigate to="/reviewer" replace />;

  return <Unauthorized />;
};

export default Dashboard;
