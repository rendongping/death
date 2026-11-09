<template>
  <div class="commitments-page">
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-title">我的约定</h1>
        <p class="page-subtitle">
          每一次读完「讲死」的内容，你都可以给自己定一个日子。到期它会回来找你——
          这是「知死」唯一能被验证的证据：你到底做了什么。
        </p>
      </div>
      <Illustration name="letters" :width="150" :height="120" />
    </div>

    <section v-if="due.length" class="due-section">
      <h2 class="section-title due-title">
        <span class="due-badge">{{ due.length }}</span> 件到期的约定
      </h2>
      <p class="due-lead">那时候的你，把这件事交给了现在的你。</p>
      <article v-for="c in due" :key="c.id" class="commit-card is-due">
        <p class="commit-action">{{ c.action }}</p>
        <p v-if="c.question" class="commit-question">「{{ c.question }}」</p>
        <p class="commit-meta">
          约定于 {{ c.createdAt }} · 应做于 {{ c.dueAt }}
          <span v-if="c.sourceTitle"> · 来自《{{ c.sourceTitle }}》</span>
        </p>
        <div v-if="asking !== c.id" class="commit-actions">
          <router-link :to="c.link" class="commit-btn commit-btn--go">去完成 →</router-link>
          <button class="commit-btn commit-btn--done" @click="asking = c.id">
            我做了 ✦
          </button>
          <button class="commit-btn commit-btn--later" @click="commitments.postpone(c.id, 7)">
            再给我一周
          </button>
          <button class="commit-btn commit-btn--drop" @click="commitments.remove(c.id)">
            不做了
          </button>
        </div>
        <div v-else class="commit-echo">
          <p class="echo-ask">那件事后来怎么样？写一行就行，不写也没关系。</p>
          <input
            v-model="noteText"
            class="echo-input"
            type="text"
            placeholder="例：打了，她接了。聊了四十分钟。"
            @keyup.enter="closeEcho(c)"
          />
          <div class="commit-actions">
            <button class="commit-btn commit-btn--done" @click="closeEcho(c)">
              记下这一行 ✦
            </button>
            <button class="commit-btn commit-btn--drop" @click="skipEcho(c)">
              就是做了，不用记
            </button>
          </div>
        </div>
      </article>
    </section>

    <section v-if="upcoming.length" class="upcoming-section">
      <h2 class="section-title">还来得及的（{{ upcoming.length }}）</h2>
      <article v-for="c in upcoming" :key="c.id" class="commit-card">
        <p class="commit-action">{{ c.action }}</p>
        <p class="commit-meta">
          {{ daysLeft(c) }} · 来自{{ sourceLabel(c) }}
        </p>
        <div v-if="asking !== c.id" class="commit-actions">
          <router-link :to="c.link" class="commit-btn commit-btn--go">提前去做 →</router-link>
          <button class="commit-btn commit-btn--done" @click="asking = c.id">
            我做了 ✦
          </button>
        </div>
        <div v-else class="commit-echo">
          <p class="echo-ask">那件事后来怎么样？写一行就行，不写也没关系。</p>
          <input
            v-model="noteText"
            class="echo-input"
            type="text"
            placeholder="例：打了，她接了。聊了四十分钟。"
            @keyup.enter="closeEcho(c)"
          />
          <div class="commit-actions">
            <button class="commit-btn commit-btn--done" @click="closeEcho(c)">
              记下这一行 ✦
            </button>
            <button class="commit-btn commit-btn--drop" @click="skipEcho(c)">
              就是做了，不用记
            </button>
          </div>
        </div>
      </article>
    </section>

    <section v-if="doneList.length" class="done-section">
      <h2 class="section-title done-title">你已经做到的（{{ doneList.length }}）</h2>
      <p class="done-lead">
        这些不是打卡记录，是你确实因为想过死亡，而把某一天过得不一样的证据。
      </p>
      <ul class="done-list">
        <li v-for="c in doneList" :key="c.id" class="done-item">
          <span class="done-mark">✦</span>
          <span class="done-text">
            {{ c.action }}
            <span v-if="c.note" class="done-note">「{{ c.note }}」</span>
          </span>
          <span class="done-date">{{ c.doneAt }}</span>
        </li>
      </ul>
    </section>

    <EmptyState
      v-if="!commitments.all.length"
      icon="🌱"
      title="还没有约定"
      description="去读一篇文章、看一种死法，或者听完一首诗。读完之后，给自己定一个日子。"
    >
      <router-link to="/" class="commit-btn commit-btn--go">去今日凝视 →</router-link>
    </EmptyState>

    <section v-if="commitments.all.length" class="explain">
      <p>
        约定只存在你自己的浏览器里。它不会提醒你邮件、不会催你、也不会因为你「不做了」而记下任何污点。
        它唯一的用处，是让「我要好好活」这句话有一个可以被核对的日期。
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Illustration from '@/components/ui/Illustration.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useCommitmentsStore } from '@/stores/commitments'

