import { CircleCheck, MapPin, Route } from 'lucide-react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router'
import { BackLink, Page, useCarryParams } from '@/components/layout/AppShell'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card, Skeleton } from '@/components/ui/primitives'
import { StatCard } from '@/components/ui/StatCard'
import { StateMessage } from '@/components/ui/StateMessage'
import { fetchCareer, useAsync, useScenario } from '@/data/api'
import type { Career, Statistic } from '@/data/types'

/** FR-02 — career detail. Never gated on FR-01 input. Section order is fixed by spec. */
export default function CareerDetail() {
  const { careerId = '' } = useParams()
  const scenario = useScenario()
  const state = useAsync(() => fetchCareer(careerId, scenario), [careerId, scenario])

  return (
    <Page narrow className="md:max-w-3xl">
      <BackLink to="/careers">All careers</BackLink>
      {state.status === 'loading' && <DetailSkeleton />}
      {state.status === 'error' && (
        <StateMessage kind="error" title="We couldn’t load this career" body="Please check your connection and try again." action={<Button onClick={state.retry}>Try again</Button>} />
      )}
      {state.status === 'ready' && !state.data && (
        <StateMessage kind="empty" title="This career isn’t available" body="It may have been removed from the catalogue." action={<ButtonLink to="/careers" variant="secondary">Browse careers</ButtonLink>} />
      )}
      {state.status === 'ready' && state.data && <Detail career={state.data} />}
    </Page>
  )
}

function Detail({ career }: { career: Career }) {
  const carry = useCarryParams()
  const salary = career.stats.filter((s) => s.kind === 'salary-median' || s.kind === 'salary-range')
  const outlook = career.stats.filter((s) => s.kind === 'employment-projection' || s.kind === 'demand')

  return (
    <article>
      <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{career.title}</h1>
      <p className="mt-2 text-lg text-ink-muted">{career.description}</p>

      {/* 1. Role summary */}
      <Section n={1} title="What the role involves">
        <p className="leading-relaxed text-ink">{career.roleSummary}</p>
      </Section>

      {/* 2. Example work activities */}
      <Section n={2} title="Example work activities">
        <ul className="grid gap-2">
          {career.workActivities.map((a) => (
            <li key={a} className="flex gap-3">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand-600" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Entry considerations */}
      <Section n={3} title="How people get into it">
        <dl className="grid gap-3">
          {career.entryConsiderations.map((e) => (
            <Card key={e.label} className="p-4">
              <dt className="text-sm font-semibold">{e.label}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{e.detail}</dd>
            </Card>
          ))}
        </dl>
      </Section>

      {/* 4. Linked roadmap */}
      <Section n={4} title="Roadmap">
        <Card className="flex flex-col gap-4 bg-brand-50/50 p-5 sm:flex-row sm:items-center">
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-brand-600 text-ink-inverse">
            <Route className="size-6" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">{career.roadmapId ? `Step-by-step roadmap to become a ${career.title}` : 'Roadmap coming soon'}</p>
            <p className="text-sm text-ink-muted">
              {career.roadmapId ? 'Recommended learning steps with curated resources. Go at your own pace.' : 'We’re still putting together a learning roadmap for this career.'}
            </p>
          </div>
          {career.roadmapId && <ButtonLink to={carry(`/careers/${career.id}/roadmap`)}>View roadmap</ButtonLink>}
        </Card>
      </Section>

      {/* 5. Salary & outlook — pay and projections are separate; geographies never blended */}
      <Section n={5} title="Pay and job outlook">
        {career.stats.length === 0 ? (
          <Card className="p-5 text-sm text-ink-muted">Pay and outlook data is unavailable for this career.</Card>
        ) : (
          <div className="grid gap-8">
            <StatGroup title="Pay" stats={salary} />
            <StatGroup title="Job outlook" stats={outlook} />
          </div>
        )}
      </Section>
    </article>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10" aria-labelledby={`sec-${n}`}>
      <h2 id={`sec-${n}`} className="mb-4 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function StatGroup({ title, stats }: { title: string; stats: Statistic[] }) {
  if (stats.length === 0) return null
  const byGeo = Map.groupBy(stats, (s) => s.geography)
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-subtle">{title}</h3>
      <div className="grid gap-5">
        {[...byGeo].map(([geo, list]) => (
          <div key={geo}>
            <p className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-ink">
              <MapPin className="size-4 text-ink-subtle" /> {geo}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((s) => (
                <StatCard key={s.id} stat={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading career">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="mt-3 h-5 w-1/2" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="mt-10">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-11/12" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}
