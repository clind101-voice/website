import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Page Text" },
  { href: "/admin/media/home", label: "Home Media" },
  { href: "/admin/media/about", label: "About Media" },
  { href: "/admin/media/singing", label: "Singing Media" },
  { href: "/admin/media/acting", label: "Acting Media" },
  { href: "/admin/media/voiceovers", label: "Voice Overs Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white px-4 py-6">
        <p className="mb-6 px-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          CoteLind Admin
        </p>
        <nav className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-2">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
