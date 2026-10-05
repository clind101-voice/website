import { createClient } from "@/lib/supabase/server";

export type MediaSection = "home" | "about" | "singing" | "acting" | "voiceovers";
export type MediaType = "photo" | "audio" | "video_embed";

export type MediaItem = {
  id: string;
  section: MediaSection;
  type: MediaType;
  title: string;
  alt_text: string;
  storage_path: string | null;
  external_url: string | null;
  sort_order: number;
};

const BUCKET = "media";

export async function getContentBlocks(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("content_blocks").select("key, value");
    for (const row of data ?? []) map[row.key] = row.value;
  } catch {
    // Unreachable database (misconfigured deployment, outage). Callers each
    // pass a sensible fallback, so the page still renders its default copy.
  }
  return map;
}

export async function getContentBlock(key: string, fallback = ""): Promise<string> {
  const blocks = await getContentBlocks();
  // `||`, not `??`: a block cleared to "" in the admin means "I haven't set
  // this", same as a block that was never created. Honouring the empty string
  // would render a blank heading with nothing on screen to explain why.
  return blocks[key] || fallback;
}

export async function getMediaForSection(section: MediaSection): Promise<MediaItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("media_items")
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true });
    return data ?? [];
  } catch {
    // See getContentBlocks: an unreachable database degrades to "no media"
    // rather than taking the page down.
    return [];
  }
}

export function publicMediaUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
