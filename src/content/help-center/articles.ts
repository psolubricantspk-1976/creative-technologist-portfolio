import type { Article, Block, CategoryId, Collection } from "./types";
import { flex, platform, products, type RuleValue } from "./rules";

/* ────────────────────────── helpers ────────────────────────── */

const v = (rv: RuleValue) => rv.value;
const note = (rv: RuleValue) => rv.note;

/** Renders a rule value, or a clearly-marked pending chip when unset. */
function valueBlock(label: string, rv: RuleValue): Block {
  if (rv.value) {
    return { kind: "kv", rows: [{ label, value: rv.value, note: rv.note }] };
  }
  return { kind: "pending", label, hint: rv.hint ?? "Awaiting confirmation." };
}

/** True when an article still contains any value awaiting confirmation. */
function pendingOf(blocks: Block[]): boolean {
  return blocks.some((b) => {
    if (b.kind === "pending") return true;
    if (b.kind === "kv") return b.rows.some((r) => !r.value);
    if (b.kind === "table") return b.rows.some((r) => r.includes("Pending"));
    return false;
  });
}

/* ────────────────────────── category model ────────────────────────── */

type Cat = {
  id: CategoryId;
  slug: string;
  code: string;
  title: string;
  summary: string;
  product: "safe" | "pro" | "instant" | "flex";
  stageLabel: string;
  /** Name used for the daily limit: Pause (Safe) vs Drawdown (Pro). */
  dailyLabel: "Maximum Daily Pause" | "Maximum Daily Drawdown";
  /** Whether a daily loss limit applies at all. */
  hasDailyLimit: boolean;
  /** Whether the prohibited-practices article carries the Challenge suffix. */
  challengeSuffix: boolean;
  hasWithdrawalCap: boolean;
};

const CATS: Cat[] = [
  {
    id: "challenge-safe",
    slug: "challenge-stage-safe-mode",
    code: "1.1",
    title: "Challenge Stage — Safe Mode",
    summary:
      "Rules for a 1-phase and 2-phase Safe Mode evaluation: your daily pause, maximum loss rule, leverage and trading conduct.",
    product: "safe",
    stageLabel: "Challenge Stage Safe Mode",
    dailyLabel: "Maximum Daily Pause",
    hasDailyLimit: false,
    challengeSuffix: true,
    hasWithdrawalCap: false,
  },
  {
    id: "funded-safe",
    slug: "funded-stage-safe-mode",
    code: "1.2",
    title: "Funded Stage — Safe Mode",
    summary:
      "Rules that apply once your Safe Mode account is funded, including the withdrawal cap and funded-stage conduct.",
    product: "safe",
    stageLabel: "Funded Stage Safe Mode",
    dailyLabel: "Maximum Daily Pause",
    hasDailyLimit: false,
    challengeSuffix: false,
    hasWithdrawalCap: true,
  },
  {
    id: "challenge-pro",
    slug: "challenge-stage-pro-mode",
    code: "1.3",
    title: "Challenge Stage — Pro Mode",
    summary:
      "Rules for a 1-phase and 2-phase Pro Mode evaluation: daily drawdown, maximum loss rule, leverage and trading conduct.",
    product: "pro",
    stageLabel: "Challenge Stage Pro Mode",
    dailyLabel: "Maximum Daily Drawdown",
    hasDailyLimit: true,
    challengeSuffix: true,
    hasWithdrawalCap: false,
  },
  {
    id: "funded-pro",
    slug: "funded-stage-pro-mode",
    code: "1.4",
    title: "Funded Stage — Pro Mode",
    summary:
      "Rules that apply once your Pro Mode account is funded, including the withdrawal cap and funded-stage conduct.",
    product: "pro",
    stageLabel: "Funded Stage Pro Mode",
    dailyLabel: "Maximum Daily Drawdown",
    hasDailyLimit: true,
    challengeSuffix: false,
    hasWithdrawalCap: true,
  },
  {
    id: "instant-lite",
    slug: "instant-direct-lite",
    code: "1.5",
    title: "Instant Direct Lite",
    summary:
      "Instant Direct Lite skips the evaluation and funds an account immediately. These are the rules that apply.",
    product: "instant",
    stageLabel: "Instant Direct Lite",
    dailyLabel: "Maximum Daily Pause",
    hasDailyLimit: true,
    challengeSuffix: false,
    hasWithdrawalCap: true,
  },
  {
    id: "instant-pro",
    slug: "instant-direct-pro",
    code: "1.6",
    title: "Instant Direct Pro",
    summary:
      "Instant Direct Pro funds an account immediately at Pro Mode terms, with the full set of Pro trading restrictions.",
    product: "instant",
    stageLabel: "Instant Direct Pro",
    dailyLabel: "Maximum Daily Drawdown",
    hasDailyLimit: true,
    challengeSuffix: false,
    hasWithdrawalCap: true,
  },
];

/* ────────────────────────── shared article builders ────────────────────────── */

function dailyLimit(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const p = products[c.product];
  const title = c.hasDailyLimit ? c.dailyLabel : "Maximum Daily Pause";

  if (!c.hasDailyLimit) {
    return {
      title,
      summary: `${c.stageLabel} accounts are sold without a daily loss limit.`,
      section: "Trading Rules and Risk Management",
      body: [
        {
          kind: "p",
          text: `${c.stageLabel} accounts are offered as the mode with no daily loss limit. Your equity is not constrained by a daily threshold, so an intraday drawdown does not, on its own, end the day or the account.`,
        },
        {
          kind: "callout",
          tone: "info",
          title: "No daily limit does not mean no limit",
          text: `The ${c.dailyLabel} does not exist on this account, but the Maximum Loss Rule still applies continuously. See the Maximum Loss Rule article in this collection.`,
        },
        { kind: "h", text: "What still applies" },
        {
          kind: "ul",
          items: [
            `Maximum Loss Rule of ${v(p.maxLoss) ?? "the published maximum loss"} of your initial balance.`,
            `All prohibited-practice rules in this collection.`,
            `Margin requirements and available leverage limits.`,
          ],
        },
        {
          kind: "pending",
          label: "Daily pause behaviour",
          hint:
            "Safe Mode is marketed as having no daily loss limit, but the help-centre spec gives every product a Maximum Daily Pause. Confirm whether a pause period is intended here, and whether a breach pauses trading or closes the account.",
        },
      ],
    };
  }

  return {
    title,
    summary: `How the ${c.dailyLabel.toLowerCase()} works on ${c.stageLabel} accounts.`,
    section: "Trading Rules and Risk Management",
    body: [
      {
        kind: "p",
        text: `Your ${c.dailyLabel} on a ${c.stageLabel} account is a percentage of your starting balance for that trading day. If equity falls by that amount or more from the day's starting balance, the account is automatically closed.`,
      },
      valueBlock(c.dailyLabel, p.daily),
      {
        kind: "kv",
        rows: [{ label: "Resets", value: v(platform.dailyReset), note: note(platform.dailyReset) }],
      },
      { kind: "h", text: "How it is measured" },
      {
        kind: "p",
        text: "The limit is calculated from your starting balance for the day, not from your peak equity, and it does not increase with intraday profit. Both closed results and floating losses on open positions are included.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "A breach is permanent",
        text: `Reaching the ${c.dailyLabel.toLowerCase()} closes the account. There is no pause, no next-day resume and no reset.`,
      },
      {
        kind: "pending",
        label: "Daily breach consequences",
        hint:
          "The spec asks whether a daily breach closes the account or only pauses trading until the next trading day. Confirm which applies to this product.",
      },
    ],
  };
}

