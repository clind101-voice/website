"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/voice-overs", label: "Voice Overs" },
  { href: "/singing", label: "Singing" },
  { href: "/acting", label: "Acting" },
  { href: "/about", label: "About Me" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--ink)]/95 backdrop-blur border-b border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-widest text-[var(--gold)]"
          style={{ WebkitTextStroke: "1px var(--gold)" }}
        >
          COTE LIND
        </Link>

        <ul className="hidden gap-7 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-[var(--pink)]" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="text-white md:hidden"
          aria-label={open ? "Close Site Navigation" : "Open Site Navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-current mb-1.5" />
          <span className="block h-0.5 w-6 bg-current mb-1.5" />
          <span className="block h-0.5 w-6 bg-current" />
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-white/10 bg-[var(--ink)] px-6 py-4 md:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm uppercase tracking-[0.18em] text-white/85"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
