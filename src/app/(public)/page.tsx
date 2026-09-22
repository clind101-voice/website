import type { Metadata } from "next";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import AudioPlayer from "@/components/public/AudioPlayer";
import PhotoGallery from "@/components/public/PhotoGallery";

export const metadata: Metadata = {
  title: "Cote Lind | Chicago Singer, Actor & Voice-Over Artist",
  description:
    "Cote Lind is a Chicago-based singer, actor, and voice-over artist blending city grit with Southern warmth. Listen to her music, watch her reels, and get in touch to book her.",
};

export default async function HomePage() {
  const [tagline, songTitle, media] = await Promise.all([
    getContentBlock("home_hero_tagline", "Half City! Half Country Girl!"),
    getContentBlock("home_song_title", "My New Song!"),
    getMediaForSection("home"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 text-center">
      <h1
        className="font-display mb-6 text-6xl tracking-widest text-transparent sm:text-8xl"
        style={{ WebkitTextStroke: "1.5px var(--gold)" }}
      >
        COTE
      </h1>

      <p className="mb-10 font-script text-2xl text-[var(--pink)]">{songTitle}</p>

      <AudioPlayer items={media} />

      <p className="mx-auto mt-16 max-w-xl text-lg text-white/85">{tagline}</p>

      <div className="mt-14">
        <PhotoGallery items={media} />
      </div>
    </div>
  );
}
