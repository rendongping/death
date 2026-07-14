<template>
  <div class="markdown-renderer article-content">
    <slot />
    <div v-html="renderedHtml"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: { type: String, default: '' },
  metadata: { type: Object, default: () => ({}) }
})

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

const renderedHtml = computed(() => {
  if (!props.content) return ''
  return marked(props.content)
})
</script>

<style scoped>
.markdown-renderer {
  max-width: var(--max-width-content);
  margin: 0 auto;
}
</style>
