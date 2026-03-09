export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const allItems = [{ name: "Home", href: "https://perp.wiki" }, ...items];

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => {
      const isLast = i === allItems.length - 1;
      const entry: Record<string, unknown> = {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
      };
      if (!isLast) {
        entry.item = item.href;
      }
      return entry;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
