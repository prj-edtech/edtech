import {
  fetchStandards,
  createStandard,
  softDeleteStandard,
  removeStandard,
  activateStandard,
} from "@/api/standards";
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
import { toast } from "sonner";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchActiveBoards } from "@/api/boards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Standard {
  id: string;
  partitionKey: string;
  sortKey: string;
  isActive: boolean;
  createdBy: string;
  board?: {
    id: string;
    sortKey: string;
    displayName: string;
  };
}

interface Board {
  id: string;
  displayName: string;
}

const FetchAllStandards = () => {
  const [data, setData] = useState<Standard[]>([]);
  const [boardData, setBoardData] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [formState, setFormState] = useState({
    boardId: "",
    sortKey: "",
  });

  useEffect(() => {
    getStandards();
    getBoards();
  }, []);

  const getStandards = async () => {
    const response = await fetchStandards();
    setData(response.data);
  };

  const getBoards = async () => {
    const response = await fetchActiveBoards();
    setBoardData(response.data.data);
  };

  const handleAddStandard = async () => {
    if (!formState.sortKey || !formState.boardId) {
      toast("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await createStandard({
        sortKey: formState.sortKey,
        boardId: formState.boardId,
        createdBy: user?.sub!,
      });
      toast("Standard created successfully.");
      getStandards();
      setOpenAddDialog(false);
      resetForm();
    } catch (error) {
      toast("Failed to create standard.");
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    setLoading(true);
    try {
      await softDeleteStandard(id, { performedBy: user?.sub! });
      toast("Standard deactivated successfully.");
      getStandards();
    } catch (error) {
      toast("Failed to deactivate standard.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    try {
      await activateStandard(id, { performedBy: user?.sub! });
      toast("Standard activated successfully.");
      getStandards();
    } catch (error) {
      toast("Failed to activate standard.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      boardId: "",
      sortKey: "",
    });
  };

  const handleRemoveStandard = async (id: string) => {
    setLoading(true);
    try {
      await removeStandard(id);
      toast("Standard removed permanently");
      getStandards();
    } catch (error) {
      console.error(error);
      toast("Failed to remove standard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10 font-redhat">
      <div className="flex flex-col w-full border rounded-2xl shadow min-h-screen lg:p-8 gap-y-8">
        <div className="flex justify-between items-center w-full">
          <h6 className="font-outfit text-xl font-medium">Standards</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Standard
              </Button>
            </DialogTrigger>
            <DialogContent className="font-redhat">
              <DialogHeader>
                <DialogTitle className="font-bold">Add Standard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 mt-4">Sort Key</Label>
                  <Input
                    value={formState.sortKey}
                    onChange={(e) =>
                      setFormState({ ...formState, sortKey: e.target.value })
                    }
                    placeholder="E.g. XI"
                  />
                </div>
                <div>
                  <Label className="mb-2">Board</Label>
                  {/* <Input
                    value={formState.boardId}
                    onChange={(e) =>
                      setFormState({ ...formState, boardId: e.target.value })
                    }
                    placeholder="Board ID"
                  /> */}
                  <Select
                    value={formState.boardId}
                    onValueChange={(value) =>
                      setFormState({ ...formState, boardId: value })
                    }
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

                <Button
                  onClick={handleAddStandard}
                  className="w-full cursor-pointer"
                  disabled={loading}
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

        <Table className="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Partition Key</TableHead>
              <TableHead>Sort Key</TableHead>
              <TableHead>Board Sort Key</TableHead>
              <TableHead>Board Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>{standard.partitionKey}</TableCell>
                <TableCell>{standard.sortKey}</TableCell>
                <TableCell>{standard.board?.sortKey || "-"}</TableCell>
                {loading && (
                  <TableCell className="flex justify-center items-center w-full">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </TableCell>
                )}
                <TableCell>{standard.board?.displayName || "-"}</TableCell>
                <TableCell>
                  {standard.isActive ? (
                    <p className="text-green-600 font-semibold">Active</p>
                  ) : (
                    <p className="text-red-600 font-semibold">Inactive</p>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-redhat font-semibold">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleActivate(standard.id)}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Activate"
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleSoftDelete(standard.id)}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Deactivate"
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveStandard(standard.id)}
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
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FetchAllStandards;
