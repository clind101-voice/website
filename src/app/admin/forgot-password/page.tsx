"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import NotConfiguredNotice from "@/components/admin/NotConfiguredNotice";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = String(new FormData(e.currentTarget).get("email"));
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    });

    // Shown regardless of outcome so the form can't be used to discover which
    // email addresses have accounts.
    setLoading(false);
    setSent(true);
  }

  // After the hooks, so the hook order never changes between renders.
  if (!isSupabaseConfigured()) return <NotConfiguredNotice />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-lg font-semibold text-neutral-900">Reset your password</h1>

        {sent ? (
          <>
            <p className="mb-6 text-sm text-neutral-600">
              If an account uses that address, a reset link is on its way. The link works once and
              expires after an hour.
            </p>
            <Link
              href="/admin/login"
              className="inline-block rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-neutral-600">
              Enter the email address you sign in with and we&apos;ll send you a link to choose a
              new password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                className="rounded-md border border-neutral-300 px-3 py-2.5 text-base text-neutral-900 outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 sm:text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
            <Link
              href="/admin/login"
              className="mt-4 inline-block text-sm text-neutral-600 underline hover:text-neutral-900"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
