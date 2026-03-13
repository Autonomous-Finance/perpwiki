export function stripLogoUrl<T extends { slug: string; logoUrl?: string | null }>(
  project: T
): T & { logoUrl: string | null } {
  if (!project.logoUrl) return { ...project, logoUrl: null };
  if (project.logoUrl.startsWith("data:")) {
    return { ...project, logoUrl: `/api/logo/${project.slug}` };
  }
  return project as T & { logoUrl: string | null };
}

export function stripLogoUrls<T extends { slug: string; logoUrl?: string | null }>(
  projects: T[]
): Array<T & { logoUrl: string | null }> {
  return projects.map(stripLogoUrl);
}
