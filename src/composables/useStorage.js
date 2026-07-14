import { ref, watch } from 'vue'

/**
 * localStorage 封装 composable
 * 提供响应式的本地存储读写，支持自动持久化
 */
export function useStorage(key, defaultValue = null) {
  const stored = localStorage.getItem(key)
  const data = ref(stored ? JSON.parse(stored) : defaultValue)

  watch(data, (newVal) => {
    if (newVal === null || newVal === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(newVal))
    }
  }, { deep: true })

  function reset() {
    data.value = defaultValue
  }

  function remove() {
    localStorage.removeItem(key)
    data.value = defaultValue
  }

  return { data, reset, remove }
}
