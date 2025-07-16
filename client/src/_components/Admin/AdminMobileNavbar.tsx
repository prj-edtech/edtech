import { ModeToggle } from "@/components/mode-toggle";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Notification from "../Notification";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth0 } from "@auth0/auth0-react";

const AdminMobileNavbar = () => {
  return (
    <div className="lg:hidden flex justify-between items-center w-full px-6 py-4 mb-4">
      <div className="flex justify-center items-center gap-x-4">
        <MobileMenu />
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

const MobileMenu = () => {
  const { logout } = useAuth0();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="w-4 h-4" />
      </SheetTrigger>
      <SheetContent side="left" className="w-full h-full font-redhat px-6 py-2">
        <SheetHeader>
          <SheetTitle className="font-medium text-xl font-outfit text-blue-600 lowercase">
            edtech admin
          </SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full font-circular">
          <AccordionItem value="item-1">
            <AccordionTrigger>Most Used</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center items-start flex-col gap-y-2 p-6">
                <Link to="/admin/boards">Boards</Link>
                <Link to="/admin/standards">Standards</Link>
                <Link to="/admin/subjects">Subjects</Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Content Management</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center items-start flex-col gap-y-2 p-6">
                <Link to="/admin/sections">Sections</Link>
                <Link to="/admin/topics">Topics</Link>
                <Link to="/admin/subtopics">Subtopics</Link>
                <Link to="/admin/subtopics/add">Add Subtopics</Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Exam Management</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center items-start flex-col gap-y-2 p-6">
                <Link to="/admin/question-papers">Question Papers</Link>
                <Link to="/admin/questions">Questions</Link>
                <Link to="/admin/questions/add">Add Question</Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>System Logs</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center items-start flex-col gap-y-2 p-6">
                <Link to="/admin/change-logs">Change Logs</Link>
                <Link to="/admin/audit-logs">Audit Trails</Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Profile</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-center items-start flex-col gap-y-2 p-6">
                <Link to="/admin/settings">Settings</Link>
                <h4 onClick={() => logout()}>Logout</h4>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNavbar;
