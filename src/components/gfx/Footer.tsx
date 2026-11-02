import Link from "next/link";
import { Logo } from "./Logo";
import {
  siteConfig,
  supportHref,
  type SocialNetwork,
} from "@/config/site";

function SocialIcon({ name }: { name: SocialNetwork }) {
  const shared = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  };

  switch (name) {
    case "x":
      return (
        <svg {...shared}>
          <path d="M17.7 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.9 21H1.7l7.5-8.6L1.2 3h6.6l4.5 5.6L17.7 3Zm-1.1 16.1h1.8L7.3 4.8H5.4l11.2 14.3Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "discord":
      return (
        <svg {...shared}>
          <path d="M19.3 5.6A16 16 0 0 0 15.4 4l-.2.5c1.5.4 2.8 1 4 1.8a13.7 13.7 0 0 0-12.4 0c1.2-.8 2.5-1.4 4-1.8L10.6 4a16 16 0 0 0-3.9 1.6C4.1 9.3 3.4 13 3.7 16.7a15 15 0 0 0 4.6 2.3l.9-1.4c-.8-.3-1.6-.7-2.3-1.2l.5-.4a10.7 10.7 0 0 0 9.2 0l.5.4c-.7.5-1.5.9-2.3 1.2l.9 1.4a15 15 0 0 0 4.6-2.3c.4-4.3-.7-8-3-11.1ZM9.4 14.6c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.2 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...shared}>
          <path d="M22 12s0-3.2-.4-4.7a2.4 2.4 0 0 0-1.7-1.7C18.4 5.2 12 5.2 12 5.2s-6.4 0-7.9.4a2.4 2.4 0 0 0-1.7 1.7C2 8.8 2 12 2 12s0 3.2.4 4.7a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.7.4-4.7Zm-12.1 3V9l5.4 3-5.4 3Z" />
        </svg>
      );
    default:
      return null;
  }
}

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Evaluation programs", href: "/#programs" },
      { label: "Risk framework", href: "/#rules" },
      { label: "Rewards", href: "/#rewards" },
      { label: "Command center", href: "/#platform" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "/#process" },
      { label: "Trader reviews", href: "/#reviews" },
      { label: "FAQ", href: "/#faq" },
      { label: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of service", href: "/legal#terms" },
      { label: "Privacy policy", href: "/legal#privacy" },
      { label: "AML policy", href: "/legal#aml" },
      { label: "Risk disclosure", href: "/legal#risk-disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="gfx-footer">
      <div className="gfx-container">
        <div className="gfx-footer-grid">
          <div className="gfx-footer-brand">
            <Logo />
            <p>
              A simulated trading evaluation built for traders who treat risk as a
              skill. Transparent rules, disciplined execution, rewards that respect
              the process.
            </p>

            <a className="gfx-footer-mail" href={supportHref}>
              <span className="gfx-footer-mail-ico" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m3.8 7 8.2 6 8.2-6" />
                </svg>
              </span>
              <span>
                <b>{siteConfig.supportEmail}</b>
                <small>Support · replies within one business day</small>
              </span>
            </a>

            {siteConfig.socials.length > 0 && (
              <div className="gfx-footer-social">
                {siteConfig.socials.map((social) => (
                  <a
                    key={social.network}
                    href={social.href}
                    className="gfx-social-btn"
                    aria-label={`${siteConfig.name} on ${social.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon name={social.network} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div className="gfx-footer-col" key={column.title}>
              <h4>{column.title}</h4>
              <div className="gfx-footer-links">
                {column.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gfx-footer-disclosure">
          <strong>Risk disclosure.</strong> {siteConfig.name} provides simulated
          trading evaluations for educational and assessment purposes only. All
          accounts referenced on this site are demo accounts; no live market
          execution takes place and no client funds are traded. Evaluation fees are
          service fees only and are not deposits or investments. Simulated rewards
          are discretionary, subject to program rules and not guaranteed. Trading
          involves substantial risk, and simulated or past performance does not
          indicate future results. {siteConfig.name} does not provide investment
          advice.
        </div>

        <div className="gfx-footer-bottom">
          <span>© 2026 {siteConfig.name}. All rights reserved.</span>
          <div className="gfx-footer-bottom-links">
            <Link href="/help">Help Center</Link>
            <Link href="/legal#terms">Terms</Link>
            <Link href="/legal#privacy">Privacy</Link>
            <Link href="/legal#cookies">Cookies</Link>
            <Link href="/#top">Back to top ↑</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
