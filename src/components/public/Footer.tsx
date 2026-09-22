export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ink)] px-6 py-10 text-center text-xs uppercase tracking-[0.18em] text-white/50">
      &copy; {new Date().getFullYear()} Cote Lind
    </footer>
  );
}
