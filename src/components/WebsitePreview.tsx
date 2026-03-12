"use client";

import { useState, useCallback, useRef } from "react";

interface WebsitePreviewProps {
  url: string;
  name: string;
}

export function WebsitePreview({ url, name }: WebsitePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const enableInteraction = useCallback(() => {
    setInteractive(true);
  }, []);

  const disableInteraction = useCallback(() => {
    setInteractive(false);
  }, []);

  const truncatedUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const displayUrl =
    truncatedUrl.length > 40
      ? truncatedUrl.slice(0, 37) + "..."
      : truncatedUrl;

  return (
    <div
      className="overflow-hidden border border-[var(--hw-border)] bg-[var(--hw-surface)]"
      style={{ borderRadius: "4px" }}
    >
      {/* Browser chrome top bar */}
      <div
        className="flex items-center gap-2 border-b border-[var(--hw-border)] bg-[var(--hw-surface-raised)] px-3 py-2"
      >
        {/* Green dot */}
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: "var(--hw-green)" }}
        />

        {/* URL display */}
        <span
          className="min-w-0 flex-1 truncate font-mono text-xs"
          style={{ color: "var(--hw-text-dim)" }}
          title={url}
        >
          {displayUrl}
        </span>

        {/* Open external link button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex shrink-0 items-center gap-1 border border-[var(--hw-border)] px-2 py-0.5 text-xs transition-colors hover:border-[var(--hw-border-bright)]"
          style={{
            borderRadius: "4px",
            color: "var(--hw-text-muted)",
            backgroundColor: "var(--hw-surface)",
          }}
        >
          Open
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.5 1.5H2a.5.5 0 00-.5.5v8a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V7.5" />
            <path d="M7.5 1.5H10.5V4.5" />
            <path d="M10.5 1.5L5.5 6.5" />
          </svg>
        </a>
      </div>

      {/* 16:9 aspect ratio container */}
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        {/* Loading skeleton */}
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--hw-surface)]" aria-hidden="true" data-nosnippet>
            <div className="h-full w-full animate-pulse bg-[var(--hw-surface-raised)]">
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div
                  className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
                  style={{
                    borderTopColor: "var(--hw-green)",
                    borderRightColor: "var(--hw-green)",
                  }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--hw-text-dim)" }}
                >
                  Loading preview...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error fallback */}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[var(--hw-surface)]">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--hw-green-subtle, rgba(0,229,160,0.08))" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--hw-text-dim)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <circle cx="7" cy="6" r="0.5" fill="var(--hw-text-dim)" />
                <circle cx="10" cy="6" r="0.5" fill="var(--hw-text-dim)" />
              </svg>
            </div>
            <span className="text-sm" style={{ color: "var(--hw-text-muted)" }}>
              Preview unavailable for {name}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="border px-4 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--hw-surface-raised)]"
              style={{
                borderRadius: "4px",
                borderColor: "var(--hw-green)",
                color: "var(--hw-green)",
              }}
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Iframe */}
        {!error && (
          <iframe
            ref={iframeRef}
            src={url}
            title={`${name} website preview`}
            sandbox="allow-scripts allow-same-origin allow-popups"
            className={`h-full w-full border-0 bg-white ${interactive ? "" : "pointer-events-none"}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* Click-to-interact overlay */}
        {!error && !loading && !interactive && (
          <div
            className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center transition-opacity"
            onClick={enableInteraction}
            onMouseLeave={disableInteraction}
          >
            <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity hover:opacity-100" />
            <span
              className="relative z-10 border px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity [div:hover>&]:opacity-100"
              style={{
                borderRadius: "4px",
                backgroundColor: "var(--hw-surface-raised)",
                borderColor: "var(--hw-border-bright)",
                color: "var(--hw-text)",
              }}
            >
              Click to interact
            </span>
          </div>
        )}

        {/* Active interaction indicator + click-away to disable */}
        {!error && interactive && (
          <button
            className="absolute right-2 top-2 z-20 border px-2 py-0.5 text-[10px] transition-colors hover:border-[var(--hw-border-bright)]"
            style={{
              borderRadius: "4px",
              backgroundColor: "var(--hw-surface)",
              borderColor: "var(--hw-border)",
              color: "var(--hw-text-dim)",
            }}
            onClick={disableInteraction}
          >
            Exit preview
          </button>
        )}
      </div>
    </div>
  );
}
