import clsx from 'clsx'
import lockupColor from '@/assets/brand/lockup-color.svg'
import lockupWhite from '@/assets/brand/lockup-white.svg'

/**
 * Pathway lockup (mark + wordmark). `color` on light surfaces, `white` on
 * brand/dark surfaces. Other variants (mark-only, wordmark-only, black,
 * app icon) live in src/assets/brand/.
 */
export function Logo({ variant = 'color', className }: { variant?: 'color' | 'white'; className?: string }) {
  return <img src={variant === 'white' ? lockupWhite : lockupColor} alt="Pathway" className={clsx('h-7 w-auto', className)} />
}
