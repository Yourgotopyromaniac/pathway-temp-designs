import { Clock } from 'lucide-react'
import type { TimeEstimate } from '@/data/types'
import { formatHours } from '@/lib/format'

/**
 * FR-03 rule 3: an estimate is only shown WITH its assumptions.
 * No assumptions → render nothing (never a bare "20 hours").
 */
export function Estimate({ estimate, compact }: { estimate?: TimeEstimate; compact?: boolean }) {
  const a = estimate?.assumptions
  if (!estimate || !a || (!a.priorKnowledge && !a.weeklyStudyHours)) return null

  const parts = [a.priorKnowledge, a.weeklyStudyHours ? `at ${a.weeklyStudyHours} hrs/week` : null].filter(Boolean)

  if (compact)
    return (
      <span className="inline-flex items-start gap-1 text-xs text-ink-muted">
        <Clock className="mt-px size-3.5 shrink-0" />
        <span>
          <span className="whitespace-nowrap">{formatHours(estimate.hours)}</span>{' '}
          <span className="text-ink-subtle">({parts.join(', ')})</span>
        </span>
      </span>
    )

  return (
    <div className="flex gap-3 rounded-md bg-surface-muted p-3">
      <Clock className="mt-0.5 size-4 shrink-0 text-ink-muted" />
      <div className="text-sm">
        <p className="font-medium">{formatHours(estimate.hours)} estimated</p>
        <p className="text-ink-muted">Assumes: {parts.join(' · ')}</p>
      </div>
    </div>
  )
}
