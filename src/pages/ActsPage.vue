<template>
  <div class="acts-page">
    <div class="page-header">
      <h1 class="page-title">四幕剧</h1>
      <p class="page-subtitle">
        这不是一份内容分类，而是一条路：<br />
        先看见死亡，再决定如何活。每一幕都有它的入口，也有它的出口。
      </p>
    </div>

    <section
      v-for="act in acts"
      :id="`act-${act.id}`"
      :key="act.id"
      class="act-block"
      :style="{ '--act-accent': act.accent, '--act-accent-dark': act.accentDark }"
    >
      <div class="act-head">
        <span class="act-emoji">{{ act.emoji }}</span>
        <div>
          <p class="act-index">第{{ ['一', '二', '三', '四'][act.id - 1] }}幕 · {{ act.time }}</p>
          <h2 class="act-name">{{ act.name }}</h2>
          <p class="act-motto">{{ act.motto }}</p>
        </div>
      </div>
      <p class="act-desc">{{ act.desc }}</p>

      <div v-if="actContents[act.id]?.length" class="act-items">
        <router-link
          v-for="item in actContents[act.id]"
          :key="item.key"
          :to="item.link"
          class="act-item"
        >
          <span class="act-item-type">{{ item.type }}</span>
          <span class="act-item-title">{{ item.title }}</span>
        </router-link>
      </div>

      <div class="act-exits">
        <span class="exits-label">这一幕的出口 →</span>
        <router-link
          v-for="exit in act.exits"
          :key="exit.link"
          :to="exit.link"
          class="exit-btn"
        >
          {{ exit.text }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContent } from '@/composables/useContent'
import { ACTS, inferAct } from '@/data/acts'

const acts = ACTS
const articles = ref([])
const stories = ref([])
const practices = ref([])
const loaded = ref(false)

// 把文章/故事/练习按幕次归档（frontmatter act 优先，否则按分类推断）
const actContents = computed(() => {
  const map = { 1: [], 2: [], 3: [], 4: [] }
  const push = (list, type, linkOf) => {
    for (const item of list) {
      const act = inferAct({ act: item.act, category: item.category, slug: item.slug })
      if (act) map[act.id].push({ key: `${type}-${item.slug}`, type, title: item.title, link: linkOf(item) })
    }
  }
  push(articles.value, '文章', i => `/articles/${i.slug}`)
  push(stories.value, '故事', i => `/stories/${i.slug}`)
  push(practices.value, '练习', i => `/practices/${i.slug}`)
  for (const k of Object.keys(map)) map[k] = map[k].slice(0, 6)
  return map
})

onMounted(async () => {
  if (loaded.value) return
  const { loadAllArticles, loadAllStories, loadAllPractices } = useContent()
  const [a, s, p] = await Promise.all([
    loadAllArticles(),
    loadAllStories(),
    loadAllPractices()
  ])
  articles.value = a
  stories.value = s
  practices.value = p
  loaded.value = true
})
</script>

<style scoped>
.page-header {
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-3xl);
  text-align: center;
}

.page-title {
  font-size: var(--text-5xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
  line-height: 1.8;
}

.act-block {
  max-width: var(--max-width-content);
  margin: 0 auto var(--space-3xl);
  padding: var(--space-2xl);
  background: var(--color-warm-white);
  border-radius: var(--radius-lg);
  border-top: 4px solid var(--act-accent);
  box-shadow: var(--shadow-sm);
}

.act-head {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.act-emoji {
  font-size: var(--text-5xl);
}

.act-index {
  font-size: var(--text-sm);
  letter-spacing: 0.15em;
  color: var(--act-accent-dark);
}

.act-name {
  font-size: var(--text-3xl);
  color: var(--color-text);
  margin: var(--space-xs) 0;
}

.act-motto {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--act-accent-dark);
}

.act-desc {
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
}

.act-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.act-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text);
  transition: background var(--transition-fast);
}

.act-item:hover {
  background: rgba(194, 149, 107, 0.08);
}

.act-item-type {
  flex-shrink: 0;
  font-size: var(--text-xs);
  color: var(--act-accent-dark);
  border: 1px solid var(--act-accent);
  border-radius: var(--radius-full);
  padding: 0 var(--space-sm);
}

.act-item-title {
  font-size: var(--text-base);
}

.act-exits {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--color-border);
}

.exits-label {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

.exit-btn {
  font-size: var(--text-sm);
  color: var(--act-accent-dark);
  text-decoration: none;
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--act-accent);
  border-radius: var(--radius-full);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.exit-btn:hover {
  background: var(--act-accent);
  color: #fff;
}
</style>