function maxLoss(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const p = products[c.product];
  return {
    title: "Maximum Loss Rule",
    summary: `The overall loss limit on ${c.stageLabel} accounts.`,
    section: "Trading Rules and Risk Management",
    body: [
      {
        kind: "p",
        text: `Your maximum overall loss on a ${c.stageLabel} account is measured against your initial balance. It applies continuously for the life of the account, not just within one trading day, and it does not reset.`,
      },
      {
        kind: "kv",
        rows: [
          { label: "Maximum loss", value: v(p.maxLoss), note: note(p.maxLoss) },
          { label: "Basis", value: "Static — measured from the initial balance" },
          { label: "Resets", value: "Never" },
        ],
      },
      { kind: "h", text: "How it is measured" },
      {
        kind: "formula",
        text: "Current total loss = initial balance − current balance or equity. This must never exceed the published maximum loss percentage of your initial balance.",
      },
      {
        kind: "p",
        text: "Both balance and equity are monitored, so floating losses on open positions count. Profits do not increase the allowance: the floor stays anchored to your initial balance however high your balance climbs.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Permanent failure",
        text: "Touching the limit at any point fails the account immediately, even if it recovers seconds later.",
      },
      {
        kind: "examples",
        items: [
          {
            title: "Standard account",
            text: `On a USD 100,000 account with a ${v(p.maxLoss) ?? "published"} limit, the account fails when balance or equity reaches the floor set by that percentage below the initial balance.`,
          },
          {
            title: "After profit",
            text: "The maximum loss allowance does not grow with profit. It is always a percentage of the initial balance, never of peak equity.",
          },
        ],
      },
      {
        kind: "pending",
        label: "Maximum loss basis",
        hint:
          "The site describes this as static on every product. Confirm that Safe, Pro and Instant Direct all use a static maximum loss and that the spec's trailing variant is not intended.",
      },
    ],
  };
}

function dailyUpdate(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "When the Maximum Daily Loss Calculation Is Updated",
    summary: `The reset time that governs ${c.stageLabel} accounts.`,
    section: "Trading Rules and Risk Management",
    body: [
      {
        kind: "p",
        text: "The daily loss limit recalculates once per trading day. The reset marks the start of a new trading day and refreshes the daily calculation.",
      },
      {
        kind: "kv",
        rows: [{ label: "Daily reset", value: v(platform.dailyReset), note: note(platform.dailyReset) }],
      },
      {
        kind: "p",
        text: "All daily loss calculations follow this reset time regardless of your local time zone. Your dashboard shows a live countdown to the reset, and that timer is the official reference — not your broker server time.",
      },
      { kind: "h", text: "What counts toward which day" },
      {
        kind: "ul",
        items: [
          "Losses incurred before the reset count toward the current trading day.",
          "Losses after the reset count toward the next trading day.",
          "Closed results and floating losses on open positions are both included.",
        ],
      },
      {
        kind: "callout",
        tone: "info",
        title: "Plan around the timer",
        text: "Watch the countdown when you hold positions through the reset so an accidental breach does not catch you out.",
      },
    ],
  };
}

function leverage(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const p = products[c.product];
  return {
    title: "Available Leverage",
    summary: `Leverage limits by asset class on ${c.stageLabel} accounts.`,
    section: "Trading Rules and Risk Management",
    body: [
      {
        kind: "p",
        text: `Leverage on ${c.stageLabel} accounts is capped by asset class so risk exposure stays controlled and margin usage is consistent. Leverage is fixed per instrument type and must be respected at all times.`,
      },
      v(p.leverage)
        ? {
            kind: "table",
            head: ["Asset class", "Maximum leverage"],
            rows: [
              ["Forex", v(p.leverage) as string],
              ["Indices", v(p.leverage) as string],
              ["Metals", v(p.leverage) as string],
              ["Energies", v(p.leverage) as string],
              ["Stocks", v(p.leverage) as string],
              ["Crypto", v(p.leverage) as string],
            ],
          }
        : {
            kind: "pending",
            label: "Maximum leverage by asset class",
            hint: "Confirm the cap for forex, indices, metals, energies, stocks and crypto. The figures are per instrument type, not per account size.",
          },
      { kind: "h", text: "Key notes" },
      {
        kind: "ul",
        items: [
          "Leverage limits depend on the instrument, not on account size.",
          "Higher leverage does not exempt you from the daily limit, the maximum loss rule or margin requirements.",
          "Excessive margin usage may result in forced liquidation, a margin call or an account review.",
        ],
      },
      { kind: "h", text: "How leverage interacts with your limits" },
      {
        kind: "p",
        text: `Leverage changes how much margin a position ties up, not how much you can lose. A ${c.stageLabel} account is still bound by the same percentage limits: a wider position simply reaches them faster when the market moves against you.`,
      },
      {
        kind: "formula",
        text: "margin required = position size ÷ leverage",
      },
      {
        kind: "p",
        text: "Because margin is only a deposit against the position, a small adverse move on a large position can consume a meaningful share of your drawdown allowance. Sizing is the control that matters — leverage is not extra risk budget.",
      },
      {
        kind: "pending",
        label: "Leverage reductions around news",
        hint:
          "The spec allows automatic leverage reductions on indices, metals and crypto, or ahead of high-impact news. Confirm whether reductions apply and at what thresholds.",
      },
    ],
  };
}

const PROHIBITED_CORE = [
  "Arbitrage trading, including latency arbitrage and exploiting price feed errors or stale quotes.",
  "Trading in a way designed to exploit a bug, loophole, or platform or broker pricing error.",
  "Coordinating trades across two or more accounts to guarantee a risk-free outcome (cross-account hedging).",
  "Copy-trading between unrelated accounts, or mirroring a signal service without independent decision-making.",
  "Gambling-style trading: a single trade or a small cluster of trades risking an outsized share of the account in one session.",
];

