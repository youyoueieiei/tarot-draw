import { AnimatePresence, motion } from 'framer-motion'
import { getCardReading } from '../lib/interpretation'
import type { DrawnCard } from '../lib/tarot'
import { CardFace } from './CardFace'

export function CardDetailModal(props: {
  drawn: DrawnCard | null
  onClose: () => void
}) {
  const { drawn, onClose } = props
  const reading = drawn ? getCardReading(drawn) : null

  return (
    <AnimatePresence>
      {drawn && reading ? (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="關閉牌面解析"
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              className="pointer-events-auto grid max-h-[92svh] w-full max-w-4xl grid-cols-1 gap-5 overflow-auto rounded-3xl border border-white/10 bg-zinc-950/90 p-4 shadow-soft md:grid-cols-[minmax(260px,360px)_1fr] md:p-5"
              initial={{ y: 28, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 18, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            >
              <div className="mx-auto w-full max-w-[360px]">
                <CardFace card={drawn.card} reversed={drawn.reversed} size="md" />
              </div>

              <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs font-medium tracking-[0.22em] text-zinc-400">
                      CARD READING
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
                      {reading.title}
                    </h2>
                    <div className="mt-1 text-sm text-zinc-300/75">{reading.subtitle}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-100/90">
                    {reading.text}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/10 active:scale-[0.99]"
                >
                  關閉
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

