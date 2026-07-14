<template>
  <div class="poetry-page">
    <!-- Hero -->
    <section class="poetry-hero">
      <div class="petals" aria-hidden="true">
        <span v-for="i in 14" :key="i" class="petal" :style="petalStyle(i)"></span>
      </div>
      <div class="hero-inner">
        <p class="hero-eyebrow">POETRY OF LIFE &amp; DEATH</p>
        <h1 class="hero-title">诗与远方 · 向死而生</h1>
        <p class="hero-sub">
          千百年来，诗人们替我们凝视过死亡。
          悼亡的泪、看穿的笑、江水与明月——<br />
          他们把最难言说的事，写成了可以反复诵读的句子。
        </p>
        <div class="hero-stats">
          <span><strong>{{ mdPoems.length }}</strong> 首精读</span>
          <span class="dot">·</span>
          <span><strong>{{ famousPoems.length }}</strong> 首名家精选</span>
          <span class="dot">·</span>
          <span>从汉乐府到泰戈尔</span>
        </div>
        <router-link to="/poetry/archive" class="archive-entry">
          📚 悼亡诗词库<span v-if="archiveTotal">（{{ archiveTotal }} 首）</span> →
        </router-link>
      </div>
    </section>

    <!-- Featured random poem -->
    <section v-if="featured" class="featured" @click="openMdPoem(featured.slug)">
      <div class="featured-ribbon">今日推荐 · 精读</div>
      <div class="featured-body">
        <p class="featured-category">{{ categoryLabel(featured.category) }}</p>
        <blockquote class="featured-highlight">「{{ featured.highlight }}」</blockquote>
        <p class="featured-meta">
          {{ featured.title }} — {{ featured.author }}（{{ featured.date }}）
        </p>
        <button class="featured-btn" @click.stop="openMdPoem(featured.slug)">读全文与赏析 →</button>
      </div>
      <div
        class="featured-cover"
        :style="{ backgroundImage: `url(${featured.image || fallbackCover})` }"
      ></div>
    </section>

    <!-- Loading / empty -->
    <div v-if="loading" class="loading">正在加载诗歌...</div>
    <div v-else-if="allPoems.length === 0" class="empty">
      <EmptyState
        icon="🎨"
        title="诗歌即将到来"
        description="我们正在收集那些关于生命与死亡的文字，敬请期待。"
      />
    </div>

    <template v-else>
      <!-- Toolbar -->
      <div class="toolbar">
        <input
          v-model="search"
          type="search"
          class="search-input"
          placeholder="搜索标题、作者或诗句…"
        />
        <div class="filter-bar">
          <button
            class="chip"
            :class="{ active: activeCategory === 'all' }"
            @click="activeCategory = 'all'"
          >
            全部 <span class="chip-count">{{ allPoems.length }}</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="chip"
            :class="[`chip--${cat.key}`, { active: activeCategory === cat.key }]"
            @click="activeCategory = cat.key"
          >
            <span class="chip-icon">{{ cat.icon }}</span>
            {{ cat.label }}
            <span class="chip-count">{{ countByCategory(cat.key) }}</span>
          </button>
        </div>
        <div class="filter-bar filter-bar--sub">
          <button
            v-for="d in dynastyOptions"
            :key="d.key"
            class="chip chip--sm"
            :class="{ active: dynastyFilter === d.key }"
            @click="dynastyFilter = d.key"
          >{{ d.label }}</button>
          <label class="md-only-toggle">
            <input v-model="mdOnly" type="checkbox" />
            仅看精读赏析
          </label>
          <span class="result-count">共 {{ filteredPoems.length }} 首</span>
        </div>
      </div>

      <!-- Poem grid (compact) -->
      <div class="poetry-grid">
        <article
          v-for="(poem, i) in visiblePoems"
          :key="poem.key"
          class="poetry-card"
          :class="[`cat-${poem.category || 'philosophy'}`, { 'is-md': poem.fromMd }]"
          :style="{ animationDelay: `${Math.min(i, 12) * 40}ms` }"
          @click="poem.fromMd ? openMdPoem(poem.slug) : openArchivePoem(poem)"
        >
          <span v-if="poem.fromMd" class="md-badge">精读</span>
          <span class="dynasty-seal">{{ poem.dynastyLabel }}</span>
          <h3 class="poetry-title">{{ poem.title }}</h3>
          <p class="poetry-meta">{{ poem.author }}</p>
          <p v-if="poem.highlight" class="poetry-highlight">{{ poem.highlight }}</p>
        </article>
      </div>

      <button
        v-if="filteredPoems.length > visibleCount"
        class="load-more"
        @click="visibleCount += PAGE_SIZE"
      >加载更多（还剩 {{ filteredPoems.length - visibleCount }} 首）</button>
    </template>

    <!-- Quote marquee -->
    <section class="quotes-section">
      <h2 class="section-title">他们关于生死说过的话</h2>
      <div class="marquee">
        <div class="marquee-track">
          <div v-for="(quote, qi) in [...quotes, ...quotes]" :key="`quote-${qi}`" class="quote-item">
            <blockquote class="quote-text">{{ quote.text }}</blockquote>
            <cite class="quote-author">— {{ quote.author }}</cite>
          </div>
        </div>
      </div>
    </section>

    <!-- Md poem modal (full appreciation) -->
    <transition name="modal">
      <div v-if="activePoem" class="modal-overlay" @click="closePoem">
        <div class="modal-card" @click.stop>
          <button class="modal-close" @click="closePoem" aria-label="关闭">×</button>
          <div
            class="modal-cover"
            :style="{ backgroundImage: `url(${(activePoemMeta && activePoemMeta.image) || fallbackCover})` }"
          ></div>
          <div class="modal-body">
            <p class="modal-category">{{ categoryLabel(activePoem.metadata.category) }} · 精读赏析</p>
            <h2 class="modal-title">{{ activePoem.metadata.title }}</h2>
            <p class="modal-meta">
              {{ activePoem.metadata.author }}
              <span v-if="activePoem.metadata.source"> · {{ activePoem.metadata.source }}</span>
              <span v-if="activePoem.metadata.date"> · {{ activePoem.metadata.date }}</span>
            </p>
            <p v-if="activePoem.metadata.highlight" class="modal-highlight">
              「{{ activePoem.metadata.highlight }}」
            </p>
            <div class="modal-html" v-html="activePoem.html"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Archive poem modal (plain text) -->
    <transition name="modal">
      <div v-if="activeArchive" class="modal-overlay" @click="closeArchive">
        <div class="modal-card" @click.stop>
          <button class="modal-close" @click="closeArchive" aria-label="关闭">×</button>
          <div class="modal-body modal-body--plain">
            <p class="modal-category">{{ activeArchive.dynasty }}代 · {{ activeArchive.tags.join('、') }}</p>
            <h2 class="modal-title">{{ activeArchive.title }}</h2>
            <p class="modal-meta">{{ activeArchive.author }}</p>
            <div class="archive-content">
              <p v-for="(line, li) in activeArchive.content" :key="li">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useContent } from '@/composables/useContent'

