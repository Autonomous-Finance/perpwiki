"use client";
import { useState, useCallback } from "react";
import { ProjectCard } from "./ProjectCard";

interface ProjectData {
  slug: string;
  name: string;
  tagline: string | null;
  category: string;
  layer: string;
  status: string;
  logoUrl: string | null;
  isVerified: boolean;
  tags: string;
}

interface LoadMoreProjectsProps {
  initialHasMore: boolean;
  layer?: string;
  category?: string;
  q?: string;
  sort?: string;
}

export function LoadMoreProjects({ initialHasMore, layer, category, q, sort }: LoadMoreProjectsProps) {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (layer) params.set("layer", layer);
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/projects/list?${params}`);
    const data = await res.json();
    setProjects((prev) => [...prev, ...data.projects]);
    setHasMore(data.hasMore);
    setPage((p) => p + 1);
    setLoading(false);
  }, [page, layer, category, q, sort]);

  return (
    <>
      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              name={project.name}
              tagline={project.tagline}
              layer={project.layer}
              category={project.category}
              status={project.status}
              isVerified={project.isVerified}
              logoUrl={project.logoUrl}
              tags={project.tags}
            />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium border border-[var(--hw-border)] text-[var(--hw-text-muted)] hover:border-[var(--hw-green)] hover:text-[var(--hw-green)] transition-all disabled:opacity-50"
            style={{ borderRadius: "4px" }}
          >
            {loading ? "Loading..." : "Load more projects"}
          </button>
        </div>
      )}
    </>
  );
}
