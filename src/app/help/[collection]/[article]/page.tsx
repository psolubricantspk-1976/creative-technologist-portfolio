import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/help/Blocks";
import { supportHref } from "@/config/site";
import { articleHref, adjacent, allArticles, collections, getArticle } from "@/content/help-center";

type Params = { collection: string; article: string };

export function generateStaticParams(): Params[] {
  return collections.flatMap((collection) =>
    collection.articles.map((article) => ({
      collection: collection.slug,
      article: article.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { collection: collectionSlug, article: articleSlug } = await params;
  const ref = getArticle(collectionSlug, articleSlug);
  if (!ref) return {};

  const { collection, article } = ref;
  return {
    title: `${article.title} — Help Center`,
    description: article.summary,
    alternates: { canonical: `/help/${collection.slug}/${article.slug}` },
    openGraph: {
      title: `${article.title} | GlobalForgeX`,
      description: article.summary,
      url: `/help/${collection.slug}/${article.slug}`,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { collection: collectionSlug, article: articleSlug } = await params;
  const ref = getArticle(collectionSlug, articleSlug);
  if (!ref) notFound();

  const { collection, article } = ref;
  const { previous, next } = adjacent(collection.slug, article.slug);
  const position = allArticles().findIndex(
    (r) => r.collection.slug === collection.slug && r.article.slug === article.slug
  );

  return (
    <main className="hc-main">
      <div className="gfx-container">
        <nav className="hc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/help">Help Center</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/help/${collection.slug}`}>{collection.title}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{article.title}</span>
        </nav>

        <div className="hc-layout">
          <aside className="hc-sidebar" aria-label="Articles in this collection">
            <span className="hc-sidebar-title">{collection.title}</span>
            <nav>
              <ul className="hc-sidebar-list">
                {collection.articles.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={articleHref(collection, item)}
                      className={item.slug === article.slug ? "is-current" : undefined}
                      aria-current={item.slug === article.slug ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="hc-body">
            <header className="hc-article-head">
              <span className="hc-article-meta">
                {collection.title}
                <span aria-hidden="true">·</span>
                Article {position + 1} of {allArticles().length}
              </span>
              <h1>{article.title}</h1>
              <p>{article.summary}</p>
            </header>

            {article.pending && (
              <p className="hc-article-note">
                <span className="hc-chip hc-chip--pending">Pending</span>
                Figures marked pending are awaiting written confirmation and are not
                guessed. Everything else reflects published pricing or platform rules.
              </p>
            )}

            <Blocks blocks={article.body} />

            <nav className="hc-pager" aria-label="Article navigation">
              {previous ? (
                <Link href={previous.href} className="hc-pager-link">
                  <span>← Previous</span>
                  <b>{previous.article.title}</b>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={next.href} className="hc-pager-link hc-pager-link--next">
                  <span>Next →</span>
                  <b>{next.article.title}</b>
                </Link>
              ) : (
                <span />
              )}
            </nav>

            <div className="hc-article-help">
              <b>Still stuck?</b>
              <p>
                Ask before you trade. Support answers questions about rules, payouts and
                account sizes.
              </p>
              <a href={supportHref} className="gfx-btn gfx-btn--primary gfx-btn--sm">
                Email support
              </a>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
