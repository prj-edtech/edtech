import { useEffect, useState } from "react";
import { getAllQuestionPaper, addQuestionPaper } from "@/api/questionPapers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { fetchActiveStandards } from "@/api/standards";
import { getAllActiveSubjects } from "@/api/subjects";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth0 } from "@auth0/auth0-react";

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
  const [questionPaperData, setQuestionPaperData] = useState<any[]>([]);
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

  const loadStandards = async () => {
    const response = await fetchActiveStandards();
    setStandardData(response.data);
  };

  const loadSubjects = async () => {
    const response = await getAllActiveSubjects();
    setSubjectData(response.data.data);
  };

  useEffect(() => {
    loadQuestionPapers();
    loadBoards();
    loadStandards();
    loadSubjects();
  }, []);

  const handleRemove = (id: string) => {
    console.log("Remove Question Paper:", id);
  };

  const handleEdit = (qp: any) => {
    console.log("Edit Question Paper:", qp);
  };

  const handleActivate = (id: string) => {
    console.log("Activate Question Paper:", id);
  };

  const handleDeactivate = (id: string) => {
    console.log("Deactivate Question Paper:", id);
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
    }
  };

  return (
    <div className="flex flex-col p-20 font-redhat">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Question Papers</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Question Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Question Paper</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div>
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

                <div>
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

                <div>
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

                <div>
                  <Label>Year</Label>
                  <Input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Month</Label>
                  <Input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Total Marks</Label>
                  <Input
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Input
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddQuestionPaper} className="mt-4">
                  Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Board</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionPaperData.length > 0 ? (
                  questionPaperData.map((qP) => (
                    <TableRow key={qP.id}>
                      <TableCell>{qP.board.displayName}</TableCell>
                      <TableCell>{qP.standard.sortKey}</TableCell>
                      <TableCell>{qP.subject.sortKey}</TableCell>
                      <TableCell>
                        {qP.month}/{qP.year}
                      </TableCell>
                      <TableCell>{qP.totalMarks}</TableCell>
                      <TableCell>{qP.attributes.type}</TableCell>
                      <TableCell>{qP.attributes.difficulty}</TableCell>
                      <TableCell>
                        {qP.isActive ? (
                          <p className="text-green-600 font-semibold">Active</p>
                        ) : (
                          <p className="text-red-600 font-semibold">Inactive</p>
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
                          <DropdownMenuContent align="end">
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
                              className="text-red-700"
                            >
                              <Trash className="w-4 h-4" /> Remove
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
        </CardContent>
      </Card>
    </div>
  );
};

export default FetchAllQuestionPaper;
