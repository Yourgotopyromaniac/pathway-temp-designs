import clsx from 'clsx'
import { CAREER_LEVELS, type CareerLevel } from '@/data/types'

/** Always-available level control (FR-01 rule 1). Changing it updates the catalogue immediately. */
export function LevelSwitcher({ value, onChange }: { value: CareerLevel | null; onChange: (l: CareerLevel) => void }) {
  return (
    <div role="radiogroup" aria-label="Career level" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
      {CAREER_LEVELS.map((l) => {
        const active = value === l.id
        return (
          <button
            key={l.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(l.id)}
            className={clsx(
              'h-9 shrink-0 rounded-pill border px-4 text-sm font-medium transition-colors',
              active
                ? 'border-brand-600 bg-brand-600 text-ink-inverse'
                : 'border-line-strong bg-surface text-ink-muted hover:border-brand-300 hover:text-ink',
            )}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
