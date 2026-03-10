/**
 * perp.wiki Logo — Infinity arrow mark + wordmark
 *
 * Two arrows forming a perpetual loop, representing perpetual futures.
 * Clean, geometric, crypto-native.
 */

interface PerpLogoProps {
  size?: number;
  variant?: "full" | "icon" | "wordmark";
  className?: string;
}

export function PerpLogo({ size = 32, variant = "full", className }: PerpLogoProps) {
  const iconSize = size;
  const green = "#00E5A0";

  // Infinity arrow icon — two opposing arrows forming a loop
  const icon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left loop */}
      <path
        d="M10 11C7.5 11 4 13 4 16C4 19 7.5 21 10 21C12 21 14 19.5 16 17"
        stroke={green}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right loop */}
      <path
        d="M22 21C24.5 21 28 19 28 16C28 13 24.5 11 22 11C20 11 18 12.5 16 15"
        stroke={green}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow tip on right side */}
      <path
        d="M14 13L16.5 15L14 17"
        stroke={green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Arrow tip on left side */}
      <path
        d="M18 19L15.5 17L18 15"
        stroke={green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
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
          letterSpacing: "0.1em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#E8F4F0" }}>PERP</span>
        <span style={{ color: green, fontWeight: 300 }}>.WIKI</span>
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
        gap: size * 0.25,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.55,
          letterSpacing: "0.1em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: "#E8F4F0" }}>PERP</span>
        <span style={{ color: green, fontWeight: 300 }}>.WIKI</span>
      </span>
    </span>
  );
}
