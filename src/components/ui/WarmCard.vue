<template>
  <div
    class="warm-card card-hover"
    :class="[`warm-card--${accent}`]"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  accent: { type: String, default: 'gold' } // gold | sage | rose | taupe
})
</script>

<style scoped>
.warm-card {
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  border-left: 3px solid var(--color-gold);
  box-shadow: var(--shadow-sm);
}

.warm-card--gold  { border-left-color: var(--color-gold); }
.warm-card--sage  { border-left-color: var(--color-sage); }
.warm-card--rose  { border-left-color: var(--color-dusty-rose); }
.warm-card--taupe { border-left-color: var(--color-warm-taupe); }
</style>