const PAGE_SIZE = 48

const mdPoems = ref([])
const famousPoems = ref([])
const archiveTotal = ref(0)
const loading = ref(true)
const activeCategory = ref('all')
const dynastyFilter = ref('all')
const mdOnly = ref(false)
const search = ref('')
const debouncedSearch = ref('')
const visibleCount = ref(PAGE_SIZE)
const activePoem = ref(null)
const activePoemMeta = ref(null)
const activeArchive = ref(null)
const featured = ref(null)

const fallbackCover = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'

const categories = [
  { key: 'remembrance', label: '悼亡忆人', icon: '🕯️', desc: '那些写给离去之人的诗。思念不需要提醒，它一直都在。' },
  { key: 'philosophy', label: '生死哲思', icon: '🌊', desc: '关于无常、时间与存在本身的叩问。' },
  { key: 'transcendence', label: '超脱豁达', icon: '⛰️', desc: '看清终局之后，对生死的从容与和解。' },
  { key: 'western', label: '西方诗篇', icon: '📖', desc: '狄金森、里尔克、泰戈尔……另一种语言里的生死沉思。' }
]

const dynastyOptions = [
  { key: 'all', label: '全部朝代' },
  { key: '唐', label: '唐' },
  { key: '宋', label: '宋' },
  { key: 'other', label: '其他' }
]

const tagToCategory = {
  悼亡: 'remembrance',
  墓陵怀古: 'philosophy',
  生死哲思: 'philosophy'
}

function dynastyOf(dateStr) {
  const s = String(dateStr || '')
  if (s.includes('唐')) return '唐'
  if (s.includes('宋')) return '宋'
  return 'other'
}

