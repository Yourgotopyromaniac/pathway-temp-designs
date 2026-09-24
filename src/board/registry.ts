/**
 * Every screen × state the teams need a reference for.
 * Used by the design board (/board) AND the PNG exporter (scripts/export-screens.mjs),
 * so keep this file dependency-free plain TypeScript.
 *
 * `path` may seed session state (level, interests, skills) and force states
 * (scenario=loading|error|empty). `?frame` is appended automatically.
 */

export type FR = 'FR-01' | 'FR-02' | 'FR-03' | 'FR-04'

export interface BoardEntry {
  id: string
  fr: FR
  title: string
  path: string
  /** What this frame demonstrates — the spec rule a developer should notice */
  note?: string
}

export const DEVICES = {
  mobile: { label: 'Mobile', width: 390, height: 844 },
  desktop: { label: 'Desktop', width: 1440, height: 900 },
} as const

export type DeviceId = keyof typeof DEVICES

export const FR_TITLES: Record<FR, string> = {
  'FR-01': 'Onboard & explore the catalogue',
  'FR-02': 'Understand a career & its outlook',
  'FR-03': 'Follow a roadmap',
  'FR-04': 'Open curated learning resources',
}

const L = 'level=recent-graduate'
const FE = '/careers/frontend-developer'

export const BOARD: BoardEntry[] = [
  // FR-01
  { id: 'fr01-level-empty', fr: 'FR-01', title: 'Choose a level', path: '/start', note: 'Step 1. No account. Continue disabled until a level is picked.' },
  { id: 'fr01-level-selected', fr: 'FR-01', title: 'Choose a level — selected', path: `/start?${L}` },
  { id: 'fr01-about', fr: 'FR-01', title: 'Optional details', path: `/start/about?${L}`, note: 'Step 2 is fully skippable → “Skip for now” shows the unfiltered catalogue.' },
  { id: 'fr01-about-select', fr: 'FR-01', title: 'Optional details — select open', path: `/start/about?${L}&open=degree`, note: 'shadcn Select (not native) styled like the auth-screen input.' },
  { id: 'fr01-about-skills', fr: 'FR-01', title: 'Optional details — skills suggestions', path: `/start/about?${L}&open=skills`, note: 'shadcn Popover combobox: pick a suggestion or add free text.' },
  { id: 'fr01-catalogue', fr: 'FR-01', title: 'Catalogue', path: `/careers?${L}`, note: 'Level switcher always visible; level prioritises, never hides. Published careers only.' },
  { id: 'fr01-catalogue-filtered', fr: 'FR-01', title: 'Catalogue — filtered by interests', path: `/careers?${L}&interests=frontend development&skills=javascript` },
  { id: 'fr01-catalogue-loading', fr: 'FR-01', title: 'Catalogue — loading', path: `/careers?${L}&scenario=loading` },
  { id: 'fr01-catalogue-empty', fr: 'FR-01', title: 'Catalogue — no careers at all', path: `/careers?${L}&scenario=empty`, note: 'No “clear filters” action — there is nothing to filter.' },
  { id: 'fr01-catalogue-no-match', fr: 'FR-01', title: 'Catalogue — filtered to zero', path: `/careers?${L}&interests=marine biology`, note: 'Offers “Clear filters” to return to the full catalogue.' },
  { id: 'fr01-catalogue-error', fr: 'FR-01', title: 'Catalogue — failed to load', path: `/careers?${L}&scenario=error`, note: 'Retry action.' },

  // FR-02
  { id: 'fr02-detail', fr: 'FR-02', title: 'Career detail — full data', path: FE, note: 'Fixed section order. Pay vs outlook separate; geographies grouped, never blended; median ≠ band; series chart only because the source provides one.' },
  { id: 'fr02-detail-unavailable', fr: 'FR-02', title: 'Career detail — missing values', path: '/careers/data-analyst', note: 'Explicit “Unavailable” for missing values — never 0, blank or spinner.' },
  { id: 'fr02-detail-no-roadmap', fr: 'FR-02', title: 'Career detail — no roadmap yet', path: '/careers/ux-researcher' },
  { id: 'fr02-detail-loading', fr: 'FR-02', title: 'Career detail — loading', path: `${FE}?scenario=loading` },
  { id: 'fr02-detail-error', fr: 'FR-02', title: 'Career detail — failed to load', path: `${FE}?scenario=error` },

  // FR-03
  { id: 'fr03-roadmap', fr: 'FR-03', title: 'Roadmap', path: `${FE}/roadmap`, note: 'Recommended order, every step open. Only the explicitly required prerequisite is flagged.' },
  { id: 'fr03-step', fr: 'FR-03', title: 'Step — estimate with assumptions', path: `${FE}/roadmap/fe-html`, note: 'No prerequisites → section hidden. Estimate shown with its assumptions.' },
  { id: 'fr03-step-no-estimate', fr: 'FR-03', title: 'Step — estimate omitted', path: `${FE}/roadmap/fe-css`, note: 'Source estimate has no assumptions → not shown at all.' },
  { id: 'fr03-step-required', fr: 'FR-03', title: 'Step — required prerequisite', path: `${FE}/roadmap/fe-react` },
  { id: 'fr03-step-no-resources', fr: 'FR-03', title: 'Step — no resources yet', path: `${FE}/roadmap/fe-portfolio` },
  { id: 'fr03-roadmap-loading', fr: 'FR-03', title: 'Roadmap — loading', path: `${FE}/roadmap?scenario=loading` },

  // FR-04
  { id: 'fr04-resources', fr: 'FR-04', title: 'Resources — mixed costs', path: `${FE}/roadmap/fe-html/resources`, note: 'Cost label always present: free / paid / unknown.' },
  { id: 'fr04-resources-cert', fr: 'FR-04', title: 'Resources — separate certification cost', path: `${FE}/roadmap/fe-js/resources`, note: 'Course access and certification cost shown as two labels.' },
  { id: 'fr04-report', fr: 'FR-04', title: 'Report an issue — dialog', path: `${FE}/roadmap/fe-js/resources?report=r-meta-cert`, note: 'Bottom sheet on mobile, modal on desktop.' },
  { id: 'fr04-reported', fr: 'FR-04', title: 'Report an issue — submitted', path: `${FE}/roadmap/fe-js/resources?reported=r-meta-cert`, note: 'Reported resource stays visible.' },
  { id: 'fr04-resources-error', fr: 'FR-04', title: 'Resources — failed to load', path: `${FE}/roadmap/fe-js/resources?scenario=error` },
]

export function framedUrl(path: string) {
  return path + (path.includes('?') ? '&' : '?') + 'frame'
}
