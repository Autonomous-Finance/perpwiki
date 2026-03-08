"use client";

import { useState } from "react";
import Link from "next/link";

const LAYERS = ["HYPERCORE", "HYPEREVM", "HIP3", "BOTH"];
const CATEGORIES = [
  "Trading Terminals & Interfaces",
  "Trading Bots & Automation",
  "Analytics & Data",
  "Portfolio Trackers",
  "Liquid Staking",
  "Lending & Borrowing",
  "Decentralized Exchanges",
  "Yield & Vaults",
  "Bridges & Cross-Chain",
  "Wallets & Account Abstraction",
  "Prediction Markets",
  "RWA Perps",
  "NFTs & Collectibles",
  "Oracles",
  "SDKs & Developer Tools",
  "Security & Audits",
  "Data APIs",
  "Communities & DAOs",
  "Other",
];

interface FormData {
  name: string;
  website: string;
  twitter: string;
  category: string;
  layer: string;
  description: string;
  email: string;
}

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    website: "",
    twitter: "",
    category: "",
    layer: "",
    description: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    // Client-side validation
    if (!form.name.trim() || !form.website.trim() || !form.category || !form.layer) {
      setErrorMsg("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    try {
      const url = form.website.trim();
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      setErrorMsg("Please enter a valid website URL.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div
          className="border border-[var(--hw-green)] bg-[var(--hw-green-subtle)] p-8"
          style={{ borderRadius: "4px" }}
        >
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)] mb-4">
            Submission Received
          </h1>
          <p className="text-[var(--hw-text-muted)] mb-6">
            Thanks for submitting <strong className="text-[var(--hw-text)]">{form.name}</strong>!
            We&apos;ll review it and add it within 48 hours.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="border border-[var(--hw-border)] px-4 py-2 text-sm text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)]"
              style={{ borderRadius: "2px" }}
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setForm({ name: "", website: "", twitter: "", category: "", layer: "", description: "", email: "" });
                setStatus("idle");
              }}
              className="border border-[var(--hw-green)] px-4 py-2 text-sm text-[var(--hw-green)] hover:bg-[var(--hw-green-subtle)]"
              style={{ borderRadius: "2px" }}
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-2 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">Submit a Project</span>
      </div>

      <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] mb-2">
        Submit a Project
      </h1>
      <p className="text-[var(--hw-text-muted)] mb-8">
        Know a Hyperliquid ecosystem project that&apos;s missing? Submit it here and we&apos;ll review it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Project Name" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. HyperSwap"
            className="form-input"
          />
        </Field>

        <Field label="Website URL" required>
          <input
            type="url"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://example.com"
            className="form-input"
          />
        </Field>

        <Field label="Twitter / X Handle">
          <input
            type="text"
            value={form.twitter}
            onChange={(e) => update("twitter", e.target.value)}
            placeholder="@handle or https://x.com/handle"
            className="form-input"
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Layer" required>
            <select
              value={form.layer}
              onChange={(e) => update("layer", e.target.value)}
              className="form-input"
            >
              <option value="">Select layer...</option>
              {LAYERS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>

          <Field label="Category" required>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="form-input"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Short Description">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What does this project do? (2-3 sentences)"
            rows={3}
            className="form-input resize-none"
          />
        </Field>

        <Field label="Your Email (optional)">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className="form-input"
          />
          <p className="mt-1 text-xs text-[var(--hw-text-dim)]">
            Only used to notify you when the project is added. Never shared.
          </p>
        </Field>

        {status === "error" && errorMsg && (
          <div
            className="border border-[var(--hw-red)] px-4 py-3 text-sm text-[var(--hw-red)]"
            style={{ borderRadius: "2px", background: "rgba(255,77,106,0.08)" }}
          >
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full border border-[var(--hw-green)] px-6 py-3 text-sm font-medium text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green-subtle)] disabled:opacity-50"
          style={{ borderRadius: "2px" }}
        >
          {status === "submitting" ? "Submitting..." : "Submit Project"}
        </button>
      </form>

      {/* Styling for form inputs */}
      <style>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--hw-text);
          background: var(--hw-surface);
          border: 1px solid var(--hw-border);
          border-radius: 2px;
          outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus {
          border-color: var(--hw-green);
        }
        .form-input::placeholder {
          color: var(--hw-text-dim);
        }
        .form-input option {
          background: var(--hw-surface);
          color: var(--hw-text);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-[var(--hw-text-muted)]">
        {label}
        {required && <span className="text-[var(--hw-red)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
