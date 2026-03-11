/**
 * Logo utility: fetch remote logos and convert to base64 data URLs.
 * This ensures logos persist even if the upstream CDN changes or goes down.
 */

const TIMEOUT_MS = 8000;

/**
 * Fetch a remote image URL and return a base64 data URL.
 * Returns null if fetch fails (timeout, 404, etc).
 */
export async function fetchLogoAsBase64(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "image/*" },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0) return null;

    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

/** Check if a URL is already a data URL */
export function isDataUrl(url: string | null | undefined): boolean {
  return !!url && url.startsWith("data:");
}

/** Check if a URL is an HTTP(S) URL that should be converted */
export function isRemoteUrl(url: string | null | undefined): boolean {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}

/**
 * Convert a logo URL to base64 if it's a remote URL.
 * If already a data URL, returns as-is.
 * If fetch fails, returns the original URL unchanged.
 */
export async function ensureBase64Logo(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  if (isDataUrl(url)) return url;
  if (!isRemoteUrl(url)) return url;

  const base64 = await fetchLogoAsBase64(url);
  return base64 || url; // fallback to original if conversion fails
}
