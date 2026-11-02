"use client";

import Link from "next/link";
import { useState } from "react";
import { loginHref, startHref, supportHref } from "@/config/site";

/* ─────────────────────────── DATA ─────────────────────────── */

const TICKER_ITEMS = [
  "EUR/USD", "USD/CAD", "S&P 500", "US 100", "Dow 30",
  "Nikkei 225", "DAX Index", "UK 100", "Gold", "Crude Oil",
  "Natural Gas", "Copper", "EUR/GBP", "GBP/USD", "AUD/USD",
];

const REWARD_CARDS = [
  { amount: "$11,652.63", name: "Fatima Al Zahra",  deg:  0,  z: 30 },
  { amount: "$3,626.87",  name: "Bethany Walters",  deg: -9,  z: 20 },
  { amount: "$2,608.49",  name: "Neslein Harvey",   deg:  8,  z: 20 },
  { amount: "$667.30",    name: "Cameron Woods",    deg: -14, z: 10 },
  { amount: "$914.72",    name: "Avery Scott",      deg:  14, z: 10 },
];

const STATS = [
  { icon: "👥", value: "39,946+",   label: "Global Members" },
  { icon: "💰", value: "$335,295+", label: "Total simulated rewards paid" },
  { icon: "🌐", value: "60+",       label: "global market pairs on" },
  { icon: "🎧", value: "24/7",      label: "Customer Support" },
];

const PLAN_TYPES = [
  { id: "safe",    label: "Safe Mode",      sub: "No Daily Loss Limit" },
  { id: "pro",     label: "Pro Mode",       sub: "Extra room, extra edge" },
  { id: "instant", label: "Instant Direct", sub: "Lite & Pro access" },
  { id: "flex",    label: "Flex",           sub: "Start for $9",       badge: "NEW", highlight: true },
];

const ACCOUNT_SIZES = [
  { label: "$5K",   val: 5000 },
  { label: "$10K",  val: 10000 },
  { label: "$25K",  val: 25000 },
  { label: "$50K",  val: 50000 },
  { label: "$100K", val: 100000 },
  { label: "$200K", val: 200000 },
];

const OBJECTIVES: Record<string, Array<[string, string]>> = {
  flex: [
    ["Reward Target",       "4%"],
    ["Daily Drawdown",      "4%"],
    ["Max Drawdown (Static)","8%"],
    ["Min Winning Days",    "None"],
    ["Max Trading Days",    "None"],
    ["Consistency Rule",    "No"],
    ["News Trading",        "Allowed"],
    ["Reward Share",        "85%"],
  ],
  safe: [
    ["Reward Target",       "10%"],
    ["Daily Drawdown",      "None"],
    ["Max Drawdown (Static)","10%"],
    ["Min Winning Days",    "None"],
    ["Max Trading Days",    "None"],
    ["Consistency Rule",    "No"],
    ["News Trading",        "Allowed"],
    ["Reward Share",        "80%"],
  ],
  pro: [
    ["Reward Target",       "8%"],
    ["Daily Drawdown",      "5%"],
    ["Max Drawdown (Static)","10%"],
    ["Min Winning Days",    "None"],
    ["Max Trading Days",    "None"],
    ["Consistency Rule",    "No"],
    ["News Trading",        "Allowed"],
    ["Reward Share",        "85%"],
  ],
  instant: [
    ["Reward Target",       "N/A"],
    ["Daily Drawdown",      "5%"],
    ["Max Drawdown (Static)","10%"],
    ["Min Winning Days",    "None"],
    ["Max Trading Days",    "None"],
    ["Consistency Rule",    "No"],
    ["News Trading",        "Allowed"],
    ["Reward Share",        "80%"],
  ],
};

const PLAN_PRICES: Record<string, Record<string, string>> = {
  flex:    { "$5K":"$9","$10K":"$16","$25K":"$28","$50K":"$47","$100K":"$79","$200K":"$139" },
  safe:    { "$5K":"$49","$10K":"$89","$25K":"$149","$50K":"$249","$100K":"$399","$200K":"$699" },
  pro:     { "$5K":"$59","$10K":"$99","$25K":"$179","$50K":"$299","$100K":"$499","$200K":"$849" },
  instant: { "$5K":"$79","$10K":"$139","$25K":"$219","$50K":"$349","$100K":"$599","$200K":"$999" },
};

const FEATURES = [
  { num: "01", title: "Fastest Account Delivery",  desc: "Purchase and get your challenge within 30 seconds." },
  { num: "02", title: "Lowest Spreads",             desc: "Industry-leading tight spreads across all instruments." },
  { num: "03", title: "Convenient Trading Tools",   desc: "MT5 platform with full suite of professional tools." },
  { num: "04", title: "Simulated Environment",      desc: "Risk-free practice in a realistic market simulation." },
  { num: "05", title: "Secure Platform",            desc: "Bank-level security protecting your data and account." },
];

