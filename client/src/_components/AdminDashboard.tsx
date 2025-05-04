import { useAuth0 } from "@auth0/auth0-react";

const AdminDashboard = () => {
  const { logout, user } = useAuth0();
  console.log(user);
  return (
    <div>
      <h1>Welcome Admin</h1>
      <button
        onClick={() => logout()}
        className="px-6 py-2 bg-purple-500 text-white rounded cursor-pointer"
      >
        Logout
      </button>
      {/* Admin-specific features */}
    </div>
  );
};

export default AdminDashboard;
