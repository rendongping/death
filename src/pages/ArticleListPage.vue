<template>
  <div class="article-list-page">
    <h1 class="page-title">文章</h1>
    <p class="page-subtitle">关于死亡、生命和存在的思考与对话</p>
    <div v-if="loading" class="loading">正在加载文章...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="articles.length === 0" class="empty">
      <EmptyState
        icon="📝"
        title="文章即将到来"
        description="我们正在用心撰写第一批内容，敬请期待。"
      />
    </div>
    <div v-else class="articles-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/content/ArticleCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useContent } from '@/composables/useContent'

const articles = ref([])
const loading = ref(true)
const error = ref('')

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
.page-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
  margin-bottom: var(--space-2xl);
}

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

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}
</style>
