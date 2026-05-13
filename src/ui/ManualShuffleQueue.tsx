import { motion } from 'framer-motion'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { TarotCard } from '../lib/tarot'
import { CardBack } from './CardBack'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const CARD_W = 96
const CARD_H = 144

export function ManualShuffleQueue(props: {
  cards: TarotCard[]
  spread: number
  onSpreadChange: (v: number) => void
  onPickIndex: (index: number) => void
  onCutAt: (k: number) => void
  onRandomCut: () => void
  /** 抽牌堆最上一張（索引 0） */
  onPickTop?: () => void
  /** 隨機抽一張 */
  onPickRandom?: () => void
  disabled?: boolean
}) {
  const {
    cards,
    spread,
    onSpreadChange,
    onPickIndex,
    onCutAt,
    onRandomCut,
    onPickTop,
    onPickRandom,
    disabled,
  } = props

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  /** 0..1 along valid cut range; `cutK` is derived so deck size changes never need a sync effect. */
  const [cutT, setCutT] = useState(0.5)

  const n = cards.length

  const cutK = useMemo(() => {
    if (n < 2) return 1
    if (n === 2) return 1
    return 1 + Math.round((n - 2) * clamp(cutT, 0, 1))
  }, [n, cutT])

  const step = useMemo(() => {
    const t = clamp(spread, 0, 1)
    const minStep = 22
    const maxStep = CARD_W * 0.92
    return minStep + (maxStep - minStep) * t
  }, [spread])

  const stripWidth = useMemo(() => {
    if (n <= 0) return '100%'
    return Math.max(320, (n - 1) * step + CARD_W + 48)
  }, [n, step])

  const handlePick = useCallback(
    (index: number) => {
      if (disabled) return
      onPickIndex(index)
    },
    [disabled, onPickIndex],
  )

  const applyCut = useCallback(() => {
    if (n < 2) return
    onCutAt(cutK)
  }, [cutK, n, onCutAt])

  const canQuick = !disabled && n > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-zinc-300/80">
          橫向捲動瀏覽牌背；<strong className="text-zinc-200/90">點一下</strong>即抽出該張。亦可
          <strong className="text-zinc-200/90">略向上拖</strong>抽出。滑桿可推開牌距。
        </div>
        <div className="flex w-full min-w-[200px] max-w-md items-center gap-3 sm:w-auto">
          <span className="shrink-0 text-[10px] text-zinc-400">緊</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(spread * 100)}
            disabled={disabled || n <= 1}
            onChange={(e) => onSpreadChange(Number(e.target.value) / 100)}
            className="h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="推開牌距"
          />
          <span className="shrink-0 text-[10px] text-zinc-400">鬆</span>
        </div>
      </div>

      {onPickTop && onPickRandom ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!canQuick}
            onClick={onPickTop}
            className="rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/15 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-fuchsia-500/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            抽最上一張
          </button>
          <button
            type="button"
            disabled={!canQuick}
            onClick={onPickRandom}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-white/10 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            隨機抽一張
          </button>
        </div>
      ) : null}

      {n >= 2 ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="text-[11px] font-medium text-zinc-200/90">切牌</div>
            <div className="text-[10px] leading-snug text-zinc-400">
              從左數保留前 {cutK} 張為一疊，其餘整疊搬到最上方（經典切牌）。
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="shrink-0 text-[10px] text-zinc-500">1</span>
              <input
                type="range"
                min={1}
                max={Math.max(1, n - 1)}
                value={cutK}
                disabled={disabled}
                onChange={(e) => {
                  const k = Number(e.target.value)
                  const span = Math.max(1, n - 2)
                  setCutT((k - 1) / span)
                }}
                className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="切牌位置"
              />
              <span className="shrink-0 text-[10px] text-zinc-500">{Math.max(1, n - 1)}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={applyCut}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-white/8 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              套用切牌
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onRandomCut}
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-medium text-zinc-100 transition hover:bg-black/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              隨機切牌
            </button>
          </div>
        </div>
      ) : null}

      <div
        id="manual-shuffle-queue"
        className="relative overflow-x-auto overflow-y-hidden rounded-2xl border border-white/10 bg-black/25 py-4 pl-4 pr-6 shadow-inner [scrollbar-width:thin]"
      >
        <div
          className="relative mx-auto flex h-[168px] items-end justify-start pb-1"
          style={{ width: stripWidth, minHeight: CARD_H + 24 }}
        >
          {cards.map((c, i) => (
            <QueueCard
              key={c.id}
              index={i}
              step={step}
              disabled={disabled}
              isDragging={draggingIndex === i}
              onDragStart={() => {
                setDraggingIndex(i)
              }}
              onDragEnd={(didPick) => {
                setDraggingIndex(null)
                if (didPick) handlePick(i)
              }}
              onTapPick={() => handlePick(i)}
            />
          ))}
          {n === 0 ? (
            <div className="flex w-full items-center justify-center py-10 text-sm text-zinc-400">
              沒有剩餘的牌
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function QueueCard(props: {
  index: number
  step: number
  disabled?: boolean
  isDragging: boolean
  onDragStart: () => void
  onDragEnd: (picked: boolean) => void
  onTapPick: () => void
}) {
  const { index, step, disabled, isDragging, onDragStart, onDragEnd, onTapPick } = props
  const maxDrag = useRef(0)

  const left = index * step

  return (
    <motion.div
      className="absolute bottom-0"
      style={{ left, width: CARD_W, height: CARD_H + 4, zIndex: index + 2 }}
      layout
      transition={{ type: 'spring', stiffness: 520, damping: 38 }}
    >
      <div className="relative h-full w-full">
        <motion.button
          type="button"
          disabled={disabled}
          drag="y"
          dragMomentum={false}
          dragElastic={0.12}
          dragConstraints={{ top: -140, bottom: 0 }}
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: CARD_W,
            height: CARD_H,
            touchAction: 'pan-x',
          }}
          className="absolute rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/55"
          onPointerDown={() => {
            maxDrag.current = 0
          }}
          onDragStart={() => {
            onDragStart()
          }}
          onDrag={(_, info) => {
            maxDrag.current = Math.max(maxDrag.current, Math.hypot(info.offset.x, info.offset.y))
          }}
          onDragEnd={(_, info) => {
            const picked = info.offset.y < -40 || info.velocity.y < -260
            if (picked) {
              onDragEnd(true)
              return
            }
            onDragEnd(false)
          }}
          onClick={() => {
            if (maxDrag.current > 12) return
            onTapPick()
          }}
          whileHover={disabled ? undefined : { y: -4, scale: 1.02 }}
          whileTap={disabled ? undefined : { scale: 0.99 }}
          aria-label={`第 ${index + 1} 張牌，點擊抽出；或略向上拖曳抽出`}
        >
          <div className="pointer-events-none h-full w-full scale-[0.92] origin-bottom">
            <CardBack size="sm" />
          </div>
          {isDragging ? (
            <div className="pointer-events-none absolute -top-7 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 text-[10px] text-zinc-100/90 backdrop-blur">
              放開抽出
            </div>
          ) : null}
        </motion.button>
      </div>
    </motion.div>
  )
}
