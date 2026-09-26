import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContentBlock, getMediaForSection } from "@/lib/content";
import YouTubeFacade from "@/components/public/YouTubeFacade";
import PastWorksTimeline, { type PastWork } from "@/components/public/PastWorksTimeline";
import { PAST_WORKS } from "@/lib/past-works";

export const metadata: Metadata = {
  title: "Voice Overs | Cote Lind, Chicago Voice-Over Artist",
  description:
    "Hear Cote Lind's voice-over samples — a Chicago-based voice artist for commercials, narration, e-learning and character work.",
};

function publicUrl(storagePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${storagePath}`;
}

export default async function VoiceOversPage() {
  const [tagline, bio, media] = await Promise.all([
    getContentBlock("voiceovers_role", "Voice-Over Artist"),
    getContentBlock(
      "voiceovers_bio",
      "Chicago-based voice-over artist with a background in live theatre and song. " +
        "Commercials, narration, e-learning and character work, recorded and delivered from my own booth."
    ),
    getMediaForSection("voiceovers"),
  ]);

  const videos = media.filter((m) => m.type === "video_embed" && m.external_url);
  const samples: PastWork[] = media
    .filter((m) => m.type === "audio" && m.storage_path)
    .map((m) => ({
      year: "",
      title: m.title || "Voice-over sample",
      category: "Voice-over sample",
      audioUrl: publicUrl(m.storage_path!),
    }));

  const timeline: PastWork[] = [...samples, ...PAST_WORKS];

  return (
    <div className="bg-[var(--ink)] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-display text-5xl uppercase tracking-[0.08em] text-white sm:text-6xl">
              Cote Lind
            </h1>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--blue)]">
              Chicago, USA <span className="mx-2 text-white/30">|</span> {tagline}
            </p>

            <hr className="my-6 border-white/15" />

            <p className="max-w-md leading-relaxed text-white/75">{bio}</p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 rounded-sm bg-[var(--blue)] px-6 py-3 font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Book Cote Lind <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src="/images/cote-at-the-mic.webp"
              alt="Cote Lind performing at a microphone under stage lights"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {videos.length > 0 && (
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {videos.map((v) => (
              <YouTubeFacade
                key={v.id}
                url={v.external_url!}
                title={v.title || "Cote Lind — Voice Over"}
              />
            ))}
          </div>
        )}

        <PastWorksTimeline items={timeline} />
      </div>
    </div>
  );
}
