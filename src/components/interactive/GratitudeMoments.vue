<template>
  <WarmCard accent="gold" class="gratitude-card">
    <div class="gratitude-header">
      <span class="gratitude-label">感恩时刻</span>
      <span class="gratitude-date">{{ todayStr }}</span>
    </div>

    <p class="gratitude-title">今天，值得感谢的三件小事</p>

    <div v-if="!hasTodayEntry" class="gratitude-form">
      <div class="gratitude-inputs">
        <input
          v-for="(item, index) in newItems"
          :key="index"
          v-model="newItems[index]"
          type="text"
          class="gratitude-input"
          :placeholder="placeholders[index]"
        />
      </div>
      <WarmButton @click="saveToday" :disabled="!canSave">
        记录今天的感恩
      </WarmButton>
    </div>

    <div v-else class="gratitude-done">
      <p class="done-text">✨ 今天的感恩已记录</p>
      <ul class="done-list">
        <li v-for="(item, index) in todayItems" :key="index">{{ item }}</li>
      </ul>
    </div>

    <div v-if="history.length" class="gratitude-history">
      <details>
        <summary class="history-toggle">过往记录（连续 {{ streak }} 天）</summary>
        <div class="history-list">
          <div v-for="entry in history" :key="entry.date" class="history-item">
            <span class="history-date">{{ entry.date }}</span>
            <ul>
              <li v-for="(item, idx) in entry.items" :key="idx">{{ item }}</li>
            </ul>
          </div>
        </div>
      </details>
    </div>
  </WarmCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import WarmButton from '@/components/ui/WarmButton.vue'

const STORAGE_KEY = 'mv-gratitude'

const placeholders = [
  '例如：早上的一杯热咖啡',
  '例如：朋友发来的消息',
  '例如：今天没有下雨'
]

const newItems = ref(['', '', ''])

const today = new Date()
const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
const todayStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
const entries = ref(saved)

const todayItems = computed(() => entries.value[todayKey] || [])
const hasTodayEntry = computed(() => todayItems.value.length > 0)

const canSave = computed(() => newItems.value.some(i => i.trim()))

const history = computed(() => {
  return Object.entries(entries.value)
    .filter(([date]) => date !== todayKey)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14)
    .map(([date, items]) => ({ date, items }))
})

const streak = computed(() => {
  const keys = Object.keys(entries.value).sort()
  if (!keys.length) return 0

  let count = 0
  const d = new Date()
  while (true) {
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    if (entries.value[key]) {
      count++
      d.setDate(d.getDate() - 1)
    } else {
      // Allow one missing day? Keep strict
      break
    }
  }
  return count
})

function saveToday() {
  const items = newItems.value.map(i => i.trim()).filter(Boolean)
  if (!items.length) return
  entries.value = {
    ...entries.value,
    [todayKey]: items
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  newItems.value = ['', '', '']
}
</script>

<style scoped>
.gratitude-card {
  max-width: 600px;
  margin: 0 auto;
}

.gratitude-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.gratitude-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gratitude-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.gratitude-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.gratitude-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.gratitude-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.gratitude-input {
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.gratitude-input:focus {
  border-color: var(--color-gold);
}

.gratitude-done {
  padding: var(--space-md);
  background: rgba(194, 149, 107, 0.08);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.done-text {
  color: var(--color-gold-dark);
  font-weight: 500;
  margin-bottom: var(--space-sm);
}

.done-list {
  padding-left: var(--space-lg);
  color: var(--color-text);
  line-height: 1.8;
}

.gratitude-history {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.history-toggle {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  user-select: none;
}

.history-toggle:hover {
  color: var(--color-gold);
}

.history-list {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.history-item {
  padding: var(--space-md);
  background: #fff;
  border-radius: var(--radius-sm);
}

.history-item ul {
  padding-left: var(--space-lg);
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.history-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  display: block;
  margin-bottom: var(--space-xs);
}
</style>
