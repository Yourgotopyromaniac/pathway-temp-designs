import { ArrowLeft, ArrowRight, BookOpen, ClipboardCheck, ListChecks, Lock, Target } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { BackLink, Page, useCarryParams } from '@/components/layout/AppShell'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Estimate } from '@/components/ui/Estimate'
import { Skeleton } from '@/components/ui/primitives'
import { StateMessage } from '@/components/ui/StateMessage'
import { fetchRoadmap, useAsync, useScenario } from '@/data/api'

/** FR-03 Step 4 — a single roadmap step, addressed by stable stepId. */
export default function StepDetail() {
  const { careerId = '', stepId = '' } = useParams()
  const scenario = useScenario()
  const state = useAsync(() => fetchRoadmap(careerId, scenario), [careerId, scenario])
  const carry = useCarryParams()

  return (
    <Page narrow>
      <BackLink to={`/careers/${careerId}/roadmap`}>Roadmap</BackLink>

      {state.status === 'loading' && (
        <div role="status" aria-label="Loading step">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-9 w-3/4" />
          <Skeleton className="mt-8 h-28 w-full rounded-lg" />
          <Skeleton className="mt-4 h-28 w-full rounded-lg" />
        </div>
      )}
      {state.status === 'error' && (
        <StateMessage kind="error" title="We couldn’t load this step" body="Please check your connection and try again." action={<Button onClick={state.retry}>Try again</Button>} />
      )}
      {state.status === 'ready' && (() => {
        const steps = state.data?.roadmap.steps ?? []
        const i = steps.findIndex((s) => s.stepId === stepId)
        const step = steps[i]
        if (!step) return <StateMessage kind="empty" title="Step not found" action={<ButtonLink variant="secondary" to={`/careers/${careerId}/roadmap`}>Back to roadmap</ButtonLink>} />

        const prev = steps[i - 1]
        const next = steps[i + 1]
        const required = step.requiredPrerequisiteStepId ? steps.find((s) => s.stepId === step.requiredPrerequisiteStepId) : undefined
        const base = `/careers/${careerId}/roadmap`

        return (
          <>
            <p className="text-sm font-medium text-brand-700">Step {i + 1} of {steps.length}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">{step.title}</h1>

            {required && (
              <div className="mt-6 flex gap-3 rounded-md border border-warning-600/30 bg-warning-50 p-4 text-sm">
                <Lock className="mt-0.5 size-4 shrink-0 text-warning-700" />
                <p>
                  <span className="font-semibold">Complete step {steps.indexOf(required) + 1} first.</span>{' '}
                  This step builds directly on{' '}
                  <Link className="font-medium text-brand-700 underline" to={carry(`${base}/${required.stepId}`)}>{required.title}</Link>.
                  You can still read ahead.
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4">
              <Block icon={<Target />} title="What you’ll be able to do">{step.learningObjective}</Block>

              {step.prerequisites.length > 0 && (
                <Block icon={<ListChecks />} title="Before you start">
                  <ul className="list-disc space-y-1 pl-5">
                    {step.prerequisites.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </Block>
              )}

              <Block icon={<ClipboardCheck />} title="How you’ll show it">{step.expectedEvidence}</Block>

              <Estimate estimate={step.estimate} />
            </div>

            <div className="mt-8">
              {step.resourceIds.length > 0 ? (
                <ButtonLink to={carry(`${base}/${step.stepId}/resources`)} size="lg" block>
                  <BookOpen className="size-5" /> View resources ({step.resourceIds.length})
                </ButtonLink>
              ) : (
                <p className="rounded-md border border-dashed border-line-strong p-4 text-center text-sm text-ink-muted">
                  Learning resources for this step are coming soon.
                </p>
              )}
            </div>

            <nav className="mt-8 flex justify-between gap-4 border-t border-line pt-5 text-sm">
              {prev ? (
                <Link to={carry(`${base}/${prev.stepId}`)} className="flex items-center gap-2 text-ink-muted hover:text-ink">
                  <ArrowLeft className="size-4" /> <span className="hidden sm:inline">{prev.title}</span><span className="sm:hidden">Previous</span>
                </Link>
              ) : <span />}
              {next && (
                <Link to={carry(`${base}/${next.stepId}`)} className="flex items-center gap-2 text-right font-medium text-brand-700">
                  <span className="hidden sm:inline">{next.title}</span><span className="sm:hidden">Next step</span> <ArrowRight className="size-4" />
                </Link>
              )}
            </nav>
          </>
        )
      })()}
    </Page>
  )
}

function Block({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="flex gap-3 rounded-lg border border-line bg-surface p-4 md:p-5">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700 [&>svg]:size-5">{icon}</span>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="mt-1 text-sm text-ink-muted">{children}</div>
      </div>
    </section>
  )
}
