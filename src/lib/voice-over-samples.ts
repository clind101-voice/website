import type { PastWork } from "@/components/public/PastWorksTimeline";

// Cote's own voice-over samples, committed to the repo so the page has something
// playable without depending on a Supabase upload (see README: SUPABASE_SERVICE_ROLE_KEY
// is still unset, so nothing can be uploaded to the media bucket yet).
//
// These are a fallback only: the moment Cote uploads an audio file to the
// voice-overs section in /admin, her uploads replace these entirely, so there
// are never duplicate cards and she never needs a developer to retire them.
//
// "C2"/"N2" are her own file labels. They are kept verbatim rather than
// expanded into a genre ("Commercial", "Narration") because that would be a
// guess, and a mislabelled sample on a talent page is worse than a terse one.
export const BUILT_IN_VOICE_OVER_SAMPLES: PastWork[] = [
  {
    year: "",
    title: "Voice-over sample — C2",
    category: "Voice-over sample",
    audioUrl: "/audio/cote-lind-c2.mp3",
  },
  {
    year: "",
    title: "Voice-over sample — N2",
    category: "Voice-over sample",
    audioUrl: "/audio/cote-lind-n2.mp3",
  },
];
