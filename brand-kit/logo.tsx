import { BrandMark } from "./brand-mark"

/**
 * CEMPilot lockup — brand mark + "CEMPilot" wordmark.
 *
 * The wordmark is ONE word, rendered two-tone: "CEM" in the ink color and
 * "Pilot" in the brand accent (207 blue). No space between them — the brand is
 * "CEMPilot", not "CEM Pilot".
 *
 * - `variant="white"` for dark backgrounds.
 * - `iconOnly` renders just the badge.
 *
 * Zero external dependencies (no `cn`/clsx) — copy as-is.
 */
interface LogoProps {
  className?: string
  variant?: "default" | "white"
  size?: "sm" | "md" | "lg"
  /** Hide the wordmark and show only the logo badge. */
  iconOnly?: boolean
}

export function CemPilotLogo({
  className,
  variant = "default",
  size = "md",
  iconOnly = false,
}: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 44 }
  const px = sizes[size]
  const textColor = variant === "white" ? "#ffffff" : "var(--foreground, #0f172a)"
  const accentColor =
    variant === "white" ? "var(--brand-accent, #60A5FA)" : "var(--brand-wordmark, #0f8bf0)"
  const fontSize = size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1.25rem"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }} className={className}>
      <BrandMark style={{ width: px, height: px, borderRadius: 8 }} />
      {!iconOnly && (
        <span
          style={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: textColor,
            fontSize,
          }}
        >
          CEM<span style={{ color: accentColor }}>Pilot</span>
        </span>
      )}
    </div>
  )
}
