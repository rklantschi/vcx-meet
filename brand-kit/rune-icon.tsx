/**
 * CEMPilot AI mark — the Ansuz-inspired rune (single stave, two angled arms).
 * "Deliberately modern, not mystical." The SAME glyph is used two ways:
 *
 *   RuneIcon     — the bare rune, `currentColor` stroke. Use on AI surfaces so
 *                  it inherits the surrounding text color like a normal icon.
 *   AiRuneBadge  — the in-app functional AI mark: white rune inside a blue
 *                  (brand-accent / platform --primary) circle. This is the
 *                  PRODUCT finish of the rune. The GOLD finish belongs to the
 *                  logo (see brand-mark.tsx) and NEVER appears in the app UI.
 *
 * Zero dependencies (no clsx/cn, no UI lib) — copy as-is into any React/Next.js
 * project.
 */
import type React from "react"

export function RuneIcon({
  className,
  style,
  size,
  "aria-label": ariaLabel,
}: {
  className?: string
  style?: React.CSSProperties
  /** Pixel size shortcut; or size via className (e.g. `h-5 w-5`). */
  size?: number
  "aria-label"?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={size ? { width: size, height: size, ...style } : style}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path d="M8 3.5 V20.5" />
      <path d="M8 5 L17.5 9.5" />
      <path d="M8 11 L17.5 15.5" />
    </svg>
  )
}

export function AiRuneBadge({
  className,
  style,
  size = 20,
  runeSize = 12,
  "aria-label": ariaLabel,
}: {
  className?: string
  style?: React.CSSProperties
  size?: number
  runeSize?: number
  "aria-label"?: string
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9999px",
        width: size,
        height: size,
        background: "var(--brand-accent, #0f8bf0)",
        color: "#ffffff",
        ...style,
      }}
    >
      <RuneIcon size={runeSize} aria-label={ariaLabel} />
    </span>
  )
}
