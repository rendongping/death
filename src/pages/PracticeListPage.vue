<template>
  <div class="practice-list-page">
    <h1 class="page-title">练习</h1>
    <p class="page-subtitle">从死亡视角出发，回归当下的温柔修行</p>

    <div v-if="loading" class="loading">正在加载练习...</div>
    <div v-else-if="practices.length === 0" class="empty">
      <EmptyState
        icon="🧘"
        title="练习即将到来"
        description="我们正在准备第一批引导练习，敬请期待。"
      />
    </div>
    <div v-else class="practices-grid">
      <router-link
        v-for="practice in practices"
        :key="practice.slug"
        :to="`/practices/${practice.slug}`"
        class="practice-card card-hover"
      >
        <div class="practice-media">
          <img v-if="practice.image" :src="practice.image" :alt="practice.title" class="practice-image" />
          <Illustration v-else name="practices" :width="120" :height="80" />
        </div>
        <div class="practice-body">
          <div class="practice-meta">
            <span class="practice-category">{{ practice.category }}</span>
            <span class="practice-duration">{{ practice.duration }}</span>
            <span class="practice-difficulty">{{ practice.difficulty }}</span>
          </div>
          <h3 class="practice-title">{{ practice.title }}</h3>
          <p class="practice-excerpt">{{ practice.excerpt }}</p>
          <span class="practice-link">开始练习 →</span>
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

const practices = ref([])
const loading = ref(true)

onMounted(async () => {
  const { loadAllPractices } = useContent()
  practices.value = await loadAllPractices()
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

.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.practice-card {
  display: flex;
  flex-direction: column;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-sage);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  overflow: hidden;
}

.practice-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.practice-media {
  height: 120px;
  background: var(--color-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.practice-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.practice-card:hover .practice-image {
  transform: scale(1.03);
}

.practice-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-lg);
}

.practice-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  font-size: var(--text-xs);
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
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.practice-excerpt {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.practice-link {
  font-size: var(--text-sm);
  color: var(--color-sage);
  font-weight: 500;
}
</style>
