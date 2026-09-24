import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

/** Input look from the design team's auth screen: white, grey-100 border, 8px radius, 42px tall. */
export const fieldClass = clsx(
  'w-full rounded-md border border-line bg-surface px-3.5 text-[15px] text-ink',
  'placeholder:text-ink-placeholder transition-colors hover:border-line-strong',
  'focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15',
)

export function Input({ className, ...rest }: ComponentProps<'input'>) {
  return <input className={clsx(fieldClass, 'h-[42px]', className)} {...rest} />
}

export function Textarea({ className, ...rest }: ComponentProps<'textarea'>) {
  return <textarea className={clsx(fieldClass, 'py-2.5', className)} {...rest} />
}

/** shadcn Select, styled to match Input. */
export function SelectField({
  value,
  onChange,
  placeholder,
  options,
  defaultOpen,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: string[]
  defaultOpen?: boolean
  'aria-label'?: string
}) {
  return (
    <Select value={value} onValueChange={onChange} defaultOpen={defaultOpen}>
      <SelectTrigger
        aria-label={ariaLabel ?? placeholder}
        className={clsx(
          fieldClass,
          'h-[42px]! w-full justify-between pr-3 text-left data-placeholder:text-ink-placeholder',
          'focus-visible:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/15',
          'data-[state=open]:border-brand-500 data-[state=open]:ring-3 data-[state=open]:ring-brand-500/15',
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={6} className="rounded-md border border-line p-1 shadow-raised ring-0">
        {options.map((o) => (
          <SelectItem key={o} value={o} className="h-9 rounded-sm px-2.5 text-[15px]">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
