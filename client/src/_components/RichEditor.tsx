import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { CalloutGreen, CalloutViolet } from "@/extensions/CustomCallouts";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

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
import { useEffect } from "react";

interface RichEditorProps {
  editor?: Editor;
  content?: string;
  onContentChange?: (html: string) => void;
}

const RichEditor = ({
  editor: externalEditor,
  content,
  onContentChange,
}: RichEditorProps) => {
  const internalEditor = useEditor({
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
    content: content || "<p></p>",
    onUpdate({ editor }) {
      onContentChange?.(editor.getHTML());
    },
  });

  const editor = externalEditor || internalEditor;

  // If content prop changes externally, update editor content to keep in sync
  useEffect(() => {
    if (content !== undefined && editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

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
    const fileInput = document.getElementById(
      "image-upload-input"
    ) as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className="editor-container w-full min-h-screen border rounded">
      {/* Toolbar */}
      <div className="toolbar flex gap-4 p-2 bg-gray-200 dark:bg-stone-800 border-b mb-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon className="w-4 h-4 cursor-pointer" />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1Icon className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2Icon className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3Icon className="w-4 h-4 cursor-pointer" />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4 cursor-pointer" />
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .setLink({ href: "https://example.com" })
              .run()
          }
        >
          <Link2 className="w-4 h-4 cursor-pointer" />
        </button>
        <button
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
          <PencilRuler className="w-4 h-4 cursor-pointer" />
        </button>
        <button
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
          <Lightbulb className="w-4 h-4 cursor-pointer" />
        </button>
        <button onClick={triggerImageUpload}>
          <ImageUp className="w-4 h-4 cursor-pointer" />
        </button>
      </div>

      <div className="editor-content-wrapper w-full">
        <EditorContent editor={editor} />
      </div>

      <input
        type="file"
        id="image-upload-input"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default RichEditor;
