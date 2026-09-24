import clsx from 'clsx'
import { Check, Plus, X } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BackLink, Page, useCarryParams } from '@/components/layout/AppShell'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/shadcn/popover'
import { Button } from '@/components/ui/Button'
import { fieldClass, Input, SelectField } from '@/components/ui/Field'
import { PageTitle } from '@/components/ui/primitives'
import { session, useSession } from '@/lib/session'

const SUGGESTED_INTERESTS = ['Frontend development', 'Data science', 'Product management', 'Design', 'Marketing', 'Research']
const SUGGESTED_SKILLS = ['JavaScript', 'Python', 'SQL', 'Excel', 'Design', 'Communication']

/**
 * FR-01 Step 2 — optional education / experience / skills / interests. Fully skippable.
 * `?open=degree` / `?open=skills` preset an open dropdown for the design board.
 */
export default function AboutYou() {
  const profile = useSession()
  const navigate = useNavigate()
  const carry = useCarryParams()
  const [params] = useSearchParams()
  const open = params.get('open')
  const [draft, setDraft] = useState(profile)

  const submit = () => {
    session.set({ ...draft, level: profile.level })
    navigate(carry('/careers'))
  }
  const skip = () => {
    session.clearOptional()
    navigate(carry('/careers'))
  }

  return (
    <Page narrow>
      <BackLink to="/start">Back</BackLink>
      <p className="mb-2 text-sm font-medium text-brand-700">Step 2 of 2 · Optional</p>
      <PageTitle title="Tell us a bit more" subtitle="Add any of these to see careers that fit you best — or skip to browse everything." />

      <div className="grid gap-6">
        <Field label="Education">
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              value={draft.education.degree}
              onChange={(v) => setDraft({ ...draft, education: { ...draft.education, degree: v } })}
              placeholder="Highest qualification"
              options={['Secondary school', 'Diploma / OND', 'Bachelor’s (in progress)', 'Bachelor’s', 'Master’s', 'Other']}
              defaultOpen={open === 'degree'}
            />
            <Input
              value={draft.education.field}
              onChange={(e) => setDraft({ ...draft, education: { ...draft.education, field: e.target.value } })}
              placeholder="Field of study, e.g. Economics"
            />
          </div>
        </Field>

        <Field label="Experience">
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField
              value={draft.experience.years}
              onChange={(v) => setDraft({ ...draft, experience: { ...draft.experience, years: v } })}
              placeholder="Years of work"
              options={['None yet', 'Less than 1 year', '1–2 years', '3–5 years']}
            />
            <SelectField
              value={draft.experience.internships}
              onChange={(v) => setDraft({ ...draft, experience: { ...draft.experience, internships: v } })}
              placeholder="Internships"
              options={['None', '1', '2', '3 or more']}
            />
          </div>
        </Field>

        <Field label="Skills">
          <ChipCombobox
            values={draft.skills}
            suggestions={SUGGESTED_SKILLS}
            onChange={(skills) => setDraft({ ...draft, skills })}
            placeholder="Add a skill"
            defaultOpen={open === 'skills'}
          />
        </Field>

        <Field label="Career interests">
          <ChipCombobox
            values={draft.interests}
            suggestions={SUGGESTED_INTERESTS}
            onChange={(interests) => setDraft({ ...draft, interests })}
            placeholder="Add an interest"
          />
        </Field>
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 flex flex-col-reverse gap-3 border-t border-line bg-canvas px-4 py-4 sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:bg-transparent sm:px-0">
        <Button variant="secondary" size="lg" onClick={skip}>Skip for now</Button>
        <Button size="lg" onClick={submit}>Show my careers</Button>
      </div>
    </Page>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      {children}
    </fieldset>
  )
}

/** Free-text chips with a shadcn Popover of suggestions (plus "Add …" for custom entries). */
function ChipCombobox({
  values,
  suggestions,
  onChange,
  placeholder,
  defaultOpen = false,
}: {
  values: string[]
  suggestions: string[]
  onChange: (v: string[]) => void
  placeholder: string
  defaultOpen?: boolean
}) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(defaultOpen)
  const anchorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const has = (v: string) => values.some((x) => x.toLowerCase() === v.toLowerCase())
  const add = (v: string) => {
    const t = v.trim()
    if (t && !has(t)) onChange([...values, t])
    setText('')
    inputRef.current?.focus()
  }
  const q = text.trim().toLowerCase()
  const matches = suggestions.filter((s) => !q || s.toLowerCase().includes(q))
  const canAddCustom = !!q && !suggestions.some((s) => s.toLowerCase() === q) && !has(q)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          ref={anchorRef}
          onClick={() => inputRef.current?.focus()}
          className={clsx(fieldClass, 'flex min-h-[42px] cursor-text flex-wrap items-center gap-1.5 px-1.5 py-1.5', open && 'border-brand-500 ring-3 ring-brand-500/15')}
        >
          {values.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 rounded-sm bg-brand-50 py-0.5 pr-0.5 pl-2 text-sm text-brand-800">
              {v}
              <button
                aria-label={`Remove ${v}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(values.filter((x) => x !== v))
                }}
                className="grid size-5 place-items-center rounded-sm hover:bg-brand-100"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            className="h-7 min-w-32 flex-1 bg-transparent px-2 text-[15px] placeholder:text-ink-placeholder focus:outline-none"
            value={text}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setText(e.target.value)
              setOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                add(text)
              } else if (e.key === 'Backspace' && !text && values.length) {
                onChange(values.slice(0, -1))
              }
            }}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (anchorRef.current?.contains(e.target as Node)) e.preventDefault()
        }}
        className="w-(--radix-popover-trigger-width) gap-0 rounded-md border border-line p-1 shadow-raised ring-0"
      >
        <p className="px-2.5 pt-1.5 pb-1 text-xs font-medium text-ink-subtle">{q ? 'Matches' : 'Suggestions'}</p>
        <ul role="listbox" className="grid">
          {matches.map((s) => {
            const selected = has(s)
            return (
              <li key={s}>
                <button
                  role="option"
                  aria-selected={selected}
                  onClick={() => (selected ? onChange(values.filter((x) => x.toLowerCase() !== s.toLowerCase())) : add(s))}
                  className="flex h-9 w-full items-center justify-between rounded-sm px-2.5 text-left text-[15px] hover:bg-brand-50 hover:text-brand-800"
                >
                  {s}
                  {selected && <Check className="size-4 text-brand-600" />}
                </button>
              </li>
            )
          })}
          {canAddCustom && (
            <li>
              <button onClick={() => add(text)} className="flex h-9 w-full items-center gap-2 rounded-sm px-2.5 text-left text-[15px] text-brand-700 hover:bg-brand-50">
                <Plus className="size-4" /> Add “{text.trim()}”
              </button>
            </li>
          )}
          {matches.length === 0 && !canAddCustom && <li className="px-2.5 py-2 text-sm text-ink-subtle">Already added</li>}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
