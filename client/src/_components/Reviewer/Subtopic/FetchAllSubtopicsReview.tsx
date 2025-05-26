import { getAllSubtopics } from "@/api/subtopics";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Subtopics {
  id: string;
  subTopicId: string;
  isActive: boolean;
  createdAt: string;
  review: string;
  subTopicJson: {
    attributes: {
      displayName: string;
    };
  };
  topic: {
    topicJson: {
      attributes: {
        displayName: string;
      };
    };
  };
  section: {
    sectionJson: {
      attributes: {
        displayName: string;
      };
    };
  };
}
const FetchAllSubtopicsReview = () => {
  const [subtopics, setSubtopics] = useState<Subtopics[]>([]); // Store fetched subtopics
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = subtopics.filter(
    (subtopic) =>
      subtopic.subTopicJson.attributes.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subtopic.topic.topicJson.attributes.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subtopic.section.sectionJson.attributes.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subtopic.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subtopic.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fetch subtopics from API
  const loadSubtopics = async () => {
    setLoading(true);
    try {
      const response = await getAllSubtopics();
      setSubtopics(response); // Set the fetched subtopics
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger the fetch on component mount
  useEffect(() => {
    loadSubtopics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10 font-redhat font-medium">
      <div className="flex justify-start items-center w-full lg:px-10 px-8 py-4 lg:py-8 flex-col lg:gap-y-8 gap-y-4 min-h-screen">
        <div className="flex justify-between items-center lg:p-6 p-3 w-full border shadow-xs rounded-sm border-blue-800/20">
          <div className="flex justify-between items-center lg:w-[200px] border">
            <input
              placeholder="Search subtopics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page when search changes
              }}
              className="placeholder:text-sm lg:pl-2 focus:outline-none focus:ring-0"
            />

            <Button className="rounded-none" size="sm">
              Search
            </Button>
          </div>
          {/* <Button className="rounded-none">
            <Link
              to="/admin/subtopics/add"
              className="flex items-center gap-x-2"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Subtopic
            </Link>
          </Button> */}
          <div />
        </div>
        <Table className="border border-blue-800/20">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Subtopic</TableHead>
              <TableHead className="font-bold">Topic</TableHead>
              <TableHead className="font-bold">Section</TableHead>
              <TableHead className="font-bold">Review</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((subtopic) => (
              <TableRow key={subtopic.subTopicId}>
                <TableCell className="max-w-32 truncate">
                  {subtopic.subTopicJson.attributes.displayName}
                </TableCell>
                <TableCell>
                  {subtopic.topic.topicJson.attributes.displayName}
                </TableCell>
                <TableCell>
                  {subtopic.section.sectionJson.attributes.displayName}
                </TableCell>
                <TableCell className="font-bold">{subtopic.review}</TableCell>
                <TableCell>
                  {subtopic.isActive ? (
                    <p className="text-green-200 font-semibold bg-green-700 w-min px-3 py-1 rounded-sm">
                      Active
                    </p>
                  ) : (
                    <p className="text-red-200 font-semibold bg-red-700 w-min px-3 py-1 rounded-sm">
                      Inactive
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="font-redhat font-semibold"
                    >
                      <DropdownMenuItem>
                        <Link to={`/reviewer/subtopics/review/${subtopic.id}`}>
                          Review
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                // disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                // disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default FetchAllSubtopicsReview;
