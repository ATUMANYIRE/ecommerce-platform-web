"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/forms/styles";

const topics = ["An order", "Returns & refunds", "A product", "Selling on Atlas", "Something else"];

/** Demo contact form: validates and confirms, but sends nothing. */
export default function ContactForm() {
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const [name, setName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("sending");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setPhase("sent");
  }

  if (phase === "sent") {
    return (
      <section className={`${cardClass} flex flex-col items-center py-xxl text-center`}>
        <Icon name="mark_email_read" className="mb-md text-[48px] text-secondary" />
        <h2 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-ivory">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""}
        </h2>
        <p className="max-w-md font-body-md text-body-md text-muted">
          Your message has been received. This is a demo store, so no e-mail was
          sent — in a live store our team would reply within one business day.
        </p>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      <h2 className="mb-lg font-title-lg text-title-lg text-ivory">Send a message</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>Full name</label>
            <input
              id="contact-name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>Email</label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={254}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-topic" className={labelClass}>Topic</label>
          <select id="contact-topic" className={`${inputClass} cursor-pointer`} defaultValue={topics[0]}>
            {topics.map((topic) => (
              <option key={topic} className="bg-ink">{topic}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>Message</label>
          <textarea
            id="contact-message"
            required
            rows={5}
            maxLength={2000}
            className={`${inputClass} resize-y`}
            placeholder="How can we help?"
          />
        </div>
        <div>
          <button type="submit" disabled={phase === "sending"} className={primaryButtonClass}>
            {phase === "sending" ? (
              <>
                <Icon name="sync" className="animate-spin text-[16px]" />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
