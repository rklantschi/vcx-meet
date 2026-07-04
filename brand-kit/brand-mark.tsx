/**
 * CEMPilot brand mark — a rounded navy badge with the brass rune embedded.
 * Self-contained SVG (own background + rune) so it renders crisply at any size
 * and doubles as the app icon / favicon.
 *
 * This is the IDENTITY finish of the rune: brass (--brand-gold) on deep navy —
 * the premium logo lockup. The functional in-app AI mark uses the blue/white
 * finish instead (see AiRuneBadge in rune-icon.tsx). Gold lives here and in
 * brand marketing only; it never enters the working UI.
 *
 * Colors are driven by CSS variables (see brand-tokens.css) with hardcoded
 * fallbacks, so the mark renders correctly even before the tokens are added.
 *
 * Zero dependencies — copy as-is into any React/Next.js project.
 */
import type React from "react"

export function BrandMark({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="CEMPilot"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      <defs>
        <linearGradient id="cemp-badge" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand, #12324f)" />
          <stop offset="1" stopColor="var(--brand-dark, #0a1c30)" />
        </linearGradient>
      </defs>

      {/* Badge */}
      <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#cemp-badge)" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9.5"
        fill="none"
        stroke="var(--brand-foreground, #ffffff)"
        strokeOpacity="0.12"
      />

      {/* Rune — brass (identity finish) */}
      <g
        stroke="var(--brand-gold, #c7a861)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M13.5 9 V31" />
        <path d="M13.5 11.5 L27 18" />
        <path d="M13.5 20.5 L27 27" />
      </g>

      {/* Arm-tip nodes — same brass, jewel detail */}
      <g fill="var(--brand-gold, #c7a861)">
        <circle cx="27" cy="18" r="2.1" />
        <circle cx="27" cy="27" r="2.1" />
      </g>
    </svg>
  )
}
