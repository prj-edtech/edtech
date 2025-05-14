import { useEffect, useState } from "react";
import { addSubtopic } from "@/api/subtopics";
import { uploadToSupabaseStorage } from "@/utils/supabase-bucket";
// import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { fetchBoards } from "@/api/boards";
import { fetchStandards } from "@/api/standards";
import { getAllSubjects } from "@/api/subjects";
import { getAllSections } from "@/api/sections";
import { fetchAllTopics } from "@/api/topics";
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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [boardData, setBoardData] = useState<Boards[]>([]);
  const [standardData, setStandardData] = useState<Standards[]>([]);
  const [subjectData, setSubjectData] = useState<Subjects[]>([]);
  const [sectionData, setSectionData] = useState<Sections[]>([]);
  const [topicData, setTopicData] = useState<Topics[]>([]);

  const loadBoards = async () => {
    const response = await fetchBoards();
    setBoardData(response.data.data);
  };

  const loadStandards = async () => {
    const response = await fetchStandards();
    setStandardData(response.data);
  };

  const loadSubjects = async () => {
    const response = await getAllSubjects();
    setSubjectData(response.data.data);
  };

  const loadSections = async () => {
    const response = await getAllSections();
    setSectionData(response.data.data);
  };

  const loadTopics = async () => {
    const response = await fetchAllTopics();
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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: "<p>Start writing your subtopic content here...</p>",
  });

  const handleFieldChange = (name: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;
  //   try {
  //     const imageUrl = await uploadImageToCloudinary(file);
  //     editor?.chain().focus().setImage({ src: imageUrl }).run();
  //   } catch (err) {
  //     console.error("Failed to upload image:", err);
  //   }
  // };

  const handleSubmit = async () => {
    if (!editor) return;

    setSubmitting(true);
    try {
      const htmlContent = editor.getHTML();
      const contentPath = await uploadToSupabaseStorage(htmlContent);

      await addSubtopic({
        ...form,
        contentPath,
      });

      alert("Subtopic created successfully!");

      editor.commands.setContent(
        "<p>Start writing your subtopic content here...</p>"
      );

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
      navigate("/admin/subtopics");
    } catch (err) {
      console.error("Error adding subtopic:", err);
      alert("Failed to add subtopic");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-start items-start flex-col font-redhat">
      <div className="flex justify-start items-start w-full flex-col lg:gap-y-6">
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

        <Input
          type="number"
          name="priority"
          value={form.priority}
          onChange={(e) =>
            handleFieldChange(e.target.name, Number(e.target.value))
          }
          placeholder="Priority"
          className="border p-2 w-full"
        />

        <Input
          type="text"
          name="createdBy"
          value={form.createdBy}
          disabled
          placeholder="Created By"
          className="border p-2 w-full"
        />

        <div className="w-full">
          <RichEditor />
        </div>

        {/* <div>
          <Label className="block mb-1 font-medium">
            Upload Image to Cloudinary
          </Label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div> */}

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
