import type { Metadata } from "next";
import Link from "next/link";
import { HelpSearch } from "@/components/help/Search";
import {
  articleCount,
  articlesByCollection,
  collectionCount,
  collections,
  pendingArticleCount,
  searchIndex,
} from "@/content/help-center";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Rules, requirements and payout guidance for ForgeX Global Safe Mode, Pro Mode, Instant Direct and Flex accounts.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help Center | ForgeX Global",
    description:
      "Rules, requirements and payout guidance for ForgeX Global accounts.",
    url: "/help",
    type: "article",
  },
};

export default function HelpIndexPage() {
  return (
    <main className="hc-main">
      <div className="gfx-container">
        <div className="hc-hero">
          <span className="gfx-eyebrow">Help Center</span>
          <h1 className="gfx-h2">Every rule, in one place.</h1>
          <p className="gfx-lede">
            {articleCount} articles across {collectionCount} collections covering
            trading rules, payout eligibility, account sizes and add-ons for every
            ForgeX Global product.
          </p>
          <div className="hc-hero-meta">
            <span>{articleCount} articles</span>
            <span aria-hidden="true">·</span>
            <span>{collectionCount} collections</span>
            <span aria-hidden="true">·</span>
            <span>Updated 2 November 2026</span>
          </div>
        </div>

        <HelpSearch index={searchIndex} />

        <p className="hc-hero-note">
          {pendingArticleCount > 0 ? (
            <>
              Articles are written to published rules. Where a figure is not
              confirmed it says <b>pending</b> instead of guessing — ask support to
              confirm it before you trade on it.
            </>
          ) : (
            <>Every article reflects the currently published rules.</>
          )}
        </p>

        <section aria-labelledby="hc-collections-title">
          <div className="hc-section-head">
            <h2 id="hc-collections-title" className="hc-h2">
              Browse by collection
            </h2>
          </div>

          <div className="hc-collections">
            {collections.map((collection) => {
              return (
                <Link
                  key={collection.slug}
                  href={`/help/${collection.slug}`}
                  className="hc-collection-card"
                >
                  <span className="hc-collection-code">
                    {collection.code ? `Collection ${collection.code}` : "Collection"}
                  </span>
                  <h3>{collection.title}</h3>
                  <p>{collection.summary}</p>
                  <span className="hc-collection-foot">
                    <span className="hc-collection-count">
                      {collection.articles.length}{" "}
                      {collection.articles.length === 1 ? "article" : "articles"}
                    </span>
                    <span className="hc-collection-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="hc-all" aria-labelledby="hc-all-title">
          <div className="hc-section-head">
            <h2 id="hc-all-title" className="hc-h2">
              All {articleCount} articles
            </h2>
            <p className="hc-section-note">
              Grouped by collection. Figures marked pending inside an article are
              awaiting written confirmation.
            </p>
          </div>

          <div className="hc-all-grid">
            {articlesByCollection.map(({ collection, articles }) => (
              <div className="hc-all-group" key={collection.slug}>
                <h3>
                  <Link href={`/help/${collection.slug}`}>{collection.title}</Link>
                </h3>
                <ul>
                  {articles.map(({ article, href }) => (
                    <li key={href}>
                      <Link href={href}>{article.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
