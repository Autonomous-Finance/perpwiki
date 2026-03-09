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
}

const renderParagraphs = (text: string) =>
  text.split(/\n\n+/).map((para, i) => (
    <p key={i} className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-3 last:mb-0">
      {para}
    </p>
  ));

export function ProjectTabs({ description, dossier, tags }: ProjectTabsProps) {
  const tabs = buildTabs(description, dossier);
  const [active, setActive] = useState(tabs[0]?.id ?? "overview");

  if (tabs.length === 0) return null;

  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      {/* Tab bar */}
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
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "var(--hw-green)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {activeTab.id === "overview" && <OverviewTab description={description} dossier={dossier} />}
        {activeTab.id === "how-it-works" && dossier?.howItWorks && <HowItWorksTab text={dossier.howItWorks} />}
        {activeTab.id === "tokenomics" && <TokenomicsTeamTab dossier={dossier!} />}
        {activeTab.id === "funding" && <FundingTab dossier={dossier!} />}
        {activeTab.id === "risks" && <RisksVerdictTab dossier={dossier!} />}
      </div>

      {/* Tags below tabs */}
      {tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[var(--hw-border)]">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--hw-border)] px-2.5 py-1 text-xs text-[var(--hw-text-dim)] hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text-muted)] transition-colors"
                style={{ borderRadius: "2px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
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

function OverviewTab({ description, dossier }: { description: string | null; dossier: DossierData | null }) {
  const text = dossier?.overview || description;
  if (!text) return null;
  return (
    <div className="space-y-4">
      {dossier?.keyMetrics && dossier.keyMetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {dossier.keyMetrics.map((metric, i) => (
            <div
              key={i}
              className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3"
              style={{ borderRadius: "4px" }}
            >
              <div className="font-[family-name:var(--font-jetbrains-mono)] text-lg font-bold text-[var(--hw-green)]">
                {metric.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--hw-text-dim)] mt-0.5">{metric.label}</div>
              {metric.note && (
                <div className="mt-1 text-[10px] text-[var(--hw-text-dim)] opacity-70">{metric.note}</div>
              )}
            </div>
          ))}
        </div>
      )}
      <div>{renderParagraphs(text)}</div>

      {/* Audit + Competitors inline */}
      {(dossier?.auditStatus || (dossier?.competitors && dossier.competitors.length > 0)) && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--hw-border)]">
          {dossier?.auditStatus && (
            <div className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2" style={{ borderRadius: "4px" }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: dossier.auditStatus.toLowerCase().includes("audit") ? "var(--hw-green)" : "var(--hw-gold)" }} />
              <span className="text-xs text-[var(--hw-text-muted)]">{dossier.auditStatus}</span>
            </div>
          )}
          {dossier?.competitors && dossier.competitors.length > 0 && (
            <div className="inline-flex items-center gap-2 border border-[var(--hw-border)] bg-[var(--hw-surface)] px-3 py-2" style={{ borderRadius: "4px" }}>
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

function HowItWorksTab({ text }: { text: string }) {
  const steps = text.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 flex items-start justify-center">
            <span
              className="flex h-7 w-7 items-center justify-center text-xs font-bold font-[family-name:var(--font-jetbrains-mono)]"
              style={{
                borderRadius: "4px",
                background: "rgba(0, 200, 224, 0.1)",
                color: "var(--hw-cyan)",
                border: "1px solid rgba(0, 200, 224, 0.2)",
              }}
            >
              {i + 1}
            </span>
          </div>
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
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: "4px" }}>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-3 bg-[var(--hw-gold)]" style={{ borderRadius: "1px" }} />
            Tokenomics
          </h3>
          {renderParagraphs(dossier.tokenomics)}
        </div>
      )}
      {dossier.team && (
        <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-5" style={{ borderRadius: "4px" }}>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-3 flex items-center gap-2">
            <span className="inline-block h-1 w-3" style={{ background: "var(--hw-tier-hip3)", borderRadius: "1px" }} />
            Team
            {dossier.team.anonymous && (
              <span className="ml-auto px-1.5 py-0.5 text-[10px]" style={{ borderRadius: "2px", background: "rgba(240,180,41,0.15)", color: "var(--hw-gold)" }}>
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
    <div className="border border-[var(--hw-border)] bg-[var(--hw-surface)] p-6" style={{ borderRadius: "4px" }}>
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
                <span
                  key={i}
                  className="border border-[var(--hw-border)] bg-[var(--hw-bg)] px-3 py-1.5 text-xs text-[var(--hw-text-muted)]"
                  style={{ borderRadius: "2px" }}
                >
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
          style={{ borderRadius: "4px", borderLeftWidth: "3px", borderLeftColor: "var(--hw-red)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-red)] mb-3">
            Risk Factors
          </h3>
          {renderParagraphs(dossier.risks)}
        </div>
      )}
      {dossier.verdict && (
        <div
          className="border border-[var(--hw-green)] p-5 relative overflow-hidden"
          style={{ borderRadius: "4px", background: "linear-gradient(135deg, rgba(0,229,160,0.06) 0%, rgba(0,229,160,0.02) 100%)" }}
        >
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-green)] mb-3">
            Verdict
          </h3>
          {renderParagraphs(dossier.verdict)}
        </div>
      )}
      {dossier.lastUpdated && (
        <p className="text-[10px] text-[var(--hw-text-dim)]">Last updated: {dossier.lastUpdated}</p>
      )}
    </div>
  );
}
