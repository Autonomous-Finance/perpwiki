"use client";

import { useState } from "react";

const FIELD_OPTIONS = [
  "Description",
  "Website",
  "Twitter",
  "GitHub",
  "Discord",
  "Telegram",
  "Tags",
  "Category",
  "Status",
] as const;

export function SuggestionForm({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!field) {
      setError("Please select a field to update.");
      return;
    }
    if (!value.trim()) {
      setError("Please enter a suggested value.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          field,
          value: value.trim(),
          reason: reason.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit suggestion.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 text-center"
        style={{ borderRadius: "4px" }}
      >
        <p className="text-sm text-[var(--hw-green)]">
          Suggestion submitted! Our team will review it shortly.
        </p>
      </div>
    );
  }

  return (
    <div
      className="border border-[var(--hw-border)] bg-[var(--hw-surface)]"
      style={{ borderRadius: "4px" }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
          Suggest an Update for {projectName}
        </span>
        <svg
          className="h-4 w-4 text-[var(--hw-text-dim)] transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--hw-text-muted)] mb-2">
                Field to Update
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] focus:border-[var(--hw-border-bright)] focus:outline-none"
                style={{ borderRadius: "2px" }}
              >
                <option value="">Select a field...</option>
                {FIELD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--hw-text-muted)] mb-2">
                Suggested Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter the correct value..."
                className="w-full border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:border-[var(--hw-border-bright)] focus:outline-none"
                style={{ borderRadius: "2px" }}
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--hw-text-muted)] mb-2">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Why should this be changed?"
                className="w-full border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:border-[var(--hw-border-bright)] focus:outline-none"
                style={{ borderRadius: "2px", resize: "vertical" }}
              />
              <p className="mt-1 text-xs text-[var(--hw-text-dim)]">
                {reason.length}/500
              </p>
            </div>

            {error && (
              <p className="text-sm text-[var(--hw-red)]">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !field || !value.trim()}
              className="border border-[var(--hw-green)] bg-transparent px-4 py-2 text-sm text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green-subtle)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderRadius: "2px" }}
            >
              {submitting ? "Submitting..." : "Submit Suggestion"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
