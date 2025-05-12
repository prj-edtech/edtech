import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  BookCopy,
  BookOpenText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Notebook,
  NotebookPen,
  School,
  Scroll,
  ScrollText,
} from "lucide-react";

const AdminSidebar = () => {
  const { logout } = useAuth0();

  return (
    <div className="lg:w-64 h-screen fixed top-0 left-0 bg-black text-stone-100 lg:flex hidden flex-col p-4 space-y-6 font-redhat">
      <h2 className="lg:text-2xl font-bold mb-8 p-4">EdTech Admin</h2>
      <nav className="flex flex-col lg:gap-y-6 text-lg">
        <Link
          to="/dashboard"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <LayoutDashboard className="w-5 h-5 stroke-[1] text-lime-500" />
          Dashboard
        </Link>
        <Link
          to="/admin/boards"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <School className="w-5 h-5 stroke-[1] text-lime-500" />
          Boards
        </Link>
        <Link
          to="/admin/standards"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <GraduationCap className="w-5 h-5 stroke-[1] text-lime-500" />
          Standards
        </Link>
        <Link
          to="/admin/subjects"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <BookOpenText className="w-5 h-5 stroke-[1] text-lime-500" />
          Subjects
        </Link>
        <Link
          to="/admin/sections"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <BookCopy className="w-5 h-5 stroke-[1] text-lime-500" />
          Sections
        </Link>
        <Link
          to="/admin/topics"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <Notebook className="w-5 h-5 stroke-[1] text-lime-500" />
          Topics
        </Link>
        <Link
          to="/admin/subtopics"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <NotebookPen className="w-5 h-5 stroke-[1] text-lime-500" />
          Subtopics
        </Link>
        <Link
          to="/admin/audit-logs"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <Scroll className="w-5 h-5 stroke-[1] text-lime-500" />
          Audit Logs
        </Link>
        <Link
          to="/admin/change-logs"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:px-8 lg:py-2 rounded-full cursor-pointer hover:text-lime-500"
        >
          <ScrollText className="w-5 h-5 stroke-[1] text-lime-500" />
          Change Logs
        </Link>
      </nav>
      <button
        onClick={() => logout()}
        className="mt-auto text-lg bg-lime-500 hover:bg-lime-800 text-black font-semibold cursor-pointer rounded-lg shadow px-8 py-2 flex items-center lg:gap-x-4"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
