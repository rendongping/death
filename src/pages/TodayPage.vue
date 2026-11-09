<template>
  <div class="today-page">
    <header class="today-head">
      <p class="today-date">{{ dateText }}</p>
      <h1 class="today-title">{{ greetingText }}，今天这一页</h1>
      <p class="today-sub">
        四步，加起来不到十分钟。做完就可以关掉这个网站，去过今天。
      </p>
      <div class="today-progress">
        <span
          v-for="(s, i) in steps"
          :key="s.id"
          class="dot"
          :class="{ done: s.done.value }"
          :title="s.label"
        >{{ s.done.value ? '✓' : i + 1 }}</span>
        <span class="progress-text">{{ doneCount }} / 4</span>
      </div>
    </header>

    <!-- 一、凝视 -->
    <section class="step" :class="{ done: gazeStore.hasGazedToday }">
      <div class="step-mark">1</div>
      <div class="step-body">
        <p class="step-eyebrow">凝视六十秒</p>
        <p class="step-question">
          {{ gazeLine }}
        </p>
        <div v-if="gazeStore.hasGazedToday" class="step-done">
          ✓ 今天已经凝视过了
        </div>
        <div v-else class="step-actions">
          <button v-if="!breathing" class="warm-btn primary" @click="startBreath">
            开始这六十秒
          </button>
          <div v-else class="breath" :class="{ running: breathing }">
            <span class="breath-circle"></span>
            <span class="breath-count">{{ breathLeft }}</span>
          </div>
          <button
            v-if="breathing && breathLeft > 0"
            class="warm-btn ghost"
            @click="finishBreath"
          >
            好了，我准备好了
          </button>
        </div>
      </div>
    </section>

    <!-- 二、读一篇 -->
    <section class="step" :class="{ done: readToday }">
      <div class="step-mark">2</div>
      <div class="step-body">
        <p class="step-eyebrow">读一篇</p>
        <template v-if="todayPiece">
          <h2 class="step-title">
            <router-link :to="todayPiece.link" @click="markRead">{{ todayPiece.title }}</router-link>
          </h2>
          <p v-if="todayPiece.note" class="step-note">{{ todayPiece.note }}</p>
          <p class="step-kind">{{ todayPiece.kind }} · {{ loading ? '正在取今天那一篇' : '今天轮到它' }}</p>
        </template>
        <p v-else class="step-note">内容还在加载。</p>
        <div v-if="readToday" class="step-done">✓ 今天这一篇读过了</div>
        <!-- 读完不一定要点进来才算：跳出去读完再回来，也要有个地方能落这一格 -->
        <button v-else-if="todayPiece" class="warm-btn ghost sm step-readbtn" @click="markRead">
          我在别处读完了
        </button>
      </div>
    </section>

    <!-- 三、写一行 -->
    <section class="step" :class="{ done: reflectionsStore.hasWrittenToday }">
      <div class="step-mark">3</div>
      <div class="step-body">
        <p class="step-eyebrow">只写一行</p>
        <p class="step-question">{{ question }}</p>
        <div v-if="reflectionsStore.hasWrittenToday" class="step-done">
          ✓ 今天已经写过了：「{{ reflectionsStore.todayEntry }}」
          <span class="step-hint">七天后它会作为时间胶囊回来找你。</span>
        </div>
        <div v-else class="step-actions">
          <textarea
            v-model="draft"
            class="step-textarea"
            rows="3"
            placeholder="一行就够。不用写得好看。"
          ></textarea>
          <button class="warm-btn primary" :disabled="!draft.trim()" @click="saveLine">
            写下这一行
          </button>
        </div>
      </div>
    </section>

    <!-- 四、做一件带日子的活 -->
    <section class="step" :class="{ done: false }">
      <div class="step-mark">4</div>
      <div class="step-body">
        <p class="step-eyebrow">定一个日子</p>
        <p class="step-question">{{ actionQuestion }}</p>

        <div v-if="commitments.due.length" class="due-list">
          <p class="due-title">{{ commitments.due.length }} 件到期的约定</p>
          <div v-for="c in commitments.due" :key="c.id" class="due-row">
            <div class="due-text">
              <strong>{{ c.action }}</strong>
              <span v-if="c.sourceTitle">来自《{{ c.sourceTitle }}》· {{ overdueText(c) }}</span>
            </div>
            <div class="due-btns">
              <button class="warm-btn primary sm" @click="commitments.markDone(c.id)">做了</button>
              <button class="warm-btn ghost sm" @click="commitments.postpone(c.id, 3)">再说</button>
            </div>
          </div>
        </div>

        <CommitButton
          v-if="todayAction"
          :action="todayAction.text"
          :link="todayAction.link"
          :question="actionQuestion"
          source-type="today"
          :source-slug="todayKey"
          :source-title="dateText"
          lead="今天做不完没关系，给它定个日子，到期它会回到这里。"
        />

        <router-link to="/commitments" class="step-link">
          看看我欠自己的 {{ commitments.open.length }} 件事 →
        </router-link>
      </div>
    </section>

    <section class="echo">
      <TimeCapsule />
    </section>

    <CrisisCard note="如果今天特别难熬，可以先不做这些，只打个电话。" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useContent } from '@/composables/useContent'