const BENEFITS = [
  "Fastest Account Delivery",
  "Easy Payment Methods",
  "Convenient Trading Tools",
  "Secure Platform",
  "Affiliate Rebates",
  "24/7 Customer Support",
  "Massive Rewards",
];

const CONVENIENCE = [
  { title: "Global Markets Evaluation",  desc: "60+ global market pairs on industry-standard platforms." },
  { title: "Multi-Currency Support",     desc: "Instant access to over 100 global instruments." },
  { title: "Energies Market Activity",   desc: "Access energy market instruments." },
  { title: "Lowest Spreads",             desc: "Tight spreads across 100+ global instruments." },
  { title: "Easiest Payment Methods",    desc: "Purchase through Visa/Master Cards." },
];

const MARKET_ROWS = [
  { symbol: "500",  ticker: "SPXUSD", name: "S&P 500",    price: "7,583.5",   pct: "-1.21%", pts: "-92.6",     bg: "#ef4444" },
  { symbol: "100",  ticker: "NSXUSD", name: "US 100",     price: "28,407.9",  pct: "-2.27%", pts: "-659.3",    bg: "#38bdf8" },
  { symbol: "30",   ticker: "DJI",    name: "Dow 30",     price: "51,791.9",  pct: "-1.05%", pts: "-548.0",    bg: "#22d3ee" },
  { symbol: "225",  ticker: "NKY",    name: "Nikkei 225", price: "63,290.11", pct: "-2.12%", pts: "-1,369.36", bg: "#818cf8" },
  { symbol: "DEU",  ticker: "DEU30",  name: "DAX Index",  price: "25,818.21", pct: "-0.85%", pts: "-221.47",   bg: "#60a5fa" },
];

const REVIEWS = [
  {
    featured: true,
    quote: "Capital backing let me scale my strategy without risking personal savings beyond the fee.",
    name: "Sofia L.", date: "Apr 3, 2026", stars: 5,
  },
  { featured: false, quote: "Clean onboarding, no surprises on fees.",                             name: "Chris B.",  date: "Mar 28, 2026", stars: 5 },
  { featured: false, quote: "Daily pause rule took a day to get used to but it keeps you disciplined.", name: "Tom W.",    date: "Apr 2, 2026",  stars: 5 },
  { featured: false, quote: "Smooth onboarding and clear rules. Payout was processed on time. Happy to trade with Global4EX.", name: "Alex M.",  date: "Mar 25, 2026", stars: 5 },
  { featured: false, quote: "Support answered quickly when I had a platform question. The dashboard is easy to follow.", name: "Priya S.", date: "Mar 18, 2026", stars: 5 },
  { featured: false, quote: "Good execution on MT5 and helpful emails when I needed verification docs.", name: "Elena V.", date: "Mar 22, 2026", stars: 5 },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What is Flex, and how does the $9 work?",
    a: "Flex is a one-phase evaluation you start for $9 on any account size from $5,000 to $200,000. Hit the 4% reward target and you pass. You then pay an activation fee to have your funded account issued. If you don't pass, you pay nothing beyond the $9.",
  },
  { q: "How much is the Flex activation fee?",          a: "The activation fee varies by account size and is shown at checkout after you pass your Flex evaluation." },
  { q: "What are the Flex drawdown rules?",             a: "Flex uses a static 8% maximum drawdown from your starting balance. There is no daily loss limit on the Flex plan." },
  { q: "Is there a deadline to activate after I pass Flex?", a: "Yes, you have 14 days after passing to pay the activation fee and receive your funded account." },
  { q: "What is the Flex reward split?",                a: "Flex offers an 85% reward split — you keep 85% of all simulated profits." },
  { q: "Do coupons or BOGO apply to Flex?",             a: "Yes, promotional offers including BOGO and discount coupons can be applied to Flex plans at checkout." },
  { q: "Which platforms do you support?",               a: "We support MT5 (MetaTrader 5) for all evaluation accounts." },
  { q: "Is there a time limit to pass a challenge?",    a: "No time limit — trade at your own pace until you hit the reward target or violate a rule." },
];

/* ─────────────────────────── ICONS / SMALL UI ─────────────── */

function ArrowUpRight({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #1d4ed8 100%)",
          boxShadow: "0 0 16px rgba(99,102,241,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="white" opacity="0.9" />
          <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" opacity="0.4" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="1.2" opacity="0.35" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="white" strokeWidth="1.2" opacity="0.35" />
        </svg>
      </div>
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: "#fff" }}>
        GLOBAL<span style={{ color: "#3b82f6" }}>4</span>EX
      </span>
    </div>
  );
}

