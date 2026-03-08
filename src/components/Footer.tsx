import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--hw-border)] bg-[var(--hw-bg)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-sm text-[var(--hw-text-dim)] md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-widest text-[var(--hw-text)]">
            HYPE<span className="text-[var(--hw-blue)] font-light">.WIKI</span>
          </span>
          <span className="text-[var(--hw-text-dim)]">
            &mdash; The Hyperliquid Ecosystem Directory
          </span>
        </div>
        <div className="flex gap-4">
          <Link href="/projects" className="hover:text-[var(--hw-text-muted)]">
            Projects
          </Link>
          <Link href="/submit" className="hover:text-[var(--hw-text-muted)]">
            Submit
          </Link>
        </div>
      </div>
    </footer>
  );
}
