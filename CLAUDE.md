# Pathway reference designs — working notes

Purpose: stand-in designs for web + mobile teams implementing FR-01→FR-04. The spec markdown in this
folder is the source of truth; **do not add features it doesn't ask for** (no search, advanced filters,
pagination, accounts, completion tracking, extra screens).

## Conventions
- Style only through semantic tokens in `src/styles/tokens.css` (`bg-surface`, `text-ink-muted`, `bg-brand-600`…). Never raw hex or Tailwind default palette colors (`bg-indigo-500`) in screens, so re-theming stays a single-file change when brand assets land.
- Every screen reads data via `src/data/api.ts` so `?scenario=` can force loading/error/empty.
- Any new screen or state must get an entry in `src/board/registry.ts` (it feeds both `/board` and `npm run export`).
- Mobile-first responsive; frames are 390×844 and 1440×900.
- Brand is applied: purple `brand-*` ramp, orange `accent-*` ramp (sparing highlights only, never status), Google Sans Flex for headings (`font-display`, applied to h1–h3 by default), Figtree for body. Primary actions use `brand-600`, not 500: white on 500 fails AA contrast. See `brand/README.md` for the asset mapping.
- Buttons and inputs follow the design team's auth screen (`brand/Frame 24.png`). Primary buttons use a `brand-500` face with a 6px `brand-edge` bottom edge; secondary buttons use `grey-50` with a `grey-100` border and a soft 2px edge. Inputs are 42px tall with 8px radius. Use `Button` from `components/ui/Button.tsx` and `Input`/`Textarea`/`SelectField` from `components/ui/Field.tsx`.
- Dropdowns are shadcn/ui (Radix), never native `<select>`. shadcn components live in `src/components/shadcn/`: `components.json` points the `ui` alias there, because on Windows shadcn's lowercase `button.tsx` would overwrite our `Button.tsx`. Add more with `npx shadcn@latest add <name>`. shadcn's semantic CSS variables are mapped onto Pathway tokens in `src/styles/index.css`; don't give them their own colors.
- Design direction is settled; the inspiration step was skipped. `brand/` holds the raw design-team assets.

## Spec rules the UI encodes (keep them true)
- No auth walls anywhere. Onboarding input is session-only (`src/lib/session.ts`); `?frame` previews are in-memory only.
- Published content only; draft/retired careers exist in mock data on purpose to prove they're filtered.
- Missing stat → explicit "Unavailable" (never 0/blank/spinner). Median ≠ band. Pay ≠ outlook. Geographies grouped, never blended. Charts only for source-provided series.
- Time estimates only with assumptions; otherwise omitted.
- Steps addressed by stable `stepId`; all steps browsable.
- Resources: cost label always present; certification cost is a separate label; opening a link never marks complete; reporting never hides the card; reviewer note / last-checked are data-only, never shown.

## Open spec questions (interpretations made — confirm with product)
1. **Level vs filtering.** Spec says skipping step 2 shows the "full unfiltered catalogue" but also mentions level filters returning zero. Current design: level *prioritises* (best-fit first + badge); only optional skills/interests *filter*.
2. **Required prerequisite gate.** There's no completion tracking in MVP, so a hard lock would lock forever. Current design: a warning badge on the roadmap plus a callout on the step, and the step is still readable.
3. **Career with no roadmap / step with no resources.** Not covered by spec; shown as "coming soon".
