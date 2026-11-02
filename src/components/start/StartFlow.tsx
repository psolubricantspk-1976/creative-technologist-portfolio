"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PROGRAMS,
  SIZES,
  priceFor,
  programById,
  sizeByKey,
  type ProgramId,
  type SizeKey,
} from "@/config/programs";

type Props = {
  initialProgram: ProgramId;
  initialSize: SizeKey;
  checkoutUrl: string | null;
  supportEmail: string;
  siteName: string;
};

const RULES: Array<[string, (p: ReturnType<typeof programById>) => string]> = [
  ["Profit target", (p) => p.target],
  ["Daily loss limit", (p) => p.daily],
  ["Maximum loss limit", (p) => p.max],
  ["Minimum trading days", (p) => p.minDays],
  ["Reward split", (p) => p.split],
];

export function StartFlow({
  initialProgram,
  initialSize,
  checkoutUrl,
  supportEmail,
  siteName,
}: Props) {
  const [programId, setProgramId] = useState<ProgramId>(initialProgram);
  const [sizeKey, setSizeKey] = useState<SizeKey>(initialSize);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const program = useMemo(() => programById(programId), [programId]);
  const size = useMemo(() => sizeByKey(sizeKey), [sizeKey]);
  const price = useMemo(() => priceFor(program, sizeKey), [program, sizeKey]);

  const details = [
    `Program: ${program.name} (${program.type})`,
    `Account size: ${size.label} virtual capital`,
    `Evaluation fee: ${price} USD`,
    `Profit target: ${program.target}`,
    `Daily loss limit: ${program.daily}`,
    `Maximum loss limit: ${program.max}`,
    `Reward split: ${program.split}`,
    name ? `Name: ${name}` : null,
    email ? `Email: ${email}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    `Start ${program.name} evaluation — ${size.label} (${price})`
  )}&body=${encodeURIComponent(
    [
      `Hello ${siteName} team,`,
      "",
      `I would like to start the ${program.name} evaluation.`,
      "",
      details,
      "",
      "Please send me the checkout link and next steps.",
    ].join("\n")
  )}`;

  const [copied, setCopied] = useState(false);

  const checkout = useMemo(() => {
    if (!checkoutUrl) return null;
    const separator = checkoutUrl.includes("?") ? "&" : "?";
    return `${checkoutUrl}${separator}program=${program.id}&size=${size.key}`;
  }, [checkoutUrl, program.id, size.key]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (checkout) {
      window.location.href = checkout;
      return;
    }
    window.location.href = mailto;
    setSent(true);
  }

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="st-shell">
      <div className="st-steps" aria-label="Checkout progress">
        <span className="st-step is-done">
          <b>1</b> Choose program
        </span>
        <span className="st-step is-done">
          <b>2</b> Choose size
        </span>
        <span className="st-step is-current">
          <b>3</b> Confirm &amp; pay
        </span>
      </div>

      <div className="st-grid">
        <div className="st-main">
          <section className="st-block" aria-labelledby="st-program">
            <h2 id="st-program">1. Choose your program</h2>
            <p className="st-hint">
              Every program is a simulated evaluation. You pay a one-time fee, trade
              virtual capital, and keep a share of simulated rewards once funded.
            </p>
            <div className="st-programs" role="radiogroup" aria-labelledby="st-program">
              {PROGRAMS.map((item) => {
                const active = item.id === programId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`st-program${active ? " is-active" : ""}`}
                    onClick={() => setProgramId(item.id)}
                  >
                    <span className="st-program-top">
                      <b>{item.name}</b>
                      <span className="st-program-split">{item.split} split</span>
                    </span>
                    <span className="st-program-type">{item.type}</span>
                    <span className="st-program-target">
                      Target {item.target} · Max loss {item.max}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="st-block" aria-labelledby="st-size">
            <h2 id="st-size">2. Choose your account size</h2>
            <div className="st-sizes" role="radiogroup" aria-labelledby="st-size">
              {SIZES.map((item) => {
                const active = item.key === sizeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`st-size${active ? " is-active" : ""}`}
                    onClick={() => setSizeKey(item.key)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="st-hint">
              The fee changes with size. Risk limits are percentages, so they scale with
              the account instead of staying fixed.
            </p>
          </section>

          <section className="st-block" aria-labelledby="st-confirm">
            <h2 id="st-confirm">3. Confirm your details</h2>
            <form className="st-form" onSubmit={handleSubmit}>
              <label>
                <span>Full name</span>
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

              <button type="submit" className="gfx-btn gfx-btn--primary gfx-btn--block">
                {checkout ? `Continue to checkout — ${price}` : `Request ${program.name} — ${price}`}
              </button>

              <p className="st-fineprint">
                {checkout
                  ? "You will be taken to the secure checkout to complete payment."
                  : "This opens a pre-filled email to the desk with your selection. Nothing is charged until you confirm with them."}
              </p>

              {sent && (
                <div className="st-sent" role="status">
                  <b>Your email app should be opening.</b>
                  <p>
                    If it did not, write to <a href={`mailto:${supportEmail}`}>{supportEmail}</a>{" "}
                    with the details below, or copy them across.
                  </p>
                  <button type="button" className="st-copy" onClick={copyDetails}>
                    {copied ? "Copied ✓" : "Copy my selection"}
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>

        <aside className="st-summary" aria-label="Order summary" aria-live="polite">
          <span className="st-summary-eyebrow">Your selection</span>
          <div className="st-summary-name">
            {program.name} <span>{program.type}</span>
          </div>
          <div className="st-summary-price">
            {price} <small>USD</small>
          </div>
          <div className="st-summary-size">{size.label} virtual capital</div>

          <dl className="st-summary-rules">
            {RULES.map(([label, read]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{read(program)}</dd>
              </div>
            ))}
          </dl>

          <ul className="st-summary-list">
            <li>One-time fee — no subscription</li>
            <li>Instant dashboard access after payment</li>
            <li>News trading and weekend holding allowed</li>
          </ul>

          <p className="st-summary-foot">
            Evaluation fees are service fees for a simulated account, not deposits.
            Read the{" "}
            <Link href="/help">Help Center</Link> or{" "}
            <Link href="/legal#risk-disclosure">risk disclosure</Link> before you buy.
          </p>
        </aside>
      </div>
    </div>
  );
}
