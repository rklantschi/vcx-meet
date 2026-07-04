/**
 * CEMPilot brand string constants — single source of truth.
 *
 * Authoritative per the platform brand decision (root CLAUDE.md, locked
 * 2026-06-19): the brand is "CEMPilot" (one word), CEM = "Client Engagement
 * Memory". Do NOT use "CEM Pilot" (spaced) or "Customer Engagement Management".
 *
 * Import these instead of hardcoding the name/tagline anywhere, so the eventual
 * trademark-cleared final brand is a one-file change that propagates.
 */
export const BRAND = {
  /** Public product brand — one word. */
  name: "CEMPilot",
  /** Internal short reference. */
  short: "cmp",
  /** What CEM expands to. */
  cem: "Client Engagement Memory",
  /** Category line. */
  category: "Your Client Engagement Companion",
} as const

export type Brand = typeof BRAND
