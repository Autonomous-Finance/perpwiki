const INDEXNOW_KEY = "dd886eea0392efa3b82dab2a281a4100";
const SITE_URL = "https://perp.wiki";

export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return;
  const batches = [];
  for (let i = 0; i < urls.length; i += 100) {
    batches.push(urls.slice(i, i + 100));
  }
  for (const batch of batches) {
    try {
      await fetch("https://api.indexnow.org/IndexNow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "perp.wiki",
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
      });
    } catch { /* non-critical */ }
  }
}
