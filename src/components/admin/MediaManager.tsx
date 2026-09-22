"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MediaItem, MediaSection } from "@/lib/content";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/ogg", "audio/aac"];
const MAX_IMAGE_MB = 10;
const MAX_AUDIO_MB = 50;

function publicUrl(storagePath: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${storagePath}`;
}

export default function MediaManager({
  section,
  initialItems,
}: {
  section: MediaSection;
  initialItems: MediaItem[];
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  function nextSortOrder() {
    return items.length === 0 ? 0 : Math.max(...items.map((i) => i.sort_order)) + 1;
  }

  async function uploadFile(file: File, kind: "photo" | "audio") {
    setErrorMsg(null);
    const allowed = kind === "photo" ? IMAGE_TYPES : AUDIO_TYPES;
    const maxMb = kind === "photo" ? MAX_IMAGE_MB : MAX_AUDIO_MB;

    if (!allowed.includes(file.type)) {
      setErrorMsg(`Unsupported ${kind} format: ${file.type || "unknown"}`);
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`File is too large — max ${maxMb}MB.`);
      return;
    }

    setBusy(true);
    const path = `${section}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
    if (uploadError) {
      setErrorMsg(uploadError.message);
      setBusy(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("media_items")
      .insert({
        section,
        type: kind,
        title: file.name.replace(/\.[^.]+$/, ""),
        alt_text: "",
        storage_path: path,
        sort_order: nextSortOrder(),
      })
      .select()
      .single();

    setBusy(false);

    if (insertError) {
      setErrorMsg(insertError.message);
      return;
    }

    setItems((prev) => [...prev, data as MediaItem]);
  }

  async function addVideoEmbed() {
    if (!videoUrl.trim()) return;
    setErrorMsg(null);
    setBusy(true);

    const { data, error } = await supabase
      .from("media_items")
      .insert({
        section,
        type: "video_embed",
        title: videoTitle || "Untitled video",
        alt_text: "",
        external_url: videoUrl.trim(),
        sort_order: nextSortOrder(),
      })
      .select()
      .single();

    setBusy(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setItems((prev) => [...prev, data as MediaItem]);
    setVideoUrl("");
    setVideoTitle("");
  }

  async function updateField(id: string, field: "title" | "alt_text", value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  async function saveField(id: string, field: "title" | "alt_text", value: string) {
    await supabase.from("media_items").update({ [field]: value }).eq("id", id);
  }

  async function move(id: string, direction: -1 | 1) {
    const index = items.findIndex((i) => i.id === id);
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const a = items[index];
    const b = items[swapIndex];
    const next = [...items];
    next[index] = { ...b, sort_order: a.sort_order };
    next[swapIndex] = { ...a, sort_order: b.sort_order };
    setItems(next.sort((x, y) => x.sort_order - y.sort_order));

    await Promise.all([
      supabase.from("media_items").update({ sort_order: a.sort_order }).eq("id", b.id),
      supabase.from("media_items").update({ sort_order: b.sort_order }).eq("id", a.id),
    ]);
  }

  async function remove(item: MediaItem) {
    if (!confirm(`Delete "${item.title || "this item"}"? This cannot be undone.`)) return;

    setBusy(true);
    if (item.storage_path) {
      await supabase.storage.from("media").remove([item.storage_path]);
    }
    await supabase.from("media_items").delete().eq("id", item.id);
    setBusy(false);

    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => photoInput.current?.click()}
          disabled={busy}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Upload Photo
        </button>
        <input
          ref={photoInput}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          hidden
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "photo")}
        />

        <button
          onClick={() => audioInput.current?.click()}
          disabled={busy}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          Upload Audio
        </button>
        <input
          ref={audioInput}
          type="file"
          accept={AUDIO_TYPES.join(",")}
          hidden
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "audio")}
        />
      </div>

      <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-neutral-800">Add a YouTube link</p>
        <div className="flex flex-wrap gap-2">
          <input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Video title (e.g. Voice-over demo reel)"
            className="min-w-[220px] flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="min-w-[220px] flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            onClick={addVideoEmbed}
            disabled={busy || !videoUrl.trim()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {errorMsg && <p className="mb-4 text-sm text-red-600">{errorMsg}</p>}

      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500">No media in this section yet.</p>
        )}
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-100 text-xs text-neutral-400">
              {item.type === "photo" && item.storage_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={publicUrl(item.storage_path)} alt="" className="h-full w-full object-cover" />
              ) : (
                item.type.toUpperCase()
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <input
                value={item.title}
                onChange={(e) => updateField(item.id, "title", e.target.value)}
                onBlur={(e) => saveField(item.id, "title", e.target.value)}
                placeholder="Title"
                className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
              />
              {item.type === "photo" && (
                <input
                  value={item.alt_text}
                  onChange={(e) => updateField(item.id, "alt_text", e.target.value)}
                  onBlur={(e) => saveField(item.id, "alt_text", e.target.value)}
                  placeholder="Alt text (describe the photo for search & accessibility)"
                  className="rounded-md border border-neutral-300 px-2 py-1 text-sm"
                />
              )}
              {item.type === "video_embed" && (
                <p className="truncate text-xs text-neutral-500">{item.external_url}</p>
              )}
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              <button
                onClick={() => move(item.id, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="rounded border border-neutral-300 px-2 py-0.5 text-xs disabled:opacity-30"
              >
                ↑
              </button>
              <button
                onClick={() => move(item.id, 1)}
                disabled={i === items.length - 1}
                aria-label="Move down"
                className="rounded border border-neutral-300 px-2 py-0.5 text-xs disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            <button
              onClick={() => remove(item)}
              className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
