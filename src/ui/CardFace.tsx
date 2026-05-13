import { motion } from 'framer-motion'
import type { TarotCard } from '../lib/tarot'

const SUIT_LABEL: Record<string, string> = {
  wands: '權杖',
  cups: '聖杯',
  swords: '寶劍',
  pentacles: '錢幣',
}

export function CardFace(props: { card: TarotCard; reversed: boolean; size: 'sm' | 'md' }) {
  const { card, reversed, size } = props
  const suit = card.suit ? SUIT_LABEL[card.suit] ?? card.suit : null
  const subtitle =
    card.arcana === 'major' ? '大阿爾克那' : `${suit ?? ''}${card.rank ? ` · ${card.rank}` : ''}`
  const hasImage = Boolean(card.imageSrc)

  return (
    <motion.div
      layout
      className={[
        'relative w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-soft',
        hasImage ? 'p-0' : size === 'sm' ? 'p-3' : 'p-4',
      ].join(' ')}
      animate={{ rotate: reversed ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      style={{ transformOrigin: '50% 50%' }}
    >
      {card.imageSrc ? (
        <div className="relative aspect-[2/3] w-full bg-black">
          <img
            src={card.imageSrc}
            alt={card.name}
            className="h-full w-full object-cover"
            loading="lazy"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/25" />
          <div className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] text-zinc-100/90 backdrop-blur">
            {reversed ? '逆位' : '正位'}
          </div>
        </div>
      ) : (
        <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,.22),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,.14),transparent_55%)]" />
      <div className="relative flex aspect-[2/3] w-full flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[10px] font-medium tracking-[0.24em] text-zinc-200/80">
            {card.arcana === 'major' ? 'MAJOR' : 'MINOR'}
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] text-zinc-200/80">
            {reversed ? '逆位' : '正位'}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className={size === 'sm' ? 'text-base font-semibold' : 'text-lg font-semibold'}>
            {card.name}
          </div>
          <div className="text-xs text-zinc-200/75">{subtitle}</div>
        </div>
      </div>
        </>
      )}
    </motion.div>
  )
}

