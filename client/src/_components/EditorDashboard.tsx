import { useAuth0 } from "@auth0/auth0-react";

const EditorDashboard = () => {
  const { logout, user } = useAuth0();
  console.log(user);
  return (
    <div>
      <h1>Welcome Editor</h1>
      <button
        onClick={() => logout()}
        className="px-6 py-2 bg-blue-500 text-white rounded cursor-pointer"
      >
        Logout
      </button>
      {/* Admin-specific features */}
    </div>
  );
};

export default EditorDashboard;
