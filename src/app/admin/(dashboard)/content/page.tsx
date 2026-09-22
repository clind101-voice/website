import { createClient } from "@/lib/supabase/server";
import ContentBlockForm from "@/components/admin/ContentBlockForm";

const FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "home_hero_tagline", label: "Home — hero tagline", multiline: false },
  { key: "home_song_title", label: "Home — featured song title", multiline: false },
  { key: "about_bio", label: "About Me — bio (separate paragraphs with a blank line)" },
  { key: "singing_intro", label: "Singing — section intro", multiline: false },
  { key: "acting_intro", label: "Acting — section intro", multiline: false },
  { key: "voiceovers_intro", label: "Voice Overs — section intro", multiline: false },
  { key: "contact_blurb", label: "Contact — page intro", multiline: false },
];

export default async function AdminContentPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("content_blocks").select("key, value");
  const values = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Page Text</h1>
      {FIELDS.map((f) => (
        <ContentBlockForm
          key={f.key}
          fieldKey={f.key}
          label={f.label}
          initialValue={values[f.key] ?? ""}
          multiline={f.multiline ?? true}
        />
      ))}
    </div>
  );
}
