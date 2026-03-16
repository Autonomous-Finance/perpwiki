/* ── UI Block Components (Server Components) ────────────────── */

/* ── ProsConsTable ──────────────────────────────────────────── */

export function ProsConsTable({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <div className="my-6 grid grid-cols-1 gap-px overflow-hidden border border-[var(--hw-border)] sm:grid-cols-2" style={{ borderRadius: "4px" }}>
      {/* Pros */}
      <div className="bg-[var(--hw-surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/15 text-xs text-emerald-400">
            +
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pros</span>
        </div>
        <ul className="space-y-2">
          {pros.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--hw-text-muted)]">
              <span className="mt-0.5 text-emerald-400 shrink-0">&#10003;</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      {/* Cons */}
      <div className="border-t border-[var(--hw-border)] bg-[var(--hw-surface)] p-4 sm:border-t-0 sm:border-l">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-red-500/15 text-xs text-red-400">
            &minus;
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Cons</span>
        </div>
        <ul className="space-y-2">
          {cons.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--hw-text-muted)]">
              <span className="mt-0.5 text-red-400 shrink-0">&#10007;</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── RiskBadge ──────────────────────────────────────────────── */

const RISK_COLORS = {
  Low: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  High: "bg-red-500/15 text-red-400",
  "Very High": "bg-red-500/20 text-red-400 font-bold",
} as const;

export function RiskBadge({ level }: { level: "Low" | "Medium" | "High" | "Very High" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_COLORS[level]}`}>
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
      {level} Risk
    </span>
  );
}

/* ── StrategyCard ───────────────────────────────────────────── */

export function StrategyCard({
  title,
  risk,
  timeCommitment,
  capitalMin,
  description,
  steps,
}: {
  title: string;
  risk: "Low" | "Medium" | "High" | "Very High";
  timeCommitment: string;
  capitalMin: string;
  description: string;
  steps: string[];
}) {
  return (
    <div className="my-6 border border-[var(--hw-border)] bg-[var(--hw-surface)]" style={{ borderRadius: "4px" }}>
      <div className="border-b border-[var(--hw-border)] px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)]">
            {title}
          </h3>
          <RiskBadge level={risk} />
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--hw-surface-raised)] px-2.5 py-0.5 text-xs text-[var(--hw-text-dim)]">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            {timeCommitment}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--hw-surface-raised)] px-2.5 py-0.5 text-xs text-[var(--hw-text-dim)]">
            Min: {capitalMin}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-[var(--hw-text-muted)] mb-4">{description}</p>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--hw-green-subtle)] text-[10px] font-bold text-[var(--hw-green)]">
                {i + 1}
              </span>
              <span className="text-sm text-[var(--hw-text-muted)]">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── NumberCallout ───────────────────────────────────────────── */

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--hw-green)] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--hw-green)]" />
    </span>
  );
}

export function NumberCallout({
  value,
  label,
  sub,
  isLive,
}: {
  value: string;
  label: string;
  sub?: string;
  isLive?: boolean;
}) {
  return (
    <div className="inline-flex flex-col items-center rounded border border-[var(--hw-border)] bg-[var(--hw-surface)] px-5 py-3 text-center" style={{ borderRadius: "4px" }}>
      {isLive && (
        <div className="mb-1">
          <LiveDot />
        </div>
      )}
      <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-green)]">
        {value}
      </div>
      <div className="text-xs font-medium text-[var(--hw-text)] mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-[var(--hw-text-dim)] mt-0.5">{sub}</div>}
    </div>
  );
}

/* Horizontal row of NumberCallouts */
export function NumberCalloutRow({ items }: { items: { value: string; label: string; sub?: string; isLive?: boolean }[] }) {
  return (
    <div className="my-6 flex flex-wrap gap-3">
      {items.map((item) => (
        <NumberCallout key={item.label} {...item} />
      ))}
    </div>
  );
}

/* ── BridgeComparisonTable ──────────────────────────────────── */

export function BridgeComparisonTable() {
  const bridges = [
    { name: "Across Protocol", time: "~30s", chains: "ETH, Arb, Base, OP", fee: "~0.05%", notes: "Fast fill model" },
    { name: "deBridge", time: "~1-2 min", chains: "10+ chains", fee: "0.04-0.1%", notes: "Decentralized validators" },
    { name: "LayerZero", time: "Varies", chains: "30+ chains", fee: "Variable", notes: "Omnichain messaging" },
    { name: "Official HL Bridge", time: "~5-20 min", chains: "Arbitrum only", fee: "Gas only", notes: "Most trusted" },
    { name: "Relay", time: "~1 min", chains: "ETH, Arb, Base", fee: "~0.05%", notes: "Fast" },
  ];

  return (
    <div className="my-6 overflow-x-auto border border-[var(--hw-border)]" style={{ borderRadius: "4px" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {["Bridge", "Typical Time", "Source Chains", "Typical Fee", "Notes"].map((h) => (
              <th key={h} className="border-b border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-3 text-left text-xs font-medium text-[var(--hw-text-dim)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bridges.map((b, i) => (
            <tr key={b.name} className={i % 2 === 1 ? "bg-[var(--hw-surface)]" : ""}>
              <td className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 font-medium text-[var(--hw-text)]">{b.name}</td>
              <td className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 text-[var(--hw-text-muted)]">{b.time}</td>
              <td className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 text-[var(--hw-text-muted)]">{b.chains}</td>
              <td className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 text-[var(--hw-text-muted)]">{b.fee}</td>
              <td className="border-b border-[var(--hw-border)] last:border-b-0 px-4 py-2.5 text-[var(--hw-text-dim)]">{b.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
