import clsx from 'clsx'
import { BookOpen, CheckCircle2, ExternalLink, FileText, Flag, MonitorPlay, MousePointerClick, NotebookText, X } from 'lucide-react'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { BackLink, Page } from '@/components/layout/AppShell'
import { Button, ExternalButton } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Field'
import { Badge, Card, Skeleton } from '@/components/ui/primitives'
import { StateMessage } from '@/components/ui/StateMessage'
import { fetchStepResources, useAsync, useScenario } from '@/data/api'
import type { CostLabel, LearningResource, ReportReason, ResourceFormat } from '@/data/types'

const formatIcon: Record<ResourceFormat, typeof BookOpen> = {
  course: BookOpen, article: FileText, video: MonitorPlay, docs: NotebookText, interactive: MousePointerClick, book: BookOpen,
}

/**
 * FR-04 — curated resources for one step.
 * Opening a link never marks anything complete; reporting never hides the card.
 * `?report=<id>` / `?reported=<id>` preset the report dialog for the design board.
 */
export default function Resources() {
  const { careerId = '', stepId = '' } = useParams()
  const scenario = useScenario()
  const state = useAsync(() => fetchStepResources(careerId, stepId, scenario), [careerId, stepId, scenario])
  const [params] = useSearchParams()
  const [reporting, setReporting] = useState<string | null>(params.get('report'))
  const [reported, setReported] = useState<Set<string>>(new Set(params.getAll('reported')))

  return (
    <Page narrow>
      <BackLink to={`/careers/${careerId}/roadmap/${stepId}`}>Back to step</BackLink>

      {state.status === 'loading' && (
        <div role="status" aria-label="Loading resources" className="grid gap-3">
          <Skeleton className="mb-3 h-8 w-2/3" />
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-36 w-full rounded-lg" />)}
        </div>
      )}
      {state.status === 'error' && (
        <StateMessage kind="error" title="We couldn’t load resources" body="Please check your connection and try again." action={<Button onClick={state.retry}>Try again</Button>} />
      )}
      {state.status === 'ready' && state.data && (
        <>
          <p className="text-sm font-medium text-brand-700">{state.data.step.title}</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Learning resources</h1>
          <p className="mt-2 text-sm text-ink-muted">Hand-picked for this step. Links open in a new tab, so your roadmap stays right here.</p>

          {state.data.resources.length === 0 ? (
            <StateMessage kind="empty" title="No resources yet" body="We’re still curating resources for this step." />
          ) : (
            <ul className="mt-6 grid gap-3">
              {state.data.resources.map((r) => (
                <li key={r.id}>
                  <ResourceCard resource={r} reported={reported.has(r.id)} onReport={() => setReporting(r.id)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {reporting && state.status === 'ready' && (
        <ReportDialog
          resource={state.data?.resources.find((r) => r.id === reporting)}
          onClose={() => setReporting(null)}
          onSubmit={() => {
            setReported(new Set(reported).add(reporting))
            setReporting(null)
          }}
        />
      )}
    </Page>
  )
}

function CostBadge({ prefix, cost, amount }: { prefix: string; cost: CostLabel; amount?: string }) {
  const tone = cost === 'free' ? 'success' : cost === 'paid' ? 'warning' : 'unavailable'
  const text = cost === 'unknown' ? 'cost unknown' : cost
  return <Badge tone={tone}>{prefix}: {text}{amount ? ` · ${amount}` : ''}</Badge>
}

function ResourceCard({ resource: r, reported, onReport }: { resource: LearningResource; reported: boolean; onReport: () => void }) {
  const Icon = formatIcon[r.format]
  return (
    <Card className="p-4 md:p-5">
      <div className="flex gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-muted text-ink-muted">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold leading-snug">{r.title}</h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {r.provider} · <span className="capitalize">{r.format}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <CostBadge prefix="Course" cost={r.accessCost} />
            {r.certificationCost && <CostBadge prefix={r.certificationCost.kind} cost={r.certificationCost.cost} amount={r.certificationCost.amount} />}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        {reported ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-success-700">
            <CheckCircle2 className="size-3.5" /> Thanks, we’ll review this resource
          </span>
        ) : (
          <button onClick={onReport} className="inline-flex items-center gap-1.5 self-start text-xs text-ink-subtle hover:text-ink-muted hover:underline">
            <Flag className="size-3.5" /> Report an issue with this resource
          </button>
        )}
        <ExternalButton href={r.destinationLink} variant="secondary" className="sm:w-auto">
          Open resource <ExternalLink className="size-4" />
        </ExternalButton>
      </div>
    </Card>
  )
}

const REASONS: { id: ReportReason; label: string }[] = [
  { id: 'broken-link', label: 'Link is broken or doesn’t load' },
  { id: 'outdated', label: 'Content is outdated' },
  { id: 'not-relevant', label: 'Doesn’t match this step' },
  { id: 'other', label: 'Something else' },
]

/** Bottom sheet on mobile, centred modal on desktop. */
function ReportDialog({ resource, onClose, onSubmit }: { resource?: LearningResource; onClose: () => void; onSubmit: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null)
  if (!resource) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-xl bg-surface p-5 shadow-overlay sm:rounded-xl sm:p-6"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-line-strong sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="report-title" className="font-display text-lg font-semibold">Report an issue</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{resource.title}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-pill hover:bg-surface-muted">
            <X className="size-4" />
          </button>
        </div>
        <fieldset className="mt-5 grid gap-2">
          <legend className="sr-only">What’s wrong?</legend>
          {REASONS.map((r) => (
            <label key={r.id} className={clsx('flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm', reason === r.id ? 'border-brand-600 bg-brand-50' : 'border-line hover:border-line-strong')}>
              <input type="radio" name="reason" className="accent-brand-600" checked={reason === r.id} onChange={() => setReason(r.id)} />
              {r.label}
            </label>
          ))}
        </fieldset>
        <Textarea placeholder="Add details (optional)" rows={3} className="mt-3" />
        <p className="mt-2 text-xs text-ink-subtle">The resource stays available while our team reviews your report.</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!reason} onClick={onSubmit}>Send report</Button>
        </div>
      </div>
    </div>
  )
}
