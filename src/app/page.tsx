import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/gfx/Nav";
import { Programs } from "@/components/gfx/Programs";
import { Reveal } from "@/components/gfx/Reveal";
import { HeroCreatures } from "@/components/gfx/HeroCreatures";
import { Footer } from "@/components/gfx/Footer";
import { loginHref, siteConfig, startHref, supportHref } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      "A simulated trading evaluation built for disciplined traders. Transparent rules, up to $200K virtual capital, and rewards up to 92%.",
  },
};

/* ───────────────────────────── helpers ───────────────────────────── */

type RevealProps = {
  "data-reveal": string;
  style?: CSSProperties;
};

function reveal(delay = 0): RevealProps {
  return delay > 0
    ? {
        "data-reveal": "",
        style: { "--reveal-delay": `${delay}ms` } as CSSProperties,
      }
    : { "data-reveal": "" };
}

function ArrowUpRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function Star({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95L12 2.6Z" />
    </svg>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="gfx-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} />
      ))}
    </span>
  );
}

/* ───────────────────────────── data ───────────────────────────── */

const MARKET_TAPE = [
  { symbol: "EUR/USD", price: "1.0842", change: "+0.12%", up: true },
  { symbol: "GBP/USD", price: "1.2671", change: "-0.08%", up: false },
  { symbol: "USD/JPY", price: "151.32", change: "+0.34%", up: true },
  { symbol: "XAU/USD", price: "2,412.60", change: "+0.67%", up: true },
  { symbol: "US500", price: "5,284.10", change: "-0.21%", up: false },
  { symbol: "NAS100", price: "18,420.50", change: "+0.44%", up: true },
  { symbol: "BTC/USD", price: "67,240.00", change: "-1.12%", up: false },
  { symbol: "GER40", price: "18,750.30", change: "+0.18%", up: true },
  { symbol: "UK100", price: "8,210.80", change: "-0.05%", up: false },
  { symbol: "WTI", price: "78.42", change: "+0.92%", up: true },
];

const STATS = [
  { value: "$4.2M", accent: "+", label: "Simulated rewards distributed" },
  { value: "18,400", accent: "+", label: "Traders evaluated worldwide" },
  { value: "60", accent: "+", label: "Markets & instruments" },
  { value: "24h", accent: "*", label: "Average reward review" },
];

const PILLARS = [
  {
    num: "01",
    title: "Rules written in daylight",
    copy: "Every threshold, reset window and payout condition is published before you pay a fee. No hidden consistency clauses and no moving targets.",
    icon: "rules" as const,
  },
  {
    num: "02",
    title: "Risk-first infrastructure",
    copy: "Daily and maximum loss limits are monitored in real time, so a single bad session can never erase months of disciplined execution.",
    icon: "risk" as const,
  },
  {
    num: "03",
    title: "Rewards without friction",
    copy: "Request a simulated reward from your dashboard. Most requests are reviewed inside 24 hours, with up to 92% of the reward going to you.",
    icon: "reward" as const,
  },
];

const RULES: Array<{
  num: string;
  title: string;
  value: string;
  copy: string;
  icon: "daily" | "max" | "target" | "consistency" | "news" | "payout";
}> = [
  {
    num: "01",
    title: "Daily loss limit",
    value: "3% – 5% of starting balance",
    copy: "Resets at 00:00 UTC. A breach pauses the account for the session — it does not close the evaluation.",
    icon: "daily",
  },
  {
    num: "02",
    title: "Maximum loss limit",
    value: "6% – 10%, static",
    copy: "Measured from your starting balance, never trailing your peak. A breach ends the evaluation.",
    icon: "max",
  },
  {
    num: "03",
    title: "Profit target",
    value: "6% – 8% per phase",
    copy: "Hit the target once to advance. Spark requires three minimum trading days; Forge and Apex have none.",
    icon: "target",
  },
  {
    num: "04",
    title: "Consistency check",
    value: "Best day ≤ 40% of profit",
    copy: "Applied only when you request a simulated reward, so one outlier session cannot carry the whole account.",
    icon: "consistency",
  },
  {
    num: "05",
    title: "News & weekends",
    value: "Allowed on every program",
    copy: "Trade major releases, hold through volatility and keep positions open over the weekend. No blackout windows.",
    icon: "news",
  },
  {
    num: "06",
    title: "Reward eligibility",
    value: "No cap on simulated rewards",
    copy: "Request payouts from your dashboard after the first cycle. Splits range from 80% to 92% depending on program.",
    icon: "payout",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Choose your forge",
    copy: "Pick a program and virtual account size from $10K to $200K. Checkout takes under two minutes.",
  },
  {
    num: "02",
    title: "Trade the evaluation",
    copy: "Trade 60+ markets on MT5 and reach the profit target without breaching either loss limit.",
  },
  {
    num: "03",
    title: "Verify & activate",
    copy: "Confirm your identity, accept the trader agreement and your simulated funded account is issued.",
  },
  {
    num: "04",
    title: "Request rewards",
    copy: "Build a track record, then request a simulated reward directly from your dashboard. Keep up to 92%.",
  },
];

