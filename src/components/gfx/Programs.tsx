"use client";

import { useState } from "react";
import { startHref } from "@/config/site";
import {
  PROGRAMS as TIERS,
  SIZES,
  priceFor,
  type ProgramId as TierId,
  type SizeKey,
} from "@/config/programs";

function CheckIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function Programs() {
  const [activeId, setActiveId] = useState<TierId>("forge");
  const [size, setSize] = useState<SizeKey>("50k");

  const tier = TIERS.find((item) => item.id === activeId) ?? TIERS[1];
  const sizeLabel = SIZES.find((item) => item.key === size)?.label ?? "$50K";
  const price = priceFor(tier, size);

  const objectives: Array<[string, string, boolean?]> = [
    ["Profit target", tier.target],
    ["Daily loss limit", tier.daily],
    ["Maximum loss limit", tier.max],
    ["Minimum trading days", tier.minDays],
    ["Reward split", tier.split],
    ["News trading", "Allowed", true],
    ["Weekend holding", "Allowed", true],
    ["Scaling potential", "Up to $2M", false],
  ];

  const features = [
    `${sizeLabel} virtual capital`,
    `${tier.split} maximum reward split`,
    "60+ markets on MT5",
    "News & weekend holding allowed",
    "Scaling plan up to $2M",
  ];

  return (
    <div>
      <div className="gfx-tier-tabs" role="group" aria-label="Choose an evaluation program">
        {TIERS.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              className={`gfx-tier-tab${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => setActiveId(item.id)}
            >
              {item.popular && <span className="gfx-tier-pop">Most chosen</span>}
              <span className="gfx-tier-top">
                <span className="gfx-tier-name">{item.name}</span>
                <span className="gfx-tier-type">{item.type}</span>
              </span>
              <span className="gfx-tier-meta">
                <span className="gfx-tier-split">
                  {item.split}
                  <small>max reward split</small>
                </span>
                <span className="gfx-tier-radio" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="gfx-program-panel">
        <div className="gfx-program-main">
          <div className="gfx-program-title-row">
            <div>
              <h3 className="gfx-program-title">
                {tier.name} <span style={{ color: "rgba(255,255,255,0.32)" }}>/</span>{" "}
                {sizeLabel}
              </h3>
              <p className="gfx-program-desc">{tier.tagline}</p>
            </div>
          </div>

          <div className="gfx-size-row" role="group" aria-label="Virtual account size">
            {SIZES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`gfx-size-btn${item.key === size ? " is-active" : ""}`}
                aria-pressed={item.key === size}
                onClick={() => setSize(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="gfx-objectives">
            {objectives.map(([label, value, isGood]) => (
              <div className="gfx-objective" key={label}>
                <span>{label}</span>
                <span className={isGood ? "is-good" : undefined}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="gfx-buy" aria-label="Evaluation summary">
          <span className="gfx-buy-badge">
            {tier.popular ? "Most chosen program" : "One-time evaluation fee"}
          </span>
          <span className="gfx-buy-label">Evaluation fee</span>
          <div className="gfx-buy-price">
            {price} <small>USD</small>
          </div>
          <div className="gfx-buy-size">{sizeLabel} virtual account · {tier.type}</div>

          <ul className="gfx-buy-list">
            {features.map((feature) => (
              <li key={feature}>
                <span className="gfx-check" aria-hidden="true">
                  <CheckIcon />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="gfx-pay-row" aria-label="Accepted payment methods">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>USDT</span>
            <span>BTC</span>
          </div>

          <a
            href={startHref({ program: tier.id, size })}
            className="gfx-btn gfx-btn--primary gfx-btn--block"
          >
            Start {tier.name} — {price}
          </a>
          <p className="gfx-buy-note">
            Instant dashboard access · Secure checkout
          </p>
        </aside>
      </div>

      <p className="gfx-footnote">
        All programs use a static maximum loss limit measured from your starting
        balance. Evaluation fees are service fees for a simulated account and are
        not deposits or investments. See the{" "}
        <a href="#rules" style={{ color: "#ffb066", textDecoration: "underline" }}>
          risk framework
        </a>{" "}
        for full details.
      </p>
    </div>
  );
}
