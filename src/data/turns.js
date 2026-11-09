/**
 * 生之出口 · 策略
 * 网站的主题是死，但每个「讲死」的入口都必须把情绪转成「生」的一个动作。
 * 形式统一为：一个「临终之问」+ 一个「行动出口」。
 *
 * 优先级：内容 frontmatter（turn / action_text / action_link）
 *        > 本文件的精选覆写（按 slug）
 *        > 幕次默认
 * 三层叠加，保证 100% 内容都有出口。
 */
import { inferAct } from './acts'

// 每一幕的默认「临终之问」
const DEFAULT_QUESTION = {
  1: '如果这是你最后一次认真直面死亡，你今天最想改变的一个念头是什么？',
  2: '如果此刻必须把这份感动说给一个人听，你会说给谁？',
  3: '如果只剩一个夏天，你会先从清单上划掉哪一件事、又立刻去做哪一件？',
  4: '如果明天就要告别，你最想对谁说一句什么话？'
}

// 每一幕的默认「行动出口」
const DEFAULT_ACTION = {
  1: { text: '做一分钟死亡冥想', link: '/practices/daily-memento-mori' },
  2: { text: '给重要的人写一封信', link: '/letters' },
  3: { text: '把它写进遗愿清单', link: '/bucketlist' },
  4: { text: '进入哀悼空间', link: '/memorial' }
}

/**
 * 精选覆写：针对具体文章/故事，给出更贴切的问句与出口。
 * 判断标准只有一条——这句话能不能让人在三十秒内想到一个具体的人名或一件具体的事。
 * key = slug。
 */
