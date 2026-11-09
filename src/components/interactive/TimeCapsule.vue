<template>
  <WarmCard accent="rose" class="time-capsule">
    <p class="capsule-eyebrow">时间胶囊</p>
    <template v-if="capsule">
      <p class="capsule-when">{{ capsule.label }}，你写下了这句话：</p>
      <blockquote class="capsule-text">{{ capsule.text }}</blockquote>
      <p class="capsule-hint">那时的你，希望今天的你怎么活？</p>
    </template>
    <template v-else>
      <p class="capsule-when">还没有可以开启的胶囊。</p>
      <p class="capsule-hint">
        在「每日反思」里写下今天的一行字，它会在往后的某一天回来找你——
        <template v-if="nextOpen">最早 {{ nextOpen }}。</template>
        到那时，你会认得出当时的自己吗？
      </p>
    </template>
  </WarmCard>
</template>

<script setup>
import { computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import { useReflectionsStore } from '@/stores/reflections'

const reflectionsStore = useReflectionsStore()

// 回访门槛。30 天对一个新站来说等于「永远看不到」：
// 用户写下第一行字后要等一个月才有回响，主循环在这一圈就断了。
const GAP_DAYS = 7
const GAP_MS = GAP_DAYS * 86400000

function parseDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// 最近一条反思满 GAP_DAYS 后才能作为胶囊开启，用它告诉用户最早的回访时间
// （store 的 historyEntries 按字符串排序，日期未补零时不可靠，这里按真实日期取最近一条）
const nextOpen = computed(() => {
  const entries = reflectionsStore.historyEntries
  const latest = entries.reduce(
    (acc, e) => (acc === null || parseDate(e.date) > acc ? parseDate(e.date) : acc),
    null
  )
  const open = new Date((latest || new Date()).getTime() + GAP_MS)
  return `${open.getFullYear()}年${open.getMonth() + 1}月${open.getDate()}日`
})

// 找到「往年今天」或最近一条更早反思（至少间隔 GAP_DAYS），作为时间胶囊
const capsule = computed(() => {
  const entries = reflectionsStore.historyEntries
  if (!entries.length) return null

  const today = new Date()
  const parse = parseDate

  // 优先：往年今天（月日相同、年份更早）
  const anniv = entries.find(e => {
    const d = parse(e.date)
    return d.getMonth() === today.getMonth() && d.getDate() === today.getDate() && d.getFullYear() < today.getFullYear()
  })
  if (anniv) {
    const years = today.getFullYear() - parse(anniv.date).getFullYear()
    return { label: `${years} 年前的今天`, text: anniv.text }
  }

  // 其次：GAP_DAYS 天前写过的最近一条
  const dated = entries
    .map(e => ({ ...e, ts: parse(e.date).getTime() }))
    .filter(e => today.getTime() - e.ts >= GAP_MS)
    .sort((a, b) => b.ts - a.ts)
  const past = dated[0]
  if (past) {
    const days = Math.floor((today.getTime() - past.ts) / 86400000)
    return { label: `${days} 天前`, text: past.text }
  }

  return null
})
</script>

<style scoped>
.capsule-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-dusty-rose);
  margin-bottom: var(--space-sm);
}

.capsule-when {
  color: var(--color-text-light);
  font-size: var(--text-sm);
  margin-bottom: var(--space-md);
}

.capsule-text {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-text);
  border-left: 3px solid var(--color-dusty-rose);
  padding-left: var(--space-md);
  margin-bottom: var(--space-md);
}

.capsule-hint {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}
</style>
