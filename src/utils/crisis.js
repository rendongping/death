/**
 * 危机资源自动挂载判定
 *
 * CrisisCard 原来只在四个页面手写挂载。用户在文章里读到「自杀」这一段时，
 * 屏幕上却没有一个可以打的号码，这是内容侧最大的漏洞。
 * 判定顺序：frontmatter 显式声明 > 标签/分类命中 > 正文关键词密度命中。
 */

/** 显式关闭：内容本身是冷静讨论自杀学理，挂了反而打扰 */
const OFF_VALUES = ['off', 'false', 'no', '0']

const CRISIS_TAGS = [
  '自杀',
  '轻生',
  '抑郁',
  '自伤',
  '心理危机',
  '失去',
  '丧亲',
  '哀伤',
  '悲伤',
  '遗憾',
  '临终',
  '临终关怀',
  '安宁疗护'
]

const CRISIS_CATEGORIES = ['临终与告别', '死亡认知', '哀伤与疗愈']

// 正文关键词：出现一次即算，「自杀」这类词需要出现两次以上才挂，避免一句引用就打断阅读
const STRONG_WORDS = ['不想活', '活不下去', '结束自己的生命', '结束生命', '割腕', '自伤', '轻生']
const WEAK_WORDS = ['自杀', '抑郁症', '抑郁']
const WEAK_THRESHOLD = 2

function countOccurrences(text, word) {
  let count = 0
  let idx = text.indexOf(word)
  while (idx !== -1) {
    count += 1
    idx = text.indexOf(word, idx + word.length)
  }
  return count
}

function asList(value) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    return value
      .split(/[,，、\s]+/)
      .map(s => s.trim())
      .filter(Boolean)
  }
  return []
}

/**
 * @param {object} metadata frontmatter
 * @param {string} body 去 frontmatter 后的正文（纯文本或 markdown）
 */
export function needsCrisis(metadata = {}, body = '') {
  const flag = String(metadata.crisis ?? '').toLowerCase()
  if (OFF_VALUES.includes(flag)) return false
  if (flag === 'true' || flag === 'on' || flag === '1' || flag === 'yes') return true

  const tags = asList(metadata.tags)
  if (tags.some(t => CRISIS_TAGS.includes(t))) return true
  if (CRISIS_CATEGORIES.includes(String(metadata.category || ''))) return true

  const text = String(body || '')
  if (!text) return false
  if (STRONG_WORDS.some(w => text.includes(w))) return true
  const weak = WEAK_WORDS.reduce((n, w) => n + countOccurrences(text, w), 0)
  return weak >= WEAK_THRESHOLD
}
