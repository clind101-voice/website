import { publicMediaUrl, type MediaItem } from "@/lib/content";

export default function AudioPlayer({ items }: { items: MediaItem[] }) {
  const tracks = items.filter((i) => i.type === "audio" && i.storage_path);

  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      {tracks.map((track) => (
        <div key={track.id} className="rounded-sm border border-[var(--pink)]/40 bg-black/30 p-4">
          <p className="mb-2 font-display text-lg text-[var(--pink)]">
            {track.title || "Untitled track"}
          </p>
          <audio controls preload="none" className="w-full" src={publicMediaUrl(track.storage_path!)}>
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
}
