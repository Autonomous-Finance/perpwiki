/**
 * Boot-time self-heal: convert any remaining remote logo URLs to base64.
 * Called once on server startup via instrumentation.ts.
 */
import { prisma } from "@/lib/prisma";
import { isRemoteUrl, fetchLogoAsBase64 } from "@/lib/logo-utils";

export async function healLogos() {
  try {
    const projects = await prisma.project.findMany({
      select: { slug: true, logoUrl: true },
    });

    const remoteLogos = projects.filter((p) => isRemoteUrl(p.logoUrl));
    if (remoteLogos.length === 0) {
      console.log("[logo-selfheal] All logos are already data URLs.");
      return;
    }

    console.log(`[logo-selfheal] Converting ${remoteLogos.length} remote logos to base64...`);

    let converted = 0;
    let failed = 0;

    for (const project of remoteLogos) {
      const base64 = await fetchLogoAsBase64(project.logoUrl!);
      if (base64) {
        await prisma.project.update({
          where: { slug: project.slug },
          data: { logoUrl: base64 },
        });
        converted++;
      } else {
        console.warn(`[logo-selfheal] Failed to convert: ${project.slug} (${project.logoUrl})`);
        failed++;
      }
    }

    console.log(`[logo-selfheal] Done: ${converted} converted, ${failed} failed.`);
  } catch (err) {
    console.error("[logo-selfheal] Error:", err);
  }
}
