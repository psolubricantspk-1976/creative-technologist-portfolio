import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articleHref,
  collections,
  getCollection,
} from "@/content/help-center";

type Params = { collection: string };

export function generateStaticParams(): Params[] {
  return collections.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};

  return {
    title: `${collection.title} — Help Center`,
    description: collection.summary,
    alternates: { canonical: `/help/${collection.slug}` },
    openGraph: {
      title: `${collection.title} | GlobalForgeX Help Center`,
      description: collection.summary,
      url: `/help/${collection.slug}`,
      type: "article",
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const sections = Array.from(new Set(collection.articles.map((a) => a.section)));

  return (
    <main className="hc-main">
      <div className="gfx-container">
        <nav className="hc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/help">Help Center</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{collection.title}</span>
        </nav>

        <div className="hc-collection-hero">
          <span className="hc-collection-code">
            {collection.code ? `Collection ${collection.code}` : "Collection"}
          </span>
          <h1 className="gfx-h2">{collection.title}</h1>
          <p className="gfx-lede">{collection.summary}</p>
          <div className="hc-hero-meta">
            <span>{collection.articles.length} articles</span>
          </div>
        </div>

        <div className="hc-layout">
          <aside className="hc-sidebar" aria-label="On this page">
            <span className="hc-sidebar-title">On this page</span>
            <nav>
              {sections.map((section) => (
                <div className="hc-sidebar-group" key={section}>
                  <span className="hc-sidebar-section">{section}</span>
                  <ul>
                    {collection.articles
                      .filter((a) => a.section === section)
                      .map((article) => (
                        <li key={article.slug}>
                          <Link href={articleHref(collection, article)}>
                            {article.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="hc-sidebar-switch">
              <span className="hc-sidebar-title">Other collections</span>
              <ul>
                {collections
                  .filter((c) => c.slug !== collection.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link href={`/help/${c.slug}`}>{c.title}</Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <div className="hc-body">
            {sections.map((section) => (
              <section className="hc-group" key={section}>
                <h2 className="hc-group-title">{section}</h2>
                <div className="hc-article-cards">
                  {collection.articles
                    .filter((a) => a.section === section)
                    .map((article) => (
                      <Link
                        key={article.slug}
                        href={articleHref(collection, article)}
                        className="hc-article-card"
                      >
                        <div>
                          <h3>{article.title}</h3>
                          <p>{article.summary}</p>
                        </div>
                        <span className="hc-card-arrow" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
