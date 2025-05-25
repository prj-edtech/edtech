import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const ReviewerSidebar = ({ isOpen }: { isOpen: boolean }) => {
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
                to="/reviewer/subtopics"
                className="hover:underline underline-offset-2"
              >
                Review Subtopics
              </Link>
              <Link
                to="/reviewer/questions"
                className="hover:underline underline-offset-2"
              >
                Review Questions
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default ReviewerSidebar;
