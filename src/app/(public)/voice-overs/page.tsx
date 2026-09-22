import type { Metadata } from "next";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import SectionHeading from "@/components/public/SectionHeading";
import AudioPlayer from "@/components/public/AudioPlayer";
import YouTubeFacade from "@/components/public/YouTubeFacade";

export const metadata: Metadata = {
  title: "Voice Overs | Cote Lind, Chicago Voice-Over Artist",
  description:
    "Listen to Cote Lind's voice-over demo reel — a Chicago-based voice artist bringing characters to life with just her voice.",
};

export default async function VoiceOversPage() {
  const [intro, media] = await Promise.all([
    getContentBlock("voiceovers_intro", "Voice demo!"),
    getMediaForSection("voiceovers"),
  ]);
  const videos = media.filter((m) => m.type === "video_embed" && m.external_url);

  return (
    <div
      className="px-6 py-16"
      style={{ background: "linear-gradient(150deg, #3b5bff 0%, #6c4aa6 55%, #c9a876 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading ghost="VOICE OVERS" title={intro} />
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          {videos.map((v) => (
            <YouTubeFacade key={v.id} url={v.external_url!} title={v.title || "Cote Lind — Voice Over Demo"} />
          ))}
        </div>
        <AudioPlayer items={media} />
      </div>
    </div>
  );
}
