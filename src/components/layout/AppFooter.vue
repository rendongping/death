<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <p class="footer-quote">"记住你终有一死，所以要真正地活着。"</p>
      <p class="footer-info">
        Memento Vivere &copy; {{ year }} — 用心铭记，以爱生活
      </p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  margin-top: var(--space-4xl);
  padding: var(--space-2xl) var(--space-lg);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.footer-inner {
  max-width: var(--max-width-wide);
  margin: 0 auto;
}

.footer-quote {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-style: italic;
  color: var(--color-gold-dark);
  margin-bottom: var(--space-md);
}

.footer-info {
  font-size: var(--text-sm);
  color: var(--color-text-lighter);
}
</style>
