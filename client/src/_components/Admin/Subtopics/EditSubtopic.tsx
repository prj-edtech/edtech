import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getSubtopicById, updateSubTopic } from "@/api/subtopics";
import { uploadToSupabaseStorage } from "@/utils/supabase-bucket";
import RichEditor from "@/_components/RichEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { downloadFromSupabaseStorage } from "@/utils/downloadFromSupabaseStorage";

const EditSubtopic = () => {
  const { subtopicId } = useParams();
  const { user } = useAuth0();

  const [displayName, setDisplayName] = useState("");
  const [priority, setPriority] = useState(0);
  const [editorContent, setEditorContent] = useState("<p></p>");
  const [contentPath, setContentPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSubtopic = async () => {
      try {
        if (!subtopicId) {
          console.warn("[EditSubtopic] Missing subtopicId");
          setLoading(false);
          return;
        }

        console.log("[EditSubtopic] Fetching subtopic:", subtopicId);
        const response = await getSubtopicById(subtopicId);
        console.log("[EditSubtopic] API Response:", response.data);

        const sub = response.data.data.subTopicJson;
        if (!sub) {
          console.error("[EditSubtopic] No subTopicJson found in API response");
          setLoading(false);
          return;
        }

        setDisplayName(sub.attributes?.displayName || "");
        setPriority(response.data.data.priority || 0);
        const pathFromApi = response.data.data.subtopicContentPath || "";
        setContentPath(pathFromApi);
        console.log("[EditSubtopic] Content path from API:", pathFromApi);

        if (pathFromApi) {
          const content = await downloadFromSupabaseStorage(pathFromApi);
          if (!content) {
            console.warn("[EditSubtopic] No content downloaded, using empty");
          }
          setEditorContent(content || "<p></p>");
          console.log(
            "[EditSubtopic] Loaded content from storage:",
            content?.slice(0, 100),
            "..."
          ); // preview first 100 chars
        } else {
          console.warn(
            "[EditSubtopic] No content path provided, setting empty editor"
          );
          setEditorContent("<p></p>");
        }
      } catch (error) {
        console.error("[EditSubtopic] Failed to load subtopic:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubtopic();
  }, [subtopicId]);

  const handleSubmit = async () => {
    if (!subtopicId) {
      console.error("[EditSubtopic] Missing subtopicId on submit");
      return;
    }
    setSubmitting(true);
    try {
      console.log("[EditSubtopic] Uploading updated content...");
      const updatedContentPath = await uploadToSupabaseStorage(
        editorContent,
        contentPath // pass existing path to overwrite
      );
      console.log("[EditSubtopic] Updated content path:", updatedContentPath);

      console.log("[EditSubtopic] Sending update request to API...");
      await updateSubTopic(subtopicId, {
        id: subtopicId,
        displayName,
        priority,
        subtopicContentPath: updatedContentPath,
        updatedBy: user?.sub || "",
      });

      console.log("[EditSubtopic] Update successful. Navigating back.");
    } catch (error) {
      console.error("[EditSubtopic] Error updating subtopic:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col font-redhat gap-6 lg:p-0 p-4">
      <h2 className="text-xl font-bold">Edit Subtopic</h2>

      <Input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display Name"
        className="lg:w-64 w-full"
      />

      <Input
        type="number"
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        placeholder="Priority"
        className="lg:w-64 w-full"
      />

      <div className="w-full">
        <RichEditor
          content={editorContent}
          onContentChange={setEditorContent}
          key={contentPath} // remount editor if path changes to reload content properly
        />
      </div>

      <Button className="w-min" onClick={handleSubmit} disabled={submitting}>
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Update Subtopic"
        )}
      </Button>
    </div>
  );
};

export default EditSubtopic;
