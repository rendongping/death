<template>
  <div class="memorial-page" :class="{ 'night': entries.length > 0 }">
    <div class="memorial-hero">
      <h1 class="page-title">哀悼空间</h1>
      <p class="page-subtitle">
        为一位你思念的人，点亮一支蜡烛。<br />
        这些话语只保存在你的设备上，是属于你一个人的纪念。
      </p>
    </div>

    <div class="candle-stage">
      <div class="candle" :class="{ lit: isLit }" @click="focusInput">
        <div class="flame"></div>
        <div class="wick"></div>
        <div class="body"></div>
      </div>
      <p class="stage-hint">{{ isLit ? '蜡烛已点亮' : '点击蜡烛，写下思念' }}</p>
    </div>

    <div class="letter-card">
      <h2 class="form-title">写下你想说的话</h2>
      <div class="form-group">
        <label class="form-label">Ta 的名字</label>
        <input
          ref="nameInput"
          v-model="newEntry.name"
          type="text"
          class="form-input"
          placeholder="可以是名字、称呼或代号"
        />
      </div>
      <div class="form-group">
        <label class="form-label">你想对 Ta 说的话</label>
        <textarea
          v-model="newEntry.message"
          class="form-textarea"
          rows="4"
          placeholder="一句想念、一声谢谢、一段回忆……"
        ></textarea>
      </div>
      <div class="form-actions">
        <button class="light-btn" @click="lightCandle" :disabled="!canLight">
          🕯️ 点亮蜡烛
        </button>
      </div>
    </div>

    <div v-if="entries.length" class="candles-section">
      <h2 class="section-title">已点亮的蜡烛（{{ entries.length }}）</h2>
      <div class="candles-grid">
        <div v-for="entry in sortedEntries" :key="entry.id" class="memory-card">
          <div class="memory-flame"></div>
          <p class="memory-name">{{ entry.name || '一位思念的人' }}</p>
          <p class="memory-message">{{ entry.message }}</p>
          <p class="memory-date">{{ formatDate(entry.createdAt) }}</p>
          <button class="memory-delete" @click="deleteEntry(entry.id)" title="熄灭这支蜡烛">×</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>这里还没有蜡烛。当你思念一个人时，可以在这里为 Ta 点亮一支蜡烛。</p>
    </div>

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
import { loadJSON, saveJSON } from '@/utils/storage'

const STORAGE_KEY = 'mv-memorial'

const entries = ref(loadJSON(STORAGE_KEY, []))
const newEntry = ref({ name: '', message: '' })
const isLit = ref(false)
const nameInput = ref(null)

const canLight = computed(() => newEntry.value.name.trim() || newEntry.value.message.trim())

const sortedEntries = computed(() =>
  [...entries.value].sort((a, b) => b.createdAt - a.createdAt)
)

function save() {
  saveJSON(STORAGE_KEY, entries.value)
}

function focusInput() {
  nameInput.value?.focus()
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
  isLit.value = true
  save()
  setTimeout(() => { isLit.value = false }, 3000)
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
  transition: background var(--transition-slow);
}

.memorial-page.night {
  background: radial-gradient(ellipse at 50% 0%, rgba(74, 63, 53, 0.08), transparent 60%);
}

.memorial-hero {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.page-title {
  font-size: var(--text-4xl);
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
  line-height: 1.7;
}

/* 蜡烛舞台 */
.candle-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--space-2xl);
}

.candle {
  position: relative;
  width: 60px;
  height: 140px;
  cursor: pointer;
  transition: transform var(--transition-base);
}

.candle:hover { transform: scale(1.02); }

.candle .body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 90px;
  background: linear-gradient(to bottom, #FFF8F0, #E8DDD0);
  border-radius: 4px 4px 8px 8px;
  box-shadow: var(--shadow-md);
}

.candle .wick {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 12px;
  background: var(--color-ink);
  border-radius: 2px;
}

.candle .flame {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 24px;
  height: 36px;
  background: radial-gradient(ellipse at 50% 80%, #FFF8F0, #D4B08C 40%, #C2956B 70%, transparent 70%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transition: transform 0.6s ease;
  transform-origin: bottom center;
}

.candle.lit .flame {
  transform: translateX(-50%) scale(1);
  animation: flicker 1.8s infinite ease-in-out alternate;
}

@keyframes flicker {
  0% { transform: translateX(-50%) scale(1) rotate(-2deg); }
  100% { transform: translateX(-50%) scale(1.08) rotate(2deg); }
}

.stage-hint {
  margin-top: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

/* 表单 */
.letter-card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  margin-bottom: var(--space-2xl);
  box-shadow: var(--shadow-sm);
}

.form-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-dusty-rose);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.form-group { margin-bottom: var(--space-md); }

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
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-moon);
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-dusty-rose);
  background: #fff;
}

.form-textarea { resize: vertical; line-height: 1.8; }

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

.light-btn {
  padding: var(--space-md) var(--space-2xl);
  background: var(--color-ink);
  color: var(--color-moon);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.light-btn:hover:not(:disabled) {
  background: var(--color-gold-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.light-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 记忆卡片 */
.section-title {
  font-size: var(--text-2xl);
  color: var(--color-ink);
  margin-bottom: var(--space-xl);
  text-align: center;
}

.candles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.memory-card {
  position: relative;
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.memory-flame {
  width: 16px;
  height: 24px;
  margin: 0 auto var(--space-md);
  background: radial-gradient(ellipse at 50% 80%, #FFF8F0, #D4B08C 50%, transparent 70%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flicker 2s infinite ease-in-out alternate;
}

.memory-name {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.memory-message {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--space-md);
}

.memory-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.memory-delete {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: var(--color-border-light);
  color: var(--color-text-lighter);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.memory-delete:hover {
  background: var(--color-dusty-rose);
  color: #fff;
}

.empty-state {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.crisis-note {
  margin-top: var(--space-3xl);
  padding: var(--space-lg);
  background: rgba(196, 146, 158, 0.1);
  border-left: 3px solid var(--color-dusty-rose);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  text-align: center;
  color: var(--color-text-light);
  font-size: var(--text-sm);
  line-height: 1.7;
}
</style>
