import { useEffect, useState } from "react";
import { fetchAuditLogs } from "@/api/auditTrail";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const FetchAllLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLogs = async () => {
      try {
        const response = await fetchAuditLogs();
        console.log(response.data.data);
        setLogs(response.data.data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    getLogs();
  }, []);

  if (loading) {
    return <div className="p-4">Loading logs...</div>;
  }

  return (
    <div className="p-6">
      <div className="border rounded-2xl shadow p-4">
        <h2 className="text-xl font-outfit font-semibold mb-4">Audit Logs</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Performed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.performedBy}</TableCell>
                    <TableCell>{log.performedAt.split("T")[0]}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FetchAllLogs;
