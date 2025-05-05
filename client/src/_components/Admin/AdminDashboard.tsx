import { useAuth0 } from "@auth0/auth0-react";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const { user } = useAuth0();

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-4">Welcome, {user?.name}</h1>
      <p className="text-gray-600">Here is your admin dashboard overview.</p>
    </AdminLayout>
  );
};

export default AdminDashboard;
