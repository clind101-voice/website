import type { Metadata } from "next";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import SectionHeading from "@/components/public/SectionHeading";
import PhotoGallery from "@/components/public/PhotoGallery";
import YouTubeFacade from "@/components/public/YouTubeFacade";

export const metadata: Metadata = {
  title: "Singing | Cote Lind, Chicago Vocalist & Songwriter",
  description:
    "Original songs and live performance clips from Cote Lind, a Chicago vocalist and songwriter who calls herself an Interpreter Of Song.",
};

export default async function SingingPage() {
  const [intro, media] = await Promise.all([
    getContentBlock("singing_intro", "Youtube is my friend"),
    getMediaForSection("singing"),
  ]);
  const videos = media.filter((m) => m.type === "video_embed" && m.external_url);

  return (
    <div
      className="px-6 py-16"
      style={{ background: "linear-gradient(160deg, #5b2f8f 0%, #a63e8f 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading ghost="SINGING" title={intro} />
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          {videos.map((v) => (
            <YouTubeFacade key={v.id} url={v.external_url!} title={v.title || "Cote Lind — Singing"} />
          ))}
        </div>
        <PhotoGallery items={media} />
      </div>
    </div>
  );
}