function prohibited(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const title = c.challengeSuffix
    ? "Prohibited Practices — Challenge Phase"
    : `Prohibited Practices — ${c.stageLabel}`;

  return {
    title,
    summary: `Trading practices that are not allowed on ${c.stageLabel} accounts.`,
    section: "Prohibited Behaviors and Trading Strategies",
    body: [
      {
        kind: "p",
        text: `${platform.company} evaluates trading skill. Any behaviour that exploits technical weaknesses, bypasses real market risk, or does not reflect genuine trading decisions is prohibited and may lead to account closure or a rejected payout.`,
      },
      { kind: "ul", items: PROHIBITED_CORE },
      { kind: "h", text: "Hedging inside one account" },
      {
        kind: "p",
        text: "Hedging within a single account may be permitted. Opposing positions on the same instrument across two or more accounts — even accounts you own — are prohibited because they remove market risk and prevent accurate evaluation.",
      },
      { kind: "h", text: "How violations are handled" },
      {
        kind: "p",
        text: "Violations are reviewed against trading data, technical evidence and account behaviour. Outcomes range from removing profits from a flagged trade to rejecting a payout or closing the account.",
      },
      {
        kind: "pending",
        label: "Hard-breach thresholds",
        hint:
          "The spec defines numeric hard-breach conditions for tick scalping (trades held under N seconds within one hour) and trade layering (N trades within N minutes). Confirm the thresholds so they can be published.",
      },
    ],
  };
}

function stopLoss(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Rules Regarding the Use of Stop-Loss Orders",
    summary: `Whether stop-losses are required on ${c.stageLabel} accounts.`,
    section: "Prohibited Behaviors and Trading Strategies",
    body: [
      {
        kind: "p",
        text: "A stop-loss requirement means every open position must carry a stop-loss order shortly after entry. Trades without one may be excluded from your results or treated as a rule violation.",
      },
      {
        kind: "kv",
        rows: [
          { label: "Stop-loss required", value: null, hint: "Confirm whether a stop-loss is mandatory on this product." },
          { label: "Placement window", value: null, hint: "Confirm how many minutes after entry the stop-loss must be set." },
        ],
      },
      {
        kind: "p",
        text: "A stop-loss does not replace the daily limit or the maximum loss rule. Those limits are enforced by the platform regardless of the orders on your account.",
      },
      { kind: "h", text: "How a stop-loss requirement is checked" },
      {
        kind: "ul",
        items: [
          "The platform records the time a position opens and the time a stop-loss is attached to it.",
          "A position left unprotected beyond the placement window can be flagged, even if it is later closed manually.",
          "Removing or widening a stop after entry is a separate question from setting one at entry, and is covered by the pending item below.",
        ],
      },
      { kind: "examples", items: [
        {
          title: "Protected from the start",
          text: "A position opened with a stop-loss attached in the same order is compliant without any further action.",
        },
        {
          title: "Stop added a moment later",
          text: "Adding a stop seconds after entry is usually within the placement window. A position held for hours with no stop is not, whatever the reason.",
        },
        {
          title: "Stop removed before news",
          text: "Deleting a stop to avoid being taken out ahead of a release leaves the account unprotected and can be read as a violation in its own right.",
        },
      ] },
      {
        kind: "callout",
        tone: "info",
        title: "A stop is not a guarantee",
        text: "Stops execute at the next available price. In fast markets or over a weekend gap, a position can close beyond the level you set — the stop reduces exposure, it does not cap it.",
      },
      {
        kind: "pending",
        label: "Stop order handling",
        hint:
          "Confirm whether trailing stops, guaranteed stops and stop-loss modifications after entry are permitted.",
      },
    ],
  };
}

function expertAdvisors(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Use of Expert Advisors (EAs)",
    summary: `Automation rules on ${c.stageLabel} accounts.`,
    section: "Prohibited Behaviors and Trading Strategies",
    body: [
      {
        kind: "p",
        text: "Expert Advisors and automated tools are permitted when they support genuine trading decisions. They may not rely on prohibited practices such as latency arbitrage, tick scalping or high-frequency trading, and they must respect every rule in this collection.",
      },
      { kind: "h", text: "Not permitted" },
      {
        kind: "ul",
        items: [
          "Bots that execute at extreme speed or place very large numbers of trades.",
          "Automation that exploits execution delays or platform behaviour.",
          "Algorithms that replicate trades across accounts.",
        ],
      },
      { kind: "h", text: "What we look for" },
      {
        kind: "ul",
        items: [
          "Does the automation make its own decisions from market data, or does it depend on platform timing?",
          "Is the trade frequency consistent with discretionary trading, or with a machine harvesting small edges?",
          "Can you explain the strategy, in plain words, to someone reading your trade history?",
        ],
      },
      {
        kind: "p",
        text: "A straightforward expert advisor that opens positions on a signal, manages them with stops, and closes them on a rule is normal use. The problem is automation whose edge comes from being faster than the platform rather than from being right about the market.",
      },
      {
        kind: "pending",
        label: "Copy-trading and signal tools",
        hint: "Confirm whether copy-trading EAs and third-party signal bots are allowed on this product.",
      },
    ],
  };
}

function weekendHolding(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Weekend Holding Rule",
    summary: `Overnight and weekend position rules on ${c.stageLabel} accounts.`,
    section: "Prohibited Behaviors and Trading Strategies",
    body: [
      {
        kind: "p",
        text: "This rule sets whether positions may be held open overnight and across the weekend, and whether any cut-off applies.",
      },
      {
        kind: "kv",
        rows: [
          { label: "Weekend holding", value: v(platform.weekendHolding), note: note(platform.weekendHolding) },
        ],
      },
      {
        kind: "p",
        text: "Where holding is permitted, standard swap charges apply and every risk limit continues to be enforced while the position is open.",
      },
      { kind: "h", text: "Why the weekend is treated separately" },
      {
        kind: "p",
        text: "Markets close, but risk does not. A position carried over the weekend is exposed to whatever happens between Friday's close and Monday's open — a gap that can open beyond your stop and land directly on the maximum loss floor.",
      },
      {
        kind: "examples",
        items: [
          {
            title: "A gap through the stop",
            text: "A position protected by a stop 20 points away can reopen 60 points lower after a weekend announcement. The stop fills at the market's first available price, not the level you set.",
          },
          {
            title: "No chance to react",
            text: "During the week you can close a position when conditions change. Over the weekend you cannot, and neither can the platform on your behalf.",
          },
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Size for the gap, not the average day",
        text: "Positions held into the weekend should be small enough that a weekend gap does not threaten the account. Reduce size before the close rather than relying on the stop.",
      },
      {
        kind: "pending",
        label: "Weekly cut-off time",
        hint:
          "Confirm whether a UTC cut-off applies before the weekly close and what counts as a violation under this rule.",
      },
    ],
  };
}

