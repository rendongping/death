<template>
  <div class="bucketlist-board">
    <!-- 示例库 -->
    <WarmCard accent="gold" class="examples-card">
      <div class="examples-header">
        <h3 class="examples-title">不知道写什么？从这里开始</h3>
        <p class="examples-desc">这些心愿来自他人的遗愿清单，点击即可添加到你的清单中。</p>
      </div>
      <div class="examples-categories">
        <div v-for="cat in categories" :key="cat.id" class="example-category">
          <h4 class="example-category-title" :style="{ color: cat.color }">{{ cat.name }}</h4>
          <div class="example-tags">
            <button
              v-for="example in cat.examples"
              :key="example"
              class="example-tag"
              @click="addExample(cat.id, example)"
            >
              + {{ example }}
            </button>
          </div>
        </div>
      </div>
    </WarmCard>

    <!-- 添加新心愿 -->
    <div class="add-form">
      <select v-model="newItemCategory" class="add-category">
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <input
        v-model="newItemTitle"
        type="text"
        class="add-input"
        placeholder="你想做什么？"
        @keydown.enter="addItem"
      />
      <WarmButton @click="addItem" :disabled="!newItemTitle.trim()">
        添加
      </WarmButton>
    </div>

    <!-- 未完成列表 -->
    <div v-if="pendingItems.length" class="items-section">
      <h2 class="items-heading">还没做的 ({{ pendingItems.length }})</h2>
      <TransitionGroup name="list" tag="ul" class="items-list">
        <li
          v-for="item in pendingItems"
          :key="item.id"
          class="bucket-item"
          :style="{ borderLeftColor: getCategoryColor(item.category) }"
        >
          <button class="item-check" @click="toggleItem(item.id)" title="标记为完成">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#C2956B" stroke-width="1.5"/>
            </svg>
          </button>
          <div class="item-content">
            <div class="item-title-row">
              <span class="item-category" :style="{ color: getCategoryColor(item.category) }">
                {{ getCategoryName(item.category) }}
              </span>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <span v-if="item.note" class="item-note">{{ item.note }}</span>
            <span class="item-date">{{ formatDate(item.createdAt) }}</span>
          </div>
          <button class="item-delete" @click="deleteItem(item.id)" title="删除">×</button>
        </li>
      </TransitionGroup>
    </div>

    <!-- 已完成列表 -->
    <div v-if="completedItems.length" class="items-section">
      <h2 class="items-heading items-heading--done">已完成的 ({{ completedItems.length }})</h2>
      <ul class="items-list">
        <li
          v-for="item in completedItems"
          :key="item.id"
          class="bucket-item bucket-item--done"
          :style="{ borderLeftColor: getCategoryColor(item.category) }"
        >
          <button class="item-check item-check--done" @click="toggleItem(item.id)" title="取消完成">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill="#8B9D83" stroke="#8B9D83" stroke-width="1.5"/>
              <path d="M6 10l3 3 5-5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="item-content">
            <div class="item-title-row">
              <span class="item-category" :style="{ color: getCategoryColor(item.category) }">
                {{ getCategoryName(item.category) }}
              </span>
              <span class="item-title item-title--done">{{ item.title }}</span>
            </div>
            <span class="item-date">完成于 {{ formatDate(item.completedAt) }}</span>
          </div>
          <button class="item-delete" @click="deleteItem(item.id)" title="删除">×</button>
        </li>
      </ul>
    </div>

    <EmptyState
      v-if="!pendingItems.length && !completedItems.length"
      icon="✨"
      title="你的遗愿清单还是空的"
      description="写下你想做的第一件事吧，哪怕是一件小事。"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmButton from '@/components/ui/WarmButton.vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { loadJSON, saveJSON } from '@/utils/storage'

const STORAGE_KEY = 'mv-bucketlist'

