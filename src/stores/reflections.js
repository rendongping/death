import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReflectionsStore = defineStore('reflections', () => {
  const STORAGE_KEY = 'mv-reflections'
  const reflections = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'))

  const todayKey = computed(() => {
    const d = new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  })

  const todayEntry = computed(() => reflections.value[todayKey.value] || '')

  const hasWrittenToday = computed(() => !!todayEntry.value)

  const historyEntries = computed(() => {
    return Object.entries(reflections.value)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, text]) => ({ date, text }))
  })

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections.value))
  }

  function saveEntry(text) {
    reflections.value = {
      ...reflections.value,
      [todayKey.value]: text.trim()
    }
    save()
  }

  function getEntryByDate(dateStr) {
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
