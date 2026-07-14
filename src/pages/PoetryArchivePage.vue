<template>
  <div class="archive-page">
    <header class="archive-header">
      <router-link to="/poetry" class="back-link">← 返回诗与艺术</router-link>
      <h1 class="archive-title">悼亡诗词库</h1>
      <p class="archive-sub">
        从《全唐诗》《全宋词》中辑录与死亡、悼亡、丧挽、生死相关的诗词。
        不求赏析，只为留存——<strong>名称、作者、朝代、正文</strong>，如此而已。
      </p>
      <div v-if="archive" class="archive-stats">
        <span><strong>{{ archive.total }}</strong> 首收录</span>
        <span class="dot">·</span>
        <span>唐诗 <strong>{{ archive.dynastyCounts['唐'] || 0 }}</strong></span>
        <span class="dot">·</span>
        <span>宋词 <strong>{{ archive.dynastyCounts['宋'] || 0 }}</strong></span>
        <span class="dot">·</span>
        <span class="muted">{{ sourceNote }}</span>
      </div>
    </header>

    <div v-if="loading" class="loading">正在加载诗词库...</div>
    <div v-else-if="!archive" class="loading">诗词库数据暂未生成，请先运行 <code>npm run build:poetry</code></div>

    <template v-else>
      <!-- 搜索与筛选 -->
      <div class="toolbar">
        <input
          v-model="search"
          type="search"
          class="search-input"
          placeholder="搜索标题、作者或诗句…"
        />
        <div class="filter-row">
          <button
            v-for="d in dynasties"
            :key="d"
            class="chip"
            :class="{ active: dynasty === d }"
            @click="dynasty = d"
          >{{ d === 'all' ? '全部朝代' : d + '代' }}</button>
          <span class="filter-sep"></span>
          <button
            v-for="t in tags"
            :key="t"
            class="chip chip--tag"
            :class="{ active: tag === t }"
            @click="tag = t"
          >{{ t === 'all' ? '全部主题' : t }}</button>
        </div>
        <p class="result-count">共 {{ filtered.length }} 首<span v-if="filtered.length > visibleCount">，显示前 {{ visibleCount }} 首</span></p>
      </div>

      <!-- 列表 -->
      <div class="poem-list">
        <article
          v-for="poem in visibleItems"
          :key="poem.id"
          class="poem-row"
          :class="{ expanded: expandedId === poem.id }"
          @click="toggle(poem.id)"
        >
          <div class="poem-row-head">
            <span class="poem-row-title">{{ poem.title }}</span>
            <span class="poem-row-meta">
              <span class="tag-dot" :class="`tag-${poem.tags[0]}`"></span>
              {{ poem.author }} · {{ poem.dynasty }}
            </span>
          </div>
          <div class="poem-row-body">
            <p v-for="(line, li) in displayLines(poem)" :key="li">{{ line }}</p>
          </div>
          <span v-if="poem.content.length > 2" class="expand-hint">
            {{ expandedId === poem.id ? '收起 ▲' : '展开全文 ▼' }}
          </span>
        </article>
      </div>

      <div v-if="filtered.length === 0" class="no-result">没有匹配的诗词，换个关键词试试。</div>

      <button
        v-if="filtered.length > visibleCount"
        class="load-more"
        @click="visibleCount += PAGE_SIZE"
      >加载更多（还剩 {{ filtered.length - visibleCount }} 首）</button>

      <button v-show="showTop" class="to-top" @click="scrollTop" aria-label="回到顶部">↑</button>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const PAGE_SIZE = 60

const archive = ref(null)
const loading = ref(true)
const search = ref('')
const debouncedSearch = ref('')
const dynasty = ref('all')
const tag = ref('all')
const visibleCount = ref(PAGE_SIZE)
const expandedId = ref(null)
const showTop = ref(false)

const dynasties = ['all', '唐', '宋']
const tags = ['all', '悼亡', '墓陵怀古', '生死哲思']
const sourceNote = '数据源自开源项目 chinese-poetry（MIT）'

