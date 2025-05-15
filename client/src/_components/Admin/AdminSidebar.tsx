import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  BookCopy,
  BookOpenText,
  BookCopyIcon,
  GraduationCap,
  LayoutDashboard,
  Notebook,
  NotebookPen,
  School,
  Scroll,
  ScrollText,
  ChevronUp,
  ChevronDown,
  Bell,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const AdminSidebar = () => {
  const { logout } = useAuth0();

  return (
    <div className="lg:w-64 h-screen fixed top-0 left-0 bg-black text-stone-100 lg:flex hidden flex-col p-4 space-y-6 font-redhat z-50 overflow-y-auto">
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-start items-center lg:gap-x-2">
          <BookCopyIcon className="bg-violet-600 text-stone-200 stroke-[1.5] p-2 rounded-lg shadow-md w-8 h-8" />
          <h3 className="font-redhat lg:text-xl font-bold">EdTech</h3>
        </div>
        <Dialog>
          <DialogTrigger>
            <div className="flex flex-col lg:px-4 lg:py-1.5 rounded-lg shadow hover:bg-stone-800 cursor-pointer">
              <ChevronUp className="w-3 h-3" />
              <ChevronDown className="w-3 h-3" />
            </div>
          </DialogTrigger>
          <DialogContent className="font-redhat flex flex-col">
            <p onClick={() => logout()}>Logout</p>
          </DialogContent>
        </Dialog>
      </div>
      <nav className="flex flex-col justify-start items-start lg:gap-y-3 text-lg w-full mt-6">
        <Link
          to="/dashboard"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <LayoutDashboard className="w-5 h-5 stroke-[1] text-violet-600" />
          Dashboard
        </Link>
        <Link
          to="/admin/boards"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <School className="w-5 h-5 stroke-[1] text-violet-600" />
          Boards
        </Link>
        <Link
          to="/admin/standards"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <GraduationCap className="w-5 h-5 stroke-[1] text-violet-600" />
          Standards
        </Link>
        <Link
          to="/admin/subjects"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <BookOpenText className="w-5 h-5 stroke-[1] text-violet-600" />
          Subjects
        </Link>
        <Link
          to="/admin/sections"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <BookCopy className="w-5 h-5 stroke-[1] text-violet-600" />
          Sections
        </Link>
        <Link
          to="/admin/topics"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <Notebook className="w-5 h-5 stroke-[1] text-violet-600" />
          Topics
        </Link>
        <Link
          to="/admin/subtopics"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <NotebookPen className="w-5 h-5 stroke-[1] text-violet-600" />
          Subtopics
        </Link>
        <Link
          to="/admin/audit-logs"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <Scroll className="w-5 h-5 stroke-[1] text-violet-600" />
          Audit Logs
        </Link>
        <Link
          to="/admin/change-logs"
          className="flex items-center lg:gap-x-4 hover:bg-stone-600/20 lg:pr-8 lg:pl-2 lg:py-2 rounded-full cursor-pointer hover:text-violet-600"
        >
          <ScrollText className="w-5 h-5 stroke-[1] text-violet-600" />
          Change Logs
        </Link>
      </nav>
      <div className="flex justify-start items-center lg:gap-x-4 lg:mt-6">
        <ModeToggle />
        <Bell className="w-4 h-4 stroke-[1.5]" />
      </div>
    </div>
  );
};

export default AdminSidebar;
