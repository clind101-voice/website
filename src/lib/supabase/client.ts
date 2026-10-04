import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * False when a deployment is missing its Supabase keys. Pages that need the
 * database check this and explain the problem instead of failing silently.
 */
export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

export function createClient() {
  // Next.js prerenders the admin pages at build time, so this runs during the
  // build. Handing @supabase/ssr an undefined URL makes it throw, which fails
  // the entire deploy — including the public pages, which need none of these
  // keys to render. A well-formed placeholder keeps the build alive; callers
  // check isSupabaseConfigured() and surface a clear message instead.
  return createBrowserClient(
    url ?? "https://placeholder.supabase.co",
    anonKey ?? "placeholder-anon-key"
  );
}
