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
import {
  PAYMENT_METHODS,
  paymentMethodById,
  type PaymentMethodId,
} from "@/config/payments";

type Props = {
  initialProgram: ProgramId;
  initialSize: SizeKey;
  initialMethod?: PaymentMethodId;
  checkoutUrl: string | null;
  supportEmail: string;
  siteName: string;
};

const STEPS = ["Program", "Payment", "Confirm"] as const;

export function StartFlow({
  initialProgram,
  initialSize,
  initialMethod,
  checkoutUrl,
  supportEmail,
  siteName,
}: Props) {
  const [step, setStep] = useState(0);
  const [programId, setProgramId] = useState<ProgramId>(initialProgram);
  const [sizeKey, setSizeKey] = useState<SizeKey>(initialSize);
  const [methodId, setMethodId] = useState<PaymentMethodId>(
    initialMethod ?? PAYMENT_METHODS[0].id
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [order, setOrder] = useState<{ ref: string; at: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const program = useMemo(() => programById(programId), [programId]);
  const size = useMemo(() => sizeByKey(sizeKey), [sizeKey]);
  const method = useMemo(() => paymentMethodById(methodId), [methodId]);
  const price = useMemo(() => priceFor(program, sizeKey), [program, sizeKey]);

  const details = order
    ? [
        `Order: ${order.ref}`,
        `Placed: ${order.at}`,
        "",
        `Program: ${program.name} (${program.type})`,
        `Account size: ${size.label} virtual capital`,
        `Evaluation fee: ${price} USD`,
        `Payment method: ${method.name} — ${method.subtitle}`,
        "",
        `Profit target: ${program.target}`,
        `Daily loss limit: ${program.daily}`,
        `Maximum loss limit: ${program.max}`,
        `Reward split: ${program.split}`,
        "",
        `Name: ${name}`,
        `Email: ${email}`,
      ].join("\n")
    : "";

  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    order ? `Order ${order.ref} — ${program.name} ${size.label}` : `Start ${program.name} evaluation`
  )}&body=${encodeURIComponent(
    [
      `Hello ${siteName} team,`,
      "",
      order
        ? `I have just placed order ${order.ref}. Please send the payment details.`
        : `I would like to start the ${program.name} evaluation.`,
      "",
      details,
      "",
      "Thank you.",
    ].join("\n")
  )}`;

  const checkout = useMemo(() => {
    if (!checkoutUrl) return null;
    const separator = checkoutUrl.includes("?") ? "&" : "?";
    return `${checkoutUrl}${separator}program=${program.id}&size=${size.key}&method=${method.id}`;
  }, [checkoutUrl, program.id, size.key, method.id]);

  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agreed) return;

    if (checkout) {
      window.location.href = checkout;
      return;
    }

    const stamp = Date.now().toString(36).toUpperCase().slice(-5);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
    setOrder({
      ref: `GFX-${stamp}${rand}`,
      at: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    });
    setStep(3);
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

  function reset() {
    setOrder(null);
    setStep(0);
    setAgreed(false);
    setCopied(false);
  }

  /* ── confirmation ─────────────────────────────────────────── */
  if (order) {
    return (
      <div className="st-shell">
        <div className="st-confirm">
          <div className="st-confirm-head">
            <span className="st-confirm-tick" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m20 6-11 11-5-5" />
              </svg>
            </span>
            <div>
              <h2>Order {order.ref} reserved</h2>
              <p>
                Placed {order.at} · {program.name} {size.label} · {price} USD ·{" "}
                {method.name}
              </p>
            </div>
          </div>

          <div className="st-confirm-grid">
            <div className="st-confirm-block">
              <h3>What happens next</h3>
              <p>{method.nextStep}</p>
              <ol className="st-steps-list">
                <li>Send the confirmation email below so the desk has your order.</li>
                <li>You receive payment details for {method.name.toLowerCase()} within one business day.</li>
                <li>Your trading credentials arrive by email once the payment clears.</li>
              </ol>
            </div>

            <div className="st-confirm-block">
              <h3>Your order</h3>
              <dl className="st-order">
                <div><dt>Reference</dt><dd>{order.ref}</dd></div>
                <div><dt>Program</dt><dd>{program.name} {program.type}</dd></div>
                <div><dt>Account size</dt><dd>{size.label}</dd></div>
                <div><dt>Fee</dt><dd>{price} USD</dd></div>
                <div><dt>Method</dt><dd>{method.name}</dd></div>
                <div><dt>Email</dt><dd>{email}</dd></div>
              </dl>
            </div>
          </div>

          <div className="st-confirm-actions">
            <a href={mailto} className="gfx-btn gfx-btn--primary">
              Email my order
            </a>
            <button type="button" className="gfx-btn gfx-btn--ghost gfx-btn--sm" onClick={copyDetails}>
              {copied ? "Copied ✓" : "Copy order details"}
            </button>
            <button type="button" className="st-link-btn" onClick={reset}>
              Start another order
            </button>
          </div>

          <p className="st-confirm-note">
            Nothing has been charged. Order references are issued locally by this page
            until the payment gateway is connected — the desk confirms every order by
            email. Questions? <Link href="/support">Contact support</Link> or read the{" "}
            <Link href="/help">Help Center</Link>.
          </p>
        </div>
      </div>
    );
  }

  /* ── steps ────────────────────────────────────────────────── */
  return (
    <div className="st-shell">
      <ol className="st-progress" aria-label="Checkout progress">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`st-progress-step${index === step ? " is-current" : ""}${
              index < step ? " is-done" : ""
            }`}
            aria-current={index === step ? "step" : undefined}
          >
            <b>{index + 1}</b>
            <span>{label}</span>
          </li>
        ))}
      </ol>

      <div className="st-grid">
        <div className="st-main">
          {step === 0 && (
            <>
              <section className="st-block" aria-labelledby="st-program">
                <h2 id="st-program">Choose your program</h2>
                <p className="st-hint">
                  Every program is a simulated evaluation. You pay a one-time fee,
                  trade virtual capital, and keep a share of simulated rewards once
                  funded.
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
                <h2 id="st-size">Account size</h2>
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
                  Risk limits are percentages, so they scale with the account instead of
                  staying fixed.
                </p>
              </section>
            </>
          )}

          {step === 1 && (
            <section className="st-block" aria-labelledby="st-pay">
              <h2 id="st-pay">How would you like to pay?</h2>
              <p className="st-hint">
                Choose a method now — the payment itself is completed with the details
                the desk sends you.
              </p>
              <div className="st-methods" role="radiogroup" aria-labelledby="st-pay">
                {PAYMENT_METHODS.map((item) => {
                  const active = item.id === methodId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      className={`st-method${active ? " is-active" : ""}`}
                      onClick={() => setMethodId(item.id)}
                    >
                      <span className="st-method-top">
                        <b>{item.name}</b>
                        <span className="st-method-radio" aria-hidden="true" />
                      </span>
                      <span className="st-method-sub">{item.subtitle}</span>
                      <span className="st-method-badges">
                        {item.badges.map((badge) => (
                          <em key={badge}>{badge}</em>
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="st-method-note">{method.note}</p>
            </section>
          )}

          {step === 2 && (
            <section className="st-block" aria-labelledby="st-details">
              <h2 id="st-details">Confirm your details</h2>
              <form className="st-form" onSubmit={placeOrder}>
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

                <div className="st-review">
                  <div>
                    <span>Program</span>
                    <b>{program.name} · {program.type}</b>
                  </div>
                  <div>
                    <span>Account size</span>
                    <b>{size.label}</b>
                  </div>
                  <div>
                    <span>Payment method</span>
                    <b>{method.name}</b>
                  </div>
                  <div className="st-review-total">
                    <span>Total due</span>
                    <b>{price} USD</b>
                  </div>
                </div>

                <label className="st-check">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    required
                  />
                  <span>
                    I have read the <Link href="/legal#terms">terms</Link> and the{" "}
                    <Link href="/legal#risk-disclosure">risk disclosure</Link>, and I
                    understand this is a simulated evaluation.
                  </span>
                </label>

                <button
                  type="submit"
                  className="gfx-btn gfx-btn--primary gfx-btn--block"
                  disabled={!agreed}
                >
                  {checkout ? `Continue to checkout — ${price}` : `Place order — ${price}`}
                </button>

                <p className="st-fineprint">
                  {checkout
                    ? "You will be taken to the secure checkout to complete payment."
                    : "Nothing is charged here. Placing the order reserves it and the desk emails you the payment details for the method you chose."}
                </p>
              </form>
            </section>
          )}

          <div className="st-nav">
            <button
              type="button"
              className="gfx-btn gfx-btn--ghost gfx-btn--sm"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
            >
              ← Back
            </button>
            {step < 2 && (
              <button
                type="button"
                className="gfx-btn gfx-btn--primary gfx-btn--sm"
                onClick={() => setStep((value) => Math.min(2, value + 1))}
              >
                Continue →
              </button>
            )}
          </div>
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
            <div><dt>Profit target</dt><dd>{program.target}</dd></div>
            <div><dt>Daily loss limit</dt><dd>{program.daily}</dd></div>
            <div><dt>Maximum loss limit</dt><dd>{program.max}</dd></div>
            <div><dt>Minimum trading days</dt><dd>{program.minDays}</dd></div>
            <div><dt>Reward split</dt><dd>{program.split}</dd></div>
            <div><dt>Payment method</dt><dd>{method.name}</dd></div>
          </dl>

          <ul className="st-summary-list">
            <li>One-time fee — no subscription</li>
            <li>Instant dashboard access after payment</li>
            <li>News trading and weekend holding allowed</li>
          </ul>

          <p className="st-summary-foot">
            Evaluation fees are service fees for a simulated account, not deposits. Read
            the <Link href="/help">Help Center</Link> or{" "}
            <Link href="/legal#risk-disclosure">risk disclosure</Link> before you buy.
          </p>
        </aside>
      </div>
    </div>
  );
}
