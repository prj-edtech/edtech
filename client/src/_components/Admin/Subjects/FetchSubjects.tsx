import { fetchBoards } from "@/api/boards";
import { fetchStandards } from "@/api/standards";
import {
  getAllSubjects,
  addSubject,
  removeSubject,
  activeSubject,
  deactiveSubject,
} from "@/api/subjects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface Boards {
  id: string;
  displayName: string;
}

interface Standards {
  id: string;
  sortKey: string;
}

const FetchSubjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useAuth0();

  const [sortKey, setSortKey] = useState("");
  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchAllSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
    loadBoards();
    loadStandards();
  }, []);

  const loadBoards = async () => {
    const response = await fetchBoards();
    setBoardData(response.data.data);
  };

  const loadStandards = async () => {
    const response = await fetchStandards();
    setStandardData(response.data);
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
      // Close the dialog and reset form
      setOpenAddDialog(false);
      setSortKey("");
      setBoardId("");
      setStandardId("");
    } catch (error) {
      console.error("Failed to add subject:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (id: string) => {
    setLoading(true);
    try {
      await removeSubject(id);
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

  return (
    <div className="flex flex-col p-20 font-redhat">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Subjects</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="font-redhat">
              <DialogHeader className="lg:mb-10 font-outfit">
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <Label className="font-semibold">Subject Name</Label>
                  <Input
                    type="text"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                  />
                </div>
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Subject Name</TableCell>
              <TableCell>Board</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody className="flex justify-center items-center w-full">
              <TableRow className="flex justify-center items-center w-full">
                <TableCell className="flex justify-center items-center w-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    {subject.subjectJson[0]?.attributes?.displayName}
                  </TableCell>
                  <TableCell>{subject.boardId}</TableCell>
                  <TableCell>{subject.standardId}</TableCell>

                  <TableCell>
                    {subject.isActive ? (
                      <p className="text-green-600 font-semibold">Active</p>
                    ) : (
                      <p className="text-red-600 font-semibold">Inactive</p>
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
              ))}
            </TableBody>
          )}
        </Table>
      </Card>
    </div>
  );
};

export default FetchSubjects;
