export function FreshnessBadge({
  label = "Data verified",
  staticDate,
}: {
  label?: string;
  staticDate?: string;
}) {
  let timeText: string;

  if (staticDate) {
    const d = new Date(staticDate);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      timeText = "today";
    } else if (diffDays < 7) {
      timeText = `${diffDays}d ago`;
    } else if (diffDays < 30) {
      timeText = `${Math.floor(diffDays / 7)}w ago`;
    } else {
      timeText = d.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }
  } else {
    timeText = "just now";
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 border border-[var(--hw-green-subtle)] bg-[var(--hw-green-subtle)] px-2.5 py-1 text-[11px] text-[var(--hw-green)]"
      style={{ borderRadius: "2px" }}
    >
      {/* Check icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        {label} &middot; {timeText}
      </span>
    </span>
  );
}
