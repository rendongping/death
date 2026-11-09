<template>
  <div class="article-detail-page" :class="{ 'night-mode': nightMode }">
    <!-- 阅读进度 -->
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>

    <router-link to="/articles" class="back-link">← 返回文章列表</router-link>

    <div v-if="loading" class="loading">正在加载...</div>

    <div v-else-if="missing" class="loading">
      <p>没有这篇文章。它可能已经改名，或者链接写错了。</p>
      <router-link to="/articles" class="back-link">← 回到文章列表</router-link>
    </div>

    <article v-else class="article">
      <header class="article-header">
        <div class="article-hero">
          <img v-if="image" :src="image" :alt="title" class="article-hero__image" />
          <div v-else class="article-hero__illustration">
            <Illustration name="stories" :width="200" :height="130" />
          </div>
        </div>
        <span v-if="act" class="article-act" :style="{ color: act.accentDark }">
          第{{ ['一', '二', '三', '四'][act.id - 1] }}幕 · {{ act.time }} · {{ act.short }}
        </span>
        <h1 class="article-title">{{ title }}</h1>
        <div class="article-meta">
          <span v-if="date">{{ date }}</span>
          <span v-if="category" class="article-category">{{ category }}</span>
          <span v-if="readingTime" class="reading-time">约 {{ readingTime }} 分钟</span>
        </div>
        <button class="night-toggle" @click="nightMode = !nightMode">
          {{ nightMode ? '☀️ 日间模式' : '🌙 夜读模式' }}
        </button>
      </header>

      <!-- 目录 -->
      <nav v-if="toc.length" class="toc">
        <span class="toc-title">目录</span>
        <a v-for="item in toc" :key="item.id" :href="`#${item.id}`" class="toc-link" :style="{ paddingLeft: item.level * 12 + 'px' }">
          {{ item.text }}
        </a>
      </nav>

      <div class="article-content" v-html="html"></div>

      <!-- 生之出口：临终之问 + 行动 -->
      <TurnCard
        :question="turn.question"
        :action="turn.action"
        source-type="article"
        :source-slug="slug"
        :source-title="metadata.title"
      />

      <!-- 读到撑不住的内容时，号码要自己出现在屏幕上 -->
      <CrisisCard
        v-if="showCrisis"
        class="article-crisis"
        note="如果这篇让你想起了自己的事，先别硬扛，打个电话。"
      />

      <!-- 纸船收藏 -->
      <div class="paper-boat">
        <button class="boat-btn" :class="{ active: isFav }" @click="toggleFav">
          <span class="boat-icon">{{ isFav ? '⛵' : '📄' }}</span>
          <span>{{ isFav ? '已折成纸船' : '把这篇文章折成一只纸船' }}</span>
        </button>
      </div>

      <!-- 继续凝视 -->
      <section v-if="related.length" class="related-section">
        <h2 class="related-title">继续凝视</h2>
        <div class="related-grid">
          <router-link
            v-for="item in related"
            :key="item.slug"
            :to="`/articles/${item.slug}`"
            class="related-card"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.excerpt }}</p>
          </router-link>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '@/composables/useContent'
import { useFavoritesStore } from '@/stores/favorites'
import { inferAct } from '@/data/acts'
import { resolveTurn } from '@/data/turns'
import Illustration from '@/components/ui/Illustration.vue'
import TurnCard from '@/components/interactive/TurnCard.vue'
import CrisisCard from '@/components/ui/CrisisCard.vue'
import { needsCrisis } from '@/utils/crisis'

const route = useRoute()
const html = ref('')
const title = ref('')
const date = ref('')
const category = ref('')
const image = ref('')
const readingTime = ref(0)
const rawContent = ref('')
const loading = ref(true)
const missing = ref(false)
const nightMode = ref(false)
const progress = ref(0)
const allArticles = ref([])
const metadata = ref({})

const favoritesStore = useFavoritesStore()

const act = computed(() =>
  inferAct({
    act: metadata.value.act,
    category: metadata.value.category,
    slug: route.params.slug
  })
)

const turn = computed(() =>
  resolveTurn(metadata.value, route.params.slug)
)

const showCrisis = computed(() => needsCrisis(metadata.value, rawContent.value))

