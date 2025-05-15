import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubtopicById } from "@/api/subtopics";
import { Card } from "@/components/ui/card";

interface Subtopic {
  id: string;
  subtopicContentPath: string;
  subTopicJson: {
    attributes: {
      displayName: string;
    };
  };
}

const SubtopicViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubtopic = async () => {
      setLoading(true);
      try {
        const response = await getSubtopicById(id!);
        console.log("Subtopic response:", response.data);

        // response.data.data is an array, get the first element
        const subtopicData = response.data.data?.[0];

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

  if (loading) return <p className="p-6">Loading...</p>;
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
    </div>
  );
};

export default SubtopicViewer;
