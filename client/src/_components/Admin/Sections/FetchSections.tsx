import {
  getAllSections,
  addSection,
  removeSection,
  editSection,
  softDeleteSection,
} from "@/api/sections";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { fetchActiveBoards } from "@/api/boards";
import { fetchActiveStandards } from "@/api/standards";
import { getAllActiveSubjects } from "@/api/subjects";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

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

const FetchSections = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [subjectData, setSubjectData] = useState<Subjects[]>([]);
  const { user } = useAuth0();

  // Form States
  const [sortKey, setSortKey] = useState("");
  const [boardId, setBoardId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [displayName, setDisplayName] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPriority, setEditPriority] = useState<number>(0);
  const [editIsActive, setEditIsActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const fetchAllSections = async () => {
    setLoading(true);
    try {
      const response = await getAllSections();
      setSections(response.data.data);
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
    fetchAllSections();
    loadBoards();
    loadStandards();
    loadSubjects();
  }, []);

  const handleAddSection = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (sectionId: string) => {
    setLoading(true);
    try {
      await removeSection(sectionId);
      fetchAllSections();
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (section: any) => {
    setSelectedSection(section);
    setEditDisplayName(section.sectionJson?.attributes?.displayName || "");
    setEditPriority(section.sectionJson?.priority || 0);
    setEditIsActive(section.isActive);
    setEditDialogOpen(true);
  };

  const handleEditSection = async () => {
    setLoading(true);
    try {
      await editSection(
        selectedSection.id,
        editDisplayName,
        String(editPriority),
        editIsActive,
        user?.sub as string
      );
      setEditDialogOpen(false);
      fetchAllSections();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactive = async (id: string) => {
    setLoading(true);
    try {
      const performedBy = user?.sub;
      await softDeleteSection(id, performedBy!);
      fetchAllSections();
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
          <h6 className="font-outfit text-xl font-medium">Sections</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="font-redhat">
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-4 mt-4">
                <div>
                  <Label className="mb-2">Sort Key</Label>
                  <Input
                    type="text"
                    value={sortKey}
                    placeholder="eg. Mathematics"
                    onChange={(e) => setSortKey(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2">Board</Label>
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

                <div>
                  <Label className="mb-2">Standard</Label>
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

                <div>
                  <Label className="mb-2">Subject</Label>
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

                <div>
                  <Label className="mb-2">Priority</Label>
                  <Input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label className="mb-2">Display Name</Label>
                  <Input
                    type="text"
                    value={displayName}
                    placeholder="eg. Algebra"
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <Button
                  disabled={loading}
                  onClick={handleAddSection}
                  className="cursor-pointer"
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
              <TableCell>Section Name</TableCell>
              <TableCell>Board</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>
                  {section.sectionJson?.attributes?.displayName}
                </TableCell>
                <TableCell>{section.board.sortKey}</TableCell>
                <TableCell>{section.standard.sortKey}</TableCell>
                <TableCell>{section.subject.sortKey}</TableCell>
                <TableCell>{section.sectionJson?.priority}</TableCell>
                <TableCell>
                  {section.isActive ? (
                    <p className="text-green-600 font-semibold">Active</p>
                  ) : (
                    <p className="text-red-600 font-semibold">Inactive</p>
                  )}
                </TableCell>
                <TableCell>{section.createdAt.split("T")[0]}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-redhat font-semibold">
                      <DropdownMenuItem
                        onClick={() => handleEditOpen(section)}
                        className="cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Edit"
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeactive(section.id)}
                        className="cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Deactivate"
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleRemove(section.id)}
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
        </Table>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-4 mt-4">
              <div>
                <Label className="mb-2">Display Name</Label>
                <Input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-2">Priority</Label>
                <Input
                  type="number"
                  value={editPriority}
                  onChange={(e) => setEditPriority(Number(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Is Active</Label>
                <Switch
                  checked={editIsActive}
                  onCheckedChange={() => setEditIsActive(!editIsActive)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={loading} onClick={handleEditSection}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default FetchSections;
