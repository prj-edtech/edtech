import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth0 } from "@auth0/auth0-react";
import { Bell } from "lucide-react";

const AdminNavbar = () => {
  const { user } = useAuth0();
  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log(roles);
  return (
    <div className="flex justify-between items-center bg-transparent w-full lg:px-10 lg:py-6">
      <div />
      <div className="flex justify-start items-center lg:gap-x-4">
        <ModeToggle />
        <Bell className="w-4 h-4" />
        <Avatar>
          <AvatarImage src={user?.picture} alt="Profile picture" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default AdminNavbar;
