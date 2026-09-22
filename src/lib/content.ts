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
  const supabase = await createClient();
  const { data } = await supabase.from("content_blocks").select("key, value");
  const map: Record<string, string> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
}

export async function getContentBlock(key: string, fallback = ""): Promise<string> {
  const blocks = await getContentBlocks();
  return blocks[key] ?? fallback;
}

export async function getMediaForSection(section: MediaSection): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_items")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export function publicMediaUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
