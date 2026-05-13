import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { buildTarotDeck, type DrawnCard, type Spread } from './lib/tarot'
import { CardDetailModal } from './ui/CardDetailModal'
import { DeckPile } from './ui/DeckPile'
import { FanPicker } from './ui/FanPicker'
import { FreeSpreadBoard, type DiscardedBoardEntry, type PlacedDrawnCard } from './ui/FreeSpreadBoard'
import { ManualDrawnStrip } from './ui/ManualDrawnStrip'
import { ManualShuffleQueue } from './ui/ManualShuffleQueue'
import { Segmented } from './ui/Segmented'
import { SpreadSelect } from './ui/SpreadSelect'
import { SpreadSlotBoard } from './ui/SpreadSlotBoard'

function newPlacementId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function App() {
  const deck = useMemo(() => buildTarotDeck(), [])
  const spreads: Spread[] = useMemo(
    () => [
      {
        id: 'one',
        name: '單張',
        slots: [{ key: 'card', label: '指引' }],
      },
      {
        id: 'three',
        name: '三張（過去/現在/未來）',
        slots: [
          { key: 'past', label: '過去' },
          { key: 'present', label: '現在' },
          { key: 'future', label: '未來' },
        ],
      },
      {
        id: 'love',
        name: '感情三角',
        slots: [
          { key: 'you', label: '你' },
          { key: 'them', label: '對方' },
          { key: 'between', label: '關係能量' },
          { key: 'advice', label: '建議' },
        ],
      },
      {
        id: 'celtic',
        name: '凱爾特十字',
        slots: [
          { key: '1', label: '現況' },
          { key: '2', label: '阻礙/助力' },
          { key: '3', label: '潛意識' },
          { key: '4', label: '過去' },
          { key: '5', label: '顯意識' },
          { key: '6', label: '近未來' },
          { key: '7', label: '自我' },
          { key: '8', label: '環境' },
          { key: '9', label: '希望/恐懼' },
          { key: '10', label: '結果' },
        ],
      },
    ],
    [],
  )

  const [mode, setMode] = useState<'spread' | 'free' | 'manual'>('spread')
  const [manualSpread, setManualSpread] = useState(0.14)
  const [spreadId, setSpreadId] = useState(spreads[1]!.id)
  const spread = spreads.find((s) => s.id === spreadId) ?? spreads[0]!

  const [seed, setSeed] = useState(1)
  const [shuffleAnim, setShuffleAnim] = useState(0)
  const [slotToCard, setSlotToCard] = useState<Record<string, DrawnCard | undefined>>(
    {},
  )
  const [placedFreeCards, setPlacedFreeCards] = useState<PlacedDrawnCard[]>([])
  const [discardPile, setDiscardPile] = useState<DiscardedBoardEntry[]>([])
  const placedFreeCardsRef = useRef<PlacedDrawnCard[]>([])
  placedFreeCardsRef.current = placedFreeCards
  const [fanOpen, setFanOpen] = useState(false)
  const [fanSession, setFanSession] = useState(0)
  const freeBoardShellRef = useRef<HTMLDivElement>(null)
  const [freeBoardFullscreen, setFreeBoardFullscreen] = useState(false)
  const [pendingTarget, setPendingTarget] = useState<
    { type: 'slot'; key: string } | { type: 'free' } | null
  >(null)
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null)
  const [manualDrawn, setManualDrawn] = useState<DrawnCard[]>([])

  const [pile, setPile] = useState(() => [...deck])

  useEffect(() => {
    const syncFs = () => {
      const el = freeBoardShellRef.current
      setFreeBoardFullscreen(Boolean(el && document.fullscreenElement === el))
    }
    document.addEventListener('fullscreenchange', syncFs)
    return () => document.removeEventListener('fullscreenchange', syncFs)
  }, [])

  useEffect(() => {
    if (mode !== 'free' && freeBoardShellRef.current && document.fullscreenElement === freeBoardShellRef.current) {
      void document.exitFullscreen().catch(() => {})
    }
  }, [mode])

  const toggleFreeBoardFullscreen = async () => {
    const el = freeBoardShellRef.current
    if (!el || mode !== 'free') return
    try {
      if (document.fullscreenElement === el) await document.exitFullscreen()
      else await el.requestFullscreen()
    } catch {
      /* ignore */
    }
  }

  const remaining = pile.length
  const hasCards = remaining > 0

  const hash = (s: string) => {
    let h = 2166136261
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return h >>> 0
  }

  const isReversed = (cardId: string) => {
    const h = hash(`${seed}:${cardId}:${remaining}`)
    return (h & 1) === 1
  }

  const emptySlots = useMemo(() => {
    return spread.slots.filter((s) => !slotToCard[s.key]).map((s) => s.key)
  }, [spread.slots, slotToCard])

  const resetForShuffle = () => {
    setSlotToCard({})
    setPlacedFreeCards([])
    setDiscardPile([])
    setManualDrawn([])
    setFanOpen(false)
    setPendingTarget(null)
    setSelectedCard(null)
  }

  const shuffleNow = (nextSeed: number) => {
    // Deterministic shuffle (same algorithm as `shuffled` useMemo)
    const next = [...deck]
    let s = nextSeed
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 2 ** 32
    }
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[next[i], next[j]] = [next[j]!, next[i]!]
    }
    return next
  }

  const shuffle = () => {
    setShuffleAnim((n) => n + 1)
    const nextSeed = (seed + 1) >>> 0
    setSeed(nextSeed)
    setPile(shuffleNow(nextSeed))
    resetForShuffle()
  }

  const openFan = (target?: { type: 'slot'; key: string } | { type: 'free' }) => {
    if (!hasCards) return
    if (target) setPendingTarget(target)
    setFanSession((s) => s + 1)
    setFanOpen(true)
  }

  const commitDrawn = (drawn: DrawnCard, target?: { type: 'slot'; key: string } | { type: 'free' }) => {
    if (target?.type === 'free') {
      setPlacedFreeCards((arr) => {
        const i = arr.length
        const xPct = Math.min(88, Math.max(12, 38 + (i % 9) * 6))
        const yPct = Math.min(86, Math.max(24, 52 + Math.floor(i / 9) * 9))
        return [...arr, { placementId: newPlacementId(), drawn, xPct, yPct }]
      })
      return
    }

    if (target?.type === 'slot') {
      setSlotToCard((m) => ({ ...m, [target.key]: drawn }))
      return
    }

    const key = emptySlots[0]
    if (!key) {
      setPlacedFreeCards((arr) => {
        const i = arr.length
        const xPct = Math.min(88, Math.max(12, 38 + (i % 9) * 6))
        const yPct = Math.min(86, Math.max(24, 52 + Math.floor(i / 9) * 9))
        return [...arr, { placementId: newPlacementId(), drawn, xPct, yPct }]
      })
      return
    }
    setSlotToCard((m) => ({ ...m, [key]: drawn }))
  }

  const movePlacedFreeCard = (placementId: string, xPct: number, yPct: number) => {
    setPlacedFreeCards((arr) =>
      arr.map((p) => (p.placementId === placementId ? { ...p, xPct, yPct } : p)),
    )
  }

  const discardPlacedCard = (placementId: string) => {
    const found = placedFreeCardsRef.current.find((p) => p.placementId === placementId)
    if (!found) return
    setDiscardPile((d) => [...d, { entryId: newPlacementId(), drawn: found.drawn }])
    setPlacedFreeCards((arr) => arr.filter((p) => p.placementId !== placementId))
  }

  const pickFromFan = (indexInVisible: number) => {
    const idx = indexInVisible
    const card = pile[idx]
    if (!card) return

    const drawn: DrawnCard = { card, reversed: isReversed(card.id) }
    setPile((arr) => arr.filter((_, i) => i !== idx))
    setFanOpen(false)

    const target = pendingTarget ?? (mode === 'free' ? { type: 'free' as const } : undefined)
    setPendingTarget(null)
    commitDrawn(drawn, target)
  }

  const pickFromManualQueue = (idx: number) => {
    const card = pile[idx]
    if (!card) return

    const drawn: DrawnCard = { card, reversed: isReversed(card.id) }
    setPile((arr) => arr.filter((_, i) => i !== idx))
    setManualDrawn((prev) => [...prev, drawn])
  }

  const cutPileAt = (k: number) => {
    setPile((arr) => {
      const len = arr.length
      if (len < 2) return arr
      const kk = Math.max(1, Math.min(len - 1, k))
      return [...arr.slice(kk), ...arr.slice(0, kk)]
    })
  }

  const randomCutPile = () => {
    setPile((arr) => {
      const len = arr.length
      if (len < 2) return arr
      const k = 1 + Math.floor(Math.random() * (len - 1))
      return [...arr.slice(k), ...arr.slice(0, k)]
    })
  }

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-xs font-medium tracking-[0.24em] text-zinc-400">
            TAROT DRAW
          </div>
          <div className="text-3xl font-semibold tracking-tight md:text-4xl">
            塔羅抽牌
          </div>
          <div className="text-sm text-zinc-300/80">
            自主洗牌、排陣與自由牌；手動洗牌改為點選或快速抽牌，已抽牌列在下方
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={mode}
            onChange={(v) => {
              setMode(v)
              resetForShuffle()
            }}
            options={[
              { value: 'spread', label: '排陣抽牌' },
              { value: 'free', label: '自由牌' },
              { value: 'manual', label: '手動洗牌' },
            ]}
          />
          <button
            type="button"
            onClick={shuffle}
            className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 shadow-soft backdrop-blur transition hover:bg-white/8 active:scale-[0.99]"
          >
            <span className="h-2 w-2 rounded-full bg-fuchsia-400/80 shadow-[0_0_24px_rgba(192,132,252,.7)]" />
            自主洗牌
            <span className="ml-1 text-xs text-zinc-400">{remaining} 張</span>
          </button>
        </div>
      </header>

      <main
        className={
          mode === 'manual'
            ? 'grid grid-cols-1 gap-6'
            : 'grid grid-cols-1 gap-6 md:grid-cols-[360px_1fr]'
        }
      >
        {mode !== 'manual' ? (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-zinc-100">牌堆</div>
              <div className="text-xs text-zinc-300/70">點牌堆抽牌；洗牌會重置已抽出的牌</div>
            </div>
            <div className="text-right text-xs text-zinc-300/70">
              <div>已抽：{78 - remaining}</div>
              <div>剩餘：{remaining}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <DeckPile
              key={shuffleAnim}
              remaining={remaining}
              onDraw={() => {
                openFan(mode === 'free' ? { type: 'free' } : undefined)
              }}
              disabled={!hasCards}
            />
          </div>

          <div className="mt-5">
            <AnimatePresence mode="popLayout">
              {hasCards ? (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="text-xs text-zinc-300/70">
                    抽牌方式：點牌堆展開扇形，直接選你想要的那一張
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-200"
                >
                  牌堆已抽完。按「自主洗牌」重新開始。
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-zinc-100">
                {mode === 'free' ? '自由牌' : mode === 'manual' ? '手動洗牌' : '排陣'}
              </div>
              <div className="text-xs text-zinc-300/70">
                {mode === 'free'
                  ? '抽到桌面後可任意拖曳排版；牌面為較小尺寸。輕點牌面看解析。右上「全螢幕桌面」可專注排版。'
                  : mode === 'manual'
                    ? '橫向捲動牌列，點牌背即可抽出；可用「抽最上一張」「隨機抽一張」。切牌可重排牌堆。已抽牌顯示在下方橫列。'
                    : '點槽位抽牌，或直接點牌堆抽到下一個空槽位'}
              </div>
              {mode === 'manual' ? (
                <div className="text-xs tabular-nums text-zinc-400">
                  剩餘 {remaining} 張 · 已抽 {78 - remaining} 張
                </div>
              ) : null}
            </div>

            {mode === 'spread' ? (
              <div className="flex items-center gap-2">
                <div className="text-xs text-zinc-300/70">排陣</div>
                <SpreadSelect
                  spreads={spreads}
                  value={spreadId}
                  onChange={(id) => {
                    setSpreadId(id)
                    resetForShuffle()
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'manual') {
                      setManualDrawn([])
                    } else {
                      setPlacedFreeCards([])
                      setDiscardPile([])
                    }
                  }}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100 transition hover:bg-black/30 active:scale-[0.99]"
                >
                  清空
                </button>
                {mode === 'free' ? (
                  <button
                    type="button"
                    onClick={() => void toggleFreeBoardFullscreen()}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-100 transition hover:bg-black/30 active:scale-[0.99]"
                  >
                    {freeBoardFullscreen ? '退出全螢幕' : '全螢幕桌面'}
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {mode === 'spread' ? (
            <SpreadSlotBoard
              spread={spread}
              slotToCard={slotToCard}
              hasCards={hasCards}
              onSlotPress={(key, drawn) => {
                if (drawn) {
                  setSelectedCard(drawn)
                  return
                }
                setPendingTarget({ type: 'slot', key })
                openFan({ type: 'slot', key })
              }}
            />
          ) : (
            <>
              {mode === 'manual' ? (
                <div className="mt-5">
                  <ManualShuffleQueue
                    cards={pile}
                    spread={manualSpread}
                    onSpreadChange={setManualSpread}
                    onPickIndex={pickFromManualQueue}
                    onCutAt={cutPileAt}
                    onRandomCut={randomCutPile}
                    onPickTop={() => pickFromManualQueue(0)}
                    onPickRandom={() => {
                      if (pile.length === 0) return
                      pickFromManualQueue(Math.floor(Math.random() * pile.length))
                    }}
                    disabled={!hasCards}
                  />
                  <ManualDrawnStrip items={manualDrawn} onInspect={(d) => setSelectedCard(d)} />
                </div>
              ) : null}

              {mode === 'free' ? (
                <div
                  ref={freeBoardShellRef}
                  className="mt-5 flex flex-col gap-2 [&:fullscreen]:box-border [&:fullscreen]:min-h-[100dvh] [&:fullscreen]:bg-zinc-950 [&:fullscreen]:p-4 [&:fullscreen]:flex [&:fullscreen]:flex-col"
                >
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                    已抽出 · 牌陣桌面
                  </div>
                  <FreeSpreadBoard
                    className={freeBoardFullscreen ? 'min-h-0 flex-1' : ''}
                    items={placedFreeCards}
                    onMove={movePlacedFreeCard}
                    onDiscard={discardPlacedCard}
                    discarded={discardPile}
                    placedCardScale={0.6}
                    fillHeight={freeBoardFullscreen}
                    onInspect={(d) => setSelectedCard(d)}
                    emptyHint="尚無已抽牌：點左側牌堆展開扇形後選牌"
                  />
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>

      <FanPicker
        key={fanSession}
        open={fanOpen}
        cards={pile}
        onClose={() => {
          setFanOpen(false)
          setPendingTarget(null)
        }}
        onPick={pickFromFan}
      />
      <CardDetailModal drawn={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}

export default App
