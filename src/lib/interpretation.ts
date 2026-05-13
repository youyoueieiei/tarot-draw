import type { DrawnCard, TarotSuit } from './tarot'

const MAJOR_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  '00-fool': {
    upright: '新的開始正在展開，適合帶著好奇心前進。提醒你保留彈性，但也別忽略基本風險。',
    reversed: '現在可能有些衝動或準備不足。先停一下，確認方向與代價再行動。',
  },
  '01-magician': {
    upright: '你手上已有足夠資源，可以把想法落實。關鍵是集中意志並開始行動。',
    reversed: '能量有些分散，或有人沒有把話說清楚。先釐清動機與工具，再推進下一步。',
  },
  '02-high-priestess': {
    upright: '直覺與潛意識正在給你訊號。暫時不必急著表態，先觀察隱藏的資訊。',
    reversed: '你可能忽略了內心的提醒，或被表象干擾。安靜下來，答案會更清楚。',
  },
  '03-empress': {
    upright: '滋養、創造與成長的能量很強。適合培育關係、作品或生活中的美感。',
    reversed: '可能有過度付出或照顧不足的失衡。先把自己的狀態養回來。',
  },
  '04-emperor': {
    upright: '秩序、邊界與責任是現在的主題。用清楚規則穩住局面會更有效。',
    reversed: '控制欲或僵化可能讓事情卡住。試著用穩定而非強硬的方式處理。',
  },
  '05-hierophant': {
    upright: '傳統、學習與制度能提供支持。找可信任的規則或導師，會讓你少走彎路。',
    reversed: '你可能需要跳出既有框架。不是反叛本身重要，而是找到真正適合你的道路。',
  },
  '06-lovers': {
    upright: '這張牌指向選擇、連結與價值一致。真誠溝通會讓關係或決策更穩固。',
    reversed: '關係或選擇裡可能有不一致。先確認彼此想要的是不是同一件事。',
  },
  '07-chariot': {
    upright: '意志力與方向感能帶你突破阻力。保持專注，你可以掌控局面。',
    reversed: '目前可能用力過猛或方向分散。先調整節奏，避免被情緒拉著走。',
  },
  '08-strength': {
    upright: '真正的力量來自溫柔與自持。用耐心處理局面，比硬碰硬更有效。',
    reversed: '你可能對自己太苛刻，或壓抑了情緒。先安撫內在，再談掌控外在。',
  },
  '09-hermit': {
    upright: '這是向內尋找答案的時刻。獨處、反思與慢下來會帶來清晰。',
    reversed: '你可能把自己隔離太久，或逃避與外界互動。適度求助會有幫助。',
  },
  '10-wheel': {
    upright: '局勢正在轉動，機會與變化同時出現。順勢調整，比硬抗更有利。',
    reversed: '變化可能讓你感到失控。先接受週期起伏，再找可掌握的小行動。',
  },
  '11-justice': {
    upright: '公平、因果與清楚判斷是重點。用事實說話，決定會更站得住腳。',
    reversed: '可能有資訊不對等或判斷偏差。先補齊證據，不要急著下結論。',
  },
  '12-hanged-man': {
    upright: '暫停不是失敗，而是換角度的機會。放下執著後，新的解法會浮現。',
    reversed: '你可能卡在無效等待中。若觀點已經清楚，就該做出取捨。',
  },
  '13-death': {
    upright: '某個階段正在結束，為新的狀態騰出空間。放手會比拖延更輕鬆。',
    reversed: '你可能抗拒必要的轉變。越抓緊舊模式，越難進入下一章。',
  },
  '14-temperance': {
    upright: '平衡、整合與耐心是答案。把兩端調和起來，事情會逐漸順流。',
    reversed: '節奏可能失衡，或情緒被拉得太滿。先恢復中庸，再處理問題。',
  },
  '15-devil': {
    upright: '這張牌提醒你看見束縛、慾望或依賴。當你承認它，就開始有選擇。',
    reversed: '你正在鬆開某種限制。保持誠實，別再回到讓你消耗的模式。',
  },
  '16-tower': {
    upright: '突發變動會打破不穩的結構。雖然震盪，但也讓真相浮上檯面。',
    reversed: '你可能已經感覺到問題，卻仍在拖延。小幅修正勝過被迫崩塌。',
  },
  '17-star': {
    upright: '希望、療癒與願景正在回來。相信長期方向，讓自己重新補充能量。',
    reversed: '信心可能暫時低落。先照顧身心，再慢慢找回值得相信的光。',
  },
  '18-moon': {
    upright: '現在有迷霧、情緒與未知。別急著相信第一個解釋，多觀察夢與直覺。',
    reversed: '真相正在慢慢浮現。困惑會減少，但你仍需要溫柔面對不安。',
  },
  '19-sun': {
    upright: '清晰、喜悅與生命力增加。這是適合公開、表達與享受成果的牌。',
    reversed: '光仍在，只是被壓低了。別忽視小小進展，它們會把你帶回明朗。',
  },
  '20-judgement': {
    upright: '召喚、覺醒與重新評估正在發生。你準備好回應更高層次的選擇。',
    reversed: '你可能害怕面對評價或過去。真正的審判不是責備，而是讓你更新。',
  },
  '21-world': {
    upright: '一個循環走向完成，整合與成熟感正在出現。可以慶祝，也可以準備新旅程。',
    reversed: '事情接近完成但仍有收尾。補上最後一塊拼圖，別急著跳到下一步。',
  },
}

