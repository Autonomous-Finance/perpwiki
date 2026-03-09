"use client";

import { useState } from "react";

export function ReviewForm({ projectId }: { projectId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          rating,
          content: content.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review.");
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
          Review submitted! It will appear after moderation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-[var(--hw-text-muted)] mb-2">
          Your Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl transition-colors"
              style={{
                color:
                  star <= (hovered || rating)
                    ? "var(--hw-gold)"
                    : "var(--hw-text-dim)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0 2px",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--hw-text-muted)] mb-2">
          Review (optional)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Share your experience..."
          className="w-full border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-2 text-sm text-[var(--hw-text)] placeholder:text-[var(--hw-text-dim)] focus:border-[var(--hw-border-bright)] focus:outline-none"
          style={{ borderRadius: "2px", resize: "vertical" }}
        />
      </div>

      {error && (
        <p className="text-sm text-[var(--hw-red)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="border border-[var(--hw-green)] bg-transparent px-4 py-2 text-sm text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green-subtle)] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderRadius: "2px" }}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
