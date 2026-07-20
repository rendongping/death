import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'

export const useReflectionsStore = defineStore('reflections', () => {
  const STORAGE_KEY = 'mv-reflections'
  const reflections = ref(loadJSON(STORAGE_KEY, {}))

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
    saveJSON(STORAGE_KEY, reflections.value)
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