import { loadJSON, saveJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'
import { useReflectionsStore } from '@/stores/reflections'
import { useGazeStore } from '@/stores/gaze'
import { useCommitmentsStore } from '@/stores/commitments'
import { resolveTurn, resolvePoetryTurn } from '@/data/turns'
import { pickByDay, dailySeed, greeting, dateLabel } from '@/data/daily'
import CommitButton from '@/components/interactive/CommitButton.vue'
import TimeCapsule from '@/components/interactive/TimeCapsule.vue'
import CrisisCard from '@/components/ui/CrisisCard.vue'

const reflectionsStore = useReflectionsStore()
const gazeStore = useGazeStore()
const commitments = useCommitmentsStore()

const articles = ref([])
const stories = ref([])
const poems = ref([])
const loading = ref(true)

const now = new Date()
const dateText = dateLabel(now)
const greetingText = greeting(now)
const todayKey = reflectionsStore.todayKey

const GAZE_LINES = [
  '你会死。这件事确定无疑。今天打算怎么过，你自己定。',
  '此刻还活着的你，是无数偶然叠出来的。坐着别动，看它六十秒。',
  '地球上曾经活过的人，九成已经不在了。你也在往那个方向走。先呼吸。',
  '今天的你，将来会被某一天怀念成「那时候我还好好的」。',
  '有一件你一直没做的事。它不会因为你不想就消失。先坐着，看六十秒。',
  '你身体里有几十万亿个细胞，此刻都在替你工作，没有一个要求回报。',
  '再过几十年，没有人记得你今天纠结的这件事。那今天什么才值得纠结？'
]
const gazeLine = computed(() => pickByDay(GAZE_LINES, now))

const breathLeft = ref(60)
const breathing = ref(false)
let timer = null

function startBreath() {
  breathing.value = true
  breathLeft.value = 60
  timer = setInterval(() => {
    breathLeft.value -= 1
    if (breathLeft.value <= 0) finishBreath()
  }, 1000)
}

function finishBreath() {
  clearInterval(timer)
  timer = null
  breathing.value = false
  breathLeft.value = 60
  gazeStore.recordGaze()
}

onUnmounted(() => clearInterval(timer))

const readKey = 'read:' + todayKey
const readToday = ref(!!loadJSON(KEYS.READ_LOG, {})[readKey])

function markRead() {
  gazeStore.recordGaze()
  const log = loadJSON(KEYS.READ_LOG, {})
  log[readKey] = true
  saveJSON(KEYS.READ_LOG, log)
  readToday.value = true
}

const todayPiece = computed(() => {
  if (loading.value) return null
  const a = pickByDay(articles.value, now)
  const s = pickByDay(stories.value, now)
  const p = pickByDay(poems.value, now)
  const pool = [
    a && { kind: '文章', title: a.title, link: `/articles/${a.slug}`, note: trim(a.excerpt), meta: a },
    s && { kind: '故事', title: s.title, link: `/stories/${s.slug}`, note: trim(s.excerpt), meta: s },
    p && { kind: '诗', title: p.title, link: `/poetry?open=${p.slug}`, note: p.author || '', meta: null, poem: p }
  ].filter(Boolean)
  return pickByDay(pool, now)
})

function trim(text) {
  return text ? String(text).replace(/\s+/g, ' ').slice(0, 68) + '…' : ''
}

const question = computed(() => {
  const piece = todayPiece.value
  if (piece?.poem) return resolvePoetryTurn(dailySeed(now)).question
  if (piece?.meta) return resolveTurn(piece.meta, piece.meta.slug).question
  return resolveTurn({}, '').question
})

const actionQuestion = computed(() => {
  const piece = todayPiece.value
  if (piece?.meta) return resolveTurn(piece.meta, piece.meta.slug).question
  return '今天读完这些，你打算为自己做的一件具体的事是什么？'
})

const todayAction = computed(() => {
  const piece = todayPiece.value
  if (piece?.meta) return resolveTurn(piece.meta, piece.meta.slug).action
  return { text: '给一个重要的人发条消息', link: '/letters' }
})

const draft = ref('')

function saveLine() {
  if (!draft.value.trim()) return
  reflectionsStore.saveEntry(draft.value)
  draft.value = ''
}

function overdueText(c) {
  const parts = String(c.dueAt || '').split('-').map(Number)
  if (parts.length < 3 || !parts[2]) return '到日子了'
  const dueDate = new Date(parts[0], parts[1] - 1, parts[2])
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((today - dueDate) / 86400000)
  if (days <= 0) return '就是今天'
  if (days === 1) return '昨天就该做了'
  return `已经过了 ${days} 天`
}

const steps = [
  { id: 'gaze', label: '凝视', done: computed(() => gazeStore.hasGazedToday) },
  { id: 'read', label: '读一篇', done: readToday },
  { id: 'write', label: '写一行', done: computed(() => reflectionsStore.hasWrittenToday) },
  { id: 'act', label: '定日子', done: computed(() => commitments.doneRecent > 0) }
]

const doneCount = computed(() => steps.filter(s => s.done.value).length)

onMounted(async () => {
  const { loadAllArticles, loadAllPoetry, loadAllStories } = useContent()
  try {
    const [a, s, p] = await Promise.all([loadAllArticles(), loadAllStories(), loadAllPoetry()])
    articles.value = a
    stories.value = s
    poems.value = p
  } finally {
    loading.value = false
  }
  document.title = `${dateText} — 今日一页 · Memento Vivere`
})
</script>

<style scoped>
.today-page {
  max-width: 620px;
  margin: 0 auto;
  padding-bottom: var(--space-3xl);
}

.today-head {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.today-date {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  letter-spacing: 0.08em;
}

.today-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--color-gold-dark);
  margin: var(--space-sm) 0 var(--space-md);
}

