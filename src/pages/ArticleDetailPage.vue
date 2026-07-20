<template>
  <div class="article-detail-page">
    <router-link to="/articles" class="back-link">← 返回文章列表</router-link>
    <div v-if="loading" class="loading">正在加载...</div>
    <article v-else class="article">
      <header class="article-header">
        <div class="article-hero">
          <img v-if="image" :src="image" :alt="title" class="article-hero__image" />
          <div v-else class="article-hero__illustration">
            <Illustration name="stories" :width="200" :height="130" />
          </div>
        </div>
        <h1 class="article-title">{{ title }}</h1>
        <div class="article-meta">
          <span v-if="date" class="article-date">{{ date }}</span>
          <span v-if="category" class="article-category">{{ category }}</span>
        </div>
      </header>
      <div class="article-content" v-html="html"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '@/composables/useContent'
import Illustration from '@/components/ui/Illustration.vue'

const route = useRoute()
const html = ref('')
const title = ref('')
const date = ref('')
const category = ref('')
const image = ref('')
const loading = ref(true)

async function load() {
  loading.value = true
  const { loadArticle } = useContent()
  const result = await loadArticle(route.params.slug)
  if (result) {
    title.value = result.metadata.title || ''
    date.value = result.metadata.date || ''
    category.value = result.metadata.category || ''
    image.value = result.metadata.image || ''
    html.value = result.html
    if (title.value) {
      document.title = `${title.value} — Memento Vivere`
    }
  }
  loading.value = false
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<style scoped>
.back-link {
  display: inline-block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
  transition: color var(--transition-fast);
}
.back-link:hover {
  color: var(--color-gold-dark);
}

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

.article-title {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

.article-category {
  padding: 0.15em 0.6em;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-warm-taupe);
}

.article-content {
  font-size: var(--text-lg);
  line-height: 1.85;
  color: var(--color-text);
}

.article-content :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
}

.article-content :deep(h3) {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

.article-content :deep(p) {
  margin-bottom: var(--space-md);
}

.article-content :deep(ul),
.article-content :deep(ol) {
  padding-left: var(--space-xl);
  margin-bottom: var(--space-md);
}

.article-content :deep(li) {
  margin-bottom: var(--space-sm);
}

.article-content :deep(strong) {
  color: var(--color-gold-dark);
}

.article-content :deep(blockquote) {
  border-left: 3px solid var(--color-gold);
  padding: var(--space-sm) var(--space-lg);
  margin: var(--space-xl) 0;
  color: var(--color-text-light);
  font-style: italic;
  background: var(--color-cream);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.article-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-2xl) 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .article-header { animation: none; }
}
</style>
