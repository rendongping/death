<template>
  <div class="life-calendar">
    <!-- 设置生日 -->
    <div v-if="!birthdate" class="setup-card">
      <WarmCard accent="gold">
        <h2 class="setup-title">输入你的生日</h2>
        <p class="setup-desc">让我们一起来看看你的生命旅程</p>
        <div class="setup-form">
          <input
            v-model="birthdateInput"
            type="date"
            class="date-input"
            :max="todayStr"
          />
          <WarmButton @click="saveBirthdate" :disabled="!birthdateInput">
            确认
          </WarmButton>
        </div>
      </WarmCard>
    </div>

    <!-- 日历展示 -->
    <div v-else class="calendar-display">
      <div class="stats-row">
        <div class="stat">
          <span class="stat-number">{{ livedWeeks }}</span>
          <span class="stat-label">已度过的星期</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ remainingWeeks }}</span>
          <span class="stat-label">大约还剩的星期</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ Math.round(livedWeeks / totalWeeks * 100) }}%</span>
          <span class="stat-label">人生进度</span>
        </div>
      </div>

      <!-- 人生季节 -->
      <WarmCard v-if="currentSeason" accent="sage" class="season-card">
        <div class="season-content">
          <div>
            <span class="season-label">你当前的人生季节</span>
            <h3 class="season-name">{{ currentSeason.name }}</h3>
            <p class="season-desc">{{ currentSeason.desc }}</p>
          </div>
          <div class="season-legend">
            <div v-for="s in seasons" :key="s.id" class="season-legend-item">
              <span class="season-dot" :style="{ background: s.color }"></span>
              <span class="season-legend-name">{{ s.name }}</span>
            </div>
          </div>
        </div>
      </WarmCard>

      <!-- 十年标记 -->
      <div class="decade-labels">
        <span v-for="decade in decadeLabels" :key="decade.year" class="decade-label" :style="{ left: decade.percent + '%' }">
          {{ decade.year }}岁
        </span>
      </div>

      <div class="calendar-grid" ref="gridRef">
        <div
          v-for="(week, index) in calendarWeeks"
          :key="index"
          class="week-cell"
          :class="{
            'week-cell--lived': week.lived,
            'week-cell--current': week.current,
            'week-cell--future': !week.lived
          }"
          :style="{ background: week.lived ? currentSeason?.color : '' }"
          :title="week.label"
          @click="week.future ? openNoteForWeek(index) : null"
        >
          <span v-if="week.note" class="week-note-dot">·</span>
        </div>
      </div>

      <p class="calendar-caption">
        每一格代表一个星期。金色的是已经走过的，空白的是还等待你去书写的。
        <br />点击未来的格子，为那一周许下一个心愿。
      </p>

      <!-- 心愿弹窗 -->
      <Transition name="fade">
        <div v-if="showNoteModal" class="modal-overlay" @click.self="showNoteModal = false">
          <div class="modal-card">
            <h3>第 {{ activeWeekLabel }} 周</h3>
            <p class="modal-hint">如果活到那一天，你希望做些什么？</p>

            <div v-if="pendingBucketItems.length" class="form-group">
              <label class="form-label">从遗愿清单中选择</label>
              <select v-model="selectedBucketItem" class="form-input" @change="fillFromBucketItem">
                <option value="">-- 选择一个心愿 --</option>
                <option v-for="item in pendingBucketItems" :key="item.id" :value="item.title">
                  {{ item.title }}
                </option>
              </select>
            </div>

            <textarea
              v-model="activeNote"
              class="modal-textarea"
              rows="3"
              placeholder="写下你的心愿..."
            ></textarea>
            <div class="modal-actions">
              <WarmButton variant="ghost" @click="showNoteModal = false">取消</WarmButton>
              <WarmButton @click="saveNote" :disabled="!activeNote.trim()">保存</WarmButton>
            </div>
          </div>
        </div>
      </Transition>

      <div class="reset-row">
        <WarmButton variant="ghost" @click="resetBirthdate">重新设置生日</WarmButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import WarmButton from '@/components/ui/WarmButton.vue'

const STORAGE_KEY = 'mv-birthdate'
const NOTES_KEY = 'mv-week-notes'
const BUCKETLIST_KEY = 'mv-bucketlist'
const LIFE_EXPECTANCY = 80

const seasons = [
  { id: 'childhood', name: '童年', start: 0, end: 12, color: '#D4B08C', desc: '世界刚刚展开，一切都是新的。' },
  { id: 'youth', name: '青年', start: 13, end: 24, color: '#C2956B', desc: '探索、犯错、寻找自己的方向。' },
  { id: 'early-adult', name: '成年早期', start: 25, end: 44, color: '#A67B52', desc: '建立、承担、创造属于自己的生活。' },
  { id: 'middle-age', name: '中年', start: 45, end: 64, color: '#8B7D6B', desc: '整合经验，重新评估什么真正重要。' },
  { id: 'old-age', name: '老年', start: 65, end: 100, color: '#8B9D83', desc: '智慧、传承、与有限性温柔相处。' }
]

