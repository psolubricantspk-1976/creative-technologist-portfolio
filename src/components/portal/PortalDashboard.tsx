"use client";

import Link from "next/link";
import { useState } from "react";

type Tab = "overview" | "positions" | "payouts" | "account";

const ACCOUNT = {
  program: "Forge",
  type: "2-Step",
  phase: "Phase 2",
  size: 50_000,
  equity: 53_180,
  targetPct: 8,
  dailyPct: 5,
  maxPct: 10,
  splitPct: 90,
  winningDays: 3,
  winningDaysRequired: 5,
  dailyUsed: 312,
  trades: 42,
  winRate: 54,
};

const OPEN = [
  { symbol: "EUR/USD", side: "Buy", size: "1.00", entry: "1.0842", price: "1.0871", pnl: 290 },
  { symbol: "XAU/USD", side: "Sell", size: "0.50", entry: "2,341.20", price: "2,346.80", pnl: -280 },
  { symbol: "US100", side: "Buy", size: "2.00", entry: "18,244", price: "18,301", pnl: 482 },
];

const CLOSED = [
  { symbol: "GBP/USD", side: "Sell", size: "0.80", closed: "Today 09:41", pnl: 214 },
  { symbol: "US30", side: "Buy", size: "1.00", closed: "Today 08:12", pnl: -96 },
  { symbol: "USD/JPY", side: "Buy", size: "1.20", closed: "Yesterday 16:05", pnl: 168 },
  { symbol: "BTC/USD", side: "Sell", size: "0.10", closed: "Yesterday 11:30", pnl: 402 },
];

