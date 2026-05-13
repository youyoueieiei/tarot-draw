import type { DrawnCard, Spread, SpreadSlot } from '../lib/tarot'
import { CardFace } from './CardFace'

/** 每個牌位外框相同寬高（約 2:3，與牌面比例一致） */
const SLOT_BOX =
  'aspect-[2/3] w-[118px] shrink-0 sm:w-[124px] md:w-[128px] lg:w-[132px]'

function SpreadSlot(props: {
  slot: SpreadSlot
  drawn: DrawnCard | undefined
  disabled: boolean
  cardSize: 'sm' | 'md'
  className?: string
  onPress: () => void
}) {
  const { slot, drawn, disabled, cardSize, className = '', onPress } = props
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      className={[
        'group box-border flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2 text-left transition hover:bg-black/25 disabled:cursor-not-allowed disabled:opacity-70 md:p-2.5',
        SLOT_BOX,
        className,
      ].join(' ')}
    >
      <div className="flex shrink-0 items-center justify-between gap-1">
        <div className="line-clamp-2 text-[9px] leading-tight text-zinc-300/85 md:text-[10px]">
          {slot.label}
        </div>
        <div className="hidden shrink-0 text-[8px] text-zinc-400 sm:block md:text-[9px]">
          {drawn ? '解析' : '抽'}
        </div>
      </div>
      <div className="mt-1 flex min-h-0 flex-1 flex-col md:mt-1.5">
        {drawn ? (
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <CardFace card={drawn.card} reversed={drawn.reversed} size={cardSize} />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 text-[9px] text-zinc-300/70 md:text-[10px]">
            空
          </div>
        )}
      </div>
    </button>
  )
}

/** 占位：與牌位同尺寸，維持網格每格等大 */
function SlotPlaceholder() {
  return (
    <div
      className={`pointer-events-none invisible ${SLOT_BOX}`}
      aria-hidden
    />
  )
}

function slotByKey(spread: Spread, key: string) {
  return spread.slots.find((s) => s.key === key)
}

