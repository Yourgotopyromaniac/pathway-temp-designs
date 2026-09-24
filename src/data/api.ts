import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { careers } from './careers'
import { resources, roadmaps } from './roadmaps'
import type { Career, LearningResource, Roadmap, SessionProfile } from './types'

/**
 * Mock API. Every screen reads data through here so each one can be forced
 * into its loading / empty / error state with `?scenario=` for the design board.
 */
export type Scenario = 'default' | 'loading' | 'error' | 'empty'

export function useScenario(): Scenario {
  const [params] = useSearchParams()
  return (params.get('scenario') as Scenario) ?? 'default'
}

const LATENCY = 450

function respond<T>(scenario: Scenario, value: () => T): Promise<T> {
  if (scenario === 'loading') return new Promise(() => {}) // never resolves
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (scenario === 'error') reject(new Error('Network request failed'))
      else resolve(value())
    }, LATENCY),
  )
}

const isPublished = <T extends { status: string }>(x: T) => x.status === 'published'

// ── FR-01 ────────────────────────────────────────────────────────────────────

export interface CatalogueResult {
  careers: (Career & { levelFit: boolean })[]
  /** Published careers before any user filters — distinguishes the two empty states */
  totalPublished: number
}

export function fetchCatalogue(profile: SessionProfile, scenario: Scenario) {
  return respond<CatalogueResult>(scenario, () => {
    const published = scenario === 'empty' ? [] : careers.filter(isPublished)
    const terms = [...profile.skills, ...profile.interests].map((t) => t.toLowerCase())

    const matched = published
      .map((c) => {
        const score = terms.filter((t) => c.tags.some((tag) => tag.includes(t) || t.includes(tag))).length
        return { ...c, levelFit: !!profile.level && c.levels.includes(profile.level), score }
      })
      // Optional input filters; skipping it shows the full catalogue.
      .filter((c) => terms.length === 0 || c.score > 0)
      // Level prioritises (never hides): best-fit first, then by match strength.
      .sort((a, b) => Number(b.levelFit) - Number(a.levelFit) || b.score - a.score)

    return { careers: matched, totalPublished: published.length }
  })
}

// ── FR-02 / 03 / 04 ──────────────────────────────────────────────────────────

export function fetchCareer(id: string, scenario: Scenario) {
  return respond<Career | null>(scenario, () => careers.find((c) => c.id === id && isPublished(c)) ?? null)
}

export function fetchRoadmap(careerId: string, scenario: Scenario) {
  return respond<{ career: Career; roadmap: Roadmap } | null>(scenario, () => {
    const career = careers.find((c) => c.id === careerId && isPublished(c)) // retired → no roadmap
    const roadmap = career && roadmaps.find((r) => r.id === career.roadmapId)
    return career && roadmap ? { career, roadmap } : null
  })
}

export function fetchStepResources(careerId: string, stepId: string, scenario: Scenario) {
  return respond(scenario, () => {
    const career = careers.find((c) => c.id === careerId && isPublished(c))
    const roadmap = career && roadmaps.find((r) => r.id === career.roadmapId)
    const step = roadmap?.steps.find((s) => s.stepId === stepId)
    if (!career || !roadmap || !step) return null
    const list = step.resourceIds
      .map((id) => resources.find((r) => r.id === id))
      .filter((r): r is LearningResource => !!r && isPublished(r))
    return { career, roadmap, step, resources: list }
  })
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'ready'; data: T }

export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    load().then(
      (data) => live && setState({ status: 'ready', data }),
      (error: Error) => live && setState({ status: 'error', error, retry }),
    )
    return () => {
      live = false
    }
  }, [...deps, attempt])

  return state
}
