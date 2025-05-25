import { useEffect, useState } from "react";
import { getAllChangeLogs } from "@/api/changeLogs";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ChangeLog {
  changeLogId: string;
  entityType: string;
  changeType: string;
  changeStatus: string;
  User: {
    name: string;
    role: string;
  };
  submittedAt: string;
}

const FetchAllChangeLogs = () => {
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const fetchChangeLogs = async () => {
      try {
        const response = await getAllChangeLogs();
        setChangeLogs(response.data.data);
      } catch (error) {
        console.error("Error fetching change logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeLogs();
  }, []);

  const columns: ColumnDef<ChangeLog>[] = [
    {
      accessorKey: "entityType",
      header: "Entity Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "changeType",
      header: "Change Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "changeStatus",
      header: "Status",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "User.name",
      header: "Name",
      cell: ({ row }) => row.original.User.name,
    },
    {
      accessorKey: "User.role",
      header: "Role",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.User.role}</span>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) =>
        new Date(row.original.submittedAt).toLocaleTimeString(),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.original.submittedAt?.split("T")[0],
    },
  ];

  const table = useReactTable({
    data: changeLogs,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 font-redhat">
      <div className="p-4">
        {/* <h2 className="lg:text-2xl font-bold lg:mb-6">Change Logs</h2> */}

        {/* <div className="mb-4">
          <Input
            placeholder="Search logs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-md"
          />
        </div> */}

        <div className="flex justify-between items-center lg:w-[200px] border lg:mb-10">
          <input
            placeholder="Search change logs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="placeholder:text-sm lg:pl-2 focus:outline-none focus:ring-0"
          />

          <Button className="rounded-none" size="sm">
            Search
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="border border-blue-800/20">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4"
                  >
                    No change logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FetchAllChangeLogs;
