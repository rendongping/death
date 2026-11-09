<template>
  <aside class="crisis-card" :class="{ 'crisis-card--lead': lead }">
    <p v-if="lead" class="crisis-lead">{{ leadText }}</p>
    <p v-if="note" class="crisis-note">{{ note }}</p>
    <ul class="crisis-list">
      <li v-for="r in resources" :key="r.tel" class="crisis-item">
        <div class="crisis-meta">
          <strong>{{ r.name }}</strong>
          <span class="crisis-hours">{{ r.hours }}</span>
        </div>
        <a :href="`tel:${r.tel}`" class="crisis-phone">{{ r.phone }}</a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { CRISIS_RESOURCES, CRISIS_LEAD } from '@/data/crisis-resources'

defineProps({
  lead: { type: Boolean, default: true },
  leadText: { type: String, default: CRISIS_LEAD },
  note: { type: String, default: '' },
  resources: { type: Array, default: () => CRISIS_RESOURCES }
})
</script>

<style scoped>
.crisis-card {
  background: var(--color-warm-white);
  border-left: 3px solid var(--color-dusty-rose);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.crisis-lead {
  color: var(--color-dusty-rose);
  font-weight: 500;
  margin-bottom: var(--space-md);
}

.crisis-note {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.crisis-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.crisis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-cream);
  border-radius: var(--radius-sm);
}

.crisis-meta {
  display: flex;
  flex-direction: column;
}

.crisis-meta strong {
  color: var(--color-text);
  font-size: var(--text-sm);
}

.crisis-hours {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.crisis-phone {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gold-dark);
  text-decoration: none;
  white-space: nowrap;
}

.crisis-phone:hover {
  color: var(--color-ink);
}
</style>
