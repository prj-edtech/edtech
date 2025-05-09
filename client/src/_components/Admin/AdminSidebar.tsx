import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const AdminSidebar = () => {
  const { logout } = useAuth0();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin/boards" className="hover:text-purple-400">
          Boards
        </Link>
        <Link to="/admin/standards" className="hover:text-purple-400">
          Standards
        </Link>
        <Link to="/admin/subjects" className="hover:text-purple-400">
          Subjects
        </Link>
        <Link to="/admin/sections" className="hover:text-purple-400">
          Sections
        </Link>
        <Link to="/admin/topics" className="hover:text-purple-400">
          Topics
        </Link>
        <Link to="/admin/subtopics" className="hover:text-purple-400">
          Subtopics
        </Link>
        <Link to="/admin/audit-logs" className="hover:text-purple-400">
          Audit Logs
        </Link>
        <Link to="/admin/settings" className="hover:text-purple-400">
          Settings
        </Link>
      </nav>
      <button
        onClick={() => logout()}
        className="mt-auto bg-purple-600 hover:bg-purple-700 rounded p-2"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
