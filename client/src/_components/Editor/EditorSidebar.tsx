import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const EditorSidebar = ({ isOpen }: { isOpen: boolean }) => {
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
              Content
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/editor/sections"
                className="hover:underline underline-offset-2"
              >
                Sections
              </Link>
              <Link
                to="/editor/topics"
                className="hover:underline underline-offset-2"
              >
                Topics
              </Link>
              <Link
                to="/editor/subtopics"
                className="hover:underline underline-offset-2"
              >
                Subtopics
              </Link>
              <Link
                to="/editor/subtopics/add"
                className="hover:underline underline-offset-2"
              >
                Add Subtopic
              </Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold">Exams</AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <Link
                to="/editor/question-papers"
                className="hover:underline underline-offset-2"
              >
                Question Paper
              </Link>
              <Link
                to="/editor/question-papers/questions"
                className="hover:underline underline-offset-2"
              >
                Questions
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default EditorSidebar;
