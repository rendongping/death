<template>
  <div class="empty-state">
    <div class="empty-state__icon">{{ icon }}</div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: '🌿' },
  title: { type: String, default: '这里还是空的' },
  description: { type: String, default: '当你准备好了，随时可以开始。' }
})
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.empty-state__title {
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--color-text-light);
  max-width: 360px;
  margin: 0 auto var(--space-lg);
}

.empty-state :deep(.warm-btn) {
  margin-top: var(--space-md);
}
</style>
