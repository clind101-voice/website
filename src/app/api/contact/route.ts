import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.firstName !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const submission = {
    first_name: String(body.firstName).slice(0, 200),
    last_name: String(body.lastName ?? "").slice(0, 200),
    email: String(body.email).slice(0, 320),
    phone: String(body.phone ?? "").slice(0, 60),
    comments: String(body.comments ?? "").slice(0, 5000),
    subscribed: Boolean(body.subscribed),
  };

  // RLS policy "contact_submissions: anyone can submit" allows this insert
  // with only the anon key — no service role needed for the public form.
  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert(submission);

  if (error) {
    console.error("contact_submissions insert failed", error);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }

  await sendContactNotification({
    firstName: submission.first_name,
    lastName: submission.last_name,
    email: submission.email,
    phone: submission.phone,
    comments: submission.comments,
    subscribed: submission.subscribed,
  }).catch((err) => console.error("contact notification email failed", err));

  return NextResponse.json({ ok: true });
}
