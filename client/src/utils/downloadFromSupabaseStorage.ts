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
