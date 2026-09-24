import clsx from 'clsx'
import { ChevronLeft, LayoutGrid } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Outlet, useSearchParams } from 'react-router'
import { Logo } from '@/components/ui/Logo'
import { IconTooltips } from './IconTooltips'

/** True when rendered inside a design-board frame / export — hides dev chrome. */
export function useIsFramed() {
  const [params] = useSearchParams()
  return params.has('frame')
}

/** Preserve ?scenario / ?frame when navigating so a framed flow stays in its state. */
export function useCarryParams() {
  const [params] = useSearchParams()
  const keep = new URLSearchParams()
  for (const k of ['frame']) if (params.has(k)) keep.set(k, params.get(k)!)
  const s = keep.toString()
  return (path: string) => (s ? `${path}?${s}` : path)
}

export function AppShell() {
  const framed = useIsFramed()

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-8">
          <Link to="/careers" aria-label="Pathway home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
            <Link to="/careers" className="hover:text-ink">Careers</Link>
          </nav>
        </div>
      </header>
      <IconTooltips />
      <main className="flex-1">
        <Outlet />
      </main>
      {!framed && (
        <Link
          to="/board"
          className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-pill bg-ink px-3 py-1.5 text-xs font-medium text-ink-inverse shadow-raised opacity-70 hover:opacity-100"
        >
          <LayoutGrid className="size-3.5" /> Design board
        </Link>
      )}
    </div>
  )
}

export function Page({ children, className, narrow }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return (
    <div className={clsx('mx-auto w-full px-4 pt-5 pb-16 md:px-8 md:pt-10', narrow ? 'max-w-2xl' : 'max-w-6xl', className)}>
      {children}
    </div>
  )
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  const carry = useCarryParams()
  return (
    <Link to={carry(to)} className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
      <ChevronLeft className="size-4" />
      {children}
    </Link>
  )
}
