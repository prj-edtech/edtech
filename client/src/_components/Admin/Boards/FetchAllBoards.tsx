import {
  fetchBoards,
  createBoard,
  updateBoard,
  softDeleteBoard,
  removeBoard,
} from "@/api/boards";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth0 } from "@auth0/auth0-react";
import { Switch } from "@/components/ui/switch";

interface Board {
  id: string;
  partitionKey: string;
  sortKey: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

const FetchAllBoards = () => {
  const [data, setData] = useState<Board[]>([]);
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSyllabusVersion, setEditSyllabusVersion] = useState("");
  const [editSubjects, setEditSubjects] = useState("");

  const [softDeleteOpen, setSoftDeleteOpen] = useState(false);
  const [boardToSoftDelete, setBoardToSoftDelete] = useState<Board | null>(
    null
  );

  const { user } = useAuth0();

  useEffect(() => {
    const getBoards = async () => {
      setLoading(true);
      try {
        const response = await fetchBoards();
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getBoards();
  }, []);

  const handleAddBoard = async () => {
    setLoading(true);
    try {
      await createBoard({
        sortKey,
        displayName,
        createdBy: user?.sub!,
      });
      setSortKey("");
      setDisplayName("");
      setOpen(false);
      const response = await fetchBoards();
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to create board", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (board: Board) => {
    setSelectedBoard(board);
    setEditDisplayName(board.displayName);
    setEditIsActive(board.isActive);
    setEditSyllabusVersion(""); // default, you can prefill if your API provides
    setEditSubjects(""); // comma-separated string
    setEditOpen(true);
  };

  const handleUpdateBoard = async () => {
    if (!selectedBoard) return;
    setLoading(true);
    try {
      await updateBoard(selectedBoard.id, {
        displayName: editDisplayName,
        isActive: editIsActive,
        updatedBy: user?.sub!,
        boardJson: {
          syllabusVersion: editSyllabusVersion,
          subjects: editSubjects.split(",").map((s) => s.trim()),
        },
      });
      setEditOpen(false);
      const response = await fetchBoards();
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to update board", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDeleteBoard = async () => {
    if (!boardToSoftDelete) return;
    setLoading(true);
    try {
      await softDeleteBoard(boardToSoftDelete.id, {
        performedBy: user?.sub!,
      });
      setSoftDeleteOpen(false);
      const response = await fetchBoards();
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to soft delete board", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBoard = async (board: Board) => {
    setLoading(true);
    try {
      await removeBoard(board.id);
      const response = await fetchBoards();
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to remove board", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10 font-redhat font-medium">
      <div className="flex justify-start items-center w-full lg:px-10 px-8 py-4 lg:py-8 flex-col lg:gap-y-8 gap-y-4 border rounded-2xl shadow min-h-screen">
        <div className="flex justify-between items-center lg:p-6 p-3 w-full">
          <h6 className="font-outfit lg:text-xl font-medium">
            Education Boards
          </h6>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md font-redhat">
              <DialogHeader>
                <DialogTitle>Add New Board</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sortKey" className="text-right">
                    Sort Key
                  </Label>
                  <Input
                    id="sortKey"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBoard}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Add Board"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table className="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Sort Key</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Partition Key</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((board) => (
              <TableRow key={board.id}>
                <TableCell>{board.sortKey}</TableCell>
                <TableCell>{board.displayName}</TableCell>
                <TableCell>{board.partitionKey}</TableCell>
                <TableCell>{board.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-redhat font-semibold">
                      <DropdownMenuItem
                        onClick={() => openEditDialog(board)}
                        className="cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setBoardToSoftDelete(board);
                          setSoftDeleteOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveBoard(board)}
                        className="cursor-pointer flex items-center gap-x-4 text-red-700"
                      >
                        <Trash className="w-4 h-4 text-red-700" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow>
                <TableCell>
                  <div className="flex justify-center items-center w-full">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Display Name</Label>
              <Input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Is Active</Label>
              <Switch
                checked={editIsActive}
                onCheckedChange={setEditIsActive}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Syllabus Version</Label>
              <Input
                value={editSyllabusVersion}
                onChange={(e) => setEditSyllabusVersion(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Subjects (comma separated)</Label>
              <Input
                value={editSubjects}
                onChange={(e) => setEditSubjects(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBoard} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={softDeleteOpen} onOpenChange={setSoftDeleteOpen}>
        <DialogContent className="sm:max-w-md font-redhat">
          <DialogHeader>
            <DialogTitle>Deactivate Board</DialogTitle>
          </DialogHeader>
          <div className="flex justify-start items-start w-full flex-col gap-y-2">
            <div className="flex items-center justify-start w-full gap-x-2">
              <Label className="text-right">Admin</Label>
              <Input value={user?.sub} disabled className="col-span-3" />
            </div>
            <p className="text-sm text-gray-500 col-span-4">
              Are you sure you want to deactivate{" "}
              <span className="font-medium">
                {boardToSoftDelete?.displayName}
              </span>
              ?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSoftDeleteOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSoftDeleteBoard}
              disabled={loading}
              className="cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Deactivate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FetchAllBoards;
