<template>
  <div class="calendar-page">
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-title">生命日历</h1>
        <p class="page-subtitle">你的生命由一个个星期组成。看看你已经走过的，和还剩下的。</p>
      </div>
      <Illustration name="calendar" :width="160" :height="128" />
    </div>
    <LifeCalendar />
  </div>
</template>

<script setup>
import LifeCalendar from '@/components/interactive/LifeCalendar.vue'
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
  max-width: 600px;
}
</style>
