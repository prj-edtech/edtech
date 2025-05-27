import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const uploadToSupabaseStorage = async (
  content: string,
  path?: string
) => {
  const fileName = path || `subtopics/${Date.now()}-content.html`;
  console.log("[Storage] Uploading content to:", fileName);

  if (path) {
    console.log("[Storage] Deleting old file:", fileName);
    const { error: deleteError } = await supabase.storage
      .from("subtopics")
      .remove([fileName]);

    if (deleteError) {
      console.error("[Storage] Delete error:", deleteError);
      // Optional: throw or continue
    } else {
      console.log("[Storage] Old file deleted successfully");
    }
  }

  const { data, error } = await supabase.storage
    .from("subtopics")
    .upload(fileName, new Blob([content], { type: "text/html" }), {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("[Storage] Upload error:", error);
    throw new Error("Error uploading content to Supabase");
  }

  console.log("[Storage] Upload successful. Path:", data?.path);
  return data?.path || "";
};
