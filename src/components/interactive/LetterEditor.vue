<template>
  <div class="letter-editor">
    <!-- 写信模式 -->
    <div v-if="mode === 'write'" class="write-mode">
      <WarmCard accent="rose">
        <h2 class="write-title">写一封信</h2>

        <div class="form-group">
          <label class="form-label">选择一封信的模板（可选）</label>
          <div class="template-list">
            <button
              v-for="t in templates"
              :key="t.id"
              type="button"
              class="template-btn"
              :class="{ 'template-btn--active': selectedTemplate === t.id }"
              @click="applyTemplate(t.id)"
            >
              {{ t.name }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">收信人</label>
          <input
            v-model="letter.to"
            type="text"
            class="form-input"
            placeholder="可以是某个人，也可以是'未来的自己'"
          />
        </div>
        <div class="form-group">
          <label class="form-label">主题</label>
          <input
            v-model="letter.subject"
            type="text"
            class="form-input"
            placeholder="你想说什么？"
          />
        </div>
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea
            v-model="letter.body"
            class="form-textarea"
            rows="8"
            placeholder="写下你想说的话..."
          ></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">送达日期（可选）</label>
          <input
            v-model="letter.deliverAt"
            type="date"
            class="form-input"
            :min="todayStr"
          />
          <p class="form-hint">设定一个未来的日期，在那之前这封信会静静等待。</p>
        </div>
        <div class="form-actions">
          <WarmButton variant="ghost" @click="mode = 'list'">取消</WarmButton>
          <WarmButton @click="saveLetter" :disabled="!canSave">保存信件</WarmButton>
        </div>
      </WarmCard>
    </div>

    <!-- 列表模式 -->
    <div v-else class="list-mode">
      <div class="list-header">
        <h2>我的信件 ({{ letters.length }})</h2>
        <WarmButton @click="startNewLetter">写一封新信</WarmButton>
      </div>

      <div v-if="letters.length === 0">
        <EmptyState
          icon="✉️"
          title="还没有写过信"
          description="写一封信给未来的自己，或者给一个你珍视的人。"
        />
      </div>

      <div v-else class="letters-list">
        <div
          v-for="letter in sortedLetters"
          :key="letter.id"
          class="letter-card"
          :class="{ 'letter-card--delivered': isDelivered(letter) }"
          @click="viewLetter(letter)"
        >
          <div class="letter-icon">{{ isDelivered(letter) ? '📬' : '💌' }}</div>
          <div class="letter-info">
            <span class="letter-to">致：{{ letter.to || '未指定' }}</span>
            <span class="letter-subject">{{ letter.subject || '无主题' }}</span>
            <span class="letter-date">
              {{ formatDate(letter.createdAt) }}
              <template v-if="letter.deliverAt">
                · {{ isDelivered(letter) ? '已送达' : `将在 ${letter.deliverAt} 送达` }}
              </template>
            </span>
          </div>
          <button class="letter-delete" @click.stop="deleteLetter(letter.id)" title="删除">×</button>
        </div>
      </div>

      <!-- 查看信件弹窗 -->
      <Transition name="fade">
        <div v-if="viewingLetter" class="modal-overlay" @click.self="viewingLetter = null">
          <div class="modal-card modal-card--letter">
            <button class="modal-close" @click="viewingLetter = null">×</button>
            <p class="letter-meta">致：{{ viewingLetter.to || '未指定' }}</p>
            <h3 class="letter-view-subject">{{ viewingLetter.subject || '无主题' }}</h3>
            <div class="letter-view-body">{{ viewingLetter.body }}</div>
            <p class="letter-view-date">
              写于 {{ formatDate(viewingLetter.createdAt) }}
              <template v-if="viewingLetter.deliverAt">
                · {{ isDelivered(viewingLetter) ? '已送达' : `将在 ${viewingLetter.deliverAt} 送达` }}
              </template>
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmButton from '@/components/ui/WarmButton.vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { loadJSON, saveJSON } from '@/utils/storage'

const STORAGE_KEY = 'mv-letters'

const mode = ref('list')
const letters = ref(loadJSON(STORAGE_KEY, []))
const viewingLetter = ref(null)
const selectedTemplate = ref('')

const todayStr = computed(() => new Date().toISOString().split('T')[0])

const templates = [
  {
    id: 'future-self',
    name: '给未来的自己',
    to: '未来的我',
    subject: '写于此刻的一封信',
    body: '亲爱的未来的我：\n\n此刻的我，正坐在 ______，写下这封信。\n\n我想对你说：\n\n1. 最近我正在努力的一件事是 ______。\n2. 我希望那时的你已经 ______。\n3. 无论此刻的你经历了什么，请记得 ______。\n\n愿你依然对生活保有好奇，依然愿意去爱，依然相信生命值得。\n\n来自过去的我'
  },
  {
    id: 'parents',
    name: '给父母',
    to: '亲爱的爸爸妈妈',
    subject: '谢谢你们',
    body: '亲爱的爸爸妈妈：\n\n有些话，平时总觉得不好意思说出口，但此刻我想认真写下来。\n\n谢谢你们 ______。\n\n我知道你们也曾年轻、也曾害怕、也曾为我担心。谢谢你们把我带到这个世界，用你们的方式爱我。\n\n如果有一天我不在了，请记得：你们是我生命中最重要的人。\n\n爱你们的孩子'
  },
  {
    id: 'child',
    name: '给孩子',
    to: '我的孩子',
    subject: '我想让你知道的事',
    body: '亲爱的孩子：\n\n当你读到这封信时，我可能已经老去，或者已经离开。但无论我在哪里，我都想让你知道：\n\n1. 你是我生命中最大的礼物。\n2. 我希望你记住的关于我的事是 ______。\n3. 我想送给你的三个人生态度是：______。\n\n请勇敢地去活，去犯错，去爱，去原谅。\n\n永远爱你的'
  },
  {
    id: 'partner',
    name: '给伴侣',
    to: '亲爱的你',
    subject: '谢谢你陪我走过',
    body: '亲爱的：\n\n此刻写下这封信，是因为我想让你确切地知道：你对我有多重要。\n\n谢谢你 ______。\n\n和你在一起的时光，让我明白了什么是陪伴、什么是理解、什么是爱。\n\n无论未来如何，请记得：我曾深深地、真诚地爱过你。\n\n爱你的'
  }
]

const letter = ref({
  to: '',
  subject: '',
  body: '',
  deliverAt: ''
})

const canSave = computed(() =>
  letter.value.body.trim() && (letter.value.to.trim() || letter.value.subject.trim())
)

function applyTemplate(id) {
  const t = templates.find(item => item.id === id)
  if (!t) return
  selectedTemplate.value = id
  letter.value = {
    ...letter.value,
    to: t.to,
    subject: t.subject,
    body: t.body
  }
}

const sortedLetters = computed(() =>
  [...letters.value].sort((a, b) => b.createdAt - a.createdAt)
)

function save() {
  saveJSON(STORAGE_KEY, letters.value)
}

function startNewLetter() {
  letter.value = { to: '', subject: '', body: '', deliverAt: '' }
  selectedTemplate.value = ''
  mode.value = 'write'
}

function saveLetter() {
  letters.value.push({
    id: Date.now(),
    ...letter.value,
    createdAt: Date.now()
  })
  save()
  mode.value = 'list'
}

function deleteLetter(id) {
  letters.value = letters.value.filter(l => l.id !== id)
  if (viewingLetter.value?.id === id) viewingLetter.value = null
  save()
}

function viewLetter(l) {
  viewingLetter.value = l
}

function isDelivered(l) {
  if (!l.deliverAt) return true
  return new Date(l.deliverAt) <= new Date()
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}
</script>

<style scoped>
/* Write mode */
.write-title {
  font-size: var(--text-xl);
  color: var(--color-dusty-rose);
  margin-bottom: var(--space-lg);
}

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.template-btn {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.template-btn:hover {
  border-color: var(--color-dusty-rose);
  color: var(--color-dusty-rose);
}

.template-btn--active {
  background: rgba(196, 146, 158, 0.1);
  border-color: var(--color-dusty-rose);
  color: var(--color-dusty-rose);
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: var(--space-xs);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: var(--text-base);
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-dusty-rose);
}

.form-textarea {
  resize: vertical;
  line-height: 1.7;
}

.form-hint {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-top: var(--space-xs);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

/* List mode */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.list-header h2 {
  font-size: var(--text-xl);
  font-family: var(--font-body);
  color: var(--color-text);
}

.letters-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.letter-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-dusty-rose);
  cursor: pointer;
  transition: all var(--transition-base);
}

.letter-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.letter-card--delivered {
  opacity: 0.6;
  border-left-color: var(--color-sage);
}

.letter-icon {
  font-size: 1.5rem;
}

.letter-info {
  flex: 1;
  min-width: 0;
}

.letter-to {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.letter-subject {
  display: block;
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text);
  margin: 2px 0;
}

.letter-date {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.letter-delete {
  font-size: var(--text-xl);
  color: var(--color-text-lighter);
  opacity: 0;
  transition: all var(--transition-fast);
}

.letter-card:hover .letter-delete {
  opacity: 1;
}

.letter-delete:hover {
  color: var(--color-dusty-rose);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(60, 50, 40, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: var(--space-lg);
}

.modal-card {
  background: var(--color-warm-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 520px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  font-size: 1.5rem;
  color: var(--color-text-lighter);
}

.modal-close:hover {
  color: var(--color-text);
}

.letter-meta {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-xs);
}

.letter-view-subject {
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-lg);
}

.letter-view-body {
  font-size: var(--text-lg);
  line-height: 1.8;
  color: var(--color-text);
  white-space: pre-wrap;
  margin-bottom: var(--space-lg);
}

.letter-view-date {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-md);
}
</style>