function dynastyLabelOf(dateStr) {
  const s = String(dateStr || '')
  const map = [
    ['先秦', '先秦'], ['汉', '汉'], ['魏', '魏晋'], ['晋', '魏晋'],
    ['南北朝', '南北朝'], ['南朝', '南北朝'], ['唐', '唐'], ['五代', '五代'],
    ['宋', '宋'], ['金', '金元'], ['元', '金元'], ['明', '明'], ['清', '清']
  ]
  for (const [k, v] of map) if (s.includes(k)) return v
  return s.slice(0, 4) || '—'
}

const allPoems = computed(() => [
  ...mdPoems.value.map(p => ({
    key: `md-${p.slug}`,
    slug: p.slug,
    title: p.title,
    author: p.author,
    category: p.category || 'philosophy',
    highlight: p.highlight,
    image: p.image,
    date: p.date,
    dynasty: dynastyOf(p.date),
    dynastyLabel: dynastyLabelOf(p.date),
    fromMd: true
  })),
  ...famousPoems.value.map(p => ({
    key: `arc-${p.id}`,
    title: p.title,
    author: p.author,
    category: tagToCategory[p.tags[0]] || 'philosophy',
    highlight: p.highlight,
    dynasty: p.dynasty,
    dynastyLabel: p.dynasty,
    content: p.content,
    tags: p.tags,
    fromMd: false
  }))
])

function categoryLabel(key) {
  const cat = categories.find(c => c.key === key)
  return cat ? cat.label : '生死哲思'
}

function countByCategory(key) {
  return allPoems.value.filter(p => p.category === key).length
}

const filteredPoems = computed(() => {
  const kw = debouncedSearch.value
  return allPoems.value.filter(p => {
    if (activeCategory.value !== 'all' && p.category !== activeCategory.value) return false
    if (dynastyFilter.value !== 'all' && p.dynasty !== dynastyFilter.value) return false
    if (mdOnly.value && !p.fromMd) return false
    if (!kw) return true
    const haystack = [p.title, p.author, p.highlight, ...(p.content || [])].join(' ')
    return haystack.includes(kw)
  })
})

const visiblePoems = computed(() => filteredPoems.value.slice(0, visibleCount.value))

let timer = null
watch(search, v => {
  clearTimeout(timer)
  timer = setTimeout(() => (debouncedSearch.value = v.trim()), 250)
})
watch([debouncedSearch, activeCategory, dynastyFilter, mdOnly], () => {
  visibleCount.value = PAGE_SIZE
})

function petalStyle(i) {
  const left = (i * 7 + 3) % 100
  const size = 8 + (i % 5) * 3
  const duration = 12 + (i % 6) * 3
  const delay = (i % 8) * 2.2
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}

const quotes = [
  { id: 1, text: '死亡不是生命的终点，遗忘才是。', author: '《寻梦环游记》' },
  { id: 2, text: '向死而生的意义是：当你无限接近死亡，才能深切体会生的意义。', author: '海德格尔' },
  { id: 3, text: '生如夏花之绚烂，死如秋叶之静美。', author: '泰戈尔' },
  { id: 4, text: '死并非生的对立面，而是作为生的一部分永存。', author: '村上春树' },
  { id: 5, text: '我们无法延长生命的长度，但可以拓展它的宽度。', author: '佚名' },
  { id: 6, text: '生命的意义在于，在死亡来临之前，你好好地活过。', author: 'Memento Vivere' }
]

async function openMdPoem(slug) {
  const { loadPoetryItem } = useContent()
  const item = await loadPoetryItem(slug)
  if (item) {
    activePoemMeta.value = mdPoems.value.find(p => p.slug === slug)
    activePoem.value = item
    document.body.style.overflow = 'hidden'
  }
}

function openArchivePoem(poem) {
  activeArchive.value = poem
  document.body.style.overflow = 'hidden'
}

function closePoem() {
  activePoem.value = null
  activePoemMeta.value = null
  document.body.style.overflow = ''
}

function closeArchive() {
  activeArchive.value = null
  document.body.style.overflow = ''
}

onMounted(async () => {
  const { loadAllPoetry } = useContent()
  const allMd = await loadAllPoetry()
  mdPoems.value = allMd
  if (allMd.length) {
    featured.value = allMd[Math.floor(Math.random() * allMd.length)]
  }
  try {
    const mod = await import('@/data/poetry-famous.json?raw')
    const data = JSON.parse(mod.default)
    archiveTotal.value = data.archiveTotal
    famousPoems.value = data.items
  } catch {
    famousPoems.value = []
  }
  loading.value = false
})
</script>

