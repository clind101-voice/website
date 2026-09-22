import Image from "next/image";
import { publicMediaUrl, type MediaItem } from "@/lib/content";

export default function PhotoGallery({ items }: { items: MediaItem[] }) {
  const photos = items.filter((i) => i.type === "photo" && i.storage_path);

  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {photos.map((photo) => (
        <div key={photo.id} className="relative aspect-[3/4] overflow-hidden rounded-sm bg-white/5">
          <Image
            src={publicMediaUrl(photo.storage_path!)}
            alt={photo.alt_text || photo.title || "Photo of Cote Lind"}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
