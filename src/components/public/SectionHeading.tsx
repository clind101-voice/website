export default function SectionHeading({
  ghost,
  eyebrow,
  title,
}: {
  ghost: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="relative mb-10">
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -top-6 left-0 select-none text-[4rem] leading-none tracking-wider text-transparent sm:text-[6rem]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
      >
        {ghost}
      </span>
      <div className="relative pt-10">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pink)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {title}
        </h1>
      </div>
    </div>
  );
}