function toxicTrading(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Toxic Trading Behaviour",
    summary: `What counts as toxic trading on ${c.stageLabel} accounts.`,
    section: "Prohibited Behaviors and Trading Strategies",
    body: [
      {
        kind: "p",
        text: "Toxic trading behaviour means patterns that profit from the platform, pricing or execution rather than from genuine market analysis — for example exploiting execution latency, running one-sided risk-free strategies, or building positions around pricing errors.",
      },
      { kind: "h", text: "Examples of what this covers" },
      {
        kind: "ul",
        items: [
          "Latency arbitrage — trading on a stale quote that the platform has not yet updated.",
          "Tick scalping at speeds no discretionary trader could match, especially clustered in short bursts.",
          "Exploiting a pricing or feed error, or trading a symbol whose quote is clearly out of line with the market.",
          "Hedging the same exposure across accounts to manufacture a risk-free outcome.",
        ],
      },
      {
        kind: "p",
        text: "The common thread is that the profit comes from how the platform priced or executed the trade, not from a view on where the market was going. A fast trader with a real view is not the target of this rule; a strategy that only works because of a timing gap is.",
      },
      {
        kind: "callout",
        tone: "info",
        title: "Trading around news is not toxic trading",
        text: `News trading is explicitly allowed on this account (see the Weekend Holding and news rules in this collection). Taking a position because of a release is a market view. Capturing a delay between the release and the platform's price is not.`,
      },
      {
        kind: "pending",
        label: "Toxic trading definition",
        hint: `Publish the specific definition of toxic trading used for ${c.stageLabel} accounts.`,
      },
      {
        kind: "pending",
        label: "Consequences for toxic trading",
        hint:
          "Confirm how the behaviour is handled: profits removed, payout rejected, account terminated, and whether a warning is issued first.",
      },
    ],
  };
}

function rightOfAdmission(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Right of Admission",
    summary: `Account review and closure rights on ${c.stageLabel} accounts.`,
    section: "Account Rules",
    body: [
      {
        kind: "p",
        text: `${platform.company} reserves the right to refuse, suspend or close any account at its discretion, including where a trader's conduct is inconsistent with the spirit of these guidelines even where no specific rule has been broken.`,
      },
      { kind: "h", text: "Key points" },
      {
        kind: "ul",
        items: [
          "This applies to every account category.",
          "Decisions are based on trading data, technical evidence and account behaviour.",
        ],
      },
      { kind: "h", text: "What may prompt a review" },
      {
        kind: "ul",
        items: [
          "A trading pattern that repeatedly lands just inside a limit in a way discretionary trading rarely does.",
          "Several accounts behaving identically, or one trader operating accounts registered to other people.",
          "Evidence that account access has been shared or sold.",
          "Conduct that is legal and within the written rules but clearly aimed at extracting value from the programme rather than trading it.",
        ],
      },
      {
        kind: "p",
        text: "This clause exists because no rulebook can anticipate every strategy. It is not a licence to close profitable accounts: a trader who follows the written rules and produces a genuine track record has nothing to answer for.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Ask before you assume",
        text: "If a strategy sits close to the line — unusual order flow, automation, or accounts linked to family members — ask support first. A written answer before you trade is worth more than an argument after a review.",
      },
      {
        kind: "pending",
        label: "Fees and pending payouts",
        hint:
          "Confirm how a refused or closed account is treated with respect to evaluation fees and pending payouts.",
      },
    ],
  };
}

function inactivity(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const p = products[c.product];
  return {
    title: "Account Inactivity Rule",
    summary: `Inactivity limits on ${c.stageLabel} accounts.`,
    section: "Account Rules",
    body: [
      {
        kind: "p",
        text: "An account with no trading activity for a set number of consecutive days may be suspended or closed. Activity means at least one trade opened or closed.",
      },
      {
        kind: "kv",
        rows: [
          {
            label: "Inactivity period",
            value: v(p.inactivityDays),
            note: note(p.inactivityDays),
          },
        ],
      },
      { kind: "h", text: "Why inactivity is monitored" },
      {
        kind: "p",
        text: "A funded account that never trades still carries the platform's obligations: it holds a size on the book, it keeps a login live, and it can be used to reserve capacity that other traders are waiting for. The rule exists to return dormant accounts to circulation, not to punish a trader for taking a break.",
      },
      {
        kind: "ul",
        items: [
          "Opening and closing a single position is enough to reset the countdown.",
          "Leaving a position open without managing it is not the same as trading, and may not count as activity.",
          "If you plan to step away for a while, tell support before the limit is reached.",
        ],
      },
      {
        kind: "pending",
        label: "Inactivity terms",
        hint:
          "Confirm the number of consecutive days, whether open positions count as activity, whether the countdown is shown on the dashboard, and whether a closed account can be reinstated.",
      },
    ],
  };
}

function ipPolicy(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "IP Policy",
    summary: `Device and connection rules on ${c.stageLabel} accounts.`,
    section: "Device Access, Usage & Security",
    body: [
      {
        kind: "p",
        text: "The IP policy governs how accounts may be accessed, including whether several accounts may be used from one IP address and whether VPN use is permitted.",
      },
      { kind: "h", text: "Why connections are monitored" },
      {
        kind: "ul",
        items: [
          "One person trading several accounts is a different risk profile from several people trading one each.",
          "Shared logins are the most common way an account is used by someone it was not issued to.",
          "A sudden change of country can indicate a compromised login — or simply travel.",
        ],
      },
      {
        kind: "p",
        text: "The platform looks at connection patterns, not at individuals. A trader working from home on one device is unremarkable; dozens of logins from one address across accounts registered to different people is not.",
      },
      {
        kind: "callout",
        tone: "info",
        title: "Travelling or using a VPN?",
        text: "Tell support before you travel or if you routinely trade through a VPN so the change is on record. An unexplained connection from a new country is what triggers a security hold.",
      },
      {
        kind: "pending",
        label: "IP policy",
        hint:
          "Confirm the IP rules: multiple accounts on one IP address, VPN and proxy use, shared devices and travel.",
      },
    ],
  };
}

