import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

export const useGazeStore = defineStore('gaze', () => {
  const STORAGE_KEY = KEYS.GAZE_LOG
  const log = ref(loadJSON(STORAGE_KEY, {}))

  function dateKey(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }

  const todayKey = computed(() => dateKey(new Date()))

  const hasGazedToday = computed(() => !!log.value[todayKey.value])

  /**
   * 连续凝视天数。今天还没凝视时从昨天往前数，
   * 避免早上打开网站时连续天数看起来被清零。
   */
  const streak = computed(() => {
    let count = 0
    const d = new Date()
    if (!log.value[dateKey(d)]) {
      d.setDate(d.getDate() - 1)
    }
    while (log.value[dateKey(d)]) {
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  })

  function recordGaze() {
    if (log.value[todayKey.value]) return
    log.value = { ...log.value, [todayKey.value]: true }
    saveJSON(STORAGE_KEY, log.value)
  }

  return { log, todayKey, hasGazedToday, streak, recordGaze }
})
