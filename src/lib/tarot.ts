export type TarotArcana = 'major' | 'minor'
export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles'

export type TarotCard = {
  id: string
  name: string
  arcana: TarotArcana
  suit?: TarotSuit
  rank?: string
  imageSrc?: string
}

export type DrawnCard = {
  card: TarotCard
  reversed: boolean
}

export type SpreadSlot = {
  key: string
  label: string
}

export type Spread = {
  id: string
  name: string
  slots: SpreadSlot[]
}

const MAJOR: Array<{ id: string; name: string }> = [
  { id: '00-fool', name: '愚者' },
  { id: '01-magician', name: '魔術師' },
  { id: '02-high-priestess', name: '女祭司' },
  { id: '03-empress', name: '皇后' },
  { id: '04-emperor', name: '皇帝' },
  { id: '05-hierophant', name: '教皇' },
  { id: '06-lovers', name: '戀人' },
  { id: '07-chariot', name: '戰車' },
  { id: '08-strength', name: '力量' },
  { id: '09-hermit', name: '隱者' },
  { id: '10-wheel', name: '命運之輪' },
  { id: '11-justice', name: '正義' },
  { id: '12-hanged-man', name: '倒吊人' },
  { id: '13-death', name: '死神' },
  { id: '14-temperance', name: '節制' },
  { id: '15-devil', name: '惡魔' },
  { id: '16-tower', name: '高塔' },
  { id: '17-star', name: '星星' },
  { id: '18-moon', name: '月亮' },
  { id: '19-sun', name: '太陽' },
  { id: '20-judgement', name: '審判' },
  { id: '21-world', name: '世界' },
]

const SUITS: Array<{ suit: TarotSuit; name: string }> = [
  { suit: 'wands', name: '權杖' },
  { suit: 'cups', name: '聖杯' },
  { suit: 'swords', name: '寶劍' },
  { suit: 'pentacles', name: '錢幣' },
]

const RANKS: string[] = [
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Page',
  'Knight',
  'Queen',
  'King',
]

