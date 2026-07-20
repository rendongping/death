<template>
  <div class="practice-detail-page">
    <router-link to="/practices" class="back-link">← 返回练习列表</router-link>
    <div v-if="loading" class="loading">正在加载...</div>
    <article v-else class="practice">
      <header class="practice-header">
        <div class="practice-hero">
          <img v-if="image" :src="image" :alt="title" class="practice-hero__image" />
          <div v-else class="practice-hero__illustration">
            <Illustration name="practices" :width="200" :height="130" />
          </div>
        </div>
        <div class="practice-meta">
          <span v-if="category" class="practice-category">{{ category }}</span>
          <span v-if="duration" class="practice-duration">{{ duration }}</span>
          <span v-if="difficulty" class="practice-difficulty">{{ difficulty }}</span>
          <span v-if="readingTime" class="practice-reading">约 {{ readingTime }} 分钟</span>
        </div>
        <h1 class="practice-title">{{ title }}</h1>
      </header>
      <div class="practice-content" v-html="html"></div>
      <div class="paper-boat">
        <button class="boat-btn" :class="{ active: isFav }" @click="toggleFav">
          <span class="boat-icon">{{ isFav ? '⛵' : '📄' }}</span>
          <span>{{ isFav ? '已折成纸船' : '把这个练习折成一只纸船' }}</span>
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
const category = ref('')
const duration = ref('')
const difficulty = ref('')
const image = ref('')
const readingTime = ref(0)
const loading = ref(true)

const favoritesStore = useFavoritesStore()
const isFav = computed(() => favoritesStore.isFavorite('practices', route.params.slug))

function toggleFav() {
  favoritesStore.toggle('practices', route.params.slug)
}

async function load() {
  loading.value = true
  const { loadPractice } = useContent()
  const result = await loadPractice(route.params.slug)
  if (result) {
    title.value = result.metadata.title || ''
    category.value = result.metadata.category || ''
    duration.value = result.metadata.duration || ''
    difficulty.value = result.metadata.difficulty || ''
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

.practice {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.practice-header {
  margin-bottom: var(--space-2xl);
}

.practice-hero {
  height: 240px;
  background: var(--color-cream);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  overflow: hidden;
}

.practice-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.practice-hero__illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.practice-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
}

.practice-category {
  padding: 0.15em 0.6em;
  background: rgba(139, 157, 131, 0.12);
  color: var(--color-sage);
  border-radius: var(--radius-full);
}

.practice-duration,
.practice-difficulty {
  color: var(--color-text-lighter);
}

.practice-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
}

.practice-content {
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-text);
}

.practice-content :deep(h2) {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-top: var(--space-2xl);
  margin-bottom: var(--space-md);
}

.practice-content :deep(h3) {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-sm);
}

.practice-content :deep(p) {
  margin-bottom: var(--space-md);
}

.practice-content :deep(ul),
.practice-content :deep(ol) {
  padding-left: var(--space-xl);
  margin-bottom: var(--space-md);
}

.practice-content :deep(li) {
  margin-bottom: var(--space-sm);
}

.practice-content :deep(strong) {
  color: var(--color-gold-dark);
}

.practice-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--space-2xl) 0;
}

.practice-reading {
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
</style>
