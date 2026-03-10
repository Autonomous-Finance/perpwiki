"use client";

import { useState, useRef, useEffect } from "react";

export function FaqAccordion({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open, children]);

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
        <span className="flex items-center gap-3">
          <span
            className="flex h-6 w-6 items-center justify-center shrink-0 text-xs font-bold"
            style={{
              borderRadius: "4px",
              background: open ? "var(--hw-green-subtle)" : "var(--hw-surface-raised)",
              color: open ? "var(--hw-green)" : "var(--hw-text-dim)",
              transition: "all 0.2s",
            }}
          >
            Q
          </span>
          <span>{question}</span>
        </span>
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
      <div
        style={{
          maxHeight: open ? (height ?? 500) : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.2s ease",
        }}
      >
        <div ref={contentRef} className="px-5 pb-4 text-sm leading-relaxed text-[var(--hw-text-muted)]">
          <div className="border-l-2 border-[var(--hw-green)] pl-4 ml-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
