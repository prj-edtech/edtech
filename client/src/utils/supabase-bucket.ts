import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const uploadToSupabaseStorage = async (content: string) => {
  const fileName = `subtopics/${Date.now()}-content.html`;

  const { data, error } = await supabase.storage
    .from("subtopics")
    .upload(fileName, new Blob([content], { type: "text/html" }), {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Error uploading content to Supabase");
  }

  return data?.path || "";
};
