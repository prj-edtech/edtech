import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "lucide-react";

const AdminNavbar = () => {
  const { user, logout } = useAuth0();
  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log(roles);
  console.log(user);
  return (
    <div className="flex justify-between items-center w-full lg:px-10 lg:py-6 font-redhat sticky top-0 z-50 bg-white dark:bg-black">
      <div className="flex justify-center items-center lg:gap-x-16 w-full">
        <h1 className="font-bold lg:text-4xl">EdTech</h1>
        <ul className="font-semibold flex items-center w-full lg:gap-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Essentials</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink href="/admin/boards">
                    Boards
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/standards">
                    Standards
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/subjects">
                    Subjects
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
                  <NavigationMenuLink href="/admin/sections">
                    Sections
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/topics">
                    Topics
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/subtopics">
                    Subtopics
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/subtopics/add">
                    Add Subtopics
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
                  <NavigationMenuLink href="/admin/question-paper">
                    Question Paper
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/questions">
                    Questions
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Notifications</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink>Notifications</NavigationMenuLink>
                  <NavigationMenuLink href="/admin/audit-logs">
                    Audit Logs
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/admin/change-logs">
                    Change Logs
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </ul>
      </div>
      <div className="flex justify-start items-center lg:gap-x-4">
        <ModeToggle />
        <User className="w-4 h-4 cursor-pointer" />
        <Button
          onClick={() => logout()}
          variant="outline"
          size="lg"
          className="border-2 border-black dark:border-white cursor-pointer font-bold"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default AdminNavbar;
