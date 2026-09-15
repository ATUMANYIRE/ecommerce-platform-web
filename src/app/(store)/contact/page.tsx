import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import ContactForm from "@/components/info/ContactForm";

export const metadata: Metadata = {
  title: "Contact - Atlas Marketplace",
  description: "Get in touch with the Atlas client care team.",
};

export default function ContactPage() {
  return (
    <InfoPage
      content={{
        eyebrow: "Company",
        title: "Contact Us",
        intro: "Questions about an order, a product or selling on Atlas? Send us a message.",
        icon: "support_agent",
        sections: [
          {
            heading: "Client care hours",
            bullets: [
              "Monday to Friday, 8 am – 8 pm.",
              "Saturday, 10 am – 4 pm.",
              "Replies within one business day.",
            ],
          },
        ],
      }}
    >
      <ContactForm />
    </InfoPage>
  );
}
