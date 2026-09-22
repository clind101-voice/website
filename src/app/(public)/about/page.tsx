import type { Metadata } from "next";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import SectionHeading from "@/components/public/SectionHeading";
import PhotoGallery from "@/components/public/PhotoGallery";

export const metadata: Metadata = {
  title: "About Cote Lind | Chicago Singer, Actor & Voice-Over Artist",
  description:
    "Chicago native, Act One Studios-trained actor, and self-described Interpreter Of Song — get to know Cote Lind's background across music, theatre, and voice-over.",
};

export default async function AboutPage() {
  const [tagline, bio, media] = await Promise.all([
    getContentBlock("home_hero_tagline", "Half City! Half Country Girl!"),
    getContentBlock("about_bio", ""),
    getMediaForSection("about"),
  ]);

  return (
    <div
      className="px-6 py-16"
      style={{ background: "linear-gradient(135deg, #24407a 0%, #6a3f9e 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading ghost="ABOUT ME" title="About Me" eyebrow={tagline} />
        <div className="mb-12">
          <PhotoGallery items={media} />
        </div>
        <div className="max-w-2xl space-y-4 text-white/90">
          {bio.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
