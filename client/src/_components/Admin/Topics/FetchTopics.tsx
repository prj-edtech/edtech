import { useEffect, useState } from "react";
import {
  addTopics,
  editTopic,
  fetchAllTopics,
  removeTopic,
} from "@/api/topics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchActiveBoards } from "@/api/boards";
import { fetchStandardsByBoard } from "@/api/standards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjectsByStandard } from "@/api/subjects";
import { getSectionBySubject } from "@/api/sections";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";

interface Topics {
  id: string;
  partitionKey: string;
  sortKey: string;
  topicId: string;
  sectionId: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  topicJson: {
    attributes: {
      displayName: string;
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

interface Boards {
  id: string;
  displayName: string;
}

interface Standards {
  id: string;
  sortKey: string;
}

interface Subjects {
  id: string;
  sortKey: string;
}

interface Sections {
  id: string;
  sectionJson: {
    attributes: {
      displayName: string;
    };
  };
}

const FetchAllTopics = () => {
  const [topics, setTopics] = useState<Topics[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [priority, setPriority] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [subjectData, setSubjectData] = useState<Subjects[]>([]);
  const [sectionData, setSectiontData] = useState<Sections[]>([]);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<any | null>(null);
  const [editPriority, setEditPriority] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editIsActive, setEditIsActive] = useState("true");

  const [keepAdding, setKeepAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = topics.filter(
    (topic) =>
      topic.topicJson.attributes.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      topic.section.sectionJson.attributes.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      topic.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const { user } = useAuth0();

  const loadTopics = async () => {
    setLoading(true);
    try {
      const response = await fetchAllTopics();
      setTopics(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoards = async () => {
    const response = await fetchActiveBoards();
    setBoardData(response.data.data);
  };

  const loadStandards = async (boardId: string) => {
    const response = await fetchStandardsByBoard(boardId);
    setStandardData(response.data.data);
  };

  const loadSubjects = async (standardId: string) => {
    const response = await getSubjectsByStandard(standardId);
    setSubjectData(response.data.data);
  };

  const loadSections = async (subjectId: string) => {
    const response = await getSectionBySubject(subjectId);
    setSectiontData(response.data.sections);
  };

  useEffect(() => {
    loadTopics();
    loadBoards();
  }, []);

  useEffect(() => {
    if (boardId) {
      loadStandards(boardId);
    }

    if (standardId) {
      loadSubjects(standardId);
    }

    if (subjectId) {
      loadSections(subjectId);
    }
  }, [boardId, standardId, subjectId]);

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      await removeTopic(id, user?.sub!);
      loadTopics();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  //  Handle Add Topic Submit
  const handleAddTopic = async () => {
    setLoading(true);
    try {
      if (
        !boardId ||
        !standardId ||
        !subjectId ||
        !sectionId ||
        !priority ||
        !displayName
      ) {
        alert("Please fill in all fields.");
        return;
      }

      await addTopics({
        boardId,
        standardId,
        subjectId,
        sectionId,
        priority: Number(priority),
        attributes: {
          displayName,
        },
        createdBy: user?.sub || "",
      });

      loadTopics();
      if (keepAdding) {
        setPriority("");
        setDisplayName("");
      } else {
        setBoardId("");
        setStandardId("");
        setSubjectId("");
        setSectionId("");
        setPriority("");
        setDisplayName("");
        setOpenAddDialog(false);
        setKeepAdding(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add topic. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (topic: any) => {
    setCurrentTopic(topic);
    setEditPriority(topic.priority.toString());
    setEditDisplayName(topic.topicJson.attributes.displayName);
    setEditIsActive(topic.isActive ? "true" : "false");
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async () => {
    if (!currentTopic) return;

    try {
      setLoading(true);

      await editTopic(currentTopic.topicId, {
        priority: Number(editPriority),
        attributes: {
          displayName: editDisplayName,
        },
        isActive: editIsActive === "true",
        updatedBy: user?.sub || "",
      });

      setOpenEditDialog(false);
      loadTopics();
    } catch (error) {
      console.error(error);
      alert("Failed to update topic.");
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
              placeholder="Search topics..."
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
                <Plus className="w-4 h-4 mr-2" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto font-redhat">
              <DialogHeader className="lg:mb-10">
                <DialogTitle>Add New Topic</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Board</Label>
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
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Standard</Label>
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
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Subject</Label>
                  {/* <Input
                    type="text"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  /> */}
                  <Select
                    value={subjectId}
                    onValueChange={(value) => setSubjectId(value)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjectData.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.sortKey}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Section</Label>
                  {/* <Input
                    type="text"
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                  /> */}
                  <Select
                    value={sectionId}
                    onValueChange={(value) => setSectionId(value)}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectionData.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.sectionJson.attributes.displayName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Priority</Label>
                  <Input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Topic Name</Label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Label
                    htmlFor="keepAdding"
                    className="font-medium cursor-pointer"
                  >
                    Keep adding on selected board, standard, subject and section
                  </Label>
                  <Checkbox
                    className="border border-blue-800/40 cursor-pointer"
                    id="keepAdding"
                    checked={keepAdding}
                    onCheckedChange={(checked) => setKeepAdding(!!checked)}
                  />
                </div>

                <Button
                  onClick={handleAddTopic}
                  disabled={loading}
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
              <TableHead className="font-bold">Topic</TableHead>
              <TableHead className="font-bold">Section</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.length > 0 ? (
              paginatedData.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell>
                    {topic.topicJson.attributes.displayName}
                  </TableCell>
                  <TableCell>
                    {topic.section.sectionJson.attributes.displayName}
                  </TableCell>
                  <TableCell>
                    {topic.isActive ? (
                      <p className="text-green-200 font-semibold bg-green-700 w-min px-3 py-1 rounded-sm">
                        Active
                      </p>
                    ) : (
                      <p className="text-red-200 font-semibold bg-red-700 w-min px-3 py-1 rounded-sm">
                        Inactive
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClick(topic)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(topic.id)}
                          disabled={loading}
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
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No topics found.
                </TableCell>
              </TableRow>
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
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="lg:mb-6 font-outfit">
            <DialogTitle>Edit Topic</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Priority</Label>
              <Input
                type="number"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Display Name</Label>
              <Input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Status</Label>
              <Select
                value={editIsActive}
                onValueChange={(value) => setEditIsActive(value)}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleEditSubmit}
              disabled={loading}
              className="mt-4 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FetchAllTopics;
