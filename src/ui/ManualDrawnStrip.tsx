import type { DrawnCard } from '../lib/tarot'
import { CardFace } from './CardFace'

export function ManualDrawnStrip(props: {
  items: DrawnCard[]
  onInspect: (d: DrawnCard) => void
}) {
  const { items, onInspect } = props

  if (items.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-10 text-center text-sm leading-relaxed text-zinc-500">
        尚無已抽牌。在上方牌列<strong className="text-zinc-300">點一下</strong>牌背即可抽出；或使用
        <strong className="text-zinc-300">「抽最上一張」</strong>、<strong className="text-zinc-300">「隨機抽一張」</strong>。
      </div>
    )
  }

  const reversed = [...items].reverse()

  return (
    <div className="mt-6">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
        已抽出 · 由左至右為最近抽到的牌（點牌看解析）
      </div>
      <div className="flex max-w-full gap-2 overflow-x-auto overflow-y-hidden pb-2 pt-1 [scrollbar-width:thin]">
        {reversed.map((d, i) => (
          <button
            key={`${items.length - 1 - i}-${d.card.id}`}
            type="button"
            onClick={() => onInspect(d)}
            className="group shrink-0 rounded-xl border border-white/10 bg-black/25 p-1.5 text-left shadow-soft transition hover:border-fuchsia-300/35 hover:bg-black/35"
          >
            <div className="w-[88px] sm:w-[96px]">
              <CardFace card={d.card} reversed={d.reversed} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
