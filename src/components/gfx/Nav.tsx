"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { loginHref, startHref } from "@/config/site";

const LINKS = [
  { label: "Programs", href: "#programs" },
  { label: "Rules", href: "#rules" },
  { label: "Rewards", href: "#rewards" },
  { label: "FAQ", href: "#faq" },
  { label: "Help Center", href: "/help" },
];

function ArrowUpRight({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`gfx-nav-wrap${scrolled ? " is-scrolled" : ""}`}>
      <div className="gfx-container">
        <nav className="gfx-nav" aria-label="Primary">
          <Logo />

          <div className="gfx-nav-links">
            {LINKS.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} href={link.href} className="gfx-nav-link">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className="gfx-nav-link">
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="gfx-nav-actions">
            <a href={loginHref} className="gfx-nav-signin">
              Member area
            </a>
            <a
              href={startHref({ program: "Forge", size: "$50K", price: "$269" })}
              className="gfx-nav-cta"
            >
              Start evaluation
              <span aria-hidden="true">
                <ArrowUpRight size={12} />
              </span>
            </a>
          </div>

          <button
            type="button"
            className="gfx-burger"
            aria-expanded={open}
            aria-controls="gfx-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6 6 18" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      <div id="gfx-mobile-menu" className={`gfx-mobile${open ? " is-open" : ""}`}>
        <div className="gfx-mobile-inner">
          {LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="gfx-mobile-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="gfx-mobile-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            )
          )}
          <div className="gfx-mobile-ctas">
            <a
              href={loginHref}
              className="gfx-btn gfx-btn--ghost gfx-btn--sm"
              onClick={() => setOpen(false)}
            >
              Member area
            </a>
            <a href="#programs" className="gfx-btn gfx-btn--primary gfx-btn--sm" onClick={() => setOpen(false)}>
              Start evaluation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