const SUIT_THEMES: Record<TarotSuit, string> = {
  wands: '行動、熱情與創造力',
  cups: '情感、關係與直覺',
  swords: '思考、溝通與抉擇',
  pentacles: '金錢、身體與現實基礎',
}

/** 小牌數字 9 四花色語意不同，不可共用同一段落 */
const NINE_READINGS: Record<TarotSuit, { upright: string; reversed: string }> = {
  wands: {
    upright:
      '權杖九：你已堅守防線多時，距離目標很近，但身心負擔也加重。這是耐力與界線的考驗，記得在堅持之餘稍作喘息。',
    reversed:
      '防衛心可能過強，或其實已撐不住卻不願示弱。評估哪些堅持仍值得，必要時向可信的人求助。',
  },
  cups: {
    upright:
      '聖杯九：願望與情感上的滿足感正在接近，常有「如願以償」的氛圍。珍惜當下擁有，也別忘記感恩與分享。',
    reversed:
      '表面滿足底下可能仍有缺口，或期待過高。誠實面對自己真正想要的是什麼，比維持形象更重要。',
  },
  swords: {
    upright:
      '寶劍九：憂慮、失眠或反覆思量的能量很強。問題多半在腦中放大，先處理身體與睡眠，再拆解事實與想像。',
    reversed:
      '黎明將近，壓力有機會緩解。若仍陷在焦慮迴圈，試著寫下擔憂、找人談開，或尋求專業支持。',
  },
  pentacles: {
    upright:
      '錢幣九：自律與耕耘帶來穩定與獨立，能享受自己創造的成果與舒適。這張牌也象徵對生活品質與自我價值的肯定。',
    reversed:
      '可能過度依賴物質安全感，或獨立背後其實孤獨。檢視是否用工作／財務迴避其他面向的需求。',
  },
}

const RANK_THEMES: Record<string, { upright: string; reversed: string }> = {
  Ace: {
    upright: '新的種子正在出現，值得主動接住。',
    reversed: '機會尚未完全成形，先整理資源與動機。',
  },
  '2': {
    upright: '你正在處理平衡、選擇或合作。',
    reversed: '失衡或猶豫會消耗能量，需要做出更清楚的排序。',
  },
  '3': {
    upright: '合作、擴展與初步成果正在形成。',
    reversed: '溝通或基礎可能不穩，先校準期待。',
  },
  '4': {
    upright: '穩定與休整很重要，適合建立安全感。',
    reversed: '過度保守可能讓成長停滯，試著鬆動一點。',
  },
  '5': {
    upright: '挑戰與摩擦正在提醒你調整方式。',
    reversed: '衝突有機會緩和，但需要放下無謂的對抗。',
  },
  '6': {
    upright: '支持、過渡或回饋會帶來改善。',
    reversed: '別停留在過去的模式裡，重新建立互惠。',
  },
  '7': {
    upright: '你需要辨識選項、守住立場或看清策略。',
    reversed: '分心或防衛過度會讓判斷變鈍，先回到核心。',
  },
  '8': {
    upright: '事情正在加速，也需要持續投入。',
    reversed: '節奏不順或能量堵塞，先排除阻礙。',
  },
  '10': {
    upright: '一個週期來到頂點，成果與責任同時出現。',
    reversed: '負擔可能過重，該放下不再屬於你的部分。',
  },
  Page: {
    upright: '新的訊息、學習或好奇心正在打開道路。',
    reversed: '經驗仍不足，先觀察與練習，不必急著證明自己。',
  },
  Knight: {
    upright: '行動力正在上升，適合朝目標前進。',
    reversed: '速度可能過快或方向不穩，先修正路線。',
  },
  Queen: {
    upright: '成熟的感受力與掌握力正在發揮作用。',
    reversed: '照顧他人前，先確認自己是否也被照顧。',
  },
  King: {
    upright: '你可以用穩定與經驗掌控局面。',
    reversed: '權威或控制感可能失衡，回到負責而非壓迫。',
  },
}

export function getCardReading(drawn: DrawnCard) {
  const { card, reversed } = drawn
  const position = reversed ? '逆位' : '正位'

  if (card.arcana === 'major') {
    const meaning = MAJOR_MEANINGS[card.id]
    return {
      title: `${card.name} · ${position}`,
      subtitle: '大阿爾克那',
      text:
        meaning?.[reversed ? 'reversed' : 'upright'] ??
        '這張牌代表重要的人生課題。請把它視為當下最需要被看見的核心訊息。',
    }
  }

  const rank = card.rank ?? ''
  const suit = card.suit ?? 'wands'
  const theme = SUIT_THEMES[suit]
  const nineReading = rank === '9' ? NINE_READINGS[suit] : undefined
  const meaning = nineReading ?? RANK_THEMES[rank]
  return {
    title: `${card.name} · ${position}`,
    subtitle: theme,
    text:
      meaning?.[reversed ? 'reversed' : 'upright'] ??
      `這張牌與${theme}有關。留意它在你問題中指向的具體情境。`,
  }
}

