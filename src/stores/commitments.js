import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

/**
 * 承诺（生之出口的去向）
 *
 * 这是全站唯一主循环里原本缺失的一环：
 * 读完一段「讲死」的内容 → 被问一个问题 → 点了一个行动出口 →
 * 如果什么都不留下，这一圈就白转了。
 *
 * 所以每次点出口，都可以顺手立一个「我在 X 天内去做」的承诺。
 * 到期后它会回到首页置顶，反过来质问用户：做了吗？
 */
const STORAGE_KEY = KEYS.COMMITMENTS

/** 统一用补零的 YYYY-MM-DD，避免字符串排序错乱 */
function isoKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(date, n) {
  const d = new Date(date.getTime())
  d.setDate(d.getDate() + n)
  return d
}

export const useCommitmentsStore = defineStore('commitments', () => {
  const items = ref(loadJSON(STORAGE_KEY, {}))

  function persist() {
    saveJSON(STORAGE_KEY, items.value)
  }

  function uid() {
    return `c${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
  }

  /** 同一条内容的同一个出口，只保留一个未完成承诺 */
  function findOpen(sourceSlug, actionText) {
    return Object.values(items.value).find(
      c => !c.done && c.sourceSlug === sourceSlug && c.action === actionText
    )
  }

  /**
   * 立一个承诺。
   * @param {object} payload { action, link, sourceType, sourceSlug, sourceTitle, question, days }
   */
  function commit(payload = {}) {
    const {
      action = '',
      link = '',
      sourceType = '',
      sourceSlug = '',
      sourceTitle = '',
      question = '',
      days = 7
    } = payload

    if (sourceSlug && action) {
      const existed = findOpen(sourceSlug, action)
      if (existed) return existed
    }

    const now = new Date()
    const item = {
      id: uid(),
      action,
      link,
      sourceType,
      sourceSlug,
      sourceTitle,
      question,
      createdAt: isoKey(now),
      dueAt: isoKey(addDays(now, days)),
      dueTs: addDays(now, days).getTime(),
      done: false,
      doneAt: ''
    }
    items.value = { ...items.value, [item.id]: item }
    persist()
    return item
  }

  /**
   * 标记完成。note 是完成后的那一行回响——「那件事后来怎么样？」
   * 没有回响的完成只是打卡，有回响的完成才知道那次凝视到底改变了什么。
   */
  function markDone(id, note = '') {
    const item = items.value[id]
    if (!item) return
    items.value = {
      ...items.value,
      [id]: {
        ...item,
        done: true,
        doneAt: isoKey(new Date()),
        note: String(note || '').trim() || item.note || ''
      }
    }
    persist()
    return items.value[id]
  }

  function remove(id) {
    if (!items.value[id]) return
    const next = { ...items.value }
    delete next[id]
    items.value = next
    persist()
  }

  /** 改期：把到期日推后 n 天（从当天算，不是从原到期日算） */
  function postpone(id, days = 7) {
    const item = items.value[id]
    if (!item) return
    const d = addDays(new Date(), days)
    items.value = { ...items.value, [id]: { ...item, dueAt: isoKey(d), dueTs: d.getTime() } }
    persist()
  }

  const all = computed(() =>
    Object.values(items.value).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  )

  const open = computed(() => all.value.filter(c => !c.done))

  /** 已到期的承诺，最久未处理的排最前 */
  const due = computed(() => {
    const now = Date.now()
    return open.value
      .filter(c => (c.dueTs || 0) <= now)
      .sort((a, b) => (a.dueTs || 0) - (b.dueTs || 0))
  })

  /** 还没到期的，按到期时间由近到远 */
  const upcoming = computed(() => {
    const now = Date.now()
    return open.value
      .filter(c => (c.dueTs || 0) > now)
      .sort((a, b) => (a.dueTs || 0) - (b.dueTs || 0))
  })

  const doneCount = computed(() => all.value.filter(c => c.done).length)

  /** 近 7 天内完成的数量：首页主指标用「最近做了几件事」而非累积值 */
  const doneRecent = computed(() => {
    const cutoff = addDays(new Date(), -7)
    return all.value.filter(c => {
      if (!c.done || !c.doneAt) return false
      const parts = c.doneAt.split('-').map(Number)
      const d = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1)
      return d >= cutoff
    }).length
  })

  function reset() {
    items.value = {}
    persist()
  }

  return {
    items,
    all,
    open,
    due,
    upcoming,
    doneCount,
    doneRecent,
    commit,
    markDone,
    remove,
    postpone,
    reset
  }
})
