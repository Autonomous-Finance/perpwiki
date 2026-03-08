import Link from "next/link";
import type { LearnArticle } from "@/lib/learn-articles";

interface LearnLayoutProps {
  article: LearnArticle;
  prev: LearnArticle | null;
  next: LearnArticle | null;
  toc: { id: string; title: string }[];
  children: React.ReactNode;
}

export function LearnLayout({ article, prev, next, toc, children }: LearnLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-[var(--hw-text-dim)]">
        <Link href="/" className="hover:text-[var(--hw-text-muted)]">Home</Link>
        {" / "}
        <Link href="/learn" className="hover:text-[var(--hw-text-muted)]">Learn</Link>
        {" / "}
        <span className="text-[var(--hw-text-muted)]">{article.title}</span>
      </div>

      <div className="flex gap-10">
        {/* Sticky TOC — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20">
            <Link
              href="/learn"
              className="mb-6 block text-sm text-[var(--hw-green)] hover:text-[var(--hw-green-dim)]"
            >
              &larr; Back to Learn
            </Link>
            <nav className="space-y-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-xs text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <article className="min-w-0 flex-1 max-w-3xl">
          <header className="mb-8 border-b border-[var(--hw-border)] pb-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="bg-[var(--hw-green-subtle)] px-2 py-0.5 text-xs text-[var(--hw-green)]"
                style={{ borderRadius: "2px" }}
              >
                {article.category}
              </span>
              <span className="text-xs text-[var(--hw-text-dim)]">{article.readingTime} read</span>
            </div>
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--hw-text)] md:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 text-[var(--hw-text-muted)]">{article.description}</p>
          </header>

          <div className="prose-hw">{children}</div>

          {/* Prev/Next nav */}
          <nav className="mt-12 flex justify-between border-t border-[var(--hw-border)] pt-6">
            <div>
              {prev ? (
                <Link
                  href={`/learn/${prev.slug}`}
                  className="text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)]"
                >
                  &larr; {prev.title}
                </Link>
              ) : null}
            </div>
            <div>
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)]"
                >
                  {next.title} &rarr;
                </Link>
              ) : null}
            </div>
          </nav>
        </article>
      </div>
    </div>
  );
}

/* Reusable prose components for learn articles */
export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[var(--hw-text)] mt-10 mb-4 scroll-mt-20"
    >
      {children}
    </h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--hw-text-muted)] mb-4">{children}</p>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[var(--hw-green)] hover:text-[var(--hw-green-dim)] underline underline-offset-2">
      {children}
    </Link>
  );
}

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-[var(--hw-border)] bg-[var(--hw-surface)] px-4 py-2 text-left text-[var(--hw-text)] font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-[var(--hw-border)] px-4 py-2 text-[var(--hw-text-muted)]"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="my-8">
      <Link
        href={href}
        className="inline-block border border-[var(--hw-green)] px-5 py-2 text-sm font-medium text-[var(--hw-green)] hover:bg-[var(--hw-green-subtle)] transition-colors"
        style={{ borderRadius: "2px" }}
      >
        {children}
      </Link>
    </div>
  );
}
