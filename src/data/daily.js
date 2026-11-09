/**
 * 「今日」内容的统一选取逻辑。
 * 同一天内结果必须稳定，且与访问次数、页面位置无关——
 * 首页、/today、以及任何入口拿到的「今日一篇」都应当是同一篇。
 */

/** 该日期在当年中的序号（1 月起算） */
export function dayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  return Math.floor((date - start) / 86400000)
}

/** 以「日」为单位变化的稳定整数，用于取模选内容 */
export function dailySeed(date = new Date()) {
  return date.getFullYear() * 1000 + dayOfYear(date)
}

/** 按种子从列表取一项；列表为空返回 null */
export function pickByDay(list, date = new Date()) {
  if (!Array.isArray(list) || !list.length) return null
  return list[dailySeed(date) % list.length]
}

/** 按种子从列表取一项，允许附加过滤条件 */
export function pickByDayWhere(list, predicate, date = new Date()) {
  const pool = (list || []).filter(predicate)
  return pickByDay(pool, date)
}

/** 中文问候语，按小时变化 */
export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '晨光初现'
  if (h < 12) return '上午好'
  if (h < 14) return '午安'
  if (h < 18) return '午后静好'
  return '傍晚来临'
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

/** 2026年8月3日 · 星期一 */
export function dateLabel(date = new Date()) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 星期${WEEKDAYS[date.getDay()]}`
}
