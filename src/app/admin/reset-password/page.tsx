"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import NotConfiguredNotice from "@/components/admin/NotConfiguredNotice";

const MIN_LENGTH = 10;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const password = String(data.get("password"));
    const confirm = String(data.get("confirm"));

    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("That reset link has expired. Request a new one and try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  // After the hooks, so the hook order never changes between renders.
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-lg font-semibold text-neutral-900">Choose a new password</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Pick something at least {MIN_LENGTH} characters long, then save it somewhere you can find
          it again.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="New password"
            className="rounded-md border border-neutral-300 px-3 py-2.5 text-base text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 sm:text-sm"
          />
          <input
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Repeat new password"
            className="rounded-md border border-neutral-300 px-3 py-2.5 text-base text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save new password"}
          </button>
          {error && (
            <p className="text-sm text-red-600">
              {error}{" "}
              {error.startsWith("That reset link") && (
                <Link href="/admin/forgot-password" className="underline">
                  Request a new link
                </Link>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
