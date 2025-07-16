import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from "lucide-react";
import Notification from "../Notification";
import { Link } from "react-router-dom";

const AdminNavbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuth0();
  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log(roles);
  console.log(user);
  return (
    <div className="lg:flex hidden justify-between items-center w-full lg:px-10 lg:py-6 font-redhat sticky top-0 z-50 bg-white dark:bg-black">
      <div className="flex justify-center items-center lg:gap-x-16 w-full">
        <div className="flex items-center lg:gap-x-4 justify-center">
          <Menu
            className="w-6 h-6 cursor-pointer lg:block hidden"
            onClick={toggleSidebar}
          />
          <Menu className="w-6 h-6 cursor-pointer lg:hidden" />
          <Link
            to={"/"}
            className="font-medium lg:text-4xl font-outfit text-blue-600"
          >
            edtech
          </Link>
        </div>
        <ul className="font-semibold lg:flex hidden items-center w-full lg:gap-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Essentials</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/boards">Boards</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/standards">Standards</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/subjects">Subjects</Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Content Management</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/sections">Sections</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/topics">Topics</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/subtopics">Subtopics</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/subtopics/add">Add Subtopics</Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Exams Management</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/question-papers">Question Paper</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/questions">Questions</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/questions/add">Add Question</Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Logs</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/audit-logs">Audit Logs</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink className="cursor-pointer">
                    <Link to="/admin/change-logs">Change Logs</Link>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </ul>
      </div>
      <div className="flex justify-start items-center lg:gap-x-2 lg:mr-2">
        <ModeToggle />
        <Notification />
        {/* <Button
          
          variant="outline"
          size="lg"
          className="border-2 border-black dark:border-white cursor-pointer font-bold"
        >
          Log out
        </Button> */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-semibold">
                <Avatar>
                  <AvatarImage src="/" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[120px]">
                <NavigationMenuLink
                  className="cursor-pointer"
                  onClick={() => logout()}
                >
                  Logout
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default AdminNavbar;
