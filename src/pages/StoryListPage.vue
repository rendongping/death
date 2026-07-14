<template>
  <div class="story-list-page">
    <h1 class="page-title">生命故事</h1>
    <p class="page-subtitle">真实与虚构交织的生命片段，让我们在别人的故事里看见自己</p>

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
        v-for="story in stories"
        :key="story.slug"
        :to="`/stories/${story.slug}`"
        class="story-card card-hover"
      >
        <div class="story-media">
          <img v-if="story.image" :src="story.image" :alt="story.title" class="story-image" />
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
import { ref, onMounted } from 'vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Illustration from '@/components/ui/Illustration.vue'
import { useContent } from '@/composables/useContent'

const stories = ref([])
const loading = ref(true)

onMounted(async () => {
  const { loadAllStories } = useContent()
  stories.value = await loadAllStories()
  loading.value = false
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

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.story-card {
  display: flex;
  flex-direction: column;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-warm-taupe);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  overflow: hidden;
}

.story-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.story-media {
  height: 140px;
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
  transition: transform var(--transition-base);
}

.story-card:hover .story-image {
  transform: scale(1.03);
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
}

.story-date {
  color: var(--color-text-lighter);
}

.story-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.story-excerpt {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.story-link {
  font-size: var(--text-sm);
  color: var(--color-warm-taupe);
  font-weight: 500;
}
</style>
