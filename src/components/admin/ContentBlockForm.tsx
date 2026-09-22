"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContentBlockForm({
  fieldKey,
  label,
  initialValue,
  multiline = true,
}: {
  fieldKey: string;
  label: string;
  initialValue: string;
  multiline?: boolean;
}) {
  const supabase = createClient();
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: fieldKey, value, updated_at: new Date().toISOString() });
    setStatus(error ? "error" : "saved");
    if (!error) setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div className="mb-6">
      <label className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-400"
        />
      )}
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-sm text-green-600">Saved</span>}
        {status === "error" && <span className="text-sm text-red-600">Could not save</span>}
      </div>
    </div>
  );
}
