import Link from "next/link";

const SECTIONS = [
  { href: "/admin/media/home", label: "Home" },
  { href: "/admin/media/about", label: "About" },
  { href: "/admin/media/singing", label: "Singing" },
  { href: "/admin/media/acting", label: "Acting" },
  { href: "/admin/media/voiceovers", label: "Voice Overs" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Welcome back</h1>
      <p className="mb-8 text-neutral-600">
        Edit page text, upload photos and audio, and add YouTube links — everything here
        updates the live site immediately.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-neutral-200 bg-white p-5 text-sm font-medium hover:border-neutral-400"
          >
            {s.label} media
          </Link>
        ))}
      </div>
    </div>
  );
}
