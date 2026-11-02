/**
 * Every factual value used across the Help Center lives here.
 *
 * Source of values
 * ────────────────
 * "published"  → taken from the live GlobalForgeX site or the archived
 *                GLOBAL4EX site (which uses the same Safe / Pro / Instant
 *                Direct / Flex product taxonomy as the help-centre spec).
 * "pending"    → not stated anywhere yet. Rendered in the UI as a clearly
 *                marked "Pending confirmation" chip instead of inventing a
 *                number. Update the value here and the chip disappears
 *                everywhere at once.
 */

export type RuleValue = {
  /** The published value, or null when nothing has been confirmed. */
  value: string | null;
  /** Extra context shown next to the value. */
  note?: string;
  /** What the team needs to decide when `value` is null. */
  hint?: string;
};

export function rule(value: string | null, note?: string, hint?: string): RuleValue {
  return { value, note, hint };
}

const TBD = (hint: string): RuleValue => ({ value: null, hint });

/** Fixed platform-wide settings that are already published on the site. */
export const platform = {
  company: "GlobalForgeX",
  /** Daily reset — the live site states limits reset at 00:00 UTC. */
  dailyReset: rule("00:00 UTC", "Dashboard time is the sole reference."),
  /** Funded consistency check — live site rules section. */
  fundedConsistency: rule("40%", "No single day may exceed 40% of total profit."),
  /** Live site: "News trading allowed" on every program. */
  newsTrading: rule("Allowed", "During evaluation and on funded accounts."),
  /** Live site: "Weekend holding allowed". */
  weekendHolding: rule("Allowed", "Positions may be held across the weekend."),
  /** Live site: scaling plan up to $2M. */
  scaling: rule("Up to $2M"),
  /** Live site reviews section. */
  supportHours: rule("7 days a week"),
};

/** Per-product figures. */
export type ProductValues = {
  /** Profit target for phase 1 (challenge products). */
  phase1Target: RuleValue;
  /** Profit target for phase 2, where the product has two phases. */
  phase2Target: RuleValue;
  /** Daily loss limit / daily pause. */
  daily: RuleValue;
  /** Overall loss limit. */
  maxLoss: RuleValue;
  /** Reward / profit split at the funded stage. */
  split: RuleValue;
  /** Maximum withdrawal per payout period. */
  withdrawalCap: RuleValue;
  /** Minimum trading days before payout. */
  minWinningDays: RuleValue;
  /** Leverage by asset class. */
  leverage: RuleValue;
  /** Minimum time a trade must stay open. */
  minHoldTime: RuleValue;
  /** Days of inactivity before an account is actioned. */
  inactivityDays: RuleValue;
};

/**
 * Values come from the product tables on the site:
 *   Safe     → 10% target, no daily loss limit, 10% static max loss, 80% split
 *   Pro      → 8% target, 5% daily, 10% static max loss, 85% split
 *   Instant  → no target, 5% daily, 10% static max loss, 80% split
 *   Flex     → 4% target, 4% daily, 8% max loss, 85% split
 */
export const products: Record<
  | "safe"
  | "pro"
  | "instant"
  | "flex",
  ProductValues
