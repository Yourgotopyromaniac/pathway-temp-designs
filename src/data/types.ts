/**
 * Data model for FR-01 → FR-04. Mirrors the functional spec so the reference
 * designs show exactly the fields engineering will receive — no more, no less.
 */

export type ContentStatus = 'draft' | 'published' | 'retired'

// ── FR-01 ────────────────────────────────────────────────────────────────────

export type CareerLevel = 'university-student' | 'recent-graduate' | 'early-career'

export const CAREER_LEVELS: { id: CareerLevel; label: string; blurb: string }[] = [
  { id: 'university-student', label: 'University student', blurb: 'Currently studying and exploring options' },
  { id: 'recent-graduate', label: 'Recent graduate', blurb: 'Finished studies within the last couple of years' },
  { id: 'early-career', label: 'Early-career professional', blurb: 'A few years into work and looking ahead' },
]

/** Optional onboarding input. Session-only — never persisted beyond the tab. */
export interface SessionProfile {
  level: CareerLevel | null
  education: { degree: string; field: string }
  experience: { years: string; internships: string }
  skills: string[]
  interests: string[]
}

// ── FR-02 ────────────────────────────────────────────────────────────────────

/** Metadata every statistic must carry (FR-02 step 3). */
export interface StatMeta {
  id: string
  /** e.g. "U.S. Bureau of Labor Statistics" */
  source: string
  /** e.g. "May 2024", "2023–2033" */
  period: string
  /** e.g. "United States". Never blended across geographies. */
  geography: string
  /** Plain-language meaning, e.g. "Median annual salary" */
  meaning: string
}

export type PayPeriod = 'year' | 'month' | 'hour'
export type ExperienceScope = 'entry-level' | 'mid-career' | 'senior'
export type PayBasis = 'gross' | 'net' | 'unspecified'

interface SalaryMeta extends StatMeta {
  currency: string // ISO code: USD, NGN, GBP
  payPeriod: PayPeriod
  /** Only when the source explicitly scopes it. A median is NOT entry-level by default. */
  experienceLevel?: ExperienceScope
  basis: PayBasis
}

export interface SalaryMedianStat extends SalaryMeta {
  kind: 'salary-median'
  value: number | null // null → render "Unavailable"
}

export interface SalaryRangeStat extends SalaryMeta {
  kind: 'salary-range'
  low: { label: string; value: number | null } // e.g. "25th percentile"
  high: { label: string; value: number | null } // e.g. "75th percentile"
}

export interface ProjectionStat extends StatMeta {
  kind: 'employment-projection'
  /** Percent change over the period, e.g. 8 → "+8%" */
  value: number | null
  /** Only present when the SOURCE itself is a time/projection series. Never synthesised. */
  series?: { label: string; value: number }[]
  seriesUnit?: string // e.g. "jobs (thousands)"
}

export interface DemandStat extends StatMeta {
  kind: 'demand'
  value: 'Low' | 'Moderate' | 'High' | 'Very high' | null
}

export type SalaryStat = SalaryMedianStat | SalaryRangeStat
export type OutlookStat = ProjectionStat | DemandStat
export type Statistic = SalaryStat | OutlookStat

export interface EntryConsideration {
  label: string // "Typical education", "Key skills", "Certifications"
  detail: string
}

export interface Career {
  id: string
  status: ContentStatus
  title: string
  /** Concise description shown on catalogue cards */
  description: string
  /** Levels this career is a strong fit for — used for prioritisation */
  levels: CareerLevel[]
  /** Keywords matched against optional skills/interests */
  tags: string[]
  roleSummary: string
  workActivities: string[]
  entryConsiderations: EntryConsideration[]
  roadmapId: string | null
  stats: Statistic[]
}

// ── FR-03 ────────────────────────────────────────────────────────────────────

export interface TimeEstimate {
  hours: number
  /** Required whenever an estimate is shown. No assumptions → estimate is omitted. */
  assumptions: { priorKnowledge?: string; weeklyStudyHours?: number } | null
}

export interface RoadmapStep {
  /** Stable ID — never an array index */
  stepId: string
  title: string
  learningObjective: string
  prerequisites: string[]
  /** Only set when a prerequisite is explicitly justified as required */
  requiredPrerequisiteStepId?: string
  expectedEvidence: string
  estimate?: TimeEstimate
  resourceIds: string[]
}

export interface Roadmap {
  id: string
  careerId: string
  title: string
  steps: RoadmapStep[]
}

// ── FR-04 ────────────────────────────────────────────────────────────────────

export type CostLabel = 'free' | 'paid' | 'unknown'
export type ResourceFormat = 'course' | 'article' | 'video' | 'docs' | 'interactive' | 'book'

export interface LearningResource {
  id: string
  status: ContentStatus
  title: string
  provider: string
  format: ResourceFormat
  destinationLink: string
  /** Course / content access cost — always present */
  accessCost: CostLabel
  /** Separate certification or exam cost, only when the source distinguishes it */
  certificationCost?: { kind: 'Certification' | 'Exam'; cost: CostLabel; amount?: string }
  /** Content-ops only — NOT shown in learner UI */
  reviewerNote: string
  /** Content-ops only — NOT shown in learner UI */
  lastCheckedDate: string
}

export type ReportReason = 'broken-link' | 'outdated' | 'not-relevant' | 'other'
