# CEMPilot Brand Kit — Canonical

**This folder is the single source of truth for CEMPilot brand artifacts.** It
lives in `mplus-platform/brand-kit` (never wiped by a V0 refresh) and is
**propagated OUT** to every V0/product project. Never hand-edit a propagated
copy — change it here and re-push.

## What's inside

| File | What it is |
| --- | --- |
| `brand-mark.tsx` | The navy badge with the **brass** rune embedded. Doubles as the app icon. Identity finish. |
| `rune-icon.tsx` | `RuneIcon` (bare rune, `currentColor`) + `AiRuneBadge` (white rune in a blue circle = the in-app AI mark). Product finish. |
| `logo.tsx` | The full lockup: badge + "CEMPilot" wordmark (`CemPilotLogo`). |
| `brand-tokens.css` | Brand color tokens for `:root` and `.dark`. |
| `brand.ts` | Brand string constants (`BRAND.name`, `.short`, `.cem`, `.category`). |
| `icon.svg` | Ready-to-use favicon (colors baked in — CSS vars don't resolve for favicons). |
| `index.ts` | Barrel export. |

All `.tsx` files are **zero-dependency** (no `clsx`/`cn`, no UI library) so they
drop into any React/Next.js project as-is.

## Brand rules (do not drift)

1. **Name is `CEMPilot`** — one word. CEM = **Client Engagement Memory**. The
   wordmark renders "CEM" + "Pilot" two-tone with **no space**. Never "CEM Pilot"
   or "Customer Engagement Management". Authoritative: root `CLAUDE.md`
   (locked 2026-06-19).
2. **One brand hue: 207** (the platform `--primary`). All color conflicts resolve
   toward the platform, never the website.
3. **Gold is identity-only.** The brass rune (`--brand-gold`) appears on the
   **logo lockup and premium marketing only** — NEVER in the working UI. Inside
   the app the rune is the blue/white `AiRuneBadge`. Gold = identity; blue =
   product. Keeping them separate is what stops gold from fighting the app's
   semantic colors (warning/amber).
4. **The rune glyph is fixed** — one geometry, two finishes (brass logo / blue
   in-app). Don't recolor or restyle it per surface.
5. This is an **interim mark** pending trademark clearance. It's built to be
   swappable: change a file here, re-propagate, every surface follows.

## Adopt in a consuming project

1. **Copy** `brand-mark.tsx`, `rune-icon.tsx`, `logo.tsx` (+ `brand.ts` if you
   need the strings) into `components/brand/`.
2. **Tokens** — paste `brand-tokens.css` into the project's `globals.css` (merge
   the `:root` and `.dark` blocks). Tailwind v4: also map them in `@theme`
   (`--color-brand`, `--color-brand-accent`, `--color-brand-gold`, …). The
   project's own `--primary` should point at the brand accent (`207 89% 50%`).
3. **Favicon** — copy `icon.svg` to `app/icon.svg` (Next.js App Router picks it
   up automatically).

## Usage

```tsx
import { CemPilotLogo, BrandMark, RuneIcon, AiRuneBadge, BRAND } from "@/brand-kit"

<CemPilotLogo size="md" />          {/* full lockup */}
<CemPilotLogo variant="white" />    {/* on dark backgrounds */}
<CemPilotLogo iconOnly />           {/* badge only */}
<BrandMark style={{ width: 32, height: 32 }} />
<AiRuneBadge aria-label="AI" />     {/* in-app AI mark (blue/white) */}
<RuneIcon className="h-4 w-4 text-primary" aria-label="AI" />
{BRAND.name}                        {/* "CEMPilot" */}
```

## Propagation & sync

Distribution is **Claude-propagated copy** (the same discipline as V0 surgeries):
change this folder → push into each project repo (branch-direct where the project
still fetches our git; main-gated for `mplus-v0-designs`) → register the push.
Pulling a brand change *from* V0: cherry-pick it here first, then re-propagate.
A private shadcn/npm registry is the future "hands-off" option if we want it.

**Propagation targets:** `mplus-v0-designs` (platform), `v0-crm-application-design`
(CRM), `v0-vcx-mobile` (mobile), `v0-vortex-cx-website-build` (website).