const commitments = useCommitmentsStore()

const due = computed(() => commitments.due)
const upcoming = computed(() => commitments.upcoming)
const doneList = computed(() => commitments.all.filter(c => c.done))

// 点了「我做了」之后先追问一行回响，再落库
const asking = ref('')
const noteText = ref('')

function closeEcho(c) {
  commitments.markDone(c.id, noteText.value)
  asking.value = ''
  noteText.value = ''
}

function skipEcho(c) {
  commitments.markDone(c.id)
  asking.value = ''
  noteText.value = ''
}

const TYPE_LABEL = {
  article: '一篇文章',
  story: '一个故事',
  practice: '一个练习',
  poem: '一首诗',
  archive: '一首悼亡诗',
  way: '一种死法',
  recommendation: '一部作品',
  memorial: '哀悼空间'
}

function sourceLabel(c) {
  if (c.sourceTitle) return `《${c.sourceTitle}》`
  return TYPE_LABEL[c.sourceType] || '一次阅读'
}

function daysLeft(c) {
  const day = 86400000
  const diff = Math.ceil(((c.dueTs || 0) - Date.now()) / day)
  if (diff <= 0) return '今天到期'
  if (diff === 1) return '明天到期'
  return `还有 ${diff} 天`
}

onMounted(() => {
  document.title = '我的约定 · Memento Vivere'
})
</script>

<style scoped>
.commitments-page {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-3xl);
}

.page-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.page-subtitle {
  color: var(--color-text-light);
  line-height: 1.85;
  max-width: 34em;
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.due-section,
.upcoming-section,
.done-section {
  margin-bottom: var(--space-3xl);
}

.due-title {
  color: var(--color-dusty-rose);
}

.due-badge {
  display: inline-block;
  min-width: 1.6em;
  padding: 0 0.4em;
  background: var(--color-dusty-rose);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 0.8em;
  text-align: center;
}

.due-lead {
  color: var(--color-text-light);
  font-style: italic;
  margin-bottom: var(--space-lg);
}

.commit-card {
  background: var(--color-warm-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-lg) var(--space-xl);
  margin-bottom: var(--space-md);
}

.commit-card.is-due {
  border-color: var(--color-dusty-rose);
  background: linear-gradient(135deg, rgba(196, 146, 158, 0.08), var(--color-warm-white));
}

.commit-action {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.commit-question {
  color: var(--color-text-light);
  line-height: 1.75;
  font-size: var(--text-sm);
  margin-bottom: var(--space-sm);
}

.commit-meta {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-md);
}

.commit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.commit-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: transparent;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.commit-btn--go {
  background: var(--color-gold-dark);
  border-color: var(--color-gold-dark);
  color: #fff;
}

.commit-btn--go:hover {
  background: var(--color-ink);
  border-color: var(--color-ink);
}

.commit-btn--done:hover {
  background: var(--color-sage);
  border-color: var(--color-sage);
  color: #fff;
}

.commit-btn--later:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-dark);
}

.commit-btn--drop:hover {
  border-color: var(--color-text-lighter);
  color: var(--color-text-lighter);
}

.done-title {
  color: var(--color-sage);
}

.done-lead {
  color: var(--color-text-light);
  font-size: var(--text-sm);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
}

.done-list {
  list-style: none;
  padding: 0;
}

.done-item {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-bottom: 1px dashed var(--color-border-light);
}

.done-mark {
  color: var(--color-gold-dark);
}

.done-text {
  flex: 1;
  color: var(--color-text);
}

.done-note {
  display: block;
  margin-top: 2px;
  color: var(--color-text-light);
  font-size: var(--text-sm);
  font-style: italic;
}

.commit-echo {
  margin-top: var(--space-sm);
}

.echo-ask {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
}

.echo-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-cream);
  font-size: var(--text-sm);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.echo-input:focus {
  outline: none;
  border-color: var(--color-gold);
}

.done-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.explain {
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-cream);
  border-radius: var(--radius-md);
}

.explain p {
  color: var(--color-text-light);
  font-size: var(--text-sm);
  line-height: 1.9;
  margin: 0;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }

  .page-header :deep(svg) {
    display: none;
  }
}
</style>