<style scoped>
/* ── Hero ── */
.poetry-hero {
  position: relative;
  overflow: hidden;
  margin: calc(-1 * var(--space-xl)) calc(-1 * var(--space-lg)) var(--space-3xl);
  padding: var(--space-3xl) var(--space-xl);
  text-align: center;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(194, 149, 107, 0.18), transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(139, 157, 131, 0.16), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(196, 146, 158, 0.14), transparent 60%),
    linear-gradient(180deg, var(--color-cream) 0%, var(--color-warm-white) 100%);
  border-bottom: 1px solid var(--color-border-light);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
}

.hero-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.35em;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
  animation: fade-up 0.9s ease both;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-lg);
  animation: fade-up 0.9s ease 0.1s both;
}

.hero-sub {
  color: var(--color-text-light);
  font-size: var(--text-base);
  line-height: 1.9;
  margin-bottom: var(--space-xl);
  animation: fade-up 0.9s ease 0.2s both;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
  animation: fade-up 0.9s ease 0.3s both;
}

.hero-stats strong {
  color: var(--color-gold-dark);
  font-size: var(--text-lg);
}

.hero-stats .dot { color: var(--color-border); }

.archive-entry {
  display: inline-block;
  padding: var(--space-sm) var(--space-xl);
  border-radius: 999px;
  background: var(--color-gold);
  color: #fff;
  text-decoration: none;
  font-size: var(--text-sm);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: fade-up 0.9s ease 0.4s both;
}

.archive-entry:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* ── Petals ── */
.petals {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.petal {
  position: absolute;
  top: -20px;
  border-radius: 80% 0 80% 0;
  background: linear-gradient(135deg, rgba(196, 146, 158, 0.55), rgba(212, 176, 140, 0.35));
  animation: petal-fall linear infinite;
  opacity: 0;
}

@keyframes petal-fall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.6; }
  100% { transform: translateY(460px) translateX(60px) rotate(540deg); opacity: 0; }
}

/* ── Featured ── */
.featured {
  position: relative;
  display: flex;
  align-items: stretch;
  margin-bottom: var(--space-2xl);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-warm-white);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  min-height: 220px;
  animation: fade-up 0.9s ease 0.35s both;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.featured:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.featured-ribbon {
  position: absolute;
  top: var(--space-md);
  left: 0;
  z-index: 3;
  background: var(--color-gold);
  color: #fff;
  font-size: var(--text-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  letter-spacing: 0.15em;
}

.featured-body {
  flex: 1 1 60%;
  padding: var(--space-2xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-category {
  font-size: var(--text-xs);
  letter-spacing: 0.25em;
  color: var(--color-gold);
  margin-bottom: var(--space-sm);
}

.featured-highlight {
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2.6vw, 1.8rem);
  line-height: 1.7;
  margin-bottom: var(--space-md);
  background: linear-gradient(90deg, var(--color-gold-dark), var(--color-dusty-rose));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.featured-meta {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
}

.featured-btn {
  align-self: flex-start;
  background: none;
  border: 1px solid var(--color-gold);
  color: var(--color-gold-dark);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
}

.featured-btn:hover {
  background: var(--color-gold);
  color: #fff;
}

.featured-cover {
  flex: 1 1 40%;
  background-size: cover;
  background-position: center;
  min-height: 200px;
  filter: saturate(0.92);
}

/* ── Toolbar ── */
.toolbar {
  margin-bottom: var(--space-xl);
}

.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: var(--text-base);
  background: var(--color-cream);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s ease;
  margin-bottom: var(--space-md);
}

.search-input:focus { border-color: var(--color-gold); }

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.filter-bar--sub {
  align-items: center;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-warm-white);
  color: var(--color-text-light);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.25s ease;
}

.chip--sm {
  padding: 4px var(--space-md);
  font-size: var(--text-xs);
}

.chip:hover { border-color: var(--color-gold); color: var(--color-gold-dark); }

.chip.active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.chip--remembrance.active { background: var(--color-dusty-rose); border-color: var(--color-dusty-rose); }
.chip--philosophy.active { background: var(--color-gold); border-color: var(--color-gold); }
.chip--transcendence.active { background: var(--color-sage); border-color: var(--color-sage); }
.chip--western.active { background: var(--color-warm-taupe); border-color: var(--color-warm-taupe); }

.chip-count { font-size: var(--text-xs); opacity: 0.8; }

.md-only-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  user-select: none;
}

