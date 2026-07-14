<template>
  <div class="ways-page">
    <PageHero
      eyebrow="TEN THOUSAND WAYS TO DIE"
      title="一万种死法"
      subtitle="认识死亡的方式，是为了选择活着的方式。每一条死法的背后，都藏着一条「如何更好地活」。"
      :stats="[{ num: total, label: '种死法' }, { num: categories.length, label: '个主题' }, { label: '从心梗到秦始皇的仙丹' }]"
      particle="petal"
      tone="rose"
    />

    <!-- Crisis banner -->
    <section class="crisis-banner">
      <span class="crisis-icon">🆘</span>
      <div class="crisis-body">
        <strong>如果你此刻感到痛苦、绝望或有自伤念头：</strong>
        请立即求助——你并不孤单。全国心理援助热线 <a href="tel:4001619995">400-161-9995</a>、北京心理危机研究与干预中心 <a href="tel:01082951332">010-82951332</a>（24 小时）。
      </div>
    </section>

    <div v-if="loading" class="loading">正在加载...</div>

    <template v-else>
      <!-- Category chips -->
      <div class="filter-bar">
        <button
          class="chip"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          <span class="chip-dot" style="background: var(--color-gold)"></span>
          全部 <span class="chip-count">{{ total }}</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="chip"
          :class="{ active: activeCategory === cat.key }"
          @click="activeCategory = cat.key"
        >
          <span class="chip-dot" :style="{ background: cat.color }"></span>
          <span class="chip-icon">{{ cat.icon }}</span>
          {{ cat.label }}
          <span class="chip-count">{{ countByCategory(cat.key) }}</span>
        </button>
      </div>

      <p class="filter-desc">{{ activeDesc }}</p>

      <!-- Cards grid -->
      <div class="cards-grid">
        <article
          v-for="(entry, i) in filteredEntries"
          :key="entry.id"
          class="way-card"
          :style="{
            borderLeftColor: categoryColor(entry.category),
            animationDelay: `${Math.min(i, 12) * 40}ms`
          }"
          @click="openEntry(entry)"
        >
          <div class="way-card-icon">{{ entry.emoji }}</div>
          <div class="way-card-body">
            <div class="way-card-top">
              <span v-if="entry.tag" class="way-tag">{{ entry.tag }}</span>
              <h3 class="way-card-title">{{ entry.name }}</h3>
            </div>
            <p class="way-card-summary">{{ entry.summary }}</p>
            <div class="way-card-prevention">
              <span class="prevention-icon">🛡️</span>
              <span class="prevention-text">{{ shortPrevention(entry.prevention) }}</span>
            </div>
          </div>
        </article>
      </div>

      <section class="closing">
        <div class="closing-card">
          <h2 class="closing-title">死亡只有一万种，活着的方式却有无数种</h2>
          <p class="closing-text">
            看过这么多死法之后，真正的结论是：大多数意外和疾病都可以预防、延迟或平静面对。
            我们无法决定终点何时到来，但可以决定每一天怎么过。
          </p>
          <div class="closing-actions">
            <router-link to="/poetry" class="closing-link">去读一首诗 →</router-link>
            <router-link to="/practices" class="closing-link">去做一个练习 →</router-link>
            <router-link to="/articles" class="closing-link">去沉淀思考 →</router-link>
          </div>
        </div>
      </section>

      <section class="crisis-banner crisis-banner--bottom">
        <span class="crisis-icon">🆘</span>
        <div class="crisis-body">
          如果你或身边的人正在经历心理危机，请拨打
          <a href="tel:4001619995">400-161-9995</a> 或
          <a href="tel:01082951332">010-82951332</a>，24 小时有人倾听。
        </div>
      </section>
    </template>

    <!-- Detail modal -->
    <transition name="modal">
      <div v-if="activeEntry" class="modal-overlay" @click="closeEntry">
        <div class="modal-card" @click.stop>
          <button class="modal-close" @click="closeEntry" aria-label="关闭">×</button>
          <div
            class="modal-cover"
            :style="{ backgroundImage: `url(${categoryImage(activeEntry.category)})`, backgroundColor: categoryColor(activeEntry.category) }"
          ></div>
          <div class="modal-body">
            <div class="modal-meta">
              <span class="modal-category" :style="{ color: categoryColor(activeEntry.category) }">
                {{ categoryLabel(activeEntry.category) }}
              </span>
              <span v-if="activeEntry.tag" class="modal-tag">{{ activeEntry.tag }}</span>
            </div>
            <h2 class="modal-title">
              <span class="modal-emoji">{{ activeEntry.emoji }}</span>
              {{ activeEntry.name }}
            </h2>
            <p v-if="activeEntry.odds" class="modal-odds">
              <span class="odds-label">数据：</span>{{ activeEntry.odds }}
            </p>
            <div class="modal-detail">
              <p v-for="(p, pi) in activeEntry.detail" :key="pi">{{ p }}</p>
            </div>
            <div class="modal-prevention">
              <span class="prevention-title">如何远离这种死法</span>
              <p>{{ activeEntry.prevention }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'

const data = ref(null)
const loading = ref(true)
const activeCategory = ref('all')
const activeEntry = ref(null)

onMounted(async () => {
  try {
    const mod = await import('@/data/ways-to-die.json?raw')
    data.value = JSON.parse(mod.default)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const categories = computed(() => data.value?.categories || [])
const entries = computed(() => data.value?.entries || [])
const total = computed(() => entries.value.length)

function countByCategory(key) {
  return entries.value.filter(e => e.category === key).length
}

const filteredEntries = computed(() => {
  if (activeCategory.value === 'all') return entries.value
  return entries.value.filter(e => e.category === activeCategory.value)
})

const activeDesc = computed(() => {
  if (activeCategory.value === 'all') return '点击卡片，了解一种死法背后的故事与「如何远离」。'
  const cat = categories.value.find(c => c.key === activeCategory.value)
  return cat ? cat.desc : ''
})

function categoryColor(key) {
  const cat = categories.value.find(c => c.key === key)
  return cat?.color || '#C2956B'
}

function categoryImage(key) {
  const cat = categories.value.find(c => c.key === key)
  return cat?.image || ''
}

function categoryLabel(key) {
  const cat = categories.value.find(c => c.key === key)
  return cat ? `${cat.icon} ${cat.label}` : ''
}

function shortPrevention(text) {
  if (!text) return ''
  if (text.length <= 50) return text
  return text.slice(0, 50) + '…'
}

function openEntry(entry) {
  activeEntry.value = entry
  document.body.style.overflow = 'hidden'
}

function closeEntry() {
  activeEntry.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
/* ── Crisis banner ── */
.crisis-banner {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
  background: rgba(196, 146, 158, 0.12);
  border-left: 4px solid var(--color-dusty-rose);
  border-radius: var(--radius-sm);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-2xl);
  color: var(--color-text);
  font-size: var(--text-sm);
  line-height: 1.7;
}

.crisis-banner--bottom {
  margin-top: var(--space-3xl);
  margin-bottom: 0;
}

.crisis-icon {
  font-size: var(--text-xl);
  flex-shrink: 0;
}

.crisis-body a {
  color: var(--color-dusty-rose);
  font-weight: 600;
  text-decoration: none;
}

.crisis-body a:hover { text-decoration: underline; }

/* ── Filter bar ── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-warm-white);
  color: var(--color-text-light);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.25s ease;
}

.chip:hover {
  border-color: var(--color-dusty-rose);
  color: var(--color-text);
}

.chip.active {
  background: var(--color-dusty-rose);
  border-color: var(--color-dusty-rose);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.chip.active .chip-count { color: rgba(255,255,255,0.8); }

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.chip-icon { font-size: var(--text-sm); }

.chip-count { font-size: var(--text-xs); opacity: 0.8; }

.filter-desc {
  color: var(--color-text-lighter);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xl);
}

/* ── Cards grid ── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.way-card {
  position: relative;
  display: flex;
  gap: var(--space-md);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  cursor: pointer;
  animation: fade-up 0.5s ease both;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.way-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.way-card-icon {
  flex-shrink: 0;
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-cream);
  border-radius: var(--radius-sm);
}

.way-card-body {
  flex: 1;
  min-width: 0;
}

.way-card-top {
  margin-bottom: var(--space-xs);
}

.way-tag {
  display: inline-block;
  font-size: 10px;
  color: var(--color-text-lighter);
  background: var(--color-cream);
  padding: 1px 6px;
  border-radius: 999px;
  margin-bottom: 2px;
  letter-spacing: 0.1em;
}

.way-card-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-text);
  line-height: 1.35;
}

.way-card-summary {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.7;
  margin-bottom: var(--space-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.way-card-prevention {
  display: flex;
  gap: var(--space-xs);
  align-items: flex-start;
  font-size: var(--text-xs);
  color: var(--color-gold-dark);
  line-height: 1.6;
}

.prevention-icon { flex-shrink: 0; }

/* ── Closing ── */
.closing {
  margin-top: var(--space-2xl);
}

.closing-card {
  background:
    radial-gradient(ellipse at 80% 20%, rgba(194, 149, 107, 0.12), transparent 50%),
    var(--color-warm-white);
  border-radius: var(--radius-md);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  border: 1px solid var(--color-border-light);
}

.closing-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.closing-text {
  color: var(--color-text-light);
  max-width: 640px;
  margin: 0 auto var(--space-xl);
  line-height: 1.9;
}

.closing-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
}

.closing-link {
  padding: var(--space-sm) var(--space-lg);
  border-radius: 999px;
  border: 1px solid var(--color-gold);
  color: var(--color-gold-dark);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: all 0.25s ease;
}

.closing-link:hover {
  background: var(--color-gold);
  color: #fff;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(60, 50, 40, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.modal-card {
  position: relative;
  width: min(680px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 3;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(60, 50, 40, 0.5);
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s ease;
}

.modal-close:hover { background: rgba(60, 50, 40, 0.8); }

.modal-cover {
  height: 180px;
  background-size: cover;
  background-position: center;
  filter: saturate(0.9);
}

.modal-body {
  padding: var(--space-2xl) var(--space-xl);
}

.modal-meta {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
  font-size: var(--text-xs);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.modal-tag {
  color: var(--color-text-lighter);
  background: var(--color-cream);
  padding: 1px 8px;
  border-radius: 999px;
  letter-spacing: 0.1em;
}

.modal-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
  line-height: 1.4;
}

.modal-emoji { margin-right: var(--space-sm); }

.modal-odds {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-cream);
  border-radius: var(--radius-sm);
}

.odds-label { color: var(--color-gold-dark); font-weight: 600; }

.modal-detail {
  font-size: var(--text-base);
  line-height: 1.85;
  color: var(--color-text);
  margin-bottom: var(--space-xl);
}

.modal-detail p { margin-bottom: var(--space-md); }

.modal-prevention {
  background: rgba(139, 157, 131, 0.1);
  border-left: 3px solid var(--color-sage);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: var(--space-md) var(--space-lg);
}

.prevention-title {
  display: block;
  font-weight: 600;
  color: var(--color-sage);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
  letter-spacing: 0.1em;
}

.modal-prevention p {
  margin: 0;
  color: var(--color-text);
  line-height: 1.8;
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-card, .modal-leave-active .modal-card { transition: transform 0.3s ease; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card { transform: translateY(24px) scale(0.98); }

/* ── Shared ── */
.loading {
  text-align: center;
  color: var(--color-text-lighter);
  padding: var(--space-3xl);
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .way-card { animation: none; }
}

@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; }
  .closing-actions { flex-direction: column; align-items: center; }
}
</style>
