<template>
  <div class="about-page">
    <div class="about-content">
      <h1 class="page-title">关于 Memento Vivere</h1>

      <section class="about-section">
        <h2>为什么是"死亡"？</h2>
        <p>
          在我们的文化里，死亡是一个常常被回避的话题。我们不愿谈论它，不愿面对它，
          仿佛只要不说，它就不会来。
        </p>
        <p>
          但事实是，死亡是我们每个人生命中唯一确定的事。从出生的那一刻起，
          我们就已经在走向终点。这不是悲观，而是事实。
        </p>
        <p>
          而正视这个事实，反而能让我们更清醒地活着。
        </p>
      </section>

      <section class="about-section">
        <h2>Memento Vivere — 记住要活着</h2>
        <p>
          古罗马有一个传统：将军凯旋时，身后会有一个奴隶不断地在他耳边低语：
          <em>"Memento Mori"</em>——记住你终有一死。
        </p>
        <p>
          这不是诅咒，而是一种提醒：不要被权力和荣耀冲昏头脑，
          不要忘记你终究是一个凡人。
        </p>
        <p>
          而 <strong>Memento Vivere</strong> 是这个提醒的温暖回应：
          正因为我们终有一死，所以要真正地活着。
        </p>
      </section>

      <section class="about-section">
        <h2>这个网站的初心</h2>
        <p>
          我们希望创建一个安全、温暖的空间，让人们可以：
        </p>
        <ul>
          <li>了解关于死亡的各种知识和思考</li>
          <li>通过互动工具感受生命的珍贵</li>
          <li>写下自己的遗愿清单，然后去实现</li>
          <li>给重要的人写一封信</li>
          <li>在诗歌和艺术中找到共鸣</li>
        </ul>
        <p>
          这不是一个悲伤的地方。恰恰相反，这是一个提醒我们好好生活的地方。
        </p>
      </section>

      <section class="about-section about-resources">
        <h2>危机资源</h2>
        <p class="resources-note">
          如果你正在经历困难，请知道你不是一个人。
        </p>
        <div class="resource-card">
          <strong>中国心理危机干预热线</strong>
          <span class="resource-phone">400-161-9995</span>
        </div>
        <div class="resource-card">
          <strong>北京心理危机研究与干预中心</strong>
          <span class="resource-phone">010-82951332</span>
        </div>
        <div class="resource-card">
          <strong>生命热线</strong>
          <span class="resource-phone">400-821-1215</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  max-width: var(--max-width-content);
  margin: 0 auto;
}

.page-title {
  font-size: var(--text-4xl);
  color: var(--color-gold-dark);
  margin-bottom: var(--space-2xl);
}

.about-section {
  margin-bottom: var(--space-3xl);
}

.about-section h2 {
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.about-section p {
  font-size: var(--text-lg);
  line-height: 1.75;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.about-section ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
  font-size: var(--text-lg);
  line-height: 1.8;
}

.about-section ul li {
  margin-bottom: var(--space-sm);
}

.about-section em {
  font-family: var(--font-heading);
  color: var(--color-gold-dark);
}

.about-section strong {
  color: var(--color-gold-dark);
}

.resources-note {
  color: var(--color-dusty-rose) !important;
  font-weight: 500;
}

.resource-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-warm-white);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  border-left: 3px solid var(--color-dusty-rose);
}

.resource-phone {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-gold-dark);
}
</style>