const PAYOUTS = [
  { ref: "PO-2411", date: "18 Oct 2026", amount: 1_640, method: "USDT", status: "Paid" },
  { ref: "PO-1932", date: "04 Sep 2026", amount: 2_380, method: "Card", status: "Paid" },
];

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const pnl = (value: number) =>
  `${value >= 0 ? "+" : "−"}$${Math.abs(value).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

export function PortalDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@example.com");
  const [saved, setSaved] = useState(false);
  const [amount, setAmount] = useState("");
  const [payoutSent, setPayoutSent] = useState<string | null>(null);

  const profit = ACCOUNT.equity - ACCOUNT.size;
  const profitPct = (profit / ACCOUNT.size) * 100;
  const available = Math.floor(profit * (ACCOUNT.splitPct / 100));
  const maxLossFloor = ACCOUNT.size * (1 - ACCOUNT.maxPct / 100);
  const buffer = ACCOUNT.equity - maxLossFloor;
  const dailyRemaining = ACCOUNT.size * (ACCOUNT.dailyPct / 100) - ACCOUNT.dailyUsed;

  function requestPayout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount.replace(/[^0-9.]/g, ""));
    if (!value || value <= 0 || value > available) return;
    setPayoutSent(`WF-${Math.random().toString(36).toUpperCase().slice(2, 8)}`);
  }

  return (
    <div className="pf-shell">
      <div className="pf-banner">
        <span className="pf-banner-tag">Preview</span>
        <p>
          This is the funded dashboard with sample data so you can see what a live
          account looks like. Your own account is issued after payment.
        </p>
        <Link href="/start" className="pf-banner-link">
          Start an evaluation →
        </Link>
      </div>

      <div className="pf-top">
        <div className="pf-account">
          <span className="pf-account-badge">
            {ACCOUNT.program} {ACCOUNT.type}
          </span>
          <h1>
            {money(ACCOUNT.size)} <span>virtual account</span>
          </h1>
          <div className="pf-account-meta">
            <span className="pf-live-dot" aria-hidden="true" />
            {ACCOUNT.phase} · Simulated · MT5
          </div>
        </div>

        <div className="pf-equity">
          <span>Account equity</span>
          <b>{money(ACCOUNT.equity)}</b>
          <em className={profit >= 0 ? "is-up" : "is-down"}>
            {pnl(profit)} ({profitPct.toFixed(2)}%)
          </em>
        </div>
      </div>

      <nav className="pf-tabs" aria-label="Dashboard sections">
        {(
          [
            ["overview", "Overview"],
            ["positions", "Positions"],
            ["payouts", "Payouts"],
            ["account", "Account"],
          ] as Array<[Tab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`pf-tab${tab === id ? " is-active" : ""}`}
            aria-pressed={tab === id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="pf-grid">
          <section className="pf-card pf-card--wide" aria-label="Equity curve">
            <div className="pf-card-head">
              <h2>Equity curve</h2>
              <span>Last 30 days · simulated</span>
            </div>
            <svg viewBox="0 0 640 180" className="pf-chart" role="img" aria-label="Simulated equity curve rising from 50,000 to 53,180 dollars">
              <defs>
                <linearGradient id="pfFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a1f" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff7a1f" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 150 L60 142 L120 148 L180 128 L240 133 L300 104 L360 112 L420 86 L480 74 L540 58 L600 44 L640 38"
                fill="none"
                stroke="#ff8c3d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 150 L60 142 L120 148 L180 128 L240 133 L300 104 L360 112 L420 86 L480 74 L540 58 L600 44 L640 38 L640 180 L0 180 Z"
                fill="url(#pfFill)"
              />
              <line x1="0" y1="38" x2="640" y2="38" stroke="rgba(255,255,255,0.14)" strokeDasharray="4 4" />
            </svg>
            <div className="pf-chart-legend">
              <span><i className="pf-dot pf-dot--target" /> Profit target {money(ACCOUNT.size * (1 + ACCOUNT.targetPct / 100))}</span>
              <span><i className="pf-dot pf-dot--floor" /> Max loss floor {money(maxLossFloor)}</span>
            </div>
          </section>

          <section className="pf-card" aria-label="Progress to target">
            <div className="pf-card-head">
              <h2>Progress</h2>
              <span>{ACCOUNT.phase}</span>
            </div>

            <div className="pf-meter">
              <div className="pf-meter-head">
                <span>Profit target</span>
                <b>{profitPct.toFixed(2)}% / {ACCOUNT.targetPct}%</b>
              </div>
              <div className="pf-bar"><i style={{ width: `${Math.min(100, (profitPct / ACCOUNT.targetPct) * 100)}%` }} /></div>
            </div>

            <div className="pf-meter">
              <div className="pf-meter-head">
                <span>Daily loss used</span>
                <b>{money(ACCOUNT.dailyUsed)} · {money(dailyRemaining)} left</b>
              </div>
              <div className="pf-bar pf-bar--warn"><i style={{ width: `${(ACCOUNT.dailyUsed / (ACCOUNT.size * ACCOUNT.dailyPct / 100)) * 100}%` }} /></div>
            </div>

            <div className="pf-meter">
              <div className="pf-meter-head">
                <span>Max loss buffer</span>
                <b>{money(buffer)}</b>
              </div>
              <div className="pf-bar pf-bar--ok"><i style={{ width: `${Math.min(100, (buffer / (ACCOUNT.size * ACCOUNT.maxPct / 100)) * 100)}%` }} /></div>
            </div>
          </section>

          <section className="pf-card" aria-label="Account metrics">
            <div className="pf-card-head">
              <h2>This cycle</h2>
            </div>
            <div className="pf-stats">
              <div><b>{ACCOUNT.trades}</b><span>Closed trades</span></div>
              <div><b>{ACCOUNT.winRate}%</b><span>Win rate</span></div>
              <div><b>{ACCOUNT.winningDays}/{ACCOUNT.winningDaysRequired}</b><span>Winning days</span></div>
              <div><b>{ACCOUNT.splitPct}%</b><span>Your split</span></div>
            </div>
          </section>

          <section className="pf-card pf-card--wide" aria-label="Next payout">
            <div className="pf-card-head">
              <h2>Next payout</h2>
              <span>
                {ACCOUNT.winningDays >= ACCOUNT.winningDaysRequired
                  ? "Eligible now"
                  : `${ACCOUNT.winningDaysRequired - ACCOUNT.winningDays} more winning ${
                      ACCOUNT.winningDaysRequired - ACCOUNT.winningDays === 1 ? "day" : "days"
                    }`}
              </span>
            </div>
            <div className="pf-next">
              <b>{money(available)}</b>
              <span>available at {ACCOUNT.splitPct}% of {money(profit)} profit</span>
            </div>
            <ul className="pf-checks">
              <li className="is-done">Payout cycle completed</li>
              <li className={ACCOUNT.winningDays >= ACCOUNT.winningDaysRequired ? "is-done" : "is-todo"}>
                Winning days {ACCOUNT.winningDays} of {ACCOUNT.winningDaysRequired}
              </li>
              <li className="is-done">No open conduct review</li>
            </ul>
            <button type="button" className="gfx-btn gfx-btn--primary gfx-btn--sm" onClick={() => setTab("payouts")}>
              Request payout
            </button>
          </section>
        </div>
      )}

      {tab === "positions" && (
        <div className="pf-grid">
          <section className="pf-card pf-card--wide">
            <div className="pf-card-head">
              <h2>Open positions</h2>
              <span>{OPEN.length} running · floating P/L {pnl(OPEN.reduce((sum, p) => sum + p.pnl, 0))}</span>
            </div>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr><th>Symbol</th><th>Side</th><th>Size</th><th>Entry</th><th>Current</th><th>Floating P/L</th></tr>
                </thead>
                <tbody>
                  {OPEN.map((position) => (
                    <tr key={position.symbol}>
                      <td>{position.symbol}</td>
                      <td><span className={`pf-side pf-side--${position.side.toLowerCase()}`}>{position.side}</span></td>
                      <td>{position.size}</td>
                      <td>{position.entry}</td>
                      <td>{position.price}</td>
                      <td className={position.pnl >= 0 ? "is-up" : "is-down"}>{pnl(position.pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="pf-card pf-card--wide">
            <div className="pf-card-head">
              <h2>Recently closed</h2>
              <span>Last 48 hours</span>
            </div>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr><th>Symbol</th><th>Side</th><th>Size</th><th>Closed</th><th>Result</th></tr>
                </thead>
                <tbody>
                  {CLOSED.map((trade) => (
                    <tr key={`${trade.symbol}-${trade.closed}`}>
                      <td>{trade.symbol}</td>
                      <td><span className={`pf-side pf-side--${trade.side.toLowerCase()}`}>{trade.side}</span></td>
                      <td>{trade.size}</td>
                      <td>{trade.closed}</td>
                      <td className={trade.pnl >= 0 ? "is-up" : "is-down"}>{pnl(trade.pnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="pf-note">
              Trades are shown after they close. Every fill stays visible for the life of
              the account, so a conduct review never relies on screenshots.
            </p>
          </section>
        </div>
      )}

      {tab === "payouts" && (
        <div className="pf-grid">
          <section className="pf-card">
            <div className="pf-card-head">
              <h2>Request a payout</h2>
              <span>Available {money(available)}</span>
            </div>
            {payoutSent ? (
              <div className="pf-success" role="status">
                <b>Request {payoutSent} submitted</b>
                <p>
                  Payouts are reviewed within one business day. You will get an email
                  when the transfer is released, and the amount appears in the history
                  below.
                </p>
                <button type="button" className="st-copy" onClick={() => { setPayoutSent(null); setAmount(""); }}>
                  Make another request
                </button>
              </div>
            ) : (
              <form className="pf-form" onSubmit={requestPayout}>
                <label>
                  <span>Amount (USD)</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder={`Up to ${available.toLocaleString("en-US")}`}
                    required
                  />
                </label>
                <div className="pf-form-row">
                  <button
                    type="button"
                    className="st-link-btn"
                    onClick={() => setAmount(String(available))}
                  >
                    Use maximum
                  </button>
                  <span className="pf-field-note">Minimum $50 · paid to your verified method</span>
                </div>
                <button type="submit" className="gfx-btn gfx-btn--primary gfx-btn--sm">
                  Submit request
                </button>
              </form>
            )}
          </section>

          <section className="pf-card">
            <div className="pf-card-head">
              <h2>Eligibility</h2>
            </div>
            <ul className="pf-checks">
              <li className="is-done">Payout cycle completed</li>
              <li className="is-todo">Winning days {ACCOUNT.winningDays} of {ACCOUNT.winningDaysRequired}</li>
              <li className="is-done">No open positions at review</li>
              <li className="is-done">Identity verified</li>
            </ul>
            <p className="pf-note">
              A payout request is a promise the desk keeps: once the eligibility list is
              complete, the amount is released to the method on file.
            </p>
          </section>

          <section className="pf-card pf-card--wide">
            <div className="pf-card-head">
              <h2>Payout history</h2>
              <span>Sample data</span>
            </div>
            <div className="pf-table-wrap">
              <table className="pf-table">
                <thead>
                  <tr><th>Reference</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {PAYOUTS.map((payout) => (
                    <tr key={payout.ref}>
                      <td>{payout.ref}</td>
                      <td>{payout.date}</td>
                      <td>{money(payout.amount)}</td>
                      <td>{payout.method}</td>
                      <td><span className="pf-status">{payout.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {tab === "account" && (
        <div className="pf-grid">
          <section className="pf-card">
            <div className="pf-card-head">
              <h2>Profile</h2>
            </div>
            <div className="pf-form">
              <label>
                <span>Full name</span>
                <input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} />
              </label>
              <button
                type="button"
                className="gfx-btn gfx-btn--primary gfx-btn--sm"
                onClick={() => setSaved(true)}
              >
                {saved ? "Saved ✓" : "Save changes"}
              </button>
            </div>
          </section>

          <section className="pf-card">
            <div className="pf-card-head">
              <h2>Notifications</h2>
            </div>
            <div className="pf-toggles">
              <label><input type="checkbox" defaultChecked /> Payout status updates</label>
              <label><input type="checkbox" defaultChecked /> Rule warnings at 80% of a limit</label>
              <label><input type="checkbox" /> Product announcements</label>
            </div>
            <p className="pf-note">
              Rule warnings are sent to the email on the account. They are a courtesy —
              the limits are enforced whether or not a warning arrives.
            </p>
          </section>

          <section className="pf-card pf-card--wide">
            <div className="pf-card-head">
              <h2>Security</h2>
            </div>
            <div className="pf-security">
              <div>
                <b>Trading password</b>
                <span>Change it from the MT5 terminal — the dashboard never stores it.</span>
              </div>
              <div>
                <b>Two-factor authentication</b>
                <span>Enabled for dashboard sign-in on the live account.</span>
              </div>
              <div>
                <b>Active sessions</b>
                <span>1 device · last seen today</span>
              </div>
            </div>
            <div className="pf-actions">
              <Link href="/support" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
                Contact support
              </Link>
              <Link href="/help/account-sizes-and-availability" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
                Account rules
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
