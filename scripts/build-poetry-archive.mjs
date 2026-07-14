/**
 * 悼亡诗词库生成脚本
 * 数据源：chinese-poetry/chinese-poetry（MIT）全唐诗 + 全宋词
 * 用法：node scripts/build-poetry-archive.mjs
 * 缓存目录：scripts/.cache/（poet.tang.*.json / ci.song.*.json）
 * 产物：src/data/poetry-archive.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { t2s } = require('chinese-s2t')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CACHE = path.join(__dirname, '.cache')
const OUT = path.join(ROOT, 'src/data/poetry-archive.json')
const MD_DIR = path.join(ROOT, 'content/poetry')

/* ── 名家白名单（按影响力排序，权重 = 倒序索引）── */
const FAMOUS = [
  '李白', '杜甫', '苏轼', '白居易', '辛弃疾', '李清照', '李煜', '王维', '李商隐',
  '陆游', '刘禹锡', '杜牧', '元稹', '李贺', '柳永', '欧阳修', '王安石', '黄庭坚',
  '孟浩然', '王昌龄', '秦观', '周邦彦', '姜夔', '贺铸', '蒋捷', '张炎', '吴文英',
  '范仲淹', '文天祥', '岳飞', '韩愈', '柳宗元', '温庭筠', '韦应物', '晏殊', '晏几道',
  '朱敦儒', '张若虚', '刘希夷', '陈子昂', '骆宾王', '王勃', '孟郊', '贾岛', '许浑',
  '罗隐', '韦庄', '冯延巳', '司空图', '张九龄', '沈佺期', '宋之问', '贺知章', '张祜',
  '刘长卿', '崔颢', '陈与义', '范成大', '杨万里', '刘克庄', '史达祖', '王沂孙', '周密',
  '朱淑真', '陈亮', '张孝祥', '刘辰翁', '汪元量', '谢枋得', '林景熙', '高适', '岑参',
  '钱起', '卢纶', '戴叔伦', '顾况', '王翰', '李颀', '常建', '王建', '张籍', '姚合',
  '李绅', '张说', '皇甫冉', '韩翃', '马戴', '赵嘏', '李群玉', '聂夷中', '齐己', '贯休',
  '皎然', '寒山', '鱼玄机', '薛涛', '上官婉儿', '花蕊夫人', '吕岩', '皮日休', '陆龟蒙',
  '杜荀鹤', '杨炯', '卢照邻', '李璟', '牛希济', '欧阳炯', '孙光宪', '王禹偁', '寇准',
  '林逋', '梅尧臣', '苏舜钦', '司马光', '朱熹', '陈师道', '晁补之', '张耒', '李之仪',
  '毛滂', '叶梦得', '张元干', '李纲', '胡铨', '刘过', '戴复古', '严蕊', '魏玩',
  '黄公绍', '刘一止', '葛胜仲', '汪藻', '蔡伸', '赵鼎', '韩元吉', '袁去华', '谢逸'
]

/* ── 过滤规则 ── */
// 标题关键词（高精度，简体匹配）
const TITLE_RE = /(挽|悼|哭|薤|蒿里|诔|祭|吊|殇|丧|殡|殁|薨|墓|坟|冢|圹|殂|奠|亡)/
const TITLE_EXCLUDE = /(祭神|祭灶|祭獭|送祭|逃亡|兴亡|乐章)|^(郊庙歌辞|舞曲歌辞|燕射歌辞|鼓吹曲辞|横吹曲辞|相和歌辞|清商曲辞|杂曲歌辞|杂歌谣辞)/
// 正文强关键词（死亡/丧挽/生死主题）
const CONTENT_RE =
  /(黄泉|泉下|泉台|九泉|夜台|蒿里|薤露|白骨|枯骨|髑髅|荒坟|孤坟|青冢|荒冢|魂魄|阴司|地府|长眠|埋骨|葬|殓|棺|柩|尸|死生|生死|死去|人生几何|人生如梦|人生如寄|生年不满百|自古谁无死|朝露|蜉蝣|青丝暮成雪|岁岁年年人不同|物是人非|朱颜辞镜|伤往事|尽成灰|成土|化蝶|长辞|永诀|不归|无归|魂归|归泉|长逝|溘然|奄忽)/
