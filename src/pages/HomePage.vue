<template>
  <div class="home-page">
    <!-- 到期回访：这是全站闭环的最后一环。用户当初在这里许下的动作，到期必须由网站主动问回来 -->
    <section v-if="dueCommitments.length" class="due-section">
      <p class="due-eyebrow">你定的日子到了</p>
      <ul class="due-list">
        <li v-for="c in dueCommitments" :key="c.id" class="due-item">
          <div class="due-main">
            <router-link v-if="c.link" :to="c.link" class="due-action" @click="commitments.markDone(c.id)">
              {{ c.action }}
            </router-link>
            <span v-else class="due-action">{{ c.action }}</span>
            <p v-if="c.sourceTitle" class="due-from">
              来自《{{ c.sourceTitle }}》· {{ overdueText(c) }}
            </p>
            <p v-else class="due-from">{{ overdueText(c) }}</p>
          </div>
          <div class="due-ops">
            <button class="due-btn due-btn--done" @click="commitments.markDone(c.id)">做了</button>
            <button class="due-btn due-btn--later" @click="commitments.postpone(c.id, 3)">再说</button>
          </div>
        </li>
      </ul>
      <p class="due-foot">
        <span>共 {{ dueCommitments.length }} 件到期，</span>
        <router-link to="/commitments">看看我的全部约定 →</router-link>
      </p>
    </section>

    <!-- 第一幕：今日仪式 -->
    <section class="hero">
      <div class="hero__glow"></div>
      <div class="hero__content">
        <p class="hero__greeting">{{ greeting }} · {{ dateText }}</p>
        <h1 class="hero__title">Memento Vivere</h1>
        <p class="hero__subtitle">记住要活着</p>
        <p class="hero__quote">「{{ todayQuote.text }}」</p>
        <p class="hero__quote-author">—— {{ todayQuote.author }}</p>
        <div class="hero__actions">
          <router-link to="/today" class="warm-btn warm-btn--primary">打开今天这一页</router-link>
          <router-link to="/acts" class="warm-btn warm-btn--secondary">了解四幕剧</router-link>
        </div>
      </div>
      <div class="hero__visual">
        <div class="dandelion">
          <div class="dandelion__stem"></div>
          <div class="dandelion__seeds">
            <span v-for="i in 12" :key="i" class="dandelion__seed" :style="seedStyle(i)"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- 生命倒计时 -->
    <LifeCountdown />

    <!-- 今日状态条：把首页从「内容目录」变成「回来的地方」 -->
    <section class="today-strip">
      <div class="strip-dots">
        <span class="strip-dot" :class="{ on: gazeStore.hasGazedToday }">凝视</span>
        <span class="strip-dot" :class="{ on: reflectionsStore.hasWrittenToday }">写一行</span>
        <span class="strip-dot" :class="{ on: commitments.doneRecent > 0 }">做到过</span>
      </div>
      <router-link to="/today" class="strip-link">
        {{ todayStripText }} →
      </router-link>
    </section>

    <!-- 今日凝视 -->
    <section class="today-section">
      <h2 class="section-title">今日读物</h2>
      <div class="today-grid">
        <router-link :to="todayArticle.link" class="today-card today-card--article" @click="setLastRead('article', todayArticle.slug, todayArticle.title)">
          <span class="today-label">读一篇文章</span>
          <h3>{{ todayArticle.title }}</h3>
          <p>{{ todayArticle.excerpt }}</p>
        </router-link>
        <router-link :to="todayPoem.link" class="today-card today-card--poem" @click="recordGaze">
          <span class="today-label">今日诗签</span>
          <h3>{{ todayPoem.title }}</h3>
          <p v-if="todayPoem.highlight" class="today-poem-highlight">「{{ todayPoem.highlight }}」</p>
          <p v-else>{{ todayPoem.author }}</p>
        </router-link>
        <router-link :to="todayStory.link" class="today-card today-card--story" @click="setLastRead('story', todayStory.slug, todayStory.title)">
          <span class="today-label">读一个故事</span>
          <h3>{{ todayStory.title }}</h3>
          <p>{{ todayStory.excerpt }}</p>
        </router-link>
        <router-link to="/ways-to-die" class="today-card today-card--ways" @click="recordGaze">
          <span class="today-label">认识一种离开</span>
          <h3>{{ todayWay.name }}</h3>
          <p>{{ todayWay.summary }}</p>
        </router-link>
      </div>
    </section>

    <!-- 三步仪式：一问 · 一行 · 回访 -->
    <section class="ritual-section">
      <h2 class="section-title">今日仪式</h2>
      <p class="ritual-sub">读完之后，停一分钟：回答一个问题，写下一行字。</p>
      <div class="ritual-grid">
        <DailyPrompt />
        <TimeCapsule />
      </div>
    </section>

    <!-- 生命档案 -->
    <section v-if="!hasProfile" class="profile-section">
      <div class="profile-card">
        <h2 class="section-title">建立你的生命档案</h2>
        <p class="profile-desc">填写后，首页会为你推荐更贴近的内容。所有信息只保存在你的设备上。</p>
        <div class="profile-form">
          <input v-model="profileForm.name" placeholder="怎么称呼你？" class="profile-input" />
          <div class="focus-tags">
            <button
              v-for="t in focusOptions"
              :key="t.value"
              class="focus-tag"
              :class="{ active: profileForm.focus.includes(t.value) }"
              @click="toggleFocus(t.value)"
            >{{ t.label }}</button>
          </div>
          <button class="warm-btn warm-btn--primary" @click="saveProfile">开始我的旅程</button>
        </div>
      </div>
    </section>

    <!-- 继续上次旅程 -->
    <section v-if="lastRead" class="last-read-section">
      <router-link :to="lastRead.link" class="last-read-card">
        <span class="last-read-label">继续上次</span>
        <span class="last-read-title">{{ lastRead.title }}</span>
        <span class="last-read-arrow">→</span>
      </router-link>
    </section>

    <!-- 你的生命之旅 -->
    <section class="journey-section">
      <div class="journey-card">
        <div class="journey-header">
          <h2 class="section-title">你的生命之旅</h2>
          <div v-if="badges.length" class="badges">
            <span v-for="b in badges" :key="b" class="badge">{{ badgeLabel(b) }}</span>
          </div>
        </div>
        <div class="journey-progress">
          <div class="journey-bar">
            <div class="journey-fill" :style="{ width: journeyProgress + '%' }"></div>
          </div>
          <span class="journey-percent">{{ journeyProgress }}%</span>
        </div>
        <!-- 生侧指标：全站刻意不显示"凝视了几天"，因为打卡死不是目的 -->
        <div class="life-stats">
          <router-link to="/commitments" class="life-stat">
            <strong>{{ commitments.doneRecent }}</strong>
            <span>近 7 天做到的事</span>
          </router-link>
          <router-link to="/commitments" class="life-stat">
            <strong>{{ commitments.open.length }}</strong>
            <span>还欠自己的约定</span>
          </router-link>
          <router-link to="/letters" class="life-stat">
            <strong>{{ lettersStore.letters.length }}</strong>
            <span>写下的信</span>
          </router-link>
          <router-link to="/bucketlist" class="life-stat">
            <strong>{{ bucketlistStore.completedItems.length }}</strong>
            <span>已经完成的遗愿</span>
          </router-link>
        </div>
        <div class="journey-steps">
          <router-link to="/calendar" class="journey-step" :class="{ active: journey.calendar }">
            <span class="step-icon">📅</span>
            <span class="step-label">认识时间</span>
          </router-link>
          <router-link to="/practices" class="journey-step" :class="{ active: journey.practices }">
            <span class="step-icon">🧘</span>
            <span class="step-label">完成练习</span>
          </router-link>
          <router-link to="/bucketlist" class="journey-step" :class="{ active: journey.bucketlist }">
            <span class="step-icon">✨</span>
            <span class="step-label">写下遗愿</span>
          </router-link>
          <router-link to="/advance-directives" class="journey-step" :class="{ active: journey.directives }">
            <span class="step-icon">📝</span>
            <span class="step-label">整理意愿</span>
          </router-link>
        </div>
        <p class="journey-hint">每一小步，都是向死而生的练习。</p>
        <div class="journey-backup">
          <button class="backup-btn" @click="exportData">导出我的数据</button>
          <label class="backup-btn">
            导入数据
            <input type="file" accept="application/json" hidden @change="importData" />
          </label>
        </div>
      </div>
    </section>

    <!-- 四幕剧入口 -->
    <section class="acts-section">
      <h2 class="section-title">四幕剧</h2>
      <div class="acts-grid">
        <router-link
          v-for="act in acts"
          :key="act.id"
          :to="act.route"
          class="act-card"
          :class="`act-card--${['dawn', 'noon', 'dusk', 'night'][act.id - 1]}`"
        >
          <span class="act-emoji">{{ act.emoji }}</span>
          <h3>{{ act.name }}</h3>
          <p>{{ act.motto }}</p>
          <span class="act-link">进入第{{ ['一', '二', '三', '四'][act.id - 1] }}幕 →</span>
        </router-link>
      </div>
    </section>

    <!-- 全部入口 -->
    <section class="all-links">
      <router-link to="/stories">生命故事</router-link>
      <router-link to="/ways-to-die">一万种死法</router-link>
      <router-link to="/letters">信件</router-link>
      <router-link to="/advance-directives">我的意愿</router-link>
      <router-link to="/recommendations">推荐</router-link>
      <router-link to="/about">关于</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContent } from '@/composables/useContent'
