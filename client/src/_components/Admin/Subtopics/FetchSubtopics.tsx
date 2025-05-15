import {
  activateSubtopic,
  deactivateSubtopic,
  getAllSubtopics,
  removeSubtopic,
} from "@/api/subtopics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FetchSubtopics = () => {
  const [subtopics, setSubtopics] = useState<any[]>([]); // Store fetched subtopics
  const [loading, setLoading] = useState(false);

  // Fetch subtopics from API
  const loadSubtopics = async () => {
    setLoading(true);
    try {
      const response = await getAllSubtopics();
      setSubtopics(response); // Set the fetched subtopics
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger the fetch on component mount
  useEffect(() => {
    loadSubtopics();
  }, []);

  const handleDeactivate = async (id: string) => {
    setLoading(true);
    try {
      await deactivateSubtopic(id);
      loadSubtopics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: string) => {
    setLoading(true);
    try {
      await activateSubtopic(id);
      loadSubtopics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      await removeSubtopic(id);
      loadSubtopics();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (subtopics.length === 0) {
    return (
      <div className="flex flex-col p-20 font-redhat">
        <Card className="border shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between p-4">
            <h6 className="font-outfit text-xl font-medium">Subtopics</h6>
            <Button
              variant="outline"
              className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
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
                <TableHead>Subtopic Name</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Content storage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableCell>Subtopics data is empty</TableCell>
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-20 font-redhat">
      <Card className="border shadow-md rounded-2xl p-6">
        <div className="flex items-center justify-between p-4">
          <h6 className="font-outfit text-xl font-medium">Subtopics</h6>
          <Button
            variant="outline"
            className="lg:px-6 lg:py-1.5 font-outfit lg:text-base font-medium bg-purple-600 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-500 hover:shadow-md cursor-pointer"
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
              <TableHead>Subtopic</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content storage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subtopics.map((subtopic) => (
              <TableRow key={subtopic.subTopicId}>
                <TableCell className="max-w-32 truncate">
                  {subtopic.subTopicJson.attributes.displayName}
                </TableCell>
                <TableCell>
                  {subtopic.topic.topicJson.attributes.displayName}
                </TableCell>
                <TableCell>
                  {subtopic.section.sectionJson.attributes.displayName}
                </TableCell>
                <TableCell>{subtopic.review}</TableCell>
                <TableCell>
                  {subtopic.isActive ? (
                    <p className="text-green-600 font-semibold">Active</p>
                  ) : (
                    <p className="text-red-600 font-semibold">Inactive</p>
                  )}
                </TableCell>
                <TableCell className="lg:max-w-32 truncate">
                  <Link
                    target="_blank"
                    className="underline underline-offset-2 opacity-80 hover:opacity-100 transition duration-300"
                    to={`${
                      import.meta.env.VITE_SUPABASE_URL
                    }/storage/v1/object/public/subtopics/${
                      subtopic.subtopicContentPath
                    }`}
                  >
                    {subtopic.subtopicContentPath}
                  </Link>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="font-redhat font-semibold"
                    >
                      <DropdownMenuItem>
                        <Link to={`/admin/subtopics/view-edit/${subtopic.id}`}>
                          View & Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleActivate(subtopic.id)}
                      >
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeactivate(subtopic.id)}
                      >
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemove(subtopic.id)}
                        disabled={loading}
                        className="cursor-pointer flex items-center gap-x-4 text-red-700"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4 text-red-700" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FetchSubtopics;
