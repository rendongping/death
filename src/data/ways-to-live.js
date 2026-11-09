/**
 * 一万种死法 · 生之出口
 *
 * ways-to-die.json 由 scripts/generate-ways-to-die.py 生成，不能直接改（重跑会覆盖）。
 * 所以「出口」以旁挂文件的形式按 id 对应，页面渲染时合并。
 *
 * 原则：每一条死法都必须落到「今天能做的一件具体的小事」。
 * prevention 讲的是「如何远离这种死法」（知识层），
 * living 讲的是「所以你今天该做什么」（行动层）——后者才是本站的目的。
 */

// 分类默认出口：某条没有单独配置时使用
export const CATEGORY_LIVING = {
  cardio: {
    text: '今晚就去走 30 分钟',
    link: '/bucketlist'
  },
  tumor: {
    text: '把这周的体检约掉',
    link: '/bucketlist'
  },
  infection: {
    text: '给家人打一通电话',
    link: '/letters'
  },
  neuro: {
    text: '约最想见的人这周见一面',
    link: '/bucketlist'
  },
  metabolic: {
    text: '把今晚这顿饭换成清淡的',
    link: '/bucketlist'
  },
  accident: {
    text: '出门前把行程告诉一个人在意你的人',
    link: '/letters'
  },
  nature: {
    text: '和家人认真说一次「如果」',
    link: '/advance-directives'
  },
  biohazard: {
    text: '今天认真看一下身边的说明',
    link: '/bucketlist'
  },
  society: {
    text: '抱一下你想抱的人',
    link: '/letters'
  },
  history: {
    text: '写下你想被记住的样子',
    link: '/advance-directives'
  },
  numbers: {
    text: '从今天里拿回一个小时',
    link: '/calendar'
  },
  gooddeath: {
    text: '记下我的医疗意愿',
    link: '/advance-directives'
  }
}

/**
 * 逐条配置：id → { living, action }
 * living = 一句「所以你今天可以做什么」
 * action = 可选的定制出口（不写则用分类默认）
 */
