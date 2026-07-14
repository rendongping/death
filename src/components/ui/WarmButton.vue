<template>
  <button
    class="warm-btn"
    :class="[`warm-btn--${variant}`, { 'warm-btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="warm-btn__spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | secondary | ghost
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.warm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0.625rem 1.5rem;
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  cursor: pointer;
  white-space: nowrap;
}

.warm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary */
.warm-btn--primary {
  background: var(--color-gold);
  color: #fff;
}
.warm-btn--primary:hover:not(:disabled) {
  background: var(--color-gold-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Secondary */
.warm-btn--secondary {
  background: var(--color-warm-white);
  color: var(--color-gold-dark);
  border: 1px solid var(--color-border);
}
.warm-btn--secondary:hover:not(:disabled) {
  background: var(--color-border-light);
  border-color: var(--color-gold-light);
}

/* Ghost */
.warm-btn--ghost {
  background: transparent;
  color: var(--color-text-light);
}
.warm-btn--ghost:hover:not(:disabled) {
  background: rgba(194, 149, 107, 0.08);
  color: var(--color-gold-dark);
}

.warm-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
