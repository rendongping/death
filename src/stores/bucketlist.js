import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBucketlistStore = defineStore('bucketlist', () => {
  const STORAGE_KEY = 'mv-bucketlist'
  const items = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function addItem(title, note = '') {
    items.value.push({
      id: Date.now(),
      title,
      note,
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
