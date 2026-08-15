/**
 * Reference style: General Enquiry card — precise single-column fields, spacious white panel, and full-width black send control.
 * Purpose: Submits the required public contact details to the Noman Builds backend.
 */
import { CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitMessage = trpc.contact.submit.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    try {
      await submitMessage.mutateAsync({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      setSubmitted(true);
    } catch {
      setError("Your message could not be sent. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="form-success form-success--general-enquiry" role="status">
        <CheckCircle2 size={36} />
        <h3>Thank you for your message.</h3>
        <p>Your enquiry has been received.</p>
        <button className="text-button" onClick={() => setSubmitted(false)}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="contact-form contact-form--general-enquiry" onSubmit={handleSubmit}>
      <p className="form-kicker">GENERAL ENQUIRY</p><h2>Send us a message</h2>
      <div className="contact-form__grid">
        <label className="full-field"><span>Name</span><input name="name" required placeholder="" /></label>
        <label className="full-field"><span>Email</span><input name="email" required type="email" placeholder="" /></label>
        <label className="full-field"><span>Phone</span><input name="phone" required type="tel" inputMode="tel" placeholder="" /></label>
        <label className="full-field"><span>Message</span><textarea name="message" required rows={6} placeholder="" /></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--gold form-submit" disabled={submitMessage.isPending} type="submit">{submitMessage.isPending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
