import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import "./globalforgex.css";

export const metadata: Metadata = {
  title: {
    default: "GlobalForgeX | Forge Your Edge. Fund Your Ambition.",
    template: "%s | GlobalForgeX",
  },
  description:
    "GlobalForgeX is a simulated proprietary trading evaluation built for disciplined traders. Prove your edge across global markets and trade up to $200K in virtual capital with transparent rules and fast rewards.",
  keywords: [
    "GlobalForgeX",
    "prop firm",
    "trading evaluation",
    "funded trader",
    "simulated trading",
    "forex evaluation",
    "trading challenge",
  ],
  openGraph: {
    title: "GlobalForgeX | Forge Your Edge. Fund Your Ambition.",
    description:
      "A simulated trading evaluation built for disciplined traders. Transparent rules, up to $200K virtual capital, and rewards up to 92%.",
    type: "website",
    siteName: "GlobalForgeX",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalForgeX | Forge Your Edge. Fund Your Ambition.",
    description:
      "A simulated trading evaluation built for disciplined traders. Up to $200K virtual capital and rewards up to 92%.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