.result-count {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

/* ── Compact grid ── */
.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.poetry-card {
  position: relative;
  background: var(--color-warm-white);
  border-radius: var(--radius-sm);
  padding: var(--space-lg) var(--space-md) var(--space-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  overflow: hidden;
  animation: fade-up 0.5s ease both;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border-left: 3px solid var(--color-gold);
}

.poetry-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.cat-remembrance { border-left-color: var(--color-dusty-rose); }
.cat-philosophy { border-left-color: var(--color-gold); }
.cat-transcendence { border-left-color: var(--color-sage); }
.cat-western { border-left-color: var(--color-warm-taupe); }

.dynasty-seal {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  font-size: 10px;
  color: var(--color-gold-dark);
  border: 1px solid var(--color-gold-light);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
  opacity: 0.75;
}

.md-badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  font-size: 10px;
  color: #fff;
  background: var(--color-gold);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
  letter-spacing: 0.1em;
}

.poetry-card.is-md .poetry-title { margin-top: var(--space-md); }

.poetry-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  color: var(--color-text);
  margin-bottom: 4px;
  padding-right: 44px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poetry-card.is-md .poetry-title { padding-right: 44px; }

.poetry-meta {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-sm);
}

.poetry-highlight {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--color-gold-dark);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.load-more {
  display: block;
  margin: 0 auto var(--space-2xl);
  padding: var(--space-sm) var(--space-2xl);
  border: 1px solid var(--color-gold);
  border-radius: 999px;
  background: none;
  color: var(--color-gold-dark);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.25s ease;
}

.load-more:hover { background: var(--color-gold); color: #fff; }

/* ── Quotes marquee ── */
.quotes-section { margin-top: var(--space-2xl); }

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xl);
}

.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-track {
  display: flex;
  gap: var(--space-lg);
  width: max-content;
  animation: marquee 60s linear infinite;
}

.marquee:hover .marquee-track { animation-play-state: paused; }

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.quote-item {
  flex: 0 0 320px;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid var(--color-gold-light);
}

.quote-text {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-style: italic;
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.quote-author {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  font-style: normal;
  text-align: right;
}

/* ── Modals ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(60, 50, 40, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.modal-card {
  position: relative;
  width: min(720px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 3;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(60, 50, 40, 0.5);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s ease;
}

.modal-close:hover { background: rgba(60, 50, 40, 0.8); }

.modal-cover {
  height: 200px;
  background-size: cover;
  background-position: center;
  filter: saturate(0.9);
}

.modal-body {
  padding: var(--space-2xl) var(--space-xl);
}

.modal-body--plain { padding-top: var(--space-3xl); }

.modal-category {
  font-size: var(--text-xs);
  letter-spacing: 0.25em;
  color: var(--color-gold);
  margin-bottom: var(--space-sm);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.modal-meta {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-lg);
}

.modal-highlight {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-gold-dark);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-xl);
  background: var(--color-cream);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-gold);
}

.archive-content p {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  line-height: 2.1;
  color: var(--color-text);
  margin: 0;
}

.modal-html :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-gold-dark);
  margin: var(--space-xl) 0 var(--space-md);
}

.modal-html :deep(blockquote) {
  border-left: 3px solid var(--color-gold-light);
  padding: var(--space-sm) var(--space-lg);
  margin: var(--space-md) 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: var(--text-base);
  line-height: 2;
  background: var(--color-cream);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.modal-html :deep(p) {
  line-height: 1.9;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-card, .modal-leave-active .modal-card { transition: transform 0.3s ease; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card { transform: translateY(24px) scale(0.98); }

/* ── Shared ── */
.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .petal, .marquee-track, .poetry-card, .featured,
  .hero-eyebrow, .hero-title, .hero-sub, .hero-stats, .archive-entry {
    animation: none;
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .poetry-hero {
    margin: calc(-1 * var(--space-md)) calc(-1 * var(--space-md)) var(--space-2xl);
    padding: var(--space-2xl) var(--space-lg);
  }
  .featured { flex-direction: column; }
  .featured-cover { min-height: 160px; }
  .poetry-grid { grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
  .modal-body { padding: var(--space-xl) var(--space-lg); }
}
</style>
