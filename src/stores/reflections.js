import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

const parseDate = key => {
  const [y, m, d] = String(key).split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

/** 补零的 YYYY-MM-DD。旧数据是 2026-8-3 这种未补零格式，读取时两种都要认 */
const padKey = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** 把任意输入（Date / '2026-8-3' / '2026-08-03'）归一为补零 key */
function toKey(input) {
  if (!input) return null
  if (input instanceof Date) return padKey(input)
  const [y, m, d] = String(input).split('-').map(Number)
  if (!y || !m || !d) return null
  return padKey(new Date(y, m - 1, d))
}

export const useReflectionsStore = defineStore('reflections', () => {
  const STORAGE_KEY = KEYS.REFLECTIONS
  const reflections = ref(loadJSON(STORAGE_KEY, {}))

  const todayKey = computed(() => padKey(new Date()))

  // key 统一化：同一天的新旧两种写法合并，补零写法优先
  const normalized = computed(() => {
    const out = {}
    for (const [k, v] of Object.entries(reflections.value)) {
      const nk = toKey(k)
      if (!nk) continue
      if (out[nk] === undefined || out[nk] === '') out[nk] = v
    }
    return out
  })

  const todayEntry = computed(() => normalized.value[todayKey.value] || '')

  const hasWrittenToday = computed(() => !!todayEntry.value)

  const historyEntries = computed(() =>
    Object.entries(normalized.value)
      .map(([date, text]) => ({ date, text }))
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
  )

  function save() {
    saveJSON(STORAGE_KEY, reflections.value)
  }

  /** 写入某一天的反思，默认今天 */
  function saveEntry(text, date) {
    const key = toKey(date) || todayKey.value
    reflections.value = {
      ...reflections.value,
      [key]: text.trim()
    }
    save()
  }

  function getEntryByDate(dateStr) {
    const key = toKey(dateStr)
    if (!key) return ''
    if (normalized.value[key] !== undefined) return normalized.value[key]
    return reflections.value[dateStr] || ''
  }

  return {
    reflections,
    todayKey,
    todayEntry,
    hasWrittenToday,
    historyEntries,
    saveEntry,
    getEntryByDate
  }
})
