import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--hw-border)] bg-[var(--hw-bg)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-sm text-[var(--hw-text-dim)] md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-widest text-[var(--hw-text)]">
              PERP<span className="text-[var(--hw-green)] font-light">.WIKI</span>
            </span>
          </div>
          <span className="text-xs text-[var(--hw-text-dim)]">
            &copy; 2026 PerpWiki. Independent. Not affiliated with Hyperliquid.
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/projects" className="hover:text-[var(--hw-text-muted)]">
            Projects
          </Link>
          <Link href="/learn" className="hover:text-[var(--hw-text-muted)]">
            Learn
          </Link>
          <Link href="/submit" className="hover:text-[var(--hw-text-muted)]">
            Submit
          </Link>
        </div>
      </div>
    </footer>
  );
}