import { useBucketlistStore } from '@/stores/bucketlist'
import { useLettersStore } from '@/stores/letters'
import { useReflectionsStore } from '@/stores/reflections'
import { loadJSON } from '@/utils/storage'
import { KEYS } from '@/utils/keys'
import { getBirthdate } from '@/utils/week-of-life'
import { useProfileStore } from '@/stores/profile'
import { useGazeStore } from '@/stores/gaze'
import { useCommitmentsStore } from '@/stores/commitments'
import { downloadBackup, importBackup } from '@/utils/backup'
import { ACTS } from '@/data/acts'
import LifeCountdown from '@/components/interactive/LifeCountdown.vue'
import DailyPrompt from '@/components/interactive/DailyPrompt.vue'
import TimeCapsule from '@/components/interactive/TimeCapsule.vue'

const acts = ACTS


const articles = ref([])
const poems = ref([])
const stories = ref([])
const waysEntries = ref([])
const loading = ref(true)

const quotes = [
  { text: '死亡不是生命的终点，遗忘才是。', author: '《寻梦环游记》' },
  { text: '向死而生的意义是：当你无限接近死亡，才能深切体会生的意义。', author: '海德格尔' },
  { text: '生如夏花之绚烂，死如秋叶之静美。', author: '泰戈尔' },
  { text: '死并非生的对立面，而是作为生的一部分永存。', author: '村上春树' },
  { text: '我们无法延长生命的长度，但可以拓展它的宽度。', author: '佚名' },
  { text: '认识这一万种离开，是为了选择一种留下。', author: 'Memento Vivere' }
]

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now - start) / 86400000)
}

