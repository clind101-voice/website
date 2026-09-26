import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

type Brief = {
  projectType?: string;
  usage?: string;
  scriptLength?: string;
  deadline?: string;
  budget?: string;
};

export async function sendContactNotification(submission: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  comments: string;
  subscribed: boolean;
  inquiryType?: string;
  brief?: Brief;
}) {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!resend || !to) {
    // Loud on purpose: the submission is saved, but nobody is being told about
    // it, and a voice-over booking goes to whoever replies first.
    console.error(
      "Resend not configured — inquiry saved to the database but NO EMAIL SENT. " +
        "Set RESEND_API_KEY and CONTACT_NOTIFY_EMAIL."
    );
    return;
  }

  const name = [submission.firstName, submission.lastName].filter(Boolean).join(" ");
  const kind = submission.inquiryType || "Website";
  const b = submission.brief ?? {};

  // Front-loaded so it is triageable from a phone's lock screen.
  const subject =
    kind === "Voice-over"
      ? ["VO inquiry:", name, b.projectType && `— ${b.projectType}`, b.deadline && `(due ${b.deadline})`]
          .filter(Boolean)
          .join(" ")
      : `${kind} inquiry: ${name}`;

  const briefLines = [
    ["Project type", b.projectType],
    ["Usage", b.usage],
    ["Script length", b.scriptLength],
    ["Deadline", b.deadline],
    ["Budget", b.budget],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);

  await resend.emails.send({
    from: "CoteLind Site <onboarding@resend.dev>",
    to,
    replyTo: submission.email,
    subject,
    text: [
      `${kind} inquiry from ${name}`,
      "",
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || "(not provided)"}`,
      ...(briefLines.length ? ["", "— Project brief —", ...briefLines] : []),
      "",
      "— Message —",
      submission.comments || "(no message)",
      "",
      `Newsletter opt-in: ${submission.subscribed ? "yes" : "no"}`,
      "",
      "Reply directly to this email to reach them.",
    ].join("\n"),
  });
}