// 怀古类标题需正文同时命中强关键词
const NOSTALGIA_TITLE_RE = /(怀古|咏史|经|过|登|望|游).*(故|旧|废|古|陵|墓|台|城|宫|阙|祠|庙|碑|迹)/

function classifyTags(titleHit, nostalgiaHit) {
  if (titleHit) return ['悼亡']
  if (nostalgiaHit) return ['墓陵怀古']
  return ['生死哲思']
}

function normalizeTitle(t) {
  return t.replace(/[\s·（）()、，。！？：:·\-—]/g, '')
}

/* ── 读取已有精品 md，用于去重 ── */
function loadMdIndex() {
  const files = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md'))
  const index = []
  for (const f of files) {
    const raw = fs.readFileSync(path.join(MD_DIR, f), 'utf-8')
    const titleM = raw.match(/^title:\s*"?([^"\n]+)"?/m)
    const authorM = raw.match(/^author:\s*"?([^"\n]+)"?/m)
    if (!titleM) continue
    let core = titleM[1]
    // 去掉"作者："前缀
    const idx = core.indexOf('：')
    if (idx !== -1) core = core.slice(idx + 1)
    index.push({
      core: normalizeTitle(core),
      author: authorM ? authorM[1].replace(/（题）/g, '').trim() : ''
    })
  }
  return index
}

function isDupMd(item, mdIndex) {
  const t = normalizeTitle(item.title)
  return mdIndex.some(m => {
    if (m.author && item.author && m.author !== item.author) return false
    return t.includes(m.core) || m.core.includes(t)
  })
}

/* ── 重点句提取 ── */
function pickHighlight(paragraphs) {
  const text = paragraphs.join('')
  // 优先包含强关键词的句子
  const sentences = text.split(/(?<=[。？！])/).filter(Boolean)
  const hit = sentences.find(s => CONTENT_RE.test(s) && s.length <= 40)
  if (hit) return hit.trim()
  // 否则取首联
  const first = (paragraphs[0] || '').split(/[。？！]/)[0]
  return (first || paragraphs[0] || '').trim().slice(0, 40)
}

/* ── 主流程 ── */
function loadJsonFiles(prefix) {
  return fs
    .readdirSync(CACHE)
    .filter(f => f.startsWith(prefix) && f.endsWith('.json'))
    .sort()
    .flatMap(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf-8'))
      } catch (e) {
        console.warn(`跳过损坏文件: ${f} (${e.message})`)
        return []
      }
    })
}

