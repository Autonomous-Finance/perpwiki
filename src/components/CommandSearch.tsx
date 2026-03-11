"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface Project {
  slug: string;
  name: string;
  tagline: string | null;
  category: string;
  layer: string;
  logoUrl: string | null;
}

interface CommandSearchProps {
  projects: Project[];
}

const RECENT_KEY = "hw-recent-searches";
const MAX_RECENT = 5;
const MAX_RESULTS = 8;

const QUICK_LINKS = [
  { label: "Markets", href: "/markets" },
  { label: "Funding Rates", href: "/funding-rates" },
  { label: "Stats", href: "/stats" },
  { label: "Learn", href: "/learn" },
  { label: "FAQ", href: "/faq" },
  { label: "Glossary", href: "/glossary" },
  { label: "Tools", href: "/tools" },
] as const;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentSearches();
    const updated = [term, ...existing.filter((s) => s !== term)].slice(
      0,
      MAX_RECENT
    );
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
}

export function CommandSearch({ projects }: CommandSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches when modal opens
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setSelectedIndex(0);
      // Focus input after render
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Global Cmd/Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.layer.toLowerCase().includes(q)
      )
      .slice(0, MAX_RESULTS);
  }, [query, projects]);

  // Filter quick links
  const filteredQuickLinks = useMemo(() => {
    if (!query.trim()) return [...QUICK_LINKS];
    const q = query.toLowerCase().trim();
    return QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(q));
  }, [query]);

  // Build flat list of selectable items for keyboard nav
  const selectableItems = useMemo(() => {
    const items: Array<
      | { type: "recent"; value: string }
      | { type: "project"; project: Project }
      | { type: "quicklink"; label: string; href: string }
    > = [];

    if (!query.trim()) {
      // Show recent searches first
      for (const term of recentSearches) {
        items.push({ type: "recent", value: term });
      }
    }

    for (const p of filteredProjects) {
      items.push({ type: "project", project: p });
    }

    for (const l of filteredQuickLinks) {
      items.push({ type: "quicklink", label: l.label, href: l.href });
    }

    return items;
  }, [query, recentSearches, filteredProjects, filteredQuickLinks]);

  // Clamp selected index
  useEffect(() => {
    if (selectedIndex >= selectableItems.length) {
      setSelectedIndex(Math.max(0, selectableItems.length - 1));
    }
  }, [selectableItems.length, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const navigateAndClose = useCallback(
    (path: string, searchTerm?: string) => {
      if (searchTerm) saveRecentSearch(searchTerm);
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  const handleSelect = useCallback(
    (index: number) => {
      const item = selectableItems[index];
      if (!item) return;

      if (item.type === "recent") {
        setQuery(item.value);
        setSelectedIndex(0);
      } else if (item.type === "project") {
        navigateAndClose(
          `/projects/${item.project.slug}`,
          item.project.name
        );
      } else if (item.type === "quicklink") {
        navigateAndClose(item.href, item.label);
      }
    },
    [selectableItems, navigateAndClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < selectableItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : selectableItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(selectedIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [selectableItems.length, selectedIndex, handleSelect]
  );

  if (!open) return null;

  let itemIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg mx-4 border border-[var(--hw-border)] shadow-2xl overflow-hidden rounded-sm glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--hw-border)]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 text-[var(--hw-text-dim)]"
          >
            <circle
              cx="7"
              cy="7"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="11"
              y1="11"
              x2="14.5"
              y2="14.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects..."
            className="w-full bg-transparent text-sm text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] outline-none font-[family-name:var(--font-space-grotesk)]"
          />
          <kbd
            className="text-[10px] text-[var(--hw-text-dim)] border border-[var(--hw-border)] px-1.5 py-0.5 shrink-0 font-[family-name:var(--font-jetbrains-mono)]"
            style={{ borderRadius: "2px" }}
          >
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Recent searches (only when no query) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="px-3 pt-3 pb-1">
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] px-1 pb-2 font-[family-name:var(--font-jetbrains-mono)]">
                Recent
              </div>
              {recentSearches.map((term) => {
                const idx = itemIndex++;
                return (
                  <button
                    key={term}
                    data-index={idx}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors"
                    style={{
                      borderRadius: "4px",
                      background:
                        selectedIndex === idx
                          ? "var(--hw-surface-raised)"
                          : "transparent",
                      color:
                        selectedIndex === idx
                          ? "var(--hw-text)"
                          : "var(--hw-text-muted)",
                    }}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="shrink-0 text-[var(--hw-text-dim)]"
                    >
                      <path
                        d="M7 1.5C4 1.5 1.5 4 1.5 7s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <polyline
                        points="7,4 7,7 9.5,8.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{term}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div className="px-3 pt-3 pb-1">
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] px-1 pb-2 font-[family-name:var(--font-jetbrains-mono)]">
                Projects
              </div>
              {filteredProjects.map((project) => {
                const idx = itemIndex++;
                return (
                  <button
                    key={project.slug}
                    data-index={idx}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
                    style={{
                      borderRadius: "4px",
                      background:
                        selectedIndex === idx
                          ? "var(--hw-surface-raised)"
                          : "transparent",
                    }}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    {/* Logo */}
                    <div
                      className="w-7 h-7 shrink-0 flex items-center justify-center overflow-hidden border border-[var(--hw-border)]"
                      style={{
                        borderRadius: "4px",
                        background: "var(--hw-surface)",
                      }}
                    >
                      {project.logoUrl ? (
                        <img
                          src={project.logoUrl}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-[var(--hw-text-dim)]">
                          {project.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Name + tagline */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[var(--hw-text)] font-medium truncate font-[family-name:var(--font-space-grotesk)]">
                        {project.name}
                      </div>
                      {project.tagline && (
                        <div className="text-xs text-[var(--hw-text-dim)] truncate">
                          {project.tagline}
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className="text-[10px] px-1.5 py-0.5 text-[var(--hw-text-dim)] border border-[var(--hw-border)] font-[family-name:var(--font-jetbrains-mono)]"
                        style={{ borderRadius: "4px" }}
                      >
                        {project.category}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 text-[var(--hw-green)] border border-[var(--hw-green)]/20 font-[family-name:var(--font-jetbrains-mono)]"
                        style={{ borderRadius: "4px" }}
                      >
                        {project.layer}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Links */}
          {filteredQuickLinks.length > 0 && (
            <div className="px-3 pt-3 pb-3">
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] px-1 pb-2 font-[family-name:var(--font-jetbrains-mono)]">
                Quick Links
              </div>
              {filteredQuickLinks.map((link) => {
                const idx = itemIndex++;
                return (
                  <button
                    key={link.href}
                    data-index={idx}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors"
                    style={{
                      borderRadius: "4px",
                      background:
                        selectedIndex === idx
                          ? "var(--hw-surface-raised)"
                          : "transparent",
                      color:
                        selectedIndex === idx
                          ? "var(--hw-text)"
                          : "var(--hw-text-muted)",
                    }}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="shrink-0 text-[var(--hw-text-dim)]"
                    >
                      <path
                        d="M5.5 2.5h-2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-2"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 2.5h3.5V6M11.5 2.5L6.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {query.trim() &&
            filteredProjects.length === 0 &&
            filteredQuickLinks.length === 0 && (
              <div className="px-4 py-8 text-center">
                <svg className="mx-auto mb-3 h-8 w-8 text-[var(--hw-text-dim)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm text-[var(--hw-text-dim)]">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[var(--hw-text-dim)] mt-1 opacity-60">
                  Try a different search term or browse projects
                </p>
              </div>
            )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--hw-border)] text-[10px] text-[var(--hw-text-dim)] font-[family-name:var(--font-jetbrains-mono)]">
          <span className="flex items-center gap-1">
            <kbd
              className="border border-[var(--hw-border)] px-1 py-0.5"
              style={{ borderRadius: "2px" }}
            >
              &uarr;&darr;
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd
              className="border border-[var(--hw-border)] px-1 py-0.5"
              style={{ borderRadius: "2px" }}
            >
              &crarr;
            </kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd
              className="border border-[var(--hw-border)] px-1 py-0.5"
              style={{ borderRadius: "2px" }}
            >
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

export function SearchTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  // Also handle Cmd/Ctrl+K at this level for cases where CommandSearch isn't mounted yet
  return (
    <button
      onClick={onClick}
      className="w-full max-w-xl mx-auto block border border-[var(--hw-border)] hover:border-[var(--hw-border-bright)] transition-colors cursor-pointer"
      style={{ borderRadius: "4px" }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 text-[var(--hw-text-dim)]"
        >
          <circle
            cx="7"
            cy="7"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="11"
            y1="11"
            x2="14.5"
            y2="14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="flex-1 text-left text-sm text-[var(--hw-text-dim)]">
          Search projects...
        </span>
        <kbd
          className="hidden sm:inline-block text-[10px] text-[var(--hw-text-dim)] border border-[var(--hw-border)] px-1.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)]"
          style={{ borderRadius: "2px" }}
        >
          ⌘K
        </kbd>
      </div>
    </button>
  );
}
