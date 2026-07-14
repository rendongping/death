<template>
  <blockquote class="quote-block">
    <p class="quote-block__text">{{ text }}</p>
    <cite v-if="author" class="quote-block__author">— {{ author }}</cite>
  </blockquote>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
  author: { type: String, default: '' }
})
</script>

<style scoped>
.quote-block {
  margin: var(--space-xl) 0;
  padding: var(--space-lg) var(--space-xl);
  border-left: 4px solid var(--color-gold);
  background: var(--color-warm-white);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.quote-block__text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-style: italic;
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.quote-block__author {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  font-style: normal;
  text-align: right;
}
</style>
