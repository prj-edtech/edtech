"use client";

import {
  fetchStandards,
  createStandard,
  setActiveStandard,
  softDeleteStandard,
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
import { MoreHorizontal, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Standard {
  id: string;
  partitionKey: string;
  sortKey: string;
  isActive: boolean;
  createdBy: string;
  board?: {
    sortKey: string;
    displayName: string;
  };
}

const FetchAllStandards = () => {
  const [data, setData] = useState<Standard[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    sortKey: "",
    displayName: "",
    createdBy: "admin@system.com",
  });
  const { toast } = useToast();

  useEffect(() => {
    getStandards();
  }, []);

  const getStandards = async () => {
    const response = await fetchStandards();
    setData(response.data);
  };

  const handleAddStandard = async () => {
    try {
      await createStandard({
        sortKey: formState.sortKey,
        displayName: formState.displayName,
        createdBy: formState.createdBy,
      });
      toast({ description: "Standard created successfully." });
      getStandards();
      setOpenAddDialog(false);
      resetForm();
    } catch (error) {
      toast({
        description: "Failed to create standard.",
        variant: "destructive",
      });
    }
  };

  const handleEditStandard = async () => {
    try {
      await setActiveStandard(formState.id, {
        isActive: true,
        updatedBy: formState.createdBy,
      });
      toast({ description: "Standard activated successfully." });
      getStandards();
      setOpenEditDialog(false);
      resetForm();
    } catch (error) {
      toast({
        description: "Failed to edit standard.",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await setActiveStandard(id, {
        isActive: !currentStatus,
        updatedBy: "admin@system.com",
      });
      toast({
        description: `Standard ${
          !currentStatus ? "activated" : "deactivated"
        } successfully.`,
      });
      getStandards();
    } catch (error) {
      toast({
        description: "Failed to update standard.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await softDeleteStandard(id, { performedBy: "admin@system.com" });
      toast({ description: "Standard deleted successfully." });
      getStandards();
    } catch (error) {
      toast({
        description: "Failed to delete standard.",
        variant: "destructive",
      });
    }
  };

  const openEditDialogWithData = (standard: Standard) => {
    setFormState({
      id: standard.id,
      sortKey: standard.sortKey,
      displayName: standard.board?.displayName || "",
      createdBy: "admin@system.com",
    });
    setOpenEditDialog(true);
  };

  const resetForm = () => {
    setFormState({
      id: "",
      sortKey: "",
      displayName: "",
      createdBy: "admin@system.com",
    });
  };

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10">
      <div className="flex flex-col w-full border rounded-2xl shadow min-h-screen lg:p-8 gap-y-8">
        <div className="flex justify-between items-center w-full">
          <h6 className="font-outfit text-xl font-medium">Standards</h6>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-1.5 font-outfit text-base font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Standard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Standard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Sort Key</Label>
                  <Input
                    value={formState.sortKey}
                    onChange={(e) =>
                      setFormState({ ...formState, sortKey: e.target.value })
                    }
                    placeholder="Sort Key"
                  />
                </div>
                <div>
                  <Label>Display Name</Label>
                  <Input
                    value={formState.displayName}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        displayName: e.target.value,
                      })
                    }
                    placeholder="Display Name"
                  />
                </div>
                <Button onClick={handleAddStandard} className="w-full">
                  Create Standard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Partition Key</TableHead>
              <TableHead>Sort Key</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Board Sort Key</TableHead>
              <TableHead>Board Display Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>{standard.partitionKey}</TableCell>
                <TableCell>{standard.sortKey}</TableCell>
                <TableCell>{standard.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{standard.board?.sortKey || "-"}</TableCell>
                <TableCell>{standard.board?.displayName || "-"}</TableCell>
                <TableCell>{standard.createdBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => openEditDialogWithData(standard)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleToggleActive(standard.id, standard.isActive)
                        }
                      >
                        {standard.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(standard.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Standard (Activate)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Sort Key</Label>
                <Input value={formState.sortKey} disabled />
              </div>
              <div>
                <Label>Display Name</Label>
                <Input value={formState.displayName} disabled />
              </div>
              <Button onClick={handleEditStandard} className="w-full">
                Activate Standard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FetchAllStandards;
