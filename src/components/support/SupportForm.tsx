"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  supportEmail: string;
  siteName: string;
};

const TOPICS = [
  "Starting an evaluation",
  "Account or login issue",
  "Rules and drawdown",
  "Payouts",
  "Payment or invoice",
  "Something else",
];

export function SupportForm({ supportEmail, siteName }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const subject = `[${topic}] ${name || "Support request"}${reference ? ` — ${reference}` : ""}`;

  const body = [
    `Hello ${siteName} team,`,
    "",
    message,
    "",
    "—",
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    reference ? `Order / account reference: ${reference}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`To: ${supportEmail}\nSubject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <form className="sup-form" onSubmit={submit}>
      <div className="sup-row">
        <label>
          <span>Your name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Morgan"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <div className="sup-row">
        <label>
          <span>Topic</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {TOPICS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Order or account reference (optional)</span>
          <input
            type="text"
            name="reference"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="GFX-XXXXXXX"
          />
        </label>
      </div>

      <label>
        <span>How can we help?</span>
        <textarea
          name="message"
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what happened, what you expected, and any dates or trade IDs involved."
        />
      </label>

      <div className="sup-actions">
        <button type="submit" className="gfx-btn gfx-btn--primary">
          Send message
        </button>
        <span className="sup-actions-note">
          Opens your email app with this message ready to send.
        </span>
      </div>

      {sent && (
        <div className="sup-sent" role="status">
          <b>Your email app should be opening.</b>
          <p>
            If nothing happened, write to <a href={`mailto:${supportEmail}`}>{supportEmail}</a>{" "}
            directly, or copy the message across.
          </p>
          <button type="button" className="st-copy" onClick={copyMessage}>
            {copied ? "Copied ✓" : "Copy message"}
          </button>
        </div>
      )}

      <p className="sup-terms">
        By sending a message you agree to our <Link href="/legal#privacy">privacy policy</Link>.
        Never send your trading password — support will never ask for it.
      </p>
    </form>
  );
}
