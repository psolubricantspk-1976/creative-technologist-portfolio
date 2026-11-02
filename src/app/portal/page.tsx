import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/gfx/Logo";
import { Footer } from "@/components/gfx/Footer";
import { PortalDashboard } from "@/components/portal/PortalDashboard";

export const metadata: Metadata = {
  title: "Member area",
  description:
    "The GlobalForgeX member area: equity, progress to target, open positions, payout requests and account settings for a funded account.",
  alternates: { canonical: "/portal" },
  openGraph: {
    title: "Member area | GlobalForgeX",
    description:
      "Equity, progress, positions and payouts for a funded GlobalForgeX account.",
    url: "/portal",
    type: "website",
  },
};

export default function PortalPage() {
  return (
    <div className="gfx" id="top">
      <header className="gfx-legal-header">
        <div className="gfx-container gfx-legal-header-inner">
          <Logo href="/" />
          <nav className="hc-topnav" aria-label="Member navigation">
            <Link href="/help" className="hc-topnav-link">
              Help Center
            </Link>
            <Link href="/support" className="hc-topnav-link">
              Support
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

      <main className="pf-main">
        <div className="gfx-container">
          <PortalDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