.today-sub {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.8;
}

.today-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.dot.done {
  background: var(--color-sage);
  border-color: var(--color-sage);
  color: #fff;
}

.progress-text {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-left: var(--space-sm);
}

.step {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--color-warm-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.step.done {
  border-color: rgba(122, 143, 106, 0.4);
  background: rgba(122, 143, 106, 0.05);
}

.step-mark {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-cream);
  color: var(--color-gold-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
}

.step.done .step-mark {
  background: var(--color-sage);
  color: #fff;
}

.step-body {
  flex: 1;
  min-width: 0;
}

.step-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.18em;
  color: var(--color-text-lighter);
  margin-bottom: var(--space-sm);
}

.step-question {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.step-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  line-height: 1.5;
  margin-bottom: var(--space-sm);
}

.step-title a {
  color: var(--color-gold-dark);
}

.step-note {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--space-sm);
}

.step-kind {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.step-done {
  font-size: var(--text-sm);
  color: var(--color-sage);
  line-height: 1.7;
}

.step-hint {
  display: block;
  margin-top: 4px;
  color: var(--color-text-lighter);
  font-size: var(--text-xs);
}

.step-readbtn {
  margin-top: var(--space-md);
}

.step-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: flex-start;
}

.step-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: var(--text-base);
  line-height: 1.7;
  resize: vertical;
  outline: none;
}

.step-textarea:focus {
  border-color: var(--color-sage);
}

.step-link {
  display: inline-block;
  margin-top: var(--space-lg);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.step-link:hover {
  color: var(--color-gold-dark);
}

.warm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.4rem;
  font-size: var(--text-sm);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  border: 1px solid transparent;
}

.warm-btn.sm {
  padding: 0.3rem 0.9rem;
  font-size: var(--text-xs);
}

.warm-btn.primary {
  background: var(--color-gold);
  color: #fff;
}

.warm-btn.primary:hover:not(:disabled) {
  background: var(--color-gold-dark);
}

.warm-btn.primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.warm-btn.ghost {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-light);
}

.warm-btn.ghost:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-dark);
}

.breath {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.breath-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(122, 143, 106, 0.25);
}

.breath.running .breath-circle {
  animation: breathe 6s ease-in-out infinite;
}

.breath-count {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text-light);
  font-variant-numeric: tabular-nums;
}

@keyframes breathe {
  0%, 100% { transform: scale(0.7); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 1; }
}

.due-list {
  padding: var(--space-md);
  background: rgba(194, 149, 107, 0.08);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.due-title {
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.due-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-top: 1px dashed var(--color-border);
}

.due-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.due-text strong {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.due-text span {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.due-btns {
  display: flex;
  gap: var(--space-sm);
}

.echo {
  margin: var(--space-2xl) 0;
}

@media (prefers-reduced-motion: reduce) {
  .breath.running .breath-circle {
    animation: none;
  }
}
</style>
