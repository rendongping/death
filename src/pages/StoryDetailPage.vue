<template>
  <div class="story-detail-page">
    <router-link to="/stories" class="back-link">← 返回故事列表</router-link>
    <div v-if="loading" class="loading">正在加载...</div>
    <article v-else class="story">
      <header class="story-header">
        <div class="story-hero">
          <img v-if="image" :src="image" :alt="title" class="story-hero__image" />
          <div v-else class="story-hero__illustration">
            <Illustration name="stories" :width="200" :height="130" />
          </div>
        </div>
        <div class="story-meta">
          <span v-if="category" class="story-category">{{ category }}</span>
          <span v-if="date" class="story-date">{{ date }}</span>
          <span v-if="readingTime" class="story-reading">约 {{ readingTime }} 分钟</span>
        </div>
        <h1 class="story-title">{{ title }}</h1>
      </header>
      <div class="story-content" v-html="html"></div>
      <div class="paper-boat">
        <button class="boat-btn" :class="{ active: isFav }" @click="toggleFav">
          <span class="boat-icon">{{ isFav ? '⛵' : '📄' }}</span>
          <span>{{ isFav ? '已折成纸船' : '把这个故事折成一只纸船' }}</span>
        </button>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useContent } from '@/composables/useContent'
import Illustration from '@/components/ui/Illustration.vue'
import { useFavoritesStore } from '@/stores/favorites'

const route = useRoute()
const html = ref('')
const title = ref('')
const date = ref('')
const category = ref('')
const image = ref('')
const readingTime = ref(0)
const loading = ref(true)

const favoritesStore = useFavoritesStore()
const isFav = computed(() => favoritesStore.isFavorite('stories', route.params.slug))

function toggleFav() {
  favoritesStore.toggle('stories', route.params.slug)
}

async function load() {
  loading.value = true
  const { loadStory } = useContent()
  const result = await loadStory(route.params.slug)
  if (result) {
    title.value = result.metadata.title || ''
    date.value = result.metadata.date || ''
    category.value = result.metadata.category || ''
    image.value = result.metadata.image || ''
    html.value = result.html
    readingTime.value = result.readingTime || 0
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

.story {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.story-header {
  margin-bottom: var(--space-2xl);
  text-align: center;
  animation: fade-up 0.8s ease both;
}

.story-hero {
  height: 240px;
  background: var(--color-cream);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  overflow: hidden;
}

.story-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92);
}

.story-hero__illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-meta {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
}

.story-category {
  padding: 0.15em 0.6em;
  background: rgba(139, 125, 107, 0.12);
  color: var(--color-warm-taupe);
  border-radius: var(--radius-full);
}

.story-date {
  color: var(--color-text-lighter);
}

.story-title {
  font-family: var(--font-heading);
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  line-height: 1.4;
}

.story-content {
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-text);
}

.story-content :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
}

.story-content :deep(h3) {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

.story-content :deep(p) {
  margin-bottom: var(--space-md);
}

.story-content :deep(ul),
.story-content :deep(ol) {
  padding-left: var(--space-xl);
  margin-bottom: var(--space-md);
}

.story-content :deep(li) {
  margin-bottom: var(--space-sm);
}

.story-content :deep(strong) {
  color: var(--color-gold-dark);
}

.story-content :deep(blockquote) {
  border-left: 3px solid var(--color-gold);
  padding: var(--space-sm) var(--space-lg);
  margin: var(--space-xl) 0;
  color: var(--color-text-light);
  font-style: italic;
  background: var(--color-cream);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.story-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-2xl) 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

.story-reading {
  font-family: var(--font-elegant);
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

.paper-boat {
  margin: var(--space-3xl) 0 var(--space-2xl);
  text-align: center;
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

@media (prefers-reduced-motion: reduce) {
  .story-header { animation: none; }
}
</style>
