import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactNotification } from "@/lib/resend";

const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.firstName !== "string" || typeof body.email !== "string") {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const inquiryType = str(body.inquiryType || "Something else", 40);
  const brief = {
    projectType: str(body.projectType, 60),
    usage: str(body.usage, 60),
    scriptLength: str(body.scriptLength, 120),
    deadline: str(body.deadline, 40),
    budget: str(body.budget, 120),
  };
  const message = str(body.comments, 5000);

  // contact_submissions has fixed columns, so the brief is folded into the
  // message rather than blocking on a migration we can't run yet.
  const briefLines = Object.entries({
    "Project type": brief.projectType,
    Usage: brief.usage,
    "Script length": brief.scriptLength,
    Deadline: brief.deadline,
    Budget: brief.budget,
  })
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  const comments = [`Inquiry type: ${inquiryType}`, ...briefLines, "", message]
    .join("\n")
    .trim()
    .slice(0, 5000);

  const submission = {
    first_name: str(body.firstName, 200),
    last_name: str(body.lastName, 200),
    email: str(body.email, 320),
    phone: str(body.phone, 60),
    comments,
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
    comments: message,
    subscribed: submission.subscribed,
    inquiryType,
    brief,
  }).catch((err) => console.error("contact notification email failed", err));

  return NextResponse.json({ ok: true });
}