const todayQuote = computed(() => quotes[dayOfYear() % quotes.length])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '晨光初现'
  if (hour < 12) return '上午好'
  if (hour < 14) return '午安'
  if (hour < 18) return '午后静好'
  return '傍晚来临'
})

const dateText = computed(() => {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

const todayArticle = computed(() => {
  if (!articles.value.length) return { title: '加载中…', excerpt: '', link: '/articles' }
  const idx = dayOfYear() % articles.value.length
  const a = articles.value[idx]
  return {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ? a.excerpt.slice(0, 60) + '…' : '',
    link: `/articles/${a.slug}`
  }
})

const todayPoem = computed(() => {
  if (!poems.value.length) return { title: '加载中…', author: '', link: '/poetry' }
  const idx = dayOfYear() % poems.value.length
  const p = poems.value[idx]
  return { title: p.title, author: p.author, highlight: p.highlight || '', link: '/poetry' }
})

const todayStory = computed(() => {
  if (!stories.value.length) return { title: '加载中…', excerpt: '', link: '/stories' }
  const idx = dayOfYear() % stories.value.length
  const s = stories.value[idx]
  return {
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt ? s.excerpt.slice(0, 60) + '…' : '',
    link: `/stories/${s.slug}`
  }
})

const todayWay = computed(() => {
  if (!waysEntries.value.length) return { name: '加载中…', summary: '' }
  const idx = dayOfYear() % waysEntries.value.length
  return waysEntries.value[idx]
})

// 生命之旅进度
const bucketlistStore = useBucketlistStore()
const lettersStore = useLettersStore()
const reflectionsStore = useReflectionsStore()
const profileStore = useProfileStore()
const gazeStore = useGazeStore()
const commitments = useCommitmentsStore()

const dueCommitments = computed(() => commitments.due.slice(0, 3))

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

function recordGaze() {
  gazeStore.recordGaze()
}

const todayStripText = computed(() => {
  if (commitments.due.length) return `${commitments.due.length} 件到期的约定在等你`
  const left = [
    !gazeStore.hasGazedToday,
    !reflectionsStore.hasWrittenToday
  ].filter(Boolean).length
  if (left === 2) return '今天还没开始，去打开今天这一页'
  if (left === 1) return '今天还差一步，去把它做完'
  return '今天该做的都做完了，去过今天吧'
})

const profileForm = ref({ name: '', focus: [] })
const focusOptions = [
  { value: 'farewell', label: '告别与哀伤' },
  { value: 'meaning', label: '生命意义' },
  { value: 'relationship', label: '关系与爱' },
  { value: 'career', label: '事业与遗产' }
]

const hasProfile = computed(() => profileStore.hasProfile)
const lastRead = computed(() => profileStore.profile.lastRead)
const badges = computed(() => profileStore.profile.badges || [])

function toggleFocus(value) {
  const idx = profileForm.value.focus.indexOf(value)
  if (idx >= 0) profileForm.value.focus.splice(idx, 1)
  else profileForm.value.focus.push(value)
}

function saveProfile() {
  profileStore.setProfile({
    name: profileForm.value.name,
    focus: profileForm.value.focus
  })
}

function setLastRead(type, slug, title) {
  const linkMap = {
    article: `/articles/${slug}`,
    story: `/stories/${slug}`,
    poem: '/poetry'
  }
  profileStore.setLastRead({ type, slug, title, link: linkMap[type] || '/' })
  gazeStore.recordGaze()
}

async function exportData() {
  downloadBackup()
}

async function importData(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    await importBackup(file)
    window.location.reload()
  } catch (e) {
    alert('导入失败：文件格式不正确')
  }
}

function badgeLabel(badge) {
  const map = {
    '觉知者': '🌅 觉知者',
    '整理者': '🧘 整理者',
    '告别者': '🌙 告别者'
  }
  return map[badge] || badge
}

const journey = computed(() => {
  const savedDirectives = loadJSON(KEYS.ADVANCE_DIRECTIVES, {})
  return {
    calendar: !!getBirthdate(),
    practices: reflectionsStore.historyEntries.length > 0,
    bucketlist: bucketlistStore.items.length > 0,
    directives: Object.values(savedDirectives).some(v => v && v.trim())
  }
})

const journeyProgress = computed(() => {
  const done = Object.values(journey.value).filter(Boolean).length
  return Math.round((done / 4) * 100)
})

watch(journeyProgress, (val) => {
  if (val >= 25) profileStore.addBadge('觉知者')
  if (val >= 50) profileStore.addBadge('整理者')
  if (val >= 100) profileStore.addBadge('告别者')
}, { immediate: true })

function seedStyle(i) {
  const angle = (i * 30) * Math.PI / 180
  const distance = 40 + (i % 3) * 10
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${i * 0.15}s`
  }
}

onMounted(async () => {
  const { loadAllArticles, loadAllPoetry, loadAllStories } = useContent()
  try {
    const [a, p, s] = await Promise.all([loadAllArticles(), loadAllPoetry(), loadAllStories()])
    articles.value = a
    poems.value = p
    stories.value = s
    const waysMod = await import('@/data/ways-to-die.json')
    waysEntries.value = waysMod.entries || []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3xl);
  min-height: 68vh;
  padding: var(--space-4xl) 0;
  overflow: hidden;
}

.hero__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 40%, rgba(194, 149, 107, 0.12), transparent 50%);
  pointer-events: none;
}

.hero__content { flex: 1; position: relative; z-index: 1; }

.hero__greeting {
  font-family: var(--font-elegant);
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-md);
}

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--color-ink);
  margin-bottom: var(--space-xs);
}

.hero__subtitle {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xl);
}

.hero__quote {
  font-family: var(--font-elegant);
  font-size: var(--text-xl);
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: var(--space-sm);
  max-width: 560px;
}

.hero__quote-author {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
}

.hero__actions { display: flex; gap: var(--space-md); flex-wrap: wrap; }

.warm-btn--primary,
.warm-btn--secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  font-size: var(--text-base);
  font-weight: 500;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  cursor: pointer;
}

.warm-btn--primary {
  background: var(--color-ink);
  color: var(--color-moon);
}
.warm-btn--primary:hover {
  background: var(--color-gold-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.warm-btn--secondary {
  background: var(--color-warm-white);
  color: var(--color-ink);
  border: 1px solid var(--color-border);
}
.warm-btn--secondary:hover {
  border-color: var(--color-gold);
  transform: translateY(-2px);
}

.hero__visual {
  flex: 0 0 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dandelion {
  position: relative;
  width: 200px;
  height: 240px;
}

.dandelion__stem {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 2px;
  height: 120px;
  background: linear-gradient(to top, var(--color-sage), transparent);
}

.dandelion__seeds {
  position: absolute;
  left: 50%;
  top: 80px;
}

.dandelion__seed {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-gold-light);
  border-radius: 50%;
  opacity: 0.6;
  animation: seed-float 6s ease-in-out infinite;
}

@keyframes seed-float {
  0%, 100% { opacity: 0.4; transform: translate(var(--x, 0), var(--y, 0)) scale(1); }
  50% { opacity: 0.9; transform: translate(var(--x, 0), calc(var(--y, 0) - 8px)) scale(1.1); }
}

/* 今日状态条 */
.today-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-warm-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2xl);
}

.strip-dots {
  display: flex;
  gap: var(--space-sm);
}

.strip-dot {
  padding: 0.2em 0.7em;
  font-size: var(--text-xs);
  border-radius: var(--radius-full);
  border: 1px dashed var(--color-border);
  color: var(--color-text-lighter);
}

.strip-dot.on {
  border-style: solid;
  border-color: var(--color-sage);
  background: rgba(122, 143, 106, 0.12);
  color: var(--color-sage);
}

.strip-dot.on::before {
  content: '✓ ';
}

.strip-link {
  font-size: var(--text-sm);
  color: var(--color-gold-dark);
}

/* 今日凝视 */
.today-section { margin: var(--space-3xl) 0; }
.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--color-ink);
  margin-bottom: var(--space-xl);
}

.today-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
}

.today-card {
  display: block;
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.today-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 0%, rgba(194, 149, 107, 0.08), transparent 50%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.today-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.today-card:hover::before { opacity: 1; }

.today-label {
  display: inline-block;
  font-size: var(--text-xs);
  color: var(--color-gold-dark);
  background: var(--color-cream);
  padding: 2px 8px;
  border-radius: 999px;
  margin-bottom: var(--space-md);
}

.today-card h3 {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
}

.today-card p {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
}

.today-poem-highlight {
  font-family: var(--font-elegant);
  color: var(--color-ink) !important;
  font-style: italic;
}

/* 生命档案 */
.profile-section { margin: var(--space-3xl) 0; }

.profile-card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

.profile-desc {
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.profile-input {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
}

.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.focus-tag {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-cream);
  color: var(--color-text-light);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.focus-tag.active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #fff;
}

/* 继续上次 */
.last-read-section { margin: var(--space-xl) 0; }

.last-read-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: rgba(194, 149, 107, 0.1);
  border: 1px solid var(--color-gold-light);
  border-radius: var(--radius-md);
  color: var(--color-gold-dark);
  transition: all var(--transition-base);
}

.last-read-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.last-read-label {
  font-size: var(--text-xs);
  background: var(--color-gold);
  color: #fff;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.last-read-title {
  flex: 1;
  font-size: var(--text-base);
}

.last-read-arrow { font-size: var(--text-lg); }

/* 生命之旅 */
.journey-section { margin: var(--space-3xl) 0; }

.journey-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.journey-header .section-title { margin-bottom: 0; }

.badges {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.badge {
  padding: var(--space-xs) var(--space-sm);
  background: rgba(139, 157, 131, 0.15);
  color: var(--color-sage);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

.journey-card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

.journey-progress {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.journey-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border-light);
  border-radius: 999px;
  overflow: hidden;
}

.journey-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold), var(--color-dusty-rose));
  border-radius: 999px;
  transition: width var(--transition-slow);
}

.journey-percent {
  font-family: var(--font-elegant);
  font-size: var(--text-lg);
  color: var(--color-ink);
  min-width: 48px;
}

.journey-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
}

.journey-step {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--color-cream);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  transition: all var(--transition-base);
}

.journey-step.active {
  background: rgba(194, 149, 107, 0.12);
  color: var(--color-gold-dark);
}

.journey-step:hover { transform: translateY(-2px); }

.step-icon { font-size: var(--text-xl); }
.step-label { font-size: var(--text-sm); }

/* 生侧指标：只统计"做过了什么"，不统计"凝视了几天" */
.life-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.life-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--space-md) var(--space-sm);
  background: rgba(194, 149, 107, 0.07);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background var(--transition-fast);
}

.life-stat:hover {
  background: rgba(194, 149, 107, 0.14);
}

.life-stat strong {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  line-height: 1.2;
}

.life-stat span {
  font-size: var(--text-xs);
  color: var(--color-text-light);
  text-align: center;
}

@media (max-width: 560px) {
  .life-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.journey-hint {
  margin-top: var(--space-lg);
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  text-align: center;
}

.journey-backup {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.backup-btn {
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-warm-white);
  color: var(--color-text-light);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.backup-btn:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-dark);
}

/* 四幕剧 */
.acts-section { margin: var(--space-3xl) 0; }

.acts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-lg);
}

.act-card {
  display: block;
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  color: var(--color-moon);
  transition: all var(--transition-base);
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.act-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.act-card--dawn { background: linear-gradient(135deg, #C2956B, #A67B52); }
.act-card--noon { background: linear-gradient(135deg, #8B9D83, #6B7A63); }
.act-card--dusk { background: linear-gradient(135deg, #C4929E, #A6717D); }
.act-card--night { background: linear-gradient(135deg, #4A3F35, #2C2620); }

.act-emoji { font-size: 2rem; margin-bottom: var(--space-md); }

.act-card h3 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  margin-bottom: var(--space-sm);
}

.act-card p {
  font-size: var(--text-sm);
  opacity: 0.9;
  line-height: 1.6;
  flex: 1;
}

.act-link {
  font-size: var(--text-sm);
  margin-top: var(--space-md);
  opacity: 0.8;
}

/* 全部入口 */
.all-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-lg);
  margin-top: var(--space-3xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border-light);
}

.all-links a {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.all-links a:hover { color: var(--color-gold-dark); }

.ritual-section { margin: var(--space-3xl) 0; }

.ritual-sub {
  text-align: center;
  color: var(--color-text-light);
  margin: calc(-1 * var(--space-md)) 0 var(--space-xl);
}

.ritual-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  max-width: 640px;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .ritual-grid {
    grid-template-columns: 1fr 1fr;
    max-width: 900px;
    align-items: start;
  }
}

@media (max-width: 768px) {
  .hero { flex-direction: column; text-align: center; min-height: auto; }
  .hero__actions { justify-content: center; }
  .hero__visual { display: none; }
}

/* ── 到期回访 ── */
/* 刻意不用红色/警告色：到期不是过错，只是一句提醒。惩罚色会让人回避整个页面 */
.due-section {
  max-width: 720px;
  margin: 0 auto var(--space-2xl);
  padding: var(--space-lg) var(--space-xl);
  background: linear-gradient(135deg, rgba(194, 149, 107, 0.14), rgba(139, 157, 131, 0.1));
  border-left: 3px solid var(--color-gold);
  border-radius: var(--radius-md);
}

.due-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.due-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.due-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px dashed var(--color-border);
}

.due-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.due-main {
  min-width: 0;
}

.due-action {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-text);
  text-decoration: none;
  line-height: 1.5;
}

a.due-action:hover {
  color: var(--color-gold-dark);
  text-decoration: underline;
}

.due-from {
  font-size: var(--text-xs);
  color: var(--color-text-light);
  margin-top: 2px;
}

.due-ops {
  display: flex;
  flex-shrink: 0;
  gap: var(--space-xs);
}

.due-btn {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.due-btn--done {
  background: var(--color-gold-dark);
  border: 1px solid var(--color-gold-dark);
  color: #fff;
}

.due-btn--done:hover {
  background: var(--color-ink);
}

.due-btn--later {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-light);
}

.due-btn--later:hover {
  border-color: var(--color-text-light);
}

.due-foot {
  margin-top: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.due-foot a {
  color: var(--color-gold-dark);
}

@media (max-width: 560px) {
  .due-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
