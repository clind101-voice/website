import { createClient } from "@/lib/supabase/server";

export default async function AdminInquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Inquiries</h1>
      <p className="mb-6 text-sm text-neutral-600">
        Every submission also emails you directly — this list is a backup archive.
      </p>
      <div className="flex flex-col gap-3">
        {(data ?? []).length === 0 && (
          <p className="text-sm text-neutral-500">No inquiries yet.</p>
        )}
        {(data ?? []).map((row) => (
          <div key={row.id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="font-medium">
                {row.first_name} {row.last_name}
              </p>
              <p className="text-xs text-neutral-400">
                {new Date(row.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-neutral-600">
              {row.email} {row.phone && `· ${row.phone}`}
            </p>
            {row.comments && <p className="mt-2 text-sm text-neutral-800">{row.comments}</p>}
            {row.subscribed && (
              <p className="mt-2 text-xs font-medium text-green-600">Subscribed to newsletter</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
