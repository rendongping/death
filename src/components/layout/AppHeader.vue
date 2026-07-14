<template>
  <header class="app-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">•</span>
        <span class="logo-text">Memento Vivere</span>
      </router-link>
      <nav class="nav-links">
        <router-link to="/articles" class="nav-link">文章</router-link>
        <router-link to="/stories" class="nav-link">故事</router-link>
        <router-link to="/poetry" class="nav-link">诗</router-link>
        <router-link to="/practices" class="nav-link">练习</router-link>
        <router-link to="/calendar" class="nav-link">日历</router-link>
        <router-link to="/bucketlist" class="nav-link">遗愿</router-link>
        <router-link to="/letters" class="nav-link">信件</router-link>
        <div class="nav-dropdown">
          <button class="nav-link nav-dropdown-toggle" @click="moreOpen = !moreOpen">
            更多
          </button>
          <Transition name="fade">
            <div v-if="moreOpen" class="nav-dropdown-menu" @mouseleave="moreOpen = false">
              <router-link to="/poetry/archive" class="dropdown-link" @click="moreOpen = false">悼亡诗词库</router-link>
              <router-link to="/memorial" class="dropdown-link" @click="moreOpen = false">哀悼空间</router-link>
              <router-link to="/advance-directives" class="dropdown-link" @click="moreOpen = false">我的意愿</router-link>
              <router-link to="/gratitude" class="dropdown-link" @click="moreOpen = false">感恩时刻</router-link>
            </div>
          </Transition>
        </div>
        <router-link to="/recommendations" class="nav-link">推荐</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
      <button class="mobile-menu-btn" @click="menuOpen = !menuOpen" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </div>
    <Transition name="fade">
      <nav v-if="menuOpen" class="mobile-nav" @click="menuOpen = false">
        <router-link to="/articles" class="mobile-nav-link">文章</router-link>
        <router-link to="/stories" class="mobile-nav-link">故事</router-link>
        <router-link to="/poetry" class="mobile-nav-link">诗</router-link>
        <router-link to="/practices" class="mobile-nav-link">练习</router-link>
        <router-link to="/calendar" class="mobile-nav-link">生命日历</router-link>
        <router-link to="/bucketlist" class="mobile-nav-link">遗愿清单</router-link>
        <router-link to="/letters" class="mobile-nav-link">信件</router-link>
        <router-link to="/poetry/archive" class="mobile-nav-link">悼亡诗词库</router-link>
        <router-link to="/memorial" class="mobile-nav-link">哀悼空间</router-link>
        <router-link to="/advance-directives" class="mobile-nav-link">我的意愿</router-link>
        <router-link to="/gratitude" class="mobile-nav-link">感恩时刻</router-link>
        <router-link to="/recommendations" class="mobile-nav-link">推荐</router-link>
        <router-link to="/about" class="mobile-nav-link">关于</router-link>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const moreOpen = ref(false)
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
  min-width: 140px;
  z-index: 101;
}

.dropdown-link {
  display: block;
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
  display: block;
  padding: var(--space-md);
  font-size: var(--text-lg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.mobile-nav-link:hover {
  background: rgba(194, 149, 107, 0.08);
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