const categories = [
  {
    id: 'experience',
    name: '体验',
    color: '#C2956B',
    examples: ['看一次极光', '独自旅行一次', '学一门新语言', '尝试一次潜水', '去一个从未去过的大陆']
  },
  {
    id: 'relationship',
    name: '关系',
    color: '#C4929E',
    examples: ['对父母说一次感谢', '修复一段疏远的关系', '和挚友做一次深度对话', '陪伴一个孩子长大', '认真谈一次心']
  },
  {
    id: 'creation',
    name: '创造',
    color: '#8B9D83',
    examples: ['写一首诗', '画一幅画', '完成一部小说', '做一件手工礼物', '录一段给未来的自己的视频']
  },
  {
    id: 'contribution',
    name: '贡献',
    color: '#8B7D6B',
    examples: ['做一次志愿者', '帮助一个陌生人', '为环保做一件事', '捐一次血', '分享自己的故事']
  },
  {
    id: 'learning',
    name: '学习',
    color: '#A89885',
    examples: ['读 100 本书', '学会弹一首曲子', '深入了解一个历史人物', '上一门感兴趣的网课', '掌握一项新技能']
  }
]

const newItemTitle = ref('')
const newItemCategory = ref('experience')
const items = ref(loadJSON(STORAGE_KEY, []))

const pendingItems = computed(() =>
  items.value.filter(i => !i.done).sort((a, b) => b.createdAt - a.createdAt)
)
const completedItems = computed(() =>
  items.value.filter(i => i.done).sort((a, b) => b.completedAt - a.completedAt)
)

function save() {
  saveJSON(STORAGE_KEY, items.value)
}

function addItem() {
  const title = newItemTitle.value.trim()
  if (!title) return
  items.value.push({
    id: Date.now(),
    title,
    category: newItemCategory.value,
    note: '',
    done: false,
    createdAt: Date.now(),
    completedAt: null
  })
  newItemTitle.value = ''
  save()
}

function addExample(categoryId, title) {
  items.value.push({
    id: Date.now(),
    title,
    category: categoryId,
    note: '',
    done: false,
    createdAt: Date.now(),
    completedAt: null
  })
  save()
}

function toggleItem(id) {
  const item = items.value.find(i => i.id === id)
  if (!item) return
  item.done = !item.done
  item.completedAt = item.done ? Date.now() : null
  save()
}

function deleteItem(id) {
  items.value = items.value.filter(i => i.id !== id)
  save()
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

function getCategoryColor(categoryId) {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.color : '#C2956B'
}

function getCategoryName(categoryId) {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.name : '其他'
}
</script>

<style scoped>
.examples-card {
  margin-bottom: var(--space-2xl);
}

.examples-header {
  margin-bottom: var(--space-lg);
}

.examples-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.examples-desc {
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.examples-categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.example-category-title {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.example-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.example-tag {
  padding: 0.4rem 0.85rem;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.example-tag:hover {
  background: var(--color-border-light);
  border-color: var(--color-gold);
  color: var(--color-gold-dark);
}

.add-form {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.add-category {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: #fff;
  font-size: var(--text-base);
  color: var(--color-text);
  outline: none;
  cursor: pointer;
}

.add-category:focus {
  border-color: var(--color-gold);
}

.add-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.add-input:focus {
  border-color: var(--color-gold);
}

.items-section {
  margin-bottom: var(--space-2xl);
}

.items-heading {
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-md);
  font-family: var(--font-body);
}

.items-heading--done {
  color: var(--color-sage);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.bucket-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-gold);
  transition: all var(--transition-base);
}

.bucket-item--done {
  opacity: 0.6;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: 2px;
}

.item-category {
  font-size: var(--text-xs);
  font-weight: 500;
}

.item-title {
  font-size: var(--text-base);
  color: var(--color-text);
}

.item-title--done {
  text-decoration: line-through;
  color: var(--color-text-light);
}

.item-note {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-top: 2px;
}

.item-date {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-top: 4px;
}

.item-check {
  flex-shrink: 0;
  padding: 2px;
  margin-top: 1px;
  transition: transform var(--transition-fast);
}

.item-check:hover {
  transform: scale(1.15);
}

.item-delete {
  flex-shrink: 0;
  font-size: var(--text-xl);
  color: var(--color-text-lighter);
  padding: 0 4px;
  opacity: 0;
  transition: all var(--transition-fast);
}

.bucket-item:hover .item-delete {
  opacity: 1;
}

.item-delete:hover {
  color: var(--color-dusty-rose);
}

/* List transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
