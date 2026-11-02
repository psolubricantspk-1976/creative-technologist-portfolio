"use client";

import { useState } from "react";
import { startHref } from "@/config/site";

type TierId = "spark" | "forge" | "apex";
type SizeKey = "10k" | "25k" | "50k" | "100k" | "200k";

const SIZES: Array<{ key: SizeKey; label: string }> = [
  { key: "10k", label: "$10K" },
  { key: "25k", label: "$25K" },
  { key: "50k", label: "$50K" },
  { key: "100k", label: "$100K" },
  { key: "200k", label: "$200K" },
];

type Tier = {
  id: TierId;
  name: string;
  type: string;
  tagline: string;
  split: string;
  target: string;
  daily: string;
  max: string;
  minDays: string;
  popular?: boolean;
  fees: Record<SizeKey, string>;
};

const TIERS: Tier[] = [
  {
    id: "spark",
    name: "Spark",
    type: "1-Step",
    tagline:
      "One target, one phase. The shortest route from evaluation to a simulated funded account.",
    split: "80%",
    target: "8%",
    daily: "4%",
    max: "8%",
    minDays: "3 trading days",
    fees: {
      "10k": "$59",
      "25k": "$119",
      "50k": "$199",
      "100k": "$329",
      "200k": "$549",
    },
  },
  {
    id: "forge",
    name: "Forge",
    type: "2-Step",
    tagline:
      "The balanced two-phase evaluation. Room to build a track record without a daily loss ceiling that punishes a bad open.",
    split: "90%",
    target: "8% / 5%",
    daily: "5%",
    max: "10%",
    minDays: "None",
    popular: true,
    fees: {
      "10k": "$89",
      "25k": "$169",
      "50k": "$269",
      "100k": "$439",
      "200k": "$729",
    },
  },
  {
    id: "apex",
    name: "Apex",
    type: "1-Step Pro",
    tagline:
      "Tighter risk, higher reward split. Built for experienced operators with a repeatable process.",
    split: "92%",
    target: "6%",
    daily: "3%",
    max: "6%",
    minDays: "None",
    fees: {
      "10k": "$129",
      "25k": "$239",
      "50k": "$379",
      "100k": "$599",
      "200k": "$999",
    },
  },
];

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
  const price = tier.fees[size];

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
            href={startHref({
              program: tier.name,
              size: sizeLabel,
              price,
            })}
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
