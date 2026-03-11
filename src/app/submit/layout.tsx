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
    url: "https://perp.wiki/submit",
    siteName: "perp.wiki",
    images: [{ url: "/submit/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@perpwiki",
    title: "Submit a Project | perp.wiki",
    description:
      "Submit a Hyperliquid ecosystem project to be listed on perp.wiki.",
    images: ["/submit/opengraph-image"],
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
