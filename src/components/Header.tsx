"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/layer/hypercore", label: "HyperCore" },
  { href: "/layer/hyperevm", label: "HyperEVM" },
  { href: "/layer/hip3", label: "HIP-3" },
  { href: "/learn", label: "Learn" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hw-border)] bg-[var(--hw-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tracking-widest text-[var(--hw-text)]"
        >
          HYPE<span className="text-[var(--hw-green)] font-light">.WIKI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--hw-text-muted)] transition-colors hover:text-[var(--hw-text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-transform ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-[var(--hw-text-muted)] transition-transform ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-[var(--hw-border)] bg-[var(--hw-bg)] px-4 pb-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-[var(--hw-text-muted)] hover:text-[var(--hw-text)]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
