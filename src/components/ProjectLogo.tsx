"use client";

import { useState } from "react";

interface ProjectLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { container: "h-6 w-6", text: "text-[10px]", rounded: "rounded-full" },
  md: { container: "h-8 w-8", text: "text-xs", rounded: "rounded" },
  lg: { container: "h-16 w-16", text: "text-xl", rounded: "rounded-lg" },
} as const;

// Generate a consistent accent color from the project name
function nameToColor(name: string): string {
  const COLORS = [
    "#00E5A0", "#00C8E0", "#A78BFA", "#F0B429",
    "#FF6B8A", "#36D399", "#3B82F6", "#F472B6",
    "#34D399", "#FBBF24", "#818CF8", "#FB923C",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function ProjectLogo({ name, logoUrl, size = "sm", className = "" }: ProjectLogoProps) {
  const s = SIZES[size];
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${s.container} shrink-0 ${s.rounded} object-cover ${className}`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  const color = nameToColor(name);

  return (
    <span
      className={`flex ${s.container} shrink-0 items-center justify-center ${s.rounded} ${s.text} font-bold ${className}`}
      style={{
        background: `color-mix(in srgb, ${color} 20%, transparent)`,
        color,
      }}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
