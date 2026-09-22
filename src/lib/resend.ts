import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendContactNotification(submission: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments: string;
  subscribed: boolean;
}) {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("Resend not configured — skipping contact notification email.");
    return;
  }

  await resend.emails.send({
    from: "CoteLind Site <onboarding@resend.dev>",
    to,
    replyTo: submission.email,
    subject: `New inquiry from ${submission.firstName} ${submission.lastName}`,
    text: [
      `Name: ${submission.firstName} ${submission.lastName}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || "(not provided)"}`,
      `Newsletter opt-in: ${submission.subscribed ? "yes" : "no"}`,
      "",
      submission.comments || "(no message)",
    ].join("\n"),
  });
}
