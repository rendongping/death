import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'

export const useFavoritesStore = defineStore('favorites', () => {
  const STORAGE_KEY = KEYS.FAVORITES
  const favorites = ref(loadJSON(STORAGE_KEY, { articles: [], stories: [], poems: [], ways: [], practices: [] }))

  function save() {
    saveJSON(STORAGE_KEY, favorites.value)
  }

  function toggle(type, id) {
    if (!favorites.value[type]) favorites.value[type] = []
    const list = favorites.value[type]
    const idx = list.indexOf(id)
    if (idx >= 0) list.splice(idx, 1)
    else list.push(id)
    save()
  }

  function isFavorite(type, id) {
    return favorites.value[type]?.includes(id) || false
  }

  const totalFavorites = computed(() =>
    Object.values(favorites.value).reduce((sum, list) => sum + (list?.length || 0), 0)
  )

  return { favorites, toggle, isFavorite, totalFavorites }
})
