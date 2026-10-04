/**
 * Shown on the admin pages when a deployment is missing its Supabase keys.
 * Without this the sign-in form would render normally and fail against a
 * placeholder host, which looks like a broken password rather than a
 * misconfigured deployment.
 */
export default function NotConfiguredNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-lg font-semibold text-neutral-900">Admin isn&apos;t set up yet</h1>
        <p className="text-sm leading-relaxed text-neutral-600">
          This site is missing its database connection, so signing in won&apos;t work yet.
          Whoever set up the site needs to add the Supabase environment variables to the
          hosting project and redeploy.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          The public pages are unaffected — visitors can still browse the site.
        </p>
      </div>
    </div>
  );
}
