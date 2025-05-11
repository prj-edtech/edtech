import { getAllSections, addSection } from "@/api/sections";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const FetchSections = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { user } = useAuth0();

  // Form States
  const [sortKey, setSortKey] = useState("");
  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [displayName, setDisplayName] = useState("");

  const fetchAllSections = async () => {
    try {
      const response = await getAllSections();
      setSections(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSection = async () => {
    try {
      await addSection({
        sortKey,
        boardId,
        standardId,
        subjectId,
        priority,
        displayName,
        createdBy: user?.sub as string,
      });
      setOpenAddDialog(false);
      // Clear form values
      setSortKey("");
      setBoardId("");
      setStandardId("");
      setSubjectId("");
      setPriority(0);
      setDisplayName("");
      fetchAllSections();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSections();
  }, []);

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
                <Plus className="w-4 h-4 mr-2" /> Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                <div>
                  <Label>Sort Key</Label>
                  <Input
                    type="text"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Board ID</Label>
                  <Input
                    type="text"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Standard ID</Label>
                  <Input
                    type="text"
                    value={standardId}
                    onChange={(e) => setStandardId(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Subject ID</Label>
                  <Input
                    type="text"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <Input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label>Display Name</Label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <Button onClick={handleAddSection}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Section Name</TableCell>
              <TableCell>Board</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Is Active</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>
                  {section.sectionJson?.attributes?.displayName}
                </TableCell>
                <TableCell>{section.boardId}</TableCell>
                <TableCell>{section.standardId}</TableCell>
                <TableCell>{section.subjectId}</TableCell>
                <TableCell>{section.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{section.sectionJson?.priority}</TableCell>
                <TableCell>
                  {new Date(section.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(section.updatedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FetchSections;
