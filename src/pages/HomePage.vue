<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero__content">
        <p class="hero__greeting">{{ greeting }}</p>
        <h1 class="hero__title">Memento Vivere</h1>
        <p class="hero__subtitle">记住要活着</p>
        <p class="hero__desc">
          死亡不是生命的对立面，而是生命的一部分。<br />
          当我们正视死亡，才能更深刻地理解活着的意义。
        </p>
        <div class="hero__actions">
          <router-link to="/calendar" class="warm-btn warm-btn--primary">探索生命日历</router-link>
          <router-link to="/articles" class="warm-btn warm-btn--secondary">阅读文章</router-link>
        </div>
      </div>
      <div class="hero__visual">
        <!-- 蒲公英 SVG -->
        <svg viewBox="0 0 200 240" class="hero__illustration" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.7">
            <line x1="100" y1="180" x2="100" y2="100" stroke="#C2956B" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="100" cy="85" r="2" fill="#C2956B"/>
            <!-- 种子飘散 -->
            <g v-for="i in 8" :key="i" :transform="`rotate(${i * 45 - 20}, 100, 85)`">
              <line x1="100" y1="85" x2="100" y2="55" stroke="#D4B08C" stroke-width="0.8" stroke-linecap="round">
                <animate attributeName="y2" values="55;65;55" dur="3s" repeatCount="indefinite"/>
              </line>
              <line x1="100" y1="55" x2="92" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
              <line x1="100" y1="55" x2="108" y2="48" stroke="#D4B08C" stroke-width="0.5" stroke-linecap="round"/>
              <circle cx="100" cy="55" r="1.5" fill="#D4B08C" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
              </circle>
            </g>
          </g>
        </svg>
      </div>
    </section>

    <!-- 每日反思 -->
    <section class="daily-section">
      <DailyPrompt />
    </section>

    <!-- 感恩时刻 -->
    <section class="gratitude-section">
      <GratitudeMoments />
    </section>

    <!-- 导航入口卡片 -->
    <section class="nav-cards">
      <h2 class="section-title">探索</h2>
      <div class="cards-grid">
        <router-link to="/articles" class="nav-card nav-card--articles card-hover">
          <span class="nav-card__icon">📖</span>
          <h3 class="nav-card__title">文章</h3>
          <p class="nav-card__desc">关于死亡与生命的思考和知识</p>
        </router-link>
        <router-link to="/calendar" class="nav-card nav-card--calendar card-hover">
          <span class="nav-card__icon">📅</span>
          <h3 class="nav-card__title">生命日历</h3>
          <p class="nav-card__desc">可视化你的生命，感受时间的珍贵</p>
        </router-link>
        <router-link to="/bucketlist" class="nav-card nav-card--bucketlist card-hover">
          <span class="nav-card__icon">✨</span>
          <h3 class="nav-card__title">遗愿清单</h3>
          <p class="nav-card__desc">写下你想做的事，趁现在</p>
        </router-link>
        <router-link to="/letters" class="nav-card nav-card--letters card-hover">
          <span class="nav-card__icon">✉️</span>
          <h3 class="nav-card__title">信件</h3>
          <p class="nav-card__desc">写给未来的自己或珍视的人</p>
        </router-link>
        <router-link to="/poetry" class="nav-card nav-card--poetry card-hover">
          <span class="nav-card__icon">🎨</span>
          <h3 class="nav-card__title">诗与艺术</h3>
          <p class="nav-card__desc">以文字和艺术触碰生命的本质</p>
        </router-link>
        <router-link to="/practices" class="nav-card nav-card--practices card-hover">
          <span class="nav-card__icon">🧘</span>
          <h3 class="nav-card__title">练习</h3>
          <p class="nav-card__desc">从死亡视角出发，回归当下的修行</p>
        </router-link>
        <router-link to="/stories" class="nav-card nav-card--stories card-hover">
          <span class="nav-card__icon">📖</span>
          <h3 class="nav-card__title">生命故事</h3>
          <p class="nav-card__desc">在别人的故事里看见自己</p>
        </router-link>
        <router-link to="/memorial" class="nav-card nav-card--memorial card-hover">
          <span class="nav-card__icon">🕯️</span>
          <h3 class="nav-card__title">哀悼空间</h3>
          <p class="nav-card__desc">为思念的人点亮一支蜡烛</p>
        </router-link>
        <router-link to="/advance-directives" class="nav-card nav-card--directives card-hover">
          <span class="nav-card__icon">📝</span>
          <h3 class="nav-card__title">我的意愿</h3>
          <p class="nav-card__desc">温和地整理内心的声音</p>
        </router-link>
        <router-link to="/recommendations" class="nav-card nav-card--recommendations card-hover">
          <span class="nav-card__icon">📚</span>
          <h3 class="nav-card__title">推荐</h3>
          <p class="nav-card__desc">关于生命与死亡的书单、影单与播客</p>
        </router-link>
        <router-link to="/about" class="nav-card nav-card--about card-hover">
          <span class="nav-card__icon">💛</span>
          <h3 class="nav-card__title">关于</h3>
          <p class="nav-card__desc">了解这个网站的初心和理念</p>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DailyPrompt from '@/components/interactive/DailyPrompt.vue'
