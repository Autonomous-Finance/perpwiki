"use client";
import { useState } from "react";

interface DossierData {
  entityName?: string;
  oneLiner?: string;
  overview?: string;
  keyMetrics?: Array<{ label: string; value: string; note?: string }>;
  howItWorks?: string;
  tokenomics?: string;
  risks?: string;
  competitors?: string[];
  team?: { description?: string; anonymous?: boolean };
  funding?: { raised?: string; investors?: string[] };
  auditStatus?: string;
  verdict?: string;
  lastUpdated?: string;
}

interface ProjectTabsProps {
  description: string | null;
  dossier: DossierData | null;
  tags: string[];
  category: string;
  layer: string;
  status: string;
  launchYear: number | null;
  launchDate: string | null;
  website: string | null;
  isVerified: boolean;
  isFeatured: boolean;
}

const renderParagraphs = (text: string) =>
  text.split(/\n\n+/).map((para, i) => (
    <p key={i} className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-3 last:mb-0">
      {para}
    </p>
  ));

// --- Helpers ---

function extractFacts(text: string): Array<{ value: string; label: string }> {
  const facts: Array<{ value: string; label: string }> = [];
  const seen = new Set<string>();

  const dollarRegex = /(\$[\d,.]+[BMKTbmkt]?\+?)\s+(?:in\s+)?([A-Za-z ]{3,30}?)(?:\.|,|\band\b)/g;
  let match;
  while ((match = dollarRegex.exec(text)) !== null && facts.length < 4) {
    const label = match[2].trim();
    if (label.length > 3 && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase());
      facts.push({ value: match[1], label: capitalize(label) });
    }
  }

  const pctRegex = /([\d.]+%)\s+(?:of\s+)?([A-Za-z ]{3,25}?)(?:\.|,)/g;
  while ((match = pctRegex.exec(text)) !== null && facts.length < 4) {
    const label = match[2].trim();
    if (label.length > 3 && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase());
      facts.push({ value: match[1], label: capitalize(label) });
    }
  }

  const countRegex = /([\d,]+[KMB]?\+?)\s+([a-z][a-z ]{2,20}?)(?:\.|,|\band\b)/g;
  while ((match = countRegex.exec(text)) !== null && facts.length < 4) {
    const num = match[1];
    const label = match[2].trim();
    if (parseInt(num.replace(/[,KMB+]/g, "")) > 1 && label.length > 3 && !seen.has(label.toLowerCase())) {
      seen.add(label.toLowerCase());
      facts.push({ value: num, label: capitalize(label) });
    }
  }

  return facts.slice(0, 4);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function extractFeatures(text: string): string[] {
  const features: string[] = [];
  const sentences = text.split(/\.\s+/);
  for (const sent of sentences) {
    const trimmed = sent.trim();
    if (trimmed.length < 20 || trimmed.length > 200) continue;
    if (
      /(?:features?|supports?|enables?|provides?|offers?|includes?|allows?|built|powered|uses?)/i.test(trimmed) ||
      /(?:first|largest|leading|top|fastest|only|unique)/i.test(trimmed)
    ) {
      features.push(trimmed.replace(/\.$/, ""));
    }
  }
  return features.slice(0, 4);
}

const LAYER_LABELS: Record<string, string> = {
  HYPERCORE: "HyperCore",
  HYPEREVM: "HyperEVM",
  HIP3: "HIP-3",
  BOTH: "Multi-Layer",
};

// --- Main Component ---

