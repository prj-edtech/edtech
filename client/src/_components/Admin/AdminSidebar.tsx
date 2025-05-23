import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AdminSidebar = () => {
  return (
    <div className="lg:w-64 h-screen fixed lg:flex hidden flex-col p-4 space-y-6 font-redhat z-20 overflow-y-auto">
      <nav className="flex flex-col justify-start items-start lg:gap-y-3 text-lg w-full lg:px-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold">
              Most Used
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <h6 className="hover:underline underline-offset-2">Dashboard</h6>
              <h6 className="hover:underline underline-offset-2">Boards</h6>
              <h6 className="hover:underline underline-offset-2">Standards</h6>
              <h6 className="hover:underline underline-offset-2">Subjects</h6>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold">
              Content
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <h6 className="hover:underline underline-offset-2">Sections</h6>
              <h6 className="hover:underline underline-offset-2">Topics</h6>
              <h6 className="hover:underline underline-offset-2">Subtopics</h6>
              <h6 className="hover:underline underline-offset-2">
                Add Subtopic
              </h6>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold">Tests</AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <h6 className="hover:underline underline-offset-2">
                Question Paper
              </h6>
              <h6 className="hover:underline underline-offset-2">Questions</h6>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-semibold">
              System Logs
            </AccordionTrigger>
            <AccordionContent className="flex justify-start items-start flex-col lg:gap-y-4">
              <h6 className="hover:underline underline-offset-2">
                Change Logs
              </h6>
              <h6 className="hover:underline underline-offset-2">
                Audit Trail
              </h6>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    </div>
  );
};

export default AdminSidebar;
