import { ArrowRight, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Page, useCarryParams } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { LevelSwitcher } from '@/components/ui/LevelSwitcher'
import { Badge, Card, Skeleton } from '@/components/ui/primitives'
import { StateMessage } from '@/components/ui/StateMessage'
import { fetchCatalogue, useAsync, useScenario, type CatalogueResult } from '@/data/api'
import { CAREER_LEVELS } from '@/data/types'
import { hasOptionalInput, session, useSession } from '@/lib/session'

/** FR-01 Step 3 & 4 — browse the catalogue, with loading / empty / no-match / error states. */
export default function Catalogue() {
  const profile = useSession()
  const scenario = useScenario()
  const state = useAsync(() => fetchCatalogue(profile, scenario), [profile, scenario])
  const filtered = hasOptionalInput(profile)
  const carry = useCarryParams()

  return (
    <Page>
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">Explore careers</h1>
          <p className="mt-1 text-ink-muted">Open any career to see what the work involves, pay, outlook and a roadmap.</p>
        </div>
        <LevelSwitcher value={profile.level} onChange={session.setLevel} />
      </div>

      {filtered && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-brand-100 bg-brand-50/60 p-3">
          <SlidersHorizontal className="size-4 text-brand-700" />
          <span className="text-sm text-ink-muted">Showing matches for</span>
          {[...profile.interests, ...profile.skills].map((t) => (
            <Badge key={t} tone="brand">{t}</Badge>
          ))}
          <div className="ml-auto flex gap-3">
            <Link to={carry('/start/about')} className="text-sm font-medium text-brand-700 hover:underline">Edit</Link>
            <button onClick={session.clearOptional} className="text-sm font-medium text-brand-700 hover:underline">Clear</button>
          </div>
        </div>
      )}

      {state.status === 'loading' && <LoadingGrid />}

      {state.status === 'error' && (
        <StateMessage
          kind="error"
          title="We couldn’t load careers"
          body="Something went wrong on our side or with your connection. Please try again."
          action={<Button onClick={state.retry}>Try again</Button>}
        />
      )}

      {state.status === 'ready' && <Results result={state.data} levelLabel={CAREER_LEVELS.find((l) => l.id === profile.level)?.label} />}
    </Page>
  )
}

function Results({ result, levelLabel }: { result: CatalogueResult; levelLabel?: string }) {
  const carry = useCarryParams()

  if (result.totalPublished === 0)
    return <StateMessage kind="empty" title="No careers available yet" body="We’re adding careers to the catalogue. Check back soon." />

  if (result.careers.length === 0)
    return (
      <StateMessage
        kind="no-match"
        title="No careers match your filters"
        body="Try removing some interests or skills, or clear filters to see the full catalogue."
        action={<Button onClick={session.clearOptional}>Clear filters</Button>}
      />
    )

  return (
    <>
      <p className="mb-3 text-sm text-ink-subtle" aria-live="polite">
        {result.careers.length} {result.careers.length === 1 ? 'career' : 'careers'}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {result.careers.map((c) => (
          <li key={c.id}>
            <Link to={carry(`/careers/${c.id}`)} className="group block h-full">
              <Card className="flex h-full flex-col p-5 transition-shadow group-hover:shadow-raised">
                {c.levelFit && levelLabel && (
                  <Badge tone="accent" icon={<Sparkles className="size-3 text-accent-600" />} className="mb-3 self-start">
                    Good fit for {levelLabel.toLowerCase()}s
                  </Badge>
                )}
                <h2 className="font-display text-base font-semibold">{c.title}</h2>
                <p className="mt-1 flex-1 text-sm text-ink-muted">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                  View career <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function LoadingGrid() {
  return (
    <div role="status" aria-live="polite">
      <p className="mb-3 text-sm text-ink-subtle">Loading careers…</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-3 h-3.5 w-full" />
            <Skeleton className="mt-2 h-3.5 w-4/5" />
            <Skeleton className="mt-5 h-3.5 w-24" />
          </Card>
        ))}
      </div>
    </div>
  )
}

