import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Memento Vivere — 记住要活着', description: '通过认识死亡，更好地活着。探索文章、诗歌、生命练习与善终准备。' }
  },
  {
    path: '/today',
    name: 'today',
    component: () => import('@/pages/TodayPage.vue'),
    meta: { title: '今日一页 — Memento Vivere', description: '凝视六十秒、读一篇、写一行、定一个日子。每天四步，不到十分钟。' }
  },
  {
    path: '/acts',
    name: 'acts',
    component: () => import('@/pages/ActsPage.vue'),
    meta: { title: '四幕剧 — Memento Vivere', description: '觉知、凝视、整理、告别——一条从死亡回到生活的路。' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/pages/ArticleListPage.vue'),
    meta: { title: '文章 — Memento Vivere', description: '关于死亡认知、哲学思考与生命意义的文章。' }
  },
  {
    path: '/articles/:slug',
    name: 'article-detail',
    component: () => import('@/pages/ArticleDetailPage.vue'),
    meta: { title: '文章 — Memento Vivere', description: '关于死亡认知、哲学思考与生命意义的文章。' }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/pages/CalendarPage.vue'),
    meta: { title: '生命日历 — Memento Vivere', description: '记录并反思生命中的重要时刻。' }
  },
  {
    path: '/bucketlist',
    name: 'bucketlist',
    component: () => import('@/pages/BucketListPage.vue'),
    meta: { title: '遗愿清单 — Memento Vivere', description: '写下你想在一生中完成的事。' }
  },
  {
    path: '/letters',
    name: 'letters',
    component: () => import('@/pages/LettersPage.vue'),
    meta: { title: '信件 — Memento Vivere', description: '写给未来或他人的定时信件。' }
  },
  {
    path: '/commitments',
    name: 'commitments',
    component: () => import('@/pages/CommitmentsPage.vue'),
    meta: { title: '我的约定 — Memento Vivere', description: '每次读完讲死亡的内容，给自己定一个日子。到期它会回来找你。' }
  },
  {
    path: '/poetry',
    name: 'poetry',
    component: () => import('@/pages/PoetryPage.vue'),
    meta: { title: '诗与艺术 — Memento Vivere', description: '以诗歌与艺术凝视死亡与生命。' }
  },
  {
    path: '/poetry/archive',
    name: 'poetry-archive',
    component: () => import('@/pages/PoetryArchivePage.vue'),
    meta: { title: '悼亡诗词库 — Memento Vivere', description: '收录 2476 首与生死、悼亡相关的唐宋诗词。' }
  },
  {
    path: '/ways-to-die',
    name: 'ways-to-die',
    component: () => import('@/pages/WaysToDiePage.vue'),
    meta: { title: '一万种死法 — Memento Vivere', description: '死亡教育科普：了解死亡的方式，是为了更好地活。' }
  },
  {
    path: '/practices',
    name: 'practices',
    component: () => import('@/pages/PracticeListPage.vue'),
    meta: { title: '练习 — Memento Vivere', description: '面向死亡与告别的生命练习。' }
  },
  {
    path: '/practices/:slug',
    name: 'practice-detail',
    component: () => import('@/pages/PracticeDetailPage.vue'),
    meta: { title: '练习 — Memento Vivere', description: '面向死亡与告别的生命练习。' }
  },
  {
    path: '/stories',
    name: 'stories',
    component: () => import('@/pages/StoryListPage.vue'),
    meta: { title: '生命故事 — Memento Vivere', description: '真实或虚构的生命与告别故事。' }
  },
  {
    path: '/stories/:slug',
    name: 'story-detail',
    component: () => import('@/pages/StoryDetailPage.vue'),
    meta: { title: '生命故事 — Memento Vivere', description: '真实或虚构的生命与告别故事。' }
  },
  {
    path: '/memorial',
    name: 'memorial',
    component: () => import('@/pages/MemorialPage.vue'),
    meta: { title: '哀悼空间 — Memento Vivere', description: '一个安静哀悼与纪念的空间。' }
  },
  {
    path: '/advance-directives',
    name: 'advance-directives',
    component: () => import('@/pages/AdvanceDirectivesPage.vue'),
    meta: { title: '我的意愿 — Memento Vivere', description: '生前预嘱与医疗意愿记录。' }
  },
  {
    path: '/gratitude',
    name: 'gratitude',
    component: () => import('@/pages/GratitudePage.vue'),
    meta: { title: '感恩时刻 — Memento Vivere', description: '记录生命中的感恩瞬间。' }
  },
  {
    path: '/recommendations',
    name: 'recommendations',
    component: () => import('@/pages/RecommendationsPage.vue'),
    meta: { title: '推荐 — Memento Vivere', description: '关于死亡与生命的书籍、电影与资源推荐。' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: '关于 — Memento Vivere', description: '了解 Memento Vivere 的理念与内容。' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404 — Memento Vivere', description: '页面不存在。' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Memento Vivere'
  if (to.meta.description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', to.meta.description)
  }
})

export default router
