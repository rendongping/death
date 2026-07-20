import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  breaks: true,
  gfm: true
})

/**
 * 渲染 Markdown 并消毒，防止 XSS
 */
export function renderMarkdown(source) {
  if (!source) return ''
  const html = marked(source)
  return DOMPurify.sanitize(html)
}

export { marked }
