import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import type { TarotCard } from '../lib/tarot'
import { CardBack } from './CardBack'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function FanPicker(props: {
  open: boolean
  cards: TarotCard[]
  maxCards?: number
  onClose: () => void
  onPick: (indexInDeck: number) => void
}) {
  const { open, cards, onClose, onPick } = props
  const maxCards = props.maxCards ?? 18

  const [startIndex, setStartIndex] = useState(0)
  const dragStartX = useRef<number | null>(null)

  const maxNavigate = Math.max(0, cards.length - maxCards)
  const safeStart = clamp(startIndex, 0, maxNavigate)
  const endIndex = Math.min(cards.length, safeStart + maxCards)
  const visible = useMemo(() => {
    // Windowed render for performance; allow dragging to browse all cards.
    return cards.slice(safeStart, endIndex)
  }, [cards, endIndex, safeStart])

  const count = visible.length
  const spreadDeg = clamp(12 + count * 1.2, 18, 52)
  const canPrev = safeStart > 0
  const canNext = safeStart < maxNavigate
  const lastWindowStart = maxNavigate
  const step = Math.max(1, Math.floor(maxCards * 0.7))

  const goPrev = () => {
    if (safeStart === 0) {
      setStartIndex(lastWindowStart)
      return
    }
    setStartIndex((s) => Math.max(0, s - step))
  }
  const goNext = () => {
    if (!canNext) {
      setStartIndex(0)
      return
    }
    setStartIndex((s) => Math.min(maxNavigate, s + step))
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="關閉"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 mx-auto flex w-full max-w-6xl items-end justify-center px-4 pb-8">
            <motion.div
              className="pointer-events-auto relative w-full"
              initial={{ y: 30, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-zinc-100">選一張牌</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-zinc-300/70">可拖曳展開 · 兩側箭頭換批（首尾循環）</div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-white/8 active:scale-[0.99]"
                  >
                    關閉
                  </button>
                </div>
              </div>

              <div className="relative h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,.18),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,.12),transparent_55%)]" />

                <motion.div
                  className="relative mx-auto flex h-full w-full items-end justify-center"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.08}
                  onDragStart={(_, info) => {
                    dragStartX.current = info.point.x
                  }}
                  onDragEnd={(_, info) => {
                    const startX = dragStartX.current
                    dragStartX.current = null
                    const dx = startX == null ? info.offset.x : info.point.x - startX
                    const threshold = 60
                    if (dx < -threshold) {
                      if (safeStart === 0) {
                        setStartIndex(lastWindowStart)
                      } else if (!canNext) {
                        setStartIndex(0)
                      } else {
                        goNext()
                      }
                      return
                    }
                    if (dx > threshold) {
                      if (!canNext) {
                        setStartIndex(0)
                      } else if (canPrev) {
                        goPrev()
                      }
                    }
                  }}
                >
                  {visible.map((_, i) => {
                    const t = count <= 1 ? 0.5 : i / (count - 1)
                    const rot = -spreadDeg / 2 + t * spreadDeg
                    const x = (t - 0.5) * clamp(32 + count * 10, 160, 420)
                    const y = Math.abs(t - 0.5) * 30
                    const z = i

                    return (
                      <motion.button
                        key={safeStart + i}
                        type="button"
                        className="absolute bottom-3 h-[240px] w-[160px] origin-[50%_100%] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/50"
                        style={{ zIndex: z }}
                        initial={{ opacity: 0, y: 30, rotate: rot * 0.6 }}
                        animate={{ opacity: 1, y: 0, rotate: rot, x, translateY: -y }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 40, delay: i * 0.015 }}
                        whileHover={{
                          translateY: -y - 18,
                          scale: 1.03,
                          transition: { type: 'spring', stiffness: 650, damping: 32 },
                        }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onPick(safeStart + i)}
                      >
                        <CardBack size="md" />
                      </motion.button>
                    )
                  })}
                </motion.div>

                <div className="pointer-events-none absolute inset-y-0 left-0 z-[70] flex w-14 items-center justify-start pl-1 sm:w-16 sm:pl-2">
                  <button
                    type="button"
                    aria-label="上一批牌（在第一段時會跳到最後一段）"
                    onClick={(e) => {
                      e.stopPropagation()
                      goPrev()
                    }}
                    className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/55 text-lg text-zinc-100 shadow-lg backdrop-blur transition hover:border-fuchsia-300/40 hover:bg-black/70 sm:h-14 sm:w-14 sm:text-xl"
                  >
                    ‹
                  </button>
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-[70] flex w-14 items-center justify-end pr-1 sm:w-16 sm:pr-2">
                  <button
                    type="button"
                    aria-label="下一批牌（在最後一段時會回到開頭）"
                    onClick={(e) => {
                      e.stopPropagation()
                      goNext()
                    }}
                    className="pointer-events-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/55 text-lg text-zinc-100 shadow-lg backdrop-blur transition hover:border-fuchsia-300/40 hover:bg-black/70 sm:h-14 sm:w-14 sm:text-xl"
                  >
                    ›
                  </button>
                </div>

                <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-center justify-between text-xs text-zinc-200/70">
                  <div>
                    可選：{visible.length} / 剩餘：{cards.length}（第 {safeStart + 1}–{endIndex}{' '}
                    張）
                  </div>
                  <div>
                    {maxNavigate > 0
                      ? '拖曳或按左右鈕換批；在第一段往左、最後一段往右會循環'
                      : '目前牌數不多，一次即可瀏覽'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

