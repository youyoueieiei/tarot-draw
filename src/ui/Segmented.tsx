import { motion } from 'framer-motion'

export function Segmented<T extends string>(props: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  const { value, onChange, options } = props
  return (
    <div className="relative inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
      {options.map((o) => {
        const selected = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="relative z-10 rounded-xl px-3 py-2 text-sm font-medium text-zinc-100/90 transition"
          >
            {selected ? (
              <motion.span
                layoutId="segmented-pill"
                className="absolute inset-0 z-0 rounded-xl bg-white/10 shadow-soft"
                transition={{ type: 'spring', stiffness: 550, damping: 40 }}
              />
            ) : null}
            <span className="relative z-10">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