const PAYOUTS = [
  {
    amount: "$12,480.55",
    name: "Amara K.",
    meta: "Forge · $100K",
    time: "22h",
    initials: "AK",
    color: "linear-gradient(135deg,#8a5a2b,#d99a55)",
  },
  {
    amount: "$4,920.00",
    name: "Tomás R.",
    meta: "Apex · $50K",
    time: "9h",
    initials: "TR",
    color: "linear-gradient(135deg,#2e5478,#5f9fc9)",
  },
  {
    amount: "$3,860.40",
    name: "Priya N.",
    meta: "Spark · $25K",
    time: "14h",
    initials: "PN",
    color: "linear-gradient(135deg,#6b3b6e,#b06aa8)",
  },
];

const QUOTES = [
  {
    quote:
      "The drawdown rules are the first set I’ve read end to end without needing support. That alone earned my trust.",
    name: "Tomasz W.",
    meta: "Forge · $50K · Poland",
    initials: "TW",
    color: "linear-gradient(135deg,#3a5f7d,#6f9cba)",
  },
  {
    quote:
      "Reward review took eleven hours, not the five business days I expected. The dashboard told me exactly where I stood the whole time.",
    name: "Priya N.",
    meta: "Apex · $25K · UAE",
    initials: "PN",
    color: "linear-gradient(135deg,#6b3b6e,#b06aa8)",
  },
  {
    quote:
      "I failed my first evaluation and the feedback was honest. Passed the second with better risk. That is exactly the point of this.",
    name: "Marcus B.",
    meta: "Forge · $100K · USA",
    initials: "MB",
    color: "linear-gradient(135deg,#4a5130,#8f9c52)",
  },
];

const FAQS = [
  {
    q: "What is ForgeX Global?",
    a: "ForgeX Global is a simulated proprietary trading evaluation platform. Traders pay a one-time evaluation fee, trade a demo account against published risk rules, and — if they meet the objectives — can request discretionary simulated rewards from a funded evaluation account.",
  },
  {
    q: "Is this real money?",
    a: "No. Every account is a simulated evaluation account. No client funds are traded, no live market execution takes place, and evaluation fees are service fees only — not deposits or investments.",
  },
  {
    q: "How quickly can I start trading?",
    a: "Immediately after checkout. Dashboard access and MT5 credentials are issued within minutes, and there is no waiting list or manual approval step before you begin.",
  },
  {
    q: "What are the profit targets and loss limits?",
    a: "Spark: 8% target, 4% daily limit, 8% maximum limit. Forge: 8% then 5% targets, 5% daily limit, 10% maximum limit. Apex: 6% target, 3% daily limit, 6% maximum limit. All maximum limits are static and measured from your starting balance.",
  },
  {
    q: "Can I trade news and hold over the weekend?",
    a: "Yes, on every program. There are no news blackout windows and no forced weekend closures. Standard risk limits still apply while positions are open.",
  },
  {
    q: "How do simulated reward payouts work?",
    a: "Request a reward from your dashboard once you meet the profit target and consistency check. Most requests are reviewed within 24 hours. The reward split ranges from 80% to 92% depending on your program.",
  },
  {
    q: "Is there a time limit to pass an evaluation?",
    a: "No. There is no deadline on any program. Spark requires a minimum of three trading days; Forge and Apex have no minimum trading days.",
  },
  {
    q: "What happens if I breach a rule?",
    a: "A daily loss breach pauses the account until the next 00:00 UTC reset. A maximum loss breach closes the evaluation. Both are visible in the dashboard before they happen, with live buffers and alerts.",
  },
];

/* ───────────────────────────── icons ───────────────────────────── */

