"use client";

import { useEffect } from "react";

/**
 * Adds a subtle scroll-in reveal to any `.gfx [data-reveal]` element.
 * Elements stay fully visible when JavaScript or IntersectionObserver
 * is unavailable, and animations are disabled by prefers-reduced-motion.
 */
export function Reveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".gfx [data-reveal]")
    );

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
}
