import clsx from 'clsx'
import { ExternalLink, Monitor, Smartphone } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'
import { BOARD, DEVICES, FR_TITLES, framedUrl, type DeviceId, type FR } from './registry'

type DeviceFilter = 'both' | DeviceId

function usePref<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`board.${key}`)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(`board.${key}`, JSON.stringify(v))
    } catch {
      /* ignore */
    }
  }, [key, v])
  return [v, setV] as const
}

/** Design board: every screen × state, live, in mobile and desktop frames. */
export default function Board() {
  const [fr, setFr] = usePref<FR | 'all'>('fr', 'all')
  const [device, setDevice] = usePref<DeviceFilter>('device', 'both')
  const [zoom, setZoom] = usePref('zoom', 0.5)

  const groups = (Object.keys(FR_TITLES) as FR[]).filter((f) => fr === 'all' || f === fr)
  const devices = (device === 'both' ? ['mobile', 'desktop'] : [device]) as DeviceId[]

  return (
    <div className="min-h-dvh bg-surface-muted">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm text-ink-subtle">Reference designs · Career Catalogue MVP</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', ...Object.keys(FR_TITLES)] as (FR | 'all')[]).map((f) => (
              <Pill key={f} active={fr === f} onClick={() => setFr(f)}>{f === 'all' ? 'All' : f}</Pill>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Pill active={device === 'both'} onClick={() => setDevice('both')}>Both</Pill>
            <Pill active={device === 'mobile'} onClick={() => setDevice('mobile')}><Smartphone className="size-3.5" /> Mobile</Pill>
            <Pill active={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor className="size-3.5" /> Desktop</Pill>
          </div>
          <label className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
            Zoom
            <input type="range" min={0.25} max={1} step={0.05} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="accent-brand-600" />
            <span className="w-9 tabular-nums">{Math.round(zoom * 100)}%</span>
          </label>
        </div>
      </header>

      <div className="px-6 pb-24">
        {groups.map((g) => (
          <section key={g} className="pt-10">
            <h2 className="font-display text-2xl font-semibold">
              <span className="text-brand-700">{g}</span> · {FR_TITLES[g]}
            </h2>
            <div className="mt-6 grid gap-12">
              {BOARD.filter((e) => e.fr === g).map((e) => (
                <article key={e.id} id={e.id}>
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-semibold">{e.title}</h3>
                    <code className="text-xs text-ink-subtle">{e.id}</code>
                    <a href={e.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline">
                      Open live <ExternalLink className="size-3" />
                    </a>
                  </div>
                  {e.note && <p className="-mt-1 mb-3 max-w-3xl text-sm text-ink-muted">{e.note}</p>}
                  <div className="flex items-start gap-6 overflow-x-auto pb-2">
                    {devices.map((d) => (
                      <Frame key={d} device={d} src={framedUrl(e.path)} zoom={zoom} />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function Frame({ device, src, zoom }: { device: DeviceId; src: string; zoom: number }) {
  const { width, height, label } = DEVICES[device]
  return (
    <figure className="shrink-0">
      <div
        className={clsx('overflow-hidden border border-line-strong bg-canvas shadow-raised', device === 'mobile' ? 'rounded-[28px]' : 'rounded-lg')}
        style={{ width: width * zoom, height: height * zoom }}
      >
        <iframe
          src={src}
          title={`${label} — ${src}`}
          loading="lazy"
          style={{ width, height, transform: `scale(${zoom})`, transformOrigin: '0 0' }}
          className="border-0"
        />
      </div>
      <figcaption className="mt-2 text-xs text-ink-subtle">
        {label} · {width}×{height}
      </figcaption>
    </figure>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex h-8 items-center gap-1.5 rounded-pill border px-3 text-xs font-medium',
        active ? 'border-ink bg-ink text-ink-inverse' : 'border-line-strong bg-surface text-ink-muted hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
