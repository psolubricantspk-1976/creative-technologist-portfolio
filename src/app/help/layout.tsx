import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/gfx/Logo";
import { Footer } from "@/components/gfx/Footer";

export default function HelpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gfx" id="top">
      <header className="gfx-legal-header">
        <div className="gfx-container gfx-legal-header-inner">
          <Logo href="/" />
          <nav className="hc-topnav" aria-label="Help centre navigation">
            <Link href="/help" className="hc-topnav-link">
              Help Center
            </Link>
            <Link href="/support" className="hc-topnav-link">
              Support
            </Link>
            <Link href="/legal" className="hc-topnav-link">
              Legal
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

      {children}

      <Footer />
    </div>
  );
}
