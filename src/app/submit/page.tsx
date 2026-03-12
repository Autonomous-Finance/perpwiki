"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  "Event Contracts",
  "Meme Perps",
  "NFTs & Collectibles",
  "Oracles",
  "SDKs & Developer Tools",
  "Security & Audits",
  "Data APIs",
  "Communities & DAOs",
  "Media & Education",
  "Airdrop Trackers",
  "Other",
];

const STORAGE_KEY = "perpwiki_submit_form";
const LOGO_STORAGE_KEY = "perpwiki_submit_logo";
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const ALLOWED_LOGO_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];

interface FormData {
  name: string;
  website: string;
  twitter: string;
  category: string;
  layer: string;
  description: string;
  email: string;
}

interface FieldErrors {
  name?: string;
  website?: string;
  category?: string;
  layer?: string;
  logo?: string;
  email?: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  website: "",
  twitter: "",
  category: "",
  layer: "",
  description: "",
  email: "",
};

function loadSavedForm(): FormData {
  if (typeof window === "undefined") return EMPTY_FORM;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...EMPTY_FORM, ...JSON.parse(saved) };
  } catch {}
  return EMPTY_FORM;
}

function loadSavedLogo(): { preview: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(LOGO_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(formatUrl(url));
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);

  // Category search
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved form data on mount
  useEffect(() => {
    setForm(loadSavedForm());
    const savedLogo = loadSavedLogo();
    if (savedLogo) {
      setLogoPreview(savedLogo.preview);
      setLogoName(savedLogo.name);
    }
    setMounted(true);
  }, []);

  // Persist form to localStorage on every change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
  }, [form, mounted]);

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const validateField = useCallback((field: string, formData: FormData): string | undefined => {
    switch (field) {
      case "name":
        if (!formData.name.trim()) return "Project name is required.";
        break;
      case "website":
        if (!formData.website.trim()) return "Website URL is required.";
        if (!isValidUrl(formData.website)) return "Please enter a valid URL.";
        break;
      case "layer":
        if (!formData.layer) return "Layer is required.";
        break;
      case "category":
        if (!formData.category) return "Category is required.";
        break;
      case "email":
        if (formData.email.trim() && !isValidEmail(formData.email.trim())) return "Please enter a valid email.";
        break;
    }
    return undefined;
  }, []);

  function handleBlur(field: string) {
    setTouched((prev) => new Set(prev).add(field));
    const error = validateField(field, form);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field as keyof FieldErrors] = error;
      else delete next[field as keyof FieldErrors];
      return next;
    });
  }

  function validateAll(): FieldErrors {
    const errs: FieldErrors = {};
    const requiredFields = ["name", "website", "layer", "category", "email"] as const;
    for (const field of requiredFields) {
      const err = validateField(field, form);
      if (err) errs[field] = err;
    }
    return errs;
  }

  function handleLogoSelect(file: File) {
    // Validate type
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_LOGO_TYPES.includes(file.type) && !ALLOWED_LOGO_EXTENSIONS.includes(ext)) {
      setErrors((prev) => ({ ...prev, logo: "Logo must be JPG, PNG, WebP, or SVG." }));
      return;
    }
    // Validate size
    if (file.size > MAX_LOGO_SIZE) {
      setErrors((prev) => ({ ...prev, logo: `Logo must be under 2MB (yours is ${(file.size / 1024 / 1024).toFixed(1)}MB).` }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.logo;
      return next;
    });
    setLogoFile(file);
    setLogoUploading(true);
    setLogoProgress(0);

    // Simulate progress while reading
    const interval = setInterval(() => {
      setLogoProgress((p) => Math.min(p + 15, 90));
    }, 80);

    const reader = new FileReader();
    reader.onload = () => {
      clearInterval(interval);
      setLogoProgress(100);
      const result = reader.result as string;
      setLogoPreview(result);
      setLogoName(file.name);
      try {
        localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify({ preview: result, name: file.name }));
      } catch {}
      setTimeout(() => setLogoUploading(false), 300);
    };
    reader.onerror = () => {
      clearInterval(interval);
      setLogoUploading(false);
      setLogoProgress(0);
      setErrors((prev) => ({ ...prev, logo: "Failed to read logo file. Please try again." }));
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoName(null);
    setLogoProgress(0);
    try { localStorage.removeItem(LOGO_STORAGE_KEY); } catch {}
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    // Auto-format URL before validation
    if (form.website.trim() && !form.website.trim().startsWith("http")) {
      update("website", formatUrl(form.website));
    }

    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTouched(new Set(Object.keys(errs)));
      setStatus("error");
      // Scroll to first invalid field
      const firstErrorField = formRef.current?.querySelector(`[data-field="${Object.keys(errs)[0]}"]`);
      firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const payload: Record<string, string | null> = {
        ...form,
        website: formatUrl(form.website),
      };
      if (logoPreview) payload.logoBase64 = logoPreview;

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
      // Clear localStorage on success
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOGO_STORAGE_KEY);
      } catch {}
    } catch (err) {
      setErrors({ name: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      setStatus("error");
    }
  }

  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const STEPS = [
    { num: 1, label: "Fill out the form", done: true },
    { num: 2, label: "Submit for review", done: status === "success" },
    { num: 3, label: "We review within 48h", done: false },
    { num: 4, label: "Project listed on perp.wiki", done: false },
  ];

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
          </p>

          {/* What happens next */}
          <div className="text-left mb-8 mx-auto max-w-sm">
            <h2 className="text-sm font-medium text-[var(--hw-text)] mb-3">What happens next</h2>
            <ol className="space-y-2">
              {STEPS.map((step) => (
                <li key={step.num} className="flex items-start gap-3 text-sm">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-xs font-medium"
                    style={{
                      borderRadius: "50%",
                      background: step.done ? "var(--hw-green)" : "var(--hw-surface)",
                      color: step.done ? "var(--hw-bg)" : "var(--hw-text-dim)",
                      border: step.done ? "none" : "1px solid var(--hw-border)",
                    }}
                  >
                    {step.done ? "\u2713" : step.num}
                  </span>
                  <span className={step.done ? "text-[var(--hw-text-muted)] line-through" : "text-[var(--hw-text-muted)]"}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

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
                setForm(EMPTY_FORM);
                removeLogo();
                setStatus("idle");
                setErrors({});
                setTouched(new Set());
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
      <p className="text-[var(--hw-text-muted)] mb-6">
        Know a Hyperliquid ecosystem project that&apos;s missing? Submit it here and we&apos;ll review it.
      </p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8 text-xs text-[var(--hw-text-dim)]">
        {STEPS.slice(0, 3).map((step, i) => (
          <div key={step.num} className="flex items-center gap-2">
            {i > 0 && <div className="w-8 h-px bg-[var(--hw-border)]" />}
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-medium"
              style={{
                borderRadius: "50%",
                background: step.num === 1 ? "var(--hw-green)" : "var(--hw-surface)",
                color: step.num === 1 ? "var(--hw-bg)" : "var(--hw-text-dim)",
                border: step.num === 1 ? "none" : "1px solid var(--hw-border)",
              }}
            >
              {step.num}
            </span>
            <span className={step.num === 1 ? "text-[var(--hw-text)]" : ""}>{step.label}</span>
          </div>
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <Field label="Project Name" required error={touched.has("name") ? errors.name : undefined} fieldKey="name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="e.g. HyperSwap"
            maxLength={100}
            className={`form-input ${touched.has("name") && errors.name ? "form-input-error" : ""}`}
          />
        </Field>

        <Field label="Website URL" required error={touched.has("website") ? errors.website : undefined} fieldKey="website">
          <input
            type="text"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            onBlur={() => {
              // Auto-format URL on blur
              if (form.website.trim() && !form.website.trim().startsWith("http")) {
                update("website", formatUrl(form.website));
              }
              handleBlur("website");
            }}
            placeholder="https://example.com"
            className={`form-input ${touched.has("website") && errors.website ? "form-input-error" : ""}`}
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
          <Field label="Layer" required error={touched.has("layer") ? errors.layer : undefined} fieldKey="layer">
            <select
              value={form.layer}
              onChange={(e) => { update("layer", e.target.value); handleBlur("layer"); }}
              onBlur={() => handleBlur("layer")}
              className={`form-input ${touched.has("layer") && errors.layer ? "form-input-error" : ""}`}
            >
              <option value="">Select layer...</option>
              {LAYERS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>

          {/* Searchable category dropdown */}
          <Field label="Category" required error={touched.has("category") ? errors.category : undefined} fieldKey="category">
            <div ref={categoryRef} className="relative">
              <input
                ref={categoryInputRef}
                type="text"
                value={categoryOpen ? categorySearch : form.category}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  if (!categoryOpen) setCategoryOpen(true);
                }}
                onFocus={() => {
                  setCategoryOpen(true);
                  setCategorySearch("");
                }}
                onBlur={() => {
                  // Delay to allow click on option
                  setTimeout(() => {
                    setCategoryOpen(false);
                    handleBlur("category");
                  }, 150);
                }}
                placeholder={form.category || "Search categories..."}
                className={`form-input ${touched.has("category") && errors.category ? "form-input-error" : ""}`}
                autoComplete="off"
              />
              {categoryOpen && (
                <div
                  className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto border border-[var(--hw-border)]"
                  style={{ background: "var(--hw-surface)", borderRadius: "2px" }}
                >
                  {filteredCategories.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-[var(--hw-text-dim)]">No matching categories</div>
                  ) : (
                    filteredCategories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-[var(--hw-text-muted)] hover:bg-[var(--hw-green-subtle)] hover:text-[var(--hw-text)]"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          update("category", c);
                          setCategoryOpen(false);
                          setCategorySearch("");
                        }}
                      >
                        {c}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </Field>
        </div>

        {/* Logo upload */}
        <Field label="Project Logo" error={errors.logo}>
          <div className="flex items-start gap-4">
            {logoPreview ? (
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-16 w-16 border border-[var(--hw-border)] object-contain"
                  style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-[var(--hw-red)] text-white text-xs"
                  style={{ borderRadius: "50%" }}
                  aria-label="Remove logo"
                >
                  &times;
                </button>
              </div>
            ) : null}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.svg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoSelect(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[var(--hw-border)] px-4 py-3 text-sm text-[var(--hw-text-dim)] hover:border-[var(--hw-green)] hover:text-[var(--hw-text-muted)] w-full transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {logoPreview ? "Replace logo" : "Upload logo (optional)"}
              </button>
              <p className="mt-1 text-xs text-[var(--hw-text-dim)]">
                JPG, PNG, WebP, or SVG. Max 2MB.
              </p>
              {logoUploading && (
                <div className="mt-2 h-1 w-full overflow-hidden" style={{ borderRadius: "1px", background: "var(--hw-surface)" }}>
                  <div
                    className="h-full transition-all"
                    style={{ width: `${logoProgress}%`, background: "var(--hw-green)" }}
                  />
                </div>
              )}
              {logoName && !logoUploading && (
                <p className="mt-1 text-xs text-[var(--hw-green)]">{logoName}</p>
              )}
            </div>
          </div>
        </Field>

        <Field label="Short Description" counter={`${form.description.length}/5000`}>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What does this project do? (2-3 sentences)"
            rows={3}
            maxLength={5000}
            className="form-input resize-none"
          />
        </Field>

        <Field label="Your Email (optional)" error={touched.has("email") ? errors.email : undefined} fieldKey="email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="you@example.com"
            className={`form-input ${touched.has("email") && errors.email ? "form-input-error" : ""}`}
          />
          <p className="mt-1 text-xs text-[var(--hw-text-dim)]">
            Only used to notify you when the project is added. Never shared.
          </p>
        </Field>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full border border-[var(--hw-green)] px-6 py-3 text-sm font-medium text-[var(--hw-green)] transition-all hover:bg-[var(--hw-green-subtle)] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ borderRadius: "2px" }}
        >
          {status === "submitting" ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit for Review"
          )}
        </button>
      </form>

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
        .form-input-error {
          border-color: var(--hw-red) !important;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  counter,
  fieldKey,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  counter?: string;
  fieldKey?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-field={fieldKey}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="block text-sm text-[var(--hw-text-muted)]">
          {label}
          {required && <span className="text-[var(--hw-red)] ml-0.5">*</span>}
        </label>
        {counter && (
          <span className="text-xs text-[var(--hw-text-dim)]">{counter}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-xs text-[var(--hw-red)]">{error}</p>
      )}
    </div>
  );
}
