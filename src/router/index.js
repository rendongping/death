import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Memento Vivere — 记住要活着' }
  },
  {
    path: '/articles',
    name: 'articles',
    component: () => import('@/pages/ArticleListPage.vue'),
    meta: { title: '文章 — Memento Vivere' }
  },
  {
    path: '/articles/:slug',
    name: 'article-detail',
    component: () => import('@/pages/ArticleDetailPage.vue'),
    meta: { title: '文章 — Memento Vivere' }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/pages/CalendarPage.vue'),
    meta: { title: '生命日历 — Memento Vivere' }
  },
  {
    path: '/bucketlist',
    name: 'bucketlist',
    component: () => import('@/pages/BucketListPage.vue'),
    meta: { title: '遗愿清单 — Memento Vivere' }
  },
  {
    path: '/letters',
    name: 'letters',
    component: () => import('@/pages/LettersPage.vue'),
    meta: { title: '信件 — Memento Vivere' }
  },
  {
    path: '/poetry',
    name: 'poetry',
    component: () => import('@/pages/PoetryPage.vue'),
    meta: { title: '诗与艺术 — Memento Vivere' }
  },
  {
    path: '/poetry/archive',
    name: 'poetry-archive',
    component: () => import('@/pages/PoetryArchivePage.vue'),
    meta: { title: '悼亡诗词库 — Memento Vivere' }
  },
  {
    path: '/practices',
    name: 'practices',
    component: () => import('@/pages/PracticeListPage.vue'),
    meta: { title: '练习 — Memento Vivere' }
  },
  {
    path: '/practices/:slug',
    name: 'practice-detail',
    component: () => import('@/pages/PracticeDetailPage.vue'),
    meta: { title: '练习 — Memento Vivere' }
  },
  {
    path: '/stories',
    name: 'stories',
    component: () => import('@/pages/StoryListPage.vue'),
    meta: { title: '生命故事 — Memento Vivere' }
  },
  {
    path: '/stories/:slug',
    name: 'story-detail',
    component: () => import('@/pages/StoryDetailPage.vue'),
    meta: { title: '生命故事 — Memento Vivere' }
  },
  {
    path: '/memorial',
    name: 'memorial',
    component: () => import('@/pages/MemorialPage.vue'),
    meta: { title: '哀悼空间 — Memento Vivere' }
  },
  {
    path: '/advance-directives',
    name: 'advance-directives',
    component: () => import('@/pages/AdvanceDirectivesPage.vue'),
    meta: { title: '我的意愿 — Memento Vivere' }
  },
  {
    path: '/gratitude',
    name: 'gratitude',
    component: () => import('@/components/interactive/GratitudeMoments.vue'),
    meta: { title: '感恩时刻 — Memento Vivere' }
  },
  {
    path: '/recommendations',
    name: 'recommendations',
    component: () => import('@/pages/RecommendationsPage.vue'),
    meta: { title: '推荐 — Memento Vivere' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: '关于 — Memento Vivere' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404 — Memento Vivere' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Memento Vivere'
})

export default router
