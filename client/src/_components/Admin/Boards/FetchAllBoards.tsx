import { fetchBoards } from "@/api/boards";
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
import { MoreHorizontal } from "lucide-react";

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

  useEffect(() => {
    const getBoards = async () => {
      const response = await fetchBoards();
      console.log(response.data);
      setData(response.data.data);
    };

    getBoards();
  }, []);

  return (
    <div className="flex justify-start items-center w-full lg:px-32 lg:py-10">
      <div className="flex justify-start items-center w-full lg:px-10 lg:py-8 flex-col lg:gap-y-8 border rounded-2xl shadow min-h-screen">
        <div className="flex justify-between items-center lg:p-6 w-full">
          <h6 className="font-outfit text-xl font-medium">Education Boards</h6>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="px-6 py-1.5 font-outfit text-base font-medium"
              >
                Add Board
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
        <Table className="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Sort Key</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((board) => (
              <TableRow key={board.id}>
                <TableCell>{board.id}</TableCell>
                <TableCell>{board.sortKey}</TableCell>
                <TableCell>{board.displayName}</TableCell>
                <TableCell>{board.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>{board.createdBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => console.log("Edit", board.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => console.log("Deactivate", board.id)}
                      >
                        Deactivate
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

export default FetchAllBoards;
