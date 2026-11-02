# GlobalForgeX — trading evaluation site

A responsive, single-page marketing site for **GlobalForgeX**, a simulated
proprietary trading evaluation brand. Built with Next.js (App Router), React and
Tailwind CSS v4, with a bespoke ember-and-charcoal design system.

## Pages

| Route | Description |
| --- | --- |
| `/` | **GlobalForgeX** — new homepage (hero, program selector, risk framework, dashboard preview, rewards, reviews, FAQ) |
| `/global4ex` | The previous GLOBAL4EX site, kept intact for reference |
| `/api/health` | Database health check |

## Highlights

- Interactive evaluation selector (program × account size) with live pricing and objectives
- Animated equity charts, market ticker and scroll-reveal sections
- Sticky navigation with a mobile menu, plus accessible FAQ accordions
- Fully responsive from 360 px to ultrawide, with `prefers-reduced-motion` support
- Self-hosted variable fonts (Space Grotesk + Inter) — no runtime font requests

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

> GlobalForgeX is a simulated trading evaluation platform. Nothing on the site is
> financial advice, and all rewards shown are simulated and discretionary.
