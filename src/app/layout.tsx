import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import "./globalforgex.css";
import { siteConfig } from "@/config/site";

const description =
  "ForgeX Global is a simulated proprietary trading evaluation built for disciplined traders. Prove your edge across global markets and trade up to $200K in virtual capital with transparent rules and fast rewards.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description,
  applicationName: siteConfig.name,
  keywords: [
    "ForgeX Global",
    "prop firm",
    "trading evaluation",
    "funded trader",
    "simulated trading",
    "forex evaluation",
    "trading challenge",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      "A simulated trading evaluation built for disciplined traders. Transparent rules, up to $200K virtual capital, and rewards up to 92%.",
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      "A simulated trading evaluation built for disciplined traders. Up to $200K virtual capital and rewards up to 92%.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
