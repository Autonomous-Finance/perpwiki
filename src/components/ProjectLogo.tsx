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

export function ProjectLogo({ name, logoUrl, size = "sm", className = "" }: ProjectLogoProps) {
  const s = SIZES[size];

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${s.container} shrink-0 ${s.rounded} object-cover ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex ${s.container} shrink-0 items-center justify-center ${s.rounded} ${s.text} font-bold text-[var(--hw-bg)] ${className}`}
      style={{ background: "var(--hw-text-dim)" }}
    >
      {name.charAt(0)}
    </span>
  );
}
