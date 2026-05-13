import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function DeckPile(props: {
  remaining: number
  onDraw: () => void
  disabled?: boolean
}) {
  const { remaining, onDraw, disabled } = props
  const layers = useMemo(() => Math.min(6, Math.max(1, Math.ceil(remaining / 14))), [remaining])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onDraw}
      className="group relative h-[260px] w-[180px] select-none disabled:cursor-not-allowed disabled:opacity-70"
      aria-label="抽牌"
    >
      <div className="absolute -inset-10 rounded-[40px] bg-fuchsia-500/10 blur-2xl transition group-hover:bg-fuchsia-500/15" />
      {Array.from({ length: layers }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ rotate: -2 + i * 0.7, y: i * 2, x: i * 1.5, opacity: 0 }}
          animate={{ rotate: -2 + i * 0.7, y: i * 2, x: i * 1.5, opacity: 1 }}
          whileHover={{ rotate: -3 + i * 0.9, y: i * 1.4, x: i * 1.2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 36, delay: i * 0.02 }}
          className="absolute inset-0"
        >
          <div className="h-full w-full rounded-[22px] border border-white/15 bg-gradient-to-br from-zinc-900/80 via-zinc-950/80 to-black/80 shadow-soft">
            <div className="absolute inset-[10px] rounded-[16px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,.25),transparent_55%),radial-gradient(circle_at_70%_30%,rgba(56,189,248,.18),transparent_50%)]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-200/90 backdrop-blur">
                點我抽牌
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </button>
  )
}

