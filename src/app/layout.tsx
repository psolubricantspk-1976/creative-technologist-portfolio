import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLOBAL4EX | Prove Your Skills. Trade with No Daily Loss Limit.",
  description:
    "Improve your trading skills on our simulated platform and secure rewards. No daily loss limit. Up to $200K virtual capital.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
