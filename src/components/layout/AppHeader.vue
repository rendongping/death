<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">•</span>
        <span class="logo-text">Memento Vivere</span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/today" class="nav-link nav-link--today">今日</router-link>
        <router-link to="/acts" class="nav-link">四幕</router-link>
        <router-link to="/articles" class="nav-link">文章</router-link>
        <router-link to="/stories" class="nav-link">故事</router-link>
        <router-link to="/poetry" class="nav-link">诗</router-link>
        <router-link to="/practices" class="nav-link">练习</router-link>
        <div class="nav-dropdown">
          <button class="nav-link nav-dropdown-toggle" @click="moreOpen = !moreOpen">
            我的<span v-if="dueCount" class="nav-badge">{{ dueCount }}</span>
          </button>
          <Transition name="fade">
            <div v-if="moreOpen" class="nav-dropdown-menu" @mouseleave="moreOpen = false">
              <p class="dropdown-group">我在这里留下的</p>
              <router-link
                v-for="l in mineLinks"
                :key="l.to"
                :to="l.to"
                class="dropdown-link"
                @click="moreOpen = false"
              >
                {{ l.name }}
                <span v-if="l.to === '/commitments' && dueCount" class="dropdown-badge">{{ dueCount }}</span>
              </router-link>
              <p class="dropdown-group">继续看</p>
              <router-link
                v-for="l in moreLinks"
                :key="l.to"
                :to="l.to"
                class="dropdown-link"
                @click="moreOpen = false"
              >{{ l.name }}</router-link>
            </div>
          </Transition>
        </div>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
      <button class="mobile-menu-btn" @click="menuOpen = !menuOpen" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </div>
    <Transition name="fade">
      <nav v-if="menuOpen" class="mobile-nav" @click="menuOpen = false">
        <router-link to="/today" class="mobile-nav-link">今日一页</router-link>
        <router-link to="/acts" class="mobile-nav-link">四幕剧</router-link>
        <router-link to="/articles" class="mobile-nav-link">文章</router-link>
        <router-link to="/stories" class="mobile-nav-link">故事</router-link>
        <router-link to="/poetry" class="mobile-nav-link">诗</router-link>
        <router-link to="/practices" class="mobile-nav-link">练习</router-link>
        <p class="mobile-nav-group">我在这里留下的</p>
        <router-link
          v-for="l in mineLinks"
          :key="l.to"
          :to="l.to"
          class="mobile-nav-link"
        >
          {{ l.name }}
          <span v-if="l.to === '/commitments' && dueCount" class="dropdown-badge">{{ dueCount }}</span>
        </router-link>
        <p class="mobile-nav-group">继续看</p>
        <router-link
          v-for="l in moreLinks"
          :key="l.to"
          :to="l.to"
          class="mobile-nav-link"
        >{{ l.name }}</router-link>
        <router-link to="/about" class="mobile-nav-link">关于</router-link>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCommitmentsStore } from '@/stores/commitments'

const menuOpen = ref(false)
const moreOpen = ref(false)

const commitments = useCommitmentsStore()
const dueCount = computed(() => commitments.due.length)

const mineLinks = [
  { to: '/commitments', name: '我的约定' },
  { to: '/calendar', name: '生命日历' },
  { to: '/bucketlist', name: '遗愿清单' },
  { to: '/letters', name: '信件' },
  { to: '/advance-directives', name: '我的意愿' },
  { to: '/gratitude', name: '感恩时刻' },
  { to: '/memorial', name: '哀悼空间' }
]

const moreLinks = [
  { to: '/ways-to-die', name: '一万种死法' },
  { to: '/poetry/archive', name: '悼亡诗词库' },
  { to: '/recommendations', name: '推荐' }
]
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(255, 248, 240, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  z-index: 100;
}

.header-inner {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gold-dark);
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 1.5em;
  line-height: 1;
  color: var(--color-gold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-link {
  font-size: var(--text-sm);
  color: var(--color-text-light);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-gold-dark);
  background: rgba(194, 149, 107, 0.08);
}

/* 「今日」是主入口，视觉上要压过其他导航项 */
.nav-link--today {
  color: var(--color-gold-dark);
  border: 1px solid rgba(194, 149, 107, 0.45);
}

/* 到期数量角标：全站唯一需要"被看见"的提醒 */
.nav-badge,
.dropdown-badge {
  display: inline-block;
  min-width: 1.15em;
  margin-left: 4px;
  padding: 0 4px;
  background: var(--color-gold);
  color: #fff;
  font-size: var(--text-xs);
  line-height: 1.4;
  border-radius: var(--radius-full);
  text-align: center;
}

/* 下拉菜单 */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(255, 248, 240, 0.98);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-sm);
  min-width: 160px;
  z-index: 101;
}

.dropdown-group {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  color: var(--color-text-light);
}

.dropdown-group:not(:first-child) {
  margin-top: var(--space-xs);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

.dropdown-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
  color: var(--color-text-light);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast), color var(--transition-fast);
  white-space: nowrap;
}

.dropdown-link:hover,
.dropdown-link.router-link-active {
  background: rgba(194, 149, 107, 0.08);
  color: var(--color-gold-dark);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: var(--space-sm);
}

.mobile-menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.mobile-nav {
  display: none;
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  background: rgba(255, 248, 240, 0.98);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md);
  max-height: calc(100vh - var(--header-height));
  overflow-y: auto;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  font-size: var(--text-lg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.mobile-nav-link:hover {
  background: rgba(194, 149, 107, 0.08);
}

.mobile-nav-group {
  padding: var(--space-sm) var(--space-md) 0;
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .mobile-nav {
    display: block;
  }
}
</style>
