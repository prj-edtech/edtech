import { getAllSubjects, AddSubject } from "@/api/subjects";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth0 } from "@auth0/auth0-react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const FetchSubjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useAuth0();

  const [sortKey, setSortKey] = useState("");
  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");

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
  }, []);

  const handleAddSubject = async () => {
    try {
      const newSubject = {
        sortKey,
        boardId,
        standardId,
        createdBy: user?.sub || "",
      };
      await AddSubject(newSubject);
      // Refresh subjects list after adding
      fetchAllSubjects();
      // Close the dialog and reset form
      setOpenAddDialog(false);
      setSortKey("");
      setBoardId("");
      setStandardId("");
    } catch (error) {
      console.error("Failed to add subject:", error);
    }
  };

  return (
    <div className="flex flex-col p-20 font-outfit">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Subjects</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-1.5 font-outfit text-base font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="lg:mb-10 font-outfit">
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <Label>Subject Name (SortKey)</Label>
                  <Input
                    type="text"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Board ID</Label>
                  <Input
                    type="text"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Standard ID</Label>
                  <Input
                    type="text"
                    value={standardId}
                    onChange={(e) => setStandardId(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <Label>Created By</Label>
                  <Input type="text" value={user?.sub} disabled />
                </div>

                <Button
                  onClick={handleAddSubject}
                  className="mt-4 cursor-pointer"
                >
                  Save
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
              <TableCell>Is Active</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>
                  {subject.subjectJson[0]?.attributes?.displayName}
                </TableCell>
                <TableCell>{subject.boardId}</TableCell>
                <TableCell>{subject.standardId}</TableCell>
                <TableCell>{subject.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {new Date(subject.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(subject.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FetchSubjects;
