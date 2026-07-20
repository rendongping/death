# Memento Vivere

> 通过认识死亡，更好地活着。

一个以死亡教育、生命反思与善终准备为主题的中文静态站点。

## 技术栈

- Vue 3 + Vite 5
- Vue Router 4
- Pinia 2
- marked + DOMPurify（Markdown 渲染与消毒）

## 快速开始

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## 数据管道

项目包含两条内容生产线：

### 1. Markdown 内容（`content/`）

`articles`、`poetry`、`practices`、`stories` 四个目录下的 `.md` 文件通过 `import.meta.glob` 自动发现，列表页与详情页按需加载。

Frontmatter 目前支持简单的 flat key/value 与行内数组，例如：

```yaml
---
title: 文章标题
date: 2026-07-14
category: 死亡认知
tags: [死亡, 生命]
image: https://...
---
```

### 2. 生成 JSON 数据（`src/data/`）

#### 诗词档案

```bash
npm run build:poetry
```

从 `scripts/.cache/` 中的中文诗歌语料生成 `src/data/poetry-archive.json` 与 `src/data/poetry-famous.json`。`scripts/.cache/` 不在版本库中，需要自行准备语料。

#### 一万种死法

```bash
npm run build:ways
```

运行 `scripts/generate-ways-to-die.py` 重新生成 `src/data/ways-to-die.json`。该模块为死亡教育与生命科普，不提供任何自伤信息。

## 目录结构

```
src/
├── components/        # 布局、UI、内容与交互组件
├── composables/       # 可复用组合式函数
├── pages/             # 路由页面
├── router/            # 路由配置
├── stores/            # Pinia 状态（localStorage 持久化）
├── styles/            # 全局样式与设计 token
└── utils/             # 工具函数（markdown、storage）
content/               # Markdown 内容
scripts/               # 数据生成脚本
```

## 安全说明

- 所有 Markdown 渲染前先经 DOMPurify 消毒
- localStorage 读写已做容错处理
- 网站包含心理援助热线信息，不鼓励任何自伤行为

## 部署

默认输出 `dist/`。若部署到子路径，请在 `vite.config.js` 中设置 `base`，并确保服务器支持 SPA fallback。