import GratitudeMoments from '@/components/interactive/GratitudeMoments.vue'

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了 🌙'
  if (hour < 9) return '早安 ☀️'
  if (hour < 12) return '上午好 🌿'
  if (hour < 14) return '午安 🌤️'
  if (hour < 18) return '下午好 🍂'
  return '傍晚好 🌅'
})
</script>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  gap: var(--space-3xl);
  min-height: 60vh;
  padding: var(--space-2xl) 0;
}

.hero__content {
  flex: 1;
}

.hero__greeting {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
  margin-bottom: var(--space-sm);
}

.hero__title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xs);
}

.hero__subtitle {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-gold-light);
  margin-bottom: var(--space-lg);
}

.hero__desc {
  font-size: var(--text-lg);
  color: var(--color-text-light);
  line-height: 1.8;
  margin-bottom: var(--space-xl);
}

.hero__actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.warm-btn--primary,
.warm-btn--secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 0.75rem 1.75rem;
  font-size: var(--text-base);
  font-weight: 500;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  cursor: pointer;
}

.warm-btn--primary {
  background: var(--color-gold);
  color: #fff;
}
.warm-btn--primary:hover {
  background: var(--color-gold-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.warm-btn--secondary {
  background: var(--color-warm-white);
  color: var(--color-gold-dark);
  border: 1px solid var(--color-border);
}
.warm-btn--secondary:hover {
  background: var(--color-border-light);
  border-color: var(--color-gold-light);
}

.hero__visual {
  flex: 0 0 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__illustration {
  width: 200px;
  height: 240px;
}

/* 每日反思 */
.daily-section {
  margin: var(--space-2xl) 0;
}

/* 感恩时刻 */
.gratitude-section {
  margin: var(--space-2xl) 0;
}

/* 导航卡片网格 */
.nav-cards {
  margin-top: var(--space-3xl);
}

.section-title {
  font-size: var(--text-2xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-xl);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-xl);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-gold);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.nav-card--articles { border-left-color: var(--color-warm-taupe); }
.nav-card--calendar { border-left-color: var(--color-gold); }
.nav-card--bucketlist { border-left-color: var(--color-sage); }
.nav-card--letters { border-left-color: var(--color-dusty-rose); }
.nav-card--poetry { border-left-color: var(--color-dusty-rose-light); }
.nav-card--practices { border-left-color: var(--color-sage-light); }
.nav-card--stories { border-left-color: var(--color-warm-taupe); }
.nav-card--memorial { border-left-color: var(--color-dusty-rose); }
.nav-card--directives { border-left-color: var(--color-sage); }
.nav-card--recommendations { border-left-color: var(--color-warm-taupe-light); }
.nav-card--about { border-left-color: var(--color-gold-light); }

.nav-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.nav-card__title {
  font-size: var(--text-lg);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.nav-card__desc {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    min-height: auto;
    text-align: center;
    gap: var(--space-xl);
  }
  .hero__actions {
    justify-content: center;
  }
  .hero__visual {
    flex: 0 0 auto;
    order: -1;
  }
  .hero__illustration {
    width: 140px;
    height: 180px;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