export function SpreadSlotBoard(props: {
  spread: Spread
  slotToCard: Record<string, DrawnCard | undefined>
  hasCards: boolean
  onSlotPress: (key: string, drawn: DrawnCard | undefined) => void
}) {
  const { spread, slotToCard, hasCards, onSlotPress } = props

  const press = (key: string) => {
    const drawn = slotToCard[key]
    onSlotPress(key, drawn)
  }

  const disabledFor = (key: string) => !hasCards && !slotToCard[key]

  const cell = 'flex items-center justify-center min-h-0 p-1 sm:p-1.5'

  if (spread.id === 'one') {
    const s = spread.slots[0]!
    return (
      <div className="mt-5 flex justify-center py-6 md:py-10">
        <div className={cell}>
          <SpreadSlot
            slot={s}
            drawn={slotToCard[s.key]}
            disabled={disabledFor(s.key)}
            cardSize="sm"
            onPress={() => press(s.key)}
          />
        </div>
      </div>
    )
  }

  if (spread.id === 'three') {
    const order = ['past', 'present', 'future'] as const
    return (
      <div className="mt-5 flex flex-col items-center gap-4 py-4 md:gap-5 md:py-8">
        <div className="text-center text-[10px] text-zinc-500 md:text-xs">時間軸 · 由上而下</div>
        <div className="flex flex-col items-center gap-3 md:gap-4">
          {order.map((key) => {
            const s = slotByKey(spread, key)
            if (!s) return null
            return (
              <div key={key} className={cell}>
                <SpreadSlot
                  slot={s}
                  drawn={slotToCard[key]}
                  disabled={disabledFor(key)}
                  cardSize="sm"
                  onPress={() => press(key)}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (spread.id === 'love') {
    const you = slotByKey(spread, 'you')
    const them = slotByKey(spread, 'them')
    const between = slotByKey(spread, 'between')
    const advice = slotByKey(spread, 'advice')
    if (!you || !them || !between || !advice) return null
    return (
      <div className="mt-5 flex flex-col items-center gap-3 py-4 md:py-6">
        <div className="text-center text-[10px] text-zinc-500 md:text-xs">
          感情三角 · 每格等大；中央為關係能量
        </div>
        <div className="grid w-full max-w-[min(100%,520px)] grid-cols-3 justify-items-center gap-y-3 sm:gap-4">
          <SlotPlaceholder />
          <div className={cell}>
            <SpreadSlot
              slot={you}
              drawn={slotToCard[you.key]}
              disabled={disabledFor(you.key)}
              cardSize="sm"
              onPress={() => press(you.key)}
            />
          </div>
          <SlotPlaceholder />
          <div className={cell}>
            <SpreadSlot
              slot={them}
              drawn={slotToCard[them.key]}
              disabled={disabledFor(them.key)}
              cardSize="sm"
              onPress={() => press(them.key)}
            />
          </div>
          <div className={cell}>
            <SpreadSlot
              slot={between}
              drawn={slotToCard[between.key]}
              disabled={disabledFor(between.key)}
              cardSize="sm"
              onPress={() => press(between.key)}
            />
          </div>
          <SlotPlaceholder />
          <SlotPlaceholder />
          <div className={cell}>
            <SpreadSlot
              slot={advice}
              drawn={slotToCard[advice.key]}
              disabled={disabledFor(advice.key)}
              cardSize="sm"
              onPress={() => press(advice.key)}
            />
          </div>
          <SlotPlaceholder />
        </div>
      </div>
    )
  }

  if (spread.id === 'celtic') {
    const get = (k: string) => slotByKey(spread, k)
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const
    for (const k of keys) {
      if (!get(k)) return null
    }

    return (
      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="text-center text-[10px] text-zinc-500 md:text-xs">
            十字區 · 三欄等大；中央為現況與交會之阻礙／助力
          </div>
          <div
            className="grid w-full max-w-[min(100%,480px)] grid-cols-3 gap-2 sm:gap-3"
            style={{
              gridTemplateRows: 'auto auto auto',
              gridTemplateAreas: `
                ". p5 ."
                "p4 cross p6"
                ". p3 ."
              `,
            }}
          >
            <div style={{ gridArea: 'p5' }} className={cell}>
              <SpreadSlot
                slot={get('5')!}
                drawn={slotToCard['5']}
                disabled={disabledFor('5')}
                cardSize="sm"
                onPress={() => press('5')}
              />
            </div>
            <div style={{ gridArea: 'p4' }} className={cell}>
              <SpreadSlot
                slot={get('4')!}
                drawn={slotToCard['4']}
                disabled={disabledFor('4')}
                cardSize="sm"
                onPress={() => press('4')}
              />
            </div>
            <div style={{ gridArea: 'cross' }} className={`relative ${cell}`}>
              <div className="relative z-0 flex items-center justify-center">
                <SpreadSlot
                  slot={get('1')!}
                  drawn={slotToCard['1']}
                  disabled={disabledFor('1')}
                  cardSize="sm"
                  onPress={() => press('1')}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible">
                <div className="pointer-events-auto origin-center [&_button]:shadow-lg">
                  <div className="rotate-90">
                    <SpreadSlot
                      slot={get('2')!}
                      drawn={slotToCard['2']}
                      disabled={disabledFor('2')}
                      cardSize="sm"
                      className="!bg-black/40"
                      onPress={() => press('2')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ gridArea: 'p6' }} className={cell}>
              <SpreadSlot
                slot={get('6')!}
                drawn={slotToCard['6']}
                disabled={disabledFor('6')}
                cardSize="sm"
                onPress={() => press('6')}
              />
            </div>
            <div style={{ gridArea: 'p3' }} className={cell}>
              <SpreadSlot
                slot={get('3')!}
                drawn={slotToCard['3']}
                disabled={disabledFor('3')}
                cardSize="sm"
                onPress={() => press('3')}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2 lg:w-auto lg:shrink-0">
          <div className="text-center text-[10px] text-zinc-500 md:text-xs">
            右柱 · 由下而上
          </div>
          <div className="grid w-full max-w-[min(100%,520px)] grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:max-w-[160px] lg:flex-col-reverse lg:gap-3">
            {(['7', '8', '9', '10'] as const).map((k) => (
              <div key={k} className={cell}>
                <SpreadSlot
                  slot={get(k)!}
                  drawn={slotToCard[k]}
                  disabled={disabledFor(k)}
                  cardSize="sm"
                  onPress={() => press(k)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 grid grid-cols-2 justify-items-center gap-3 md:grid-cols-3">
      {spread.slots.map((slot) => (
        <div key={slot.key} className={cell}>
          <SpreadSlot
            slot={slot}
            drawn={slotToCard[slot.key]}
            disabled={disabledFor(slot.key)}
            cardSize="sm"
            onPress={() => press(slot.key)}
          />
        </div>
      ))}
    </div>
  )
}
