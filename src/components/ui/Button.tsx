import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

/**
 * Button styles follow the design team's auth screen (brand/Frame 24.png):
 *  - primary: brand-500 face with a 6px brand-edge "3D" bottom edge
 *  - secondary: grey-50 face, grey-100 border, soft 2px grey bottom edge
 * The edge is an inset shadow sized by --edge; the label is padded up by the
 * same amount so it sits centred on the face, and pressing shrinks the edge.
 */
export function buttonClass(variant: Variant = 'primary', size: Size = 'md', block = false) {
  return clsx(
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none rounded-md',
    'transition-[background-color,box-shadow,color,translate] duration-100',
    'disabled:opacity-50 disabled:pointer-events-none [&_svg]:shrink-0',
    {
      primary: [
        'bg-brand-500 text-ink-inverse hover:bg-[color-mix(in_oklab,var(--color-brand-500),var(--color-brand-600)_25%)]',
        'shadow-[inset_0_calc(-1*var(--edge))_0_0_var(--color-brand-edge)] pb-(--edge)',
        'active:translate-y-px active:[--edge:3px]',
      ],
      secondary: [
        'bg-grey-50 text-ink-muted border border-grey-100 border-b-grey-200 hover:text-ink hover:bg-[color-mix(in_oklab,var(--color-grey-50),var(--color-grey-100)_50%)]',
        'shadow-[inset_0_-2px_0_0_var(--color-grey-150)] pb-0.5',
        'active:translate-y-px active:shadow-[inset_0_-1px_0_0_var(--color-grey-150)]',
      ],
      ghost: 'text-brand-700 hover:bg-brand-50',
      quiet: 'text-ink-muted hover:text-ink underline-offset-4 hover:underline',
    }[variant],
    {
      sm: 'h-9 px-3 text-sm [--edge:4px]',
      md: 'h-11 px-4 text-[15px] [--edge:6px]',
      lg: 'h-12 px-5 text-base [--edge:6px]',
    }[size],
    variant === 'quiet' && '!h-auto !px-0',
    block && 'w-full',
  )
}

interface Style {
  variant?: Variant
  size?: Size
  block?: boolean
}

export function Button({ variant, size, block, className, ...rest }: ComponentProps<'button'> & Style) {
  return <button type="button" className={clsx(buttonClass(variant, size, block), className)} {...rest} />
}

export function ButtonLink({ variant, size, block, className, ...rest }: ComponentProps<typeof Link> & Style) {
  return <Link className={clsx(buttonClass(variant, size, block), className)} {...rest} />
}

/** External destinations (FR-04): new tab on web; native apps use an in-app browser. */
export function ExternalButton({ variant, size, block, className, ...rest }: ComponentProps<'a'> & Style) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(buttonClass(variant, size, block), className)}
      {...rest}
    />
  )
}
