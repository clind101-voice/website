"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export type PastWork = {
  year: string;
  title: string;
  category: string;
  /** Public URL of a voice-over sample. When present the card becomes playable. */
  audioUrl?: string;
};

export default function PastWorksTimeline({
  items,
  heading = "Past Works",
}: {
  items: PastWork[];
  heading?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const playable = items.map((it, i) => (it.audioUrl ? i : -1)).filter((i) => i >= 0);
  const posInPlayable = openIndex === null ? -1 : playable.indexOf(openIndex);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (posInPlayable < 0) return;
      const next = posInPlayable + dir;
      if (next < 0 || next >= playable.length) return;
      setOpenIndex(playable[next]);
    },
    [posInPlayable, playable]
  );

  function sync() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  useEffect(() => {
    sync();
    const onResize = () => sync();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [items.length]);

  useEffect(() => {
    if (openIndex === null) return;
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, step]);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 520), behavior: "smooth" });
  }

  if (items.length === 0) return null;
  const open = openIndex === null ? null : items[openIndex];

  return (
    <section className="mt-20">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl uppercase tracking-[0.12em] text-white sm:text-4xl">
          {heading}
        </h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canLeft}
            aria-label="Show earlier work"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 disabled:opacity-25"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canRight}
            aria-label="Show later work"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10 disabled:opacity-25"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <article
            key={`${item.title}-${i}`}
            className="flex w-[78%] shrink-0 snap-start flex-col rounded-lg border border-white/10 bg-white/5 p-6 sm:w-[19rem]"
          >
            {item.year && <p className="text-sm text-white/50">{item.year}</p>}
            <h3 className="mt-2 flex-1 font-semibold leading-snug text-white">{item.title}</h3>
            {item.audioUrl ? (
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-[var(--pink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              >
                <span aria-hidden="true">▶</span> Hear this
              </button>
            ) : (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                {item.category}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="relative h-3" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
          style={{ background: "linear-gradient(90deg, var(--pink), var(--blue), transparent)" }}
        />
        <div className="relative flex justify-between">
          {items.map((_, i) => (
            <span
              key={`dot-${i}`}
              className="h-3 w-3 rounded-full border-2 border-[var(--ink)]"
              style={{ background: i % 2 === 0 ? "var(--pink)" : "var(--blue)" }}
            />
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Voice-over sample: ${open.title}`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg border border-white/15 bg-[var(--ink-2)] p-6 outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/50">{open.year}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{open.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {open.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="shrink-0 rounded-full border border-white/30 px-3 py-1 text-white transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <audio
              key={open.audioUrl}
              src={open.audioUrl}
              controls
              autoPlay
              className="mt-5 w-full"
            >
              Your browser can&apos;t play audio. <a href={open.audioUrl}>Download the sample</a>.
            </audio>

            {playable.length > 1 && (
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={posInPlayable <= 0}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-25"
                >
                  ‹ Previous
                </button>
                <span className="text-xs text-white/50">
                  {posInPlayable + 1} of {playable.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={posInPlayable >= playable.length - 1}
                  className="rounded-full border border-white/30 px-4 py-1.5 text-sm text-white transition hover:bg-white/10 disabled:opacity-25"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
