import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/gfx/Footer";
import { Logo } from "@/components/gfx/Logo";
import { siteConfig, supportHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Legal & policies",
  description:
    "Terms of service, privacy policy, cookie policy, AML policy and risk disclosure for ForgeX Global simulated trading evaluations.",
  alternates: { canonical: "/legal" },
  openGraph: {
    title: "Legal & policies | ForgeX Global",
    description:
      "Terms of service, privacy, cookies, AML and risk disclosure for ForgeX Global.",
    url: "/legal",
    type: "article",
  },
};

type Section = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets?: string[];
};

const SECTIONS: Section[] = [
  {
    id: "terms",
    title: "Terms of service",
    summary: "The agreement between you and ForgeX Global.",
    paragraphs: [
      `By purchasing or using a ${siteConfig.name} evaluation you agree to these terms. ${siteConfig.name} provides access to simulated trading environments for assessment and educational purposes. We are not a broker, dealer, investment adviser or custodian, and we do not execute orders in any live market.`,
      "Evaluation fees are one-time service fees that purchase access to a demo environment and to our assessment tooling. They are not deposits, subscriptions to capital, or investments, and they do not create any ownership interest in an account, fund or strategy.",
    ],
    bullets: [
      "You must be at least 18 years old and legally able to enter a contract in your jurisdiction.",
      "One person may hold one evaluation account per program tier unless we approve otherwise in writing.",
      "Accounts are personal. Sharing credentials, copying trades between accounts, or trading on behalf of another person is not permitted.",
      "We may decline, suspend or close an account where we reasonably believe these terms have been breached.",
    ],
  },
  {
    id: "program-rules",
    title: "Program rules & simulated rewards",
    summary: "How objectives, limits and rewards are assessed.",
    paragraphs: [
      "Each program publishes its own profit target, daily loss limit, maximum loss limit and minimum trading days. Those figures, as displayed in the program selector at the time of purchase, form part of these terms.",
      "Simulated rewards are discretionary. Meeting an objective makes you eligible to request a reward; it does not create a contractual entitlement to payment. Every request is reviewed against the published rules, including the consistency check, before it is approved.",
      "Maximum loss limits are static and measured from the starting balance of the account. They do not trail your peak equity. Daily limits reset at 00:00 UTC.",
    ],
    bullets: [
      "Breaching the daily loss limit pauses the account until the next daily reset.",
      "Breaching the maximum loss limit ends the evaluation and the account is closed.",
      "There is no time limit to reach a profit target on any program.",
      "Reward splits range from 80% to 92% depending on program and are shown before purchase.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy policy",
    summary: "What we collect, why, and how long we keep it.",
    paragraphs: [
      `We collect the information you give us when you create an account or contact support — typically your name, email address, country and payment confirmation details — and limited technical information such as IP address, device and browser type.`,
      "We use this information to provide and secure the evaluation service, verify identity where required, respond to support requests, meet legal and accounting obligations, and improve the product. We do not sell personal data.",
      "Payment card details are handled by our payment processor and are never stored on our servers. Data is retained only as long as needed for the purposes above or as required by law, after which it is deleted or anonymised.",
    ],
    bullets: [
      "You can request a copy of your personal data, or its correction or deletion, by emailing our support address.",
      "We use processors for payments, email delivery and hosting; each is bound by a data-processing agreement.",
      "Where we rely on consent, you can withdraw it at any time without affecting prior processing.",
    ],
  },
  {
    id: "cookies",
    title: "Cookie policy",
    summary: "The small set of cookies this site uses.",
    paragraphs: [
      "This site uses a minimal cookie footprint. Strictly necessary cookies keep your session secure and remember preferences such as cookie consent. Analytics cookies, where enabled, help us understand aggregate page usage so we can improve the product.",
      "We do not use cookies to build advertising profiles or to track you across other websites. You can block or delete cookies in your browser settings; strictly necessary cookies are required for the site to function correctly.",
    ],
  },
  {
    id: "aml",
    title: "Anti-money laundering (AML) policy",
    summary: "Identity checks and screening.",
    paragraphs: [
      `${siteConfig.name} is a simulated evaluation platform, and evaluation fees are service fees rather than client funds. Even so, we apply proportionate anti-money-laundering controls to protect the platform and the payment system.`,
      "Before a simulated reward is approved, we may ask you to verify your identity — typically a government-issued photo ID and a proof of address — and to confirm that the payment method used belongs to you. We screen against sanctions and politically-exposed-person lists where required.",
    ],
    bullets: [
      "We may refuse, suspend or reverse a transaction where verification cannot be completed.",
      "We report suspicious activity to the relevant authorities where we are legally required to do so.",
      "We keep verification records for the period required by applicable law.",
    ],
  },
  {
    id: "refunds",
    title: "Refunds & cancellations",
    summary: "When an evaluation fee can be returned.",
    paragraphs: [
      "Evaluation fees purchase immediate access to a simulated account and dashboard. Because access is delivered instantly, fees are generally non-refundable once the account has been issued and traded.",
      "If you were charged in error, charged twice, or the account was never delivered, contact support within 14 days of purchase and we will investigate and refund where appropriate. Nothing in this section limits any statutory rights you may have in your jurisdiction.",
    ],
  },
  {
    id: "risk-disclosure",
    title: "Risk disclosure",
    summary: "Read this before you pay an evaluation fee.",
    paragraphs: [
      `All trading on ${siteConfig.name} is simulated. No orders are routed to a live market, no client capital is at risk, and no account on this platform is a live brokerage account. Nothing on this site is investment advice, a recommendation, or an offer to buy or sell any financial instrument.`,
      "Trading real financial instruments involves substantial risk and can result in losses exceeding your deposit. Past performance — and performance in a simulated environment — does not indicate future results. Simulated results can overstate the results a trader would achieve with real capital, because they do not reflect slippage, liquidity constraints or the psychological pressure of trading live funds.",
      "Only pay an evaluation fee if you can afford to lose it, and never treat an evaluation as an investment product.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    summary: "How to reach us about any of the above.",
    paragraphs: [
      `Questions about these policies, a data request, or a compliance matter can be sent to ${siteConfig.supportEmail}. We aim to reply within one business day. Please include the email address used at purchase so we can locate your account.`,
    ],
  },
];

export default function LegalPage() {
  return (
    <div className="gfx" id="top">
      <header className="gfx-legal-header">
        <div className="gfx-container gfx-legal-header-inner">
          <Logo href="/" />
          <Link href="/" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>
            Back to site
          </Link>
        </div>
      </header>

      <main className="gfx-legal">
        <div className="gfx-container">
          <div className="gfx-legal-hero">
            <span className="gfx-eyebrow">Legal &amp; policies</span>
            <h1 className="gfx-h2">The fine print, in plain language.</h1>
            <p className="gfx-lede">
              Terms, privacy, cookies, AML and the risk disclosure for{" "}
              {siteConfig.name} evaluations. Written to be readable — no
              eight-point type.
            </p>
            <p className="gfx-legal-updated">
              Last updated {siteConfig.legalUpdated}
            </p>
          </div>

          <div className="gfx-legal-notice" role="note">
            <strong>Draft for review.</strong> This policy set is a working draft
            prepared for a simulated evaluation platform. Have it reviewed by
            qualified counsel in the jurisdiction you operate from before accepting
            live payments.
          </div>

          <div className="gfx-legal-layout">
            <nav className="gfx-legal-toc" aria-label="On this page">
              <span>On this page</span>
              <ol>
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="gfx-legal-body">
              {SECTIONS.map((section) => (
                <section
                  className="gfx-legal-section"
                  id={section.id}
                  key={section.id}
                >
                  <h2>{section.title}</h2>
                  <p className="gfx-legal-summary">{section.summary}</p>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet.slice(0, 40)}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.id === "contact" && (
                    <a href={supportHref} className="gfx-btn gfx-btn--primary gfx-btn--sm">
                      Email {siteConfig.supportEmail}
                    </a>
                  )}
                </section>
              ))}

              <div className="gfx-legal-footer-nav">
                <Link href="/" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
                  Back to homepage
                </Link>
                <a href="#top" className="gfx-btn gfx-btn--ghost gfx-btn--sm">
                  Back to top ↑
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
