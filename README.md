# ForgeX Global — trading evaluation site

A responsive, single-page marketing site for **ForgeX Global**, a simulated
proprietary trading evaluation brand. Built with Next.js (App Router), React and
Tailwind CSS v4, with a bespoke ember-and-charcoal design system.

## Pages

| Route | Description |
| --- | --- |
| `/` | **ForgeX Global** homepage — hero, program selector, risk framework, dashboard preview, rewards, reviews, FAQ |
| `/start` | **Checkout** — program + size + payment method (card, crypto, bank), order confirmation and hand-off |
| `/portal` | **Member area** — funded dashboard preview: equity, progress, positions, payouts, account settings |
| `/support` | **Support** — contact form, email, response times, quick links and common questions |
| `/help` | **Help Center** — 94 articles across 12 collections, searchable, one page per article |
| `/help/[collection]` | A collection's articles grouped by section |
| `/help/[collection]/[article]` | A single article with sidebar, pager and inline pending markers |
| `/legal` | Terms, program rules, privacy, cookies, AML, refunds and risk disclosure |
| `/global4ex` | The previous GLOBAL4EX site, kept for reference (`noindex`) |
| `/sitemap.xml`, `/robots.txt` | Generated SEO routes |
| `/opengraph-image` | Generated 1200×630 social preview image |
| `/api/health` | Database health check |

## Help Center content

All Help Center copy lives in **`src/content/help-center/`** and is authored, not
scraped:

- `rules.ts` — every published figure in one place (targets, daily limits, max loss,
  splits, caps). Change a number here and every article updates.
- `articles.ts` — the 94 articles, built from per-product templates so the six
  product collections stay consistent.
- `types.ts` — the block model (`p`, `h`, `ul`, `ol`, `callout`, `table`, `formula`,
  `kv`, `examples`, `pending`).

Nothing in the content prints a raw placeholder. Where a value has not been
confirmed it renders as a `Pending` chip, and `docs/help-center/open-decisions.md`
lists exactly what is missing and which decisions are still open.

## Brand assets

The logo lockup (FG / bull monogram + “ForgeX Global” wordmark) and the animated
hero creatures are derived from the artwork supplied by the brand:

| Path | What it is |
| --- | --- |
| `public/brand/forgex-mark.png` | The FG monogram, transparent, cut from the source JPEG |
| `public/brand/forgex-word.png` | “ForgeX Global” wordmark, recoloured paper-white + ember for the dark UI |
| `public/brand/forgex-logo.png` | Full lockup in the original colours (for print / light backgrounds) |
| `src/app/icon.png` | App icon / favicon — monogram on the dark tile |
| `src/components/gfx/creature-paths.ts` | Bull and whale silhouettes as inline SVG paths |

Both `src/components/gfx/Logo.tsx` and the hero background read from those files,
so the mark is swapped in one place and every header/footer follows. The
creatures layer (`HeroCreatures.tsx`) is inert (`aria-hidden`, `pointer-events:
none`) and stops animating under `prefers-reduced-motion`.

Regenerate the assets from the source artwork with:

```bash
python3 art/logo.py  art/forgex-logo-source.jpeg   # needs pillow + numpy
python3 art/trace.py art/src-bull.png /tmp/bull.path
```

## Configuration

Brand, contact and outbound links live in **`src/config/site.ts`** and can be
overridden by environment variables. Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://globalforgex.com   # canonical origin (placeholder)
NEXT_PUBLIC_SUPPORT_EMAIL=support@globalforgex.com  # placeholder — set a monitored mailbox
NEXT_PUBLIC_CHECKOUT_URL=                       # optional checkout endpoint
NEXT_PUBLIC_LOGIN_URL=                          # optional member area
DATABASE_URL=postgresql://…                     # optional, used by /api/health
```

`DATABASE_URL` is **optional at build time** — the database connection is created
lazily, so the site builds and deploys on hosts that do not expose it. If it is
set, `/api/health` checks connectivity; if it is missing, the site serves normally
and the endpoint reports `{"database":"not-configured"}`.

### Before going live

1. Set `NEXT_PUBLIC_SITE_URL` to the real production URL. The current default
   (`globalforgex.com`) is a placeholder carried over from the old brand name.
2. Confirm `NEXT_PUBLIC_SUPPORT_EMAIL` is a mailbox you actually monitor — it is
   still on the old `globalforgex.com` domain.
3. Point `NEXT_PUBLIC_CHECKOUT_URL` at your checkout. **While it is unset,
   "Start evaluation" buttons open the on-site `/start` flow**, which shows the
   full selection and sends the request to the desk by email — rather than a
   dead link.
4. Add real profile URLs to `socials` in `src/config/site.ts`. Icons only render
   for networks that have a URL, so no dead social links ship.
5. Have the legal page reviewed by counsel in your jurisdiction — it is a
   working draft, and the page says so.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

> ForgeX Global is a simulated trading evaluation platform. Nothing on the site is
> financial advice, and all rewards shown are simulated and discretionary.
