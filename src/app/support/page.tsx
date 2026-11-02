import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/gfx/Logo";
import { Footer } from "@/components/gfx/Footer";
import { SupportForm } from "@/components/support/SupportForm";
import { siteConfig, supportHref } from "@/config/site";
import { collections } from "@/content/help-center";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Contact the GlobalForgeX desk about an evaluation, an account, a payout or a payment. Email support, browse the Help Center, or check the most common questions.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support | GlobalForgeX",
    description:
      "Contact the desk about an evaluation, account, payout or payment.",
    url: "/support",
    type: "website",
  },
};

const QUICK = [
  { label: "Help Center", href: "/help", note: "94 articles on rules, payouts and accounts" },
  { label: "Start an evaluation", href: "/start", note: "Programs, sizes and payment methods" },
  { label: "Risk disclosure", href: "/legal#risk-disclosure", note: "How simulated trading works" },
  { label: "Member area", href: "/portal", note: "Preview the funded dashboard" },
];

const FAQS = [
  {
    q: "How quickly will I get a reply?",
    a: "Most messages are answered within one business day, and payout or login issues are treated as priority. Include your order reference so the desk can pull the account without a round trip.",
  },
  {
    q: "Can you reset my account?",
    a: "Resets depend on the product and the reason for the breach. Send the account reference and the date of the breach and support will confirm whether a reset or a new evaluation applies.",
  },
  {
    q: "Where are the trading rules?",
    a: "Every rule is published in the Help Center, split by product and stage. Those articles are the same rules the desk applies — there is no separate internal version.",
  },
  {
    q: "I have not received my credentials.",
    a: "Credentials are sent to the email used at checkout. Check the spam folder, then send support the order reference and the exact email address so the account can be re-issued.",
  },
];

export default function SupportPage() {
  return (
    <div className="gfx" id="top">
      <header className="gfx-legal-header">
        <div className="gfx-container gfx-legal-header-inner">
          <Logo href="/" />
          <nav className="hc-topnav" aria-label="Support navigation">
            <Link href="/help" className="hc-topnav-link">
              Help Center
            </Link>
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
          </nav>
        </div>
      </header>

      <main className="sup-main">
        <div className="gfx-container">
          <div className="sup-hero">
            <span className="gfx-eyebrow">Support</span>
            <h1 className="gfx-h2">Talk to a human.</h1>
            <p className="gfx-lede">
              Questions about a rule, a payment or your account go straight to the desk —
              not a ticket queue. Most messages are answered within one business day.
            </p>
          </div>

          <div className="sup-grid">
            <div>
              <h2 className="sup-h2">Send a message</h2>
              <SupportForm supportEmail={siteConfig.supportEmail} siteName={siteConfig.name} />
            </div>

            <aside className="sup-side">
              <div className="sup-card">
                <span className="sup-card-label">Email us directly</span>
                <a href={supportHref} className="sup-mail">
                  {siteConfig.supportEmail}
                </a>
                <p>Seven days a week. Payout and login issues are prioritised.</p>
              </div>

              <div className="sup-card">
                <span className="sup-card-label">Before you write</span>
                <ul>
                  <li>Include your order or account reference.</li>
                  <li>Name the product and stage (for example Pro Mode, Phase 2).</li>
                  <li>Attach the trade ID for a specific fill.</li>
                  <li>Never send your trading password.</li>
                </ul>
              </div>

              <div className="sup-card">
                <span className="sup-card-label">Fast answers</span>
                <div className="sup-quick">
                  {QUICK.map((item) => (
                    <Link key={item.href} href={item.href} className="sup-quick-item">
                      <b>{item.label}</b>
                      <span>{item.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <section className="sup-browse" aria-labelledby="sup-browse-title">
            <h2 id="sup-browse-title" className="sup-h2">
              Browse by product
            </h2>
            <div className="sup-collections">
              {collections.map((collection) => (
                <Link key={collection.slug} href={`/help/${collection.slug}`} className="sup-collection">
                  <b>{collection.title}</b>
                  <span>
                    {collection.articles.length}{" "}
                    {collection.articles.length === 1 ? "article" : "articles"}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="sup-faq" aria-labelledby="sup-faq-title">
            <h2 id="sup-faq-title" className="sup-h2">
              Common questions
            </h2>
            <div className="sup-faq-list">
              {FAQS.map((faq) => (
                <details key={faq.q} className="sup-faq-item">
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
