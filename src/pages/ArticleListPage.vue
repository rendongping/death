<template>
  <div class="article-list-page">
    <PageHero
      eyebrow="ESSAYS ON LIFE & DEATH"
      title="文章 · 死亡的思辨"
      subtitle="关于死亡、生命与存在的思考与对话。读得慢一些，让文字沉淀。"
      :stats="heroStats"
      particle="mote"
      tone="gold"
    />

    <div v-if="loading" class="loading">正在加载文章...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="articles.length === 0" class="empty">
      <EmptyState
        icon="📝"
        title="文章即将到来"
        description="我们正在用心撰写第一批内容，敬请期待。"
      />
    </div>

    <template v-else>
      <!-- 分类筛选 -->
      <div class="filter-bar">
        <button
          class="chip"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          全部 <span class="chip-count">{{ articles.length }}</span>
        </button>
        <button
          v-for="cat in categoryList"
          :key="cat.name"
          class="chip"
          :class="{ active: activeCategory === cat.name }"
          @click="activeCategory = cat.name"
        >
          {{ cat.name }} <span class="chip-count">{{ cat.count }}</span>
        </button>
      </div>

      <div class="articles-grid">
        <ArticleCard
          v-for="(article, i) in filteredArticles"
          :key="article.slug"
          :article="article"
          :style="{ animationDelay: `${Math.min(i, 12) * 50}ms` }"
          class="card-enter"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ArticleCard from '@/components/content/ArticleCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useContent } from '@/composables/useContent'

const articles = ref([])
const loading = ref(true)
const error = ref('')
const activeCategory = ref('all')

const heroStats = computed(() => [
  { num: articles.value.length, label: '篇文章' },
  { num: categoryList.value.length, label: '个主题' },
  { label: '从庄子到欧文·亚隆' }
])

const categoryList = computed(() => {
  const counts = {}
  for (const a of articles.value) {
    const c = a.category || '未分类'
    counts[c] = (counts[c] || 0) + 1
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

const filteredArticles = computed(() => {
  if (activeCategory.value === 'all') return articles.value
  return articles.value.filter(a => (a.category || '未分类') === activeCategory.value)
})

onMounted(async () => {
  const { loadAllArticles, error: contentError } = useContent()
  try {
    articles.value = await loadAllArticles()
    if (contentError.value) error.value = contentError.value
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.error {
  text-align: center;
  color: var(--color-dusty-rose);
  padding: var(--space-2xl);
  background: rgba(196, 146, 158, 0.1);
  border-radius: var(--radius-md);
}

/* ── 分类筛选 ── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  justify-content: center;
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

.chip:hover { border-color: var(--color-gold); color: var(--color-gold-dark); }

.chip.active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.chip-count { font-size: var(--text-xs); opacity: 0.8; }

/* ── 网格 ── */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-xl);
}

.card-enter {
  animation: fade-up 0.6s ease both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .card-enter { animation: none; }
}

@media (max-width: 768px) {
  .articles-grid { grid-template-columns: 1fr; }
}
</style>
