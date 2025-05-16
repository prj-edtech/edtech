import { useEffect, useState } from "react";
import { getAllChangeLogs } from "@/api/changeLogs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const FetchAllChangeLogs = () => {
  const [changeLogs, setChangeLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeLogs = async () => {
      try {
        const response = await getAllChangeLogs();
        console.log(response.data.data);
        setChangeLogs(response.data.data);
      } catch (error) {
        console.error("Error fetching change logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="border rounded-2xl shadow p-4">
        <h2 className="text-xl font-outfit font-semibold mb-4">Change Logs</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Type</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-redhat">
              {changeLogs.length > 0 ? (
                changeLogs.map((log) => (
                  <TableRow key={log.changeLogId}>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.changeType}</TableCell>
                    <TableCell>{log.changeStatus}</TableCell>
                    <TableCell>{log.submittedAt?.split("T")[0]}</TableCell>
                    <TableCell>{log.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No change logs found.
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

export default FetchAllChangeLogs;