const CURATED = {
  // ── 文章 · 临终与告别 ──
  'being-mortal': {
    question: '如果那天真的来了，你希望谁替你按下停止键？——你跟他谈过这件事吗？',
    action: { text: '记下我的医疗意愿', link: '/advance-directives' }
  },
  'hospice-and-dignity': {
    question: '最后的半年，你最不能接受被怎样对待？这个底线，家里有人知道吗？',
    action: { text: '写下我不能接受的', link: '/advance-directives' }
  },
  'how-to-accompany-dying-loved-one': {
    question: '如果躺在身边的人是你最重要的关系，你今天能多做一件什么？',
    action: { text: '记下我的陪伴意愿', link: '/advance-directives' }
  },
  'what-is-a-good-death': {
    question: '你心里的「好死」是什么画面？为了配得上它，你现在该跟谁谈一次？',
    action: { text: '记下我的意愿', link: '/advance-directives' }
  },
  'grief-is-love-with-no-place-to-go': {
    question: '你那份没处安放的思念，现在最想流向谁？',
    action: { text: '给 TA 写一封信', link: '/letters' }
  },
  'why-we-fear-talking-about-death': {
    question: '你和最亲的人之间，关于死亡那句从没说过的话，是什么？',
    action: { text: '把它记进我的意愿', link: '/advance-directives' }
  },

  // ── 文章 · 活出意义 ──
  'bucket-list-is-for-living': {
    question: '此刻你心里闪过的那件事——你打算安排在哪个星期去做？',
    action: { text: '现在就写下它', link: '/bucketlist' }
  },
  'jobs-stanford-speech': {
    question: '「Stay hungry, stay foolish」——你上一次为某件事真正饥饿，是什么时候？',
    action: { text: '审视我的生命之轮', link: '/practices/life-wheel' }
  },
  'frankl-mans-search': {
    question: '如果苦难无法避免，你愿意为它找到一个怎样的意义？',
    action: { text: '写下今天值得活过的瞬间', link: '/gratitude' }
  },
  'legacy-and-memory': {
    question: '十年后，谁会在什么场合提起你？他开口的第一句话是什么？',
    action: { text: '写下我想被记住的样子', link: '/advance-directives' }
  },
  'soul-pixar': {
    question: '乔伊说火花不是人生目标。上一次你因为一件很小的事觉得活着真好，是什么？',
    action: { text: '记下那个瞬间', link: '/gratitude' }
  },
  'tuesdays-with-morrie': {
    question: '莫里说「学会了死，就学会了活」。他的十四堂课里，你最缺一堂是哪一堂？',
    action: { text: '写下属于我的那一课', link: '/gratitude' }
  },
  'epitaph-in-twenty-words': {
    question: '如果墓碑上只能刻二十个字，你希望后人读到什么？为了配得上这句话，你今天该做什么？',
    action: { text: '写下我想被记住的样子', link: '/advance-directives' }
  },
  'lose-track-of-time': {
    question: '上一次你做某件事做到忘了看时间，是什么时候？那件事，你还愿意为它腾出一个下午吗？',
    action: { text: '把它安排进这个周末', link: '/bucketlist' }
  },
  'see-them-this-week': {
    question: '你想见的那个人，这周有空吗？你打算用什么借口继续拖下去？',
    action: { text: '现在就把消息发出去', link: '/letters' }
  },
  'things-to-do-someday': {
    question: '「以后再做」的清单里，哪一件其实只需要一个下午？',
    action: { text: '给它定一个日期', link: '/bucketlist' }
  },

  // ── 文章 · 哲学思考 ──
  'camus-absurd': {
    question: '你每天推上山顶又滚下来的那块石头是什么？如果必须热爱它，你想先改哪一个动作？',
    action: { text: '重新安排我的一天', link: '/practices/life-wheel' }
  },
  'epicurus-death-is-nothing': {
    question: '「死亡与我们无关」——那此刻真正与你有关的那件事，你为什么一直拖着？',
    action: { text: '今天先做二十分钟', link: '/bucketlist' }
  },
  'montaigne-learn-to-die': {
    question: '蒙田说学会死就解除了奴役。此刻真正奴役你的，是哪一份不敢失去？',
    action: { text: '看看我的生命之轮', link: '/practices/life-wheel' }
  },
  'nietzsche-amor-fati': {
    question: '如果恶魔说这一生要原样重复无数次，你最想改掉的是哪一段？',
    action: { text: '今天就改它一件小事', link: '/bucketlist' }
  },
  'seneca-shortness-of-life': {
    question: '今天有多少个小时是真正属于你的？把它们从日程里圈出来了吗？',
    action: { text: '给这一周留出一格', link: '/calendar' }
  },
  'socrates-death': {
    question: '未经省察的人生不值得过。你有多久没有认真审过一次自己的日子了？',
    action: { text: '十五分钟生命之轮', link: '/practices/life-wheel' }
  },
  'what-is-death': {
    question: '如果今天必须给「死亡」下一个只属于你自己的定义，你会怎么写？',
    action: { text: '一分钟死亡冥想', link: '/practices/daily-memento-mori' }
  },

  // ── 文章 · 死亡认知 ──
  'confucius-unknown-life': {
    question: '「未知生，焉知死」——那关于「生」，你最想先搞懂的是哪一件事？',
    action: { text: '做一轮生命之轮', link: '/practices/life-wheel' }
  },
  'death-anxiety-message': {
    question: '这一次焦虑来袭，它在提醒你哪件一直拖着没做的事？',
    action: { text: '写下它，给它日期', link: '/bucketlist' }
  },
  'heidegger-being-towards-death': {
    question: '「向死而生」的反面是随大流。你现在做的哪件事，其实是别人在替你选？',
    action: { text: '重新审视我的一天', link: '/practices/life-wheel' }
  },
  'kubler-ross-five-stages': {
    question: '你现在正在失去的那件事，把你卡在了哪一阶段？',
    action: { text: '进入哀悼空间', link: '/memorial' }
  },
  'talking-to-children-about-death': {
    question: '如果家里的孩子今晚问你「人会死吗」，你会怎么回答？',
    action: { text: '读给孩子听的故事', link: '/stories/leaf-freddie' }
  },
  'the-wisdom-of-impermanence': {
    question: '正因为一切会过去，此刻你最想牢牢抓住的是什么？',
    action: { text: '把它写进感恩时刻', link: '/gratitude' }
  },
  'yalom-staring-at-sun': {
    question: '亚隆说死亡焦虑的强度，等于没活过的程度。你此刻的焦虑，对应哪件没做的事？',
    action: { text: '现在就把它写下来', link: '/bucketlist' }
  },

  // ── 文章 · 文化与仪式 ──
  'dia-de-los-muertos': {
    question: '如果每年有一天你必须摆出一个人的照片，你会摆谁？今年你打算怎么过那一天？',
    action: { text: '给 TA 写一封信', link: '/letters' }
  },
  'japan-shukatsu': {
    question: '如果这个周末要整理一生的物品，你会最先留下哪三样？',
    action: { text: '从数字遗产开始', link: '/practices/digital-legacy' }
  },
  'okuribito': {
    question: '如果你要为一个人做一次最后体面的告别，你会选谁？为什么不是现在？',
    action: { text: '给 TA 写一封信', link: '/letters' }
  },

  // ── 文章 · 历史文化 ──
  'marcus-aurelius-meditations': {
    question: '一位皇帝每晚都写给自己的话。你上一次认真写给自己的，是什么时候？',
    action: { text: '记录今天的一行', link: '/gratitude' }
  },
  'memento-mori': {
    question: '如果要在桌上放一件东西，提醒自己不虚度此生，你会放什么？',
    action: { text: '建立我的每日仪式', link: '/practices/daily-memento-mori' }
  },
  'su-shi-death-view': {
    question: '苏轼被贬了一辈子，却写出了最好的日子。你此刻的「被贬」里，可能藏着什么？',
    action: { text: '记下今天值得活的瞬间', link: '/gratitude' }
  },
  'wang-yangming-last-words': {
    question: '「此心光明，亦复何言」。如果今晚就是终点，你心里有没有一件还不光明的事？',
    action: { text: '现在就写下来', link: '/letters' }
  },

  // ── 文章 · 文学与死亡 ──
  'camus-the-plague': {
    question: '里厄医生只是「诚实地」做好本职。你的本职里，哪一件是你还想认真做好的？',
    action: { text: '把它写进这一周', link: '/calendar' }
  },
  'camus-the-stranger': {
    question: '默尔索在母亲葬礼上没哭。别人说你冷漠的那件事，其实藏着什么？',
    action: { text: '给那个人写封信', link: '/letters' }
  },
  'hamlet-to-be': {
    question: '哈姆雷特的犹豫不是怕死，是没找到值得活的理由。你的理由是什么？',
    action: { text: '写下我的三件事', link: '/bucketlist' }
  },
  'marquez-solitude': {
    question: '布恩迪亚家族所有人都在重复同一种孤独。你家重复了几代的那件事是什么？',
    action: { text: '写下来，让它停在这里', link: '/letters' }
  },
  'norwegian-wood': {
    question: '村上说不属于生之记忆的死不存在。你记忆里最鲜活的那个人，最近联系了吗？',
    action: { text: '现在就发一条消息', link: '/letters' }
  },
  'yu-hua-to-live': {
    question: '人是为了活着本身而活——那你今天，为「活着本身」做了什么？',
    action: { text: '记录一个活着的瞬间', link: '/gratitude' }
  },
  'zhuangzi-drumming-song': {
    question: '庄子妻死，鼓盆而歌。你始终无法原谅的那次离开，能不能换一个视角再看一次？',
    action: { text: '进入哀悼空间', link: '/memorial' }
  },
  'facing-death-with-love': {
    question: '你上一次把「爱」字说出口是对谁？还记得当时的表情吗？',
    action: { text: '今天就说一次', link: '/letters' }
  },
  'when-breath-becomes-air': {
    question: '保罗说确诊后「未来」不再是以后而是现在。你的「以后」里，最该挪到现在的是哪一件？',
    action: { text: '把它安排进这个星期', link: '/bucketlist' }
  },
  'letter-to-loved-one': {
    question: '那封「以防万一」的信，你为什么还在等？',
    action: { text: '现在就动笔', link: '/letters' }
  },

  // ── 故事 ──
  'a-letter-found-in-a-library-book': {
    question: '那封信在书里等了几十年。你有没有一句话，想留给某个以后会读到它的陌生人？',
    action: { text: '写一封不急着寄的信', link: '/letters' }
  },
  'anne-frank-diary': {
    question: '安妮在绝境里仍相信人心本善。今天你愿意为一个陌生人做一次这样的相信吗？',
    action: { text: '记下今天的一次善意', link: '/gratitude' }
  },
  'badgers-parting-gifts': {
    question: '獾把自己会的东西全留给了朋友。你打算留给别人的是什么？',
    action: { text: '教 TA 一次', link: '/bucketlist' }
  },
  'bbc-last-summer': {
    question: '五个人里，谁的选择最让你意外？如果只剩一个夏天，你先做什么？',
    action: { text: '写下我的那个夏天', link: '/bucketlist' }
  },
  'big-fish': {
    question: '威尔最后才读懂父亲的故事。你和父母之间，哪件事你从来没有认真问过？',
    action: { text: '这周问他们一次', link: '/letters' }
  },
  'charlottes-web': {
    question: '夏洛为威伯尔织了一张网。你为朋友做过最不图回报的一件事是什么？',
    action: { text: '再做一次', link: '/bucketlist' }
  },
  'cheng-hao-two-worlds': {
    question: '程浩说生死是「两个世界的边缘」。站在你这侧的边缘，你想先做好什么？',
    action: { text: '整理我的意愿', link: '/advance-directives' }
  },
  'grandfather-last-words': {
    question: '长辈最后一句话，你记得吗？如果没来得及听，你最想替他完成什么？',
    action: { text: '进入哀悼空间', link: '/memorial' }
  },
  'helen-keller-three-days': {
    question: '海伦三天光明最想看的是「人脸」。今天你会认真看谁的脸，看多久？',
    action: { text: '和 TA 待一个下午', link: '/bucketlist' }
  },
  'hospice-nurse-truths': {
    question: '护士说最常听到的遗憾是「没勇气过自己的生活」。你的那一句遗憾是什么？',
    action: { text: '现在就去划掉一个心愿', link: '/bucketlist' }
  },
  'intouchables': {
    question: '德瑞斯让菲利普忘了瘫痪。你身边那个敢跟你开玩笑的人，最近一次联系是什么时候？',
    action: { text: '约他这周见一面', link: '/bucketlist' }
  },
  'last-lecture-randy-pausch': {
    question: '如果你的「最后一课」就在下周，你最想让谁坐进教室？',
    action: { text: '写下我想完成的事', link: '/bucketlist' }
  },
  'leaf-freddie': {
    question: '如果你要把死亡解释给一个孩子听，你会用哪句话？',
    action: { text: '写下来，读给 TA 听', link: '/letters' }
  },
  'little-prince-farewell': {
    question: '小王子说「你会拥有会笑的星星」。谁是你的那朵玫瑰？你照顾过它吗？',
    action: { text: '给 TA 写一封信', link: '/letters' }
  },
  'pingru-meitang': {
    question: '饶平如九十岁才开始画他们的过去。你打算从什么时候开始记录你的家人？',
    action: { text: '这周录一段他们的话', link: '/letters' }
  },
  'shi-tiesheng-ditan': {
    question: '史铁生说死是不必急于求成的事。那你现在最该「急」的那件生事是什么？',
    action: { text: '把它安排进这个星期', link: '/bucketlist' }
  },
  'the-old-tree': {
    question: '老树把阴凉留给了别人。你愿意为谁留下一片阴凉？',
    action: { text: '给那个人写封信', link: '/letters' }
  },
  'thirty-cancer-bucket-list': {
    question: '他的清单里，哪一条你今天下午就能划掉？',
    action: { text: '现在就去划掉它', link: '/bucketlist' }
  },
  'tolstoy-ivan-ilyich': {
    question: '伊凡临终才发现自己没真正活过。你的「正确生活」，正在让你错过什么？',
    action: { text: '给重要的人写封信', link: '/letters' }
  },
  'xiong-dun-tumor': {
    question: '熊顿把病痛画成了漫画。你正扛着的这件事，有没有一种方式能让你笑着讲出来？',
    action: { text: '写下来', link: '/gratitude' }
  },
  'yang-jiang-we-three': {
    question: '杨绛「一个人思念我们仨」。你的「我们仨」是哪三个人？这周见得到吗？',
    action: { text: '约他们这周吃饭', link: '/bucketlist' }
  },
  'yu-juan-unfinished': {
    question: '于娟写：到了生死临界点，所有加班都是浮云。你上周的加班，换来了什么？',
    action: { text: '给这一周留一格空白', link: '/calendar' }
  },
  'voices-of-the-living-01': {
    question: '这些普通人的答案里，哪一句最像你还没说出口的话？',
    action: { text: '写下你的那一句', link: '/gratitude' }
  }
}

