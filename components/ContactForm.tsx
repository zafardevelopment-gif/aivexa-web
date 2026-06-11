"use client";

import { useActionState } from "react";
import { submitMessage, type ContactState } from "@/app/actions";

const initialState: ContactState = { ok: false, error: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitMessage, initialState);

  return (
    <form action={formAction} className="contact-form">
      {state.ok && (
        <div className="form-alert ok">
          Thank you! Your message has been received — we will get back to you soon.
        </div>
      )}
      {state.error && <div className="form-alert err">{state.error}</div>}
      <div className="row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input id="cf-name" name="name" type="text" placeholder="Your full name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-phone">Phone (optional)</label>
          <input id="cf-phone" name="phone" type="tel" placeholder="+91-" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-email">Work Email</label>
        <input id="cf-email" name="email" type="email" placeholder="you@company.com" required />
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" placeholder="Tell us about your clinic or business and what you want to automate…" required />
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Sending…" : "Book a Demo"}
      </button>
    </form>
  );
}
