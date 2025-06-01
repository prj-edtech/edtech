import { useEffect, useState } from "react";
import { getAllQuestions } from "@/api/questions";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  text: string;
  marks: number;
  difficulty: string;
  questionType: string;
  isActive: boolean;
  createdAt: string;
  attributes: {
    notes: string;
    heading: string;
    questionInstruction: string;
  };
  questionPaper: {
    attributes: {
      displayName: string;
    };
  };
}

const FetchAllQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const { user } = useAuth0();

  const filteredQuestions = questions.filter(
    (q) =>
      q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await getAllQuestions();
      console.log(response.data.data);
      setQuestions(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleRemove = async (id: string) => {
    setLoading(true);
    console.log(id);
    try {
      //   await removeQuestion(id, user?.sub!);
      loadQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q: Question) => {
    setSelectedQuestion(q);
    setOpenEditDialog(true);
  };

  const handleUpdateQuestion = async () => {
    if (!selectedQuestion) return;
    const payload = {
      text: selectedQuestion.text,
      marks: selectedQuestion.marks,
      type: selectedQuestion.questionType,
      difficulty: selectedQuestion.difficulty,
      updatedBy: user?.sub!,
    };
    console.log(payload);
    try {
      //   await updateQuestion(selectedQuestion.id, payload);
      setOpenEditDialog(false);
      loadQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    console.log(id);
    try {
      //   await activateQuestion(id, user?.sub!);
      loadQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    setLoading(true);
    console.log(id);
    try {
      //   await deactivateQuestion(id, user?.sub!);
      loadQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 w-full">
      {/* Search & Add */}
      <div className="flex justify-between items-center border p-4">
        <div className="flex items-center border">
          <input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
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
              <Plus className="w-4 h-4 mr-2" />
              <Link to="/admin/questions/add">Add Question</Link>
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : (
        <Table className="border border-blue-800/20">
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length > 0 ? (
              paginatedQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.questionType}</TableCell>
                  <TableCell>{q.marks}</TableCell>
                  <TableCell>
                    {q.isActive ? (
                      <p className="text-green-200 bg-green-700 px-3 py-1 w-min rounded-sm">
                        Active
                      </p>
                    ) : (
                      <p className="text-red-200 bg-red-700 px-3 py-1 w-min rounded-sm">
                        Inactive
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{q.createdAt.split("T")[0]}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(q)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Review</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActivate(q.id)}>
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(q.id)}
                        >
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(q.id)}
                          className="text-red-700"
                        >
                          <Trash className="w-4 h-4 mr-2 text-red-700" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No questions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {paginatedQuestions.length !== 0 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  isActive={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="flex flex-col gap-y-4">
              <Label>Question Text</Label>
              <Input
                value={selectedQuestion.text}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    text: e.target.value,
                  })
                }
              />
              <Label>Marks</Label>
              <Input
                value={selectedQuestion.marks}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    marks: Number(e.target.value),
                  })
                }
              />
              <Label>Type</Label>
              <Input
                value={selectedQuestion.questionType}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    questionType: e.target.value,
                  })
                }
              />
              <Label>Difficulty</Label>
              <Input
                value={selectedQuestion.difficulty}
                onChange={(e) =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    difficulty: e.target.value,
                  })
                }
              />
              <Button onClick={handleUpdateQuestion}>Update</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FetchAllQuestions;