/**
 * 生命练习：做完练习本身就是行动，出口应指向「立刻把它变成习惯」。
 */
const PRACTICE_EXIT = {
  'daily-memento-mori': {
    question: '一分钟结束了。你刚才最想立刻去做的那件事是什么？',
    action: { text: '给它定一个日期', link: '/bucketlist' }
  },
  'one-minute-breath': {
    question: '呼吸慢下来了。此刻你最想对哪个人说的一句话是什么？',
    action: { text: '现在就说给 TA 听', link: '/letters' }
  },
  'evening-gratitude': {
    question: '今天这三件小事，明天醒来你还会记得吗？',
    action: { text: '记下今天值得活的瞬间', link: '/gratitude' }
  },
  'letter-to-loved-one': {
    question: '信写好了。你打算寄出去，还是等一个再也不会拖的日子？',
    action: { text: '现在就动笔', link: '/letters' }
  },
  'life-wheel': {
    question: '得分最低的那一格，如果只剩一年，你还打算继续忽略它吗？',
    action: { text: '为它安排第一件事', link: '/bucketlist' }
  },
  'digital-legacy': {
    question: '如果手机今天就要交给家人解锁，你最不想被看到、和最希望被看到的分别是什么？',
    action: { text: '记下我的数字意愿', link: '/advance-directives' }
  }
}

