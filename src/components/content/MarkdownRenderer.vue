<template>
  <div class="markdown-renderer article-content">
    <slot />
    <div v-html="renderedHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps({
  content: { type: String, default: '' },
  metadata: { type: Object, default: () => ({}) }
})

const renderedHtml = computed(() => renderMarkdown(props.content))
</script>

<style scoped>
.markdown-renderer {
  max-width: var(--max-width-content);
  margin: 0 auto;
}
</style>
