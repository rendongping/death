/**
 * 安全的 localStorage 读写工具
 */

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.warn(`localStorage 解析失败，已重置为默认值: ${key}`, e)
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`localStorage 写入失败: ${key}`, e)
  }
}
