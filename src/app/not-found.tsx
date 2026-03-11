import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border border-[var(--hw-border)]"
        style={{ borderRadius: "4px", background: "var(--hw-surface)" }}
      >
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-3xl font-bold text-[var(--hw-text-dim)]">
          404
        </span>
      </div>
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--hw-text)] mb-3">
        Page not found
      </h1>
      <p className="text-sm text-[var(--hw-text-muted)] mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist on perp.wiki. It may have been moved or removed.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
          style={{ borderRadius: "4px", background: "var(--hw-green)", color: "var(--hw-bg)" }}
        >
          Browse All Projects
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-border-bright)] transition-all"
          style={{ borderRadius: "4px" }}
        >
          Go Home
        </Link>
      </div>
      <div className="text-left">
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text-dim)] uppercase tracking-wider mb-4">
          Popular Pages
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "Live Markets", href: "/markets", desc: "Real-time Hyperliquid market data" },
            { label: "Funding Rates", href: "/funding-rates", desc: "Live funding rates across all pairs" },
            { label: "Learn Hub", href: "/learn", desc: "Guides and tutorials" },
            { label: "Compare Projects", href: "/compare", desc: "Side-by-side protocol comparisons" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-3 border border-[var(--hw-border)] bg-[var(--hw-surface)] p-3 transition-all hover:border-[var(--hw-border-bright)]"
              style={{ borderRadius: "4px" }}
            >
              <div>
                <span className="text-sm font-medium text-[var(--hw-text)] group-hover:text-[var(--hw-green)] transition-colors">
                  {item.label}
                </span>
                <p className="text-xs text-[var(--hw-text-dim)] mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
