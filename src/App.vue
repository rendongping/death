<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <router-view v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  padding-top: calc(var(--header-height) + var(--space-xl));
}

@media (max-width: 768px) {
  .app-main {
    padding: var(--space-md);
    padding-top: calc(var(--header-height) + var(--space-md));
  }
}
</style>