function main() {
  const mdIndex = loadMdIndex()
  const overridesPath = path.join(__dirname, 'famous-overrides.json')
  const overrides = fs.existsSync(overridesPath)
    ? JSON.parse(fs.readFileSync(overridesPath, 'utf-8'))
    : { include: [], exclude: [] }

  const tang = loadJsonFiles('poet.tang.')
  const songCi = loadJsonFiles('ci.song.')
  console.log(`载入：唐诗 ${tang.length} 首，宋词 ${songCi.length} 首`)

  const seen = new Set()
  const items = []

  function pushItem({ title, author, dynasty, paragraphs }) {
    title = t2s((title || '').trim())
    author = t2s((author || '佚名').trim())
    const content = paragraphs.map(p => t2s(p))
    if (!title || !content.length) return

    const key = `${author}|${normalizeTitle(title)}`
    if (seen.has(key)) return

    const titleHit = TITLE_RE.test(title) && !TITLE_EXCLUDE.test(title)
    const contentHit = CONTENT_RE.test(content.join(''))
    const nostalgiaHit = NOSTALGIA_TITLE_RE.test(title) && contentHit
    if (!titleHit && !contentHit) return

    seen.add(key)
    const item = {
      id: `arc-${items.length}`,
      title,
      author,
      dynasty,
      content,
      tags: classifyTags(titleHit, nostalgiaHit),
      highlight: pickHighlight(content),
      famous: false,
      inMd: false
    }
    item.inMd = isDupMd(item, mdIndex)
    items.push(item)
  }

  for (const p of tang) {
    pushItem({ title: p.title, author: p.author, dynasty: '唐', paragraphs: p.paragraphs || [] })
  }
  for (const c of songCi) {
    pushItem({ title: c.rhythmic, author: c.author, dynasty: '宋', paragraphs: c.paragraphs || [] })
  }

  /* ── 名家精选 ≤300 ── */
  const famousRank = new Map(FAMOUS.map((name, i) => [name, FAMOUS.length - i]))
  const candidates = items
    .filter(it => !it.inMd && famousRank.has(it.author))
    .map(it => {
      const titleBonus = TITLE_RE.test(it.title) ? 50 : 0
      return { it, score: famousRank.get(it.author) + titleBonus }
    })
    .sort((a, b) => b.score - a.score)

  // 手工增补/剔除
  const excludeSet = new Set(
    (overrides.exclude || []).map(e => `${e.author}|${normalizeTitle(e.title)}`)
  )
  const eligible = candidates.filter(
    c => !excludeSet.has(`${c.it.author}|${normalizeTitle(c.it.title)}`)
  )
  // 按朝代配额平衡：唐 ≤230，宋 ≤70（不足则互补）
  const tangPick = eligible.filter(c => c.it.dynasty === '唐').slice(0, 230)
  const songPick = eligible.filter(c => c.it.dynasty === '宋').slice(0, 70)
  let picked = [...tangPick, ...songPick]
  if (picked.length < 300) {
    const pickedIds = new Set(picked.map(p => p.it))
    for (const c of eligible) {
      if (picked.length >= 300) break
      if (!pickedIds.has(c.it)) {
        picked.push(c)
        pickedIds.add(c.it)
      }
    }
  }
  for (const inc of overrides.include || []) {
    const found = items.find(
      it => it.author === inc.author && normalizeTitle(it.title).includes(normalizeTitle(inc.title))
    )
    if (found && !found.inMd && !picked.some(p => p.it === found)) picked.push({ it: found })
  }
  const pickedSet = new Set(picked.map(p => p.it))
  pickedSet.forEach(it => (it.famous = true))

  /* ── 统计 ── */
  const dynastyCounts = {}
  const tagCounts = {}
  for (const it of items) {
    dynastyCounts[it.dynasty] = (dynastyCounts[it.dynasty] || 0) + 1
    for (const t of it.tags) tagCounts[t] = (tagCounts[t] || 0) + 1
  }

  /* ── 输出：全量库（不含 highlight，供诗词库页）── */
  const archiveItems = items.map(({ id, title, author, dynasty, content, tags }) => ({
    id, title, author, dynasty, content, tags
  }))
  const archiveOut = {
    generatedAt: new Date().toISOString(),
    source: 'chinese-poetry/chinese-poetry (MIT) — 全唐诗 / 全宋词，关键词筛选',
    total: items.length,
    dynastyCounts,
    tagCounts,
    items: archiveItems
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(archiveOut))

  /* ── 输出：名家精选（含 highlight，供诗歌首页）── */
  const FAMOUS_OUT = path.join(ROOT, 'src/data/poetry-famous.json')
  const famousOut = {
    generatedAt: archiveOut.generatedAt,
    archiveTotal: items.length,
    items: items
      .filter(it => it.famous && !it.inMd)
      .map(({ id, title, author, dynasty, content, tags, highlight }) => ({
        id, title, author, dynasty, content, tags, highlight
      }))
  }
  fs.writeFileSync(FAMOUS_OUT, JSON.stringify(famousOut))

  console.log(`\n收录 ${items.length} 首（唐诗 ${dynastyCounts['唐'] || 0} / 宋词 ${dynastyCounts['宋'] || 0}）`)
  console.log(`标签分布:`, tagCounts)
  console.log(`与精品 md 重复: ${items.filter(i => i.inMd).length} 首`)
  console.log(`名家精选: ${famousOut.items.length} 首`)
  console.log(`输出: ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`)
  console.log(`输出: ${FAMOUS_OUT} (${(fs.statSync(FAMOUS_OUT).size / 1024).toFixed(0)} KB)`)
}

main()
