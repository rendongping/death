<template>
  <div class="advance-page">
    <div class="advance-header">
      <div class="advance-header__text">
        <h1 class="page-title">我的意愿</h1>
        <p class="page-subtitle">
          一份温柔的生前预嘱引导。这不是法律文件，而是帮助你整理内心想法的工具。
        </p>
      </div>
      <Illustration name="advance" :width="160" :height="128" />
    </div>

    <div v-if="!showResult" class="form-section">
      <WarmCard v-for="(q, index) in questions" :key="q.id" accent="sage" class="question-card">
        <div class="question-number">问题 {{ index + 1 }} / {{ questions.length }}</div>
        <h3 class="question-title">{{ q.title }}</h3>
        <p v-if="q.hint" class="question-hint">{{ q.hint }}</p>
        <textarea
          v-model="answers[q.id]"
          class="question-textarea"
          rows="3"
          :placeholder="q.placeholder"
        ></textarea>
      </WarmCard>

      <div class="form-actions">
        <WarmButton variant="ghost" @click="clearAll">清空</WarmButton>
        <WarmButton @click="generateResult" :disabled="!hasAnyAnswer">
          生成我的意愿书
        </WarmButton>
      </div>
    </div>

    <div v-else class="result-section">
      <WarmCard accent="gold" class="result-card">
        <div class="result-header">
          <h2 class="result-title">我的意愿书</h2>
          <p class="result-date">生成于 {{ todayStr }}</p>
        </div>
        <div class="result-content" ref="resultRef">
          <p class="result-intro">
            以下是我的个人意愿。当我无法为自己表达时，请尊重这些想法。
          </p>

          <div v-for="q in questions" :key="q.id" class="result-item">
            <h4 class="result-question">{{ q.title }}</h4>
            <p class="result-answer">
              {{ answers[q.id]?.trim() || '（尚未填写）' }}
            </p>
          </div>

          <p class="result-sign">
            签名：________________<br />
            日期：{{ todayStr }}
          </p>
        </div>

        <div class="result-actions">
          <WarmButton variant="ghost" @click="showResult = false">返回修改</WarmButton>
          <WarmButton @click="copyResult">复制文本</WarmButton>
          <WarmButton @click="printResult">打印 / 保存为 PDF</WarmButton>
        </div>
      </WarmCard>

      <div class="legal-note">
        <p>
          注意：这只是一份引导性文档，帮助你梳理个人意愿。如果你希望它具有法律效力，请咨询专业律师或医疗机构，签署正式的预嘱文件。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import WarmButton from '@/components/ui/WarmButton.vue'
import Illustration from '@/components/ui/Illustration.vue'

const STORAGE_KEY = 'mv-advance-directives'

const questions = [
  {
    id: 'decision-maker',
    title: '如果我不能为自己做决定，我希望谁来做？',
    hint: '可以是配偶、父母、子女、兄弟姐妹或挚友。',
    placeholder: '例如：我希望我的妻子/丈夫来为我做医疗决定。'
  },
  {
    id: 'last-place',
    title: '我希望在哪里度过生命的最后时光？',
    hint: '家里、医院、安宁疗护病房，或其他地方。',
    placeholder: '例如：我希望在家中度过最后时光， surrounded by 家人。'
  },
  {
    id: 'medical-intervention',
    title: '对于心肺复苏、插管、人工呼吸等急救措施，我的态度是？',
    hint: '你可以选择希望尽力抢救，或在某些情况下不再进行创伤性抢救。',
    placeholder: '例如：如果我已经没有恢复意识的可能，我希望不进行心肺复苏。'
  },
  {
    id: 'pain-management',
    title: '对于疼痛控制，我希望怎样？',
    hint: '你希望尽可能减少痛苦，即使可能缩短生命？还是希望保持清醒？',
    placeholder: '例如：我希望在生命最后阶段尽量减少痛苦，保持舒适。'
  },
  {
    id: 'memory',
    title: '我希望以什么方式被记住？',
    hint: '一场简单的告别、一首歌、一段文字，或者其他形式。',
    placeholder: '例如：我希望家人和朋友聚在一起，分享我们之间的故事。'
  },
  {
    id: 'last-words',
    title: '我想对爱我的家人和朋友说：',
    hint: '这是你最想说给他们听的话。',
    placeholder: '例如：谢谢你们爱我。请不要为我的离开悲伤太久，继续好好地生活。'
  }
]

const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
const answers = ref({})
questions.forEach(q => {
  answers.value[q.id] = saved[q.id] || ''
})

const showResult = ref(false)
const resultRef = ref(null)
const todayStr = new Date().toISOString().split('T')[0]

const hasAnyAnswer = computed(() =>
  Object.values(answers.value).some(a => a.trim())
)

function generateResult() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers.value))
  showResult.value = true
}

function clearAll() {
  questions.forEach(q => {
    answers.value[q.id] = ''
  })
  localStorage.removeItem(STORAGE_KEY)
}

function getResultText() {
  if (!resultRef.value) return ''
  return resultRef.value.innerText
}

function copyResult() {
  const text = getResultText()
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板')
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}

function printResult() {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>我的意愿书</title>
        <style>
          body { font-family: Georgia, serif; line-height: 1.8; padding: 40px; max-width: 700px; margin: 0 auto; color: #3C3228; }
          h2 { color: #A67B52; }
          h4 { color: #3C3228; margin-bottom: 0; }
          .result-item { margin-bottom: 24px; }
          .result-sign { margin-top: 48px; }
        </style>
      </head>
      <body>${resultRef.value.innerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 200)
}
</script>

<style scoped>
.advance-page {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.advance-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.advance-header__text {
  flex: 1;
  min-width: 280px;
}

.page-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: var(--text-lg);
  line-height: 1.7;
}

.question-card {
  margin-bottom: var(--space-lg);
}

.question-number {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.question-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.question-hint {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.question-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  font-size: var(--text-base);
  line-height: 1.7;
  resize: vertical;
  outline: none;
}

.question-textarea:focus {
  border-color: var(--color-sage);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.result-card {
  margin-bottom: var(--space-xl);
}

.result-header {
  text-align: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.result-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  color: var(--color-gold-dark);
}

.result-date {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  margin-top: var(--space-xs);
}

.result-content {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--color-text);
}

.result-intro {
  margin-bottom: var(--space-xl);
  font-size: var(--text-lg);
}

.result-item {
  margin-bottom: var(--space-xl);
}

.result-question {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-sm);
}

.result-answer {
  color: var(--color-text);
  white-space: pre-wrap;
}

.result-sign {
  margin-top: var(--space-3xl);
  color: var(--color-text-light);
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  flex-wrap: wrap;
}

.legal-note {
  text-align: center;
  padding: var(--space-md);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.6;
}
</style>
