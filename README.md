# Pathway — Reference Designs

Stand-in, implementation-ready reference designs for the **Career Catalogue MVP (FR-01 → FR-04)**,
for the web and mobile teams. Source spec:
[Career Catalogue MVP — Functional Flow Specification](./Career%20Catalogue%20MVP%20—%20Functional%20Flow%20Specification%20(FR-01%20to%20FR-04).md)

These are live, clickable screens (Vite + React + Tailwind v4), not static mockups, so every
state in the spec (loading, empty, no-match, error, unavailable data…) can be shown for real.

## Run

```bash
npm install
npm run dev          # http://localhost:5178
```

| URL | What |
|---|---|
| `/board` | **Design board**: every screen × state in mobile (390×844) and desktop (1440×900) frames |
| `/start` | Clickable prototype from the first screen |

## Export PNGs for hand-off

```bash
npx playwright install chromium   # first time only
npm run export                    # → exports/<FR>/<id>--<mobile|desktop>.png (@2x, full page)
npm run export -- fr02 --mobile   # filter by id prefix / device
```

## Deploy

Deployed on Vercel from GitHub. `vercel.json` rewrites every path to `index.html` so client-side
routes (`/board`, `/start/about`, `/careers/...`) resolve on direct load and inside board frames.

## Structure

```
brand/              raw assets from the design team (drop here)
src/styles/tokens.css   ← ALL visual decisions: colors, type, radii, shadows
src/data/           typed data model (mirrors the spec) + illustrative mock content + mock API
src/components/ui/  shared primitives (Button, Badge, StatCard, StateMessage, …)
src/screens/fr0X/   one folder per functional requirement
src/board/          design board + registry of screens/states (also drives the exporter)
```

## Forcing states

Any screen URL accepts:

- `?scenario=loading | error | empty`: force the mock API state
- `?level=recent-graduate&interests=a,b&skills=c`: seed the session profile (only in `?frame` mode)
- Resources: `?report=<resourceId>` opens the report dialog; `?reported=<resourceId>` shows the submitted state

To add a screen or state to the board and the export, add one line to `src/board/registry.ts`.

> All salary/outlook figures and resources in `src/data/` are **illustrative placeholders**, not real statistics.
