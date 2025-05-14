import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { CalloutGreen, CalloutViolet } from "@/extensions/CustomCallouts";
import { uploadImageToCloudinary } from "@/utils/cloudinary"; // Assuming the image upload logic is here

import "@/styles/editor.css";

const RichEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({ openOnClick: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Bold,
      Italic,
      Placeholder.configure({
        placeholder: "Type '/' for commands…",
      }),
      CalloutGreen,
      CalloutViolet,
    ],
  });

  if (!editor) return null;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    // Loop through the selected files and upload them one by one
    for (const file of files) {
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (err) {
        console.error("Failed to upload image:", err);
      }
    }
  };

  const triggerImageUpload = () => {
    // Trigger the file input to open when the button is clicked
    const fileInput = document.getElementById(
      "image-upload-input"
    ) as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="editor-container w-full min-h-screen border rounded p-4">
      {/* Toolbar for buttons */}
      <div className="toolbar flex gap-2 p-2 bg-gray-200 border-b mb-4">
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          Heading 1
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Heading 2
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Heading 3
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered List
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setLink({ href: "https://example.com" })
              .run()
          }
        >
          Link
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().setNode("calloutGreen").run()}
        >
          Green Callout
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={() => editor.chain().focus().setNode("calloutViolet").run()}
        >
          Violet Callout
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded"
          onClick={triggerImageUpload} // Trigger image upload on button click
        >
          Upload Images
        </button>
      </div>

      {/* Editor Content */}
      <div className="editor-content-wrapper w-full">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        id="image-upload-input"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden" // Make it invisible but functional
      />
    </div>
  );
};

export default RichEditor;
