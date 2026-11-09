<template>
  <div v-if="!done" class="commit-button" :class="{ 'commit-button--inline': inline }">
    <span v-if="lead" class="commit-lead">{{ lead }}</span>
    <div class="commit-options">
      <button
        v-for="opt in options"
        :key="opt.days"
        class="commit-opt"
        :class="{ 'commit-opt--compact': compact }"
        @click="make(opt.days)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
  <div v-else class="committed-note" :class="{ 'committed-note--inline': inline }">
    <span class="committed-mark">✦</span>
    已记下：<strong>{{ doneText }}</strong>
    <router-link to="/commitments" class="committed-link">看看我的约定</router-link>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCommitmentsStore } from '@/stores/commitments'

const props = defineProps({
  action: { type: String, required: true },
  link: { type: String, default: '' },
  question: { type: String, default: '' },
  sourceType: { type: String, default: '' },
  sourceSlug: { type: String, default: '' },
  sourceTitle: { type: String, default: '' },
  lead: { type: String, default: '顺手给自己定个日子，它到期会回到首页找你' },
  compact: { type: Boolean, default: false },
  inline: { type: Boolean, default: false }
})

const OPTIONS = [
  { days: 0, label: '今天' },
  { days: 7, label: '这周内' },
  { days: 30, label: '这个月' }
]

const commitments = useCommitmentsStore()
const options = OPTIONS
const done = ref(false)
const doneText = ref('')

/** 已经立过、且还没完成的承诺，重进页面时直接显示回执，不重复催第二次 */
function sync() {
  const existed =
    props.sourceSlug && props.action
      ? commitments.open.find(
          c => c.sourceSlug === props.sourceSlug && c.action === props.action
        )
      : null
  if (existed) {
    doneText.value = `${existed.dueAt} 前做「${existed.action}」`
    done.value = true
  } else {
    done.value = false
    doneText.value = ''
  }
}

sync()

// 同一个组件实例在内容间复用（如文章 A → 文章 B）时，不能把上一件的「已记下」带过去
watch(() => [props.sourceSlug, props.action].join('|'), sync)

function make(days) {
  commitments.commit({
    action: props.action,
    link: props.link,
    sourceType: props.sourceType,
    sourceSlug: props.sourceSlug,
    sourceTitle: props.sourceTitle,
    question: props.question,
    days
  })
  doneText.value =
    days === 0
      ? '今天就要做「' + props.action + '」'
      : days + ' 天内做「' + props.action + '」'
  done.value = true
}
</script>

<style scoped>
.commit-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.commit-lead {
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.commit-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.commit-opt {
  padding: var(--space-xs) var(--space-lg);
  background: transparent;
  border: 1px solid var(--color-gold);
  border-radius: var(--radius-full);
  color: var(--color-gold-dark);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.commit-opt--compact {
  padding: 2px var(--space-md);
  font-size: var(--text-xs);
}

.commit-opt:hover {
  background: var(--color-gold);
  color: #fff;
}

.committed-note {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  text-align: center;
}

.committed-mark {
  color: var(--color-gold-dark);
  margin-right: var(--space-xs);
}

.committed-link {
  margin-left: var(--space-sm);
  color: var(--color-gold-dark);
}

/* 嵌在列表项里的形态：跟着左边缘排，不抢整行居中 */
.commit-button--inline {
  align-items: flex-start;
}

.commit-button--inline .commit-options {
  justify-content: flex-start;
}

.committed-note--inline {
  text-align: left;
}
</style>
