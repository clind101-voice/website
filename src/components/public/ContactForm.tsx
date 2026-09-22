"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

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
      <div className="grid grid-cols-2 gap-3">
        <input
          name="firstName"
          required
          placeholder="First name"
          className="rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
        />
        <input
          name="lastName"
          placeholder="Last name"
          className="rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
        />
      </div>
      <input
        name="phone"
        type="tel"
        placeholder="Phone"
        className="rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
      />
      <label className="flex items-center gap-2 text-sm text-white/80">
        <input name="subscribed" type="checkbox" className="h-4 w-4" />
        Yes, subscribe me to your newsletter.
      </label>
      <textarea
        name="comments"
        placeholder="Comments"
        rows={4}
        className="rounded-sm bg-[var(--cream)] px-4 py-2.5 text-black placeholder-black/50 outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 rounded-sm bg-[var(--blue)] px-6 py-2.5 font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Submit"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong sending your message — please try again.
        </p>
      )}
    </form>
  );
}