const CARD_IMAGES: Record<string, string> = {
  '00-fool': 'tarot-card-the-fool.png',
  '01-magician': 'tarot-card-the-magician-fast.png',
  '02-high-priestess': 'tarot-card-high-priestess.png',
  '03-empress': 'tarot-card-the-empress-fast.png',
  '04-emperor': 'tarot-card-the-emperor-fast.png',
  '05-hierophant': 'tarot-card-the-hierophant-fast.png',
  '06-lovers': 'tarot-card-the-lovers-fast.png',
  '07-chariot': 'tarot-card-the-chariot-fast.png',
  '08-strength': 'tarot-card-strength-fast.png',
  '09-hermit': 'tarot-card-the-hermit-fast.png',
  '10-wheel': 'tarot-card-wheel-of-fortune-fast.png',
  '11-justice': 'tarot-card-justice-fast.png',
  '12-hanged-man': 'tarot-card-the-hanged-man-fast.png',
  '13-death': 'tarot-card-death-fast.png',
  '14-temperance': 'tarot-card-temperance-fast.png',
  '15-devil': 'tarot-card-the-devil-fast.png',
  '16-tower': 'tarot-card-the-tower-fast.png',
  '17-star': 'tarot-card-the-star-fast.png',
  '18-moon': 'tarot-card-the-moon-fast.png',
  '19-sun': 'tarot-card-the-sun-fast.png',
  '20-judgement': 'tarot-card-judgement-fast.png',
  '21-world': 'tarot-card-the-world-fast.png',
  'wands-ace': 'tarot-card-ace-of-wands-fast.png',
  'wands-2': 'tarot-card-two-of-wands-fast.png',
  'wands-3': 'tarot-card-three-of-wands-fast.png',
  'wands-4': 'tarot-card-four-of-wands-fast.png',
  'wands-5': 'tarot-card-five-of-wands-fast.png',
  'wands-6': 'tarot-card-six-of-wands-fast.png',
  'wands-7': 'tarot-card-seven-of-wands-fast.png',
  'wands-8': 'tarot-card-eight-of-wands-fast.png',
  'wands-9': 'tarot-card-nine-of-wands-fast.png',
  'wands-10': 'tarot-card-ten-of-wands-fast.png',
  'wands-page': 'tarot-card-page-of-wands-fast.png',
  'wands-knight': 'tarot-card-knight-of-wands-fast.png',
  'wands-queen': 'tarot-card-queen-of-wands-fast.png',
  'wands-king': 'tarot-card-king-of-wands-fast.png',
  'cups-ace': 'tarot-card-ace-of-cups-fast.png',
  'cups-2': 'tarot-card-two-of-cups-fast.png',
  'cups-3': 'tarot-card-three-of-cups-fast.png',
  'cups-4': 'tarot-card-four-of-cups-fast.png',
  'cups-5': 'tarot-card-five-of-cups-fast.png',
  'cups-6': 'tarot-card-six-of-cups-fast.png',
  'cups-7': 'tarot-card-seven-of-cups-fast.png',
  'cups-8': 'tarot-card-eight-of-cups-fast.png',
  'cups-9': 'tarot-card-nine-of-cups-fast.png',
  'cups-10': 'tarot-card-ten-of-cups-fast.png',
  'cups-page': 'tarot-card-page-of-cups-fast.png',
  'cups-knight': 'tarot-card-knight-of-cups-fast.png',
  'cups-queen': 'tarot-card-queen-of-cups-fast.png',
  'cups-king': 'tarot-card-king-of-cups-fast.png',
  'swords-ace': 'tarot-card-ace-of-swords-fast.png',
  'swords-2': 'tarot-card-two-of-swords-fast.png',
  'swords-3': 'tarot-card-three-of-swords-fast.png',
  'swords-4': 'tarot-card-four-of-swords-fast.png',
  'swords-5': 'tarot-card-five-of-swords-fast.png',
  'swords-6': 'tarot-card-six-of-swords-fast.png',
  'swords-7': 'tarot-card-seven-of-swords-fast.png',
  'swords-8': 'tarot-card-eight-of-swords-fast.png',
  'swords-9': 'tarot-card-nine-of-swords-fast.png',
  'swords-10': 'tarot-card-ten-of-swords-fast.png',
  'swords-page': 'tarot-card-page-of-swords-fast.png',
  'swords-knight': 'tarot-card-knight-of-swords-fast.png',
  'swords-queen': 'tarot-card-queen-of-swords-fast.png',
  'swords-king': 'tarot-card-king-of-swords-fast.png',
  'pentacles-ace': 'tarot-card-ace-of-pentacles-fast.png',
  'pentacles-2': 'tarot-card-two-of-pentacles-fast.png',
  'pentacles-3': 'tarot-card-three-of-pentacles-fast.png',
  'pentacles-4': 'tarot-card-four-of-pentacles-fast.png',
  'pentacles-5': 'tarot-card-five-of-pentacles-fast.png',
  'pentacles-6': 'tarot-card-six-of-pentacles-fast.png',
  'pentacles-7': 'tarot-card-seven-of-pentacles-fast.png',
  'pentacles-8': 'tarot-card-eight-of-pentacles-fast.png',
  'pentacles-9': 'tarot-card-nine-of-pentacles-fast.png',
  'pentacles-10': 'tarot-card-ten-of-pentacles-fast.png',
  'pentacles-page': 'tarot-card-page-of-pentacles-fast.png',
  'pentacles-knight': 'tarot-card-knight-of-pentacles-fast.png',
  'pentacles-queen': 'tarot-card-queen-of-pentacles-fast.png',
  'pentacles-king': 'tarot-card-king-of-pentacles-fast.png',
}

function imageSrcFor(cardId: string) {
  const fileName = CARD_IMAGES[cardId]
  return fileName ? `/cards-normalized/${fileName}` : undefined
}

export function buildTarotDeck(): TarotCard[] {
  const major: TarotCard[] = MAJOR.map((m) => ({
    id: m.id,
    name: m.name,
    arcana: 'major',
    imageSrc: imageSrcFor(m.id),
  }))

  const minor: TarotCard[] = []
  for (const s of SUITS) {
    for (const r of RANKS) {
      minor.push({
        id: `${s.suit}-${r.toLowerCase()}`,
        name: `${s.name} ${r}`,
        arcana: 'minor',
        suit: s.suit,
        rank: r,
        imageSrc: imageSrcFor(`${s.suit}-${r.toLowerCase()}`),
      })
    }
  }

  return [...major, ...minor]
}

