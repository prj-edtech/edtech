import { useEffect, useState } from "react";
import {
  addTopics,
  editTopic,
  fetchAllTopics,
  removeTopic,
} from "@/api/topics";
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
import { useAuth0 } from "@auth0/auth0-react";
import { fetchActiveBoards } from "@/api/boards";
import { fetchActiveStandards } from "@/api/standards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllActiveSubjects } from "@/api/subjects";
import { getAllActiveSections } from "@/api/sections";

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
  const [topics, setTopics] = useState<any[]>([]);
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

  const [loading, setLoading] = useState(false);

  const { user } = useAuth0();

  const loadTopics = async () => {
    try {
      const response = await fetchAllTopics();
      setTopics(response.data.data);
    } catch (error) {
      console.error(error);
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

  const loadSections = async () => {
    const response = await getAllActiveSections();
    setSectiontData(response.data.data);
  };

  useEffect(() => {
    loadTopics();
    loadBoards();
    loadStandards();
    loadSubjects();
    loadSections();
  }, []);

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      await removeTopic(id);
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

  return (
    <div className="flex flex-col p-20 font-redhat">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Topics</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader className="lg:mb-10 font-outfit">
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
                  <Label>Display Name</Label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
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

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Section</TableHead>
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
                    <TableCell>
                      {topic.section.sectionJson.attributes.displayName}
                    </TableCell>
                    <TableCell>{topic.priority}</TableCell>
                    <TableCell>{topic.partitionKey}</TableCell>
                    <TableCell>
                      {topic.isActive ? (
                        <p className="text-green-600 font-semibold">Active</p>
                      ) : (
                        <p className="text-red-600 font-semibold">Inactive</p>
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
        </CardContent>
      </Card>
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
