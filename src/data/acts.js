/**
 * 四幕剧 · 单一数据源
 * 网站的结构即人生的结构：觉知 → 凝视 → 整理 → 告别
 * 每一幕都有「入口内容」与「出口行动」，出口永远指向生。
 */
export const ACTS = [
  {
    id: 1,
    name: '晨光 · 觉知',
    short: '觉知',
    time: '晨光',
    emoji: '🌅',
    motto: '先理解死亡，再决定如何活。',
    desc: '死亡是被回避的真相。把它看清楚，很多日常的噪音会自行退场。',
    route: '/acts#act-1',
    accent: 'var(--color-gold)',
    accentDark: 'var(--color-gold-dark)',
    // 出口：觉知之后要去做的事
    exits: [
      { text: '读一篇文章', link: '/articles' },
      { text: '认识一种离开', link: '/ways-to-die' },
      { text: '一分钟死亡冥想', link: '/practices/daily-memento-mori' }
    ]
  },
  {
    id: 2,
    name: '午后 · 凝视',
    short: '凝视',
    time: '午后',
    emoji: '🌿',
    motto: '语言抵达不了的地方，诗可以。',
    desc: '当概念失效，诗歌与故事替我们说出说不出口的那部分。',
    route: '/acts#act-2',
    accent: 'var(--color-sage)',
    accentDark: 'var(--color-sage-light)',
    exits: [
      { text: '抽一支今日诗签', link: '/poetry' },
      { text: '读一个人的故事', link: '/stories' },
      { text: '逛悼亡诗词库', link: '/poetry/archive' }
    ]
  },
  {
    id: 3,
    name: '黄昏 · 整理',
    short: '整理',
    time: '黄昏',
    emoji: '🌇',
    motto: '把心愿写下来，然后去实现。',
    desc: '整理不是结束，是把重要的东西挑出来，趁还来得及。',
    route: '/acts#act-3',
    accent: 'var(--color-dusty-rose)',
    accentDark: 'var(--color-dusty-rose-light)',
    exits: [
      { text: '写下遗愿清单', link: '/bucketlist' },
      { text: '做一轮生命之轮', link: '/practices/life-wheel' },
      { text: '整理数字遗产', link: '/practices/digital-legacy' }
    ]
  },
  {
    id: 4,
    name: '夜晚 · 告别',
    short: '告别',
    time: '夜晚',
    emoji: '🌙',
    motto: '思念不是终点，而是继续爱。',
    desc: '告别的方式决定我们如何继续活。被记住的，就没有真正离开。',
    route: '/acts#act-4',
    accent: 'var(--color-warm-taupe)',
    accentDark: 'var(--color-ink)',
    exits: [
      { text: '写一封以防万一的信', link: '/letters' },
      { text: '记录我的意愿', link: '/advance-directives' },
      { text: '进入哀悼空间', link: '/memorial' }
    ]
  }
]

export function getAct(value) {
  const id = Number(value)
  return ACTS.find(a => a.id === id) || null
}

/**
 * 内容未标注 act 时按分类推断（覆盖 content/ 下全部实际分类）
 */
const CATEGORY_ACT_MAP = {
  死亡认知: 1,
  哲学思考: 1,
  历史文化: 1,
  文化与仪式: 1,
  生命故事: 2,
  生者说: 2,
  文学与死亡: 2,
  个人感悟: 2,
  活出意义: 3,
  整理练习: 3,
  反思练习: 3,
  晚间练习: 3,
  冥想练习: 1,
  临终与告别: 4,
  书写练习: 4,
  关系练习: 4,
  哀伤练习: 4,
  生活练习: 3
}

// 个别练习的归属比分类更准确
const SLUG_ACT_MAP = {
  'daily-memento-mori': 1,
  'one-minute-breath': 1,
  'life-wheel': 3,
  'digital-legacy': 3,
  'evening-gratitude': 3,
  'letter-to-loved-one': 4
}

export function inferAct({ act, category, slug } = {}) {
  if (act) return getAct(act)
  if (slug && SLUG_ACT_MAP[slug]) return getAct(SLUG_ACT_MAP[slug])
  if (category && CATEGORY_ACT_MAP[category]) return getAct(CATEGORY_ACT_MAP[category])
  return ACTS[0]
}
