"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PerpLogo } from "@/components/logo/PerpLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/markets", label: "Markets" },
  { href: "/funding-rates", label: "Funding" },
  { href: "/stats", label: "Stats" },
  { href: "/projects", label: "Projects" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Tools" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function triggerSearch() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hw-border)] bg-[var(--hw-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center" aria-label="perp.wiki home">
          <PerpLogo size={28} variant="full" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 text-sm transition-colors rounded-sm ${
                  isActive
                    ? "text-[var(--hw-green)] bg-[var(--hw-green-subtle)]"
                    : "text-[var(--hw-text-muted)] hover:text-[var(--hw-text)] hover:bg-[var(--hw-surface-raised)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Search button */}
          <button
            onClick={triggerSearch}
            className="ml-2 flex items-center gap-2 px-2.5 py-1.5 text-sm text-[var(--hw-text-dim)] border border-[var(--hw-border)] rounded-sm hover:border-[var(--hw-border-bright)] hover:text-[var(--hw-text-muted)] transition-colors"
            aria-label="Search (Cmd+K)"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <kbd className="text-[10px] font-[family-name:var(--font-jetbrains-mono)] opacity-60">⌘K</kbd>
          </button>

          <Link
            href="/submit"
            className="ml-1 px-3 py-1.5 text-sm font-medium text-[var(--hw-bg)] bg-[var(--hw-green)] rounded-sm hover:opacity-90 transition-opacity"
          >
            Submit
          </Link>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile: search + theme + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={triggerSearch}
            className="flex items-center justify-center h-9 w-9 text-[var(--hw-text-dim)] hover:text-[var(--hw-text-muted)] transition-colors"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <ThemeToggle />
          <button
            className="flex flex-col justify-center items-center h-9 w-9 gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-transform duration-200 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-transform duration-200 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-14 z-40 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="mobile-menu-enter fixed left-0 right-0 top-14 z-50 border-t border-[var(--hw-border)] bg-[var(--hw-bg)] px-4 pb-6 pt-2 md:hidden max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 py-3 text-sm border-b border-[var(--hw-border)]/50 transition-colors ${
                    isActive
                      ? "text-[var(--hw-green)]"
                      : "text-[var(--hw-text-muted)] active:text-[var(--hw-text)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--hw-green)]" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/glossary"
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3 text-sm text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]/50"
            >
              Glossary
            </Link>
            <Link
              href="/faq"
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3 text-sm text-[var(--hw-text-muted)] border-b border-[var(--hw-border)]/50"
            >
              FAQ
            </Link>
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center mt-4 py-3 text-sm font-medium text-[var(--hw-bg)] bg-[var(--hw-green)] rounded-sm"
            >
              Submit a Project
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
