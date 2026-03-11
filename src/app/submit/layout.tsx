import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Project",
  description:
    "Submit a Hyperliquid ecosystem project to be listed on perp.wiki — the independent directory for HyperCore, HyperEVM, and HIP-3.",
  alternates: { canonical: "https://perp.wiki/submit" },
  openGraph: {
    title: "Submit a Project | perp.wiki",
    description:
      "Know a Hyperliquid project that's missing? Submit it and we'll review it within 48 hours.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Submit a Project | perp.wiki",
    description:
      "Submit a Hyperliquid ecosystem project to be listed on perp.wiki.",
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
