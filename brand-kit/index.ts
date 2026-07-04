/**
 * CEMPilot brand kit — the single source of truth for brand artifacts.
 *
 * CANONICAL COPY lives in `mplus-platform/brand-kit`. It is propagated OUT to
 * each V0 project's `components/brand/` (or `brand-kit/`) via the same
 * surgery-style push we use for V0 wiring: edit here, push to each repo, bump
 * the register. Do NOT hand-edit the propagated copies — change them here.
 *
 * Import brand components from the barrel so any change renders everywhere:
 *   import { BrandMark, RuneIcon, AiRuneBadge, CemPilotLogo, BRAND } from '@/brand-kit'
 */
export { BrandMark } from "./brand-mark"
export { RuneIcon, AiRuneBadge } from "./rune-icon"
export { CemPilotLogo } from "./logo"
export { BRAND } from "./brand"
export type { Brand } from "./brand"
