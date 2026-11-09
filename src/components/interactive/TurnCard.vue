<template>
  <section
    v-if="question || action"
    ref="rootEl"
    class="turn-card"
    :class="{ 'is-revealed': revealed }"
    aria-label="临终之问"
  >
    <p class="turn-eyebrow">{{ eyebrow }}</p>
    <p v-if="question" class="turn-question">{{ question }}</p>

    <div v-if="action" class="turn-action">
      <router-link :to="action.link" class="turn-btn" @click="onGo">
        {{ action.text }} <span class="turn-arrow">→</span>
      </router-link>
      <span class="turn-hint">知死，是为了这一刻更好地活。</span>
    </div>

    <!-- 承诺：让「点了出口」这件事留下痕迹，到期后回到首页质问用户 -->
    <div v-if="action" class="turn-promise">
      <CommitButton
        :action="action.text"
        :link="action.link"
        :question="question"
        :source-type="sourceType"
        :source-slug="sourceSlug"
        :source-title="sourceTitle"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CommitButton from './CommitButton.vue'

const props = defineProps({
  question: { type: String, default: '' },
  action: { type: Object, default: null }, // { text, link }
  eyebrow: { type: String, default: '临终之问' },
  sourceType: { type: String, default: '' },
  sourceSlug: { type: String, default: '' },
  sourceTitle: { type: String, default: '' }
})

const emit = defineEmits(['go'])

const rootEl = ref(null)
const revealed = ref(false)

let observer = null

function onGo() {
  emit('go', props.action)
}

onMounted(() => {
  const el = rootEl.value
  if (!el) return

  const reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 出口卡必须「读完才出现」：等它接近视口再淡入，短内容直接显示
  if (reduce || typeof IntersectionObserver === 'undefined') {
    revealed.value = true
    return
  }

  observer = new IntersectionObserver(
    entries => {
      if (entries.some(e => e.isIntersecting)) {
        revealed.value = true
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  )
  observer.observe(el)

  // 兜底：任何情况下出口卡都不能永久不可见（动画可以让位给可见性）
  setTimeout(() => {
    revealed.value = true
  }, 6000)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.turn-card {
  margin: var(--space-3xl) 0 var(--space-xl);
  padding: var(--space-2xl) var(--space-xl);
  background: linear-gradient(135deg, rgba(194, 149, 107, 0.08), rgba(139, 157, 131, 0.08));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}

.turn-card.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.turn-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  color: var(--color-gold-dark);
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.turn-question {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  line-height: 1.7;
  color: var(--color-text);
  max-width: 34em;
  margin: 0 auto var(--space-xl);
}

.turn-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.turn-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  background: var(--color-gold-dark);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  text-decoration: none;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.turn-btn:hover {
  background: var(--color-ink);
  transform: translateY(-1px);
}

.turn-arrow {
  transition: transform var(--transition-fast);
}

.turn-btn:hover .turn-arrow {
  transform: translateX(3px);
}

.turn-hint {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

/* ── 承诺 ── */
.turn-promise {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px dashed var(--color-border);
}

@media (prefers-reduced-motion: reduce) {
  .turn-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
