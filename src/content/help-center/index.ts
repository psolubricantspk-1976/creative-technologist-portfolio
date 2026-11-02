import { collections } from "./articles";
import type { Article, ArticleRef, Block, Collection } from "./types";

export { collections, collectionCount, articleCount, pendingArticleCount } from "./articles";
export { openDecisions, platform } from "./rules";
export type { Article, ArticleRef, Block, Collection } from "./types";

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getArticle(
  collectionSlug: string,
  articleSlug: string
): ArticleRef | undefined {
  const collection = getCollection(collectionSlug);
  if (!collection) return undefined;
  const article = collection.articles.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { collection, article, href: articleHref(collection, article) };
}

export function articleHref(collection: Collection, article: Article): string {
  return `/help/${collection.slug}/${article.slug}`;
}

/** Flat, ordered list of every article with its collection. */
export function allArticles(): ArticleRef[] {
  return collections.flatMap((collection) =>
    collection.articles.map((article) => ({
      collection,
      article,
      href: articleHref(collection, article),
    }))
  );
}

/** Previous / next article across the whole Help Center. */
export function adjacent(collectionSlug: string, articleSlug: string) {
  const flat = allArticles();
  const index = flat.findIndex(
    (r) => r.collection.slug === collectionSlug && r.article.slug === articleSlug
  );
  return {
    previous: index > 0 ? flat[index - 1] : undefined,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}

function blockText(block: Block): string {
  switch (block.kind) {
    case "p":
    case "h":
    case "formula":
      return block.text;
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "callout":
      return `${block.title ?? ""} ${block.text}`;
    case "table":
      return [...block.head, ...block.rows.flat()].join(" ");
    case "examples":
      return block.items.map((i) => `${i.title} ${i.text}`).join(" ");
    case "kv":
      return block.rows.map((r) => `${r.label} ${r.value ?? ""}`).join(" ");
    case "pending":
      return `${block.label} ${block.hint}`;
    default:
      return "";
  }
}

export function articleText(article: Article): string {
  return article.body.map(blockText).join(" ");
}

export type SearchDoc = {
  title: string;
  summary: string;
  collection: string;
  collectionTitle: string;
  href: string;
  pending: boolean;
  text: string;
};

/**
 * Compact search index handed to the client component. Body text is trimmed to
 * a short excerpt so the payload stays small — titles and summaries carry most
 * of the signal.
 */
export const searchIndex: SearchDoc[] = allArticles().map(
  ({ collection, article, href }) => ({
    title: article.title,
    summary: article.summary,
    collection: collection.title,
    collectionTitle: collection.title,
    href,
    pending: article.pending,
    text: articleText(article).slice(0, 200).toLowerCase(),
  })
);

/** Collections paired with their articles, for index listings. */
export const articlesByCollection = collections.map((collection) => ({
  collection,
  articles: collection.articles.map((article) => ({
    article,
    href: articleHref(collection, article),
  })),
}));

export type PendingTheme = { label: string; hint: string; count: number };

/**
 * Deduplicated list of everything still awaiting confirmation, derived from the
 * pending blocks actually rendered in the articles (never hand-maintained).
 */
export const pendingThemes: PendingTheme[] = (() => {
  const map = new Map<string, PendingTheme>();
  for (const { article } of allArticles()) {
    const seen = new Set<string>();
    for (const block of article.body) {
      if (block.kind !== "pending") continue;
      if (seen.has(block.label)) continue;
      seen.add(block.label);
      const existing = map.get(block.label);
      if (existing) existing.count += 1;
      else map.set(block.label, { label: block.label, hint: block.hint, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
})();
