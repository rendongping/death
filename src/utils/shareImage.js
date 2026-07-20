/**
 * 生成诗句分享卡片
 */
export function generatePoemCard({ title, author, text, site = 'Memento Vivere' }) {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 1200
  const ctx = canvas.getContext('2d')

  // 背景
  ctx.fillStyle = '#FFF8F0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 边框
  ctx.strokeStyle = '#E8DDD0'
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

  // 顶部装饰
  ctx.fillStyle = '#C2956B'
  ctx.font = '24px "Cormorant Garamond", serif'
  ctx.textAlign = 'center'
  ctx.fillText('POETRY', canvas.width / 2, 100)

  // 标题
  ctx.fillStyle = '#3C3228'
  ctx.font = 'bold 56px "Noto Serif SC", serif'
  ctx.fillText(title, canvas.width / 2, 180)

  // 作者
  ctx.fillStyle = '#8B7D6B'
  ctx.font = '32px "Noto Serif SC", serif'
  ctx.fillText(author, canvas.width / 2, 240)

  // 分隔线
  ctx.strokeStyle = '#C2956B'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(canvas.width / 2 - 60, 280)
  ctx.lineTo(canvas.width / 2 + 60, 280)
  ctx.stroke()

  // 诗句（自动换行）
  ctx.fillStyle = '#3C3228'
  ctx.font = '40px "Noto Serif SC", serif'
  const maxWidth = canvas.width - 200
  const lineHeight = 64
  let y = 380
  const lines = wrapText(ctx, text, maxWidth)
  lines.forEach(line => {
    ctx.fillText(line, canvas.width / 2, y)
    y += lineHeight
  })

  // 底部
  ctx.fillStyle = '#B5A99A'
  ctx.font = '24px "Noto Serif SC", serif'
  ctx.fillText(site, canvas.width / 2, canvas.height - 100)

  return canvas.toDataURL('image/png')
}

function wrapText(ctx, text, maxWidth) {
  const lines = []
  let current = ''
  for (const char of text) {
    const test = current + char
    const width = ctx.measureText(test).width
    if (width > maxWidth && current) {
      lines.push(current)
      current = char
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

export function downloadDataUrl(dataUrl, filename = 'poem.png') {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
