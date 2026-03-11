export async function register() {
  // Boot-time self-heal: convert remote logo URLs to base64
  // Only runs on the server (not edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { healLogos } = await import("@/lib/logo-selfheal");
    // Run async — don't block server startup
    healLogos().catch((err) => {
      console.error("[instrumentation] Logo self-heal error:", err);
    });
  }
}