function PillarIcon({ name }: { name: "rules" | "risk" | "reward" }) {
  const shared = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "rules") {
    return (
      <svg {...shared}>
        <path d="M6 3.5h9.5L20 8v12.5H6z" />
        <path d="M15 3.5V8h4.5" />
        <path d="M9.5 12.5h7M9.5 16h4.5" />
      </svg>
    );
  }

  if (name === "risk") {
    return (
      <svg {...shared}>
        <path d="M12 3.2 20 6v6.1c0 4.4-3.2 7.6-8 8.7-4.8-1.1-8-4.3-8-8.7V6l8-2.8Z" />
        <path d="m8.8 12 2.2 2.2 4.3-4.4" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="M13.2 2.8 5 13.6h5.4L9.9 21.2 18.5 10h-5.5l.2-7.2Z" />
    </svg>
  );
}

function RuleIcon({ name }: { name: "daily" | "max" | "target" | "consistency" | "news" | "payout" }) {
  const shared = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "daily":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.3V12l3.2 1.9" />
        </svg>
      );
    case "max":
      return (
        <svg {...shared}>
          <path d="M12 3.2 20 6v6.1c0 4.4-3.2 7.6-8 8.7-4.8-1.1-8-4.3-8-8.7V6l8-2.8Z" />
          <path d="M8.6 15.4 15.4 8.6" />
        </svg>
      );
    case "target":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.4" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );
    case "consistency":
      return (
        <svg {...shared}>
          <path d="M4.5 20V9.5M9.8 20V4.5M15.2 20v-7.2M20.5 20v-4" />
        </svg>
      );
    case "news":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="2.1" />
          <path d="M7.6 7.6a6.2 6.2 0 0 0 0 8.8M16.4 16.4a6.2 6.2 0 0 0 0-8.8" />
          <path d="M4.6 4.6a10.4 10.4 0 0 0 0 14.8M19.4 19.4a10.4 10.4 0 0 0 0-14.8" />
        </svg>
      );
    case "payout":
      return (
        <svg {...shared}>
          <rect x="3.2" y="6.5" width="17.6" height="11" rx="2" />
          <circle cx="12" cy="12" r="2.4" />
          <path d="M6.5 9.6v.01M17.5 14.4v.01" />
        </svg>
      );
    default:
      return null;
  }
}

/* ───────────────────────────── sections ───────────────────────────── */

