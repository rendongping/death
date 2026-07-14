<template>
  <div class="story-list-page">
    <PageHero
      eyebrow="STORIES OF LIVES"
      title="生命故事 · 在人间"
      subtitle="真实与虚构交织的生命片段。在别人的故事里，我们悄悄看见自己。"
      :stats="heroStats"
      particle="petal"
      tone="taupe"
    />

    <div v-if="loading" class="loading">正在加载故事...</div>
    <div v-else-if="stories.length === 0" class="empty">
      <EmptyState
        icon="📖"
        title="故事即将到来"
        description="我们正在收集那些触动人心的生命故事，敬请期待。"
      />
    </div>
    <div v-else class="stories-grid">
      <router-link
        v-for="(story, i) in stories"
        :key="story.slug"
        :to="`/stories/${story.slug}`"
        class="story-card"
        :style="{ animationDelay: `${Math.min(i, 12) * 50}ms` }"
      >
        <div class="story-media">
          <img v-if="story.image" :src="story.image" :alt="story.title" class="story-image" loading="lazy" />
          <Illustration v-else name="stories" :width="120" :height="80" />
        </div>
        <div class="story-body">
          <div class="story-meta">
            <span v-if="story.category" class="story-category">{{ story.category }}</span>
            <span v-if="story.date" class="story-date">{{ story.date }}</span>
          </div>
          <h3 class="story-title">{{ story.title }}</h3>
          <p class="story-excerpt">{{ story.excerpt }}</p>
          <span class="story-link">阅读全文 →</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Illustration from '@/components/ui/Illustration.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useContent } from '@/composables/useContent'

const stories = ref([])
const loading = ref(true)

const heroStats = computed(() => [
  { num: stories.value.length, label: '个故事' },
  { label: '真实与虚构' },
  { label: '从史铁生到小王子' }
])

onMounted(async () => {
  const { loadAllStories } = useContent()
  stories.value = await loadAllStories()
  loading.value = false
})
</script>

<style scoped>
.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-xl);
}

.story-card {
  display: flex;
  flex-direction: column;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-warm-taupe);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  text-decoration: none;
  animation: fade-up 0.6s ease both;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.story-media {
  height: 150px;
  background: var(--color-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92);
  transition: transform 0.6s ease;
}

.story-card:hover .story-image {
  transform: scale(1.05);
}

.story-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-lg);
}

.story-meta {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  font-size: var(--text-xs);
}

.story-category {
  padding: 0.15em 0.6em;
  background: rgba(139, 125, 107, 0.12);
  color: var(--color-warm-taupe);
  border-radius: var(--radius-full);
  letter-spacing: 0.08em;
}

.story-date {
  color: var(--color-text-lighter);
}

.story-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  line-height: 1.45;
}

.story-excerpt {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.75;
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-link {
  font-size: var(--text-sm);
  color: var(--color-warm-taupe);
  font-weight: 500;
  letter-spacing: 0.05em;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .story-card { animation: none; }
}

@media (max-width: 768px) {
  .stories-grid { grid-template-columns: 1fr; }
}
</style>
