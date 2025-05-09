import { getAllSubtopics } from "@/api/subtopics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FetchSubtopics = () => {
  const [subtopics, setSubtopics] = useState<any[]>([]); // Store fetched subtopics

  // Fetch subtopics from API
  const loadSubtopics = async () => {
    try {
      const response = await getAllSubtopics();
      setSubtopics(response); // Set the fetched subtopics
    } catch (error) {
      console.error(error);
    }
  };

  // Trigger the fetch on component mount
  useEffect(() => {
    loadSubtopics();
  }, []);

  if (subtopics.length === 0) {
    return <h1>Subtopic data is empty</h1>;
  }

  return (
    <div className="flex flex-col p-20 font-outfit">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Topics</h6>
          <Button
            variant="outline"
            className="px-6 py-1.5 font-outfit text-base font-medium"
          >
            <Link
              to="/admin/subtopics/add"
              className="flex items-center gap-x-2"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Subtopic
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subtopic ID</TableHead>
              <TableHead>Topic ID</TableHead>
              <TableHead>Section ID</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content storage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subtopics.map((subtopic) => (
              <TableRow key={subtopic.subTopicId}>
                <TableCell>{subtopic.subTopicId}</TableCell>
                <TableCell>{subtopic.topicId}</TableCell>
                <TableCell>{subtopic.sectionId}</TableCell>
                <TableCell>{subtopic.priority}</TableCell>
                <TableCell>
                  {subtopic.isActive ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>https://{subtopic.subtopicContentPath}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FetchSubtopics;
