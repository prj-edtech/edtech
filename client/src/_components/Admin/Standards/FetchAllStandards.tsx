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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredData = data.filter(
    (standard) =>
      standard.sortKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.partitionKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.board?.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      standard.board?.sortKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    getStandards();
    getBoards();
  }, []);

  const getStandards = async () => {
    setLoading(true);
    try {
      const response = await fetchStandards();
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      await removeStandard(id, user?.sub!);
      toast("Standard removed permanently");
      getStandards();
    } catch (error) {
      console.error(error);
      toast("Failed to remove standard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10 font-redhat font-medium">
      <div className="flex justify-start items-center w-full lg:px-10 px-8 py-4 lg:py-8 flex-col lg:gap-y-8 gap-y-4 min-h-screen">
        <div className="flex justify-between items-center lg:p-6 p-3 w-full border shadow-xs rounded-sm border-blue-800/20">
          <div className="flex justify-between items-center lg:w-[200px] border">
            <input
              placeholder="Search standards..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page when search changes
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
                <Plus className="h-4 w-4 mr-2" />
                Add Standard
              </Button>
            </DialogTrigger>
            <DialogContent className="font-redhat">
              <DialogHeader>
                <DialogTitle className="font-bold lg:mb-4">
                  Add Standard
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
                  <div>
                    <Label className="mb-2 mt-4">Standard</Label>
                    <Input
                      value={formState.sortKey}
                      onChange={(e) =>
                        setFormState({ ...formState, sortKey: e.target.value })
                      }
                      placeholder="E.g. XI"
                    />
                  </div>
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

        <Table className="border border-blue-800/20">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Standard</TableHead>
              <TableHead className="font-bold">Board</TableHead>
              <TableHead className="font-bold"></TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>{standard.sortKey}</TableCell>
                <TableCell>{standard.board?.sortKey || "-"}</TableCell>
                <TableCell>{standard.board?.displayName || "-"}</TableCell>
                <TableCell>
                  {standard.isActive ? (
                    <p className="text-green-200 font-semibold bg-green-700 w-min px-3 py-1 rounded-sm">
                      Active
                    </p>
                  ) : (
                    <p className="text-red-200 font-semibold bg-red-700 w-min px-3 py-1 rounded-sm">
                      Inactive
                    </p>
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

        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                // disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                // disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default FetchAllStandards;
