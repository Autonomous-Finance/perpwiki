"use client";

import { useState } from "react";

export function FaqAccordion({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border border-[var(--hw-border)] bg-[var(--hw-surface)] overflow-hidden transition-colors"
      style={{ borderRadius: "4px" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-[var(--hw-text)] hover:bg-[var(--hw-surface-raised)] transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span>{question}</span>
        <svg
          className={`shrink-0 w-4 h-4 text-[var(--hw-text-dim)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed text-[var(--hw-text-muted)]">
          {children}
        </div>
      )}
    </div>
  );
}