/**
 * 诗歌：诗本身是「感受」那一环，出口一律指向「说给一个人」。
 */
const POETRY_QUESTIONS = [
  '这首诗里有一句，如果必须在今晚说给一个人听，你会说给谁？',
  '读诗的时候你想到了谁？那个人，你上次联系是什么时候？',
  '如果这句诗要刻在你生命里的某样东西上，你想刻在哪里？',
  '诗替你说出了什么你一直说不出的话？',
  '如果这是你最后一首认真读完的诗，你想为它做一件什么事？'
]

/**
 * 推荐书单影单：读完看完才是重点，出口一律指向「安排时间」。
 */
const REC_QUESTIONS = {
  book: '这本书你打算在哪个星期真正翻开它？',
  film: '这部电影，你愿意约谁一起看？',
  documentary: '这部纪录片看完，你最想和谁讨论？',
  podcast: '这一集，你打算在哪段路上听完？'
}

/**
 * 诗词库（悼亡诗）：出口指向「还在的人」。
 */
const ARCHIVE_QUESTION =
  '悼亡诗都是写给已经不在了的人。那此刻还在的人里，你有哪句话想趁早说？'

/**
 * 解析一篇内容（文章/故事）读完后的出口。
 * @param {object} metadata frontmatter
 * @param {string} slug
 */
