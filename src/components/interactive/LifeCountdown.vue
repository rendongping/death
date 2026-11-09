<template>
  <section class="life-countdown">
    <!-- 未设置生日：引导卡片 -->
    <router-link v-if="!birthdate" to="/calendar" class="countdown-card countdown-card--empty">
      <span class="empty-title">输入生日，看见你的时间</span>
      <span class="empty-hint">每一个格子，都是一个星期 →</span>
    </router-link>

    <!-- 已设置生日：倒计时 -->
    <div v-else class="countdown-card">
      <div class="countdown-stats">
        <div class="stat">
          <span class="stat-number">{{ livedWeeks }}</span>
          <span class="stat-label">已度过的星期</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ remainingWeeks }}</span>
          <span class="stat-label">大约还剩的星期</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ lifePercent }}%</span>
          <span class="stat-label">人生进度</span>
        </div>
      </div>

      <div class="life-bar">
        <div class="life-bar-fill" :style="{ width: lifePercent + '%' }"></div>
      </div>

      <div class="granularity">
        <span>今天已过去 {{ todayPercent }}%</span>
        <span class="granularity-dot">·</span>
        <span>今年已过去 {{ yearPercent }}%</span>
      </div>

      <div class="owned-row">
        <p class="owned-text">
          但别忘了：你已经<strong>拥有</strong>了 {{ livedDays }} 天、{{ fullMoons }} 轮满月。
          <template v-if="doneWishes"> 已有 {{ doneWishes }} 个心愿被你亲手划掉。</template>
        </p>
        <router-link to="/calendar" class="owned-link">去日历点亮活过的日子 →</router-link>
      </div>

      <div class="gaze-row">
        <span v-if="streak > 0" class="gaze-streak">已连续凝视 {{ streak }} 天</span>
        <span v-if="!hasGazedToday" class="gaze-reminder">今天还没有凝视死亡</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGazeStore } from '@/stores/gaze'
import { useBucketlistStore } from '@/stores/bucketlist'
import { getBirthdate } from '@/utils/week-of-life'

const LIFE_EXPECTANCY = 80

const gazeStore = useGazeStore()
const streak = computed(() => gazeStore.streak)
const hasGazedToday = computed(() => gazeStore.hasGazedToday)

const birthdate = ref(getBirthdate())
const now = ref(new Date())
let timer = null

const birthDateObj = computed(() => birthdate.value ? new Date(birthdate.value) : null)

const livedWeeks = computed(() => {
  if (!birthDateObj.value) return 0
  const diff = now.value.getTime() - birthDateObj.value.getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)))
})

const totalWeeks = LIFE_EXPECTANCY * 52
const remainingWeeks = computed(() => Math.max(0, totalWeeks - livedWeeks.value))
const lifePercent = computed(() => Math.min(100, Math.round(livedWeeks.value / totalWeeks * 100)))

const livedDays = computed(() => livedWeeks.value * 7)
const fullMoons = computed(() => Math.floor(livedWeeks.value * 7 / 29.53))

const bucketlist = useBucketlistStore()
const doneWishes = computed(() => bucketlist.completedItems.length)

const todayPercent = computed(() => {
  const start = new Date(now.value)
  start.setHours(0, 0, 0, 0)
  return Math.floor((now.value.getTime() - start.getTime()) / 86400000 * 100)
})

const yearPercent = computed(() => {
  const yearStart = new Date(now.value.getFullYear(), 0, 1)
  const yearEnd = new Date(now.value.getFullYear() + 1, 0, 1)
  return Math.floor((now.value.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime()) * 100)
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 30000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.life-countdown {
  margin-bottom: var(--space-3xl);
}

.countdown-card {
  display: block;
  background: var(--color-warm-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.countdown-card--empty {
  text-align: center;
  text-decoration: none;
  transition: box-shadow var(--transition-base);
}

.countdown-card--empty:hover {
  box-shadow: var(--shadow-glow);
}

.empty-title {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.empty-hint {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}

.countdown-stats {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.stat {
  flex: 1;
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-gold-dark);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-light);
}

.life-bar {
  height: 8px;
  background: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.life-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold-light), var(--color-gold-dark));
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
}

.granularity {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-md);
}

.owned-row {
  text-align: center;
  padding-top: var(--space-md);
  border-top: 1px dashed var(--color-border);
}

.owned-text {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--space-xs);
}

.owned-text strong {
  color: var(--color-sage);
}

.owned-link {
  font-size: var(--text-sm);
  color: var(--color-gold-dark);
}

.owned-link:hover {
  text-decoration: underline;
}

.granularity-dot {
  margin: 0 var(--space-sm);
}

.gaze-row {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  font-size: var(--text-sm);
}

.gaze-streak {
  color: var(--color-sage);
}

.gaze-reminder {
  color: var(--color-dusty-rose);
}

@media (max-width: 768px) {
  .countdown-stats {
    flex-direction: column;
    gap: var(--space-md);
  }
  .gaze-row {
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
  }
}
</style>
