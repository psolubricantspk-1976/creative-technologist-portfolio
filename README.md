# GlobalForgeX — trading evaluation site

A responsive, single-page marketing site for **GlobalForgeX**, a simulated
proprietary trading evaluation brand. Built with Next.js (App Router), React and
Tailwind CSS v4, with a bespoke ember-and-charcoal design system.

## Pages

| Route | Description |
| --- | --- |
| `/` | **GlobalForgeX** homepage — hero, program selector, risk framework, dashboard preview, rewards, reviews, FAQ |
| `/start` | **Start an evaluation** — program + size picker with live fee, rules summary and checkout hand-off |
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

## Configuration

Brand, contact and outbound links live in **`src/config/site.ts`** and can be
overridden by environment variables. Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://globalforgex.com   # canonical origin
NEXT_PUBLIC_SUPPORT_EMAIL=support@globalforgex.com
NEXT_PUBLIC_CHECKOUT_URL=                       # optional checkout endpoint
NEXT_PUBLIC_LOGIN_URL=                          # optional member area
DATABASE_URL=postgresql://…                     # optional, used by /api/health
```

`DATABASE_URL` is **optional at build time** — the database connection is created
lazily, so the site builds and deploys on hosts that do not expose it. If it is
set, `/api/health` checks connectivity; if it is missing, the site serves normally
and the endpoint reports `{"database":"not-configured"}`.

### Before going live

1. Set `NEXT_PUBLIC_SITE_URL` to the real production URL.
2. Confirm `NEXT_PUBLIC_SUPPORT_EMAIL` is a mailbox you actually monitor.
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

> GlobalForgeX is a simulated trading evaluation platform. Nothing on the site is
> financial advice, and all rewards shown are simulated and discretionary.
