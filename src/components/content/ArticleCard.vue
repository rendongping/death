<template>
  <router-link :to="`/articles/${article.slug}`" class="article-card card-hover">
    <div class="article-card__media">
      <img v-if="article.image" :src="article.image" :alt="article.title" class="article-card__image" />
      <div v-else class="article-card__illustration">
        <Illustration name="stories" :width="120" :height="80" />
      </div>
    </div>
    <div class="article-card__body">
      <span v-if="article.category" class="article-card__category">{{ article.category }}</span>
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p v-if="article.excerpt" class="article-card__excerpt">{{ article.excerpt }}</p>
      <div class="article-card__footer">
        <span v-if="article.date" class="article-card__date">{{ article.date }}</span>
        <span class="article-card__read">阅读 →</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import Illustration from '@/components/ui/Illustration.vue'

defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-warm-taupe);
  box-shadow: var(--shadow-sm);
  height: 100%;
  overflow: hidden;
}

.article-card__media {
  height: 140px;
  background: var(--color-cream);
  overflow: hidden;
}

.article-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.article-card:hover .article-card__image {
  transform: scale(1.03);
}

.article-card__illustration {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-lg);
}

.article-card__category {
  display: inline-block;
  font-size: var(--text-xs);
  color: var(--color-sage);
  background: rgba(139, 157, 131, 0.1);
  padding: 0.15em 0.6em;
  border-radius: var(--radius-full);
  margin-bottom: var(--space-sm);
  align-self: flex-start;
}

.article-card__title {
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  line-height: 1.4;
}

.article-card__excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.6;
  flex: 1;
}

.article-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.article-card__date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.article-card__read {
  font-size: var(--text-sm);
  color: var(--color-gold-dark);
  font-weight: 500;
}
</style>