function Hero() {
  return (
    <section className="gfx-hero">
      <div className="gfx-hero-grid-bg" aria-hidden="true" />
      <HeroCreatures />
      <div className="gfx-container">
        <div className="gfx-hero-grid">
          <div className="gfx-hero-copy">
            <span className="gfx-hero-badge">
              <b>New</b>
              Apex 1-step is live — 92% reward split
            </span>

            <h1 className="gfx-h1">
              Forge your edge.
              <span className="gfx-line-2 gfx-grad">Fund your ambition.</span>
            </h1>

            <p className="gfx-hero-sub">
              ForgeX Global is a simulated trading evaluation built for people who
              respect risk. Prove your process across 60+ markets, trade up to{" "}
              <strong>$200K in virtual capital</strong>, and keep as much as 92% of
              your simulated rewards.
            </p>

            <div className="gfx-hero-ctas">
              <a
                href={startHref({ program: "forge", size: "50k" })}
                className="gfx-btn gfx-btn--primary"
              >
                Start an evaluation
                <ArrowUpRight size={15} />
              </a>
              <a href="#rules" className="gfx-btn gfx-btn--ghost">
                Read the rules
              </a>
            </div>

            <div className="gfx-hero-trust">
              <Stars />
              <span>
                <b>4.8/5</b> from 1,240 verified reviews
              </span>
              <span className="gfx-trust-sep" aria-hidden="true" />
              <span>Trusted in 92 countries</span>
            </div>
          </div>

          <div className="gfx-hero-visual">
            <div className="gfx-visual-glow" aria-hidden="true" />

            <div className="gfx-terminal">
              <div className="gfx-terminal-head">
                <span className="gfx-terminal-id">
                  <span className="gfx-live-dot" aria-hidden="true" />
                  GFX-2481 · Evaluation
                </span>
                <span className="gfx-phase-pill">Phase 02</span>
              </div>

              <div className="gfx-terminal-body">
                <div className="gfx-terminal-label">Account equity · simulated</div>
                <div className="gfx-terminal-value">
                  $128,450<sup>.00</sup>
                </div>
                <div className="gfx-terminal-delta">
                  ▲ $14,220.00 (+12.4%)
                  <span>this cycle</span>
                </div>

                <div className="gfx-chart">
                  <svg viewBox="0 0 520 190" role="img" aria-label="Simulated equity curve rising over six weeks">
                    <defs>
                      <linearGradient id="gfxHeroFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff7a1f" stopOpacity="0.34" />
                        <stop offset="100%" stopColor="#ff7a1f" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="gfxHeroStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffc27d" />
                        <stop offset="100%" stopColor="#ff6a12" />
                      </linearGradient>
                    </defs>

                    {[38, 74, 110, 146, 182].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="520"
                        y2={y}
                        stroke="rgba(255,255,255,0.05)"
                        strokeDasharray="3 7"
                      />
                    ))}

                    <path
                      d="M0,150 C40,146 56,128 84,132 C112,136 128,110 156,104 C184,98 198,116 224,104 C250,92 266,72 292,78 C318,84 334,60 360,52 C386,44 402,58 428,40 C454,22 484,34 520,16 L520,190 L0,190 Z"
                      fill="url(#gfxHeroFill)"
                    />
                    <path
                      d="M0,150 C40,146 56,128 84,132 C112,136 128,110 156,104 C184,98 198,116 224,104 C250,92 266,72 292,78 C318,84 334,60 360,52 C386,44 402,58 428,40 C454,22 484,34 520,16"
                      fill="none"
                      stroke="url(#gfxHeroStroke)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      pathLength={1}
                      className="gfx-chart-line"
                    />
                    <line
                      x1="0"
                      y1="64"
                      x2="520"
                      y2="64"
                      stroke="rgba(255,122,31,0.4)"
                      strokeDasharray="4 7"
                    />
                    <circle cx="520" cy="16" r="4" fill="#ffb066" className="gfx-chart-dot" />
                    <circle cx="520" cy="16" r="9" fill="rgba(255,122,31,0.18)" />
                  </svg>
                  <div className="gfx-chart-axis" aria-hidden="true">
                    <span>W01</span>
                    <span>W02</span>
                    <span>W03</span>
                    <span>W04</span>
                    <span>W05</span>
                    <span>W06</span>
                  </div>
                </div>

                <div className="gfx-meter">
                  <div className="gfx-meter-top">
                    <span>Profit target</span>
                    <b>6.2% / 8.0%</b>
                  </div>
                  <div className="gfx-meter-track">
                    <div className="gfx-meter-fill" style={{ width: "78%" }} />
                  </div>
                </div>

                <div className="gfx-meter">
                  <div className="gfx-meter-top">
                    <span>Drawdown buffer</span>
                    <b>2.1% / 6.0%</b>
                  </div>
                  <div className="gfx-meter-track">
                    <div className="gfx-meter-fill gfx-meter-fill--cool" style={{ width: "35%" }} />
                  </div>
                </div>

                <div className="gfx-terminal-foot">
                  <span>● Live simulation</span>
                  <span>60+ markets</span>
                  <span>MT5 synced</span>
                </div>
              </div>
            </div>

            <div className="gfx-status-strip">
              <span className="gfx-status-chip">
                <span className="gfx-chip-icon" aria-hidden="true">
                  <CheckIcon size={13} />
                </span>
                <span>
                  <b>Reward approved</b>
                  <small>$8,420.00 · 90% split</small>
                </span>
              </span>
              <span className="gfx-status-chip">
                <span className="gfx-chip-icon gfx-chip-icon--ember" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 3.5 20 6v6c0 4.4-3.1 7.6-8 8.7-4.9-1.1-8-4.3-8-8.7V6l8-2.5Z" />
                  </svg>
                </span>
                <span>
                  <b>Daily loss used 0.4%</b>
                  <small>of 4.0% limit</small>
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="gfx-stats" {...reveal(60)}>
          {STATS.map((stat) => (
            <div className="gfx-stat" key={stat.label}>
              <div className="gfx-stat-value">
                {stat.value}
                <em>{stat.accent}</em>
              </div>
              <div className="gfx-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="gfx-footnote" style={{ marginTop: 12 }}>
          *Review times vary by program and payment method. Figures shown are
          illustrative; simulated rewards are discretionary and not guaranteed.
        </p>
      </div>
    </section>
  );
}

function MarketTape() {
  const items = [...MARKET_TAPE, ...MARKET_TAPE];

  return (
    <div className="gfx-ticker" aria-label="Indicative market prices">
      <div className="gfx-marquee-track">
        {items.map((item, index) => (
          <span className="gfx-tick" key={`${item.symbol}-${index}`} aria-hidden={index >= MARKET_TAPE.length}>
            <span className="gfx-tick-name">{item.symbol}</span>
            <span className="gfx-tick-price">{item.price}</span>
            <span className={`gfx-tick-change ${item.up ? "is-up" : "is-down"}`}>
              {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Pillars() {
  return (
    <section className="gfx-section">
      <div className="gfx-container">
        <div className="gfx-section-head" {...reveal()}>
          <div className="gfx-head-copy">
            <span className="gfx-eyebrow">Why ForgeX Global</span>
            <h2 className="gfx-h2">
              Built like a forge.
              <br />
              Not a funnel.
            </h2>
          </div>
          <p className="gfx-lede" style={{ maxWidth: 400 }}>
            Most evaluation firms sell access. We publish a standard. Every
            threshold is fixed before you pay, and every rule is enforced the same
            way for every account.
          </p>
        </div>

        <div className="gfx-pillars">
          {PILLARS.map((pillar, index) => (
            <article className="gfx-pillar" key={pillar.title} {...reveal(index * 90)}>
              <span className="gfx-pillar-num">{pillar.num}</span>
              <span className="gfx-icon-box" aria-hidden="true">
                <PillarIcon name={pillar.icon} />
              </span>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section className="gfx-section gfx-programs-section" id="programs">
      <div className="gfx-container">
        <div className="gfx-section-head" {...reveal()}>
          <div className="gfx-head-copy">
            <span className="gfx-eyebrow">Evaluation programs</span>
            <h2 className="gfx-h2">Choose the path you can defend.</h2>
          </div>
          <p className="gfx-lede" style={{ maxWidth: 380 }}>
            Three structures, one standard. Select a program and account size to
            see the exact objectives before you commit.
          </p>
        </div>

        <div {...reveal(60)}>
          <Programs />
        </div>
      </div>
    </section>
  );
}

function RulesSection() {
  return (
    <section className="gfx-band" id="rules">
      <div className="gfx-container">
        <div className="gfx-rules">
          <div className="gfx-rules-copy" {...reveal()}>
            <span className="gfx-eyebrow">Risk framework</span>
            <h2 className="gfx-h2">The rules protect the trader. Not just the firm.</h2>
            <p className="gfx-lede">
              Loss limits are static, resets are fixed to 00:00 UTC, and every
              buffer is visible in your dashboard in real time. No trailing
              maximums, no surprise clauses at payout.
            </p>
            <div className="gfx-rules-note">
              <span className="gfx-live-dot" aria-hidden="true" />
              Live limits · updated with every tick
            </div>
            <a href="#faq" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
              Read the full rulebook
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="gfx-rules-grid">
            {RULES.map((rule, index) => (
              <article className="gfx-rule" key={rule.title} {...reveal(index * 55)}>
                <div className="gfx-rule-top">
                  <span className="gfx-rule-icon" aria-hidden="true">
                    <RuleIcon name={rule.icon} />
                  </span>
                  <span className="gfx-rule-num">{rule.num}</span>
                </div>
                <h3>{rule.title}</h3>
                <div className="gfx-rule-value">{rule.value}</div>
                <p>{rule.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="gfx-section" id="process">
      <div className="gfx-container">
        <div className="gfx-section-head" {...reveal()}>
          <div className="gfx-head-copy">
            <span className="gfx-eyebrow">How it works</span>
            <h2 className="gfx-h2">Four moves from sign-up to first reward.</h2>
          </div>
          <p className="gfx-lede" style={{ maxWidth: 360 }}>
            No interviews, no waiting lists. Choose a program, trade the plan and
            get assessed against the same published standard as everyone else.
          </p>
        </div>

        <div className="gfx-steps">
          {STEPS.map((step, index) => (
            <div className="gfx-step" key={step.num} {...reveal(index * 80)}>
              <span className="gfx-step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformSection() {
  return (
    <section className="gfx-section gfx-section--tight" id="platform">
      <div className="gfx-container">
        <div className="gfx-dash-layout">
          <div className="gfx-dash-copy" {...reveal()}>
            <span className="gfx-eyebrow">Command center</span>
            <h2 className="gfx-h2">Every number that matters, in one place.</h2>
            <p className="gfx-lede">
              Your entire evaluation lives in a single dashboard: equity,
              drawdown buffers, phase progress and reward history. No spreadsheets,
              no guesswork, no support ticket to find out where you stand.
            </p>

            <ul className="gfx-checklist">
              <li>
                <span className="gfx-check" aria-hidden="true">
                  <CheckIcon />
                </span>
                Real-time equity, drawdown and profit-target tracking
              </li>
              <li>
                <span className="gfx-check" aria-hidden="true">
                  <CheckIcon />
                </span>
                Daily reset timer with early-warning breach alerts
              </li>
              <li>
                <span className="gfx-check" aria-hidden="true">
                  <CheckIcon />
                </span>
                One-click simulated reward requests and payout history
              </li>
              <li>
                <span className="gfx-check" aria-hidden="true">
                  <CheckIcon />
                </span>
                MT5 sync across desktop, web and mobile
              </li>
            </ul>

            <a href="#rules" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
              Explore the rulebook
              <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="gfx-app" {...reveal(80)}>
            <div className="gfx-app-head">
              <span className="gfx-app-title">
                <span className="gfx-live-dot" aria-hidden="true" />
                Command Center
              </span>
              <span className="gfx-app-live">Live</span>
            </div>

            <div className="gfx-app-body">
              <div className="gfx-app-equity">
                <div>
                  <div className="gfx-app-balance">$128,450.00</div>
                  <div className="gfx-app-change">▲ $14,220.00 · +12.4% this cycle</div>
                </div>
                <div className="gfx-app-tabs" aria-hidden="true">
                  <span className="gfx-app-tab">1D</span>
                  <span className="gfx-app-tab">1W</span>
                  <span className="gfx-app-tab is-active">1M</span>
                  <span className="gfx-app-tab">ALL</span>
                </div>
              </div>

              <div className="gfx-app-chart">
                <svg viewBox="0 0 460 120" role="img" aria-label="Simulated account growth chart">
                  <defs>
                    <linearGradient id="gfxAppFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7a1f" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#ff7a1f" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[26, 56, 86].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="460"
                      y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="3 7"
                    />
                  ))}
                  <path
                    d="M0,96 C28,92 42,80 64,84 C86,88 100,66 124,68 C148,70 164,56 188,58 C212,60 228,42 252,44 C276,46 292,32 316,30 C340,28 356,36 380,22 C404,8 430,18 460,12 L460,120 L0,120 Z"
                    fill="url(#gfxAppFill)"
                  />
                  <path
                    d="M0,96 C28,92 42,80 64,84 C86,88 100,66 124,68 C148,70 164,56 188,58 C212,60 228,42 252,44 C276,46 292,32 316,30 C340,28 356,36 380,22 C404,8 430,18 460,12"
                    fill="none"
                    stroke="#ff9a4d"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="gfx-app-tiles">
                <div className="gfx-app-tile">
                  <div className="gfx-app-tile-label">Win rate</div>
                  <div className="gfx-app-tile-value">68%</div>
                </div>
                <div className="gfx-app-tile">
                  <div className="gfx-app-tile-label">Avg. R multiple</div>
                  <div className="gfx-app-tile-value">1.9R</div>
                </div>
                <div className="gfx-app-tile">
                  <div className="gfx-app-tile-label">Rewards received</div>
                  <div className="gfx-app-tile-value is-up">$24,810</div>
                </div>
              </div>

              <div className="gfx-app-payouts">
                <div className="gfx-app-payouts-head">
                  <span>Recent simulated rewards</span>
                  <span>VIEW ALL</span>
                </div>

                <div className="gfx-payout-row">
                  <span className="gfx-avatar" style={{ background: "linear-gradient(135deg,#8a5a2b,#d99a55)" }}>
                    AK
                  </span>
                  <span className="gfx-payout-name">
                    Amara K.
                    <small>Forge · $100K</small>
                  </span>
                  <span className="gfx-payout-amt">+$3,120.00</span>
                </div>

                <div className="gfx-payout-row">
                  <span className="gfx-avatar" style={{ background: "linear-gradient(135deg,#2e5478,#5f9fc9)" }}>
                    TR
                  </span>
                  <span className="gfx-payout-name">
                    Tomás R.
                    <small>Apex · $50K</small>
                  </span>
                  <span className="gfx-payout-amt">+$2,480.00</span>
                </div>

                <div className="gfx-payout-row">
                  <span className="gfx-avatar" style={{ background: "linear-gradient(135deg,#6b3b6e,#b06aa8)" }}>
                    PN
                  </span>
                  <span className="gfx-payout-name">
                    Priya N.
                    <small>Spark · $25K</small>
                  </span>
                  <span className="gfx-payout-amt">+$1,890.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RewardsSection() {
  return (
    <section className="gfx-section" id="rewards">
      <div className="gfx-container">
        <div className="gfx-section-head" {...reveal()}>
          <div className="gfx-head-copy">
            <span className="gfx-eyebrow">Rewards</span>
            <h2 className="gfx-h2">Rewards that land like they should.</h2>
          </div>
          <p className="gfx-lede" style={{ maxWidth: 380 }}>
            A look at recent simulated rewards from the ForgeX Global community.
            Requests are reviewed in the dashboard, with a clear status at every
            step.
          </p>
        </div>

        <div className="gfx-payout-grid">
          {PAYOUTS.map((payout, index) => (
            <article className="gfx-payout-card" key={payout.name} {...reveal(index * 80)}>
              <div className="gfx-payout-top">
                <div className="gfx-payout-person">
                  <span className="gfx-avatar" style={{ background: payout.color }}>
                    {payout.initials}
                  </span>
                  <span>
                    <b>{payout.name}</b>
                    <small>{payout.meta}</small>
                  </span>
                </div>
                <span className="gfx-paid">
                  <CheckIcon size={8} />
                  Paid
                </span>
              </div>

              <div className="gfx-payout-amount">{payout.amount}</div>
              <div className="gfx-payout-meta">
                Simulated reward
                <span aria-hidden="true" />
                Approved in {payout.time}
              </div>
            </article>
          ))}
        </div>

        <div className="gfx-payout-facts" {...reveal(60)}>
          <div className="gfx-payout-fact">
            <b>80% – 92%</b>
            <span>Reward split across programs</span>
          </div>
          <div className="gfx-payout-fact">
            <b>24h*</b>
            <span>Average reward review time</span>
          </div>
          <div className="gfx-payout-fact">
            <b>No cap</b>
            <span>On eligible simulated rewards</span>
          </div>
        </div>

        <p className="gfx-footnote">
          *Illustrative payout data. Simulated rewards are discretionary, depend on
          program rules and are not guaranteed. Review times vary by payment method.
        </p>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="gfx-section gfx-section--tight" id="reviews">
      <div className="gfx-container">
        <div className="gfx-section-head" {...reveal()}>
          <div className="gfx-head-copy">
            <span className="gfx-eyebrow">Trader voices</span>
            <h2 className="gfx-h2">Discipline compounds. So do the reviews.</h2>
          </div>
          <div className="gfx-hero-trust" style={{ paddingTop: 0 }}>
            <Stars />
            <span>
              <b>4.8/5</b> · 1,240 verified reviews
            </span>
          </div>
        </div>

        <div className="gfx-quotes">
          {QUOTES.map((quote, index) => (
            <article className="gfx-quote" key={quote.name} {...reveal(index * 90)}>
              <div className="gfx-quote-stars">
                <Stars />
                <span>5.0</span>
              </div>
              <p>“{quote.quote}”</p>
              <div className="gfx-quote-author">
                <span className="gfx-avatar" style={{ background: quote.color }}>
                  {quote.initials}
                </span>
                <span>
                  <b>{quote.name}</b>
                  <small>{quote.meta}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="gfx-section" id="faq">
      <div className="gfx-container">
        <div className="gfx-faq-layout">
          <div className="gfx-faq-side" {...reveal()}>
            <span className="gfx-eyebrow">Questions, answered</span>
            <h2 className="gfx-h2">Know the terms before you take the trade.</h2>
            <p className="gfx-lede">
              Clear answers on capital, rules and rewards. If something is still
              unclear, a human will walk you through it before you pay a fee.
            </p>

            <div className="gfx-support-card">
              <b>Still deciding?</b>
              <p>
                Talk to the desk about account sizes, rules or payout mechanics.
                We answer seven days a week.
              </p>
              <div className="gfx-support-links">
                <a href={supportHref} className="gfx-btn gfx-btn--primary gfx-btn--sm">
                  Email support
                </a>
                <Link href="/help" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
                  Browse the Help Center
                </Link>
              </div>
            </div>
          </div>

          <div className="gfx-faq-list" {...reveal(60)}>
            {FAQS.map((faq, index) => (
              <details className="gfx-faq-item" key={faq.q} open={index === 0}>
                <summary>
                  <span>{faq.q}</span>
                  <span className="gfx-faq-plus" aria-hidden="true" />
                </summary>
                <div className="gfx-faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="gfx-cta-wrap" id="cta">
      <div className="gfx-container">
        <div className="gfx-cta" {...reveal()}>
          <div className="gfx-cta-inner">
            <span className="gfx-eyebrow">The forge is open</span>
            <h2>Strike while the iron’s hot.</h2>
            <p>
              Your next account is one decision away. Pick a program, prove your
              edge and get rewarded for discipline — not luck.
            </p>
            <div className="gfx-cta-actions">
              <a
                href={startHref({ program: "forge", size: "50k" })}
                className="gfx-btn gfx-btn--primary"
              >
                Start an evaluation
                <ArrowUpRight size={15} />
              </a>
              <Link href="/support" className="gfx-btn gfx-btn--ghost">
                Talk to support
              </Link>
            </div>
            <div className="gfx-cta-meta">
              <span>Instant access</span>
              <span>Secure checkout</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function TrustStrip() {
  const items = [
    {
      label: "Traded on",
      value: "MetaTrader 5",
      note: "Desktop, web and mobile terminals",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M7 20h10M12 16v4" />
        </svg>
      ),
    },
    {
      label: "Pay with",
      value: "Card · Crypto · Bank",
      note: "Visa, Mastercard, USDT, BTC, SEPA",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
          <path d="M2.5 10h19" />
        </svg>
      ),
    },
    {
      label: "Support",
      value: "Seven days a week",
      note: "Answered within one business day",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.4-.6L3 21l1.8-5.1A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 2.6h.9A8.4 8.4 0 0 1 21 11.5Z" />
        </svg>
      ),
    },
    {
      label: "Accounts",
      value: "100% simulated",
      note: "No client funds are traded",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4.5 6.4v5.2c0 4.5 3.1 8.1 7.5 9.4 4.4-1.3 7.5-4.9 7.5-9.4V6.4L12 3Z" />
          <path d="m9 12 2.2 2.2L15.5 10" />
        </svg>
      ),
    },
  ];

  return (
    <section className="gfx-trust-strip" aria-label="Platform, payment and support details">
      <div className="gfx-container">
        <div className="gfx-trust-grid">
          {items.map((item) => (
            <div className="gfx-trust-item" key={item.label}>
              <span className="gfx-trust-ico" aria-hidden="true">{item.icon}</span>
              <span className="gfx-trust-copy">
                <span className="gfx-trust-label">{item.label}</span>
                <b>{item.value}</b>
                <span className="gfx-trust-note">{item.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportBubble() {
  return (
    <Link href="/support" className="gfx-support-bubble" aria-label="Open ForgeX Global support">
      <span className="gfx-support-ico" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3.4-.6L3 21l1.8-5.1A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 2.6h.9A8.4 8.4 0 0 1 21 11.5Z" />
        </svg>
      </span>
      <span className="gfx-support-label">Support</span>
    </Link>
  );
}

/* ───────────────────────────── page ───────────────────────────── */

export default function HomePage() {
  return (
    <div className="gfx" id="top">
      <noscript>
        <style>{`.gfx [data-reveal]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <div className="gfx-announce">
        <div className="gfx-announce-inner">
          <span className="gfx-announce-tag">Forge week</span>
          <span>
            Save <strong>30%</strong> on every evaluation through 9 November.
          </span>
          <a href="#programs" className="gfx-announce-link">
            Claim the offer
            <ArrowUpRight size={11} />
          </a>
        </div>
      </div>

      <Nav />
      <Hero />
      <MarketTape />
      <TrustStrip />
      <Pillars />
      <ProgramsSection />
      <RulesSection />
      <ProcessSection />
      <PlatformSection />
      <RewardsSection />
      <ReviewsSection />
      <FaqSection />
      <FinalCta />
      <Footer />
      <SupportBubble />
      <Reveal />
    </div>
  );
}
