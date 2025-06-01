import { useEffect, useState } from "react";
import { fetchAuditLogs } from "@/api/auditTrail";
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
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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

const AuditChart = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const getLogs = async () => {
    try {
      const response = await fetchAuditLogs();
      setLogs(response.data.data.slice(0, 7));
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

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
    <Card className="p-2 font-redhat">
      <div className="p-2">
        <h1 className="text-lg my-2 font-bold">Audit Logs:</h1>
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
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default AuditChart;