const toc = computed(() => {
  const lines = rawContent.value.split('\n')
  const items = []
  lines.forEach((line, idx) => {
    const m = line.match(/^(#{1,3})\s+(.+)/)
    if (m) {
      items.push({
        id: `heading-${idx}`,
        level: m[1].length,
        text: m[2].trim()
      })
    }
  })
  return items
})

const isFav = computed(() => favoritesStore.isFavorite('articles', route.params.slug))

const related = computed(() => {
  if (!category.value || !allArticles.value.length) return []
  return allArticles.value
    .filter(a => a.slug !== route.params.slug && a.category === category.value)
    .slice(0, 3)
})

function toggleFav() {
  favoritesStore.toggle('articles', route.params.slug)
}

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0
}

async function load() {
  loading.value = true
  missing.value = false
  const { loadArticle, loadAllArticles } = useContent()
  const result = await loadArticle(route.params.slug)
  if (result) {
    title.value = result.metadata.title || ''
    date.value = result.metadata.date || ''
    category.value = result.metadata.category || ''
    image.value = result.metadata.image || ''
    html.value = result.html
    rawContent.value = result.rawContent || ''
    metadata.value = result.metadata || {}
    readingTime.value = result.readingTime || 0
    if (title.value) {
      document.title = `${title.value} — Memento Vivere`
    }
  } else {
    missing.value = true
  }
  allArticles.value = await loadAllArticles()
  loading.value = false
}

onMounted(() => {
  load()
  window.addEventListener('scroll', updateProgress, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

watch(() => route.params.slug, load)
</script>

<style scoped>
.article-detail-page {
  position: relative;
  transition: background var(--transition-slow), color var(--transition-slow);
}

.article-detail-page.night-mode {
  background: var(--color-ink);
  color: var(--color-moon);
}

.progress-bar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-gold), var(--color-dusty-rose));
  z-index: 50;
  transition: width 0.1s linear;
}

.back-link {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
  transition: color var(--transition-fast);
}
.back-link:hover { color: var(--color-gold-dark); }

.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.article {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.article-header {
  margin-bottom: var(--space-2xl);
  text-align: center;
  animation: fade-up 0.8s ease both;
}

.article-hero {
  height: 240px;
  background: var(--color-cream);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  overflow: hidden;
}

.article-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92);
}

.article-hero__illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-act {
  display: inline-block;
  font-family: var(--font-elegant);
  font-size: var(--text-xs);
  color: var(--color-gold-dark);
  letter-spacing: 0.2em;
  margin-bottom: var(--space-md);
}

.article-title {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  color: var(--color-ink);
  margin-bottom: var(--space-md);
  line-height: 1.3;
}

.night-mode .article-title { color: var(--color-moon); }

.article-meta {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  align-items: center;
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  flex-wrap: wrap;
}

.article-category {
  padding: 0.15em 0.6em;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-warm-taupe);
}

.reading-time { font-family: var(--font-elegant); }

.night-toggle {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-warm-white);
  color: var(--color-text);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.night-mode .night-toggle {
  background: var(--color-ink-light);
  color: var(--color-moon);
  border-color: var(--color-ink-light);
}

.night-toggle:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }

/* 目录 */
.toc {
  margin-bottom: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.night-mode .toc {
  background: var(--color-ink-light);
  border-color: var(--color-ink-light);
}

.toc-title {
  display: block;
  font-family: var(--font-elegant);
  font-size: var(--text-sm);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.toc-link {
  display: block;
  padding: 2px 0;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  transition: color var(--transition-fast);
}

.toc-link:hover { color: var(--color-gold-dark); }

/* 正文 */
.article-content {
  font-size: var(--text-lg);
  line-height: 1.9;
  color: var(--color-text);
}

.night-mode .article-content { color: var(--color-moon); }

.article-content :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-ink);
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
}

.night-mode .article-content :deep(h2) { color: var(--color-moon); }

.article-content :deep(h3) {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

.article-content :deep(p) { margin-bottom: var(--space-lg); }

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: var(--space-xl);
  margin-bottom: var(--space-md);
}

.article-content :deep(li) { margin-bottom: var(--space-sm); }

.article-content :deep(strong) { color: var(--color-gold-dark); }

.article-content :deep(blockquote) {
  border-left: 3px solid var(--color-gold);
  padding: var(--space-sm) var(--space-lg);
  margin: var(--space-xl) 0;
  color: var(--color-text-light);
  font-style: italic;
  background: var(--color-cream);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.night-mode .article-content :deep(blockquote) {
  background: var(--color-ink-light);
  color: var(--color-moon);
}

.article-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-2xl) 0;
}

/* 纸船 */
.paper-boat {
  margin: var(--space-3xl) 0 var(--space-2xl);
  text-align: center;
}

.article-crisis {
  margin: var(--space-2xl) 0;
}

.boat-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-gold);
  background: var(--color-warm-white);
  color: var(--color-gold-dark);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--transition-base);
}

.boat-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.boat-btn.active {
  background: var(--color-gold);
  color: #fff;
}

.boat-icon { font-size: 1.2rem; }

/* 相关推荐 */
.related-section {
  margin-top: var(--space-3xl);
  padding-top: var(--space-2xl);
  border-top: 1px solid var(--color-border-light);
}

.related-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-ink);
  margin-bottom: var(--space-xl);
}

.night-mode .related-title { color: var(--color-moon); }

.related-grid {
  display: grid;
  gap: var(--space-md);
}

.related-card {
  display: block;
  padding: var(--space-lg);
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.night-mode .related-card {
  background: var(--color-ink-light);
  border-color: var(--color-ink-light);
}

.related-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.related-card h3 {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.night-mode .related-card h3 { color: var(--color-moon); }

.related-card p {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .article-header { animation: none; }
}
</style>