export function ProjectTabs({
  description,
  dossier,
  tags,
  category,
  layer,
  status,
  launchYear,
  launchDate,
  website,
  isVerified,
  isFeatured,
}: ProjectTabsProps) {
  const tabs = buildTabs(description, dossier);
  const [active, setActive] = useState(tabs[0]?.id ?? "overview");

  if (tabs.length === 0) return null;

  return (
    <div>
      {/* Tab bar */}
      {tabs.length > 1 && (
        <div className="flex gap-1 border-b border-[var(--hw-border)] mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color: active === tab.id ? "var(--hw-green)" : "var(--hw-text-dim)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab.label}
              {active === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "var(--hw-green)" }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      <div className="min-h-[120px]">
        {active === "overview" && (
          <OverviewTab
            description={description}
            dossier={dossier}
            category={category}
            layer={layer}
            status={status}
            launchYear={launchYear}
            launchDate={launchDate}
            website={website}
            isVerified={isVerified}
            isFeatured={isFeatured}
            tags={tags}
          />
        )}
        {active === "how-it-works" && dossier?.howItWorks && <HowItWorksTab text={dossier.howItWorks} />}
        {active === "tokenomics" && <TokenomicsTeamTab dossier={dossier!} />}
        {active === "funding" && <FundingTab dossier={dossier!} />}
        {active === "risks" && <RisksVerdictTab dossier={dossier!} />}
      </div>
    </div>
  );
}

function buildTabs(description: string | null, dossier: DossierData | null) {
  const tabs: { id: string; label: string }[] = [];
  tabs.push({ id: "overview", label: "Overview" });
  if (dossier?.howItWorks) tabs.push({ id: "how-it-works", label: "How It Works" });
  if (dossier?.tokenomics || dossier?.team) tabs.push({ id: "tokenomics", label: "Tokenomics & Team" });
  if (dossier?.funding && (dossier.funding.raised || (dossier.funding.investors && dossier.funding.investors.length > 0)))
    tabs.push({ id: "funding", label: "Funding" });
  if (dossier?.risks || dossier?.verdict) tabs.push({ id: "risks", label: "Risks & Verdict" });
  return tabs;
}

// --- Overview Tab (pm.wiki-inspired) ---

function OverviewTab({
  description,
  dossier,
  category,
  layer,
  status,
  launchYear,
  launchDate,
  website,
  isVerified,
  isFeatured,
  tags,
}: {
  description: string | null;
  dossier: DossierData | null;
  category: string;
  layer: string;
  status: string;
  launchYear: number | null;
  launchDate: string | null;
  website: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  tags: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  const text = dossier?.overview || description;
  if (!text) return null;

  const hasDossierMetrics = dossier?.keyMetrics && dossier.keyMetrics.length > 0;
  const extractedFacts = !hasDossierMetrics ? extractFacts(text) : [];
  const features = !dossier ? extractFeatures(text) : [];

  // Split into TL;DR (first 1-2 sentences) and expanded detail
  const sentences = text.split(/(?<=\.)\s+/);
  const tldr = sentences.slice(0, 2).join(" ");
  const hasMore = sentences.length > 2;
  const restText = sentences.slice(2).join(" ");

  // Build key facts
  const keyFacts: Array<{ label: string; value: string }> = [];
  keyFacts.push({ label: "Category", value: category });
  keyFacts.push({ label: "Layer", value: LAYER_LABELS[layer] || layer });
  keyFacts.push({ label: "Status", value: status.charAt(0) + status.slice(1).toLowerCase() });
  if (launchDate) keyFacts.push({ label: "Launched", value: launchDate });
  else if (launchYear) keyFacts.push({ label: "Founded", value: String(launchYear) });
  if (website) {
    try { keyFacts.push({ label: "Website", value: new URL(website).hostname }); } catch { /* skip */ }
  }
  if (isVerified) keyFacts.push({ label: "Verified", value: "Yes" });

  return (
    <div className="space-y-5">
      {/* === METRICS GRID === */}
      {hasDossierMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dossier!.keyMetrics!.map((metric, i) => (
            <div key={i} className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3" style={{ borderRadius: 4 }}>
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-green)]">
                {metric.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mt-0.5">{metric.label}</div>
              {metric.note && <div className="mt-1 text-[10px] text-[var(--hw-text-dim)] opacity-70">{metric.note}</div>}
            </div>
          ))}
        </div>
      )}

      {extractedFacts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {extractedFacts.map((fact, i) => (
            <div key={i} className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2.5" style={{ borderRadius: 4 }}>
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-base font-bold text-[var(--hw-green)]">
                {fact.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mt-0.5">{fact.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* === TL;DR SUMMARY === */}
      <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: 4 }}>
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 mt-0.5 flex h-5 items-center px-1.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ borderRadius: 3, background: "var(--hw-green-subtle)", color: "var(--hw-green)" }}
          >
            TL;DR
          </span>
          <p className="text-sm leading-relaxed text-[var(--hw-text)]">{tldr}</p>
        </div>
      </div>

      {/* === EXPANDABLE DETAIL === */}
      {hasMore && (
        <div>
          {expanded && (
            <div className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-3">
              {renderParagraphs(restText)}
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-medium transition-colors"
            style={{
              color: "var(--hw-green)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {expanded ? "Show less ▲" : "Read full overview ▼"}
          </button>
        </div>
      )}

      {/* === KEY FACTS GRID === */}
      <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-4" style={{ borderRadius: 4 }}>
        <h3 className="text-xs uppercase tracking-wider text-[var(--hw-text-dim)] mb-3 font-semibold">Key Facts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5">
          {keyFacts.map((fact, i) => (
            <div key={i} className="flex justify-between items-baseline gap-2 border-b border-[var(--hw-border)] pb-2 last:border-0">
              <span className="text-xs text-[var(--hw-text-dim)]">{fact.label}</span>
              <span className="text-xs font-medium text-[var(--hw-text)] font-[family-name:var(--font-jetbrains-mono)] text-right">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === KEY FEATURES (non-dossier projects) === */}
      {features.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-[var(--hw-text-dim)] mb-3 font-semibold">Key Features</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3"
                style={{ borderRadius: 4 }}
              >
                <span
                  className="shrink-0 flex h-6 w-6 items-center justify-center text-[11px] font-bold font-[family-name:var(--font-jetbrains-mono)]"
                  style={{ borderRadius: 4, background: "rgba(0, 200, 224, 0.1)", color: "var(--hw-cyan)", border: "1px solid rgba(0, 200, 224, 0.2)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--hw-text-muted)] leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TAGS === */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-[var(--hw-border)] px-2.5 py-1 text-xs text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text-muted)] transition-colors"
              style={{ borderRadius: 2 }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* === AUDIT + COMPETITORS === */}
      {(dossier?.auditStatus || (dossier?.competitors && dossier.competitors.length > 0)) && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--hw-border)]">
          {dossier?.auditStatus && (
            <div className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2" style={{ borderRadius: 4 }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: dossier.auditStatus.toLowerCase().includes("audit") ? "var(--hw-green)" : "var(--hw-gold)" }} />
              <span className="text-xs text-[var(--hw-text-muted)]">{dossier.auditStatus}</span>
            </div>
          )}
          {dossier?.competitors && dossier.competitors.length > 0 && (
            <div className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2" style={{ borderRadius: 4 }}>
              <span className="text-xs text-[var(--hw-text-dim)]">Competitors:</span>
              {dossier.competitors.map((c, i) => (
                <span key={i} className="text-xs text-[var(--hw-text-muted)]">{c}{i < dossier.competitors!.length - 1 ? "," : ""}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Other Tabs ---

function HowItWorksTab({ text }: { text: string }) {
  const steps = text.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <span
            className="shrink-0 flex h-7 w-7 items-center justify-center text-xs font-bold font-[family-name:var(--font-jetbrains-mono)]"
            style={{ borderRadius: 4, background: "rgba(0, 200, 224, 0.1)", color: "var(--hw-cyan)", border: "1px solid rgba(0, 200, 224, 0.2)" }}
          >
            {i + 1}
          </span>
          <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] pt-1">{step}</p>
        </div>
      ))}
    </div>
  );
}

function TokenomicsTeamTab({ dossier }: { dossier: DossierData }) {
  return (
    <div className="space-y-6">
      {dossier.tokenomics && (
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-3 bg-[var(--hw-gold)]" style={{ borderRadius: 1 }} />
            Tokenomics
          </h3>
          {renderParagraphs(dossier.tokenomics)}
        </div>
      )}
      {dossier.team && (
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: 4 }}>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-3" style={{ background: "var(--hw-tier-hip3)", borderRadius: 1 }} />
            Team
            {dossier.team.anonymous && (
              <span className="ml-auto px-1.5 py-0.5 text-[10px]" style={{ borderRadius: 2, background: "rgba(240,180,41,0.15)", color: "var(--hw-gold)" }}>
                Anonymous
              </span>
            )}
          </h3>
          {dossier.team.description && <p className="text-sm text-[var(--hw-text-muted)]">{dossier.team.description}</p>}
        </div>
      )}
    </div>
  );
}

function FundingTab({ dossier }: { dossier: DossierData }) {
  if (!dossier.funding) return null;
  return (
    <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6" style={{ borderRadius: 4 }}>
      <div className="space-y-6">
        {dossier.funding.raised && (
          <div className="text-center py-4">
            <div className="text-[10px] uppercase tracking-widest text-[var(--hw-text-dim)] mb-2">Total Raised</div>
            <div className="font-[family-name:var(--font-jetbrains-mono)] text-3xl font-bold text-[var(--hw-green)]">
              {dossier.funding.raised}
            </div>
          </div>
        )}
        {dossier.funding.investors && dossier.funding.investors.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--hw-text-dim)] mb-3">Investors</div>
            <div className="flex flex-wrap gap-2">
              {dossier.funding.investors.map((inv, i) => (
                <span key={i} className="border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-1.5 text-xs text-[var(--hw-text-muted)]" style={{ borderRadius: 2 }}>
                  {inv}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RisksVerdictTab({ dossier }: { dossier: DossierData }) {
  return (
    <div className="space-y-6">
      {dossier.risks && (
        <div
          className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5"
          style={{ borderRadius: 4, borderLeftWidth: 3, borderLeftColor: "var(--hw-red)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-red)] mb-3">Risk Factors</h3>
          {renderParagraphs(dossier.risks)}
        </div>
      )}
      {dossier.verdict && (
        <div
          className="border border-[var(--hw-green)] p-5 relative overflow-hidden"
          style={{ borderRadius: 4, background: "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(0,229,160,0.02) 100%)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-green)] mb-3">Verdict</h3>
          {renderParagraphs(dossier.verdict)}
        </div>
      )}
      {dossier.lastUpdated && (
        <p className="text-[10px] text-[var(--hw-text-dim)]">Last updated: {dossier.lastUpdated}</p>
      )}
    </div>
  );
}
