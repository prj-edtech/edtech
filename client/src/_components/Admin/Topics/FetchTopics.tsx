import { useEffect, useState } from "react";
import { addTopics, fetchAllTopics } from "@/api/topics";
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
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";

const FetchAllTopics = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [priority, setPriority] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { user } = useAuth0();

  const loadTopics = async () => {
    try {
      const response = await fetchAllTopics();
      setTopics(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  // 🔹 Handle Add Topic Submit
  const handleAddTopic = async () => {
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

      // Clear form fields
      setBoardId("");
      setStandardId("");
      setSubjectId("");
      setSectionId("");
      setPriority("");
      setDisplayName("");

      // Close dialog and reload topics
      setOpenAddDialog(false);
      loadTopics();
    } catch (error) {
      console.error(error);
      alert("Failed to add topic. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col p-20 font-outfit">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Topics</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-1.5 font-outfit text-base font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="lg:mb-10 font-outfit">
                <DialogTitle>Add New Topic</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-6">
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Board ID</Label>
                  <Input
                    type="text"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value)}
                  />
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Standard ID</Label>
                  <Input
                    type="text"
                    value={standardId}
                    onChange={(e) => setStandardId(e.target.value)}
                  />
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Subject ID</Label>
                  <Input
                    type="text"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  />
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Section ID</Label>
                  <Input
                    type="text"
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                  />
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
                  <Label>Display Name</Label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="flex justify-start items-start w-full flex-col gap-y-2">
                  <Label>Created By</Label>
                  <Input type="text" value={user?.sub} disabled />
                </div>
                <Button
                  onClick={handleAddTopic}
                  className="mt-4 cursor-pointer"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic Name</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Partition Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>
                      {topic.topicJson.attributes.displayName}
                    </TableCell>
                    <TableCell>{topic.priority}</TableCell>
                    <TableCell>{topic.partitionKey}</TableCell>
                    <TableCell>
                      {topic.isActive ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactive
                        </span>
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
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Deactivate</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default FetchAllTopics;
