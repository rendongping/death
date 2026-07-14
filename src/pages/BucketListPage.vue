<template>
  <div class="bucketlist-page">
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-title">遗愿清单</h1>
        <p class="page-subtitle">趁还来得及，写下你真正想做的事。</p>
      </div>
      <Illustration name="bucketlist" :width="160" :height="128" />
    </div>
    <BucketListBoard />
  </div>
</template>

<script setup>
import BucketListBoard from '@/components/interactive/BucketListBoard.vue'
import Illustration from '@/components/ui/Illustration.vue'
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
