import { motion } from 'framer-motion'
import { useRef, type RefObject } from 'react'
import type { DrawnCard } from '../lib/tarot'
import { CardFace } from './CardFace'

export type PlacedDrawnCard = {
  placementId: string
  drawn: DrawnCard
  xPct: number
  yPct: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function pointInRect(px: number, py: number, r: DOMRect) {
  return px >= r.left && px <= r.right && py >= r.top && py <= r.bottom
}

/** motion 的 PanInfo.point 為 page 座標，需與 getBoundingClientRect（視窗座標）對齊 */
function pageToViewport(p: { x: number; y: number }) {
  if (typeof window === 'undefined') return p
  return { x: p.x - window.scrollX, y: p.y - window.scrollY }
}

function eventViewportPoint(e: MouseEvent | TouchEvent | PointerEvent) {
  if ('clientX' in e && typeof e.clientX === 'number') {
    return { x: e.clientX, y: e.clientY }
  }
  if ('changedTouches' in e && e.changedTouches[0]) {
    const t = e.changedTouches[0]
    return { x: t.clientX, y: t.clientY }
  }
  return null
}

export type DiscardedBoardEntry = {
  entryId: string
  drawn: DrawnCard
}

export function FreeSpreadBoard(props: {
  items: PlacedDrawnCard[]
  onMove: (placementId: string, xPct: number, yPct: number) => void
  onInspect: (drawn: DrawnCard) => void
  emptyHint: string
  className?: string
  /** 拖入右側棄牌區時移出桌面（可選） */
  onDiscard?: (placementId: string) => void
  discarded?: DiscardedBoardEntry[]
  /** 桌面已抽牌外框縮放（1 = 預設；自由牌建議 0.6） */
  placedCardScale?: number
  /** 全螢幕父層內撐滿高度 */
  fillHeight?: boolean
}) {
  const {
    items,
    onMove,
    onInspect,
    emptyHint,
    className,
    onDiscard,
    discarded = [],
    placedCardScale = 1,
    fillHeight = false,
  } = props
  const dragBoundsRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const discardRef = useRef<HTMLElement>(null)

  const shell = [className, fillHeight ? 'flex min-h-0 flex-1 flex-col' : ''].filter(Boolean).join(' ')
  const boundsShell = [
    'flex w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,.10),transparent_42%),radial-gradient(circle_at_80%_85%,rgba(56,189,248,.08),transparent_45%)] shadow-inner',
    fillHeight ? 'min-h-0 flex-1' : 'min-h-[400px] md:min-h-[480px]',
  ].join(' ')
  const playShell = [
    'relative min-w-0 flex-1 overflow-hidden',
    fillHeight ? 'min-h-0 flex-1' : 'min-h-[400px] md:min-h-[480px]',
  ].join(' ')

  return (
    <div className={shell}>
      <div ref={dragBoundsRef} className={boundsShell}>
        <div ref={boardRef} className={playShell}>
          <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-4 text-center text-[10px] text-zinc-500">
            拖曳牌卡可自由排版 · 拖至右側棄牌堆可移出桌面 · 輕點開啟解析
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 py-16 text-center text-sm text-zinc-400 md:min-h-[420px]">
              {emptyHint}
            </div>
          ) : null}

          {items.map((item) => (
            <DraggablePlacedCard
              key={item.placementId}
              dragBoundsRef={dragBoundsRef}
              boardRef={boardRef}
              discardRef={discardRef}
              item={item}
              cardScale={placedCardScale}
              onCommit={(xPct, yPct) => onMove(item.placementId, xPct, yPct)}
              onDiscard={onDiscard ? () => onDiscard(item.placementId) : undefined}
              onInspect={() => onInspect(item.drawn)}
            />
          ))}
        </div>

        <aside
          ref={discardRef}
          className="flex w-[120px] shrink-0 flex-col border-l border-white/10 bg-black/30 px-2 py-3 md:w-[136px]"
        >
          <div className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            棄牌堆
          </div>
          <div className="mt-1 text-center text-[9px] leading-tight text-zinc-500">
            拖牌到此
          </div>
          <div className="relative mt-2 flex min-h-[200px] flex-1 flex-col items-stretch">
            {discarded.length === 0 ? (
              <div className="mt-4 px-1 text-center text-[10px] leading-snug text-zinc-600">
                尚無棄牌
              </div>
            ) : (
              <>
                <div className="mb-2 shrink-0 text-center text-[10px] tabular-nums text-zinc-400">
                  共 {discarded.length} 張
                </div>
                <div className="max-h-[min(52vh,320px)] w-full overflow-y-auto overflow-x-hidden pr-0.5 [scrollbar-width:thin]">
                  <ul className="flex flex-col gap-2 pb-2">
                    {[...discarded].reverse().map((entry) => (
                      <li key={entry.entryId}>
                        <button
                          type="button"
                          className="flex w-full flex-col gap-1 overflow-hidden rounded-lg border border-white/10 bg-black/35 p-1.5 text-left shadow-sm transition hover:border-fuchsia-400/40"
                          onClick={() => onInspect(entry.drawn)}
                        >
                          <div className="mx-auto w-[56px] md:w-[64px]">
                            <CardFace card={entry.drawn.card} reversed={entry.drawn.reversed} size="sm" />
                          </div>
                          <div className="line-clamp-2 px-0.5 text-center text-[9px] leading-tight text-zinc-300">
                            {entry.drawn.card.name}
                            <span className="text-zinc-500">
                              {entry.drawn.reversed ? ' · 逆' : ' · 正'}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function DraggablePlacedCard(props: {
  dragBoundsRef: RefObject<HTMLDivElement | null>
  boardRef: RefObject<HTMLDivElement | null>
  discardRef: RefObject<HTMLElement | null>
  item: PlacedDrawnCard
  cardScale: number
  onCommit: (xPct: number, yPct: number) => void
  onDiscard?: () => void
  onInspect: () => void
}) {
  const { dragBoundsRef, boardRef, discardRef, item, cardScale, onCommit, onDiscard, onInspect } = props
  const selfRef = useRef<HTMLDivElement>(null)
  const maxDrag = useRef(0)

  const compact = cardScale < 0.999
  const outerCls = compact
    ? 'absolute w-[89px] touch-none select-none md:w-[101px]'
    : 'absolute w-[148px] touch-none select-none md:w-[168px]'

  return (
    <motion.div
      ref={selfRef}
      drag
      dragConstraints={dragBoundsRef}
      dragElastic={0.05}
      dragMomentum={false}
      className={outerCls}
      style={{
        left: `${item.xPct}%`,
        top: `${item.yPct}%`,
        x: '-50%',
        y: '-50%',
        zIndex: 20,
      }}
      whileDrag={{ scale: 1.03, zIndex: 60, cursor: 'grabbing' }}
      onPointerDown={() => {
        maxDrag.current = 0
      }}
      onDrag={(_, info) => {
        maxDrag.current = Math.max(maxDrag.current, Math.hypot(info.offset.x, info.offset.y))
      }}
      onDragEnd={(e, info) => {
        const board = boardRef.current?.getBoundingClientRect()
        const el = selfRef.current?.getBoundingClientRect()
        const discardBox = discardRef.current?.getBoundingClientRect()
        if (!board || !el) return

        const cxClient = el.left + el.width / 2
        const cyClient = el.top + el.height / 2

        const pxInfo = info.point.x
        const pyInfo = info.point.y
        const fromEvent = eventViewportPoint(e)
        const fromPan = pageToViewport({ x: pxInfo, y: pyInfo })
        const pxView = fromEvent?.x ?? fromPan.x
        const pyView = fromEvent?.y ?? fromPan.y

        let shouldDiscard = false
        if (onDiscard && discardBox) {
          const pointerInDiscard = pointInRect(pxView, pyView, discardBox)
          const centerInDiscard = pointInRect(cxClient, cyClient, discardBox)
          shouldDiscard = pointerInDiscard || centerInDiscard
        }

        if (onDiscard && shouldDiscard) {
          onDiscard()
          return
        }

        const rawCx = ((cxClient - board.left) / board.width) * 100
        const rawCy = ((cyClient - board.top) / board.height) * 100
        const halfWPct = (el.width / board.width) * 50
        const halfHPct = (el.height / board.height) * 50
        const cx = clamp(rawCx, halfWPct + 0.5, 100 - halfWPct - 0.5)
        const cy = clamp(rawCy, halfHPct + 0.5, 100 - halfHPct - 0.5)
        onCommit(cx, cy)
      }}
      onClick={() => {
        if (maxDrag.current > 12) return
        onInspect()
      }}
    >
      <div
        className={[
          'rounded-2xl border border-white/10 bg-black/25 shadow-soft',
          compact ? 'p-1' : 'p-2',
        ].join(' ')}
      >
        <CardFace
          card={item.drawn.card}
          reversed={item.drawn.reversed}
          size={compact ? 'sm' : 'md'}
        />
      </div>
    </motion.div>
  )
}
