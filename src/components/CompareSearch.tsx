"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ProjectLogo } from "@/components/ProjectLogo";

interface ComparePair {
  slugA: string;
  slugB: string;
  nameA: string;
  nameB: string;
  category: string;
  logoUrlA?: string | null;
  logoUrlB?: string | null;
}

interface CompareSearchProps {
  pairs: ComparePair[];
}

export function CompareSearch({ pairs }: CompareSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return pairs.filter(
      (p) =>
        p.nameA.toLowerCase().includes(q) ||
        p.nameB.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query, pairs]);

  return (
    <div className="mb-10">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--hw-text-dim)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search comparisons by project name or category..."
          className="w-full border border-[var(--hw-border)] bg-[var(--hw-surface)] text-[var(--hw-text)] placeholder-[var(--hw-text-dim)] px-4 py-2.5 pl-10 text-sm outline-none transition-colors focus:border-[var(--hw-green)]"
          style={{ borderRadius: "4px" }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {query.trim() && (
        <div
          className="mt-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] overflow-hidden"
          style={{ borderRadius: "4px" }}
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[var(--hw-text-dim)]">
              No comparisons found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="divide-y divide-[var(--hw-border)]">
              {filtered.map((pair) => (
                <Link
                  key={`search-${pair.slugA}-${pair.slugB}`}
                  href={`/compare/${pair.slugA}-vs-${pair.slugB}`}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--hw-surface-raised)]"
                >
                  <div className="flex items-center -space-x-1.5">
                    <ProjectLogo name={pair.nameA} logoUrl={pair.logoUrlA} size="sm" />
                    <ProjectLogo name={pair.nameB} logoUrl={pair.logoUrlB} size="sm" />
                  </div>
                  <span className="text-sm text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                    {pair.nameA} vs {pair.nameB}
                  </span>
                  <span className="ml-auto text-xs text-[var(--hw-text-dim)]">{pair.category}</span>
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-[var(--hw-text-dim)] group-hover:text-[var(--hw-green)] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
          {filtered.length > 0 && (
            <div className="px-4 py-2 text-xs text-[var(--hw-text-dim)] border-t border-[var(--hw-border)] bg-[var(--hw-surface-raised)]">
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
