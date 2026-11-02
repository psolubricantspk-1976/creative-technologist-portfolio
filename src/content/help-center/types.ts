/** Types for the GlobalForgeX Help Center. */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "callout"; tone: "info" | "warn" | "ok"; title?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "formula"; text: string }
  | {
      kind: "kv";
      rows: Array<{
        label: string;
        value: string | null;
        note?: string;
        hint?: string;
      }>;
    }
  | { kind: "pending"; label: string; hint: string }
  | {
      kind: "examples";
      items: Array<{ title: string; text: string }>;
    };

export type CategoryId =
  | "challenge-safe"
  | "funded-safe"
  | "challenge-pro"
  | "funded-pro"
  | "instant-lite"
  | "instant-pro"
  | "flex";

export type Article = {
  /** URL segment, unique within its collection. */
  slug: string;
  title: string;
  /** One-line summary shown in listings. */
  summary: string;
  /** Section heading grouping the article inside its collection. */
  section: string;
  body: Block[];
  /** True when the article still contains unpublished values. */
  pending: boolean;
};

export type Collection = {
  /** URL segment. */
  slug: string;
  /** e.g. "1.1" */
  code: string;
  title: string;
  summary: string;
  articles: Article[];
};

export type ArticleRef = {
  collection: Collection;
  article: Article;
  href: string;
};
