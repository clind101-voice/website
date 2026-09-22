import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaManager from "@/components/admin/MediaManager";
import type { MediaSection } from "@/lib/content";

const VALID_SECTIONS: MediaSection[] = ["home", "about", "singing", "acting", "voiceovers"];
const LABELS: Record<MediaSection, string> = {
  home: "Home",
  about: "About",
  singing: "Singing",
  acting: "Acting",
  voiceovers: "Voice Overs",
};

export default async function AdminMediaSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!VALID_SECTIONS.includes(section as MediaSection)) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("media_items")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">{LABELS[section as MediaSection]} Media</h1>
      <MediaManager section={section as MediaSection} initialItems={data ?? []} />
    </div>
  );
}
