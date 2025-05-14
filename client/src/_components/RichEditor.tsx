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
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageUp,
  ItalicIcon,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  PencilRuler,
} from "lucide-react";

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
    <div className="editor-container w-full min-h-screen border rounded">
      {/* Toolbar for buttons */}
      <div className="toolbar flex gap-4 p-2 bg-gray-200 dark:bg-stone-800 border-b mb-4">
        <button
          className="text-left hover:bg-gray-100 dark:hover:text-stone-900 p-1 rounded cursor-pointer"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1Icon className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3Icon className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setLink({ href: "https://example.com" })
              .run()
          }
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "calloutGreen",
                content: [{ type: "paragraph" }],
              })
              .run()
          }
        >
          <PencilRuler className="w-4 h-4" />
        </button>

        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({
                type: "calloutViolet",
                content: [{ type: "paragraph" }],
              })
              .run()
          }
        >
          <Lightbulb className="w-4 h-4" />
        </button>

        <button
          className="text-left hover:bg-gray-100 p-1 rounded cursor-pointer dark:hover:text-stone-900"
          onClick={triggerImageUpload} // Trigger image upload on button click
        >
          <ImageUp className="w-4 h-4" />
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
