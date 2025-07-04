import { useEffect, useState } from "react";
import {
  activateQuestion,
  approveQuestion,
  deactivateQuestion,
  deleteQuestion,
  getAllQuestions,
  rejectQuestion,
  resetQuestion,
} from "@/api/questions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  text: string;
  marks: number;
  difficulty: string;
  questionType: string;
  isActive: boolean;
  createdAt: string;
  review: string;
  questionContentPath: string;
  questionAnswerPath: string;
  attributes: {
    notes: string;
    heading: string;
    questionInstruction: string;
  };
  questionPaper: {
    board: {
      sortKey: string;
    };
    standard: {
      sortKey: string;
    };
    subject: {
      sortKey: string;
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

  const [reviewStatus, setReviewStatus] = useState<
    "approve" | "reject" | "reset" | ""
  >("");

  const [questionContent, setQuestionContent] = useState<any>(null);
  const [questionAnswer, setQuestionAnswer] = useState<any>(null);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.questionPaper.board.sortKey
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      q.questionPaper.standard.sortKey
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      q.questionPaper.subject.sortKey
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
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

  useEffect(() => {
    const fetchJson = async () => {
      if (!selectedQuestion) return;

      try {
        const [contentRes, answerRes] = await Promise.all([
          fetch(selectedQuestion.questionContentPath),
          fetch(selectedQuestion.questionAnswerPath),
        ]);

        const contentJson = await contentRes.json();
        const answerJson = await answerRes.json();

        setQuestionContent(contentJson);
        setQuestionAnswer(answerJson);
      } catch (err) {
        console.error("Failed to fetch question files:", err);
      }
    };

    fetchJson();
  }, [selectedQuestion]);

  const handleRemove = async (id: string) => {
    setLoading(true);
    console.log(id);
    try {
      await deleteQuestion(id, user?.sub!);
      loadQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      await activateQuestion(id, user?.sub!);
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
      await deactivateQuestion(id, user?.sub!);
      loadQuestions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (id: string) => {
  //   setLoading(true);
  //   console.log(id);
  //   try {
  //     await approveQuestion(id, user?.sub!);
  //     loadQuestions();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleReject = async (id: string) => {
  //   setLoading(true);
  //   console.log(id);
  //   try {
  //     await rejectQuestion(id, user?.sub!);
  //     loadQuestions();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleReset = async (id: string) => {
  //   setLoading(true);
  //   console.log(id);
  //   try {
  //     await resetQuestion(id, user?.sub!);
  //     loadQuestions();
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

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
              <TableHead>Board</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Review</TableHead>
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
                  <TableCell>{q.questionPaper.board.sortKey}</TableCell>
                  <TableCell>{q.questionPaper.standard.sortKey}</TableCell>
                  <TableCell>{q.questionPaper.subject.sortKey}</TableCell>
                  <TableCell className="font-semibold">{q.review}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedQuestion(q);
                            setOpenReviewDialog(true);
                          }}
                        >
                          Review
                        </DropdownMenuItem>

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

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onOpenChange={(open) => {
          setOpenReviewDialog(open);
          if (!open) {
            setSelectedQuestion(null);
            setQuestionContent(null);
            setQuestionAnswer(null);
            setReviewStatus("");
          }
        }}
      >
        <DialogContent className="font-redhat">
          <DialogHeader className="mb-4">
            <DialogTitle>Review Question</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Content</Label>
                <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto max-h-48 mt-2">
                  {JSON.stringify(questionContent, null, 2)}
                </pre>
              </div>
              <div>
                <Label>Answer</Label>
                <pre className="bg-muted p-2 rounded-md text-sm overflow-x-auto max-h-48 mt-2">
                  {JSON.stringify(questionAnswer, null, 2)}
                </pre>
              </div>
              <div>
                <Label>Review Status</Label>
                <Select
                  value={reviewStatus}
                  onValueChange={async (value) => {
                    setReviewStatus(value as "approve" | "reject" | "reset");

                    switch (value) {
                      case "approve":
                        await approveQuestion(selectedQuestion.id, user?.sub!);
                        break;
                      case "reject":
                        await rejectQuestion(selectedQuestion.id, user?.sub!);
                        break;
                      case "reset":
                        await resetQuestion(selectedQuestion.id, user?.sub!);
                        break;
                    }

                    setOpenReviewDialog(false);
                    loadQuestions();
                  }}
                >
                  <SelectTrigger className="w-[180px] mt-2 cursor-pointer">
                    <SelectValue placeholder="Select review status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="reset">Reset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
