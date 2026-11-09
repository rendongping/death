<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <span class="not-found-emoji">🕯️</span>
      <h1>页面不存在</h1>
      <p>这个页面可能已经消逝，但还有更多值得探索的内容。</p>
      <p class="not-found-turn">
        就像人一样：一个去处消失了，能做的只有回到还在的地方。
      </p>
      <div class="not-found-actions">
        <router-link to="/" class="warm-btn warm-btn--primary">回到今天</router-link>
        <router-link to="/letters" class="warm-btn warm-btn--ghost">给重要的人写句话</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.not-found-content {
  text-align: center;
  max-width: 400px;
}

.not-found-emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-lg);
}

.not-found-content h1 {
  font-size: var(--text-3xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.not-found-content p {
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
  line-height: 1.7;
}

.not-found-turn {
  font-family: var(--font-heading);
  color: var(--color-gold-dark);
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.warm-btn--ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-size: var(--text-base);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-gold);
  color: var(--color-gold-dark);
  text-decoration: none;
  transition: all var(--transition-base);
}

.warm-btn--ghost:hover {
  background: var(--color-gold);
  color: #fff;
}

.warm-btn--primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-size: var(--text-base);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: var(--color-gold);
  color: #fff;
  transition: all var(--transition-base);
}

.warm-btn--primary:hover {
  background: var(--color-gold-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
</style>
