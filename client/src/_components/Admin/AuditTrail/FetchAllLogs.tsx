import { useEffect, useState } from "react";
import { deleteAllAuditLogs, fetchAuditLogs } from "@/api/auditTrail";
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

interface AuditLog {
  id: string;
  entityType: string;
  action: string;
  user: {
    name: string;
    role: string;
  };
  performedAt: string;
}

const FetchAllLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const getLogs = async () => {
    try {
      const response = await fetchAuditLogs();
      setLogs(response.data.data);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAllAuditLogs();
      getLogs();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "entityType",
      header: "Entity Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "user.name",
      header: "User",
      cell: ({ row }) => row.original.user.name,
    },
    {
      accessorKey: "user.role",
      header: "Role",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.user.role}</span>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) =>
        new Date(row.original.performedAt).toLocaleTimeString(),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.original.performedAt.split("T")[0],
    },
  ];

  const table = useReactTable({
    data: logs,
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
        {/* <h2 className="lg:text-2xl font-bold lg:mb-6">Audit Logs</h2>

        <div className="mb-4">
          <Input
            placeholder="Search Audit logs..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full max-w-md"
          />
        </div> */}

        <div className="flex justify-between items-center w-full">
          <div className="flex justify-between items-center lg:w-[200px] border lg:mb-6">
            <input
              placeholder="Search audit logs..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="lg:placeholder:text-sm placeholder:text-sm pl-2 focus:outline-none focus:ring-0"
            />

            <Button className="rounded-none" size="sm">
              Search
            </Button>
          </div>

          <Button
            onClick={handleDelete}
            className="rounded-none lg:block hidden"
          >
            Delete All
          </Button>
        </div>

        <div className="overflow-x-auto lg:mt-0 mt-6">
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
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
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

export default FetchAllLogs;
