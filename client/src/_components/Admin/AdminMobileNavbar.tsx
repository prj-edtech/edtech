import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Notification from "../Notification";

const AdminMobileNavbar = () => {
  return (
    <div className="lg:hidden flex justify-between items-center w-full px-6 py-4 mb-4">
      <div className="flex justify-center items-center gap-x-4">
        <Menu className="w-4 h-4" />
        <Link
          to={"/"}
          className="font-medium lg:text-4xl text-xl font-outfit text-blue-600"
        >
          edtech
        </Link>
      </div>
      <div className="flex justify-start items-center gap-x-2">
        <ModeToggle />
        <Notification />
      </div>
    </div>
  );
};

export default AdminMobileNavbar;
