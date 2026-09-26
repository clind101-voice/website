"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]";

const PROJECT_TYPES = [
  "Commercial",
  "Narration / e-learning",
  "Animation / character",
  "Phone system / IVR",
  "Audiobook",
  "Other",
];

const USAGE = [
  "Web / social",
  "Broadcast (TV or radio)",
  "Internal / corporate",
  "Not sure yet",
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [inquiryType, setInquiryType] = useState("Voice-over");

  const isVoiceOver = inquiryType === "Voice-over";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      phone: data.get("phone"),
      comments: data.get("comments"),
      subscribed: data.get("subscribed") === "on",
      inquiryType,
      projectType: isVoiceOver ? data.get("projectType") : null,
      usage: isVoiceOver ? data.get("usage") : null,
      scriptLength: isVoiceOver ? data.get("scriptLength") : null,
      deadline: isVoiceOver ? data.get("deadline") : null,
      budget: isVoiceOver ? data.get("budget") : null,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-sm border border-[var(--pink)]/40 bg-black/30 p-6 text-white">
        Thank you — your message has been sent. Cote will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
      <label className="text-sm text-white/80">
        What can Cote help with?
        <select
          name="inquiryType"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className={`${FIELD} mt-1 w-full`}
        >
          <option>Voice-over</option>
          <option>Singing</option>
          <option>Acting</option>
          <option>Something else</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <input name="firstName" required placeholder="First name" className={FIELD} />
        <input name="lastName" placeholder="Last name" className={FIELD} />
      </div>
      <input name="email" type="email" required placeholder="Email" className={FIELD} />
      <input name="phone" type="tel" placeholder="Phone" className={FIELD} />

      {isVoiceOver && (
        <>
          <p className="mt-2 text-sm text-white/70">
            A few details so Cote can quote without going back and forth.
          </p>
          <select name="projectType" className={FIELD} defaultValue="">
            <option value="">Type of project</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select name="usage" className={FIELD} defaultValue="">
            <option value="">Where will it run?</option>
            {USAGE.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <input
            name="scriptLength"
            placeholder="Script length (words or minutes)"
            className={FIELD}
          />
          <label className="text-sm text-white/80">
            Deadline
            <input name="deadline" type="date" className={`${FIELD} mt-1 w-full`} />
          </label>
          <input name="budget" placeholder="Budget, if you have one" className={FIELD} />
        </>
      )}

      <textarea
        name="comments"
        placeholder={isVoiceOver ? "Anything else about the project" : "Comments"}
        rows={4}
        className={FIELD}
      />
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input name="subscribed" type="checkbox" className="h-4 w-4" />
        Yes, subscribe me to your newsletter.
      </label>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-sm bg-[var(--blue)] px-6 py-2.5 font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong sending your message — please try again.
        </p>
      )}
    </form>
  );
}
