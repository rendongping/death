<template>
  <WarmCard accent="sage" class="daily-prompt">
    <div class="prompt-header">
      <span class="prompt-label">每日反思</span>
      <span class="prompt-date">{{ todayStr }}</span>
    </div>
    <p class="prompt-question">{{ prompt }}</p>
    <div v-if="hasWrittenToday" class="prompt-done">
      <span class="done-icon">✓</span>
      <span>今天的反思已完成</span>
    </div>
    <div v-else class="prompt-actions">
      <textarea
        v-model="entry"
        class="prompt-textarea"
        rows="3"
        placeholder="写下你的想法..."
      ></textarea>
      <WarmButton @click="saveEntry" :disabled="!entry.trim()">
        记录
      </WarmButton>
    </div>

    <details v-if="historyEntries.length" class="prompt-history">
      <summary class="history-toggle">
        查看过往反思 ({{ historyEntries.length }})
      </summary>
      <div class="history-list">
        <div
          v-for="h in historyEntries"
          :key="h.date"
          class="history-item"
        >
          <span class="history-date">{{ h.date }}</span>
          <p class="history-text">{{ h.text }}</p>
        </div>
      </div>
    </details>
  </WarmCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import WarmButton from '@/components/ui/WarmButton.vue'

const STORAGE_KEY = 'mv-reflections'

const prompts = [
  '如果今天是你生命的最后一天，你会如何度过？',
  '你上一次对某人说"我爱你"是什么时候？',
  '有没有一件事你一直想做却一直在拖延？是什么在阻止你？',
  '你希望在你离开这个世界后，人们如何记住你？',
  '今天有什么让你感到活着真好的瞬间？',
  '如果可以向一位已经离开的人问一个问题，你会问什么？',
  '你生命中最感恩的三件事是什么？',
  '死亡让你感到恐惧，还是让你感到紧迫？为什么？',
  '如果可以给年轻时的自己一个忠告，你会说什么？',
  '今天，你可以为这个世界留下什么？',
  '如果只能保留一段记忆，你会选择哪一段？为什么？',
  '有没有一个你想修补的关系？是什么让你还没有行动？',
  '你最近一次感到深深被爱是什么时候？',
  '如果明天开始你的人生只剩下一年，你会立刻停止做什么？',
  '对你来说，"好好活着"意味着什么？',
  '你有没有尝试过原谅一个伤害过你的人？那感觉如何？',
  '你生命中最骄傲的一件事是什么？',
  '如果你可以穿越到十年后，你想对那时的自己说什么？',
  '今天有没有一个人，你想认真地对他说声谢谢？',
  '你害怕被遗忘吗？为什么？',
  '有没有一种味道、一首歌或一个地方，会让你想起某个已经离开的人？',
  '如果可以把一个习惯保留一辈子，你会选什么？',
  '你最近一次为他人付出而感到快乐是什么时候？',
  '如果可以改变人生中已经发生过的一件事，你会选什么？',
  '你希望如何庆祝自己的生日？这种期待反映了你怎样的生命态度？',
  '有没有一句话，你一直想说却没有说出口？',
  '当你感到孤独时，什么最能安慰你？',
  '如果可以送给自己一个礼物，你会送什么？',
  '你认为什么是真正的勇敢？',
  '有没有一个人，你一直想道歉却不敢开口？',
  '如果把人生比作四季，你现在处于哪个季节？为什么？',
  '你最近一次大笑是什么时候？当时发生了什么？',
  '如果可以重新选择职业或生活方式，你会尝试什么？',
  '你最想教给下一代的一件事是什么？',
  '有没有一种恐惧，你最近正在学着与它相处？',
  '你今天为自己做的一件小事是什么？',
  '如果可以给世界留下一句话，你会写什么？',
  '你生命中最重要的三个价值观是什么？',
  '你希望自己年老时如何回忆这一生？',
  '此刻，你最想拥抱的人是谁？'
]

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const todayKey = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
})

// 每日根据日期选一个问题
const prompt = computed(() => {
  const d = new Date()
  const idx = (d.getFullYear() * 365 + d.getMonth() * 31 + d.getDate()) % prompts.length
  return prompts[idx]
})

const reflections = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'))
const entry = ref('')

const hasWrittenToday = computed(() => !!reflections.value[todayKey.value])

const historyEntries = computed(() => {
  return Object.entries(reflections.value)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, text]) => ({ date, text }))
})

function saveEntry() {
  if (!entry.value.trim()) return
  reflections.value = {
    ...reflections.value,
    [todayKey.value]: entry.value.trim()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections.value))
  entry.value = ''
}
</script>

<style scoped>
.daily-prompt {
  max-width: 600px;
  margin: 0 auto;
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.prompt-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-sage);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prompt-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
}

.prompt-question {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: var(--space-lg);
}

.prompt-done {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-sage);
  font-size: var(--text-sm);
}

.done-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-sage);
  color: #fff;
  font-size: 12px;
}

.prompt-textarea {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #fff;
  resize: vertical;
  font-size: var(--text-base);
  line-height: 1.7;
  outline: none;
  margin-bottom: var(--space-md);
}

.prompt-textarea:focus {
  border-color: var(--color-sage);
}

.prompt-history {
  margin-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-md);
}

.history-toggle {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  user-select: none;
}

.history-toggle:hover {
  color: var(--color-sage);
}

.history-list {
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.history-item {
  padding: var(--space-md);
  background: #fff;
  border-radius: var(--radius-sm);
}

.history-date {
  font-size: var(--text-xs);
  color: var(--color-text-lighter);
  display: block;
  margin-bottom: 4px;
}

.history-text {
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.6;
}
</style>
