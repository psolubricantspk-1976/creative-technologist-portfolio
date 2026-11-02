import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "GLOBAL4EX | Prove Your Skills. Trade with No Daily Loss Limit.",
  },
  description:
    "Improve your trading skills on our simulated platform and secure rewards. No daily loss limit. Up to $200K virtual capital.",
  // Archived reference site — kept reachable, kept out of search results.
  robots: { index: false, follow: false },
  alternates: { canonical: "/global4ex" },
  openGraph: {
    title: "GLOBAL4EX | Prove Your Skills. Trade with No Daily Loss Limit.",
    description:
      "Improve your trading skills on our simulated platform and secure rewards. No daily loss limit. Up to $200K virtual capital.",
    url: "/global4ex",
    siteName: "GLOBAL4EX",
  },
};

export default function Global4ExLayout({ children }: { children: ReactNode }) {
  return children;
}
