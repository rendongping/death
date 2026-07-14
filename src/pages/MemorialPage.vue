<template>
  <div class="memorial-page">
    <div class="memorial-header">
      <div class="memorial-header__text">
        <h1 class="page-title">哀悼空间</h1>
        <p class="page-subtitle">
          为一位你思念的人，点亮一支蜡烛。<br />
          这些话语只保存在你的设备上，是属于你一个人的纪念。
        </p>
      </div>
      <Illustration name="memorial" :width="160" :height="128" />
    </div>

    <WarmCard accent="rose" class="light-candle-card">
      <h2 class="form-title">点亮一支蜡烛</h2>
      <div class="form-group">
        <label class="form-label">Ta 的名字</label>
        <input v-model="newEntry.name" type="text" class="form-input" placeholder="可以是名字、称呼或代号" />
      </div>
      <div class="form-group">
        <label class="form-label">你想对 Ta 说的话</label>
        <textarea
          v-model="newEntry.message"
          class="form-textarea"
          rows="3"
          placeholder="一句想念、一声谢谢、一段回忆……"
        ></textarea>
      </div>
      <div class="form-actions">
        <WarmButton @click="lightCandle" :disabled="!canLight">
          🕯️ 点亮蜡烛
        </WarmButton>
      </div>
    </WarmCard>

    <div v-if="entries.length" class="candles-section">
      <h2 class="section-title">已点亮的蜡烛（{{ entries.length }}）</h2>
      <div class="candles-grid">
        <WarmCard
          v-for="entry in sortedEntries"
          :key="entry.id"
          accent="rose"
          class="candle-card"
        >
          <div class="candle-flame">
            <svg viewBox="0 0 40 60" class="flame-svg">
              <path class="flame-outer" d="M20 55 C8 55 5 42 12 30 C16 22 18 12 20 5 C22 12 24 22 28 30 C35 42 32 55 20 55 Z" />
              <path class="flame-inner" d="M20 48 C14 48 12 40 16 32 C18 27 19 20 20 15 C21 20 22 27 24 32 C28 40 26 48 20 48 Z" />
            </svg>
          </div>
          <p class="candle-name">{{ entry.name || '一位思念的人' }}</p>
          <p class="candle-message">{{ entry.message }}</p>
          <p class="candle-date">{{ formatDate(entry.createdAt) }}</p>
          <button class="candle-delete" @click="deleteEntry(entry.id)" title="熄灭这支蜡烛">×</button>
        </WarmCard>
      </div>
    </div>

    <EmptyState
      v-else
      icon="🕯️"
      title="这里还没有蜡烛"
      description="当你思念一个人时，可以在这里为 Ta 点亮一支蜡烛。"
    />

    <div class="crisis-note">
      <p>
        如果你正在经历严重的情绪困扰，请记住：你不必独自面对。<br />
        中国心理危机干预热线：<strong>400-161-9995</strong>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import WarmButton from '@/components/ui/WarmButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Illustration from '@/components/ui/Illustration.vue'

const STORAGE_KEY = 'mv-memorial'

const entries = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const newEntry = ref({ name: '', message: '' })

const canLight = computed(() => newEntry.value.name.trim() || newEntry.value.message.trim())

const sortedEntries = computed(() =>
  [...entries.value].sort((a, b) => b.createdAt - a.createdAt)
)

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
}

function lightCandle() {
  if (!canLight.value) return
  entries.value.push({
    id: Date.now(),
    name: newEntry.value.name.trim(),
    message: newEntry.value.message.trim(),
    createdAt: Date.now()
  })
  newEntry.value = { name: '', message: '' }
  save()
}

function deleteEntry(id) {
  entries.value = entries.value.filter(e => e.id !== id)
  save()
}

function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<style scoped>
.memorial-page {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.memorial-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.memorial-header__text {
  flex: 1;
  min-width: 280px;
}

.page-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
  line-height: 1.7;
}

.light-candle-card {
  margin-bottom: var(--space-2xl);
}

.form-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-dusty-rose);
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: var(--space-xs);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-dusty-rose);
}

.form-textarea {
  resize: vertical;
  line-height: 1.7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-lg);
}

.section-title {
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xl);
  text-align: center;
}

.candles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.candle-card {
  position: relative;
  text-align: center;
  padding-top: var(--space-2xl);
}

.candle-flame {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.flame-svg {
  width: 40px;
  height: 60px;
}

.flame-outer {
  fill: #D4B08C;
  opacity: 0.8;
  animation: flicker 2s infinite ease-in-out alternate;
}

.flame-inner {
  fill: #FFF8F0;
  opacity: 0.9;
  animation: flicker 1.5s infinite ease-in-out alternate-reverse;
}

@keyframes flicker {
  0% { transform: scale(1) rotate(-1deg); }
  100% { transform: scale(1.05) rotate(1deg); }
}

.candle-name {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.candle-message {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--space-md);
  white-space: pre-wrap;
}

.candle-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.candle-delete {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  font-size: var(--text-xl);
  color: var(--color-text-lighter);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.candle-card:hover .candle-delete {
  opacity: 1;
}

.candle-delete:hover {
  color: var(--color-dusty-rose);
}

.crisis-note {
  text-align: center;
  padding: var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-dusty-rose);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
}

.crisis-note strong {
  color: var(--color-gold-dark);
}
</style>
