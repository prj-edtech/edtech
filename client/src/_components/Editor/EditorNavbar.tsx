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
import { Bell, Menu } from "lucide-react";

const EditorNavbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout } = useAuth0();
  const roles = user && user["https://edtecheditor.dev/roles"];
  console.log(roles);
  console.log(user);
  return (
    <div className="flex justify-between items-center w-full lg:px-10 lg:py-6 font-redhat sticky top-0 z-50 bg-white dark:bg-black">
      <div className="flex justify-center items-center lg:gap-x-16 w-full">
        <div className="flex items-center lg:gap-x-4 justify-center">
          <Menu
            className="w-6 h-6 cursor-pointer lg:block hidden"
            onClick={toggleSidebar}
          />
          <Menu className="w-6 h-6 cursor-pointer lg:hidden" />
          <h1 className="font-medium lg:text-4xl font-outfit text-blue-600">
            edtech
          </h1>
        </div>
        <ul className="font-semibold lg:flex hidden items-center w-full lg:gap-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-semibold">
                  <li className="cursor-pointer">Content Management</li>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/sections"
                  >
                    Sections
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/topics"
                  >
                    Topics
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/subtopics"
                  >
                    Subtopics
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/subtopics/add"
                  >
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
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/question-paper"
                  >
                    Question Paper
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    className="cursor-pointer"
                    href="/editor/questions"
                  >
                    Questions
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </ul>
      </div>
      <div className="flex justify-start items-center lg:gap-x-2 lg:mr-2">
        <ModeToggle />
        <Bell className="w-4 h-4 cursor-pointer" />
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
                  <AvatarFallback>ED</AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[120px]">
                <NavigationMenuLink className="cursor-pointer">
                  Profile
                </NavigationMenuLink>
                <NavigationMenuLink className="cursor-pointer">
                  Settings
                </NavigationMenuLink>
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

export default EditorNavbar;