let timer = null
watch(search, v => {
  clearTimeout(timer)
  timer = setTimeout(() => (debouncedSearch.value = v.trim()), 250)
})
watch([debouncedSearch, dynasty, tag], () => {
  visibleCount.value = PAGE_SIZE
  expandedId.value = null
})

const filtered = computed(() => {
  if (!archive.value) return []
  const kw = debouncedSearch.value
  return archive.value.items.filter(it => {
    if (dynasty.value !== 'all' && it.dynasty !== dynasty.value) return false
    if (tag.value !== 'all' && !it.tags.includes(tag.value)) return false
    if (!kw) return true
    return (
      it.title.includes(kw) ||
      it.author.includes(kw) ||
      it.content.some(l => l.includes(kw))
    )
  })
})

const visibleItems = computed(() => filtered.value.slice(0, visibleCount.value))

function displayLines(poem) {
  if (expandedId.value === poem.id) return poem.content
  return poem.content.slice(0, 2)
}

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  showTop.value = window.scrollY > 600
}

onMounted(async () => {
  try {
    const mod = await import('@/data/poetry-archive.json?raw')
    archive.value = JSON.parse(mod.default)
  } catch {
    archive.value = null
  } finally {
    loading.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(timer)
})
</script>

<style scoped>
.archive-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.back-link {
  display: inline-block;
  color: var(--color-gold-dark);
  font-size: var(--text-sm);
  text-decoration: none;
  margin-bottom: var(--space-md);
}

.back-link:hover { text-decoration: underline; }

.archive-title {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.archive-sub {
  color: var(--color-text-light);
  max-width: 640px;
  margin: 0 auto var(--space-lg);
  line-height: 1.8;
}

.archive-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.archive-stats strong { color: var(--color-gold-dark); }
.archive-stats .dot { color: var(--color-border); }
.archive-stats .muted { color: var(--color-text-lighter); font-size: var(--text-xs); width: 100%; }

.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.loading code {
  background: var(--color-cream);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

/* ── 工具栏 ── */
.toolbar {
  position: sticky;
  top: var(--header-height);
  z-index: 10;
  background: var(--color-warm-white);
  padding: var(--space-md) 0;
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border-light);
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

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  align-items: center;
}

.filter-sep {
  width: 1px;
  height: 18px;
  background: var(--color-border);
  margin: 0 var(--space-xs);
}

.chip {
  padding: 4px var(--space-md);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-warm-white);
  color: var(--color-text-light);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover { border-color: var(--color-gold); color: var(--color-gold-dark); }
.chip.active { background: var(--color-gold); border-color: var(--color-gold); color: #fff; }
.chip--tag.active { background: var(--color-sage); border-color: var(--color-sage); }

.result-count {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-top: var(--space-sm);
}

/* ── 列表 ── */
.poem-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.poem-row {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  padding: var(--space-md) var(--space-lg);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.poem-row:hover {
  border-color: var(--color-gold-light);
  box-shadow: var(--shadow-sm);
}

.poem-row.expanded {
  border-color: var(--color-gold);
}

.poem-row-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}

.poem-row-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  color: var(--color-gold-dark);
  font-weight: 600;
}

.poem-row-meta {
  flex-shrink: 0;
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.tag-悼亡 { background: var(--color-dusty-rose); }
.tag-墓陵怀古 { background: var(--color-warm-taupe); }
.tag-生死哲思 { background: var(--color-sage); }

.poem-row-body p {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  line-height: 1.9;
  color: var(--color-text);
  margin: 0;
}

.expand-hint {
  display: block;
  text-align: right;
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-top: var(--space-xs);
}

.no-result {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.load-more {
  display: block;
  margin: var(--space-2xl) auto 0;
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

.to-top {
  position: fixed;
  right: var(--space-lg);
  bottom: var(--space-lg);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: var(--color-gold);
  color: #fff;
  font-size: var(--text-lg);
  cursor: pointer;
  box-shadow: var(--shadow-md);
  z-index: 20;
  opacity: 0.9;
}

.to-top:hover { opacity: 1; }

@media (max-width: 768px) {
  .poem-row-head { flex-direction: column; gap: 2px; }
  .toolbar { top: var(--header-height); }
}
</style>
