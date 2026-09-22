import type { Metadata } from "next";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import SectionHeading from "@/components/public/SectionHeading";
import PhotoGallery from "@/components/public/PhotoGallery";
import YouTubeFacade from "@/components/public/YouTubeFacade";

export const metadata: Metadata = {
  title: "Acting | Cote Lind, Chicago Stage Actor",
  description:
    "Stage and screen work from Cote Lind, an Act One Studios-trained actor based in Chicago, including her role as Ms. Snowfield in Bronzeville The Musical.",
};

export default async function ActingPage() {
  const [intro, media] = await Promise.all([
    getContentBlock(
      "acting_intro",
      'Meet Ms. Snowfield of the Urban League "Bronzeville The Musical"'
    ),
    getMediaForSection("acting"),
  ]);
  const videos = media.filter((m) => m.type === "video_embed" && m.external_url);

  return (
    <div
      className="px-6 py-16"
      style={{ background: "linear-gradient(135deg, #c9a3d1 0%, #e8c9a0 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading ghost="ACTING" title={intro} />
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          {videos.map((v) => (
            <YouTubeFacade key={v.id} url={v.external_url!} title={v.title || "Cote Lind — Acting"} />
          ))}
        </div>
        <PhotoGallery items={media} />
      </div>
    </div>
  );
}
