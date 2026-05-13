import { useEffect, useId, useRef, useState } from 'react'
import type { Spread } from '../lib/tarot'

export function SpreadSelect(props: {
  spreads: Spread[]
  value: string
  onChange: (spreadId: string) => void
}) {
  const { spreads, value, onChange } = props
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const current = spreads.find((s) => s.id === value) ?? spreads[0]!

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={`${listId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${listId}-list` : undefined}
        onClick={() => setOpen((o) => !o)}
        className="flex min-w-[10.5rem] items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-left text-sm text-zinc-100 shadow-soft outline-none transition hover:border-white/15 hover:bg-black/30 focus-visible:border-fuchsia-300/45 focus-visible:ring-2 focus-visible:ring-fuchsia-300/35"
      >
        <span className="truncate">{current.name}</span>
        <span className="shrink-0 text-[10px] text-zinc-400" aria-hidden>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <div
          id={`${listId}-list`}
          role="listbox"
          aria-labelledby={`${listId}-trigger`}
          className="absolute right-0 z-[100] mt-1 max-h-[min(70vh,22rem)] w-[min(calc(100vw-2rem),22rem)] overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-zinc-950 py-1 shadow-2xl shadow-black/60 ring-1 ring-white/5 [scrollbar-width:thin]"
        >
          {spreads.map((s) => {
            const selected = s.id === value
            return (
              <button
                key={s.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(s.id)
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center px-3 py-2.5 text-left text-sm transition',
                  selected
                    ? 'bg-fuchsia-500/20 text-zinc-50'
                    : 'text-zinc-200 hover:bg-white/8 hover:text-zinc-50',
                ].join(' ')}
              >
                {s.name}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