export function resolveTurn(metadata = {}, slug = '') {
  const curated = CURATED[slug] || {}
  const act = inferAct({ act: metadata.act, category: metadata.category, slug })
  const actId = act ? act.id : 1

  const question =
    metadata.turn || curated.question || DEFAULT_QUESTION[actId] || DEFAULT_QUESTION[1]

  let action = null
  if (metadata.action_text && metadata.action_link) {
    action = { text: metadata.action_text, link: metadata.action_link }
  } else if (curated.action) {
    action = curated.action
  } else {
    action = DEFAULT_ACTION[actId] || DEFAULT_ACTION[1]
  }

  return { question, action, act }
}

/** 生命练习的出口 */
export function resolvePracticeTurn(metadata = {}, slug = '') {
  const curated = PRACTICE_EXIT[slug]
  if (curated) return { ...curated, act: inferAct({ act: metadata.act, slug }) }
  return resolveTurn(metadata, slug)
}

/** 诗歌的出口：按日期轮转，同一天进来看到的是同一句 */
export function resolvePoetryTurn(seed = 0) {
  const i = Math.abs(Math.floor(seed)) % POETRY_QUESTIONS.length
  return {
    question: POETRY_QUESTIONS[i],
    action: { text: '把这句话写给他', link: '/letters' }
  }
}

/** 推荐条目的出口 */
export function resolveRecTurn(category = 'book') {
  return {
    question: REC_QUESTIONS[category] || REC_QUESTIONS.book,
    action: { text: '把它安排进这个星期', link: '/bucketlist' }
  }
}

/** 悼亡诗词库的出口 */
export function resolveArchiveTurn() {
  return {
    question: ARCHIVE_QUESTION,
    action: { text: '现在就说给 TA 听', link: '/letters' }
  }
}
