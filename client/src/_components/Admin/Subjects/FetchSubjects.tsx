import { fetchActiveBoards } from "@/api/boards";
import { fetchStandardsByBoard } from "@/api/standards";
import {
  getAllSubjects,
  addSubject,
  removeSubject,
  activeSubject,
  deactiveSubject,
} from "@/api/subjects";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface Subjects {
  id: string;
  partitionKey: string;
  sortKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  board: {
    sortKey: string;
    displayName: string;
  };
  standard: {
    sortKey: string;
  };
  subjectJson: [
    {
      attributes: {
        displayName: string;
      };
    }
  ];
}

interface Boards {
  id: string;
  displayName: string;
}

interface Standards {
  id: string;
  sortKey: string;
}

const FetchSubjects = () => {
  const [subjects, setSubjects] = useState<Subjects[]>([]);
  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useAuth0();

  const [sortKey, setSortKey] = useState("");
  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");

  const [loading, setLoading] = useState(false);
  const [keepAdding, setKeepAdding] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = subjects.filter(
    (subject) =>
      subject.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.board.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.standard.sortKey
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subject.board?.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const fetchAllSubjects = async () => {
    setLoading(true);
    try {
      const response = await getAllSubjects();
      setSubjects(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
    loadBoards();
  }, []);

  useEffect(() => {
    if (boardId) {
      loadStandards(boardId);
    }
  }, [boardId]);

  const loadBoards = async () => {
    const response = await fetchActiveBoards();
    setBoardData(response.data.data);
  };

  const loadStandards = async (boardId: string) => {
    const response = await fetchStandardsByBoard(boardId);
    setStandardData(response.data.data);
  };

  const handleAddSubject = async () => {
    setLoading(true);
    try {
      const newSubject = {
        sortKey,
        boardId,
        standardId,
        createdBy: user?.sub || "",
      };
      await addSubject(newSubject);
      // Refresh subjects list after adding
      fetchAllSubjects();

      if (keepAdding) {
        setSortKey("");
      } else {
        // Close the dialog and reset form
        setOpenAddDialog(false);
        setSortKey("");
        setBoardId("");
        setStandardId("");
        setKeepAdding(false);
      }
    } catch (error) {
      console.error("Failed to add subject:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (id: string) => {
    setLoading(true);
    try {
      await removeSubject(id, user?.sub!);
      fetchAllSubjects();
      console.log("Subject removed successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSubject = async (id: string) => {
    setLoading(true);
    try {
      const performedBy = user?.sub || "";
      await activeSubject(id, performedBy);
      fetchAllSubjects();
      console.log("Subject activated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateSubject = async (id: string) => {
    setLoading(true);
    try {
      const updatedBy = user?.sub || "";
      await deactiveSubject(id, updatedBy);
      fetchAllSubjects();
      console.log("Subject deactivated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex lg:justify-between justify-start lg:flex-row flex-col lg:items-center gap-y-2 items-start lg:p-6 p-3 w-full border shadow-xs rounded-sm border-blue-800/20">
          <div className="flex justify-between items-center lg:w-[200px] border">
            <input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page when search changes
              }}
              className="lg:placeholder:text-sm placeholder:text-xs pl-2 focus:outline-none focus:ring-0"
            />

            <Button className="rounded-none" size="sm">
              Search
            </Button>
          </div>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-none" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="font-redhat">
              <DialogHeader className="lg:mb-10 font-outfit">
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <Label className="font-semibold">Board</Label>
                  {/* <Input
                    type="text"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                  /> */}
                  <Select
                    value={boardId}
                    onValueChange={(value) => setBoardId(value)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {boardData.map((board) => (
                          <SelectItem key={board.id} value={board.id}>
                            {board.displayName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label className="font-semibold">Standard</Label>
                  {/* <Input
                    type="text"
                    value={standardId}
                    onChange={(e) => setStandardId(e.target.value)}
                  /> */}
                  <Select
                    value={standardId}
                    onValueChange={(value) => setStandardId(value)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a standard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {standardData.map((standard) => (
                          <SelectItem key={standard.id} value={standard.id}>
                            {standard.sortKey}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="flex flex-col gap-y-2">
                  <Label className="font-semibold">Created By</Label>
                  <Input type="text" value={user?.sub} disabled />
                </div> */}

                <div className="flex flex-col gap-y-2">
                  <Label className="font-semibold">Subject Name</Label>
                  <Input
                    type="text"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Label
                    htmlFor="keepAdding"
                    className="font-medium cursor-pointer"
                  >
                    Keep adding on selected board and standard
                  </Label>
                  <Checkbox
                    className="border border-blue-800/40 cursor-pointer"
                    id="keepAdding"
                    checked={keepAdding}
                    onCheckedChange={(checked) => setKeepAdding(!!checked)}
                  />
                </div>

                <Button
                  onClick={handleAddSubject}
                  className="mt-4 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table className="border border-blue-800/20">
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold">Subject</TableCell>
              <TableCell className="font-bold">Board</TableCell>
              <TableCell className="font-bold">Standard</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Created At</TableCell>
              <TableCell className="font-bold">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center lg:py-6">
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    {subject.subjectJson[0]?.attributes?.displayName}
                  </TableCell>
                  <TableCell>
                    {subject.board.sortKey} - {subject.board.displayName}
                  </TableCell>
                  <TableCell>{subject.standard.sortKey}</TableCell>

                  <TableCell>
                    {subject.isActive ? (
                      <p className="text-green-200 font-semibold bg-green-700 w-min px-3 py-1 rounded-sm">
                        Active
                      </p>
                    ) : (
                      <p className="text-red-200 font-semibold bg-red-700 w-min px-3 py-1 rounded-sm">
                        Inactive
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{subject.createdAt.split("T")[0]}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="cursor-pointer">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="font-redhat font-semibold">
                        <DropdownMenuItem
                          onClick={() => handleActivateSubject(subject.id)}
                          className="cursor-pointer"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Activate"
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeactivateSubject(subject.id)}
                          className="cursor-pointer"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Deactivate"
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveSubject(subject.id)}
                          className="cursor-pointer flex items-center gap-x-4 text-red-700"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4 text-red-700" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {paginatedData.length !== 0 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
        )}
      </div>
    </div>
  );
};

export default FetchSubjects;
