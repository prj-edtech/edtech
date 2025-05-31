import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export const downloadFromSupabaseStorage = async (path: string) => {
  if (!path) {
    console.warn("[Storage] No path provided for download");
    return null;
  }

  // Append timestamp query param to bust cache
  const pathWithCacheBust = `${path}?v=${Date.now()}`;
  console.log("[Storage] Downloading content from:", pathWithCacheBust);

  const { data, error } = await supabase.storage
    .from("subtopics")
    .download(pathWithCacheBust);

  if (error) {
    console.error("[Storage] Download error:", error);
    return null;
  }

  const text = await data.text();
  console.log("[Storage] Downloaded content length:", text.length);
  return text;
};

export const uploadJsonToSupabase = async (
  data: object,
  filename: string,
  bucket = "questions"
): Promise<string | null> => {
  const file = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(`json/${filename}.json`, file, {
      upsert: true,
      contentType: "application/json",
    });

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(uploadData.path);

  return publicUrlData?.publicUrl || null;
};
