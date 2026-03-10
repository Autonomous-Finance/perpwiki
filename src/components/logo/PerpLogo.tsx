/**
 * perp.wiki Logo — Perpetual infinity mark
 *
 * A stylized infinity symbol with integrated arrow tips and a center
 * diamond accent, representing perpetual futures and continuous flow.
 * The design is more distinctive with varying stroke widths and
 * a geometric accent point at the crossover.
 */

interface PerpLogoProps {
  size?: number;
  variant?: "full" | "icon" | "wordmark";
  className?: string;
}

export function PerpLogo({ size = 32, variant = "full", className }: PerpLogoProps) {
  const iconSize = size;
  const green = "var(--hw-green, #00E5A0)";

  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left loop — thicker flowing curve */}
      <path
        d="M16 14.5C14 11.5 11 9.5 8.5 9.5C5.5 9.5 3 12 3 16C3 20 5.5 22.5 8.5 22.5C11 22.5 14 20.5 16 17.5"
        stroke={green}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right loop — thicker flowing curve */}
      <path
        d="M16 17.5C18 20.5 21 22.5 23.5 22.5C26.5 22.5 29 20 29 16C29 12 26.5 9.5 23.5 9.5C21 9.5 18 11.5 16 14.5"
        stroke={green}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center diamond accent — geometric crossover point */}
      <rect
        x="14"
        y="14"
        width="4"
        height="4"
        rx="0.5"
        transform="rotate(45 16 16)"
        fill={green}
      />
      {/* Right arrow tip */}
      <path
        d="M25.5 12L28 14.5"
        stroke={green}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Left arrow tip */}
      <path
        d="M6.5 20L4 17.5"
        stroke={green}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === "icon") {
    return <span className={className}>{icon}</span>;
  }

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.55,
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "var(--hw-text, #E8F4F0)" }}>PERP</span>
        <span style={{ color: green, fontWeight: 400 }}>.</span>
        <span style={{ color: "var(--hw-text-muted, #9CB8AE)", fontWeight: 400 }}>WIKI</span>
      </span>
    );
  }

  // Full variant: icon + wordmark
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.2,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.55,
          letterSpacing: "0.08em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "var(--hw-text, #E8F4F0)" }}>PERP</span>
        <span style={{ color: green, fontWeight: 400 }}>.</span>
        <span style={{ color: "var(--hw-text-muted, #9CB8AE)", fontWeight: 400 }}>WIKI</span>
      </span>
    </span>
  );
}
