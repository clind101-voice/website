import type { Metadata } from "next";
import { getContentBlock } from "@/lib/content";
import SectionHeading from "@/components/public/SectionHeading";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Booking | Cote Lind",
  description:
    "Get in touch to book Cote Lind for a singing, acting, or voice-over project, or join her mailing list.",
};

export default async function ContactPage() {
  const blurb = await getContentBlock(
    "contact_blurb",
    "Join my mailing list or reach out to contact or book me!"
  );

  return (
    <div className="bg-[var(--ink)] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading ghost="CONTACT" title={blurb} />
        <ContactForm />
      </div>
    </div>
  );
}
