import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

/**
 * 遗愿清单的唯一持有者。
 * 组件（清单板 / 生命倒计 / 生命日历）一律读这里的 getter，
 * 不要自己 loadJSON 同一份数据——两边各自整份写回会互相覆盖。
 */
export const useBucketlistStore = defineStore('bucketlist', () => {
  const STORAGE_KEY = KEYS.BUCKETLIST
  const items = ref(loadJSON(STORAGE_KEY, []))

  const pendingItems = computed(() =>
    items.value.filter(i => !i.done).sort((a, b) => b.createdAt - a.createdAt)
  )

  const completedItems = computed(() =>
    items.value.filter(i => i.done).sort((a, b) => b.completedAt - a.completedAt)
  )

  const progress = computed(() => {
    if (items.value.length === 0) return 0
    return Math.round((completedItems.value.length / items.value.length) * 100)
  })

  function save() {
    saveJSON(STORAGE_KEY, items.value)
  }

  function addItem(title, note = '', category = '') {
    items.value.push({
      id: Date.now(),
      title,
      note,
      category,
      done: false,
      createdAt: Date.now(),
      completedAt: null
    })
    save()
  }

  function toggleItem(id) {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    item.done = !item.done
    item.completedAt = item.done ? Date.now() : null
    save()
  }

  function deleteItem(id) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  return {
    items,
    pendingItems,
    completedItems,
    progress,
    addItem,
    toggleItem,
    deleteItem
  }
})
