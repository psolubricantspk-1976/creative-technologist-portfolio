/**
 * GlobalForgeX site configuration.
 *
 * This is the single place to update brand, contact and outbound links.
 * Values can be overridden with environment variables so the same build
 * can run against staging or production.
 *
 * ── Before going live ──────────────────────────────────────────────
 * 1. Set NEXT_PUBLIC_SITE_URL to the canonical production URL.
 * 2. Set NEXT_PUBLIC_SUPPORT_EMAIL to a mailbox you actually monitor.
 * 3. Set NEXT_PUBLIC_CHECKOUT_URL to your checkout / signup endpoint.
 *    While it is unset, "Start" buttons fall back to a pre-filled
 *    support email instead of a dead link.
 * 4. Set NEXT_PUBLIC_LOGIN_URL to your trader dashboard.
 * 5. Add real profile URLs to `socials` — icons are only rendered
 *    for networks that have a URL, so no dead links ship.
 * ───────────────────────────────────────────────────────────────────
 */

export type SocialNetwork = "x" | "instagram" | "discord" | "youtube";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const siteConfig = {
  name: "GlobalForgeX",
  tagline: "Forge your edge. Fund your ambition.",
  /** Canonical origin used for metadata, sitemap and robots. */
  url: trimTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://globalforgex.com"
  ),
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@globalforgex.com",
  /** Optional checkout endpoint. Empty string / undefined = email fallback. */
  checkoutUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL || undefined,
  /** Optional member dashboard. Falls back to the on-page platform section. */
  loginUrl: process.env.NEXT_PUBLIC_LOGIN_URL || undefined,
  /** Only networks listed here are rendered in the footer. */
  socials: [] as SocialLink[],
  legalUpdated: "2 November 2026",
};

type EmailOptions = {
  to?: string;
  subject?: string;
  body?: string;
};

/** Build a mailto: link with encoded subject and body. */
export function emailHref({ to, subject, body }: EmailOptions = {}) {
  const address = to ?? siteConfig.supportEmail;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();
  return `mailto:${address}${query ? `?${query}` : ""}`;
}

export const supportHref = emailHref({
  subject: "GlobalForgeX — question about the evaluation",
});

type StartDetails = {
  program: string;
  size: string;
  price: string;
};

/**
 * Destination for "Start evaluation" CTAs.
 * Uses the real checkout when configured, otherwise opens a pre-filled
 * support email so the button always does something useful.
 */
export function startHref({ program, size, price }: StartDetails) {
  if (siteConfig.checkoutUrl) {
    try {
      const url = new URL(siteConfig.checkoutUrl, siteConfig.url);
      url.searchParams.set("program", program.toLowerCase());
      url.searchParams.set("size", size.replace(/[^0-9k]/gi, "").toLowerCase());
      return url.toString();
    } catch {
      return siteConfig.checkoutUrl;
    }
  }

  return emailHref({
    subject: `Start ${program} evaluation — ${size} (${price})`,
    body: [
      `Hello ${siteConfig.name} team,`,
      "",
      `I would like to start the ${program} evaluation.`,
      "",
      `Program: ${program}`,
      `Account size: ${size} virtual capital`,
      `Evaluation fee: ${price}`,
      "",
      "Please send me the next steps.",
    ].join("\n"),
  });
}

/** Member login destination, with an on-page fallback. */
export const loginHref = siteConfig.loginUrl ?? "/#platform";
