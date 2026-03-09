"use client";

import { useState } from "react";

interface Term {
  term: string;
  id: string;
  definition: string;
  links?: { label: string; href: string }[];
}

export function GlossarySearch({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.definition.toLowerCase().includes(query.toLowerCase())
      )
    : terms;

  const letters = Array.from(new Set(filtered.map((t) => t.term[0].toUpperCase()))).sort();

  const grouped: Record<string, Term[]> = {};
  for (const t of filtered) {
    const letter = t.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(t);
  }

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      {/* Search input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search terms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2.5 text-sm bg-[var(--hw-surface)] border border-[var(--hw-border)] text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:outline-none focus:border-[var(--hw-green)] transition-colors"
          style={{ borderRadius: "4px" }}
        />
      </div>

      {/* Alphabet jump bar */}
      <nav className="flex flex-wrap gap-1 mb-8" aria-label="Alphabet navigation">
        {alphabet.map((letter) => {
          const hasTerms = letters.includes(letter);
          return (
            <a
              key={letter}
              href={hasTerms ? `#letter-${letter}` : undefined}
              className={`w-8 h-8 flex items-center justify-center text-xs font-medium transition-colors ${
                hasTerms
                  ? "text-[var(--hw-text)] hover:text-[var(--hw-green)] hover:bg-[var(--hw-surface)]"
                  : "text-[var(--hw-text-dim)] opacity-40 cursor-default"
              }`}
              style={{ borderRadius: "4px" }}
              onClick={hasTerms ? undefined : (e) => e.preventDefault()}
            >
              {letter}
            </a>
          );
        })}
      </nav>

      {/* Terms */}
      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--hw-text-dim)] py-8 text-center">
          No terms match &ldquo;{query}&rdquo;
        </p>
      ) : (
        <div className="space-y-10">
          {Object.keys(grouped)
            .sort()
            .map((letter) => (
              <section key={letter} id={`letter-${letter}`}>
                <h2
                  className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--hw-green)] mb-4 pb-2 border-b border-[var(--hw-border)]"
                >
                  {letter}
                </h2>
                <div className="space-y-4">
                  {grouped[letter].map((t) => (
                    <div
                      key={t.id}
                      id={t.id}
                      className="group border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 hover:border-[var(--hw-border-bright)] transition-colors scroll-mt-24"
                      style={{ borderRadius: "4px" }}
                    >
                      <a href={`#${t.id}`} className="block">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors mb-1.5">
                          {t.term}
                        </h3>
                      </a>
                      <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed">
                        {t.definition}
                      </p>
                      {t.links && t.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {t.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-[var(--hw-green)] hover:text-[var(--hw-text)] transition-colors"
                              style={{
                                borderRadius: "2px",
                                background: "var(--hw-green-subtle)",
                                border: "1px solid rgba(0,229,160,0.2)",
                              }}
                            >
                              {link.label} &rarr;
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </>
  );
}
