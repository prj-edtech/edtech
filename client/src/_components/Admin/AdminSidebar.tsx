import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`fixed h-screen flex-col p-4 space-y-6 font-redhat z-20 overflow-y-auto transition-all duration-300
    ${isOpen ? "w-64" : "w-0"} 
    lg:flex hidden`}
    >
      <nav className="flex flex-col justify-start items-start lg:gap-y-3 text-lg w-full lg:px-6 lg:w-64">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold">
              Most Used
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/dashboard"
                className="hover:underline underline-offset-2"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/boards"
                className="hover:underline underline-offset-2"
              >
                Boards
              </Link>
              <Link
                to="/admin/standards"
                className="hover:underline underline-offset-2"
              >
                Standards
              </Link>
              <Link
                to="/admin/subjects"
                className="hover:underline underline-offset-2"
              >
                Subjects
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold">
              Content
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/admin/sections"
                className="hover:underline underline-offset-2"
              >
                Sections
              </Link>
              <Link
                to="/admin/topics"
                className="hover:underline underline-offset-2"
              >
                Topics
              </Link>
              <Link
                to="/admin/subtopics"
                className="hover:underline underline-offset-2"
              >
                Subtopics
              </Link>
              <Link
                to="/admin/subtopics/add"
                className="hover:underline underline-offset-2"
              >
                Add Subtopic
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold">Exams</AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/admin/question-papers"
                className="hover:underline underline-offset-2"
              >
                Question Paper
              </Link>
              <Link
                to="/admin/questions"
                className="hover:underline underline-offset-2"
              >
                Questions
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold">
              System Logs
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/admin/change-logs"
                className="hover:underline underline-offset-2"
              >
                Change Logs
              </Link>
              <Link
                to="/admin/audit-logs"
                className="hover:underline underline-offset-2"
              >
                Audit Trail
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default AdminSidebar;
