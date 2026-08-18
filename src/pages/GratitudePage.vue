<template>
  <div class="gratitude-page">
    <GratitudeMoments />
  </div>
</template>

<script setup>
import GratitudeMoments from '@/components/interactive/GratitudeMoments.vue'
</script>

<style scoped>
.gratitude-page {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--space-2xl) 0;
}
</style>
