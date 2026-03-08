import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "anthropic-ai", "ClaudeBot", "Claude-Web", "CCBot"],
        disallow: "/",
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4000"}/sitemap.xml`,
  };
}