const birthdate = ref(localStorage.getItem(STORAGE_KEY) || '')
const birthdateInput = ref('')
const weekNotes = ref(JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'))
const showNoteModal = ref(false)
const activeWeekIndex = ref(-1)
const activeNote = ref('')
const selectedBucketItem = ref('')
const gridRef = ref(null)

const todayStr = computed(() => new Date().toISOString().split('T')[0])

const birthDateObj = computed(() => birthdate.value ? new Date(birthdate.value) : null)
const today = computed(() => new Date())

const totalWeeks = computed(() => LIFE_EXPECTANCY * 52)

const livedWeeks = computed(() => {
  if (!birthDateObj.value) return 0
  const diff = today.value.getTime() - birthDateObj.value.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)))
})

const remainingWeeks = computed(() => Math.max(0, totalWeeks.value - livedWeeks.value))

const currentAge = computed(() => {
  if (!birthDateObj.value) return 0
  const diff = today.value.getTime() - birthDateObj.value.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
})

const currentSeason = computed(() => {
  return seasons.find(s => currentAge.value >= s.start && currentAge.value <= s.end) || seasons[seasons.length - 1]
})

const decadeLabels = computed(() => {
  const labels = []
  for (let age = 0; age <= LIFE_EXPECTANCY; age += 10) {
    labels.push({
      year: age,
      percent: (age / LIFE_EXPECTANCY) * 100
    })
  }
  return labels
})

const calendarWeeks = computed(() => {
  const weeks = []
  const birth = birthDateObj.value
  if (!birth) return weeks

  for (let i = 0; i < totalWeeks.value; i++) {
    const weekStart = new Date(birth)
    weekStart.setDate(weekStart.getDate() + i * 7)
    const lived = i < livedWeeks.value
    const current = i === livedWeeks.value
    const year = Math.floor(i / 52) + 1
    const weekOfYear = (i % 52) + 1

    weeks.push({
      index: i,
      lived,
      current,
      future: !lived,
      label: `${year}岁 第${weekOfYear}周`,
      date: weekStart.toISOString().split('T')[0],
      note: weekNotes.value[i] || null
    })
  }
  return weeks
})

const activeWeekLabel = computed(() => {
  if (activeWeekIndex.value < 0) return ''
  const w = calendarWeeks.value[activeWeekIndex.value]
  return w ? w.label : ''
})

const pendingBucketItems = computed(() => {
  try {
    const items = JSON.parse(localStorage.getItem(BUCKETLIST_KEY) || '[]')
    return items.filter(i => !i.done).slice(0, 10)
  } catch {
    return []
  }
})

function saveBirthdate() {
  birthdate.value = birthdateInput.value
  localStorage.setItem(STORAGE_KEY, birthdateInput.value)
}

function resetBirthdate() {
  birthdate.value = ''
  localStorage.removeItem(STORAGE_KEY)
}

function openNoteForWeek(index) {
  activeWeekIndex.value = index
  activeNote.value = weekNotes.value[index] || ''
  selectedBucketItem.value = ''
  showNoteModal.value = true
}

function fillFromBucketItem() {
  if (!selectedBucketItem.value) return
  activeNote.value = selectedBucketItem.value
}

function saveNote() {
  if (!activeNote.value.trim()) return
  const updated = { ...weekNotes.value, [activeWeekIndex.value]: activeNote.value.trim() }
  weekNotes.value = updated
  localStorage.setItem(NOTES_KEY, JSON.stringify(updated))
  showNoteModal.value = false
  selectedBucketItem.value = ''
}

watch(birthdate, () => {
  birthdateInput.value = birthdate.value
})
</script>

<style scoped>
.setup-card {
  max-width: 480px;
  margin: 0 auto;
}

.setup-title {
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.setup-desc {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.setup-form {
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.date-input {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.date-input:focus {
  border-color: var(--color-gold);
}

.stats-row {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.stat {
  flex: 1;
  min-width: 160px;
  text-align: center;
  padding: var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-gold-dark);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.season-card {
  margin-bottom: var(--space-xl);
}

.season-content {
  display: flex;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.season-label {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.season-name {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin: var(--space-xs) 0;
}

.season-desc {
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.season-legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 120px;
}

.season-legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.season-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.decade-labels {
  position: relative;
  height: 20px;
  margin-bottom: var(--space-sm);
}

.decade-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(52, 1fr);
  gap: 2px;
  margin-bottom: var(--space-lg);
  overflow-x: auto;
}

.week-cell {
  aspect-ratio: 1;
  min-width: 8px;
  border-radius: 2px;
  cursor: default;
  transition: background var(--transition-fast);
}

.week-cell--lived {
  background: var(--color-gold);
}

.week-cell--current {
  background: var(--color-gold-dark);
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(162, 123, 82, 0.3);
}

.week-cell--future {
  background: var(--color-border-light);
  cursor: pointer;
}

.week-cell--future:hover {
  background: var(--color-gold-light);
}

.week-note-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #fff;
  font-weight: bold;
}

.calendar-caption {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  line-height: 1.6;
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(60, 50, 40, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: var(--space-lg);
}

.modal-card {
  background: var(--color-warm-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.modal-card h3 {
  font-size: var(--text-lg);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.modal-hint {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
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

.form-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-gold);
}

.modal-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  resize: vertical;
  font-size: var(--text-base);
  line-height: 1.6;
  outline: none;
}

.modal-textarea:focus {
  border-color: var(--color-gold);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.reset-row {
  text-align: center;
  margin-top: var(--space-xl);
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(26, 1fr);
  }
  .stats-row {
    flex-direction: column;
  }
  .season-content {
    flex-direction: column;
  }
}
</style>
