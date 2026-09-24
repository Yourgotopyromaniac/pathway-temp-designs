import { ChevronRight, Lock } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { BackLink, Page, useCarryParams } from '@/components/layout/AppShell'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Estimate } from '@/components/ui/Estimate'
import { Badge, Card, Skeleton } from '@/components/ui/primitives'
import { StateMessage } from '@/components/ui/StateMessage'
import { fetchRoadmap, useAsync, useScenario } from '@/data/api'

/** FR-03 — ordered roadmap. Recommended order, but every step is open to inspect. */
export default function Roadmap() {
  const { careerId = '' } = useParams()
  const scenario = useScenario()
  const state = useAsync(() => fetchRoadmap(careerId, scenario), [careerId, scenario])
  const carry = useCarryParams()

  return (
    <Page narrow className="md:max-w-3xl">
      <BackLink to={`/careers/${careerId}`}>Career details</BackLink>

      {state.status === 'loading' && (
        <div role="status" aria-label="Loading roadmap" className="grid gap-3">
          <Skeleton className="mb-4 h-9 w-2/3" />
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      )}
      {state.status === 'error' && (
        <StateMessage kind="error" title="We couldn’t load this roadmap" body="Please check your connection and try again." action={<Button onClick={state.retry}>Try again</Button>} />
      )}
      {state.status === 'ready' && !state.data && (
        <StateMessage kind="empty" title="Roadmap not available" body="This career doesn’t have a roadmap right now." action={<ButtonLink variant="secondary" to="/careers">Browse careers</ButtonLink>} />
      )}
      {state.status === 'ready' && state.data && (() => {
        const { career, roadmap } = state.data
        const indexOf = (id: string) => roadmap.steps.findIndex((s) => s.stepId === id) + 1
        return (
          <>
            <p className="text-sm font-medium text-brand-700">{career.title}</p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Your roadmap</h1>
            <p className="mt-2 text-ink-muted">
              {roadmap.steps.length} steps in a recommended order. You can open any step to look ahead.
            </p>

            <ol className="relative mt-8 grid gap-4 before:absolute before:top-4 before:bottom-4 before:left-[19px] before:w-0.5 before:bg-line md:before:left-[23px]">
              {roadmap.steps.map((step, i) => (
                <li key={step.stepId} className="relative flex gap-4">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-pill border-2 border-brand-600 bg-surface font-display font-semibold text-brand-700 md:size-12">
                    {i + 1}
                  </span>
                  <Link to={carry(`/careers/${career.id}/roadmap/${step.stepId}`)} className="group flex-1">
                    <Card className="p-4 transition-shadow group-hover:shadow-raised md:p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h2 className="font-semibold">{step.title}</h2>
                          <p className="mt-1 text-sm text-ink-muted">{step.learningObjective}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <Estimate estimate={step.estimate} compact />
                            {step.requiredPrerequisiteStepId && (
                              <Badge tone="warning" icon={<Lock className="size-3" />}>
                                Requires step {indexOf(step.requiredPrerequisiteStepId)} first
                              </Badge>
                            )}
                            <span className="text-xs text-ink-subtle">
                              {step.resourceIds.length} {step.resourceIds.length === 1 ? 'resource' : 'resources'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="mt-1 size-5 text-ink-subtle group-hover:text-ink" />
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )
      })()}
    </Page>
  )
}
