import clsx from 'clsx'
import { BriefcaseBusiness, Check, GraduationCap, School } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Page, useCarryParams } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { PageTitle } from '@/components/ui/primitives'
import { CAREER_LEVELS, type CareerLevel } from '@/data/types'
import { session, useSession } from '@/lib/session'

const icons: Record<CareerLevel, typeof School> = {
  'university-student': School,
  'recent-graduate': GraduationCap,
  'early-career': BriefcaseBusiness,
}

/** FR-01 Step 1 — choose a level. No account; changeable later from the catalogue. */
export default function LevelSelect() {
  const { level } = useSession()
  const navigate = useNavigate()
  const carry = useCarryParams()

  return (
    <Page narrow>
      <p className="mb-2 text-sm font-medium text-brand-700">Step 1 of 2</p>
      <PageTitle title="Where are you in your career?" subtitle="We’ll put the most relevant careers first. You can change this any time." />

      <div role="radiogroup" aria-label="Career level" className="grid gap-3">
        {CAREER_LEVELS.map((l) => {
          const Icon = icons[l.id]
          const active = level === l.id
          return (
            <button
              key={l.id}
              role="radio"
              aria-checked={active}
              onClick={() => session.setLevel(l.id)}
              className={clsx(
                'flex items-center gap-4 rounded-lg border bg-surface p-4 text-left transition-all',
                active ? 'border-brand-600 ring-2 ring-brand-100' : 'border-line hover:border-brand-300',
              )}
            >
              <span className={clsx('grid size-11 shrink-0 place-items-center rounded-md', active ? 'bg-brand-600 text-ink-inverse' : 'bg-brand-50 text-brand-700')}>
                <Icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{l.label}</span>
                <span className="block text-sm text-ink-muted">{l.blurb}</span>
              </span>
              <span className={clsx('grid size-5 place-items-center rounded-pill border', active ? 'border-brand-600 bg-brand-600 text-ink-inverse' : 'border-line-strong')}>
                {active && <Check className="size-3" strokeWidth={3} />}
              </span>
            </button>
          )
        })}
      </div>

      <Button size="lg" block className="mt-8" disabled={!level} onClick={() => navigate(carry('/start/about'))}>
        Continue
      </Button>
      <p className="mt-4 text-center text-xs text-ink-subtle">No account needed. Your answers are kept only for this browsing session.</p>
    </Page>
  )
}