> = {
  safe: {
    phase1Target: rule("10%", "Phase 1 and Phase 2 use the published Safe Mode target."),
    phase2Target: rule("10%"),
    daily: rule(
      "No daily loss limit",
      "Safe Mode is sold as the mode with no daily loss limit."
    ),
    maxLoss: rule("10%", "Static — measured from the starting balance."),
    split: rule("80%"),
    withdrawalCap: TBD(
      "Confirm the maximum withdrawal per payout period for Safe Mode funded accounts."
    ),
    minWinningDays: rule("None"),
    leverage: TBD("Confirm maximum leverage per asset class for Safe Mode."),
    minHoldTime: TBD("Confirm the minimum hold time used to flag tick scalping."),
    inactivityDays: TBD("Confirm the inactivity period in days before suspension."),
  },
  pro: {
    phase1Target: rule("8%"),
    phase2Target: rule("5%"),
    daily: rule("5%"),
    maxLoss: rule("10%", "Static — measured from the starting balance."),
    split: rule("85%"),
    withdrawalCap: TBD(
      "Confirm the maximum withdrawal per payout period for Pro Mode funded accounts."
    ),
    minWinningDays: rule("None"),
    leverage: TBD("Confirm maximum leverage per asset class for Pro Mode."),
    minHoldTime: TBD("Confirm the minimum hold time used to flag tick scalping."),
    inactivityDays: TBD("Confirm the inactivity period in days before suspension."),
  },
  instant: {
    phase1Target: rule("Not applicable", "Instant Direct skips the evaluation stage."),
    phase2Target: rule("Not applicable"),
    daily: rule("5%"),
    maxLoss: rule("10%", "Static — measured from the starting balance."),
    split: rule("80%"),
    withdrawalCap: TBD(
      "Confirm the maximum withdrawal per payout period for Instant Direct accounts."
    ),
    minWinningDays: rule("None"),
    leverage: TBD("Confirm maximum leverage per asset class for Instant Direct."),
    minHoldTime: TBD("Confirm the minimum hold time used to flag tick scalping."),
    inactivityDays: TBD("Confirm the inactivity period in days before suspension."),
  },
  flex: {
    phase1Target: rule("4%"),
    phase2Target: rule("Not applicable", "Flex is a one-phase evaluation."),
    daily: rule("4%"),
    maxLoss: rule("8%", "Measured from your starting balance."),
    split: rule("85%"),
    withdrawalCap: TBD("Confirm the per-payout withdrawal cap for Flex funded accounts."),
    minWinningDays: rule("None", "Flex requires profitable days before payout; confirm the count."),
    leverage: TBD("Confirm maximum leverage per asset class for Flex."),
    minHoldTime: TBD("Confirm the Flex minimum hold time before a trade is flagged."),
    inactivityDays: TBD("Confirm the inactivity period in days before suspension."),
  },
};

/** Flex-specific figures described in the spec but not yet published. */
export const flex = {
  setupFee: TBD("Confirm the Flex setup fee (the £/$ amount shown at checkout)."),
  activationFee: TBD("Confirm the Flex activation fee and how it scales by account size."),
  activationWindow: TBD("Confirm how many hours a trader has to pay the activation fee after passing."),
  trailingLockAt: TBD(
    "Confirm the profit level at which the Flex drawdown floor locks to the starting balance."
  ),
  floatingLossCap: TBD("Confirm the Flex funded floating-loss cap percentage."),
  consistencyThreshold: TBD("Confirm the funded-stage consistency threshold for Flex payouts."),
  newsWindow: TBD("Confirm the minutes before and after red-folder news when trading is restricted."),
  minWithdrawal: TBD("Confirm the minimum withdrawal request amount."),
  payoutProcessing: TBD("Confirm payout processing time and the late-payment uplift."),
};

/**
 * Conflicts between the spec and the live site that a human must settle.
 * Surfaced on the Help Center index so they are not lost.
 */
export const openDecisions = [
  "The spec names the five products Safe Mode, Pro Mode, Instant Direct Lite, Instant Direct Pro and Flex. The GlobalForgeX homepage sells Spark, Forge and Apex. The two taxonomies currently disagree.",
  "Safe Mode is marketed as having no daily loss limit, but the spec gives every product a Maximum Daily Pause. Confirm whether Safe Mode keeps an unlimited daily loss.",
  "The spec asks whether a maximum daily breach closes the account or only pauses trading until the next day. Safe Mode is titled “Pause”, Pro Mode “Drawdown” — confirm the behaviour for each.",
  "The spec describes the Flex maximum drawdown as trailing and locking at the starting balance; the site lists it as static at 8%. Confirm which applies.",
  "Leverage, withdrawal caps, inactivity periods, minimum hold times, reset and fee-return policy and add-on pricing appear nowhere on the site and need real values.",
];
