"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/projects?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="glass border border-[var(--hw-border)] focus-within:border-[var(--hw-green)] transition-colors" style={{ borderRadius: "4px" }}>
        <div className="flex items-center gap-2 px-4 py-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 text-[var(--hw-text-dim)]"
          >
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, categories, layers..."
            className="w-full bg-transparent text-sm text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] outline-none"
          />
          <kbd className="hidden text-[10px] text-[var(--hw-text-dim)] border border-[var(--hw-border)] px-1.5 py-0.5 sm:inline-block" style={{ borderRadius: "2px" }}>
            ⌘K
          </kbd>
        </div>
      </div>
    </form>
  );
}
