import { useState } from "react";
import { addSubtopic } from "@/api/subtopics";
import { uploadToSupabaseStorage } from "@/utils/supabase-bucket";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

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
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };

  const handleSubmit = async () => {
    if (!editor) return;

    setSubmitting(true);
    try {
      // Upload content HTML to Supabase Storage
      const htmlContent = editor.getHTML();
      const contentPath = await uploadToSupabaseStorage(htmlContent);

      // Call backend API to save Subtopic metadata
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
        createdBy: "",
      });
    } catch (err) {
      console.error("Error adding subtopic:", err);
      alert("Failed to add subtopic");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Subtopic</h2>

      <div className="space-y-4">
        <input
          type="text"
          name="boardCode"
          value={form.boardCode}
          onChange={handleChange}
          placeholder="Board Code"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="standardCode"
          value={form.standardCode}
          onChange={handleChange}
          placeholder="Standard Code"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="subjectName"
          value={form.subjectName}
          onChange={handleChange}
          placeholder="Subject Name"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="sectionId"
          value={form.sectionId}
          onChange={handleChange}
          placeholder="Section ID"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="topicId"
          value={form.topicId}
          onChange={handleChange}
          placeholder="Topic ID"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Display Name"
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          placeholder="Priority"
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="createdBy"
          value={form.createdBy}
          onChange={handleChange}
          placeholder="Created By"
          className="border p-2 w-full"
        />

        <div>
          <label className="block mb-1 font-medium">
            Subtopic Content (Tiptap)
          </label>
          <EditorContent
            editor={editor}
            className="border p-2 min-h-[200px] rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Upload Image to Cloudinary
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {submitting ? "Saving..." : "Save Subtopic"}
        </button>
      </div>
    </div>
  );
};

export default AddSubtopics;
