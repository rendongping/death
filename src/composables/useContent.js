import { ref } from 'vue'
import { marked } from 'marked'

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

/**
 * 内容加载引擎
 * 使用 Vite 的 import.meta.glob 自动发现 content/ 目录下的 .md 文件
 */

const articleModules = import.meta.glob('../../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: false
})

const practiceModules = import.meta.glob('../../content/practices/*.md', {
  query: '?raw',
  import: 'default',
  eager: false
})

const poetryModules = import.meta.glob('../../content/poetry/*.md', {
  query: '?raw',
  import: 'default',
  eager: false
})

const storyModules = import.meta.glob('../../content/stories/*.md', {
  query: '?raw',
  import: 'default',
  eager: false
})

function getSlugFromPath(path, prefix) {
  const filename = path.replace(prefix, '').replace('.md', '')
  return filename
}

/**
 * 轻量 frontmatter 解析器（浏览器兼容，无需 Buffer）
 */
function parseFrontmatter(raw) {
  const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = raw.match(fmRegex)

  if (!match) {
    return { metadata: {}, content: raw }
  }

  const yamlBlock = match[1]
  const content = raw.slice(match[0].length)

  const metadata = {}
  const lines = yamlBlock.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    let value = trimmed.slice(colonIndex + 1).trim()

    // 去掉首尾引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // 数组解析
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim()
      if (!inner) {
        metadata[key] = []
        continue
      }
      metadata[key] = inner.split(',').map(item => {
        let v = item.trim()
        if ((v.startsWith('"') && v.endsWith('"')) ||
            (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        return v
      })
      continue
    }

    metadata[key] = value
  }

  return { metadata, content }
}

export function useContent() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * 从 glob modules 加载单个文件
   */
  async function loadFromModules(modules, prefix, slug) {
    loading.value = true
    error.value = null

    try {
      const match = Object.entries(modules).find(([path]) => {
        return getSlugFromPath(path, prefix) === slug
      })

      if (!match) {
        throw new Error(`Content not found: ${slug}`)
      }

      const [path, loader] = match
      const raw = await loader()
      const { metadata, content } = parseFrontmatter(raw)
      const html = marked(content)

      return {
        slug: getSlugFromPath(path, prefix),
        metadata,
        html,
        rawContent: content
      }
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载所有内容列表（仅元数据，不含正文）
   */
  async function loadAllFromModules(modules, prefix) {
    loading.value = true
    error.value = null

    try {
      const entries = await Promise.all(
        Object.entries(modules).map(async ([path, loader]) => {
          try {
            const raw = await loader()
            const { metadata, content } = parseFrontmatter(raw)
            const excerpt = content
              .replace(/^#.*$/gm, '')
              .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
              .trim()
              .slice(0, 200)

            return {
              slug: getSlugFromPath(path, prefix),
              ...metadata,
              excerpt: metadata.excerpt || excerpt,
              image: metadata.image || null
            }
          } catch {
            return null
          }
        })
      )

      return entries
        .filter(Boolean)
        .sort((a, b) => {
          if (a.date && b.date) return b.date.localeCompare(a.date)
          if (a.date) return -1
          if (b.date) return 1
          return 0
        })
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // 公开 API
  async function loadArticle(slug) {
    return loadFromModules(articleModules, '../../content/articles/', slug)
  }

  async function loadAllArticles() {
    return loadAllFromModules(articleModules, '../../content/articles/')
  }

  async function loadPractice(slug) {
    return loadFromModules(practiceModules, '../../content/practices/', slug)
  }

  async function loadAllPractices() {
    return loadAllFromModules(practiceModules, '../../content/practices/')
  }

  async function loadPoetryItem(slug) {
    return loadFromModules(poetryModules, '../../content/poetry/', slug)
  }

  async function loadAllPoetry() {
    return loadAllFromModules(poetryModules, '../../content/poetry/')
  }

  async function loadStory(slug) {
    return loadFromModules(storyModules, '../../content/stories/', slug)
  }

  async function loadAllStories() {
    return loadAllFromModules(storyModules, '../../content/stories/')
  }

  return {
    loading,
    error,
    loadArticle,
    loadAllArticles,
    loadPractice,
    loadAllPractices,
    loadPoetryItem,
    loadAllPoetry,
    loadStory,
    loadAllStories
  }
}
