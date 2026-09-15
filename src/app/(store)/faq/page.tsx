import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import Icon from "@/components/ui/Icon";
import { faqGroups } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "FAQ - Atlas Marketplace",
  description: "Answers to common questions about orders, payments, shipping and accounts.",
};

export default function FaqPage() {
  return (
    <InfoPage
      content={{
        eyebrow: "Support",
        title: "Frequently Asked Questions",
        intro: "Quick answers about orders, payments, delivery and your account.",
        icon: "help",
        sections: [],
      }}
    >
      {faqGroups.map((group) => (
        <section key={group.topic} className="flex flex-col gap-md">
          <h2 className="font-label-md text-label-md uppercase tracking-widest text-secondary">
            {group.topic}
          </h2>
          <div className="divide-y divide-ivory/10 rounded-lg border border-ivory/10 bg-ink">
            {group.questions.map((item) => (
              <details key={item.q} className="group px-lg py-md">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-md font-body-lg text-body-lg text-ivory marker:hidden">
                  {item.q}
                  <Icon
                    name="expand_more"
                    className="text-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="mt-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </InfoPage>
  );
}
