import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/gfx/Logo";
import { Footer } from "@/components/gfx/Footer";
import { StartFlow } from "@/components/start/StartFlow";
import { siteConfig } from "@/config/site";
import { programById, sizeByKey } from "@/config/programs";
import { paymentMethodById, type PaymentMethodId } from "@/config/payments";

export const metadata: Metadata = {
  title: "Start an evaluation",
  description:
    "Choose a GlobalForgeX program and account size, review the rules and fee, and start your simulated trading evaluation.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start an evaluation | GlobalForgeX",
    description:
      "Choose a program and account size, review the rules and fee, and start your evaluation.",
    url: "/start",
    type: "website",
  },
};

type Search = { program?: string; size?: string; method?: string };

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const program = programById(params.program);
  const size = sizeByKey(params.size);
  const method = paymentMethodById(params.method);

  return (
    <div className="gfx" id="top">
      <header className="gfx-legal-header">
        <div className="gfx-container gfx-legal-header-inner">
          <Logo href="/" />
          <nav className="hc-topnav" aria-label="Checkout navigation">
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

      <main className="st-main">
        <div className="gfx-container">
          <div className="st-hero">
            <span className="gfx-eyebrow">Start an evaluation</span>
            <h1 className="gfx-h2">Pick your program. Prove your process.</h1>
            <p className="gfx-lede">
              Three programs, five account sizes, one one-time fee. Nothing renews and
              nothing is charged until you confirm.
            </p>
          </div>

          <StartFlow
            initialProgram={program.id}
            initialSize={size.key}
            initialMethod={method.id as PaymentMethodId}
            checkoutUrl={siteConfig.checkoutUrl ?? null}
            supportEmail={siteConfig.supportEmail}
            siteName={siteConfig.name}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
