import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Dev reference: hovering any Lucide icon shows its component name, which is
 * identical in `lucide-react` (web) and `lucide-react-native` (Expo).
 *
 * Lucide renders `class="lucide lucide-<canonical-name> lucide-<alias>…"`, so
 * the first `lucide-*` class is the current (non-deprecated) name. Icons are
 * hit-tested by position rather than DOM events so icons with
 * `pointer-events: none` (e.g. inside shadcn components) still work.
 */
const toPascal = (kebab: string) => kebab.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())

interface Tip {
  name: string
  x: number
  top: number
  bottom: number
}

export function IconTooltips() {
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const hit = [...document.querySelectorAll<SVGElement>('svg.lucide')].find((svg) => {
          const r = svg.getBoundingClientRect()
          return r.width > 0 && e.clientX >= r.left - 2 && e.clientX <= r.right + 2 && e.clientY >= r.top - 2 && e.clientY <= r.bottom + 2
        })
        const cls = hit && [...hit.classList].find((c) => c.startsWith('lucide-'))
        if (!hit || !cls) return setTip(null)
        const r = hit.getBoundingClientRect()
        setTip({ name: toPascal(cls.slice('lucide-'.length)), x: r.left + r.width / 2, top: r.top, bottom: r.bottom })
      })
    }
    const hide = () => setTip(null)
    document.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', hide, true)
    document.addEventListener('pointerleave', hide)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', hide, true)
      document.removeEventListener('pointerleave', hide)
    }
  }, [])

  if (!tip) return null
  const below = tip.top < 44 // flip under the icon near the top edge
  return createPortal(
    <div
      role="tooltip"
      className="pointer-events-none fixed z-[1000] rounded-sm bg-ink px-2 py-1 font-mono text-[11px] leading-tight whitespace-nowrap text-ink-inverse shadow-raised"
      style={{ left: tip.x, top: below ? tip.bottom + 8 : tip.top - 8, translate: below ? '-50% 0' : '-50% -100%' }}
    >
      <span className="text-brand-300">lucide</span> {tip.name}
    </div>,
    document.body,
  )
}
