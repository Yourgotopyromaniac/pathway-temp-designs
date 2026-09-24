import { useSyncExternalStore } from 'react'
import type { CareerLevel, SessionProfile } from '@/data/types'

/**
 * Session-only onboarding state (Cross-FR rule 2): lives in sessionStorage,
 * never sent to a backend, gone when the tab closes.
 */
const KEY = 'pathway.session.v1'

export const emptyProfile: SessionProfile = {
  level: null,
  education: { degree: '', field: '' },
  experience: { years: '', internships: '' },
  skills: [],
  interests: [],
}

/**
 * Design-board frames (`?frame`) run in-memory only, seeded from the URL
 * (e.g. `?frame&level=recent-graduate&interests=marine biology`). Same-origin
 * iframes share sessionStorage, so frames must not touch it or they would
 * leak state into each other.
 */
const framed = new URLSearchParams(location.search).has('frame')

let state: SessionProfile = framed ? fromUrl(location.search) : read()
const listeners = new Set<() => void>()

function fromUrl(search: string): SessionProfile {
  const q = new URLSearchParams(search)
  const list = (k: string) => (q.get(k) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  return { ...emptyProfile, level: (q.get('level') as CareerLevel) || null, interests: list('interests'), skills: list('skills') }
}

function read(): SessionProfile {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? { ...emptyProfile, ...JSON.parse(raw) } : emptyProfile
  } catch {
    return emptyProfile
  }
}

function write(next: SessionProfile) {
  state = next
  if (!framed) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* private mode etc. — in-memory still works */
    }
  }
  listeners.forEach((l) => l())
}

export const session = {
  get: () => state,
  set: (patch: Partial<SessionProfile>) => write({ ...state, ...patch }),
  setLevel: (level: CareerLevel) => write({ ...state, level }),
  clearOptional: () => write({ ...emptyProfile, level: state.level }),
  reset: () => write(emptyProfile),
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
}

export function useSession() {
  return useSyncExternalStore(session.subscribe, session.get)
}

export function hasOptionalInput(p: SessionProfile) {
  return (
    p.skills.length > 0 ||
    p.interests.length > 0 ||
    !!p.education.degree ||
    !!p.education.field ||
    !!p.experience.years ||
    !!p.experience.internships
  )
}
