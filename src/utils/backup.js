const PREFIX = 'mv-'

export function exportAllData() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(PREFIX)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key))
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }
  return {
    app: 'Memento Vivere',
    exportedAt: new Date().toISOString(),
    data
  }
}

export function downloadBackup() {
  const payload = exportAllData()
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `memento-vivere-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importBackup(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result)
        const data = payload.data || payload
        Object.entries(data).forEach(([key, value]) => {
          if (!key.startsWith(PREFIX)) return
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        })
        resolve(true)
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