export const WAY_LIVING = {
  // ── 心脑血管 ──
  'heart-attack': {
    living: '你的家族里有没有人心脏出过问题？这件事你问过父母吗？今晚就问。',
    action: { text: '把「问家族病史」定在这周', link: '/bucketlist' }
  },
  stroke: {
    living: '量一次血压只需要三分钟。你已经多久没测过了？',
    action: { text: '今天去测一次', link: '/bucketlist' }
  },
  'sudden-death': {
    living: '猝死最常见的诱因是长期透支。今晚几点睡，是你现在就能决定的。',
    action: { text: '给这周留两个早睡夜', link: '/calendar' }
  },
  'aortic-dissection': {
    living: '血压高却不吃药，是最常见的一种侥幸。你今年测过血压吗？',
    action: { text: '约一次体检', link: '/bucketlist' }
  },
  'heart-failure': {
    living: '心脏会用很多年的小信号提醒你。你最近忽略的是哪一个？',
    action: { text: '今晚走 30 分钟', link: '/bucketlist' }
  },
  'pulmonary-embolism': {
    living: '久坐是隐形杀手。现在站起来，走五分钟——就现在。',
    action: { text: '每坐一小时起来一次', link: '/calendar' }
  },

  // ── 肿瘤 ──
  'lung-cancer': {
    living: '戒烟十年，肺癌风险可以回到接近不吸烟者。什么时候开始都不算晚，但没有「明天」。',
    action: { text: '定一个戒烟起始日', link: '/bucketlist' }
  },
  'liver-cancer': {
    living: '乙肝携带者定期筛查，差距是生死。你知道自己的乙肝状态吗？',
    action: { text: '把这周的体检约掉', link: '/bucketlist' }
  },
  'stomach-cancer': {
    living: '胃癌在东亚高发，早筛就能救。你上一次做胃镜是什么时候？',
    action: { text: '预约一次筛查', link: '/bucketlist' }
  },
  'pancreatic-cancer': {
    living: '它几乎没有早期信号，所以身体的异常从不能「再等等」。最近哪一次不适被你压下去了？',
    action: { text: '去看那个拖了很久的科', link: '/bucketlist' }
  },
  'colon-cancer': {
    living: '肠镜是少数能「提前拆掉」的癌。45 岁之后你安排过吗？',
    action: { text: '把它写进今年清单', link: '/bucketlist' }
  },
  'breast-cancer': {
    living: '一次自检十分钟。更重要的是：你身边那位女性，你提醒过她吗？',
    action: { text: '今天提醒她在意的人', link: '/letters' }
  },
  melanoma: {
    living: '出门涂防晒，是很小的一件事——小到你一直不做。',
    action: { text: '今天开始', link: '/bucketlist' }
  },
  leukemia: {
    living: '白血病没有可靠的预防方式，这提醒我们：能控制的只有当下的每一天。今天你想为谁好好过？',
    action: { text: '给那个人写封信', link: '/letters' }
  },

  // ── 呼吸与感染 ──
  pneumonia: {
    living: '老人肺炎是「最后一根稻草」。家里的长辈今年打过疫苗吗？',
    action: { text: '这周带父母去问一次', link: '/bucketlist' }
  },
  copd: {
    living: '厨房开抽油烟机、冬天少在密闭空间烧炭。这些小事没人当回事。',
    action: { text: '今晚就改一个习惯', link: '/bucketlist' }
  },
  flu: {
    living: '流感对年轻人是难受，对老人可能是终点。今年你给父母打过电话问疫苗吗？',
    action: { text: '现在就打这通电话', link: '/letters' }
  },
  sepsis: {
    living: '一个小伤口也可能要命。你身上那个伤口，处理过没有？',
    action: { text: '学会那几个急救常识', link: '/bucketlist' }
  },
  tuberculosis: {
    living: '咳嗽超过两周就该去查。你拖了多久了？',
    action: { text: '今天去挂号', link: '/bucketlist' }
  },
  'hiv-aids': {
    living: '今天艾滋病更多是一个关于歧视的病。你身边有没有人，需要被当成普通人对待？',
    action: { text: '今天做一次不带偏见的对话', link: '/letters' }
  },
  malaria: {
    living: '出门旅行前的预防药，很多人嫌麻烦。你下一次旅行会做足准备吗？',
    action: { text: '写进下一次出行清单', link: '/bucketlist' }
  },
  rabies: {
    living: '被咬之后打疫苗几乎 100% 有效，但没人敢赌。你去年被猫抓过吗？处理了吗？',
    action: { text: '记住这条：立刻去', link: '/bucketlist' }
  },
  ebola: {
    living: '远处的疫情提醒我们：能平安度过今天，本身就不是理所当然。今天你想认真过成什么样？',
    action: { text: '记下今天', link: '/gratitude' }
  },
  covid19: {
    living: '那几年教会我们的，是「以后见」三个字有多不可靠。你想见的那个人，这周见得到吗？',
    action: { text: '现在就把消息发出去', link: '/letters' }
  },

  // ── 神经与精神 ──
  alzheimer: {
    living: '记忆会消失，所以趁现在。你有多久没认真听父母讲过去了？录下来了吗？',
    action: { text: '这周录一段他们的话', link: '/letters' }
  },
  als: {
    living: '霍金说「记住仰望星空」。此刻你还健康着——你最想用它去做的那件事是什么？',
    action: { text: '今天做二十分钟', link: '/bucketlist' }
  },
  parkinson: {
    living: '手会抖、话会慢，但人还在。你想陪的那个人，今天抱过 TA 了吗？',
    action: { text: '约 TA 这周见一面', link: '/bucketlist' }
  },
  'brain-tumor': {
    living: '头痛这件事没人当回事，直到有一天来不及。你最近一次「忍一忍就过去了」是什么？',
    action: { text: '今天去查', link: '/bucketlist' }
  },
  'epilepsy-sudden': {
    living: '罕见但真实。它提醒的是：把重要的话早点说完，别留给以后。',
    action: { text: '把那句话说出口', link: '/letters' }
  },
  'depression-suicide': {
    living: '自杀几乎都是可以被拦下的。如果你此刻很难受，请打下面的电话；如果你只是想帮一个人，今天就发那条消息。',
    action: { text: '联系那个好久没联系的人', link: '/letters' }
  },

  // ── 代谢与消化 ──
  diabetes: {
    living: '糖尿病并发症才是致命的，而它完全可以推迟。你今年的血糖查了吗？',
    action: { text: '约一次体检', link: '/bucketlist' }
  },
  'kidney-failure': {
    living: '止痛药当糖吃、水当饮料喝，是最常见的两条路。你占了哪一条？',
    action: { text: '今天就改一个', link: '/bucketlist' }
  },
  'liver-cirrhosis': {
    living: '肝是沉默的器官，等到疼就晚了。这周的酒，能少一次吗？',
    action: { text: '定一个不喝酒的日子', link: '/calendar' }
  },
  pancreatitis: {
    living: '一次暴饮暴食就能引发。今晚这顿，你打算吃到几分饱？',
    action: { text: '今晚吃到七分饱', link: '/bucketlist' }
  },
  anorexia: {
    living: '这是一种病，不是意志力。如果你正在其中，请求助；如果你身边有，请别只说「多吃点」。',
    action: { text: '约 TA 吃一顿不被评价的饭', link: '/bucketlist' }
  },

  // ── 意外事故 ──
  traffic: {
    living: '绝大多数事故来自看手机和疲劳。今晚回家这段路，你能不能一次都不看手机？',
    action: { text: '今晚认真开一次车', link: '/bucketlist' }
  },
  falls: {
    living: '跌倒是老人死因里的隐形冠军。你家的浴室有防滑垫吗？今晚就买。',
    action: { text: '今天就下单', link: '/bucketlist' }
  },
  drowning: {
    living: '溺水是安静的，十几秒就没了。下次带孩子玩水，把手机放下。',
    action: { text: '记进下一次出行', link: '/bucketlist' }
  },
  fire: {
    living: '火灾多发生在深夜的家中。你知道离床最近的逃生路线吗？灭火器在哪里？',
    action: { text: '今晚花十分钟看一遍', link: '/bucketlist' }
  },
  electric: {
    living: '湿手拔插头、老旧插线板超负荷——都是几秒钟的事。今晚检查一下你的插线板。',
    action: { text: '今晚就换掉那个', link: '/bucketlist' }
  },
  'carbon-monoxide': {
    living: '它无色无味。一个几十块的报警器就能救命。你老家冬天烧什么？',
    action: { text: '给家里装一个', link: '/bucketlist' }
  },
  'food-poisoning': {
    living: '剩菜不是不能吃，是要看放了多久、有没有彻底加热。今晚的剩菜你打算怎么办？',
    action: { text: '学会那几条底线', link: '/bucketlist' }
  },
  falling: {
    living: '高空坠物大多来自自己家的阳台。你家窗台上有什么？今晚收进来。',
    action: { text: '今晚收一次阳台', link: '/bucketlist' }
  },
  choking: {
    living: '海姆立克急救法学一次只要十分钟，一辈子用得上。你今天学了吗？',
    action: { text: '现在就花十分钟', link: '/bucketlist' }
  },
  'plane-crash': {
    living: '概率极低，但起飞前那几分钟，你想起过谁吗？落地后有没有告诉他们？',
    action: { text: '现在就发一条消息', link: '/letters' }
  },
  'extreme-sports': {
    living: '追求极限没有错，但请确认：你爱的人知道你的风险，也拿到了你的意愿。',
    action: { text: '写下我的意愿', link: '/advance-directives' }
  },

  // ── 自然之力 ──
  lightning: {
    living: '概率很小，但「今天会不会出事」这件事谁都说不准。所以你想说的话，为什么要等？',
    action: { text: '今天就说出口', link: '/letters' }
  },
  earthquake: {
    living: '比防震包更重要的是：你和家人约好在哪儿见面了吗？',
    action: { text: '今晚和家人定一个约定', link: '/letters' }
  },
  volcano: {
    living: '面对自然，人的控制少得可怜。所以能控制的只有怎么过今天。今天你打算怎么过？',
    action: { text: '把它写进今天', link: '/gratitude' }
  },
  tsunami: {
    living: '远离海岸线是唯一的解法。你的下一次旅行，查过当地的避险路线吗？',
    action: { text: '写进下一次出行清单', link: '/bucketlist' }
  },
  flood: {
    living: '洪水里最危险的是开车冲过积水。记住：宁绕一里，不涉一寸。',
    action: { text: '记住这一条', link: '/bucketlist' }
  },
  heatstroke: {
    living: '热射病死亡率很高，且多发于户外工作者和独居老人。你楼下的老人，今天有人看过吗？',
    action: { text: '今天去看一眼', link: '/bucketlist' }
  },
  hypothermia: {
    living: '失温不只是户外的危险，也是冬天的独居老人。今年冬天你给家里打过几次电话？',
    action: { text: '今天就打一次', link: '/letters' }
  },
  avalanche: {
    living: '进山前看雪况通报，是对家人的责任，不只是对自己的。',
    action: { text: '把行程告诉一个人', link: '/letters' }
  },
  wildfire: {
    living: '气候在变，很多「不可能」正在变可能。你所在的城市，今年最热那天你要做什么？',
    action: { text: '提前安排那一天', link: '/calendar' }
  },

  // ── 生物与毒素 ──
  'snake-bite': {
    living: '被咬后记住蛇的样子、别奔跑，比任何偏方都管用。知识就是救生圈。',
    action: { text: '花十分钟学一次急救', link: '/bucketlist' }
  },
  mosquito: {
    living: '蚊子是史上杀人最多的动物。而防它只需要一顶蚊帐。你家老房子有吗？',
    action: { text: '给家里添一顶', link: '/bucketlist' }
  },
  hippo: {
    living: '野生动物的危险大多来自「靠近拍照」。下一次旅行，你能不能只看不摸？',
    action: { text: '记进下一次出行', link: '/bucketlist' }
  },
  'bees-wasps': {
    living: '严重过敏几分钟就能致命。如果你有过敏史，急救卡带了吗？',
    action: { text: '今天写一张随身卡', link: '/advance-directives' }
  },
  'poison-mushroom': {
    living: '每年都有家庭因为「看着像能吃」失去一个人。今晚就告诉家里长辈：不采、不买散装的。',
    action: { text: '今天就叮嘱一次', link: '/letters' }
  },
  botulism: {
    living: '自制腌菜和胀包的罐子是主要来源。你家冰箱里那个鼓起来的东西，扔了吗？',
    action: { text: '今晚清一次冰箱', link: '/bucketlist' }
  },
  'heavy-metal': {
    living: '来源往往是来路不明的饰品和偏方。你最近吃过「土方子」吗？',
    action: { text: '今天清理一次', link: '/bucketlist' }
  },
  radiation: {
    living: '极罕见。它真正教我们的是：绝大多数死因都不戏剧化，而是长期习惯的累积。你的习惯是什么？',
    action: { text: '审视我的一天', link: '/practices/life-wheel' }
  },
  'drug-overdose': {
    living: '过量常常不是「想死」，而是不了解剂量。如果你或身边人在用药上有任何失控，请求助，这不丢人。',
    action: { text: '今天说出这件事', link: '/letters' }
  },

  // ── 社会与暴力 ──
  war: {
    living: '和平不是背景，是随时会消失的东西。此刻你最想珍惜的日常生活是什么？别把它当成理所当然。',
    action: { text: '今天认真过一次', link: '/gratitude' }
  },
  terrorism: {
    living: '它想夺走的是我们的日常。好好过好今天，本身就是一种回答。',
    action: { text: '记下今天', link: '/gratitude' }
  },
  homicide: {
    living: '绝大多数他杀发生在熟人之间。如果你正处在一段让你害怕的关系里，请今天就联系一个人。',
    action: { text: '现在就发出那条消息', link: '/letters' }
  },
  assassination: {
    living: '历史里那些人死于立场，我们今天死于「没来得及」。你想做的事，需要等一个英雄的时刻吗？',
    action: { text: '今天就做一件', link: '/bucketlist' }
  },
  genocide: {
    living: '大屠杀前总有一段「把人不当人」的言论。今天你听到这种话时，会沉默吗？',
    action: { text: '记住自己的回答', link: '/gratitude' }
  },
  execution: {
    living: '这个条目沉重，它提醒的是：人的生命只有一次，不可撤销。所以别把它浪费在等待和怨恨上。',
    action: { text: '放下一件怨恨的事', link: '/letters' }
  },

  // ── 历史与奇案 ──
  aeschylus: {
    living: '悲剧之父写完最后一部作品才死去。你想完成的那部「作品」是什么——它未必是书，可能是一个人、一段关系。',
    action: { text: '今天开始动笔', link: '/bucketlist' }
  },
  'dancing-plague': {
    living: '一场集体癔症可以蔓延全城。你今天焦虑的事，有多少是自己真的在意，多少是被传染的？',
    action: { text: '安静一分钟', link: '/practices/one-minute-breath' }
  },
  'qin-shihuang': {
    living: '拥有全世界的人也找不到长生药。所以重要的不是活多久，是今天有没有活对。',
    action: { text: '看看我的生命之轮', link: '/practices/life-wheel' }
  },
  'henry-i': {
    living: '一位国王死于贪吃。今晚这顿，你能不能吃到七分饱就停？',
    action: { text: '今晚试一次', link: '/bucketlist' }
  },
  'tycho-brahe': {
    living: '传说他因礼节不肯离席而憋出病。你为「不好意思」放弃过多少次身体的信号和拒绝的机会？',
    action: { text: '今天练习说一次不', link: '/bucketlist' }
  },
  attila: {
    living: '征服者在最幸福的一夜死去。所以「等成功那天再说」是最贵的错觉。',
    action: { text: '今天就把那句话说出口', link: '/letters' }
  },
  titanic: {
    living: '救生艇不够，是提前就知道的选择。你人生里哪些「不够」，其实早就看见了却假装没看见？',
    action: { text: '面对那件事', link: '/advance-directives' }
  },
  challenger: {
    living: '事故前工程师曾提出警告但被忽略。你心里那个一直在响的警告是什么？',
    action: { text: '今天认真对待它', link: '/gratitude' }
  },
  chernobyl: {
    living: '灾难来自一句句「没事的」。你生活里那个「没事的」是哪一件？',
    action: { text: '今天去处理它', link: '/bucketlist' }
  },
  'black-death': {
    living: '黑死病带走了三分之一欧洲人，人类照样活了下来。这既是恐惧，也是安慰：我们能熬过去。今天想和谁一起熬？',
    action: { text: '联系那个人', link: '/letters' }
  },

  // ── 数字与概率 ──
  'every-second': {
    living: '每秒两个人离开。你今天的这一秒打算用来做什么？',
    action: { text: '安排今天最重要的一件事', link: '/bucketlist' }
  },
  'mosquito-deadliest': {
    living: '真正的危险往往不起眼。你的健康里，被你忽略的那个「不起眼」是什么？',
    action: { text: '约一次体检', link: '/bucketlist' }
  },
  'vending-machine': {
    living: '概率会骗人，恐惧也会。你为哪件几乎不可能的事，推迟了几乎必然会发生的一天？',
    action: { text: '把最重要的那件排进去', link: '/calendar' }
  },
  'plane-crash-stat': {
    living: '坐飞机比开车安全得多——可我们总在登机前想起爱的人。为什么非要等那一刻？',
    action: { text: '现在就告诉他们', link: '/letters' }
  },
  'birthday-effect': {
    living: '所谓生日效应，是我们在重要日子重新审视自己。你今年的生日，认真过了吗？',
    action: { text: '给自己一次生命之轮', link: '/practices/life-wheel' }
  },
  centenarian: {
    living: '活到一百岁是小概率。所以更该问的是：如果只到今天，我有没有活够？',
    action: { text: '写下我的墓志铭', link: '/advance-directives' }
  },
  'age-leading-causes': {
    living: '每个年龄段有各自的头号杀手。你现在这一段的头号风险，你处理了吗？',
    action: { text: '今天处理它', link: '/bucketlist' }
  },

  // ── 善终与选择 ──
  'natural-dying': {
    living: '自然死亡的过程可以被了解，也可以被安排。你和家人谈过「到时候」吗？',
    action: { text: '记下我的医疗意愿', link: '/advance-directives' }
  },
  hospice: {
    living: '安宁疗护不是放弃，是换一种照顾。你知道你所在城市有这项服务吗？为父母查一次。',
    action: { text: '这周查一次并告诉他们', link: '/letters' }
  },
  'advance-directive': {
    living: '生前预嘱的意义，是让爱你在的人不必替你做一个没有答案的决定。',
    action: { text: '现在就写下我的意愿', link: '/advance-directives' }
  },
  'brain-death-donation': {
    living: '器官捐献需要家人同意。所以关键动作只有一个：把意愿告诉家人，而不是只在 App 上点一下。',
    action: { text: '今天就告诉家人', link: '/letters' }
  },
  euthanasia: {
    living: '关于安乐死的争论很复杂，但有一件事没有争议：现在的每一天都值得被认真对待。',
    action: { text: '认真过今天', link: '/gratitude' }
  },
  reconciliation: {
    living: '与死亡和解的方式，是把没说完的话说完。你最想和解的那个人是谁？',
    action: { text: '写这封信', link: '/letters' }
  }
}

/**
 * 合并一条死法的出口信息。
 * @param {object} entry ways-to-die.json 里的条目
 * @returns {{living: string, action: {text:string, link:string}}}
 */
export function resolveWayExit(entry = {}) {
  const custom = WAY_LIVING[entry.id]
  const fallbackAction = CATEGORY_LIVING[entry.category] || CATEGORY_LIVING.numbers
  return {
    living:
      custom?.living ||
      (entry.prevention
        ? `${entry.prevention} —— 那么，今天你能为自己做的最小一件事是什么？`
        : '了解它，是为了不再被它安排。今天你想把时间还给谁？'),
    action: custom?.action || fallbackAction
  }
}
