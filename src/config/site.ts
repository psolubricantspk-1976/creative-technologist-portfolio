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

import { PROGRAMS, SIZES, programById, sizeByKey } from "./programs";

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
  /** Program id ("forge") or display name ("Forge"). */
  program: string;
  /** Size key ("50k") or label ("$50K"). */
  size: string;
};

function resolveProgram(program: string) {
  const key = program.trim().toLowerCase();
  return (
    PROGRAMS.find((item) => item.id === key) ??
    PROGRAMS.find((item) => item.name.toLowerCase() === key) ??
    programById(key)
  );
}

function resolveSize(size: string) {
  const key = size.trim().toLowerCase();
  return (
    SIZES.find((item) => item.key === key) ??
    SIZES.find((item) => item.label.toLowerCase() === key) ??
    sizeByKey(key)
  );
}

/**
 * Destination for "Start evaluation" CTAs.
 *
 * When a checkout endpoint is configured the button goes straight there with
 * the program and size attached. Otherwise it opens the on-site /start flow,
 * which shows the full summary and hands the request to the desk by email —
 * no button is ever a dead link.
 */
export function startHref({ program, size }: StartDetails) {
  const picked = resolveProgram(program);
  const pickedSize = resolveSize(size);

  if (siteConfig.checkoutUrl) {
    try {
      const url = new URL(siteConfig.checkoutUrl, siteConfig.url);
      url.searchParams.set("program", picked.id);
      url.searchParams.set("size", pickedSize.key);
      return url.toString();
    } catch {
      return siteConfig.checkoutUrl;
    }
  }

  return `/start?program=${picked.id}&size=${pickedSize.key}`;
}

/** Direct checkout URL for a selection, or null when none is configured. */
export function checkoutHref(programId: string, sizeKey: string) {
  if (!siteConfig.checkoutUrl) return null;
  try {
    const url = new URL(siteConfig.checkoutUrl, siteConfig.url);
    url.searchParams.set("program", programId);
    url.searchParams.set("size", sizeKey);
    return url.toString();
  } catch {
    return siteConfig.checkoutUrl;
  }
}

/**
 * Member area destination. Uses the real dashboard when configured, otherwise
 * the on-site dashboard preview so the button always opens something.
 */
export const loginHref = siteConfig.loginUrl ?? "/portal";
