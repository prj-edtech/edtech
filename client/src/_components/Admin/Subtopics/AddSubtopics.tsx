import { useEffect, useState } from "react";
import { addSubtopic } from "@/api/subtopics";
import { uploadToSupabaseStorage } from "@/utils/supabase-bucket";
import { fetchActiveBoards } from "@/api/boards";
import { fetchActiveStandards } from "@/api/standards";
import { getAllActiveSubjects } from "@/api/subjects";
import { getAllActiveSections } from "@/api/sections";
import { fetchAllActiveTopics } from "@/api/topics";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import RichEditor from "@/_components/RichEditor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Boards {
  id: string;
  sortKey: string;
}

interface Standards {
  id: string;
  sortKey: string;
}

interface Subjects {
  id: string;
  sortKey: string;
}

interface Sections {
  id: string;
  sectionJson: {
    attributes: {
      displayName: string;
    };
  };
}

interface Topics {
  id: string;
  topicJson: {
    attributes: {
      displayName: string;
    };
  };
}

const AddSubtopics = () => {
  const [form, setForm] = useState({
    boardCode: "",
    standardCode: "",
    subjectName: "",
    sectionId: "",
    topicId: "",
    displayName: "",
    priority: 0,
    createdBy: "",
  });

  const { user } = useAuth0();
  const [submitting, setSubmitting] = useState(false);

  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [subjectData, setSubjectData] = useState<Subjects[]>([]);
  const [sectionData, setSectionData] = useState<Sections[]>([]);
  const [topicData, setTopicData] = useState<Topics[]>([]);

  const [keepAdding, setKeepAdding] = useState(false);

  const [editorContent, setEditorContent] = useState("<p></p>");

  const loadBoards = async () => {
    const response = await fetchActiveBoards();
    setBoardData(response.data.data);
  };

  const loadStandards = async () => {
    const response = await fetchActiveStandards();
    setStandardData(response.data);
  };

  const loadSubjects = async () => {
    const response = await getAllActiveSubjects();
    setSubjectData(response.data.data);
  };

  const loadSections = async () => {
    const response = await getAllActiveSections();
    setSectionData(response.data.data);
  };

  const loadTopics = async () => {
    const response = await fetchAllActiveTopics();
    setTopicData(response.data.data);
  };

  useEffect(() => {
    loadBoards();
    loadStandards();
    loadSubjects();
    loadSections();
    loadTopics();

    setForm((prev) => ({ ...prev, createdBy: user?.sub || "" }));
  }, [user]);

  const handleFieldChange = (name: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const contentPath = await uploadToSupabaseStorage(editorContent);

      await addSubtopic({
        ...form,
        contentPath,
      });

      // Reset
      setEditorContent("<p></p>");
      if (keepAdding) {
        setForm({
          boardCode: form.boardCode,
          standardCode: form.standardCode,
          subjectName: form.subjectName,
          sectionId: form.sectionId,
          topicId: form.topicId,
          displayName: "",
          priority: 0,
          createdBy: user?.sub || "",
        });
      } else {
        setForm({
          boardCode: "",
          standardCode: "",
          subjectName: "",
          sectionId: "",
          topicId: "",
          displayName: "",
          priority: 0,
          createdBy: user?.sub || "",
        });
      }
    } catch (err) {
      console.error("Error adding subtopic:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-start items-start flex-col font-redhat">
      <div className="flex justify-start items-start w-full flex-col lg:gap-y-6">
        <div className="flex justify-start items-start w-full lg:gap-x-6">
          <Select
            value={form.boardCode}
            onValueChange={(value) => handleFieldChange("boardCode", value)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a board" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {boardData.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.sortKey}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={form.standardCode}
            onValueChange={(value) => handleFieldChange("standardCode", value)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {standardData.map((standard) => (
                  <SelectItem key={standard.id} value={standard.id}>
                    {standard.sortKey}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={form.subjectName}
            onValueChange={(value) => handleFieldChange("subjectName", value)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {subjectData.map((subject) => (
                  <SelectItem key={subject.id} value={subject.sortKey}>
                    {subject.sortKey}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-start items-start w-full lg:gap-x-6">
          <Select
            value={form.sectionId}
            onValueChange={(value) => handleFieldChange("sectionId", value)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {sectionData.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.sectionJson.attributes.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={form.topicId}
            onValueChange={(value) => handleFieldChange("topicId", value)}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {topicData.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.topicJson.attributes.displayName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            placeholder="Display Name"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex justify-start items-start w-full lg:gap-x-6">
          <Input
            type="number"
            name="priority"
            value={form.priority}
            onChange={(e) =>
              handleFieldChange(e.target.name, Number(e.target.value))
            }
            placeholder="Priority"
            className="border p-2 lg:w-[520px]"
          />

          <div className="flex items-center gap-2 mt-2">
            <Label htmlFor="keepAdding" className="font-medium cursor-pointer">
              Keep adding on selected board, standard, subject and topic
            </Label>
            <Checkbox
              className="border border-blue-800/40 cursor-pointer"
              id="keepAdding"
              checked={keepAdding}
              onCheckedChange={(checked) => setKeepAdding(!!checked)}
            />
          </div>
        </div>

        <div className="w-full">
          <RichEditor
            content={editorContent}
            onContentChange={(html) => setEditorContent(html)}
          />
        </div>

        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default AddSubtopics;
