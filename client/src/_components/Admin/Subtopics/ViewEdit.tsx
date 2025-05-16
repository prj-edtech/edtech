import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSubtopicById,
  approveSubtopic,
  resetSubtopic,
  rejectSubtopic,
} from "@/api/subtopics";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Subtopic {
  id: string;
  subtopicContentPath: string;
  subTopicJson: {
    attributes: {
      displayName: string;
    };
  };
  review: string;
}

const SubtopicViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubtopic = async () => {
      setLoading(true);
      try {
        const response = await getSubtopicById(id!);
        console.log("Subtopic response:", response.data);

        // response.data.data is an array, get the first element
        const subtopicData = response.data.data;

        if (!subtopicData) {
          console.warn("No subtopic found in response");
          setSubtopic(null);
          setContent("");
          return;
        }

        setSubtopic(subtopicData);

        if (subtopicData.subtopicContentPath) {
          const contentUrl = `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/object/public/subtopics/${
            subtopicData.subtopicContentPath
          }`;
          console.log("Content URL:", contentUrl);

          const contentResponse = await fetch(contentUrl);
          if (!contentResponse.ok) {
            console.warn("Failed to fetch content from storage");
            setContent("");
            return;
          }
          const contentText = await contentResponse.text();
          setContent(contentText);
        } else {
          console.warn("No subtopicContentPath found in subtopic data");
          setContent("");
        }
      } catch (error) {
        console.error("Failed to fetch subtopic:", error);
        setSubtopic(null);
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubtopic();
    }
  }, [id]);

  const handleApprove = async (id: string) => {
    setLoading(true);
    try {
      await approveSubtopic(id);
      navigate("/admin/subtopics");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    try {
      await rejectSubtopic(id);
      navigate("/admin/subtopics");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (id: string) => {
    setLoading(true);
    try {
      await resetSubtopic(id);
      navigate("/admin/subtopics");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  if (!subtopic) return <p className="p-6">Subtopic not found.</p>;

  return (
    <div className="p-6 font-redhat">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          {subtopic.subTopicJson?.attributes?.displayName ||
            "Untitled Subtopic"}
        </h2>
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Card>
      <div className="flex justify-start items-start w-full flex-col lg:gap-y-6 lg:mt-10 font-redhat">
        <div className="flex justify-center items-center lg:gap-x-2">
          <h1 className="font-semibold lg:text-lg">Review Status:</h1>
          <h3 className="lg:text-xs lg:px-3 lg:py-1 bg-black rounded shadow">
            {subtopic.review === "PENDING" && (
              <span className="text-stone-200">Pending</span>
            )}
            {subtopic.review === "APPROVED" && (
              <span className="text-green-500">Approved</span>
            )}
            {subtopic.review === "REJECTED" && (
              <span className="text-red-500">Rejected</span>
            )}
          </h3>
        </div>
        <Select
          onValueChange={(value) => {
            if (value === "Approve") handleApprove(subtopic.id);
            if (value === "Reject") handleReject(subtopic.id);
            if (value === "Reset") handleReset(subtopic.id);
          }}
        >
          <SelectTrigger className="lg:w-[300px] cursor-pointer">
            <SelectValue placeholder="Review this subtopic" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Approve">Approve</SelectItem>
              <SelectItem value="Reject">Reject</SelectItem>
              <SelectItem value="Reset">Reset</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SubtopicViewer;