function PillButton({ children, href = "#", variant = "primary", small = false }: {
  children: React.ReactNode; href?: string; variant?: "primary" | "outline" | "ghost"; small?: boolean;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    borderRadius: 999, fontWeight: 600, cursor: "pointer", textDecoration: "none",
    transition: "opacity 0.2s, transform 0.2s", border: "none",
    fontSize: small ? 13 : 14, padding: small ? "8px 18px" : "11px 22px",
  };
  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" },
    outline:  { ...base, background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" },
    ghost:    { ...base, background: "transparent", color: "rgba(255,255,255,0.85)", padding: small ? "8px 14px" : "11px 18px" },
  };
  return (
    <a href={href} style={styles[variant]}>
      {children}
      {variant === "primary" && (
        <span style={{
          width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <ArrowUpRight size={14} />
        </span>
      )}
    </a>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span className="label-dot" />
      <span style={{ fontSize: 14, fontWeight: 500, color: "#60a5fa" }}>{children}</span>
    </div>
  );
}

/* ─────────────────────────── COMPONENTS ───────────────────── */

function TopBanner() {
  return (
    <div style={{
      background: "#1d6ff3",
      padding: "9px 20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 14, flexWrap: "wrap", fontSize: 13, color: "#fff",
    }}>
      <span style={{ background: "#fff", color: "#111", borderRadius: 999, padding: "2px 10px", fontWeight: 800, fontSize: 11, letterSpacing: "0.06em" }}>BOGO</span>
      <span style={{ fontWeight: 500 }}>Buy 1, Get 2 Accounts</span>
      <span style={{ background: "#ef4444", borderRadius: 999, padding: "3px 12px", fontWeight: 800, fontSize: 11, letterSpacing: "0.06em" }}>UP TO 75% OFF</span>
      <span style={{ color: "rgba(255,255,255,0.85)" }}>|</span>
      <a href="#plans" style={{ color: "#fff", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
        See plans <ArrowUpRight size={13} />
      </a>
    </div>
  );
}

function Navbar() {
  const links = ["About", "Plans", "Rules", "Contact us"];
  return (
    <div style={{ position: "sticky", top: 12, zIndex: 100, padding: "0 16px" }}>
      <nav className="navbar-blur" style={{ maxWidth: 1240, margin: "0 auto", borderRadius: 999, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.05)", borderRadius: 999, padding: "4px" }}>
          {links.map((l, i) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "")}`}
              style={{
                padding: "7px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500,
                color: i === 1 ? "#fff" : "rgba(255,255,255,0.7)",
                background: i === 1 ? "#1d6ff3" : "transparent",
                textDecoration: "none", transition: "all 0.2s",
                boxShadow: i === 1 ? "0 0 20px rgba(29,111,243,0.45)" : "none",
              }}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href={loginHref} style={{ fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Sign In</a>
          <a href={startHref({ program: "forge", size: "50k" })} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 18px 9px 22px",
            borderRadius: 999, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
          }}>
            Sign Up
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={13} />
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}

function TrustBadge() {
  return (
    <div style={{
      background: "#fff", color: "#111", borderRadius: 16, padding: "12px 18px",
      display: "inline-flex", alignItems: "flex-start", gap: 10, boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
    }}>
      <div style={{ color: "#10b981", fontSize: 20, lineHeight: 1 }}>✓</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
          <span style={{ fontWeight: 700, fontSize: 15 }}>4.7</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Top Rated Service</div>
        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>verified by Trustindex ⓘ</div>
      </div>
    </div>
  );
}

function RewardCard({ amount, name, deg, z }: { amount: string; name: string; deg: number; z: number }) {
  return (
    <div
      className="reward-card"
      style={{ transform: `rotate(${deg}deg)`, zIndex: z, position: "relative" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Logo />
        <span style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>Reward</span>
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Reward Certificate</div>
      <div style={{
        background: "linear-gradient(135deg,#1d6ff3,#1e40af)",
        borderRadius: 14, padding: "12px 16px",
        fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em",
        boxShadow: "0 8px 24px rgba(29,111,243,0.35)",
      }}>{amount}</div>
      <div style={{ marginTop: 12, fontSize: 15, fontWeight: 600, color: "#fff" }}>{name}</div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{ position: "relative", padding: "32px 16px 0" }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", borderRadius: 32,
        background: "linear-gradient(160deg, #040d1e 0%, #061228 50%, #0a1e3d 100%)",
        border: "1px solid rgba(59,130,246,0.18)",
        overflow: "hidden", position: "relative",
        padding: "60px 24px 0",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
      }}>
        <div className="world-dots" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />

        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "70%", height: "60%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(29,111,243,0.35) 0%, transparent 70%)",
        }} />

        <div style={{ position: "absolute", left: -10, top: 80, zIndex: 2 }}>
          <div className="crystal crystal-left" />
        </div>
        <div style={{ position: "absolute", right: -10, top: 140, zIndex: 2 }}>
          <div className="crystal crystal-right" />
        </div>

        <div style={{ position: "relative", zIndex: 5, textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <TrustBadge />
          </div>
          <h1 style={{
            fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 800, lineHeight: 1.02,
            letterSpacing: "-0.05em", margin: 0,
            color: "rgba(255,255,255,0.92)",
          }}>
            Prove Your Skills.
          </h1>
          <h1 style={{
            fontSize: "clamp(44px, 7vw, 84px)", fontWeight: 800, lineHeight: 1.02,
            letterSpacing: "-0.05em", margin: "4px 0 0",
            color: "rgba(255,255,255,0.5)",
          }}>
            Trade with No daily loss limit.
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "24px auto 0", lineHeight: 1.7 }}>
            Improve your trading skills on our simulated platform and secure rewards. <strong style={{ color: "rgba(255,255,255,0.85)" }}>No daily loss limit</strong> ◎. Up to $200K virtual capital.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
            <a href="#plans" style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              borderRadius: 999, padding: "13px 22px",
              textDecoration: "none", boxShadow: "0 10px 30px rgba(37,99,235,0.4)",
            }}>
              Start Evaluation
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={15} />
              </span>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {["AB","FZ","TW","NH"].map((init, i) => (
                  <div key={init} style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: ["#7c3aed","#1d4ed8","#065f46","#9a3412"][i],
                    border: "2px solid #040a14",
                    marginLeft: i === 0 ? 0 : -10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#fff", zIndex: 4 - i, position: "relative",
                  }}>{init}</div>
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>+39.9K Active Users</span>
            </div>
          </div>
        </div>

        <div style={{
          position: "relative", zIndex: 5,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          gap: 0, marginTop: 56, paddingBottom: 0,
          minHeight: 280, overflowX: "hidden",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ transform: "rotate(-14deg) translateY(30px)", zIndex: 10, position: "relative", opacity: 0.75, scale: "0.88" }}>
              <RewardCard {...REWARD_CARDS[3]} deg={0} />
            </div>
            <div style={{ transform: "rotate(-8deg) translateY(15px) translateX(10px)", zIndex: 20, position: "relative", opacity: 0.88, scale: "0.93" }}>
              <RewardCard {...REWARD_CARDS[1]} deg={0} />
            </div>
          </div>
          <div style={{ zIndex: 30, position: "relative", transform: "translateY(0px)" }}>
            <RewardCard {...REWARD_CARDS[0]} deg={0} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div style={{ transform: "rotate(8deg) translateY(15px) translateX(-10px)", zIndex: 20, position: "relative", opacity: 0.88, scale: "0.93" }}>
              <RewardCard {...REWARD_CARDS[2]} deg={0} />
            </div>
            <div style={{ transform: "rotate(14deg) translateY(30px)", zIndex: 10, position: "relative", opacity: 0.75, scale: "0.88" }}>
              <RewardCard {...REWARD_CARDS[4]} deg={0} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TickerSection() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section style={{ padding: "40px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 18 }}>
        Stay updated with the latest trends in Forex and Stock markets.
      </p>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span
              key={`${item}-${i}`}
              style={{
                fontSize: "clamp(18px, 3.5vw, 28px)", fontWeight: 600,
                color: "rgba(255,255,255,0.18)", letterSpacing: "-0.02em",
                padding: "0 40px", whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" style={{ maxWidth: 1240, margin: "0 auto", padding: "96px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
        <div>
          <SectionLabel>What do we offer?</SectionLabel>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", margin: 0 }}>
            At Global4EX, traders develop skills on <span style={{ color: "#3b82f6" }}>demo accounts in a simulated trading environment</span>, <span style={{ color: "rgba(255,255,255,0.3)" }}>for education and evaluation only, not live market execution.</span>
          </h2>
        </div>
        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
            Performance simulated rewards may apply when program rules are met; simulated rewards are discretionary and not guaranteed.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
            We also offer a referral program (15%, terms apply) so you can share Global4EX with others who want structured simulated evaluations on MT5. Program fees are service fees only; they are not deposits or investments.
          </p>
          <a href="#plans" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff", fontWeight: 700, fontSize: 14,
            borderRadius: 999, padding: "13px 22px",
            textDecoration: "none", boxShadow: "0 10px 30px rgba(37,99,235,0.35)",
          }}>
            Start Evaluation
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>

      <div style={{
        marginTop: 64, borderRadius: 24,
        background: "linear-gradient(180deg, rgba(15,30,60,0.9) 0%, rgba(8,18,36,0.95) 100%)",
        border: "1px solid rgba(59,130,246,0.15)",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{
            padding: "40px 24px", textAlign: "center",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
          }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlansSection() {
  const [activePlan, setActivePlan] = useState("flex");
  const [activeSize, setActiveSize] = useState("$5K");
  const [showPct, setShowPct] = useState(true);

  const objectives = OBJECTIVES[activePlan] ?? OBJECTIVES["flex"];
  const price = PLAN_PRICES[activePlan]?.[activeSize] ?? "$9";

  return (
    <section id="plans" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <SectionLabel>Plans</SectionLabel>
      <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.05em", margin: "0 0 40px", lineHeight: 1 }}>
        Built For Your Success
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {PLAN_TYPES.map((pt) => (
          <button
            key={pt.id}
            onClick={() => setActivePlan(pt.id)}
            style={{
              border: activePlan === pt.id
                ? (pt.highlight ? "none" : "1px solid rgba(255,255,255,0.25)")
                : "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: "22px 20px", cursor: "pointer",
              background: activePlan === pt.id && pt.highlight
                ? "linear-gradient(160deg,#3b82f6 0%,#1d4ed8 100%)"
                : activePlan === pt.id
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.02)",
              textAlign: "left", position: "relative",
              boxShadow: activePlan === pt.id && pt.highlight ? "0 16px 40px rgba(37,99,235,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {pt.badge && (
              <span style={{
                position: "absolute", top: 14, right: 14,
                background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
                borderRadius: 999, padding: "2px 8px", letterSpacing: "0.05em",
              }}>{pt.badge}</span>
            )}
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              border: activePlan === pt.id ? "2px solid rgba(255,255,255,0.7)" : "2px solid rgba(255,255,255,0.2)",
              marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {activePlan === pt.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff" }} />}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{pt.label}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{pt.sub}</div>
          </button>
        ))}
      </div>

      <div style={{
        background: "linear-gradient(180deg, rgba(8,18,36,0.98) 0%, rgba(4,10,20,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.15)", borderRadius: 28,
        padding: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {ACCOUNT_SIZES.map((s) => (
            <button
              key={s.label}
              onClick={() => setActiveSize(s.label)}
              style={{
                border: activeSize === s.label ? "none" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "10px 20px", cursor: "pointer",
                background: activeSize === s.label
                  ? "linear-gradient(135deg,#2563eb,#1d4ed8)"
                  : "rgba(255,255,255,0.04)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                boxShadow: activeSize === s.label ? "0 6px 18px rgba(37,99,235,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >{s.label}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, overflow: "hidden",
          }}>
            <div style={{
              padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Trading Objectives</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 999,
                  padding: "4px 14px", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600,
                }}>
                  {PLAN_TYPES.find(p => p.id === activePlan)?.label}
                </span>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  <div
                    onClick={() => setShowPct(!showPct)}
                    style={{
                      width: 42, height: 24, borderRadius: 999, position: "relative", cursor: "pointer",
                      background: showPct ? "#2563eb" : "rgba(255,255,255,0.15)", transition: "background 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 3, left: showPct ? "calc(100% - 21px)" : 3,
                      width: 18, height: 18, borderRadius: "50%", background: "#fff",
                      transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                  Show Percentage
                </label>
              </div>
            </div>
            {objectives.map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 15, color: "rgba(255,255,255,0.65)" }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 20, overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(180deg,#4f9bff 0%,#1d6ff3 40%,#1a5fd0 100%)",
              padding: "22px 24px 36px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{
                    background: "#fff", color: "#111", borderRadius: 999,
                    padding: "5px 14px", fontSize: 12, fontWeight: 800, letterSpacing: "0.04em",
                  }}>🔥 BEST CHOICE</span>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6, marginBottom: 0 }}>#1 this month</p>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 4 }}>VIRTUAL CAPITAL</div>
                <div style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>{activeSize}</div>
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{
                background: "#0a1528", borderRadius: 16, padding: "18px 20px",
                textAlign: "center", fontSize: 44, fontWeight: 900, color: "#fff",
                letterSpacing: "-0.04em", marginTop: -28, position: "relative", zIndex: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}>
                {price}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                {["Pay $9 now, activate on pass", "No consistency rule", "News trading allowed", "85% reward split"].map((item) => (
                  <div key={item} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12, padding: "11px 13px", fontSize: 12, color: "rgba(255,255,255,0.8)",
                  }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#10b981", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CheckIcon />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <a href={startHref({ program: "forge", size: "50k" })} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                borderRadius: 16, padding: "15px 20px", marginTop: 16,
                textDecoration: "none", boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              }}>
                <span>Start for {price}</span>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowUpRight size={15} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const [active, setActive] = useState(0);
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 56px", lineHeight: 1 }}>
        Stock Market Evaluation
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              onClick={() => setActive(i)}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "28px 0", cursor: "pointer",
                display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 16, alignItems: "start",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.3)", paddingTop: 4 }}>{f.num}</span>
              <div>
                <h3 style={{
                  fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0,
                  color: active === i ? "#fff" : "rgba(255,255,255,0.3)",
                }}>{f.title}</h3>
                {active === i && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 8, lineHeight: 1.6 }}>{f.desc}</p>}
              </div>
              {active === i && (
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: "#1d6ff3",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
                }}>
                  <ArrowUpRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          background: "linear-gradient(160deg,#0e2040 0%,#071428 100%)",
          border: "1px solid rgba(59,130,246,0.18)", borderRadius: 28,
          padding: 20, overflow: "hidden",
        }}>
          <MockPhone />
          <div style={{
            marginTop: 16, background: "#0a1528", borderRadius: 18, padding: "18px 20px",
            display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: "#1d6ff3", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>📊</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{FEATURES[active].title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{FEATURES[active].desc}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockPhone() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 220, borderRadius: 36, overflow: "hidden",
        background: "linear-gradient(180deg,#1d6ff3 0%,#1a50b0 40%,#0c1830 100%)",
        border: "6px solid #111b2e", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        padding: "18px 14px 14px",
      }}>
        <div style={{ width: 80, height: 22, background: "#0a1020", borderRadius: 999, margin: "0 auto 14px" }} />
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, textAlign: "center" }}>Total Balance</div>
        <div style={{ color: "#fff", fontSize: 30, fontWeight: 800, textAlign: "center", letterSpacing: "-0.03em", marginBottom: 18 }}>$600.00</div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <svg viewBox="0 0 180 60" style={{ width: "100%", height: 50 }}>
            <polyline
              points="0,50 30,35 60,40 90,20 120,28 150,15 180,20"
              fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ background: "#0e2040", borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>How much money would you like to invest?</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#60a5fa", letterSpacing: "-0.04em" }}>$10</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>0.05 Shares ↻</div>
          <div style={{ fontSize: 10, color: "#f97316", marginTop: 6 }}>Deposit $10 in order to open this trade</div>
        </div>
      </div>
    </div>
  );
}

function DifferentSection() {
  const items = [
    {
      n: "01 / 03", title: "Smooth Rewards",
      desc: "Over $300K+ Rewards Delivered Out Since February 2026: Global4EX rose to a Top Prop Firm by evolving through client feedback.",
      chip: "Global4EX",
      visual: (
        <div style={{ background: "linear-gradient(180deg,#c7d2fe,#dde4ff)", borderRadius: 24, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 260 }}>
          <svg viewBox="0 0 160 160" width="160" height="160">
            {[
              [0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],
              [4,0],[5,0],[6,0],[4,1],[6,1],[4,2],[5,2],[6,2],
              [0,4],[1,4],[2,4],[0,5],[2,5],[0,6],[1,6],[2,6],
              [3,3],[4,4],[5,5],[3,5],[5,3],
            ].map(([cx,cy],i) => (
              <rect key={i} x={cx*22+2} y={cy*22+2} width="18" height="18" rx="2" fill="#111" />
            ))}
          </svg>
        </div>
      ),
    },
    {
      n: "02 / 03", title: "Real-Time Dashboard",
      desc: "A professional-grade trading dashboard gives you instant visibility into your P&L, drawdown status, and progress toward objectives.",
      chip: "Dashboard",
      visual: (
        <div style={{ background: "linear-gradient(180deg,#fce7f3,#fbcfe8)", borderRadius: 24, padding: 28, minHeight: 260 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[65,88,45,72,90].map((w,i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.5)", borderRadius: 999, padding: "6px 8px", height: 36 }}>
                <div style={{ background: `linear-gradient(90deg,#db2777,#9333ea)`, borderRadius: 999, height: "100%", width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      n: "03 / 03", title: "Global Community",
      desc: "Join 39,946+ traders from 100+ countries. Our platform is available 24/7 with support in multiple languages.",
      chip: "Worldwide",
      visual: (
        <div style={{ background: "linear-gradient(180deg,#d1fae5,#a7f3d0)", borderRadius: 24, padding: 28, minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 80 }}>🌍</div>
        </div>
      ),
    },
  ];

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <h2 style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 40px", lineHeight: 1.05 }}>
        What Makes Us<br />Global Different?
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {items.map((item) => (
          <div key={item.n} style={{
            background: "linear-gradient(180deg,rgba(10,24,48,0.95),rgba(5,14,28,0.98))",
            border: "1px solid rgba(59,130,246,0.12)", borderRadius: 28,
            display: "grid", gridTemplateColumns: "1fr 1.1fr", overflow: "hidden",
          }}>
            <div style={{ padding: "40px 40px 40px" }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 80, fontWeight: 600 }}>{item.n}</div>
              <h3 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 16px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 380 }}>{item.desc}</p>
              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{item.chip}</span>
            </div>
            <div style={{ padding: 28 }}>{item.visual}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <SectionLabel>Features</SectionLabel>
      <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 40px", lineHeight: 1 }}>
        Global4EX Benefits
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{
          background: "linear-gradient(180deg,rgba(14,32,64,0.95),rgba(6,14,28,0.98))",
          border: "1px solid rgba(59,130,246,0.15)", borderRadius: 28, padding: 28,
        }}>
          <BenefitPhone />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {BENEFITS.map((b, i) => (
            <div
              key={b}
              style={{
                borderRadius: 20, padding: "24px 20px",
                gridColumn: i === BENEFITS.length - 1 ? "1 / -1" : undefined,
                background: i === BENEFITS.length - 1
                  ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                  : "rgba(255,255,255,0.03)",
                border: i === BENEFITS.length - 1 ? "none" : "1px solid rgba(255,255,255,0.07)",
                boxShadow: i === BENEFITS.length - 1 ? "0 16px 40px rgba(37,99,235,0.3)" : "none",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: i === BENEFITS.length - 1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", marginBottom: 36, letterSpacing: "0.04em" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: "clamp(16px,2.5vw,22px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{b}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitPhone() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <div style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: 14, fontSize: 12, color: "rgba(255,255,255,0.7)", flexShrink: 0,
      }}>
        <div style={{ fontSize: 20, marginBottom: 6 }}>🇦🇺</div>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 2 }}>$220,45</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Australia Dollar</div>
      </div>
      <div style={{
        width: 200, borderRadius: 32, overflow: "hidden",
        background: "linear-gradient(180deg,#1d6ff3,#0c1830)",
        border: "5px solid #111b2e", boxShadow: "0 16px 50px rgba(0,0,0,0.6)",
        padding: "16px 12px 12px",
      }}>
        <div style={{ width: 70, height: 18, background: "#0a1020", borderRadius: 999, margin: "0 auto 14px" }} />
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Bank Balance</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>$620,45</div>
          <div style={{ fontSize: 18 }}>🔔</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
          {[ ["🇺🇸","$620"],["🇦🇺","$220"],["🇨🇦","$120"] ].map(([flag,val],i)=>(
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{flag}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 14 }}>
          {[ ["📋","Check"],["💳","Add"],["↔","Move"] ].map(([ico,lab],i)=>(
            <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 14 }}>{ico}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{lab}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Transaction</span>
            <span style={{ fontSize: 11, color: "#60a5fa" }}>View All</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>EH</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Esther Howard</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Received · Today</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>+$950.25</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConvenienceSection() {
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
        <div>
          <SectionLabel>Features</SectionLabel>
          <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 20px", lineHeight: 1.05 }}>
            Convenience For<br />Our Traders
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 32 }}>
            Access and manage trading instruments with in-app tools, real-time insights, and instant transactions.
          </p>
          <div style={{
            background: "linear-gradient(180deg,rgba(14,32,64,0.95),rgba(6,14,28,0.98))",
            border: "1px solid rgba(59,130,246,0.15)", borderRadius: 24, padding: 20,
          }}>
            <TradePhone />
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {CONVENIENCE.map((c, i) => (
            <div key={c.title} style={{
              display: "grid", gridTemplateColumns: "48px 1fr auto",
              gap: 16, padding: "28px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", alignItems: "flex-start",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <CheckIcon />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{c.desc}</div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 600, flexShrink: 0 }}>{String(i+1).padStart(2,"0")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TradePhone() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 210, borderRadius: 34, overflow: "hidden",
        background: "linear-gradient(180deg,#1d4ed8,#0c1a30)",
        border: "5px solid #111b2e", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        padding: "16px 12px 12px",
      }}>
        <div style={{ width: 70, height: 18, background: "#0a1020", borderRadius: 999, margin: "0 auto 12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>G</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Total Balance</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>⊡</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", letterSpacing: "-0.03em", marginBottom: 14 }}>$2698.25</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 14 }}>
          {["Deposit","Withdraw","Buy","Transfer"].map(l=>(
            <div key={l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 4px", textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>
              <div style={{ fontSize: 14, marginBottom: 2 }}>💱</div>{l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Coin</span>
          <span style={{ fontSize: 11, color: "#60a5fa" }}>View All</span>
        </div>
        {[ ["BCH","Bitcoin Cash","$90.45","+0.18%",true],["ETH","Ethereum","$190.45","-0.36%",false],["XRP","Ripple","$86.69","+1.82%",true] ].map(([sym,name,val,chg,up])=>(
          <div key={String(sym)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{String(sym)[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{String(sym)}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{String(name)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{String(val)}</div>
              <div style={{ fontSize: 9, color: up ? "#10b981" : "#ef4444" }}>{String(chg)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketAnalysisSection() {
  const [tab, setTab] = useState<"Forex"|"Stock">("Stock");
  const [range, setRange] = useState("1Y");
  const ranges = ["1D","1M","3M","1Y","5Y","All"];

  const pts = "0,120 80,105 160,115 240,88 320,95 400,68 480,80 560,55 640,70 720,45 800,58 880,42 960,50 1040,60 1080,52";

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <SectionLabel>Analysis</SectionLabel>
      <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 32px", lineHeight: 1 }}>
        Market Analysis
      </h2>

      <div style={{
        background: "linear-gradient(180deg,rgba(8,18,36,0.98),rgba(4,10,20,0.98))",
        border: "1px solid rgba(59,130,246,0.15)", borderRadius: 28,
        padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 999, padding: 4, width: "fit-content" }}>
          {(["Forex","Stock"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              border: "none", cursor: "pointer", borderRadius: 999,
              padding: "9px 28px", fontSize: 14, fontWeight: 600,
              background: tab === t ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "transparent",
              color: tab === t ? "#fff" : "rgba(255,255,255,0.5)",
              boxShadow: tab === t ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
              transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {["Indices","Commodities","Bonds","Forex"].map((t,i) => (
            <button key={t} style={{
              border: "none", cursor: "pointer", borderRadius: 10,
              padding: "7px 16px", fontSize: 13, fontWeight: i===0?700:500,
              background: "transparent", color: i===0 ? "#fff" : "rgba(255,255,255,0.45)",
              textDecoration: i===0 ? "underline" : "none", textUnderlineOffset: 4,
            }}>{t}</button>
          ))}
        </div>

        <div style={{
          background: "#060f1e", borderRadius: 20, overflow: "hidden",
          position: "relative", height: 200, marginBottom: 12,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "100% 50px, 80px 100%",
        }}>
          <svg viewBox="0 0 1080 160" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
            <polyline points={`${pts} 1080,160 0,160`} fill="url(#cg)" />
            <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chart-line" />
          </svg>
          <div style={{ position: "absolute", bottom: 8, left: 16, right: 16, display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {["Nov","Dec","2026","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","26"].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              border: "none", cursor: "pointer", borderRadius: 8,
              padding: "5px 14px", fontSize: 13, fontWeight: 600,
              background: range === r ? "rgba(255,255,255,0.12)" : "transparent",
              color: range === r ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "all 0.15s",
            }}>{r}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {MARKET_ROWS.map((row, i) => (
            <div key={row.ticker} style={{
              display: "grid", gridTemplateColumns: "48px 1fr auto",
              alignItems: "center", gap: 16,
              padding: "14px 16px", borderRadius: 14,
              background: i === 0 ? "rgba(59,130,246,0.08)" : "transparent",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: row.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
              }}>{row.symbol}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.ticker}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{row.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.price}</div>
                <div style={{ fontSize: 12, color: "#ef4444" }}>{row.pct}</div>
                <div style={{ fontSize: 11, color: "#f87171" }}>{row.pts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const featured = REVIEWS[0];
  const rest = REVIEWS.slice(1);
  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <SectionLabel>Reviews</SectionLabel>
      <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 40px", lineHeight: 1 }}>
        What Our Users Say
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 }}>
        <div style={{
          background: "linear-gradient(180deg,#4f9bff 0%,#1d6ff3 40%,#1a5fd0 100%)",
          borderRadius: 24, padding: 32,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: 500,
          boxShadow: "0 24px 60px rgba(29,111,243,0.3)",
        }}>
          <div>
            <div style={{ fontSize: 80, color: "rgba(255,255,255,0.15)", lineHeight: 1, marginBottom: 16, fontFamily: "Georgia, serif" }}>“</div>
            <p style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0 }}>
              “{featured.quote}”
            </p>
          </div>
          <div style={{ marginTop: 48 }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginLeft: 6 }}>5.0</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{featured.name}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{featured.date}</div>
          </div>
        </div>

        {[rest.slice(0,3), rest.slice(3)].map((col, ci) => (
          <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {col.map(r => (
              <div key={r.name} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 20, padding: 24,
              }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} />)}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginLeft: 6 }}>5.0</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{r.date}</div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>“{r.quote}”</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="rules" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 60 }}>
        <div>
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em", margin: "0 0 24px", lineHeight: 1.05 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Quick answers based on our trading rules. Full detail lives in the <Link href="/help" style={{ color: "#60a5fa", textDecoration: "underline" }}>Help Center</Link>, our <a href="/legal#aml" style={{ color: "#60a5fa", textDecoration: "underline" }}>Anti-Money Laundering (AML) Policy</a>, and the legal links in the footer.
          </p>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                  padding: "22px 0", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>{faq.q}</span>
                <span
                  className="faq-icon"
                  style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: openIdx === i ? "#1d6ff3" : "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: "#fff", fontWeight: 400,
                  }}
                >
                  {openIdx === i ? "×" : "+"}
                </span>
              </button>
              {openIdx === i && (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 20px", paddingRight: 48 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contactus" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32 }}>
        <div>
          <Logo />
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16, maxWidth: 360, lineHeight: 1.7 }}>
            Global4EX is a simulated trading evaluation platform. All accounts are demo accounts. Rewards are simulated and discretionary. Program fees are service fees only and are not deposits or investments.
          </p>
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          {[
            { title: "Platform", links: [
              { label: "About", href: "/#process" },
              { label: "Plans", href: "/#programs" },
              { label: "Rules", href: "/#rules" },
              { label: "Contact us", href: supportHref },
            ] },
            { title: "Legal", links: [
              { label: "Privacy Policy", href: "/legal#privacy" },
              { label: "Terms of Service", href: "/legal#terms" },
              { label: "AML Policy", href: "/legal#aml" },
              { label: "Help Center", href: "/help" },
            ] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1240, margin: "32px auto 0", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        © 2026 Global4EX. All rights reserved. This platform is for educational and evaluation purposes only.
      </div>
    </footer>
  );
}

function ChatBubble() {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 999,
      width: 52, height: 52, borderRadius: 16,
      background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
      boxShadow: "0 8px 24px rgba(37,99,235,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", fontSize: 22,
    }}>
      💬
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <TopBanner />
      <Navbar />
      <HeroSection />
      <TickerSection />
      <AboutSection />
      <PlansSection />
      <FeaturesSection />
      <DifferentSection />
      <BenefitsSection />
      <ConvenienceSection />
      <MarketAnalysisSection />
      <ReviewsSection />
      <FAQSection />
      <Footer />
      <ChatBubble />
    </>
  );
}
