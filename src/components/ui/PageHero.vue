<template>
  <section class="page-hero" :class="`page-hero--${tone}`">
    <div class="particles" aria-hidden="true">
      <span
        v-for="i in particleCount"
        :key="i"
        class="particle"
        :class="`particle--${particle}`"
        :style="particleStyle(i)"
      ></span>
    </div>
    <div class="hero-inner">
      <p class="hero-eyebrow">{{ eyebrow }}</p>
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-sub">{{ subtitle }}</p>
      <div v-if="stats && stats.length" class="hero-stats">
        <template v-for="(s, si) in stats" :key="si">
          <span v-if="si > 0" class="dot">·</span>
          <span><strong v-if="s.num">{{ s.num }}</strong> {{ s.label }}</span>
        </template>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  stats: { type: Array, default: () => [] }, // [{ num, label }]
  particle: { type: String, default: 'petal' }, // petal | mote
  tone: { type: String, default: 'gold' } // gold | sage | taupe
})

const particleCount = computed(() => (props.particle === 'mote' ? 18 : 14))

function particleStyle(i) {
  if (props.particle === 'mote') {
    const left = (i * 11 + 5) % 100
    const size = 3 + (i % 4)
    const duration = 16 + (i % 7) * 3
    const delay = (i % 9) * 2.4
    return {
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    }
  }
  const left = (i * 7 + 3) % 100
  const size = 8 + (i % 5) * 3
  const duration = 13 + (i % 6) * 3
  const delay = (i % 8) * 2.2
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  margin: calc(-1 * var(--space-xl)) calc(-1 * var(--space-lg)) var(--space-3xl);
  padding: var(--space-3xl) var(--space-xl);
  text-align: center;
  border-bottom: 1px solid var(--color-border-light);
}

.page-hero--gold {
  background:
    radial-gradient(ellipse at 20% 20%, rgba(194, 149, 107, 0.18), transparent 55%),
    radial-gradient(ellipse at 80% 30%, rgba(139, 157, 131, 0.14), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(196, 146, 158, 0.12), transparent 60%),
    linear-gradient(180deg, var(--color-cream) 0%, var(--color-warm-white) 100%);
}

.page-hero--sage {
  background:
    radial-gradient(ellipse at 25% 25%, rgba(139, 157, 131, 0.20), transparent 55%),
    radial-gradient(ellipse at 75% 20%, rgba(194, 149, 107, 0.12), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(139, 125, 107, 0.12), transparent 60%),
    linear-gradient(180deg, var(--color-cream) 0%, var(--color-warm-white) 100%);
}

.page-hero--taupe {
  background:
    radial-gradient(ellipse at 20% 25%, rgba(139, 125, 107, 0.20), transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(194, 149, 107, 0.14), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(139, 157, 131, 0.12), transparent 60%),
    linear-gradient(180deg, var(--color-cream) 0%, var(--color-warm-white) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
}

.hero-eyebrow {
  font-size: var(--text-xs);
  letter-spacing: 0.35em;
  color: var(--color-gold);
  margin-bottom: var(--space-md);
  animation: fade-up 0.9s ease both;
}

.page-hero--sage .hero-eyebrow { color: var(--color-sage); }
.page-hero--taupe .hero-eyebrow { color: var(--color-warm-taupe); }

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-lg);
  animation: fade-up 0.9s ease 0.1s both;
}

.page-hero--taupe .hero-title { color: var(--color-warm-taupe); }

.hero-sub {
  color: var(--color-text-light);
  font-size: var(--text-base);
  line-height: 1.9;
  margin-bottom: var(--space-xl);
  animation: fade-up 0.9s ease 0.2s both;
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  animation: fade-up 0.9s ease 0.3s both;
}

.hero-stats strong {
  color: var(--color-gold-dark);
  font-size: var(--text-lg);
}

.hero-stats .dot { color: var(--color-border); }

/* ── Particles ── */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  opacity: 0;
}

.particle--petal {
  top: -20px;
  border-radius: 80% 0 80% 0;
  background: linear-gradient(135deg, rgba(196, 146, 158, 0.5), rgba(212, 176, 140, 0.3));
  animation: petal-fall linear infinite;
}

.particle--mote {
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(194, 149, 107, 0.7), rgba(194, 149, 107, 0));
  animation: mote-rise ease-in-out infinite;
}

.page-hero--sage .particle--mote {
  background: radial-gradient(circle, rgba(139, 157, 131, 0.7), rgba(139, 157, 131, 0));
}

.page-hero--taupe .particle--mote {
  background: radial-gradient(circle, rgba(139, 125, 107, 0.6), rgba(139, 125, 107, 0));
}

@keyframes petal-fall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.6; }
  100% { transform: translateY(460px) translateX(60px) rotate(540deg); opacity: 0; }
}

@keyframes mote-rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  15% { opacity: 0.7; }
  85% { opacity: 0.4; }
  100% { transform: translateY(-420px) translateX(24px); opacity: 0; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .particle, .hero-eyebrow, .hero-title, .hero-sub, .hero-stats {
    animation: none;
    opacity: 1;
  }
  .particle { display: none; }
}

@media (max-width: 768px) {
  .page-hero {
    margin: calc(-1 * var(--space-md)) calc(-1 * var(--space-md)) var(--space-2xl);
    padding: var(--space-2xl) var(--space-lg);
  }
}
</style>
