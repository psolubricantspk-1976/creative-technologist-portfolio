"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchDoc } from "@/content/help-center";

export function HelpSearch({ index }: { index: SearchDoc[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const terms = q.split(/\s+/).filter(Boolean);

    return index
      .map((doc) => {
        const haystack = `${doc.title} ${doc.summary} ${doc.collection} ${doc.text}`.toLowerCase();
        let score = 0;
        for (const term of terms) {
          if (doc.title.toLowerCase().includes(term)) score += 8;
          else if (doc.summary.toLowerCase().includes(term)) score += 4;
          else if (doc.collection.toLowerCase().includes(term)) score += 2;
          else if (haystack.includes(term)) score += 1;
          else return null;
        }
        return { doc, score };
      })
      .filter((r): r is { doc: SearchDoc; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((r) => r.doc);
  }, [index, query]);

  const active = query.trim().length >= 2;

  return (
    <div className="hc-search">
      <label className="hc-search-box">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search 94 articles — try “drawdown”, “leverage” or “payout”"
          aria-label="Search the Help Center"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
            Clear
          </button>
        )}
      </label>

      {active && (
        <div className="hc-search-results" role="status" aria-live="polite">
          {results.length === 0 ? (
            <p className="hc-search-empty">
              No articles match “{query}”. Try a broader term, or email support.
            </p>
          ) : (
            <ul>
              {results.map((doc) => (
                <li key={doc.href}>
                  <Link href={doc.href}>
                    <span className="hc-search-title">{doc.title}</span>
                    <span className="hc-search-meta">
                      {doc.collectionTitle}
                      {doc.pending && <em className="hc-chip hc-chip--pending">Pending</em>}
                    </span>
                    <span className="hc-search-summary">{doc.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
