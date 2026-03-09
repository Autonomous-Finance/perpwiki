"use client";

import { useState } from "react";

interface Step {
  title: string;
  content: string;
  tip?: string;
}

function StepItem({
  step,
  index,
  isOpen,
  onToggle,
}: {
  step: Step;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <button
          onClick={onToggle}
          className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold font-[family-name:var(--font-jetbrains-mono)] transition-colors lg:cursor-default"
          style={{
            borderColor: isOpen ? "var(--hw-green)" : "var(--hw-border)",
            backgroundColor: isOpen
              ? "var(--hw-green-subtle)"
              : "var(--hw-surface)",
            color: isOpen ? "var(--hw-green)" : "var(--hw-text-dim)",
          }}
        >
          {index + 1}
        </button>
        {/* Vertical line */}
        <div
          className="w-px flex-1 min-h-4"
          style={{ backgroundColor: "var(--hw-border)" }}
        />
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className="text-left w-full lg:cursor-default"
        >
          <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--hw-text)] mb-1 flex items-center justify-between">
            <span>{step.title}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={`shrink-0 text-[var(--hw-text-dim)] transition-transform lg:hidden ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h4>
        </button>

        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100"
          }`}
        >
          <p className="text-sm text-[var(--hw-text-muted)] leading-relaxed mt-1">
            {step.content}
          </p>

          {step.tip && (
            <div
              className="mt-3 border bg-[var(--hw-surface)] p-3 text-xs text-[var(--hw-text-muted)]"
              style={{
                borderColor: "var(--hw-green-subtle)",
                borderLeft: "3px solid var(--hw-green)",
                borderRadius: "4px",
              }}
            >
              <span className="font-semibold text-[var(--hw-green)] mr-1">
                Tip:
              </span>
              {step.tip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepByStep({ steps }: { steps: Step[] }) {
  const [openSteps, setOpenSteps] = useState<Set<number>>(
    () => new Set(steps.map((_, i) => i))
  );

  const toggle = (index: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="my-6">
      {steps.map((step, i) => (
        <StepItem
          key={i}
          step={step}
          index={i}
          isOpen={openSteps.has(i)}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}