function passwordPolicy(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  return {
    title: "Password Usage Policy",
    summary: `Credential rules for ${c.stageLabel} accounts.`,
    section: "Account & User Administration",
    body: [
      {
        kind: "p",
        text: "Your account credentials are personal. Sharing them lets another person trade your account, which conflicts with the identity checks applied to the platform.",
      },
      {
        kind: "ul",
        items: [
          "Do not share your password or trading login with anyone, including a signal provider.",
          "Do not resell or transfer access to your account.",
          "Contact support immediately if you believe your credentials have been compromised.",
        ],
      },
      { kind: "h", text: "Practical hygiene" },
      {
        kind: "ul",
        items: [
          "Use a unique password for your trading login — never one you have used on another site.",
          "Store it in a password manager rather than a note or a browser profile on a shared machine.",
          "Change it immediately if you have entered it anywhere you did not expect to.",
          "Be sceptical of anyone who asks for your login, including someone offering to trade for you.",
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Support will never ask for your password",
        text: "If a message asks for your trading password to unlock a payout, verify a rule or fix an account, treat it as fraud. Contact support through the address published on the site instead of replying.",
      },
      {
        kind: "pending",
        label: "Password requirements",
        hint: "Confirm minimum length, complexity rules and two-factor authentication availability.",
      },
    ],
  };
}

function withdrawalCap(c: Cat): { title: string; summary: string; body: Block[]; section: string } {
  const p = products[c.product];
  return {
    title: "Withdrawal Cap Limit",
    summary: `The maximum withdrawal per payout period on ${c.stageLabel} accounts.`,
    section: "Trading Rules and Risk Management",
    body: [
      {
        kind: "p",
        text: "A withdrawal cap sets the most profit you can withdraw in a single payout period, regardless of how much profit you earned in that period. Profit above the cap is not lost — it stays on the account and may be eligible in a later payout.",
      },
      {
        kind: "kv",
        rows: [
          { label: "Cap per payout period", value: v(p.withdrawalCap), note: note(p.withdrawalCap) },
          { label: "Basis", value: "Percentage of the initial account balance" },
        ],
      },
      {
        kind: "formula",
        text: "Maximum withdrawable amount = initial account balance × cap percentage.",
      },
      { kind: "h", text: "Key points" },
      {
        kind: "ul",
        items: [
          "The cap is a percentage of the initial balance and does not increase with profit.",
          "Profits above the cap are deferred, not lost.",
          "Every other rule still applies, including the daily limit, maximum loss and leverage.",
          "Requests above the cap are adjusted to the cap.",
        ],
      },
      {
        kind: "pending",
        label: "Withdrawal cap percentage",
        hint: "Publish the withdrawal cap percentage for this product.",
      },
    ],
  };
}

/* ────────────────────────── Flex articles ────────────────────────── */

function flexArticles(): Article[] {
  const p = products.flex;
  const build = (
    slug: string,
    title: string,
    summary: string,
    section: string,
    body: Block[]
  ): Article => ({ slug, title, summary, section, body, pending: pendingOf(body) });

  return [
    build(
      "how-flex-works",
      "How Flex Works",
      "Pay a small setup fee, pass a one-phase evaluation, then pay an activation fee to receive a funded account.",
      "Flex",
      [
        {
          kind: "p",
          text: "Flex is a one-phase evaluation with a small setup fee and a separate activation fee. You pay the setup fee to start on any account size. If you pass, you pay an activation fee and your funded account is issued. If you do not pass, you pay nothing further.",
        },
        { kind: "h", text: "The path" },
        {
          kind: "ol",
          items: [
            "Pay the setup fee to start a Flex evaluation on any supported account size.",
            "Reach the profit target. There are no minimum trading days and no time limit.",
            "Pass. Your trading goes through a final review and your certificate is issued.",
            "Pay the activation fee within the window shown on your dashboard.",
            "Your funded account is issued with a new trading login.",
          ],
        },
        {
          kind: "kv",
          rows: [
            { label: "Setup fee", value: v(flex.setupFee), hint: flex.setupFee.hint },
            { label: "Activation fee", value: v(flex.activationFee), hint: flex.activationFee.hint },
            {
              label: "Activation window",
              value: v(flex.activationWindow),
              hint: flex.activationWindow.hint,
            },
          ],
        },
        { kind: "h", text: "What the setup fee covers" },
        {
          kind: "ul",
          items: [
            "It pays for the evaluation only and is not credited toward the activation fee.",
            "Profit made during the evaluation cannot be used to pay the activation fee.",
            "Profit made during the evaluation cannot be withdrawn — it proves you passed, and the funded account starts fresh.",
            "If you fail, no activation fee is charged and you lose only the setup fee.",
          ],
        },
        { kind: "h", text: "No resets and no retries" },
        {
          kind: "p",
          text: "Flex has no resets and no retry. If a drawdown limit is breached, that attempt is over and a new evaluation is required.",
        },
        { kind: "h", text: "Passing closes the evaluation account" },
        {
          kind: "p",
          text: "The moment you pass, the evaluation account closes and any open positions close with it, because the funded stage has not been paid for yet.",
        },
        {
          kind: "callout",
          tone: "info",
          title: "Activation price is set on the day you pay",
          text: "You are charged the activation fee that applies on the day you pay it. If prices change between passing and activating, the price on the day you activate is the price you pay.",
        },
        {
          kind: "pending",
          label: "Flex setup and activation fees",
          hint: "Confirm the setup fee, activation fee, activation window and whether the activation fee scales by account size.",
        },
      ]
    ),
    build(
      "flex-challenge-requirements",
      "Flex Challenge Requirements",
      "The profit target and drawdown limits you must meet to pass a Flex evaluation.",
      "Flex",
      [
        {
          kind: "kv",
          rows: [
            { label: "Profit target", value: v(p.phase1Target) },
            { label: "Daily drawdown", value: v(p.daily) },
            { label: "Maximum drawdown", value: v(p.maxLoss), note: note(p.maxLoss) },
          ],
        },
        { kind: "h", text: "Daily drawdown" },
        {
          kind: "p",
          text: "Measured against your opening equity for the day and reset at the daily reset time. On Flex, a daily breach is a permanent fail, not a pause.",
        },
        { kind: "h", text: "Maximum drawdown" },
        {
          kind: "p",
          text: "The maximum drawdown is measured from your starting balance: the account fails if equity falls 8% below it. Only closed trades count toward the limit — floating profit never raises the floor.",
        },
        {
          kind: "pending",
          label: "Maximum drawdown basis",
          hint: "Confirm whether the Flex floor is static from the starting balance or trails your closed profit and locks once it reaches the starting balance.",
        },
        { kind: "h", text: "What Flex does not require" },
        {
          kind: "ul",
          items: [
            "No minimum trading days.",
            "No time limit — take as long as you need.",
            "No consistency rule during the evaluation.",
          ],
        },
        { kind: "h", text: "What is allowed" },
        {
          kind: "kv",
          rows: [
            { label: "News trading", value: v(platform.newsTrading) },
            { label: "Overnight and weekend holding", value: v(platform.weekendHolding) },
            { label: "Expert Advisors", value: "Permitted for genuine decisions" },
            { label: "Stop-losses", value: null },
            { label: "Minimum hold time", value: v(p.minHoldTime), hint: p.minHoldTime.hint },
          ],
        },
      ]
    ),
    build(
      "flex-funded-stage",
      "Flex Funded Stage",
      "Limits, profit split, consistency and payout requirements once your Flex account is funded.",
      "Flex",
      [
        { kind: "h", text: "How it is issued" },
        {
          kind: "p",
          text: "Once your activation fee is paid, a funded account is created under the same order as your evaluation with a new trading login. Credentials are sent by email.",
        },
        { kind: "h", text: "Drawdown limits" },
        {
          kind: "kv",
          rows: [
            { label: "Daily drawdown", value: v(p.daily) },
            { label: "Maximum drawdown", value: v(p.maxLoss), note: note(p.maxLoss) },
            { label: "Profit split", value: v(p.split) },
          ],
        },
        {
          kind: "p",
          text: "These are the same limits as the evaluation stage. They do not change when you become funded, and a breach ends the account with no reset.",
        },
        { kind: "h", text: "Consistency before payout" },
        {
          kind: "p",
          text: "No single day may account for more than the published share of your total profit when you request a payout. This is not a breach and does not fail the account — it delays the payout until your day-by-day balance is even enough.",
        },
        {
          kind: "kv",
          rows: [
            {
              label: "Funded consistency",
              value: v(flex.consistencyThreshold),
              hint: flex.consistencyThreshold.hint,
            },
          ],
        },
        { kind: "h", text: "News on the funded stage" },
        {
          kind: "p",
          text: "News trading is allowed on the Flex evaluation. Whether the funded stage restricts opening or closing positions around high-impact releases — and how wide that window is — has not been published yet, so do not assume an exemption in either direction.",
        },
        {
          kind: "pending",
          label: "News restriction window",
          hint: "Confirm how many minutes before and after a release trading is restricted.",
        },
        { kind: "h", text: "Before your first payout" },
        {
          kind: "ul",
          items: [
            "Complete the required number of profitable trading days. Days do not need to be consecutive.",
            "All trades must be closed when you request the payout.",
            "The account must be above your starting balance.",
            "A withdrawal may not take the balance down to the drawdown floor, because that leaves no room and closes the account.",
          ],
        },
        {
          kind: "kv",
          rows: [
            { label: "Profitable days required", value: null, hint: "Confirm the number of profitable days and the minimum profit per day." },
            { label: "Minimum withdrawal", value: v(flex.minWithdrawal), hint: flex.minWithdrawal.hint },
            { label: "Payout processing", value: v(flex.payoutProcessing), hint: flex.payoutProcessing.hint },
          ],
        },
        { kind: "h", text: "Still allowed on the funded stage" },
        {
          kind: "ul",
          items: [
            "Overnight and weekend holding.",
            "Expert Advisors used for genuine trading decisions.",
            "Copying between accounts you legally own.",
          ],
        },
      ]
    ),
    build(
      "flex-prohibited-practices",
      "Prohibited Practices — Flex",
      "The practices that will cost you a Flex account or a payout.",
      "Flex",
      [
        {
          kind: "p",
          text: "Practices that will cost you a Flex account or a payout.",
        },
        { kind: "h", text: "Tick scalping" },
        {
          kind: "p",
          text: "Any trade closed faster than the published minimum hold time may be flagged. Flagged trades are reviewed at withdrawal and can cause a payout to be rejected.",
        },
        {
          kind: "pending",
          label: "Minimum hold time",
          hint: "Publish the Flex minimum hold time before a trade is considered tick scalping.",
        },
        { kind: "h", text: "Also prohibited" },
        {
          kind: "ul",
          items: [
            ...PROHIBITED_CORE,
            "Account management by a third party — you must trade your own account.",
            "Copying between accounts you do not own.",
            "Exploiting platform, feed or latency errors.",
            "Group or coordinated trading designed to guarantee a payout.",
            "Sharing or reselling account credentials.",
          ],
        },
        { kind: "h", text: "How violations are handled" },
        {
          kind: "p",
          text: "Drawdown breaches end the account immediately. Other violations are reviewed at withdrawal and can result in a rejected payout or a closed account. The Flex funded stage also follows the prohibited practices that apply to the 1-phase Pro Mode funded stage.",
        },
      ]
    ),
  ];
}

/* ────────────────────────── collection 1 ────────────────────────── */

function buildCategory(c: Cat): Collection {
  const shared = [dailyLimit, maxLoss, dailyUpdate, leverage];
  const conduct = [stopLoss, expertAdvisors, weekendHolding, toxicTrading];
  const admin = [rightOfAdmission, inactivity, ipPolicy, passwordPolicy];

  const defs: Array<ReturnType<typeof dailyLimit>> = [];

  if (c.id === "instant-pro") {
    // Spec order for Instant Direct Pro.
    defs.push(
      leverage(c),
      dailyLimit(c),
      maxLoss(c),
      dailyUpdate(c),
      ...(c.hasWithdrawalCap ? [withdrawalCap(c)] : []),
      prohibited(c),
      inactivity(c),
      rightOfAdmission(c),
      stopLoss(c),
      toxicTrading(c),
      expertAdvisors(c),
      weekendHolding(c),
      ipPolicy(c),
      passwordPolicy(c)
    );
  } else {
    defs.push(...shared.map((fn) => fn(c)));
    if (c.hasWithdrawalCap) defs.push(withdrawalCap(c));
    defs.push(prohibited(c), ...conduct.map((fn) => fn(c)), ...admin.map((fn) => fn(c)));
  }

  const articles: Article[] = defs.map((d) => {
    const slug = d.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return {
      slug,
      title: d.title,
      summary: d.summary,
      section: d.section,
      body: d.body,
      pending: pendingOf(d.body),
    };
  });

  return {
    slug: c.slug,
    code: c.code,
    title: c.title,
    summary: c.summary,
    articles,
  };
}

/* ────────────────────────── collections 2–6 ────────────────────────── */

function crossCollections(): Collection[] {
  const passing: Collection = {
    slug: "passing-the-challenge",
    code: "2",
    title: "Passing the Challenge Requirements",
    summary: "How to pass the Challenge Stage, or skip it with Instant Direct.",
    articles: [
      {
        slug: "how-to-pass-the-challenge",
        title: "How to Pass the Challenge (or Skip It With Instant Direct)",
        summary:
          "Reach the Phase 1 and Phase 2 profit targets within the daily and maximum loss limits.",
        section: "Passing the Challenge Requirements",
        pending: true,
        body: [
          {
            kind: "p",
            text: "To pass the two-step Challenge Stage, reach the Phase 1 and Phase 2 profit targets for your chosen mode while staying within the daily limit and the Maximum Loss Rule.",
          },
          {
            kind: "table",
            head: ["Mode", "Phase 1 target", "Phase 2 target", "Daily limit", "Maximum loss"],
            rows: [
              [
                "Safe Mode",
                v(products.safe.phase1Target) ?? "Pending",
                v(products.safe.phase2Target) ?? "Pending",
                v(products.safe.daily) ?? "Pending",
                v(products.safe.maxLoss) ?? "Pending",
              ],
              [
                "Pro Mode",
                v(products.pro.phase1Target) ?? "Pending",
                v(products.pro.phase2Target) ?? "Pending",
                v(products.pro.daily) ?? "Pending",
                v(products.pro.maxLoss) ?? "Pending",
              ],
            ],
          },
          {
            kind: "p",
            text: "If you would rather not complete an evaluation, you can skip the Challenge Stage entirely by choosing Instant Direct Lite or Instant Direct Pro, which fund an account immediately for a higher one-time fee.",
          },
          { kind: "h", text: "The order that matters" },
          {
            kind: "ol",
            items: [
              "Pick the account size and the product, and pay the one-time evaluation fee.",
              "Trade toward the Phase 1 target without touching the daily limit or the Maximum Loss Rule.",
              "Once Phase 1 is met and reviewed, the Phase 2 account is issued with its own target and the same loss limits.",
              "Meet the Phase 2 target and the funded account is created — no further fee for Safe Mode or Pro Mode.",
            ],
          },
          { kind: "h", text: "What ends an evaluation early" },
          {
            kind: "ul",
            items: [
              "Equity touching the Maximum Loss floor — this is permanent, even if the account recovers seconds later.",
              "Equity touching the daily limit for the day — the account is stopped for the rest of that trading day at minimum.",
              "A trading-day or time limit expiring, where the product applies one.",
              "A conduct violation under the rules in the product's collection.",
            ],
          },
          {
            kind: "callout",
            tone: "info",
            title: "Passing is a review, not just a number",
            text: "Hitting the target triggers a check before the next stage is issued. Identical trades across accounts, hedging between them, or conduct that only works because of execution timing can hold or void a pass even when the percentage is met.",
          },
          {
            kind: "pending",
            label: "Phase 2 target",
            hint:
              "The site publishes a single 10% target for Safe Mode. Confirm whether Phase 1 and Phase 2 use the same target or different targets.",
          },
        ],
      },
    ],
  };

  const eligibility: Collection = {
    slug: "withdrawals-and-performance",
    code: "3",
    title: "Eligibility for Withdrawal and Performance Criteria",
    summary:
      "When you can request a payout, how winning days work, the schedule and the profit split.",
    articles: [
      {
        slug: "payout-eligibility-and-schedule",
        title: "Payout Eligibility & Schedule",
        summary: "When your first payout becomes available and how often payouts run.",
        section: "Withdrawals",
        pending: true,
        body: [
          {
            kind: "p",
            text: "Your first payout becomes available once you complete your first full payout cycle on a funded account, meet the Winning Days Requirement, and stay within your account's Withdrawal Cap Limit.",
          },
          {
            kind: "kv",
            rows: [
              { label: "Safe Mode Funded & Instant Direct Lite", value: null, hint: "Confirm the payout cycle in days." },
              { label: "Pro Mode Funded & Instant Direct Pro", value: null, hint: "Confirm the payout cycle in days." },
              { label: "Flex", value: null, hint: "Confirm the Flex payout cycle in days." },
            ],
          },
          {
            kind: "p",
            text: "Every schedule can be shortened with the optional Bi-Weekly Payouts add-on.",
          },
          { kind: "h", text: "The three conditions for a payout" },
          {
            kind: "ol",
            items: [
              "A completed payout cycle on the funded account — you cannot request a payout inside your first cycle.",
              "The Winning Days Requirement for your account category, satisfied with real trading days rather than a single large position.",
              "The request within your Withdrawal Cap Limit for that period, with no open conduct review on the account.",
            ],
          },
          {
            kind: "p",
            text: "Profit above the cap is not forfeited. It stays on the account and can be requested in a later period, which is why a cap is a pacing rule rather than a ceiling on what you can earn.",
          },
          { kind: "h", text: "What delays a payout" },
          {
            kind: "ul",
            items: [
              "Open positions on the account while the request is processed.",
              "A compliance or conduct review that has not concluded.",
              "Identity or payment details that do not match the account holder.",
              "Trading days counted toward the requirement that are later found to violate a conduct rule.",
            ],
          },
          {
            kind: "callout",
            tone: "info",
            title: "Request early in the cycle, not at the end",
            text: "A request submitted inside the processing window may roll into the next cycle. Submit as soon as you are eligible rather than waiting for the last day.",
          },
          {
            kind: "pending",
            label: "Payout schedule by product",
            hint: "Publish the payout cycle length for each product family.",
          },
        ],
      },
      {
        slug: "winning-days-fee-return-resets-and-profit-split",
        title: "Winning Days, Fee Return, Resets & Profit Split",
        summary: "How the profit split, fee return and resets work.",
        section: "Withdrawals",
        pending: true,
        body: [
          {
            kind: "kv",
            rows: [
              { label: "Safe Mode profit split", value: v(products.safe.split) },
              { label: "Pro Mode profit split", value: v(products.pro.split) },
              { label: "Instant Direct profit split", value: v(products.instant.split) },
              { label: "Flex profit split", value: v(products.flex.split) },
              { label: "Scaling plan", value: v(platform.scaling), note: note(platform.scaling) },
            ],
          },
          {
            kind: "p",
            text: "The profit split can increase through the Profit Split Boost add-on or a scaling plan.",
          },
          {
            kind: "pending",
            label: "Fee return policy",
            hint:
              "Confirm whether the evaluation fee is refunded on the first successful payout, and under what conditions.",
          },
          {
            kind: "pending",
            label: "Reset policy",
            hint:
              "Confirm whether failed evaluations can be reset, at what cost, and whether breached funded accounts can be reset.",
          },
          {
            kind: "p",
            text: `All payouts, resets and profit splits are governed by the ${platform.company} Terms and Conditions and may be withheld pending a standard compliance review.`,
          },
        ],
      },
    ],
  };

  const sizes: Collection = {
    slug: "account-sizes-and-availability",
    code: "4",
    title: "Account Sizes & Availability",
    summary: "Which account sizes exist and which products can be bought at each size.",
    articles: [
      {
        slug: "available-account-sizes",
        title: "Available Account Sizes",
        summary: "The account sizes offered across all categories.",
        section: "Account Sizes",
        pending: true,
        body: [
          {
            kind: "p",
            text: "Account sizes range from $5,000 to $200,000 depending on the product. The table below shows which categories are available at each size.",
          },
          {
            kind: "table",
            head: ["Account size", "Available as", "Daily limit", "Maximum loss"],
            rows: [
              ["$5,000", "Safe, Pro, Instant Direct, Flex", "Per product", "Per product"],
              ["$10,000", "Safe, Pro, Instant Direct, Flex", "Per product", "Per product"],
              ["$25,000", "Safe, Pro, Instant Direct, Flex", "Per product", "Per product"],
              ["$50,000", "Safe, Pro, Instant Direct", "Per product", "Per product"],
              ["$100,000", "Safe, Pro, Instant Direct", "Per product", "Per product"],
              ["$200,000", "Pro, Instant Direct Pro", "Per product", "Per product"],
            ],
          },
          {
            kind: "callout",
            tone: "info",
            title: "Per-product limits",
            text: "Daily and maximum loss limits differ by product, not by account size. Open the product's collection for the exact figures.",
          },
          {
            kind: "pending",
            label: "Withdrawal cap by account size",
            hint:
              "The source table includes a withdrawal cap per account size. Confirm those values so the column can be filled in.",
          },
        ],
      },
      {
        slug: "account-availability-by-category",
        title: "Account Availability by Category",
        summary: "The size range available for each product.",
        section: "Account Sizes",
        pending: false,
        body: [
          {
            kind: "table",
            head: ["Product", "Smallest size", "Largest size"],
            rows: [
              ["Safe Mode (1-Phase & 2-Phase)", "$5,000", "$100,000"],
              ["Pro Mode (1-Phase & 2-Phase)", "$5,000", "$200,000"],
              ["Instant Direct Lite", "$5,000", "$100,000"],
              ["Instant Direct Pro", "$5,000", "$200,000"],
              ["Flex", "$5,000", "$25,000"],
            ],
          },
          {
            kind: "p",
            text: "Every product starts at $5,000, so the cheapest way to begin is the same across the board. The maximum is where they diverge: Pro Mode and Instant Direct Pro reach $200,000, while Flex stops at $25,000 because its rules are deliberately more relaxed.",
          },
          {
            kind: "p",
            text: "A larger account size scales the profit target and both drawdown limits proportionally — the percentages stay the same. Flex sits apart: a fixed setup fee buys entry and a separate activation fee unlocks the funded stage, so account size affects those fees rather than the risk percentages.",
          },
          {
            kind: "callout",
            tone: "info",
            title: "Not sure which size fits?",
            text: "Start with the size whose maximum loss you could absorb without changing how you trade. The evaluation fee is a service fee, not a deposit, and a larger size does not make an untested strategy safer.",
          },
        ],
      },
    ],
  };

  const addOns: Collection = {
    slug: "add-ons",
    code: "5",
    title: "Add Ons",
    summary: "The optional extras available at checkout and how they combine.",
    articles: [
      {
        slug: "available-add-ons",
        title: "Available Add-Ons",
        summary: "What each add-on does and what it costs.",
        section: "Add Ons",
        pending: true,
        body: [
          {
            kind: "table",
            head: ["Add-on", "What it does"],
            rows: [
              ["Profit Split Boost", "Raises your profit split on a funded account."],
              ["Bi-Weekly Payouts", "Moves your payout cycle to every 14 days, regardless of account type."],
              ["Drawdown Reset", "One free reset of your evaluation if you breach the Maximum Loss Rule."],
              ["No Time Limit", "Removes the Phase 1 / Phase 2 completion deadline, where one applies."],
              ["Double Size (BOGO)", "Doubles your account size for the same challenge fee."],
            ],
          },
          { kind: "h", text: "Choosing between them" },
          {
            kind: "ul",
            items: [
              "If you expect to pass quickly, the Profit Split Boost pays for itself over the life of the funded account.",
              "If your strategy trades in bursts, Bi-Weekly Payouts gets money out sooner without changing the rules.",
              "If you breach limits in drawdown rather than by missing targets, the Drawdown Reset is the only add-on that gives you a second attempt.",
              "Double Size is the most efficient way to trade a larger account if you are already comfortable with the evaluation format.",
            ],
          },
          {
            kind: "pending",
            label: "Add-on pricing",
            hint:
              "Publish the extra cost of each add-on, and the number of percentage points the Profit Split Boost adds. The cost column is intentionally omitted until those prices exist.",
          },
        ],
      },
      {
        slug: "how-add-ons-are-applied-and-combined",
        title: "How Add-Ons Are Applied & Combined",
        summary: "When an add-on takes effect and which ones can be used together.",
        section: "Add Ons",
        pending: true,
        body: [
          {
            kind: "p",
            text: "Add-ons purchased at checkout apply from the start of your Challenge Stage or Instant Direct account. Add-ons purchased after funding apply from your next trading day.",
          },
          { kind: "h", text: "Timing in practice" },
          {
            kind: "examples",
            items: [
              {
                title: "Bought at checkout",
                text: "The add-on is attached to the account before your first trade, so nothing has to be applied retroactively.",
              },
              {
                title: "Bought after funding",
                text: "The change starts from your next trading day, not from the moment of payment — a request made mid-session does not change the rules already in force that day.",
              },
            ],
          },
          {
            kind: "callout",
            tone: "info",
            title: "Ask before combining",
            text: "Some add-ons overlap, and a combination that looks sensible on paper can duplicate a benefit you are already paying for. Confirm the stack with support before checkout.",
          },
          {
            kind: "pending",
            label: "Combination rules",
            hint:
              "Confirm which add-ons can be combined on one account and which are mutually exclusive.",
          },
        ],
      },
    ],
  };

  const winningDays: Collection = {
    slug: "winning-days-requirement",
    code: "6",
    title: "Winning Days Requirement",
    summary: "What counts as a winning day and how many you need before your first payout.",
    articles: [
      {
        slug: "winning-days-requirement-explained",
        title: "Winning Days Requirement Explained",
        summary: "How a winning day is calculated and how many are required.",
        section: "Winning Days",
        pending: true,
        body: [
          {
            kind: "p",
            text: "A winning day is a trading day on which your account closes in profit relative to its balance at the start of that day. Only closed trades count — open floating profit does not.",
          },
          {
            kind: "kv",
            rows: [
              { label: "Minimum profit per winning day", value: null, hint: "Confirm the minimum net closed profit as a percentage of the day's starting balance." },
              { label: "Winning days before first payout", value: v(products.safe.minWinningDays), note: "Set per account category." },
              { label: "Consecutive requirement", value: "No", note: "Winning days do not need to be consecutive." },
            ],
          },
          { kind: "h", text: "How a day is counted" },
          {
            kind: "examples",
            items: [
              {
                title: "Closed in profit",
                text: "The account starts the day at $102,400 and ends at $102,900 with every position closed: that day counts, provided the gain clears the minimum threshold.",
              },
              {
                title: "Floating profit only",
                text: "The account shows $103,000 at midnight but the gain is still open. If it is not closed by the end of the day, the day does not count.",
              },
              {
                title: "Flat or slightly down",
                text: "A day that closes at or below its starting balance is not a winning day, even if it was profitable at some point during the session.",
              },
            ],
          },
          {
            kind: "p",
            text: "Winning days are a proof-of-consistency test, not a profitability test. Several ordinary green days satisfy the requirement; one enormous day does not, which is the entire point of counting days rather than profit.",
          },
          {
            kind: "callout",
            tone: "info",
            title: "The daily reset decides the boundary",
            text: "A day begins and ends at the daily reset time. A trade closed just after the reset belongs to the new day, so late-night admin can move a win into the wrong column.",
          },
          {
            kind: "pending",
            label: "Winning days requirement",
            hint:
              "Confirm the winning-day count per account category, the minimum profit per day, and whether the count resets after each payout or is a one-time requirement.",
          },
        ],
      },
    ],
  };

  return [passing, eligibility, sizes, addOns, winningDays];
}

/* ────────────────────────── export ────────────────────────── */

const categoryCollections = CATS.map(buildCategory);

const flexCollection: Collection = {
  slug: "flex",
  code: "1.7",
  title: "Flex",
  summary:
    "Flex is a one-phase evaluation with a small setup fee and a separate activation fee.",
  articles: flexArticles(),
};

const allCollections: Collection[] = [
  ...categoryCollections.slice(0, 6),
  flexCollection,
  ...crossCollections(),
];

/** Collection 1 groups every product under one heading. */
export const collections: Collection[] = allCollections;

export const collectionCount = collections.length;
export const articleCount = collections.reduce((n, c) => n + c.articles.length, 0);
export const pendingArticleCount = collections.reduce(
  (n, c) => n + c.articles.filter((a) => a.pending).length,
  0
);
