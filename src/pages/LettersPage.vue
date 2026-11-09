<template>
  <div class="letters-page">
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-title">信件</h1>
        <p class="page-subtitle">写一封信，给未来的自己，或给某个重要的人。</p>
      </div>
      <Illustration name="letters" :width="160" :height="128" />
    </div>
    <LetterEditor :prefill="prefill" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LetterEditor from '@/components/interactive/LetterEditor.vue'
import Illustration from '@/components/ui/Illustration.vue'

const route = useRoute()

// 支持从故事页等带 ?to=&subject=&body= 直接预填并进入写信模式
const prefill = computed(() => {
  const { to, subject, body } = route.query
  if (!to && !subject && !body) return null
  return { to: to || '', subject: subject || '', body: body || '' }
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.page-header__text {
  flex: 1;
  min-width: 280px;
}

.page-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}
.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
}
</style>
