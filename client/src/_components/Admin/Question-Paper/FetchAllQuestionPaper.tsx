import { useEffect, useState } from "react";
import {
  getAllQuestionPaper,
  addQuestionPaper,
  removeQuestionPaper,
  activateQuestionPaper,
  deactivateQuestionPaper,
  updateQuestionPaper,
} from "@/api/questionPapers";
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
import { fetchActiveBoards } from "@/api/boards";
import { fetchStandardsByBoard } from "@/api/standards";
import { getSubjectsByStandard } from "@/api/subjects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface QuestionPapers {
  id: string;
  year: string;
  month: string;
  totalMarks: number;
  attributes: {
    difficulty: string;
    type: string;
  };
  isActive: boolean;
  createdAt: string;
  boardId: string;
  standardId: string;
  subjectId: string;
  boardCode: string;
  standardCode: string;
  subjectName: string;
  board: {
    sortKey: string;
    displayName: string;
  };
  standard: {
    sortKey: string;
  };
  subject: {
    sortKey: string;
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

const FetchAllQuestionPaper = () => {
  const [loading, setLoading] = useState(false);
  const [questionPaperData, setQuestionPaperData] = useState<QuestionPapers[]>(
    []
  );
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [subjectData, setSubjectData] = useState<Subjects[]>([]);

  const [board, setBoard] = useState<{ id: string; code: string }>({
    id: "",
    code: "",
  });
  const [standard, setStandard] = useState<{ id: string; code: string }>({
    id: "",
    code: "",
  });
  const [subject, setSubject] = useState<{ id: string; code: string }>({
    id: "",
    code: "",
  });

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuestionPaper, setSelectedQuestionPaper] =
    useState<QuestionPapers | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = questionPaperData.filter(
    (qp) =>
      qp.attributes.difficulty
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      qp.attributes.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.board.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.board.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.standard.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.subject.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qp.totalMarks
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      qp.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const { user } = useAuth0();

  const loadQuestionPapers = async () => {
    setLoading(true);
    try {
      const response = await getAllQuestionPaper();
      setQuestionPaperData(response.data.data);
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
    console.log(response.data);
    setStandardData(response.data.data);
  };

  const loadSubjects = async (standardId: string) => {
    const response = await getSubjectsByStandard(standardId);
    setSubjectData(response.data.data);
  };

  useEffect(() => {
    loadQuestionPapers();
    loadBoards();
  }, []);

  useEffect(() => {
    if (board.id) {
      loadStandards(board.id);
    }

    if (standard.id) {
      loadSubjects(standard.id);
    }
  }, [standard.id, board.id]);

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      await removeQuestionPaper(id, user?.sub!);
      loadQuestionPapers();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (qp: QuestionPapers) => {
    setSelectedQuestionPaper(qp);
    setOpenEditDialog(true);
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    try {
      await activateQuestionPaper(id, user?.sub!);
      loadQuestionPapers();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    setLoading(true);
    try {
      await deactivateQuestionPaper(id, user?.sub!);
      loadQuestionPapers();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestionPaper = async () => {
    const payload = {
      boardId: board.id,
      boardCode: board.code,
      standardId: standard.id,
      standardCode: standard.code,
      subjectId: subject.id,
      subjectName: subject.code,
      year,
      month,
      totalMarks: Number(totalMarks),
      attributes: {
        difficulty,
        type,
      },
      isActive: false,
      createdBy: user?.sub!,
      updatedBy: user?.sub!,
    };
    setLoading(true);
    try {
      await addQuestionPaper(payload);
      setOpenAddDialog(false);
      loadQuestionPapers();
      // reset fields
      setBoard({ id: "", code: "" });
      setStandard({ id: "", code: "" });
      setSubject({ id: "", code: "" });
      setYear("");
      setMonth("");
      setType("");
      setDifficulty("");
      setTotalMarks("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestionPaper = async () => {
    if (!selectedQuestionPaper) return;

    const payload = {
      month: selectedQuestionPaper.month,
      totalMarks: selectedQuestionPaper.totalMarks,
      attributes: {
        displayName: selectedQuestionPaper.board.displayName,
        notes: "", // you can add a notes input if needed
        heading: "",
        questionPaperInstruction: "",
        type: selectedQuestionPaper.attributes.type,
        difficulty: selectedQuestionPaper.attributes.difficulty,
      },
      updatedBy: user?.sub!,
    };

    try {
      await updateQuestionPaper(selectedQuestionPaper.id, payload);
      setOpenEditDialog(false);
      loadQuestionPapers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10 font-redhat font-medium">
      <div className="flex justify-start items-center w-full lg:px-10 px-8 py-4 lg:py-8 flex-col lg:gap-y-8 gap-y-4 min-h-screen">
        <div className="flex justify-between items-center lg:p-6 p-3 w-full border shadow-xs rounded-sm border-blue-800/20">
          <div className="flex justify-between items-center lg:w-[200px] border">
            <input
              placeholder="Search question papers..."
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
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="rounded-none">
                <Plus className="w-4 h-4 mr-2" /> Add Question Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question Paper</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6 lg:mt-4">
                <div className="flex flex-col gap-y-2">
                  <Label>Board</Label>
                  <Select
                    value={board.id}
                    onValueChange={(value) => {
                      const selected = boardData.find((b) => b.id === value);
                      if (selected)
                        setBoard({
                          id: selected.id,
                          code: selected.displayName,
                        });
                    }}
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
                  <Label>Standard</Label>
                  <Select
                    value={standard.id}
                    onValueChange={(value) => {
                      const selected = standardData.find((s) => s.id === value);
                      if (selected)
                        setStandard({
                          id: selected.id,
                          code: selected.sortKey,
                        });
                    }}
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

                <div className="flex flex-col gap-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={subject.id}
                    onValueChange={(value) => {
                      const selected = subjectData.find((s) => s.id === value);
                      if (selected)
                        setSubject({ id: selected.id, code: selected.sortKey });
                    }}
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

                <div className="flex flex-col gap-y-2">
                  <Label>Year</Label>
                  <Input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Month</Label>
                  <Input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Total Marks</Label>
                  <Input
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Type</Label>
                  <Input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Difficulty</Label>
                  <Input
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddQuestionPaper} className="mt-4">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Question Paper</DialogTitle>
              </DialogHeader>

              {selectedQuestionPaper && (
                <div className="flex flex-col gap-y-6">
                  <div>
                    <Label>Month</Label>
                    <Input
                      value={selectedQuestionPaper.month}
                      onChange={(e) =>
                        setSelectedQuestionPaper({
                          ...selectedQuestionPaper,
                          month: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Total Marks</Label>
                    <Input
                      value={selectedQuestionPaper.totalMarks}
                      onChange={(e) =>
                        setSelectedQuestionPaper({
                          ...selectedQuestionPaper,
                          totalMarks: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <Input
                      value={selectedQuestionPaper.attributes.type}
                      onChange={(e) =>
                        setSelectedQuestionPaper({
                          ...selectedQuestionPaper,
                          attributes: {
                            ...selectedQuestionPaper.attributes,
                            type: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Difficulty</Label>
                    <Input
                      value={selectedQuestionPaper.attributes.difficulty}
                      onChange={(e) =>
                        setSelectedQuestionPaper({
                          ...selectedQuestionPaper,
                          attributes: {
                            ...selectedQuestionPaper.attributes,
                            difficulty: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <Button onClick={handleUpdateQuestionPaper}>Update</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <Table className="border border-blue-800/20">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Board</TableHead>
                <TableHead className="font-bold">Standard</TableHead>
                <TableHead className="font-bold">Subject</TableHead>
                <TableHead className="font-bold">Month</TableHead>
                <TableHead className="font-bold">Year</TableHead>
                <TableHead className="font-bold">Marks</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Difficulty</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questionPaperData.length > 0 ? (
                paginatedData.map((qP) => (
                  <TableRow key={qP.id}>
                    <TableCell>{qP.board.displayName}</TableCell>
                    <TableCell>{qP.standard.sortKey}</TableCell>
                    <TableCell>{qP.subject.sortKey}</TableCell>
                    <TableCell>{qP.month}</TableCell>
                    <TableCell>{qP.year}</TableCell>
                    <TableCell>{qP.totalMarks}</TableCell>
                    <TableCell>{qP.attributes.type}</TableCell>
                    <TableCell>{qP.attributes.difficulty}</TableCell>
                    <TableCell>
                      {qP.isActive ? (
                        <p className="text-green-200 font-semibold bg-green-700 w-min px-3 py-1 rounded-sm">
                          Active
                        </p>
                      ) : (
                        <p className="text-red-200 font-semibold bg-red-700 w-min px-3 py-1 rounded-sm">
                          Inactive
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{qP.createdAt.split("T")[0]}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="font-redhat font-semibold"
                          align="end"
                        >
                          <DropdownMenuItem onClick={() => handleEdit(qP)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleActivate(qP.id)}
                          >
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeactivate(qP.id)}
                          >
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemove(qP.id)}
                            className="cursor-pointer flex items-center gap-x-4 text-red-700"
                          >
                            <Trash className="w-4 h-4 text-red-700" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6">
                    No question papers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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

export default FetchAllQuestionPaper;
