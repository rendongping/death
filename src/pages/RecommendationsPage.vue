<template>
  <div class="recommendations-page">
    <div class="page-header">
      <div class="page-header__text">
        <h1 class="page-title">推荐书单与影单</h1>
        <p class="page-subtitle">关于生命、死亡、告别与爱的作品，陪你走得更远</p>
      </div>
      <Illustration name="recommendations" :width="160" :height="128" />
    </div>

    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="category-tab"
        :class="{ 'category-tab--active': activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="items-grid">
      <WarmCard
        v-for="item in filteredItems"
        :key="item.id"
        :accent="item.accent"
        class="rec-card"
      >
        <div class="rec-meta">
          <span class="rec-type">{{ getCategoryName(item.category) }}</span>
          <span v-if="item.year" class="rec-year">{{ item.year }}</span>
        </div>
        <h3 class="rec-title">{{ item.title }}</h3>
        <p class="rec-creator">{{ item.creator }}</p>
        <p class="rec-desc">{{ item.description }}</p>
        <blockquote class="rec-quote">{{ item.quote }}</blockquote>
      </WarmCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WarmCard from '@/components/ui/WarmCard.vue'
import Illustration from '@/components/ui/Illustration.vue'

const categories = [
  { id: 'book', name: '书籍' },
  { id: 'film', name: '电影' },
  { id: 'documentary', name: '纪录片' },
  { id: 'podcast', name: '播客' }
]

const activeCategory = ref('book')

const items = [
  {
    id: 1,
    category: 'book',
    title: '《拒斥死亡》',
    creator: 'Ernest Becker',
    year: '1973',
    description: '普利策奖获奖作品，探讨人类如何用文化、成就和信仰来应对对死亡的深层恐惧。它提醒我们：很多看似伟大的追求，背后可能都是对有限性的回应。',
    quote: '人类是一种被自己的渺小所困扰的生物。',
    accent: 'gold'
  },
  {
    id: 2,
    category: 'book',
    title: '《最好的告别》',
    creator: 'Atul Gawande',
    year: '2014',
    description: '一位外科医生对衰老与死亡的诚实书写。他追问：当医学无法治愈时，什么才是真正重要的？',
    quote: '医学的终极目的，不是让人活得更长，而是让人活得更像自己。',
    accent: 'sage'
  },
  {
    id: 3,
    category: 'book',
    title: '《恩宠与勇气》',
    creator: 'Ken Wilber',
    year: '1991',
    description: '哲学家肯·威尔伯记录妻子与癌症抗争的历程，融合灵性、心理与哲学的视角，探讨痛苦、爱与超越。',
    quote: '死亡不是生命的对立面，而是生命的一部分。',
    accent: 'rose'
  },
  {
    id: 4,
    category: 'book',
    title: '《西藏生死书》',
    creator: '索甲仁波切',
    year: '1992',
    description: '从藏传佛教视角看待死亡与临终，强调死亡是一个可以被准备、被理解、被转化的过程。',
    quote: '活着的时候为死亡做准备，是智慧的开始。',
    accent: 'taupe'
  },
  {
    id: 5,
    category: 'book',
    title: '《牧羊少年奇幻之旅》',
    creator: 'Paulo Coelho',
    year: '1988',
    description: '一个关于追寻梦想与倾听内心的寓言。它告诉我们：生命中最重要的事，往往不是目的地，而是旅途中的勇气。',
    quote: '当你真心渴望某样东西时，整个宇宙都会联合起来帮助你完成。',
    accent: 'gold'
  },
  {
    id: 6,
    category: 'film',
    title: '《寻梦环游记》',
    creator: '李·昂克里奇',
    year: '2017',
    description: '一部关于墨西哥亡灵节的动画电影。它用温暖的画面告诉我们：真正的死亡，是被世界遗忘。',
    quote: '死亡不是生命的终点，遗忘才是。',
    accent: 'rose'
  },
  {
    id: 7,
    category: 'film',
    title: '《入殓师》',
    creator: '泷田洋二郎',
    year: '2008',
    description: '一位大提琴手成为入殓师后，逐渐理解死亡与告别的尊严。影片沉静、克制，却无比动人。',
    quote: '死亡是一扇门，它不是结束，而是通往另一段旅程的开始。',
    accent: 'sage'
  },
  {
    id: 8,
    category: 'film',
    title: '《海边的曼彻斯特》',
    creator: 'Kenneth Lonergan',
    year: '2016',
    description: '一个关于丧失、内疚与无法和解的故事。它不强迫主角"走出来"，而是温柔地陪伴悲伤本身。',
    quote: '有些伤痛不会消失，我们只能学会与它共存。',
    accent: 'taupe'
  },
  {
    id: 9,
    category: 'film',
    title: '《心灵奇旅》',
    creator: 'Pete Docter',
    year: '2020',
    description: '一个关于生命火花与人生意义的故事。它提醒我们：意义不一定来自伟大的成就，而可能来自一片落叶、一块披萨、一次散步。',
    quote: '你的火花不是你的目的，你准备好去生活的那一刻，就是你的火花。',
    accent: 'gold'
  },
  {
    id: 10,
    category: 'documentary',
    title: '《人生果实》',
    creator: '伏原健之',
    year: '2017',
    description: '记录日本建筑师津端修一与妻子英子的田园生活。他们缓慢、用心、与自然共处的日常，是对"如何老去"最美的回答。',
    quote: '缓慢而坚定地，做自己能做的事。',
    accent: 'sage'
  },
  {
    id: 11,
    category: 'documentary',
    title: '《我死前的最后一个夏天》',
    creator: 'BBC',
    year: '2016',
    description: '五位被诊断为绝症的人，共同度过四个周末，谈论死亡、家庭、爱与遗憾。真实、 raw，却充满力量。',
    quote: '谈论死亡，让我们更懂得如何活着。',
    accent: 'rose'
  },
  {
    id: 12,
    category: 'podcast',
    title: '《死亡咖啡馆》',
    creator: 'Death Café 社群',
    year: '2011 起',
    description: '一个全球性的非正式聚会，人们聚在一起喝茶、吃蛋糕、谈论死亡。它的宗旨是：提高对死亡的意识，帮助人们更充分地生活。',
    quote: '谈论死亡，是为了让生活更有重量。',
    accent: 'gold'
  },
  {
    id: 13,
    category: 'podcast',
    title: '《生命不可承受之轻？》',
    creator: '看理想',
    year: '2020 起',
    description: '从哲学、文学、心理学角度探讨生命的意义、死亡焦虑与存在主义，适合喜欢深度思考的人。',
    quote: '哲学不是为了找到答案，而是为了让我们活得更清醒。',
    accent: 'taupe'
  }
]

const filteredItems = computed(() =>
  items.filter(i => i.category === activeCategory.value)
)

function getCategoryName(id) {
  const cat = categories.find(c => c.id === id)
  return cat ? cat.name : id
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.page-header__text {
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
}

.category-tabs {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.category-tab {
  padding: 0.5rem 1.25rem;
  background: var(--color-warm-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.category-tab:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-dark);
}

.category-tab--active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #fff;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.rec-card {
  display: flex;
  flex-direction: column;
}

.rec-meta {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-size: var(--text-xs);
}

.rec-type {
  padding: 0.15em 0.6em;
  background: rgba(194, 149, 107, 0.12);
  color: var(--color-gold-dark);
  border-radius: var(--radius-full);
}

.rec-year {
  color: var(--color-text-lighter);
}

.rec-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.rec-creator {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
}

.rec-desc {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.rec-quote {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-style: italic;
  color: var(--color-gold-dark);
  line-height: 1.6;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}
</style>
